import React, { useEffect, useState } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  GetBindDepartment,
  GetBindReferDoctor,
} from "../../store/reducers/common/CommonExportFunction";
import { GetBindDoctorDept } from "../../networkServices/opdserviceAPI";
import TextAreaInput from "../formComponent/TextAreaInput";
import { AutoComplete } from "primereact/autocomplete";

const TransferReffralConsultation = (props) => {
  const {
    prisciptionForm,
    handlechangebyPrisciption,
    handleReactSelectChangebyPrisciption,
    onFocus,
  } = props;

  const dispatch = useDispatch();
  const {
    GetDepartmentList,
    GetBindAllDoctorConfirmationData,
    GetBindReferDoctorList,
  } = useSelector((state) => state.CommonSlice);

  const [doctorType, setDoctorType] = useState(prisciptionForm?.DoctorType || "In-House");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // const [apiData, setApiData] = useState([]);
  const TEXTAREA_RENDER = [
    {
      Typename: "Impression/Diagnosis :",
      handleChangeOnchange: handlechangebyPrisciption,
      value: prisciptionForm?.ImpressionDiagnosis,
      name: "ImpressionDiagnosis",
    },
    {
      Typename: "Remarks :",
      handleChangeOnchange: handlechangebyPrisciption,
      value: prisciptionForm?.Remarks,
      name: "Remarks",
    },
  ];

  useEffect(() => {
    setDoctorType(prisciptionForm?.DoctorType);
  }, [prisciptionForm?.DoctorType]);

  useEffect(() => {
    dispatch(GetBindDepartment());
    dispatch(GetBindReferDoctor());

    // getBindDoctorDepartment();
    // dispatch(GetBindDoctorDept("ALL"))
  }, []);

  const handleReactSelectChange = async (name, e) => {
    console.log(e,"tatatatatatat");

    setDoctorType(e?.value);
    handleReactSelectChangebyPrisciption(name, e);

    // switch (name) {
    //   case "ReferDoctor":
    //     return dispatch(GetBindReferDoctor());
    //   default:
    //     break;
    // }
  };
  const searchDoctor = (event) => {
    const query = event.query.toLowerCase();

    const filtered = (GetBindReferDoctorList || []).filter((doctor) =>
      doctor?.NAME?.toLowerCase().includes(query),
    );

    setFilteredDoctors(filtered);
  };
  const searchInHouseDoctor = (event) => {
    const query = event.query.toLowerCase();

    const filtered = (GetBindAllDoctorConfirmationData || [])
      .filter(
        (doc) =>
          doc?.DocDepartmentID?.toString() ===
          prisciptionForm?.department?.value?.toString(),
      )
      .filter((doctor) => doctor?.Name?.toLowerCase().includes(query));

    setFilteredDoctors(filtered);
  };
  // const handleInHouseAutoCompleteChange = (e) => {
  //   const value = typeof e.value === "string" ? e.value : e.value?.Name;

  //   handleReactSelectChangebyPrisciption("referTo", value);
  // };
  const handleAutoCompleteChange = (e) => {
    const value =
      typeof e.value === "string" ? e.value : e.value?.Name || e.value?.NAME;

    handleReactSelectChangebyPrisciption("referTo", value);
  };
  return (
    <>
      <div className="row mt-2">
        <div className="col-sm-6">
          <ReactSelect
            placeholderName={"Doctor Type"}
            id={"Type"}
            searchable={true}
            name={"DoctorType"}
            respclass=""
            dynamicOptions={[
              { label: "In-House", value:"In-House" },
              { label: "OutSide", value:"Out-Side" },
            ]}
            handleChange={handleReactSelectChange}
            value={doctorType}
            removeIsClearable={false}
          />
        </div>
        {doctorType === "In-House" && (
          <div className="col-sm-6">
            <ReactSelect
              placeholderName={"Department"}
              id={"Department"}
              searchable={true}
              name={"department"}
              respclass=""
              dynamicOptions={
                Array.isArray(GetDepartmentList) &&
                GetDepartmentList?.map((item) => {
                  return {
                    label: item?.Name,
                    value: item?.ID,
                  };
                })
              }
              handleChange={handleReactSelectChangebyPrisciption}
              // value={prisciptionForm?.department?.value}
              value={prisciptionForm?.department}
              removeIsClearable={false}
            />
          </div>
        )}
        {doctorType === "In-House" && (
          <div className="col-sm-6">
            <AutoComplete
              value={prisciptionForm?.referTo}
              id="Refer"
              name="referTo"
              suggestions={filteredDoctors}
              completeMethod={searchInHouseDoctor}
              field="Name"
              className="w-100"
              placeholder="Refer To"
              onChange={handleAutoCompleteChange}
            />
          </div>
        )}
        {/* {doctorType === "In-House" && (
          <div className="col-sm-4">
            <ReactSelect
              placeholderName={"Refer To"}
              id={"Refer"}
              searchable={true}
              name={"referTo"}
              respclass=""
              dynamicOptions={
                Array.isArray(GetBindAllDoctorConfirmationData) &&
                GetBindAllDoctorConfirmationData?.filter(
                  (doc) =>
                    doc?.DocDepartmentID?.toString() ===
                    prisciptionForm?.department?.value?.toString(),
                )?.map((item) => {
                  return {
                    label: item?.Name,
                    value: item?.DoctorID,
                  };
                })
              }
              handleChange={handleReactSelectChangebyPrisciption}
              value={prisciptionForm?.referTo?.value}
              removeIsClearable={false}
            />
          </div>
        )} */}

        {/* {doctorType === "Out-Side" && (
          <div className="col-sm-4">
            <ReactSelect
              placeholderName={"Refer To"}
              id={"ReferDoctor"}
              searchable={true}
              name={"referTo"}
              respclass=""
              dynamicOptions={
                Array.isArray(GetBindReferDoctorList) &&
                GetBindReferDoctorList?.map((item) => {
                  return {
                    label: item?.NAME,
                    value: item?.DoctorID,
                  };
                })
              }
              handleChange={handleReactSelectChangebyPrisciption}
              value={prisciptionForm?.referTo}
              removeIsClearable={false}
            />
          </div>
        )} */}
        {console.log("prisciptionForm?.referTo", prisciptionForm)}
        {doctorType === "Out-Side" && (
          <div className="col-sm-6">
            <AutoComplete
              value={prisciptionForm?.referTo}
              id="ReferDoctor"
              name="referTo"
              suggestions={filteredDoctors}
              completeMethod={searchDoctor}
              field="NAME"
              className="w-100"
              placeholder="Refer To"
              onChange={handleAutoCompleteChange}
            />
          </div>
        )}
        <div className="col-sm-6">
          <ReactSelect
            placeholderName={"Referral Type"}
            id={"referralType"}
            searchable={true}
            name={"referralType"}
            respclass=""
            dynamicOptions={[
              { label: "Urgent", value: "Urgent" },
              { label: "Routine", value: "Routine" },
            ]}
            handleChange={handleReactSelectChangebyPrisciption}
            value={prisciptionForm?.referralType}
            removeIsClearable={false}
          />
        </div>

        <div className="col-sm-6">
          <ReactSelect
            placeholderName={"Consult Type"}
            id={"Consult"}
            searchable={true}
            name={"consultType"}
            respclass=""
            dynamicOptions={[
              { label: "Refer", value: "Refer" },
              { label: "Transfer", value: "Transfer" },
            ]}
            handleChange={handleReactSelectChangebyPrisciption}
            value={prisciptionForm?.consultType}
            removeIsClearable={false}
          />
        </div>

        {/* <div className="col-sm-12 ">
          <div className="row justify-content-center px-2"> */}
        {TEXTAREA_RENDER?.map((ele, index) => (
          <div
            className="col-sm-6"
            // className="col-md-12 col-lg-6 col-6 col-sm-12 "
            key={index}
          >
            {/* <div className="row">
                <label htmlFor={ele} className="col-3">
                  {ele.Typename}
                </label> */}
            <TextAreaInput
              id={ele.name}
              lable={ele.Typename}
              className="col-12"
              onFocus={onFocus}
              name={ele.name}
              value={ele.value}
              onChange={ele.handleChangeOnchange}
              placeholder=" "
            />
            {/* <textarea id={ele} className="w-50" value={ele.value} name={ele.name} onChange={ele.handleChangeOnchange} /> */}
            {/* </div> */}
          </div>
        ))}
        {/* </div>
        </div> */}
      </div>
    </>
  );
};

export default TransferReffralConsultation;
