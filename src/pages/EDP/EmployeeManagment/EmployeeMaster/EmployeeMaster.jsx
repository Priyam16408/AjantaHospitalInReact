import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/formComponent/Input";
import EmployeeRoleRight from "./EmployeeRoleRight";
import Button from "../../../../components/formComponent/Button";
import Modal from "../../../../components/modalComponent/Modal";
import EmployeeTableList from "./EmployeeTableList";
import {
  BindPayrollDepartment,
  EDPLoadPrescriptionView,
  EdpSearchEmployee,
} from "../../../../networkServices/EDP/edpApi";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import EDPSeeMoreList from "../../EDPSeeMoreList";
import SeeMoreSlideScreen from "../../../../components/UI/SeeMoreSlideScreen";
import SlideScreen from "../../../../components/front-office/SlideScreen";
import CommonModalComponent from "../../ModaCommonComponent/CommonModalComponent";

const EmployeeMaster = ({ data }) => {
  const [t] = useTranslation();

  // const dummyData = [
  //   {
  //     label: "Employee NameEmployee Name",
  //     value: "empName",
  //     isChecked: true,
  //   },
  //   {
  //     label: "Department",
  //     value: "Department",
  //     isChecked : true,
  //   },
  //   {
  //     label: "Department",
  //     value: "Department",
  //   },
  //   {
  //     label: "Department",
  //     value: "Department",
  //   },

  // ];

  const initialState = {
    empName: "",
    Department: {
      Dept_ID: 0,
      Dept_Name: "",
      label: "",
      value: 0,
    },
  };

  const [bindData, setBindData] = useState({
    Department: [],
  });

  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });
  const [dropDownState, setDropDownState] = useState({
    Department: [],
  });
  // console.log("bindData", dropDownState);

  const [values, setValues] = useState({ ...initialState });

  const [tableData, setTableData] = useState([]);

  const handleReactSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleInputChange = (e, index, label) => {
    setValues((val) => ({ ...val, [label]: e.target.value }));
  };

  const [renderComponent, setRenderComponent] = useState({
    name: null,
    component: null,
  });

  const handleReset = () => {
    setValues({
      empName: "",
      Department: {
        Dept_ID: 0,
        Dept_Name: "",
        label: "",
        value: 0,
      },
    });
    setTableData([]);
  };

  const bindDepartment = async () => {
    const data = await BindPayrollDepartment();

    if (data?.success) {
      setDropDownState((val) => ({
        ...val,
        Department: handleReactSelectDropDownOptions(
          data?.data,
          "Dept_Name",
          "Dept_ID"
        ),
      }));
    }
  };

  const handleModalState = (item) => {
    setModalHandlerState({
      show: true,
      header: t("Copy Role & Right"),
      size: "40vw",
      buttonName: "Save",
      component: (
        <EmployeeRoleRight
          setValues={setValues}
          values={values}
          department={dropDownState?.Department}
        />
        // <CommonModalComponent
        //   heading={t("Copy Role & Right")}
        //   // onSave={handleReset}
        //   data={dummyData}
        // />
      ),
    });
  };

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };

  const handleSearch = async () => {
    const payloadToBe = {
      empName: values?.empName || "",
      department: values?.Department?.value || "0",
    };
    const dataResult = await EdpSearchEmployee(payloadToBe);
    if (dataResult?.success === true) {
      setTableData(dataResult?.data);
    } else {
      setTableData([]);
      notify(dataResult?.message, "error");
    }
    // console.log("Data Result", dataResult);
  };

  const [seeMore, setSeeMore] = useState([]);
  const [visible, setVisible] = useState(false);
  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };

  useEffect(() => {
    bindDepartment();
  }, []);
  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
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
                FileName: "Edit-Employee",
                URL: "Registration",
                FrameName: "EDP-EMPLOYEE",
                Description: "Registration",
              },
            ]}
            openFirstItem={false}
            name={
              <button className="btn text-white">
                {" "}
                {t("Create Employee")}{" "}
              </button>
            }
            isRemoveSvg={true}
          />
        }
      />
      <div className="row pt-2 px-2">
        <Input
          type="empName"
          className={"form-control required-fields"}
          lable={t("Employee Name")}
          placeholder=" "
          id="empName"
          name="empName"
          onChange={(e) => handleInputChange(e, 0, "empName")}
          value={values?.empName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {/* {console.log("first" , dropDownState?.Department)} */}
        <ReactSelect
          placeholderName={t("Department")}
          id="Department"
          removeIsClearable={true}
          requiredClassName={"required-fields"}
          name="Department"
          value={values?.Department?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.Department}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <button
          className="btn btn-sm btn-success ml-2 px-3"
          onClick={handleSearch}
        >
          {t("Search")}
        </button>
        {/* <button
          className="btn btn-sm btn-success ml-2 px-3"
          onClick={handleReset}
        >
          {t("Reset")}
        </button>*/}
        {/* <button
          className="btn btn-sm btn-success ml-2 px-3"
          onClick={handleModalState}
        >
          {t("Copy Role Right")}
        </button> */}
      </div>
      {modalHandlerState?.show && (
        <Modal
          visible={modalHandlerState?.show}
          setVisible={() =>
            setModalHandlerState({
              show: false,
              component: null,
              size: null,
            })
          }
          buttonName={modalHandlerState?.buttonName}
          modalWidth={modalHandlerState?.size}
          Header={modalHandlerState?.header}
          footer={modalHandlerState?.footer}
        >
          {modalHandlerState?.component}
        </Modal>
      )}

      {/* {tableData?.length > 0 && ( */}
      <>
        <EmployeeTableList
          tableData={tableData}
          setTableData={setTableData}
          // list={bindData?.prescriptionView}
        />
      </>
      {/* )} */}

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
    </div>
  );
};

export default EmployeeMaster;
