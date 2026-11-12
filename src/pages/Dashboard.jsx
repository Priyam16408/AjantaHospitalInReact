import React, { useEffect, useState, useTransition } from "react";
import { Line, Bar, Pie, PolarArea } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import {
  CommonAPIGetEmpBirthDay,
  DashboardMISUserWiseGraphSetting,
  getDashboard,
  getDashboardDataTYPEID,
  HIMSDashboardUserRightsAPI,
} from "../networkServices/dashboardAPI";
import Welcome from "../components/WelComeCard/Welcome";
import moment from "moment";
import store from "../store/store";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import GraphBox from "../components/DashboardUI/GraphBox";
import {
  // buttonsGroup,
  createGraphData,
  dynamicOptions,
  RANDOM_CHART,
} from "../utils/constant";
import DashboardTable from "../components/UI/customTable/DashboardTable/DashboardTable";
import Modal from "../components/modalComponent/Modal";
import BussinessDashboard from "./BussinessDashboard";
import ScrollComponent from "../components/ScrollComponent";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import CardSection from "../components/DashboardUI/CardSection";
import ReactSelect from "../components/formComponent/ReactSelect";
import { notify } from "../utils/utils";
import Marque from "../components/UI/Marque";
import NewsDataDashboard from "../components/modalComponent/Utils/NewsDataDashboard";
import { useTranslation } from "react-i18next";
import { BirthDaySVGIcon } from "../components/SvgIcons";
Chart.register(...registerables);

