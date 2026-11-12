import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { LoadHeadDepartment, BindInvListBox, BindSampleType, BindAnatomicSite, GetDocTypeList, UpdateInvestigation, SaveNewInvestigation } from "../../../networkServices/edpApi";

const ManageInvestigationModal = () => {
    const [t] = useTranslation()
    const [formData, setFormData] = useState({
        searchBy: "",
        SubDeprtID: "",
        newInvestigation: false,

    });


    const initilise = {

        Gender: "",
        sampleType: { ID: '23', SampleType: "Select" },
        department: "",
        detailDepartment: "",
        cptCode: "",
        Anatomic: "",
        investigation: "",
        method: "",
        reportType: "",
        printSecquence: '',
        SubDeprtID: "",
        SampleCon: { value: "1", label: "Normal" },
        TatInMunite: '',
        description: "",
        isDiscountable: { value: "0", label: "No" },
        rateEditable: { value: "0", label: "No" },
        showPtRpt: true,
        ShowOnline: true,
        PrintSeperate: false,
        PrintSampleName: false,
        isCulture: false,
        Urgent: false,
        IsActive: false,
        OutSource: false,
        NABHHeader: false,
        NursingWard: false,
        type: { value: "R", label: "Sample Required" },
    }
    const [values, SetValues] = useState(initilise);
    const [investigationData, setInvestigationData] = useState([]);
    const [subDepartmentData, setSubDepartmentData] = useState([]);
    const [bindDepartMent, SetBindDepartMent] = useState([]);
    const [bindSampleType, SetBindSampleType] = useState([]);
    const [anatomicsite, SetAnatomicSite] = useState([]);
    const [departmentDetail, SetDetailDepartment] = useState([])
    const [reportType, SetReportType] = useState([
        { label: "Path Numeric", value: "1" },
        { label: "Path RichText", value: "3" },
        { label: "Radiology", value: "5" },
        { label: "Culture Report", value: "7" }
    ])
    console.log(bindSampleType);
    const [gender, setGender] = useState([
        { value: "M", label: "Male" },
        { value: "F", label: "Female" },
        { value: "B", label: "Both" },
    ])
    const [rate, setRate] = useState([
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
    ])

    const [type, setType] = useState([
        { value: "R", label: "Sample Required" },
        { value: "N", label: "Sample Not Required" },
    ])

    const handleBindInventory = async (deptId) => {
        try {

            const response = await BindInvListBox(deptId || "ALL");
            console.log(response);

            if (response.success) {
                setInvestigationData(response?.data);
                console.log("the department from api is work", response);

            } else {
                setInvestigationData([]);
            }
        } catch (error) {
            console.error("Error fetching department data:", error);
            setInvestigationData([]);
        }
    };
    const handleBindDepartment = async () => {
        try {
            const response = await LoadHeadDepartment();
            console.log("set bind", response);

            if (response.success) {
                setSubDepartmentData(response?.data);
                SetBindDepartMent(response?.data);
                console.log("the department from api is work", response);
            } else {
                setSubDepartmentData([]);
                SetBindDepartMent([]);
            }
        } catch (error) {
            console.error("Error fetching department data:", error);
            setSubDepartmentData([]);
            SetBindDepartMent([]);
        }
    };
    const handleBindSampleType = async () => {
        try {
            const response = await BindSampleType();
            console.log("set bind", response);

            if (response.success) {
                SetBindSampleType(response?.data);

                console.log("the department from api is work", response);
            } else {
                SetBindSampleType([]);

            }
        } catch (error) {
            console.error("Error fetching department data:", error);
            SetBindSampleType([]);
        }
    }
    const handleBindAnatomicSite = async () => {
        try {
            const response = await BindAnatomicSite();
            console.log("set bind", response);

            if (response.success) {
                SetAnatomicSite(response?.data);

                console.log("the department from api is work", response);
            } else {
                SetAnatomicSite([]);

            }
        } catch (error) {
            console.error("Error fetching department data:", error);
            SetBindSampleType([]);
        }
    }
    const handleBindDetailDepartment = async (id) => {
        try {
            const response = await GetDocTypeList(id);
            console.log("set bind", response);

            if (response.success) {
                SetDetailDepartment(response?.data);

                console.log("the department from api is work", response);
            } else {
                SetDetailDepartment([]);

            }
        } catch (error) {
            console.error("Error fetching department data:", error);
            SetDetailDepartment([]);
        }
    }
    useEffect(() => {
        handleBindDepartment()
        handleBindInventory()
        handleBindSampleType()
        handleBindAnatomicSite()
        handleBindDetailDepartment(5)
    }, [])



    useEffect(() => {
        console.log("call again", values?.department?.value);
        handleBindInventory(values?.department?.value)
    }, [values?.department?.value])

    const handleReactSelect = (name, value) => {
        console.log("seee", value);

        if (name === "investigation") {
            SetValues(prev => ({
                ...prev,
                description: value?.Description || "",
                SubDeprtID: value?.ObservationType_ID ? {
                    "label": subDepartmentData.find((item) => item.ObservationType_ID == value.ObservationType_ID)?.Name,
                    "value": value?.ObservationType_ID,
                } : "",
                investigation: value?.InvestigationId,
                reportType: value?.ReportType
                    ? {
                        value: value.ReportType,
                        label: reportType.find((item) => item.value == value.ReportType)?.label?.toString() || "",
                    }
                    : "3",
                printSecquence: value?.Print_Sequence,
                OutSource: value?.IsOutSource,
                Anatomic: value?.AnatomicId ? {
                    ID: value.AnatomicId,
                    AnatomicName: anatomicsite.find((item) => item.ID == value.AnatomicId)?.AnatomicName?.toString() || "",
                } : "",
                type: value?.Type == 'R' || value?.Type == 'N' ? {
                    label: type.find((item) => item.value === value?.Type)?.label.toString() || "",
                    value: value?.Type
                } : "",

                sampleType: value?.SampleTypeID ? {
                    SampleType: bindSampleType.find((item) => item.ID == value?.SampleTypeID)?.SampleType?.toString() || "",
                    ID: value?.SampleTypeID,
                } : "",
                detailDepartment: value?.DeptID ? {
                    "ID": value?.DeptID,
                    "Name": departmentDetail?.find((item) => item.ID == value?.DeptID)?.Name?.toString() || "",
                } : "",
                PrintSeperate: value?.PrintSeperate,
                PrintSampleName: value?.PrintSampleName,
                ShowOnline: value?.ShowOnline,
                isCulture: value?.IsCulture,
                IsActive: value?.IsActive,
                Urgent: value?.IsUrgent,

                Gender: value?.GenderInvestigate
                    ? {
                        value: value.GenderInvestigate,
                        label: gender.find((item) => item.value == value.GenderInvestigate)?.label?.toString() || "",
                    }
                    : "",
                rateEditable: value?.RateEditable
                    ?
                    {
                        label: rate.find((item) => item.value == value?.RateEditable)?.label?.toString() || "",
                        value: value?.RateEditable.toString(),
                    }
                    :
                    {
                        label: rate.find((item) => item.value == value?.RateEditable)?.label?.toString() || "",
                        value: value?.RateEditable,
                    },
                isDiscountable: value?.isDiscountable ?
                    {
                        label: rate.find((item) => item.value == value?.isDiscountable)?.label?.toString() || "",
                        value: value?.isDiscountable.toString(),
                    }
                    :
                    {
                        label: rate.find((item) => item.value == value?.isDiscountable)?.label?.toString() || "",
                        value: value?.isDiscountable,
                    },
            }));
        }

        SetValues((prev) => ({
            ...prev,
            [name]: value
        }));


    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "printSecquence" && value.length > 5) return;
        if (name === "TatInMunite" && value.length > 5) return;
        SetValues((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'newInvestigation') {
            SetValues(initilise)
        }
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };



    const handleSave = async (e, values) => {
        e.preventDefault()
        if (formData.newInvestigation === true) {
            // const payload = {
            //     invName: values?.investigation?.label || values?.investigation,
            //     Description: values?.description || "",
            //     departmentID: values?.SubDeprtID?.value,
            //     departmentName: values?.SubDeprtID?.label,
            //     reportType: values?.reportType?.value,
            //     printSequence: values?.printSecquence,
            //     gender: values?.Gender?.value,
            //     principle: values?.investigation?.principle,
            //     // sampletypename: values?.sampleType?.label,
            //     sampletypename: values?.type?.value === 'R' ? values?.sampleType?.label : 'select',
            //     CPTCode: values.cptCode,
            //     // active: values?.IsActive,
            //     outsource: values?.OutSource === true ? 1 : 0,
            //     rateEditable: values?.rateEditable?.value,
            //     isUrgent: values?.Urgent === true ? 1 : 0,
            //     showPtRpt: values?.showPtRpt === true ? 1 : 0,
            //     showOnlineRpt: values?.ShowOnline === true ? 1 : 0,
            //     printSeperate: values?.PrintSeperate === true ? 1 : 0,
            //     printSampleName: values?.PrintSampleName === true ? 1 : 0,
            //     deptID: values?.detailDepartment?.ID?.toString(),
            //     isDiscountable: values?.isDiscountable?.value,
            //     sampleTypeID: values?.sampleType?.ID,
            //     isCulture: values?.isCulture === true ? 1 : 0,
            //     sampleContainer: values?.SampleCon?.value,
            //     anatomicSiteID: values?.Anatomic?.value || "0",
            //     SampleType: values?.type?.value,
            //     nursingWard: values?.NursingWard === true ? 1 : 0,
            //     nabhHeader: values?.NABHHeader === true ? 1 : 0,
            // }
            const payload = {
                saveNewInvestigation: {
                    invName: values?.investigation?.label || values?.investigation,
                    description: values?.description || "",
                    departmentID: values?.SubDeprtID?.value,
                    departmentName: values?.SubDeprtID?.label,
                    reportType: values?.reportType?.value,
                    sampleType: values?.SampleType || "",  // SampleType field
                    printSequence: values?.printSecquence,
                    gender: values?.Gender?.value,
                    principle: values?.investigation?.principle,
                    sampletypename: values?.type?.value === 'R' ? values?.sampleType?.label : 'select',
                    cptCode: values?.cptCode,
                    outsource: values?.OutSource === true ? 1 : 0,
                    rateEditable: values?.rateEditable?.value,
                    isUrgent: values?.Urgent === true ? 1 : 0,
                    showPtRpt: values?.showPtRpt === true ? 1 : 0,
                    showOnlineRpt: values?.ShowOnline === true ? 1 : 0,
                    printSeperate: values?.PrintSeperate === true ? 1 : 0,
                    printSampleName: values?.PrintSampleName === true ? 1 : 0,
                    deptID: values?.detailDepartment?.ID?.toString(),
                    isDiscountable: values?.isDiscountable?.value,
                    sampleTypeID: values?.sampleType?.ID,
                    isCulture: values?.isCulture === true ? 1 : 0,
                    sampleContainer: values?.SampleCon?.value,
                    anatomicSiteID: values?.Anatomic?.value || "0",
                },
                ipAddress: "192.168.1.100"  // Replace with your dynamic IP if needed
            };
            if (!payload.saveNewInvestigation.invName) {
                return notify("Investigation Name is Required", "warn");
            }
            if (!payload.saveNewInvestigation.sampletypename) {
                return notify("Sample Type is Required", "warn");
            }
            if (!payload.saveNewInvestigation.deptID) {
                return notify("Department is Required", "warn");
            }
            const resp = await SaveNewInvestigation(payload)
            console.log(resp);

        } else {

            const payload = {
                invName: values?.investigation?.label || values?.investigation,
                Description: values?.description || "",
                invID: values?.investigation?.InvestigationId.toString(),
                itemID: values?.investigation?.ItemID,
                departmentID: values?.SubDeprtID?.value,
                invObsId: values?.investigation?.Investigation_ObservationType_ID,
                departmentName: values?.SubDeprtID?.label,
                reportType: values?.reportType?.value,
                printSequence: values?.printSecquence,
                gender: values?.Gender?.value,
                principle: values?.investigation?.principle,
                // sampletypename: values?.sampleType?.label,       ///   make chnage for disable  select 
                sampletypename: values?.type?.value === 'R' ? values?.sampleType?.label : 'select',       ///   make chnage for disable  select 
                CPTCode: values.cptCode,
                active: values?.IsActive,
                outsource: values?.OutSource === true ? 1 : 0,
                rateEditable: values?.rateEditable?.value,
                isUrgent: values?.Urgent === true ? 1 : 0,
                showPtRpt: values?.showPtRpt === true ? 1 : 0,
                showOnlineRpt: values?.ShowOnline === true ? 1 : 0,
                printSeperate: values?.PrintSeperate === true ? 1 : 0,
                printSampleName: values?.PrintSampleName === true ? 1 : 0,
                deptID: values?.detailDepartment?.ID?.toString(),
                isDiscountable: values?.isDiscountable?.value,
                // sampleTypeID: values?.sampleType?.ID,      /// change for id 0 set
                sampleTypeID: values?.type?.value === 'R' ? values?.sampleType?.value : 0,      /// change for id 0 set
                isCulture: values?.isCulture === true ? 1 : 0,
                sampleContainer: values?.SampleCon?.value,
                anatomicSiteID: values?.Anatomic?.value || "0",
                SampleType: values?.type?.value,
                nursingWard: values?.NursingWard === true ? 1 : 0,
                nabhHeader: values?.NABHHeader === true ? 1 : 0,
            }

            if (!payload.invName) {
                return notify("Investigation Name is Required", "warn");
            }
            if (!payload.sampletypename) {
                return notify("Sample Type is Required", "warn");
            }
            const resp = await UpdateInvestigation(payload)
            console.log(resp);

        }
    }

    return (
        <>
            <div className="spatient_registration_card card ">
                <div className="my-2  d-flex  flex-wrap">
                    <div className="col-xl-2 col-md-4 col-sm-4 col-12 ">
                        <div className="d-flex align-items-center ">
                            <input
                                type="checkbox"
                                id="newInv"
                                name="newInvestigation"
                                className="mr-2"
                                checked={formData.newInvestigation}
                                onChange={handleChange}
                            />
                            <label htmlFor="newInv" style={{ cursor: "pointer", margin: 0 }}>
                                {t("New Investigation")}
                            </label>
                        </div>
                    </div>

                    <ReactSelect
                        placeholderName={t("Select department")}
                        id={"department"}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        name="department"
                        removeIsClearable={true}
                        dynamicOptions={[
                            ...handleReactSelectDropDownOptions(
                                bindDepartMent,
                                "Name",
                                "ObservationType_ID"
                            ),
                        ]}
                        handleChange={handleReactSelect}
                        value={`${values?.department?.value}`}
                    />

                </div>
                <div className="my-2 ">
                    <Heading title={"Investigations"} />
                    <div className="row m-1">

                        <div className="d-flex align-items-center ml-3 ">
                            <input
                                type="radio"
                                id="code"
                                name="searchBy"
                                value={"code"}
                                className="mr-2"
                                checked={formData.searchBy === 'code'}
                                onChange={handleChange}
                            />
                            <label htmlFor="code" style={{ cursor: "pointer", margin: 0 }}>
                                {t("code")}
                            </label>
                        </div>

                        <div className="d-flex align-items-center ml-3">
                            <input
                                type="radio"
                                id="firstName"
                                name="searchBy"
                                value="firstName"
                                className="mr-2"
                                checked={formData.searchBy === 'firstName'}
                                onChange={handleChange}
                            />
                            <label htmlFor="firstName" style={{ cursor: "pointer", margin: 0 }}>
                                {t("firstName")}
                            </label>
                        </div>

                        <div className="d-flex align-items-center ml-3">
                            <input
                                type="radio"
                                id="inBetween"
                                name="searchBy"
                                value="inBetween"
                                className="mr-2"
                                checked={formData.searchBy === "inBetween"}
                                onChange={handleChange}
                            />
                            <label htmlFor="inBetween" style={{ cursor: "pointer", margin: 0 }}>
                                {t("InBetween")}
                            </label>
                        </div>

                        <ReactSelect
                            isDisabled={formData.newInvestigation ? true : false}
                            placeholderName={t("Select Investigation")}
                            id={"Investigations"}
                            searchable={true}
                            removeIsClearable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            dynamicOptions={[
                                ...handleReactSelectDropDownOptions(
                                    investigationData,
                                    "Name",
                                    "InvestigationId"
                                ),
                            ]}
                            name="investigation"
                            handleChange={handleReactSelect}
                            value={values?.investigation?.value || null}
                        />


                    </div>
                </div>

                <div>
                    <Heading title={"Details"} />
                    <div className="row m-2 mr-1  d-flex flex-wrap">
                        <ReactSelect
                            placeholderName={t("Sub Depart")}
                            id={"SubDeprt"}
                            searchable={true}
                            removeIsClearable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            dynamicOptions={[
                                ...handleReactSelectDropDownOptions(
                                    subDepartmentData,
                                    "Name",
                                    "ObservationType_ID"
                                ),
                            ]}
                            handleChange={handleReactSelect}
                            value={values?.SubDeprtID?.value}
                            name={"SubDeprtID"}
                        />

                        <Input
                            type="text"
                            className="form-control"
                            id="description"
                            removeFormGroupClass={false}
                            name="description"
                            lable={t("Description")}
                            required={true}
                            value={values?.description}
                            onChange={handleInputChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />

                        <ReactSelect
                            placeholderName={t("Gender")}
                            isDisabled={
                                values?.Gender === "Male" || values?.Gender === "Female"
                                    ? true
                                    : false
                            }
                            id="Gender"
                            inputId="Gender"
                            removeIsClearable={true}
                            dynamicOptions={[
                                ...handleReactSelectDropDownOptions(
                                    gender,
                                    'label',
                                    'value',
                                )
                            ]}
                            name="Gender"
                            value={values?.Gender.value}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            requiredClassName={`required-fields ${values?.Gender === "Male" || values?.Gender === "Female" ? "disable-focus" : ""}`}
                            DropdownIndicator={true}

                        />

                        <ReactSelect
                            placeholderName={t("Type")}
                            id="Type"
                            inputId="Type"
                            removeIsClearable={true}
                            dynamicOptions={[
                                ...handleReactSelectDropDownOptions(
                                    type,
                                    "label",
                                    "value"
                                )
                            ]}
                            name="type"
                            value={values?.type?.value}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            // requiredClassName={`required-fields ${values?.Gender === "Male" || values?.Gender === "Female" ? "disable-focus" : ""}`}
                            DropdownIndicator={true}

                        />

                        <ReactSelect
                            placeholderName={t("Sample Type")}
                            id="sampleType"
                            requiredClassName={"required-fields"}
                            inputId="sampleType"
                            removeIsClearable={true}
                            dynamicOptions={[
                                { value: "0", label: "Select" },
                                ...handleReactSelectDropDownOptions(
                                    bindSampleType,
                                    "SampleType",
                                    "ID"
                                ),
                            ]}
                            isDisabled={values?.type?.value === 'N' ? true : false}
                            name="sampleType"
                            value={values?.type?.value === 'R' ? values?.sampleType?.value : 0}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            // requiredClassName={`required-fields ${values?.Gender === "Male" || values?.Gender === "Female" ? "disable-focus" : ""}`}
                            DropdownIndicator={true}

                        />

                        <ReactSelect
                            placeholderName={t("Department")}
                            id="detailDepartment"
                            inputId="detailDepartment"
                            removeIsClearable={true}
                            dynamicOptions={[
                                ...handleReactSelectDropDownOptions(
                                    departmentDetail,
                                    "Name",
                                    "ID",
                                )
                            ]}
                            requiredClassName={"required-fields"}
                            name="detailDepartment"
                            value={values?.detailDepartment?.ID}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            // requiredClassName={`required-fields ${values?.Gender === "Male" || values?.Gender === "Female" ? "disable-focus" : ""}`}
                            DropdownIndicator={true}

                        />

                        <Input
                            type="text"
                            className="form-control"
                            id="CPTCODE"
                            removeFormGroupClass={false}
                            name="cptCode"
                            lable={t("CPT Code")}
                            required={true}
                            value={values.cptCode}
                            onChange={handleInputChange}
                            // onKeyDown={handleKeyDown} // Add keydown event handler
                            // inputRef={inputRef}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("Anatomic Site")}
                            id="AnotomicSite"
                            inputId="Anatomic"
                            requiredClassName={"required-fields"}
                            removeIsClearable={true}
                            dynamicOptions={[
                                ...handleReactSelectDropDownOptions(
                                    anatomicsite,
                                    "AnatomicName",
                                    "ID",
                                )
                            ]}
                            name="Anatomic"
                            value={values?.Anatomic?.ID}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            DropdownIndicator={true}
                        />


                        <Input
                            type="text"
                            className="form-control"
                            id="Investigation"
                            removeFormGroupClass={false}
                            name="investigation"
                            lable={t("Investigation")}
                            required={true}
                            value={values?.investigation?.label}
                            onChange={handleInputChange}
                            disabled={!formData.newInvestigation ? true : false}
                            // onKeyDown={handleKeyDown} // Add keydown event handler
                            // inputRef={inputRef}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />

                        <Input
                            type="text"
                            className="form-control"
                            id="Method"
                            removeFormGroupClass={false}
                            name="method"
                            lable={t("Method")}
                            required={true}
                            value={values.method}
                            onChange={handleInputChange}
                            // onKeyDown={handleKeyDown} // Add keydown event handler
                            // inputRef={inputRef}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />

                        <ReactSelect
                            placeholderName={t("Report Type")}
                            id="ReportType"
                            inputId="reportType"
                            removeIsClearable={true}
                            dynamicOptions={[
                                ...handleReactSelectDropDownOptions(
                                    reportType,
                                    "label",
                                    "value"
                                )
                            ]}
                            name="reportType"
                            value={values?.reportType?.value}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            DropdownIndicator={true}
                        />

                        <Input
                            type="number"
                            className="form-control"
                            id="PrintSecquence"
                            removeFormGroupClass={false}
                            name="printSecquence"
                            lable={t("Print Secquence")}
                            required={true}
                            value={values.printSecquence}
                            onChange={handleInputChange}
                            // onKeyDown={handleKeyDown} // Add keydown event handler
                            // inputRef={inputRef}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />

                        <ReactSelect
                            placeholderName={t("Sample Con")}
                            id="SampleCon"
                            inputId="SampleCon"
                            removeIsClearable={true}
                            dynamicOptions={[
                                { value: "1", label: "Normal" },
                                { value: "7", label: "Container/Block/Slide" },
                                { value: "8", label: "Container/Block" },
                            ]}
                            name="SampleCon"
                            value={values?.SampleCon?.value}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            DropdownIndicator={true}
                        />
                        <ReactSelect
                            placeholderName={t("Is Discountable")}
                            id="IsDiscountable"
                            inputId="isDiscountable"
                            removeIsClearable={true}
                            dynamicOptions={[
                                ...handleReactSelectDropDownOptions(
                                    rate,
                                    "label",
                                    "value",
                                )
                            ]}
                            name="isDiscountable"
                            value={values?.isDiscountable?.value}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            DropdownIndicator={true}
                        />
                        <ReactSelect
                            placeholderName={t("Rate Editable")}
                            id="RateEditable"
                            inputId="rateEditable"
                            removeIsClearable={true}
                            dynamicOptions={[
                                ...handleReactSelectDropDownOptions(
                                    rate,
                                    "label",
                                    "value",
                                )
                            ]}
                            name="rateEditable"
                            value={values?.rateEditable?.value.toString()}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            DropdownIndicator={true}
                        />

                        <Input
                            type="number"
                            className="form-control"
                            id="TatInMunite"
                            removeFormGroupClass={false}
                            name="TatInMunite"
                            maxLength={5}
                            lable={t("Tat In (Munite)")}
                            required={true}
                            value={values.TatInMunite}
                            onChange={handleInputChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />




                    </div>
                    <Heading title={"Other Information"} />
                    <div className="row m-2 mr-1  d-flex flex-wrap">
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 ">
                            <div className="d-flex align-items-center ">
                                <input
                                    type="checkbox"
                                    id="showPtRpt"
                                    name="showPtRpt"
                                    className="mr-2"
                                    checked={values.showPtRpt}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="showPtRpt" style={{ cursor: "pointer", margin: 0 }}>
                                    {t("Show Name in Patient Report")}
                                </label>
                            </div>
                        </div>

                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 "                >
                            <div className="d-flex align-items-center ">
                                <input
                                    type="checkbox"
                                    id="ShowOnline"
                                    name="ShowOnline"
                                    className="mr-2"
                                    checked={values.ShowOnline}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="ShowOnline" style={{ cursor: "pointer", margin: 0 }}>
                                    {t("Show In Online Report")}
                                </label>
                            </div>
                        </div>

                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 "                >
                            <div className="d-flex align-items-center ">
                                <input
                                    type="checkbox"
                                    id="PrintSeperate"
                                    name="PrintSeperate"
                                    className="mr-2"
                                    checked={values.PrintSeperate}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="PrintSeperate" style={{ cursor: "pointer", margin: 0 }}>
                                    {t("Print Seperate")}
                                </label>
                            </div>
                        </div>

                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 "                >
                            <div className="d-flex align-items-center ">
                                <input
                                    type="checkbox"
                                    id="PrintSampleName"
                                    name="PrintSampleName"
                                    className="mr-2"
                                    checked={values.PrintSampleName}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="PrintSampleName" style={{ cursor: "pointer", margin: 0 }}>
                                    {t("Print Sample Name")}
                                </label>
                            </div>
                        </div>

                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 "                >
                            <div className="d-flex align-items-center ">
                                <input
                                    type="checkbox"
                                    id="IsCulture"
                                    name="isCulture"
                                    className="mr-2"
                                    checked={values.isCulture}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="IsCulture" style={{ cursor: "pointer", margin: 0 }}>
                                    {t("Is Culture")}
                                </label>
                            </div>
                        </div>

                        <div className="col-xl-1 col-md-4 col-sm-4 col-12 "                >
                            <div className="d-flex align-items-center ">
                                <input
                                    type="checkbox"
                                    id="Urgent"
                                    name="Urgent"
                                    className="mr-2"
                                    checked={values.Urgent}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="Urgent" style={{ cursor: "pointer", margin: 0 }}>
                                    {t("Urgent")}
                                </label>
                            </div>
                        </div>
                        <div className="col-xl-1 col-md-4 col-sm-4 col-12 "                >
                            <div className="d-flex align-items-center ">
                                <input
                                    type="checkbox"
                                    id="IsActive"
                                    name="IsActive"
                                    className="mr-2"
                                    checked={values.IsActive}
                                    disabled={formData.newInvestigation}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="IsActive" style={{ cursor: "pointer", margin: 0 }}>
                                    {t("Is Active")}
                                </label>
                            </div>
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 "                >
                            <div className="d-flex align-items-center ">
                                <input
                                    type="checkbox"
                                    id="OutSource"
                                    name="OutSource"
                                    className="mr-2"
                                    checked={values.OutSource || false}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="OutSource" style={{ cursor: "pointer", margin: 0 }}>
                                    {t("OutSource")}
                                </label>
                            </div>
                        </div>


                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 "                >
                            <div className="d-flex align-items-center ">
                                <input
                                    type="checkbox"
                                    id="NABHHeader"
                                    name="NABHHeader"
                                    className="mr-2"
                                    checked={values.NABHHeader || false}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="NABHHeader" style={{ cursor: "pointer", margin: 0 }}>
                                    {t("NABHHeader")}
                                </label>
                            </div>
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 "                >
                            <div className="d-flex align-items-center ">
                                <input
                                    type="checkbox"
                                    id="NursingWard"
                                    name="NursingWard"
                                    className="mr-2"
                                    checked={values.NursingWard || false}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="NursingWard" style={{ cursor: "pointer", margin: 0 }}>
                                    {t("Nursing Board")}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-right ">
                <button className="btn btn-sm btn-primary my-2" onClick={(e) => { handleSave(e, values) }}>Save</button>
            </div>
        </>
    );
};

export default ManageInvestigationModal;
