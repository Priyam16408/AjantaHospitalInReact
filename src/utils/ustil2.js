import { toast } from "react-toastify";
import { number, ROUNDOFF_VALUE } from "./constant";
import moment from "moment";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { updateFileClosed } from "../networkServices/DoctorApi";
import { pharmecyAddItem } from "../networkServices/pharmecy";
import { handleCalculatePatientIssue, payloadSettlerForPaymentGateWay } from "./utils";
const isMobile = window.innerWidth <= 768;
const ip = useLocalStorage("ip", "get");
const userData = useLocalStorage("userData", "get");
const pageURL = window.location.pathname
export const speakMessage = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    const setFemaleVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        // Try to find a female voice based on common name patterns
        let femaleVoice = voices.find(voice =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("susan") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("zira") || // Windows
            (voice.gender && voice.gender.toLowerCase() === "female")
        );
        // Fallback to an English voice if no clear female voice is found
        if (!femaleVoice) {
            femaleVoice = voices.find(voice => voice.lang.toLowerCase().includes("en"));
        }
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        window.speechSynthesis.speak(utterance);
    };
    // If voices are not yet loaded, wait for them
    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setFemaleVoice;
    } else {
        setFemaleVoice();
    }
};
export const notify = (message, type = "success") => {
    if (type === "success") {
        // toast.success(message,{duration: 70000});
        toast.success(message, { autoClose: 3000 });
    } else if (type === "warn") {
        toast.warn(message, { autoClose: 3000 });
    } else if (type === "error") {
        toast.error(message, { autoClose: 3000 });
    }
};

export const CashPanel =
{
    "PanelName": "CASH",
    "PanelID": 1,
    "isDefaultPanel": 1,
    "PanelGroup": "CASH",
    "PanelGroupID": 1,
    "ParentPanelID": 0,
    "ParentPanel": "",
    "PanelCroporateID": 0,
    "CorporareName": "",
    "PolicyNo": "",
    "PolicyCardNo": "",
    "PanelCardName": "",
    "PolicyExpiry": "",
    "PolciyCardHolderRelation": "",
    "ApprovalAmount": "",
    "ApprovalRemarks": "",
    "panelCurrencyFactor": 1,
    "panelCurrencyCountryID": 14,
    "ReferenceCode": "1",
    "ReferenceCodeOPD": "1",
    "label": "CASH",
    "value": 1
}

const handleSumPaidAmt = (paymentMethod) => {
    let amount = 0
    paymentMethod.map((val) => {
        if (val?.PaymentModeID === 8) {
            amount += val?.Amount
        }
    })
    return amount
}

const CalculateTaxAmt = (qty, mrp, taxPer, disPer) => {
    let discAmt = mrp * disPer * 0.01
    let taxableAmt = ((mrp - discAmt) * 100 * qty) / (100 + taxPer)
    return (taxableAmt * taxPer) * 0.01.toFixed(4)
}


