import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function POST(request: Request) {
  const connection = await pool.getConnection();

  try {
    const {
      vardas,
      pavarde,
      e_pastas,
      slapyvardis,
      slaptazodis,
      role,
      // Imone fields (only when role === "atstovas")
      imone,
    } = await request.json();

    // Validation — user fields
    if (!vardas || !pavarde || !e_pastas || !slapyvardis || !slaptazodis) {
      return NextResponse.json(
        { error: "Visi vartotojo laukai yra privalomi." },
        { status: 400 }
      );
    }

    if (slaptazodis.length < 6) {
      return NextResponse.json(
        { error: "Slaptažodis turi būti bent 6 simbolių." },
        { status: 400 }
      );
    }

    // Validation — imone fields (only for atstovas)
    if (role === "atstovas") {
      if (!imone?.pavadinimas || !imone?.imones_kodas) {
        return NextResponse.json(
          { error: "Įmonės pavadinimas ir įmonės kodas yra privalomi." },
          { status: 400 }
        );
      }
    }

    // Check if email already exists
    const [existingEmail] = await connection.execute<RowDataPacket[]>(
      "SELECT id_Vartotojas FROM Vartotojai WHERE e_pastas = ?",
      [e_pastas]
    );

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: "Vartotojas su šiuo el. paštu jau egzistuoja." },
        { status: 409 }
      );
    }

    // Check if username already exists
    const [existingUsername] = await connection.execute<RowDataPacket[]>(
      "SELECT id_Vartotojas FROM Vartotojai WHERE slapyvardis = ?",
      [slapyvardis]
    );

    if (existingUsername.length > 0) {
      return NextResponse.json(
        { error: "Šis slapyvardis jau užimtas." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(slaptazodis, 10);
    const userRole = role === "atstovas" ? "atstovas" : "vartotojas";

    // Use a transaction — if imone creation fails, user creation is rolled back too
    await connection.beginTransaction();

    try {
      // 1. Create user
      const [userResult] = await connection.execute<ResultSetHeader>(
        "INSERT INTO Vartotojai (vardas, pavarde, e_pastas, slapyvardis, slaptazodis, role, busena) VALUES (?, ?, ?, ?, ?, ?, 'aktyvus')",
        [vardas, pavarde, e_pastas, slapyvardis, hashedPassword, userRole]
      );

      const userId = userResult.insertId;

      // 2. If atstovas, create the imone linked to this user
      if (role === "atstovas" && imone) {
        await connection.execute(
          "INSERT INTO Imones (pavadinimas, miestas, pasto_kodas, adresas, pastato_nr, tel_nr, imones_kodas, pvm_kodas, svetaine, fk_Vartotojasid_Vartotojas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            imone.pavadinimas,
            imone.miestas || null,
            imone.pasto_kodas || null,
            imone.adresas || null,
            imone.pastato_nr || null,
            imone.tel_nr || null,
            imone.imones_kodas,
            imone.pvm_kodas || null,
            imone.svetaine || null,
            userId,
          ]
        );
      }

      await connection.commit();

      return NextResponse.json(
        { message: "Registracija sėkminga!" },
        { status: 201 }
      );
    } catch (txError) {
      await connection.rollback();
      throw txError;
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Serverio klaida. Bandykite vėliau." },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}