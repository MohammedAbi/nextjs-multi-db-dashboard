export const dynamic = "force-dynamic";
import { store } from "@/lib/db";
import DataTable from "@/components/DataTable";

export default async function OrdersDashboard() {
  const [rows] = await store.query(`
    SELECT 
      o.order_id,
      c.first_name,
      c.last_name,
      o.order_date,
      o.shipped_date,
      os.name AS status,
      o.comments
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.customer_id
    LEFT JOIN order_statuses os ON o.status = os.order_status_id
    LIMIT 100
  `);

  const orders = (rows as any[]).map((row) => ({
    order_id: row.order_id,
    first_name: row.first_name,
    last_name: row.last_name,
    order_date: row.order_date
      ? new Date(row.order_date).toLocaleDateString()
      : "",
    shipped_date: row.shipped_date
      ? new Date(row.shipped_date).toLocaleDateString()
      : "",
    status: row.status ?? "",
    comments: row.comments ?? "",
  }));

  const columns = [
    { header: "Order ID", accessor: "order_id" },
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Order Date", accessor: "order_date" },
    { header: "Shipped Date", accessor: "shipped_date" },
    { header: "Status", accessor: "status" },
    { header: "Comments", accessor: "comments" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-white">Orders Dashboard</h2>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
