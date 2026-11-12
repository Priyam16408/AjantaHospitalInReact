import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import EDPSeeMoreList from "../EDPSeeMoreList";
import SeeMoreSlideScreen from "../../../components/UI/SeeMoreSlideScreen";
import SlideScreen from "../../../components/front-office/SlideScreen";
import {
  GetDoctorDetail,
  GetDocTypeList,
} from "../../../networkServices/EDP/karanedp";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import DoctorReg from "./DoctorReg";
import { notify } from "../../../utils/ustil2";

function ViewDoctorDetail({ data }) {
  const [t] = useTranslation();
  const [departmentData, setDepartmentData] = useState([]);
  const [bindList, setBindList] = useState([]);
  const [tableData, setTableData] = useState([]); 
  const [values, setValues] = useState({
    doctorName: "",
    department: { value: "0", label: "All" },
    specialization: { value: "0", label: "All" },
  });

  const [renderComponent, setRenderComponent] = useState({
    name: null,
    component: null,
  });

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  // GetDoctorDetail

  const handleGetDoctorDetail = async () => {
    const payload = {
      dname: values?.doctorName,
      department:
        values?.department?.value === "0" ? "" : values?.department?.value,
      specialization:
        values?.specialization?.value === "0"
          ? ""
          : values?.specialization?.value,
    };
    try {
      const response = await GetDoctorDetail(payload);
      if (response.success) {
        setTableData(response?.data);
        notify(`${response?.data?.length} record found`,"success")

      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setTableData([]);
        notify(response?.message,"error")
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setTableData([]);
    }
  };

  const handleGetDocTypeList = async () => {
    try {
      const response = await GetDocTypeList(3);
      if (response.success) {
        setBindList(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBindList([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindList([]);
    }
  };

  const handleGetDepartment = async () => {
    try {
      const response = await GetDocTypeList(5);
      if (response.success) {
        setDepartmentData(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setDepartmentData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setDepartmentData([]);
    }
  };

  const [visible, setVisible] = useState(false);

  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };
  const [seeMore, setSeeMore] = useState([]);

  const theadSaveData = [
    { width: "5%", name: t("SNo") },
    { width: "5%", name: t("Name") },

    { width: "5%", name: t("Specialization") },
    { width: "5%", name: t("Degree") },
    { width: "5%", name: t("Department") },
    { width: "5%", name: t("Doctor Share") },
    { width: "5%", name: t("Edit") },
    { width: "5%", name: t("Rate") },
  ];

  const handleEdit= (id)=>{
    notify(id,"success");
  }
  useEffect(() => {
    handleGetDepartment();
    handleGetDocTypeList();
  }, []);

  return (
    <>
      <div className="card">
        {/* <Heading title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true} isBreadcrumb={true} />
         */}
        <Heading
          title={t("/")}
          isBreadcrumb={true}
          secondTitle={
            <EDPSeeMoreList
              ModalComponent={ModalComponent}
              setSeeMore={setSeeMore}
              data={{}}
              setVisible={() => {
                setVisible(false);
              }}
              handleBindFrameMenu={[
                {
                  FileName: "DoctorReg",
                  URL: "DoctorReg",
                  FrameName: "DOCTOR-REG",
                  Description: "DoctorReg",
                  header: true,
                },
              ]}
              openFirstItem={false}
              name={
                <button className="btn text-white">
                  {" "}
                  {t("Create Doctor")}{" "}
                </button>
              }
              isRemoveSvg={true}
            />
          }
        />
        <div className="row px-2 pt-2">
          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="doctorName"
            name="doctorName"
            value={values?.doctorName || ""}
            onChange={handleChange}
            lable={t("Doctor Name")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "0", label: "All" },
              ...handleReactSelectDropDownOptions(departmentData, "Name", "ID"),
            ]}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
            name={"department"}
          />

          <ReactSelect
            placeholderName={t("Specialization")}
            id={"specialization"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "0", label: "All" },
              ...handleReactSelectDropDownOptions(bindList, "Name", "ID"),
            ]}
            handleChange={handleSelect}
            value={`${values?.specialization?.value}`}
            name={"specialization"}
          />

          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success px-3"
              type="button"
              onClick={handleGetDoctorDetail}
            >
              {t("Search")}
            </button>
          </div>
        </div>
        {tableData.length > 0 && (
          // <div className="card">
            <Tables
              thead={theadSaveData}
              tbody={tableData?.map((val, index) => ({
                sno: index + 1,
                name: val?.Name,
                Specialization: val?.Specialization,
                degree: val?.Degree,
                deparment: val?.Department,
                IsDocShare:
                  val?.IsDocShare == "0" ? <span>No</span> : <span>Yes</span>,
                // eidt:<i  className="fa fa-edit" />,
                Edit: (
                  <EDPSeeMoreList
                    ModalComponent={ModalComponent}
                    setSeeMore={setSeeMore}
                    data={val}
                    isRemoveSvg={true}
                    setVisible={() => {
                      setVisible(false);
                      handleEdit();
                    }}
                    handleBindFrameMenu={[
                      {
                        FileName: "Edit Doctor",
                        URL: "EditDoctor",
                        FrameName: "Edit Doctor",
                        Description: "Edit Doctor",
                        header: true,
                      },
                    ]}
                    openFirstItem={false} 

                    name={<i className="fa fa-edit"></i>}
                  />
                ),
                rate: <span>Rate</span>,
              }))}
              // tableHeight={"scrollView"} 
              style={{ paddingBottom: "20px" }}
            />
          // </div>
        )}
      </div>

      <SlideScreen
        visible={visible}
        setVisible={() => {
          setVisible(false);
          setRenderComponent({
            name: null,
            component: null,
          });
        }}
        Header={
          <SeeMoreSlideScreen
            name={renderComponent?.name}
            seeMore={seeMore}
            handleChangeComponent={handleChangeComponent}
          />
        }
      >
        {renderComponent?.component}
      </SlideScreen>
    </>
  );
}

export default ViewDoctorDetail;
