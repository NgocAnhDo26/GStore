import React from "react";

const Table = ({ columns, rows }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                style={{ width: col.width }}
                className="px-6 py-3"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b bg-white hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.id} className="px-6 py-4">
                  {col.type === "image" ? (
                    <img
                      src={row[col.id]}
                      alt={col.label}
                      className="h-48 w-96 rounded-md object-cover"
                    />
                  ) : col.id === "actions" ? (
                    <div className="flex flex-col">
                      {row[col.id].map((action, actionIndex) => (
                        <a
                          key={actionIndex}
                          href={action.link}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {action.label}
                        </a>
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
