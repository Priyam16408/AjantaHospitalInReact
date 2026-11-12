import React, { useEffect, useState } from "react";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../components/UI/Heading";
import moment from "moment";
import DatePicker from "../../components/formComponent/DatePicker";
import { Tabfunctionality } from "../../utils/helpers";
import Input from "../../components/formComponent/Input";
import { useSelector } from "react-redux";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import {
  LoadCurrencyDetail,
  GetConversionFactor,
} from "../../networkServices/PaymentGatewayApi";
import { RedirectURL } from "../../networkServices/PDFURL";
import Tables from "../../components/UI/customTable";

// import Select  from "react-select";
import SearchByMedicineItemName from "../../components/commonComponents/SearchByMedicineItemName";
import {
  BindGST,
  BindManufacturer,
  SaveGRN,
  UpdateGRN,
  DirectGRNReport,
  BindGRNItems,
  BindVendor,
  ReprintGRN,
  GRNSameStateBuyierSupplier,
  SaveGateEntry,
  GateEntryReport,
  BindGateEntryItems,
  UpdateGateEntry,
} from "../../networkServices/InventoryApi";
import {
  GetBindDepartment,
  getEmployeeWise,
} from "../../store/reducers/common/CommonExportFunction";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import GRNPurchaseOrderModal from "../../components/modalComponent/Utils/MedicalStore/GRNPurchaseOrderModal";
import Modal from "../../components/modalComponent/Modal";
import CustomSelect from "../../components/formComponent/CustomSelect";
import { validateOxygenRecord } from "../../networkServices/nursingWardAPI";
import CustomDateInput from "../../components/formComponent/CustomDateInput";
import { GST_TYPE_OPTION } from "../../utils/constant";
import { handleDecimalKeyDown, validateDecimalInput } from "../../utils/commonFunction";
import { date } from "yup";



