import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp';
import { notify } from '../../../utils/ustil2';
import { BindGridDietMenu, DietMenuSave, DietMenuUpdate } from '../../../networkServices/EDP/pragyaedp';
import { Table } from 'react-bootstrap';
import Tables from '../../../components/UI/customTable';
import { faL } from '@fortawesome/free-solid-svg-icons';

const DietMenuMaster = () => {

    const [t] = useTranslation();
    const [showbtn, setShowBtn] = useState(true);

    const initialValue = {
        DietMenuName: "",
        Description: "",
        Status: { label: "Yes", value: "1" },
        Days: "",
        isActive: "",
        id: 0,
    }
    const [values, setValues] = useState({ ...initialValue });

    const [TableShown, setTableSHown] = useState([]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSelect = (name, value) => {
        if (name === "Days") {
            setValues(prev => ({
                ...prev,
                [name]: value.map(v => v.value)
            }));
        } else {
            setValues(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const StatusOptions = [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" }
    ];

    const [ID, setId] = useState("");

    const dayOptions = [
        { label: "Sun", value: "Sun" },
        { label: "Mon", value: "Mon" },
        { label: "Tue", value: "Tue" },
        { label: "Wed", value: "Wed" },
        { label: "Thur", value: "Thur" },
        { label: "Fri", value: "Fri" },
        { label: "Sat", value: "Sat" },
    ];

    const TheadSearchTable = [
        { width: "5%", name: t("SNo") },
        { width: "25%", name: t("Diet Name") },
        { width: "25%", name: t("Description") },
        { width: "15%", name: t("Days") },
        { width: "10%", name: t("Active") },
        { width: "5%", name: t("Edit") },
    ];

    const clearForm = () => {
        setValues(initialValue);
        setShowBtn(true);
    }

    const handleTableGrid = async () => {
        try {
            const apiResp = await BindGridDietMenu();
            if (apiResp.success) {
                setTableSHown(apiResp?.data)
            } else {
                notify(apiResp?.message, "error");
                console.log('error in response:', apiResp);
            }
        } catch (error) {
            console.error("Error loading centre data:", error);
            notify("An error occurred while loading centre data", "error");
        }
    }
    const handleSaveDietMenu = async () => {
        if (values?.DietMenuName === "" || !values?.Status || values?.Days?.length === 0) {
            notify("Please Fill Required Fields", "error");
            return;
        }

        const payload = {
            name: values?.DietMenuName,
            description: values?.Description,
            isActive: Number(values?.Status?.value),
            days: values?.Days?.map((ele) => ele?.code).join(",")
        };

        try {
            const apiResp = await DietMenuSave(payload);
            if (apiResp?.success) {
                notify(apiResp?.message, "success");
                handleTableGrid();
                setShowBtn(true);
                clearForm();
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.error("Error while saving diet menu:", error);
            notify("An error occurred while saving diet menu", "error");
        }
    };

    const handleUpdateDietUPdates = async () => {

        const payload = {
            dietMenuID: ID,
            name: values?.DietMenuName,
            description: values?.Description,
            isActive: Number(values?.Status?.value),
            days: values?.Days?.map((ele) => ele?.code).join(","),
        };

        try {
            const apiResp = await DietMenuUpdate(payload);
            if (apiResp?.success) {
                notify(apiResp?.message, "success");
                handleTableGrid();
                clearForm();
                setShowBtn(true);
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.error("Error while saving diet menu:", error);
            notify("An error occurred while saving diet menu", "error");
        }
    }


    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues({ ...values, [name]: selectedOptions });
    };


    const handleEdit = (rowData) => {
        setId(rowData?.DietMenuID);
        setShowBtn(false);
        setValues({
            id: rowData?.DietMenuID,
            DietMenuName: rowData?.Name,
            Description: rowData?.Description,
            Status: StatusOptions.find((ele) => ele?.label === rowData?.IsActive),
            Days: rowData?.Days?.split(',').map(day => ({
                name: day.trim(),
                code: day.trim()
            }))
        });
    };



    useEffect(() => {
        handleTableGrid();
    }, [])

    return (
        <>
            <div className="mt-2 card">
                <Heading title={t("Master")} isBreadcrumb={false} />

                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="DietMenuName"
                        name="DietMenuName"
                        value={values?.DietMenuName}
                        onChange={handleChange}
                        lable={t("Diet Menu Name")}
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
                    <MultiSelectComp
                        className="required-fields"
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="Days"
                        id="Days"
                        placeholderName={t("Days")}
                        dynamicOptions={dayOptions?.map((ele) => ({
                            name: ele?.label,
                            code: ele?.value,
                        }))}
                        handleChange={handleMultiSelectChange}
                        requiredClassName={"required-fields"}
                        value={values?.Days}
                    />
                    {showbtn ? (
                        <button
                            className="btn btn-sm btn-success mt-1"
                            style={{ width: "70px" }}
                            onClick={handleSaveDietMenu}
                        >
                            {t("Save")}
                        </button>
                    ) : (
                        <button
                            className="btn btn-sm btn-success mt-1"
                            style={{ width: "70px" }}
                            onClick={handleUpdateDietUPdates}
                        >
                            {t("Update")}
                        </button>
                    )}

                    <button
                        className="btn btn-sm btn-success py-1 px-2 mt-1 ml-1"
                        style={{ width: "70px" }}
                        onClick={clearForm}>
                        {t("Cancel")}
                    </button>
                </div>


                {TableShown.length > 0 && (
                    <div className="card">
                        <Tables
                            thead={TheadSearchTable}
                            tbody={TableShown?.map((val, index) => {
                                console.log("Table row data:", val);
                                return ({
                                    sno: index + 1,
                                    DietMenuName: val?.Name,
                                    Description: val?.Description,
                                    Days: val?.Days,
                                    Status: val?.IsActive,
                                    Edit: <i className='fa fa-edit' onClick={() => handleEdit(val)} style={{ cursor: 'pointer' }} />

                                })
                            })}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default DietMenuMaster;