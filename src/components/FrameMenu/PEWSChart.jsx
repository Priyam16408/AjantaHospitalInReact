import React, { useEffect, useState } from 'react'
import Heading from '../UI/Heading'
import { useTranslation } from 'react-i18next'
import DatePicker from '../formComponent/DatePicker';
import TimePicker from "../formComponent/TimePicker";
import Input from '../formComponent/Input';
import ReactSelect from '../formComponent/ReactSelect';
import MultiSelectComp from '../formComponent/MultiSelectComp';
import Tables from '../UI/customTable';
import { BindPhysiologicalAssessmentList, PEWSChartPrintOutAPI, PhysiologicalEarlyWarning, SaveEarlyWarningScoringDetails } from '../../networkServices/nursingWardAPI';
import { filterByTypes, notify, savePEWSChartPayload, timeFormateDate } from '../../utils/utils';
import { OpenPDFURL, RedirectURL } from '../../networkServices/PDFURL';
import moment from 'moment';

export default function ({ data }) {
    const [t] = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;

    let initialValue = { DATE: new Date(), TIME: new Date(), transactionID: data?.transactionID, LevelofConsciousness: [], toDate: new Date(), fromDate: new Date() }

    const [payload, setPayload] = useState({});
    const [values, setValues] = useState(initialValue);




    const LevelofConsciousness = [
        {
            name: "Confused",
            code: "1#Confused",
        },
        {
            name: "Alert",
            code: "0#Alert",
        },
        {
            name: "Verbal",
            code: "3#Verbal",
        },
        {
            name: "Pain",
            code: "3#Pain",
        },
        {
            name: "Unresponsive",
            code: "3#Unresponsive",
        },
    ];

    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues({ ...values, [name]: selectedOptions });
    };

    const thead = [
        { width: "1%", name: t("SNO") },
        t("Date"),
        t("Time"),
        t("Weight"),
        t("BMI"),
        t("CapillaryBloodGlucose"),
        t("RespiratoryRate"),
        t("OxygenSaturation"),
        t("InspiredO"),
        t("OxygenDeviceFMNCVenturi"),
        t("Temperature"),
        t("BloodPressure"),
        t("Entryby"),
        t("Edit"),
    ]


    const [physiologicalEarlyWarningList, setPhysiologicalEarlyWarning] = useState([])
    const [tbody, setTbody] = useState([])
    const BindPhysiologicalEarlyWarning = async () => {
        let apiResp = await PhysiologicalEarlyWarning();
        if (apiResp?.success) {
            setPhysiologicalEarlyWarning(apiResp?.data)
        }
    }

    const HandleEditPEWS = (val) => {

        let LevelofCons = []
        let Confused = LevelofConsciousness?.find((item) => { return item?.name === val?.ConfusedText })
        let AlertText = LevelofConsciousness?.find((item) => { return item?.name === val?.AlertText })
        let VerbalText = LevelofConsciousness?.find((item) => { return item?.name === val?.VerbalText })
        let PainText = LevelofConsciousness?.find((item) => { return item?.name === val?.PainText })
        let UnresponsiveText = LevelofConsciousness?.find((item) => { return item?.name === val?.UnresponsiveText })
        if (Confused) {
            LevelofCons.push(Confused)
        }
        if (AlertText) {
            LevelofCons.push(AlertText)
        }
        if (VerbalText) {
            LevelofCons.push(VerbalText)
        }
        if (PainText) {
            LevelofCons.push(PainText)
        }
        if (UnresponsiveText) {
            LevelofCons.push(UnresponsiveText)
        }



        let editPayload = {
            "ID": val?.ID,
            "DATE": new Date(val?.DATE),
            "TIME": timeFormateDate(val?.TIME),
            "transactionID": data?.transactionID,
            "LevelofConsciousness": LevelofCons,
            "Weight": val?.Weight,
            "BMI": val?.BMI,
            "CapillaryBloodGlucose": val?.CapillaryBloodGlucose,
            "RespiratoryRate": {
                "label": val?.RespiratoryRateText ? val?.RespiratoryRateText : "",
                "value": val?.RespiratoryRateText ? val?.RespiratoryRateText : "",
                "extraColomn": val?.RespiratoryRateValue ? val?.RespiratoryRateValue : ""
            },
            "OxygenSaturation": {
                "label": val?.OxygenSaturationText ? val?.OxygenSaturationText : "",
                "value": val?.OxygenSaturationText ? val?.OxygenSaturationText : "",
                "extraColomn": val?.OxygenSaturationValue ? val?.OxygenSaturationValue : ""
            },
            "VisualInfusionPhlebitis": {
                "label": val?.VisualInfusionPhlebitisText ? val?.VisualInfusionPhlebitisText : "",
                "value": val?.VisualInfusionPhlebitisText ? val?.VisualInfusionPhlebitisText : "",
                "extraColomn": val?.VisualInfusionPhlebitisValue ? val?.VisualInfusionPhlebitisValue : ""
            },
            "HeartRate": {
                "label": val?.HeartRateText ? val?.HeartRateText : "",
                "value": val?.HeartRateText ? val?.HeartRateText : "",
                "extraColomn": val?.HeartRateValue ? val?.HeartRateValue : ""
            },
            "BloodPressure": {
                "label": val?.BloodPressureText ? val?.BloodPressureText : "",
                "value": val?.BloodPressureText ? val?.BloodPressureText : "",
                "extraColomn": val?.BloodPressureValue ? val?.BloodPressureValue : ""
            },
            "UrineOutput": {
                "label": val?.UrineOutputText ? val?.UrineOutputText : "",
                "value": val?.UrineOutputText ? val?.UrineOutputText : "",
                "extraColomn": val?.UrineOutputValue ? val?.UrineOutputValue : ""
            },
            "NauseaAndVomitingScore": {
                "label": val?.NauseaAndVomitingScoreText ? val?.NauseaAndVomitingScoreText : "",
                "value": val?.NauseaAndVomitingScoreText ? val?.NauseaAndVomitingScoreText : "",
                "extraColomn": val?.NauseaAndVomitingScoreValue ? val?.NauseaAndVomitingScoreValue : ""
            },
            "Temperature": {
                "label": val?.TemperatureText ? val?.TemperatureText : "",
                "value": val?.TemperatureText ? val?.TemperatureText : "",
                "extraColomn": val?.TemperatureValue ? val?.TemperatureValue : ""
            },
            "OxygenDeviceFMNCVenturi": {
                "label": val?.OxygenDeviceText ? val?.OxygenDeviceText : "",
                "value": val?.OxygenDeviceText ? val?.OxygenDeviceText : "",
                "extraColomn": val?.OxygenDeviceValue ? val?.OxygenDeviceValue : ""
            },
            "Bowelsopened": {
                "label": val?.BowelsOpenedText ? val?.BowelsOpenedText : "",
                "value": val?.BowelsOpenedText ? val?.BowelsOpenedText : "",
                "extraColomn": val?.BowelsOpenedValue ? val?.BowelsOpenedValue : ""
            },
            "InspiredO": {
                "label": val?.InspiredText ? val?.InspiredText : "",
                "value": val?.InspiredText ? val?.InspiredText : "",
                "extraColomn": val?.InspiredValue ? val?.InspiredValue : ""
            },
            "PainScore": {
                "label": val?.PainScore ? val?.PainScore : "",
                "value": val?.PainScore ? val?.PainScore : "",
                "extraColomn": val?.PainScore ? val?.PainScore : ""
            }
        }
        setValues(editPayload)
    }

    const SearchPhysiologicalAssessmentData = async () => {
        // data?.transactionID
        let apiResp = await BindPhysiologicalAssessmentList(data?.transactionID)
        if (apiResp?.success) {
            let list = []
            apiResp?.data?.map((val, index) => {
                let obj = {
                    sno: index + 1,
                    DATE: val?.DATE,
                    TIME: val?.TIME,
                    Weight: val?.Weight,
                    BMI: val?.BMI,
                    CapillaryBloodGlucose: val?.CapillaryBloodGlucose,
                    RespiratoryRate: val?.RespiratoryRateText,
                    OxygenSaturation: val?.OxygenSaturationText,
                    Inspired: val?.InspiredText,
                    OxygenDevice: val?.OxygenDeviceText,
                    Temperature: val?.TemperatureText,
                    BloodPressure: val?.BloodPressureText,
                    entryby: val?.entryby,
                    edit: <i className="fa fa-edit" aria-hidden="true" onClick={() => { HandleEditPEWS(val) }}></i>
                }
                list.push(obj)
            })
            setTbody(list)
        }
    }

    useEffect(() => {
        BindPhysiologicalEarlyWarning()
        SearchPhysiologicalAssessmentData()
    }, [])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    };
    const handleReactSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }));
    };


    const savePEWSChartAPI = async () => {
        const payload = savePEWSChartPayload(values)
        try {
            let apiResp = await SaveEarlyWarningScoringDetails(payload);
            if (apiResp?.success) {
                notify(apiResp?.message, "success");
                setValues(initialValue);
                SearchPhysiologicalAssessmentData();
            } else {
                notify(apiResp?.message, "error")
            }
            if (apiResp?.status === 400) {
                notify(apiResp?.data?.title, "error")
            }
        } catch (error) {
            console.log("errorerrorerror", error)
            notify(apiResp?.message, "error")

        }
    }

    const PrintPEWSChart = async () => {
        // OpenPDFURL("PEWSChartPrintOut", moment(values?.fromDate).format("DD-MMM-YYYY"), moment(values?.toDate).format("DD-MMM-YYYY"),values?.transactionID);

        let payload = {
            "tid": values?.transactionID,
            "fromDate": moment(values?.fromDate).format("DD-MMM-YYYY"),
            "toDate": moment(values?.toDate).format("DD-MMM-YYYY")
        }
        let apiResp = await PEWSChartPrintOutAPI(payload)
        if (apiResp?.success) {
            RedirectURL(apiResp?.data?.pdfUrl);
        } else {
            notify(apiResp?.message, "error")
        }

    }
    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <form className="patient_registration card">
                    <Heading
                        title={t("HeadingName")}
                        isBreadcrumb={false} />

                    <div className="row p-2">
                        <div className='col-xl-2 col-md-4 col-sm-6 col-12 d-flex'>

                            <DatePicker
                                className={`custom-calendar `}
                                respclass="vital-sign-date"
                                id="DATE"
                                name="DATE"
                                inputClassName={"required-fields"}
                                value={values?.DATE ? values?.DATE : new Date()}
                                handleChange={handleChange}
                                lable={t("Date")}
                                placeholder={VITE_DATE_FORMAT}
                            />
                            <TimePicker
                                placeholderName={t("Time")}
                                lable={t("Time")}
                                id="TIME"
                                respclass="vital-sign-time ml-1"
                                name="TIME"
                                value={values?.TIME ? values?.TIME : new Date()}
                                handleChange={handleChange}
                            />

                        </div>

                        <Input
                            type="text"
                            className="form-control "
                            id="Weight"
                            name="Weight"
                            value={values?.Weight ? values?.Weight : ""}
                            onChange={handleChange}
                            lable={t("Weight")}
                            // lable={"FiO2"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="BMI"
                            name="BMI"
                            value={values?.BMI ? values?.BMI : ""}
                            onChange={handleChange}
                            lable={t("BMI")}
                            // lable={"PIP or MAP"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="CapillaryBloodGlucose"
                            name="CapillaryBloodGlucose"
                            value={values?.CapillaryBloodGlucose ? values?.CapillaryBloodGlucose : ""}
                            onChange={handleChange}
                            lable={t("CapillaryBloodGlucose")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />




                        <ReactSelect
                            placeholderName={t("RespiratoryRate")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [1],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="RespiratoryRate"
                            inputId="RespiratoryRate"
                            value={values?.RespiratoryRate?.label ? values?.RespiratoryRate?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("OxygenSaturation")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [2],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="OxygenSaturation"
                            inputId="OxygenSaturation"
                            value={values?.OxygenSaturation?.label ? values?.OxygenSaturation?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("InspiredO")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [3],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="InspiredO"
                            inputId="InspiredO"
                            value={values?.InspiredO?.label ? values?.InspiredO?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("OxygenDeviceFMNCVenturi")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [4],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="OxygenDeviceFMNCVenturi"
                            inputId="OxygenDeviceFMNCVenturi"
                            value={values?.OxygenDeviceFMNCVenturi?.label ? values?.OxygenDeviceFMNCVenturi?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("Temperature")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [5],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="Temperature"
                            inputId="Temperature"
                            value={values?.Temperature?.label ? values?.Temperature?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("BloodPressure")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [6],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="BloodPressure"
                            inputId="BloodPressure"
                            value={values?.BloodPressure?.label ? values?.BloodPressure?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("Heart Rate")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [7],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="HeartRate"
                            inputId="HeartRate"
                            value={values?.HeartRate?.label ? values?.HeartRate?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <MultiSelectComp
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            name="LevelofConsciousness"
                            id="LevelofConsciousness"
                            placeholderName={t("LevelofConsciousness")}
                            dynamicOptions={LevelofConsciousness}
                            handleChange={handleMultiSelectChange}
                            value={values?.LevelofConsciousness}
                        />

                        <ReactSelect
                            placeholderName={t("Pain Score")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [9],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="PainScore"
                            inputId="PainScore"
                            value={values?.PainScore?.label ? values?.PainScore?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("Bowelsopened")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [10],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="Bowelsopened"
                            inputId="Bowelsopened"
                            value={values?.Bowelsopened?.label ? values?.Bowelsopened?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("NauseaAndVomitingScore")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [11],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="NauseaAndVomitingScore"
                            inputId="NauseaAndVomitingScore"
                            value={values?.NauseaAndVomitingScore?.label ? values?.NauseaAndVomitingScore?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("UrineOutput")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [12],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="UrineOutput"
                            inputId="UrineOutput"
                            value={values?.UrineOutput?.label ? values?.UrineOutput?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("VisualInfusionPhlebitis")}
                            dynamicOptions={filterByTypes(
                                physiologicalEarlyWarningList,
                                [13],
                                ["TypeID"],
                                "TextField",
                                "TextField",
                                "ValueField"
                            )}
                            name="VisualInfusionPhlebitis"
                            inputId="VisualInfusionPhlebitis"
                            value={values?.VisualInfusionPhlebitis?.label ? values?.VisualInfusionPhlebitis?.label : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                    </div>
                    <div className="row p-2 d-flex justify-content-end" >
                        <div className='col-sm-1 mb-2 d-flex justify-content-end'>
                            <button className="btn btn-sm btn-success" type="button" onClick={savePEWSChartAPI}>
                                {values?.ID ? t("Update") : t("Save")}
                            </button>
                        </div>
                        <DatePicker
                            className="custom-calendar"
                            id="DOB"
                            name="fromDate"
                            lable={t("FromDate")}
                            placeholder={VITE_DATE_FORMAT}
                            respclass={"col-xl-2  col-6"}
                            value={values?.fromDate ? values?.fromDate : new Date()}
                            handleChange={handleChange}
                        />

                        <DatePicker
                            className="custom-calendar"
                            respclass={"col-xl-2  col-6"}
                            id="toDate"
                            name="toDate"
                            value={values?.toDate ? values?.toDate : new Date()}
                            handleChange={handleChange}
                            lable={t("ToDate")}
                            placeholder={VITE_DATE_FORMAT}
                        />
                        <div className='mx-2'>
                            <button className="btn btn-sm btn-success ml-2" type="button" onClick={PrintPEWSChart}>
                                {t("Print")}
                            </button>

                        </div>
                    </div>
                </form>
            </div>
            <div className="mt-2 spatient_registration_card card">
                <Heading
                    title={t("Result")}
                    isBreadcrumb={false} />

                <Tables
                    thead={thead}
                    tbody={tbody}
                />
            </div>
        </>
    )
}
