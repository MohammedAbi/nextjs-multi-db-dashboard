export const dynamic = "force-dynamic";

import { hr } from "@/lib/db";
import DataTable from "@/components/DataTable";
import { RowDataPacket } from "mysql2";

export default async function HRDashboard() {
  const [rows] = await hr.query<RowDataPacket[]>(`
    SELECT 
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
    LIMIT 100
  `);

  const employees = (rows as any[]).map((row) => ({
    employee_id: row.employee_id,
    first_name: row.first_name,
    last_name: row.last_name,
    job_title: row.job_title,
    salary: row.salary,
    manager_name: row.manager_name,
    office_city: row.office_city,
    office_state: row.office_state,
  }));

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
