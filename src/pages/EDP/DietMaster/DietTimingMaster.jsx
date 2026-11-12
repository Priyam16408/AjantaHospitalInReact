import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { BindTimingGrid, SaveDietTiming, UpdateDietTiming } from '../../../networkServices/EDP/pragyaedp';
import Tables from '../../../components/UI/customTable';
import { notify } from '../../../utils/ustil2';
import TimePicker from '../../../components/formComponent/TimePicker';
import moment from 'moment';

const DietTimingMaster = () => {
    const [t] = useTranslation();
    const initialValue = {
        Status: { label: "Yes", value: "1" },
        OrderOptions: "",
        fromTime: "",
        toTime: "",
        timingName: "",
        Description: "",
        orderBefore: "",
        id: 0,
        isActive: ""
    }
    const [values, setValues] = useState({ ...initialValue })
    console.log("Values", values)

    const [tableofDietMaster, setTableOfDietMaster] = useState([]);
    const [showbtn, setShowBtn] = useState(true);
    const [ID, setId] = useState("");

    const StatusOptions = [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" }
    ];

    const OrderOptions = [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
        { label: "7", value: "7" },
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "10", value: "10" },
        { label: "11", value: "11" },
        { label: "12", value: "12" },
        { label: "13", value: "13" },
        { label: "14", value: "14" },
        { label: "15", value: "15" },
        { label: "16", value: "16" },
        { label: "17", value: "17" },
        { label: "18", value: "18" },
        { label: "19", value: "19" },
        { label: "20", value: "20" },
        { label: "21", value: "21" },
        { label: "22", value: "22" },
        { label: "23", value: "23" },
    ]

    const handleSelect = (name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleDietTimingTbale = async () => {
        try {
            const apiResp = await BindTimingGrid();
            if (apiResp.success) {
                console.log('dataoftable', apiResp?.data)
                setTableOfDietMaster(apiResp?.data)
            } else {
                notify(apiResp?.message, "error");
                console.log('error in response:', apiResp);
            }
        } catch (error) {
            console.error("Error loading centre data:", error);
            notify("An error occurred while loading centre data", "error");
        }
    }

    const clearForm = () => {
        setValues(initialValue);
        setShowBtn(true);
    }

    const TheadSearchTable = [
        { width: "5%", name: t("SNo") },
        { width: "25%", name: t("Time Name") },
        { width: "25%", name: t("Description") },
        { width: "10%", name: t("From Time") },
        { width: "5%", name: t("To Time") },
        { width: "5%", name: t("Order Before") },
        { width: "5%", name: t("Status") },
        { width: "5%", name: t("Edit") },
    ];

    const handleSaveDietChart = async () => {
        const payload = {
            "name": values?.timingName,
            "description": values?.Description,
            "fromTime": values?.fromTime,
            "toTime": values?.toTime,
            "orderBefore": values?.OrderOptions?.value,
            "isActive": values?.Status?.value === "1" ? true : false,
        }
        try {
            const apiResp = await SaveDietTiming(payload);
            if (apiResp?.success) {
                console.log("the apiresponse is in the table", apiResp?.data);
                setShowBtn(true);
                handleDietTimingTbale();
                notify(apiResp?.message, "success");
                clearForm();
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            notify("An error occurred while saving diet timing", "error");
        }
    }
    const handelUpdateDietChart = async () => {
        const payload = {
            id: values?.id,
            name: values?.timingName,
            description: values?.Description,
            fromTime: values?.fromTime,
            toTime: values?.toTime,
            orderBefore: values?.OrderOptions?.value || values?.OrderOptions,
            isActive: values?.Status?.value,
        };
        try {
            const apiResp = await UpdateDietTiming(payload);
            if (apiResp?.success) {
                notify(apiResp?.message, "success");
                setTableOfDietMaster(prevTable =>
                    prevTable.map(row =>
                        row.id === values.id
                            ? {
                                ...row,
                                TimeName: values.timingName,
                                Description: values.Description,
                                FromTime: values.fromTime,
                                ToTime: values.toTime,
                                OrderBefore: values.OrderOptions?.value,
                                IsActive: values.Status?.label,
                            }
                            : row
                    )
                );

                setShowBtn(true);
                handleDietTimingTbale();
                clearForm();
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.error("Error updating diet timing:", error);
            notify("An error occurred while updating diet timing", "error");
        }
    };


    const handleEdit = (rowData) => {
        console.log("rOWDATA", rowData);
        setId(rowData?.id);
        const convertToDate = (timeStr) => {
            const date = new Date();
            const [time, modifier] = timeStr.split(" ");
            let [hours, minutes] = time.split(":");

            hours = parseInt(hours, 10);
            minutes = parseInt(minutes, 10);

            if (modifier === "PM" && hours !== 12) {
                hours += 12;
            }
            if (modifier === "AM" && hours === 12) {
                hours = 0;
            }

            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(0);
            date.setMilliseconds(0);

            return date;
        };

        const fromTimeDate = convertToDate(rowData.FromTime);
        const toTimeDate = convertToDate(rowData.ToTime);

        setValues({
            id: rowData.id,
            timingName: rowData.TimeName,
            Description: rowData.Description,
            fromTime: rowData.FromTime,
            toTime: rowData.ToTime,
            OrderOptions: rowData.OrderBefore,
            Status: StatusOptions?.find((ele) => ele?.label === rowData?.IsActive),
            isActive: rowData.IsActive,
            fromtime: fromTimeDate,
            totime: toTimeDate,
        });

        setShowBtn(false);
    };


    useEffect(() => {
        handleDietTimingTbale();
    }, [])

    return (
        <>
            <div className="mt-2 card">
                <Heading title={t("Master")} isBreadcrumb={false} />

                <div className="row p-2">
                    <TimePicker
                        lable={t("Time")}
                        respclass="col-xl-1 col-md-4 col-sm-4 col-12"
                        id="fromtime"
                        name="fromtime"
                        value={moment(values?.fromtime).toDate()}
                        handleChange={handleChange}
                        className={"required-fields"}
                    />
                    <TimePicker
                        lable={t("Time")}
                        respclass="col-xl-1 col-md-4 col-sm-4 col-12"
                        id="totime"
                        name="totime"
                        value={values?.totime}
                        handleChange={handleChange}
                        className={"required-fields"}
                    />

                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="timingName"
                        name="timingName"
                        value={values?.timingName}
                        onChange={handleChange}
                        lable={t("Timing Name")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />

                    <Input
                        type="text"
                        className="form-control"
                        id="Description"
                        name="Description"
                        value={values?.Description}
                        onChange={handleChange}
                        lable={t("Description")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />

                    <ReactSelect
                        placeholderName={t("Status")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="Status"
                        name="Status"
                        removeIsClearable={true}
                        dynamicOptions={StatusOptions}
                        handleChange={handleSelect}
                        value={values?.Status?.value}
                    />

                    <ReactSelect
                        placeholderName={t("Order Before (Hr)")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12 "
                        id="OrderOptions"
                        name="OrderOptions"
                        requiredClassName={"required-fields"}
                        removeIsClearable={true}
                        className="form-control"
                        dynamicOptions={OrderOptions}
                        handleChange={handleSelect}
                        value={values?.OrderOptions}
                    />

                    <div className="d-flex justify-content-end">
                        {showbtn ? (
                            <button
                                className="btn btn-sm btn-success"
                                style={{ width: "70px" }}
                                onClick={handleSaveDietChart}
                            >
                                {t("Save")}
                            </button>
                        ) : (
                            <button
                                className="btn btn-sm btn-success"
                                style={{ width: "70px" }}
                                onClick={handelUpdateDietChart}
                            >
                                {t("Update")}
                            </button>
                        )}

                        <button
                            className="btn btn-sm btn-success py-1 px-2 mx-1"
                            style={{ width: "70px" }}
                            onClick={clearForm}
                        >
                            {t("Cancel")}
                        </button>
                    </div>
                </div>



                <div className="card">
                    <Tables
                        thead={TheadSearchTable}
                        tbody={tableofDietMaster?.map((val, index) => {
                            return ({
                                sno: index + 1,
                                DietName: val?.TimeName,
                                Description: val?.Description,
                                FromTime: val?.FromTime,
                                ToTime: val?.ToTime,
                                OrderBefore: val?.OrderBefore,
                                Status: val?.IsActive,
                                Edit: <i
                                    className='fa fa-edit cursor-pointer'
                                    onClick={() => handleEdit(val)}
                                    style={{ cursor: 'pointer' }}
                                />
                            })
                        })}
                    />
                </div>
            </div>
        </>
    )
}

export default DietTimingMaster;