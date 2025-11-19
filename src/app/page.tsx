import DashboardLayout from "./dashboard/layout";
import { hr, inv, invoice, store } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// Detail type for GroupCard
type Detail = { label: string; value: string | number };

// GroupCard component
function GroupCard({
  title,
  total,
  details,
}: {
  title: string;
  total: string | number;
  details: Detail[];
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:bg-gray-750 transition">
      <h2 className="text-lg font-semibold text-gray-300">{title}</h2>
      <p className="text-4xl font-bold text-white mt-2">{total}</p>
      {details.length > 0 && (
        <ul className="mt-4 text-gray-300">
          {details.map((item, index) => (
            <li
              key={`${title}-${item.label}-${index}`}
              className="flex justify-between py-1 border-b border-gray-700 last:border-b-0"
            >
              <span>{item.label}</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Home dashboard server component
export default async function Home() {
  // --- Employees ---
  const [employeeRows] = await hr.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM employees"
  );
  const [totalSalaryRows] = await hr.query<RowDataPacket[]>(
    "SELECT SUM(salary) as total FROM employees"
  );
  const [avgSalaryRows] = await hr.query<RowDataPacket[]>(
    "SELECT AVG(salary) as avg FROM employees"
  );

  const employeeCount = employeeRows[0].count as number;
  const totalSalary = (totalSalaryRows[0].total as number) ?? 0;
  const avgSalary = Math.round((avgSalaryRows[0].avg as number) ?? 0);

  // --- Orders ---
  const [orderRows] = await store.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM orders"
  );
  const [ordersInProcessRows] = await store.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM orders WHERE status = 1"
  );
  const [ordersCompletedRows] = await store.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM orders WHERE status = 2"
  );
  const [ordersCancelledRows] = await store.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM orders WHERE status = 3"
  );

  const orderCount = orderRows[0].count as number;
  const ordersInProcess = ordersInProcessRows[0].count as number;
  const ordersCompleted = ordersCompletedRows[0].count as number;
  const ordersCancelled = ordersCancelledRows[0].count as number;

  // --- Invoices ---
  const [invoiceRows] = await invoice.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM invoices"
  );
  const [paidInvoicesRows] = await invoice.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM invoices WHERE payment_total >= invoice_total"
  );
  const [unpaidInvoicesRows] = await invoice.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM invoices WHERE payment_total < invoice_total"
  );
  const [totalPaymentsRows] = await invoice.query<RowDataPacket[]>(
    "SELECT SUM(payment_total) as total FROM invoices"
  );

  const invoiceCount = invoiceRows[0].count as number;
  const paidInvoices = paidInvoicesRows[0].count as number;
  const unpaidInvoices = unpaidInvoicesRows[0].count as number;
  const totalPayments = (totalPaymentsRows[0].total as number) ?? 0;

  // --- Products (most useful) ---
  const [productRows] = await inv.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM products"
  );
  const [inStockRows] = await inv.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM products WHERE quantity_in_stock > 0"
  );
  const [outOfStockRows] = await inv.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM products WHERE quantity_in_stock = 0"
  );
  const [totalStockRows] = await inv.query<RowDataPacket[]>(
    "SELECT SUM(quantity_in_stock) as total FROM products"
  );
  const [avgPriceRows] = await inv.query<RowDataPacket[]>(
    "SELECT AVG(unit_price) as avg FROM products"
  );
  const [totalValueRows] = await inv.query<RowDataPacket[]>(
    "SELECT SUM(quantity_in_stock * unit_price) as total FROM products"
  );

  const productCount = productRows[0].count as number;
  const inStockCount = inStockRows[0].count as number;
  const outOfStockCount = outOfStockRows[0].count as number;
  const totalStock = (totalStockRows[0].total as number) ?? 0;
  const avgPrice = Math.round((avgPriceRows[0].avg as number) ?? 0);
  const totalValue = (totalValueRows[0].total as number) ?? 0;

  // --- Customers ---
  const [customerRows] = await store.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM customers"
  );
  const [customersWithPointsRows] = await store.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM customers WHERE points > 0"
  );
  const [customersWithoutPhoneRows] = await store.query<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM customers WHERE phone IS NULL OR phone = ''"
  );
  const [avgPointsRows] = await store.query<RowDataPacket[]>(
    "SELECT AVG(points) as avg FROM customers"
  );

  const customerCount = customerRows[0].count as number;
  const customersWithPoints = customersWithPointsRows[0].count as number;
  const customersWithoutPhone = customersWithoutPhoneRows[0].count as number;
  const avgPoints = Math.round((avgPointsRows[0].avg as number) ?? 0);

  // --- Render Dashboard ---
  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto text-gray-200">
        <h1 className="text-4xl font-bold mb-10 text-white">
          Multi-Database Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GroupCard
            key="employees-card"
            title="Employees"
            total={employeeCount}
            details={[
              { label: "Total Salary", value: `$${totalSalary}` },
              { label: "Average Salary", value: `$${avgSalary}` },
            ]}
          />
          <GroupCard
            key="products-card"
            title="Products"
            total={productCount}
            details={[
              { label: "In Stock", value: inStockCount },
              { label: "Out of Stock", value: outOfStockCount },
              { label: "Total Stock Quantity", value: totalStock },
              { label: "Average Price", value: `$${avgPrice}` },
              { label: "Total Inventory Value", value: `$${totalValue}` },
            ]}
          />
          <GroupCard
            key="orders-card"
            title="Orders"
            total={orderCount}
            details={[
              { label: "In Process", value: ordersInProcess },
              { label: "Completed", value: ordersCompleted },
              { label: "Cancelled", value: ordersCancelled },
            ]}
          />
          <GroupCard
            key="invoices-card"
            title="Invoices"
            total={invoiceCount}
            details={[
              { label: "Paid", value: paidInvoices },
              { label: "Unpaid", value: unpaidInvoices },
              { label: "Total Payments", value: `$${totalPayments}` },
            ]}
          />
          <GroupCard
            key="customers-card"
            title="Customers"
            total={customerCount}
            details={[
              { label: "With Points", value: customersWithPoints },
              { label: "Without Phone", value: customersWithoutPhone },
              { label: "Average Points", value: avgPoints },
            ]}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
