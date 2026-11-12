import React, { useEffect, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import Modal from "../../../components/modalComponent/Modal";
import EmployeeRoleRight from "../EmployeeManagment/EmployeeMaster/EmployeeRoleRight";

import BasicMasterEditModal from "./BasicMasterEditModal";
import Button from "../../../components/formComponent/Button";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  EDPBasicMasterSavePro,
  EDPBindMappedProDoctor,
  EDPBindPro,
  EDPSaveMapPRoToDoctor,
  EDPUpdateMappedPRODoctor,
  EDPUpdatePRODetail,
} from "../../../networkServices/EDP/govindedp";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import { useDispatch } from "react-redux";
import { GetBindReferDoctor } from "../../../store/reducers/common/CommonExportFunction";
import { useSelector } from "react-redux";

const ProMaster = ({ data }) => {
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");

  const dispatch = useDispatch();

  const initialState = {
    selectType: {
      label: "New",
      value: "1",
    },
    Name: "",
    Status: { label: "Active", value: "1" },
  };

  const initialState1 = {
    Status: {
      label: "",
      value: "",
    },
    Name: "",
  };

  const PROTHEAD = [
    { name: "S.No" },
    { name: "Pro Name" },
    { name: "Refer Dr. Name" },
    { name: "Active" },
  ];

  const MAPTHEAD = [
    { name: "S.No." },
    { name: "Pro Name" },
    { name: "Refer Dr. Name" },
    { name: "Remove" },
  ];

  const [mappedList, setMappedList] = useState([]);

  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });

  const [tableData, setTableData] = useState([]);
  console.log("TableDara", tableData);

  const [dropDownData, setDropDownState] = useState({
    proData: [],
  });
  const [values, setValues] = useState({ ...initialState });

  const [newValues, setNewValues] = useState({});
  console.log("newValues", newValues);

  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));

    // 👉 Trigger bindProData when Status changes
    if (label === "Status") {
      bindProData(value?.value); // value = 1, 0, or 2
    }

    if (label === "proName") {
      setValues((val) => ({ ...val, [label]: value }));
      // bindMappedProDr(); // Already handled in useEffect
    }
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const EDPUpdatePRODetailAPI = async (values1) => {
    const payload = {
      proID: 0,
      name: values1?.Name,
      active: values1?.Status?.value,
    };

    const response = await EDPUpdatePRODetail(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setModalHandlerState({
        header: null,
        show: false,
        size: null,
        component: null,
        footer: null,
      });
      setValues({ ...initialState });
    } else {
      notify(response?.message, "error");
      setModalHandlerState({
        header: null,
        show: false,
        size: null,
        component: null,
        footer: null,
      });
    }
  };
  const handleModalState = (item) => {
    setModalHandlerState({
      show: true,
      header: t("Edit PRO"),
      size: "40vw",
      component: (
        // <EmployeeRoleRight
        //   setValues={setValues}
        //   values={values}
        // //   department={dropDownState?.Department}
        // />
        <BasicMasterEditModal
          values={newValues}
          setValues={setNewValues}
          onSave={(latestValues) => EDPUpdatePRODetailAPI(latestValues)}
        />
      ),
      footer: <></>,
    });
  };

  const SaveProMasterAPI = async () => {
    console.log("vALUES", values);
    const payloadToBe = {
      proName: values?.Name,
      ipaddress: ip,
    };

    const response = await EDPBasicMasterSavePro(payloadToBe);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialState);
    } else {
      notify(response?.message, "error");
      setValues(initialState);
    }
  };

  const SearchMap = () => {
    if (values?.proName && values?.ReferDoctor) {
      const newEntry = {
        ProName: values?.proName?.label,
        ReferDoctor: values?.ReferDoctor?.label,
        proID: values?.proName?.value,
        doctorID: values?.ReferDoctor?.value,
      };

      setMappedList((prev) => [...prev, newEntry]);

      // Disable dropdowns (or you could just lock selection)
      setValues((prev) => ({
        ...prev,
        disablePro: true,
      }));
    } else {
      notify("Please select both PRO and Refer Doctor", "error");
    }
  };

  const handleRemoveMapping = (index) => {
    const updatedList = [...mappedList];
    updatedList.splice(index, 1);
    setMappedList(updatedList);
  };

  const bindProData = async (statusValue = 1) => {
    try {
      const response = await EDPBindPro(statusValue); // Send status as argument

      const dropDownData = {
        proData: [
          ...handleReactSelectDropDownOptions(
            response?.data,
            "ProName",
            "Pro_ID"
          ),
        ],
      };

      setDropDownState(dropDownData);
    } catch (error) {
      console.error("Error fetching PRO data:", error);
      notify("Failed to load PRO data", "error");
    }
  };

  const bindMappedProDr = async () => {
    const ProID = values?.proName?.Pro_ID;

    const response = await EDPBindMappedProDoctor(ProID);

    if (response?.success) {
      // notify(response?.message, "success");
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleCustomReactSelect = (index, name, value) => {
    const lableList = JSON.parse(JSON.stringify(tableData));
    lableList[index][name] = value?.value;
    setTableData(lableList);
  };

  const handleUpdateMappedData = async () => {
    const payloadToBe = tableData.map((item) => ({
      isactive: item?.IsActive,
      proID: item?.PRO_ID,
      refDocID: item?.ReferDoctorID,
    }));

    const response = await EDPUpdateMappedPRODoctor(payloadToBe);

    if (response?.success) {
      // notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSavedMapping = async () => {
    const payloadToBe = mappedList.map((item) => ({
      proID: item?.proID,
      refDocID: item?.doctorID,
    }));

    const response = await EDPSaveMapPRoToDoctor(payloadToBe);

    if (response?.success) {
      notify(response?.message, "success");
      setMappedList([]);
    } else {
      notify(response?.message, "error");
    }
  };

  const { GetBindReferDoctorList } = useSelector((state) => state.CommonSlice);
  console.log("GetBindReferDoctorList", GetBindReferDoctorList);

  useEffect(() => {
    if (values?.proName) {
      bindMappedProDr();
    }
  }, [values?.proName]);

  // useEffect(() => {
  //   bindProData();
  // }, []);

  useEffect(() => {
    dispatch(GetBindReferDoctor());
  }, []);

  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
      />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Select Type")}
          name="selectType"
          value={values?.selectType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "New", value: "1" },
            { label: "Edit", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        {values?.selectType?.value == 1 && (
          <Input
            type="text"
            className={"form-control required-fields"}
            lable={t("Name")}
            placeholder=" "
            name="Name"
            onChange={(e) => handleInputChange(e, 0, "Name")}
            value={values?.Name}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}

        {values?.selectType?.value == 0 && (
          <>
            <ReactSelect
              placeholderName={t("Status")}
              name="Status"
              value={values?.Status?.value}
              handleChange={(name, e) => handleReactSelect(name, e)}
              dynamicOptions={[
                { label: "Active", value: "1" },
                { label: "InActive", value: "0" },
                { label: "Both", value: "2" },
              ]}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <ReactSelect
              requiredClassName={"required-fields"}
              placeholderName={t("Pro Name")}
              name="proName"
              value={values?.proName?.value}
              handleChange={(name, e) => handleReactSelect(name, e)}
              dynamicOptions={dropDownData?.proData}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <button
              className="btn btn-sm btn-success ml-2 px-3"
              onClick={handleModalState}
            >
              {t("Edit")}
            </button>
            <ReactSelect
              requiredClassName={"required-fields"}
              placeholderName={t("Refer Doctor")}
              name="ReferDoctor"
              value={values?.ReferDoctor?.value}
              handleChange={(name, e) => handleReactSelect(name, e)}
              dynamicOptions={handleReactSelectDropDownOptions(
                GetBindReferDoctorList,
                "NAME",
                "DoctorID"
              )}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
          </>
        )}
        {modalHandlerState?.show && (
          <Modal
            visible={modalHandlerState?.show}
            setVisible={() =>
              setModalHandlerState({
                show: false,
                component: null,
                size: null,
              })
            }
            modalWidth={modalHandlerState?.size}
            Header={modalHandlerState?.header}
            footer={modalHandlerState?.footer}
          >
            {modalHandlerState?.component}
          </Modal>
        )}

        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={
            values?.selectType?.value == 1 ? SaveProMasterAPI : SearchMap
          }
        >
          {values?.selectType?.value == 1 ? t("Save") : t("Map")}
        </button>
      </div>

      {mappedList?.length > 0 && (
        <>
          <Heading title={"Mapped Table"} isBreadcrumb={false} />
          <Tables
            thead={MAPTHEAD}
            tbody={mappedList.map((ele, index) => ({
              SrNo: index + 1,
              ProName: ele.ProName,
              ReferDoctor: ele.ReferDoctor,
              Remove: (
                <span
                  onClick={() => handleRemoveMapping(index)}
                  style={{ color: "red", cursor: "pointer" }}
                >
                  ❌
                </span>
              ),
            }))}
            style={{ height: "auto" }}
          />
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 p-2">
            <button
              className=" btn btn-sm btn-success ml-2 px-3"
              onClick={handleSavedMapping}
            >
              {t("Update Mapped Details")}
            </button>
          </div>
        </>
      )}

      {tableData?.length > 0 && (
        <div className="mt-2">
          <Heading title={"Pro Doctor Mapping Table"} isBreadcrumb={false} />
          <Tables
            thead={PROTHEAD}
            tbody={tableData?.map((ele, index) => {
              return {
                SrNo: index + 1,
                ProName: ele?.ProName,
                ReferDoctor: ele?.name,
                isActive: (
                  <CustomSelect
                    option={[
                      { label: "Yes", value: 1 },
                      { label: "No", value: 0 },
                    ]}
                    placeHolder={t("IsActive")}
                    value={ele?.IsActive}
                    // value={"0"}
                    isRemoveSearchable={true}
                    name="IsActive"
                    onChange={(name, e) =>
                      handleCustomReactSelect(index, name, e)
                    }
                  />
                ),
              };
            })}
            style={{ height: "40vh" }}
          />
          <div className="col-xl-12 col-md-4 col-sm-6 col-12 p-2 d-flex justify-content-end">
            <button
              className=" btn btn-sm btn-success ml-2 px-3"
              onClick={handleUpdateMappedData}
            >
              {t("Update Mapped Details")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProMaster;
