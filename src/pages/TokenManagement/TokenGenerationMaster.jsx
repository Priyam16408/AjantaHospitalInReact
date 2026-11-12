import React, { useEffect, useState } from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Tables from "@app/components/UI/customTable";
import TokenGenerationMasterTable from "../../components/UI/customTable/TokenManagement/TokenGenerationMasterTable/index";
import Input from "../../components/formComponent/Input";
import Button from "../../components/formComponent/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  getBindCentre,
  GetBindSubCatgeory,
} from "../../store/reducers/common/CommonExportFunction";
import { getBindCategory } from "../../store/reducers/TokenManagementSlice/CommonExportFunction";
import {
  checkTokenPrefixNameExits,
  findGetCategoryName,
  getBindGetGroupName,
  getBindSubCategoryName,
  getDataBindDetail,
  GropuNameCheckExits,
  saveTokenMasterDetail,
} from "../../networkServices/TokenManagement";
import { useFormik } from "formik";
import { Reciept_Token_Master } from "../../utils/constant";
import GenerateMaster from "../../components/UI/customTable/TokenManagement/TokenGenerationMasterTable/GenerateMaster";
import { notify } from "../../utils/utils";
import MultiSelectComp from "../../components/formComponent/MultiSelectComp";
const TokenGenerationMaster = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const { getbindCentreData, GetBindSubCatgeoryData } = useSelector(
    (state) => state.CommonSlice
  );
  // console.log(GetBindSubCatgeoryData);
  const { getBindCategoryData } = useSelector(
    (state) => state.TokenManagementSlice
  );
  const [selectTokenMaster, SetSelectTokenMaster] = useState("Category");
  const [apiData, setApiData] = useState([]);
  const [multiselectState, setMultiSelectState] = useState([]);
  const [dataset, setDataSet] = useState([]);
  // Formik Add

  const {
    handleChange,
    values,
    setFieldValue,
    setValues,
    handleSubmit,
    errors,
    touched,
    validateForm,
    resetForm,
  } = useFormik({
    initialValues: Reciept_Token_Master,
    enableReinitialize: true,
    onReset: true,
    onSubmit: async (values) => {
      const customerrors = ErrorHandling();
      if (Object.keys(customerrors)?.length > 1) {
        if (Object.values(customerrors)[0]) {
          notify(Object.values(customerrors)[1], "error");
          return;
        }
      }

      const newValues = {
        centre: values.centre.label,
        centreID: String(values.centre.value),
        category: values.category.label,
        categoryID: values.category.value,
        resetTime: values.resetTime.label,
        groupName: values.groupName,
        tokenPrefix: values.tokenPrefix,
        mainCategoryName: selectTokenMaster,
      };
      console.log(newValues);
      const RES = await GropuNameCheckExits({
        groupName: newValues.groupName,
        centreID: newValues.centreID,
      });
      const TokenNameCheck = await checkTokenPrefixNameExits({
        Prefix: newValues.tokenPrefix,
        centreID: newValues.centreID,
      });
      if (RES.success) {
        notify(
          "Group name is already exits please try to another name",
          "error"
        );
      } else if (TokenNameCheck.success) {
        notify(
          "Token name is already exits please try to another name",
          "error"
        );
      }
      if (RES.success === false && TokenNameCheck.success === false) {
        setDataSet([...dataset, newValues]);
        resetForm();
      }
    },
  });

  const handleMultiSelectChange = (e) => {
    console.log("Selected Values:", e.value);
    setMultiSelectState(e.value);
    const groupNames = e.value.map((option) => option.name).join(", ");
    setFieldValue("groupName", groupNames);
  };
  const handleReactSelectChange = async (name, e) => {
    setFieldValue(name, e);
    switch (name) {
      case "category":
        const { data } = await getDataBindDetail(e.value);
        const dataRes = await findGetCategoryName(e.value);

        const apiDataResponseFromAPI = [];

        for (const key of data) {
          const GetSubCategoryNameData = await getBindSubCategoryName(
            key.SubCategoryID
          );
          const GetgetBindGetGroupName = await getBindGetGroupName(key.GroupID);
          apiDataResponseFromAPI.push({
            ...key,
            getCategoryName: dataRes?.data,
            subCategoryName:
              typeof GetSubCategoryNameData?.data === "string"
                ? GetSubCategoryNameData?.data
                : "",
            groupName:
              typeof GetgetBindGetGroupName?.data === "string"
                ? GetgetBindGetGroupName?.data
                : "",
          });
        }

        setApiData(apiDataResponseFromAPI);

        if (selectTokenMaster === "SubCategory") {
          dispatch(
            GetBindSubCatgeory({
              Type: 1,
              CategoryID: e.value,
            })
          );
        }
    }
  };

  const handleChangeCategoryType = (name, e) => {
    SetSelectTokenMaster(e.value);
  };

  const handleSaveTokenMasterData = async () => {
    try {
      for (const data of dataset) {
        const saveData = {
          tokentype: selectTokenMaster,
          catId: data.categoryID,
          subcatid: "",
          seq: data.tokenPrefix,
          resettype: data.resetTime,
          groupname: data.groupName,
          modalityName: "",
          modalityID: "",
          centreID: String(data.centreID),
        };
        await saveTokenMasterDetail(saveData);
        // getDataBindDetail(data.categoryID);
      }
      // if (dataset.length > 0) {
      //   const firstCategoryID = dataset[0].categoryID;
      //   getDataBindDetail(firstCategoryID);
      // }
    } catch (error) {}
  };

  // const bindDetailListData = async (params) => {
  //   try {
  //     const data = await getDataBindDetail(params);
  //     setApiData((prev) => ({ ...prev, getBindDetailData: data.data }));
  //   } catch (err) {
  //     console.log(err);
  //   }

  // };

  const handleDelete = (index) => {
    const newDataSet = dataset.filter((_, i) => i !== index);
    setDataSet(newDataSet);
  };
  useEffect(() => {
    dispatch(getBindCentre());
    dispatch(getBindCategory());
  }, []);

  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (!values.centre) {
      errors.centre = "Centre Name Is Required";
      errors.id[errors.id?.length] = "centre";
    }
    if (!values.category) {
      errors.category = "Category Name Is Required";
      errors.id[errors.id?.length] = "category";
    }
    if (!values.resetTime) {
      errors.resetTime = "Time  Is Required";
      errors.id[errors.id?.length] = "resetTime";
    }
    if (!values.groupName) {
      errors.groupName = "Gropu Name  Is Required";
      errors.id[errors.id?.length] = "groupName";
    }
    if (!values.tokenPrefix) {
      errors.tokenPrefix = "Token Name Is Required";
      errors.id[errors.id?.length] = "tokenPrefix";
    }

    return errors;
  };
  return (
    <>
      <div className="card pt-2">
        <form className=" card" onSubmit={handleSubmit}>
          <Heading isBreadcrumb={true} />
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2 p-2">
            <ReactSelect
              placeholderName={t("Centre")}
              id={"Centre"}
              searchable={true}
              name="selectTokenMaster"
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={[
                { label: "Category Wise", value: "Category" },
                { label: "Sub Category Wise", value: "SubCategory" },
              ]}
              value={selectTokenMaster}
              handleChange={handleChangeCategoryType}
            />
            <ReactSelect
              placeholderName={t("Centre")}
              id={"Centre"}
              searchable={true}
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={getbindCentreData?.map((item) => {
                return {
                  label: item?.CentreName,
                  value: item?.CentreID,
                };
              })}
              name="centre"
              value={values.centre}
              handleChange={handleReactSelectChange}
              requiredClassName="required-fields"
            />
            <ReactSelect
              placeholderName={t("Category")}
              id={"Centre"}
              searchable={true}
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={getBindCategoryData?.map((item) => {
                return {
                  label: item?.name,
                  value: item?.categoryID,
                };
              })}
              name="category"
              value={values.category}
              handleChange={handleReactSelectChange}
              requiredClassName="required-fields"
            />

            {GetBindSubCatgeoryData.length > 0 &&
              selectTokenMaster === "SubCategory" && (
                <MultiSelectComp
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  dynamicOptions={GetBindSubCatgeoryData?.map((item) => ({
                    name: item.name,
                    code: item.subCategoryID,
                  }))}
                  handleChange={handleMultiSelectChange}
                  value={multiselectState}
                  name="multiselectState"
                  placeholderName="Sub Category"
                />
              )}
            <ReactSelect
              placeholderName={t("Reset_Time")}
              id={"Centre"}
              searchable={true}
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={[
                { label: "Day", value: "Day" },
                { label: "Month", value: "Month" },
                { label: "Year", value: "Year" },
              ]}
              name="resetTime"
              value={values.resetTime}
              handleChange={handleReactSelectChange}
              requiredClassName="required-fields"
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="RoomName"
              name="groupName"
              lable={t("GroupName")}
              placeholder=" "
              // required={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              onChange={handleChange}
              value={values.groupName}
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="token"
              name="tokenPrefix"
              lable={t("Token_Prefix")}
              onChange={handleChange}
              value={values.tokenPrefix}
              placeholder=" "
              // required={true}
              respclass="col-xl-1 col-md-3 col-sm-4 col-12"
            />

            <div className="col-xl-1 col-md-2 col-sm-6 col-12">
              <button className="btn btn-sm btn-primary ml-2" type="submit">
                {t("Save")}
              </button>
            </div>
          </div>
        </form>
      </div>

      {dataset.length > 0 && (
        <GenerateMaster tbody={dataset} handleDelete={handleDelete} />
      )}
      {dataset.length > 0 && (
        <div className="col-xl-12 col-md-2 col-sm-6 col-12 text-center">
          <button
            className="btn btn-sm btn-primary ml-2"
            type="submit"
            onClick={handleSaveTokenMasterData}
          >
            {t("Save")}
          </button>
        </div>
      )}

      <TokenGenerationMasterTable tbody={apiData} />
    </>
  );
};

export default TokenGenerationMaster;
