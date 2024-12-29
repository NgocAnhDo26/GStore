import React, { useState, useEffect } from "react";
import Table from "../user-profile/table";
import Filter from "../user-profile/filter";
import axios from "axios";

const Products = () => {
    const columns = [
        { id: "1", label: "Game ID", width: "15%", sort: true },
        { id: "2", label: "Game Name", width: "15%" },
        { id: "3", label: "Profile_img_url", type: "image", width: "30%" },
        { id: "4", label: "Categories", width: "20%" },
        { id: "actions", label: "Detail" },
    ];

//    const filterColumns = [
//        { id: "id", label: "Game ID", width: "20%" },
//    ];

    const [query, setQuery] = useState({});
    const [collectionData, setCollectionData] = useState([]);
    const [tableRow, setTableRow] = useState([]);

    useEffect(() => {
        console.log("Query updated:", query);
        axios
            .get("http://localhost:1111/admin/product/", {
                params: query,
                withCredentials: true,
            })
            .then((res) => {
                console.log("API Response:", res.data);
                const { products } = res.data;

                if (products) {
                    const rows = products.map((game) => ({
                        1: game.id,
                        2: game.name,
                        3: game.profile_img.url,
                        4: game.categories.join(", "),
                        actions: [{ label: "View", link: "#" }] 
                    }));
                    setCollectionData(products);
                    setTableRow(rows);
                } else {
                    setTableRow([]);
                }
            })
            .catch((error) => {
                console.log("Error:", error.response?.data || error.message);
            });
    }, [query]);

    return (
        <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
            <div className="border-b text-2xl font-bold">Products List</div>
        {/* <Filter columns={filterColumns} query={query} setQuery={setQuery} /> */}
            {tableRow.length > 0 ? (
                <Table key={JSON.stringify(tableRow)} columns={columns} rows={tableRow} />
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
};

export default Products;
