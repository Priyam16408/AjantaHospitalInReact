import i18n from "@app/utils/i18n";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactSelect from "../formComponent/ReactSelect";
import Button from "../formComponent/Button";
import { AutoComplete } from "primereact/autocomplete";
import {
  BindPackageItemDetailsNew,
  GetAppointmentCount,
  GetBindLabInvestigationRate,
  GetDiscountWithCoPay,
  GetDoctorAppointmentTimeSlotConsecutive,
  GetLoadOPD_All_ItemsLabAutoComplete,
  GetPackageExpirayDate,
  GetRoleWiseOPDServiceBookingControls,
  GetValidateDoctorLeave,
  GetValidateDoctorMap,
  OPDDoctorConsulationData,
  OPDGetIsFollowUpExist,
  getAlreadyPrescribeItem,
} from "../../networkServices/opdserviceAPI";
import {
  AddInvestigation,
  ReactSelectisDefaultValue,
  calculateBillAmount,
  filterByType,
  filterByTypes,
  handlereferDocotorIDByReferalType,
  notify,
} from "../../utils/utils";
import { ROUNDOFF_VALUE, SEARCH_BY_TEST } from "../../utils/constant";
import Confirm from "../modalComponent/Confirm";
import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import { GetAllDoctor } from "../../store/reducers/common/CommonExportFunction";
import Modal from "../modalComponent/Modal";
import CPOEModal from "../modalComponent/Utils/CPOEModal";
import InvestigationModal from "../modalComponent/Utils/InvestigationModal";
import { bindAppointmentDetail } from "../../networkServices/OPDConfirmation";
import { t } from "i18next";
import { use } from "react";