export const SavePharmecyAPIPayload = (pDetails, hashcode, itemList, values, BindResource, paymentDetails, paymentMethod, packageData) => {
    debugger
    // console.log("pDetails", pDetails)
    // console.log("itemList", itemList)
    // console.log("values", values)
    // console.log("BindResource", BindResource)
    // console.log("paymentDetails", paymentDetails)
    // console.log("paymentMethod", paymentMethod)
    let PaymentModeID = true
    if (paymentMethod?.length > 0 && paymentMethod[0]?.PaymentModeID === 4) { // checking payment method credit mode as per shiv sir  chnage by anand 
        PaymentModeID = false
    } else {
        PaymentModeID = true
    }


    let isCommonDis = itemList?.reduce((ac, current) => ac + Number(current?.DisPer ? current?.DisPer : "0"), 0)
    if (isCommonDis === 0 || Number(paymentDetails?.discountPercentage) > 0) {
        let updatedList = itemList?.map((val) => {
            val.DisPer = paymentDetails?.discountPercentage
            let calculatedData = handleCalculatePatientIssue(val, "DisPer")
            return calculatedData;
        })
        itemList = [...updatedList]
    }


    const { type, Panel, Doctor } = values
    debugger
    let pmh = {
        "patientID": String(type?.value == 2 ? "CASH002" : pDetails?.PatientID ? pDetails?.PatientID : ""),
        "doctorID": String(type?.value == 2 ? BindResource?.DoctorID_Self : values?.Doctor?.value ? values?.Doctor?.value : "0"),
        "patient_type": "",
        "panelID": Number(Panel?.PanelID ? Panel?.PanelID : 1),
        // "parentID": Number(type?.value == 2 ? 1 : Panel?.ParentPanelID === 0 ? Panel?.PanelID : Panel?.ParentPanelID),
        "referedBy": String(type?.value == 2 ? Doctor?.value : 0),
        "hashCode": String(hashcode ? hashcode : ""),
        "panelPaybleAmt": Number(paymentDetails?.panelPayable ? paymentDetails?.panelPayable : 0),
        "patientPaybleAmt": Number(paymentDetails?.minimumPayableAmount ? paymentDetails?.minimumPayableAmount : 0),
        "panelPaidAmt": handleSumPaidAmt(paymentMethod),
        "patientPaidAmt": Number(paymentDetails?.paidAmount ? paymentDetails?.paidAmount : 0) - handleSumPaidAmt(paymentMethod),
        "cardNo": String(Panel?.PolicyCardNo ? Panel?.PolicyCardNo : ""),
    }
    let lt = {
        "ipNo": String(pDetails?.TransactionID ? pDetails?.TransactionID : ""),
        "netAmount": Number(paymentDetails?.netAmount ? paymentDetails?.netAmount : 0),
        "grossAmount": Number(paymentDetails?.billAmount ? paymentDetails?.billAmount : 0),
        "discountOnTotal": Number(paymentDetails?.discountAmount ? paymentDetails?.discountAmount : 0),
        "discountReason": Number(paymentDetails?.discountAmount) > 0 ? String(paymentDetails?.discountReason ? paymentDetails?.discountReason : "") : "",
        "discountApproveBy": Number(paymentDetails?.discountAmount) > 0 ? String(paymentDetails?.discountApproveBy ? paymentDetails?.discountApproveBy : "") : "",
        "adjustment": Number(paymentDetails?.paidAmount ? paymentDetails?.paidAmount : 0),
        "roundOff": String(paymentDetails?.roundOff ? paymentDetails?.roundOff : "0"),
        "remarks": String(paymentDetails?.Remark ? paymentDetails?.Remark : ""),
        "currentAge": String(type?.value == 2 ? `${values?.Age} ${values?.AgeType?.value}` : pDetails?.AgeGender.split("/")[0])
    }

    let ltd = []
    let salesDetails = []
    let patientMedicineData = []
    let draftMedicineData = []
    let clinicalTrial = []
    let paymentDetail = payloadSettlerForPaymentGateWay(paymentMethod)

    itemList?.map((val) => {
        // ltd
        let ltdObj = {
            "itemName": `${val?.ItemName} (Batch : ${val?.BatchNumber})`,
            "type_ID": String(val?.Type_ID ? val?.Type_ID : "0"),
            "doctorID": String(type?.value == 2 ? BindResource?.DoctorID_Self : values?.Doctor?.value ? values?.Doctor?.value : "0"),
            "subCategoryID": String(val?.SubCategoryID ? val?.SubCategoryID : "0"),
            "amount": Number(val?.Amount)?.toFixed(6),
            "rate": Number(val?.MRP)?.toFixed(6),
            "quantity": Number(val?.Quantity ? val?.Quantity : "0")?.toFixed(6),
            "discAmt": Number(val?.discountAmount ? val?.discountAmount : "0")?.toFixed(6),
            "discountPercentage": Number(val?.DisPer ? val?.DisPer : "0")?.toFixed(6),
            "itemID": String(val?.ItemID),

            "discountReason": Number(val?.DisPer ? val?.DisPer : "0") > 0 ? String(paymentDetails?.discountReason ? paymentDetails?.discountReason : "") : "",

            "coPayPercent": val?.discountCoPay?.IsPayble === '0' ? pDetails?.PatientType === "IPD" ? Number(val?.discountCoPay?.IPDCoPayPercent) : Number(val?.discountCoPay?.OPDCoPayPercent) : 0,

            "isPayable": Number(Panel?.PanelID ? Panel?.PanelID : 1) === 1 ? 0 : Number(val?.discountCoPay?.IsPayble ? val?.discountCoPay?.IsPayble : 0),

            "isPanelWiseDisc": (Number(Panel?.PanelID ? Panel?.PanelID : 1) === 1 ? 0 : pDetails?.PatientType === "IPD" ? Number(val?.discountCoPay?.IPDPanelDiscPercent) : Number(val?.discountCoPay?.OPDPanelDiscPercent)) > 0 ? 1 : 0,

            "stockID": String(val?.stockid ? val?.stockid : "0"),
            "netItemAmt": Number(val?.Amount).toFixed(6),
            "toBeBilled": Number(val?.ToBeBilled ? val?.ToBeBilled : 0),
            "isReusable": String(val?.IsUsable ? val?.IsUsable : ""),
            "medExpiryDate": String(val?.MedExpiryDate),
            "batchNumber": String(val?.BatchNumber ? val?.BatchNumber : ""),
            "purTaxPer": Number(val?.PurTaxPer ? val?.PurTaxPer : "0"),
            "purTaxAmt": CalculateTaxAmt(Number(val?.Quantity), val?.UnitPrice, val?.PurTaxPer, Number(val?.DisPer)),
            "unitPrice": Number(val?.UnitPrice ? val?.UnitPrice : "0"),
            "igstPercent": Number(val?.IGSTPercent ? val?.IGSTPercent : "0"),
            "cgstPercent": Number(val?.CGSTPercent ? val?.CGSTPercent : "0"),
            "sgstPercent": Number(val?.SGSTPercent ? val?.SGSTPercent : "0"),
            "hsnCode": String(val?.HSNCode ? val?.HSNCode : ""),
            "isDischargeMedicine": Number(values?.DisMed?.value ? values?.DisMed?.value : 0),
        }
        ltd.push(ltdObj)

        // salesDetails
        let salesDlsObj = {
            "pName": String(type?.value == 2 ? `${values?.title?.value} ${values?.Name}` : pDetails?.PName),
            "age": String(type?.value == 2 ? `${values?.Age} ${values?.AgeType?.value}` : pDetails?.AgeGender.split("/")[0]),
            "address": String(type?.value == 2 ? values?.Address ? values?.Address : "" : pDetails?.Address),
            "gender": String(type?.value == 2 ? `${values?.Gender?.value}` : pDetails?.AgeGender.split("/")[1]),
            "contactNo": String(type?.value == 2 ? values?.ContactNo ? values?.ContactNo : "" : pDetails?.ContactNo),
            "perUnitSellingPrice": Number(val?.MRP),
            "indentNo": String(val?.IndentNo),
            "gstType": String(val?.GSTType ? val?.GSTType : ""),
            "taxPercent": Number(val?.PurTaxPer ? val?.PurTaxPer : 0),
            "draftDetailID": Number(val?.draftID ? val?.draftID : "")
        }
        salesDetails.push(salesDlsObj)

        // patientMedicineData
        let patMedObj = { "patientMedicine_ID": Number(val?.patientMedicine ? val?.patientMedicine : 0) }
        patientMedicineData.push(patMedObj)

        // draftMedicineData
        let DraftMedDataObj = {
            "draftDetailID": Number(val?.draftID ? val?.draftID : ""),
            "receiveQty": Number(val?.Quantity ? val?.Quantity : "0")
        }
        draftMedicineData.push(DraftMedDataObj)

        // clinicalTrial
        if (val?.isClinicalTrial) {
            let clinicalTrialObj = {
                "itemID": String(val?.ItemID),
                "remarks": String(val?.ClinicalRemark ? val?.ClinicalRemark : "")
            }
            clinicalTrial.push(clinicalTrialObj)
        }

    })


    let finalobj = {
        "patientType": String(type?.value),
        "deptLedgerNo": userData?.deptLedgerNo,
        "contactNo": String(pDetails?.ContactNo ? pDetails?.ContactNo : ""),
        "pName": String(pDetails?.PName ? pDetails?.PName : ""),
        "isOtPatient": 0,
        "isIPDInCash": PaymentModeID,
        "isDischargeMedicine": Number(values?.DisMed?.value ? values?.DisMed?.value : 0),
        "pageURL": pageURL,
        "ipAddress": ip,
        "verifiedUserID": userData?.employeeID,
        "pkgd": {
            // "ledgerTransactionNo": packageData?.length > 0 ? packageData[0]?.LedgerTransactionNo : "",
            // "packageId": packageData?.length > 0 ? packageData[0]?.PackageID : "",
            // "transactionId": packageData?.length > 0 ? packageData[0]?.TransactionID : "",
            // "doctorID": packageData?.length > 0 ? packageData[0]?.doctorID : "",
            // "ledgerTnxId": packageData[0]?.LedgerTnxId ? packageData[0]?.LedgerTnxId : "",
            // "packageAmt": packageData ? [0]?.NetAmount ? packageData[0]?.NetAmount : 0,
            // "packageType": packageData[0]?.TYPE ? packageData[0]?.TYPE : "",

            ledgerTransactionNo: packageData?.[0]?.LedgerTransactionNo || "",
            packageId: packageData?.[0]?.PackageID || "",
            transactionId: packageData?.[0]?.TransactionID || "",
            doctorID: packageData?.[0]?.doctorID || "",
            ledgerTnxId: packageData?.[0]?.LedgerTnxId || "",
            packageAmt: packageData?.[0]?.NetAmount || 0,
            packageType: packageData?.[0]?.TYPE || "",
        },
        pmh: pmh,
        lt: lt,
        ltd: ltd,
        salesDetails: salesDetails,
        paymentDetail: paymentDetail,
        patientMedicineData: patientMedicineData,
        draftMedicineData: draftMedicineData,
        clinicalTrial: clinicalTrial
    }
    console.log("isIPDInCash", paymentDetail)
    return finalobj
}

