import React, { useEffect, useState } from "react";
import Table from "../user-profile/table";
import axios from "axios";

const KeyGames = () => {
    const columns = [
        { id: "1", label: "Id", width: "10%", sort: true },
        { id: "2", label: "Game Name", width: "40%" },
        { id: "3", label: "In stock", width: "20%", sort: true },
        { id: "4", label: "Keys", width: "40%" },
        { id: "actions", label: "Detail" },
    ];

    const [rows, setRows] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [response, setResponse] = useState("");
    const [selectedGame, setSelectedGame] = useState(null);

    const fetchGameKeys = () => {
        axios.get("http://localhost:1111/admin/game-key", { withCredentials: true })
            .then((res) => {
                const response = res.data;
                console.log(response);

                const formattedRows = response.map((item) => ({
                    1: item.id,
                    2: item.name,
                    3: item.in_stock,
                    4: item.keys.map((key) => (
                        <span
                            key={key.id}
                            className={`block ${key.is_used ? "text-red-500" : "text-green-500"}`}
                        >
                            {key.key_code}
                        </span>
                    )),
                    actions: [
                        {
                            type: "button",
                            label: "Add",
                            onClick: () => openForm(item)
                        },
                    ],
                }));

                setRows(formattedRows);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchGameKeys();
    }, []);

    const openForm = (Game) => {
        setSelectedGame(Game);
        setIsFormVisible(true);
    };

    const closeForm = () => {
        setIsFormVisible(false);
        setResponse("");
        setSelectedGame(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sending response:", selectedGame);
        console.log("Response:", response);

        axios.post("http://localhost:1111/admin/game-key", {
            productId: selectedGame.id,
            keyCode: response,
        }, { withCredentials: true })
            .then((res) => {
                console.log("Data:", res.data);
                fetchGameKeys();
            })
            .catch((error) => {
                console.error(error);
            });

        closeForm();
    };

    return (
        <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
            <div className="border-b text-2xl font-bold">Keygames</div>
            {rows.length > 0 ? (
                <Table key={JSON.stringify(rows)} columns={columns} rows={rows} />
            ) : (
                <p>No data available.</p>
            )}

            {isFormVisible && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-10">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 z-20">
                        <h2 className="text-xl font-bold mb-4">Add key game</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="response" className="block text-sm font-medium text-gray-700">
                                    Key
                                </label>
                                <input
                                    type="text"
                                    id="response"
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                                    Send
                                </button>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="bg-gray-300 text-black px-4 py-2 rounded-md"
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeyGames;
