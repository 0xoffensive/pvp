import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  try {
    const { vardas, pavarde, e_pastas, slapyvardis, slaptazodis, role } =
      await request.json();

    // Validation
    if (!vardas || !pavarde || !e_pastas || !slapyvardis || !slaptazodis) {
      return NextResponse.json(
        { error: "Visi laukai yra privalomi." },
        { status: 400 }
      );
    }

    if (slaptazodis.length < 6) {
      return NextResponse.json(
        { error: "Slaptažodis turi būti bent 6 simbolių." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existingEmail] = await pool.execute<RowDataPacket[]>(
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
    const [existingUsername] = await pool.execute<RowDataPacket[]>(
      "SELECT id_Vartotojas FROM Vartotojai WHERE slapyvardis = ?",
      [slapyvardis]
    );

    if (existingUsername.length > 0) {
      return NextResponse.json(
        { error: "Šis slapyvardis jau užimtas." },
        { status: 409 }
      );
    }

    // Hash password and insert
    const hashedPassword = await bcrypt.hash(slaptazodis, 10);

    // role defaults to 'vartotojas', busena defaults to 'aktyvus'
    const userRole = role === "atstovas" ? "atstovas" : "vartotojas";

    await pool.execute(
      "INSERT INTO Vartotojai (vardas, pavarde, e_pastas, slapyvardis, slaptazodis, role, busena) VALUES (?, ?, ?, ?, ?, ?, 'aktyvus')",
      [vardas, pavarde, e_pastas, slapyvardis, hashedPassword, userRole]
    );

    return NextResponse.json(
      { message: "Registracija sėkminga!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Serverio klaida. Bandykite vėliau." },
      { status: 500 }
    );
  }
}