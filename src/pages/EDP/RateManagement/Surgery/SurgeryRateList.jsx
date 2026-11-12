
import React, { useEffect, useState, useCallback } from "react";
import { filterByTypes, handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/formComponent/Input";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import Tables from "../../../../components/UI/customTable";
import Heading from "../../../../components/UI/Heading";
import { RateSetupBindCentre, RateSetupCaseTypeBind, RateSetupLoadCategory, RateSetupLoadItems, RateSetupLoadItemSurgery, RateSetupLoadRates, RateSetupLoadRatesSurgery, RateSetupLoadSubCategory, RateSetupLoadSubCategorySurgery } from "../../../../networkServices/EDP/edpApi";
import CustomSelect from "../../../../components/formComponent/CustomSelect";
import Modal from "../../../../components/modalComponent/Modal";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import { AutoComplete } from "primereact/autocomplete";
// import SaveItem from "./SaveItem";

const SurgeryRateList = () => {
    const [modalData, setModalData] = useState({ visible: false })
    const userData = useLocalStorage("userData", "get")
    const ip = useLocalStorage("ip", "get");
    const [t] = useTranslation();

    const initialState = {
        type: {},
        Category: {},
        SubCategory: {},
        ItemName: "",
        LoadItem: {},
        panel: { label: "CASH", value: "1" },
        scheduleCharges: { label: "CASH", value: "1" },
        centre: [{ "code": Number(userData?.centreID), "name": userData?.centreName }],
        CaseType: [],
        characters: { label: "By Initial Characters", value: "0" },
        depType: { label: "IPD", value: "1" },
        Departments: {},
        surgeryName: "",
        Status: { label: "Active Rates", value: "1" },
        Rate: { label: "Rate Not Fixed", value: "1" },
        AvailableSurgery: []
    };


    const [values, setValues] = useState({ ...initialState });
    const [tableData, setTableData] = useState([]);
    const [items, setItems] = useState([]);

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const itemTemplate = (item) => {
        return (
            <div className="p-clearfix"
            >
                <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
                    {item?.Name}
                </div>
            </div>
        );
    };
    const search = async (event, name) => {

        setValues((val) => ({ ...val, [name]: event?.query }));
        const ID = values?.Departments?.value;
        const query = event?.query
        if (event?.query?.length > 2) {
            const response = await RateSetupLoadItemSurgery(ID, query);
            // return response
            console.log("response query", response?.data)

            if (response) {

                setItems(response?.data);
            } else {
                setItems([]);
            }
        } else {
            setItems([]);
        }
    };
    const handleRowSelect = useCallback((rowData) => {
        setSelectedRows((prevSelectedRows) => {
            if (prevSelectedRows.some(item => item === rowData)) {
                return prevSelectedRows.filter(item => item !== rowData);
            } else {
                return [...prevSelectedRows, rowData];
            }
        });

        // Update table data with 'applyIPD' flag, using a functional update
        setTableData(prevTableData => {
            return prevTableData.map(item => {
                if (item === rowData) {
                    return { ...item, applyIPD: !item.applyIPD }; // Toggle the flag
                }
                return item;
            });
        });

    }, []);

    const toggleSelectAll = useCallback(() => {
        setSelectAll((prevSelectAll) => !prevSelectAll);
    }, []);

    useEffect(() => {
        if (tableData.length > 0) {  //Only execute effect if tableData is not empty
            const newTableData = tableData.map(item => ({ ...item, applyIPD: selectAll }));
            setTableData(newTableData);

            if (selectAll) {
                setSelectedRows([...tableData]);
            } else {
                setSelectedRows([]);
            }
        }

    }, [selectAll]);  //Remove tableData from dependency array

    const isRowSelected = (rowData) => selectedRows.some(item => item === rowData);
    const THEAD = [
        { name: t("S.No."), width: "1%" },
        { name: t("Category"), width: "10%" },
        { name: t("Sub Category"), width: "10%" },
        { name: t("Item Name"), width: "20%" },
        ...(values?.depType?.value == "1"
            ? [
                {
                    name: t("Room Type"),
                    width: "10%"
                }
            ]
            : []),
        { name: t("Current Rate"), width: "10%" },
        { name: t("Currency"), width: "10%" },
        { name: t("Item Display Name"), width: "10%" },
        { name: t("Item Code"), width: "8%" },
        ...(values?.depType?.value == "0"
            ? [
                {
                    name: (
                        <>
                            IPD
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={toggleSelectAll}
                                style={{ marginLeft: "5px" }}
                            />
                        </>
                    ),
                    width: "2%"
                }
            ]
            : [])
    ];

    const Department = [
        // { label: "OPD", value: "0" },
        { label: "IPD", value: "1" },
    ];
    const Characters = [
        { label: "By Initial Characters", value: "0" },
        { label: "By Middle Characters", value: "1" },
    ];
    const PanelItem = [
        { label: "CASH", value: "1" },
        { label: "CGHS", value: "90" },
    ];
    const RateItem = [
        { label: "Rate Not Fixed", value: "1" },
        { label: "Rate Fixed", value: "0" },
    ];
    const StatusItem = [
        { label: "Active Rates", value: "1" },
        { label: "In-Active Rates", value: "0" },
    ];

    const [dropDownState, setDropDownState] = useState({
        GetDepartments: [],
        GetSubCategory: [],
        GetLoadItem: [],
        GetCentreItem: [],
        GetCaseTypeBind: [],
        AvailableSurgery: []
    });

    const GetSurgeryDepartment = async () => {
        try {
            const response = await RateSetupLoadSubCategorySurgery();
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    GetDepartments: handleReactSelectDropDownOptions(
                        response?.data,
                        "Department",
                        "Department"
                    ),
                }));
            }
        } catch (e) {
            console.log("Something Went Wrong", e);
        }
    };



    const handleShowItem = async () => {
        let CaseTypeID = values?.CaseType?.map((item) => {
            return item.code
        }).join(",")

        const payload = {
            "active": 1,
            "itemID": Number(values?.LoadItem?.value || 0),
            "panelID": Number(values?.panel?.value || 0),
            "scheduleChargeID": Number(values?.scheduleCharges?.value),
            "centreID": Number(values?.centre?.value),
            "dept": Number(values?.depType?.value),
            "roomType": String(CaseTypeID || "")
        }
        try {
            const response = await RateSetupLoadRates(payload)
            if (response?.success) {

                const initialData = response?.data.map(item => ({ ...item, applyIPD: false }))
                setTableData(initialData)
            }
            else {
                notify(response?.message, "error")
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const getCentre = async (ID) => {
        try {
            const response = await RateSetupBindCentre(ID)
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    GetCentreItem: handleReactSelectDropDownOptions(
                        response?.data,
                        "CentreName",
                        "CentreID"
                    ),
                }));
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    const getCaseTypeBind = async () => {

        try {
            const response = await RateSetupCaseTypeBind()
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    GetCaseTypeBind: handleReactSelectDropDownOptions(
                        response?.data,
                        "Name",
                        "IPDCaseTypeID"
                    ),
                }));

            }
            else {
                notify(response?.message, "error")
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleLoadItems = async () => {

        let CategoryID = values?.Category?.value;
        let SubCategoryID = values?.SubCategory?.value;

        if (!CategoryID) {
            notify("Please Select Category", "error")
            return
        }
        if (!SubCategoryID) {
            notify("Please Select sub Category", "error")
            return
        }
        const payload = {
            "categoryID": Number(CategoryID),
            "subCategoryID": Number(SubCategoryID),
            "itemName": values?.ItemName || "",
            "itemCode": values?.ItemCode || ""
        }
        try {
            const response = await RateSetupLoadItems(payload)
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    GetLoadItem: handleReactSelectDropDownOptions(
                        response?.data,
                        "TypeName",
                        "ItemID"
                    ),
                }));
                setValues((preV) => (
                    {
                        ...preV,
                        LoadItem: {
                            label: response?.data[0]?.TypeName,
                            value: response?.data[0]?.ItemID,
                        }
                    }
                ))
            }
            else {
                notify(response?.message, "error")
            }
        } catch (error) {

        }
    }
    const handleReactSelect = async (label, value) => {
        setValues((val) => ({ ...val, [label]: value }));
        if (label === "Departments") {
            const response = await RateSetupLoadItemSurgery(value?.value, "abdo");
            if (response?.success) {
                setDropDownState((val) => ({ ...val, AvailableSurgery: response?.data }))
            } else {
                setDropDownState((val) => ({ ...val, AvailableSurgery: [] }))
            }
        }
        if (label == "depType") {
            setTableData([])
        }

    };
    const handleChange = async (e) => {
        const { name, value } = e.target
        setValues((val) => ({ ...val, [name]: value }));
    };

    const handleInputChange = (index, label, value) => {
        setTableData(prevTableData => {
            const newData = [...prevTableData];
            newData[index] = { ...newData[index], [label]: value };
            return newData;
        });
    };

    const handleClose = () => {

        setModalData((val) => ({ ...val, visible: false }))

    }

    const handleSaveItem = async () => {
        const payload = {
            "active": 1,
            "itemID": 0,
            "panelID": 0,
            "scheduleChargeID": 0,
            "centreID": 0,
            "dept": 1,
            "rateType": 2,
            "roomType": 3,
        }
        try {
            const response = await RateSetupLoadRatesSurgery(payload)
            if (response?.success) {
                notify(response?.message, "success")
            }
        } catch (error) {
            console.log("error", error)
        }



    };
    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues({
            ...values,
            [name]: selectedOptions,
        });
    };


    const validateInvestigation = async (e, name) => {
        // ;
        // if (!values?.VoucherType?.value) {
        //     notify("Please Select Voucher Type", "error");
        //     return 0;
        // }
        const { value } = e;
        console.log("values from validate", value);
        // value.branchCentre = { value: userData?.defaultCentre };
        value.balanceType = { value: value?.balanceType };
        setValues((val) => ({
            ...val,
            [name]: value?.Name,
            coaid: value?.Surgery_ID, // Add coaid with value from valueType
        }));

        // setBodyData((val) => [...val, value]);
    };

    useEffect(() => {
        GetSurgeryDepartment();
        getCaseTypeBind()
    }, []);

    useEffect(() => {
        if (values?.panel?.value)
            getCentre(values?.panel?.value)
    }, [values?.panel?.value])



    return (
        <div className="mt-2 card">
            <Heading title={t("Surgery Rate List")} isBreadcrumb={false} />
            <div className="row p-2 ">
                <ReactSelect
                    placeholderName={t("Type")}
                    name="depType"
                    id="depType"
                    value={values?.depType?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={Department}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    removeIsClearable={true}
                />

                <ReactSelect
                    placeholderName={t("Department")}
                    name="Departments"
                    id="Departments"
                    value={values?.Departments?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={dropDownState?.GetDepartments}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    removeIsClearable={true}
                />

                <Input
                    type="text"
                    className="form-control"
                    lable={t("Surgery Name")}
                    placeholder=""
                    name="surgeryName"
                    id="surgeryName"
                    value={values?.surgeryName ? values?.surgeryName : ""}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    onChange={handleChange}
                />

                <ReactSelect
                    placeholderName={t("Characters")}
                    name="characters"
                    id="characters"
                    value={values?.characters?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={Characters}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    removeIsClearable={true}
                />

                <MultiSelectComp
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    name="AvailableSurgery"
                    id="AvailableSurgery"
                    placeholderName={t("Available Surgery")}
                    dynamicOptions={dropDownState?.AvailableSurgery?.map((ele) => ({
                        code: ele?.Surgery_ID,
                        name: ele?.Name,
                    }))}
                    handleChange={handleMultiSelectChange}
                    value={values?.AvailableSurgery}
                    isRemoveTemplate={true}
                />



                <ReactSelect
                    placeholderName={t("Panel")}
                    name="panel"
                    id="Panel"
                    value={values?.panel?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={PanelItem}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                />

                <ReactSelect
                    placeholderName={t("Schedule Charges")}
                    name="scheduleCharges"
                    id="scheduleCharges"
                    value={values?.scheduleCharges?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={[
                        { label: "CASH", value: "1" },

                    ]}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                />
              
                <ReactSelect
                    placeholderName={t("Room Type")}
                    name="RoomType"
                    id="RoomType"
                    value={values?.RoomType?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={dropDownState?.GetCaseTypeBind}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                />
                <ReactSelect
                    placeholderName={t("Rate")}
                    name="Rate"
                    id="Rate"
                    value={values?.Rate?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={RateItem}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                />
                    <MultiSelectComp
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    name="centre"
                    id="centre"
                    placeholderName={t("Centre")}
                    dynamicOptions={dropDownState?.GetCentreItem?.map((ele) => ({
                        code: ele?.value,
                        name: ele?.label,
                    }))}
                    handleChange={handleMultiSelectChange}
                    value={values?.centre}
                />
              

                <button
                    className=" btn btn-sm btn-success ml-2 px-3"
                    onClick={handleShowItem}
                >
                    {t("Show Rates")}
                </button>
            </div>
           <div className="card">
                    <Heading title={t("RateList Details")} isBreadcrumb={false} />
                    <Tables
                        thead={THEAD}
                        tbody={tableData?.map((val, index) => ({

                            SNo: index + 1,
                            Category: val?.CatName,
                            SubCategory: val?.SubCatName,
                            ItemName: val?.ItemName,
                            ...(values?.depType?.value == "1" && {
                                Ipd: val?.RoomType
                            }),
                            currencyRate: (
                                <Input
                                    type="number"
                                    className={"form-control  form-fields"}
                                    placeholder=" "
                                    name="Rate"
                                    onChange={(e) => handleInputChange(index, "Rate", e.target.value)} // Pass the index to handleInputChange
                                    value={val?.Rate}
                                    required={true}
                                    respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                                />
                            ),
                            Currency:
                                (
                                    <CustomSelect
                                        placeHolder={t("Currency")}
                                        name="IsCurrent"

                                        onChange={(selectedOption) => handleInputChange(index, "IsCurrent", selectedOption.value)}
                                        value={val?.IsCurrent}
                                        option={[
                                            { label: "INR", value: 1 },
                                            { label: "USD", value: "USD" }
                                        ]}
                                    />


                                ),
                            displayName:
                                (
                                    <Input
                                        type="text"
                                        className={"form-control  form-fields"}
                                        placeholder=" "
                                        name="ItemDisplayName"
                                        onChange={(e) => handleInputChange(index, "ItemDisplayName", e.target.value)}
                                        value={val?.ItemDisplayName}
                                        required={true}
                                        respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                                    />
                                ),
                            itemCode:
                                (
                                    <Input
                                        type="text"
                                        className={"form-control  form-fields"}
                                        placeholder=" "
                                        name="ItemCode"
                                        onChange={(e) => handleInputChange(index, "ItemCode", e.target.value)}
                                        value={val?.ItemCode}
                                        required={true}
                                        respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                                    />
                                ),
                            ...(values?.depType?.value == "0" && {
                                Ipd: (
                                    <input
                                        type="checkbox"
                                        checked={val.applyIPD || false}
                                        onChange={() => handleRowSelect(val)}
                                    />
                                )
                            })

                        }))}
                    />
                    <div className="p-2 d-flex justify-content-end">
                        {
                            values?.depType?.value == "1" && <div className="d-flex justify-content-center align-items-center gap-2 ">
                                <span className="mr-2">{t("Set Rate To Room Types")}</span>
                                <input type="checkbox" />
                            </div>
                        }

                        <button
                            className=" btn btn-sm btn-success ml-2 px-3"
                            onClick={handleSaveItem}
                        >
                            {t("Save")}
                        </button>
                    </div>
                </div>
            

            {modalData?.visible && (
                <Modal
                    visible={modalData?.visible}
                    setVisible={() => { setModalData({ visible: false }) }}
                    modalData={modalData?.URL}
                    modalWidth={modalData?.width}
                    Header={modalData?.label}
                    buttonType="button"
                    footer={modalData?.footer}
                >
                    {modalData?.Component}
                </Modal>
            )}
        </div>
    );
};

export default SurgeryRateList;


