import React, { useState, useEffect } from "react";
import Table from "../user-profile/table";
import axios from "axios";

const Products = () => {
  const columns = [
    { id: "1", label: "Game ID", width: "15%", sort: true },
    { id: "2", label: "Game Name", width: "15%" },
    { id: "3", label: "Profile_img_url", type: "image", width: "30%" },
    { id: "4", label: "Categories", width: "20%" },
    { id: "actions", label: "Detail" },
  ];

  const [query, setQuery] = useState({});
  const [collectionData, setCollectionData] = useState([]);
  const [tableRow, setTableRow] = useState([]);
  const [productFormData, setProductFormData] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            actions: [
              { label: "View", link: `/product/${game.id}` },
              {
                type: "button",
                label: "View Details",
                onClick: () => openForm(game.id),
              },
            ],
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

  const openForm = (productId) => {
    axios
      .get(`http://localhost:1111/admin/product/${productId}`, { withCredentials: true })
      .then((res) => {
        console.log("Product Details Response:", res.data);
        setProductFormData(res.data); 
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.log("Error fetching product details:", error.response?.data || error.message);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductFormData(null); 
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
      <div className="border-b text-2xl font-bold">Products List</div>
      {tableRow.length > 0 ? (
        <Table key={JSON.stringify(tableRow)} columns={columns} rows={tableRow} />
      ) : (
        <p>No data available.</p>
      )}

      {isModalOpen && productFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <form>
              <div className="flex flex-col gap-4">
                <div className="flex">
                  <label className="w-1/4 font-semibold">Game Name:</label>
                  <input
                    type="text"
                    value={productFormData.name}
                    readOnly
                    className="border p-2 w-3/4"
                  />
                </div>
                <div className="flex">
                  <label className="w-1/4 font-semibold">Description:</label>
                  <textarea
                    value={productFormData.description}
                    readOnly
                    className="border p-2 w-3/4"
                  />
                </div>
                <div className="flex">
                  <label className="w-1/4 font-semibold">Price:</label>
                  <input
                    type="text"
                    value={productFormData.price_sale}
                    readOnly
                    className="border p-2 w-3/4"
                  />
                </div>
                <div className="flex">
                  <label className="w-1/4 font-semibold">Categories:</label>
                  <input
                    type="text"
                    value={productFormData.categories?.join(", ")}
                    readOnly
                    className="border p-2 w-3/4"
                  />
                </div>
                <div className="flex">
                  <label className="w-1/4 font-semibold">Image URL:</label>
                  <input
                    type="text"
                    value={productFormData.profile_img?.url}
                    readOnly
                    className="border p-2 w-3/4"
                  />
                </div>
                <div className="flex">
                  <label className="w-1/4 font-semibold">Publisher:</label>
                  <input
                    type="text"
                    value={productFormData.publisher}
                    readOnly
                    className="border p-2 w-3/4"
                  />
                </div>
                <div className="flex">
                  <label className="w-1/4 font-semibold">Average Rating:</label>
                  <input
                    type="text"
                    value={productFormData.averageRating}
                    readOnly
                    className="border p-2 w-3/4"
                  />
                </div>
              </div>
            </form>
            <button
              onClick={closeModal}
              className="mt-4 text-white bg-red-500 px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