export const DraftPharmecyAPIPayload = (pDetails, itemList, values, BindResource) => {

    console.log("pDetails", pDetails)
    console.log("itemList", itemList)
    console.log("values", values)

    const { type, Panel, Doctor } = values
    let draftDetails = {
        // "id": 0,
        "patientID": String(type?.value == 2 ? "CASH002" : pDetails?.PatientID ? pDetails?.PatientID : ""),
        "pFirstName": String(type?.value == 2 ? `${values?.title?.value} ${values?.Name}` : pDetails?.PName),
        "pLastName": String(type?.value == 2 ? `${values?.title?.value} ${values?.Name}` : pDetails?.PName),
        "pName": String(type?.value == 2 ? `${values?.title?.value} ${values?.Name}` : pDetails?.PName),
        "panelID": String(Panel?.PanelID ? Panel?.PanelID : 1),
        "title": String(type?.value == 2 ? `${values?.title?.value}` : pDetails?.Title),
        "age": String(type?.value == 2 ? `${values?.Age} ${values?.AgeType?.value}` : pDetails?.AgeGender.split("/")[0]),
        "mobile": String(type?.value == 2 ? values?.ContactNo ? values?.ContactNo : "" : pDetails?.ContactNo),
        "email": "",
        "doctorID": String(type?.value == 2 ? BindResource?.DoctorID_Self : pDetails?.DoctorID ? pDetails?.DoctorID : "0"),
        "address": String(type?.value == 2 ? values?.Address ? values?.Address : "" : pDetails?.Address),
        "centreID": userData?.centreID
    }

    let draftItemDetails = []
    itemList?.map((val, index) => {
        let obj = {
            // "id": Number(val?.ItemID),
            "draftID": Number(val?.draftID ? val?.draftID : 0),
            "itemID": String(val?.ItemID),
            "discountpercent": Number(val?.DisPer ? val?.DisPer : 0),
            "stockID": String(val?.stockid ? val?.stockid : "0"),
            "quantity": Number(val?.Quantity ? val?.Quantity : "0")
        }
        draftItemDetails.push(obj)
    })

    return { draftDetails: draftDetails, draftItemDetails: draftItemDetails }
}


export const ReturnPayload = (itemList, paymentMethod, paymentDetails, values, hashcode) => {
    console.log("itemList", itemList)
    console.log("paymentMethod", paymentMethod)
    console.log("paymentDetails", paymentDetails)
    console.log("values", values)

    let { Patient_Type, ReceiptNo, PatientID, MRP, returnQty, ItemID, Type_ID, GSTType, ItemName, SubCategoryID, DiscountPercentage, IGSTPercent, CGSTPercent, SGSTPercent, IsPackage, TaxPercent, PerUnitBuyPrice, StockID, BillNo, IsUsable, ToBeBilled, MedExpiryDate, IsExpirable, HSNCode, LedgerTransactionNo, CustomerID, IPNo, BatchNumber } = { ...itemList[0] }

    let pmh = []
    let lt = []
    let ltd = []

    itemList?.map((val, index) => {
        if (index === 0) {
            let pmhObj = {
                "patientID": String(val?.PatientID ? val?.PatientID : ""),
                "panelID": Number(val?.PanelID ? val?.PanelID : 1),
                "hashCode": hashcode
            }
            pmh.push(pmhObj)

            let ltObj = {
                "grossAmount": Number(paymentDetails?.billAmount ? paymentDetails?.billAmount : 0),
                "discountOnTotal": Number(paymentDetails?.discountAmount ? paymentDetails?.discountAmount : 0),
                "netAmount": Number(paymentDetails?.netAmount ? paymentDetails?.netAmount : 0),
                "adjustment": Number(paymentDetails?.paidAmount ? paymentDetails?.paidAmount : 0),
                "discountReason": Number(paymentDetails?.discountAmount) > 0 ? String(paymentDetails?.discountReason ? paymentDetails?.discountReason : "") : "",
                "discountApproveBy": Number(paymentDetails?.discountAmount) > 0 ? String(paymentDetails?.discountApproveBy ? paymentDetails?.discountApproveBy : "") : "",
                "roundOff": String(paymentDetails?.roundOff ? paymentDetails?.roundOff : "0"),
                "uniqueHash": hashcode,
                "isCancel": "0",
                "remarks": String(paymentDetails?.Remark ? paymentDetails?.Remark : ""),
                "govTaxAmount": 0,
                "govTaxPer": 0,
                "refund_Against_BillNo": String(BillNo ? BillNo : ''),
                "ipNo": String(IPNo ? IPNo : ""),
                "patientType": String(Patient_Type ? Patient_Type : "")
            }
            lt.push(ltObj)
        }
        if (val?.returnQty !== 0) {
            let ltdobj = {
                "rate": Number(MRP ? MRP : 0),
                "quantity": Number(returnQty ? returnQty : 0),
                "itemID": ItemID,
                "type_ID": String(Type_ID ? Type_ID : 0),
                "gstType": String(GSTType ? GSTType : ""),
                "itemName": String(ItemName ? ItemName : ""),
                "subCategoryID": String(SubCategoryID ? SubCategoryID : 0),
                "discountPercentage": Number(DiscountPercentage),
                "igstPercent": Number(IGSTPercent ? IGSTPercent : 0),
                "cgstPercent": Number(CGSTPercent ? CGSTPercent : 0),
                "sgstPercent": Number(SGSTPercent),
                "isPackage": Number(IsPackage ? IsPackage : 0),
                "taxPercent": Number(TaxPercent ? TaxPercent : 0),
                "unitPrice": Number(PerUnitBuyPrice ? PerUnitBuyPrice : 0),
                "purTaxPer": Number(TaxPercent ? TaxPercent : 0),
                "stockID": String(StockID ? StockID : 0),
                "batchNumber": String(BatchNumber ? BatchNumber : ""),
                "isReusable": String(IsUsable ? IsUsable : ""),
                "toBeBilled": Number(ToBeBilled ? ToBeBilled : 0),
                "medExpiryDate": String(MedExpiryDate),
                "isExpirable": String(IsExpirable ? IsExpirable : 0),
                "hsnCode": String(HSNCode ? HSNCode : ""),
                "ledgerTransactionNo": String(LedgerTransactionNo ? LedgerTransactionNo : "0"),
                "refund_Against_BillNo": String(BillNo ? BillNo : "")
            }
            ltd.push(ltdobj)
        }
    })

    let paymentDetail = payloadSettlerForPaymentGateWay(paymentMethod)

    let paylaod = {
        "patientType": Patient_Type ? Patient_Type : "",
        "ledgerno": LedgerTransactionNo ? LedgerTransactionNo : "",
        "receiptNo": ReceiptNo ? ReceiptNo : "",
        "customerID": CustomerID ? CustomerID : "",
        "ipAddress": ip,
        "pageURL": pageURL,
        "pmh": pmh,
        "lt": lt,
        "ltd": ltd,
        "paymentDetail": paymentDetail
    }

    return paylaod
}

