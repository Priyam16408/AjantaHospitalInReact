import React, { useEffect, useState } from "react";
import SelectableBadge from "../../../components/UI/EDP/SelectedBadge";
import Heading from "../../../components/UI/Heading";
import {
  EDPgetSetCentre,
  EDPGetUserAccess,
  EDPSaveUserRoles,
} from "../../../networkServices/EDP/edpApi";
import Tables from "../../../components/UI/customTable";
import { notify } from "../../../utils/utils";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";

const CentreAccess = (data) => {
  const [t] = useTranslation();
  const [centers, setCenters] = useState([]);
  console.log("centersFromAPI", centers);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    console.log("tableData", tableData);
  }, [tableData]);

  const [enable, setEnable] = useState(false);

  const [selectedCenters, setSelectedCenters] = useState([]);
  const [allCentre, setAllCentre] = useState([]);
  // console.log("SelectedCentres", selectedCenters);
  const [currentCenter, setCurrentCenter] = useState([]);
  // console.log("currentCentre" , currentCenter)
  const [checkedColumns, setCheckedColumns] = useState({});
  const [values, setValues] = useState({});

  const isMobile = window.innerWidth <= 800;

  //   useEffect(() => {
  //     const fetchCenters = async () => {
  //       const empId = data?.data?.EmployeeID;
  //       const response = await EDPgetSetCentre(empId);
  //       if (response?.success) {
  //         setCenters(response?.data);
  //       } else {
  //         notify(response?.message, "error");
  //       }
  //     };

  //     const fetchUserAccess = async () => {
  //       const empID = data?.data?.EmployeeID;
  //       const response = await EDPGetUserAccess(empID);
  //       if (response?.success) {
  //         setTableData(response?.data);
  //       } else {
  //         notify(response?.message, "error");
  //       }
  //     };

  //     fetchCenters();
  //     fetchUserAccess();
  //   }, []);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setValues({ ...values, [name]: type === "checkbox" ? checked : value });
  };

  useEffect(() => {
    const fetchCenters = async () => {
      const empId = data?.data?.EmployeeID;
      const response = await EDPgetSetCentre(empId);
      if (response?.success) {
        setCenters(response?.data);

        // Automatically select centres with CentreSet = "TRUE"
        const preSelectedCenters = response?.data
          .filter((center) => center.CentreSet === "TRUE")
          .map((center) => center.CentreName);
        // 
        console.log("preSelectedCenters", preSelectedCenters);
        setSelectedCenters(preSelectedCenters);
      } else {
        notify(response?.message, "error");
      }
    };

    const fetchUserAccess = async () => {
      const empID = data?.data?.EmployeeID;
      const response = await EDPGetUserAccess(empID);
      if (response?.success) {
        // const responseData = response?.data;
        setTableData(response?.data);
      } else {
        notify(response?.message, "error");
      }
    };

    fetchCenters();
    fetchUserAccess();
  }, [selectedCenters?.length]);

  const handleSelectCenter = (label, isSelected) => {
    setSelectedCenters((prev) =>
      isSelected ? [...prev, label] : prev.filter((center) => center !== label)
    );

    setCheckedColumns((prev) => ({
      ...prev,
      [label]: false,
    }));
  };

  const handleColumnCheck = (center) => {
    setCheckedColumns((prev) => {
      const isChecked = !prev[center];

      setTableData((prevData) =>
        prevData.map((row) => {
          let key = Object.keys(row).find((k) => k.startsWith(center));
          if (key) {
            return { ...row, [key]: isChecked ? 1 : 0 };
          }
          return row;
        })
      );

      return { ...prev, [center]: isChecked };
    });
  };

  const handleRowCheck = (center, index, key, e) => {
    // 
    let data = JSON.parse(JSON.stringify(tableData));
    data[index][key] = e?.target?.checked;
    setTableData(data);
    // setTableData((prevData) =>
    //   prevData.map((row, i) =>
    //     i === index ? { ...row, [center]: !row[center] } : row
    //   )
    // );
  };

  const THEAD = [
    { name: t("S.No"), width: "5%" },
    { name: t("Module"), width: "20%" },
    ...selectedCenters.map((center) => ({
      name: isMobile ? (
        center
      ) : (
        <>
          <input
            type="checkbox"
            checked={checkedColumns[center] || false}
            onChange={() => handleColumnCheck(center)}
          />
          <span style={{ marginLeft: "8px" }}>{center}</span>
        </>
      ),
      width: "8%",
    })),
  ];

  const handleSave = async () => {
    const payload = [];
    ;

    tableData.forEach((module) => {
      selectedCenters.forEach((center) => {
        let key = Object.keys(module).find((k) => k.startsWith(center));

        // Correctly set the status based on the value (1 or true should be true)
        let isChecked = key && (module[key] === 1 || module[key] === true);

        // 
        payload.push({
          isUpdateLogin: enable ? 1 : 0,
          employeeID: data?.data?.EmployeeID || "",
          userName: values?.Username || "",
          status: isChecked, // Ensuring correct boolean value
          roleID: module?.RoleID || "",
          centerID: centers?.find((centre) => centre?.CentreName == center)
            ?.CentreID,
          password: values.Password || "",
        });
      });
    });
    // 

    const ResponseData = await EDPSaveUserRoles(payload);

    if (ResponseData?.success) {
      notify(ResponseData?.message, "success");
    } else {
      notify(ResponseData?.message, "error");
    }

    console.log("Final Payload:", JSON.stringify(payload, null, 2));
  };

  return (
    <div className="card">
      {/* <Heading title={"Employee Details"} />
      <div className="row p-2">
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <LabeledInput label={t("Employee Name")} value={data?.data?.NAME} />
        </div>
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <LabeledInput label={t("Father's Name")} value={data?.data?.Pname} />
        </div>
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <LabeledInput
            label={t("Mother's Name")}
            value={data?.data?.Department}
          />
        </div>
      </div> */}
      {/* {} */}
      <Heading
        title={data?.breadcrumb}
        isSlideScreen={false}
        isBreadcrumb={true}
        />

      {/* {console.log("firstfirstfirstfirst", centers, selectedCenters)} */}
      <div className="py-1 px-3 row" style={{ gap: "10px" }}>
        {centers?.map((item) => (
          <SelectableBadge
            key={item?.CentreID}
            label={item?.CentreName}
            onSelect={handleSelectCenter}
            centres={centers}
            data={data}
            setCurrentCenter={setCurrentCenter}
          />
        ))}
      </div>

      <div className="w-100">
        {console.log("keykeykeykeykeykeykeykey", selectedCenters)}
        <Tables
          thead={THEAD}
          style={{ height: "58vh" }}
          tbody={tableData.map((ele, index) => ({
            SNo: index + 1,
            Module: ele?.RoleName,

            ...selectedCenters.reduce((acc, center) => {
              let key = Object?.keys(ele).find(
                (k) => k.split("_")[0] === center
              );
              // Ensure the checkbox is checked only if the value is `1` or `true`
              acc[key ? key : center] = (
                <input
                  type="checkbox"
                  checked={
                    ele[key ? key : center] === 1 ||
                    ele[key ? key : center] === true
                  }
                  onChange={(e) => handleRowCheck(center, index, key, e)}
                />
              );
              // 

              console.log("Updated acc:", acc);
              return acc;
            }, {}),
          }))}
        />

        <div className="card">
          <Heading
            title={
              <>
                <div className="d-flex">
                  {t("Login Details")}{" "}
                  <input
                    type="checkbox"
                    className="ml-4 mr-2"
                    onChange={() => {
                      setEnable(!enable);
                    }}
                  />
                  {t("Update Login")}
                </div>
              </>
            }
            isBreadcrumb={false}
          />

          <div className="row p-2">
            <Input
              type="text"
              className="form-control required-fields"
              id="Username"
              name="Username"
              onChange={handleChange}
              disabled={enable === true ? false : true}
              value={values.Username}
              lable={t("Username")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            />
            <Input
              type="password"
              className="form-control required-fields"
              id="Password"
              name="Password"
              onChange={handleChange}
              disabled={enable === true ? false : true}
              value={values.Password}
              lable={t("Password")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            />
            <Input
              type="password"
              className="form-control required-fields"
              id="ConfirmPassword"
              name="ConfirmPassword"
              onChange={handleChange}
              disabled={enable === true ? false : true}
              value={values.ConfirmPassword}
              lable={t("Confirm Password")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            />
            <button className="btn btn-sm btn-success" onClick={handleSave}>
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentreAccess;
