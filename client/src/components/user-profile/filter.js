import React, { useState } from "react";

const Filter = ({ columns, query, setQuery }) => {
  const [filterQuery, setFilterQuery] = useState(
    columns.reduce((acc, col) => {
      acc[col.id] = "";
      return acc;
    }, {})
  );

  const handleBlur = (id, value) => {
    setFilterQuery((prev) => ({
      ...prev,
      [id]: value,
    }));
    console.log(`Column: ${id}, Filter value: ${value}`);
    console.log(filterQuery);

    // Update the query object
    setQuery((prevQuery) => ({
      ...prevQuery,
      [id]: value,
    }));
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
                className="relative px-6 py-3"
              >
                <input
                  type={col.type || "text"}
                  id={col.id}
                  className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                  placeholder=" "
                  value={filterQuery[col.id]}
                  onChange={(e) =>
                    setFilterQuery({
                      ...filterQuery,
                      [col.id]: e.target.value,
                    })
                  }
                  onBlur={(e) => handleBlur(col.id, e.target.value)}
                />
                <label
                  htmlFor={col.id}
                  className="absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
                >
                  {col.label}
                </label>
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default Filter;
