import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useTranslation } from "react-i18next";
// import { maxLengthChecker } from "../../../utils/utils";
import { Tooltip } from "primereact/tooltip";
import moment from "moment";
// import { use } from "i18next";
import ReactSelect from "../formComponent/ReactSelect";
import DatePicker from "../formComponent/DatePicker";
import ViewLabReportTable from "../UI/customTable/doctorTable/ViewConsultationtable/ViewLabReportTable";
import { SearchPatient } from "../../networkServices/DoctorApi";


const ViewLabReport = forwardRef((props, ref) => {
  const { patientID } = props?.data ; 
 
  const [t] = useTranslation(); 
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [labStatus, setLabStatus] = useState("ALL");
  const [apiData, setApiData] = useState({
    getSearchPatient: [],
  });

  console.log(apiData,"apiData");

  const [date, setDate] = useState({
    fromDate: moment().format("DD-MMM-YYYY"),
    toDate: moment().format("DD-MMM-YYYY"),
  });

  const handleReactSelectChange = async (name, e) => {
    console.log(e);
    console.log(name);
    setLabStatus(e.value);

    switch (e.value) {
      case "RAD":
        try {
          const response = await SearchPatient({
            status: "", // Test Prescribed = n,
            fromDate: moment(new Date(date?.fromDate)).format("DD-MMM-YYYY"),
            toDate: moment(new Date(date?.fromDate)).format("DD-MMM-YYYY"),
            labDepartmentType: "RAD",
            pid: patientID,
          });
          setApiData((prev) => ({ ...prev, getSearchPatient: response.data }));
          console.log(response);
        } catch (error) {}
        break;


      case "LAB":
        try {
          const response = await SearchPatient({
            status: "", 
            fromDate: moment(new Date(date?.fromDate)).format("DD-MMM-YYYY"),
            toDate: moment(new Date(date?.fromDate)).format("DD-MMM-YYYY"),
            labDepartmentType: "LAB",
            pid: patientID,
          });
          
          setApiData((prev) => ({ ...prev, getSearchPatient: response.data }));
          console.log(response);
        } catch (error) {}
        break;


      case "ALL":
        try {
          const response = await SearchPatient({
            status: "", // Test Prescribed = n,
            fromDate: moment().format("DD-MMM-YYYY"),
            toDate: moment().format("DD-MMM-YYYY"),

            labDepartmentType: "ALL",
            pid: patientID,
          });

          setApiData((prev) => ({ ...prev, getSearchPatient: response.data }));
          console.log(response);
        } catch (error) {}
        break;

      default:
        break;
    }
  };



  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setDate((prev) => ({ ...prev, [name]: value }));

  };


  console.log("date", date.fromDate);

  const fetchAllAPI = async () => {
    try {
      const response = await SearchPatient({
        status: "", // Test Prescribed = n,
        fromDate: moment(date?.fromDate).format("DD-MMM-YYYY"),
        toDate: moment(date?.toDate).format("DD-MMM-YYYY"),
        labDepartmentType: labStatus,
        pid: patientID,
      });

      setApiData((prev) => ({ ...prev, getSearchPatient: response.data }));
      console.log(response);
    } catch (error) {}
  };




  
  useEffect(() => {
    fetchAllAPI();
  }, [date.fromDate]);

  const handlePacImage = () => {
    window.open(
      `https://mohpacs.actoneng.com:3000/?patient=${patientID}`
    );
  };

  return (
    <>
      <div className="">
        {/* <Heading
          title={t("Vital Sign")}
          // isBreadcrumb={true}
        /> */}
        <div className="row g-4 m-2 align-items-center">

          <ReactSelect
            placeholderName={"Type"}
            id={"Type"}
            searchable={true}
            name={"OPDANDRADIOLOGY"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-sm-4 col-12"
            dynamicOptions={[
              { label: "Laboratory", value: "LAB" },
              { label: "Radiology", value: "RAD" },
              { label: "ALL", value: "ALL" },
            ]}
            handleChange={handleReactSelectChange}
            value={labStatus}
          />

          <DatePicker
            className="custom-calendar"
            id="DOB"
            name="fromDate"
            lable={"From Date"}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
            handleChange={handleChangeDate}
            value={date.fromDate ? moment(date?.fromDate, "DD-MMM-YYYY").toDate(): date?.fromDate}
          />
          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            lable={"To Date"}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
            handleChange={handleChangeDate}
            value={date.toDate ? moment(date?.toDate, "DD-MMM-YYYY").toDate(): date?.toDate}
          />

          <div className="col mb-2 text-right">
            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={handlePacImage}
            >
              {t("Pacs Image")}
            </button>
          </div>
        </div>

        <div
          className="card patient_registration border col-12  "
          style={{ marginBottom: "10px" }}
        >
          <div
            className="row justify-content-between"
            style={{ padding: "6px 10px  6px 10px", gap: "10px",display: "none" }}
          >
            <div className="col-12">
              <div className="row" style={{ gap: "10px" }}>
                <div
                  className="d-flex align-items-center "
                  style={{ gap: "5px" }}
                >
                  <div className="statusAppointment"></div>
                  <label
                    className="text-dark m-0 "
                    data-pr-tooltip="Test Prescribed"
                    data-pr-position="top"
                    id="TestPrescribed"
                  >
                    {"Test Prescribed"}
                    {/* <Tooltip target={"#TestPrescribed"} /> */}
                  </label>
                </div>
                <div
                  className=" d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <div className="statusRescheduled"></div>
                  <label
                    className="text-dark m-0"
                    data-pr-tooltip="Sample Collected"
                    data-pr-position="top"
                    id="SampleCollected"
                  >
                    {t(" Sample Collected")}
                    {/* <Tooltip target={"#SampleCollected"} /> */}
                  </label>
                </div>
                <div
                  className="col-sm- d-flex align-items-center "
                  style={{ gap: "5px" }}
                >
                  <div className="statusPending"></div>
                  <label
                    className="text-dark m-0 "
                    data-pr-tooltip="Department Received"
                    data-pr-position="top"
                    id="DepartmentReceived"
                  >
                    {t(" Department Received")}
                    <Tooltip target={"#DepartmentReceived"} />
                  </label>
                </div>
                <div
                  className=" d-flex align-items-center "
                  style={{ gap: "5px" }}
                >
                  <div className="statusCanceled "></div>
                  <label
                    className="text-dark m-0"
                    data-pr-tooltip="Not Approved"
                    data-pr-position="top"
                    id="NotApproved"
                  >
                    {t("Not Approved	")}
                    <Tooltip target={"#NotApproved"} />
                  </label>
                </div>
                <div
                  className=" d-flex align-items-center "
                  style={{ gap: "5px" }}
                >
                  <div className="statusConfirmed"></div>
                  <label className="text-dark m-0">{t(" Approved	")}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <ViewLabReportTable tbody={apiData?.getSearchPatient} />
        </div>
      </div>
    </>
  );
});

export default ViewLabReport;
