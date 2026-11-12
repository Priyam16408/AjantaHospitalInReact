import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import WrapTranslate from "../../../components/WrapTranslate";
import { EDPGetDoctorVisitDetailAPI, EDPOPDVisitConfigSaveAPI } from "../../../networkServices/EDP/edpApi";
import { notify, OPDVisitConfigSavePayload } from "../../../utils/ustil2";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { BindDoctorDept, getBindCenterAPI } from "../../../networkServices/EDP/karanedp";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";

const Department = ({ data }) => {
  const [t] = useTranslation();
  const thead = [
    { name: "S.No.", width: "1%" }, { name: "Visit Type Name" }, { name: "Min Validity Days" }, { name: "Max Validity Days", width: "1%" }, { name: "Maximum Count", width: "1%" },
  ]
  const [dropDownData, setDropDownData] = useState({ CentreList: [], DoctorList: [] });
  const [bodyData, setBodyData] = useState([]);


  const [values, setValues] = useState({});
  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };




  const bindDropdownData = async () => {
    const [DoctorList, CentreList] = await Promise.all([
      BindDoctorDept("All"),
      getBindCenterAPI()
    ]);

    if (CentreList?.success) {
      setDropDownData((val) => ({ ...val, CentreList: handleReactSelectDropDownOptions(CentreList?.data, "CentreName", "CentreID") }))
    }

    if (DoctorList?.success) {
      setDropDownData((val) => ({ ...val, DoctorList: handleReactSelectDropDownOptions(DoctorList?.data, "Name", "DoctorID") }))
    }
  }

  useEffect(() => {
    bindDropdownData()
  }, [])




  const handleSearch = async () => {
    if (!values?.Centre?.value || !values?.Doctor?.value) {
      notify("Please select Centre and Doctor", "error")
      return
    }
    let apiResp = await EDPGetDoctorVisitDetailAPI(values?.Doctor?.value, values?.Centre?.value)
    if (apiResp?.success) {
      setBodyData(apiResp?.data)
    } else {
      setBodyData([])
      notify(apiResp?.message, "error")
    }

  }

  const handleCustomInput = (index, name, value) => {
    const data = JSON.parse(JSON.stringify(bodyData));
    data[index][name] = value;
    setBodyData(data);
  };

  const handleSave = async () => {
    const payload = OPDVisitConfigSavePayload(values, bodyData)
    let apiResp = await EDPOPDVisitConfigSaveAPI(payload)
    if (apiResp?.success) {
      notify(apiResp?.message)
    } else {
      notify(apiResp?.message, "error")
    }

  }


  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={false}
        frameName="EDP-ROLE"
        isBreadcrumb={true}
      />

      <div className="row p-2">

        <ReactSelect
          placeholderName={t("Centre")}
          id={"Centre"}
          requiredClassName={"required-fields"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          dynamicOptions={dropDownData?.CentreList}
          handleChange={handleSelect}
          value={`${values?.Centre?.value}`}
          name={"Centre"}
        />
        <ReactSelect
          placeholderName={t("Doctor")}
          id={"Doctor"}
          requiredClassName={"required-fields"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          dynamicOptions={dropDownData?.DoctorList}
          handleChange={handleSelect}
          value={`${values?.Doctor?.value}`}
          name={"Doctor"}
        />

        <button className="btn btn-sm btn-success px-4" type="button" onClick={handleSearch}>
          {t("Search")}
        </button>
      </div>
      <Tables style={{ maxHeight: "60vh" }} thead={WrapTranslate(thead, "name")} tbody={bodyData?.map((val, index) => ({
        SNo: index + 1,
        SubcategoryName: val?.SubcategoryName,
        MinValidityDays: val?.MinValidityDays,
        MaxValidityDays: <Input
          type="text"
          className="table-input"
          respclass={"w-100"}
          removeFormGroupClass={true}
          name={"MaxValidityDays"}
          value={val?.MaxValidityDays ? val?.MaxValidityDays : ""}
          onChange={(e) => { handleCustomInput(index, "MaxValidityDays", e.target.value) }}
        />,
        MaximumCount: <Input
          type="text"
          className="table-input"
          respclass={"w-100"}
          removeFormGroupClass={true}
          name={"MaximumCount"}
          value={val?.MaximumCount ? val?.MaximumCount : ""}
          onChange={(e) => { handleCustomInput(index, "MaximumCount", e.target.value) }}
        />,
      }))} />
      {bodyData?.length > 0 &&
        <div className="mt-1 mb-1  text-right">
          <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button " type="button" onClick={handleSave}>
            {t("Save")}
          </button>

        </div>}
    </div>
  );
};

export default Department;
