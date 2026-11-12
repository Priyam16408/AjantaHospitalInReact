import React, { useEffect, useState } from "react";
import Tables from "../index";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../formComponent/CustomSelect";
import Input from "../../../formComponent/Input";
import ReactSelect from "../../../formComponent/ReactSelect";
import SampleDetailsHashModel from "../../../modalComponent/Utils/SampleDetailsHashModel";
import SampleCollectionRejectModel from "../../../modalComponent/Utils/SampleCollectionRejectModel";
import {
  SampleRejection,
  SampleCollectionDiagonsis,
  GetBarcodeInfo,
} from "../../../../networkServices/nursingWardAPI";
import { notify } from "../../../../utils/utils";
import { CancelSVG, ReprintSVG } from "../../../SvgIcons";
import { SaveSampleRejectReasonApi } from "../../../../networkServices/SampleCollectionAPI";
const index = ({
  tbody,
  setTbody,
  thead,
  tableHeight,
  handleCustomSelect,
  handleChangeCheckbox,
  collectPayload,
  setCollectPayload,
  setHandleModelData,
  setModalData,
  BindSampleDetail,
}) => {
  const [t] = useTranslation();

  const [tablebody, setTableBody] = useState([]);
  const [noOfPrint, setNoOfPrint] = useState([]);

  const nuberOfSp = [];
  for (let i = 0; i <= 9; i++) {
    nuberOfSp.push({ label: i.toString(), value: i.toString() });
  }

  const handleChangeRejectModel = (data) => {
    setModalData(data);
  };

  const RejectSampleCollection = async (data) => {

    if (data?.newReason) {
      const payloadReason = {
        reasion: data?.newReason,
      };
      try {
        const response = await SaveSampleRejectReasonApi(payloadReason);
        if (response?.success) {
          notify("Reason saved successfully", "success");
          setIsInput(false);
        }
      } catch (error) {
        console.log("Error fetching data", "error");
      }
    }
    let payload = {
      rejectReason: data?.newReason || data?.rejectreason,
      testID: data?.TestID,
      currentPageName: "SampleCollection",
    };
    let apiResp = await SampleRejection(payload);
    if (apiResp?.success) {
      BindSampleDetail(data);
      setHandleModelData((val) => ({ ...val, isOpen: false }));
      notify(apiResp?.message, "success");
    } else {
      console.log(apiResp?.message);
      notify(apiResp?.message, "error");
    }
  };
  const handleClickRePrint = async (data, index) => {
    const printCount = parseInt(data[`NoOfPrint${index}`] || 1);
    // console.log(printCount);
    const testIdsToSend = [];
    for (let i = 0; i < printCount; i++) {
      const item = tbody[index + i]; // get item from main array
      if (item) {
        testIdsToSend.push(item.Test_ID);
      }
    }
    const payload = {
      barcodeNo: data.BarcodeNo,
      nofprint: printCount?.toString(),
      testID: testIdsToSend?.toString(),
    };
    console.log("xaa", payload);

    const resp = await GetBarcodeInfo(payload);
    if (resp?.success === true) {
      window.open(resp?.data, "_blank");
    } else {
      notify(resp?.message, "warn");
    }
  };

  console.log(noOfPrint, "nnoOfPrint");
  const handleChangeNumberOfPrint = (e, index, fieldName) => {
    const { name, value } = e.target;

    let data = [...tbody];
    data[index][fieldName] = value;

    setTbody(data);

    // setNoOfPrint((prev) => {
    //     const updated = [...prev];
    //     updated[index] = {
    //         ...(prev[index] || {}),
    //         [fieldName]: value,
    //     };
    //     return updated;
    // });
    // setNoOfPrint((prev) => ({
    //     ...prev,
    //     [index]: {
    //         ...(prev[index] || {}),
    //         [name]: value,
    //     },
    // }));
  };
  const handleClickHash = (item) => {
    let obj = {};
    if (item?.IsSampleCollected === "S") {
      obj.name = item?.SampleCollector;
      obj.date = item?.colldate;
    }
    if (item?.IsSampleCollected === "Y") {
      obj.name = item?.SampleReceiver;
      obj.date = item?.recdate;
    }
    if (item?.IsSampleCollected === "R") {
      obj.name = item?.rejectedBy;
      obj.date = item?.rejectdate;
    }

    // NursingWard.SampleCollection.
    setHandleModelData({
      label: t("Sample Details"),
      buttonName: "",
      width: "30vw",
      isOpen: true,
      Component: <SampleDetailsHashModel inputData={obj} />,
      handleInsertAPI: () => {},
      extrabutton: <></>,
      footer: <></>,
    });
  };
  const handleClickReject = (item) => {
    setHandleModelData({
      label: t("Sample Reject"),
      buttonName: t("Reject"),
      width: "30vw",
      isOpen: true,
      Component: (
        <SampleCollectionRejectModel
          inputData={item}
          handleChangeModel={handleChangeRejectModel}
        />
      ),
      handleInsertAPI: RejectSampleCollection,
      extrabutton: <></>,
      // footer: <></>,
    });
  };

  const SampleDiagnosisModel = ({ inputData }) => {
    console.log("sss", inputData);

    return (
      <div>
        <p>
          <strong>Patient Name:</strong> {inputData?.Pname}
        </p>
        <p>
          <strong>UHID :</strong> {inputData?.PatientID}
        </p>
        <p>
          <strong>Diagnosis:</strong> {inputData?.Diagnosis}
        </p>
      </div>
    );
  };
  const handleModalDiagnosis = async (item) => {
    try {
      const resp = await SampleCollectionDiagonsis(item?.TransactionID);
      console.log(resp);

      setHandleModelData({
        label: t("SampleDetails"),
        buttonName: "",
        width: "30vw",
        isOpen: true,
        Component: <SampleDiagnosisModel inputData={resp.data[0]} />,
        // handleInsertAPI: RejectSampleCollection,
        extrabutton: <></>,
        footer: (
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setHandleModelData({ isOpen: false })}
            >
              {t("Close")}
            </button>
          </>
        ),
      });
    } catch (error) {}
  };
  const setBodyData = () => {
    let list = [];
    tbody?.map((val, index) => {
      console.log("dddd", val);

      let obj = {};
      obj.sr = index + 1;
      obj.SampleType =
        val?.IsSampleCollected === "N" ? (
          val?.reporttype !== "7" ? (
            <ReactSelect
              placeholderName={t("NursingWard.SampleCollection.SampleTypes")}
              id={"SampleTypesSelect"}
              value={val?.SampleTypesSelect?.value}
              handleChange={(name, e) => handleCustomSelect(index, name, e)}
              searchable={true}
              name={"SampleTypesSelect"}
              dynamicOptions={val?.SampleTypes}
              removeIsClearable={true}
              respclass="mt-1 w-120px"
            />
          ) : (
            <>
              <ReactSelect
                placeholderName={t("NursingWard.SampleCollection.doctorlist")}
                id={"doctorlistSelect"}
                value={val?.doctorlistSelect?.value}
                handleChange={(name, e) => handleCustomSelect(index, name, e)}
                searchable={true}
                name={"doctorlistSelect"}
                dynamicOptions={val?.doctorlist}
                removeIsClearable={true}
                respclass="mt-1 w-120px"
              />

              <Input
                type="text"
                className="form-control lightBlue"
                id="SpecimenType"
                name="SpecimenType"
                value={
                  val?.SampleID
                    ? val?.SampleID?.split("|")[0]?.split("^")[1]
                    : ""
                }
                // onChange={handleChange}
                lable={t("NursingWard.SampleCollection.SpecimenType")}
                placeholder=" "
                respclass="mt-1"
                disabled={true}
              />

              <ReactSelect
                placeholderName={t(
                  "NursingWard.SampleCollection.Numberofcontainer"
                )}
                id={"Numberofcontainer"}
                value={val?.Numberofcontainer?.value}
                handleChange={(name, e) => handleCustomSelect(index, name, e)}
                searchable={true}
                name={"Numberofcontainer"}
                dynamicOptions={nuberOfSp}
                removeIsClearable={true}
                respclass="mt-1"
              />

              <ReactSelect
                placeholderName={t(
                  "NursingWard.SampleCollection.NumberofSlides"
                )}
                id={"NumberofSlides"}
                value={val?.NumberofSlides?.value}
                onChange={(name, e) => handleCustomSelect(index, name, e)}
                searchable={true}
                name={"NumberofSlides"}
                dynamicOptions={nuberOfSp}
                removeIsClearable={true}
                respclass="mt-1"
              />

              <ReactSelect
                placeholderName={t(
                  "NursingWard.SampleCollection.NumberofBlock"
                )}
                id={"NumberofBlock"}
                value={val?.NumberofBlock?.value}
                handleChange={(name, e) => handleCustomSelect(index, name, e)}
                searchable={true}
                name={"NumberofBlock"}
                dynamicOptions={nuberOfSp}
                removeIsClearable={true}
                respclass="mt-1"
              />
            </>
          )
        ) : (
          <>{val?.SampleType}</>
        );
      // obj.UHID=val?.UHID
      obj.AnatomicTypes =
        val?.IsSampleCollected === "N" ? (
          <ReactSelect
            placeholderName={t("NursingWard.SampleCollection.AnatomicTypes")}
            id={"AnatomicTypesSelect"}
            value={val?.AnatomicTypesSelect?.value}
            handleChange={(name, e) => handleCustomSelect(index, name, e)}
            searchable={true}
            name={"AnatomicTypesSelect"}
            dynamicOptions={[{ label: "", value: "0" }].concat(
              val?.AnatomicTypes
            )}
            removeIsClearable={true}
            respclass="mt-1"
          />
        ) : (
          val?.AnatomicTypes?.find(
            (item) => item?.value === val?.AnatomicId?.toString()
          )?.label || "-"
        );
      obj.bed = val?.bed;
      obj.UHID = val?.patientid;
      obj.PName = val?.PName;
      obj.Investigation = val?.name;

      obj.BarcodeNo =
        val?.IsSampleCollected === "N" && val?.PrePrintedBarcode === 1 ? (
          <Input
            type="text"
            className="form-control required-fields"
            id="sinNumber"
            name="sinNumber"
            value={val?.sinNumber ? val?.sinNumber : ""}
            onChange={(e) => {
              handleCustomSelect(index, "sinNumber", e.target.value);
            }}
            lable={t("NursingWard.SampleCollection.sinNumber")}
            placeholder=" "
            respclass="mt-1"
            disabled={true}
          />
        ) : (
          val?.BarcodeNo
        );

      obj.SCWithdrawReqDate = val?.Samplerequestdate;
      obj.SCActualWithdrawReqDate = val?.Acutalwithdrawdate;
      obj.DevationTime = val?.DevationTime;
      obj["NoOfPrint"] = (
        <input
          type="number"
          className="form-control lightBlue"
          id="NoOfPrint"
          name={`NoOfPrint${index}`}
          value={val[`NoOfPrint${index}`] ? val[`NoOfPrint${index}`] : ""}
          onChange={(e) =>
            handleChangeNumberOfPrint(e, index, `NoOfPrint${index}`)
          }
        />
      );
      obj["Actions"] = (
        <div style={{ textAlign: "center" }}>
          {val?.IsSampleCollected === "N" ? (
            <input
              type="checkbox"
              onChange={(e) => {
                handleChangeCheckbox(e, val);
              }}
              checked={val?.isChecked}
            />
          ) : (
            ""
          )}
        </div>
      );

      obj.VialColor = val?.VialColor ? (
        <span
          style={{
            background: `${val?.VialColor?.split("^")[1]}`,
            borderRadius: "50%",
            padding: "3px 7px 3px 7px",
          }}
        >
          {val?.colorcode?.split("^")[0]}{" "}
        </span>
      ) : (
        <span
          style={{
            background: `${val?.colorcode?.split("^")[1]}`,
            borderRadius: "50%",
            padding: "3px 7px 3px 7px",
          }}
        >
          {val?.colorcode?.split("^")[0]}{" "}
        </span>
      );

      obj.hash =
        val?.IsSampleCollected === "S" ? (
          <span
            onClick={() => {
              handleClickHash(val);
            }}
            style={{
              background: "green",
              padding: "3px 7px 3px 7px",
              borderRadius: "50%",
              color: "#fff",
            }}
          >
            C
          </span>
        ) : val?.IsSampleCollected === "Y" ? (
          <span
            onClick={() => {
              handleClickHash(val);
            }}
            style={{
              background: "blue",
              padding: "3px 7px 3px 7px",
              borderRadius: "50%",
              color: "#fff",
            }}
          >
            Y
          </span>
        ) : val?.IsSampleCollected === "R" ? (
          <span
            onClick={() => {
              handleClickHash(val);
            }}
            style={{
              background: "red",
              padding: "3px 7px 3px 7px",
              borderRadius: "50%",
              color: "#fff",
            }}
          >
            R
          </span>
        ) : (
          <></>
        );

      obj.reprint =
        val?.IsSampleCollected !== "N" && val?.IsSampleCollected !== "R" ? (
          <span
            onClick={() => {
              handleClickRePrint(val, index);
            }}
          >
            <ReprintSVG />
          </span>
        ) : (
          ""
        );

      obj.Reject =
        val?.IsSampleCollected !== "N" &&
        val?.IsSampleCollected !== "R" &&
        !val?.Result_Flag ? (
          <span
            onClick={() => {
              handleClickReject(val);
            }}
          >
            <CancelSVG />
          </span>
        ) : (
          ""
        );

      obj.Diagnosis = (
        <>
          <div onClick={() => handleModalDiagnosis(val)}>
            <i className="fa fa-search " aria-hidden="true"></i>
          </div>
        </>
      );

            // obj.Diagnosis = val.IPDNo ? (
            //     <div onClick={() => handleModalDiagnosis(val)}>
            //         <i className="fa fa-search" aria-hidden="true"></i>
            //     </div>
            // ) : null;

      // obj.Reject =
      list.push(obj);
    });
    setTableBody(list);
  };

  useEffect(() => {
    setBodyData();
  }, [tbody]);

  return (
    <>
      <Tables
        thead={thead}
        tbody={tablebody}
        // tableHeight={tableHeight}
        style={{ maxHeight: "50vh" }}
        scrollView={"scrollView"}
      />
    </>
  );
};

export default index;
