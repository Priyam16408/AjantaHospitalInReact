import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  GetPurchaseOrderItems,
  GetPurchaseOrders,
} from "../../../networkServices/InventoryApi";
import { notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import { useSelector } from "react-redux";
import { DRUGCATEGORYMASTERMODAL_OPTIONS } from "../../../utils/constant";
import { bindFieldList } from "../../../networkServices/Emergency";

const DrugCategoryMasterModal = (
  {
    //   payload2,
    //   dataoption,
    //   setModalData,
    //   handeAdd,
  }
) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([
    {
      DrugCategoryName: "Painkillers",
      ColorCode: "#FF5733",
      IsPrescriptionRequired: "Yes",
      IsActive: "Yes",
    },
  ]);

  const [list, setList] = useState({});

  const [values, setValues] = useState({
    DrugCategory: "",
    PurchaseOrder: "",
    LedgerNumber: "",
    PrescriptionReq: "No",
    DrugCategoryColor: "",
  });
  const [dataoption, setDataoption] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  // const bindAllList = async () => {
  //   try {
  //     let data = await bindFieldList();
  //     if (data?.success) {
  //       setList((val) => ({
  //         ...val,
  //         statusList: data?.data?.filter((val) => val?.TypeID === 2),
  //         DrugCategoryColor: data?.data?.filter((val) => val?.TypeID === 1),
  //       }));
  //     } else {
  //       setList((val) => ({ ...val, statusList: [], DrugCategoryColor: [] }));
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const bindAllList = async () => {
    try {
      let data = await bindFieldList();
      if (data?.success) {
        const triageOptions = data.data
          .filter((item) => item?.TypeID === 1)
          .map((item) => ({
            ...item,
            value: item.ColorCode,
          }));

        setList((val) => ({
          ...val,
          statusList: data.data.filter((val) => val?.TypeID === 2),
          DrugCategoryColor: triageOptions,
        }));
      } else {
        setList((val) => ({
          ...val,
          statusList: [],
          DrugCategoryColor: [],
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    bindAllList();
    console.log(list, "list");
  }, []);

  // const handleReactSelect = (name, value) => {
  //   setValues((val) => ({ ...val, [name]: value?.value || "" }));
  // };

  const handleReactSelect = (name, selectedOption) => {
    setValues((prev) => ({
      ...prev,
      [name]: selectedOption?.value || "",
    }));
  };

  const { getBindPanelListData } = useSelector((state) => state?.CommonSlice);

  useEffect(() => {
    setList((val) => ({ ...val, panelList: getBindPanelListData }));
  }, [getBindPanelListData?.length]);

  const THEAD = [
    { name: "Sr.No", width: "4%" },
    { name: "Drug Category Name" },
    { name: "Preview Color" },
    { name: "Is prescription Required" },
    { name: "IsActive" },
    { name: "Edit", width: "4%" },
  ];

  const handleEdit = async (val) => {
    console.log("val", val);
    const purchaseOrderNumber = val?.PurchaseOrderNo;
    try {
      const response = await GetPurchaseOrderItems(purchaseOrderNumber);
      console.log("response", response);
      if (response?.data) {
        handeAdd(response?.data);
        setModalData({ visible: false });
      } else {
        notify(response?.data?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormatlabel = (name, label, rest) => {
    return (
      <div
        style={{
          backgroundColor: rest?.ColorCode,
          color: "#fff",
          margin: "-8px -12px",
          padding: "8px 12px",
          boxSizing: "border-box",
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <>
      <div className="row p-2">
        <Input
          type="text"
          className="form-control required-fields"
          id="DrugCategory"
          name="DrugCategory"
          onChange={handleChange}
          value={values?.DrugCategory}
          lable={t("Drug Category")}
          placeholder=" "
          respclass="col-xl-3 col-sm-4 col-md-4  col-12"
        />
        <ReactSelect
          placeholderName={t("Drug Category Color")}
          id={"DrugCategoryColor"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          dynamicOptions={list?.DrugCategoryColor}
          name={"DrugCategoryColor"}
          handleChange={handleReactSelect}
          value={`${values?.DrugCategoryColor}`}
          handleFormatlabel={handleFormatlabel}
        />

        <div className="d-flex  ">
          <span className="me-2">Color Preview:</span>
          <div
            style={{
              width: "170px",
              height: "24px",
              backgroundColor: values?.DrugCategoryColor,
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          ></div>
        </div>
        <LabeledInput
          label={data?.label}
          value={data?.value}
          className={"w-100"}
        />

        <ReactSelect
          placeholderName={t("Prescription Req.")}
          id={"PrescriptionReq"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={DRUGCATEGORYMASTERMODAL_OPTIONS}
          name="PrescriptionReq"
          handleChange={handleReactSelect}
          value={values?.PrescriptionReq}
          // requiredClassName="required-fields"
        />
      </div>

      <button className="btn btn-sm btn-success mx-1">{t("Save")}</button>
      <div className="row">
        <Tables
          thead={THEAD}
          tbody={
            Array.isArray(tableData)
              ? tableData?.map((ele, index) => ({
                  SrNo: index + 1,
                  DrugCategoryName: tableData?.DrugCategoryName,
                  PreviewColor: tableData?.PreviewColor,
                  IsPrescriptionRequired: tableData?.IsPrescriptionRequired,
                  IsActive: tableData?.IsActive,

                  edit: (
                    <i
                      className="fa fa-edit"
                      aria-hidden="true"
                      onClick={() => {
                        handleEdit(ele);
                      }}
                    ></i>
                  ),
                }))
              : []
          }
        />
      </div>
    </>
  );
};

export default DrugCategoryMasterModal;
