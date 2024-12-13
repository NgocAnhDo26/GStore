import React from "react";
import Table from "./table";
import Filter from "./filter";

const PurchaseHistory = () => {
  const columns = [
    { id: "1", label: "Time", width: "15%", sort: true },
    { id: "2", label: "ID", width: "15%" },
    { id: "3", label: "Game ID", width: "25%" },
    { id: "4", label: "Total", width: "20%", sort: true },
    { id: "5", label: "Status", width: "20%" },
    { id: "actions", label: "Detail" },
  ];

  const filterColumns = [
    { id: "id", label: "ID", width: "20%" },
    { id: "min", label: "Min", width: "20%" },
    { id: "max", label: "Max", width: "20%" },
    { id: "from", label: "From", type: "date", width: "20%" },
    { id: "to", label: "To", type: "date", width: "20%" },
  ];

  const rows = [
    {
      1: "01/01/2025",
      2: "0001",
      3: "0001, 0002",
      4: "$2999",
      5: "ok",
      actions: [{ label: "View", link: "#" }],
    },
    {
      1: "02/01/2025",
      2: "0002",
      3: "0003, 0004",
      4: "$1999",
      5: "pending",
      actions: [{ label: "View", link: "#" }],
    },
    {
      1: "03/01/2025",
      2: "0003",
      3: "0005",
      4: "$99",
      5: "ok",
      actions: [{ label: "View", link: "#" }],
    },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
      <div className="border-b text-2xl font-bold">Purchase History</div>
      <Filter columns={filterColumns} />
      <Table columns={columns} rows={rows} />
    </div>
  );
};

export default PurchaseHistory;
