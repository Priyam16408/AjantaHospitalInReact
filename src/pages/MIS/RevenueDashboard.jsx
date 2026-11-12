import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import "./index.css";
import MiniTrendGraph from "./MiniTrendGraph";
export default function RevenueDashboard() {
  const revenueData = [
    { month: "Jan", current: 50000, previous: 40000 },
    { month: "Feb", current: 60000, previous: 45000 },
    { month: "Mar", current: 55000, previous: 47000 },
    { month: "Apr", current: 70000, previous: 52000 },
  ];

  const patientDoctorData = [
    { doctor: "Dr. A", patients: 40, revenue: 25000 },
    { doctor: "Dr. B", patients: 30, revenue: 18000 },
    { doctor: "Dr. C", patients: 50, revenue: 32000 },
  ];

  const pieData = [
    { name: "OPD", value: 400 },
    { name: "IPD", value: 300 },
    { name: "Emergency", value: 300 },
    { name: "Lab", value: 200 },
  ];

  // const areaData = [
  //   { date: "Mon", value: 1000 },
  //   { date: "Tue", value: 1200 },
  //   { date: "Wed", value: 1400 },
  //   { date: "Thu", value: 1700 },
  //   { date: "Fri", value: 1600 },
  // ];
  const areaData = [
    { date: "Mon", current: 1000, previous: 800 },
    { date: "Tue", current: 1200, previous: 1000 },
    { date: "Wed", current: 1400, previous: 1300 },
    { date: "Thu", current: 1700, previous: 1400 },
    { date: "Fri", current: 1600, previous: 1550 },
  ];
  const radarData = [
    { subject: "Surgery", A: 120, B: 110 },
    { subject: "Consultation", A: 98, B: 130 },
    { subject: "Diagnostics", A: 86, B: 130 },
    { subject: "Emergency", A: 99, B: 100 },
    { subject: "Pharmacy", A: 150, B: 200 },
  ];

  const ageWiseData = [
    { ageGroup: "0-18", count: 120 },
    { ageGroup: "19-35", count: 200 },
    { ageGroup: "36-50", count: 150 },
    { ageGroup: "51+", count: 100 },
  ];

  const doctorPerformanceData = [
    { name: "Dr. A", efficiency: 90, satisfaction: 80 },
    { name: "Dr. B", efficiency: 70, satisfaction: 95 },
    { name: "Dr. C", efficiency: 85, satisfaction: 88 },
  ];

  const scatterData = [
    { x: 1, y: 4000 },
    { x: 2, y: 4800 },
    { x: 3, y: 5100 },
    { x: 4, y: 6200 },
  ];

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  const customScatterData = [
    { x: 10, y: 2000 },
    { x: 20, y: 3200 },
    { x: 30, y: 2500 },
    { x: 40, y: 4000 },
    { x: 50, y: 3500 },
  ];

  const stats = [
    {
      title: "TOTAL BUSINESS",
      value: 58,
      percentage: 3,
      isGroth: true,
      color: "text-warning",
      icon: "bi-briefcase-fill",
    },
    {
      title: "Deals in Freezer",
      value: 32,
      isGroth: false,
      percentage: 7,
      color: "text-danger",
      icon: "bi-snow",
    },
    {
      title: "Revenue Total ($)",
      value: 94,
      isGroth: true,
      percentage: 10,
      color: "text-info",
      icon: "bi-cash-stack",
    },
    {
      title: "Revenue Last Month ($)",
      value: 9556,
      isGroth: false,
      percentage: 2,
      color: "text-success",
      icon: "bi-bar-chart-line-fill",
      change: "-4.98%",
      changeColor: "text-danger",
      arrow: "bi-arrow-down",
    },
  ];

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
      <div className=" my-4">
        <div className="row ">
          {stats.map((stat, idx) => (
            // <div className="col-lg-3 col-md-6 col-12 align-items-center">
            //   <div className="mx-2 d-flex justify-content-between  card shadow-sm rounded-3">
            //     <div >
            //       <span className="text-secondary fw-medium font-size">Revenue Total ($):</span>
            //       <span className="ms-2 fw-bold text-primary font-size">94</span>
            //     </div>
            //     <div>
            //     <MiniTrendGraph value={9.4} change={4.98} positive={true} />
            //     </div>
            //   </div>
            // </div>
            <div className="col-md-3" key={idx} style={{ borderRadius: "5px" }}>
              <div className="card shadow-sm p-1">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="ml-3">
                    <strong className="text-muted font-size">
                      {stat.title}
                    </strong>
                    :
                    <strong className={`ml-3 fw-bold ${stat.color} font-size`}>
                      {stat.value}
                    </strong>
                  </div>
                  <i className={`bi ${stat.icon} fs-3 ${stat.color}`}></i>
                  <MiniTrendGraph
                    value={(stat?.value * stat?.percentage) / 100}
                    change={4.98}
                    positive={stat?.isGroth}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="row mx-1 ">
        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md ">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Revenue Comparison
            </h2>
            <BarChart width={350} height={250} data={revenueData} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="previous"
                fill="#8884d8"
                name="Previous Year"
                radius={[10, 10, 0, 0]} // top-left, top-right, bottom-right, bottom-left
              />
              <Bar
                dataKey="current"
                fill="#82ca9d"
                name="Current Year"
                radius={[10, 10, 0, 0]} // rounded at top only
              />
              {/* <Bar dataKey="previous" fill="#8884d8" name="Previous Year" />
          <Bar dataKey="current" fill="#82ca9d" name="Current Year" /> */}
            </BarChart>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md ">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Daily Revenue Trend
            </h2>
            <AreaChart width={350} height={250} data={areaData}>
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFBB28" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="previous"
                stroke="#FFBB28"
                fillOpacity={1}
                fill="url(#colorPrevious)"
                name="Previous Day"
              />
              <Area
                type="monotone"
                dataKey="current"
                stroke="#00C49F"
                fillOpacity={1}
                fill="url(#colorCurrent)"
                name="Current Day"
              />
            </AreaChart>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Custom Scatter Revenue Chart
            </h2>
            <ScatterChart
              width={350}
              height={250}
              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
            >
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis type="number" dataKey="x" name="Time" unit="min" />
              <YAxis type="number" dataKey="y" name="Revenue" unit="₹" />
              <ZAxis range={[100]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter
                name="Revenue Scatter"
                data={customScatterData}
                fill="#8884d8"
                shape="circle"
              />
            </ScatterChart>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Doctor Wise Revenue
            </h2>
            <LineChart width={350} height={250} data={patientDoctorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="doctor" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#ff8042" />
            </LineChart>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Patient Count per Doctor
            </h2>
            <BarChart
              width={350}
              height={250}
              data={patientDoctorData}
              barSize={20}
            >
              <XAxis dataKey="doctor" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="patients" fill="#ffc658" radius={[10, 10, 0, 0]} />
            </BarChart>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Departmental Revenue Share
            </h2>
            <PieChart width={350} height={250}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Performance Metrics
            </h2>
            <RadarChart
              cx={150}
              cy={125}
              outerRadius={90}
              width={350}
              height={250}
              data={radarData}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar
                name="Dept A"
                dataKey="A"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Radar
                name="Dept B"
                dataKey="B"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Patient Age Group
            </h2>
            <BarChart width={350} height={250} data={ageWiseData} barSize={20}>
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8dd1e1" radius={[7, 7, 0, 0]} />
            </BarChart>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Doctor Efficiency & Satisfaction
            </h2>
            <ComposedChart
              width={350}
              height={250}
              data={doctorPerformanceData}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="efficiency" barSize={20} fill="#8884d8" />
              <Line type="monotone" dataKey="satisfaction" stroke="#82ca9d" />
            </ComposedChart>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Scatter Revenue Points
            </h2>
            <ScatterChart width={350} height={250}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Time" />
              <YAxis type="number" dataKey="y" name="Revenue" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter
                name="Revenue Points"
                data={scatterData}
                fill="#ff8042"
              />
            </ScatterChart>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 bg-white p-1 rounded-2xl shadow-md col-span-full">
          <div className="revenue-graph-box">
            <h2 className="text-xl font-bold mb-2 revenue_heading">
              Cumulative Revenue Growth
            </h2>
            <LineChart width={1050} height={300} data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="previous" stroke="#8884d8" />
              <Line type="monotone" dataKey="current" stroke="#82ca9d" />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
}
