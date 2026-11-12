// import React, { useState } from "react";
// import ReactSelect from "@app/components/formComponent/ReactSelect";
// import Input from "@app/components/formComponent/Input";
// import { useTranslation } from "react-i18next";
// import ReferenceTypeModel from "../modalComponent/Utils/ReferenceTypeModel";
// import Modal from "../modalComponent/Modal";
// import {
//   filterByType,
//   filterByTypes,
//   inputBoxValidation,
// } from "../../utils/utils";
// import {
//   CentreWiseCacheByCenterID,
//   ReferenceTypeInsert,
// } from "../../store/reducers/common/CommonExportFunction";
// import { useDispatch } from "react-redux";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
// import { MOBILE_NUMBER_VALIDATION_REGX } from "../../utils/constant";
// export default function OtherDetails({
//   CentreWiseCache,
//   handleChange,
//   values,
//   handleReactSelect,
// }) {
//   const [t] = useTranslation();
//   const [handleModelData, setHandleModelData] = useState({});
//   const [modalData, setModalData] = useState({});
//   const handleModel = (
//     label,
//     width,
//     type,
//     isOpen,
//     Component,
//     handleInsertAPI
//   ) => {
//     setHandleModelData({
//       label: label,
//       width: width,
//       type: type,
//       isOpen: isOpen,
//       Component: Component,
//       handleInsertAPI,
//     });
//   };
//   const handleChangeModel = (data) => {
//     setModalData(data);
//   };
//   const userData = useLocalStorage("userData", "get");
//   const dispatch = useDispatch();
//   const handleReferenceTypeAPI = async (data) => {
//     let insData = await dispatch(ReferenceTypeInsert(data));
//     if (insData?.payload?.status) {
//       setModalData({});
//       setHandleModelData((val) => ({ ...val, isOpen: false }));
//       dispatch(
//         CentreWiseCacheByCenterID({
//           centreID: userData?.defaultCentre,
//         })
//       );
//     }
//   };

//   const setIsOpen = () => {
//     setHandleModelData((val) => ({ ...val, isOpen: false }));
//   };
import React, { useState } from "react";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Input from "@app/components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReferenceTypeModel from "../modalComponent/Utils/ReferenceTypeModel";
import Modal from "../modalComponent/Modal";
import {
  filterByType,
  filterByTypes,
  inputBoxValidation,
} from "../../utils/utils";
import {
  CentreWiseCacheByCenterID,
  ReferenceTypeInsert,
} from "../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../utils/constant";
import { Card } from "react-bootstrap";
import Tables from "../UI/customTable";
import { Checkbox } from "primereact/checkbox";

