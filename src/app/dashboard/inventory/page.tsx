export const dynamic = "force-dynamic";

import { getPool } from "@/lib/db"; // use helper to ensure connection
import DataTable from "@/components/DataTable";

export default async function InventoryDashboard() {
  const db = await getPool();

  const result = await db
    .request()
    .query(
      "SELECT TOP 100 product_id, name, quantity_in_stock, unit_price FROM products"
    );

  const products = result.recordset;

  const columns = [
    { header: "Product ID", accessor: "product_id" },
    { header: "Name", accessor: "name" },
    { header: "Stock", accessor: "quantity_in_stock" },
    { header: "Unit Price", accessor: "unit_price" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-white">Inventory Dashboard</h2>
      <DataTable columns={columns} data={products as any} />
    </div>
  );
}
