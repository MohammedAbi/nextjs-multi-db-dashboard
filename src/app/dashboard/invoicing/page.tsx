export const dynamic = "force-dynamic";
import { invoice } from "@/lib/db";
import DataTable from "@/components/DataTable";

export default async function InvoicingDashboard() {
  const [rows] = await invoice.query(`
    SELECT 
      i.invoice_id, 
      c.name AS client_name, 
      i.invoice_total, 
      i.payment_total, 
      i.invoice_date, 
      i.due_date
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.client_id
    LIMIT 100
  `);

  // Convert Date fields to readable strings
  const invoices = (rows as any[]).map((row) => ({
    invoice_id: row.invoice_id,
    client_name: row.client_name,
    invoice_total: row.invoice_total,
    payment_total: row.payment_total,
    invoice_date: row.invoice_date
      ? new Date(row.invoice_date).toLocaleDateString()
      : "",
    due_date: row.due_date ? new Date(row.due_date).toLocaleDateString() : "",
  }));

  const columns = [
    { header: "Invoice ID", accessor: "invoice_id" },
    { header: "Client", accessor: "client_name" },
    { header: "Invoice Total", accessor: "invoice_total" },
    { header: "Paid", accessor: "payment_total" },
    { header: "Invoice Date", accessor: "invoice_date" },
    { header: "Due Date", accessor: "due_date" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-white">Invoice Dashboard</h2>
      <DataTable columns={columns} data={invoices} />
    </div>
  );
}