export const ReturnIPDPayload = (itemList, paymentMethod, paymentDetails, values) => {

    let returnItem = []

    console.log("itemList", itemList)
    console.log("paymentMethod", paymentMethod)
    console.log("paymentDetails", paymentDetails)
    console.log("values", values)

    itemList?.filter((val) => Number(val?.returnQty) > 0)?.map((val) => {
        // if (Number(val?.returnQty) > 0) {
        const { ID, ItemID, SubCategoryID, StockID, ItemName, IsPackage, PackageID, Type_ID, ToBeBilled, ServiceItemID, IsVerified, IsExpirable, MedExpiryDate, BatchNumber, returnQty, RejectQty, LedgerNumber, Amount, MRP, SaleTaxPercent, UnitPrice, PurTaxPer, IGSTPercent, CGSTPercent, SGSTPercent, HSNCode, GSTType } = { ...val }
        let obj = {
            "id": String(ID),
            "itemID": String(ItemID ? ItemID : 0),
            "subCategoryID": String(SubCategoryID ? SubCategoryID : "0"),
            "stockID": String(StockID ? StockID : ""),
            "itemName": String(ItemName ? ItemName : ""),
            "isPackage": String(IsPackage ? IsPackage : ""),
            "packageID": String(PackageID ? PackageID : ""),
            "type_ID": String(Type_ID ? Type_ID : ""),
            "toBeBilled": String(ToBeBilled ? ToBeBilled : ""),
            "serviceItemID": String(ServiceItemID ? ServiceItemID : ""),
            "isVerified": String(IsVerified ? IsVerified : ""),
            "isExpirable": String(IsExpirable ? IsExpirable : ""),
            "medExpiryDate": String(MedExpiryDate),
            "batchNumber": String(BatchNumber),
            "retQty": String(returnQty ? returnQty : "0"),
            "rejectQty": String(RejectQty ? RejectQty : "0"),
            "billNo": "",//ise nhi bhejna hai
            "ledgerNumber": String(LedgerNumber),
            "amount": Number(Amount),
            "mrp": Number(MRP),
            "taxPercent": Number(SaleTaxPercent),
            "unitPrice": String(UnitPrice),
            "purTaxPer": String(PurTaxPer),
            "igstPercent": String(IGSTPercent ? IGSTPercent : "0"),
            "cgstPercent": String(CGSTPercent ? CGSTPercent : "0"),
            "sgstPercent": String(SGSTPercent ? SGSTPercent : "0"),
            "hsnCode": String(HSNCode ? HSNCode : ""),
            "gstType": String(GSTType ? GSTType : "")
        }
        returnItem.push(obj)
        // }
    })

    const { Title, PName, Age, Address, Gender, contactNo, PatientID, TransactionID, patient_type, PanelID, IPDCaseTypeID, RoomID } = { ...itemList[0] }

    let payload = {
        "pName": PName.split(Title)[1],
        "age": Age,
        "address": String(Address ? Address : ""),
        "gender": String(Gender ? Gender : ""),
        "contactNo": String(contactNo ? contactNo : ""),
        "transactionNo": TransactionID,
        "patientID": PatientID,
        "indentNumber": "",
        "indent_Dpt": "",
        "patient_Type": patient_type,
        "panelID": String(PanelID ? PanelID : 1),
        "roomID": Number(RoomID ? RoomID : "0"),
        "caseTypeID": Number(IPDCaseTypeID ? IPDCaseTypeID : ""),
        "ipAddress": ip,
        "pageUrl": pageURL,
        "returnItem": returnItem
    }
    return payload
}
export const PharmacyFinalSettlementPayload = (itemList, paymentMethod, paymentControl, values, hashCode) => {

    let paymentDetail = payloadSettlerForPaymentGateWay(paymentMethod)
    console.log("itemList", itemList)
    console.log("paymentControl", paymentControl)
    console.log("values", values)

    let dataOPDDiscount = []
    itemList?.map((val) => {
        let obj = {
            "netAmount": Number(val?.PendingAmt),
            "discountReason": "",
            "discountApproveBy": "",
            "discountOnTotal": 0,
            "roundOff": Number(paymentControl?.roundOff),
            "adjustment": Number(paymentControl?.paidAmount),
            "discAmt": 0,
            "discountPercentage": 0
        }
        dataOPDDiscount.push(obj)
    })
    let { IsNewPatient, FeesPaid, TypeOfTnx, PanelID, TransactionID, PatientID, LedgerTransactionNo, PendingAmt } = itemList[0]
    let payload = {
        "dataPaymentDetail": paymentDetail,
        "dataOPDDiscount": dataOPDDiscount,
        "hashCode": hashCode,
        "amountPaid": String(paymentControl?.paidAmount),
        "patientID": String(PatientID),
        "transactionID": String(TransactionID),
        "ledgerTranNo": String(LedgerTransactionNo),
        "naration": String(paymentControl?.Remark ? paymentControl?.Remark : ""),
        "panelID": Number(PanelID ? PanelID : ''),
        "isRefund": PendingAmt >= 0 ? "0" : "1",
        "netAmount": String(PendingAmt),
        "advanceAmt": Number(0),
        "typeOfTnx": String(TypeOfTnx ? TypeOfTnx : ""),
        "feePaid": String(FeesPaid ? FeesPaid : ""),
        "isNewPatient": Number(IsNewPatient ? IsNewPatient : "0"),
        "centreId": Number(userData?.defaultCentre),
        "ipAddress": ip
    }

    return payload

}


export function buildHierarchyTree(data, keys) {
    // console.log('aaa',data)
    let map = new Map(); // Store all nodes
    let rootNodes = [];  // Store root nodes

    // Create a map of all nodes
    data.forEach(item => {
        let node = {
            id: item.GroupCode,
            groupName: item.GroupName,
            // ParentID: item.ParentID,
            children: []
        };
        if (keys?.length > 0) {
            keys?.map((val) => {
                node[val] = item[val]
            })
        }
        map.set(item.GroupCode, node);
    });

    // Organize hierarchy
    data.forEach(item => {
        let parentId = item?.GroupCode?.length > 3 ? item?.GroupCode?.slice(0, -3) : null;
        if (parentId && map.has(parentId)) {
            map?.get(parentId).children.push(map?.get(item?.GroupCode));
        } else {
            rootNodes.push(map?.get(item.GroupCode));
        }
    });

    return rootNodes;
}

