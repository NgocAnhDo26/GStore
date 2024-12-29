import React, { useState } from "react";

const Table = ({ columns, rows }) => {
  const [sortedRows, setSortedRows] = useState(rows);
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (columnId) => {
    const isAscending = sortConfig?.key === columnId && sortConfig.direction === "asc";
    const direction = isAscending ? "desc" : "asc";

    const sorted = [...rows].sort((a, b) => {
      if (a[columnId] < b[columnId]) return direction === "asc" ? -1 : 1;
      if (a[columnId] > b[columnId]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedRows(sorted);
    setSortConfig({ key: columnId, direction });
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                style={{ width: col.width }}
                className="px-6 py-3 cursor-pointer"
                onClick={() => col.sort && handleSort(col.id)}
              >
                {col.label}
                {col.sort && (
                  <span>
                    {sortConfig?.key === col.id
                      ? sortConfig.direction === "asc"
                        ? " 🔼"
                        : " 🔽"
                      : " ↕"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b bg-white hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.id} className="px-6 py-4">
                  {col.type === "image" ? (
                    <img
                      src={row[col.id]}
                      alt={col.label}
                      className="h-48 w-96 rounded-md object-contain"
                    />
                  ) : col.id === "actions" ? (
                    <div className="flex flex-row gap-2 justify-center items-center">
                      {row[col.id].map((action, actionIndex) => (
                        action.type === "button" ? (
                          <button
                            key={actionIndex}
                            onClick={action.onClick}
                            className={`font-medium ${action.color || 'bg-blue-600'} text-white py-2 px-4 rounded`}
                          >
                            {action.label}
                          </button>
                        ) : (
                          <a
                            key={actionIndex}
                            href={action.link}
                            className={`font-medium hover:underline ${action.color || 'text-blue-600'}`}
                          >
                            {action.label}
                          </a>
                        )
                      ))}
                    </div>
                  ) : (
                    row[col.id]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
