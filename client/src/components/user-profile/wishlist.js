import React, { useState, useEffect } from "react";
import Table from "./table";
import Filter from "./filter";
import axios from "axios";

const MyWishlist = () => {
  const columns = [
    { id: "1", label: "Image", width: "30%", type: 'image' },
    { id: "2", label: "Game Name", width: "30%" },
    { id: "3", label: "Price Sale", width: "20%", sort: true },
    { id: "actions", label: "Actions", width: "20%" },
  ];

  const filterColumns = [
    { id: "name", label: "Game Name", width: "60%" },
    { id: "min", label: "Min", width: "20%" },
    { id: "max", label: "Max", width: "20%" },
  ];

  const [query, setQuery] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [tableRow, setTableRow] = useState([]);

  useEffect(() => {
    console.log("Query updated:", query);
    axios
      .get("http://localhost:1111/api/profile/wishlist", {
        params: query,
        withCredentials: true,
      })
      .then((res) => {
        console.log("API Response:", res.data);
        setWishlistData(res.data.wishlist || []);
      })
      .catch((error) => {
        console.error("Error:", error.response?.data || error.message);
        setWishlistData([]);
      });
  }, [query]);

  useEffect(() => {
    if (wishlistData.length > 0) {
      const rows = wishlistData.map((item) => ({
        1: item.product_profile_image.url,
        2: item.product_name,
        3: item.product_price_sale,
        actions: [{ label: "View", link: `product/${item.product_id}` }],
      }));
      setTableRow(rows);
    } else {
      setTableRow([]);
    }
  }, [wishlistData]);

  return (
    <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
      <div className="border-b text-2xl font-bold">My Wishlist</div>
      <Filter columns={filterColumns} query={query} setQuery={setQuery} />
      {tableRow.length > 0 ? (
        <Table key={JSON.stringify(tableRow)} columns={columns} rows={tableRow} />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default MyWishlist;
