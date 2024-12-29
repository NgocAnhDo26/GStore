import React, { useState, useEffect } from "react";
import Table from "./table";
import Filter from "./filter";
import axios from "axios";

const GameCollection = () => {
  const columns = [
    { id: "1", label: "Time", width: "20%", sort: true },
    { id: "2", label: "Game ID", width: "20%" },
    { id: "3", label: "Game Name", width: "60%" },
    { id: "actions", label: "Detail" },
  ];

  const filterColumns = [
    { id: "keyword", label: "Game Name", width: "20%" },
    { id: "from", label: "From", type: "date", width: "20%" },
    { id: "to", label: "To", type: "date", width: "20%" },
  ];

  const [query, setQuery] = useState({});
  const [collectionData, setCollectionData] = useState([]);
  const [tableRow, setTableRow] = useState([]);

  useEffect(() => {
    console.log("Query updated:", query);
    axios
      .get("http://localhost:1111/api/profile/collection", {
        params: query,
        withCredentials: true,
      })
      .then((res) => {
        console.log("API Response:", res.data);
        setCollectionData(res.data.games || []);
      })
      .catch((error) => {
        console.log("Error:", error.response?.data || error.message);
      });
  }, [query]); 

  useEffect(() => {
    if (collectionData.length > 0) {
      const rows = collectionData.map((game) => ({
        1: new Date(game.create_time).toLocaleDateString(),
        2: game.id,
        3: game.name,
        actions: [{ label: "View", link: `products/${game.id}` }],
      }));
      setTableRow(rows); 
    }
    else
    {
      setTableRow([])
    }
  }, [collectionData]);

  return (
    <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
      <div className="border-b text-2xl font-bold">Game Collection</div>
      <Filter columns={filterColumns} query={query} setQuery={setQuery} />
      {tableRow.length > 0 ? (
        <Table key={JSON.stringify(tableRow)} columns={columns} rows={tableRow} />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default GameCollection;
