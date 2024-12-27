import React, { useEffect, useRef } from "react";
import Table from "../user-profile/table";
import Filter from "../user-profile/filter";

const Orders = () => {
    const columns = [
        { id: "1", label: "Time", width: "15%", sort: true },
        { id: "2", label: "Game ID", width: "15%" },
        { id: "3", label: "Game Name", width: "30%" },
        { id: "4", label: "Game Key", width: "20%" },
        { id: "actions", label: "Detail" },
    ];

    const filterColumns = [
        { id: "id", label: "Game Name", width: "20%" },
        { id: "name", label: "Min", width: "20%" },
        { id: "gmail", label: "Max", width: "20%" },
        { id: "createDay", label: "From", type: "date", width: "20%" },
        { id: "to", label: "To", type: "date", width: "20%" },
    ];

    const rows = [
        {
            1: "01/01/2025",
            2: "0001",
            3: "LOL",
            4: "abc-xyz-123",
            actions: [{ label: "View", link: "#" },{ label: "View", link: "#" }],
        },
        {
            1: "02/01/2025",
            2: "0002",
            3: "DoTa",
            4: "abc-xyz-234",
            actions: [{ label: "View", link: "#" }],
        },
        {
            1: "03/01/2025",
            2: "0003",
            3: "TFT",
            4: "abc-xyz-456",
            actions: [{ label: "View", link: "#" }],
        },
    ];

    return (
        <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
            <div className="border-b text-2xl font-bold">Orders List (cho nay dang luoi nen chua biet gan j)</div>
            <Filter columns={filterColumns} />
            <Table columns={columns} rows={rows} />
        </div>
    );
};

export default Orders