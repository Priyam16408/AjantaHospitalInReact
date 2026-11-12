import React, { useEffect, useState } from "react";
import Tables from "../index";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../formComponent/CustomSelect";
import Input from "../../../formComponent/Input";
import ReactSelect from "../../../formComponent/ReactSelect";
import SampleDetailsHashModel from "../../../modalComponent/Utils/SampleDetailsHashModel";
import SampleCollectionRejectModel from "../../../modalComponent/Utils/SampleCollectionRejectModel";
import { SampleRejection } from "../../../../networkServices/nursingWardAPI";
import { notify } from "../../../../utils/utils";
const index = ({ tbody, thead, tableHeight, handleCustomSelect, handleChangeCheckbox, collectPayload, setCollectPayload, setHandleModelData, setModalData }) => {
    const [t] = useTranslation();

    const [tablebody, setTableBody] = useState([]);
    const nuberOfSp = [];
    for (let i = 0; i <= 9; i++) {
        nuberOfSp.push({ label: i.toString(), value: i.toString() });
    }


    const handleChangeRejectModel = (data) => {
        setModalData(data)
    }

    const RejectSampleCollection = async (data) => {
        let apiResp = await SampleRejection(data, "SampleCollection")
        if (apiResp?.success) {
            setHandleModelData((val) => ({ ...val, isOpen: false }));
            notify(apiResp?.message, "success")
        } else {
            console.log(apiResp?.message)
            notify(apiResp?.message, "error")
        }
    }

    const handleClickHash = (item) => {

        let obj={}
        if(item?.IsSampleCollected === "S"){
            obj.name=item?.SampleCollector
            obj.date=item?.colldate
        }
        if(item?.IsSampleCollected === "Y"){
            obj.name=item?.SampleReceiver
            obj.date=item?.recdate
        }
        if(item?.IsSampleCollected === "R"){
            obj.name=item?.rejectedBy
            obj.date=item?.rejectdate
        }



        setHandleModelData({
            label: t("NursingWard.SampleCollection.SampleDetails"),
            buttonName: "",
            width: "20vw",
            isOpen: true,
            Component: <SampleDetailsHashModel inputData={obj} />,
            handleInsertAPI: () => { },
            extrabutton: <></>,
            footer: <></>,
        })
    }
    const handleClickReject = (item) => {
        setHandleModelData({
            label: t("NursingWard.SampleCollection.SampleDetails"),
            buttonName: t("NursingWard.SampleCollection.Reject"),
            width: "30vw",
            isOpen: true,
            Component: <SampleCollectionRejectModel inputData={item} handleChangeModel={handleChangeRejectModel} />,
            handleInsertAPI: RejectSampleCollection,
            extrabutton: <></>,
            // footer: <></>,
        })
    }


    // {TestID:TestID,sampleTypeID:  (val?.reporttype==7)? val?.SampleID?.split("|")[0]?.split("^")[0]:sampleTyplDropdownValue,sampleType:(val?.reporttype==7)?val?.SampleID?.split("|")[0]?.split("^")[1]:sampleTyplDropdownText,HistoDoctorId:(val?.reporttype==7)?doctorlistValue:"",barcodeNuber:(val?.PrePrintedBarcode === 1)?sinNumberRequiredFileld:BarcodeNo,PerformingTestCentre:val?.PerformingTestCentre,hinstoCYTOsampleDetail: (val?.reporttype==7)?NumberofcontainerValue^NumberofSlidesValue^NumberofBlockValue:"",histoCatoStatus:(val?.reporttype==7)?"Assigned":"",sampleCollectionDAte:(val?.PrePrintedBarcode===1 && val?.BarcodeNo!=="")?val?.Acutalwithdrawdate:"",AnatomicID:"0",AnatomicType:"",textDiagonostic:"" }


    // {
    //     "ipAddress": "0.0.0.0",
    //     "data": [
    //       "O32#1#EDTA##AM049946#0####6# Movements#","O32#1#EDTA##AM049946#0####6# Movements#"

    //       "TestID#sampleTypeID#sampleType#HistoDoctorId#barcodeNuber#PerformingTestCentre#hinstoCYTOsampleDetail#histoCatoStatus#sampleCollectionDAte#AnatomicID#AnatomicType#textDiagonostic"
    //     ]
    //   }

    // save onclick
    // barcodeNuber="" >>> please enter the barcode number
    // sampleType="" >>> please select the sample Type

    // id did not select any checkbox please check atleast one row 

    const setBodyData = () => {

        let list = []
        tbody?.map((val, index) => {
            let obj = {}
            obj.sr = index + 1
            obj.SampleType = val?.IsSampleCollected === "N" ? (val?.reporttype !== "7") ?
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
                :
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
                        value={val?.SampleID ? val?.SampleID?.split("|")[0]?.split("^")[1] : ""}
                        // onChange={handleChange}
                        lable={t("NursingWard.SampleCollection.SpecimenType")}
                        placeholder=" "
                        respclass="mt-1"
                        disabled={true}
                    />

                    <ReactSelect
                        placeholderName={t("NursingWard.SampleCollection.Numberofcontainer")}
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
                        placeholderName={t("NursingWard.SampleCollection.NumberofSlides")}
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
                        placeholderName={t("NursingWard.SampleCollection.NumberofBlock")}
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
                : ""
            // obj.patientName = val?.PName
            obj.Investigation = val?.name

            obj.BarcodeNo = (val?.IsSampleCollected === "N") && (val?.PrePrintedBarcode === 1) ?
                <Input
                    type="text"
                    className="form-control required-fields"
                    id="sinNumber"
                    name="sinNumber"
                    value={val?.sinNumber ? val?.sinNumber : ""}
                    onChange={(e) => { handleCustomSelect(index, "sinNumber", e.target.value) }}
                    lable={t("NursingWard.SampleCollection.sinNumber")}
                    placeholder=" "
                    respclass="mt-1"
                    disabled={true}
                />
                : val?.BarcodeNo

            obj.SCWithdrawReqDate = val?.Samplerequestdate
            obj.SCActualWithdrawReqDate = val?.Acutalwithdrawdate
            obj.DevationTime = val?.DevationTime

            obj["Actions"] = (
                <div style={{ textAlign: "center" }}>
                    {val?.IsSampleCollected === "N" ? <input type="checkbox" onChange={(e) => { handleChangeCheckbox(e, val) }} checked={val?.isChecked} /> : ""}
                </div>
            )

            obj.VialColor = val?.colorcode ? <span style={{ background: `${val?.colorcode?.split("^")[1]}`, borderRadius: "50%", padding: "3px 7px 3px 7px" }}>{val?.colorcode?.split("^")[0]} </span> : ""

            obj.hash = (val?.IsSampleCollected === "S") ? <span onClick={() => { handleClickHash(val) }} style={{ background: "green", padding: "3px 7px 3px 7px", borderRadius: "50%", color: "#fff" }}>C</span> :
                (val?.IsSampleCollected === "Y") ? <span onClick={() => { handleClickHash(val) }} style={{ background: "blue", padding: "3px 7px 3px 7px", borderRadius: "50%", color: "#fff" }}>Y</span> : (val?.IsSampleCollected === "R") ? <span onClick={() => { handleClickHash(val) }} style={{ background: "red", padding: "3px 7px 3px 7px", borderRadius: "50%", color: "#fff" }}>R</span> : <></>

            obj.reprint = ((val?.IsSampleCollected !== "N") && (val?.IsSampleCollected !== "R")) ? <i className="fa fa-print card-print-upload-image-icon" aria-hidden="true"></i> : ""

            obj.Reject = (((val?.IsSampleCollected !== "N") && (val?.IsSampleCollected !== "R") && (!val?.Result_Flag)) ? <span onClick={() => { handleClickReject(val) }}>R </span> : "")
            // obj.Reject = 
            list.push(obj);
        })
        setTableBody(list)

    }

    useEffect(() => {
        setBodyData()
    }, [tbody])




    return (
        <>
            <Tables
                thead={thead}
                tbody={tablebody}
                tableHeight={tableHeight}
            />
        </>
    );
};

export default index;
