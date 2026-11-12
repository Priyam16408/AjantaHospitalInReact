import React, { useEffect, useState } from "react";
import { Line, Bar, Pie, Bubble, Scatter, Radar } from "react-chartjs-2";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import GraphSetModal from "./GraphSetModal";
import Modal from "../../components/modalComponent/Modal";
import { notify } from "../../utils/utils";
import { getDashboardDataTYPEID, HIMSDashboardGraphical } from "../../networkServices/dashboardAPI";
import { graphDataInitialvalue } from "../../utils/constant";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/formComponent/DatePicker";
import moment from "moment";
import DashboardTable from "../../components/UI/customTable/DashboardTable/DashboardTable";
import MultiSelectComp from "../../components/formComponent/MultiSelectComp";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
);

const ResponsiveGridLayout = WidthProvider(Responsive);



export default function Dashboard() {
    const { VITE_DATE_FORMAT } = import.meta.env;
    const today = new Date();
    // const plugins = {
    //     legend: {
    //         display: false, // ✅ This hides the "Sales" legend
    //     },
    // }
    const initialValues = { fromDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()), toDate: today, Type: [], isDraggable: false };

    const colsize = window.innerWidth >= 1200 ? 4 : window.innerWidth >= 800 ? 6 : 12;
    const [values, setValues] = useState(initialValues);
    const [layout, setLayout] = useState([
        // { i: "instances", x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
        // { i: "notifications1", x: 3, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "notifications2", x: 7, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "durations1", x: 0, y: 2, w: 6, h: 2, minW: 4, minH: 2 },
        // { i: "durations2", x: 6, y: 2, w: 6, h: 2, minW: 4, minH: 2 },
        // { i: "pieChart", x: 0, y: 2, w: 2, h: 2, minW: 4, minH: 2 },
        // { i: "horizontalBar", x: 2, y: 4, w: 6, h: 2, minW: 4, minH: 2 },
        // { i: "verticalBar", x: 0, y: 6, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "stackedBar", x: 4, y: 6, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "groupedBar", x: 8, y: 6, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "areaChart", x: 0, y: 8, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "lineChart", x: 4, y: 8, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "multiaxisLine", x: 4, y: 8, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "doughnutChart", x: 8, y: 8, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "polarArea", x: 0, y: 10, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "radarChart", x: 4, y: 10, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "scatterChart", x: 8, y: 10, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "bubbleChart", x: 0, y: 12, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "multitypeChart", x: 4, y: 12, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "chartRef", x: 8, y: 12, w: 4, h: 2, minW: 3, minH: 2 },
        // { i: "gradientChart", x: 0, y: 14, w: 4, h: 2, minW: 3, minH: 2 },
    ]);

    const [t] = useTranslation()




    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };



    // const [chartConfigs, setChartConfig] = useState(graphDataInitialvalue)
    const [chartConfigs, setChartConfig] = useState([])


    const [modalData, setModalData] = useState({})

    const groupedData = (respdata) => {

        const resp = respdata.reduce((acc, item) => {
            const key = item.GraphTypeID;

            // If the group doesn't exist, initialize it
            if (!acc[key]) {
                acc[key] = [];
            }

            // Push the item to the appropriate group
            acc[key].push(item);

            return acc;
        }, {});
        return resp
    }
    function getColorsBasedOnLength(length) {
        return Array.from({ length }, (_, index) => {
            // Create a smooth gradient with lighter colors by increasing lightness in HSL
            return `hsl(${(index / length) * 360}, 100%, 70%)`; // Lightness set to 75% for light colors
        });
    }


    // const truncatedLabels = values?.Type.map((label) => label?.title?.length > 30 ? label?.title.slice(0, 30) + "..." : label?.title);

    const truncatedLabels = (list) => {
        return list?.map((label) => label?.length > 20 ? label?.slice(0, 20) + "..." : label);
    }

    const getGraphData = async () => {
        let apiResp = await HIMSDashboardGraphical({
            "fromDate": moment(values?.fromDate).format("YYYY-MM-DD") || "2025-01-01",
            "isAdmin": 1,
            "toDate": moment(values?.toDate).format("YYYY-MM-DD") || "2025-01-01",
        })
        if (apiResp?.success) {
            const respdata = groupedData(apiResp?.data)
            let singleGraphdata = []
            Object.keys(respdata)?.map((key, ind) => {
                let labels = []
                let datasets = []
                respdata[key]?.map((val, index) => {
                    if (val?.GraphType === "Bar chart" || val?.GraphType === "Stacked Bar Chart") {
                        labels.push(val?.TextField)
                        datasets.push(val?.ValueField)
                        if (respdata[key]?.length - 1 === index) {
                            const singledata = {
                                id: val?.GraphTypeID,
                                key: `${index}_verticalBar_${ind}`,
                                isActive: true,
                                // title: "Vertical Bar Chart",
                                title: `${val?.TypeName}`,
                                order: val?.OrderBy,
                                name: "Bar chart",
                                type: "Bar",
                                data: {
                                    labels: truncatedLabels(labels),
                                    datasets: [
                                        {
                                            label: "Sales",
                                            data: datasets,
                                            backgroundColor: "rgba(75,192,192,0.6)",
                                            barThickness: 6,
                                        },
                                    ],
                                },
                                options: {
                                    // responsive: true,
                                    // maintainAspectRatio: false,
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                // Show full label in tooltip
                                                title: (tooltipItems) => {
                                                    const index = tooltipItems[0]?.dataIndex;
                                                    return labels[index];
                                                }
                                            }
                                        },
                                        legend: {
                                            display: false
                                        }
                                    }
                                }
                            }
                            singleGraphdata = [...singleGraphdata, singledata]
                            // setLayout((val) => ([
                            //     ...val,
                            //     {
                            //         i: `${index}_verticalBar_${ind}`,
                            //         x: (index % 3) * 4,       // 0, 4, 8 -> 3 per row
                            //         y: Math.floor(index / 3) * 2, // 0, 0, 0 -> first row; 2, 2, 2 -> second row
                            //         w: 4,
                            //         h: 2,
                            //         minW: 1,
                            //         minH: 1,
                            //     }
                            // ]))
                        }
                    } else if (val?.GraphType === "Line chart") {
                        labels.push(val?.TextField)
                        datasets.push(val?.ValueField)
                        if (respdata[key]?.length - 1 === index) {
                            const singledata = {
                                id: val?.GraphTypeID,
                                key: `${index}_Linechart_${ind}`,
                                isActive: true,
                                // title: "Vertical Bar Chart",
                                title: `${val?.TypeName}`,
                                order: val?.OrderBy,
                                name: "Line chart",
                                type: "Line",
                                data: {
                                    labels: labels,
                                    datasets: [
                                        {
                                            label: "Webhook",
                                            data: datasets,
                                            borderColor: "#FF6384",
                                            fill: true,
                                            backgroundColor: "rgba(255,99,132,0.2)",
                                        },
                                    ],
                                },
                                options: {
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false, // ✅ This hides the "Sales" legend
                                        },
                                    },
                                }
                            }
                            singleGraphdata = [...singleGraphdata, singledata]
                            // setLayout((val) => ([
                            //     ...val,
                            //     {
                            //         i: `${index}_Linechart_${ind}`,
                            //         x: (index % 3) * 4,       // 0, 4, 8 -> 3 per row
                            //         y: Math.floor(index / 3) * 2, // 0, 0, 0 -> first row; 2, 2, 2 -> second row
                            //         w: 4,
                            //         h: 2,
                            //         minW: 1,
                            //         minH: 1,
                            //     }
                            // ]))
                        }
                    } else if (val?.GraphType === "Pie chart" || val?.GraphType === "Polar Area chart") {

                        labels.push(val?.TextField)
                        datasets.push(val?.ValueField)
                        if (respdata[key]?.length - 1 === index) {
                            const singledata = {
                                id: val?.GraphTypeID,
                                key: `${index}_Piechart_${ind}`,
                                isActive: true,
                                // title: "Vertical Bar Chart",
                                title: `${val?.TypeName}`,
                                order: val?.OrderBy,
                                name: "Pie chart",
                                type: "Pie",
                                data: {
                                    labels: labels,
                                    datasets: [
                                        {
                                            data: datasets,
                                            backgroundColor: getColorsBasedOnLength(datasets?.length ? datasets?.length : 0),
                                        },
                                    ],
                                },
                                options: {
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false, // ✅ This hides the "Sales" legend
                                        },
                                    },
                                    layout: {
                                        // padding: 10,
                                        padding: {
                                            left: 60,
                                            right: 0,
                                            top: 0,
                                            bottom: 50
                                        }
                                    },
                                    radius: colsize === 4 ? "100%" : colsize === 6 ? "60%" : "80%",   // overall size of the pie
                                },

                            }
                            singleGraphdata = [...singleGraphdata, singledata]
                            // setLayout((val) => ([
                            //     ...val,
                            //     {
                            //         i: `${index}_Piechart_${ind}`,
                            //         x: (index % 3) * 4,       // 0, 4, 8 -> 3 per row
                            //         y: Math.floor(index / 3) * 2, // 0, 0, 0 -> first row; 2, 2, 2 -> second row
                            //         w: 4,
                            //         h: 2,
                            //         minW: 1,
                            //         minH: 1,
                            //     }
                            // ]))
                        }

                    } else if (val?.GraphType === "Curve Line chart") {
                        labels.push(val?.TextField)
                        datasets.push(val?.ValueField)
                        if (respdata[key]?.length - 1 === index) {
                            const singledata = {
                                id: val?.GraphTypeID,
                                key: `${index}_Line_${ind}`,
                                isActive: true,
                                // title: "Vertical Bar Chart",
                                title: `${val?.TypeName}`,
                                order: val?.OrderBy,
                                name: "Line chart",
                                type: "Line",
                                data: {
                                    labels: labels,
                                    datasets: [
                                        {
                                            label: "Sales",
                                            data: datasets,
                                            fill: false,
                                            borderColor: "#36A2EB",
                                            tension: 0.4, // 👈 smooth curve (0 = sharp, 1 = very smooth)
                                            pointBackgroundColor: "#FF6384",
                                            backgroundColor: "rgba(54, 162, 235, 0.2)",
                                        },
                                    ],
                                },
                                options: {
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false, // ✅ This hides the "Sales" legend
                                        },
                                    }
                                },
                            }
                            singleGraphdata = [...singleGraphdata, singledata]
                            // setLayout((val) => ([
                            //     ...val,
                            //     {
                            //         i: `${index}_Line_${ind}`,
                            //         x: (index % 3) * 4,       // 0, 4, 8 -> 3 per row
                            //         y: Math.floor(index / 3) * 2, // 0, 0, 0 -> first row; 2, 2, 2 -> second row
                            //         w: 4,
                            //         h: 2,
                            //         minW: 1,
                            //         minH: 1,
                            //     }
                            // ]))
                        }
                    }
                })

            })
            setChartConfig(singleGraphdata)
            setValues((val) => ({ ...val, Type: singleGraphdata?.map((val) => ({ ...val, name: val?.title, code: val?.id })) }))
        }
    }

    useEffect(() => {
        getGraphData()
    }, [])



    const handleSaveGraph = (data) => {
        // chartConfigs.map(item => item.id === data.id ? updatedObject : item);
        const updatedData = chartConfigs?.map((val) => {
            if (data?.id === val.id) {
                val = data
            }
            return val
        })
        setChartConfig(updatedData)
        setValues((val) => ({ ...val, Type: updatedData?.map((val) => ({ ...val, name: val?.title, code: val?.id })) }))
        notify("Graph Updated Successfully")
        setModalData({ visible: false })
    }
    const handleChangeModal = (data) => {
        setModalData((val) => ({ ...val, modalData: data }))
    }

    const handleOpenModal = (chart,e) => {
        
        e.stopPropagation()
        setModalData({
            visible: true,
            width: "60vw",
            label: chart?.title,
            buttonName: "Save",
            CallAPI: handleSaveGraph,
            // footer: <></>,
            modalData: chart,
            Component: (
                <GraphSetModal
                    chart={chart}
                    handleChangeModal={handleChangeModal}
                    handleSaveGraph={handleSaveGraph}

                />
            ),
        });
    }

    const handleSeeDetails = async (chart) => {
        const response = await getDashboardDataTYPEID({
            type: chart?.id,
            fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
            tAbid: 1,
            toDate: moment(values.toDate).format("YYYY-MM-DD"),
        });
        const Header = `${t(chart?.title)}`;
        const TimeDuration = `From Date : ${moment(values.fromDate).format("DD-MMM-YYYY")} - To Date : ${moment(values.toDate).format("DD-MMM-YYYY")}`;
        setModalData({
            visible: true,
            width: "90vw",
            label: chart?.title,
            footer: <></>,
            modalData: chart,
            Component: (
                <DashboardTable
                    tbody={response?.data ?? []}
                    Header={Header}
                    TimeDuration={TimeDuration}
                />
            ),
        });
    }

    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues((val) => ({ ...val, [name]: selectedOptions }));
    };


    useEffect(() => {
        const data = values?.Type?.map((val, index) => {
            return {
                i: val.key,
                x: (index % 3) * colsize,       // 0, 4, 8 -> 3 per row
                y: Math.floor(index / 3) * 2, // 0, 0, 0 -> first row; 2, 2, 2 -> second row
                w: colsize,
                h: colsize === 4 ? 1.8 : colsize === 6 ? 2 : window.innerWidth < 500 ? 1.7 : window.innerWidth < 600 ? 2.1 : 2.8,
                minW: 1,
                minH: 1,
            }
        })
        setLayout(data)
    }, [values?.Type?.length, colsize])
    return (<>
        <div className="card py-2">
            {/* <div className="card-header">
                <h5 className="card-title">Dashboard</h5>
            </div> */}
            <Heading title={t("Dashboard")} isBreadcrumb={false}> </Heading>

            <div className="row pt-2 px-2" >
                <DatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    id="fromDate"
                    name="fromDate"
                    value={values.fromDate}
                    handleChange={handleChange}
                    lable={t("From Date")}
                    placeholder={VITE_DATE_FORMAT}
                />
                <DatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    id="toDate"
                    name="toDate"
                    value={values.toDate}
                    handleChange={handleChange}
                    lable={t("To Date")}
                    placeholder={VITE_DATE_FORMAT}
                />
                <div className="col-xl-4 col-md-3 col-sm-6 col-6 mb-2">
                    <button className="btn btn-primary" onClick={getGraphData}>{t("Search")}</button>
                </div>

                {/* <div className="row"> */}
                <div className="col-xl-2 col-md-3 col-sm-6 col-6 d-flex justify-content-end align-items-center">
                    <input
                        type="checkbox"
                        name="isDraggable"
                        checked={values?.isDraggable}
                        id="isDraggable"
                        onChange={(e) => handleChange({ target: { name: "isDraggable", value: e.target.checked } })}
                        style={{ position: "relative", top: "-2px" }}
                    />
                    <label className="ml-2" htmlFor="isDraggable" >
                        {t("Is Draggable")}
                    </label>
                </div>

                {/* </div> */}
                <MultiSelectComp
                    respclass="col-xl-2 col-md-3 col-sm-12 col-12"
                    name="Type"
                    id="Type"
                    placeholderName={t("Filter Type")}
                    isRemoveTemplate={true}
                    dynamicOptions={chartConfigs?.map((item) => ({ ...item, code: item?.id, name: item?.title }))}
                    handleChange={handleMultiSelectChange}
                    value={values?.Type}
                />

            </div>

            {(values?.Type?.length > 0 && layout?.length > 0) &&
                <ResponsiveGridLayout
                    className="layout background-theme-color"
                    layouts={{ lg: layout }}
                    // layouts={layout}
                    breakpoints={{ lg: 1200 }}
                    cols={{ lg: 12 }}
                    rowHeight={150}
                    rowWidth={500}
                    draggableHandle=".drag-handle"
                    isDraggable={values?.isDraggable}
                    isResizable={true}
                    compactType="vertical"
                    autoSize={true} // Automatically adjust item height
                    onLayoutChange={(newLayout) => setLayout(newLayout)}
                >

                    {values?.Type?.sort((a, b) => a.order - b.order)?.map((chart) => (
                        <div key={chart.key} className="p-4 bg-gray-800 rounded-lg shadow-md drag-handle " onMouseDown={(e) => e.stopPropagation()} >
                            
                            <strong className="text-lg font-bold mb-2" >{chart.title}</strong>
                            <p style={{ pointerEvents: "auto", cursor: "pointer", position: "relative",marginBottom: "20px" }}
                                onMouseDown={(e) => e.stopPropagation()}>
                                <span onClick={(e) => { handleOpenModal(chart,e) }} style={{ position: "absolute", right: "0",borderRadius: "5px",bottom:"7px", padding: "0px 4px", cursor: "pointer" }}><i className="fa fa-cog"> </i></span>

                                <span  className="background-theme-color text-white"  style={{ position: "absolute", right: "0",borderRadius: "5px", padding: "0px 4px", cursor: "pointer"  }}  onClick={() => { handleSeeDetails(chart) }}> See Details </span>
                            </p>

                            {chart.type === "Bar" && <Bar data={chart.data} options={chart.options} />}
                            {chart.type === "Line" && <Line data={chart.data} options={chart.options} />}
                            {chart.type === "Pie" && <Pie data={chart.data} options={chart.options} />}
                            {chart.type === "Scatter" && <Scatter data={chart.data} options={chart.options} />}
                            {chart.type === "Bubble" && <Bubble data={chart.data} options={chart.options} />}
                        </div>
                    ))}

                </ResponsiveGridLayout>
            }
        </div>
        {modalData?.visible && (
            <Modal
                visible={modalData?.visible}
                setVisible={() => {
                    setModalData((val) => ({ ...val, visible: false }));
                }}
                modalData={modalData?.modalData}
                modalWidth={modalData?.width}
                Header={modalData?.label}
                buttonType="button"
                buttonName={modalData?.buttonName}
                footer={modalData?.footer}
                handleAPI={modalData?.CallAPI}
            >
                {modalData?.Component}
            </Modal>
        )}
    </>
    );
}