export const dynamic = "force-dynamic";

import { getPool } from "@/lib/db";
import DataTable from "@/components/DataTable";

interface Order {
  order_id: number;
  first_name: string;
  last_name: string;
  order_date: string;
  shipped_date: string;
  status: string;
  comments: string;
}

interface StatusCounts {
  total: number;
  inProcess: number;
  completed: number;
  cancelled: number;
}

export default async function OrdersDashboard() {
  let orders: Order[] = [];
  let counts: StatusCounts = {
    total: 0,
    inProcess: 0,
    completed: 0,
    cancelled: 0,
  };

  try {
    const db = await getPool();

    // Fetch latest 100 orders
    const result = await db.request().query(`
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
      ORDER BY o.order_date DESC
      OFFSET 0 ROWS FETCH NEXT 100 ROWS ONLY
    `);

    orders = (result.recordset as any[]).map((row) => ({
      order_id: row.order_id,
      first_name: row.first_name,
      last_name: row.last_name,
      order_date: row.order_date
        ? new Date(row.order_date).toLocaleDateString()
        : "",
      shipped_date: row.shipped_date
        ? new Date(row.shipped_date).toLocaleDateString()
        : "",
      status: row.status ?? "Unknown",
      comments: row.comments ?? "",
    }));

    // Fetch counts grouped by status
    const countResult = await db.request().query(`
      SELECT 
        os.name AS status,
        COUNT(*) AS count
      FROM orders o
      LEFT JOIN order_statuses os ON o.status = os.order_status_id
      GROUP BY os.name
    `);

    countResult.recordset.forEach((row: any) => {
      const name = row.status;
      const count = Number(row.count);
      counts.total += count;
      if (name === "Processed" || name === "Delivered")
        counts.completed += count;
      else if (name === "Shipped" || name === "In Process")
        counts.inProcess += count;
      else if (name === "Cancelled") counts.cancelled += count;
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }

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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Orders Dashboard</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-800 text-white rounded-lg">
          <div>Total Orders</div>
          <div className="text-2xl font-bold">{counts.total}</div>
        </div>
        <div className="p-4 bg-yellow-600 text-white rounded-lg">
          <div>In Process</div>
          <div className="text-2xl font-bold">{counts.inProcess}</div>
        </div>
        <div className="p-4 bg-green-600 text-white rounded-lg">
          <div>Completed</div>
          <div className="text-2xl font-bold">{counts.completed}</div>
        </div>
        <div className="p-4 bg-red-600 text-white rounded-lg">
          <div>Cancelled</div>
          <div className="text-2xl font-bold">{counts.cancelled}</div>
        </div>
      </div>

      {/* Orders table */}
      {orders.length > 0 ? (
        <DataTable columns={columns} data={orders} />
      ) : (
        <div className="text-red-500">No orders found.</div>
      )}
    </div>
  );
}
