import React, { useEffect, useState } from "react";
import { Line, Bar, Pie, Bubble, Scatter, Radar } from "react-chartjs-2";

export default function GraphSetModal({ chart, handleChangeModal }) {
  const [inputs, setInputs] = useState(chart);

  useEffect(() => {
    handleChangeModal(inputs);
  }, [inputs]);

  //   const handleChange = () => {
  //     console.log("SDfsdf",inputs)
  //     setInputs((prev) => ({
  //         ...prev,
  //         key: Math.random(), // Forces a re-render
  //         options: {
  //             ...prev.options,
  //             indexAxis: prev?.options?.indexAxis === "x" ? "y" : "x",
  //             responsive: true,
  //             maintainAspectRatio: false
  //         }
  //     }));
  // };

  const [renderCount, setRenderCount] = useState(0);

  const handleChange = () => {
    // console.log("SDfsdf", inputs);
    setInputs((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        indexAxis: prev.options?.indexAxis === "y" ? "x" : "y", // Toggle the axis
        maintainAspectRatio: false, // Prevent shrinking
        responsive: true, // Ensure it adjusts properly
        scales: {
          x: {
            ...prev.options?.scales?.x,
          },
          y: {
            ...prev.options?.scales?.y,
          },
        },
      },
    }));
    setRenderCount((prev) => prev + 1); // Increment counter to trigger re-render
  };

  return (
    <>
      <span
        className="background-theme-color text-white"
        style={{
          pointerEvents: "auto",
          float: "right",
          position: "relative",
          borderRadius: "5px",
          padding: "0px 4px",
          cursor: "pointer",
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={handleChange}
      >
        {" "}
        Reverse Axis{" "}
      </span>
      <div
        key={renderCount}
        style={{ width: "100%", height: "300px" }}
        className="p-4 bg-gray-800 rounded-lg shadow-md drag-handle text-lg font-bold mb-2"
      >
        {inputs?.type === "Bar" && (
          <Bar data={inputs?.data} options={inputs?.options} />
        )}
        {inputs?.type === "Line" && (
          <Line data={inputs?.data} options={inputs?.options} />
        )}
        {inputs?.type === "Pie" && (
          <Pie data={inputs?.data} options={inputs?.options} />
        )}
        {inputs?.type === "Scatter" && (
          <Scatter data={inputs?.data} options={inputs?.options} />
        )}
        {inputs?.type === "Bubble" && (
          <Bubble data={inputs?.data} options={inputs?.options} />
        )}
      </div>
    </>
  );
}
