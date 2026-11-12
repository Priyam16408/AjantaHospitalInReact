import React, { useEffect, useState } from 'react'
import Heading from '../../UI/Heading';
import DatePicker from '../../formComponent/DatePicker';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../formComponent/ReactSelect';
import { AutoComplete } from 'primereact/autocomplete';
import { GetBindLabInvestigationRate, GetDiscountWithCoPay, GetLoadOPD_All_ItemsLabAutoComplete, PatientSearchbyBarcode } from '../../../networkServices/opdserviceAPI';
import EMGServicesTable from "../../UI/customTable/Emergency/EMGServicesTable"
import ColorCodingSearch from '../../commonComponents/ColorCodingSearch';
import { useSelector } from 'react-redux';
import { handleReactSelectDropDownOptions, notify, SaveEmgServicePayload } from '../../../utils/utils';
import { useDispatch } from 'react-redux';
import { GetBindSubCatgeory } from '../../../store/reducers/common/CommonExportFunction';
import { BindCategory } from '../../../networkServices/BillingsApi';
import moment from 'moment';
import { SaveEmergencyServicesAPI } from '../../../networkServices/Emergency';


export default function EMGSevices({ data, setSlideScreenState }) {
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [t] = useTranslation();
    const [values, setValues] = useState({
        Category: { lable: "All", value: "0" },
        SubCategory: { lable: "All", value: "0" },
        fromDate: new Date(),
        toDate: new Date(),
        Remarks: "",
        Qty: "",
        IsUrgent: false,

    })
    const [value, setValue] = useState("");
    const [items, setItems] = useState([]);
    const [bodyData, setBodyData] = useState([]);
    const dispatch = useDispatch();
    const [dropDownData, setDropDownData] = useState({
        category: [],
        subcategory: [],
    });
    const handleChange = async (e) => {
        setValues(() => ({ ...values, [e.target.name]: e?.target?.value }))
    }

    const handleReactSelect = async (name, value, handleApi) => {
        if (handleApi) {
            await handleApi("12", value.value);
        }
        setValues(() => ({ ...values, [name]: value }))
    }

    const subCategoryBind = async (Type, CategoryID) => {
        try {
            await dispatch(GetBindSubCatgeory({ Type, CategoryID }));
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const renderApiCall = async () => {
        try {
            const [Category] = await Promise.all([
                BindCategory(12),
                subCategoryBind(12, "0"),
            ]);
            setDropDownData({
                ...dropDownData,
                ["category"]: [
                    { label: "All", value: "0" },
                    ...handleReactSelectDropDownOptions(
                        Category?.data,
                        "name",
                        "categoryID"
                    ),
                ],
            });
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    useEffect(() => {
        renderApiCall();
    }, []);


    const { GetBindSubCatgeoryData } = useSelector((state) => state.CommonSlice);

    const handleAddCountDateIteration = (formDate, toDate) => {
        const diffCount =
            toDate.startOf("day").diff(formDate.startOf("day"), "days") + 1;
        return diffCount;
    };


    const handleGetLoadOPD_All_ItemsLabAutoComplete = async (payload) => {
        try {
            const data = await GetLoadOPD_All_ItemsLabAutoComplete(payload);
            return data?.data;
        } catch (error) {
            console.log(error, "error`");
        }
    };

    const search = async (event) => {
        const item = await handleGetLoadOPD_All_ItemsLabAutoComplete({
            searchType: values?.searchType ?? 1,
            prefix: event?.query.trim(),
            type: values?.type,
            categoryID: values?.Category?.value ?? "0",
            subCategoryID: values?.SubCategory?.value ?? "0",
            itemID: "",
        });
        setItems(item);
    };
    const validateInvestigation = async (e) => {
        const { value } = e;
        const bindRate = await GetBindLabInvestigationRate(String(data?.PanelID), value?.item_ID,value?.categoryid,"",   "", "1");
        let patientDetail = await PatientSearchbyBarcode(data?.PatientID, 1);

        const discountWithCoPay = await GetDiscountWithCoPay(
            value?.item_ID,
            patientDetail?.data?.PanelID,
            patientDetail?.data?.PatientTypeID,
            patientDetail?.data?.MemberShipCardNo
        );



        const loopCount = handleAddCountDateIteration(
            moment(values?.fromDate),
            moment(values?.toDate)
        );
        const addTableData = [];
        for (let i = 0; i < loopCount; i++) {
            const currentDate = moment(values?.fromDate);
            const newDate = currentDate.add(i, "days").format("DD-MMM-YYYY");
            const addObj = {
                Rate: 0,
                ...value,
                ...values,
                ...bindRate?.data,
                DATE: newDate,
            };
            addObj.Discount = 0;
            addObj.Qty = 1;
            addObj.IsPayble = discountWithCoPay?.data?.IsPayble;
            addObj.OPDCoPayPercent = discountWithCoPay?.data?.OPDCoPayPercent;
            addObj.OPDPanelDiscPercent = discountWithCoPay?.data?.OPDPanelDiscPercent;
            addObj.discountAmount = Number(discountWithCoPay?.data?.OPDPanelDiscPercent ?? 0);
            addObj.isUrgent = false;
            addObj.doctor = {value:data?.DoctorID};
            addObj.TransactionID = patientDetail?.TransactionID;
            addObj.rateEditable = (addObj.rateEditable === "1" && !Object.keys(bindRate)?.length) ? true : false
            addTableData.push(addObj);
        }

        setBodyData((val) => ([...addTableData, ...val]))
        setValue("");


    };

    const itemTemplate = (item) => {
        return (
            <div
                className="p-clearfix"
            // onClick={() => validateInvestigation(item, 0, 0, 1, 0)}
            >
                <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
                    {item?.autoCompleteItemName}
                </div>
            </div>
        );
    };


    const handleCustomInput = (index, name, value, type, max) => {
        // debugger
        if (type === "number") {
            if (!isNaN(value) && Number(value) <= max) {
                const data = [...bodyData];
                data[index][name] = value;
                setBodyData(data);
            } else {
                return false
            }
        } else {
            const data = [...bodyData];
            data[index][name] = value;
            setBodyData(data);
        }

    };
    const deleteRowData = (index) => {
        const data = [...bodyData];
        data.splice(index, 1);
        setBodyData(data);
    };
    const handleSave = async (validateData) => {
        if (validateData?.Rate) {
            notify("Rate Field is required", "error")
            return 0;
        } else if (validateData?.discountAmount && (!validateData?.discountReason || !validateData?.discountApproveBy)) {
            if (!validateData?.discountReason) notify("Discount Reason Field is required", "error")
            else if (!validateData?.discountApproveBy) notify("Discount Approve By Field is required", "error")
            return 0;
        }

        const payload = SaveEmgServicePayload(bodyData, data, values)

        let apiResp = await SaveEmergencyServicesAPI(payload)
        if (apiResp?.success) {
            notify(apiResp?.message, "success");
            setSlideScreenState({
                show: false,
                name: "",
                component: null,
            })
        } else {
            notify(apiResp?.message, "error");
        }

        // console.log("firstapiResp", apiResp)
    }
    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <form className="patient_registration card">
                    <Heading
                        title={t("EMGServiceHead")}
                        isBreadcrumb={false}
                    />
                    <div className="row p-2">
                        <ReactSelect placeholderName={t("Category")}
                            id="Category"
                            inputId="Category"
                            name="Category"
                            value={`${values?.Category?.value}`}
                            dynamicOptions={dropDownData?.category}
                            searchable={true}
                            handleChange={(name, e) =>
                                handleReactSelect(name, e, subCategoryBind)
                            }
                            respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
                        />
                        <ReactSelect
                            placeholderName={t("Subcategory")}
                            id="Subcategory"
                            inputId="Subcategory"
                            name="Subcategory"
                            value={`${values?.SubCategory?.value}`}
                            handleChange={handleReactSelect}
                            dynamicOptions={[
                                { label: "All", value: "0" },
                                ...GetBindSubCatgeoryData.map((item) => {
                                    return {
                                        label: item?.name,
                                        value: item?.subCategoryID,
                                    };
                                }),
                            ]}
                            searchable={true}
                            respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
                        />

                        <DatePicker
                            className="custom-calendar"
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            id="fromDate"
                            name="fromDate"
                            value={values.fromDate}
                            handleChange={handleChange}
                            lable={t("FromDate")}
                            placeholder={VITE_DATE_FORMAT}
                        />

                        <DatePicker
                            className="custom-calendar"
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            id="toDate"
                            name="toDate"
                            value={values.toDate}
                            handleChange={handleChange}
                            lable={t("ToDate")}
                            placeholder={VITE_DATE_FORMAT}
                        />

                        <div className="col-xl-4 col-md-9 col-sm-4 col-12">
                            <AutoComplete
                                value={value}
                                suggestions={items}
                                completeMethod={search}
                                // ref={ref}
                                className="w-100"
                                onSelect={(e) => validateInvestigation(e, 0, 0, 1, 0, 0)}
                                id="searchtest"
                                onChange={(e) => {
                                    const data =
                                        typeof e.value === "object"
                                            ? e?.value?.autoCompleteItemName
                                            : e.value;
                                    setValue(data);
                                }}
                                itemTemplate={itemTemplate}
                            />
                            <label htmlFor={"searchtest"} className="lable searchtest">
                                {t("Search Test")}
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            <div className="mt-2 spatient_registration_card card">
                <Heading
                    title={t("SelectedItem")}
                    isBreadcrumb={false}
                    secondTitle={<>
                        <ColorCodingSearch label={t("OutSource")} color="#f5f3b2" />
                        <ColorCodingSearch label={t("ZeroRate")} color="#f5c6f7" />
                    </>
                    }
                />
                <EMGServicesTable tbody={bodyData} handleCustomInput={handleCustomInput} deleteRowData={deleteRowData} handleChangeReactSelect={handleReactSelect} values={values} handleSave={handleSave} />

            </div>
        </>
    )
}
