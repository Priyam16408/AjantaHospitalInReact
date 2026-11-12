import React, { useState, useEffect } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import moment from "moment";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
import Tables from "../../components/UI/customTable";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils"; 
import Modal from "../../components/modalComponent/Modal";
import { 
  BindDepartmentLab,
  BindlabOutSource,
  SaveDeptReceive,
  SaveOutsourceSample,
} from "../../networkServices/sampleoutsourcelab";

function SampleSendOutsouceLab() {
  const [t] = useTranslation();  
  const [values, setValues] = useState({
    BarcodeNo: "",
    UHID: "",
    status: { value: "s", label: "Pending" },
    department: { value: "0", label: "ALL" },
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),      
  });

  //Declaring ALL State
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [departmentData, setDepartmentData] = useState([]); 
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const [Lab,setLab] = useState([]);
  const isMobile = window.innerWidth <= 800;
  console.log(handleModelData);
  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };
  const handleSelectLab = (name, value,index) => {
    let data = [...tbodyPatientDetail]
    data[index][name]=value
    setTbodyPatientDetail(data)
    // setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(tbodyPatientDetail);

  const handleChangeCheckboxHeader = (e) => {
    const isChecked = e.target.checked;
    setIsHeaderChecked(isChecked);

    const updatedData = tbodyPatientDetail.map((val) => ({
      ...val,
      isChecked: isChecked,
    }));
    setTbodyPatientDetail(updatedData);
  };

  // Handle tbody checkbox
  const handleChangeCheckbox = (e, index) => {
    const updatedData = [...tbodyPatientDetail];
    updatedData[index].isChecked = e.target.checked;
    setTbodyPatientDetail(updatedData);
    const allChecked = updatedData.every((item) => item.isChecked);
    setIsHeaderChecked(allChecked);
  };


  
  const BindlabOutSourcelab = async () => { 
    try {
      const apiResp = await BindlabOutSource();
      console.log("the BindlabOutSource api response is",apiResp?.data);
      if (apiResp.success) {  
        setLab(handleReactSelectDropDownOptions(apiResp?.data,"Name","ID"));  
      } else {
        notify("Some error occurred", "error");
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  };
  
  

  const handleSearchSampleCollection = async () => {
    BindlabOutSourcelab();  

    const payload = [
    values?.department?.value?.toString() ?? "0",
      values?.BarcodeNo,
      values?.UHID,
      moment(values?.fromDate).format("DD-MMM-YYYY"),
      moment(values?.toDate).format("DD-MMM-YYYY"),
    ];
    try {
      const apiResp = await SaveDeptReceive(payload);
         if (apiResp.success) {
        let data = apiResp?.data?.map((val) => {
          val.isChecked = false;
          return val;
        });
        setTbodyPatientDetail(data);
      } else {
        notify("No records found", "error");
        setTbodyPatientDetail([]);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
      setTbodyPatientDetail([]);
    }
  }; 

  

  const CheckDepartment = async () => {
    try {
      const response = await BindDepartmentLab();
      if (response.success) {
        console.log("the department data is", response);
        setDepartmentData(response.data);
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

  const handleTransfer = async () => {
    console.log("the tbodypatientDetail idata is", tbodyPatientDetail);
    const anyChecked = tbodyPatientDetail.some((item) => item.isChecked);
    if (!anyChecked) {
      notify("Kindly select at least one sample", "error");
      return;
    }
    let TransferPayload = [];
    tbodyPatientDetail?.map((val) => { 
      console.log("the val value is ",val);
      if (val?.isChecked) {
        let payloadString = "";
        payloadString += `${val?.Test_ID || ""}#`;
        payloadString += `${val?.lab?.value || ""}#`; 
        payloadString += "#"; 
        TransferPayload.push(payloadString);
      }
    }); 
    try {
      const TransferResp = await SaveOutsourceSample(TransferPayload);
      if (TransferResp.success) {
        notify(`${TransferResp?.message}`, "success");
        handleSearchSampleCollection(); 
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
    }
  };

  useEffect(() => {
    CheckDepartment();
  }, []);

  const theadPatientDetail = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Barcode No") },
    { width: "15%", name: t("Patient Name") },
    { width: "10%", name: t("UHID") },
    { width: "10%", name: t("Age/Gender") },
    { width: "10%", name: t("Department Name") },
    { width: "10%", name: t("Test Name") },
    { width: "10%", name: t("Outsource Lab") },
    {
      width: "5%",
      name: isMobile ? (
        t("NursingWard.NurseAssignment.check")
      ) : (
        <input
          type="checkbox"
          checked={isHeaderChecked}
          onChange={handleChangeCheckboxHeader}
        />
      ),
    },
  ];
  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };
 
    
 
  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <Input
            type="text"
            className="form-control"
            id="BarcodeNo"
            placeholder=" "
            name="BarcodeNo"
            value={values?.BarcodeNo || ""}
            onChange={handleChange}
            lable={t("BarCode")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="UHID"
            name="UHID"
            value={values?.UHID || ""}
            onChange={handleChange}
            lable={t("UHID")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          /> 
   
          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                departmentData,
                "Name",
                "ObservationType_ID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
            name={"department"}
          />
          <DatePicker
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            value={values?.fromDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={values?.toDate}
          />

          <DatePicker
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            value={values?.toDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
            minDate={values?.fromDate}
          />
          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={handleSearchSampleCollection}
            >
              {t("Search")}
            </button>
          </div>
        </div>

        <Heading
          title=""
          isBreadcrumb={false}
          secondTitle={
            <>
              <ColorCodingSearch label={t("Pending")} color="#CC99FF" />
              <ColorCodingSearch label={t("Received")} color="bisque" />
              <ColorCodingSearch label={t("Reject")} color="#FF0000" />
            </>
          }
        /> 
        {tbodyPatientDetail.length > 0 && (
          <div className="card">
            <Tables
              thead={theadPatientDetail}
              tbody={tbodyPatientDetail?.map((val, index) => ({
                sno: index + 1,
                BarCodeNo: val.BarcodeNo || "",
                PatientName: val.PatientName || "",
                UHID: val.PatientID || "",
                AgeGender: val.Age || "",
                DepartmentName: val.DeptName || "",
                TestName: val.TestName || "",
                LabOutSourceName: (
                  <ReactSelect
                  placeholderName={t("Lab OurSource Name")}
                  id={"lab"}
                  searchable={true} 
                  dynamicOptions={Lab} 
                  value={val?.lab}
                  handleChange={(name,value)=>{handleSelectLab(name,value,index)}} 
                  name={"lab"}
                />
                ), 
                isChecked: (
                  <input
                    type="checkbox"
                    checked={val.isChecked}
                    onChange={(e) => handleChangeCheckbox(e, index)}
                    disabled={val.OutSourceID === ""}
                  />
                ),
                
              }))}
              tableHeight={"scrollView"}
              style={{ height: "60vh", padding: "2px" }}
            />
            <div className="col-sm-12 d-flex justify-content-end gap-2">
              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={handleTransfer}
              >
                {t("Send To Outsource Lab")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SampleSendOutsouceLab;
