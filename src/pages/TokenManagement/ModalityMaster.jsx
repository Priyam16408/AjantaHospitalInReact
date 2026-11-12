import React, { useEffect, useState } from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Tables from "@app/components/UI/customTable";
import Input from "../../components/formComponent/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  getBindCentre,
  GetBindSubCatgeory,
} from "../../store/reducers/common/CommonExportFunction";
import { getBindFloor } from "../../store/reducers/TokenManagementSlice/CommonExportFunction";
import { useFormik } from "formik";
import { Save_Modality } from "../../utils/constant";
import {
  getModalitySearch,
  saveModalityData,
} from "../../networkServices/TokenManagement";
import { notify } from "../../utils/utils";
import ModalityMasterTable from "../../components/UI/customTable/TokenManagement/ModalityMasterTable/ModalityMasterTable";
const ModalityMaster = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const { getbindCentreData, GetBindSubCatgeoryData } = useSelector(
    (state) => state.CommonSlice
  );
  const { getBindFloorData } = useSelector((item) => item.TokenManagementSlice);
  const [apiData, setApiData] = useState({
    searchModilityData: [],
  });

  // add formik

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
    initialValues: Save_Modality,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const customerrors = ErrorHandling();
      if (Object.keys(customerrors)?.length > 1) {
        if (Object.values(customerrors)[0]) {
          notify(Object.values(customerrors)[1], "error");
          return;
        }
      }
      const updateAPI =
        values.btnvalue === "Update" ? String(values.modalityID) : "0";
      const newValues = {
        subcategoryid: String(
          values.subcategoryid.value || values.subcategoryid
        ),
        modalityName: values?.modalityName,
        floor: values.floor.label || "",
        floorid: String(values.floor.value || ""),
        roomno: values.roomno,
        modalityID: updateAPI,
        active: values.active.value || values.active,
        btnvalue: values.btnvalue,
        centreID: String(values.centreID.value || values.centreID),
      };
      console.log(newValues);

      try {
        const data = await saveModalityData(newValues);
        console.log(data);
        if (data?.success === true) {
          notify(data?.message, "success");
        } else if (data?.success === false) {
          notify(data?.message, "error");
        }
        handleGetSearchModilityData({ subcategoryid: 0, centreID: 1 });
        // handleGetSearchModilityData({
        //   subcategoryid: values.subcategoryid.value,
        //   centreID: values.centreID.value,
        // });
      } catch (err) {
        console.log(err);
      }
    },
  });

  const handleGetSearchModilityData = async (params) => {
    console.log(params);
    try {
      const data = await getModalitySearch(params);
      console.log(data);
      setApiData((prev) => ({ ...prev, searchModilityData: data.data }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetSearchModilityData({ subcategoryid: 0, centreID: 1 });
  }, []);

  // const handleReactSelectChange = (name, value) => {
  //   setFieldValue(name, value);
  //   console.log(name,value);

  //   // if(name === "subcategoryid" || name === "centreID")
  //   // {
  //   //   handleGetSearchModilityData({ subcategoryid: name === "subcategoryid" && value.value, centreID: name === "centreID" && value.value });
  //   // }
  //   // if (name === "subcategoryid" && values.centreID) {
  //   //   handleGetSearchModilityData({ subcategoryid: value.value, centreID: values.centreID.value });
  //   // } else if (name === "centreID" && values.subcategoryid) {
  //   //   handleGetSearchModilityData({ centreID: value.value, subcategoryid: values.subcategoryid.value });
  //   // }
  // };
  const handleReactSelectChange = (name, value) => {
    setFieldValue(name, value);
    console.log(name, value);

    const updatedValues = { ...values, [name]: value };

    if (name === "subcategoryid") {
      handleGetSearchModilityData({
        subcategoryid: value.value,
        centreID: updatedValues.centreID?.value || values.centreID,
      });
    } else if (name === "centreID") {
      handleGetSearchModilityData({
        centreID: value.value,
        subcategoryid:
          updatedValues.subcategoryid?.value || values.subcategoryid,
      });
    }
  };

  const handleEditData = (item) => {
    //console.log(item);
    setValues({
      subcategoryid: item.SubCategoryID,
      modalityName: item?.ModalityName,
      floor: item.FLOOR,
      floorid: "",
      roomno: item?.RoomNo,
      modalityID: item?.ID,
      active: item.Isactive,
      btnvalue: "Update",
      centreID: values.centreID,
    });
  };

  useEffect(() => {
    dispatch(getBindCentre());
    dispatch(
      GetBindSubCatgeory({
        Type: "1",
        CategoryID: "7",
      })
    );
    dispatch(getBindFloor());
  }, [dispatch]);


  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (!values.centreID) {
      errors.centreID = "Centre Name Is Required";
      errors.id[errors.id?.length] = "centreID";
    }
    return errors;
  };
  return (
    <>
      <div className="card patient_registration border">
        <form className="patient_registration card" onSubmit={handleSubmit}>
          <Heading isBreadcrumb={true} />
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2 p-2">
            <ReactSelect
              placeholderName={t("Centre")}
              id={"Center"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              dynamicOptions={getbindCentreData?.map((item) => {
                return {
                  label: item?.CentreName,
                  value: item?.CentreID,
                };
              })}
              requiredClassName="required-fields"
              handleChange={handleReactSelectChange}
              value={values.centreID}
              name="centreID"
            />
            <ReactSelect
              placeholderName={t("SubCategory")}
              id={"Sub category"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              dynamicOptions={[
                { label: "All", value: "0" },
                ...GetBindSubCatgeoryData?.map((item) => {
                  return {
                    label: item?.name,
                    value: item?.subCategoryID,
                  };
                }),
              ]}
              name="subcategoryid"
              value={values.subcategoryid}
              handleChange={handleReactSelectChange}
            />
            <Input
              type="text"
              className="form-control"
              id="modalityName"
              lable={t("ModalityName")}
              placeholder=" "
              // required={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="modalityName"
              value={values.modalityName}
              onChange={handleChange}
            />
            <ReactSelect
              placeholderName={t("Floor")}
              id={"floor"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              dynamicOptions={getBindFloorData?.length>0&&getBindFloorData?.map((ele) => {
                return {
                  label: ele?.NAME,
                  value: ele?.ID,
                };
              })}
              name="floor"
              value={values.floor}
              handleChange={handleReactSelectChange}
            />

            <Input
              type="text"
              className="form-control"
              id={"RoomNo"}
              lable={t("RoomNo")}
              placeholder=" "
              // required={true}
              name="roomno"
              value={values.roomno}
              onChange={handleChange}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <ReactSelect
              placeholderName={t("Status")}
              id={"Active"}
              searchable={true}
              respclass="col-xl-1 col-md-4 col-sm-6 col-12"
              dynamicOptions={[
                { value: "1", label: "Active" },
                { value: "0", label: "In Active" },
              ]}
              name="active"
              value={values.active}
              handleChange={handleReactSelectChange}
            />
            <div className="col-xl-1 col-md-2 col-sm-6 col-12 ">
              <button className="btn btn-sm btn-primary ml-2" type="submit">
                {/* {t("TokenManagement.ModilityMaster.btnName")} */}
                {t(values.btnvalue)}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="card patient_registration_card my-1 mt-2">
        <ModalityMasterTable
          tbody={apiData.searchModilityData}
          handleEditData={handleEditData}
        />
      </div>

      {/* <ExamCounterMasterTable /> */}
    </>
  );
};

export default ModalityMaster;
