import React, { useEffect, useMemo, useState } from "react";
import {
  MISBedManagementSummary,
  MISBindBedStatus,
} from "../../../networkServices/BillingsApi";
import BedDetail from "./BedDetail";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import OccupiedBed from "../../../assets/image/OccupiedBed.jpg";
import AvailableBed from "../../../assets/image/AvailableBed.jpg";
import HouseKeeping from "../../../assets/image/HouseKeeping.jpg";
import PercentageChart from "../../../utils/chart/PercentageChart";
import {
  AvailableBedSVG,
  HouseKeepingSVG,
  OccupiedRoomSVG,
  TodayAdmissionSVG,
  TodayDischargeSVG,
  TotalCapacitySVG,
} from "../../../components/SvgIcons";
import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";
import { useTranslation } from "react-i18next";

const BedManagement = () => {
  const [MISSummaryState, setMISSummaryState] = useState({});
  const handleMISBedManagementSummary = async () => {
    try {
      const response = await MISBedManagementSummary();
      // debugger;
      setMISSummaryState(response?.data[0]);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const [bedDetails, setBedDetails] = useState({});

  // const handleMISBindBedStatus = async (Type, img) => {
  //   console.log(type)
  //   console.log(img)
  //   // debugger;
  //   store.dispatch(setLoading(true));
  //   try {

  //     const response = await MISBindBedStatus(Type);
  //     console.log("response",response)

  //     const modifiedResponse = response?.data?.reduce((acc, current) => {
  //       // Check if the current Floor already exists in the accumulator
  //       if (!acc[current?.Floor]) {
  //         acc[current.Floor] = {};
  //       }

  //       // Check if the current Name already exists under the Floor in the accumulator
  //       if (!acc[current.Floor][current?.Name]) {
  //         acc[current.Floor][current.Name] = [];
  //       }

  //       // Push the current item to the respective Floor and Name
  //       acc[current.Floor][current.Name].push({ ...current, img: img });

  //       return acc;
  //     }, {});

  //     setBedDetails(modifiedResponse);
  //   } catch (error) {
  //     console.log(error, "SomeThing Went Wrong");
  //   } finally {
  //     store.dispatch(setLoading(false));
  //   }
  // };

  const handleMISBindBedStatus = async (Type, img) => {
    store.dispatch(setLoading(true));
    try {
      const response = await MISBindBedStatus(Type);
      // Map for STATUS to image
      const statusToImageMap = {
        2: AvailableBed, // Example for STATUS 2
        3: OccupiedBed, // Example for STATUS 3
        4: HouseKeeping, // Example for STATUS 4
        5: OccupiedBed, // Example for STATUS 5
      };

      const modifiedResponse = response?.data?.reduce((acc, current) => {
        const statusImg = statusToImageMap[current.STATUS] || "";
        // Check if the current Floor already exists in the accumulator
        if (!acc[current?.Floor]) {
          acc[current.Floor] = {};
        }
        // Check if the current Name already exists under the Floor in the accumulator
        if (!acc[current.Floor][current?.Name]) {
          acc[current.Floor][current.Name] = [];
        }
        // Push the current item to the respective Floor and Name
        acc[current.Floor][current.Name].push({ ...current, img: statusImg });

        return acc;
      }, {});

      setBedDetails(modifiedResponse);
    } catch (error) {
      console.log(error, "Something Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };
  const [t] = useTranslation();
  useEffect(() => {
    handleMISBedManagementSummary();
    handleMISBindBedStatus(1);
  }, []);
  console.log(bedDetails);
  return (
    <div className="mt-2">
      <div className="row">
        <CardUIBed
          title={t("Total Capacity")}
          resClass="col-xl-2 col-md-4 col-sm-6 col-12 form-group"
          svgIcon={<TotalCapacitySVG />}
          data={{
            count: MISSummaryState?.TotalCapacity,
          }}
          onClick={() => handleMISBindBedStatus(1)}
        />

        <CardUIBed
          title={t("Available Bed")}
          resClass="col-xl-2 col-md-4 col-sm-6 col-12 form-group"
          svgIcon={<AvailableBedSVG />}
          data={{
            count: MISSummaryState?.AvailableRoom,
            img: AvailableBed,
          }}
          onClick={() => handleMISBindBedStatus(2, AvailableBed)}
        />

        <CardUIBed
          title={t("Occupied Bed")}
          resClass="col-xl-2 col-md-4 col-sm-6 col-12 form-group"
          svgIcon={<OccupiedRoomSVG />}
          data={{
            count: MISSummaryState?.OccupiedRoom,
            img: OccupiedBed,
          }}
          onClick={() => handleMISBindBedStatus(3, OccupiedBed)}
        />

        <CardUIBed
          title={t("House keeping")}
          resClass="col-xl-2 col-md-4 col-sm-6 col-12 form-group"
          svgIcon={<HouseKeepingSVG />}
          data={{
            count: MISSummaryState?.PendingRoomClearance,
            img: HouseKeeping,
          }}
          onClick={() => handleMISBindBedStatus(4, HouseKeeping)}
        />
        <CardUIBed
          title={t("Today Admission")}
          resClass="col-xl-2 col-md-4 col-sm-6 col-12 form-group"
          svgIcon={<TodayAdmissionSVG />}
          data={{
            count: MISSummaryState?.TodayAdmission,
            img: OccupiedBed,
          }}
          onClick={() => handleMISBindBedStatus(5, OccupiedBed)}
        />
        <CardUIBed
          title={t("Today Discharge")}
          resClass="col-xl-2 col-md-4 col-sm-6 col-12 form-group"
          svgIcon={<TodayDischargeSVG />}
          data={{
            count: MISSummaryState?.TodayDischarge,
          }}
          onClick={() => handleMISBindBedStatus(6)}
        />

        <div className="col-xl-2 col-md-4 col-sm-6 col-12 form-group">
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
              boxShadow: "0px 0px 5px #cdcaca",
            }}
            className="p-2"
          >
            {[
              {
                label: "Discharge Intimation",
                Value: MISSummaryState?.TodayDisIntimated,
              },
              {
                label: "Delayed Discharge",
                Value: MISSummaryState?.TodayDelayDischarge,
              },
              {
                label: "Medical Clearance",
                Value: MISSummaryState?.TodayMedClearnace,
              },
              {
                label: "Bill Generate",
                Value: MISSummaryState?.TodayBillGenerate,
              },
              {
                label: "Nurse Clearance",
                Value: MISSummaryState?.TodayNurseClearnace,
              },
              {
                label: "Bed Clearance",
                Value: MISSummaryState?.TodayBedClearnace,
              },
              {
                label: "Bill Finalized",
                Value: MISSummaryState?.TodayBillFinalized,
              },
              {
                label: "Advance Bed Booking",
                Value: MISSummaryState?.TodayAdvanceRoomBoking,
                onClick: () => handleMISBindBedStatus(15),
              },
              {
                label: "New Patient Admit",
                Value: MISSummaryState?.TodayNewPatientAdmit,
              },
              {
                label: "New Room",
                Value: MISSummaryState?.TodayNewRoom,
                onClick: () => handleMISBindBedStatus(21),
              },

              {
                label: "Bill Cancelled",
                Value: MISSummaryState?.TodayBillCancellation,
              },
              { label: "Total Floor", Value: MISSummaryState?.TotalFloor },
              { label: "Total Ward", Value: MISSummaryState?.TotalWard },
              {
                label: "Discharge Cancelled",
                Value: MISSummaryState?.TodayDischargeCancelled,
              },
            ]?.map((row, index) => (
              <div
                className="d-flex justify-content-between"
                key={index}
                style={{
                  padding: "2px",
                  cursor: "pointer",
                  borderBottom: "1px dashed grey",
                }}
                onClick={row?.onClick && row?.onClick}
              >
                <div className="bed-heading">{t(row?.label)}</div>
                <div className="bed-heading">{row?.Value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-xl-8 col-md-4 col-sm-6 col-12 form-group">
          {Object.keys(bedDetails)?.length > 0 && (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "5px",
                boxShadow: "0px 0px 5px #cdcaca",
              }}
              className="p-2 mb-1"
            >
              <BedDetail bedDetails={bedDetails} />
            </div>
          )}
        </div>

        <div className="col-xl-2 col-md-4 col-sm-6 col-12 form-group">
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
              boxShadow: "0px 0px 5px #cdcaca",
            }}
            className="p-2 mb-1"
          >
            <div className="text-center">
              <div className="bed-heading">{t("Current Bed Occupancy")}</div>
              <div>{t("Analysis In")} %</div>

              <PercentageChart
                percentage={Number(MISSummaryState?.OccupencyPer)}
                strokeColor={"tomato"}
                radius={100}
                stroke={20}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
              boxShadow: "0px 0px 5px #cdcaca",
            }}
            className="p-2"
          >
            <div className="text-center">
              <div className="bed-heading">
                {t("Last 30 Discharge Patient Average Stay Period")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardUIBed = ({ title, resClass, svgIcon, data, onClick }) => {
  const [t]=useTranslation();
  return (
    <div className={resClass}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          boxShadow: "0px 0px 5px #cdcaca",
          cursor: "pointer",
        }}
        className="text-center"
        onClick={onClick}
      >
        <div className=" bed-heading">{title}</div>
        <div className="bed-icon">{svgIcon}</div>
        <div className="footer-bedManagement p-2">
          {[
            {
              label: t("Count"),
              Value: (
                <>
                  {data?.count}
                  {data?.img && <img src={data?.img} width={"25%"} />}
                </>
              ),
            },
            { label: t("HP (Hospital Patient)"), Value: "00" },
            { label: t("PP (Panel Patient)"), Value: "02" },
          ]?.map((row, index) => (
            <div className="d-flex justify-content-between" key={index}>
              <div className="bed-heading">{row?.label}</div>
              <div className="bed-heading text-right">{row?.Value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BedManagement;
