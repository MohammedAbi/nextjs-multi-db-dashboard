export const dynamic = "force-dynamic";

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await query("SELECT TOP 100 * FROM products"); // SQL Server syntax

    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
