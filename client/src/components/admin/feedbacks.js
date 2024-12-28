import React, { useEffect, useState } from "react";
import Table from "../user-profile/table";
import axios from "axios";

const Feedbacks = () => {
    const columns = [
        { id: "1", label: "Email", width: "10%" },
        { id: "2", label: "Username", width: "10%" },
        { id: "3", label: "Content", width: "40%" },
        { id: "4", label: "Subject", width: "20%" ,sort: true},
        { id: "actions", label: "Detail" },
    ];

    const subjectMapping = {
        1: "General",
        2: "Complaint",
        3: "Support",
        4: "Suggestion",
    };

    const [rows, setRows] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [response, setResponse] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:1111/admin/feedback", { withCredentials: true })
            .then((res) => {
                const feedbackData = res.data.feedback;

                const formattedRows = feedbackData.map((item, index) => ({
                    1: item.email,
                    2: item.username,
                    3: item.content,
                    4: subjectMapping[item.type_id] || "Unknown",
                    actions: [
                        {
                            type: "button",
                            label: "Send",
                            onClick: () => openForm(item)
                        },
                    ],
                }));

                setRows(formattedRows);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    const openForm = (feedback) => {
        setSelectedFeedback(feedback);
        setIsFormVisible(true);
    };


    const closeForm = () => {
        setIsFormVisible(false);
        setResponse("");
        setSelectedFeedback(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sending response for feedback:", selectedFeedback);
        console.log("Response:", response);

        axios.post("http://localhost:1111/admin/feedback",
            {
                email: selectedFeedback.email,
                content: response,
            }
            , { withCredentials: true })
            .then((res) => {

                console.log("Data:", res.data)
            })
            .catch((error) => {
                console.error(error);
            });
        closeForm();
    };

    return (
        <div className="flex flex-col gap-6 rounded-xl border-solid bg-white p-8">
            <div className="border-b text-2xl font-bold">Feedbacks</div>
            {rows.length > 0 ? (
                <Table key={JSON.stringify(rows)} columns={columns} rows={rows} />
            ) : (
                <p>No data available.</p>
            )}

            {isFormVisible && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-10">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 z-20">
                        <h2 className="text-xl font-bold mb-4">Send Response</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="response" className="block text-sm font-medium text-gray-700">
                                    Response
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

export default Feedbacks;
