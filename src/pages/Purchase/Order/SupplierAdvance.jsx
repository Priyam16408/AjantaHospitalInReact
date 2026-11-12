import React, { useEffect, useState } from 'react'
import Tables from '../../../components/UI/customTable';
import CustomSelect from '../../../components/formComponent/CustomSelect';
import Input from '../../../components/formComponent/Input';
import { t } from 'i18next';
import { CreatePurchaseOrderSave, GetPOpuchaseTermsAndConditon, GetPurchaseOrderItemDetailsTerms, GetTermAndConditions, RNPOApprovalPOReport } from '../../../networkServices/Purchase';
import { handleReactSelectDropDownOptions, notify } from '../../../utils/utils';
import moment from 'moment';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { AiOutlineClose } from 'react-icons/ai';
import { AutoComplete } from 'primereact/autocomplete';
import { RedirectURL } from '../../../networkServices/PDFURL';
const SupplierAdvance = (props) => {


    const {
        bodyData,
        payload,
        Image,
        handleClose,
        setPayload,
        setBodyData,
        initialItem,
        setDataLoading,
        termsConditionsUpdateList,
        isEdit,
        setIsEdit,
        PurchaseOrderNo,
        setIsPoByPr,
        supplierList
    } = props

    const userData = useLocalStorage("userData", "get");

    const [values, setValues] = useState(bodyData);
    const [result, setResult] = useState([]);
    const [items, setItem] = useState('');
    const [selectedTearm, setSelectedTerm] = useState(null);
    const [selectedTearms, setSelectedTearms] = useState([])
    const [dropDownState, setDropDownState] = useState({
        BindTermAndConditions: []
    })
    const [selectedAccountType, setSelectedAccountType] = useState(null);
    const THEAD = [
        { name: t("#"), width: "5%" },
        { name: t("Supplier"), width: "15%" },
        { name: t("Currency"), width: "10%" },
        { name: t("Payment Mode"), width: "15%" },
        { name: t("Advance Amount"), width: "10%" },
        // { name: t("Terms & Condition"), width: "20%" },
        // { name: t("Selected T&C"), width: "25%" }
    ];

    console.log(selectedTearm, "selectedTearms")

    const handleCustomInput = (ind, name, value, action = "add") => {
        setValues((prevState) => {
            const updatedData = [...prevState];

            if (name === "TermsCondition") {
                let existingTerms = updatedData[ind][name] || [];

                if (action === "add") {
                    // Add only if it's not already in the list
                    if (!existingTerms.some(term => term.value === value.value)) {
                        existingTerms = [...existingTerms, value];
                    }
                } else if (action === "remove") {
                    // Remove the term from the list
                    existingTerms = existingTerms.filter(term => term.value !== value.value);
                }

                updatedData[ind][name] = existingTerms;
            } else {
                updatedData[ind][name] = value;
            }

            return updatedData;
        });
    };



    const TermAndConditions = async () => {
        try {
            const response = await GetTermAndConditions();
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    BindTermAndConditions: handleReactSelectDropDownOptions(
                        response?.data,
                        "Terms",
                        "Id"
                    ),
                }));
                // if (response?.data.length > 0) {
                //   setPayload((prevPayload) => ({
                //     ...prevPayload,
                //     supplier: {...response?.data[0],value:response?.data[0]?.ID}, // First option set as default
                //   }));
                // }
            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

    const GetPOItemDetailsTerms = async () => {
        debugger
        const payloadData = bodyData?.map((item) => (item.PurchaseRequestsNo || ""))
        try {
            const response = await GetPurchaseOrderItemDetailsTerms(payloadData);
            console.log("response", response)
            if (response?.success) {

            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const TearmAndConditionPO = async () => {
        try {
            const response = await GetPOpuchaseTermsAndConditon()
            if (response?.success) {
                const termsList = response?.data || [];
                // setResult(response?.data)

                const defaultItem = termsList.find(term => term.IsDefault === 1);
                if (defaultItem) {
                    setSelectedTearms([defaultItem]); // Set default item as selected
                } else {
                    setSelectedTearms([]); // Or initialize to empty array if no default
                }

                const filteredTerms = termsList.filter(term => term.IsDefault !== 1);
                setResult(filteredTerms);
            } else {
                notify(response.message, "error")
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        // GetPOItemDetailsTerms()
        if (isEdit) {
            const termsUpdatedData = termsConditionsUpdateList.map(item => ({
                "Terms": item?.TermsCondition,
                "Active": 0,
                "IsDefault": 0,
                "CreatedBy": "",
                ID: item?.PoTermsID
            }))
            setSelectedTearms([...termsUpdatedData])
        }
        else {
            TermAndConditions()
            TearmAndConditionPO()
        }
    }, [])
    console.log("bodyData", bodyData, values)

    const getPOReport = async (currentPONumber) => {
             console.log("currentPONumber",currentPONumber)
              const payload=  {
                  poNumber:currentPONumber
                  }
              try {
                  const response = await RNPOApprovalPOReport(payload)
                  if (response?.success) {
                       RedirectURL(response?.data?.pdfUrl);
                  }
              } catch (error) {
                  console.error("Error fetching data:", error);
                  notify(error?.message || "An error occurred during search.", "error");
              }
      
          };

    // bug fixed by komal maam
    const SavePODraftDetails = async () => {
        debugger
        const payloadData =
        {
            data: bodyData.map((item) => {
                debugger
                return {
                    id: "",
                    pUnit: String(item?.PUnit || ""),
                    stock: item?.Stock || item?.itemName?.Stock,
                    itemName: String(item?.ItemName?.ItemName || item?.ItemName),
                    itemID: String(item?.ItemName?.ItemID || item?.ItemID || 0),
                    deal: "",
                    rate: Number(item?.Rate || 0),
                    discount: Number(item?.Discount || 0),
                    gstGroup: String(item?.GSTGroup?.value),
                    gstType: item?.GSTType?.value ? item?.GSTType?.value : item?.GSTType,
                    // gstType: String( item?.GSTType?.value || item?.ItemName?.GSTType ),
                    // gstGroup: String(item?.GSTGroup?.value),
                    // gstType: String(item?.GSTGroup?.value ),
                    // gstGroup: String(item?.GSTGroup?.TaxGroupLabel || item?.TaxGroupLabel),
                    // gstType: String(item?.GSTGroup?.TaxGroup || item?.GSTType ),

                    // gstGroup: String(item?.GSTGroup?.TaxGroup || ""),
                    mrp: Number(item?.MRP || 0),
                    quantity: Number(item?.Quantity || 0),
                    taxOn: String(item?.RateAD?.value || item?.TaxOn || ""),
                    igstPercent: Number(item?.IGSTPercent || 0),
                    igstAmt: Number(item?.IGSTPercent || 0),
                    // igstAmt: Number(item?.IGSTAmt || 0),
                    cgstPercent: Number(item?.CGSTPercent || 0),
                    cgstAmt: Number(item?.CGSTAmt || 0),
                    sgstPercent: Number(item?.SGSTPercent || 0),
                    sgstAmt: Number(item?.SGSTAmt || 0),
                    taxAmt: Number(item?.GSTAmount || 0),
                    specification: String(item?.Specification || ""),
                    // taxAmt: Number(item?.TaxAmt || 0),
                    supplier: supplierList.find(ele=> ele?.value ===item?.supplier?.value )?.LedgerName,
                    supplierID: String(item?.supplier?.value),
                    netAmount: Number(item?.NetAmount || 0),
                    // itemID: Number(item?.ItemID || 0),
                    free: String(item?.Free?.value || "No"),
                    hsnCode: String(item?.HSNCode || ""),
                    purchaseRequestsNo: String(item?.PurchaseRequestsNo || ""),
                    centreID: String(userData?.centreID),
                    manuFacturer: String(item?.manufacturer?.Name || item?.Manufacturer || ""),
                    manufactureID: Number(item?.manufacturer?.ManufactureID || item?.ManufactureID || 0),
                    subCategoryID: Number(item?.ItemName?.SubCategoryID || item?.SubCategoryID || 0),
                    vat: Number(item?.GSTGroup?.TotalGST || item?.VAT || 0),
                    currency: String(item?.Currency || ""),
                    currencyFactor: Number(item?.CurrencyFactor || 0),
                    currencyCountryID: Number(item?.CurrencyCountryID || 0),
                    minimum_Tolerance_Qty: 0,
                    maximum_Tolerance_Qty: 0,
                    minimum_Tolerance_Rate: 0,
                    maximum_Tolerance_Rate: 0,
                    // gstType: String(item?.GSTType || ""),
                }
            }),
            supplierAdvanceDetails: bodyData.map((item) => ({
                supplierID: String(item?.supplier?.VendorID || item?.supplierID || ""),
                advanceAmount: Number(item?.advanceAmt) ? Number(item?.advanceAmt) : "0",
                paymentModeID: Number(item?.PaymentMode?.value || ""),
            })),
            // supplierAdvanceTermsDetails: [],
            // supplierAdvanceTermsDetails: bodyData.map((item) => ({
            //     poNumber: 0,
            //     detailsID: 0,
            //     details: "",
            //     supplierID: String(item?.supplier?.ID || "")
            // })),
            supplierAdvanceTermsDetails: bodyData.flatMap((item) =>
                selectedTearms.map((term) => ({
                    poNumber: 0,
                    detailsID: term.ID || 0,
                    details: term.Terms || "",
                    supplierID: String(item?.supplier?.VendorID || item?.supplierID)
                }))
            ),

            poAmount: 0,
            roundOff: 0,
            freightCharges: 0,
            poDate: moment(payload?.poDate).format("YYYY-MMM-DD"),
            validDate: moment(payload?.validDate).format("YYYY-MMM-DD"),
            deliveryDate: moment(payload?.deliveryDate).format("YYYY-MMM-DD"),
            poType: String(payload?.poType?.value),
            remarks: String(payload?.remarks),
            subject: String(payload?.subject),
            storeType: String(payload?.storeType?.value),
            purchaseOrderNumber: "",
            isConsolidated: false,
            draftID: "",
            otherCharges: 0,
            isService: Number(payload?.poTypeService?.value) || 0,
            "documentBase64": Image?.Document_Base64 || "",
            requisitionType: String(payload?.requisitionType?.value) || "",
        };

        console.log(payloadData);


        try {
            const response = await CreatePurchaseOrderSave(payloadData);
            console.log("response", response)
            if (response?.success) {
                setPayload({

                    storeType: { label: "Medical Store", value: "STO00001" }, // Default value
                    requisitionType: { label: 'Normal', value: 'normal' },
                    poType: { label: 'PO By Item', value: '1' },
                    poTypeService: { label: 'No Service', value: '0' },
                    category: {
                        "name": "MEDICAL STORE ITEMS",
                        "categoryID": "5",
                        "configID": "11",
                        "label": "MEDICAL STORE ITEMS",
                        "value": "5"
                    },
                    subCategory: { label: 'All', value: '0' },
                    supplier: {},
                    validDate: new Date(),
                    poDate: new Date(),
                    deliveryDate: new Date(),
                    netAmount: "",
                    roundOff: "",
                    remarks: "",
                    subject: "",

                })
                setBodyData([initialItem])
                 response?.data?.forEach(item=>{
                    getPOReport(item?.purchaseOrder)
                })
                    setDataLoading(true)
               
                handleClose()
                notify(response?.message, "success");
              
                setIsPoByPr(false)

               


            }

            else {
                notify(response?.message, "error");
            }
        } catch (error) {
            console.error("SomeThing Went Wrong", error);
        }
    };

    const updatePO = async () => {
        debugger
        try {
            let updatedData = bodyData.map((val) => {
                return {
                    id: "",
                    pUnit: String(val?.pUnit ?? ''),
                    stock: val?.Stock || 0,
                    itemName: String(val?.ItemName?.ItemName || val?.ItemName),
                    itemID: String(val?.ItemName?.ItemID || val?.ItemID),
                    deal: "",
                    rate: Number(val?.Rate || 0),
                    discount: Number(val?.Discount || 0),
                    gstGroup: String(val?.GSTGroup?.value || val?.GSTGroup),
                    gstType: val?.GSTType?.value ? val?.GSTType?.value : val?.GSTType,
                    mrp: Number(val?.MRP || 0),
                    quantity: Number(val?.Quantity || 0),
                    taxOn: String(val?.RateAD?.value || val?.TaxOn),
                    igstPercent: Number(val?.GSTGroup?.IGSTPer || val?.IGSTPercent || 0),
                    igstAmt: Number(val?.IGSTAmt ?? 0),
                    cgstPercent: Number(val?.GSTGroup?.CGSTPer || val?.CGSTPercent || 0),
                    cgstAmt: Number(val?.CGSTAmt ?? 0),
                    sgstPercent: Number(val?.GSTGroup?.SGSTPer || val?.SGSTPercent || 0),
                    sgstAmt: Number(val?.SGSTAmt ?? 0),
                    taxAmt: Number(val?.GSTAmount || 0),
                    specification: String(val?.Specification || 0),
                    
                    subCategoryID: val?.ItemName?.SubCategoryID ? String(val?.ItemName?.SubCategoryID) : val?.SubCategoryID ? String(val?.SubCategoryID) : "",
                    supplier: supplierList.find(ele=> ele?.value ===val?.supplier?.value )?.LedgerName,
                    supplierID: String(val?.supplier?.value),
                    netAmount: Number(val?.NetAmount || 0),
                    free: String(val?.Free?.value || val?.Free || "No"),
                    hsnCode: String(val?.HSNCode || ""),
                    purchaseRequestsNo: String(val?.PurchaseRequestsNo || ""),
                    centreID: String(userData?.centreID),
                    manuFacturer: String(val?.manufacturer?.Name || val?.Manufacturer || ""),
                    manufactureID: Number(val?.manufacturer?.ManufactureID || val?.ManufactureID || 0),
                    vat: Number(val?.GSTGroup?.TotalGST ?? val?.VAT ?? 0),
                    currency: String(val?.Currency ?? ""),
                    currencyFactor: Number(val?.CurrencyFactor ?? 0),
                    currencyCountryID: Number(val?.CurrencyCountryID ?? 0),
                    minimum_Tolerance_Qty: 0,
                    maximum_Tolerance_Qty: 0,
                    minimum_Tolerance_Rate: 0,
                    maximum_Tolerance_Rate: 0,
                }
            })

            const payloadData = {
                data: updatedData,

                supplierAdvanceDetails: bodyData.map((item) => ({
                    supplierID: String(
                        item?.supplier?.VendorID ||
                        item?.supplier?.value ||
                        item?.supplierID ||
                        ""
                    ),
                    // supplierID: value?.supplier?.ID || "",
                    advanceAmount: 0,
                    paymentModeID: 0,
                })),

                supplierAdvanceTermsDetails: selectedTearms.map((item) => ({
                    poNumber: bodyData[0]?.PurchaseOrderNo || 0,
                    detailsID: item.ID || 0,
                    details: item.Terms || "",
                    supplierID: String(
                        bodyData[0]?.supplier?.VendorID ||
                        bodyData[0]?.supplier?.value ||
                        bodyData[0]?.supplierID ||
                        ""
                    ),
                })),

                poAmount: 0,
                roundOff: 0,
                freightCharges: 0,
                poDate: moment(payload?.poDate).format("YYYY-MMM-DD"),
                validDate: moment(payload?.validDate).format("YYYY-MMM-DD"),
                deliveryDate: moment(payload?.deliveryDate).format("YYYY-MMM-DD"),
                poType: String(payload?.poType?.value),
                remarks: String(payload?.remarks),
                subject: String(payload?.subject),
                storeType: String(payload?.storeType?.value),
                purchaseOrderNumber: PurchaseOrderNo,
                isConsolidated: false,
                draftID: "",
                otherCharges: 0,
                isService: 0,
                documentBase64: Image?.Document_Base64 || "",
            };
            const response = await CreatePurchaseOrderSave(payloadData);
            if (response?.success) {

                setIsEdit(false);

                setPayload({
                    storeType: { label: "Medical Store", value: "STO00001" }, // Default value
                    requisitionType: { label: "Normal", value: "normal" },
                    poType: { label: "PO By Item", value: "1" },
                    poTypeService: { label: "No Service", value: "0" },
                    category: {
                        name: "MEDICAL STORE ITEMS",
                        categoryID: "5",
                        configID: "11",
                        label: "MEDICAL STORE ITEMS",
                        value: "5",
                    },
                    subCategory: { label: "All", value: "0", subCategoryID: "0" },
                    supplier: {},
                    validDate: moment().format("YYYY-MM-DD"),
                    poDate: moment().format("YYYY-MM-DD"),
                    deliveryDate: moment().format("YYYY-MM-DD"),
                    netAmount: "",
                    roundOff: "",
                    remarks: "",
                    subject: "",
                });
                setDataLoading(true);
                setPayload((preV) => ({
                    ...preV,
                    remarks: "",
                    subject: "",
                    // subCategory:""
                }));

                setBodyData([initialItem]),
                    setIsPoByPr(false)

                console.log("first response", response)
                handleClose()
                notify(response?.message, "success");

            } else {

                console.log("something went wrong")
            }

        } catch (error) {
            console.log(error)
        }
    }


    // const search = async (event, name) => {

    //     
    //     if (event?.query?.length > 0) {
    //         let filterData = [];

    //         filterData = result?.data?.filter((val) => event.query)
    //         setItem

    //         //   if (results.length > 0 ) {
    //         //     // console.log("values?.VoucherType?.extraColomn", values?.VoucherType?.extraColomn?.split("#"))
    //         //     let filterData = []
    //         //     let type = values?.VoucherType?.extraColomn?.split("#")[0]
    //         //     if (name === "AccountType") {
    //         //       filterData = results?.data?.filter((val) => val?.balanceType === type)
    //         //     } else {
    //         //       filterData = results?.data?.filter((val) => val?.balanceType !== type)
    //         //     }
    //         //     setItems(filterData);
    //         //   } else {
    //         //     setItems([])
    //         //   }
    //     } else {
    //         setItems([])
    //     }
    // };
    const search = (e) => {
        const query = e.query.trim().toLowerCase();
        // 
        if (query && Array.isArray(result)) {
            const filtered = result.filter(
                (item) =>
                    item?.Terms?.toLowerCase()?.includes(query)
            );
            setItem(filtered);
        } else {
            setItem([]);
        }
    };


    const handleSelectTearms = (selectedItem) => {
        debugger
        const isDuplicate =
            Array.isArray(selectedTearms) &&
            selectedTearms.some(term => term.Terms === selectedItem.Terms);

        if (!isDuplicate) {
            setSelectedTearms(prev => [...prev, selectedItem]);
        }

        setSelectedTerm(null);  // reset input
    };

    const handleRemoveTerm = (termToRemove) => {
        setSelectedTearms(prev =>
            prev.filter(term => term.Terms !== termToRemove.Terms)
        );
    }
    
    useEffect(() => {
        if (!bodyData || bodyData?.length === 0) return;

        const uniqueSupplierMap = new Map();

        bodyData.forEach(item => {
            const id = item?.supplier?.ID;
            if (!uniqueSupplierMap.has(id)) {
                uniqueSupplierMap.set(id, item);
            }
        });

        const uniqueItems = Array.from(uniqueSupplierMap?.values());
        setValues(uniqueItems);
    }, [bodyData]);





    return (
        <div className="patient_registration card">
            <div className="row p-2 ">
                <div className="col-12 mb-2">

                    <Tables
                        thead={THEAD}
                        tbody={values?.map((val, index) => ({
                            Sno: index + 1,
                            Supplier: val?.supplier?.LedgerName || val?.Supplier,
                            Currency: "INR",
                            PaymentMode: (
                                <CustomSelect
                                    placeHolder={t("Payment Mode")}
                                    name="PaymentMode"
                                    onChange={(name, e) => { handleCustomInput(index, "PaymentMode", e) }}
                                    value={val?.PaymentMode?.value}
                                    option={[
                                        { label: "Credit", value: "4" },
                                        { label: "Cash", value: "1" },
                                    ]}
                                    isRemoveSearchable={true}
                                />
                            ),
                            AdvanceAmount: <Input
                                type="number"
                                className="table-input"
                                removeFormGroupClass={true}
                                name="advanceAmt"
                                placeholder=""
                                value={val.advanceAmt}
                                onChange={(e) => handleCustomInput(index, "advanceAmt", e.target.value)}
                            />,

                        }))
                        }

                        tableHeight={"scrollView"}
                    />
                </div>
                <div className="col-12  ">

                    <div className="">
                        <AutoComplete
                            suggestions={items}
                            completeMethod={(e) => { search(e) }}
                            onChange={(e) => setSelectedTerm(e.value)}
                            value={selectedTearm}
                            className="w-100 required-fields"
                            onSelect={(e) => handleSelectTearms(e.value)}
                            field="Terms"
                            id="Terms"
                            placeholder='Terms & Condition'
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (items.length > 0) {
                                        return
                                    } else {
                                        handleSelectTearms({ Terms: e?.target?.value });
                                    }// Trigger on Enter key manually
                                }
                            }}
                        // onBlur={() => { setValues((prev) => ({ ...prev, AccountType: "", AccountName: "" })) }}

                        />
                    </div>

                    <div className="mt-2">
                        {Array.isArray(selectedTearms) && selectedTearms.length > 0 ? (
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px' }}>#</th>
                                        <th>Terms</th>
                                        <th style={{ width: '60px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTearms.map((term, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{term.Terms}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemoveTerm(term)}
                                                    title="Remove"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No terms selected.</p>
                        )}
                    </div>

                </div>



            </div>

            <div className='w-100 d-flex justify-content-center'>
                <button
                    className="btn btn-sm btn-primary mx-1 px-4"
                    onClick={() => {
                        if (isEdit) {
                            updatePO()
                        } else {
                            SavePODraftDetails()
                        }
                    }
                    }
                >

                    {t("Save")}
                </button>
            </div>
        </div>
    )
}

export default SupplierAdvance

