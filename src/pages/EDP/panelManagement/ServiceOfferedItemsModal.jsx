import React, { useEffect, useState } from 'react'
import Input from '../../../components/formComponent/Input'
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import Tables from '../../../components/UI/customTable';
import { EDPBindCategoryListAPI, getBindSubCategoryListAPI, ServiceOfferedListAPI } from '../../../networkServices/EDP/edpApi';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';

export default function ServiceOfferedItemsModal({ data }) {
    const initialValues = { OperationType: { value: "2" } };
    const [values, setValues] = useState(initialValues);
    const [bodyData, setBodyData] = useState([]);
    const [list, setList] = useState({ category: [], subCategory: [] });
    const [t] = useTranslation();
    const allKeys = ["StaffIndepentIpd", "StaffIndepentOpd", "ReligionIpd", "ReligionOpd",
        "OtherIpd", "OtherOpd", "SponsoredIpd", "SponsoredOpd",
        "vipIpd", "vipOpd", "InsuredIpd", "InsuredOpd",
        "staffIpd", "staffOpd", "SelfIpd", "SelfOpd"]

    const isMobile = window.innerWidth <= 768;

    const thead = [
        { name: isMobile ? t("check") : <input type='checkbox' />, width: "1%" },
        t("Item Name"),
        t("OPD"),
        { name: t("IPD"), width: "4%" },
        t("Self (OPD/IPD)"),
        t("Staff (OPD/IPD)"),
        t("Insured (OPD/IPD)"),
        t("VIP (OPD/IPD)"),
        t("Sponsored (OPD/IPD)"),
        t("Other (OPD/IPD)"),
        t("Religion (OPD/IPD)"),
        t("STAFF DEPENDENT (OPD/IPD)")
    ];
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
    }
    const handleSelect = async (name, value) => {
        if (name === "category") {
            let apiData = await getBindSubCategoryListAPI(value?.value)
            if (apiData?.success) {
                setList((val) => ({ ...val, subCategory: handleReactSelectDropDownOptions(apiData?.data, "Subcategory", "SubCategoryID") }))
                setValues((val) => ({
                    ...val,
                    ["SubCategory"]: { value: "" },
                }));
            } else {
                setList((val) => ({ ...val, subCategory: [] }))
            }
        }
        setValues((val) => ({
            ...val,
            [name]: value,
        }));
    }

    const getBindList = async () => {
        let [category] = await Promise.all([
            EDPBindCategoryListAPI(),
        ]);
        if (category?.success) {
            setList((val) => ({ ...val, category: handleReactSelectDropDownOptions(category?.data, "Name", "CategoryID") }))
        }
    }

    const BindServiceOfferedList = async (categoryID, subCategoryID, panelID, operationType) => {
        let apiResp = await ServiceOfferedListAPI(categoryID, subCategoryID?.split("#")[0], panelID, operationType)
        if (apiResp?.success) {
            setBodyData(apiResp?.data?.item)
            console.log("apiResp?.data?.summary",apiResp?.data?.summary)
            if (apiResp?.data?.summary?.length > 0) {
                setValues((val) => ({ ...val, ...apiResp?.data?.summary[0] }))
            }else{
                setValues((val) => ({ ...val, IPDCategory:"",OPDCategory:"",IPDSubCategory:"",OPDSubCategory:"" }))

            }
        }
    }

    useEffect(() => {
        if (values?.category?.value && values?.SubCategory?.value && data?.PanelID && values?.OperationType?.value) {
            BindServiceOfferedList(values?.category?.value, values?.SubCategory?.value, data?.PanelID, values?.OperationType?.value)
        }
    }, [values?.category?.value, values?.SubCategory?.value, data?.PanelID, values?.OperationType?.value])

    useEffect(() => {
        getBindList()
    }, [])

    const handleCustomInput = (index, name, value, type, max = 9999999999999) => {
        if (type === "number") {
            if (!isNaN(value) && Number(value) <= max) {
                const data = JSON.parse(JSON.stringify(bodyData));
                data[index][name] = value;
                if (name === "OPD") {
                    const opdItems = allKeys.filter(item => item.toLowerCase().includes("opd"));
                    opdItems?.map((val) => {
                        data[index][val] = value
                    })
                } else if (name === "IPD") {
                    const ipdItems = allKeys.filter(item => item.toLowerCase().includes("ipd"));
                    ipdItems?.map((val) => {
                        data[index][val] = value
                    })
                }
                setBodyData(data);
            }
        }
    };
    return (
        <>
            <div className='row'>

                <ReactSelect
                    placeholderName={t("Category Name")}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={list?.category}
                    handleChange={handleSelect}
                    value={`${values?.category?.value}`}
                    name={"category"}
                />
                <ReactSelect
                    placeholderName={t("Sub Category Name")}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={list?.subCategory}
                    handleChange={handleSelect}
                    value={`${values?.SubCategory?.value}`}
                    name={"SubCategory"}
                />
                <ReactSelect
                    placeholderName={t("Operation Type")}
                    //id={"fallowrateopd"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={[
                        { label: "Set Discount", value: "2" },
                        { label: "Set Panel Co-Payment", value: "3" },
                        { label: "Set Panel Non-Payable", value: "1" }
                    ]}
                    handleChange={handleSelect}
                    value={`${values?.OperationType?.value}`}
                    name={"OperationType"}
                />

                <Input
                    type="text"
                    className="form-control"
                    id="OPDCategory"
                    name="OPDCategory"
                    value={values?.OPDCategory}
                    onChange={handleChange}
                    lable={t("Category Opd %")}
                    placeholder=""
                    respclass="col-xl-1 col-md-2 col-sm-2 col-12"
                />
                <Input
                    type="text"
                    className="form-control"
                    id="IPDCategory"
                    name="IPDCategory"
                    value={values?.IPDCategory}
                    onChange={handleChange}
                    lable={t("Category Ipd %")}
                    placeholder=""
                    respclass="col-xl-1 col-md-2 col-sm-2 col-12"
                />
                <Input
                    type="text"
                    className="form-control"
                    id="OPDSubCategory"
                    name="OPDSubCategory"
                    value={values?.OPDSubCategory}
                    onChange={handleChange}
                    lable={t("Sub Category Opd %")}
                    placeholder=""
                    respclass="col-xl-1 col-md-2 col-sm-2 col-12"
                />
                <Input
                    type="text"
                    className="form-control"
                    id="IPDSubCategory"
                    name="IPDSubCategory"
                    value={values?.IPDSubCategory}
                    onChange={handleChange}
                    lable={t("Sub Category Ipd %")}
                    placeholder=""
                    respclass="col-xl-1 col-md-2 col-sm-2 col-12"
                />

            </div>
            <div> <Tables thead={thead} tbody={bodyData?.map((ele, index) => ({
                checkbox: <input type='checkbox' />,
                ItemName: <div style={{ whiteSpace: "normal", width: "100%" }}>{ele?.ItemName}</div>,
                OPD: <Input
                    type="number"
                    className="table-input"
                    respclass={"w-100"}
                    removeFormGroupClass={true}
                    name={"OPD"}
                    value={ele?.OPD ? ele?.OPD : ""}
                    onChange={(e) => { handleCustomInput(index, "OPD", e.target.value, "number", 100) }}
                />,
                IPD: <Input
                    type="number"
                    className="table-input"
                    respclass={"w-100"}
                    removeFormGroupClass={true}
                    name={"IPD"}
                    value={ele?.IPD ? ele?.IPD : ""}
                    onChange={(e) => { handleCustomInput(index, "IPD", e.target.value, "number", 100) }}
                />,
                SELF: <div className='d-flex'>
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        name={"SelfOpd"}
                        placeholder={"OPD"}
                        value={ele?.SelfOpd ? ele?.SelfOpd : ""}
                        onChange={(e) => { handleCustomInput(index, "SelfOpd", e.target.value, "number", 100) }}
                    />
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        placeholder={"IPD"}
                        name={"SelfIpd"}
                        value={ele?.SelfIpd ? ele?.SelfIpd : ""}
                        onChange={(e) => { handleCustomInput(index, "SelfIpd", e.target.value, "number", 100) }}
                    />
                </div>,
                STAFF: <div className='d-flex'>
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        name={"staffOpd"}
                        placeholder={"OPD"}
                        value={ele?.staffOpd ? ele?.staffOpd : ""}
                        onChange={(e) => { handleCustomInput(index, "staffOpd", e.target.value, "number", 100) }}
                    />
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        placeholder={"IPD"}
                        name={"staffIpd"}
                        value={ele?.staffIpd ? ele?.staffIpd : ""}
                        onChange={(e) => { handleCustomInput(index, "staffIpd", e.target.value, "number", 100) }}
                    />
                </div>,
                Insured: <div className='d-flex'>
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        name={"InsuredOpd"}
                        placeholder={"OPD"}
                        value={ele?.InsuredOpd ? ele?.InsuredOpd : ""}
                        onChange={(e) => { handleCustomInput(index, "InsuredOpd", e.target.value, "number", 100) }}
                    />
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        placeholder={"IPD"}
                        name={"InsuredIpd"}
                        value={ele?.InsuredIpd ? ele?.InsuredIpd : ""}
                        onChange={(e) => { handleCustomInput(index, "InsuredIpd", e.target.value, "number", 100) }}
                    />
                </div>,
                VIP: <div className='d-flex'>
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        name={"vipOpd"}
                        placeholder={"OPD"}
                        value={ele?.vipOpd ? ele?.vipOpd : ""}
                        onChange={(e) => { handleCustomInput(index, "vipOpd", e.target.value, "number", 100) }}
                    />
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        placeholder={"IPD"}
                        name={"vipIpd"}
                        value={ele?.vipIpd ? ele?.vipIpd : ""}
                        onChange={(e) => { handleCustomInput(index, "vipIpd", e.target.value, "number", 100) }}
                    />
                </div>,
                Sponsored: <div className='d-flex'>
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        name={"SponsoredOpd"}
                        placeholder={"OPD"}
                        value={ele?.SponsoredOpd ? ele?.SponsoredOpd : ""}
                        onChange={(e) => { handleCustomInput(index, "SponsoredOpd", e.target.value, "number", 100) }}
                    />
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        placeholder={"IPD"}
                        name={"SponsoredIpd"}
                        value={ele?.SponsoredIpd ? ele?.SponsoredIpd : ""}
                        onChange={(e) => { handleCustomInput(index, "SponsoredIpd", e.target.value, "number", 100) }}
                    />
                </div>,
                Other: <div className='d-flex'>
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        name={"OtherOpd"}
                        placeholder={"OPD"}
                        value={ele?.OtherOpd ? ele?.OtherOpd : ""}
                        onChange={(e) => { handleCustomInput(index, "OtherOpd", e.target.value, "number", 100) }}
                    />
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        placeholder={"IPD"}
                        name={"OtherIpd"}
                        value={ele?.OtherIpd ? ele?.OtherIpd : ""}
                        onChange={(e) => { handleCustomInput(index, "OtherIpd", e.target.value, "number", 100) }}
                    />
                </div>,
                Religion: <div className='d-flex'>
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        name={"ReligionOpd"}
                        placeholder={"OPD"}
                        value={ele?.ReligionOpd ? ele?.ReligionOpd : ""}
                        onChange={(e) => { handleCustomInput(index, "ReligionOpd", e.target.value, "number", 100) }}
                    />
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        placeholder={"IPD"}
                        name={"ReligionIpd"}
                        value={ele?.ReligionIpd ? ele?.ReligionIpd : ""}
                        onChange={(e) => { handleCustomInput(index, "ReligionIpd", e.target.value, "number", 100) }}
                    />
                </div>,
                StaffIndepent: <div className='d-flex'>
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        name={"StaffIndepentOpd"}
                        placeholder={"OPD"}
                        value={ele?.StaffIndepentOpd ? ele?.StaffIndepentOpd : ""}
                        onChange={(e) => { handleCustomInput(index, "StaffIndepentOpd", e.target.value, "number", 100) }}
                    />
                    <Input
                        type="number"
                        className="table-input"
                        respclass={"w-50"}
                        removeFormGroupClass={true}
                        placeholder={"IPD"}
                        name={"StaffIndepentIpd"}
                        value={ele?.StaffIndepentIpd ? ele?.StaffIndepentIpd : ""}
                        onChange={(e) => { handleCustomInput(index, "StaffIndepentIpd", e.target.value, "number", 100) }}
                    />
                </div>,


            }))} /></div>
        </>
    )
}
