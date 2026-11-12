import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '../../components/UI/Heading';
import ReactSelect from '../../components/formComponent/ReactSelect';
import { BindWard, DietIssueBindGrid, Diettiming } from '../../networkServices/EDP/pragyaedp';
import DatePicker from '../../components/formComponent/DatePicker';

import moment from "moment";
import { BindFloor } from '../../networkServices/nursingWardAPI';
import ColorCodingSearch from '../../components/commonComponents/ColorCodingSearch';
import { notify } from '../../utils/ustil2';
import Tables from '../../components/UI/customTable';
import { CheckBox } from 'rc-easyui';

const IssuePatientDiet = () => {

    const [t] = useTranslation();

    const initialValue = {
        fromDate: moment(new Date()).toDate(),
        Floor: "",
        DietTiming: "",
        Ward: "",
    }
    const [values, setValues] = useState({ ...initialValue });
    const [dietTimingOptions, setDietTimingOptions] = useState([]);
    const [dietFloor, setDietFloor] = useState();
    const [PateintWard, setPateintWard] = useState();

    const [TableRes, setTableRes] = useState([]);


    const TheadSearchTable = [
        { width: "3%", name: t("label") },
        { width: "3%", name: t("SNo") },
        { width: "5%", name: t("Type") },
        { width: "8%", name: t("UHID") },
        { width: "8%", name: t("IPD NO.") },
        { width: "4%", name: t("Patient Name") },
        { width: "5%", name: t("Diet Type") },
        { width: "5%", name: t("Sub Diet") },
        { width: "5%", name: t("Menu") },
        { width: "5%", name: t("Remarks") },
        { width: "5%", name: t("Issue") },

    ];
    // console.log('table' , TableRes)
    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleDietFlor = async () => {
        try {
            const apiResp = await BindFloor();
            if (apiResp.success) {
                const mappedOptions = apiResp.data.map(item => ({
                    value: item.id,
                    label: item.name
                }));
                setDietFloor(mappedOptions);
            } else notify(apiResp.message, "error");
        } catch (error) {
            notify("Error loading diet timing data", "error");
        }
    };


    const handleDietTiming = async () => {
        try {
            const apiResp = await Diettiming();
            if (apiResp.success) {
                // console.log("id of dietimign" , api)
                const mappedOptions = apiResp.data.map(item => ({
                    value: item.ID,
                    label: item.NAME
                }));
                setDietTimingOptions(mappedOptions);
            } else notify(apiResp.message, "error");
        } catch (error) {
            notify("Error loading diet timing data", "error");
        }
    };


    const handleWardSelection = async () => {
        try {
            const apiResp = await BindWard();
            if (apiResp.success) {
                const mappedOptions = apiResp.data.map(item => ({
                    value: item.IPDCaseTypeID,
                    label: item.Name
                }));
                setPateintWard(mappedOptions);
            } else notify(apiResp.message, "error");
        } catch (error) {
            notify("Error loading diet timing data", "error");
        }
    };
    const handleMapSearchDiet = async () => {

        if (values.DietTiming === "") {
            notify("DietTiming Field is Required", "error");
            return;
        }

        try {
            const formattedDate = moment(values?.fromDate).format("YYYY-MM-DD");

            const apiResp = await DietIssueBindGrid(

                values?.DietTiming?.value,
                values?.Ward?.value,
                values?.Floor?.label,
                formattedDate,

            );

            if (apiResp.success) {
                console.log('data of the all patient render', apiResp.data);
                setTableRes(apiResp.data);
                notify("Data fetched successfully", "success");
            } else {
                notify(apiResp.message, "error");
            }
        } catch (error) {
            notify("Error loading diet data", "error");
        }
    };

    useEffect(() => {
        handleDietTiming();
        handleDietFlor();
        // handleSearch();
        handleWardSelection();
    }, [])
    return (
        <>
            <div className="mt-2 card">
           
                <Heading isBreadcrumb={true} />


                <div className="row p-2">
                    <DatePicker
                        id="fromDate"
                        width
                        name="fromDate"
                        lable={t("FromDate")}
                        value={values?.fromDate || new Date()}
                        handleChange={handleChange}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        maxDate={values?.toDate}
                    />

                    <ReactSelect
                        placeholderName={t("Floor")}
                        searchable
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="Floor"
                        name="Floor"
                        // removeIsClearable 
                        dynamicOptions={dietFloor}
                        handleChange={handleSelect}
                        value={values?.Floor}
                    />

                    <ReactSelect
                        placeholderName={t("Ward")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="Ward"
                        name="Ward"
                        removeIsClearable={true}
                        dynamicOptions={PateintWard}
                        handleChange={handleSelect}
                        value={values?.Ward}
                    />

                    <ReactSelect
                        placeholderName={t("Diet Timing")}
                        searchable
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="DietTiming"
                        name="DietTiming"
                        // removeIsClearable
                        requiredClassName="required-fields"
                        dynamicOptions={dietTimingOptions}
                        handleChange={handleSelect}
                        value={values?.DietTiming}
                    />
                    <button className="btn btn-sm btn-success py-0 px-1 mt-1 mb-1 p-3" onClick={handleMapSearchDiet}>
                        {t("Search")}
                    </button>

                    <button className="btn btn-sm btn-success py-0 px-1 mt-1 mb-1 p-3 ml-2">
                        {/* //  onClick={handleSaveTableDiet}> */}
                        {t("Report")}
                    </button>
                </div>

                <Heading
                    title=""
                    isBreadcrumb={false}
                    secondTitle={
                        <>
                            <ColorCodingSearch label={t("Freezed")} color="lemonchiffon" />
                            <ColorCodingSearch label={t("Issued")} color="yellowgreen" />
                            <ColorCodingSearch label={t("Received")} color="lightseagreen" />
                            <ColorCodingSearch label={t("Pending")} color="pink" />
                        </>
                    }
                />


                {TableRes.length > 0 && (
                    <div className="card">
                        <Tables
                            thead={TheadSearchTable}
                            tbody={TableRes?.map((val, index) => {
                                // console.log("Table row data:", val);
                                return ({
                                    CheckBox: <input  type="checkbox"   // checked={!!isSelected} // onChange={() => handleRowSelect(index)}
                                    />,
                                    sno: index + 1,
                                    Type: val?.Type,
                                    UHID: val?.PatientID,
                                    IPDNO: val?.IPDNo,
                                    PatientName: val?.PName,
                                    DietType: val?.DietName,
                                    SubDiet: val?.SubDietName,
                                    Menu: val?.MenuName,
                                    Remarks: val?.Remarks,
                                    CheckBox: <input type="checkbox" />,
                                })
                            })}
                            style={{ maxHeight: "60vh" }}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default IssuePatientDiet;