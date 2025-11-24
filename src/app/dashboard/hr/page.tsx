export const dynamic = "force-dynamic";

import { getPool } from "@/lib/db"; // Use a helper that ensures pool is connected
import DataTable from "@/components/DataTable";

export default async function HRDashboard() {
  // 1️⃣ Get the connected pool
  const db = await getPool();

  // 2️⃣ Run the query
  const result = await db.request().query(`
    SELECT TOP 100
      e.employee_id, 
      e.first_name, 
      e.last_name, 
      e.job_title,
      e.salary,
      m.first_name AS manager_name,
      o.city AS office_city,
      o.state AS office_state
    FROM employees e
    LEFT JOIN employees m ON e.reports_to = m.employee_id
    LEFT JOIN offices o ON e.office_id = o.office_id
  `);

  // 3️⃣ Map rows
  const employees = result.recordset.map((row: any) => ({
    employee_id: row.employee_id,
    first_name: row.first_name,
    last_name: row.last_name,
    job_title: row.job_title,
    salary: row.salary,
    manager_name: row.manager_name ?? "N/A",
    office_city: row.office_city ?? "N/A",
    office_state: row.office_state ?? "N/A",
  }));

  // 4️⃣ Define table columns
  const columns = [
    { header: "ID", accessor: "employee_id" },
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Job Title", accessor: "job_title" },
    { header: "Salary", accessor: "salary" },
    { header: "Manager", accessor: "manager_name" },
    { header: "Office City", accessor: "office_city" },
    { header: "Office State", accessor: "office_state" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-white">HR Dashboard</h2>
      <DataTable columns={columns} data={employees} />
    </div>
  );
}
