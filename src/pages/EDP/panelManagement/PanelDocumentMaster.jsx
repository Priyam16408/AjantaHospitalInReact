import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import EmployeeRoleRight from "../EmployeeManagment/EmployeeMaster/EmployeeRoleRight";
import Modal from "../../../components/modalComponent/Modal";
import CreateDoc from "./CreateDoc";
import CommonMasterForm from "../EmployeeManagment/CommonMasterForm/CommonMasterForm";
import CommonModalComponent from "../ModaCommonComponent/CommonModalComponent";
import {
  EDPLoadDocument,
  EDPLoadDocumentDetail,
  EDPLoadPanel,
  EDPSaveDoc,
  EDPSavePanelDoc,
  EDPSavePanelDocument,
  EDPUpdatePanelForDocuments,
} from "../../../networkServices/EDP/govindedp";
import { notify } from "../../../utils/ustil2";

export default function PanelDocumentMaster({ data }) {
  const [t] = useTranslation();
  const initialState = {
    docName: "",
    Panel: {
      Company_Name: "",
      PanelID: 0,
      ReferenceCode: "",
      ReferenceCodeOPD: "",
      IsCash: 0,
      applyCreditLimit: 0,
      PanelGroupID: 0,
      label: "",
      value: 0,
    },
    docs: [],
  };
  const [values, setValues] = useState({ ...initialState });
  console.log("Values", values);
  const [dropDownState, setDropDownState] = useState({
    Department: [],
    Doc: [],
  });
  console.log("ResponseData", dropDownState?.Doc);
  const [newData, setNewData] = useState([]);

  const [responseData, setResponseData] = useState({});
  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues((val) => ({ ...val, [name]: selectedOptions }));
  };

  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });

  const bindPanel = async () => {
    const response = await EDPLoadPanel();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Panel: handleReactSelectDropDownOptions(
          response?.data,
          "Company_Name",
          "PanelID"
        ),
      }));
    }
  };
  const bindDoc = async () => {
    const response = await EDPLoadDocument();

    let selectedValue = [];

    if (response?.success) {
      let selectedValue = [];
      let data = response?.data?.map((val) => {
        let returnData = {
          code: val?.DocumentID,
          name: val?.Document,
        };
        if (val?.isCheck === 1) {
          selectedValue.push(returnData);
        }
        return returnData;
      });

      setValues((val) => ({ ...val, docs: selectedValue }));

      setDropDownState((val) => ({
        ...val,
        Doc: data,
      }));
    }
  };

  const PanelDoc = async () => {
    const response = await EDPUpdatePanelForDocuments();
    if (response?.success) {
      const formattedData = response?.data?.map((item) => ({
        label: item.Company_Name,
        value: item.PanelID,
        isChecked: false,
      }));
      setModalHandlerState((val) => ({ ...val, modalData: formattedData }));
      // setNewData(formattedData);
    } else {
      // notify(response?.message, "error")
    }
  };
  const CompareDetails = async () => {
    const response = await EDPLoadDocumentDetail();
    if (response?.success) {
      setResponseData(response?.data);
      // setNewData(formattedData);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleReactSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleSave = async (data) => {
    console.log("Data", data);
    if (!data?.docName) {
      notify(t("Please Enter Document Name"), "error");
      return;
    }
    const payload = {
      saveDoc: data?.docName,
    };

    const response = await EDPSaveDoc(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialState);
      setModalHandlerState((val) => ({ ...val, show: false }));
      bindDoc();
    } else {
      notify(response?.message, "error");
    }
  };

  const handleModalState = (item) => {
    setModalHandlerState({
      show: true,
      header: t("Create Document"),
      size: "40vw",
      component: <CreateDoc values={values} setValues={setModalHandlerState} />,
      // footer: (
      //   <></>
      // ),
      handleAPI: handleSave,
    });
  };
  const handleModalStateCreate = (item) => {
    if (newData?.length === 0) {
      notify("No Data Avaialable for Mapping", "error");
      return;
    }
    setModalHandlerState({
      show: true,
      header: t("Select Panel To Apply Selected Documents"),
      size: "40vw",
      component: (
        <CommonModalComponent data={newData} setData={setModalHandlerState} />
      ),
      // footer: <></>,
      handleAPI: handleSaveMapping,
    });
  };

  const handleSaveMapping = async (data) => {
    // console.log("NewData", newData);
    setValues((val) => ({ ...val, modalData: data }));
    const payload = {
      panelID: values?.Panel?.PanelID || 0,
      documentIDs: values?.docs?.map((doc) => doc.code) || [],
      panel2IDs: data
        .filter((item) => item.isChecked)
        .map((item) => item.value),
    };

    // console.log("Payload", payload);

    const response = await EDPSavePanelDoc(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setModalHandlerState((val) => ({ ...val, show: false }));
      PanelDoc();
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSavePanel = async (data) => {
    // 
    if (!values?.Panel?.PanelID) {
      notify("Please Select Panel", "error");
      return;
    }

    const payload = {
      panelID: values?.Panel?.PanelID || 0,
      documentIDs: values?.docs?.map((doc) => doc.code) || [],
      panel2IDs: values?.modalData
        ? values?.modalData
            .filter((item) => item.isChecked)
            .map((item) => item.value)
        : [],
    };

    const response = await EDPSavePanelDocument(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialState);
      PanelDoc();
    } else {
      notify(response?.message, "error");
    }

    console.log("Payload", payload);
  };

  useEffect(() => {
    bindPanel();
    bindDoc();
    PanelDoc();
    CompareDetails();
  }, []);
  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={false}
        isBreadcrumb={true}
      />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Panel")}
          id="Panel"
          removeIsClearable={true}
          requiredClassName={"required-fields"}
          name="Panel"
          value={values?.Panel?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "All", value: "all" },
            ...(dropDownState?.Panel || []),
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <MultiSelectComp
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="docs"
          id="docs"
          placeholderName={t("Document Details")}
          dynamicOptions={dropDownState?.Doc}
          handleChange={handleMultiSelectChange}
          value={values?.docs}
        />
        <button className="btn btn-sm btn-success" onClick={handleModalState}>
          <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
        </button>
        {
          <button
            className="btn btn-sm btn-success ml-2"
            onClick={handleModalStateCreate}
          >
            {t("Apply to These Panel Also")}
          </button>
        }
        <button
          className="btn btn-sm btn-success ml-2"
          onClick={handleSavePanel}
        >
          {t("Save")}
        </button>
      </div>
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
          modalData={modalHandlerState?.modalData}
          buttonName={modalHandlerState?.buttonName}
          modalWidth={modalHandlerState?.size}
          Header={modalHandlerState?.header}
          footer={modalHandlerState?.footer}
          handleAPI={modalHandlerState?.handleAPI}
        >
          {modalHandlerState?.component}
        </Modal>
      )}
    </div>
  );
}
