import React, { useState, useEffect } from "react";
import Table from "./table";
import Filter from "./filter";
import axios from "axios";

const PurchaseHistory = () => {
  const columns = [
    { id: "1", label: "Time", width: "15%", sort: true },
    { id: "2", label: "ID", width: "15%" },
    { id: "3", label: "Game Name", width: "25%" },
    { id: "4", label: "Total", width: "20%", sort: true },
    { id: "5", label: "Status", width: "20%", sort: true },
    { id: "actions", label: "Detail" },
  ];

  const filterColumns = [
    { id: "id", label: "ID", width: "20%" },
    { id: "min", label: "Min", width: "20%" },
    { id: "max", label: "Max", width: "20%" },
    { id: "from", label: "From", type: "date", width: "20%" },
    { id: "to", label: "To", type: "date", width: "20%" },
  ];

  const [query, setQuery] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [tableRow, setTableRow] = useState([]);

  useEffect(() => {
    console.log("Query updated:", query);
    axios
      .get("http://localhost:1111/api/profile/history", {
        params: query,
        withCredentials: true,
      })
      .then((res) => {
        console.log("API Response:", res.data);
        setHistoryData(res.data.history || []);
      })
      .catch((error) => {
        console.log("Error:", error.response?.data || error.message);
      });
  }, [query]); 

  useEffect(() => {
    if (historyData.length > 0) {
      const rows = historyData.map((order) => ({
        1: new Date(order.created_at).toLocaleDateString(),
        2: order.order_id,
        3: order.products.map(product => product.product_name).join(", "),
        4: order.total_price,
        5: order.status,
        actions: [{ label: "View", link: "#" }],
      }));
      setTableRow(rows);
    }
  }, [historyData]);
  
  return (
    <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
      <div className="border-b text-2xl font-bold">Purchase History</div>
      <Filter columns={filterColumns} query={query} setQuery={setQuery} />
      {tableRow.length > 0 ? (
        <Table key={JSON.stringify(tableRow)} columns={columns} rows={tableRow} />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default PurchaseHistory;
