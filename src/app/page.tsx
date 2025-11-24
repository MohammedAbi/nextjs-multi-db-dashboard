export const dynamic = "force-dynamic";
import DashboardLayout from "./dashboard/layout";
import { getPool } from "@/lib/db";
import GroupCard from "@/components/GroupCard";

export default async function Home() {
  const db = await getPool();

  // Employees
  const employeeResult = await db
    .request()
    .query(
      "SELECT COUNT(*) AS count, SUM(salary) AS total, AVG(salary) AS avg FROM employees"
    );
  const employeeCount = employeeResult.recordset[0].count;
  const totalSalary = employeeResult.recordset[0].total ?? 0;
  const avgSalary = Math.round(employeeResult.recordset[0].avg ?? 0);

  // Products
  const productResult = await db.request().query(`
    SELECT 
      COUNT(*) AS count,
      SUM(quantity_in_stock) AS totalStock,
      AVG(unit_price) AS avgPrice,
      SUM(quantity_in_stock * unit_price) AS totalValue,
      SUM(CASE WHEN quantity_in_stock > 0 THEN 1 ELSE 0 END) AS inStock,
      SUM(CASE WHEN quantity_in_stock = 0 THEN 1 ELSE 0 END) AS outOfStock
    FROM products
  `);
  const productData = productResult.recordset[0];
  const productCount = productData.count;
  const inStockCount = productData.inStock;
  const outOfStockCount = productData.outOfStock;
  const totalStock = productData.totalStock ?? 0;
  const avgPrice = Math.round(productData.avgPrice ?? 0);
  const totalValue = productData.totalValue ?? 0;

  // Orders
  const orderQuery = await db.request().query(`
    SELECT 
      o.order_id,
      os.name AS status
    FROM orders o
    LEFT JOIN order_statuses os ON os.order_status_id = o.status
  `);

  const orders = orderQuery.recordset;
  const statusCounts = orders.reduce(
    (acc: Record<string, number>, order) => {
      const status = order.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const orderCount = orders.length;

  // Invoices
  const invoiceResult = await db.request().query(`
    SELECT 
      COUNT(*) AS count,
      SUM(CASE WHEN payment_total >= invoice_total THEN 1 ELSE 0 END) AS paid,
      SUM(CASE WHEN payment_total < invoice_total THEN 1 ELSE 0 END) AS unpaid,
      SUM(payment_total) AS totalPayments
    FROM invoices
  `);
  const invoiceData = invoiceResult.recordset[0];
  const invoiceCount = invoiceData.count;
  const paidInvoices = invoiceData.paid;
  const unpaidInvoices = invoiceData.unpaid;
  const totalPayments = invoiceData.totalPayments ?? 0;

  // Customers
  const customerResult = await db.request().query(`
    SELECT 
      COUNT(*) AS count,
      SUM(CASE WHEN points > 0 THEN 1 ELSE 0 END) AS withPoints,
      SUM(CASE WHEN phone IS NULL OR phone = '' THEN 1 ELSE 0 END) AS noPhone,
      AVG(points) AS avgPoints
    FROM customers
  `);
  const customerData = customerResult.recordset[0];
  const customerCount = customerData.count;
  const customersWithPoints = customerData.withPoints;
  const customersWithoutPhone = customerData.noPhone;
  const avgPoints = Math.round(customerData.avgPoints ?? 0);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto text-gray-200">
        <h1 className="text-4xl font-bold mb-10 text-white">
          Multi-Database Dashboard (Azure SQL)
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GroupCard
            title="Employees"
            total={employeeCount}
            details={[
              { label: "Total Salary", value: `$${totalSalary}` },
              { label: "Average Salary", value: `$${avgSalary}` },
            ]}
          />
          <GroupCard
            title="Products"
            total={productCount}
            details={[
              { label: "In Stock", value: inStockCount },
              { label: "Out of Stock", value: outOfStockCount },
              { label: "Total Qty", value: totalStock },
              { label: "Avg Price", value: `$${avgPrice}` },
              { label: "Inventory Value", value: `$${totalValue}` },
            ]}
          />
          <GroupCard
            title="Orders"
            total={orderCount}
            details={Object.entries(statusCounts).map(([name, count]) => ({
              label: name,
              value: count,
            }))}
          />
          <GroupCard
            title="Invoices"
            total={invoiceCount}
            details={[
              { label: "Paid", value: paidInvoices },
              { label: "Unpaid", value: unpaidInvoices },
              { label: "Total Payments", value: `$${totalPayments}` },
            ]}
          />
          <GroupCard
            title="Customers"
            total={customerCount}
            details={[
              { label: "With Points", value: customersWithPoints },
              { label: "No Phone", value: customersWithoutPhone },
              { label: "Avg Points", value: avgPoints },
            ]}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
