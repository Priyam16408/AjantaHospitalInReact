import React, { useCallback, useEffect, useState } from "react";
import Tables from "..";
import Modal from "../../../modalComponent/Modal";
import SlotModal from "../../../modalComponent/Utils/SlotModal";
import HtmlSelect from "../../../formComponent/HtmlSelect";
import { useSelector } from "react-redux";
import CustomSelect from "../../../formComponent/CustomSelect";
import Input from "../../../formComponent/Input";
import { ROUNDOFF_VALUE } from "../../../../utils/constant";
import { calculateBillAmount, notify } from "../../../../utils/utils";
import { Tooltip } from "primereact/tooltip";
import PackageDetails from "../../../modalComponent/Utils/PackageDetails";
import InvestigationModal from "../../../modalComponent/Utils/InvestigationModal";
import { GetDoctorAppointmentTimeSlotConsecutive } from "../../../../networkServices/opdserviceAPI";
import { debounce } from "../../../../networkServices/axiosInstance";
import WrapTranslate from "../../../WrapTranslate";

function TestAddingTable(props) {
  const {
    THEAD,
    bodyData,
    setBodyData,
    handlePaymentGateWay,
    paymentControlModeState,
    payloadData,
    singlePatientData,
    discounts,
    UHID,
  } = props;
  console.log("payloadData", payloadData);
  console.log("singlePatientData", singlePatientData);
  const [modalData, setModalData] = useState({
    show: false,
    component: null,
    size: null,
    header: null,
  });

  const { BindResource, GetAllDoctorList } = useSelector(
    (state) => state?.CommonSlice
  );
  // const handleCustomSelect = (index, name, e) => {
  //   let data = [...bodyData];

  //   // Update selected field value
  //   data[index][name] = e.value;

  //   // Add or update DoctorID for the specific row
  //   data[index].DoctorID = payloadData?.DoctorID;

  //   // Set the updated bodyData
  //   setBodyData(data);

  //   console.log("Updated Data at index", index, data[index]);  // To check updated data
  // };
  // useEffect(()=>{
  //   handleCustomSelect()
  // },[payloadData?.DoctorID])
  console.log("payloadData?.DoctorID", payloadData?.DoctorID)
  const handleCustomSelect = (index, name, e) => {
    let data = [...bodyData];
    data[index][name] = e.value;
    setBodyData(data);
  };
  useEffect(() => {
    let updatedData = [...bodyData];

    updatedData = updatedData.map((item) => ({
      ...item,
      DoctorID: payloadData?.DoctorID // Add DoctorID to every row
    }));

    // Set updated data
    setBodyData(updatedData);
  }, [payloadData?.DoctorID]);

  const handleDeleteRow = (index) => {
    // debugger;
    // if(BindResource?.RegistrationChargeApplicable==="1" && singlePatientData?.Registration===0){
    //   notify("Cannot delete:registration for new patient.", "warn");
    //   return
    // }
    let data = [...bodyData];
    data.splice(index, 1);
    const amount = calculateBillAmount(
      data,
      BindResource?.isReceipt,
      singlePatientData?.OPDAdvanceAmount,
      false,
      0,
      0.0,
      payloadData?.panelID?.value === 1 ? 1 : 0,
      0
    );
    // debugger
    handlePaymentGateWay(amount);
    setBodyData(data);
    
  };

  const handleCalculation = (modifiedData, name) => {
    modifiedData.grossAmount =
      Number(modifiedData?.Rate) * Number(modifiedData?.defaultQty);

    if (name !== "discountAmount") {
      modifiedData.discountAmount = Number(
        Number(modifiedData.Rate) *
        Number(modifiedData?.defaultQty) *
        Number(modifiedData?.discountPercentage) *
        0.01
      ).toFixed(ROUNDOFF_VALUE);
    }

    if (name !== "discountPercentage") {
      modifiedData.discountPercentage = Number(
        Number(Number(modifiedData.discountAmount) * 100) /
        modifiedData.grossAmount
      ).toFixed(ROUNDOFF_VALUE);
    }

    modifiedData.amount =
      Number(modifiedData?.Rate) * Number(modifiedData?.defaultQty ? modifiedData?.defaultQty : 1) -
      modifiedData?.discountAmount;

    modifiedData.coPaymentAmount = Number(
      modifiedData.amount * modifiedData?.coPaymentPercent * 0.01
    ).toFixed(ROUNDOFF_VALUE);

    modifiedData.GSTAmount = Number(
      modifiedData.amount * modifiedData.GstPer * 0.01
    ).toFixed(ROUNDOFF_VALUE);

    modifiedData.PayableAmount =
      modifiedData?.IsPayable === "1"
        ? modifiedData?.amount
        : modifiedData?.coPaymentAmount;

    return modifiedData;
  };

  // console.log(payloadData);

  const debouncedHandlePaymentGateWay = useCallback(
    debounce((data, BindResource, singlePatientData, payloadData) => {
      const amount = calculateBillAmount(
        data,
        BindResource?.isReceipt,
        singlePatientData?.OPDAdvanceAmount,
        false,
        1,
        0.0,
        payloadData?.panelID?.value === 1 ? 1 : 0,
        0
      );
      handlePaymentGateWay(amount);
    }, 300),
    []
  );

  // const handleInputChange = (e, index) => {
  //   const { name, value } = e.target;
  //   let data = [...bodyData];
  //   let modifiedData = data[index];
  //   if (name === "discountPercentage") {
  //     modifiedData[name] =
  //       value > discounts?.Eligible_DiscountPercent
  //         ? discounts?.Eligible_DiscountPercent
  //         : value;
  //   } else {
  //     modifiedData[name] = value;
  //   }
  //   const resultData = handleCalculation(modifiedData, name);
  //   data[index] = resultData;
  //   setBodyData(data);
  //   debouncedHandlePaymentGateWay(
  //     data.filter((ele) => Number(ele["typeOfApp"]) === 2),
  //     BindResource,
  //     singlePatientData,
  //     payloadData
  //   );
  // };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "isUrgent") {
      newValue = e.target.checked ? 1 : 0
    }
    let data = [...bodyData];
    let modifiedData = data[index];


    // Convert to number if it's a numeric field
    if (["defaultQty"].includes(name)) {
      newValue = Number(value) || 1;
    }

    if (["Rate"].includes(name)) {
      newValue = Number(value) || 1;
    }
    if (["discountPercentage"].includes(name)) {
      newValue = Number(value) || 0;
    }
    if (name === "discountPercentage") {
      modifiedData[name] =
        newValue > discounts?.Eligible_DiscountPercent
          ? discounts?.Eligible_DiscountPercent
          : newValue;
    } else {
      modifiedData[name] = newValue;
    }

    const resultData = handleCalculation(modifiedData, name);
    data[index] = resultData;
    setBodyData(data);

    debouncedHandlePaymentGateWay(
      data.filter((ele) => Number(ele["typeOfApp"]) === 2),
      BindResource,
      singlePatientData,
      payloadData
    );
  };

  const handleWalkInData = async (modifiedData) => {
    try {
      const apiResponse = await GetDoctorAppointmentTimeSlotConsecutive(
        modifiedData?.Type_ID,
        modifiedData?.AppointedDate
      );
      if (apiResponse?.success) {
        const AppointedDateTime = apiResponse.data.find(
          (ele) => ele?.IsDefault === 1
        );
        const AppointedData = AppointedDateTime
          ? `${AppointedDateTime?.SlotDateDisplay}#${AppointedDateTime?.FromTimeDisplay}-${AppointedDateTime?.ToTimeDisplay}`
          : "";

        return AppointedData;
      } else {
        notify(apiResponse?.message, "error");
        return [];
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handletypeOfApp = async (e, index) => {
    const { name, value } = e.target;
    let data = [...bodyData];
    let modifiedData = data[index];
    modifiedData[name] = value;

    if (value !== "2") {
      handleSlotModal(index);
    } else {
      const appointmentData = await handleWalkInData(modifiedData);
      modifiedData.AppointedDateTime = appointmentData;
    }
    data[index] = modifiedData;
    debouncedHandlePaymentGateWay(
      data,
      BindResource,
      singlePatientData,
      payloadData
    );
    setBodyData(data);
  };

  const handleSlotModal = (index) => {
    setModalData({
      show: true,
      component: (
        <div>
          <SlotModal
            data={{ ...bodyData[index], Item: bodyData[index]?.label }}
            handleSetData={(e) => handleSetData(e, index)}
          />
        </div>
      ),
      size: "95vw",
      header: "Doctor Slot",
    });
  };

  const handleInvestigationSlot = (index) => {
    setModalData({
      show: true,
      component: (
        <div>
          <InvestigationModal
            data={bodyData[index]}
            handleSetData={(e) => handleSetData(e, index)}
          />
        </div>
      ),
      size: "90vw",
      header: "Investigation Slot",
    });
  };

  const handlePackageData = (modifiedData, index) => {
    const data = [...bodyData];
    data[index] = modifiedData;
    setModalData({
      show: true,
      component: (
        <div>
          <PackageDetails
            data={data[index]}
            handlePackageData={(e) => handlePackageData(e, index)}
          />
        </div>
      ),
      size: "70vw",
      header: "Package Details",
    });
    setBodyData(data);
  };

  const handlePackageDetails = (index) => {
    setModalData({
      show: true,
      component: (
        <div>
          <PackageDetails
            data={bodyData[index]}
            handlePackageData={(e) => handlePackageData(e, index)}
          />
        </div>
      ),
      size: "70vw",
      header: "Package Details",
    });
  };

  const handleSetData = (modifiedData, index) => {
    const data = [...bodyData];
    data[index] = modifiedData;
    setBodyData(data);
    setModalData({
      show: false,
      component: null,
      header: null,
      size: null,
    });
  };

  const handleSplit = (data, replace, byreplace) => {
    return data ? data?.replace(replace, byreplace) : data;
  };

  const SlotComponent = ({ index, row, isDisable }) => {
    console.log(row, "rrororr")
    // tnxtypeID===5
    return (
      <>
        <Tooltip
          target={`#appointMent${index}`}
          position="mouse"
          content={handleSplit(row?.AppointedDateTime, "#", " ")}
          event="hover"
          className="ToolTipCustom"
        />
        <i
          className="fa fa-calendar"
          aria-hidden="true"
          id={`appointMent${index}`}
          onClick={() => {
            if (isDisable || row?.SubCategoryID === 6) return;
            handleSlotModal(index);
          }}

        ></i>
      </>
    );
  };

  const InvestigationSlot = ({ index, row, isDisable }) => {
    // categoryID===7
    return (
      <>
        <Tooltip
          target={`#InvestigationSlot${index}`}
          position="mouse"
          content={handleSplit(row?.AppointedDateTime, "#", " ")}
          event="hover"
          className="ToolTipCustom"
        />
        <i
          className="fa fa-calendar"
          aria-hidden="true"
          id={`InvestigationSlot${index}`}
          onClick={() =>
            isDisable ? () => { } : handleInvestigationSlot(index)
          }
        ></i>
      </>
    );
  };


  const settleFunction = (row, index) => {
    let tableData = {
      Slot: null,
      type: null,
      ItemCode: null,
      PackageView: null,
      ItemDisplayName: null,
      Token: null,
      Doctor: null,
      GstType: null,
      GstPer: null,
      Rate: null,
      Qty: null,
      DiscountPercentage: null,
      DisAmount: null,
      amount: null,
      GSTAmount: null,
      PayableAmount: null,
      Checkbox: null,
      action: null,
    };

    // slot condition
    console.log(row, "roore")

    if (
      row?.CategoryID === "7" &&
      // BindResource?.IsInvestigationAppointment === "1" &&
      row?.isMobileBooking === 1
    ) {
      tableData.Slot = <i className="fa fa-calendar" aria-hidden="true"></i>;
    } else if (
      row?.CategoryID === "7" &&
      // BindResource?.IsInvestigationAppointment === "1" &&
      row?.isMobileBooking === 0
    ) {
      tableData.Slot = (
        <InvestigationSlot index={index} row={row} isDisable={UHID} />
      ); // popup function 1
    } else if (row?.TnxTypeID === "5") {
      tableData.Slot = (
        <SlotComponent index={index} row={row} isDisable={UHID} />
      ); // popup function 2
    }


    // type Condition
    if (row?.TnxTypeID === "5") {
      tableData.type = (
        <HtmlSelect
          option={row?.AppointedType}
          value={row?.typeOfApp}
          name="typeOfApp"
          onChange={(e) => handletypeOfApp(e, index)}
          isDisable={UHID || row?.SubCategoryID === 6 }
        /> //handleChange && popup function 1
      );
    }

    // code
    tableData.ItemCode = row?.ItemCode;

    // PackageView

    if (row?.TnxTypeID === "23") {
      tableData.PackageView = (
        <button
          className="btn btn-sm text-white"
          onClick={() => handlePackageDetails(index)}
          disabled={UHID}
        >
          +
        </button>
      ); //bindpackageItemDetailnew api call
    }

    // ItemName

    tableData.SubCategory = row?.SubCategory;
    tableData.ItemDisplayName = row?.ItemDisplayName;

    // last Token Number;

    tableData.Token = (
      <div style={{ color: "#f9183f", fontWeight: 800, textAlign: "center" }}>
        {row?.Token}
      </div>
    );

    // Doctor
    // debugger

    if (row?.TnxTypeID !== "5" && row?.TnxTypeID !== "23") {
      tableData.Doctor = (
        <CustomSelect
          option={GetAllDoctorList}
          // value={payloadData?.DoctorID ? payloadData?.DoctorID : row?.DoctorID}
          value={row?.DoctorID !== "0" ? row?.DoctorID : payloadData?.DoctorID}
          placeHolder="Select Doctor"
          name="DoctorID"
          isDisable={UHID}
          onChange={(name, e) => handleCustomSelect(index, name, e)}
        />
      );
    }

    // GstType

    tableData.GstType = <div>{row?.GstType}</div>;

    // GstPer

    tableData.GstPer = <div className="text-right">{row?.GstPer}</div>;

    // Rate

    tableData.Rate = (
      <Input
        type="number"
        className="table-input"
        name={"Rate"}
        removeFormGroupClass={true}
        display={"right"}
        onChange={(e) => handleInputChange(e, index)}
        value={row?.Rate}
        disabled={row?.constantRate > 1 ? row?.rateEditAble : false}
      />
    );

    // Qty
    tableData.Qty = (
      <Input
        type="number"
        className="table-input"
        value={row?.defaultQty}
        removeFormGroupClass={true}
        name={"defaultQty"}
        display={"right"}
        onChange={(e) => handleInputChange(e, index)}
        max={row?.defaultQty}
        disabled={["7", "3"].includes(row?.TnxTypeID) ? true : false}
      />
    );

    // DiscountPercentage
    tableData.DiscountPercentage = (
      <Input
        type="number"
        className="table-input"
        name={"discountPercentage"}
        removeFormGroupClass={true}
        value={row?.discountPercentage}
        display={"right"}
        onChange={(e) => handleInputChange(e, index)}
        max={100}
        disabled={
          [2].includes(Number(row?.typeOfApp)) ? !row?.IsDiscountEnable : true
        }
      />
    );

    // DisAmount

    tableData.DisAmount = (
      <Input
        type="number"
        className="table-input"
        removeFormGroupClass={true}
        display={"right"}
        name="discountAmount"
        value={row?.discountAmount}
        disabled={
          [2].includes(Number(row?.typeOfApp)) ? !row?.IsDiscountEnable : true
        }
        onChange={(e) => handleInputChange(e, index)}
      />
    );

    // amount

    tableData.amount = (
      <div className="text-right">
        {Number(row?.amount).toFixed(ROUNDOFF_VALUE)}
      </div>
    );

    // GSTAmount

    tableData.GSTAmount = <div className="text-right"> {row?.GSTAmount}</div>;

    // PayableAmount

    tableData.PayableAmount = (
      <div className="text-right">{row?.PayableAmount}</div>
    );

    // Checkbox
    if (!["5", "23", "20"].includes(row?.TnxTypeID)) {
      tableData.Checkbox = <input type="checkbox" name="isUrgent" onChange={(e) => handleInputChange(e, index)} />;
    }

    // action
    tableData.action = (
      <i
        className="fa fa-trash text-danger text-center "
        aria-hidden="true"
        onClick={() => (UHID ? () => { } : handleDeleteRow(index))}
      />
    );

    return tableData;
  };

  // console.log(bodyData, BindResource);

  return (
    <div className="card patient_registration_card my-1">
      <Tables
        thead={WrapTranslate(THEAD)}
        style={{
          maxHeight: "185px",
        }}
        tbody={bodyData?.map((row, index) => {
          const {
            Slot,
            type,
            ItemCode,
            PackageView,
            ItemDisplayName,
            SubCategory,
            Token,
            Doctor,
            GstType,
            GstPer,
            Rate,
            Qty,
            DisAmount,
            DiscountPercentage,
            amount,
            GSTAmount,
            PayableAmount,
            Checkbox,
            action,
          } = settleFunction(row, index);

          return {
            Slot: Slot,
            type: type,
            ItemCode: ItemCode,
            PackageView: PackageView,
            SubCategory: SubCategory,
            ItemDisplayName: ItemDisplayName,
            Token: Token,
            Doctor: Doctor,
            GstType: GstType,
            GstPer: GstPer,
            Rate: Rate,
            Qty: Qty,
            DiscountPercentage: DiscountPercentage,
            DisAmount: DisAmount,
            amount: amount,
            GSTAmount: GSTAmount,
            PayableAmount: PayableAmount,
            Checkbox: Checkbox,
            action: action,
          };
        })}
      />

      {modalData?.show && (
        <Modal
          visible={modalData?.show}
          setVisible={() =>
            setModalData({
              show: false,
              component: null,
              size: null,
            })
          }
          modalWidth={modalData?.size}
          Header={modalData?.header}
          footer={<></>}
        >
          {modalData?.component}
        </Modal>
      )}
    </div>
  );
}

export default TestAddingTable;
