import React, { useEffect, useState } from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import OnlineInvSlotMasterTable from "../../components/UI/customTable/TokenManagement/OnlineInvSlotMasterTable";
import { useDispatch, useSelector } from "react-redux";
import { getBindCategory } from "../../store/reducers/TokenManagementSlice/CommonExportFunction";
import {
  getBindCentre,
  GetBindSubCatgeory,
} from "../../store/reducers/common/CommonExportFunction";
import { BindModality } from "../../networkServices/opdserviceAPI";
import {
  getBindDoctorTimingShift,
  SearchInvestigationSlotSchedule,
} from "../../networkServices/TokenManagement";
import MultiSelectComp from "../../components/formComponent/MultiSelectComp";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import TimePicker from "../../components/formComponent/TimePicker";
import { notify } from "../../utils/utils";

const OnlineInvSlotMaster = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const { getBindCategoryData } = useSelector(
    (state) => state.TokenManagementSlice
  );

  const { GetBindSubCatgeoryData, getbindCentreData } = useSelector(
    (state) => state.CommonSlice
  );
  const [onlineINV, setOnlineINV] = useState({
    // categoryIDStatic:"3",
    categoryID: "3",
    subCategoryID: "",
    isShowRow: false,
  });

  const [apiData, setApiData] = useState({
    searchInvestionData: [],
    getDoctorTimingShiftData: [],
    getBindModalityData: [],
  });
  console.log(apiData);

  useEffect(() => {
    dispatch(getBindCategory());
  }, []);

  const handleReactSelectChange = (name, e) => {
    console.log(name, e);
    const { value } = e;
    setOnlineINV((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "categoryID" && value === "3" ? { subCategoryID: "" } : {}),
    }));
    // setOnlineINV((prev)=> ({...prev, categoryID:e.value, subCategoryID:e.value}));
    switch (name) {
      case "categoryID":
        return dispatch(
          GetBindSubCatgeory({
            Type: "1",
            CategoryID: value,
          })
        );
      // case "centreID":
      //   return dispatch(getBindCentre());
    }
  };

  const handleSerchDataWithAllAPI = async () => {
    try {
      const BindModalityResponse = await BindModality(onlineINV.subCategoryID);
      console.log(BindModalityResponse);
      if (BindModalityResponse.success) {
        const bindDoctorShiftTiming = await getBindDoctorTimingShift();
        const data2 = await SearchInvestigationSlotSchedule({
          modalityID: String(BindModalityResponse.data.ID),
          categoryID: String(onlineINV.categoryID),
          subCategoryID: String(onlineINV.subCategoryID),
        });
        await dispatch(getBindCentre()); // api call using redux
        setApiData((prev) => ({
          ...prev,
          searchInvestionData: data2?.data,
          getDoctorTimingShiftData: bindDoctorShiftTiming?.data,
          getBindModalityData: BindModalityResponse.data,
        }));
        setOnlineINV((prev) => ({ ...prev, isShowRow: true }));
      }
      if (BindModalityResponse?.data?.success === false) {
        notify(BindModalityResponse?.data?.message, "error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // multi select dynamic options

  const Days = [
    { name: "Monday", code: "Mon" },
    { name: "Tuesday", code: "Tues" },
    { name: "Wednesday", code: "Wed" },
    { name: "Thrusday", code: "Thur" },
    { name: "Friday", code: "Fri" },
    { name: "Saturday", code: "Sat" },
    { name: "Sunday", code: "Sun" },
  ];

  const [week, setWeek] = useState(null);
  console.log(week);
  const weekHnadleChange = (e) => {
    setWeek(e.value);
  };


  return (
    <>
      <div className="m-2 spatient_registration_card">
        <form className="patient_registration card">
          <Heading isBreadcrumb={true} />
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2 p-2">
            <ReactSelect
              placeholderName={t(
                "CategoryName"
              )}
              id={"CategoryName"}
              searchable={true}
              name="categoryID"
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={getBindCategoryData?.map((item) => {
                return {
                  label: item?.name,
                  value: item?.categoryID,
                };
              })}
              value={onlineINV.categoryID}
              handleChange={handleReactSelectChange}
            />
            {onlineINV.categoryID !== "3" && (
              <ReactSelect
                placeholderName={t(
                  "Sub Category Name"
                )}
                id={"CategoryName"}
                searchable={true}
                respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
                name="subCategoryID"
                dynamicOptions={GetBindSubCatgeoryData?.map((item) => ({
                  label: item?.name,
                  value: item?.subCategoryID,
                }))}
                value={onlineINV.subCategoryID}
                handleChange={handleReactSelectChange}
              />
            )}
            <div className="col-xl-1 col-md-2 col-sm-6 col-12">
              <button
                className="btn btn-sm btn-primary ml-2"
                type="button"
                onClick={
                  onlineINV.categoryID === "3"
                    ? null
                    : handleSerchDataWithAllAPI
                }
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </form>
      </div>

      {onlineINV.isShowRow && (
        <div className="m-2 spatient_registration_card">
          <form className="patient_registration card">
            <Heading isBreadcrumb={false} title={t("Department Schedule Details")} />
            <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2 p-2">
              <ReactSelect
                placeholderName={"Modality"}
                id={"Modality"}
                searchable={true}
                respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                name="subCategoryID"
                dynamicOptions={[
                  {
                    label: apiData.getBindModalityData.Name,
                    value: apiData.getBindModalityData.ID,
                  },
                ]}
              />
              <ReactSelect
                placeholderName={t("Centre")}
                id={"Center"}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                dynamicOptions={getbindCentreData?.map((item) => {
                  return {
                    label: item?.CentreName,
                    value: item?.CentreID,
                  };
                })}
                // requiredClassName="required-fields"
                handleChange={handleReactSelectChange}
                // value={values.centreID}
                name="centreID"
              />
              <MultiSelectComp
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                dynamicOptions={Days}
                handleChange={weekHnadleChange}
                value={week}
              />

              <ReactSelect
                placeholderName={t("Shift")}
                id={"shift"}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                dynamicOptions={apiData.getDoctorTimingShiftData?.map(
                  (item) => {
                    return {
                      label: item.ShiftName,
                      value: item.Id,
                    };
                  }
                )}
              />
              <ReactSelect
                placeholderName={"Duration for Patient"}
                id={"DurationforPatient"}
                searchable={true}
                respclass="col-xl-1 col-md-4 col-sm-6 col-12"
                dynamicOptions={[
                  { label: "5", value: "5" },
                  { label: "10", value: "10" },
                  { label: "15", value: "5" },
                  { label: "20", value: "20" },
                  { label: "25", value: "5" },
                  { label: "30", value: "30" },
                  { label: "35", value: "35" },
                  { label: "40", value: "40" },
                  { label: "45", value: "45" },
                  { label: "50", value: "50" },
                  { label: "55", value: "55" },
                  { label: "60", value: "60" },
                  { label: "65", value: "65" },
                  { label: "70", value: "70" },
                  { label: "75", value: "75" },
                  { label: "80", value: "80" },
                  { label: "85", value: "85" },
                  { label: "90", value: "90" },
                  { label: "95", value: "95" },
                  { label: "100", value: "100" },
                  { label: "105", value: "105" },
                  { label: "110", value: "110" },
                  { label: "115", value: "115" },
                  { label: "120", value: "120" },
                ]}
              />
              <TimePicker
                respclass="col-xl-1 col-md-4 col-sm-6 col-12"
                placeholderName="start time"
              />
              <TimePicker
                respclass="col-xl-1 col-md-4 col-sm-6 col-12"
                placeholderName="End time"
              />

              <div className="col-xl-1 col-md-2 col-sm-6 col-12">
                <button
                  className="btn btn-sm btn-primary ml-2"
                  type="button"
                // onClick={handleSerchDataWithAllAPI}
                >
                  {t("Add Timing")}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {apiData.searchInvestionData?.length > 0 &&
        <div className="m-2 spatient_registration_card">
          <form className="patient_registration card">
            <OnlineInvSlotMasterTable tbody={apiData.searchInvestionData} />
          </form>
        </div>
      }
    </>
  );
};

export default OnlineInvSlotMaster;
