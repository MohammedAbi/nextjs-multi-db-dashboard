export default function DataTable({
  columns,
  data,
}: {
  columns: { header: string; accessor: string }[];
  data: any[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-300"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-800 transition-colors">
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className="px-4 py-2 text-sm text-gray-200"
                >
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
