import React, { useEffect, useState } from "react";
import ReactSelect from "../../../../src/components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../../src/components/UI/Heading";
import moment from "moment";
import DatePicker from "../../../../src/components/formComponent/DatePicker";
import { Tabfunctionality } from "../../../utils/helpers";
import Input from "../../../../src/components/formComponent/Input";
import { useSelector } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  LoadCurrencyDetail,
  GetConversionFactor,
} from "../../../networkServices/PaymentGatewayApi";
import { RedirectURL } from "../../../networkServices/PDFURL";
import Tables from "../../../../src/components/UI/customTable";
//import CustomSelect from "../../components/formComponent/CustomSelect";

// import Select  from "react-select";
import SearchByMedicineItemName from "../../../../src/components/commonComponents/SearchByMedicineItemName";
import {
  BindGST,
  BindManufacturer,
  SaveGRN,
  UpdateGRN,
  DirectGRNReport,
  BindGRNItems,
  BindVendor,
  GetConsignmentEditDetails,
  BindConsignmentItemList,
  ConsignmentReceivePrint,
} from "../../../networkServices/InventoryApi";
import {
  GetBindDepartment,
  getEmployeeWise,
} from "../../../store/reducers/common/CommonExportFunction";
import { notify } from "../../../utils/utils";
import { useDispatch } from "react-redux";

//import { handleReactSelectDropDownOptions } from "../../utils/utils";
import { useLocation } from "react-router-dom";
import CustomDateInput from "../../../components/formComponent/CustomDateInput";
import CustomSelect from "../../../components/formComponent/CustomSelect";

