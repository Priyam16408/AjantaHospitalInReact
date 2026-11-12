import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import {
  EDPGetDeptWiseAuth,
  EDPgetSetCentre,
  EDPSaveUserAuth,
} from "../../../networkServices/EDP/edpApi";
import Tables from "../../../components/UI/customTable";
const UserAuthorization = (data) => {
  const [t] = useTranslation();
  const [values, setValues] = useState({});
  console.log("values", values);
  const [tableData, setTableData] = useState([]);
  console.log("TableData in Auth", tableData);
  const [checkedDepartments, setCheckedDepartments] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const THEAD = [
    { name: t("S.No."), width: "1%" },
    {
      name: (
        <>
          <input
            type="checkbox"
            style={{ marginLeft: "6px" }}
            onChange={() => handleSelectAll()}
          />
          <span className="ml-2">{t("Department Belong")}</span>
        </>
      ),
      width: "2%",
    },
    { name: t("Modules"), width: "2%" },
    { name: t("Col Description"), width: "2%" },
  ];

  const handleReactSelect = async (name, e) => {
    const updatedValues = { ...values, [name]: e.value };
    setValues(updatedValues);

    const empID = data?.data?.EmployeeID;
    const centreID = e.value; // Use the new value directly

    const response = await EDPGetDeptWiseAuth(empID, centreID);
    setTableData(response?.data);

    if (response?.success) {
      notify("Record Found", "success");
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    setCheckedDepartments(
      newSelectAll ? new Set(tableData.map((row) => row.DeptBelong)) : new Set()
    );

    setTableData((prevData) =>
      prevData.map((row) => ({
        ...row,
        IsRights: newSelectAll ? 1 : 0, // Select or deselect all
      }))
    );
  };

  const [dropDownState, setDropDownState] = useState({
    Department: [],
  });


  const fetchCenters = async () => {
    const empId = data?.data?.EmployeeID;
    const response = await EDPgetSetCentre(empId);
    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Department: handleReactSelectDropDownOptions(
          response?.data,
          "CentreName", // Ensure it matches API response
          "CentreID"
        ),
      }));
    } else {
      notify(response?.message, "error");
    }
  };

  const handleDeptCheck = (deptName) => {
    setCheckedDepartments((prevChecked) => {
      const updatedChecked = new Set(prevChecked);
      const shouldCheck = !updatedChecked.has(deptName);

      if (shouldCheck) {
        updatedChecked.add(deptName);
      } else {
        updatedChecked.delete(deptName);
      }

      // Update the tableData accordingly
      setTableData((prevData) =>
        prevData.map((row) => {
          if (row.DeptBelong === deptName) {
            return { ...row, IsRights: shouldCheck ? 1 : 0 };
          }
          return row;
        })
      );

      return updatedChecked;
    });
  };

  const handleSave = async () => {
    const payload = tableData.map((ele) => ({
      roleID: ele.RoleID,
      roleName: ele.Role, // Assuming `Role` holds the name
      uaid: ele.UAID,
      deptBelongID: ele.DeptBelongID,
      deptBelong: ele.DeptBelong,
      employeeID: data?.data?.EmployeeID,
      centreID: values?.Department, // Assuming Department dropdown holds CentreID
      status: ele.IsRights === 1, // ✅ Checked = true, Unchecked = false
      colName: ele.ColName,
      colValue: ele.IsRights === 1 ? "true" : "false", // ✅ Adding colValue as string
    }));

    // console.log("Final Payload:", payload);

    try {
      const response = await EDPSaveUserAuth(payload);
      if (response.success) {
        notify("Saved Successfully", "success");
      } else {
        notify(response.message, "error");
      }
    } catch (error) {
      console.error("Save Error:", error);
      notify("Error while saving", "error");
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  return (
    <div className="card">
      <Heading title={t("Employee Details")} />
      <div className="row p-3">
        <ReactSelect
          placeholderName={t("Department")}
          id={"Department"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={dropDownState?.Department}
          name="Department"
          handleChange={handleReactSelect}
          value={values}
          requiredClassName="required-fields"
        />
      </div>

      {tableData?.length > 0 && (
        <div>
          {/* let prevDeptBelong = null; let prevModules = null; */}
          <Heading title={t("Authorization")} />
          <Tables
            thead={THEAD}
            style={{ height: "50vh" }}
            tbody={(() => {
              const renderedDeptBelong = new Set();
              const renderedModules = new Set();

              return tableData?.map((ele, index) => {
                const isDeptFirstOccurrence = !renderedDeptBelong.has(
                  ele.DeptBelong
                );
                const isModulesFirstOccurrence = !renderedModules.has(ele.Role);

                if (isDeptFirstOccurrence) {
                  renderedDeptBelong.add(ele.DeptBelong);
                }

                if (isModulesFirstOccurrence) {
                  renderedModules.add(ele.Role);
                }

                return {
                  SNo: index + 1,
                  "Department Belong": isDeptFirstOccurrence ? (
                    <div>
                      <input
                        type="checkbox"
                        checked={checkedDepartments.has(ele.DeptBelong)}
                        onChange={() => handleDeptCheck(ele.DeptBelong)}
                      />
                      <span className="ml-2">{ele?.DeptBelong}</span>
                    </div>
                  ) : (
                    ""
                  ),
                  Modules: isModulesFirstOccurrence ? ele?.Role : "",
                  ColDescription: (
                    <div>
                      <input
                        type="checkbox"
                        checked={ele.IsRights === 1}
                        onChange={(e) => {
                          const newChecked = e.target.checked ? 1 : 0;
                          setTableData((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? { ...item, IsRights: newChecked }
                                : item
                            )
                          );
                        }}
                      />

                      <span className="ml-2">{ele?.ColDescription}</span>
                    </div>
                  ),

                  ...Object.keys(ele)
                    .filter((key) => key.includes("_"))
                    .reduce((acc, center) => {
                      acc[center] = (
                        <input
                          type="checkbox"
                          checked={ele[center]}
                          onChange={(e) => handleRowCheck(index, center, e)}
                        />
                      );
                      return acc;
                    }, {}),
                };
              });
            })()}
          />
          {tableData?.length > 0 && (
            <div className="col-sm-2 p-2">
              <button className="btn btn-sm btn-success" onClick={handleSave}>
                {t("Save")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAuthorization;
