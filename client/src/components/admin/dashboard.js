import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

const Dashboard = () => {
    const chartRefs = useRef([]);
    const chartInstances = useRef([]);
    const [duration, setDuration] = useState("month"); // State to manage the selected duration
    const [chartsData, setChartsData] = useState([
        {
            id: 1,
            type: "bar",
            labels: [],
            data: [],
            label: "Copies",
            title: "Top Sales Games",
        },
        {
            id: 3,
            type: "doughnut",
            labels: ["Action", "Horror", "Indie", "Adventure", "Sport"],
            data: [3, 10, 5, 2, 20],
            label: "Copies",
            title: "Categories Sales",
        },
    ]);

    const getdateStr = (duration) => {
        const today = new Date();
        let date;

        if (duration === "day") {
            date = today;
        } else if (duration === "month") {
            date = new Date(today.getFullYear(), today.getMonth(), 1);
        } else if (duration === "year") {
            date = new Date(today.getFullYear(), 0, 1);
        }

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const fetchSalesData = async () => {
        try {
            const dateStr = getdateStr(duration);

            const response = await axios.get("http://localhost:1111/admin/product/sale/", {
                params: { duration, dateStr },
                withCredentials: true,
            });

            const salesData = response.data;

            // Update charts data
            setChartsData((prevData) =>
                prevData.map((chart) => {
                    if (chart.id === 1) {
                        // Update first chart with saleByGameSortBySales
                        return {
                            ...chart,
                            labels: salesData.saleByGameSortBySales.map((item) => item.game),
                            data: salesData.saleByGameSortBySales.map((item) => item.sales),
                        };
                    } else if (chart.id === 3) {
                        // Update third chart with saleByCategorySortByRevenue
                        return {
                            ...chart,
                            labels: salesData.saleByCategorySortByRevenue.map((item) => item.category),
                            data: salesData.saleByCategorySortByRevenue.map((item) => item.revenue),
                        };
                    }
                    return chart;
                })
            );
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    };

    useEffect(() => {
        fetchSalesData();
    }, [duration]); // Refetch data when duration changes

    useEffect(() => {
        chartsData.forEach((chartData, index) => {
            const ctx = chartRefs.current[index].getContext("2d");

            // Destroy any existing chart instance for this index
            if (chartInstances.current[index]) {
                chartInstances.current[index].destroy();
            }

            // Create a new chart instance
            chartInstances.current[index] = new Chart(ctx, {
                type: chartData.type,
                data: {
                    labels: chartData.labels,
                    datasets: [
                        {
                            label: chartData.label,
                            data: chartData.data,
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        });

        // Cleanup to destroy all charts on component unmount
        return () => {
            chartInstances.current.forEach((chartInstance) => {
                if (chartInstance) {
                    chartInstance.destroy();
                }
            });
        };
    }, [chartsData]);

    return (
        <div className="flex flex-col gap-16">
            {/* Duration Buttons */}
            <div className="flex justify-center gap-4 mb-8">
                {["day", "month", "year"].map((option) => (
                    <button
                        key={option}
                        onClick={() => setDuration(option)}
                        className={`px-4 py-2 rounded ${
                            duration === option
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-black"
                        }`}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>

            {chartsData.map((chartData, index) => (
                <div key={chartData.id} className="flex flex-col items-center">
                    {/* Chart Title */}
                    <div className="text-lg font-semibold mb-4">{chartData.title}</div>
                    {/* Chart Canvas */}
                    <canvas ref={(el) => (chartRefs.current[index] = el)}></canvas>
                </div>
            ))}
        </div>
    );
};

export default Dashboard;
