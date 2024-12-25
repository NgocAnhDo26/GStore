import React from "react";
import Table from "./table";
import Filter from "./filter";

const Wishlist = () => {
  const columns = [
    { id: "1", label: "Image", width: "50%", type: "image" },
    { id: "2", label: "Game Name", width: "20%" },
    { id: "3", label: "Price", width: "10%",sort: true },
    { id: "actions", width: "20%", label: "Actions" },
  ];

  const filterColumns = [
    { id: "gameName", label: "Game Name", width: "60%" },
    { id: "from", label: "From", type: "date", width: "20%" },
    { id: "to", label: "To", type: "date", width: "20%" },
  ];

  const rows = [
    {
      1: "img/dota.jpg",
      2: "Dota",
      3: "999.99$",
      actions: [
        { label: "Add to cart", link: "#" },
        { label: "Delete", color: "text-red-600", link: "#" }, 
      ],
    },
    {
      1: "img/lol.jpeg",
      2: "LOL",
      3: "9999.99$",
      actions: [
        { label: "Add to cart", link: "#" },
        { label: "Delete", color: "text-red-600", link: "#" },
      ],
    },
    {
      1: "img/tft.jpg",
      2: "TFT",
      3: "99999.99$",
      actions: [
        { label: "Add to cart", link: "#" },
        { label: "Delete", color: "text-red-600", link: "#" }, 
      ],
    },
];

  return (
    <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
      <div className="border-b text-2xl font-bold">Wishlist</div>
      <Filter columns={filterColumns} />
      <Table columns={columns} rows={rows} />
    </div>
  );
};

export default Wishlist;