export default function OtherDetails({
  CentreWiseCache,
  handleChange,
  values,
  handleReactSelect,
  isDisableInputs,
  relations,
  setRelations,
}) {
  const [t] = useTranslation();
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  // const [relations, setRelations] = useState([]);
  const [relation, setRelation] = useState({
    Relation: "",
    RelationName: "",
    RelationPhone: "",
  });


  console.log(relation);

  const handleModel = (
    label,
    width,
    type,
    isOpen,
    Component,
    handleInsertAPI
  ) => {
    setHandleModelData({
      label: label,
      width: width,
      type: type,
      isOpen: isOpen,
      Component: Component,
      handleInsertAPI,
    });
  };

  const handleChangeModel = (data) => {
    setModalData(data);
  };

  const userData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();

  const handleReferenceTypeAPI = async (data) => {
    let insData = await dispatch(ReferenceTypeInsert(data));
    if (insData?.payload?.status) {
      setModalData({});
      setHandleModelData((val) => ({ ...val, isOpen: false }));
      dispatch(
        CentreWiseCacheByCenterID({
          centreID: userData?.defaultCentre,
        })
      );
    }
  };

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const handleAddRelation = () => {
    if (relation.Relation && relation.RelationName ) {
      setRelations([...relations, { ...relation, isPersonal: true }]);
      setRelation({ Relation: "", RelationName: "", RelationPhone: "" });
    }
  };

  const handleDeleteRelation = (index) => {
    const updatedRelations = relations.filter((_, i) => i !== index);
    setRelations(updatedRelations);
  };
 
  const handleChangRelation = (name, selectedOption) => {
  if (selectedOption) {
    setRelation({ ...relation, Relation: selectedOption.value });
  } else {
    setRelation({ ...relation, Relation: "" });
  }
};


  const handlePersonalToggle = (index) => {
    const updatedRelations = relations.map((rel, i) =>
      i === index ? { ...rel, isPersonal: !rel.isPersonal } : rel
    );
    setRelations(updatedRelations);
  };

  console.log(values, "values in OtherDetails");

  return (
    <>
      <div className="row  g-4 pt-2 pl-2 pr-2">
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <div className="row">
            <Input
              type="text"
              className="form-control"
              id="std_code"
              name="Phone_STDCODE"
              value={
                values?.Phone_STDCODE
                  ? values?.Phone_STDCODE
                  : values?.countryID?.extraColomn
              }
              readOnly={true}
              lable={t("Code")}
              placeholder=" "
              respclass="col-4"
              disabled={isDisableInputs}
            />

            <Input
              type="text"
              className="form-control"
              id="LandiLne_No"
              name="Phone"
                            disabled={isDisableInputs}

              value={values?.Phone ? values?.Phone : ""}
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleChange
                );
              }}
              showTooltipCount={true}
              lable={t("Alternative_No")}
              placeholder=" "
              respclass="col-8"
            />
            
          </div>
        </div>
        <Input
          type="text"
          className="form-control"
          id="occupation"
          name="occupation"
                        disabled={isDisableInputs}

          value={values?.occupation ? values?.occupation : ""}
          onChange={handleChange}
          lable={t("Occupation")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
        />
        <Input
          type="text"
          className="form-control"
          id="Birth_Place"
          name="placeofBirth"
                        disabled={isDisableInputs}

          value={values?.placeofBirth ? values?.placeofBirth : ""}
          onChange={handleChange}
          lable={t("Birth_Place")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
        />

        <ReactSelect
          placeholderName={t("Religion")}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          id="Religion"
          name="Religion"
          value={values?.Religion ? values?.Religion : ""}
          handleChange={handleReactSelect}
          dynamicOptions={filterByType(
            CentreWiseCache,
            14,
            "TypeID",
            "TextField",
            "ValueField"
          )}
          isDisabled={isDisableInputs}
        />
        {/* <ReactSelect
          placeholderName={t("Relation_Of")}
          id="Relation_Of"
          searchable={true}
          name="Relation"
          value={values?.Relation}
          handleChange={handleReactSelect}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          dynamicOptions={filterByType(
            CentreWiseCache,
            6,
            "TypeID",
            "TextField",
            "ValueField"
          )}
        />

        <Input
          type="text"
          className="form-control"
          id="Relation_Name"
          name="RelationName"
          value={values?.RelationName ? values?.RelationName : ""}
          onChange={handleChange}
          lable={t("Relation_Name")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
        />

        <Input
          type="text"
          className="form-control"
          id="Relation_Phone"
          name="RelationPhoneNo"
          value={values?.RelationPhoneNo ? values?.RelationPhoneNo : ""}
          onChange={(e) => {
            inputBoxValidation(MOBILE_NUMBER_VALIDATION_REGX, e, handleChange);
          }}
          showTooltipCount={true}
          lable={t("Relation_Phone")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
        /> */}

        <Input
          type="text"
          className="form-control"
          id="EMG_First_Name"
          name="EmergencyFirstName"
          value={values?.EmergencyFirstName ? values?.EmergencyFirstName : ""}
          onChange={handleChange}
          lable={t("EMG_First_Name")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        disabled={isDisableInputs}

        />

        <Input
          type="text"
                        disabled={isDisableInputs}
          className="form-control"
          id="EMG_Last_Name"
          name="EmergencySecondName"
          value={values?.EmergencySecondName ? values?.EmergencySecondName : ""}
          onChange={handleChange}
          lable={t("EMG_Last_Name")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
        />

        <ReactSelect
          placeholderName={t("EMG_Relation")}
          id="EMG_Relation"
          name="EmergencyRelationOf"
          value={values?.EmergencyRelationOf}
          handleChange={handleReactSelect}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          dynamicOptions={filterByType(
            CentreWiseCache,
            6,
            "TypeID",
            "TextField",
            "ValueField"
          )}
          isDisabled={isDisableInputs}
        />

        <Input
          type="text"
          className="form-control"
          id="EMG_Mobile_No"
          name="EmergencyPhoneNo"
          value={values?.EmergencyPhoneNo ? values?.EmergencyPhoneNo : ""}
          onChange={(e) => {
            inputBoxValidation(MOBILE_NUMBER_VALIDATION_REGX, e, handleChange);
          }}
          showTooltipCount={true}
          lable={t("EMG_Mobile_No")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        disabled={isDisableInputs}

        />

        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <div className="row">
            <Input
              type="text"
              className="form-control"
              id="emg_std_code"
              name="ResidentialNumber_STDCODE"
              value={
                values?.ResidentialNumber_STDCODE
                  ? values?.ResidentialNumber_STDCODE
                  : values?.countryID?.extraColomn
              }
              onChange={handleChange}
              readOnly={true}
              lable={t("Code")}
              placeholder=" "
              respclass="col-4"
              disabled={isDisableInputs}
            />

            <Input
              type="text"
              className="form-control"
              id="EMG_Resident_No"
              name="ResidentialNumber"
              value={values?.ResidentialNumber ? values?.ResidentialNumber : ""}
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleChange
                );
              }}
              showTooltipCount={true}
              lable={t("EMG_Resident_No")}
              placeholder=" "
              respclass="col-8"
              disabled={isDisableInputs}
            />
          </div>
        </div>

        <Input
          type="text"
          className="form-control"
          id="EMG_Address"
          name="EmergencyAddress"
          value={values?.EmergencyAddress ? values?.EmergencyAddress : ""}
          onChange={handleChange}
          lable={t("EMG_Address")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          disabled={isDisableInputs}
        />

        <ReactSelect
          placeholderName={t("IsInternational")}
          id="IsInternational"
          name="IsInternational"
          value={`${values?.IsInternational}`}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "YES", value: "1" },
            { label: "NO", value: "2" },
          ]}
          // searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          isDisabled={isDisableInputs}
        />

        <ReactSelect
          placeholderName={t("Country")}
          id="Country"
          searchable={true}
          name="InternationalCountryID"
          value={`${values?.InternationalCountryID}`}
          handleChange={handleReactSelect}
          requiredClassName={`${(values?.IsInternational?.value ? values?.IsInternational?.value : values?.IsInternational) === "2" ? "disable-focus" : ""}`}
          isDisabled={
            ((values?.IsInternational?.value
              ? values?.IsInternational?.value
              : values?.IsInternational) === "2")&& isDisableInputs
              ? true
              : false
          }
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          dynamicOptions={filterByTypes(
            CentreWiseCache,
            [7],
            ["TypeID"],
            "TextField",
            "ValueField",
            "STD_CODE"
          )}
        />

        <Input
          type="text"
          className={`form-control ${(values?.IsInternational?.value ? values?.IsInternational?.value : values?.IsInternational) === "2" ? "disable-focus" : ""}`}
          id="Passport_No"
          name="Passport_No"
          value={values?.Passport_No ? values?.Passport_No : ""}
          onChange={handleChange}
          disabled={
            ((values?.IsInternational?.value
              ? values?.IsInternational?.value
              : values?.IsInternational) === "2")&& isDisableInputs
              ? true
              : false
          }
          lable={t("Passport_Number")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"

        />

        <Input
          type="text"
          className={`form-control ${(values?.IsInternational?.value ? values?.IsInternational?.value : values?.IsInternational) === "2" ? "disable-focus" : ""}`}
          id="International_No"
          name="InternationalNumber"
          value={values?.InternationalNumber ? values?.InternationalNumber : ""}
          onChange={(e) => {
            inputBoxValidation(/^[a-z0-9]{0,10}$/, e, handleChange);
          }}
          // onChange={handleChange}
          showTooltipCount={true}
          readOnly={
            (values?.IsInternational?.value
              ? values?.IsInternational?.value
              : values?.IsInternational) === "2"
              ? true
              : false
          }
          lable={t("International_No")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        disabled={isDisableInputs}

        />

        <Input
          type="text"
          className="form-control"
          id="Locality"
          name="Place"
          value={values?.Place ? values?.Place : ""}
          onChange={handleChange}
          lable={t("Locality")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        disabled={isDisableInputs}

        />

        <Input
          type="text"
          className="form-control"
          id="Membership_No"
          name="MemberShipCardNo"
          value={values?.MemberShipCardNo ? values?.MemberShipCardNo : ""}
          onChange={handleChange}
          lable={t("Membership_No")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        disabled={isDisableInputs}

        />
        <ReactSelect
          placeholderName={t("Patient_Type")}
          searchable={true}
          id={"PatientType"}
          name="HospPatientType"
          value={`${values?.HospPatientType}`}
          handleChange={handleReactSelect}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          dynamicOptions={filterByType(
            CentreWiseCache,
            12,
            "TypeID",
            "TextField",
            "ValueField"
          )}
          isDisabled={isDisableInputs}
        />
        <ReactSelect
          placeholderName={t("Source")}
          searchable={true}
          id={"source"}
          name="source"
          removeIsClearable={true}
          value={`${values?.source ? values?.source : "OPD"}`}
          handleChange={handleReactSelect}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          dynamicOptions={ [
            { label: "OPD", value: "OPD" },
            { label: "EMG", value: "EMG" },
            { label: "OUTSOURCE", value: "OUTSOURCE" },
          ]}
          isDisabled={isDisableInputs}
        />

        <Input
          type="text"
          className="form-control"
          id="Emp_refID"
          name="EmployeeReferenceID"
          value={values?.EmployeeReferenceID ? values?.EmployeeReferenceID : ""}
          onChange={handleChange}
          lable={t("Emp_refID")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          disabled={isDisableInputs}
        />
        <Input
          type="text"
          className="form-control"
          id="IdentificationMark"
          name="IdentificationMark"
          value={values?.IdentificationMark ? values?.IdentificationMark : ""}
          onChange={handleChange}
          lable={t("Identity_Mark")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          disabled={isDisableInputs}
        />
        <Input
          type="text"
          className="form-control"
          id="IdentificationMarkSecond"
          name="IdentificationMarkSecond"
          value={
            values?.IdentificationMarkSecond
              ? values?.IdentificationMarkSecond
              : ""
          }
          onChange={handleChange}
          lable={t("Identity_Mark2")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          disabled={isDisableInputs}
        />

        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <div className="d-flex">
            <ReactSelect
              placeholderName={t("Reference_Type")}
              id="ReferenceType"
              searchable={true}
              respclass="w-100 pr-2"
              name="TypeOfReference"
              value={values?.TypeOfReference}
              handleChange={handleReactSelect}
              // respclass="col-sm-10 col-lg-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10 col-11"
              dynamicOptions={filterByType(
                CentreWiseCache,
                20,
                "TypeID",
                "TextField",
                "ValueField"
              )}
              isDisabled={isDisableInputs}
            />
            <div>
              <button
                className="btn btn-sm btn-primary"
                disabled={isDisableInputs}
                onClick={() =>
                  handleModel(
                    t("Add Reference Type"),
                    "20vw",
                    "ReferenceType",
                    true,
                    <ReferenceTypeModel
                      handleChangeModel={handleChangeModel}
                      inputData={{
                        userID: userData?.employeeID,
                      }}
                    />,
                    handleReferenceTypeAPI
                  )
                }
                type="button"
              >
                <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
              </button>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <div className="row">
            <Input
              type="text"
              className="form-control"
              id="MLC_NO"
              onChange={(e) => {
                inputBoxValidation(
                  MOBILE_NUMBER_VALIDATION_REGX,
                  e,
                  handleChange
                );
              }}
              showTooltipCount={true}
              value={values?.MLC_NO ? values?.MLC_NO : ""}
              name="MLC_NO"
              lable={t("MLC_NO")}
              placeholder=" "
              respclass="col-6"
              disabled={isDisableInputs}
            />

            <ReactSelect
              placeholderName={t("MLC Type")}
              id={"MLC"}
              searchable={true}
              name="MLC_Type"
              value={values?.MLC_Type}
              handleChange={handleReactSelect}
              respclass="col-6"
              dynamicOptions={filterByType(
                CentreWiseCache,
                23,
                "TypeID",
                "TextField",
                "ValueField"
              )}
              isDisabled={isDisableInputs}
            />
          </div>
        </div>
      </div>
      <div className="d-flex">
        <ReactSelect
          placeholderName={t("Relation_Of")}
          id="Relation"
          searchable={true}
          name="Relation"
          value={relation?.Relation}
          handleChange={handleChangRelation}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          dynamicOptions={filterByType(
            CentreWiseCache,
            6,
            "TypeID",
            "TextField",
            "ValueField"
          )}
          isDisabled={isDisableInputs}
        />

        <Input
          type="text"
          className="form-control"
          id="Relation_Name"
          name="RelationName"
          value={relation.RelationName}
          onChange={(e) =>
            setRelation({ ...relation, RelationName: e.target.value })
          }
          lable={t("Relation_Name")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          disabled={isDisableInputs}
        />
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <div className="d-flex">
            <Input
              type="text"
              className="form-control"
              id="Relation_Phone"
              name="RelationPhone"
              value={relation.RelationPhone}
              // onChange={(e) =>
              //   setRelation({ ...relation, RelationPhone: e.target.value })
              // }

              onChange={(e) => {
                const value = e.target.value;
                if (MOBILE_NUMBER_VALIDATION_REGX.test(value)) {
                  setRelation({ ...relation, RelationPhone: value });
                }
              }}
              lable={t("Relation_Phone")}
              placeholder=" "
              respclass="w-100 pr-2"
              disabled={isDisableInputs}
            />

            <div>
              <button
                className="btn btn-sm btn-primary"
                // className="btn btn-primary p-2 rounded-circle"
                onClick={handleAddRelation}
                disabled={isDisableInputs}
                type="button"
              >
                <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {relations?.length > 0 && (
        <Card className="mb-1 ">
          <div className="col-12">
            <Tables
              tbody={relations.map((rel, index) => ({
                checkBox: (
                  <Checkbox
                    key={index}
                    type="checkbox"
                    checked={rel.isPersonal}
                    onChange={() => handlePersonalToggle(index)}
                  />
                ),
                relation: rel.Relation,
                RelationName: rel.RelationName,
                RelationPhone: rel.RelationPhone,
                delete: (
                
                  <i
                    className="fa fa-trash"
                    onClick={() => handleDeleteRelation(index)}
                    aria-hidden="true"
                    id="redDeleteColor"
                   
                  ></i>
                 
                ),
              }))}
              thead={[
                { width: "2%", name: "isPersonal " },
                { name: "Relation Of " },
                { name: "Relation Name" },
                { name: "Relation Phone" },
                { width: "5%", name: "Action" },
              ]}
            />
          </div>
        </Card>
      )}

      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          handleAPI={handleModelData?.handleInsertAPI}
          setModalData={setModalData}
          modalData={modalData}
        >
          {handleModelData?.Component}
        </Modal>
      )}
    </>
  );
}