export const FinanceSaveVoucherPayload = (bodyData, amounts, values) => {
    console.log("bodyData", bodyData)
    console.log("amounts", amounts)
    console.log("values", values)
    const finEntryDetail = []
    const finEntryCCDetail = []
    const finMPALists = []

    bodyData.map((val, index) => {
        console.log("Ssssss", val)

        let fDetail = {
            "coaid": Number(val?.ValueField) || Number(val?.COAID),
            "accountName": val?.AccountName ? val?.AccountName : 0,
            "amountBase": (values?.ConversionFactor * val?.Amount) > 0 ? (values?.ConversionFactor * val?.Amount) : 0,
            "amountSpecific": Number(val?.Amount),
            "balType": String(val?.balanceType?.value),
            "documentDate": String(val?.InvoiceDate ? moment(val?.InvoiceDate).format("YYYY-MM-DD") : "0001-01-01"),
            "documentNo": String(val?.InvoiceNumber ? val?.InvoiceNumber : ""),
            "remarks": String(val?.Remark ? val?.Remark : ""),
            "adjustmentBaseAmount": 0,//done
            "adjustmentSpecificAmount": 0,//done
            "vatAmt": Number(val?.TaxAmount ? val?.TaxAmount : 0),
            "isPDC": Number(val?.RefDate ? new Date(val?.RefDate) > new Date() ? 1 : 0 : 0),
            "refNo": String(val?.Refnumber ? val?.Refnumber : ""),
            "refDate": val?.RefDate ? moment(val?.RefDate).format("YYYY-MM-DD") : "0001-01-01",
            "paymentModeID": Number(val?.PaymentMode?.value ? val?.PaymentMode?.value : 4),
            "paymentMode": String(val?.PaymentMode?.label ? val?.PaymentMode?.label : "Credit"),
            "bankCode": "",//pending
            "branchCode": "",//pending
            "receiptMode": ["BP", "CP", "BR", "CR", "CV", "BT"].includes(values?.VoucherType?.value) ? "I" : "",
            "billNo": String(val?.InvoiceNumber ? val?.InvoiceNumber : ""),
            "billDate": String(val?.InvoiceDate ? moment(val?.InvoiceDate).format("YYYY-MM-DD") : "0001-01-01"),
            "pdcDate": val?.RefDate ? new Date(val?.RefDate) > new Date() ? moment(val?.RefDate).format("YYYY-MM-DD") : "0001-01-01" : "0001-01-01",
            "entryDetailID": 0,//Done
            "isBankCharges": 0,//DOne
            "pendingVatAmt": 0,//DOne
            "adjustTaxAmount": 0,//DOne
            "branchCentreID": Number(val?.branchCentre?.value ? val?.branchCentre?.value : 0),//"Number 	Branch Centre table value",
            "departmentCode": String(val?.Department?.value ? val?.Department?.value : ""),// "string  	department table value",
            "isCheckBounce": 0,
            "oldVoucherNo": "",
            "currencyCode": String(values?.Currency.value ? values?.Currency.value : ""),
            "transCurrFactor": Number(values?.ConversionFactor),
            "actualCurrFactor": Number(values?.Actual),
            "pcEntryID": 0,
            "pcEntryNo": "",
            "pcEntryDate": "0001-01-01",
            "pettyCashCOAID": 0,
            "expenseTypeCode": "",
            "requestAmount": 0


        }
        finEntryDetail.push(fDetail);
        if (val?.ccList?.length > 0) {
            val.ccList?.map((ccDetail, ind) => {
                let fCDetail = {
                    "mainSNo": Number(index + 1),
                    "departmentCode": String(val?.Department?.value ? val?.Department?.value : ""),
                    "reqAreaCode": String(ccDetail?.RequirementArea?.value),
                    "costCentreCode": String(ccDetail?.CostCentre?.value),
                    "departmentName": String(ccDetail?.Department?.label),
                    "reqAreaName": String(ccDetail?.RequirementArea?.label),
                    "costCentreName": String(ccDetail?.CostCentre?.label),
                    "amount": Number(ccDetail?.ccAmount),
                    "autoSRNo": Number(ind + 1)
                }
                finEntryCCDetail.push(fCDetail);
            })
        }
        if (val?.mapList?.length > 0) {
            val.mapList?.map((mapDetail, ind) => {
                const details = mapDetail?.VoucherNo?.value?.split("#")
                let fMDetail = {
                    "mainSNo": Number(index + 1),
                    "entryDetailsID": String(details[0]),
                    "coaid": String(details[3]),
                    "voucherNo": String(details[2]),
                    "amount": Number(mapDetail?.advAmount),
                    "autoSRNo": Number(ind + 1)
                }
                finMPALists.push(fMDetail);
            })
        }

    })

    debugger
    return {
        "voucherType": String(values?.VoucherType.value ? values.VoucherType.value : ""),
        "currencyCode": String(values?.Currency.value ? values?.Currency.value : ""),
        "conversionFactorTrans": Number(values?.ConversionFactor),
        "conversionFactorActual": Number(values?.Actual),
        "voucherDate": String(values?.VoucherDate ? moment(values?.VoucherDate).format("YYYY-MM-DD") : ""),
        "departmentCode": "",
        "projectCode": String(values?.ProjectName?.value ? values?.ProjectName.value : ""),
        "entryType": 0,
        "isUpdate": values?.isEdit ? 1 : 0,
        "voucherNo": values?.VoucherNumber ? values?.VoucherNumber : values?.voucherNumber,
        "ipAddress": String(ip),
        "macAddress": "",
        "pageURL": String(pageURL),
        "documentBase64": values?.documentBase64 ? values?.documentBase64 : "",
        "finEntryDetail": finEntryDetail,
        "finEntryCCDetail": finEntryCCDetail,
        "finMPALists": finMPALists
    }
}
export function formatAmount(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

export function SaveUpdateCentrePayload(values, data) {
    const { CentreName, CentreCode, Website, ContactNo, LandlineNo, EmailAddress, DiscountType, Address, Latitude, Longitude, Active, FollowIPDNo, printBarcode } = values
    return {
        "centerID": values?.CentreID ? values?.CentreID : 0,
        "centreName": CentreName ? CentreName : "",
        "centreCode": CentreCode ? CentreCode : "",
        "website": Website ? Website : "",
        "mobileNo": ContactNo ? ContactNo : "",
        "landlineNo": LandlineNo ? LandlineNo : "",
        "emailID": EmailAddress ? EmailAddress : "",
        "discountType": DiscountType?.value ? DiscountType?.value : "0",
        "address": Address ? Address : "",
        "latitude": Latitude ? Latitude : "",
        "longitude": Longitude ? Longitude : "",
        "labBarcodeAbbre": "",
        "isActive": Active?.value ? Number(Active?.value) : 0,
        "isDefault": 0,
        "followedcenter": 0,
        "self": Number(FollowIPDNo?.value),
        "initialCharr": "",
        "printBarcode": Number(printBarcode ? printBarcode : 0),
        "textPrintBarcode": printBarcode ? printBarcode : "",
        "isNablCenter": 0,
        "isCap": 0
    }
}
export const handleSaveCentrePayload = (bodyData, data, type) => {
    let mappedItems = []
    bodyData?.forEach((item) => {
        if (item[type]?.ValueField && item[type]?.isChecked) {
            const { ValueField, IsPatientIndent, IsDepartmentIndent } = item[type]
            mappedItems.push({
                "centreID": Number(data?.CentreID),
                "valueField": String(ValueField ? ValueField : ""),
                "createdBy": "",
                "email": "",
                "contactPerson": "",
                "isPatientIndent": String(IsPatientIndent ? IsPatientIndent : "0"),
                "isDepartmentIndent": String(IsDepartmentIndent ? IsDepartmentIndent : "0"),
            })
        }
    })
    return {
        "centreID": Number(data?.CentreID),
        "mappedItems": mappedItems
    }
}

export const CentreWiseItemPayload = (value) => {
    let { center, Category, SubCategory, ItemName, ItemCreationFrom, ItemType } = value

    return {
        "centerID": Number(center?.value ? center?.value : 0),
        "departMentLedgerNo": "0",
        "categoryID": Number(Category?.value),
        "subCategoryID": Number(SubCategory?.value),
        "itemName": String(ItemName ? ItemName : ""),
        "manufactureID": [],
        "date": "",
        "centreName": center?.label,
        "itemType": ItemType?.value,
        "groupId": 0
    }

}
export const CentreWiseItemSavePayload = (value, bodyData) => {

    let mappedItems = []
    bodyData?.map((val) => {
        const { ItemID, departMentLedgerNo, MaxLevel, MinLevel, ReorderLevel, ReorderQty, MaxReorderQty, MinReorderQty, MajorUnit, Discount, ConversionFactor, MinorUnit, SubCategoryID, IsActive, Rack, centerID, CentreName, Shelf, LoyalityCategoryID } = val
        let obj = {
            "id": 0,
            "itemid": ItemID,
            "deptledgerno": String(departMentLedgerNo),
            "maxlevel": Number(MaxLevel),
            "minlevel": Number(MinLevel),
            "reorderlevel": Number(ReorderLevel),
            "reorderqty": Number(ReorderQty),
            "maxreorderqty": Number(MaxReorderQty),
            "minreorderqty": Number(MinReorderQty),
            "majorunit": MajorUnit,
            "minorunit": MinorUnit,
            "conversionfactor": Number(ConversionFactor),
            "discount": Number(Discount),
            "subcategoryid": SubCategoryID,
            "isactive": IsActive,
            "ipaddress": ip,
            "rack": Rack,
            "loyalityCategoryID": Number(LoyalityCategoryID ? LoyalityCategoryID : 0),
            "shelf": Shelf,
            "centreid": centerID,
            "centreName": CentreName
        }
        mappedItems.push(obj)
    })

    return mappedItems

}

export const SaveEDPSetRatePayload = (value, bodyData) => {

    let gridEditIPD = []
    let gridEditOPD = []
    if (value?.type?.value === "OPD") {
        gridEditIPD = [
            {
                "selectOne": false,
                "plus2": "",
                "cnameIPD": "",
                "configID": 0,
                "ipdRate": 0
            }
        ]
    } else {
        gridEditOPD = [
            {
                "selectOne": false,
                "plus": "",
                "cname": "",
                "opdRate": 0
            }
        ]
    }

    if (value?.type?.value === "OPD") {
        gridEditOPD = []
        bodyData?.filter((item) => item?.isChecked)?.map((val) => {
            let obj = {
                "selectOne": true,
                "plus": val?.ipdType?.value,
                "cname": val?.DisplayName,
                "opdRate": 0
            }
            gridEditOPD.push(obj)
        })
    } else {
        gridEditIPD = []
        bodyData?.filter((item) => item?.isChecked)?.map((val) => {
            let obj = {
                "selectOne": true,
                "plus": val?.ipdType?.value,
                "cname": val?.DisplayName,
                "opdRate": 0
            }
            gridEditIPD.push(obj)
        })
    }
    return {
        "editOPD": value?.type?.value === "OPD" ? true : false,
        "editIPD": value?.type?.value === "IPD" ? true : false,
        "copyTo": String(value?.CopyTo?.value ? value?.CopyTo?.value : ""),
        "copyToCentre": Number(value?.CopyTo?.value ? value?.CopyTo?.value : 0),
        "copyFrom": Number(value?.CopyFrom?.value ? value?.CopyFrom?.value : 0),
        "gridEditOPD": gridEditOPD,
        "gridEditIPD": gridEditIPD
    }

}

export const EDPSetItemRatePayload = (values, bodyData) => {
    let setItemRateOPD = []
    let setItemRateIPD = []

    bodyData?.map((val) => {
        let obj = {
            "itemID": val?.ItemID,
            "rateCurrency": val?.RateCurrencyCountryID,
            "rate": Number(val?.Rate ? val?.Rate : "0"),
            "itemDisplay": "Update",
            "itemCode": val?.ID ? val?.ID : "",
            "active": 1,
        }
        if (values?.department?.value === "0") {
            obj.itemNameOPD = val?.ItemName ? val?.ItemName : ""
            obj.applyIPD = val?.applyIPD
            setItemRateOPD.push(obj)
        } else {
            obj.caseTypeID = 0
            obj.itemNameIPD = val?.ItemName ? val?.ItemName : ""
            setItemRateIPD.push(obj)
        }
    })

    return {
        "panelID": 1,
        "scheduleChargeID": 1,
        "centreID": "1,4",
        "dept": 0,
        "ipAddress": ip,
        "allRoom": true,
        "caseType": 0,
        "setItemRateOPD": setItemRateOPD,
        "setItemRateIPD": setItemRateIPD
    }
}


export const updateRoleEDPPayload = (value, tableData) => {
    console.log("Asd", value, tableData)
    const { roleID, RoleName, DeptLedgerNo, IsDepartment, IsUniversalFormat, Medical, General } = value

    let roleDetail = tableData?.map((val) => {
        return {
            "roleID": Number(roleID),
            "roleName": RoleName,
            "departmentLedgerNumber": DeptLedgerNo,
            "isDepartment": Number(IsDepartment?.value),
            "isUniversal": Number(IsUniversalFormat?.value ? IsUniversalFormat?.value : "0"),
            "isUniversalType": Number(val?.Is_Universal ? 1 : 0),
            "menuFor": "string",// ASK
            "isStore": 0, // ASK
            "isGeneral": Number(General?.value),
            "isMedical": Number(Medical?.value),
            "typeName": "string",
            "formatID": 0,// ASK
            "initialCharacter": "string",// ASK
            "finYear": "string",// ASK
            "chkFinancialYear": 0,
            "separator1": "string",
            "separator2": "string",
            "length": "string",
            "formatPreview": "string",
            "menuForText": "string",
            "textLength": "string"
        }
    })

    return {
        "roleDetail": roleDetail,
        "formatDetail": []
    }
}

export const handlePanelSavePayload = (value) => {


    const { panelName, Addressone, Addresstwo, contactPerson, panelID, rateType, emailId, contactNo, phoneNo, faxNo, creditlimits, validto, validfrom, paymentMode, groupType, hideRate, showPrintout, CoPaymentOn, copayments, billCurrency, rateCurrency, CurrencyConv, coverNote } = value

    return {
        "companyName": panelName ? panelName : "",
        "add1": Addressone ? Addressone : "",
        "add2": Addresstwo ? Addresstwo : "",
        // "hospitalID": panelName ? panelName : "",
        // "panelCode": panelName ? panelName : "",
        // "referenceCode": panelName ? panelName : "",
        // "isTPA": panelName ? panelName : "",
        "emailID": emailId ? emailId : "",
        "phone": phoneNo ? phoneNo : "",
        "mobile": contactNo ? contactNo : "",
        "contactPerson": contactPerson ? contactPerson : "",
        "faxNo": faxNo ? faxNo : "",
        // "referenceCodeOPD": panelName ? panelName : "",
        // "agreement": panelName ? panelName : "",
        // "isServiceTax": true,
        "dateFrom": moment(validfrom).format("yyyy-MM-dd"),
        "dateTo": moment(validto).format("yyyy-MM-dd"),
        "creditLimit": creditlimits ? creditlimits : "",

        "paymentMode": paymentMode?.map(item => item?.code).join(","),
        "panelGroup": groupType?.value ? groupType?.value : "",
        "panelGroupID": groupType?.value ? Number(groupType?.value) : 0,
        // "createdBy": panelName ? panelName : "",
        "ipAddress": ip,
        "hideRate": hideRate?.value === "1" ? 1 : 0,
        "showPrintOut": showPrintout?.value === "1" ? 1 : 0,
        "coPaymentOn": CoPaymentOn?.value === "1" ? 1 : 0,
        "coPaymentPercent": copayments ? Number(copayments) : 0,
        "rateCurrencyCountryID": rateCurrency?.value ? rateCurrency?.value : 0,
        "billCurrencyCountryID": billCurrency?.value ? billCurrency?.value : 0,
        "billCurrencyCountryName": panelName ? panelName : "",
        "billCurrencyConversion": CurrencyConv ? Number(CurrencyConv) : 0,
        // "isCash": true,
        "coverNote": coverNote?.value === "1" ? true : false,
        "isCtb": isctbApplicable?.value === "1" ? 1 : 0,
        "creditPanelLimitInPer": creditlimits ? Number(creditlimits) : 0,
        // "item":"",
        // "subcatagoryID": "", 
        // "self": true,
        "selfIPD": rateType?.find((val) => val.value === "SELF (IPD)")?.value ? true : "0",
        "panelfollowOPD": fallowrateopd?.value ? fallowrateopd?.value : "",
        "panelfollowIPD": fallowrateipd?.value ? fallowrateipd?.value : "",
        "panelID": panelID ? panelID : ""
    }
}

export const handleOrganisationPayload = (values, type) => {
    const { Name, Address, City, State, Pincode, PhoneNo, MobileNo, FaxNo, Email, id, Active } = values
    return {
        "id": type === "update" ? id : 0,
        "organisation": Name,
        "address": Address,
        "city": City,
        "state": State?.value ? State?.value : "",
        "pincode": Pincode ? Pincode : "",
        "phoneNo": PhoneNo,
        "mobileNo": MobileNo,
        "faxNo": FaxNo,
        "emailID": Email,
        "isActive": Active ? Number(Active?.value) : 0,
    }
}
export const OPDVisitConfigSavePayload = (values, bodyData) => {

    console.log("values", values)
    console.log("bodyData", bodyData)
    const details = []
    const doctorList = []
    bodyData?.map((item) => {
        details.push({
            "subCategoryID": String(item?.SubCategoryID ? item?.SubCategoryID : ""),
            "minValidityDays": String(item?.MinValidityDays ? item?.MinValidityDays : ""),
            "maxValidityDays": String(item?.MaxValidityDays ? item?.MaxValidityDays : ""),
            "maximumCount": String(item?.MaximumCount ? item?.MaximumCount : ""),
            "doctorID": values?.doctor?.DoctorID ? String(values?.doctor?.DoctorID) : "",
            "centreID": values?.Centre?.CentreID ? String(values?.Centre?.CentreID) : "",
        })
        doctorList.push({
            "doctorId": values?.doctor?.DoctorID ? String(values?.doctor?.DoctorID) : "",
            "itemName": "string",
            "visitDateTime": "string"
        })
    })

    return {
        "saveType": "save",
        "details": details,
        "doctorList": doctorList
    }
}

export const SavepreopinstructionPayload = (values, data, tabItemTableData) => {
    console.log("v=data", data)
    console.log("values", values)
    const asaClass = values?.asaClass?.options?.filter((val) => val?.value)?.map((val) => val?.label).join(",")
    const neckMovements = values?.neckMovements?.options?.filter((val) => val?.value)?.map((val) => val?.label).join(",")
    const tmDistance = values?.tmDistance?.options?.filter((val) => val?.value)?.map((val) => val?.label).join(",")
    const dentures = values?.dentures?.options?.filter((val) => val?.value)?.map((val) => val?.label).join(",")
    const teeth = values?.teeth?.options?.filter((val) => val?.value)?.map((val) => val?.label).join(",")
    const mouthOpening = values?.mouthOpening?.options?.filter((val) => val?.value)?.map((val) => val?.label).join(",")
    // debugger
    return {
        "pre_op_instruction": {
            "preid": 0,
            "patientID": data?.PatientID ? String(data?.PatientID) : "",
            "transactionID": data?.TransactionID ? String(data?.TransactionID) : "",
            "appointment_ID": 0,
            "otBookingID": data?.OTBookingID,
            "malampattI_SCORE": String(values?.malampattiScore?.options?.find((val) => val?.value)?.label ? values?.malampattiScore?.options?.find((val) => val?.value)?.label : ""),
            moutH_OPENING_ADEQATE: mouthOpening ? mouthOpening : "",
            teeth: teeth ? teeth : "",
            dentures: dentures ? dentures : "",
            t_M_DISTANCE: tmDistance ? tmDistance : "",
            "nceK_MOVEMENTS": neckMovements ? neckMovements : "",
            "asA_CLASS": asaClass ? asaClass : "",
            "iS_NPO_FROM": values?.NPOFROM ? "1" : "0",
            "presenT_MEDICATIONS": "string",
            "npO_time": values?.NPOFROM ? moment(values?.NPOFromTime).format("HH:mm:ss") : "00:00:00",
            "npO_date": values?.NPOFROM ? moment(values?.NPOOnDate).format("YYYY-MM-DD") : "0001-01-01",
            "iS_APPLY_EMLA": values?.iS_APPLY_EMLA ? "1" : "0",
            "iS_REMOVE_ALL": values?.REMOVE_ALL ? "1" : "0",
            "iS_SHIFT_OT": values?.SHIFT_TO_OT ? "1" : "0",
            "iS_NEBULISATION": values?.NEBULISATION_WITH ? "1" : "0",
            "nebulisation": values?.NEBULISATION_WITH ? values?.NEBULISATION_ON : "",
            "nebulisatioN_time": values?.NEBULISATION_WITH ? moment(values?.nebulisatioN_time).format("HH:mm:ss") : "00:00:00",
            "nebulisatioN_date": values?.NEBULISATION_WITH ? moment(values?.nebulisatioN_date).format("YYYY-MM-DD") : "0001-01-01",
            "iS_patient_can": values?.isPatientCan ? "1" : "0",
            "iS_STOP_ORAL": values?.isStopOral ? "1" : "0",
            "stoP_ORAL_from_date": values?.isStopOral ? moment(values?.STOP_ORALFromDate).format("YYYY-MM-DD") : "0001-01-01",
            "stoP_ORAL_time": values?.isStopOral ? moment(values?.stoP_ORAL_time).format("HH:mm:ss") : "00:00:00",
            "stoP_ORAL_from_on": values?.isStopOral ? moment(values?.stoP_ORAL_from_on).format("YYYY-MM-DD") : "0001-01-01",
            "other": values?.IsOther ? values?.otherDeatails : "",
            "entry_by": "",
            "entry_date": "0001-01-01",
            "is_active": "",
            "update_date": "0001-01-01",
            "update_by": "",
            "allergies": values?.Allergies ? values?.Allergies : "",
        },
        "labItems": tabItemTableData?.map((item) => (
            {
                "itemID": item?.ItemID,
                "tabname": item?.ItemName,
                "tabdose": item?.mg,
                "time": moment(item?.tab_AT).format("hh:mm A"),
                "date": moment(item?.tabOnDate).format("YYYY-MM-DD")
            }
        )) || []
    }
}

const handlePACPaloadData = (data, type) => {
    return data?.find((item) => item?.name === type)?.options?.filter((val) => val?.value)?.map((val) => val?.name ? `${val?.label}#${val?.inputValue ? val?.inputValue : ""}` : val?.label).join(",")
}
export const SavePACPaload = (list, values, data) => {
    const { PatientID, TransactionID, OTBookingID } = data
    const antiicipateD_AIRWAY = handlePACPaloadData(list, "ANTIICIPATED_AIRWAY")
    const respiratory = handlePACPaloadData(list, "RESPIRATORY")
    const CARDIOVASCULAR = handlePACPaloadData(list, "CARDIOVASCULAR")
    const RENAL_ENDOCRINE = handlePACPaloadData(list, "RENAL_ENDOCRINE")
    const HEPATO_GASTROINTESTINAL = handlePACPaloadData(list, "HEPATO_GASTROINTESTINAL")
    const NEURO_MUSCULOSKELETAL = handlePACPaloadData(list, "NEURO_MUSCULOSKELETAL")
    const OTHERS = handlePACPaloadData(list, "OTHERS")
    const PRESENT_MEDICATIONS = handlePACPaloadData(list, "PRESENT_MEDICATIONS")

    return {
        "pacid": values?.pacid ? values?.pacid : 0,
        "patientID": PatientID,
        "transactionID": TransactionID ? TransactionID : "",
        "appointment_ID": 0,
        "otBookingID": OTBookingID,
        "surgicaL_ANESTHETIC": values?.SURGICAL_ANESTHETIC ? values?.SURGICAL_ANESTHETIC : "",
        "antiicipateD_AIRWAY": antiicipateD_AIRWAY ? antiicipateD_AIRWAY : "",
        "respiratory": respiratory ? respiratory : "",
        "cardiovascular": CARDIOVASCULAR ? CARDIOVASCULAR : "",
        "renaL_ENDOCRINE": RENAL_ENDOCRINE ? RENAL_ENDOCRINE : "",
        "hepatO_GASTROINTESTINAL": HEPATO_GASTROINTESTINAL ? HEPATO_GASTROINTESTINAL : "",
        "neurO_MUSCULOSKELETAL": NEURO_MUSCULOSKELETAL ? NEURO_MUSCULOSKELETAL : "",
        "others": OTHERS ? OTHERS : "",
        "presenT_MEDICATIONS": PRESENT_MEDICATIONS ? PRESENT_MEDICATIONS : "",
        "entry_by": "",
        "entry_date": "0001-01-01",
        "is_active": "",
        "update_date": "0001-01-01",
        "update_by": ""
    }
}
export const UpdatePACPaload = (list, values, data) => {
    const { PatientID, TransactionID, OTBookingID } = data
    const antiicipateD_AIRWAY = handlePACPaloadData(list, "ANTIICIPATED_AIRWAY")
    const respiratory = handlePACPaloadData(list, "RESPIRATORY")
    const CARDIOVASCULAR = handlePACPaloadData(list, "CARDIOVASCULAR")
    const RENAL_ENDOCRINE = handlePACPaloadData(list, "RENAL_ENDOCRINE")
    const HEPATO_GASTROINTESTINAL = handlePACPaloadData(list, "HEPATO_GASTROINTESTINAL")
    const NEURO_MUSCULOSKELETAL = handlePACPaloadData(list, "NEURO_MUSCULOSKELETAL")
    const OTHERS = handlePACPaloadData(list, "OTHERS")
    const PRESENT_MEDICATIONS = handlePACPaloadData(list, "PRESENT_MEDICATIONS")

    return {
        "pacid": values?.pacid ? values?.pacid : 0,
        "patientID": PatientID,
        "transactionID": TransactionID ? TransactionID : "",
        "appointment_ID": 0,
        "otBookingID": OTBookingID,
        "surgicaL_ANESTHETIC": values?.SURGICAL_ANESTHETIC ? values?.SURGICAL_ANESTHETIC : "",
        "antiicipateD_AIRWAY": antiicipateD_AIRWAY ? antiicipateD_AIRWAY : "",
        "respiratory": respiratory ? respiratory : "",
        "cardiovascular": CARDIOVASCULAR ? CARDIOVASCULAR : "",
        "renaL_ENDOCRINE": RENAL_ENDOCRINE ? RENAL_ENDOCRINE : "",
        "hepatO_GASTROINTESTINAL": HEPATO_GASTROINTESTINAL ? HEPATO_GASTROINTESTINAL : "",
        "neurO_MUSCULOSKELETAL": NEURO_MUSCULOSKELETAL ? NEURO_MUSCULOSKELETAL : "",
        "others": OTHERS ? OTHERS : "",
        "presenT_MEDICATIONS": PRESENT_MEDICATIONS ? PRESENT_MEDICATIONS : "",
        "entry_by": "",
        "entry_date": "0001-01-01",
        "is_active": "",
        "update_date": "0001-01-01",
        "update_by": ""
    }
}