const ConsignmentReceive = () => {
  const location = useLocation();
  // const {state}=location;
  const [state, setState] = useState(location?.state);
  useEffect(() => {
    if (location?.state?.edit) {
      setValues((prev) => ({
        ...prev,
        Currency: location?.state?.data?.currency || "INR", // Set Currency
        CurrencyFactor: location?.state?.data?.currencyFactor || 1,
      }));
    }
  }, []);
  useEffect(() => {
    if (location?.state?.edit) {
      setValues((prev) => ({
        ...prev,
        MedExpiryDate: location?.state?.data?.medExpiryDate,
      }));
    }
  }, []);
  const [SelectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedCurrencyName, setSelectedCurrencyName] = useState(null);

  useEffect(() => {
    console.log("selectedCurrency", SelectedCurrency);
    console.log("SelectedCurrencyName" , selectedCurrencyName);
  },[selectedCurrencyName , SelectedCurrency])

  const { VITE_DATE_FORMAT } = import.meta.env;
  const localData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [isExpirable, setIsExpirable] = useState([]);

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
    GRNType: "",
    narration: "",
  };
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
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
    // BindVendorData:[],
    OtherCharges: 0,
    paymentType: "4",
    narration: "",
    billDiscPercentage: 0,
    billDiscAmt: 0,
    roundOff: 0,
    currencyFactor: "",
    currencyCountryID: "",
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
        GSTType: "",
        MinorUnit: "",
        MajorUnit: "",
        SubCategoryID: 0,
        IsFree: 0,
      },
    ],
  };
  const [DropDownState, setDropDownState] = useState({
    category: [],
    paymentModeData: [],
    subcategory: [],
    BindVendorData: [],
    ManufacturerData: [],
    BindGRNType: [],
  });
  const [payload, setPayload] = useState({ ...initialState });
  const [SaveDisable, setSaveDisable] = useState(false);

  const [ItemIndexValue, setItemIndexValue] = useState({});
  const { GetEmployeeWiseCenter, GetDepartmentList } = useSelector(
    (state) => state?.CommonSlice
  );
  const [values, setValues] = useState({ ...initialValues });
  const [selectedGST, setSelectedGST] = useState(null);
  const [SelectedManufacturer, setSelectedManufacturer] = useState(null);
  const [SelectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    console.log("Values" , values);
  } , [values]);

  const handleReactSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };

  const handleCheckboxChange = (e, index, field) => {
    const newItems = [...values.items];
    newItems[index][field] = e.target.checked ? 1 : 0;
    setValues({ ...values, items: newItems });
  };

  const handleAddNewRow = (index) => {
    setValues((prevValues) => {
      const updatedItems = [...prevValues.items];
  
      // Clone the row at the clicked index and reset specific fields
      const newRow = {
        ...updatedItems[index],
        discountPer: "0",  // Reset Discount %
        discountAmt: "0",  // Reset Discount Amount
        netAmount: "0",    // Reset Net Amount
        qty: "0",          // Reset Quantity
        isCheckbox: true,  // ✅ Only this new row gets a checkbox
      };
  
      // Insert the new row just below the clicked row
      updatedItems.splice(index + 1, 0, newRow);
  
      return { ...prevValues, items: updatedItems };
    });
  };

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;

    const newItems = [...values.items];
    newItems[index][field] = value;
    if (field == "rate" || field == "qty") {
      if (newItems[index]["discountPer"] > 0) {
        newItems[index]["discountAmt"] =
          (parseFloat(newItems[index]["discountPer"]) / 100) *
          (parseFloat(newItems[index]["rate"]) *
            parseFloat(newItems[index]["qty"]));
      }
      if (field == "rate") {
        newItems[index]["totalmrp"] =
          parseFloat(value) * parseFloat(newItems[index]["qty"]);
        newItems[index]["CGSTAmt"] =
          (parseFloat(value) * parseFloat(newItems[index]["qty"]) -
            parseFloat(newItems[index]["discountAmt"])) *
          (newItems[index]["CGST"] / 100);
        newItems[index]["SGSTAmt"] =
          (parseFloat(value) * parseFloat(newItems[index]["qty"]) -
            parseFloat(newItems[index]["discountAmt"])) *
          (newItems[index]["SGST"] / 100);
        newItems[index]["IGSTAmt"] =
          (parseFloat(value) * parseFloat(newItems[index]["qty"]) -
            parseFloat(newItems[index]["discountAmt"])) *
          (newItems[index]["IGST"] / 100);
        newItems[index]["netAmount"] = (
          (parseFloat(value) * parseFloat(newItems[index]["qty"]) -
            parseFloat(newItems[index]["discountAmt"])) *
          (1 +
            parseFloat(newItems[index]["CGST"]) / 100 +
            parseFloat(newItems[index]["SGST"]) / 100 +
            parseFloat(newItems[index]["IGST"]) / 100)
        ).toFixed(2);
      } else
        newItems[index]["totalmrp"] =
          parseFloat(value) * parseFloat(newItems[index]["rate"]);
      newItems[index]["CGSTAmt"] =
        (parseFloat(
          newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
        ) -
          parseFloat(newItems[index]["discountAmt"])) *
        (newItems[index]["CGST"] / 100);
      newItems[index]["SGSTAmt"] =
        (parseFloat(
          newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
        ) -
          parseFloat(newItems[index]["discountAmt"])) *
        (newItems[index]["SGST"] / 100);
      newItems[index]["IGSTAmt"] =
        (parseFloat(
          newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
        ) -
          parseFloat(newItems[index]["discountAmt"])) *
        (newItems[index]["IGST"] / 100);
      newItems[index]["netAmount"] = (
        (parseFloat(
          newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
        ) -
          parseFloat(newItems[index]["discountAmt"])) *
        (1 +
          parseFloat(newItems[index]["CGST"]) / 100 +
          parseFloat(newItems[index]["SGST"]) / 100 +
          parseFloat(newItems[index]["IGST"]) / 100)
      ).toFixed(2);
    }
    if (field == "discountPer") {
      newItems[index]["discountAmt"] =
        (parseFloat(value) / 100) * parseFloat(newItems[index]["totalmrp"]);

      newItems[index]["CGSTAmt"] =
        (parseFloat(
          newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
        ) -
          parseFloat(newItems[index]["discountAmt"])) *
        (newItems[index]["CGST"] / 100);
      newItems[index]["SGSTAmt"] =
        (parseFloat(
          newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
        ) -
          parseFloat(newItems[index]["discountAmt"])) *
        (newItems[index]["SGST"] / 100);
      newItems[index]["IGSTAmt"] =
        (parseFloat(
          newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
        ) -
          parseFloat(newItems[index]["discountAmt"])) *
        (newItems[index]["IGST"] / 100);
      newItems[index]["netAmount"] = (
        (parseFloat(
          newItems[index]["rate"] * parseFloat(newItems[index]["qty"])
        ) -
          parseFloat(newItems[index]["discountAmt"])) *
        (1 +
          parseFloat(newItems[index]["CGST"]) / 100 +
          parseFloat(newItems[index]["SGST"]) / 100 +
          parseFloat(newItems[index]["IGST"]) / 100)
      ).toFixed(2);
    }
    setValues({ ...values, items: newItems });
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
        const discountAmt =
          (parseFloat(value) / 100) * parseFloat(item.totalmrp || 0);
        item.discountPer = value;
        item.discountAmt = discountAmt.toFixed(2);
      } else if (field === "discountAmt") {
        const discountPer =
          (parseFloat(value) / parseFloat(item.totalmrp || 1)) * 100;
        item.discountAmt = value;
        item.discountPer = discountPer.toFixed(2);
      }

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
    console.log("index?.val" , index?.value);
    setSelectedCurrency(index?.value);
    setSelectedCurrencyName(index?.label);
  };

  const handleAddItem = (ItemIndexValue) => {
    const newItem = {
      ItemID: 0,
      itemName: ItemIndexValue?.ItemName,
      manufacturer: ItemIndexValue.manufacturer,
      salesUnit: "",
      hsnCode: ItemIndexValue.hsnCode,
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
      expDate: "",
      GSTType: "",
      MinorUnit: "",
      MajorUnit: "",
      SubCategoryID: 0,
    };
    setValues({ ...values, items: [...values.items, newItem] });
    setSelectedManufacturer(ItemIndexValue.manufacturer);
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
            GSTType: "",
            MinorUnit: "",
            MajorUnit: "",
            SubCategoryID: 0,
            IsFree: 0,
            IsExpirable: 0,
          },
        ],
      }));
    }
  }, [values.items]);

  const handleRemoveItem = (index) => {
    const newItems = values.items.filter((item, i) => i !== index);
    setValues({ ...values, items: newItems });
  };
  const GRNView = async (consignmentNo, StoreType, dataList) => {
    if (typeof StoreType != "undefined") {
      const payloadIsReject = {
        consignmentNo: consignmentNo,
      };
      try {
        const response = await GetConsignmentEditDetails(payloadIsReject);
        console.log("Reponse GetConsignment" , response);
        if (response?.success) {
          const data = response?.data?.map((val, index) => ({
            sno: index + 1,
            ItemName: val?.itemName,
            BatchNumber: val?.batchNumber,
            Rate: val?.rate,
            InitialCount: val?.inititalCount,
            MajorMRP: val?.MajorMRP,
            Free: val?.isFree == "false" ? "No" : "Yes",
            Print: "",
            CurrentManufacturer: dataList.data.LedgerName,
            LastManufacturer:
              val?.LastManufacturer == null ? "" : val?.LastManufacturer,
            CurrentVendor: val?.CurrentVendor == null ? "" : val?.CurrentVendor,
            LastVendor: val?.LastVendor,
            expDate: val?.medExpiryDate,
            currency: val?.currency,
            currencyCountryID: val?.currencyCountryID,
            IsExpirable: val?.isExpirable,
          }));
          const updatedItems = response?.data?.map((val, index) => ({
            // sno: index + 1,
            ItemID: val.itemID,
            IsFree: val?.isFree,
            itemName: val.itemName,
            manufacturer: val?.manufactureID || 0,
            salesUnit: val.majorUnit + "/" + val.minorUnit,
            hsnCode: val.hsnCode,
            CGST: val.cgstPercent,
            SGST: val.sgstPercent,
            IGST: val.igstPercent,
            MinorUnit: val.minorUnit,
            MajorUnit: val.majorUnit,
            SubCategoryID: val.subCategoryID,
            qty: val.inititalCount,
            rate: val.rate,
            mrp: val.mrp, //Kishan
            totalmrp: val.inititalCount * val.rate,
            batch: val.batchNumber,
            discountPer: val.discountPer,
            GSTType: val.gstType, //val?.gstType,
            expDate: val.medExpiryDate,
            podID: val.id,
            discountAmt:
              (parseFloat(val.discountPer) / 100) *
              parseFloat(val.inititalCount * val.rate),
            netAmount:
              val.discountPer > 0
                ? parseFloat((val.unitPrice * val.inititalCount).toFixed(2)) -
                  (parseFloat(val.discountPer) / 100) *
                    parseFloat(val.inititalCount * val.rate) +
                  val.cgstAmt +
                  val.sgstAmt +
                  val.igstAmt
                : parseFloat(
                    (
                      val.inititalCount *
                      val.rate *
                      (1 + val.taxPer / 100)
                    ).toFixed(2)
                  ),
            CGSTAmt:
              (parseFloat(val.inititalCount * val.rate) -
                parseFloat(
                  (parseFloat(val.discountPer) / 100) *
                    parseFloat(val.inititalCount * val.rate)
                )) *
              (val.cgstPercent / 100),
            SGSTAmt:
              (parseFloat(val.inititalCount * val.rate) -
                parseFloat(
                  (parseFloat(val.discountPer) / 100) *
                    parseFloat(val.inititalCount * val.rate)
                )) *
              (val.sgstPercent / 100),
            IGSTAmt:
              (parseFloat(val.inititalCount * val.rate) -
                parseFloat(
                  (parseFloat(val.discountPer) / 100) *
                    parseFloat(val.inititalCount * val.rate)
                )) *
              (val.igstPercent / 100),
            consignmentNo: val.consignmentNo,
          }));
          setSelectedCurrency(response?.data[0].currencyCountryID);
          setSelectedCurrencyName(response?.data[0].currency);
          setValues((val) => ({
            ...val,
            // setSelectedCurrency: dataList.data.currency,
            GRNItemListdata: data,
            items: updatedItems,
            LedgerNumber: {
              value: dataList.data.LedgerNumber,
              label: dataList.data.LedgerName,
            },
            fromDate: new Date(dataList.data.StockDate || "0001-01-01"),
            toDateDate: new Date(dataList.data.ChallanDate || "0001-01-01"),
            InvoiceNo: dataList.data.BillNo,
            DeliveryNo: dataList.data.ChallanNo,
            narration: response?.data[0].naration,
            OtherCharges: response?.data[0].otherCharges,
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
  // console.log("Values after setting up", values);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleDateChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleChangeBillDis = (e) => {
    const { name, value } = e.target;

    // Use the previous values in the state
    if (value < 0 || value > 100) {
      return notify("Bill Discount Per must be between 0 and 100", "error");
    }
    setValues((val) => {
      const updatedValues = { ...val, [name]: value };

      if (name === "billDiscPercentage") {
        // Calculate the bill discount amount based on percentage
        const billDiscAmt = (totalAmount * parseFloat(value)) / 100;
        updatedValues.billDiscAmt = billDiscAmt;
      } else if (name === "billDiscAmt") {
        // Calculate the bill discount percentage based on amount
        const billDiscPercentage = (parseFloat(value) / totalAmount) * 100;
        updatedValues.billDiscPercentage = billDiscPercentage;
      }

      return updatedValues;
    });
  };

  const handleCancel = () => {
    setValues(initialValues);
    //   setReload(prev => !prev);
    setState({});
  };

  const handleItemSelect = (label, value, val, index) => {
    // Clone the current items

    const updatedItems = [...values.items];

    updatedItems[index] = {
      ...updatedItems[index],
      ItemID: val.ItemID,
      itemName: val.ItemName,
      manufacturer: val.ManufactureID || 0,
      salesUnit: val.majorUnit + "/" + val.minorUnit,
      hsnCode: val.HSNCode,
      CGST: val.CGSTPercent,
      SGST: val.SGSTPercent,
      IGST: val.IGSTPercent,
      expDate: val.expDate,
      GSTType: val.GSTTypeNew,
      MajorUnit: val.majorUnit,
      MinorUnit: val.minorUnit,
      SubCategoryID: val.SubCategoryID,
      // GSTTypeNew:val.GSTTypeNew
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
    fetchGST();
    fetchManufacturer();
    fetchCurrencyDetail();
    fetchVendor();
  }, []);
  useEffect(() => {
    GRNView(state?.GRNNo, state?.StoreType, state);
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
    const payLoadList = {
      // itemName: "", // Use specific value if needed
      // requestType: "",
    };
    try {
      const response = await BindVendor(payLoadList);
      if (response?.data) {
        const itemOptions = response.data.map((item) => ({
          value: item.LedgerNumber,
          label: item.LedgerName,
        }));
        setDropDownState((prevState) => ({
          ...prevState,
          BindVendorData: itemOptions,
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

      setValues({ ...values, items: updatedItems });
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
  const handleGetConversionFactor = async (data) => {
    const { CountryID } = data;
    try {
      const apiResponse = await GetConversionFactor(data);
      return apiResponse?.data;
    } catch (error) {
      // console.log(error);
    }
  };

  const handleManufacturer = (label, value, val, index) => {
    const updatedItems = [...values.items];
    // debugger;
    updatedItems[index] = {
      ...updatedItems[index],
      manufacturer: value?.value,
    };
    setValues({ ...values, items: updatedItems });
  };
  const calculateTotalAmount = () => {
    return values.items.reduce((total, item) => {
      return total + item.totalmrp;
    }, 0);
  };

  const totalAmount = calculateTotalAmount();

  const calculateTotalGRNAmount = () => {
    // Calculate the total amount
    const TotalGRNAmount =
      parseFloat(values?.OtherCharges || "0.00") +
      values.items.reduce((total, item) => {
        return total + parseFloat(item.netAmount);
      }, 0);

    values.roundOff = (Math.round(TotalGRNAmount) - TotalGRNAmount).toFixed(2); // You can change '2' to the desired decimal places

    return Math.round(TotalGRNAmount);
  };

  const calculateTotalDisAmount = () => {
    return values.items.reduce((total, item) => {
      return total + parseFloat(item.discountAmt);
    }, 0);
  };
  const calculatecgstSgstAmt = () => {
    return values.items.reduce((total, item) => {
      return total + parseFloat(item.CGSTAmt) + parseFloat(item.SGSTAmt);
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
  console.log("Values" , values)
  const handleSave = async () => {
    debugger;
    if (
      typeof values.LedgerNumber == "undefined" ||
      values?.LedgerNumber == ""
    ) {
      return notify("Please Select Supplier.", "error");
    } else if (!values.fromDate) {
      return notify("Please Select From Date.", "error");
    } else if (!values.toDate) {
      return notify("Please Select To Date.", "error");
    } else if (!values.StoreType?.value) {
      return notify("Please Select Store.", "error");
    } else if (!values.GRNType) {
      return notify("Please Select GRN Type.", "error");
    } else if (!values.paymentType) {
      return notify("Please Select Payment Type.", "error");
    } else if (!SelectedCurrency) {
      return notify("Please Select Currency.", "error");
    } else if (!values.narration?.trim()) {
      return notify("Please Select Narration.", "error");
    }

    // ✅ Filter out items without itemName before saving
    const validItems = values.items.filter(
      (item) => item.itemName && item.itemName.trim() !== ""
    );

    if (validItems.length === 0) {
      return notify(
        "Please add at least one valid item before saving.",
        "error"
      );
    }

    const payload = {
      dataInvoice: [
        {
          VenLedgerNo: values.LedgerNumber.value,
          InvoiceNo: values.InvoiceNo,
          InvoiceDate: moment(values.fromDate, "YYYY-MM-DD").format(
            "DD-MMM-YYYY"
          ),
          ChalanNo: values.DeliveryNo,
          ChalanDate: moment(values.toDate, "YYYY-MM-DD").format("DD-MMM-YYYY"),
          WayBillNo: "",
          WayBillDate: "",
          GatePassIn: "",
          NetAmount: TotalGRNAmount.toFixed(2),
          GrossBillAmount: totalAmount.toFixed(2),
          RoundOff: parseFloat(values.roundOff),
          DiscAmount: TotalDisAmount.toFixed(2),
          StoreLedgerNo: values.StoreType.value,
          PaymentModeID: values.paymentType,
          otherCharges: parseFloat(values.OtherCharges),
          PONumber: "",
          currencyCountryID: SelectedCurrency || state?.data?.CurrencyID || "14",
          currency: selectedCurrencyName || state?.data?.Currency || "INR",
          CurrencyFactor: "1.000000",
          FreightCharge: values?.freightCharges || "0.00",
        },
      ],
      dataItemDetails: validItems.map((item) => ({
        Id: state?.edit ? item.podID : 0,
        DeptLedgerNo: "LSHHI17",
        ItemID: item.ItemID,
        ItemName: item.itemName,
        BatchNumber: item.batch,
        MRP: item.mrp,
        //totalmrp
        Quantity: item.qty,
        Rate: item.rate,
        DiscPer: item.discountPer,
        DiscAmt: item.discountAmt,
        PurTaxPer: item.CGST + item.SGST + item.IGST,
        PurTaxAmt: item.SGSTAmt + item.IGSTAmt + item.CGSTAmt,
        MedExpiryDate: moment(item.expDate, "YYYY-MM-DD").format("DD-MMM-YYYY"),
        ItemNetAmount: item.netAmount,
        ItemGrossAmount: item.totalmrp,
        isDeal: "0+0",
        markUpPercent: 0,
        PODID: state?.edit ? item.podID : 0,
        LedgerTnxNo: state?.edit ? item.consignmentNo : 0,
        StockID: item?.StockID || 0,
        otherCharges: parseFloat(values.OtherCharges),
        SaleTaxPer: item.CGST + item.SGST + item.IGST,
        IsFree: item.IsFree ? 1 : 0,
        StoreLedgerNo: values.StoreType.value,
        Naration: values.narration,
        SubCategoryID: item.SubCategoryID,
        MajorUnit: item.MajorUnit,
        MinorUnit: item.MinorUnit,
        ConversionFactor: 1,
        MajorMRP: 0,
        IsExpirable: 1,
        SpecialDiscPer: 0,
        SpecialDiscAmt: 0,
        IsReturn: 0,
        HSNCode: item.hsnCode,
        GSTType: item.GSTType,
        IGSTPercent: item.IGST,
        CGSTPercent: item.CGST,
        SGSTPercent: item.SGST,
        IGSTAmt: item.IGSTAmt,
        CGSTAmt: item.CGSTAmt,
        SGSTAmt: item.SGSTAmt,
        RetrunFromGRN: "",
        RetrunFromInvoiceNo: "",
        IsUpdateCF: 0,
        IsUpdateHSNCode: 0,
        IsUpdateGST: 0,
        IsUpdateExpirable: 0,
        ManufacturerId: item?.manufacturer || 0,
        UnitPrice: item.rate,
        InvoiceNo: values.InvoiceNo,
        ChalanNo: values.DeliveryNo,
        InvoiceDate: moment(values.fromDate, "YYYY-MM-DD").format(
          "DD-MMM-YYYY"
        ),
        ChalanDate: moment(values.toDate, "YYYY-MM-DD").format("DD-MMM-YYYY"),
        VenLedgerNo: values.LedgerNumber.value,
        InvoiceAmount: parseFloat(item.netAmount),
        MedExpiryDate: item?.expDate,
      })),
      isConsignment: 1,
      consignmentNumber:state?.GRNNo,
      ...(state?.GRNNo && {
        ledgerTransationNo: state?.GRNNo,
        EditGRNNo: "0",
        // EditGRNNo: state?.data?.BillNo,
      }),
    };

    // 🔹 Saving the GRN or Updating based on condition
    try {
      const response = state?.GRNNo
        ? await UpdateGRN(payload)
        : await SaveGRN(payload);

      if (response?.success) {
        notify(response?.message, "success");

        const payload2 = {
          ReturnID: parseInt(response?.data.ledgerTnxNo),
        };

        const response1 = await ConsignmentReceivePrint(payload2);
        RedirectURL(response1?.data?.pdfUrl);
          setValues(initialValues);
          setState({});
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const THEAD = [
    { name: t("Item Name"), className: "col-xl-2 col-md-4 col-sm-4 col-12" },
    { name: t("Manufacturer"), className: "col-xl-2 col-md-4 col-sm-4 col-12" },
    { name: t("Unit"), width: "6%" },
    { name: t("HSN Code"), width: "4%" },
    { name: t("QTY"), width: "4%" },
    { name: t("Rate"), width: "4%" },
    { name: t("Batch"), width: "4%" },
    { name: t("MRP"), width: "4%" },
    { name: t("Disc(%)"), width: "1%" },
    { name: t("Disc.Amt") },
    { name: t("GST Type"), width: "11%" },
    { name: t("CGST(%)"), width: "1%" },
    { name: t("SGST(%)"), width: "1%" },
    { name: t("IGST(%)"), width: "1%" },
    { name: t("Net Amt."), width: "6%" },
    { name: t("Exp Date"), width: "10%" },
    { name: t("Action") },
    { name: t("Is Free") },
  ];

  const formatRowData = (item, index) => {
    // console.log("items from formatRowData", payload);
    console.log("item.IsExpirable", item)

    return {
      "Item Name": (
        <div style={{ height: "27px" }}>
          <SearchByMedicineItemName
            data="cal"
            handleItemSelect={(label, value, val) =>
              handleItemSelect(label, value, val, index)
            }
            itemName={item.itemName}
            payload={payload}
            callfrom="Con"
            storeLedgerNo={values.StoreType}
            isConsignment="1"
            setValues={setValues}
          />
        </div>
      ),
      Manufacturer: (
        // <ReactSelect
        //   className="table-input"
        //   placeholderName={t("Manufacturer")}
        //   id="Manufacturer"
        //   searchable
        //   name="Manufacturer"
        //   // respclass="col-xl-12 col-md-4 col-sm-4 col-12"
        //   style={{ width: "100px" }}
        //   dynamicOptions={DropDownState.ManufacturerData}
        //   handleChange={(label, value, val) => handleManufacturer(label, value, val, index)}
        //   value={item.manufacturer}
        //   removeIsClearable={false}
        //   removeFormGroupClass={true}
        //   respclass="mt-1"
        // />
        <div style={{ minWidth: "70%" }} className="custom-select-wrapper">
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
          respclass="mt-1"
        />
      ),
      "HSN Code": (
        <Input
          type="text"
          className="table-input"
          name="hsnCode"
          value={item.hsnCode}
          onChange={(e) => handleInputChange(e, index, "hsnCode")}
          removeFormGroupClass={true}
          respclass="mt-1"
        />
      ),
      QTY: (
        <Input
          type="number"
          className="table-input"
          name="qty"
          value={item.qty}
          onChange={(e) => handleInputChange(e, index, "qty")}
          removeFormGroupClass={true}
          respclass="mt-1"
        />
      ),
      Rate: (
        <Input
          type="number"
          className="table-input"
          name="rate"
          value={item.rate}
          onChange={(e) => handleInputChange(e, index, "rate")}
          removeFormGroupClass={true}
          respclass="mt-1"
        />
      ),
      Batch: (
        <Input
          type="text"
          className="table-input"
          name="batch"
          value={item.batch}
          onChange={(e) => handleInputChange(e, index, "batch")}
          removeFormGroupClass={true}
          respclass="mt-1"
        />
      ),
      MRP: (
        <Input
          type="number"
          className="table-input"
          name="MRP"
          value={item.mrp}
          onChange={(e) => handleInputChange(e, index, "mrp")}
          removeFormGroupClass={true}
          respclass="mt-1"
        />
      ),
      "Disc(%)": (
        <Input
          type="number"
          className="table-input"
          name="discountPer"
          value={item.discountPer}
          onChange={(e) => handleInputChangeDisc(e, index, "discountPer")}
          readOnly={values?.billDiscPercentage > 0 ? true : false}
          removeFormGroupClass={true}
          respclass="mt-1"
        />
      ),
      "Disc.Amt": (
        <Input
          type="number"
          className="table-input"
          name="discountAmt"
          value={item.discountAmt}
          onChange={(e) => handleInputChangeDisc(e, index, "discountAmt")}
          readOnly={values?.billDiscPercentage > 0 ? true : false}
          removeFormGroupClass={true}
          respclass="mt-1"
        />
      ),
      "GST Type": (
        <div style={{ minWidth: "70%" }} className="custom-select-wrapper">
          <CustomSelect
            placeHolder={t("GST Type")}
            name="GSTType"
            onChange={(val, e) => handleGSTChange(val, e, index)}
            value={item?.GSTType}
            option={DropDownState.BindGRNType}
          />
        </div>
      ),
      "CGST(%)": (
        <Input
          type="number"
          className="table-input"
          name="CGST"
          value={item.CGST}
          onChange={(e) => handleInputChange(e, index, "CGST")}
          readOnly
          removeFormGroupClass={true}
          respclass="mt-1"
        />
      ),
      "SGST(%)": (
        <Input
          type="number"
          className="table-input"
          name="SGST"
          value={item.SGST}
          onChange={(e) => handleInputChange(e, index, "SGST")}
          readOnly
          removeFormGroupClass={true}
          respclass="mt-1"
        />
      ),
      "IGST(%)": (
        <Input
          type="number"
          className="table-input"
          name="IGST"
          value={item.IGST}
          onChange={(e) => handleInputChange(e, index, "IGST")}
          readOnly
          removeFormGroupClass={true}
          respclass="mt-1"
        />
      ),
      "Net Amt.": (
        <Input
          type="number"
          className="table-input"
          name="Net Amt"
          value={item.netAmount}
          readOnly
          removeFormGroupClass={true}
          respclass="mt-1"
        />
      ),
      "Exp Date": (
        // <DatePicker
        //   className="custom-calendar"
        //   name={t("expDate")}
        //   value={item.expDate ? moment(item.expDate, "YYYY-MM-DD").toDate() : null}
        //   handleChange={(e) => handleInputChange(e, index, 'expDate')}
        //   requiredClassName="required-fields"
        //   removeFormGroupClass={true}
        //   respclass="mt-1"
        // />
        
        <CustomDateInput
          value={values?.items?.[index]?.expDate || ""} // Set the value based on the current index
          onChange={(value) =>
            handleInputChange({ target: { value } }, index, "expDate")
          }
          // disabled={isExpirable?.map((val) => {
          //   if(val.IsExpirable === 0){
          //     return true;
          //   }else{
          //     return false;
          //   }
          // })}
          // disabled={isExpirable[index]?.IsExpirable === 1 ? false : true}
          index={index}
          disabled={String(item?.IsExpirable) === "1" ? false : true}
          className="custom-calendar required-fields calendar-icon custom-datepicker"
        />
      ),
      Action: (
        <i
          className="fa fa-trash text-danger text-center"
          onClick={() => handleRemoveItem(index)}
        />
      ),
      IsFree: (
        item.isCheckbox || item?.IsFree ? (
          <input
            type="checkbox"
            checked={item?.IsFree}
            id={`checkbox-${index}`}
            onChange={(e) => handleCheckboxChange(e, index, "IsFree")}
            removeFormGroupClass={true}
            respclass="mt-1"
          />
        ) : (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleAddNewRow(index)}
          >
            {t("+")}
          </button>
        )
      ),
    };
  };

  return (
    <>
      <div className="card patient_registration border">
        <Heading title={"Admitted Patients"} isBreadcrumb={true} />

        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Store Type")}
            id={t("StoreType")}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: " Medical Store", value: "STO00001" },
              //   { label: "General Store", value: "STO00002" },
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
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={DropDownState.BindVendorData}
            name="LedgerNumber"
            handleChange={handleReactSelect}
            value={values?.LedgerNumber.value}
            requiredClassName="required-fields"
          />

          <ReactSelect
            placeholderName={t("Payment Type")}
            id={"paymentType"}
            searchable={true}
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
            // className={values.GRNType ==="0" || values.GRNType ==="3"?"form-control required-fields":"form-control"}
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
            id="fromDate"
            name="fromDate"
            value={
              values.fromDate
                ? moment(values?.fromDate, "YYYY-MM-DD").toDate()
                : null
            }
            handleChange={handleDateChange}
            lable={t("Invoice Date")}
            placeholder={VITE_DATE_FORMAT}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            // className={values.GRNType ==="1" || values.GRNType ==="3"?"form-control required-fields":"form-control"}
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
            // className="custom-calendar required-fields"
            className={`custom-calendar ${values.GRNType === "1" || values.GRNType === "3" ? "required-fields" : ""}`}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            value={
              values.toDate
                ? moment(values?.toDate, "YYYY-MM-DD").toDate()
                : null
            }
            handleChange={handleDateChange}
            lable={t("Delivery Date")}
            placeholder={VITE_DATE_FORMAT}
          />
          <ReactSelect
            placeholderName={t("GRN Type")}
            id={"type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Invoice", value: "0" },
              { label: "Challan No", value: "1" },
              { label: "Challan No with Invoice", value: "3" },
            ]}
            name="GRNType"
            value={values.GRNType}
            handleChange={handleReactSelectChange}
            requiredClassName="required-fields"
          />
          <Input
            type="number"
            className="form-control"
            lable={t("Other Charges")}
            placeholder=" "
            id="OtherCharges"
            name="OtherCharges"
            onChange={handleChange}
            value={values?.OtherCharges || "0.00"}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          {typeof state?.GRNNo !== "undefined" ? (
            <div
              className="col-xl-2 col-md-4 col-sm-4 col-12 text-end"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "4px",
              }}
            >
              {/* <label htmlFor="GRN">Consignment No.: {state?.GRNNo}</label> */}
            </div>
          ) : null}
        </div>
        {/* Items Grid */}
        {console.log("valuesisFreeisFree " , values.items)}
        <div className="table-responsive mt-3">
          <Tables
            thead={THEAD}
            tbody={values.items.map(formatRowData)}
            tableHeight="tableHeight"
            style={{ maxHeight: "auto" }}
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
      {/* </div> */}
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
          readOnly={values.items.some((item) =>
            parseFloat(item.discountAmt) > 0 ? true : false
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
        {/* <Input
        type="number"
        className="form-control"
        lable={t("Freight Charges")}
        placeholder=" "
        id="freightCharges"
        name="freightCharges"
        value={values?.freightCharges || "0.00"}
        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        onKeyDown={Tabfunctionality}
      /> */}
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
          requiredClassName="required-fields"
        />
        {/* {console.log("values BEFORE CURRENCY", values)} */}
        <ReactSelect
          placeholderName={t("Currency")}
          id={"Currency"}
          searchable={true}
          name={"Currency"}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          requiredClassName="required-fields"
          style={{ width: "100px" }}
          dynamicOptions={[
            { value: 14, label: "INR" },
            { value: 394, label: "USD" },
          ]}
          handleChange={(val, e) =>
            handleInputChangeCurrency(val, e, "Currency")
          }
          value={
            SelectedCurrency 
            ? SelectedCurrency
            : values?.CurrencyDetail?.find(
                (item) => item.label === selectedCurrencyName
              )?.value
          }
          removeIsClearable={false}
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
            {typeof state?.GRNNo !== "undefined" ? "Update Consignment" : t("Save")}
          </button>
          <button
            className="btn btn-secondary cancel-button"
            onClick={handleCancel}
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConsignmentReceive;
