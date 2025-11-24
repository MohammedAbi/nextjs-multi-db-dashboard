export const dynamic = "force-dynamic";

import { getPool } from "@/lib/db"; // <-- updated import
import DataTable from "@/components/DataTable";

export default async function StoreDashboard() {
  // 1️⃣ Get the SQL Server pool
  const db = await getPool();

  // 2️⃣ Run the query
  const result = await db.request().query(`
    SELECT 
      o.order_id,
      o.customer_id,
      o.order_date,
      os.name AS status,
      o.shipped_date,
      o.shipper_id,
      c.first_name,
      c.last_name
    FROM orders o
    LEFT JOIN customers c 
      ON o.customer_id = c.customer_id
    LEFT JOIN order_statuses os 
      ON os.order_status_id = o.status
    ORDER BY o.order_id DESC;
  `);

  // 3️⃣ Map rows to displayable data
  const orders = result.recordset.map((row: any) => ({
    order_id: row.order_id,
    first_name: row.first_name ?? "N/A",
    last_name: row.last_name ?? "N/A",
    order_date: row.order_date
      ? new Date(row.order_date).toLocaleDateString()
      : "N/A",
    shipped_date: row.shipped_date
      ? new Date(row.shipped_date).toLocaleDateString()
      : "N/A",
    status: row.status ?? "Unknown",
  }));

  // 4️⃣ Define table columns
  const columns = [
    { header: "Order ID", accessor: "order_id" },
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Order Date", accessor: "order_date" },
    { header: "Shipped Date", accessor: "shipped_date" },
    { header: "Status", accessor: "status" },
  ];

  // 5️⃣ Render
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-white">Customer Dashboard</h2>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
