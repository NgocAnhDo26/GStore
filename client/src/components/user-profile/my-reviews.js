import React from "react";
import Table from "./table";
import Filter from "./filter";

const MyReviews = () => {
  const columns = [
    { id: "1", label: "Time", width: "15%", sort: true },
    { id: "2", label: "Game Name", width: "30%" },
    { id: "3", label: "Content", width: "55%" },
    { id: "actions", label: "Detail" },
  ];

  const filterColumns = [
    { id: "content", label: "Content", width: "60%" },
    { id: "from", label: "From", type: "date", width: "20%" },
    { id: "to", label: "To", type: "date", width: "20%" },
  ];

  const rows = [
    {
      1: "01/01/2025",
      2: "LOL",
      3: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi ipsum numquam officia nihil minima hic mollitia saepe quia cupiditate? Doloribus et odit at? Dolorum, ratione modi? Quidem excepturi placeat itaque?",
      actions: [{ label: "View", link: "#" }],
    },
    {
      1: "02/01/2025",
      2: "DOTA",
      3: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi ipsum numquam officia nihil minima hic mollitia saepe quia cupiditate? Doloribus et odit at? Dolorum, ratione modi? Quidem excepturi placeat itaque?",
      actions: [{ label: "View", link: "#" }],
    },
    {
      1: "03/01/2025",
      2: "TFT",
      3: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi ipsum numquam officia nihil minima hic mollitia saepe quia cupiditate? Doloribus et odit at? Dolorum, ratione modi? Quidem excepturi placeat itaque?",
      actions: [{ label: "View", link: "#" }],
    },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
      <div className="border-b text-2xl font-bold">My Reviews</div>
      <Filter columns={filterColumns} />
      <Table columns={columns} rows={rows} />
    </div>
  );
};

export default MyReviews;
