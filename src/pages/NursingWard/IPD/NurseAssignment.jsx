import React, { useEffect, useState } from "react";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import NurseAssignmentTable from "../../../components/UI/customTable/NursingWard/NurseAssignmentTable";
import {
  BindAvailablenurse,
  BindFloor,
  BindRoomType,
  SaveNurseAssignment,
  SearchAssignNurse,
} from "../../../networkServices/nursingWardAPI";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
export default function NurseAssignment() {
  const [t] = useTranslation();

  const [list, setList] = useState({
    availableNurseList: [],
    floorList: [],
    roomTypeList: [],
  });
  const [values, setValues] = useState({
    Floor: { value: "0", label: "0" },
    RoomType: { value: "0", label: "ALL" },
  });
  const [patientAssignList, setPatientAssignList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const bindAllList = async () => {
    try {
      Promise.all([BindAvailablenurse(), BindFloor(), BindRoomType()]).then(
        ([availableNurse, floor, roomType]) => {
          setList((val) => ({
            ...val,
            availableNurseList: availableNurse?.data,
            floorList: floor?.data,
            roomTypeList: roomType?.data,
          }));
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
console.log(patientAssignList)
  useEffect(() => {
    bindAllList();
  }, []);

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const SearchAssignNurseAPI = async () => {
    let apiResponse = await SearchAssignNurse(values);
    if (apiResponse?.success) {
      let respData = apiResponse?.data?.map((val) => {
        val.isChecked = false;
        return val;
      });
      setPatientList(respData);
    } else {
      setPatientList([]);
      notify(apiResponse?.message, "error");
    }

    if (apiResponse?.status === 400) {
      setPatientList([]);
      notify(
        apiResponse?.data?.errors[Object.keys(apiResponse?.data?.errors)[0]][0],
        "error"
      );
    }
  };

  const SaveNurseAssignmentAPI = async () => {
    if (!values?.NurseName) {
      notify(t("NurseNameError"), "error");
      return false;
    }
    let saveData = [];
    patientAssignList?.map((val) => {
      let obj = {};
      obj.isChecked = true;
      obj.transactionID = val?.TransactionID;
      obj.nurseName = values?.NurseName?.label;
      obj.ipdCaseTypeID = val?.IPDCaseTypeID;
      obj.status = val?.STATUS;
      saveData.push(obj);
    });

    let payload = {
      nurseId: values?.NurseName?.value,
      items: saveData,
    };
    let apiResponse = await SaveNurseAssignment(payload);

    if (apiResponse?.success) {
      SearchAssignNurseAPI();
      notify(apiResponse?.message, "success");
    } else {
      notify(apiResponse?.message, "error");
    }

    if (apiResponse?.status === 400) {
      notify(
        apiResponse?.data?.errors[Object.keys(apiResponse?.data?.errors)[0]][0],
        "error"
      );
    }

    console.log("SaveNurseAssignment", apiResponse);
  };

  const handleChangeCheckbox = (e, ele) => {
    let data = patientList.map((val) => {
      if (val?.IPDNo === ele?.IPDNo) {
        val.isChecked = e?.target?.checked;
      }
      return val;
    });
    let saveData = data?.filter((val) => val?.isChecked === true);
    setPatientAssignList(saveData);
    setPatientList(data);
  };

  const handleChangeCheckboxHeader = (e) => {
    let respData = patientList?.map((val) => {
      val.isChecked = e.target.checked;
      return val;
    });
    setPatientList(respData);
  };

  const isMobile = window.innerWidth <= 800;

  const thead = [
    { width: "1%", name: t("SNO") },
    {
      width: "1%",
      name: isMobile ? (
        t("check")
      ) : (
        <input
          type="checkbox"
          name="checkbox"
          style={{ marginLeft: "3px" }}
          onChange={(e) => {
            handleChangeCheckboxHeader(e);
          }}
        />
      ),
    },
    t("IPDNo"),
    t("PatientName"),
    t("RoomType"),
    t("RoomName"),
    t("NurseName"),
    t("AssignedOn"),
    t("CompletedOn"),
    t("Status"),
  ];
  return (
    <div className="m-2 spatient_registration_card">
      <form className="patient_registration card">
        <Heading
          title={t("HeadingName")}
          isBreadcrumb={true}
          secondTitle={
            <>
              <div className="d-flex">
                <div className="StatusIn"></div>
                <label className="text-dark ml-2">
                  {t("StatusIn")}
                </label>
              </div>
              <div className="d-flex ml-1">
                <div className="StatusOut"></div>
                <label className="text-dark ml-2">
                  {t("StatusOut")}
                </label>
              </div>
            </>
          }
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("RoomType")}
            id={"RoomType"}
            searchable={true}
            respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                list?.roomTypeList,
                "Name",
                "IPDCaseTypeID"
              ),
            ]}
            name={"RoomType"}
            handleChange={handleSelect}
            value={`${values?.RoomType?.value}`}
          />
          <ReactSelect
            placeholderName={t("Floor")}
            id={"Floor"}
            searchable={true}
            respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                list?.floorList,
                "name",
                "id"
              ),
            ]}
            // dynamicOptions={handleReactSelectDropDownOptions(list?.floorList, "name", "id")}
            name={"Floor"}
            handleChange={handleSelect}
            value={`${values?.Floor?.value}`}
          />
          <div className=" col-sm-2 col-xl-2">
            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={SearchAssignNurseAPI}
            >
              {t("search")}
            </button>
          </div>
        </div>
      </form>
      {patientList?.length ? (
        <div className="card p-1">
          <NurseAssignmentTable
            tableHeight={"nurse-assignment-table-height"}
            thead={thead}
            tbody={patientList?.map((ele, index) => ({
              SNO: index + 1,
              Actions: (
                <div>
                  {ele?.STATUS !== "Completed" ? (
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        handleChangeCheckbox(e, ele);
                      }}
                      checked={ele?.isChecked}
                    />
                  ) : (
                    ""
                  )}
                </div>
              ),
              IPDNo: ele?.IPDNo,
              PatientName: ele?.PName,
              RoomType: ele?.RoomType,
              RoomName: ele?.RoomName,
              NurseName: ele?.NurseName,
              AssignedOn: ele?.AssignmentDateIN,
              CompletedOn: ele?.AssignmentDateOUT,
              Status: ele?.STATUS,
            }))}
          />
          <div className="card">
            <div className="p-2 d-flex justify-content-end">
              <ReactSelect
                placeholderName={t("NurseName")}
                id={"NurseName"}
                searchable={true}
                respclass="w-25"
                dynamicOptions={handleReactSelectDropDownOptions(
                  list?.availableNurseList,
                  "NAME",
                  "EmployeeID"
                )}
                name={"NurseName"}
                handleChange={handleSelect}
                value={`${values?.NurseName?.value}`}
              />

              <div className="ml-2">
                <button
                  className="btn btn-sm btn-success"
                  type="button"
                  onClick={SaveNurseAssignmentAPI}
                >
                  {t("save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
