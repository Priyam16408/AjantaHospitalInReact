import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import { Tooltip } from "primereact/tooltip";
import { maxLengthChecker } from "../../../utils/utils";
import { DischargeLoadDetails } from "../../../networkServices/BillingsApi";
import Modal from "../../../components/modalComponent/Modal";
import DischargeTrackerModal from "../../../components/modalComponent/Utils/DischargeTrackerModal";
import { ClockSVG } from "../../../components/SvgIcons";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";

const DischargeTracker = () => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [trackerVisible, setTrackerVisible] = useState(false);

  const trackerTHEAD = [
    t("IPD No."),
    t("P.Name"),
    t("Doctor"),
    t("Bed No."),
    t("Discharge Intimation"),
    t("Pharmacy Clearance"),
    t("Bill In Process"),
    t("Bill Freezed"),
    t("Discharged"),
    t("Bill Generated"),
    t("Patient Clearance"),
    t("Nurse Clearance"),
    t("Room Clearance"),
    t("Discharge(TAT)"),
  ];

  const formatDate = (datetime) => {
    const datePart = new Date(datetime).toLocaleDateString(); // Extracts just the date
    return datePart;
  };

  const formatTime = (datetime) => {
    const timePart = new Date(datetime).toLocaleTimeString(); // Extracts just the time
    return timePart;
  };

  const GetDischargeTrackerData = async () => {
    store.dispatch(setLoading(true));
    try {
      let apiResp = await DischargeLoadDetails();

      if (apiResp?.success) {
        setTableData(apiResp?.data);
      } else {
        notify(apiResp?.message, "error");
        setTableData([]);
      }
    } catch (error) {
      console.log(error, "Something went wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    GetDischargeTrackerData();
  }, []);

  const handleDataStatus = (backgroundColor, item) => {
    return item ? (
      <div
        style={{
          padding: "3px",
          background: "lightgreen",
          border: "none",
          textAlign: "center",
          width: "100%",
        }}
      >
        {/* <ClockSVG /> */}
        {formatDate(item)}
        <br />
        {formatTime(item)}
      </div>
    ) : (
      <div style={{ padding: "6px", background: backgroundColor }}>&nbsp;</div>
    );
  };

  const handleTableData = (tableData) => {
    return tableData?.map((item, index) => {
      const {
        TransNo,
        PName,
        DoctorName,
        BedNo,
        Intemation,
        MedClearnace,
        BillFreeze,
        DischargeIntimateDate,
        BillDate,
        PatientClearnace,
        NurseClearnace,
        RoomClearnace,
      } = item;
      return {
        IPDNo: TransNo,
        PName: PName,
        Doctor: (
          <>
            <span id={`doctor-tooltip-${index}`}>
              {maxLengthChecker(DoctorName, 12)}
            </span>
            {DoctorName?.length > 10 && (
              <Tooltip
                target={`#doctor-tooltip-${index}`}
                content={DoctorName}
              />
            )}
          </>
        ),
        BedNo: (
          <>
            <span id={`BedNo-tooltip-${index}`}>
              {maxLengthChecker(BedNo, 12)}
            </span>
            {BedNo?.length > 10 && (
              <Tooltip target={`#BedNo-tooltip-${index}`} content={BedNo} />
            )}
          </>
        ),

        DischargeIntimation: handleDataStatus("#ffa500a6", Intemation),
        PharmacyClearance: handleDataStatus("#ffa500a6", MedClearnace),
        BillInProcess: handleDataStatus("#ffa500a6", BillFreeze),
        BillFreezed: handleDataStatus("#ffa500a6", BillFreeze),
        Discharged: handleDataStatus("#ffa500a6", DischargeIntimateDate),
        BillGenerated: handleDataStatus("#ffa500a6", BillDate),
        PatientClearance: handleDataStatus("#ffa500a6", PatientClearnace),
        NurseClearance: handleDataStatus("#ffa500a6", NurseClearnace),
        RoomClearance: handleDataStatus("#ffa500a6", RoomClearnace),
        DischargeTAT: (
          <div style={{ color: "red", animation: "blinking 1s infinite" }}>
            {item?.DischargeTAT}
          </div>
        ),
        colorcode: "pink",
      };
    });
  };

  return (
    <>
      {trackerVisible && (
        <Modal
          modalWidth={"500px"}
          visible={trackerVisible}
          setVisible={setTrackerVisible}
          Header="Search By Discharge Date"
          footer={
            <>
              <div className="col-12"></div>
            </>
          }
        >
          <DischargeTrackerModal
            trackerVisible={trackerVisible}
            setTrackerVisible={setTrackerVisible}
            tableData={trackerVisible?.showData}
          />
        </Modal>
      )}

      <div className="card">
        <Heading title={t("Discharge Tracker")} isBreadcrumb={true} />

        <div className="card d-flex justify-content-between">
          <div className="d-flex align-items-center justify-content-between m-1 ml-auto">
            <ColorCodingSearch
              label={t("Discharge Delay")}
              color="pink"
              marginRight={"5px"}
            />
            <ColorCodingSearch
              label={t("Pending")}
              color="red"
              marginRight={"5px"}
            />
            <ColorCodingSearch
              label={t("Status Done")}
              color="lightgreen"
              marginRight={"5px"}
            />
            <ColorCodingSearch
              label={t("Not Reached")}
              color="#ffa500a6"
              marginRight={"5px"}
            />
            <button
              className="btn btn-sm btn-info ml-3"
              onClick={() => {
                setTrackerVisible({
                  trackerVisible: true,
                  showData: {},
                });
              }}
            >
              {t("Export")}
            </button>
          </div>

          <Tables thead={trackerTHEAD} 
          style={{maxHeight: "462px"}}
         // getRowClass={getRowClass}
          tbody={handleTableData(tableData)} 
          tableHeight={"scrollView"} />
         </div>
      </div>
    </>
  );
};
export default DischargeTracker;
