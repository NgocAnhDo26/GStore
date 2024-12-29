import React, { useState, useEffect } from "react";
import Table from "./table";
import Filter from "./filter";
import axios from "axios";

const MyReviews = () => {
  const columns = [
    { id: "1", label: "Time", width: "15%", sort: true },
    { id: "2", label: "Game Name", width: "30%" },
    { id: "3", label: "Rating", width: "10%" },
    { id: "4", label: "Content", width: "55%" },
    { id: "actions", label: "Detail" },
  ];

  const filterColumns = [
    { id: "content", label: "Content", width: "60%" },
    { id: "from", label: "From", type: "date", width: "20%" },
    { id: "to", label: "To", type: "date", width: "20%" },
  ];

  const [query, setQuery] = useState({});
  const [reviewData, setReviewData] = useState([]);
  const [tableRow, setTableRow] = useState([]);

  useEffect(() => {
    console.log("Query updated:", query);
    axios
      .get("http://localhost:1111/api/profile/review", {
        params: query,
        withCredentials: true,
      })
      .then((res) => {
        console.log("API Response:", res.data);
        setReviewData(res.data.review || []); 
      })
      .catch((error) => {
        console.error("Error:", error.response?.data || error.message);
        setReviewData([]); 
      });
  }, [query]);

  useEffect(() => {
    if (reviewData.length > 0) {
      const rows = reviewData.map((review) => ({
        1: new Date(review.create_time).toLocaleDateString(), 
        2: review.product.name,
        3: review.rating,
        4: review.content, 
        actions: [{ label: "View", link: `product/${review.product_id}` }], 
      }));
      setTableRow(rows); 
    } else {
      setTableRow([]); 
    }
  }, [reviewData]);

  return (
    <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
      <div className="border-b text-2xl font-bold">My Reviews</div>
      <Filter columns={filterColumns} query={query} setQuery={setQuery} />
      {tableRow.length > 0 ? (
        <Table key={JSON.stringify(tableRow)} columns={columns} rows={tableRow} />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default MyReviews;
