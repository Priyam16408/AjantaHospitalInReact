import React, { useEffect, useState } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import {
  BindBloodGroup,
  BindCategory,
  BindRequestDetails,
  SaveBloodBank,
  UpdateBloodgroup,
} from "../../networkServices/BillingsApi";
import { useTranslation } from "react-i18next";
import Heading from "../UI/Heading";
import { useSelector } from "react-redux";
import { GetBindAllDoctorConfirmation } from "../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import DatePicker from "../formComponent/DatePicker";
import TimePicker from "../formComponent/TimePicker";
import Input from "../formComponent/Input";
import ServiceBloodBankItemsTable from "../UI/customTable/billings/ServiceBloodBankItemsTable";
import ServiceDetailsTable from "../UI/customTable/billings/ServiceDetailsTable";
import {
  handleReactSelectDropDownOptions,
  handleSaveBloodBankPayload,
  notify,
} from "../../utils/utils";
import SearchBloodBank from "../commonComponents/SearchBloodBank";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

const BloodBank = ({ data }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const ip = useLocalStorage("ip", "get");
  const localdata = useLocalStorage("userData", "get");
  const { VITE_DATE_FORMAT } = import.meta.env;
  const dispatch = useDispatch();
  const [ItemIndexValue, setItemIndexValue] = useState({});
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [updateBloodgroup, setUpdateBloodGroup] = useState([]);
  const [savedItem, setSavedItem] = useState([]);
  const [payload, setPayload] = useState({
    Category: "",
    Doctor: "",
    Blood: "",
    itemName: "",
    ReserveDate: new Date(),
    Time: new Date(),
  });
  const { GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );
  const [DropDownState, setDropDownState] = useState({
    category: [],
    bloodGroup: [],
  });
  const getBindRequestDetails = async () => {
    const TransactionID = data?.transactionID;
    try {
      const response = await BindRequestDetails(TransactionID);
      setSavedItem(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log("data", data);
  console.log("savedItem", savedItem);
  const getBindCategory = async () => {
    try {
      const data = await BindCategory(12);
      return data?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getBindBloodGroup = async () => {
    try {
      const data = await BindBloodGroup();
      return data?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (!payload?.Blood) {
      errors.Blood = "Blood Group is Required";
      errors.id[errors.id?.length] = "BloodFocus";
    }

    return errors;
  };
  const handleBloodGroupUpdate = async () => {
    const customerrors = ErrorHandling();
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
        setErrors(customerrors);
      }
      return;
    }
    try {
      const BloodGroup = payload?.Blood?.BloodGroup;
      const PatientID = data?.patientID;
      const response = await UpdateBloodgroup(BloodGroup, PatientID);
      setUpdateBloodGroup(response?.data);
      if (response?.success) {
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const [categoryData, bloodGroupData] = await Promise.all([
        getBindCategory(),
        getBindBloodGroup(),
      ]);

      const dropDownData = {
        category: [
          { label: "All", value: "0" },
          ...handleReactSelectDropDownOptions(
            categoryData,
            "name",
            "categoryID"
          ),
        ],
        bloodGroup: handleReactSelectDropDownOptions(
          bloodGroupData,
          // "BloodGroup",
          "bloodgroup",
          "id"
        ),
      };

      setDropDownState(dropDownData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    FetchAllDropDown();
  }, []);

  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
      })
    );
  }, [dispatch]);
  const handleReactSelectItem = (name, value) => {
    console.log(value);
    setPayload((val) => ({ ...val, [name]: value }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const thead = [
    t("S.No."),
    t("Sub Category"),
    t("Item Name"),
    t("Blood Group"),
    t("Quantity"),
    t("Reserve Date"),
    t("Reserve Time"),
    t("Doctor"),
    t("Remove"),
  ];
  const ServiceThead = [
    t("S.No."),
    t("Doctor"),
    t("Blood Group"),
    t("Component"),
    t("Req.Qty"),
    t("Issue Qty"),
    t("Reject Qty"),
    t("Pen.Qty"),
    t("Cross Matched Qty"),
    t("Reserve Date"),
    t("View"),
  ];
  console.log(DropDownState);
  const handleItemSelect = (label, value, val) => {
    setItemIndexValue(val);
    setPayload({
      ...payload,
      itemName: {
        label: label,
        value: value,
      },
    });
  };
  const AddErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (!payload?.itemName) {
      errors.itemName = "Item Name Is Required";
    }

    return errors;
  };
  const AddRowData = () => {
    const customerrors = AddErrorHandling();
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
        setErrors(customerrors);
      }
      return;
    }
    const newRow = {
      Category: payload?.Category?.label,
      Blood: payload?.Blood?.label,
      itemName: payload?.itemName?.label,
      Quantity: payload?.Quantity ? payload?.Quantity : 1,
      ReserveDate: moment(payload?.ReserveDate).format("DD-MMM-YYYY"),
      Time: moment(payload?.Time).format("hh:mm A"),
      DoctorID: payload?.Doctor?.label,
    };
    setTableData((prevState) => [...prevState, newRow]);
    setPayload({
      Category: "",
      Doctor: "",
      Blood: "",
      itemName: "",
      ReserveDate: new Date(),
      Time: new Date(),
    });
  };

  const onDelete = (item, index) => {
    const updatedItems = tableData.filter((_, i) => i !== index);
    setTableData(updatedItems);
  };

  console.log("ItemIndexValue", ItemIndexValue);
  const handleBloodGroupSave = async () => {
    try {
      const requestBody = handleSaveBloodBankPayload(
        tableData,
        data,
        payload,
        location,
        ip,
        ItemIndexValue,
        localdata
      );

      const response = await SaveBloodBank(requestBody);

      if (response?.success) {
        notify(response?.message, "success");
        getBindRequestDetails();
        // setTableData([]);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };
  console.log(data);
  console.log(location);
  return (
    <>
      <div className="card">
        <Heading title={t("Blood Bank")} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Category")}
            id={"Category"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"Category"}
            dynamicOptions={DropDownState?.category}
            value={payload?.Category}
            handleChange={handleReactSelectItem}
          />

          <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
            <div className="d-flex align-items-center">
              <div className="w-100">
                <ReactSelect
                  placeholderName={t("Blood Group")}
                  id={"Blood"}
                  searchable={true}
                  // respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                  name={"Blood"}
                  dynamicOptions={DropDownState?.bloodGroup}
                  value={payload?.Blood}
                  handleChange={handleReactSelectItem}
                />
              </div>
              <button
                className="btn btn-sm btn-success borderS"
                onClick={handleBloodGroupUpdate}
              >
                {t("Update")}
                {/* <i className="fa fa-search " aria-hidden="true"></i> */}
              </button>
            </div>
          </div>

          <div className="col-xl-8 col-md-4 col-sm-6  col-12">
            <SearchBloodBank
              data={data}
              handleItemSelect={handleItemSelect}
              itemName={payload?.itemName}
              payload={payload}
              AddRowData={AddRowData}
            />
          </div>
          <ReactSelect
            placeholderName={t("Select Doctor")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6  col-12"
            id={"Doctor"}
            name={"Doctor"}
            value={payload?.Doctor}
            removeIsClearable={true}
            handleChange={handleReactSelectItem}
            dynamicOptions={GetBindAllDoctorConfirmationData.map((item) => ({
              label: item?.Name,
              value: item?.DoctorID,
            }))}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="ReserveDate"
            name="ReserveDate"
            value={payload?.ReserveDate ? payload?.ReserveDate : new Date()}
            handleChange={handleChange}
            label={t("Reserve Date")}
            placeholder={VITE_DATE_FORMAT}
          />
          <TimePicker
            placeholderName={t("Time")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="Time"
            name="Time"
            value={payload?.Time}
            handleChange={handleChange}
          />
          <Input
            type="number"
            // className="form-control"
            id="Quantity"
            name="Quantity"
            value={payload?.Quantity ? payload?.Quantity : 1}
            onChange={handleChange}
            lable={t("Quantity")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            className={`form-control`}
          />
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success" onClick={AddRowData}>
              {t("Select")}
            </button>
          </div>
        </div>
        {tableData?.length > 0 && (
          <>
            <div className="row p-2">
              <div className="col-sm-12">
                <ServiceBloodBankItemsTable
                  THEAD={thead}
                  tbody={tableData}
                  handleDelete={onDelete}
                />
              </div>
            </div>
            <div className="row p-2">
              <div className="col-sm-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={handleBloodGroupSave}
                >
                 { t("Save")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {savedItem?.length > 0 && (
        <div className="card">
          <div className="row">
            <div className="col-sm-12">
              <ServiceDetailsTable THEAD={ServiceThead} tbody={savedItem} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BloodBank;