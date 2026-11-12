import React, { useEffect, useMemo, useState } from "react";
import Heading from "../UI/Heading";
import DatePicker from "../formComponent/DatePicker";
import { useTranslation } from "react-i18next";
import ReactSelect from "../formComponent/ReactSelect";
import {
  CalculateOption,
  RateOnOptions,
  ROUNDOFF_VALUE,
} from "../../utils/constant";
import SearchByName from "../commonComponents/SearchByName";
import SurgeryDepartmentDetailsTable from "../UI/customTable/billings/SurgeryDepartmentDetailsTable";
import Input from "../formComponent/Input";
import SurgeryDetailsTable from "../UI/customTable/billings/SurgeryDetailsTable";
import {
  BindDocType,
  GetAllAuthorization,
  getApproveBy,
  IPDAdvanceLoadSurgery,
  IPDAdvanceLoadSurgeryDetail,
  Rate,
  SaveSurgery,
} from "../../networkServices/BillingsApi";
import { notify } from "../../utils/utils";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import moment from "moment";
import { useLocation } from "react-router-dom";

const Surgery = ({ data, handleModalState, LedgerTnxNo, setModalState }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const location = useLocation();
  const ip = useLocalStorage("ip", "get");
  const [items, setItems] = useState([]);
  const [DocType, setDocType] = useState([]);
  const [approval, setApproval] = useState([]);
  const [auth, setAuth] = useState([]);
  const initialState = {
    date: new Date(),
    RateOn: {
      label: "Surgeon",
      value: "2",
    },
    itemName: {},
    Type: "",
    CalculateOn: {
      label: "Amount",
      value: "1",
    },
    SurgeryAmount: "",
    SurgeonAmount: "",
    Approval: "",
    Remarks: "",
  };

  const [payload, setPayload] = useState({ ...initialState });
  const GetBindAuthorization = async () => {
    try {
      const datas = await GetAllAuthorization();
      return datas?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const GetAuthorizationList = async () => {
    try {
      const data = await GetBindAuthorization();
      setAuth(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetAuthorizationList();
  }, []);

  const sendReset = () => {
    setPayload(initialState);
    setDocType([]);
    setItems([]);
  };

  const getRate = async () => {
    const dataPayload = {
      TID: parseInt(data?.transactionID),
      SurgeryID: String(payload?.itemName?.value),
    };
    try {
      if (payload?.itemName?.value) {
        const response = await Rate(dataPayload?.TID, dataPayload?.SurgeryID);
        setItems([response?.data]);
        getBindDocType(payload?.RateOn?.value, response?.data?.Surgery_ID);
      } else {
        notify("Item Name Is Required", "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
// useEffect(() => {
//   setItems((prevItems) =>
//     prevItems.map((item) => ({
//       ...item,
//       changeAMOUNT: payload?.RateOn?.value === "1" ? item.DocCharge : item.SurgeonCharge
//     }))
//   );
// }, [payload?.RateOn?.value]);
console.log("items",items)
  const getBindDocType = async (RateType, SurgeryID) => {
    try {
      if (RateType && SurgeryID) {
        const response = await BindDocType(RateType, SurgeryID);
        if (response?.success) {
          let data = response?.data?.map((val, i) => {
            val.IsChecked = i < 3 ? true : false;
            val.chargeAmt = 0;
            return val;
          });
          setDocType(data);
        } else {
          setDocType([]);
        }
      }
    } catch (error) {
      console.error("Error fetching document type:", error);
    }
  };
  console.log(DocType);
  const getBindApproveBy = async () => {
    try {
      const response = await getApproveBy();
      setApproval([response?.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleIndexChange = (index, name, value, item) => {
    // if (!Array.isArray(items?.dtSur)) return;
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };
    setItems(updatedItems);
  };
  console.log(items);

  const handleItemsChange = (index, name, e) => {
    const data = [...DocType];
    data[index][name] = e ? e : e.value;
    setDocType(data);
  };
  const handleSelect = (e, index, item) => {
    const { name, checked } = e.target;
    const data = [...DocType];
    data[index][name] = checked;
    setDocType(data);
  };

  const onDelete = (item, index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleCustomSelect = (index, name, e) => {
    const data = [...DocType];
    data[index][name] = e.value;
    setDocType(data);
  };
  const handleItemSelect = (label, value) => {
    setPayload({
      ...payload,
      itemName: {
        label: label,
        value: value,
      },
    });
  };

  console.log("dtSur", items?.dtSur);
  const AddItemHead = [
    t("S.No."),
    t("CPT Code"),
    t("Surgery Name"),
    t("Department"),
    t("Remarks"),
    t("Rate"),
    t("Reduce(%)"),
    t("New Rate"),
    t("Remove"),
  ];
  const SurgeryHead = [
    t("Action"),
    t("S.No."),
    t("Type"),
    t("Doctor"),
    t("Charges (%)"),
    t("Charges (Amount)"),
    t("Discount (%)"),
    t("Discount (Amount)"),
    t("Net Amount"),
    t("Panel Non-Payable"),
    t("Panel Co-Payment"),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };
  const handleReactSelect = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value }));
  };
  const handleReactSelectItem = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value?.value }));
  };
  console.log(data);
  console.log(items);
  console.log(payload);
  console.log(DocType);

  useEffect(() => {
    getBindApproveBy();
  }, []);

  const handleIPDAdvanceLoadSurgeryDetail = async (LedgerTnxNo) => {
    try {
      const response = await IPDAdvanceLoadSurgeryDetail(LedgerTnxNo);
      console.log(response?.data);
      const data = {
        rateListID: "",
        DocCharge: "",
        Surgery_ID: response?.data?.SurgeryID,
        Department: response?.data?.Department,
        SurgeryCode: response?.data?.SurgeryCode,
        SurgeryName: response?.data?.SurgeryName,
        Remarks: response?.data?.Remark,
        surgeonCharge: response?.data?.Rate,
        Reduce: response?.data?.ReducePerOn,
      };
      setItems([data]);
      console.log("dataaaaaaaaaa", data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIPDAdvanceLoadSurgery = async (LedTnxID) => {
    try {
      const response = await IPDAdvanceLoadSurgery(LedTnxID);
      console.log("response?.data", response?.data);
      const newresponse = response?.data?.map((item) => {
        if (item.isSelected === "true") {
          return {
            ...item,
            IsChecked: true,
            Type: item.type,
            Doctor: Number(item.doctorID),
            DoctorChargePer: Number(item.doctorChargePer).toFixed(
              ROUNDOFF_VALUE
            ),
            DiscountPer: Number(item.discountPer).toFixed(ROUNDOFF_VALUE),
            DiscountAmt: Number(item.discountAmt).toFixed(ROUNDOFF_VALUE),
            NetAmt: Number(item.netAmt).toFixed(ROUNDOFF_VALUE),
            isPayable: item.isPayable,
            CoPayment: Number(item.coPayment).toFixed(ROUNDOFF_VALUE),
          };
        } else {
          return {
            ...item,
            IsChecked: false,
            Type: item.type,
            Doctor: item.doctorID,
            DoctorChargePer: Number(item.doctorChargePer).toFixed(
              ROUNDOFF_VALUE
            ),
            DiscountPer: Number(item.discountPer).toFixed(ROUNDOFF_VALUE),
            DiscountAmt: Number(item.discountAmt).toFixed(ROUNDOFF_VALUE),
            NetAmt: Number(item.netAmt).toFixed(ROUNDOFF_VALUE),
            isPayable: item.isPayable,
            CoPayment: Number(item.coPayment).toFixed(ROUNDOFF_VALUE),
          };
        }
        // return item;
      });

      setDocType(newresponse);
      console.log("newresponse", newresponse);
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  console.log(DocType);
  useEffect(() => {
    if (LedgerTnxNo) {
      handleIPDAdvanceLoadSurgeryDetail(LedgerTnxNo);
      handleIPDAdvanceLoadSurgery(LedgerTnxNo);
    }
  }, [LedgerTnxNo]);

  const handleSaveSurgery = async () => {
    debugger
    if(payload?.RateOn?.value==="2"){
      if(!items[0]?.surgeonCharge){
        notify("Please Fill Rate")
        return
      }
    }
    try {
      const SurItem = [];
      DocType?.forEach((ele) => {
        if (ele?.IsChecked === true) {
          SurItem.push(ele);
        }
      });

      const surgeryItems = SurItem?.map((ele) => ({
        itemID: ele?.ItemID ? Number(ele?.ItemID) : 0,
        doctorChargePer: ele?.DoctorChargePer
          ? Number(ele?.DoctorChargePer)
          : 0,
        netAmt: ele?.NetAmt ? Number(ele?.NetAmt) : 0,
        isPanelWiseDiscount: ele?.IsPanelWiseDiscount
          ? Number(ele?.IsPanelWiseDiscount)
          : 0,
        doctorID: ele?.Doctor ? Number(ele?.Doctor) : 0,
        discountPer: ele?.DiscountPer==="NaN" ? 0 :  Number(ele?.DiscountPer || 0) ,
        subCategoryID: ele?.SubCategoryID ? Number(ele?.SubCategoryID) : 0,
        discountAmt: ele?.DiscountAmt ? Number(ele?.DiscountAmt) : 0,
        type: ele?.Type ? String(ele?.Type) : "",
        isPayble: ele?.isPayable ? Number(ele?.isPayable) : 0,
        coPayment: ele?.CoPayment ? Number(ele?.CoPayment) : 0,
        isChecked: ele?.IsChecked ? true : false,
        doctorCharge: ele?.DoctorChargePer
          ? parseFloat(ele?.DoctorChargePer)
          : 0,
        chargeAmt: ele?.chargeAmt ? Number(ele?.chargeAmt) : 0,
        surgeryID: items[0]?.Surgery_ID ? String(items[0]?.Surgery_ID) : "",
      }));

      // Constructing request body
      const requestBody = {
        details: [
          {
            surDate: payload?.date
              ? moment(payload?.date).format("DD-MMM-YYYY")
              : "",
            ipdCaseTypeID: data?.ipdCaseTypeID
              ? parseInt(data?.ipdCaseTypeID)
              : 0,
            ipAddress: ip || "",
            roomID: data?.roomId ? parseInt(data?.roomId) : 0,
          },
        ],
        gvSurgeryDetail: [
          {
            surgeryName: items[0]?.SurgeryName
              ? String(items[0]?.SurgeryName)
              : "",
            surgeryCode: items[0]?.SurgeryCode
              ? String(items[0].SurgeryCode)
              : "",
            surgeryID: items[0]?.Surgery_ID ? String(items[0]?.Surgery_ID) : "",
            department: items[0]?.Department
              ? String(items[0]?.Department)
              : "",
            rate: Number(totalNewRate),
            reducePerOn: items[0]?.Reduce ? parseFloat(items[0]?.Reduce) : 0,
            calReducePerOn: Number(totalNewRate),
            // calReducePerOn: (items[0]?.surgeonCharge * items[0]?.Reduce) / 100,
            newRate: Number(TotalNetAmount),

            // newRate: totalNewRate,
            remark: items[0]?.Remarks ? String(items[0]?.Remarks) : "",
            bookingType: "",
            bookingID: "",
          },
        ],
        surgeryItem: surgeryItems, // Passing the surgeryItems array
        approveBy: payload?.Approval ? String(payload?.Approval) : "",
        narration: payload?.Remarks ? String(payload?.Remarks) : "",
        ledgerTnxNo: "", // Assuming ledgerTnxNo is left as empty string
        ipdCaseTypeID: data?.ipdCaseTypeID ? parseInt(data?.ipdCaseTypeID) : 0,
        patientTypeID: "", // Assuming patientTypeID is left empty
        ipAddress: ip || "",
        transactionID: data?.transactionID ? parseInt(data?.transactionID) : 0,
        surDate: payload?.date
          ? moment(payload?.date).format("DD-MMM-YYYY")
          : "",
        rateType: payload?.RateOn?.value ? parseInt(payload.RateOn.value) : 0,
        surgeryCalculate: TotalNetAmount ? parseFloat(TotalNetAmount) : 0,
        totalBill_Amt: "0",
        panelID: data?.panelID ? String(data.panelID) : "",
        code: items[0]?.rateListID ? String(items[0]?.rateListID) : "",
        pageUrl: location?.pathname ? String(location?.pathname) : "",
      };

      if (!payload?.Approval) {
        notify("Approval is required", "error");
      } else {
        const response = await SaveSurgery(requestBody);
        if (response?.success) {
          notify(response?.message, "success");
          sendReset();
          handleModalState(false, null, null, null);
        } else {
          notify(response?.message, "error");
        }
      }
    } catch (error) {
      console.error("Something went wrong while saving surgery", error);
    }
  };

  const totalNewRate = useMemo(() => {
    return items?.reduce((total, item) => {
      if( payload?.RateOn?.value === "2"){
           const surgeonCharge = parseFloat(item.surgeonCharge) || 0;
      const reduce = parseFloat(item.Reduce) || 0;
      const newRate = surgeonCharge - surgeonCharge * (reduce / 100);
      return total + newRate;
      }else{
  const DocCharge = parseFloat(item.DocCharge) || 0;
      const reduce = parseFloat(item.Reduce) || 0;
      const newRate = DocCharge - DocCharge * (reduce / 100);
      return total + newRate;
      }
    
    }, 0);
  }, [items,payload?.RateOn?.value]);
  // const totalNewRate = useMemo(() => {
  //   return items?.reduce((total, item) => {
  //     const surgeonCharge = parseFloat(item.surgeonCharge) || 0;
  //     const reduce = parseFloat(item.Reduce) || 0;
  //     const newRate = surgeonCharge - surgeonCharge * (reduce / 100);
  //     return total + newRate;
  //   }, 0);
  // }, [items]);

  console.log(DocType);

  // const handleMainCalculateAmt = (modifiedObj) => {
  //   const totalDoctorChargePer = DocType?.filter(
  //     (item) => item.IsChecked === true
  //   ).reduce((sum, item) => sum + item.DoctorChargePer, 0);

  //   const surgeryRate = DocType?.filter((item) => item.IsChecked === true)?.map(
  //     (ele, index) =>
  //       (ele?.DoctorChargePer / totalDoctorChargePer) * totalNewRate
  //   );
  //   console.log("surgeryRate", surgeryRate);
  //   console.log(modifiedObj);

  //   if (modifiedObj?.IsChecked === true) {
  //     if (String(payload?.RateOn?.value) === "1") {
  //       modifiedObj.chargeAmt = Number(
  //         (Number(modifiedObj?.DoctorChargePer) / totalDoctorChargePer) *
  //           totalNewRate
  //       ).toFixed(ROUNDOFF_VALUE);

  //       modifiedObj.DiscountAmt = Number(
  //         modifiedObj.chargeAmt * Number(modifiedObj.DiscountPer) * 0.01
  //       ).toFixed(ROUNDOFF_VALUE);

  //       modifiedObj.DiscountPer = Number(
  //         Number(Number(modifiedObj?.DiscountAmt) * 100) /
  //           Number(modifiedObj.chargeAmt)
  //       ).toFixed(ROUNDOFF_VALUE);

  //       modifiedObj.NetAmt = Number(
  //         modifiedObj.chargeAmt - Number(modifiedObj?.DiscountAmt)
  //       ).toFixed(ROUNDOFF_VALUE);
  //     } else {
  //       const rate = Number(
  //         Number(totalNewRate) * Number(modifiedObj?.DoctorChargePer) * 0.01
  //       ).toFixed(ROUNDOFF_VALUE);
  //       modifiedObj.chargeAmt = Number(rate);

  //       modifiedObj.DiscountAmt = Number(
  //         rate * Number(modifiedObj.DiscountPer) * 0.01
  //       ).toFixed(ROUNDOFF_VALUE);

  //       modifiedObj.DiscountPer = Number(
  //         Number(Number(modifiedObj?.DiscountAmt) * 100) / Number(rate)
  //       ).toFixed(ROUNDOFF_VALUE);

  //       modifiedObj.NetAmt = Number(rate) - Number(modifiedObj?.DiscountAmt);
  //     }
  //   }
  //   return modifiedObj;
  // };

  // const CalculateAmt = () => {
    
  //   const totalDoctorChargePer = DocType?.filter(
  //     (item) => item.IsChecked === true
  //   ).reduce((sum, item) => sum + item.DoctorChargePer, 0);

  //   // const surgeryRate = DocType?.filter((item) => item.IsChecked === true)?.map(
  //   //   (ele, index) =>
  //   //     (ele?.DoctorChargePer / totalDoctorChargePer) * totalNewRate
  //   // );
  //   // console.log("surgeryRate", surgeryRate);

  //   if (DocType.some((ele, _) => ele?.IsChecked === true)) {
  //     console.log("cccccccccc", DocType);

  //     console.log(totalDoctorChargePer);

  //     if (
  //       String(payload?.RateOn?.value) === "1" &&
  //       DocType.filter((item, _) => item.IsChecked)?.reduce(
  //         (acc, current) => Number(acc) + Number(current?.DoctorChargePer),
  //         0
  //       ) > totalDoctorChargePer
  //     ) {
  //       notify("Your Charge Percentage is Higher Then 100%", "error");
  //       return;
  //     }
  //     const response = DocType.map((item, index) => {
  //       const obj = handleMainCalculateAmt(item);
  //       return obj;
  //     });

  //     setDocType(response);
  //   } else {
  //     notify("Please Select One Test", "error");
  //   }
  // };

  const toNumber = (val, defaultValue = 0) =>
  isNaN(Number(val)) ? defaultValue : Number(val);

const handleMainCalculateAmt = (modifiedObj) => {
  const totalDoctorChargePer = toNumber(
    DocType?.filter((item) => item.IsChecked)?.reduce((sum, item) => sum + toNumber(item.DoctorChargePer), 0),
    1 // Prevent division by zero
  );

  const doctorChargePer = toNumber(modifiedObj?.DoctorChargePer);
  // const discountPer = toNumber(modifiedObj?.DiscountPer || 0);
  const discountPer = toNumber(
  modifiedObj?.DiscountPer == null ||"NaN" ? 0 : modifiedObj?.DiscountPer
);
  const totalRate = toNumber(totalNewRate);
  const rateOn = String(payload?.RateOn?.value);

  if (modifiedObj?.IsChecked) {
    if (rateOn === "1") {
      const chargeAmt = (doctorChargePer / totalDoctorChargePer) * totalRate;
      modifiedObj.chargeAmt = toNumber(chargeAmt).toFixed(ROUNDOFF_VALUE);

      modifiedObj.DiscountAmt = toNumber(
        modifiedObj.chargeAmt * discountPer * 0.01
      ).toFixed(ROUNDOFF_VALUE);

      modifiedObj.DiscountPer = totalRate
        ? (
            (toNumber(modifiedObj?.DiscountAmt || 0) * 100) /
            toNumber(modifiedObj.chargeAmt)
          ).toFixed(ROUNDOFF_VALUE)
        : "0";

      modifiedObj.NetAmt = (
        toNumber(modifiedObj.chargeAmt) - toNumber(modifiedObj?.DiscountAmt)
      ).toFixed(ROUNDOFF_VALUE);
    } else {
      const rate = (
        totalRate * doctorChargePer * 0.01
      ).toFixed(ROUNDOFF_VALUE);
      modifiedObj.chargeAmt = toNumber(rate);

      modifiedObj.DiscountAmt = (
        toNumber(rate) * discountPer * 0.01
      ).toFixed(ROUNDOFF_VALUE);

      modifiedObj.DiscountPer = rate
        ? (
            (toNumber(modifiedObj?.DiscountAmt || 0) * 100) /
            toNumber(rate)
          ).toFixed(ROUNDOFF_VALUE)
        : "0";

      modifiedObj.NetAmt = (
        toNumber(rate) - toNumber(modifiedObj?.DiscountAmt)
      ).toFixed(ROUNDOFF_VALUE);
    }
  }

  return modifiedObj;
};

const CalculateAmt = () => {
  const totalDoctorChargePer = toNumber(
    DocType?.filter((item) => item.IsChecked)?.reduce((sum, item) => sum + toNumber(item.DoctorChargePer), 0),
    0
  );

  if (DocType?.some((ele) => ele?.IsChecked)) {
    if (
      String(payload?.RateOn?.value) === "1" &&
      toNumber(
        DocType.filter((item) => item.IsChecked)?.reduce(
          (acc, current) => acc + toNumber(current?.DoctorChargePer),
          0
        )
      ) > totalDoctorChargePer
    ) {
      notify("Your Charge Percentage is Higher Than 100%", "error");
      return;
    }

    const response = DocType.map((item) => handleMainCalculateAmt({ ...item }));
    setDocType(response);
  } else {
    notify("Please Select One Test", "error");
  }
};

  const TotalNetAmount = DocType.filter((item, _) => item.IsChecked)?.reduce(
    (acc, current) => Number(acc) + Number(current?.NetAmt),
    0
  );

  return (
    <>
      <div className="card mt-2">
        <Heading title={t("Item Detail")} />
        <div className="row p-2">
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="date"
            name="date"
            value={payload?.date ? payload?.date : new Date()}
            handleChange={handleChange}
            lable={t("Date")}
            placeholder={VITE_DATE_FORMAT}
          />
          <ReactSelect
            placeholderName={t("Rate On")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            id={"RateOn"}
            name={"RateOn"}
            value={payload?.RateOn?.value}
            removeIsClearable={true}
            handleChange={(name, e) =>
              handleReactSelect(
                name,
                e,
                getBindDocType(e?.value, items[0]?.Surgery_ID)
              )
            }
            dynamicOptions={RateOnOptions}
          />
          <div className="col-sm-4">
            <SearchByName
              data={data}
              handleItemSelect={handleItemSelect}
              itemName={payload?.itemName}
            />
            {
              console.log("items",items)
            }
          </div>
          {/* <ReactSelect
            placeholderName={t("Type")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            id={"Type"}
            name={"Type"}
            value={payload?.Type?.value}
            handleChange={handleReactSelect}
            dynamicOptions={RateType}
          /> */}
          <div className="col-sm-1">
            <div className="d-flex justify-content-between">
              <button className="btn btn-sm btn-success" onClick={getRate}>
                {t("Get Rate")}
              </button>
              <button className="btn btn-sm btn-success ml-2">{t("Reset")}</button>
            </div>
          </div>
        </div>
        <div className="row px-2 pb-2 mx-1">
          <SurgeryDepartmentDetailsTable
            THEAD={AddItemHead}
            tbody={items}
            handleIndexChange={handleIndexChange}
            handleDelete={onDelete}
            payload={payload}
          />
        </div>
        {items?.length > 0 && (
          <div className="row px-2">
            <div className="col-sm-12 d-flex justify-content-end">
              <b>{t("Total New Rate")}:</b>
              <b className="text-danger"> {totalNewRate}</b>
            </div>
          </div>
        )}
      </div>
      {items?.length > 0 && (
        <>
          <div className="card mt-2">
            <Heading title={t("Surgery Detail")} />
            <SurgeryDetailsTable
              THEAD={SurgeryHead}
              tbody={DocType}
              handleCustomSelect={handleCustomSelect}
              handleItemsChange={handleItemsChange}
              handleSelect={handleSelect}
            />
          </div>

          <div className="card mt-2">
            <div className="row px-2 py-2">
              <button
                className="btn btn-sm btn-success ml-2"
                onClick={CalculateAmt}
              >
                {t("Calculator")}
              </button>
              <ReactSelect
                placeholderName={t("Calculate On")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                id={"CalculateOn"}
                name={"CalculateOn"}
                value={payload?.CalculateOn?.value}
                handleChange={handleReactSelect}
                dynamicOptions={CalculateOption}
              />
              {/* <Input
                type="text"
                className="form-control"
                id="SurgeryAmount"
                name="SurgeryAmount"
                value={payload?.SurgeryAmount}
                onChange={handleChange}
                lable={t("Surgery Amount")}
                placeholder=""
                respclass="col-xl-2 col-md-2 col-sm-6 col-12"
              /> */}
              {/* <Input
                type="number"
                className="form-control"
                id="SurgeonAmount"
                name="SurgeonAmount"
                value={
                  payload?.SurgeonAmount
                    ? payload?.SurgeonAmount
                    : totalNewRate.toFixed(2)
                }
                onChange={handleChange}
                lable={t("Surgeon Amount")}
                placeholder=""
                respclass="col-xl-2 col-md-2 col-sm-6 col-12"
              /> */}
              <Input
                type="number"
                className="form-control"
                id="TotalNetAmount"
                name="TotalNetAmount"
                lable={t("Total Amt.")}
                value={TotalNetAmount}
                placeholder=""
                respclass="col-xl-2 col-md-2 col-sm-6 col-12"
              />
              <ReactSelect
                placeholderName={t("Approval")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                id={"Approval"}
                name={"Approval"}
                value={payload?.Approval}
                dynamicOptions={approval.map((ele) => ({
                  value: ele?.ApprovalType,
                  label: ele?.ApprovalType,
                }))}
                handleChange={handleReactSelectItem}
                requiredClassName={"required-fields"}
              />

              <Input
                type="text"
                className="form-control"
                id="Remarks"
                name="Remarks"
                value={payload?.Remarks}
                onChange={handleChange}
                lable={t("Remarks")}
                placeholder=""
                respclass="col-xl-2 col-md-2 col-sm-6 col-12"
              />
              <div className="col-sm-1">
                <button
                  className="btn btn-sm btn-success"
                  onClick={handleSaveSurgery}
                >
                  {t("Save")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Surgery;
