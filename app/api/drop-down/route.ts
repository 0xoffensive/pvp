import { NextRequest, NextResponse } from 'next/server';
import pool from "@/lib/db"; // Import the database connection pool

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // "delivery" or "status"

  let query = '';
  if (type === 'delivery') query = 'SELECT pavadinimas FROM Pristatymai';
  else if (type === 'status') query = 'SELECT pavadinimas FROM Skelbimo_statusai';
  else return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const [rows] = await pool.query(query);
  return NextResponse.json(rows);
}