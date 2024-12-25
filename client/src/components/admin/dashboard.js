import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const Dashboard = () => {
    const chartRefs = useRef([]);
    const chartInstances = useRef([]);

    const chartsData = [
        {
            id: 1,
            type: "bar",
            labels: ["GTA", "LOL", "DOTA", "ROCKS", "GURA", "FB"],
            data: [12, 19, 3, 5, 2, 3],
            label: "Copies",
            title: "Top sales"
        },
        {
            id: 2,
            type: "line",
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            data: [3, 10, 5, 2, 20, 6, 4, 2, 4, 5, 30, 1],
            label: "Copies",
            title: "Monthly Sales"
        },
        {
            id: 3,
            type: "doughnut",
            labels: ["Action", "Horror", "Indie", "Adventure", "Sport"],
            data: [3, 10, 5, 2, 20],
            label: "Copies",
            title: "Categories sales"
        },
    ];

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
            {chartsData.map((chartData, index) => (
                <div key={chartData.id} className="flex flex-col items-center">
                {/* Chart Title */}
                <div className="text-lg font-semibold mb-4">{chartData.title}</div>
                {/* Chart Canvas */}
                <canvas ref={(el) => (chartRefs.current[index] = el)} ></canvas>
                </div>
            ))}
            </div>
    );
};

export default Dashboard;
