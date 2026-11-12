import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import EmployeeRoleRight from "../EmployeeManagment/EmployeeMaster/EmployeeRoleRight";
import { Button } from "react-bootstrap";
import Modal from "../../../components/modalComponent/Modal";
import Tables from "../../../components/UI/customTable";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import {
  RoleAndDepartmentSetUpAPI,
  updateRoleEDPUpdateAPI,
} from "../../../networkServices/EDP/mayankedp";
import moment from "moment";
import { updateRoleEDPPayload } from "../../../utils/ustil2";
import { notify } from "../../../utils/utils";

const Role = ({ data }) => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const THEAD = [
    { name: t("Type") },
    { name: t("Is Universal") },
    { name: t("Initial Character") },
    { name: t("Separator") },
    { name: t("Financial Year"), width: "15%" },
    { name: t("Separator") },
    { name: t("Length") },
    { name: t("Preview") },
    { name: t("Action") },
  ];

  const [tableData, setTableData] = useState([{ name: "Assad" }]);
  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });
  const initialValues = { Medical: { value: "No" }, General: { value: "No" } };
  const [values, setValues] = useState(initialValues);

  const handleInputChange = (e, index, label) => {
    const { value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleModalState = (item) => {
    setModalHandlerState({
      show: true,
      header: t("Copy Role & Right"),
      size: "40vw",
      component: <>Page is not showing in old web</>,
      footer: <></>,
    });
  };

  const handleCustomInput = (index, name, value, type, max = 9999999999999) => {
    if (type === "number") {
      if (!isNaN(value) && Number(value) <= max) {
        const data = JSON.parse(JSON.stringify(tableData));
        data[index][name] = value;
        setTableData(data);
      }
    } else {
      const data = JSON.parse(JSON.stringify(tableData));
      data[index][name] = value;
      if (name === "Is_Universal") {
        data[index]["InitialCharacter"] = "";
        data[index]["Separator"] = { value: "" };
        data[index]["Is_FinancialYear"] = false;
        data[index]["finacialYearDate"] = "";
        data[index]["Length"] = { value: "" };
      }
      setTableData(data);
    }
  };

  const getRoleAndDepartmentSetUp = async () => {
    let apiResp = await RoleAndDepartmentSetUpAPI(data?.Priviledge?.value);
    if (apiResp?.success) {
      let {
        RoleName,
        IsDepartment,
        IsUniversal,
        cangenrateprandgrn,
        IsMedical,
        IsGeneral,
        RoleId,
        DeptLedgerNo,
      } = apiResp?.data[0];
      let editDetail = {
        RoleName: RoleName,
        IsDepartment: { value: IsDepartment },
        IsUniversalFormat: { value: IsUniversal },
        cangenrateprandgrn: { value: cangenrateprandgrn },
        Medical: { value: String(IsMedical) },
        General: { value: IsGeneral },
        RoleId: RoleId,
        DeptLedgerNo: DeptLedgerNo,
      };
      setValues((val) => ({ ...val, ...editDetail }));
    }
  };

  useEffect(() => {
    getRoleAndDepartmentSetUp();
  }, []);

  const handleSaveORUpdate = () => {
    const payload = updateRoleEDPPayload(values, tableData);
    const apiResp = updateRoleEDPUpdateAPI(payload);
    if (apiResp?.success) {
      notify(apiResp?.success, "success");
    } else {
      notify(apiResp?.success, "error");
    }
  };

  return (
    <div className="card">
      <Heading title={"New Role"} />
      <div className="row px-2 pt-2">
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Role")}
          placeholder=" "
          id="RoleName"
          name="RoleName"
          onChange={(e) => handleInputChange(e, 0, "RoleName")}
          value={values?.RoleName ? values?.RoleName : ""}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Is Department")}
          name="IsDepartment"
          removeIsClearable={true}
          value={values?.IsDepartment?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Generate PR & PO or GRN")}
          name="cangenrateprandgrn"
          id={"cangenrateprandgrn"}
          removeIsClearable={true}
          value={values?.cangenrateprandgrn?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Generate Menu")}
          name="GMenu"
          value={values?.GMenu?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={data?.GenerateMenu}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        {String(values?.cangenrateprandgrn?.value) === "1" && (
          <>
            <ReactSelect
              placeholderName={t("Medical")}
              name="Medical"
              value={values?.Medical?.value}
              handleChange={(name, e) => handleReactSelect(name, e)}
              dynamicOptions={[
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
              ]}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              removeIsClearable={true}
            />
            <ReactSelect
              placeholderName={t("General")}
              name="General"
              value={values?.General?.value}
              handleChange={(name, e) => handleReactSelect(name, e)}
              dynamicOptions={[
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
              ]}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              removeIsClearable={true}
            />
          </>
        )}

        {String(values?.IsDepartment?.value) === "1" && (
          <>
            <ReactSelect
              placeholderName={t("Is Universal Format")}
              name="IsUniversalFormat"
              value={values?.IsUniversalFormat?.value}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactSelect(name, e)}
              dynamicOptions={[
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
              ]}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <button
              className="btn btn-sm btn-success ml-2 px-3"
              onClick={handleModalState}
            >
              {t("Universal Formatter")}
            </button>
          </>
        )}
      </div>

      {String(values?.IsUniversalFormat?.value) === "0" &&
        String(values?.IsDepartment?.value) === "1" && (
          <>
            <Tables
              thead={THEAD}
              tbody={tableData?.map((ele, index) => ({
                Type: (
                  <CustomSelect
                    placeHolder={t("Bal. Type")}
                    name="balanceType"
                    onChange={(name, e) => {
                      handleCustomInput(index, "balanceType", e);
                    }}
                    isRemoveSearchable={true}
                    value={ele?.balanceType?.value}
                    option={[]}
                  />
                ),
                Is_Universal: (
                  <input
                    type="checkbox"
                    name="Is_Universal"
                    checked={ele?.Is_Universal}
                    onChange={(e) =>
                      handleCustomInput(index, "Is_Universal", e.target.checked)
                    }
                  />
                ),
                InitialCharacter: (
                  <Input
                    type="text"
                    className="table-input required-fields"
                    respclass={"w-100"}
                    removeFormGroupClass={true}
                    disabled={ele?.Is_Universal}
                    name={"InitialCharacter"}
                    value={ele?.InitialCharacter ? ele?.InitialCharacter : ""}
                    onChange={(e) => {
                      handleCustomInput(
                        index,
                        "InitialCharacter",
                        e.target.value,
                        "text",
                        1000000000
                      );
                    }}
                  />
                ),
                Separator: (
                  <CustomSelect
                    placeHolder={t("Separator")}
                    name="Separator	"
                    isDisable={ele?.Is_Universal}
                    onChange={(name, e) => {
                      handleCustomInput(index, "Separator", e);
                    }}
                    isRemoveSearchable={true}
                    value={ele?.Separator?.value}
                    option={[
                      { label: "/", value: "/" },
                      { label: "-", value: "-" },
                    ]}
                  />
                ),
                Is_FinancialYear: (
                  <div className="d-flex " style={{ width: "100%" }}>
                    <div className="">
                      <input
                        type="checkbox"
                        name="Is_FinancialYear"
                        checked={ele?.Is_FinancialYear}
                        disabled={ele?.Is_Universal}
                        onChange={(e) =>
                          handleCustomInput(
                            index,
                            "Is_FinancialYear",
                            e.target.checked
                          )
                        }
                      />
                    </div>
                    <DatePicker
                      className="custom-calendar-table"
                      id="finacialYearDate"
                      respclass="ml-2 w-100"
                      disable={ele?.Is_Universal || !ele?.Is_FinancialYear}
                      name="finacialYearDate"
                      inputClassName={"required-fields"}
                      value={
                        ele?.finacialYearDate
                          ? moment(ele?.finacialYearDate).toDate()
                          : ""
                      }
                      maxDate={new Date()}
                      handleChange={(e) =>
                        handleCustomInput(
                          index,
                          "finacialYearDate",
                          e.target.value
                        )
                      }
                      placeholder={VITE_DATE_FORMAT}
                    />
                  </div>
                ),
                Separator2: (
                  <CustomSelect
                    placeHolder={t("Separator")}
                    name="Separator	"
                    isDisable={ele?.Is_Universal}
                    onChange={(name, e) => {
                      handleCustomInput(index, "Separator", e);
                    }}
                    isRemoveSearchable={true}
                    value={ele?.Separator?.value}
                    option={[
                      { label: "/", value: "/" },
                      { label: "-", value: "-" },
                    ]}
                  />
                ),
                Length: (
                  <CustomSelect
                    placeHolder={t("Length")}
                    name="Length"
                    isDisable={ele?.Is_Universal}
                    onChange={(name, e) => {
                      handleCustomInput(index, "Length", e);
                    }}
                    isRemoveSearchable={true}
                    value={ele?.Length?.value}
                    option={[]}
                  />
                ),

                Preview: "",
                Action: "Add",
              }))}
            />
            <div className="m-1" style={{ textAlign: "right" }}>
              <button
                className="btn btn-sm btn-success ml-2 px-3"
                onClick={handleSaveORUpdate}
              >
                {values?.RoleId ? t("Update") : t("Save")}
              </button>
            </div>
          </>
        )}

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
          modalWidth={modalHandlerState?.size}
          Header={modalHandlerState?.header}
          // footer={modalHandlerState?.footer}
        >
          {modalHandlerState?.component}
        </Modal>
      )}
    </div>
  );
};

export default Role;
