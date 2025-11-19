import { inv } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await inv.query("SELECT * FROM products LIMIT 100");
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