const GateEntry = () => {
  const location = useLocation();
  const [state, setState] = useState(location?.state);
  // console.log("State", state);
  const [isPoByGateEntry, setIsPoByGateEntry] = useState(false)

  const { VITE_DATE_FORMAT } = import.meta.env;
  const localData = useLocalStorage("userData", "get");
  console.log("localData?.deptLedgerNo", localData?.deptLedgerNo);
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [modalData, setModalData] = useState({ visible: false });
  const [isSplitGST, setIsSplitGST] = useState("");


  const mmyy = `${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getFullYear()).slice(-2)}`;




  const initialState = {
    Type: "SE",
    RequestType: "",
    department: "",
    payload: "",
    Category: { lable: "All", value: "0" },
    SubCategoryID: { lable: "All", value: "0" },
    itemName: "",
    DoctorID: "",
    Dose: "",
    Times: "",
    Duration: "",
    Route: "",
    Meals: "",
    Quantity: "",
    Remarks: "",
    isDischargeMedicine: "",
    GRNType: "0",
    narration: "",
  };
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    InvoiceDate: new Date(),
    StoreType: { label: "Medical Store", value: "STO00001" },
    centre: "",
    LedgerNumber: "",
    InvoiceNo: "",
    invoiceAmount: "",
    transport: "",
    vehicleNo: "",
    DeliveryNo: "",
    Department: "",
    Category: "",
    SubCategoryID: "",
    ConversionFactor: 0,
    GRNType: "0",
    GRNItemListdata: [],
    paymentType: "4",
    narration: "",
    billDiscPercentage: 0,
    billDiscAmt: 0,
    roundOff: 0,
    Currency: { value: 14, label: 'INR' },
    items: [
      {
        itemName: "",
        ItemID: 0,
        manufacturer: "",
        salesUnit: "",
        hsnCode: "",
        dealRate: 0,
        qty: 0,
        billQty: 0,
        rate: 0,
        batch: "",
        mrp: 0,
        totalmrp: 0,
        discountPer: 0,
        discountAmt: 0,
        netAmount: 0,
        IGST: 0,
        CGST: 0,
        SGST: 0,
        CGSTAmt: 0,
        SGSTAmt: 0,
        IGSTAmt: 0,
        expDate: "",
        ManufactureDate: "",
        GSTType: "",
        MinorUnit: "",
        MajorUnit: "",
        SubCategoryID: 0,
        IsFree: 0,
        IsExpirable: 0,
        MajorMRP: 0,
        isDeal: "0",
        ExtraSellingCharge: 0,
        panelRate: 0,
        cashRate: 0,
        GSTCategory: { label: 'CGST&SGST', value: 'CGST&SGST' },
        purchaseOrderNo: "",
      },
    ],
  };
  const [isExpirable, setIsExpirable] = useState([]);
  // console.log("IsExpirable" , isExpirable)
  const [DropDownState, setDropDownState] = useState({
    category: [],
    paymentModeData: [],
    subcategory: [],
    BindVendorData: [],
    ManufacturerData: [],
    BindGRNType: [],
  });
  const [payload, setPayload] = useState({ ...initialState });

  const [backUpValues, setBackUpValues] = useState({ ...initialState })
  useEffect(() => {
    // console.log("payload from useEffect", payload);
  });


  const [SaveDisable, setSaveDisable] = useState(false);

  const [ItemIndexValue, setItemIndexValue] = useState({});
  const [values, setValues] = useState({ ...initialValues });
  console.log("valuesanand", values)
  const [SelectedManufacturer, setSelectedManufacturer] = useState(null);
  const [SelectedCurrency, setSelectedCurrency] = useState({
    value: 14,
    label: "INR",
  },);
  const [selectedCurrencyName, setSelectedCurrencyName] = useState(null);

  const [selectedPOs, setSelectedPOs] = useState([])
  // console.log("selectedCurrency", SelectedCurrency);
  const handleAddNewRow = (index) => {
    setValues((prevValues) => {
      const updatedItems = [...prevValues.items];

      // Clone the row at the clicked index and reset specific fields
      const newRow = {
        ...updatedItems[index],
        discountPer: "0", // Reset Discount %
        discountAmt: "0", // Reset Discount Amount
        netAmount: "0", // Reset Net Amount
        qty: "0", // Reset Quantity
        IsFree: 1,
        isCheckbox: true, // ✅ Only this new row gets a checkbox
      };

      // Insert the new row just below the clicked row
      updatedItems.splice(index + 1, 0, newRow);

      return { ...prevValues, items: updatedItems };
    });
  };

  useEffect(() => {
    const lastItem = values.items[values.items.length - 1];

    if (lastItem?.itemName?.trim() !== "") {
      setValues((prevValues) => ({
        ...prevValues,
        items: [
          ...prevValues.items,
          {
            itemName: "",
            ItemID: 0,
            manufacturer: "",
            salesUnit: "",
            hsnCode: "",
            dealRate: 0,
            qty: 0,
            rate: 0,
            batch: "",
            mrp: 0,
            totalmrp: 0,
            discountPer: 0,
            discountAmt: 0,
            netAmount: 0,
            IGST: 0,
            CGST: 0,
            SGST: 0,
            CGSTAmt: 0,
            SGSTAmt: 0,
            IGSTAmt: 0,
            expDate: "",
            ManufactureDate: "",
            GSTType: "",
            MinorUnit: "",
            MajorUnit: "",
            SubCategoryID: 0,
            IsFree: 0,
          },
        ],
      }));
    }
  }, [values.items]);

  //   const handleReactSelect = (name, value) => {
  //     setValues((val) => ({ ...val, [name]: value?.value || "" }));
  //   };
  // const handleReactSelect = (name, value, index) => {
  //   if(name=="centre"){
  //     setValues({ ...values, centre: value.label });
  //   }
  //   // const updatedItems = [...values.items];
  //   // updatedItems[index][name] = value?.value || "";
  //   // setValues({ ...values, items: updatedItems });
  // };
  const handleReactSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };
  // const handleCheckboxChange = (e, index, field) => {
  //   // const { value } = e.target.checked;

  //   const newItems = [...values.items];
  //   newItems[index][field] = e.target.checked?1:0;
  // };
  const handleCheckboxChange = (e, index, field) => {
    const newItems = [...values.items];
    newItems[index][field] = e.target.checked ? 1 : 0;
    setValues({ ...values, items: newItems });
  };

  // const formatDate = (date) => {
  //   return date ? moment(date).format("MM/YY") : null;
  // };

  // const handleInputChange = (e, index, field, IsFree = 0) => {
  //   
  //   const { value } = e.target;
  //   const item = [...values.items];
  //   item[index][field] = value;

  //   if (
  //     field == "rate" ||
  //     field == "qty" ||
  //     field == "discountPer" ||
  //     field == "MajorMRP"
  //   ) {
  //     const quantity = parseFloat(item.qty) || 0;
  //     const conversionFactor = parseFloat(item.ConversionFactor) || 1;
  //     const ratePerBox = parseFloat(item.rate) || 0;
  //     const ratePerUnit = ratePerBox / conversionFactor;
  //     const discountPercent = parseFloat(item.discountPer) || 0;
  //     const gstPercent =
  //       (parseFloat(item.CGST) || 0) +
  //       (parseFloat(item.SGST) || 0) +
  //       (parseFloat(item.IGST) || 0);
  //     const totalPrice = ratePerUnit * quantity;
  //     item["discountAmt"] = (totalPrice * discountPercent) / 100;
  //     const taxableAmount = totalPrice - item["discountAmt"];
  //     item["CGSTAmt"] = (taxableAmount * (parseFloat(item.CGST) || 0)) / 100;
  //     item["SGSTAmt"] = (taxableAmount * (parseFloat(item.SGST) || 0)) / 100;
  //     item["IGSTAmt"] = (taxableAmount * (parseFloat(item.IGST) || 0)) / 100;
  //     // console.log("item", (taxableAmount * (1 + gstPercent / 100)).toFixed(2));
  //     console.log("IsFreeIsFreeIsFreeIsFreeitem",item, taxableAmount,gstPercent,totalPrice,ratePerUnit , quantity);
  //     if (IsFree !== 1) {
  //       item["netAmount"] = (taxableAmount * (1 + gstPercent / 100)).toFixed(2);
  //     } else {
  //       item["netAmount"] = "0.00";
  //     }
  //     setValues({ ...values, items: item });
  //   }

  //   const { value } = e.target;

  //   const newItems = [...values.items];
  //   newItems[index][field] = value;
  //   if (field == "rate" || field == "qty") {
  //     if (newItems[index]["discountPer"] > 0) {
  //       newItems[index]["discountAmt"] =
  //         (parseFloat(newItems[index]["discountPer"]) / 100) *
  //         (parseFloat(newItems[index]["rate"]) *
  //           parseFloat(newItems[index]["qty"]));
  //     }
  //     if (field == "rate") {
  //       newItems[index]["totalmrp"] =
  //         parseFloat(value) * parseFloat(newItems[index]["qty"]);
  //       newItems[index]["CGSTAmt"] =
  //         (parseFloat(value) * parseFloat(newItems[index]["qty"]) -
  //           parseFloat(newItems[index]["discountAmt"])) *
  //         (newItems[index]["CGST"] / 100);
  //       newItems[index]["SGSTAmt"] =
  //         (parseFloat(value) * parseFloat(newItems[index]["qty"]) -
  //           parseFloat(newItems[index]["discountAmt"])) *
  //         (newItems[index]["SGST"] / 100);
  //       newItems[index]["IGSTAmt"] =
  //         (parseFloat(value) * parseFloat(newItems[index]["qty"]) -
  //           parseFloat(newItems[index]["discountAmt"])) *
  //         (newItems[index]["IGST"] / 100);
  //       newItems[index]["netAmount"] = (
  //         (parseFloat(value) * parseFloat(newItems[index]["qty"]) -
  //           parseFloat(newItems[index]["discountAmt"])) *
  //         (1 +
  //           parseFloat(newItems[index]["CGST"]) / 100 +
  //           parseFloat(newItems[index]["SGST"]) / 100 +
  //           parseFloat(newItems[index]["IGST"]) / 100)
  //       ).toFixed(2);
  //       newItems[index]["netAmount"] = 0
  //     } else
  //       newItems[index]["totalmrp"] =
  //         parseFloat(value) * parseFloat(newItems[index]["rate"]);
  //     newItems[index]["CGSTAmt"] =
  //       (parseFloat(
  //         newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
  //       ) -
  //         parseFloat(newItems[index]["discountAmt"])) *
  //       (newItems[index]["CGST"] / 100);
  //     newItems[index]["SGSTAmt"] =
  //       (parseFloat(
  //         newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
  //       ) -
  //         parseFloat(newItems[index]["discountAmt"])) *
  //       (newItems[index]["SGST"] / 100);
  //     newItems[index]["IGSTAmt"] =
  //       (parseFloat(
  //         newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
  //       ) -
  //         parseFloat(newItems[index]["discountAmt"])) *
  //       (newItems[index]["IGST"] / 100);
  //       if(IsFree!==1){
  //         newItems[index]["netAmount"] = (
  //           (parseFloat(
  //             newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
  //           ) -
  //             parseFloat(newItems[index]["discountAmt"])) *
  //           (1 +
  //             parseFloat(newItems[index]["CGST"]) / 100 +
  //             parseFloat(newItems[index]["SGST"]) / 100 +
  //             parseFloat(newItems[index]["IGST"]) / 100)
  //         ).toFixed(2);
  //       }
  //     newItems[index]["netAmount"] = (
  //       (parseFloat(
  //         newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
  //       ) -
  //         parseFloat(newItems[index]["discountAmt"])) *
  //       (1 +
  //         parseFloat(newItems[index]["CGST"]) / 100 +
  //         parseFloat(newItems[index]["SGST"]) / 100 +
  //         parseFloat(newItems[index]["IGST"]) / 100)
  //     ).toFixed(2);
  //   }
  //   if (field == "discountPer") {
  //     newItems[index]["discountAmt"] =
  //       (parseFloat(value) / 100) * parseFloat(newItems[index]["totalmrp"]);

  //     newItems[index]["CGSTAmt"] =
  //       (parseFloat(
  //         newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
  //       ) -
  //         parseFloat(newItems[index]["discountAmt"])) *
  //       (newItems[index]["CGST"] / 100);
  //     newItems[index]["SGSTAmt"] =
  //       (parseFloat(
  //         newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
  //       ) -
  //         parseFloat(newItems[index]["discountAmt"])) *
  //       (newItems[index]["SGST"] / 100);
  //     newItems[index]["IGSTAmt"] =
  //       (parseFloat(
  //         newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
  //       ) -
  //         parseFloat(newItems[index]["discountAmt"])) *
  //       (newItems[index]["IGST"] / 100);
  //     newItems[index]["netAmount"] = (
  //       (parseFloat(
  //         newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
  //       ) -
  //         parseFloat(newItems[index]["discountAmt"])) *
  //       (1 +
  //         parseFloat(newItems[index]["CGST"]) / 100 +
  //         parseFloat(newItems[index]["SGST"]) / 100 +
  //         parseFloat(newItems[index]["IGST"]) / 100)
  //     ).toFixed(2);
  //   }
  //   setValues({ ...values, items: newItems });
  // };

  const handleCustomInput = (
    index,
    name,
    value,
    type,
    max = 9999999999999,
    IsFree = 0,
    BodyData = values.items
  ) => {
    // ;
 console.log(index, name, value, type, max, IsFree, BodyData, "oninputchange");
    debugger
    const data = BodyData;
    let { ConversionFactor, discountPer, CGST, SGST, IGST } = data[index];

    let qty = name === "qty" ? value : data[index]?.qty;
    const rate = parseFloat(name === "rate" ? value : data[index]?.rate) || 0;

    if (type === "number") {
      if (!isNaN(value) && Number(value) <= max) {

        const discountPercent =
          parseFloat(name === "discountPer" ? value : discountPer) || 0;
        const conversionFactor = parseFloat(ConversionFactor) || 1;
        let cgstPercent = parseFloat(CGST) || 0;
        let sgstPercent = parseFloat(SGST) || 0;
        let igstPercent = parseFloat(IGST) || 0;
        const totalGSTPercent = cgstPercent + sgstPercent + igstPercent;
        const totaCGSTCGSTPer = cgstPercent + sgstPercent;



        const rateAfterDisc = rate - rate * discountPercent * 0.01;
        const unitPrice =
          rateAfterDisc + rateAfterDisc * totalGSTPercent * 0.01;
        const discAmt = rate * discountPercent * 0.01 * qty;
        const totalTaxAmt = rate * totalGSTPercent * 0.01 * qty;
        const totalTaxCGSTCGSTAmt =
          rateAfterDisc * totaCGSTCGSTPer * 0.01 * qty;
        data[index]["totalTaxCGSTCGSTAmt"] = totalTaxCGSTCGSTAmt;
        const grossAmt = (rate * qty * conversionFactor) - discAmt;
        const cgstAmt = grossAmt / 100 * cgstPercent;
        const sgstAmt = grossAmt / 100 * sgstPercent;
        const igstAmt = grossAmt / 100 * igstPercent;
        // const netAmount = (unitPrice * qty) / conversionFactor
        const netAmount = unitPrice * qty;

        const cashRate = netAmount / qty + ((netAmount / qty) / 100 * data[index]?.ExtraSellingCharge);
        console.log("cashRate", cashRate, netAmount, qty, data[index]?.ExtraSellingCharge)
        // 
        if (name === "qty") {
          data[index]["netAmount"] = netAmount;
          data[index]["discountAmt"] = discAmt;
        } else {
          // data[index]["netAmount"] = finalUnitPrice * ratePerBox ;
          data[index]["netAmount"] = netAmount;

          data[index]["discountAmt"] = discAmt;
        }

        // Assign calculated values
        data[index]["CGSTAmt"] = cgstAmt;
        data[index]["SGSTAmt"] = sgstAmt;
        data[index]["IGSTAmt"] = igstAmt;
        data[index][name] = value;
        data[index]["cashRate"] = parseFloat(cashRate > data[index]?.MajorMRP ? data[index]?.MajorMRP : cashRate || 0).toFixed(2);
        data[index]["panelRate"] = rate + (data[index]?.MajorMRP - rateAfterDisc);



        setValues((val) => ({ ...val, items: data }));
      }
    } else if (value?.length <= max || typeof value === "object") {
      if (name === "deal") {
        try {
          data[index]["isDeal"] = value;
          // Validate if the input is a valid arithmetic expression
          if (/^[0-9+\-*/().\s]+$/.test(value) && !/[+\-*/]$/.test(value)) {
            const evaluatedValue = new Function(`return ${value}`)(); // Safe execution
            if (!isNaN(evaluatedValue)) {
              data[index]["qty"] = evaluatedValue; // Set computed value to qty
            }
          }
        } catch (error) {
          console.error("Invalid expression in Deal field:", error);
        }
      }
      const discountPercent =
        parseFloat(name === "discountPer" ? value : discountPer) || 0;
      const conversionFactor = parseFloat(ConversionFactor) || 1;
      let cgstPercent = parseFloat(CGST) || 0;
      let sgstPercent = parseFloat(SGST) || 0;
      let igstPercent = parseFloat(IGST) || 0;
      const totalGSTPercent = cgstPercent + sgstPercent + igstPercent;
      const totaCGSTCGSTPer = cgstPercent + sgstPercent;

      const rateAfterDisc = rate - rate * discountPercent * 0.01;
      const unitPrice = rateAfterDisc + rateAfterDisc * totalGSTPercent * 0.01;
      const discAmt = rate * discountPercent * 0.01 * qty;
      const totalTaxAmt = rate * totalGSTPercent * 0.01 * qty;
      const totalTaxCGSTCGSTAmt = rateAfterDisc * totaCGSTCGSTPer * 0.01 * qty;
      data[index]["totalTaxCGSTCGSTAmt"] = totalTaxCGSTCGSTAmt;
      const netAmount = unitPrice * qty;


      // if (name === "GSTType") {
      //   // 
      //   data[index][name] = value?.value;
      //   // cgstPercent = parseFloat(value?.CGSTPer) || 0;
      //   // sgstPercent = parseFloat(value?.SGSTPer) || 0;
      //   // igstPercent = parseFloat(value?.IGSTPer) || 0;

      //   data[index]["CGST"] = isSplitGST ? parseFloat(value?.value/2) : 0;
      //   data[index]["SGST"] = isSplitGST ? parseFloat(value?.value/2) : 0;
      //   data[index]["IGST"] =  isSplitGST ? 0 : parseFloat(value?.value);
      // } else {
      //   data[index][name] = value?.value;
      // }
      const updateGSTValues = (item, gstValue) => {
        debugger
        const gstPercent = parseFloat(gstValue?.value || 0);
        const grossAmt = (rate * qty * conversionFactor) - discAmt;

        // const cgstAmt = grossAmt/100 * cgstPercent;
        // const sgstAmt = grossAmt/100 * sgstPercent;
        // const igstAmt = grossAmt/100 * igstPercent;


        if (item?.GSTCategory?.value === "CGST&UTGST" || item?.GSTCategory?.value === "CGST&SGST"
          || item?.GSTCategory === "CGST&UTGST" || item?.GSTCategory === "CGST&SGST"
        ) {
          item.CGST = gstPercent / 2;
          item.SGST = gstPercent / 2;
          item.IGST = 0;
          item.CGSTAmt = (grossAmt / 100) * (gstPercent / 2);
          item.SGSTAmt = (grossAmt / 100) * (gstPercent / 2);
          item.IGSTAmt = 0;

        } else {
          item.CGST = 0;
          item.SGST = 0;
          item.IGST = gstPercent;
          item.CGSTAmt = 0;
          item.SGSTAmt = 0;
          item.IGSTAmt = (grossAmt / 100) * gstPercent;
        }

        item.GSTType = gstValue?.value;
        return item;
      };


      const calculateItemAmounts = (item) => {
        const qty = parseFloat(item.qty) || 0;
        const rate = parseFloat(item.rate) || 0;
        const discountPer = parseFloat(item.discountPer) || 0;
        const conversionFactor = parseFloat(item.ConversionFactor) || 1;

        const rateAfterDisc = rate - rate * discountPer / 100;
        const unitPrice = rateAfterDisc + rateAfterDisc * (item.CGST + item.SGST + item.IGST) / 100;
        const discountAmt = rate * discountPer * qty / 100;

        const totalTaxCGSTSGST = rateAfterDisc * (item.CGST + item.SGST) * qty / 100;

        const cashRate = unitPrice + ((unitPrice) / 100 * item?.ExtraSellingCharge);
        const grossAmt = (rate * qty * conversionFactor) - discAmt;
        const cgstAmt = grossAmt / 100 * cgstPercent;
        const sgstAmt = grossAmt / 100 * sgstPercent;
        const igstAmt = grossAmt / 100 * igstPercent;



        return {
          ...item,
          discountAmt,
          CGSTAmt: cgstAmt,
          SGSTAmt: sgstAmt,
          IGSTAmt: igstAmt,
          netAmount: unitPrice * qty,
          totalTaxCGSTCGSTAmt: totalTaxCGSTSGST,
          cashRate: parseFloat(cashRate > item?.MajorMRP ? item?.MajorMRP : cashRate || 0).toFixed(2),
          panelRate: rate + (item?.MajorMRP - rateAfterDisc),
        };
      };

      if (name === "GSTType") {

        const updatedItem = updateGSTValues({ ...data[index] }, value);
        const calculatedItem = calculateItemAmounts(updatedItem);
        const updatedData = [...data];
        updatedData[index] = calculatedItem;

        // 
        setValues((prev) => ({ ...prev, items: updatedData }));
        return;
      }
      // Correct tax calculations
      const grossAmt = (rate * qty * conversionFactor) - discAmt;
      const cgstAmt = grossAmt / 100 * cgstPercent;
      const sgstAmt = grossAmt / 100 * sgstPercent;
      const igstAmt = grossAmt / 100 * igstPercent;
      data[index]["netAmount"] = netAmount;
      data[index]["CGSTAmt"] = cgstAmt;
      data[index]["SGSTAmt"] = sgstAmt;
      data[index]["IGSTAmt"] = igstAmt;


      if (name === "expDate") {

        data[index]["expDate"] = value;
      }
      if (name === "ManufactureDate") {

        data[index]["ManufactureDate"] = value;
        // data[index]["ManufactureDate"] = moment(value?.value).format("YYYY-MM-DD");

      }


      if (name === "batch") {
        data[index]["batch"] = value;
      }
      if (name === "hsnCode") {
        data[index]["hsnCode"] = value;
      }
      // if (name === "GSTCategory") {
      //   data[index]["GSTCategory"] = value?.value;
      //   const updatedItem = updateGSTValues({ ...data[index] }, {value:data[index]["GSTType"]});
      //   const calculatedItem = calculateItemAmounts(updatedItem);
      //   const updatedData = [...data];
      //   updatedData[index] = calculatedItem;

      //   // 
      //   setValues((prev) => ({ ...prev, items: updatedData }));
      // }
      if (name === "GSTCategory") {
        data[index]["GSTCategory"] = value?.value;

        const gstValue = { value: data[index]["GSTType"] }; // Ensure it's an object with `value` key
        const updatedItem = updateGSTValues({ ...data[index] }, gstValue);
        const calculatedItem = calculateItemAmounts(updatedItem);
        const updatedData = [...data];
        updatedData[index] = calculatedItem;

        setValues((prev) => ({ ...prev, items: updatedData }));
        return; // <- Important to stop double `setValues`
      }

    }
    setValues((val) => ({ ...val, items: data }));
  };





  const handleInputChangeDisc = (e, index, field) => {
    const { name, value } = e.target;
    const newItems = [...values.items];

    if (field === "discountPer") {
      if (value < 0 || value > 100) {
        return notify("Discount Per must be between 0 and 100", "error");
      }
    }
    if (values.billDiscPercentage > 0) {
      newItems.forEach((item) => {
        item.discountAmt = 0;
        item.discountPer = 0;
      });
    } else {
      const item = newItems[index];

      if (field === "discountPer") {
        // Calculate and update discount amount based on discount percentage
        const discountAmt =
          (parseFloat(value) / 100) * parseFloat(item.totalmrp || 0);
        item.discountPer = value;
        item.discountAmt = discountAmt.toFixed(2);
      } else if (field === "discountAmt") {
        // Calculate and update discount percentage based on discount amount
        const discountPer =
          (parseFloat(value) / parseFloat(item.totalmrp || 1)) * 100;
        item.discountAmt = value;
        item.discountPer = discountPer.toFixed(2);
      }

      // Update other amounts based on the adjusted discount
      const effectiveAmount =
        parseFloat(item.rate) * parseFloat(item.qty) -
        parseFloat(item.discountAmt || 0);
      item.CGSTAmt = (effectiveAmount * parseFloat(item.CGST || 0)) / 100;
      item.SGSTAmt = (effectiveAmount * parseFloat(item.SGST || 0)) / 100;
      item.IGSTAmt = (effectiveAmount * parseFloat(item.IGST || 0)) / 100;

      item.netAmount = (
        effectiveAmount *
        (1 +
          parseFloat(item.CGST || 0) / 100 +
          parseFloat(item.SGST || 0) / 100 +
          parseFloat(item.IGST || 0) / 100)
      ).toFixed(2);
    }

    setValues({ ...values, items: newItems });
  };

  const handleInputChangeCurrency = (e, index, field) => {
    debugger
    setValues({ ...values, [field]: index });
    setSelectedCurrency(index?.value);
    setSelectedCurrencyName(index?.label);
    // console.log("SelectedCurrency", SelectedCurrency);
  };



  const handleRemoveItem = (index) => {
    const newItems = values.items.filter((item, i) => i !== index);
    setValues({ ...values, items: newItems });
  };

  const calculateNetAmount = (item) => {

    const quantity = parseFloat(item.InitialCount) || 0; // Ensure it picks the correct field
    const rate = parseFloat(item.Rate) || 0;
    const conversionFactor = parseFloat(item.conversionFactor) || 1;

    const ratePerUnit = rate / conversionFactor; // Adjust rate per unit based on conversion
    const discountPercent = parseFloat(item.DiscPer) || 0;
    const discountAmount = (ratePerUnit * quantity * discountPercent) / 100;
    const taxableAmount = ratePerUnit * quantity - discountAmount;

    const cgstPercent = parseFloat(item.CGSTPercent) || 0;
    const sgstPercent = parseFloat(item.SGSTPercent) || 0;
    const igstPercent = parseFloat(item.IGSTPercent) || 0;

    const cgstAmt = (taxableAmount * cgstPercent) / 100;
    const sgstAmt = (taxableAmount * sgstPercent) / 100;
    const igstAmt = (taxableAmount * igstPercent) / 100;
    const totalTax = cgstAmt + sgstAmt + igstAmt;

    const netAmount = taxableAmount + totalTax;

    return netAmount.toFixed(2); // Return formatted value with 2 decimal places
  };

  const GRNView = async (GRNNo, StoreType, dataList) => {
    debugger
    if (typeof StoreType != "undefined") {
      const payloadIsReject = {
        gateNo: GRNNo,
        StoreType: StoreType?.value,
      };
      try {
        const response = await BindGateEntryItems(payloadIsReject);

        if (response?.success) {
          debugger
          const data = response?.data?.map((val, index) => ({
            sno: index + 1,
            ItemName: val?.ItemName,
            BatchNumber: val?.BatchNumber,
            Rate: val?.Rate,
            InitialCount: val?.InitialCount,
            MajorMRP: val?.MajorMRP,
            Free: val?.IsFree,
            Print: "",
            CurrentManufacturer: val?.CurrentManufacturer,
            LastManufacturer:
              val?.LastManufacturer == null ? "" : val?.LastManufacturer,
            CurrentVendor: val?.CurrentVendor == null ? "" : val?.CurrentVendor,
            LastVendor: val?.LastVendor,
            expDate: val?.MedExpiryDate,
            IsExpirable: val?.IsExpirable,
          }));
          const updatedItems = response?.data?.map((val, index) => {
            const ConversionFactor = parseFloat(val?.conversionFactor) || 1;
            const quantity = parseFloat(val.InitialCount) || 0;
            const ratePerBox = parseFloat(val.Rate) || 0;
            const discountPercent = parseFloat(val.DiscPer) || 0;
            const cgstPercent = parseFloat(val.CGSTPercent) || 0;
            const sgstPercent = parseFloat(val.SGSTPercent) || 0;
            const igstPercent = parseFloat(val.IGSTPercent) || 0;
            const ratePerUnit = ratePerBox / ConversionFactor;
            const discountAmountPerUnit =
              (ratePerBox * quantity * discountPercent) / 100;
            // Correct Rate Calculation (Considering Conversion Factor)
            console.log("firstval", val)
            // Correct Discount Calculation
            const discountAmt = (
              (ratePerBox * quantity * discountPercent) /
              100
            ).toFixed(2);
            const priceAfterDisc = ratePerUnit - discountAmountPerUnit;
            const taxableAmount = (
              ratePerUnit * quantity -
              discountAmt
            ).toFixed(2);

            // Correct GST Calculations
            const cgstAmt = Math.abs(
              ((priceAfterDisc * cgstPercent) / 100).toFixed(3)
            );
            const sgstAmt = Math.abs(
              ((priceAfterDisc * sgstPercent) / 100).toFixed(3)
            );
            const igstAmt = Math.abs(
              ((priceAfterDisc * igstPercent) / 100).toFixed(3)
            );

            const totalTax = (
              parseFloat(cgstAmt) +
              parseFloat(sgstAmt) +
              parseFloat(igstAmt)
            ).toFixed(3);

            // Net Amount Calculation
            const netAmount = (
              parseFloat(taxableAmount) + parseFloat(totalTax)
            ).toFixed(2);

            const calcNetAmount = calculateNetAmount(val);
            const cashRate = calcNetAmount / quantity + ((calcNetAmount / quantity) / 100 * val?.ExtraSellingCharge ? val?.ExtraSellingCharge : 0);

            if (val?.GSTType === "CGST&SGST") {
              setIsSplitGST(true)
            }
            return {
              cashRate: cashRate > val?.MajorMRP ? val?.MajorMRP : cashRate,
              ItemID: val.ItemID,
              IsFree: val?.IsFree,
              itemName: val.ItemName,
              manufacturer: val.ManufacturerId,
              salesUnit: val.majorUnit + "/" + val.MinorUnit,
              hsnCode: val.HSNCode,
              CGST: val.CGSTPercent,
              SGST: val.SGSTPercent,
              IGST: val.IGSTPercent,
              MinorUnit: val.majorUnit,
              MajorUnit: val.MinorUnit,
              ConversionFactor: parseFloat(val?.conversionFactor) || 1,
              SubCategoryID: val.SubCategoryID,
              qty: val.InitialCount,
              billQty: Number(val?.BillQauntity).toFixed(2),
              rate: val.Rate,
              StockID: val.StockID,
              LedgerTnxNo: val.LedgerTnxNo,
              mrp: val.MRP,
              totalmrp: val.Rate,
              batch: val.BatchNumber,
              discountPer: val.DiscPer,
              GSTType: String(val?.GSTPer),
              MajorMRP: val?.MajorMRP,
              // expDate: new Date(val.MedExpiryDate),
              expDate: val?.MedExpiryDate,
              ManufactureDate: val?.ManufactureDate,
              ExtraSellingCharge: val?.ExtraSellingCharge,
              // discountAmt:
              //   (parseFloat(val.DiscPer) / 100) *
              //   parseFloat(val.InitialCount * val.Rate),
              // discountAmt: (
              //   ((val.Rate/val?.conversionFactor) * val.InitialCount * val.DiscPer) /
              //   100
              // ).toFixed(2),
              discountAmt: discountAmt,
              netAmount: calculateNetAmount(val),
              // netAmount:
              //   val.DiscPer > 0
              //     ? parseFloat(val.UnitPrice * val.InitialCount).toFixed(2)
              //     : parseFloat(
              //         val.InitialCount * val.Rate * (1 + val.GSTPer / 100)
              //       ).toFixed(2),
              // CGSTAmt:
              //   (parseFloat(val.InitialCount * val.Rate) -
              //     parseFloat(
              //       (parseFloat(val.DiscPer) / 100) *
              //         parseFloat(val.InitialCount * val.Rate)
              //     )) *
              //   (val.CGSTPercent / 100),
              // SGSTAmt:
              //   (parseFloat(val.InitialCount * val.Rate) -
              //     parseFloat(
              //       (parseFloat(val.DiscPer) / 100) *
              //         parseFloat(val.InitialCount * val.Rate)
              //     )) *
              //   (val.SGSTPercent / 100),
              // IGSTAmt:
              //   (parseFloat(val.InitialCount * val.Rate) -
              //     parseFloat(
              //       (parseFloat(val.DiscPer) / 100) *
              //         parseFloat(val.InitialCount * val.Rate)
              //     )) *
              //   (val.IGSTPercent / 100),
              CGSTAmt: cgstAmt,
              SGSTAmt: sgstAmt,
              IGSTAmt: igstAmt,
              isDeal: val?.IsDeal,
            };
          });
          // setState(...state , updatedItems);
          setValues((val) => ({
            ...val,
            GRNItemListdata: data,
            items: updatedItems,
            StoreType: StoreType,
            LedgerNumber: {
              value: dataList.data.VendorId,
              label: dataList.data.LedgerName,
            },
            fromDate: new Date(dataList.data.InvoiceDate || "0001-01-01"),
            toDate: new Date(dataList.data.ChalanDate || "0001-01-01"),
            InvoiceNo: dataList.data.InvoiceNo,
            DeliveryNo: dataList.data.ChalanNo,
            narration: dataList.data.Naration,
            invoiceAmount: dataList.data?.invoiceAmount ? dataList.data?.invoiceAmount : "",
            transport: dataList.data?.Transport ? dataList.data?.Transport : "",
            vehicleNo: dataList.data?.VehicleNo ? dataList.data?.VehicleNo : "",
            type: "update",
          }));
          if (response?.data[0].IsPoByGIN > 0) {
            setIsPoByGateEntry(true)
          }
        } else {
          notify(response?.message, "error");
          setValues((val) => ({ ...val, GRNItemListdata: [] }));
        }
      } catch (error) {
        console.error("Something went wrong", error);
        setValues((val) => ({ ...val, GRNItemListdata: [] }));
      }
    }
  };

  useEffect(() => {
    if (values?.type === "update") {
      // console.log("Asas",values?.items[0]?.rate)
      if (values?.items?.length > 0) {
        handleCustomInput(
          0,
          "rate",
          values?.items[0]?.rate,
          "number",
          9999999999
        );
      }
    }
  }, [values?.type]);

  const handleChange = (e) => {
    let name, value;
    // 
    // Check if the event is from a DatePicker (Date object)
    if (e instanceof Date) {
      name = "InvoiceDate"; // Assuming the DatePicker is for InvoiceDate
      value = e;
    } else {
      // Handle regular input changes
      const { name: inputName, value: inputValue } = e.target || {};
      name = inputName;
      value = inputValue;
    }

    // Update the state
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChangeBillDis = (e) => {
    const { name, value } = e.target;
    if (value < 0 || value > 100) {
      return notify("Bill Discount Per must be between 0 and 100", "error");
    }
    setValues((val) => {
      const updatedValues = { ...val, [name]: value };

      if (name === "billDiscPercentage") {
        const billDiscAmt = (totalAmount * parseFloat(value)) / 100;
        updatedValues.billDiscAmt = billDiscAmt;
      } else if (name === "billDiscAmt") {
        const billDiscPercentage = (parseFloat(value) / totalAmount) * 100;
        updatedValues.billDiscPercentage = billDiscPercentage;
      }

      return updatedValues;
    });
  };

  const handleCancel = () => {
    setValues(initialValues);
    setState({});
  };

  // const handleItemSelect = (label, value, val, index) => {
  //   const updatedItems = [...values.items];

  //   updatedItems[index] = {
  //     ...updatedItems[index],
  //     ItemID: val.ItemID,
  //     itemName: val.ItemName,
  //     manufacturer: val.ManufactureID,
  //     salesUnit: val.majorUnit + "/" + val.minorUnit,
  //     hsnCode: val.HSNCode,
  //     CGST: val.CGSTPercent,
  //     SGST: val.SGSTPercent,
  //     IGST: val.IGSTPercent,
  //     expDate: val.expDate,
  //     GSTType: val.GSTType,
  //     MajorUnit: val.majorUnit,
  //     MinorUnit: val.minorUnit,
  //     SubCategoryID: val.SubCategoryID,
  //     // GSTTypeNew:val.GSTTypeNew
  //   };

  //   setValues({ ...values, items: updatedItems });
  //   setPayload({
  //     ...payload,
  //     itemName: {
  //       label: label,
  //       value: value,
  //     },
  //   });
  // };

  const handleItemSelect = (label, value, val, index) => {
    console.log("first val", val)

    const updatedItems = [...values.items];

    updatedItems[index] = {
      ...updatedItems[index],
      ItemID: val.ItemID,
      itemName: val.ItemName,
      manufacturer: val.ManufactureID,
      salesUnit: val.majorUnit + "/" + val.minorUnit,
      hsnCode: val.HSNCode,
      CGST: updatedItems?.GSTCategory === "CGST&SGST" || updatedItems?.GSTCategory === "CGST&UTGST" ? val.GSTType / 2 : 0,
      SGST: updatedItems?.GSTCategory === "CGST&SGST" || updatedItems?.GSTCategory === "CGST&UTGST" ? val.GSTType / 2 : 0,
      IGST: updatedItems?.GSTCategory === "CGST&SGST" || updatedItems?.GSTCategory === "CGST&UTGST" ? 0 : val.GSTType,
      expDate: val.expDate ? val.expDate : mmyy,
      ManufactureDate: val.ManufactureDate ? val.ManufactureDate : mmyy,
      GSTType: val.GSTType,
      MajorUnit: val.majorUnit,
      MinorUnit: val.minorUnit,
      SubCategoryID: val.SubCategoryID,
      IsExpirable: val.IsExpirable,
      ExtraSellingCharge: val?.ExtraSellingCharge,
      ConversionFactor: val.ConversionFactor || 1, // Default to 1 if not available

    };

    setValues({ ...values, items: updatedItems });
    setPayload({
      ...payload,
      itemName: {
        label: label,
        value: value,
      },
    });
  };
  useEffect(() => {
    if (localData?.employeeID) {
      dispatch(getEmployeeWise({ employeeID: localData?.employeeID }));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetBindDepartment());
  }, []);
  useEffect(() => {
    // Fetch item names when the component is mounted
    // fetchItemNames();
    fetchGST();
    fetchManufacturer();
    fetchCurrencyDetail();
    fetchVendor();
  }, []);

  console.log(state, "statestatestate")
  useEffect(() => {
    // dispatch(GetBindDepartment());
    const response = GRNView(state?.GRNNo, state?.StoreType, state);
    if (response?.success) {
      // console.log("Reponse after GRNVIEW", response);
    }
  }, []);
  const fetchManufacturer = async () => {
    const payLoadList = {
      // itemName: "", // Use specific value if needed
      // requestType: "",
    };
    try {
      const response = await BindManufacturer(payLoadList);
      if (response?.data) {
        const itemOptions = response.data.map((item) => ({
          value: item.ManufactureID,
          label: item.NAME,
        }));
        setDropDownState((prevState) => ({
          ...prevState,
          ManufacturerData: itemOptions,
        }));
      }
    } catch (error) {
      console.error("Error fetching item names: ", error);
    }
  };
  const fetchGST = async () => {
    const payLoadList = {
      // itemName: "", // Use specific value if needed
      // requestType: "",
    };
    try {
      const response = await BindGST(payLoadList);
      if (response?.data) {
        const itemOptions = response.data.map((item) => ({
          value: item.TaxGroupLabel,
          label: item.TaxGroupLabel,
          CGSTPer: item.CGSTPer,
          IGSTPer: item.IGSTPer,
          SGSTPer: item.SGSTPer,
          TaxGroup: item.TaxGroup,
          UTGSTPer: item.UTGSTPer,
        }));
        setDropDownState((prevState) => ({
          ...prevState,
          BindGRNType: itemOptions,
        }));
      }
    } catch (error) {
      console.error("Error fetching item names: ", error);
    }
  };
  const fetchVendor = async () => {
    const payLoadList = {
      // itemName: "", // Use specific value if needed
      // requestType: "",
    };
    try {
      const response = await BindVendor(payLoadList);
      // console.log("Response from bindVendor" , response);
      if (response?.data) {
        // const itemOptions = response.data.map((item) => ({
        //   value: item.LedgerNumber,
        //   label: item.LedgerName,
        // }));
        // console.log("ItemOptions" , itemOptions)
        setDropDownState((prevState) => ({
          ...prevState,
          BindVendorData: handleReactSelectDropDownOptions(response.data, "LedgerName", "LedgerNumber"),
        }));
      }
    } catch (error) {
      console.error("Error fetching item names: ", error);
    }
  };
  const handleGSTChange = (value, val, index) => {
    // setSelectedGST(val?.label); // Update the selected GST
    if (val?.label != null) {
      const updatedItems = [...values.items];

      // Update the specific row (index) with selected item data (val)
      updatedItems[index] = {
        ...updatedItems[index], // Keep existing properties
        CGST: val.CGSTPer,
        SGST: val.SGSTPer,
        IGST: val.IGSTPer,
        CGSTAmt:
          (parseFloat(updatedItems[index].totalmrp) -
            parseFloat(updatedItems[index].discountAmt)) *
          (val.CGSTPer / 100),
        SGSTAmt:
          (parseFloat(updatedItems[index].totalmrp) -
            parseFloat(updatedItems[index].discountAmt)) *
          (val.SGSTPer / 100),
        IGSTAmt:
          (parseFloat(updatedItems[index].totalmrp) -
            parseFloat(updatedItems[index].discountAmt)) *
          (val.IGSTPer / 100),
        GSTType: val?.label,
        netAmount: (
          (parseFloat(updatedItems[index].totalmrp) -
            parseFloat(updatedItems[index].discountAmt)) *
          (1 +
            parseFloat(val.CGSTPer) / 100 +
            parseFloat(val.SGSTPer) / 100 +
            parseFloat(val.IGSTPer) / 100)
        ).toFixed(2),
        // Add any other properties you need to set
      };

      // Update the state with the new item details
      setValues({ ...values, items: updatedItems });
    } else {
      const updatedItems = [...values.items];

      // Update the specific row (index) with selected item data (val)
      updatedItems[index] = {
        ...updatedItems[index], // Keep existing properties
        CGST: 0,
        SGST: 0,
        IGST: 0,
        CGSTAmt: 0,
        SGSTAmt: 0,
        IGSTAmt: 0,
        GSTType: val?.label,
        netAmount: (
          parseFloat(updatedItems[index].totalmrp) -
          parseFloat(updatedItems[index].discountAmt)
        ).toFixed(2),
        // Add any other properties you need to set
      };

      // Update the state with the new item details
      setValues({ ...values, items: updatedItems });
    }
  };

  const fetchCurrencyDetail = async () => {
    try {
      const response = await LoadCurrencyDetail();
      debugger
      if (response?.data) {
        const CurrencyDetail = response.data.map((item) => ({
          value: item.CountryID,
          label: item.Currency,
        }));
        setValues((prevState) => ({
          ...prevState,
          CurrencyDetail: CurrencyDetail,
        }));
      }
    } catch (error) {
      console.error("Failed to load currency detail:", error);
    }
  };
  const handleGetConversionFactor = async (data) => {
    const { CountryID } = data;
    try {
      const apiResponse = await GetConversionFactor(data);
      return apiResponse?.data;
    } catch (error) {
      console.error("Error fetching conversion factor:", error);
    }
  };
  // const handleManufacturer = (name, e) => {
  //   setSelectedManufacturer(e?.label); // Update the selected GST
  // };
  const handleManufacturer = (label, value, val, index) => {
    const updatedItems = [...values.items];
    // ;
    updatedItems[index] = {
      ...updatedItems[index],
      manufacturer: value?.value, // Set selected manufacturer
    };
    setValues({ ...values, items: updatedItems });
  };
  const calculateTotalAmount = () => {
    // console.log("CalculateTotalAmount" , values)
    return values.items.reduce((total, item) => {

      return total + Number(item.qty) * Number(item.rate);
    }, 0);
  };

  const totalAmount = calculateTotalAmount();
  // console.log("TotalAmount" , totalAmount)

  // const calculateTotalGRNAmount = () => {
  //   return values.items.reduce((total, item) => {
  //     return total + parseFloat(item.netAmount);
  //   }, 0);
  // };
  const calculateTotalGRNAmount = () => {
    // Calculate the total amount
    // const TotalGRNAmount =
    //   parseFloat(values?.freightCharges || "0.00") +
    //   values.items.reduce((total, item) => {
    //     return total + parseFloat(item?.IsFree ? 0 : item.netAmount);
    //   }, 0);

    // // Set the round-off value (rounded to 2 decimal places, adjust as needed)
    // values.roundOff = (Math.round(TotalGRNAmount) - TotalGRNAmount).toFixed(2); // You can change '2' to the desired decimal places

    // return Math.round(TotalGRNAmount);

    const TotalGRNAmount =
      parseFloat(values?.freightCharges || "0.00") +
      values.items.reduce((total, item) => {

        return total + parseFloat(item?.IsFree ? 0 : item.netAmount);
      }, 0);
    values.roundOff = (Math.round(TotalGRNAmount) - TotalGRNAmount).toFixed(2);
    return Math.round(TotalGRNAmount);
  };
  // console.log("calculateTotalDisAmount", values.items);
  const calculateTotalDisAmount = () => {

    return values.items.reduce((total, item) => {
      return total + parseFloat(item.discountAmt);
    }, 0);
  };
  const calculatecgstSgstAmt = () => {
    return values.items.reduce((total, item) => {

      return (
        total +
        (item?.totalTaxCGSTCGSTAmt ? parseFloat(item?.totalTaxCGSTCGSTAmt) : 0)
      );
    }, 0);
  };
  const calculateIgstAmt = () => {
    return values.items.reduce((total, item) => {
      return total + parseFloat(item.IGSTAmt);
    }, 0);
  };

  const IgstAmt = calculateIgstAmt();
  const cgstSgstAmt = calculatecgstSgstAmt();
  const TotalDisAmount = calculateTotalDisAmount();
  const TotalGRNAmount = calculateTotalGRNAmount();
  console.log("values", values)

  const handleSave = async () => {
    debugger
    if (values?.InvoiceNo == "") {
      notify(t("Please Enter Invoice No"), "error");
      return
    }
    if (
      typeof values.LedgerNumber == "undefined" ||
      values?.LedgerNumber == ""
    ) {
      return notify(t("Please Select Supplier"), "error");
    } else if (values?.fromDate == "") {
      return notify(t("Please Select From Date"), "error");
    } else if (values?.toDate == "") {
      return notify(t("Please Select To Date"), "error");
    } else if (
      typeof values.StoreType == "undefined" ||
      values?.StoreType == ""
    ) {
      return notify(t("Please Select Store."), "error");
    } else if (typeof values.GRNType == "undefined" || values?.GRNType == "") {
      return notify(t("Please Select GRN Type."), "error");
    } else if (
      typeof values.paymentType == "undefined" ||
      values.paymentType == ""
    ) {
      return notify(t("Please Select Payment Type."), "error");
    } else if (typeof SelectedCurrency == "undefined") {
      return notify(t("Please Select Currency."), "error");
    } else if (
      typeof values.narration == "undefined" ||
      values.narration.trim() == ""
    ) {
      return notify(t("Please Select Narration."), "error");
    } else if (values?.qty) {
      return notify(t("Quantity can not be 0", "error"));
    }
    // else if (values?.expDate == "" && values?.IsExpirable) {
    //   return notify(t("Please Select Expiry Date."), "error");
    // }
    const validateAndMapItems = (values) => {
      // ;
      // Define required fields
      const requiredFields = [
        "ItemID",
        "itemName",
        "batch",
        "mrp",
        "qty",
        "rate",
        "discountPer",
        "discountAmt",
        "CGST",
        "SGST",
        "IGST",
        "expDate",
        "netAmount",
        "totalmrp",
        "SubCategoryID",
        "MajorUnit",
        "MinorUnit",
        "hsnCode",
        "GSTType",
        "manufacturer",
      ];

      // Check each item in values.items for required fields
      // ;
      const allItemsAreFree = values.items.every((item) => item.IsFree === 1);
      if (allItemsAreFree) {
        throw new Error(
          "All items cannot be marked as 'IsFree'. At least one item must not be free."
        );
      }
      // values.items.forEach((item, index) => {
      //   requiredFields.forEach((field) => {
      //     if (
      //       item[field] === undefined ||
      //       item[field] === null ||
      //       item[field] === ""
      //     ) {
      //       throw new Error(`${field.toUpperCase()} is required.`);
      //     }
      //     if (["mrp", "qty", "rate"].includes(field) && item[field] <= 0) {
      //       throw new Error(`${field.toUpperCase()} must be greater than 0.`);
      //     }
      //   });
      // });

      // If validation passes, return mapped items
      // return values.items.map((item) => ({
      //   DeptLedgerNo: "LSHHI17",
      //   ItemID: item.ItemID,
      //   ItemName: item.itemName,
      //   BatchNumber: item.batch,
      //   MRP: item.mrp,
      //   Quantity: item.qty,
      //   Rate: item.rate,
      //   DiscPer: item.discountPer,
      //   DiscAmt: item.discountAmt,
      //   PurTaxPer: item.CGST + item.SGST + item.IGST,
      //   PurTaxAmt: item.SGSTAmt + item.IGSTAmt + item.CGSTAmt,
      //   MedExpiryDate: moment(item.expDate, "YYYY-MM-DD").format("DD-MMM-YYYY"),
      //   ItemNetAmount: item.netAmount,
      //   ItemGrossAmount: item.totalmrp,
      //   isDeal: "0+0",
      //   markUpPercent: 0,
      //   PODID: 0,
      //   LedgerTnxNo: 0,
      //   StockID: 0,
      //   otherCharges: 0,
      //   SaleTaxPer: item.CGST + item.SGST + item.IGST,
      //   IsFree: 0,
      //   StoreLedgerNo: values.StoreType.value,
      //   Naration: values.narration,
      //   SubCategoryID: item.SubCategoryID,
      //   MajorUnit: item.MajorUnit,
      //   MinorUnit: item.MinorUnit,
      //   ConversionFactor: 14,
      //   MajorMRP: 0,
      //   IsExpirable: 1,
      //   SpecialDiscPer: 0,
      //   SpecialDiscAmt: 0,
      //   IsReturn: 0,
      //   HSNCode: item.hsnCode,
      //   GSTType: item.GSTType,
      //   IGSTPercent: item.IGST,
      //   CGSTPercent: item.CGST,
      //   SGSTPercent: item.SGST,
      //   IGSTAmt: item.IGSTAmt,
      //   CGSTAmt: item.CGSTAmt,
      //   SGSTAmt: item.SGSTAmt,
      //   RetrunFromGRN: "",
      //   RetrunFromInvoiceNo: "",
      //   IsUpdateCF: 0,
      //   IsUpdateHSNCode: 0,
      //   IsUpdateGST: 0,
      //   IsUpdateExpirable: 0,
      //   ManufacturerId: item.manufacturer,
      //   UnitPrice: item.rate,
      //   InvoiceNo: values.InvoiceNo,
      //   ChalanNo: values.DeliveryNo,
      //   InvoiceDate: moment(values.fromDate, "YYYY-MM-DD").format("DD-MMM-YYYY"),
      //   ChalanDate: moment(values.toDate, "YYYY-MM-DD").format("DD-MMM-YYYY"),
      //   VenLedgerNo: values.LedgerNumber.value,
      //   InvoiceAmount: parseFloat(item.netAmount),
      // }));
    };

    // Usage
    // try {
    //   const dataItemDetails = validateAndMapItems(values);
    //   // console.log("DataItemDetails" , dataItemDetails)

    //   // dataItemDetails is now ready to use if validation passed
    // } catch (error) {
    //   // Handle error (e.g., display error message)
    //   return notify(error.message, "error");
    // }

    const validItems = values.items.filter(
      (item) => item.itemName && item.itemName.trim() !== ""
    );

    // console.log("ValidItemz" , validItems)

    if (validItems.length === 0) {
      return notify("At least one valid item is required.", "error");
    }
    debugger
    // console.log("dataItemDetails" , values)
    const payload = {
      dataInvoice: [
        {
          InvoiceNo: values.InvoiceNo,
          invoiceAmount: values?.invoiceAmount ? Number(values?.invoiceAmount) : 0,
          transport: values?.transport?.value ? values?.transport?.value : values?.transport,
          vehicleNo: values?.vehicleNo ? values?.vehicleNo : "",
          ChalanNo: values.DeliveryNo,
          InvoiceDate: moment(values?.InvoiceDate, "YYYY-MM-DD").format(
            "DD-MMM-YYYY"
          ),
          ChalanDate: moment(values.toDate, "YYYY-MM-DD").format(
            "DD-MMM-YYYY"
          ),
          // ChalanDate:  moment(values.fromDate, "YYYY-MM-DD").format(
          //   "DD-MMM-YYYY"
          // ),
          VenLedgerNo: values.LedgerNumber.value,
          // ChalanDate: moment(values.toDate, "YYYY-MM-DD").format("DD-MMM-YYYY"),
          WayBillNo: "",
          WayBillDate: "",
          GrossBillAmount: totalAmount.toFixed(2),
          NetAmount: TotalGRNAmount.toFixed(2),
          RoundOff: parseFloat(values.roundOff),
          // DiscAmount: TotalDisAmount.toFixed(2),
          DiscAmount: validItems?.discountAmt,
          GatePassIn: "",
          StoreLedgerNo: values.StoreType.value,
          PaymentModeID: values.paymentType,
          PONumber: selectedPOs?.length > 0 ? selectedPOs.join(",") : "",
          otherCharges: 0,
          currencyCountryID: values?.Currency?.value, // currencyCountryID: 14,
          currency: values?.Currency?.label, // currency: selectedCurrencyName,
          // CurrencyFactor: state?.data?.CurrencyFactor,
          CurrencyFactor: "1.000000",
          FreightCharge: values?.freightCharges || "0.00",
        },
      ],

      dataItemDetails: validItems.map((item, index) => ({
        purchaseOrderNo: item?.purchaseOrderNo || "",
        DeptLedgerNo: localData?.deptLedgerNo || 0,
        stockID: item.StockID,
        ItemID: item.ItemID,
        ManufacturerId: item.manufacturer,
        ItemName: item.itemName,
        BatchNumber: item.batch,
        UnitPrice: (
          (item.rate / (item.ConversionFactor || 1)) *
          (1 - item.discountPer / 100) *
          (1 + (item.CGST + item.SGST + item.IGST) / 100)
        ).toFixed(4),
        MRP: item.MajorMRP,
        Quantity: item.qty,
        billQuantity: item?.billQty ? Number(item?.billQty) : 0,
        IsReturn: 0,
        MedExpiryDate: item?.expDate || "", // MedExpiryDate: moment(item.expDate, "YYYY-MM-DD").format("DD-MMM-YYYY"),
        StoreLedgerNo: values.StoreType.value,
        // ManufactureDate: moment(values.ManufactureDate?.value).format("DD-MM-YYYY"),
        Naration: values.narration,
        IsFree: item.IsFree ? 1 : 0,
        SubCategoryID: item.SubCategoryID,
        Rate: parseFloat(item.rate), // Rate: (item.rate) / (item?.ConversionFactor || 1),
        DiscPer: item.discountPer,
        DiscAmt: item.discountAmt,
        PurTaxPer: item.CGST + item.SGST + item.IGST,
        PurTaxAmt: item.SGSTAmt + item.IGSTAmt + item.CGSTAmt,
        SaleTaxPer: item.CGST + item.SGST + item.IGST,
        MajorUnit: item.MajorUnit,
        MinorUnit: item.MinorUnit,
        ConversionFactor: item?.ConversionFactor || 1, // Ensure it gets the correct value
        MajorMRP: item?.MajorMRP,
        InvoiceNo: values.InvoiceNo,
        ChalanNo: values.DeliveryNo,
        manufactureDate: item?.ManufactureDate,
        // manufactureDate:String( values?.ManufactureDate?moment(values?.ManufactureDate).format("YYYY-MM-DD"):""),
        InvoiceDate: moment(values?.InvoiceDate, "YYYY-MM-DD").format(
          "DD-MMM-YYYY"
        ),
        // ChalanDate: moment(values.toDate, "YYYY-MM-DD").format("DD-MMM-YYYY"),
        ChalanData: "01-Jan-2001",
        VenLedgerNo: values.LedgerNumber.value,
        LedgerTnxNo: item.LedgerTnxNo,
        InvoiceAmount: parseFloat(item.netAmount),
        ipAddress: localStorage.ipAddress,
        IsExpirable: item?.IsExpirable,
        isDeal: item?.isDeal,
        HSNCode: item.hsnCode,
        GSTType: item?.GSTCategory ? item?.GSTCategory : item?.GSTCategory?.value,
        IGSTPercent: item.IGST,
        IGSTAmt: item.IGSTAmt,
        SGSTPercent: item.SGST,
        SGSTAmt: item.SGSTAmt,
        CGSTPercent: item.CGST,
        CGSTAmt: item.CGSTAmt,
        SpecialDiscPer: 0,
        SpecialDiscAmt: 0,
        RetrunFromGRN: "",
        RetrunFromInvoiceNo: "",
        ItemGrossAmount: item.totalmrp,
        ItemNetAmount: item.netAmount,
        IsUpdateCF: 0,
        IsUpdateHSNCode: 0,
        IsUpdateGST: 0,
        IsUpdateExpirable: 0,
        PODID: 0,
        markUpPercent: 0,
        otherCharges: 0,
        isPost: 9,
        panelRate: 0,
        cashRate: Number(item?.cashRate)
      })),
      isConsignment: 0,
      consignmentNumber: 0,
      ...(state?.GRNNo && {
        ledgerTransationNo: state?.GRNNo,
        EditGRNNo: state?.data?.BillNo,
      }),
    };

    console.log("payload", payload)
    if (typeof state?.GRNNo === "undefined") {
      try {
        const response = await SaveGateEntry(payload);
        if (response?.success) {
          // ;
          notify(response?.message, "success");
          const payload2 = { gateNo: response?.data?.gateEntryNo };
          const response1 = await GateEntryReport(payload2);
          RedirectURL(response1?.data?.pdfUrl);
          handleCancel();
          setSelectedCurrency(null);
          setSelectedPOs([]);
          setIsPoByGateEntry(false)
        } else {
          notify(response?.message, "error");
        }
      } catch (error) {
        console.error("Something went wrong", error);
      }
    } else {
      try {
        const response = await UpdateGateEntry(payload);
        if (response?.success) {

          setSaveDisable(true);
          setIsPoByGateEntry(false)
          notify(response?.message, "success");
          const payload2 = { gateNo: response?.data?.gateNo };
          const response1 = await GateEntryReport(payload2);
          RedirectURL(response1?.data?.pdfUrl);
          await handleCancel();
        } else {
          notify(response?.message, "error");
        }
      } catch (error) {
        console.error("Something went wrong", error);
      }
    }
  };
  const THEAD = [
    { name: t("S.NO"), width: "1%" },
    { name: t("Item Name"), className: "col-xl-2 col-md-4 col-sm-4 col-12" },
    { name: t("ManuFacturer"), className: "col-xl-2 col-md-4 col-sm-4 col-12" },
    { name: t("UNIT"), width: "6%" },
    { name: t("HSN Code"), width: "4%" },
    { name: t("Deal"), width: "8%" },
    { name: t("Qty"), width: "8%" },
    { name: t("Bill Qty"), width: "8%" },
    { name: t("Rate"), width: "10%" },
    { name: t("Batch"), width: "10%" },
    { name: t("MRP"), width: "10%" },
    { name: t("Disc(%)"), width: "10%" },
    { name: t("Disc.Amt") },
    { name: t("GST %") },
    { name: t("GST Type"), width: "11%" },
    { name: t("CGST(%)"), width: "1%" },
    { name: t("SGST/UTGST(%)"), width: "1%" },
    { name: t("IGST(%)"), width: "1%" },
    { name: t("Net Amt."), width: "6%" },
    { name: t("Cash Rate"), width: "1%" },
    { name: t("Mfg Date"), width: "8%" },
    { name: t("Exp Date"), width: "8%" },
    { name: t("Action") },
    { name: t("Is Free") },
    { name: t("Add") },
  ];

  // useEffect(()=>{
  //   console.log("item.expiry datye",)
  // },[])

  console.log(isSplitGST, "isSplitGSTisSplitGST")

  const formatRowData = (item, index) => {

    console.log("item?.GSTCategory ", item?.GSTCategory)
    return {
      "sno": index + 1,
      "Item Name": (
        <div style={{ height: "20px", minWidth: "200px" }}>
          <SearchByMedicineItemName
            data="cal"
            handleItemSelect={(label, value, val) =>
              handleItemSelect(label, value, val, index)
            }
            itemName={item.itemName}
            payload={payload}
            callfrom="GRN"
            storeLedgerNo={values.StoreType}
            setIsExpirable={setIsExpirable}
            // disabled={true}
            disabled={index === values?.items?.length - 1 && isPoByGateEntry}
          />
        </div>
      ),
      Manufacturer: (
        <div style={{ minWidth: "100%" }} className="custom-select-wrapper">
          <CustomSelect
            className="table-input"
            placeHolder={t("Manufacturer")}
            name="doctor"
            onChange={(label, value, val) =>
              handleManufacturer(label, value, val, index)
            }
            value={item?.manufacturer}
            option={DropDownState.ManufacturerData}
            isDisable={index === values?.items?.length - 1 && isPoByGateEntry}
          />

        </div>
      ),
      Unit: (
        <div
          style={{ minWidth: "50px", width: "100%" }}
        >
          <Input
            type="text"
            className="table-input"
            name="salesUnit"
            value={item.salesUnit}
            removeFormGroupClass={true}
            // onChange={(e) => handleInputChange(e, index, "salesUnit")}
            onChange={(e) =>
              handleCustomInput(
                index,
                "salesUnit",
                e.target?.value,
                "text",
                10000,
                item?.IsFree
              )
            }
            respclass="mt-1 w-100"
            disabled={index === values?.items?.length - 1 && isPoByGateEntry}
          />
        </div>
      ),
      "HSN Code": (
        <Input
          type="text"
          className="table-input"
          name="hsnCode"
          value={item.hsnCode}
          // onChange={(e) => handleInputChange(e, index, "hsnCode")}
          onChange={(e) =>
            handleCustomInput(
              index,
              "hsnCode",
              e.target?.value,
              "text",
              10000,
              item?.IsFree
            )
          }
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
          disabled={index === values?.items?.length - 1 && isPoByGateEntry}
        />
      ),
      Deal: (
        <div
          style={{ minWidth: "50px", width: "100%" }}
        >
          <Input
            type="text"
            disabled={true}
            className="table-input required-fields"
            name="deal"
            value={item?.isDeal || ""}
            onChange={(e) =>
              handleCustomInput(
                index,
                "deal",
                e.target?.value,
                "text",
                10000,
                item?.IsFree
              )
            }
            removeFormGroupClass={true}
            respclass="mt-1 w-100"

          />
        </div>
      ),
      QTY: (
        <div
          style={{ minWidth: "50px", width: "100%" }}
        >
          <Input
            type="text"
            className="table-input required-fields"
            name="qty"
            value={item.qty || ""}
            // max={isPoByGateEntry? item.qty: 600}
            // onChange={(e) =>
            //   handleCustomInput(
            //     index,
            //     "qty",
            //     e.target?.value,
            //     "number",
            //     10000,
            //     item?.IsFree
            //   )
            // }
            onKeyDown={(e) => handleDecimalKeyDown(e, 4)}
            onChange={(e) => {
              const newValue = e.target.value;
              if (validateDecimalInput(newValue, 13, 4)) {
                debugger
                handleCustomInput(
                  index,
                  "qty",
                  e.target?.value,
                  "number",
                  isPoByGateEntry ? backUpValues?.items[index].qty : 100000,
                  item?.IsFree
                )
              }
            }}
            removeFormGroupClass={true}
            respclass="mt-1 w-100"
            disabled={index === values?.items?.length - 1 && isPoByGateEntry}
          />
        </div>
      ),
      BillQTY: (
        <div
          style={{ minWidth: "50px", width: "100%" }}
        >
          <Input
            type="text"
            className="table-input required-fields"
            name="billQty"
            value={item.billQty || ""}
            // max={isPoByGateEntry? item.qty: 600}
            // onChange={(e) =>
            //   handleCustomInput(
            //     index,
            //     "qty",
            //     e.target?.value,
            //     "number",
            //     10000,
            //     item?.IsFree
            //   )
            // }
            onKeyDown={(e) => handleDecimalKeyDown(e, 4)}
            onChange={(e) => {
              const newValue = e.target.value;
              if (validateDecimalInput(newValue, 13, 4)) {
                handleCustomInput(
                  index,
                  "billQty",
                  e.target?.value,
                  "number",
                  isPoByGateEntry ? backUpValues?.items[index].qty : 100000,
                  item?.IsFree
                )
              }
            }}
            removeFormGroupClass={true}
            respclass="mt-1 w-100"
            disabled={index === values?.items?.length - 1 && isPoByGateEntry}
          />
        </div>
      ),
      Rate: (
        <div
          style={{ minWidth: "50px", width: "100%" }}
        >
          <Input
            type="text"
            disabled={isPoByGateEntry}
            className="table-input required-fields"
            name="rate"
            value={item.rate || ""}
            // onChange={(e) =>
            //   handleCustomInput(index, "rate", e.target?.value, "number", 10000)
            // }
            onKeyDown={(e) => handleDecimalKeyDown(e, 4)}
            onChange={(e) => {
              const newValue = e.target.value;
              if (validateDecimalInput(newValue, 13, 4)) {
                handleCustomInput(
                  index,
                  "rate",
                  e.target?.value,
                  "number",
                  1000000,
                  item?.IsFree
                )
              }
            }}
            removeFormGroupClass={true}
            respclass="mt-1 w-100"
          />
        </div>
      ),
      Batch: (
        <div
          style={{ minWidth: "50px", width: "100%" }}
        >
          <Input
            type="text"
            className="table-input required-fields"
            name="batch"
            value={item.batch}
            onChange={(e) =>
              handleCustomInput(index, "batch", e.target?.value, "text", 10000)
            }
            removeFormGroupClass={true}
            respclass="mt-1 w-100"
            disabled={index === values?.items?.length - 1 && isPoByGateEntry}
          />
        </div>
      ),
      MRP: (
        <div
          style={{ minWidth: "50px", width: "100%" }}
        >
          <Input
            type="text"
            className="table-input required-fields"
            name="MRP"
            // disabled={isPoByGateEntry}
            value={item?.MajorMRP}
            // onChange={(e) =>
            //   handleCustomInput(
            //     index,
            //     "MajorMRP",
            //     e.target?.value,
            //     "number",
            //     10000
            //   )
            // }

            onKeyDown={(e) => handleDecimalKeyDown(e, 4)}
            onChange={(e) => {
              const newValue = e.target.value;
              if (validateDecimalInput(newValue, 13, 4)) {
                handleCustomInput(
                  index,
                  "MajorMRP",
                  e.target?.value,
                  "number",
                  1000000,
                  item?.IsFree
                )
              }
            }}

            removeFormGroupClass={true}
            respclass="mt-1 w-100"
            disabled={index === values?.items?.length - 1 && isPoByGateEntry}
          />
        </div>
      ),
      "Disc(%)": (
        <Input
          type="text"
          className="table-input"
          name="discountPer"
          disabled={isPoByGateEntry}
          value={item.discountPer}
          // onChange={(e) =>
          //   handleCustomInput(
          //     index,
          //     "discountPer",
          //     e.target?.value,
          //     "number",
          //     100
          //   )
          // }
          onKeyDown={(e) => handleDecimalKeyDown(e, 4)}
          onChange={(e) => {
            const newValue = e.target.value;
            if (validateDecimalInput(newValue, 13, 4)) {
              handleCustomInput(
                index,
                "discountPer",
                e.target?.value,
                "number",
                10000,
                item?.IsFree
              )
            }
          }}
          readOnly={values?.billDiscPercentage > 0 ? true : false}
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
        />
      ),
      "Disc.Amt": (
        <Input
          type="text"
          className="table-input"
          name="discountAmt"
          disabled={isPoByGateEntry}
          value={item.discountAmt || ""}
          // onChange={(e) =>
          //   handleCustomInput(
          //     index,
          //     "discountAmt",
          //     e.target?.value,
          //     "number",
          //     10000
          //   )
          // }
          // onChange={(e) => handleInputChangeDisc(e, index, "discountAmt")}

          onKeyDown={(e) => handleDecimalKeyDown(e, 4)}
          onChange={(e) => {
            const newValue = e.target.value;
            if (validateDecimalInput(newValue, 13, 4)) {
              handleCustomInput(
                index,
                "discountAmt",
                e.target?.value,
                "number",
                10000,
                item?.IsFree
              )
            }
          }}
          readOnly={values?.billDiscPercentage > 0 ? true : false}
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
        />
      ),

      "GST Type": (
        <div style={{ minWidth: "70px", width: "100%" }} className="custom-select-wrapper w-100">
          {console.log(item, "vallsh")}
          <CustomSelect
            placeHolder={t("GST %")}
            name="GSTType"
            onChange={(val, e) =>
              handleCustomInput(index, "GSTType", e, "text", 10000)
            }
            value={item?.GSTType}
            option={GST_TYPE_OPTION}
            isDisable={index === values?.items?.length - 1 && isPoByGateEntry}
          />
        </div>
      ),
      "GSTCategory": (
        <div style={{ minWidth: "70px", width: "100%" }} className="custom-select-wrapper w-100">

          <CustomSelect
            placeHolder={t("GST TYPE")}
            name="GSTCategory"
            onChange={(val, e) =>
              handleCustomInput(index, "GSTCategory", e, "text", 10000)
            }
            value={item?.GSTCategory?.value ? item?.GSTCategory?.value : item?.GSTCategory}
            option={[
              { label: "IGST", value: "IGST" },
              { label: "CGST&SGST", value: "CGST&SGST" },
              { label: "CGST&UTGST", value: "CGST&UTGST" }
            ]}
            isDisable={index === values?.items?.length - 1 && isPoByGateEntry}
          />
        </div>
      ),
      // "gstTpe": (
      //   <div style={{width:"100%",minWidth:"90px"}}>
      //   <Input
      //     type="text"
      //     className="table-input"
      //     value={isSplitGST ? "CGST&SGST" : "IGST"}
      //     readOnly
      //     respclass="mt-1 w-100"
      //     disabled={index === values?.items?.length-1 && isPoByGateEntry}
      //   />
      //   </div>
      // ),
      "CGST(%)": (
        <Input
          type="number"
          className="table-input"
          name="CGST"
          value={item.CGST}
          onChange={(e) =>
            handleCustomInput(index, "CGST", e.target?.value, "number", 10000)
          }
          readOnly
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
          disabled={index === values?.items?.length - 1 && isPoByGateEntry}
        />
      ),
      "SGST/UTGST(%)": (
        <Input
          type="number"
          className="table-input"
          name="SGST"
          value={item.SGST}
          onChange={(e) =>
            handleCustomInput(index, "SGST", e.target?.value, "number", 10000)
          }
          readOnly
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
          disabled={index === values?.items?.length - 1 && isPoByGateEntry}
        />
      ),
      "IGST(%)": (
        <Input
          type="number"
          className="table-input"
          name="IGST"
          value={item.IGST}
          onChange={(e) =>
            handleCustomInput(index, "IGST", e.target?.value, "number", 10000)
          }
          readOnly
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
          disabled={index === values?.items?.length - 1 && isPoByGateEntry}
        />
      ),



      "Net Amt.": (
        <Input
          type="number"
          className="table-input"
          name="Net Amt"
          value={item?.IsFree ? 0 : item.netAmount}
          readOnly
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
          onChange={(e) =>
            handleCustomInput(
              index,
              "netAmount",
              e.target?.value,
              "number",
              10000
            )
          }
          disabled={index === values?.items?.length - 1 && isPoByGateEntry}
        />
      ),
      "CashRate": (
        <Input
          type="number"
          className="table-input"
          name="cashRate"
          value={item.cashRate}
          // onChange={(e) =>
          //   handleCustomInput(index, "IGST", e.target?.value, "number", 10000)
          // }
          readOnly
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
          disabled={index === values?.items?.length - 1 && isPoByGateEntry}
        />
      ),
      // "PanelRate": (
      //   <Input
      //     type="number"
      //     className="table-input"
      //     name="panelRate"
      //     value={item.panelRate}
      //     // onChange={(e) =>
      //     //   handleCustomInput(index, "IGST", e.target?.value, "number", 10000)
      //     // }
      //     readOnly
      //     removeFormGroupClass={true}
      //     respclass="mt-1 w-100"
      //   />
      // ),

      "ManufactureDate": (
        // <DatePicker
        //   className="custom-calendar"
        //   removeFormGroupClass={true}
        //   id="ManufactureDate"
        //   name="ManufactureDate"
        //   // value={new Date()}
        //   value={
        //     item?.ManufactureDate
        //       ? new Date(item?.ManufactureDate)
        //       : ""
        //   }

        //   handleChange={(value) =>
        //     handleCustomInput(index, "ManufactureDate", value, "text", 10000)
        //   }
        // />

        <CustomDateInput
          value={values?.items?.[index]?.ManufactureDate} // Set the value based on the current index
          onChange={(value) =>
            handleCustomInput(index, "ManufactureDate", value, "date", 10000)
          }
          // disabled={isExpirable?.map((val) => {
          //   if(val.IsExpirable === 0){
          //     return true;
          //   }else{
          //     return false;
          //   }
          // })}
          // disabled={isExpirable[index]?.IsExpirable === 1 || "YES" ? false : true}
          // disabled={String(item?.IsExpirable) === "1" ? false : true}
          index={index}
          className="custom-calendar required-fields calendar-icon custom-datepicker"
          disabled={index === values?.items?.length - 1 && isPoByGateEntry}
        />

      ),
      "Exp Date": (
        <CustomDateInput
          value={values?.items?.[index]?.expDate} // Set the value based on the current index
          onChange={(value) =>
            handleCustomInput(index, "expDate", value, "date", 10000)
          }
          // disabled={isExpirable?.map((val) => {
          //   if(val.IsExpirable === 0){
          //     return true;
          //   }else{
          //     return false;
          //   }
          // })}
          // disabled={isExpirable[index]?.IsExpirable === 1 || "YES" ? false : true}
          // disabled={String(item?.IsExpirable) === "1" ? false : true || index === values?.items?.length-1 && isPoByGateEntry}
          index={index}
          className="custom-calendar required-fields calendar-icon custom-datepicker"
        />
      ),
      Action: (
        <i
          className="fa fa-trash text-danger text-center p-2"
          onClick={() => {
            if (index === values?.items?.length - 1 && isPoByGateEntry) {
              return
            } else if (values?.items?.length === 1 || index === values?.items?.length - 1) {
              return
            }
            else {
              handleRemoveItem(index)

            }

          }}

        />
      ),
      // IsFree: (
      //   <input
      //     type="checkbox"
      //     checked={item?.IsFree}
      //     id="Active"
      //     onChange={(e) => handleCheckboxChange(e, index, "IsFree")}
      //     removeFormGroupClass={true}
      //     respclass="mt-1"
      //   />
      // ),
      // IsFree: item.IsFree ? (
      //   <input
      //     type="checkbox"
      //     checked={item?.IsFree}
      //     id={`checkbox-${index}`}
      //     onChange={(e) => handleCheckboxChange(e, index, "IsFree")}
      //     removeFormGroupClass={true}
      //     respclass="mt-1"
      //   />
      // ) : (
      //   <button
      //     className="btn btn-sm btn-primary"
      //     onClick={() => handleAddNewRow(index)}
      //   >
      //     +
      //   </button>
      // ),
      IsFree:
        item.isCheckbox || item?.IsFree ? (
          <input
            type="checkbox"
            checked={true}
            id={`checkbox-${index}`}
            onChange={(e) =>
              handleCustomInput(
                index,
                "IsFree",
                e.target?.checked,
                "number",
                10000
              )
            }
            removeFormGroupClass={true}
            respclass="mt-1"

          />
        ) : (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              if (index === values?.items?.length - 1 && isPoByGateEntry) {
                return
              } else {
                handleAddNewRow(index)
              }
            }

            }
          >
            {t("+")}
          </button>
        ),
      addItem: (
        <button
          className={`btn btn-sm btn-primary ${isPoByGateEntry ? "": "disable-reject"}`}
          onClick={() => {
            if (values?.items?.length === 1) {
              return
            }
            setValues((prev) => {
              const updatedData = [...prev.items]
              const deepCopy = JSON.parse(JSON.stringify(item));
              updatedData.splice(index + 1, 0, deepCopy)
              return {
                ...prev,
                items: updatedData
              }
            })
            if (isPoByGateEntry) {

              setBackUpValues((prev) => {
                const updatedData = [...prev.items]
                updatedData.splice(index + 1, 0, item)
                return {
                  items: updatedData
                }
              })
            }
          }}
        >
          {t("+")}
        </button>
      ),

    };
  };

  console.log(values, "valuesvaluesvalues")
  console.log(backUpValues, "backupValues")
  const handeAdd = (item) => {

    debugger
    const updatedItems = item?.map((val, index) => {
      ;

      const cashRate = val?.ActualAmount / val?.OrderedQty + ((val?.ActualAmount / val?.OrderedQty) / 100 * val?.ExtraSellingCharge);
      if (val?.GSTType === "CGST&SGST") {
        setIsSplitGST(true)
      }
      return {
        purchaseOrderNo: val?.PurchaseOrderNo,
        ExtraSellingCharge: val?.ExtraSellingCharge,
        netAmount: val?.ActualAmount || 0,
        cashRate: parseFloat(cashRate > val?.MRP ? val?.MRP : cashRate).toFixed(2),
        ItemID: val?.ItemID,
        itemName: val?.ItemName,
        // ManufactureDate: val.ManufactureDate,
        manufacturer: val?.ManufactureID,
        salesUnit: `${val?.MajorUnit}/${val?.MinorUnit}`,
        hsnCode: val?.HSNCode,
        CGST: val?.CGSTPercent,
        SGST: val?.SGSTPercent,
        IGST: val?.IGSTPercent,
        MinorUnit: val?.MinorUnit,
        MajorUnit: val?.MajorUnit,
        SubCategoryID: val?.SubCategoryID,
        qty: val?.OrderedQty || 0,
        rate: val?.Rate || 0,
        StockID: val?.StockID || "", // Assuming this property might be missing
        LedgerTnxNo: val?.LedgerTransactionNo || "", // Assuming this property might be missing
        mrp: val?.MRP || 0,
        MajorMRP: val?.MRP || 0,
        totalmrp: val?.RecievedQty * val?.Rate || 0,
        batch: val?.BatchNo || "",
        discountPer: val?.Discount_p || 0,
        GSTType: String(val?.VATPer),
        expDate: val?.ExpiryDate ? new Date(val.ExpiryDate) : mmyy,
        ManufactureDate: val.ManufactureDate ? val.ManufactureDate : mmyy,
        discountAmt:
          (parseFloat(val?.Discount_p || 0) / 100) *
          parseFloat((val?.RecievedQty || 0) * (val?.Rate || 0)),
        // netAmount:
        //   val.Discount_p > 0
        //     ? parseFloat((val?.Rate || 0) * (val?.RecievedQty || 0)).toFixed(2)
        //     : parseFloat(
        //       (val?.RecievedQty || 0) *
        //       (val?.Rate || 0) *
        //       (1 + (val?.VATPer || 0) / 100)
        //     ).toFixed(2),
        CGSTAmt:
          (parseFloat((val.RecievedQty || 0) * (val.Rate || 0)) -
            parseFloat(
              (parseFloat(val.Discount_p || 0) / 100) *
              parseFloat((val.RecievedQty || 0) * (val.Rate || 0))
            )) *
          ((val.CGSTPercent || 0) / 100),
        SGSTAmt:
          (parseFloat((val.RecievedQty || 0) * (val.Rate || 0)) -
            parseFloat(
              (parseFloat(val.Discount_p || 0) / 100) *
              parseFloat((val.RecievedQty || 0) * (val.Rate || 0))
            )) *
          ((val.SGSTPercent || 0) / 100),
        IGSTAmt:
          (parseFloat((val.RecievedQty || 0) * (val.Rate || 0)) -
            parseFloat(
              (parseFloat(val.Discount_p || 0) / 100) *
              parseFloat((val.RecievedQty || 0) * (val.Rate || 0))
            )) *
          ((val.IGSTPercent || 0) / 100),
      }
    });

    setValues((val) => ({
      ...val,
      // GRNItemListdata: data,
      items: updatedItems,
      // LedgerNumber: String(item[0]?.VendorID),
      LedgerNumber: {
        value: item[0]?.VendorID,
        label: item[0]?.VendorName,
      },
      // StoreType: StoreType,
      // LedgerNumber: {
      //   value: dataList.data.VendorId,
      //   label: dataList.data.LedgerName,
      // },
      // fromDate: new Date(dataList.data.InvoiceDate || "0001-01-01"),
      // toDateDate: new Date(dataList.data.ChalanDate || "0001-01-01"),
      // InvoiceNo: dataList.data.InvoiceNo,
      // DeliveryNo: dataList.data.ChalanNo,
      // narration: dataList.data.Naration,
    }));


    setBackUpValues((val) => ({
      ...val,
      // GRNItemListdata: data,
      items: updatedItems,
      // LedgerNumber: String(item[0]?.VendorID),
      LedgerNumber: {
        value: item[0]?.VendorID,
        label: item[0]?.VendorName,
      },
    }));
    setIsPoByGateEntry(true)




  };

  const handleOpenIndent = async ({
    label,
    width,
    type,
    CallAPI,
    buttonName,
    data,
  }) => {
    setModalData({
      visible: true,
      width: width,
      label: label,
      buttonName: buttonName,

      footer: (
        <>
          {/* <button  className=" btn btn-sm btn-success">
  Cancel
</button> */}
        </>
      ),
      Component: (
        <GRNPurchaseOrderModal
          payload2={data}
          dataoption={DropDownState.BindVendorData}
          setModalData={setModalData}
          handeAdd={handeAdd}
          setSelectedPOs={setSelectedPOs}
        />
      ),
    });
  };

  const recalculateAllItems = (items) => {
    return items.map((item) => {
      const qty = parseFloat(item.qty) || 0;
      const rate = parseFloat(item.rate) || 0;
      const discountPer = parseFloat(item.discountPer) || 0;
      const conversionFactor = parseFloat(item.ConversionFactor) || 1;
      const gstPercent = parseFloat(item.GSTType) || 0;

      const rateAfterDisc = rate - (rate * discountPer) / 100;
      const grossAmt = rate * qty * conversionFactor - (rate * qty * discountPer) / 100;

      let CGST = 0, SGST = 0, IGST = 0;
      let CGSTAmt = 0, SGSTAmt = 0, IGSTAmt = 0;

      const gstCat = item.GSTCategory?.value || item.GSTCategory;
      if (gstCat === "CGST&SGST" || gstCat === "CGST&UTGST") {
        CGST = gstPercent / 2;
        SGST = gstPercent / 2;
        CGSTAmt = (grossAmt * CGST) / 100;
        SGSTAmt = (grossAmt * SGST) / 100;
      } else {
        IGST = gstPercent;
        IGSTAmt = (grossAmt * IGST) / 100;
      }

      const totalGST = CGST + SGST + IGST;
      const unitPrice = rateAfterDisc + (rateAfterDisc * totalGST) / 100;
      const netAmount = unitPrice * qty;
      const extraCharge = parseFloat(item?.ExtraSellingCharge) || 0;
      const cashRate = unitPrice + (unitPrice * extraCharge) / 100;

      return {
        ...item,
        CGST,
        SGST,
        IGST,
        CGSTAmt,
        SGSTAmt,
        IGSTAmt,
        discountAmt: (rate * discountPer * qty) / 100,
        netAmount: netAmount.toFixed(2),
        cashRate: parseFloat(
          cashRate > item.MajorMRP ? item.MajorMRP : cashRate || 0
        ).toFixed(2),
        panelRate: rate + (item.MajorMRP - rateAfterDisc),
        totalTaxCGSTCGSTAmt: rateAfterDisc * (CGST + SGST) * qty / 100,
      };
    });
  };



  const handleGRNSameStateBuyierSupplier = async (VendorID) => {

    try {
      const response = await GRNSameStateBuyierSupplier(VendorID)
      debugger
      // if (response.success) {
      //   const data = response?.data[0]?.GSTType

      //   let updatedData = { ...values }
      //   const newValues = updatedData?.items?.map(item => {
      //     debugger
      //     return {
      //       ...item,
      //       GSTCategory: data
      //     }

      //   })
      //   updatedData["items"] = newValues
      //   setValues(updatedData)
      // }
      if (response.success) {
        const data = response?.data[0]?.GSTType;
        let updatedData = { ...values };
        updatedData.items = updatedData.items.map((item) => ({
          ...item,
          GSTCategory: data,

        }));

        const newItems = recalculateAllItems(updatedData.items);
        setValues((prev) => ({ ...prev, items: newItems }));
      }

      else {
        setValues(values)
      }
    } catch (error) {

      console.error("Something went wrong", error);

    }
  }

  useEffect(() => {
    if (values?.LedgerNumber?.value) {
      handleGRNSameStateBuyierSupplier(values?.LedgerNumber?.value)
    }
  }, [values?.LedgerNumber]);


  return (
    <>

      {modalData?.visible && (
        <Modal
          visible={modalData?.visible}
          setVisible={() => {
            setModalData({ visible: false });
          }}
          modalData={modalData?.modalData}
          modalWidth={modalData?.width}
          Header={modalData?.label}
          buttonType="button"
          buttonName={modalData?.buttonName}
          footer={modalData?.footer}
          handleAPI={modalData?.CallAPI}
        >
          {modalData?.Component}
        </Modal>
      )}





      <div className="card patient_registration border">
        <Heading title={"Admitted Patients"} isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Store Type")}
            id={"StoreType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: " Medical Store", value: "STO00001" },
              { label: "General Store", value: "STO00002" },
            ]}
            name="StoreType"
            handleChange={handleReactSelect}
            value={values?.StoreType.value}
            requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("Supplier")}
            id={"LedgerNumber"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[...handleReactSelectDropDownOptions(DropDownState.BindVendorData, "label", "VendorID")]}
            name="LedgerNumber"
            handleChange={handleReactSelect}
            value={values?.LedgerNumber?.value}
            requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("Payment Type")}
            id={"paymentType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Credit", value: "4" },
              { label: "Cash", value: "1" },
              ...DropDownState?.paymentModeData?.map((item) => {
                return {
                  label: item.PaymentMode,
                  value: item.PaymentModeID,
                };
              }),
            ]}
            name="paymentType"
            value={values.paymentType}
            handleChange={handleReactSelectChange}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className={`form-control ${values.GRNType === "0" || values.GRNType === "3" ? "required-fields" : ""}`}
            lable={t("Invoice No.")}
            placeholder=" "
            id="InvoiceNo"
            name="InvoiceNo"
            onChange={handleChange}
            value={values?.InvoiceNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className={`form-control ${values.GRNType === "0" || values.GRNType === "3" ? "required-fields" : ""}`}
            lable={t("Invoice Amount")}
            placeholder=" "
            id="invoiceAmount"
            name="invoiceAmount"
            // onChange={(e)=>{
            //   handleChange()
            // }}
            // onKeyDown={(e) => handleDecimalKeyDown(e, 2)}
            onChange={(e) => {
              const newValue = e.target.value;
              if (validateDecimalInput(newValue, 13, 2)) {
                handleChange(e)
              }
            }}
            value={values?.invoiceAmount}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          {/* {console.log(
            "Raw Invoice Date from state:",
            state?.data?.InvoiceDate
          )} */}

          <DatePicker
            className={`custom-calendar ${values.GRNType === "0" || values.GRNType === "3" ? "required-fields" : ""}`}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="InvoiceDate"
            name="InvoiceDate"
            value={
              values?.InvoiceDate
                ? moment(values.InvoiceDate, [
                  "YYYY-MM-DD",
                  "DD-MMM-YYYY",
                ]).isValid()
                  ? moment(values.InvoiceDate, [
                    "YYYY-MM-DD",
                    "DD-MMM-YYYY",
                  ]).toDate()
                  : null
                : state?.data?.InvoiceDate &&
                  moment(state.data.InvoiceDate, [
                    "YYYY-MM-DD",
                    "DD-MMM-YYYY",
                  ]).isValid()
                  ? moment(state.data.InvoiceDate, [
                    "YYYY-MM-DD",
                    "DD-MMM-YYYY",
                  ]).toDate()
                  : null
            }
            // value={moment(values?.InvoiceDate , ["YYYY-MM-DD", "DD-MMM-YYYY"]).isValid() ? moment(values?.InvoiceDate , ["YYYY-MM-DD", "DD-MMM-YYYY"]).toDate() : null }
            lable={t("Invoice Date")}
            handleChange={handleChange}
            placeholder={VITE_DATE_FORMAT}
          />

          <Input
            type="text"
            className={`form-control ${values.GRNType === "1" || values.GRNType === "3" ? "required-fields" : ""}`}
            lable={t("Challan/Delivery")}
            // lable={t("Delivery No.")}
            placeholder=" "
            id="DeliveryNo"
            name="DeliveryNo"
            onChange={handleChange}
            value={values?.DeliveryNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <DatePicker
            className={`custom-calendar ${values.GRNType === "1" || values.GRNType === "3" ? "required-fields" : ""}`}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            value={
              values?.toDate
                ? moment(values?.toDate, "YYYY-MM-DD").toDate()
                : null
            }
            handleChange={(date) => handleChange(date)}
            // onChange={handleChange}
            lable={t("Challan/Delivery Date")}
            placeholder={VITE_DATE_FORMAT}
          />
          <ReactSelect
            placeholderName={t("GRN Type")}
            id={"type"}
            removeIsClearable={true}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: t("Invoice"), value: "0" },
              { label: t("Delivery"), value: "1" },
              { label: t("Delivery with Invoice"), value: "3" },
            ]}
            name="GRNType"
            value={values.GRNType}
            handleChange={handleReactSelectChange}
          // requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("Transport")}
            id={"transport"}
            removeIsClearable={true}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: t("By Hand"), value: "By Hand" },
              { label: t("Tempo"), value: "Tempo" },
              { label: t("Truck"), value: "Truck" },
              { label: t("Rickshaw"), value: "Rickshaw" },
              { label: t("Others"), value: "Others" },
            ]}
            name="transport"
            value={values.transport}
            handleChange={handleReactSelectChange}
          // requiredClassName="required-fields"
          />
          <Input
            type="text"
            className={`form-control`}
            lable={t("vehicle No.")}
            placeholder=" "
            id="vehicleNo"
            name="vehicleNo"
            onChange={handleChange}
            // onKeyDown={(e) => handleDecimalKeyDown(e, 2)}
            // onChange={(e) => {
            //   const newValue = e.target.value;
            //   if (validateDecimalInput(newValue, 13, 2)) {
            //     handleChange(e)
            //   }
            // }}
            value={values?.vehicleNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />




          <div className="col-sm-1">
            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                handleOpenIndent({
                  label: t("Purchase Orders"),
                  width: "60vw",
                  type: "draft",
                  // buttonName: "Search",
                  data: values,
                });
              }}
            >
              {t("Purchase Order's")}
            </button>
          </div>





















        </div>
        {selectedPOs.length > 0 && <div className="col-12 mt-3">
          <label className="displayShow">{t("Selected PO's")}</label>
          <div
            className="doctorBind"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "5px",
              padding: "8px 6px",
            }}
          >
            {selectedPOs?.map((item, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <span style={{ marginRight: "8px" }}>
                  {item}
                </span>

              </div>
            ))}
          </div>
        </div>}


        {/* {console.log("values payload", values)} */}
        <div className="table-responsive mt-3">
          {/* {console.log("values?.itemsvalues?.items", values?.items)} */}
          <Tables
            thead={THEAD}
            tbody={values?.items?.map(formatRowData)}
            // tableHeight="tableHeight"
            style={{ maxHeight: "auto" }}
            tableHeight={"scrollView"}
          />
        </div>
        {/* <div className="col-sm-12 text-right">
          <button
            className="btn btn-primary mt-2"
            onClick={() => handleAddItem(ItemIndexValue)} 
          >
            {t("Add Item")}
          </button>
        </div> */}
      </div>
      <div className="card">
        <div className="row p-2">
          <Input
            type="number"
            id="grossAmount"
            name="grossAmount"
            className="form-control"
            lable={t("Gross Amount")}
            placeholder=" "
            value={totalAmount}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
            readOnly
          />
          <Input
            type="number"
            className="form-control"
            lable={t("Bill Disc(%)")}
            placeholder=" "
            id="billDiscPercentage"
            name="billDiscPercentage"
            value={values?.billDiscPercentage}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
            onChange={handleChangeBillDis}
            readOnly={values.items.some((item) =>
              parseFloat(item.discountAmt) > 0 ? true : false
            )}
          />
          <Input
            type="number"
            className="form-control"
            lable={t("Bill Disc Amt")}
            placeholder=" "
            id="billDiscAmt"
            name="billDiscAmt"
            value={values?.billDiscAmt}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
            onChange={handleChangeBillDis}
            readOnly={values?.items.some((item) =>
              parseFloat(item?.discountAmt) > 0 ? true : false
            )}
          />
          <Input
            type="number"
            className="form-control"
            lable={t("Round Off")}
            placeholder=" "
            id="roundOff"
            name="roundOff"
            value={values?.roundOff}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            readOnly
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="number"
            className="form-control"
            lable={t("CGST & SGST Amt")}
            placeholder=" "
            id="cgstSgstAmt"
            name="cgstSgstAmt"
            value={cgstSgstAmt.toFixed(2)}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            readOnly
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="number"
            className="form-control"
            lable={t("Freight Charges")}
            placeholder=" "
            id="freightCharges"
            name="freightCharges"
            value={values?.freightCharges || "0.00"}
            onChange={(e) => {
              const { name, value } = e.target;
              setValues((prev) => ({
                ...prev,
                [name]: value,
              }))
            }}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="number"
            className="form-control"
            lable={t("IGST Amt")}
            placeholder=" "
            id="igstAmt"
            name="igstAmt"
            value={IgstAmt.toFixed(2)}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            readOnly
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="number"
            className="form-control"
            lable={t("Total Discount Amt")}
            placeholder=" "
            id="totalDiscountAmt"
            name="totalDiscountAmt"
            value={TotalDisAmount.toFixed(2)}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            readOnly
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control required-fields"
            lable={t("Narration")}
            placeholder=" "
            id="narration"
            name="narration"
            value={values?.narration}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          {/* {console.log("Currency", values.CurrencyDetail)} */}
          {/* {console.log(
            "currencies",
            values.CurrencyDetail?.find(
              (currency) => currency.label === state?.data?.Currency
            )?.value || null
          )} */}
          {/* {console.log("SelectedCurrency", values.CurrencyDetail)} */}
          {
            console.log("SelectedCurrency", SelectedCurrency)
          }
          <ReactSelect
            placeholderName={t("Currency")}
            id={"Currency"}
            searchable={true}
            name={"Currency"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            style={{ width: "100px" }}
            // dynamicOptions={values.CurrencyDetail}
            // dynamicOptions={[
            //   { label: t("Invoice"), value: "0" },
            //   { label: t("Delivery"), value: "1" },
            //   { label: t("Delivery with Invoice"), value: "3" },
            // ]}
            // dynamicOptions={[
            //   {
            //     value: 14,
            //     label: "INR",
            //   },
            //   {
            //     value: 394,
            //     label: "USD",
            //   },
            // ]}
            dynamicOptions={values?.CurrencyDetail}
            handleChange={(val, e) =>
              handleInputChangeCurrency(val, e, "Currency")
            }
            // value={
            //   SelectedCurrency
            //     ? SelectedCurrency?.value
            //     : state?.data?.Currency &&
            //     values.CurrencyDetail?.find(
            //       (currency) => currency.label === state?.data?.Currency
            //     )?.value
            // }
            value={
              values?.Currency?.value
            }
            removeIsClearable={false}
            requiredClassName="required-fields"
          />
          <Input
            type="number"
            className="form-control"
            lable={t("GRN Amt")}
            placeholder=" "
            id="grnAmt"
            name="grnAmt"
            value={TotalGRNAmount.toFixed(2)}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            readOnly
            onKeyDown={Tabfunctionality}
          />

          <div className="button-group col-xl-2 col-md-4 col-sm-4 col-12">
            <button
              className="btn btn-primary save-button mx-2"
              onClick={handleSave}
            // disabled={SaveDisable}
            >
              {typeof state?.GRNNo !== "undefined"
                ? t("Update")
                : t("Save")}
            </button>
            <button
              className="btn btn-secondary cancel-button"
              onClick={handleCancel}
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GateEntry;
