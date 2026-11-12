import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { t } from "i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { MultiSelect } from "primereact/multiselect";
import { useDispatch, useSelector } from "react-redux";
import {
  GetBindAllDoctorConfirmation,
  GetBindDepartment,
} from "../../../store/reducers/common/CommonExportFunction";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  getDepartmentMapping,
  getDoctorDepartmentLitsApi,
  SaveDepartmentMapping,
  UpdateDepartmentMapping,
} from "../../../networkServices/DoctorApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import { InputSwitch } from "primereact/inputswitch";

const DoctorDepartmentMapping = () => {
  const { GetDepartmentList, GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );
  const localData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(true);

  // Local state to manage form data
  const [values, setValues] = useState({
    doctor: { value: "0", label: "All" },
  });
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const [tableData, setTableData] = useState([]);

  const tableHead = [
    { width: "1%", name: t("S.No") },
    { width: "5%", name: t("Doctor Name") },
    { width: "5%", name: t("DepartMent Name") },
    { width: "5%", name: t("Set Default") },
    { width: "1%", name: t("Action") },
  ];

  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
        CentreID: localData?.centreID,
      })
    );
    dispatch(GetBindDepartment());
  }, [dispatch]);

  const doctorOptions = GetBindAllDoctorConfirmationData.map((item) => ({
    label: item.Name,
    value: item.DoctorID,
  }));

  const departmentOptions = GetDepartmentList.map((item) => ({
    label: item.Name,
    value: item.ID,
  }));

  const saveMapping = async () => {
    try {
      let payload = {
        doctorID: values?.doctor?.value || "",
        departList: departmentOptions
          .filter((item) => {
            if (selectedDepartments.includes(item.value)) {
              return item;
            }
          })
          .map((item) => {
            return {
              departmentID: item.value,
              departmentName: item.label,
            };
          }),
      };

      if (values?.doctor?.value && selectedDepartments.length > 0) {
        // console.log("payload", payload);
        // console.log("payload", payload);
        const response = await SaveDepartmentMapping(payload);
        setSelectedDepartments([]);
        setValues({
          doctor: { value: "", label: "" },
        });
        notify(response.message, "success");
      } else {
        notify("Please select doctor and department", "error");
      }
    } catch (error) {
      notify(error.message, "error");
      console.error(error);
    }
  };

  const getTableData = async () => {
    console.log("searching.........");
    try {
      let payload = {
        doctorID: values?.doctor?.value || "",
        departList: selectedDepartments?.map((item) => ({
          departmentID: item,
        })),
      };

      const response = await getDepartmentMapping(payload);
      setSelectedDepartments([]);
      setValues({ doctor: { value: "0", label: "All" } });
      // notify(response.message, "success");
      setTableData(response?.data);
    } catch (err) {
      console.log(err.message);
      notify(err.message, "error");
    }
  };

  const deleteMapping = async (params) => {
    try {
      let payload = {
        doctorID: params?.DoctorId,
        departmentID: params?.DepartmentID,
        type: 1,
        isDefault: "",
        isActive: 0,
      };
      const response = await UpdateDepartmentMapping(payload);
      getTableData();
      notify(response.message, "success");
    } catch (err) {
      console.log(err.message);
      notify(err.message, "error");
    }

    // console.log("searching....searchDoctor.....",searchDoctor)
  };



  const mappingToggle = async(params) => {
    
    try{
      let payload = {
        doctorID: params?.DoctorId,
        departmentID: params?.DepartmentID,
        type: 2,
        isDefault: params?.IsDefault === 1 ? 0 : 1,
        isActive: 1,
      };
      const response = await UpdateDepartmentMapping(payload);
      getTableData();
      notify(response.message, "success");
    }

    catch(err){
      console.log(err.message);
      notify(err.message, "error");
    }
  };	
  
  const handleSelect = (name, value) => {
    console.log(name, value);
    setValues((val) => ({ ...val, [name]: value }));
  };

  return (
    <>
      <div className="card patient_registration">
        <Heading title={t("View Consultation")} isBreadcrumb={true} />
        <div className="row p-2">
          {/* Doctor Select */}
          <ReactSelect
            placeholderName={t("Doctor")}
            searchableDoctorID={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            id="doctor"
            name="doctor"
            // dynamicOptions={doctorOptions}
            dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(doctorOptions, "label", "value")]}
            value={values?.doctor?.value}
            handleChange={handleSelect}
          />

          {/* Department MultiSelect */}
          <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
            <MultiSelect
              value={selectedDepartments}
              options={departmentOptions}
              onChange={(e) => setSelectedDepartments(e.value)}
              optionLabel="label"
              placeholder={t("Department")}
              filter
              className="multiselect"
            />
          </div>

          <button
            className="btn btn-sm btn-success"
            onClick={() => {
              saveMapping();
            }}
          >
            {t("Save")}
          </button>

          <button
            className="btn btn-sm btn-success mx-2"
            onClick={() => {
              getTableData();
            }}
          >
            {t("Search")}
          </button>
        </div>
      </div>

      <div className="card patient_registration">
        <Tables
          thead={tableHead}
          tbody={
            tableData.length > 0 &&
            tableData?.map((item, index) => ({
              Sno: index + 1,
              DoctorName: item?.FullName,
              DepartmentName: item?.DepartmentName,
              SetDefault:
                (
                  <div className="d-flex justify-content-center">
                    <InputSwitch
                      checked={item?.IsDefault === 1 ? true : false}
                      onChange={() => mappingToggle(item)}
                    />
                  </div>
                ) || "",
              Action:
                (
                  <i
                    className="fa fa-trash text-danger"
                    onClick={() => deleteMapping(item)}
                  />
                ) || "",
            }))
          }
        />
      </div>
    </>
  );
};

export default DoctorDepartmentMapping;
