import React, { useState, useEffect } from "react";
import Heading from "../../../components/UI/Heading";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import {
  AccessMasterSaveMapping,
  BindBackendData,
  BindMainCenter,
} from "../../../networkServices/Pettycash";
import Tables from "../../../components/UI/customTable";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

function PettyCashAccessMaster() {
  const [t] = useTranslation();
  const [centerName, setBindCenter] = useState([]);
  const [pettyName, setPettyName] = useState([]);
  const [bindata, setBindData] = useState([]);
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const [isHeaderVerifyChecked, setIsHeaderVerifyChecked] = useState(false);
  const [isHeaderAuthChecked, setIsHeaderAuthChecked] = useState(false);
  const [coid, setCoid] = useState([]);

  
  const isMobile = window.innerWidth <= 800;
  const userData = useLocalStorage("userData", "get");

  const [values, setValues] = useState({
    center: { value: userData?.centreID },
    cashChart: "",
  });
  console.log("ddd", values);
  const handleChangeCheckboxHeader = (e) => {
    const isChecked = e.target.checked;
    setIsHeaderChecked(isChecked);

    const updatedData = bindata.map((val) => ({
      ...val,
      isChecked: isChecked,
    }));
    setBindData(updatedData);
  };

  const handleChangeCheckboxHeaderVerify = (e) => {
    const isChecked = e.target.checked;
    setIsHeaderVerifyChecked(isChecked);

    const updatedData = bindata.map((val) => ({
      ...val,
      IsVerify: isChecked ? 1 : 0,
    }));
    setBindData(updatedData);
  };

  const handleChangeCheckboxHeaderAuth = (e) => {
    const isChecked = e.target.checked;
    setIsHeaderAuthChecked(isChecked);

    const updatedData = bindata.map((val) => ({
      ...val,
      IsAuth: isChecked ? 1 : 0,
    }));
    setBindData(updatedData);
  };

  const handleChangeCheckbox = (e, index) => {
    const updatedData = [...bindata];
    updatedData[index].isChecked = e.target.checked;
    setBindData(updatedData);

    const allChecked = updatedData.every((item) => item.isChecked);
    setIsHeaderChecked(allChecked);
  };

  const handleChangeCheckboxVerify = (e, index) => {
    const updatedData = [...bindata];
    updatedData[index].IsVerify = e.target.checked ? 1 : 0;
    setBindData(updatedData);

    const allChecked = updatedData.every((item) => item.IsVerify === 1);
    setIsHeaderVerifyChecked(allChecked);
  };

  const handleChangeCheckboxAuth = (e, index) => {
    const updatedData = [...bindata];
    updatedData[index].IsAuth = e.target.checked ? 1 : 0;
    setBindData(updatedData);

    const allChecked = updatedData.every((item) => item.IsAuth === 1);
    setIsHeaderAuthChecked(allChecked);
  };

  const theadBindDetail = [
    { width: "5%", name: t("SNo") },
    {
      width: "5%",
      name: isMobile ? (
        t("Access")
      ) : (
        <input
        type="checkbox"
        checked={isHeaderChecked}
        onChange={handleChangeCheckboxHeader}
      />
      ),
    },
    { 
      width: "5%",
      name: isMobile ? (
        t("Verify")
      ) : (
        <input
        type="checkbox"
        checked={isHeaderVerifyChecked}
        onChange={handleChangeCheckboxHeaderVerify}
      />
      ),
    },
    {


      width: "5%",
      name: isMobile ? (
        t("Auth")
      ) : (
        <input
            type="checkbox"
            checked={isHeaderAuthChecked}
            onChange={handleChangeCheckboxHeaderAuth}
          />
      ), 
    },
    { width: "5%", name: t("Employee Id") },
    { width: "15%", name: t("Employee Name") },
    { width: "15%", name: t("Entry Date") },
    { width: "15%", name: t("Entry By") },
  ];

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleBindMainCenter = async () => {
    try {
      const response = await BindMainCenter();
      if (response.success) {
        setBindCenter(response.data);
      } else {
        setBindCenter([]);
      }
    } catch (error) {
      setBindCenter([]);
    }
  };

  const handleBindBackendData = async () => {
    let payload = {
      filterType: 1,
      centreID: values?.center?.value,
      coaid: 0,
    };
    let apiResp = await BindBackendData(payload);

    if (apiResp?.success) {
      setCoid(apiResp.data[0].ValueField);
      setPettyName(apiResp.data);
    } else {
      notify(apiResp?.message, "error");
    }
  };

  const displayBindBackendData = async () => {
    let payload = {
      filterType: 2,
      centreID: values?.center?.value,
      coaid: coid,
    };
    let apiResp = await BindBackendData(payload);

    if (apiResp?.success) {
      setBindData(
        apiResp.data.map((item) => ({
          ...item,
          isVerify: 0,
          isAuth: 0,
        }))
      );
    } else {
      notify(apiResp?.message, "error");
    }
  };

  const handleSave = async () => {
    let RecPayload = {
      pccoaid: coid,
      empMappingList: bindata
        .filter((val) => val.isChecked)
        .map((val) => ({
          pccoaid: coid,
          employeeID: val.EmployeeID,
          isVerify: val.IsVerify,
          isAuth: val.IsAuth,
        })),
    };

    try {
      const ReciveResp = await AccessMasterSaveMapping(RecPayload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.message}`, "success");
        handleBindMainCenter();
        handleBindBackendData();
        displayBindBackendData();
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      notify("Some error occurred", "error");
    }
  };
 

  useEffect(() => {
    handleBindMainCenter();
    handleBindBackendData();
    displayBindBackendData();
  }, [values]);

  return (
    <div className="m-2 spatient_registration_card card">
      <Heading
        title={t("/Sample Management/Sample Collection")}
        isBreadcrumb={true}
      />
      <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
        <ReactSelect
          placeholderName={t("Petty Cash A/C")}
          id={"center"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          dynamicOptions={handleReactSelectDropDownOptions(
            centerName,
            "CentreName",
            "MainCentreID"
          )}
          handleChange={handleSelect}
          value={`${values?.center?.value}`}
          name={"center"}
        />

        <ReactSelect
          placeholderName={t("Petty Cash Chart Of A/C")}
          id="cashChart"
          handleChange={handleSelect}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          dynamicOptions={handleReactSelectDropDownOptions(
            pettyName,
            "TextField",
            "TypeID"
          )}
          name="cashChart"
        />
        <div className="col-sm-4">
          {bindata.length > 0 && (
            <button
              className="btn btn-lg btn-success"
              type="button"
              onClick={handleSave}
            >
              {t("Save")}
            </button>
          )}
        </div>
      </div>

      {bindata.length > 0 && (
        <div className="card">
          <Tables
            thead={theadBindDetail}
            tbody={bindata.map((val, index) => ({
              sno: index + 1,
              Access: (
                <input
                  type="checkbox"
                  checked={val.isChecked}
                  onChange={(e) => handleChangeCheckbox(e, index)}
                />
              ),
              Verify: (
                <input
                  type="checkbox"
                  checked={val.IsVerify === 1}
                  onChange={(e) => handleChangeCheckboxVerify(e, index)}
                />
              ),
              Auth: (
                <input
                  type="checkbox"
                  checked={val.IsAuth === 1}
                  onChange={(e) => handleChangeCheckboxAuth(e, index)}
                />
              ),
              EmployeeId: val.EmployeeID,
              EmpName: val.EmployeeName,
              EntryDate: val.EntryDate,
              EntryBy: val.EntryBy,
            }))}
          />
        </div>
      )}
    </div>
  );
}

export default PettyCashAccessMaster;
