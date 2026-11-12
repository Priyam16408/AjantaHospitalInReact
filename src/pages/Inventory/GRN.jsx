import React, { useEffect, useState } from "react";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../components/UI/Heading";
import moment from "moment";
import DatePicker from "../../components/formComponent/DatePicker";
import { Tabfunctionality } from "../../utils/helpers";
import Input from "../../components/formComponent/Input";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { LoadCurrencyDetail } from "../../networkServices/PaymentGatewayApi";
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
import CustomDateInput from "../../components/formComponent/CustomDateInput";
import { GST_TYPE_OPTION } from "../../utils/constant";

const GRN = () => {
  const location = useLocation();
  const [state, setState] = useState(location?.state);

  const { VITE_DATE_FORMAT } = import.meta.env;
  const localData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [modalData, setModalData] = useState({ visible: false });
  const [isSplitGST, setIsSplitGST] = useState(false);
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
    Currency: 0,
    items: [
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
        IsExpirable: 0,
        MajorMRP: 0,
        isDeal: "0",
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
  const [values, setValues] = useState({ ...initialValues });
  const [SelectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedCurrencyName, setSelectedCurrencyName] = useState(null);
  const handleAddNewRow = (index) => {
    setValues((prevValues) => {
      const updatedItems = [...prevValues.items];
      const newRow = {
        ...updatedItems[index],
        discountPer: "0",
        discountAmt: "0",
        netAmount: "0",
        qty: "0",
        IsFree: 1,
        isCheckbox: true,
      };

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
  const handleReactSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };

  const handleInputChange = (e, index, field, IsFree = 0) => {
    const { value } = e.target;
    const item = [...values.items];
    item[index][field] = value;

    if (
      field == "rate" ||
      field == "qty" ||
      field == "discountPer" ||
      field == "MajorMRP"
    ) {

    }
  };
  const handleCustomInput = (
    index,
    name,
    value,
    type,
    max = 9999999999999,
    IsFree = 0,
    BodyData = values.items
  ) => {
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
        const cgstAmt = totalTaxCGSTCGSTAmt / 2;
        const sgstAmt = totalTaxCGSTCGSTAmt / 2;
        const igstAmt = 0;
        const netAmount = unitPrice * qty;
        if (name === "qty") {
          data[index]["netAmount"] = netAmount;
          data[index]["discountAmt"] = discAmt;
        } else {
          data[index]["netAmount"] = netAmount;

          data[index]["discountAmt"] = discAmt;
        }
        data[index]["CGSTAmt"] = cgstAmt;
        data[index]["SGSTAmt"] = sgstAmt;
        data[index]["IGSTAmt"] = igstAmt;
        data[index][name] = value;

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
      const updateGSTValues = (item, gstValue) => {
        const gstPercent = parseFloat(gstValue?.value || 0);

        if (isSplitGST) {
          item.CGST = gstPercent / 2;
          item.SGST = gstPercent / 2;
          item.IGST = 0;
        } else {
          item.CGST = 0;
          item.SGST = 0;
          item.IGST = gstPercent;
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

        return {
          ...item,
          discountAmt,
          CGSTAmt: totalTaxCGSTSGST / 2,
          SGSTAmt: totalTaxCGSTSGST / 2,
          IGSTAmt: (rateAfterDisc * item.IGST * qty) / 100,
          netAmount: unitPrice * qty,
          totalTaxCGSTCGSTAmt: totalTaxCGSTSGST,
        };
      };

      if (name === "GSTType") {
        const updatedItem = updateGSTValues({ ...data[index] }, value);
        const calculatedItem = calculateItemAmounts(updatedItem);
        const updatedData = [...data];
        updatedData[index] = calculatedItem;
        setValues((prev) => ({ ...prev, items: updatedData }));
        return;
      }
      const cgstAmt = totalTaxCGSTCGSTAmt / 2;
      const sgstAmt = totalTaxCGSTCGSTAmt / 2;
      const igstAmt = 0;
      data[index]["netAmount"] = netAmount;
      data[index]["CGSTAmt"] = cgstAmt;
      data[index]["SGSTAmt"] = sgstAmt;
      data[index]["IGSTAmt"] = igstAmt;
      if (name === "expDate") {

        data[index]["expDate"] = value;
      }
      if (name === "ManufactureDate") {
        console.log("valueabc", value)
        data[index]["ManufactureDate"] = moment(value?.value).format("YYYY-MM-DD");
        console.log("data[index]", data[index]["ManufactureDate"])
      }

      if (name === "batch") {
        data[index]["batch"] = value;
      }
      if (name === "hsnCode" || name === "salesUnit") {
        data[index][name] = value

      }
    }
    setValues((val) => ({ ...val, items: data }));
  };





  const calculateNetAmount = (item) => {

    const quantity = parseFloat(item.InitialCount) || 0; // Ensure it picks the correct field
    const rate = parseFloat(item.Rate) || 0;
    const conversionFactor = parseFloat(item.conversionFactor) || 1;

    const ratePerUnit = rate / conversionFactor;
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

    return netAmount.toFixed(2);
  };

  const GRNView = async (GRNNo, StoreType, dataList) => {
    if (typeof StoreType != "undefined") {
      const payloadIsReject = {
        GRNNo: GRNNo,
        StoreType: StoreType?.value,
      };
      try {
        const response = await BindGRNItems(payloadIsReject);

        if (response?.success) {
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
            const netAmount = (
              parseFloat(taxableAmount) + parseFloat(totalTax)
            ).toFixed(2);

            return {
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
              rate: val.Rate,
              StockID: val.StockID,
              LedgerTnxNo: val.LedgerTnxNo,
              mrp: val.MRP,
              totalmrp: val.Rate,
              batch: val.BatchNumber,
              discountPer: val.DiscPer,
              GSTType: val?.GSTType,
              MajorMRP: val?.MajorMRP,
              expDate: val?.MedExpiryDate,
              ManufactureDate: val?.ManufactureDate,
              discountAmt: discountAmt,
              netAmount: calculateNetAmount(val),
              CGSTAmt: cgstAmt,
              SGSTAmt: sgstAmt,
              IGSTAmt: igstAmt,
              isDeal: val?.IsDeal,
            };
          });
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
            type: "update",
          }));
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
    if (e instanceof Date) {
      name = "InvoiceDate";
      value = e;
    } else {
      const { name: inputName, value: inputValue } = e.target || {};
      name = inputName;
      value = inputValue;
    }
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
  const handleItemSelect = (label, value, val, index) => {

    const updatedItems = [...values.items];

    updatedItems[index] = {
      ...updatedItems[index],
      ItemID: val.ItemID,
      itemName: val.ItemName,
      manufacturer: val.ManufactureID,
      salesUnit: val.majorUnit + "/" + val.minorUnit,
      hsnCode: val.HSNCode,
      CGST: val.CGSTPercent,
      SGST: val.SGSTPercent,
      IGST: val.IGSTPercent,
      expDate: val.expDate,
      ManufactureDate: val.ManufactureDate,
      GSTType: val.GSTType,
      MajorUnit: val.majorUnit,
      MinorUnit: val.minorUnit,
      SubCategoryID: val.SubCategoryID,
      IsExpirable: val.IsExpirable,
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
    fetchGST();
    fetchManufacturer();
    fetchCurrencyDetail();
    fetchVendor();
    dispatch(GetBindDepartment());
    const response = GRNView(state?.GRNNo, state?.StoreType, state);
    if (response?.success) {
    }
  }, []);

  const fetchManufacturer = async () => {
    const payLoadList = {};
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
    const payLoadList = {};
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
    const payLoadList = {};
    try {
      const response = await BindVendor(payLoadList);
      if (response?.data) {
        setDropDownState((prevState) => ({
          ...prevState,
          BindVendorData: handleReactSelectDropDownOptions(response.data, "LedgerName", "LedgerNumber"),
        }));
      }
    } catch (error) {
      console.error("Error fetching item names: ", error);
    }
  };

  const fetchCurrencyDetail = async () => {
    try {
      const response = await LoadCurrencyDetail();
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
  const handleManufacturer = (label, value, val, index) => {
    const updatedItems = [...values.items];
    updatedItems[index] = {
      ...updatedItems[index],
      manufacturer: value?.value,
    };
    setValues({ ...values, items: updatedItems });
  };
  const calculateTotalAmount = () => {
    return values.items.reduce((total, item) => {
      return total + Number(item.qty) * Number(item.rate);
    }, 0);
  };

  const totalAmount = calculateTotalAmount();

  const calculateTotalGRNAmount = () => {
    const TotalGRNAmount =
      parseFloat(values?.freightCharges || "0.00") +
      values.items.reduce((total, item) => {
        return total + parseFloat(item?.IsFree ? 0 : item.netAmount);
      }, 0);
    values.roundOff = (Math.round(TotalGRNAmount) - TotalGRNAmount).toFixed(2);
    return Math.round(TotalGRNAmount);
  };
  const calculateTotalDisAmount = () => {
    return values.items.reduce((total, item) => {
      return total + parseFloat(item.discountAmt?item.discountAmt:0);
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

  const handleSave = async () => {
    
    if (typeof values.LedgerNumber == "undefined" ||
      values?.LedgerNumber == ""
    ) {
      return notify(t("Please Select Supplier"), "error");
    } else if (!values?.InvoiceNo) {
      return notify(t("Please Enter Invoice Number"), "error");
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
    } else if (values?.Currency?.value === "" || values?.Currency?.value === null) {
      return notify(t("Please Select Currency."), "error");
    } else if (
      typeof values.narration == "undefined" ||
      values.narration.trim() == ""
    ) {
      return notify(t("Please Select Narration."), "error");
    } else if (values?.qty) {
      return notify(t("Quantity can not be 0", "error"));
    }

    const validItems = values.items.filter(
      (item) => item.itemName && item.itemName.trim() !== ""
    );

    if (validItems.length === 0) {
      return notify("At least one valid item is required.", "error");
    }
    const payload = {
      dataInvoice: [
        {
          InvoiceNo: values.InvoiceNo,
          ChalanNo: values.DeliveryNo,
          InvoiceDate: moment(values.fromDate, "YYYY-MM-DD").format(
            "DD-MMM-YYYY"
          ),
          ChalanDate: "01-Jan-2001",
          VenLedgerNo: values.LedgerNumber.value,
          WayBillNo: "",
          WayBillDate: "",
          GrossBillAmount: totalAmount.toFixed(2),
          NetAmount: TotalGRNAmount.toFixed(2),
          RoundOff: parseFloat(values.roundOff),
          DiscAmount: validItems?.discountAmt,
          GatePassIn: "",
          StoreLedgerNo: values.StoreType.value,
          PaymentModeID: values.paymentType,
          PONumber: "",
          otherCharges: 0,
          currencyCountryID: values?.Currency,
          currency: selectedCurrencyName || state?.data?.Currency,
          CurrencyFactor: "1.000000",
          FreightCharge: values?.freightCharges || "0.00",
        },
      ],

      dataItemDetails: validItems.map((item, index) => ({
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
        IsReturn: 0,
        MedExpiryDate: item?.expDate || "",
        StoreLedgerNo: values.StoreType.value,
        Naration: values.narration,
        IsFree: item.IsFree ? 1 : 0,
        SubCategoryID: item.SubCategoryID,
        Rate: parseFloat(item.rate),
        DiscPer: item.discountPer,
        DiscAmt: item.discountAmt,
        PurTaxPer: item.CGST + item.SGST + item.IGST,
        PurTaxAmt: item.SGSTAmt + item.IGSTAmt + item.CGSTAmt,
        SaleTaxPer: item.CGST + item.SGST + item.IGST,
        MajorUnit: item.MajorUnit,
        MinorUnit: item.MinorUnit,
        ConversionFactor: item?.ConversionFactor || 1,
        MajorMRP: item?.MajorMRP,
        InvoiceNo: values.InvoiceNo,
        ChalanNo: values.DeliveryNo,
        manufactureDate: String(item?.ManufactureDate ? moment(item?.ManufactureDate).format("YYYY-MM-DD") : ""),
        // manufactureDate:String( values?.ManufactureDate?moment(values?.ManufactureDate).format("YYYY-MM-DD"):""),
        InvoiceDate: moment(values.fromDate, "YYYY-MM-DD").format(
          "DD-MMM-YYYY"
        ),
        ChalanData: "01-Jan-2001",
        VenLedgerNo: values.LedgerNumber.value,
        LedgerTnxNo: item.LedgerTnxNo,
        InvoiceAmount: parseFloat(item.netAmount),
        ipAddress: localStorage.ipAddress,
        IsExpirable: item?.IsExpirable,
        isDeal: item?.isDeal,
        HSNCode: item.hsnCode,
        GSTType: item.GSTType,
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
      })),
      isConsignment: 0,
      consignmentNumber: 0,
      ...(state?.GRNNo && {
        ledgerTransationNo: state?.GRNNo,
        EditGRNNo: state?.data?.BillNo,
      }),
    };
    if (typeof state?.GRNNo === "undefined") {
      try {
        const response = await SaveGRN(payload);
        if (response?.success) {
          notify(response?.message, "success");
          const payload2 = { hos_GRN: response?.data.ledgerTnxNo };
          const response1 = await ReprintGRN(payload2);
          RedirectURL(response1?.data?.pdfUrl);
          await handleCancel();
          setSelectedCurrency(null);
        } else {
          notify(response?.message, "error");
        }
      } catch (error) {
        console.error("Something went wrong", error);
      }
    } else {
      try {
        const response = await UpdateGRN(payload);
        if (response?.success) {
          notify(response?.message, "success");
          const payload2 = { hos_GRN: response?.data.ledgerTnxNo };
          const response1 = await DirectGRNReport(payload2);
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
  const handleInputChangeCurrency = (e, index, field) => {
    setValues({ ...values, [field]: index?.value });
    setSelectedCurrency(index?.value);
    setSelectedCurrencyName(index?.label);
    // console.log("SelectedCurrency", SelectedCurrency);
  }
  const THEAD = [
    { name: t("Item Name"), className: "col-xl-2 col-md-4 col-sm-4 col-12" },
    { name: t("ManuFacturer"), className: "col-xl-2 col-md-4 col-sm-4 col-12" },
    { name: t("UNIT"), width: "6%" },
    { name: t("HSN Code"), width: "4%" },
    { name: t("Deal"), width: "4%" },
    { name: t("Qty"), width: "4%" },
    { name: t("Rate"), width: "4%" },
    { name: t("Batch"), width: "4%" },
    { name: t("MRP"), width: "4%" },
    { name: t("Disc(%)"), width: "1%" },
    { name: t("Disc.Amt") },
    { name: t("GST Type"), width: "11%" },
    { name: t("CGST(%)"), width: "1%" },
    { name: t("SGST/UTGST(%)"), width: "1%" },
    { name: t("IGST(%)"), width: "1%" },
    { name: t("Net Amt."), width: "6%" },
    { name: t("Manufacturing Date"), width: "8%" },
    { name: t("Exp Date"), width: "8%" },

    { name: t("Action") },
    { name: t("Is Free") },
  ];

  const formatRowData = (item, index) => {

    return {
      "Item Name": (
        <div style={{ height: "20px", minWidth: "100%" }}>
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
          />
        </div>
      ),
      Unit: (
        <Input
          type="text"
          className="table-input"
          name="salesUnit"
          value={item.salesUnit}
          removeFormGroupClass={true}
          onChange={(e) => handleCustomInput(index, "salesUnit", e.target?.value, "text", 10000)}
          // onChange={(e) => handleInputChange(e, index, "salesUnit")}
          respclass="mt-1 w-100"
        />
      ),
      "HSN Code": (
        <Input
          type="text"
          className="table-input"
          name="hsnCode"
          value={item.hsnCode}
          onChange={(e) => handleCustomInput(index, "hsnCode", e.target?.value, "text", 10000)}

          // onChange={(e) => handleInputChange(e, index, "hsnCode")}
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
        />
      ),
      Deal: (
        <Input
          type="text"
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
      ),
      QTY: (
        <Input
          type="number"
          className="table-input required-fields"
          name="qty"
          value={item.qty || ""}
          onChange={(e) =>
            handleCustomInput(
              index,
              "qty",
              e.target?.value,
              "number",
              10000,
              item?.IsFree
            )
          }
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
        />
      ),
      Rate: (
        <Input
          type="number"
          className="table-input required-fields"
          name="rate"
          value={item.rate || ""}
          onChange={(e) =>
            handleCustomInput(index, "rate", e.target?.value, "number", 10000)
          }
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
        />
      ),
      Batch: (
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
        />
      ),
      MRP: (
        <Input
          type="number"
          className="table-input required-fields"
          name="MRP"
          value={item?.MajorMRP}
          onChange={(e) =>
            handleCustomInput(
              index,
              "MajorMRP",
              e.target?.value,
              "number",
              10000
            )
          }
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
        />
      ),
      "Disc(%)": (
        <Input
          type="number"
          className="table-input"
          name="discountPer"
          value={item.discountPer}
          onChange={(e) =>
            handleCustomInput(
              index,
              "discountPer",
              e.target?.value,
              "number",
              100
            )
          }
          readOnly={values?.billDiscPercentage > 0 ? true : false}
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
        />
      ),
      "Disc.Amt": (
        <Input
          type="number"
          className="table-input"
          name="discountAmt"
          value={item.discountAmt || ""}
          onChange={(e) =>
            handleCustomInput(
              index,
              "discountAmt",
              e.target?.value,
              "number",
              10000
            )
          }
          readOnly={values?.billDiscPercentage > 0 ? true : false}
          removeFormGroupClass={true}
          respclass="mt-1 w-100"
        />
      ),
      "GST Type": (
        <div
          style={{ minWidth: "70%" }}
          className="custom-select-wrapper w-100"
        >
          <CustomSelect
            placeHolder={t("GST Type")}
            name="GSTType"
            onChange={(val, e) =>
              handleCustomInput(index, "GSTType", e, "text", 10000)
            }
            value={item?.GSTType}
            option={GST_TYPE_OPTION}
          />
        </div>
      ),
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
        />
      ),

      ManufactureDate: (
        <DatePicker
          className="table-calender-height"
          removeFormGroupClass={true}
          id="ManufactureDate"
          name="ManufactureDate"
          value={item?.ManufactureDate ? new Date(item?.ManufactureDate) : ""}
          handleChange={(value) =>
            handleCustomInput(index, "ManufactureDate", value, "text", 10000)
          }
        />
      ),
      "Exp Date": (
        <CustomDateInput
          value={values?.items?.[index]?.expDate || ""} // Set the value based on the current index
          onChange={(value) =>
            handleCustomInput(index, "expDate", value, "date", 10000)
          }
          disabled={String(item?.IsExpirable) === "1" ? false : true}
          index={index}
          className="custom-calendar required-fields calendar-icon custom-datepicker"
        />
      ),
      Action: (
        <i
          className="fa fa-trash text-danger text-center p-2"
          onClick={() => handleRemoveItem(index)}
        />
      ),
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
          <i
            className="fa fa-plus  text-center "
            onClick={() => handleAddNewRow(index)}
          >

          </i>
        ),
    };
  };

  const handeAdd = (item) => {

    const updatedItems = item?.map((val, index) => ({
      ItemID: val.ItemID,
      itemName: val.ItemName,
      // ManufactureDate: val.ManufactureDate,
      manufacturer: val.ManufactureID,
      salesUnit: `${val.MajorUnit}/${val.MinorUnit}`,
      hsnCode: val.HSNCode,
      CGST: val.CGSTPercent,
      SGST: val.SGSTPercent,
      IGST: val.IGSTPercent,
      MinorUnit: val.MinorUnit,
      MajorUnit: val.MajorUnit,
      SubCategoryID: val.SubCategoryID,
      qty: val.OrderedQty || 0,
      rate: val.Rate || 0,
      StockID: val.StockID || "", // Assuming this property might be missing
      LedgerTnxNo: val.LedgerTransactionNo || "", // Assuming this property might be missing
      mrp: val.OrderedQty * val.MRP || 0,
      totalmrp: val.RecievedQty * val.Rate || 0,
      batch: val.BatchNo || "",
      discountPer: val.Discount_p || 0,
      GSTType: val.GSTType || "",
      expDate: val.ExpiryDate ? new Date(val.ExpiryDate) : null,
      ManufactureDate: val.ManufactureDate ? val.ManufactureDate : null,
      discountAmt:
        (parseFloat(val.Discount_p || 0) / 100) *
        parseFloat((val.RecievedQty || 0) * (val.Rate || 0)),
      netAmount:
        val.Discount_p > 0
          ? parseFloat((val.Rate || 0) * (val.RecievedQty || 0)).toFixed(2)
          : parseFloat(
            (val.RecievedQty || 0) *
            (val.Rate || 0) *
            (1 + (val.VATPer || 0) / 100)
          ).toFixed(2),
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
    }));

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

    // setPayload(item);
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
        />
      ),
    });
  };



  const handleGRNSameStateBuyierSupplier = async (VendorID) => {

    try {
      const response = await GRNSameStateBuyierSupplier(VendorID)
      if (response.success) {
        setIsSplitGST(true)
      }
      else {
        setIsSplitGST(false)
      }

    } catch (error) {
      setIsSplitGST(false);
      console.error("Something went wrong", error);
    }
  };

  useEffect(() => {
    if (values?.LedgerNumber) {
      handleGRNSameStateBuyierSupplier(values?.LedgerNumber?.VendorID);
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

        <div className="row px-2 pt-2">
          <ReactSelect
            placeholderName={t("Store Type")}
            id={"StoreType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
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
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={DropDownState.BindVendorData}
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
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
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

          <DatePicker
            className={`custom-calendar ${values.GRNType === "0" || values.GRNType === "3" ? "required-fields" : ""}`}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="InvoiceDate"
            name="InvoiceDate"
            value={values?.InvoiceDate}
            // value={
            //   values?.InvoiceDate
            //     ? moment(values.InvoiceDate, [
            //         "YYYY-MM-DD",
            //         "DD-MMM-YYYY",
            //       ]).isValid()
            //       ? moment(values.InvoiceDate, [
            //           "YYYY-MM-DD",
            //           "DD-MMM-YYYY",
            //         ]).toDate()
            //       : null
            //     : state?.data?.InvoiceDate &&
            //         moment(state.data.InvoiceDate, [
            //           "YYYY-MM-DD",
            //           "DD-MMM-YYYY",
            //         ]).isValid()
            //       ? moment(state.data.InvoiceDate, [
            //           "YYYY-MM-DD",
            //           "DD-MMM-YYYY",
            //         ]).toDate()
            //       : null
            // }
            lable={t("Invoice Date")}
            handleChange={handleChange}
            placeholder={VITE_DATE_FORMAT}
          />

          <Input
            type="text"
            className={`form-control ${values.GRNType === "1" || values.GRNType === "3" ? "required-fields" : ""}`}
            lable={t("Delivery No.")}
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
            lable={t("Delivery Date")}
            placeholder={VITE_DATE_FORMAT}
          />
          <ReactSelect
            placeholderName={t("GRN Type")}
            id={"type"}
            removeIsClearable={true}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={[
              { label: t("Invoice"), value: "0" },
              { label: t("Delivery"), value: "1" },
              { label: t("Delivery with Invoice"), value: "3" },
            ]}
            name="GRNType"
            value={values.GRNType}
            handleChange={handleReactSelectChange}
          />
        </div>
        <div className="table-responsive ">
          <Tables
            thead={THEAD}
            tbody={values?.items?.map(formatRowData)}
            tableHeight="tableHeight"
            style={{ maxHeight: "auto" }}
          />
        </div>
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
          <ReactSelect
            placeholderName={t("Currency")}
            id={"Currency"}
            searchable={true}
            name={"Currency"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            style={{ width: "100px" }}
            dynamicOptions={[
              {
                value: 14,
                label: "INR",
              },
              {
                value: 394,
                label: "USD",
              },
            ]}
            handleChange={(val, e) =>
              handleInputChangeCurrency(val, e, "Currency")
            }
            value={
              SelectedCurrency
                ? SelectedCurrency
                : state?.data?.Currency &&
                values.CurrencyDetail?.find(
                  (currency) => currency.label === state?.data?.Currency
                )?.value
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
            >
              {typeof state?.GRNNo !== "undefined"
                ? t("Update GRN")
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

export default GRN;