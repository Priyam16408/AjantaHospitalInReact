import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import {
  BindBloodGroup,
  BloodBankPatientProcessUpdateBloodCrossmatch,
  PatientProcessSearchPatientMatch,
} from "../../../networkServices/BloodBank/BloodBank";
import { notify } from "../../../utils/ustil2";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import Modal from "../../../components/modalComponent/Modal";
import SetScreening from "./SetScreening";
import CrossMatchModal from "./CrossMatchModal";

const PatientCrossMatch = () => {
  const [t] = useTranslation();
  const [bindBloodGroup, setBindBloodGroup] = useState([]);
  const [tableData, setTableData] = useState([]);

  const THEAD = [
    { name: "S.No" },
    { name: "Patient Name" },
    { name: "Age/Sex" },
    { name: "IPD No" },
    { name: "Blood Group" },
    { name: "Component" },
    { name: "Quantity" },
    { name: "Select" },
  ];

  const initialValue = {
    Type: { label: "ALL", value: "ALL" },
    Sex: { label: "All", value: "All" },
    UHID: "",
    IPDNo: "",
    PateintName: "",
    FromDate: new Date(),
    ToDate: new Date(),
    BloodGroup: "",
    Age: "",
  };

  const [values, setValues] = useState({ ...initialValue });

  const [modalState, setModalState] = useState({
    show: false,
    name: null,
    component: null,
    size: null,
    footer: null,
  });

  const handleModalState = (show, name, component, size, footer) => {
    setModalState({
      show: show,
      name: name,
      component: component,
      size: size,
      footer: footer,
    });
  };

  const TypeOptions = [
    { label: "OPD", value: "OPD" },
    { label: "IPD", value: "IPD" },
    { label: "EMG", value: "EMG" },
    { label: "ALL", value: "ALL" },
  ];
  const AGE_TYPE = [
    {
      label: "YRS",
      value: "YRS",
    },
    {
      label: "MONTH(S)",
      value: "MONTH(S)",
    },
    {
      label: "DAYS(S)",
      value: "DAYS(S)",
    },
  ];

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const GenderOptions = [
    { label: "All", value: "All" },
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const handleSave = async (data) => {
    debugger;
    const payload = {
      itemId: data?.ItemID?.toString(), 
      componentID: data?.ComponentID?.toString(),
      compatiblity: data?.crossMatch?.value || "",
      patientID: data?.PatientID,
      stockID: data?.bloodBagNo?.Stock_Id,
      bagNumber: data?.bloodBagNo?.BBTubeNo?.split("#")[0] || "",
    };

    console.log("Payload to be sent", payload);
    const response =
      await BloodBankPatientProcessUpdateBloodCrossmatch(payload);

    if (response?.success) {
      setModalState({
        show: false,
        name: null,
        component: null,
        size: null,
        footer: null,
      });
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };
  const handleModalSelect = async (ele) => {
    setModalState({
      show: true,
      name: t("Processing"),
      component: (
        <CrossMatchModal
          ele={ele}
          setPayload={setValues}
          setModalState={setModalState}
          modalData={modalState}
        />
      ),
      size: "70vw",
      footer: null,
      buttonName: "Save",
      handleAPI: handleSave,
    });
  };

  const handleSearch = async () => {
    const payload = {
      pType: values?.Type?.value,
      patientID: values?.UHID,
      ipdNo: values?.IPDNo,
      pName: values?.PateintName,
      bloodGroup: values?.BloodGroup?.label ?? "Select",
      fromDate: moment(values?.FromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.ToDate).format("YYYY-MM-DD"),
      sex: values?.Sex?.value ?? "All",
      age: values?.Age,
      year: values?.AgeType?.value ?? "YRS",
    };

    const response = await PatientProcessSearchPatientMatch(payload);
    if (response?.success) {
      setTableData(response?.data);
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
      setTableData([]);
    }
  };

  const handleBindBloodGroup = async () => {
    try {
      const apiResp = await BindBloodGroup();
      if (apiResp.success) {
        const mappedOptions = apiResp.data.map((item) => ({
          value: item.id,
          label: item.bloodgroup,
        }));
        setBindBloodGroup(mappedOptions);
      } else notify(apiResp.message, "error");
    } catch (error) {
      notify("Error loading menu name data", "error");
    }
  };

  useEffect(() => {
    handleBindBloodGroup();
  }, []);

  return (
    <>
      <div className="card">
        <Heading title={t("Search Criteria")} isBreadcrumb={true} />

        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Type")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="Type"
            name="Type"
            removeIsClearable={true}
            dynamicOptions={TypeOptions}
            handleChange={handleSelect}
            value={values?.Type?.value}
          />
          <Input
            type="text"
            className="form-control"
            id="UHID"
            name="UHID"
            value={values?.UHID}
            onChange={handleChange}
            lable={t("UHID No")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="IDPNo"
            name="IDPNo"
            value={values?.IDPNo}
            onChange={handleChange}
            lable={t("IPD No")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="PateintName"
            name="PateintName"
            value={values?.PateintName}
            onChange={handleChange}
            lable={t("Pateint Name")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <DatePicker
            id="FromDate"
            width
            name="FromDate"
            lable={t("From Date")}
            value={values?.FromDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            className="custom-calendar"
            maxDate={values?.toDate}
          />
          <DatePicker
            id="ToDate"
            width
            name="ToDate"
            lable={t("To Date")}
            value={values?.ToDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            className="custom-calendar"
          />
          <ReactSelect
            placeholderName={t("BloodGroup")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="BloodGroup"
            name="BloodGroup"
            removeIsClearable={true}
            dynamicOptions={bindBloodGroup}
            handleChange={handleSelect}
            value={values?.BloodGroup?.value}
          />
          <div className="col-xl-2 col-md-3 col-sm-6 col-12">
            <div className="row">
              <Input
                type="text"
                className="form-control required-fields"
                id="Age"
                name="Age"
                value={values?.Age ? values?.Age : ""}
                onChange={(e) => {
                  handleChange(e);
                }}
                lable={t("Age")}
                placeholder=" "
                respclass="col-5"

                //tabIndex="5"
              />

              <ReactSelect
                placeholderName={t("Type")}
                id="Type"
                name="AgeType"
                removeIsClearable={true}
                value={values?.AgeType}
                handleChange={handleSelect}
                dynamicOptions={AGE_TYPE}
                searchable={true}
                respclass="col-7"
              />
            </div>
          </div>
          <ReactSelect
            placeholderName={t("Sex")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="Sex"
            name="Sex"
            removeIsClearable={true}
            dynamicOptions={GenderOptions}
            handleChange={handleSelect}
            value={values?.Sex?.value}
          />

          <div className="d-flex justify-content-end p-1">
            <button
              className="btn btn-sm btn-success py-0 px-1"
              onClick={handleSearch}
              style={{ width: "60px" }}
            >
              {t("Search")}
            </button>
          </div>
        </div>
        {tableData?.length > 0 && (
          <div>
            <Tables
              thead={THEAD}
              tbody={tableData?.map((val, i) => {
                return {
                  SrNo: i + 1,
                  PatientName: val?.Pname,
                  AgeSex: val?.AgeSex,
                  IPDNo: val?.IPDNo,
                  BloodGroup: val?.BloodGroup,
                  ComponentName: val?.ComponentName,
                  Quantity: val?.Quantity,
                  Select: (
                    <i
                      className="fa fa-edit"
                      aria-hidden="true"
                      onClick={() => handleModalSelect(val)}
                    ></i>
                  ),
                };
              })}
            />
          </div>
        )}

        <Modal
          Header={modalState?.name}
          modalWidth={modalState?.size}
          visible={modalState?.show}
          setVisible={() => {
            handleModalState(false, null, null, null, <></>);
          }}
          buttonName={modalState?.buttonName}
          footer={modalState?.footer}
          modalData={modalState?.modalData}
          handleAPI={modalState?.handleAPI}
        >
          {modalState?.component}
        </Modal>
      </div>
    </>
  );
};

export default PatientCrossMatch;
