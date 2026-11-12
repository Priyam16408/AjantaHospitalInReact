import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import NewFloorModal from "./NewFloorModal";
import Modal from "../../../components/modalComponent/Modal";

const CreateFreezer = () => {
  const [t] = useTranslation();
  const [values, setValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const THEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Rack Name" },
    { name: "Rack No." },
    { name: "Floor" },
    { name: "Room No." },
    { name: "Description" },
    { name: "For Muslims" },
    { name: "Active" },
    { name: "Edit" },
  ];

  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });

  const handleModalState = (item) => {
    setModalHandlerState({
      show: true,
      header: t("Add New Floor"),
      size: "40vw",
      component: <NewFloorModal />,
      footer: <></>,
    });
  };

  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });

    const handleInputChange = (e, index, label) => {
      const { name, value } = e.target;
      setValues((val) => ({ ...val, [label]: value }));
    };
  };

  return (
    <div className="card">
      <Heading title={""} isBreadcrumb={true} />
      <div className="row p-2">
        <div className="col-xl-2 col-md-4 col-sm-6 col-12">
          <div className="row">
            <ReactSelect
              placeholderName={t("Floor")}
              id="Floor"
              searchable={true}
              value={values?.Floor?.value}
              handleChange={handleReactSelect}
              respclass="col-sm-10 col-lg-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10 col-11"
            />
            <button
              className="btn btn-sm  btn-primary"
              onClick={handleModalState}
            >
              <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
            </button>
          </div>
        </div>
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Room No.")}
          placeholder=" "
          name="RoomNo"
          onChange={(e) => handleInputChange(e, 0, "RoomNo")}
          value={values?.RoomNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Rack Name")}
          placeholder=" "
          name="RackName"
          onChange={(e) => handleInputChange(e, 0, "RackName")}
          value={values?.RackName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Rack No.")}
          placeholder=" "
          name="RackNo"
          onChange={(e) => handleInputChange(e, 0, "RackNo")}
          value={values?.RackNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Shelf No.")}
          placeholder=" "
          name="ShelfNo"
          onChange={(e) => handleInputChange(e, 0, "ShelfNo")}
          value={values?.ShelfNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("For Muslims")}
          id="ForMuslims"
          searchable={true}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          value={values?.ForMuslims?.value}
          handleChange={handleReactSelect}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Description")}
          placeholder=" "
          name="Description"
          onChange={(e) => handleInputChange(e, 0, "Description")}
          value={values?.Description}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Status")}
          id="Status"
          searchable={true}
          dynamicOptions={[
            { label: "Active", value: "1" },
            { label: "Deactive", value: "0" },
          ]}
          value={values?.Status?.value}
          handleChange={handleReactSelect}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button className="btn btn-sm  btn-primary btn-success ml-2">
          {t("Save")}
        </button>
      </div>

      {tableData?.length > 0 && (
        <>
          <Heading title={"Rack Details"} isBreadcrumb={false} />
          <Tables
            thead={THEAD}
            tbody={tableData?.map((ele, index) => ({
              Sno: index + 1,
            }))}
            style={{ maxHeight: "65vh" }}
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
    </div>
  );
};

export default CreateFreezer;
