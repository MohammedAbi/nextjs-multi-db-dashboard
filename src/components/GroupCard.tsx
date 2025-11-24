"use client";

type Detail = { label: string; value: string | number };

export default function GroupCard({
  title,
  total,
  details,
}: {
  title: string | number;
  total: string | number;
  details: Detail[];
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:bg-gray-750 transition">
      <h2 className="text-lg font-semibold text-gray-300">{title}</h2>
      <p className="text-4xl font-bold text-white mt-2">{total}</p>
      {details.length > 0 && (
        <ul className="mt-4 text-gray-300">
          {details.map((item) => (
            <li
              key={`${title}-${item.label}`}
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
