import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import WrapTranslate from "../../../components/WrapTranslate";
import { EDPBindDocSpecializationAPI, EDPSaveORUpdateDocSpecializationURL } from "../../../networkServices/EDP/edpApi";
import { notify } from "../../../utils/ustil2";

const Specialization = ({ data }) => {
  const [t] = useTranslation();
  const thead = [
    { name: "S.No.", width: "1%" }, { name: "Specialization" }, { name: "Edit", width: "1%" },
  ]
  const [bodyData, setBodyData] = useState([]);


  const [values, setValues] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };


  const bindTableData = async () => {
    let apiResp = await EDPBindDocSpecializationAPI()
    if (apiResp?.success) {
      setBodyData(apiResp?.data)
    } else {
      setBodyData([])
    }
  }

  useEffect(() => {
    bindTableData()
  }, [])


  const handleEdit = (val) => {
    setValues({ NewSpecialization: val?.Name, ID: val?.ID,specialization:val?.Name })
  }

  const handleSaveOREdit = async () => {
    let payload = {}
    let url = ""
    if (values?.ID) {
      payload = {
        "id": Number(values?.ID),
        "docSpecializationName": String(values?.NewSpecialization),
        "specialization": String(values?.specialization),
      }
      url = "EDPUpdateDocSpecializationURL"
    } else {
      payload = { additionalProp3: String(values?.NewSpecialization) }
      url = "EDPSaveDocSpecializationURL"
    }
    let apiResp = await EDPSaveORUpdateDocSpecializationURL(payload, url)
    if (apiResp?.success) {
      bindTableData()
      notify(apiResp?.message)
      setValues({})
    }else{
      notify(apiResp?.message, "error")
    }
  }




  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        frameName="EDP-ROLE"
        isBreadcrumb={true}
      />

      <div className="row p-2">
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("New Specialization")}
          placeholder=" "
          id="NewSpecialization"
          name="NewSpecialization"
          onChange={handleInputChange}
          value={values?.NewSpecialization?values?.NewSpecialization:""}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <button className="btn btn-sm btn-success px-4" type="button" onClick={handleSaveOREdit}>
          {t(values?.ID ? "Update" : "Save")}
        </button>
      </div>
      <Tables style={{ maxHeight: "60vh" }} thead={WrapTranslate(thead, "name")} tbody={bodyData?.map((val, index) => ({
        SNo: index + 1,
        Name: val?.Name,
        Delete: <i className='fa fa-edit' onClick={() => handleEdit(val)}></i>
      }))} />

    </div>
  );
};

export default Specialization;
