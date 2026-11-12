import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import {
  EDPBindGrid,
  EDPSaveDiscountReasonMaster,
  EDPUpdateDiscountReasonMaster,
} from "../../../networkServices/EDP/govindedp";
import { notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import EDPSeeMoreList from "../EDPSeeMoreList";
import SlideScreen from "../../../components/front-office/SlideScreen";
import SeeMoreSlideScreen from "../../../components/UI/SeeMoreSlideScreen";

const DiscountRefundMaster = ({ data }) => {
  const [t] = useTranslation();

  const THEAD = [
    { name: "S.No", width: "5%" },
    { name: "Type", width: "10%" },
    { name: "Discount Reason", width: "10%" },
    { name: "Active", width: "10%" },
    { name: "Update", width: "10%" },
  ];

  const [visible, setVisible] = useState(false);
  const [seeMore, setSeeMore] = useState([]);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const [tableData, setTableData] = useState([]);
  console.log("tableData", tableData);
  const initialState = {
    selectType: {
      label: "New",
      value: "1",
    },
    DandR: "",
  };

  const [values, setValues] = useState({ ...initialState });
  console.log("Values", values);

  const handleReactSelect = (label, value) => {
    if (label == "selectType") {
      setTableData([]);
    }
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleSave = async () => {

    if(values?.DandR === "" || values?.Type?.value === "" ){
      notify("Please fill all the fields", "error");
      return
    }
    console.log("Values inside", values);
    const payloadToBe = {
      discountReason: values?.DandR,
      type: values?.Type?.value,
    };

    const response = await EDPSaveDiscountReasonMaster(payloadToBe);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialState);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSearch = async () => {
    if(values?.Type?.value == ""){
      notify("Please select Type", "error");
      return
    }
    const Type = values?.Type?.value ? values?.Type?.value : "";
    const response = await EDPBindGrid(Type);

    if (response?.success) {
      notify(response?.message, "success");
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

  const handleInputTableChange = (e, index, label) => {
    // 
    const updatedData = [...tableData];
    const inputValue = e.target.value;

    updatedData[index][label] = inputValue;
    setTableData(updatedData);
  };

  const handleUpdate = (data) => {
    ;
    const payloadToBe = {
      discountReason: data?.DiscountReason,
      type: data?.TYPE,
      isactive: data?.Active === "Yes" ? "1" : "0",
      id: data?.ID,
    };
    const response = EDPUpdateDiscountReasonMaster(payloadToBe);

    if (response?.success) {
      notify(response?.message, "success");
      handleSearch();
    } else {
      notify(response?.message, "error");
    }
  };

  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };
  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
        secondTitle={
          <>
            <EDPSeeMoreList
              ModalComponent={ModalComponent}
              setSeeMore={setSeeMore}
              data={{}}
              isRemoveSvg={true}
              setVisible={() => {
                setVisible(false);
              }}
              handleBindFrameMenu={[
                {
                  FileName: "Copy Rates",
                  URL: "CopyRate",
                  FrameName: "Copy Rates",
                  Description: "Copy Rates",
                  header: true,
                },
              ]}
              openFirstItem={false}
              name={
                <button className="btn text-white"> {t("Create Item")} </button>
              }
            />
          </>
        }
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
        <ReactSelect
          placeholderName={t("Type")}
          requiredClassName="required-fields"
          name="Type"
          value={values?.Type?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "OPD", value: "OPD" },
            { label: "IPD", value: "IPD" },
            { label: "Refund", value: "Refund" },
            { label: "WriteOff", value: "WriteOff" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {values?.selectType?.value == 1 && (
          <Input
            type="text"
            className={"form-control required-fields"}
            lable={t("Discount & Refund Reason")}
            placeholder=" "
            name="DandR"
            onChange={(e) => handleInputChange(e, 0, "DandR")}
            value={values?.DandR}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={values?.selectType?.value == 1 ? handleSave : handleSearch}
        >
          {values?.selectType?.value == 1 ? t("Save") : t("Search")}
        </button>
      </div>
      {tableData?.length > 1 && (
        <div className="card">
          <Tables
            thead={THEAD}
            tbody={tableData?.map((ele, index) => ({
              Sno: index + 1,
              Type: ele?.TYPE,
              DiscountReason: (
                <Input
                  type="text"
                  className="table-input"
                  respclass={"w-100"}
                  removeFormGroupClass={true}
                  display={"right"}
                  placeholder={""}
                  name={"DiscountReason"}
                  value={ele?.DiscountReason}
                  onChange={(e) =>
                    handleInputTableChange(e, index, "DiscountReason")
                  }
                />
              ),
              IsActive: (
                <CustomSelect
                  option={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                  placeHolder={t("IsActive")}
                  value={ele?.Active === "Yes" ? "Yes" : "No"}
                  // value={"0"}
                  isRemoveSearchable={true}
                  name="Active"
                  onChange={(name, e) =>
                    handleCustomReactSelect(index, name, e)
                  }
                />
              ),
              Update: (
                <div
                  className="fa fa-edit"
                  onClick={() => handleUpdate(ele)}
                ></div>
              ),
            }))}
            style={{ height: "70vh" }}
          />
          {/* <div className="col-xl-2 col-md-4 col-sm-6 col-12 p-2">
            <button
              className=" btn btn-sm btn-success ml-2 px-3"
              // onClick={handleSave}
            >
              {t("Save")}
            </button>
          </div> */}
        </div>
      )}
      <SlideScreen
        visible={visible}
        setVisible={() => {
          setVisible(false);
          setRenderComponent({
            name: null,
            component: null,
          });
        }}
        Header={
          <SeeMoreSlideScreen
            name={renderComponent?.name}
            seeMore={seeMore}
            handleChangeComponent={handleChangeComponent}
          />
        }
      >
        {renderComponent?.component}
      </SlideScreen>
    </div>
  );
};
export default DiscountRefundMaster;
