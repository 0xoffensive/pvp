import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const minPrice = parseFloat(url.searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(url.searchParams.get("maxPrice") || "99999");
    const statusas = url.searchParams.get("statusas");

    let query = `
      SELECT 
        s.*,
        i.pavadinimas as imone_pavadinimas,
        i.miestas as imone_miestas,
        i.tel_nr as imone_tel_nr,
        i.svetaine as imone_svetaine,
        i.adresas as imone_adresas,
        i.pastato_nr as imone_pastato_nr
      FROM Skelbimai s
      LEFT JOIN Imones i ON s.fk_Imoneid_Imone = i.id_Imone
      WHERE 1=1
    `;
    const params: any[] = [];

    // If specific ID is requested, filter by ID
    if (id) {
      query += " AND s.id_Skelbimas = ?";
      params.push(parseInt(id));
    } else {
      // Otherwise apply price and status filters
      query += " AND s.kaina >= ? AND s.kaina <= ?";
      params.push(minPrice, maxPrice);

      if (statusas) {
        query += " AND s.statusas = ?";
        params.push(statusas);
      }
    }

    query += " ORDER BY s.data DESC";

    const [skelbimai] = await pool.execute<RowDataPacket[]>(query, params);
    return NextResponse.json(skelbimai);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Nepavyko gauti skelbiimų" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("Session:", session);
    
    if (!session?.user) {
      console.error("No session found");
      return NextResponse.json(
        { error: "Privaloma prisijungti" },
        { status: 401 }
      );
    }

    if ((session.user as any).role !== "atstovas") {
      return NextResponse.json(
        { error: "Tik pardavėjai gali kurti skelbimus" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      pavadinimas,
      aprasymas,
      kaina,
      min_kiekis,
      vieta,
      amzius,
      aukstis,
      plotis,
      lotyniskas_pav,
      tipas,
      kilme,
      atstumas,
      pristatymo_budas,
      statusas,
    } = body;

    if (!pavadinimas || !kaina) {
      return NextResponse.json(
        { error: "Pavadinimas ir kaina privalomi" },
        { status: 400 }
      );
    }

    // Get user's company ID from database
    const userId = (session.user as any).id || session.user.email;
    console.log("User ID for company lookup:", userId);
    
    const [imones] = await pool.execute<RowDataPacket[]>(
      "SELECT id_Imone FROM Imones WHERE fk_Vartotojasid_Vartotojas = ?",
      [userId]
    );

    const imoneId = imones.length > 0 ? imones[0].id_Imone : null;

    if (!imoneId) {
      return NextResponse.json(
        { error: "Nėra sukurtos jūsų įmonės. Susisiekite su administratoriumi." },
        { status: 400 }
      );
    }

    await pool.execute(
      `INSERT INTO Skelbimai (
        pavadinimas, aprasymas, kaina, min_kiekis, vieta, 
        amzius, aukstis, plotis, lotyniskas_pav, tipas, kilme, 
        atstumas, pristatymo_budas, statusas, data, fk_Imoneid_Imone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        pavadinimas,
        aprasymas || null,
        kaina,
        min_kiekis || 1,
        vieta || null,
        amzius || null,
        aukstis || null,
        plotis || null,
        lotyniskas_pav || null,
        tipas || null,
        kilme || null,
        atstumas || null,
        pristatymo_budas || "pristatymas",
        statusas || "galimas",
        imoneId,
      ]
    );

    return NextResponse.json(
      { message: "Skelbimas sėkmingai sukurtas!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Serverio klaida: " + (error as any).message },
      { status: 500 }
    );
  }
}