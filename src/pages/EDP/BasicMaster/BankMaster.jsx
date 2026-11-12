import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { useTranslation } from 'react-i18next';
import Input from '../../../components/formComponent/Input';
import { BindBank, SaveBank } from '../../../networkServices/EDP/pragyaedp';
import { notify } from '../../../utils/utils';

const BankMaster = ({ isUpdate , data }) => {
  const [t] = useTranslation();


  const initialState = {
    Edit: {
      label: "Add",
      value: "1",
    },
    Panel: {
      label: "Panel",
      value: "1",
    },
    Condition: {
      label: "Active",
      value: "1",
    }
  }


  const [values, setValues] = useState({
    Edit: initialState.Edit,
    Name: "",
    BankCut: "",
    department: "",
    Condition: initialState.Condition,
  });

  const [initialValue, setInitialValue] = useState({ ...initialState });

  const handleSelect = (name, value) => {

    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === "Edit") {
      setInitialValue(prev => ({
        ...prev,
        Edit: value
      }));
    }
  }

  const isEditMode = values?.Edit?.value === "2";

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const EditableOptions = [
    { label: "Add", value: "1" },
    { label: "Edit", value: "2" },
  ];

  const ConditionTYpe = [
    { label: "Active", value: "1" },
    { label: "DeActive", value: "0" },
    { label: "Both ", value: "2" }
  ]

  const IP = localStorage.getItem("ip");

  const handleSave = async () => {
    const payload = {
      "bankName": values?.Name,
      "ipAddress": IP,
      "bankcutper": values?.BankCut,
    }
    try {
      const apiResp = await SaveBank(payload);
      if (apiResp.success) {
        console.log("the apiresponse is in the table", apiResp.data);
        notify(apiResp?.message, "success");

        setValues({
          ...values,
          Name: "",
          BankCut: "",
        });
      } else {
        notify(apiResp?.message, "error");
        // setLoadSurgeryData([]);
      }
    } catch (error) {
      console.error("Error loading surgery data:", error);
      notify("An error occurred while loading surgery data", "error");

    }
  }

  // BindBank

const [tabledata,setTableData] = useState([]);
  
  const handleBindBank = async () => {
     
    try {
      const apiResp = await BindBank(values?.Name,values?.Condition?.value);
      if (apiResp.success) {  
      } else {
        notify(apiResp?.message, "error");
        // setLoadSurgeryData([]);
        setTableData(apiResp?.data);
      }
    } catch (error) {
      console.error("Error loading surgery data:", error);
      notify("An error occurred while loading surgery data", "error");

    }
  }


  const handleSearch = () => {
    console.log("Search with values:", values);
    notify("Searching for records...", "info");
  }
  return (
    <>
      <div className='mt-2 card'>
        <Heading isBreadcrumb={true} title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}/>
        <div className='row p-2'>

          <ReactSelect
            placeholderName={t("Type")}
            removeIsClearable={true}
            name="Edit"
            value={values?.Edit}
            handleChange={handleSelect}
            dynamicOptions={EditableOptions}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            defaultValue={initialState.Edit}
          />

          <Input
            type="text"
            className="form-control"
            id="Name"
            name="Name"
            value={values.Name}
            onChange={handleChange}
            lable={t("Name")}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />

          <Input
            type="text"
            className="form-control"
            id="BankCut"
            name="BankCut"
            value={values.BankCut}
            readOnly={isUpdate}
            lable={t("Bank Cut")}
            onChange={handleChange}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />

          {isEditMode && (
            <ReactSelect
              placeholderName={t("Condition")}
              removeIsClearable={true}
              name="Condition"
              value={values?.Condition}
              handleChange={handleSelect}
              dynamicOptions={ConditionTYpe}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
          )}
          {isEditMode ? (
            <button
              className="btn btn-sm btn-primary py-1 px-2 ml-2 mt-1"
              style={{ width: "70px" }}
              onClick={handleBindBank}
            >
              {t("Search")}
            </button>
          ) : (
            <button
              className="btn btn-sm btn-success py-1 px-2 ml-2 mt-1"
              style={{ width: "70px" }}
              onClick={handleSave}
            >
              {t("Save")}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
export default BankMaster;