const Dashboard = () => {
  const [selectedButton, setSelectedButton] = useState();
  const localdata = useLocalStorage("userData", "get");
  const [birthDayData, setBirthDayData] = useState([]);
  const [buttonsGroup, setButtonsGroup] = useState([]);
  const [newsLetter, setNewsLetter] = useState([]);
  const [headSetName, setHeadSetName] = useState([]);
  const [payloadData, setPayLoadData] = useState({
    fromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    toDate: new Date(),
    selectDate: "3",
  });
  const [t] = useTranslation()

  const handleHeightOfBirthDaycard = () => {
    let welcome_wrp = document.getElementById("welcome_wrp")?.getBoundingClientRect().height
    let birthdayHead = document.getElementById("birthdayHead")?.getBoundingClientRect().height
    return (welcome_wrp - (birthdayHead ? birthdayHead : 27.66));
  };

  const handleDateValue = (selectedRange) => {
    const today = new Date();
    let startDate, endDate;
    switch (selectedRange) {
      case "1":
        startDate = today;
        endDate = today;
        break;
      case "2":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = today;
        break;
      case "3":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        endDate = today;
        break;
      case "4":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        endDate = today;
        break;
    }

    return {
      startDate,
      endDate,
    };
  };

  const DATE_REACTSELECT_OPTION = [
    {
      label: ` Today (${moment(handleDateValue("1")?.startDate).format("DD-MMM-YYYY")} - ${moment(handleDateValue("1")?.endDate).format("DD-MMM-YYYY")} )`,
      value: "1",
    },
    {
      label: `Last Seven Days (${moment(handleDateValue("2")?.startDate).format("DD-MMM-YYYY")} - ${moment(handleDateValue("2")?.endDate).format("DD-MMM-YYYY")} )`,
      value: "2",
    },
    {
      label: `Last One Month (${moment(handleDateValue("3")?.startDate).format("DD-MMM-YYYY")} - ${moment(handleDateValue("3")?.endDate).format("DD-MMM-YYYY")} )`,
      value: "3",
    },

    {
      label: `Last Three Month (${moment(handleDateValue("4")?.startDate).format("DD-MMM-YYYY")} - ${moment(handleDateValue("4")?.endDate).format("DD-MMM-YYYY")} )`,
      value: "4",
    },
  ];

  // const [dynamicGraph, SetDynamicGrpah] = useState()
  // const [dynamicGraph, SetDynamicGrpah] = useState({
  //   PIE: "",
  //   BAR: "",
  //   Line: "",
  //   CURVELINE: "",
  //   POLARAREA: "",
  //   DOUGHNUT: "",
  // });

  const handleReactChange = (name, e) => {
    setPayLoadData({
      ...payloadData,
      [name]: e?.value,
      fromDate: handleDateValue(e?.value)?.startDate,
      toDate: handleDateValue(e?.value)?.endDate,
    });
    commonParams["fromDate"] = moment(
      handleDateValue(e?.value)?.startDate
    ).format("YYYY-MM-DD");
    commonParams["toDate"] = moment(handleDateValue(e?.value)?.endDate).format(
      "YYYY-MM-DD"
    );

    handleDashboardAPI(selectedButton);
  };

  // const [apiData, setApiData] = useState({
  //   firstAPIData: [], // Box wala data aara h
  //   secondAPIData: [],
  //   thirdAPIData: [],
  //   fourthAPIData: [],
  //   fifthAPIData: [],
  //   sixthAPIData: [],
  //   sevenAPIData: [],
  //   EightAPIData: [],
  //   NineAPIData: [],
  //   TenthAPIData: [],
  //   TableAPIData: [],
  // });

  const [apiData, setApiData] = useState({});

  const [registerModal, setRegisterModal] = useState({
    isShow: false,
    App_ID: "",
    ApiData: [],
    Header: "",
    TimeDuration: null,
    component: null,
    modalWidth: null,
  });

  // const graphData2 = createGraphData(
  //   apiData?.secondAPIData,
  //   "TextField",
  //   "ValueField"
  // );

  // const graphData3 = createGraphData(
  //   apiData?.thirdAPIData,
  //   "TextField",
  //   "ValueField"
  // );

  // const graphData4 = createGraphData(
  //   apiData?.fourthAPIData,
  //   "TextField",
  //   "ValueField"
  // );

  // const graphData5 = createGraphData(
  //   apiData?.fifthAPIData,
  //   "TextField",
  //   "ValueField"
  // );

  // const graphData6 = createGraphData(
  //   apiData?.sixthAPIData,
  //   "TextField",
  //   "ValueField",
  //   "WardName",
  //   "AvailableRoom"
  // );

  // const graphData7 = createGraphData(
  //   apiData?.sevenAPIData,
  //   "TextField",
  //   "ValueField"
  // );

  // const graphData8 = createGraphData(
  //   apiData?.EightAPIData,
  //   "TextField",
  //   "ValueField"
  // );

  // const graphData9 = createGraphData(
  //   apiData?.NineAPIData,
  //   "TextField",
  //   "ValueField"
  // );

  // const graphData10 = createGraphData(
  //   apiData?.TenthAPIData,
  //   "TextField",
  //   "ValueField"
  // );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Sales: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  const commonParams = {
    fromDate: moment(payloadData.fromDate).format("YYYY-MM-DD"),
    tAbid: 1,
    phrledgerno: localdata?.deptLedgerNo, //localstorage data
    toDate: moment(payloadData.toDate).format("YYYY-MM-DD"),
  };

  const handleDashboardAPI = async (currentTab) => {
    commonParams.tAbid = currentTab?.AdminUser ? currentTab?.AdminUser : 0
    try {
      // debugger
      if (typeof (currentTab.GraphIDs) === "string") {
        currentTab.GraphIDs = currentTab?.GraphIDs?.split(",")
      }
      const obj = {};
      const headSetName = [];

      for (let i = 0; i < currentTab?.GraphIDs?.length; i++) {
        const data = await getDashboard({
          type: String(currentTab?.GraphIDs[i]),
          ...commonParams,
        });

        if (data?.data?.length > 0) {
          obj[data?.data[0]["TypeName"]] = data?.data;

          headSetName.push({
            name: data?.data[0]["TypeName"],
            defaultChart: data?.data[0]["GraphType"],
            options: options,
          });
        }
      }

      const cardData = await getDashboard({
        type: String(currentTab?.id),
        ...commonParams,
      });

      const newsData = await getDashboard({
        type: String(17),
        ...commonParams,
      });

      setApiData((prev) => ({
        ...prev,
        firstAPIData: firstAPIDataResponse(cardData.data),
        ...obj,
      }));
      if (newsData?.success) {
        setNewsLetter(newsData?.data);
      } else {
        setNewsLetter([]);
      }
      setHeadSetName(headSetName);
      setSelectedButton(currentTab);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(newsLetter);

  const firstAPIDataResponse = (reponse) => {
    const mainData = reponse?.reduce((acc, current) => {
      if (acc[current?.CardOrderBy]) {
        acc[current?.CardOrderBy] = [...acc[current?.CardOrderBy], current];
      } else {
        acc[current?.CardOrderBy] = [current];
      }

      return acc;
    }, {});

    return mainData;
  };

  const getUserRights = async () => {
    let apiResp = await HIMSDashboardUserRightsAPI()
    if (apiResp?.success) {
      setButtonsGroup(apiResp?.data)
      let currentTab = apiResp?.data?.find((val) => val?.FirstDefaultTab === val?.id)
      if (currentTab) {
        // currentTab.GraphIDs = currentTab?.GraphIDs?.split(",")
        handleDashboardAPI(currentTab)
      } else {
        currentTab = apiResp?.data[0]
        // currentTab.GraphIDs = currentTab?.GraphIDs?.split(",")
        handleDashboardAPI(apiResp?.data[0])
      }
    }

  }

  useEffect(() => {
    handleCommonAPIGetEmpBirthDay();
    getUserRights()
  }, [localdata?.defaultRole]);

  const generateRandomColor = (numColors) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  const handleGraphChange = async (e, index, items) => {
    const { value, name } = e.target;

    try {
      const response = await DashboardMISUserWiseGraphSetting({
        graphTypeID: Number(items[0]?.GraphTypeID),
        graphType: String(value),
        orderBy: String(items[0]?.OrderBy),
      });

      if (response?.success) {
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }

      const data = [...headSetName];
      data[index][name] = value;
      setHeadSetName(data);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const getGraphComponent = (selectedGraph) => {
    switch (selectedGraph) {
      case "Bar chart":
        return Bar;
      case "Line chart":
        return Line;
      case "Pie chart":
        return Pie;
      case "Curve Line chart":
        return Line;
      case "Polar Area chart":
        return PolarArea;
      case "Stacked Bar Chart":
        return Bar;
      default:
        return Bar;
    }
  };

  const handleCommonAPIGetEmpBirthDay = async () => {
    try {
      const response = await CommonAPIGetEmpBirthDay();
      if (response?.success) {
        setBirthDayData(response?.data);
      } else {
        setBirthDayData([]);
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleClickGetDashboardDetailAPI = async (CardName, itemID) => {
    try {
      const response = await getDashboardDataTYPEID({
        type: itemID?.TypeID,
        fromDate: moment(payloadData.fromDate).format("YYYY-MM-DD"),
        tAbid: 1,
        toDate: moment(payloadData.toDate).format("YYYY-MM-DD"),
      });
      const Header = `${t(CardName)} / ${itemID.TypeName || itemID.TextField}`;
      const TimeDuration = `From Date : ${moment(payloadData.fromDate).format("DD-MMM-YYYY")} - To Date : ${moment(payloadData.toDate).format("DD-MMM-YYYY")}`;
      setRegisterModal((prev) => ({
        ...prev,
        isShow: true,
        Header,
        TimeDuration,
        modalWidth: "90vw",
        component: (
          <DashboardTable
            tbody={response?.data ?? []}
            Header={Header}
            TimeDuration={TimeDuration}
          />
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewsModal = (item) => {
    setRegisterModal((prev) => ({
      ...prev,
      isShow: true,
      Header: <>News</>,
      modalWidth: "60vw",
      component: <NewsDataDashboard data={item} />,
    }));
  };

  const cardDataPrint = (type, data) => {
    const CardName = data[type]?.[0]?.CardName;
    const CardType = data[type]?.[0]?.CardType;
    const dataMap = data[type];

    return (
      <CardSection
        CardName={CardName}
        dataMap={dataMap}
        Type={CardType}
        handleClickGetDashboardDetailAPI={handleClickGetDashboardDetailAPI}
      />
    );
  };

  const handleRenderDashboard = (whichDashboard) => {
    switch (Number(whichDashboard?.id)) {
      case 9:
        return (
          <BussinessDashboard apiData={apiData} headSetName={headSetName} />
        );
      default:
        return (
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <Welcome />
                <div className="d-flex flex-wrap" style={{ gap: "10px" }}>
                  {headSetName?.length > 0 &&
                    headSetName?.map((head, index) => {
                      if (apiData[head?.name]?.length > 0) {
                        return (
                          <GraphBox
                            data={createGraphData(
                              apiData[head?.name],
                              "TextField",
                              ["ValueField"],
                              head?.defaultChart
                            )}
                            component={getGraphComponent(head?.defaultChart)}
                            options={{
                              ...head?.options,
                              ...dynamicOptions(head?.defaultChart),
                            }}
                            width={"100%"}
                            headName={head?.name}
                            handleGraphChange={(e) =>
                              handleGraphChange(e, index, apiData[head?.name])
                            }
                            value={head?.defaultChart}
                          />
                        );
                      }
                    })}
                </div>
              </div>
              {/* graph end */}

              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    <div className="birthDay-Box">
                      <div
                        className="birthdayHead d-flex justify-content-between"
                        id="birthdayHead"
                      >
                        <span style={{ fontWeight: 700, color: "#fb5353" }}>
                          {t("BirthDay List")}{" "}
                        </span>
                        ({moment().format("dddd, MMMM Do YYYY")})
                      </div>
                      <div
                        style={{
                          padding: "2px",
                        }}
                      >
                        <Marque height={handleHeightOfBirthDaycard()}>
                          {birthDayData?.map((item, index) => (
                            <div className="birthdayBody mt-2" key={index}>
                              <div
                                className="thread"
                                style={{
                                  backgroundColor: generateRandomColor(),
                                  fontSize: "10px",
                                  padding: "2px 5px",
                                  borderRadius: "0px 5px 5px 0px",
                                  display: "inline",
                                  color: "black",
                                  fontWeight: "600",
                                }}
                              >
                                {item?.Department}
                              </div>
                              <div className="d-flex justify-content-between p-2">
                                <div className="deatils">
                                  <div style={{ fontWeight: 800 }}>
                                    {item?.EmployeeName}
                                  </div>
                                  <div>
                                    {item?.EmployeeAge} {t("Birthday")}
                                    <BirthDaySVGIcon />
                                  </div>
                                </div>
                                <div>
                                  <img
                                    src={item?.EmployeePhoto}
                                    className="img-holder"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </Marque>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="birthDay-Box">
                      <div
                        className="birthdayHead d-flex justify-content-between"
                        id="birthdayHead"
                      >
                        <span style={{ fontWeight: 700, color: "blue" }}>
                          {t("News")}
                        </span>
                        ({moment(payloadData?.fromDate).format("DD-MMM-YYYY")} -{" "}
                        {moment(payloadData?.toDate).format("DD-MMM-YYYY")} )
                      </div>
                      <div
                        style={{
                          padding: "2px",
                        }}
                      >
                        <Marque height={handleHeightOfBirthDaycard()}>
                          {newsLetter?.map((item, index) => (
                            <div
                              className="birthdayBody mt-2"
                              key={index}
                              onClick={() => handleNewsModal(item)}
                            >
                              <div
                                className="thread"
                                style={{
                                  backgroundColor: generateRandomColor(),
                                  fontSize: "10px",
                                  padding: "2px 5px",
                                  borderRadius: "0px 5px 5px 0px",
                                  display: "inline",
                                  color: "black",
                                  fontWeight: "600",
                                }}
                              >
                                {item?.Subject}
                              </div>
                              <div className="d-flex justify-content-between p-2">
                                <div className="deatils">
                                  <div style={{ fontWeight: 800 }}>
                                    <svg
                                      width="20"
                                      height="15"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle
                                        cx="12"
                                        cy="8"
                                        r="4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                      />
                                      <path
                                        d="M4 20C4 15.5817 7.58172 12 12 12C16.4183 12 20 15.5817 20 20"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                      />
                                    </svg>{" "}
                                    {item?.RaisedBy}
                                  </div>
                                  <div style={{ color: "green" }}>
                                    <svg
                                      width="24"
                                      height="15"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13h-1v6h6v-1h-5z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                    {item?.NewsDates}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ color: "blue" }}>
                                    <svg
                                      width="24"
                                      height="15"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13h-1v6h6v-1h-5z"
                                        fill="currentColor"
                                      />
                                    </svg>{" "}
                                    {item?.EntryDate}
                                  </div>
                                  <div style={{ color: "red" }}>
                                    <svg
                                      width="24"
                                      height="15"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13h-1v6h6v-1h-5z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                    {item?.NewsExpiryDate}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Marque>
                      </div>
                    </div>
                  </div>
                </div>
                {apiData?.firstAPIData &&
                  Object.keys(apiData?.firstAPIData)?.map((item, index) => {
                    return cardDataPrint(Number(item), apiData?.firstAPIData);
                  })}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="mainDashboardwrp">
        <div
          className="card patient_registration border"
        // style={{ position: "sticky", top: "100px", zIndex: 99 }}
        >
          <div className="row g-4 m-2">
            <ReactSelect
              respclass={"col-xl-4 col-md-8 col-sm-12 col-12"}
              removeIsClearable={true}
              dynamicOptions={DATE_REACTSELECT_OPTION}
              value={payloadData?.selectDate}
              name={"selectDate"}
              handleChange={handleReactChange}
            />
            {/* <DatePicker
              className="custom-calendar"
              id="fromDate"
              name="fromDate"
              lable={"From Date"}
              placeholder={VITE_DATE_FORMAT}
              respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
              value={payloadData.fromDate}
              handleChange={dateHandleChange}
            />

            <DatePicker
              className="custom-calendar"
              id="toDate"
              name="toDate"
              lable={"To Date"}
              placeholder={VITE_DATE_FORMAT}
              respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
              value={payloadData.toDate}
              handleChange={dateHandleChange}
            /> */}

            {buttonsGroup.map((item, index) => (
              <div className="col-md-1 col-sm-1 col-12 d-flex" key={index}>
                <button
                  className={`btn btn-sm btn-info ${Number(selectedButton?.id) === Number(item.id) ? "activeBtnClas" : ""}`}
                  onClick={() => handleDashboardAPI(item)}
                  style={{
                    width: "200px",
                  }}
                >
                  {t(item.btnName)}
                </button>
              </div>
            ))}
          </div>
        </div>
        <ScrollComponent viewPort={1}>
          {handleRenderDashboard(selectedButton)}
        </ScrollComponent>
      </div>

      {registerModal.isShow && (
        <Modal
          visible={registerModal?.isShow}
          setVisible={() => {
            setRegisterModal({
              isShow: false,
              App_ID: "",
              ApiData: [],
              Header: "",
              TimeDuration: null,
              component: null,
            });
          }}
          modalWidth={registerModal?.modalWidth}
          Header={registerModal?.Header}
          footer={<></>}
        >
          {registerModal?.component}
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
