import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";

import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import {
  AddObservationHelp,
  BindHelp,
  BindInvestigationHelp,
  BindMapping,
  RemoveObservationHelp,
  SaveObservationHelp,
  UpdateObservationHelp,
} from "../../../networkServices/EDP/edpApi";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import LabobservationHelpAddModel from "./LabobservationHelpAddModel";
import Modal from "../../../components/modalComponent/Modal";
import EditHelpObservationModel from "./EditHelpObservation";

function AddInterpretation({ data }) {


  const [t] = useTranslation();
  const [bindInvestigation, setBindInvestigation] = useState([]);
  const [bindTableData, setBindTableData] = useState([]);
  const [modalData, setModalData] = useState({});
  const [handleModelData, setHandleModelData] = useState({});
  const [help, setHelp] = useState([]);
  const [values, setValues] = useState({
    investigation: "",
    Help: "",
  });

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const theadObservationhelp = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Name") },
    { width: "15%", name: t("Help") },
    { width: "1%", name: t("Remove") },
  ];
  const handleBindInvestigationHelp = async () => {
    try {
      const response = await BindInvestigationHelp();
      if (response.success) {
        console.log("the response from api is work", response);
        setBindInvestigation(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindInvestigation([]);
    }
  };

  const handleHelp = async () => {
    try {
      const response = await BindHelp();
      if (response.success) {
        setHelp(response?.data);
        console.log("the response from api is", response);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setHelp([]);
    }
  };

  const handleBindMapping = async () => {
    try {
      const response = await BindMapping(
        values?.investigation?.label,
        values?.investigation?.value
      );
      if (response.success) {
        console.log("the response from table api", response);
        setBindTableData(response?.data);
      } else {
        notify(response?.message, "error");
        setBindTableData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindTableData([]);
    }
  };

  const handleDelete = async (ID) => {
    try {
      const response = await RemoveObservationHelp(ID);
      if (response.success) {
        notify(response?.message, "success");
        handleBindMapping();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const handleSaveObservationHelp = async (data) => {
    console.log(values?.Help);
    const payload = {
      helpName: data?.add,
    };

    try {
      const apiResp = await SaveObservationHelp(payload);
      if (apiResp.success) {
        notify("record save successFully...", "success");
        setHandleModelData((val) => ({ ...val, isOpen: false }));
        handleHelp();
        setIsOpen()
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
    }
  };

  const handleAddObservationHelp = async () => {
    const payload = {
      selectedHelpIds: [
        {
          labObservationId: values?.investigation?.value,
          helpId: values?.Help?.value,
        },
      ],
    };

    try {
      const apiResp = await AddObservationHelp(payload);
      if (apiResp.success) {
        notify("record save successFully...", "success");
        handleBindMapping();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
    }
  };

  const updateHelpObservation = async (data) => {
      try {
      const apiResp = await UpdateObservationHelp({help:data?.HELP.replace(/#/g, ""),id:data?.ID});
      if (apiResp.success) {
        notify("record update successFully...", "success");
        handleHelp();
        setIsOpen()
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
    }

  }
  const handleChangeModel = (data) => {
    setModalData(data);
  };

  const handleAddobservation = (item) => {
    setHandleModelData({
      label: t("Add Help"),
      buttonName: t("Save"),
      width: "30vw",
      isOpen: true,
      Component: (
        <LabobservationHelpAddModel
          inputData={item}
          handleChangeModel={handleChangeModel}
        />
      ),
      handleInsertAPI: handleSaveObservationHelp,
      extrabutton: <></>,
    });
  };


  const editHelpObservation = (values) => {

    if (values?.Help?.value) {
      setHandleModelData({
        label: t("Edit Help"),
        buttonName: t("Update"),
        width: "30vw",
        isOpen: true,
        Component: <EditHelpObservationModel inputData={values?.Help} handleChangeModel={handleChangeModel} />,
        handleInsertAPI: updateHelpObservation,
        extrabutton: <></>,
      })
    } else {
      notify("Please Select Help Option", "error")
    }
  }

  useEffect(() => {
    handleBindInvestigationHelp();
    handleHelp();
  }, []);

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };
  useEffect(() => {
    handleBindMapping();
  }, [values?.investigation?.value]);
  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={data?.breadcrumb}
          // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
          data={data}
          isSlideScreen={true}
          isBreadcrumb={true}
        />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("Select an Observation")}
            id={"investigation"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="investigation"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                bindInvestigation,
                "Name",
                "LabObservation_ID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.investigation?.value}`}
          />

          <ReactSelect
            placeholderName={t("Select an Help")}
            id={"Help"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="Help"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(help, "HELP", "ID"),
            ]}
            handleChange={handleSelect}
            value={`${values?.Help?.value}`}
          />

          <div className="">
            <button
              onClick={handleAddObservationHelp}
              className="btn btn-sm btn-success ms-auto ml-2"
              type="button"
            >
              {t("Map")}
            </button>

            <button
              //   onClick={handleSaveInvestigation}
              onClick={() => {
                handleAddobservation();
              }}
              className="btn btn-sm btn-success ms-auto ml-2"
              type="button"
            >
              {t("Add New Help")}
            </button>

            <button
              onClick={() => { editHelpObservation(values) }}
              //   onClick={handleSaveInvestigation}
              className="btn btn-sm btn-success ms-auto ml-2"
              type="button"
            >
              {t("Edit Help")}
            </button>
          </div>
        </div>
        <Tables
          thead={theadObservationhelp}
          tbody={bindTableData?.map((val, index) => ({
            sno: index + 1,
            Name: val?.name,
            Help: val?.Help,
            cancel: (
              <i
                className="fa fa-trash p-1 text-danger"
                onClick={() => handleDelete(val?.id)}
              />
            ),
          }))}
          tableHeight={"scrollView"}
          style={{ height: "60vh", padding: "2px" }}
        />
      </div>
    </>
  );
}

export default AddInterpretation;