function TestPayment({
  testPaymentState,
  setTestPaymentState,
  payloadData,
  singlePatientData,
  setTestAddingTable,
  testAddingTableState,
  handlePaymentGateWay,
  TestData,
  setPayloadData,
  UHID,
}) {
  const dispatch = useDispatch();
  let getCheckedData = [];
  const { BindResource } = useSelector((state) => state?.CommonSlice);
  const ref = useRef();
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [dropDownState, setDropDown] = useState({
    RoleWiseOPDServiceBookingControlData: [],
  });

  let isRateZero;


  // const [OPDFollowUpSubCategory, setOPDFollowUpSubCategory] = useState("");

  const [confirmBoxvisible, setConfirmBoxvisible] = useState({
    show: false,
    alertMessage: "",
    lableMessage: "",
    chidren: "",
  });

  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });

  const handlegetCheckedData = (rowData) => {
    getCheckedData = rowData?.filter((row, index) => row?.isChecked);
  };

  const handleInvestigationSlot = (data) => {
    setModalHandlerState({
      header: "Investigation Slot",
      show: true,
      size: "95vw",
      footer: <></>,
      component: (
        <div>
          <InvestigationModal
            data={data}
            handleSetData={(e) => handleAddInvestigationSlot(e, data)}
          />
        </div>
      ),
    });
  };



  useEffect(() => {
    if (
      TestData.length > 0 &&
      Object.keys(singlePatientData).length > 0 &&
      payloadData?.panelID?.value &&
      payloadData?.panelID?.panelCurrencyFactor
    ) {
      handleAddInvestigation(TestData);
    }
  }, [TestData, singlePatientData, payloadData?.panelID]);

  const handleAddInvestigation = async () => {

    if (getCheckedData.length > 0) {
      try {
        const test = [];
        for (const data of getCheckedData) {
          const modifiedData = AddInvestigation(data);

          const addtesting = await testAddingObject(
            modifiedData,
            0,
            data?.PatientTest_ID,
            1,
            1,
            modifiedData?.appointmentID
          );


          // const AppointedDateTime = await bindAppointmentDetail(
          //   String(modifiedData?.appointmentID)
          // );

          // const reponseDataOfAppointedDateTime = AppointedDateTime?.data[0];

          // addtesting.AppointedDateTime = reponseDataOfAppointedDateTime
          //   ? `${reponseDataOfAppointedDateTime?.Date}#${reponseDataOfAppointedDateTime?.Time}-${reponseDataOfAppointedDateTime?.EndTime}`
          //   : "";
          // test.push({ ...addtesting, DoctorID: modifiedData?.DoctorID });
          test.push(addtesting);



        }

        handlePaymentGateWay(
          calculateBillAmount(
            [...test, ...testAddingTableState],
            BindResource?.isReceipt,
            singlePatientData?.OPDAdvanceAmount,
            false,
            1,
            0.0,
            payloadData?.panelID?.value === 1 ? 1 : 0,
            0
          )
        );
        const finalData = [...test, ...testAddingTableState];
        if (isRateZero && BindResource?.IsShowItemWithoutRate == "0" && testPaymentState?.category !== "1") {

          notify("Selected Item Does not have Rate", "warn")
          return
        }
        else {
          setTestAddingTable(finalData);

        }
        // setTestAddingTable(finalData);
        // console.log("All investigations validated successfully.");
        TestData.pop();
        setModalHandlerState({ show: false })
      } catch (error) {
        console.error("Error validating investigation:", error);
      }
    } else {
      console.log("No data to validate.");
    }
  };

  const handleModalState = () => {
    setModalHandlerState({
      show: true,
      header: i18n.t("Prescription Search"),
      size: "70vw",
      component: (
        <CPOEModal
          singlePatientData={singlePatientData}
          handlegetCheckedData={handlegetCheckedData}
        />
      ),
      footer: (
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <div></div>
            <div>
              <Button
                name={t("Add Investigation")}
                className={"btn btn-sm btn-primary mx-1"}
                handleClick={handleAddInvestigation}
              />

              {/* <Button
                name={"Close"}
                className={"btn btn-sm btn-primary mx-1"}
              /> */}
            </div>
          </div>
        </div>
      ),
    });
  };

  const handleGetLoadOPD_All_ItemsLabAutoComplete = async (payload) => {
    try {
      const data = await GetLoadOPD_All_ItemsLabAutoComplete(payload);
      return data?.data?.length > 0 ? data?.data : [];
    } catch (error) {
      console.log(error, "error`");
    }
  };

  const search = async (event) => {
    const item = await handleGetLoadOPD_All_ItemsLabAutoComplete({
      searchType: testPaymentState?.searchType,
      prefix: event?.query.trim(),
      type: testPaymentState?.type ? testPaymentState?.type : "100",
      categoryID: testPaymentState?.category ? testPaymentState?.category : "",
      subCategoryID: testPaymentState?.subCategory ? testPaymentState?.subCategory : "",
      itemID: "",
      "doctorID": "",
      PanelID: payloadData?.panelID?.PanelID,
    });
    setItems(item);
  };

  const checkPatientFollowup = async (subID, doctorID) => {

    try {
      const response = payloadData?.panelID?.IsFollowupApplicable === 1 && await OPDGetIsFollowUpExist(singlePatientData?.PatientID, payloadData?.DoctorID)
      if (response?.success) {
        handleconsulationBooking(response?.data, doctorID)
        setTestPaymentState((preV) => ({
          ...preV,
          subCategory: response?.data
        }))
      }
      else {
        handleconsulationBooking(subID ? subID : testPaymentState?.subCategory, doctorID)
        setTestPaymentState((preV) => ({
          ...preV,
          subCategory: subID ? subID : testPaymentState?.subCategory
        }))
      }

    } catch (error) {
      console.log(error, "error`");
    }

  }


  const registration = async () => {
    // && payloadData?.Source !== "OUTSOURCE"
    if (BindResource?.RegistrationChargeApplicable === "1" && singlePatientData?.Registration === 0 && payloadData?.panelID?.PanelGroupID === 1 && payloadData?.DoctorID) {
      const payload = {
        "searchType": 1,
        doctorID: "",
        "prefix": "",
        "type": "all",
        "categoryID": 0,
        "subCategoryID": 0,
        // "itemID": 9,
        "itemID": BindResource?.RegistrationItemID,
        PanelID: payloadData?.panelID?.PanelID,

      }
      const item = await handleGetLoadOPD_All_ItemsLabAutoComplete(payload)
      if (item) {
        const payload = {
          value: item[0]
        }

        validateInvestigation(payload, 0, 0, 1, 0, 0)
      }
    }

  }

  useEffect(() => {
    // if (payloadData?.Source === "OUTSOURCE") {
    //   return
    // }
    registration()
  }, [payloadData?.panelID, singlePatientData?.PatientID, payloadData?.DoctorID])

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

  const FetchAllDropDown = async () => {
    try {
      const response = await Promise.all([
        GetRoleWiseOPDServiceBookingControls(),
      ]);

      setDropDown({
        RoleWiseOPDServiceBookingControlData: response[0]?.data,
      });
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleReactSelect = (name, e) => {
    if (name === "category") {
      setTestPaymentState((preV) => ({
        ...preV,
        subCategory: ""
      }))
    }

    const { value } = e === null ? {} : e;
    setTestPaymentState((preV) => ({
      ...preV,
      [name]: value ?? e
    }))
  };

  useEffect(() => {
    FetchAllDropDown();
    dispatch(GetAllDoctor());
  }, []);

  const handleMakeStringToArray = (...rest) => {
    const data = rest?.reduce((acc, current) => {
      let splitStr = current?.value.split(",");
      let resultArray = splitStr.map((str) => str.replace(/'/g, ""));
      acc[current?.returnName] = resultArray;
      return acc;
    }, {});
    return data;
  };

  const handleGetPackageExpirayDate = async (PackageID, TnxTypeID) => {
    if (TnxTypeID != "23") {
      return true;
    }
    try {
      const data = await GetPackageExpirayDate(PackageID);
      return data?.data;
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleGetValidateDoctorMap = async (itemID, labType) => {
    if (labType === "OPD") {
      try {
        const data = await GetValidateDoctorMap(itemID);
        return data?.data;
      } catch (error) {
        console.log(error, "error");
      }
    } else {
      return true;
    }
  };

  const handleGetValidateDoctorLeave = async (itemID) => {
    try {
      const data = await GetValidateDoctorLeave(itemID);
      return data?.data;
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleGetDiscountWithCoPay = async (
    itemID,
    panelID,
    PatientTypeID,
    memberShipCardNo
  ) => {
    try {
      const data = await GetDiscountWithCoPay(
        itemID,
        panelID,
        PatientTypeID,
        memberShipCardNo
      );
      return data?.data;
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleGetAlreadyPrescribeItem = async (PatientID, itemID) => {
    try {
      const data = await getAlreadyPrescribeItem(PatientID, itemID);
      return data?.data;
    } catch (error) {
      console.log(error, "error");
    }
  };
  // 
  const handleGetBindLabInvestigationRate = async (
    panelID,
    ItemID,
    CategoryID,
    TID,
    IPDCaseTypeID,
    panelCurrencyFactor
  ) => {
    try {
      // 
      const data = await GetBindLabInvestigationRate(
        panelID,
        ItemID,
        CategoryID,
        singlePatientData?.IsInternational,
        TID,
        IPDCaseTypeID,
        panelCurrencyFactor
      );
      return data?.data;
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleGetAppointmentCount = async (
    tnxType,
    DoctorID,
    AppointedDate
  ) => {
    if (tnxType === "5") {

      try {
        const data = await GetAppointmentCount(DoctorID, AppointedDate);
        return data?.data ?? "00";
      } catch (error) {
        console.log(error, "error");
      }
    }
  };

  const handlePackageDetailsData = (packageData) => {
    for (let i = 0; i < packageData?.length > 0; i++) {
      if (Number(packageData[i]["PackageType"]) !== 2) {
        packageData[i]["DoctorID"] = Number(payloadData?.DoctorID);
      }
    }

    return packageData;
  };

  const handleBindPackageItemDetailsNew = async (TnxTypeID, packageID) => {
    if (TnxTypeID === "23") {
      try {
        const data = await BindPackageItemDetailsNew(packageID);
        const returnData = handlePackageDetailsData(data?.data);
        return returnData;
      } catch (error) {
        console.log(error, "error");
      }
    } else {
      return [];
    }
  };

  const handleDoctorSlotTime = async (modifiedData) => {
    try {

      const apiResponse = await GetDoctorAppointmentTimeSlotConsecutive(
        modifiedData?.Type_ID,
        modifiedData?.AppointedDate
      );
      if (apiResponse?.success) {
        const AppointedDateTime = apiResponse.data.find(
          (ele) => ele?.IsDefault === 1
        );

        modifiedData.AppointedDateTime = AppointedDateTime
          ? `${AppointedDateTime?.SlotDateDisplay}#${AppointedDateTime?.FromTimeDisplay}-${AppointedDateTime?.ToTimeDisplay}`
          : "";
        const AddRow = [modifiedData, ...testAddingTableState];
        handlePaymentGateWay(
          calculateBillAmount(
            AddRow,
            BindResource?.isReceipt,
            singlePatientData?.OPDAdvanceAmount,
            false,
            0,
            0.0,
            payloadData?.panelID?.value === 1 ? 1 : 0,
            0
          )
        );

        // setTestAddingTable(AddRow);
        if (isRateZero && BindResource?.IsShowItemWithoutRate == "0" && AddRow[0]?.CategoryID !== 1) {
          notify("Selected Item Does not have Rate", "warn")
          return
        }
        else {
          // Added this code for change culsultaion and 
          // setTestAddingTable(test);
          if (modifiedData?.type === "4") {

            const CulsultaionfilterData = JSON.parse(JSON.stringify(AddRow))?.filter((ele) => ele?.type !== "4");
            const updateDoctor = [modifiedData, ...CulsultaionfilterData]?.map((val) => { return { ...val, DoctorID: payloadData?.DoctorID } })
            handlePaymentGateWay(
              calculateBillAmount(
                updateDoctor,
                BindResource?.isReceipt,
                singlePatientData?.OPDAdvanceAmount,
                false,
                0,
                0.0,
                payloadData?.panelID?.value === 1 ? 1 : 0,
                0
              )
            );
            setTestAddingTable(updateDoctor);
            // setTestAddingTable(AddRow);
          } else {
            setTestAddingTable(AddRow);
          }

        }
      } else {
        notify(apiResponse?.message, "error")
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApiCallforTestAdding = async (modifiedData) => {
    // 
    const packageData = await handleBindPackageItemDetailsNew(
      modifiedData?.TnxTypeID,
      modifiedData?.Type_ID
    );

    modifiedData.PackageTable = packageData;

    const tokenData = await handleGetAppointmentCount(
      modifiedData?.TnxTypeID,
      modifiedData?.Type_ID,
      modifiedData?.AppointedDate
    );

    modifiedData.Token = tokenData;

    // first Api
    const data = await handleGetPackageExpirayDate(
      modifiedData?.Type_ID,
      modifiedData?.TnxTypeID
    );

    if (data) {
      // SecondApi
      const secondData = await handleGetValidateDoctorMap(
        modifiedData?.val,
        modifiedData?.LabType
      );

      if (secondData) {
        // third Api

        const thirdData = await handleGetValidateDoctorLeave(modifiedData?.val);

        if (!thirdData) {
          // fourth APi
          const fouthData = await handleGetAlreadyPrescribeItem(
            singlePatientData?.PatientID,
            modifiedData?.val
          );

          const userDecision = await new Promise((resolve) => {
            if (Object.keys(fouthData)?.length > 0) {
              setConfirmBoxvisible({
                show: true,
                lableMessage: <div>Do You Want To Prescribe Again ?</div>,
                alertMessage: (
                  <div>
                    This Service is Already Prescribed By{" "}
                    <span style={{ color: "blue", fontWeight: 700 }}>
                      {fouthData?.UserName}{" "}
                    </span>
                    Date on{" "}
                    <span style={{ color: "blue", fontWeight: 700 }}>
                      {fouthData?.EntryDate}
                    </span>
                  </div>
                ),
                chidren: (
                  <div>

                    <button
                      className="btn btn-sm btn-primary mx-1"
                      onClick={() => {

                        setConfirmBoxvisible({
                          show: false,
                          alertMessage: "",
                          lableMessage: "",
                          chidren: "",
                        });
                        resolve(true); // Prescribe Again
                      }}
                    >
                      Prescribe Again
                    </button>

                    {/* {testPaymentState?.type !== "4" && <button
                      className="btn btn-sm btn-primary mx-1"
                      onClick={() => {

                        setConfirmBoxvisible({
                          show: false,
                          alertMessage: "",
                          lableMessage: "",
                          chidren: "",
                        });
                        resolve(true); // Prescribe Again
                      }}
                    >
                      Prescribe Again
                    </button>} */}

                    <button
                      className="btn btn-sm btn-danger mx-1"
                      onClick={() => {
                        setConfirmBoxvisible({
                          show: false,
                          alertMessage: "",
                          lableMessage: "",
                          chidren: "",
                        });
                        resolve(false); // Cancel
                      }}
                    >
                      {t("Cancel")}
                    </button>
                  </div>
                ),
              });
            } else {
              resolve(true); // No need to confirm, proceed with prescribing
            }
          });

          if (Object.keys(fouthData).length === 0 || userDecision) {
            //orcondition confirmation modal
            // Fifth Api
            const fifthData = await handleGetDiscountWithCoPay(
              modifiedData?.val,
              payloadData?.panelID?.value,
              singlePatientData?.PatientTypeID,
              singlePatientData?.MemberShipCardNo
            );

   
            const sixthData = await handleGetBindLabInvestigationRate(
              String(payloadData?.panelID?.value),
              String(modifiedData?.val),
              String(modifiedData?.CategoryID),
              "",
              "",
              String(payloadData?.panelID?.panelCurrencyFactor)
            );
            modifiedData.discountPercentage = fifthData?.OPDPanelDiscAmount > 0 ? 0 : fifthData?.OPDPanelDiscPercent;

            modifiedData.IsPanelWiseDiscount =
              Number(fifthData?.OPDPanelDiscPercent) > 0 ? 1 : 0;
            modifiedData.coPaymentPercent = fifthData?.OPDCoPayPercent;

            modifiedData.IsPayable = String(fifthData?.IsPayble);

            modifiedData.salesID = "";

            modifiedData.IsDiscountEnable = true;

            modifiedData.Rate = sixthData?.Rate ?? 0;
            modifiedData.constantRate = modifiedData.Rate;
            modifiedData.ScheduleChargeID = sixthData?.ScheduleChargeID ?? 0;
            modifiedData.ID = sixthData?.ID ?? 0;
            modifiedData.ItemCode = sixthData?.ItemCode ?? "";
            modifiedData.ItemDisplayName = sixthData?.ItemDisplayName
              ? sixthData?.ItemDisplayName.trim() === ""
                ? modifiedData?.label
                : sixthData?.ItemDisplayName
              : modifiedData?.label;
            const discounAmountCalculation = Number(modifiedData.Rate) *
              Number(modifiedData?.defaultQty) < fifthData?.OPDPanelDiscAmount ? Number(modifiedData.Rate) *
            Number(modifiedData?.defaultQty) : fifthData?.OPDPanelDiscAmount;
            modifiedData.discountAmount = discounAmountCalculation > 0 ? discounAmountCalculation :
              Number(modifiedData.Rate) *
              Number(modifiedData?.defaultQty) *
              Number(modifiedData?.discountPercentage) *
              0.01;

            modifiedData.amount =
              Number(modifiedData?.Rate) * Number(modifiedData?.defaultQty) -
              modifiedData?.discountAmount;

            modifiedData.GSTAmount = Number(
              modifiedData.amount * modifiedData.GstPer * 0.01
            ).toFixed(ROUNDOFF_VALUE);

            modifiedData.coPaymentAmount = (
              modifiedData.amount *
              modifiedData?.coPaymentPercent *
              0.01
            ).toFixed(ROUNDOFF_VALUE);

            modifiedData.panelID = payloadData?.panelID?.value;

            modifiedData.grossAmount =
              Number(modifiedData?.Rate) * Number(modifiedData?.defaultQty);
              
            const initialAmount = payloadData?.panelID?.IsCash === 1 ? modifiedData?.amount : modifiedData?.coPaymentAmount;

            modifiedData.PayableAmount =
              initialAmount && initialAmount !== 0
                ? initialAmount
                : modifiedData?.IsPayable === "1"
                  ? modifiedData?.amount
                  : modifiedData?.coPaymentAmount;

            // modifiedData.PayableAmount =
            //   payloadData?.panelID?.IsCash === 1 ? modifiedData?.amount : modifiedData?.coPaymentAmount ||
            //     modifiedData?.IsPayable === "1" ? modifiedData?.amount : modifiedData?.coPaymentAmount
            // 
            // isRateZero =  Object.keys(sixthData).length > 0? true : false
            if (Object.keys(sixthData).length > 0 && sixthData?.Rate > 0) {
              isRateZero = false
            } else {
              isRateZero = true
            }

            return modifiedData;
          }
        }
      }
    }
  };

  const DoctorBindDefaultChecker = (tnxtypeID, DoctorID, type_ID) => {
    if (![5, 23].includes(Number(tnxtypeID))) {
      return Number(DoctorID);
    } else {
      if (Number(tnxtypeID) === 5) {
        setPayloadData({
          ...payloadData,
          ["DoctorID"]: Number(type_ID),
          referDoctorID: handlereferDocotorIDByReferalType(
            payloadData?.referalTypeID?.value,
            Number(type_ID),
            payloadData?.referDoctorID
          ),
        });
      }
      return "";
    }
  };

  // console.log(payloadData);

  const testAddingObject = async (
    value,
    isUrgent,
    presribedID,
    defaultQty,
    isCpoeOrOnline,
    appointmentID
  ) => {
    const AppointTypeDropDown = filterByTypes(
      dropDownState?.RoleWiseOPDServiceBookingControlData,
      [6],
      ["TypeID"],
      "TextField",
      "ValueField",
      "IsDefault"
    );

    const checker = testAddingTableState.some(
      (row) => row?.val === value?.item_ID
    );
    // 
    // const opdChecker = testAddingTableState.some((row) => {

    //   return (Number(row?.DoctorID) === Number(value?.DoctorID)) &&
    //   (Number(row?.CategoryID) === Number(value?.categoryid));
    // });

    // if (opdChecker) {
    //   notify("A patient can have only one consultation with the same doctor under the same bill.", "error");
    //   return;
    // }
    // 
    if (checker) {
      notify("Test Allready Exist!", "error");
      return;
    }

    // ;
    const modifiedData = {
      label: value?.autoCompleteItemName,
      val: value?.item_ID,
      isadvance: value?.isadvance,
      IsOutSource: value?.isOutSource,
      ItemCode: value?.itemCode,
      Type_ID: value?.type_ID,
      LabType: value?.labType,
      TnxTypeID: value?.tnxtype,
      SubCategoryID: value?.subCategoryID,
      sampleType: value?.sample,
      TypeName: value?.typeName,
      rateEditAble: value?.rateEditable,
      isMobileBooking: 0,
      CategoryID: value?.categoryid,
      SubCategory: value?.SubCategory,
      isSlotWiseToken: value?.isSlotWisetoken,
      appointmentID: appointmentID,
      GstType: value?.gstType,
      IgstPercent: value?.iGSTPercent,
      CgstPercent: value?.cGSTPercent,
      SgstPercent: value?.sGSTPercent,
      GstPer: Number(value?.gstPer).toFixed(ROUNDOFF_VALUE),
      isUrgent: isUrgent,
      presribedID: presribedID,
      defaultQty: defaultQty,
      isCpoeOrOnline: isCpoeOrOnline,
      AppointedType: AppointTypeDropDown,
      AppointedDate: moment().format("YYYY-MM-DD"),
      DoctorID: DoctorBindDefaultChecker(
        value?.tnxtype,
        payloadData?.DoctorID,
        value?.type_ID
      ),
      typeOfApp: ReactSelectisDefaultValue(AppointTypeDropDown, "extraColomn")
        ?.value,
      type: value?.type, // This is for to check cunsultaion 
      IsByPassDoctorSlot: value?.IsByPassDoctorSlot
    };

    const apiCallData = await handleApiCallforTestAdding(modifiedData);

    return apiCallData;
  };

  const setTestAddingTableAfterPanelChange = async () => {
    try {
      const test = [];
      for (const data of testAddingTableState) {
        const apiCallData = await handleApiCallforTestAdding(data);
        test.push(apiCallData);
      }

      handlePaymentGateWay(
        calculateBillAmount(
          test,
          BindResource?.isReceipt,
          singlePatientData?.OPDAdvanceAmount,
          false,
          1,
          0.0,
          payloadData?.panelID?.value === 1 ? 1 : 0,
          0
        )
      );
      if (isRateZero && BindResource?.IsShowItemWithoutRate == "0" && testPaymentState?.category !== "1") {
        notify("Selected Item Does not have Rate", "warn")
        return
      }
      else {
        setTestAddingTable(test);

      }
      // setTestAddingTable(test);
      // console.log("All investigations validated successfully.");
    } catch (error) {
      console.error("Error validating investigation:", error);
    }
  };

  useEffect(() => {
    if (payloadData?.panelID?.value && testAddingTableState.length > 0) {
      setTestAddingTableAfterPanelChange();
    }
  }, [payloadData?.panelID?.value]);

  const handleAddInvestigationSlot = (data) => {
    const AddRow = [data, ...testAddingTableState];
    handlePaymentGateWay(
      calculateBillAmount(
        AddRow,
        BindResource?.isReceipt,
        singlePatientData?.OPDAdvanceAmount,
        false,
        0,
        0.0,
        payloadData?.panelID?.value === 1 ? 1 : 0,
        0
      )
    );
    if (isRateZero && BindResource?.IsShowItemWithoutRate == "0" && testPaymentState?.category !== "1") {
      notify("Selected Item Does not have Rate", "warn")
      return
    }
    else {
      setTestAddingTable(AddRow);

    }
    // setTestAddingTable(AddRow);

    setModalHandlerState({
      header: null,
      show: false,
      size: null,
      component: null,
      footer: null,
    });
  };

  const validateInvestigation = async (
    e,
    isUrgent,
    presribedID,
    defaultQty,
    isCpoeOrOnline,
    appointmentID
  ) => {
    if (!payloadData?.DoctorID) {
      notify("Please Select Doctor First", "error");
      return 0
    }

    setValue("");
    let data = {}
    if ((String(e?.value?.NewItemID) === String(BindResource?.RegistrationItemID)) && testAddingTableState?.length > 0) {
      const datattt = testAddingTableState.map((item) => ({
        ...item,
        DoctorID: payloadData?.DoctorID
      }))
      setTestAddingTable(datattt)
      return 0
    } else {

      data = await testAddingObject(
        e?.value ? e?.value : e,
        isUrgent,
        presribedID,
        defaultQty,
        isCpoeOrOnline,
        appointmentID
      );
    }


    // 
    // if(BindResource?.IsShowItemWithoutRate=="0" && (sixthData?.Rate ==0 || !sixthData)){
    //   // alert("mmskmkm")

    //   return
    // }

    if (data?.CategoryID === "7" && data?.isMobileBooking === 0) {
      handleInvestigationSlot(data);
    } else if (data?.TnxTypeID === "5") {
      // 
      handleDoctorSlotTime(data);
    } else {
      const AddRow = data ? [data, ...testAddingTableState] : [...testAddingTableState];
      // handlePaymentGateWay(
      //   calculateBillAmount(
      //     AddRow,
      //     BindResource?.isReceipt,
      //     singlePatientData?.OPDAdvanceAmount,
      //     false,
      //     0,
      //     0.0,
      //     payloadData?.panelID?.value === 1 ? 1 : 0,
      //     0
      //   )
      // );
      // 
      if (isRateZero && BindResource?.IsShowItemWithoutRate === "0" && testPaymentState?.category !== "1") {
        notify("Selected Item Does not have Rate", "warn")
        return
      }
      else {
        setTestAddingTable(AddRow);
        handlePaymentGateWay(
          calculateBillAmount(
            AddRow,
            BindResource?.isReceipt,
            singlePatientData?.OPDAdvanceAmount,
            false,
            0,
            0.0,
            payloadData?.panelID?.value === 1 ? 1 : 0,
            0
          )
        );

      }
    }
  };

  const handleCategoryFilter = useCallback(
    (id) => {
      const handleConfigId = (id) => {
        switch (id) {
          case 2:
            return { value: ["25"], label: ["ConfigID"] };
          case 3:
            return { value: [["6", "20"]], label: ["ConfigID"] };
          case 4:
            return { value: ["5"], label: ["ConfigID"] };
          case 9:
            return { value: ["3", "3"], label: ["ConfigID", "CategoryID"] };
          case 10:
            return { value: ["3", "7"], label: ["ConfigID", "CategoryID"] };
          case 11:
            return { value: ["23"], label: ["ConfigID"] };
          case 12:
            return { value: ["7"], label: ["ConfigID"] };
          case 10000:
            return { value: ["-1"], label: ["ConfigID"] };
          case 100:
            const { ConfigID } =
              dropDownState?.RoleWiseOPDServiceBookingControlData?.find(
                (ele) => ele?.TypeID === 1
              );

            const { filterConfigID } = handleMakeStringToArray({
              value: ConfigID,
              returnName: "filterConfigID",
            });

            return {
              value: [filterConfigID],
              label: ["ConfigID"],
            };
          default:
            return { value: [], label: [] };
        }
      };

      const { value, label } = handleConfigId(id);

      return filterByTypes(
        dropDownState?.RoleWiseOPDServiceBookingControlData,
        [3, ...value],
        ["TypeID", ...label],
        "TextField",
        "ValueField"
      );
    },
    [testPaymentState?.type]
  );

  const handleTypeFilter = useMemo(() => {
    if (dropDownState?.RoleWiseOPDServiceBookingControlData.length > 0) {
      const data = filterByType(
        dropDownState?.RoleWiseOPDServiceBookingControlData,
        2,
        "TypeID",
        "TextField",
        "ValueField"
      );

      setTestPaymentState({
        ...testPaymentState,
        type: data[0]?.value,
      });

      return data;
    }
  }, [dropDownState?.RoleWiseOPDServiceBookingControlData]);

  useEffect(() => {
    if (Object.keys(singlePatientData)?.length > 0) ref?.current?.focus();
  }, [singlePatientData]);



  const handleconsulationBooking = async (subcategoryID, doctorID) => {
    if (testPaymentState?.subCategory !== "0" && testPaymentState?.subCategory !== null) {


      const item = await handleGetLoadOPD_All_ItemsLabAutoComplete({
        searchType: testPaymentState?.searchType,
        prefix: "",
        type: testPaymentState?.type,
        categoryID: testPaymentState?.category,
        subCategoryID: subcategoryID ? subcategoryID : testPaymentState?.subCategory,
        itemID: "",
        "doctorID": payloadData?.DoctorID,
        PanelID: payloadData?.panelID?.PanelID,
      });

      if (item?.length > 0) {
        const arg = { ...item[0], type: testPaymentState?.type ? testPaymentState?.type : doctorID ? "4" : "", DoctorID: payloadData?.DoctorID }
        // 
        await validateInvestigation(arg, 0, 0, 1, 0, 0)
      }
      return;
    }
  }

  useEffect(() => {

    console.log("testPaymentState", testPaymentState)
    if (testPaymentState?.type === "4" && testPaymentState?.category === "1" && testPaymentState?.subCategory !== "0" && testPaymentState?.subCategory !== null) {
      const isDuplicate = testAddingTableState.some(
        item => item?.CategoryID == testPaymentState?.category && item?.Type_ID == payloadData?.DoctorID
      );

      if (isDuplicate) {
        notify("A patient can have only one consultation with the same doctor under the same bill.", "warn");
        return;
      } else {

        checkPatientFollowup()
      }


    }

  }, [testPaymentState?.subCategory, payloadData?.panelID]);

  const OPDDoctorConsulatin = async () => {
    // 
    // 
    // const categoryOneItems = testAddingTableState.filter(item => item.CategoryID === 1);
    // if(categoryOneItems){
    //   alert("categoryOneItems",categoryOneItems)
    //   return
    // }
    // console.log(categoryOneItems);
    // 

    if (testPaymentState?.type === "4" && testPaymentState?.category === "1") {
      // 
      // handleconsulationBooking()
      try {
        const response = await OPDDoctorConsulationData(payloadData?.DoctorID)
        if (response?.success) {
          const subcategoryID = response?.data[0]?.subcategoryID
          checkPatientFollowup(subcategoryID)
        }
      } catch (error) {
        console.log("error", error)
      }

    }
  }
  const BindOPDDoctorConsulatin = async (doctorID) => { // Doctor ID is to handle culsultation functionality
    try {

      const response = await OPDDoctorConsulationData(payloadData?.DoctorID)
      if (response?.success) {
        const subcategoryID = response?.data[0]?.subcategoryID
        checkPatientFollowup(subcategoryID, doctorID)
      }
    } catch (error) {
      console.log("error", error)
    }


  }

  useEffect(() => {
    OPDDoctorConsulatin()
  }, [testPaymentState?.category, payloadData?.panelID, payloadData?.DoctorID]);

  useEffect(() => {
    if (payloadData?.SelectDoctor && testAddingTableState?.find((item) => item?.type === "4")?.ID) {
      BindOPDDoctorConsulatin(payloadData?.SelectDoctor) // this is for bind new doctor consulation and remove old doctor consulation
    }
  }, [payloadData?.SelectDoctor])



  useEffect(() => {
    if (testPaymentState?.type === "4") {
      setTestPaymentState({
        ...testPaymentState,
        category: "1",
      });
    } else {
      return;
    }
  }, [testPaymentState?.type])

  console.log("testPaymentState?.category", testPaymentState)

  return (
    <div className="card  patient_registration_card ">
      {!UHID && Object.keys(singlePatientData)?.length > 0 && (
        <div className="row  pt-2 pl-2 pr-2">
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div className="form-group">
              <ReactSelect
                placeholderName={i18n.t(
                  "Type"
                )}
                id="Type"
                searchable={true}
                name="type"
                dynamicOptions={handleTypeFilter}
                value={testPaymentState?.type}
                handleChange={handleReactSelect}
              />
            </div>
          </div>

          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div className="form-group">
              <ReactSelect
                placeholderName={i18n.t(
                  "Category"
                )}
                id="Category"
                searchable={true}
                name="category"
                handleChange={handleReactSelect}
                value={testPaymentState?.category}
                dynamicOptions={handleCategoryFilter(
                  Number(testPaymentState?.type)
                )}
              />
            </div>
          </div>

          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div className="form-group">
              {console.log("ASdasdasdasdasdsadasdasd", testPaymentState?.subCategory)}
              <ReactSelect
                placeholderName={i18n.t(
                  "SubCategory"
                )}
                id="SubCategory"
                searchable={true}
                name={"subCategory"}
                handleChange={handleReactSelect}
                value={testPaymentState?.subCategory}
                dynamicOptions={filterByTypes(
                  dropDownState?.RoleWiseOPDServiceBookingControlData,
                  [4, testPaymentState?.category],
                  ["TypeID", "CategoryID"],
                  "TextField",
                  "ValueField"
                )}
              />
            </div>
          </div>

          <div className="col-xl-5 col-md-9 col-sm-4 col-12">
            <div className="d-flex">
              <div className="form-group w-25 mr-1">
                <ReactSelect
                  placeholderName={i18n.t(
                    "Search"
                  )}
                  id="Search"
                  searchable={true}
                  dynamicOptions={SEARCH_BY_TEST}
                  value={testPaymentState?.searchType}
                  name={"searchType"}
                  handleChange={handleReactSelect}
                  removeIsClearable={true}
                />
              </div>
              <div
                className="form-group w-100"
                style={{ position: "relative" }}
              >
                <AutoComplete
                  value={value}
                  suggestions={items}
                  completeMethod={search}
                  ref={ref}
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
          </div>
          <div className="col-xl-1 col-md-3 col-sm-4 col-12">
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <Button
                    name={t("CPOE")}
                    className={"btn btn-sm w-100 btn-primary"}
                    handleClick={() => handleModalState()}
                  />
                </div>
              </div>
              {/* <div className="col-sm-6">
              <div className="form-group">
                <Button
                  name={i18n.t(
                    "OnlineBooking"
                  )}
                  className={"btn btn-sm w-100 btn-primary"}
                />
              </div>
            </div> */}
            </div>
          </div>
        </div>
      )}

      {confirmBoxvisible?.show && (
        <Confirm
          alertMessage={confirmBoxvisible?.alertMessage}
          lableMessage={confirmBoxvisible?.lableMessage}
          confirmBoxvisible={confirmBoxvisible}
        >
          {confirmBoxvisible?.chidren}
        </Confirm>
      )}

      {modalHandlerState?.show && (
        <Modal
          visible={modalHandlerState?.show}
          setVisible={() =>
            setModalHandlerState({
              show: false,
              component: null,
              size: null,
            })
          }
          modalWidth={modalHandlerState?.size}
          Header={modalHandlerState?.header}
          footer={modalHandlerState?.footer}
        >
          {modalHandlerState?.component}
        </Modal>
      )}
    </div>
  );
}

export default TestPayment;
