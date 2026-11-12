import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { use } from "react";
import { GetBindAllCenter } from "../../../networkServices/commonApi";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import WrapTranslate from "../../../components/WrapTranslate";
import {
  CentreWiseItemSave,
  CentreWiseItemSearch,
  GetCategory,
  getSubCategory,
} from "../../../networkServices/EDP/edpApi";
import {
  CentreWiseItemPayload,
  CentreWiseItemSavePayload,
} from "../../../utils/ustil2";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
const { VITE_DATE_FORMAT } = import.meta.env;

export default function CentreWiseItemMapping({ data }) {
  const [t] = useTranslation();
  const [dropDownState, setDropDownState] = useState({
    GetBindAllCenter: [],
    category: [],
    subCategory: [],
  });
  let userData = useLocalStorage("userData", "get");
  const initialValues = {
    ItemCreationFrom: new Date(),
    center: { value: userData?.defaultCentre },
    ItemType: { value: "Both" },
    Category: { value: "" },
    SubCategory: { value: "0" },
    ItemName: "",
  };
  const [values, setValues] = useState(initialValues);
  const [bodyData, setBodyData] = useState([]);
  const handleReactChange = async (name, e) => {
    if (name === "Category") {
      let subCategory = await getSubCategory(e?.value);
      setDropDownState((val) => ({
        ...val,
        subCategory: handleReactSelectDropDownOptions(
          subCategory?.data,
          "displayName",
          "subCategoryID"
        ),
      }));
    }
    setValues((val) => ({ ...val, [name]: e }));
  };
  const thead = [
    { name: "S.No.", width: "1%" },
    { name: "Category" },
    { name: "Sub Category" },
    { name: "Item Name" },
    { name: "Is Active", width: "10%" },
  ];

  const getPurchaGetBindAllCenterAPI = async () => {
    try {
      Promise.all([GetBindAllCenter(), GetCategory()]).then(
        ([allCenter, category]) => {
          if (allCenter?.success) {
            setDropDownState((val) => ({
              ...val,
              GetBindAllCenter: handleReactSelectDropDownOptions(
                allCenter?.data,
                "CentreName",
                "CentreID"
              ),
              category: handleReactSelectDropDownOptions(
                category?.data,
                "categoryName",
                "categoryID"
              ),
            }));
          }
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getPurchaGetBindAllCenterAPI();
  }, []);

  const handleSearch = async () => {
    let payload = CentreWiseItemPayload(values);
    let apiResp = await CentreWiseItemSearch(payload);
    if (apiResp?.success) {
      setBodyData(apiResp?.data);
    } else {
      notify(apiResp?.message, "error");
    }
  };
  const handleActiveIActive = (name, e, index) => {
    let data = JSON.parse(JSON.stringify(bodyData));
    data[index][name] = e?.value;
    setBodyData(data);
  };
  const handleSave = async () => {
    let payload = CentreWiseItemSavePayload(values, bodyData);
    let apiResp = await CentreWiseItemSave(payload);
    if (apiResp?.success) {
      notify(apiResp?.message);
    } else {
      notify(apiResp?.message, "error");
    }
  };
  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
            data={data}
            isSlideScreen={true}
            isBreadcrumb={true}
          />

          <div className="row p-2">
            <ReactSelect
              requiredClassName="required-fields"
              placeholderName={t("Center To")}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id={"center"}
              name={"center"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={dropDownState?.GetBindAllCenter}
              value={values?.center?.value}
            />

            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id="ItemCreationFrom"
              name="ItemCreationFrom"
              value={
                values?.ItemCreationFrom
                  ? moment(values?.ItemCreationFrom).toDate()
                  : new Date()
              }
              // maxDate={new Date()}
              // handleChange={handleChange}
              lable={t("Item Creation From")}
              placeholder={VITE_DATE_FORMAT}
            />

            <ReactSelect
              requiredClassName="required-fields"
              placeholderName={t("Item Type")}
              searchable={true}
              respclass="col-xl-1 col-md-3 col-sm-6 col-12"
              id={"ItemType"}
              name={"ItemType"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={[
                { label: "Un Mapped", value: "unmapped" },
                { label: "Mapped", value: "mapped" },
                { label: "Both", value: "Both" },
              ]}
              value={values?.ItemType?.value}
            />
            <ReactSelect
              requiredClassName="required-fields"
              placeholderName={t("Category")}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id={"Category"}
              name={"Category"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={dropDownState?.category}
              value={values?.Category?.value}
            />
            <ReactSelect
              requiredClassName="required-fields"
              placeholderName={t("Sub Category")}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id={"SubCategory"}
              name={"SubCategory"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={[
                { label: "All", value: "0" },
                ...dropDownState?.subCategory,
              ]}
              value={values?.SubCategory?.value}
            />
            <Input
              type="text"
              className="form-control "
              id="ItemName"
              name="ItemName"
              value={values?.ItemName ? values?.ItemName : ""}
              onChange={(e) => {
                handleReactChange("ItemName", e?.target?.value);
              }}
              lable={t("Item Name")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            />
            <div className="col-xl-1 col-md-1 col-sm-2 col-3  mb-2">
              <button
                className="btn btn-sm btn-primary  w-100   "
                type="button"
                onClick={handleSearch}
              >
                {t("Search")}
              </button>
            </div>
          </div>

          <Tables
            thead={WrapTranslate(thead, "name")}
            tbody={bodyData?.map((ele, index) => ({
              "S.No.": index + 1,
              Category: ele?.Category,
              "Sub Category": ele?.SubCategory,
              "Item Name": ele?.TypeName,
              IsActive: (
                <CustomSelect
                  option={[
                    { label: "Y", value: "Y" },
                    { label: "N", value: "N" },
                  ]}
                  placeHolder={"Select"}
                  name="IsActive"
                  isRemoveSearchable={true}
                  value={ele?.IsActive}
                  onChange={(name, e) => handleActiveIActive(name, e, index)}
                />
              ),
            }))}
            style={{ maxHeight: "65vh" }}
          />
          {bodyData?.length > 0 && (
            <div
              className=" mb-2  text-right"
              style={{ borderTop: "1px solid lightgrey" }}
            >
              <button
                className="btn btn-sm btn-primary  px-5  mt-2 "
                type="button"
                onClick={handleSave}
              >
                {t("Save")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
