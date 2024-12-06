import React, { useState } from "react";

const Filter = ({ columns }) => {

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
        console.log(filterQuery)
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.id}
                                style={{ width: col.width }}
                                className="px-6 py-3 relative"
                            >
                                <input
                                    type={col.type || "text"}
                                    id={col.id}
                                    className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
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
