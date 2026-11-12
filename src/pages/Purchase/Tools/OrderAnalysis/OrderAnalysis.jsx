import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Input from '../../../../components/formComponent/Input';
import ReactSelect from '../../../../components/formComponent/ReactSelect';
import { useSelector } from 'react-redux';
import Heading from '../../../../components/UI/Heading';
import { handleReactSelectDropDownOptions, notify } from '../../../../utils/utils';
import { POApprovalMasterBindEmployee, POApprovalMasterSave, POBindCategoryApprovalMaster, PODeleteApprovalMaster, PoMasterBindApprovalMaster, PurchaseBindGetItems } from '../../../../networkServices/Purchase';
import Tables from '../../../../components/UI/customTable';
import DatePicker from '../../../../components/formComponent/DatePicker';
import moment from 'moment';
export default function OrderAnalysis() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [poMasterData, setPoMasterData] = useState([
    {
      store: "Medical Store",
      prNo: "MPR/24-25/000176",
      prDate: "01-Oct-24",
      raisedBy: "Lukwago Derrick",
      poNumber: "PO/24-25/001136",
      poDate: "03-Oct-24",
      supplier: "Wide Spectrum ENT U LTD",
      grnNumber: "MGR/24-25/00001143",
      grnDate: "06-Oct-24",
  },
    {
      store: "Medical Store",
      prNo: "MPR/24-25/000176",
      prDate: "01-Oct-24",
      raisedBy: "Lukwago Derrick",
      poNumber: "PO/24-25/001137",
      poDate: "07-Oct-24",
      supplier: "Wideww Spectrum ENT U LTD",
      grnNumber: "MGssxkR/24-25/00001143",
      grnDate: "09-Oct-24",
  },
])
  let [t] = useTranslation()
const [dropDownState, setDropDownState] = useState({
        BindItems: [],
    })
    const requestType = [
        { value: "0", label: "Normal" },
        { value: "1", label: "Urgent" },
        { value: "2", label: "Immediate" }
    ]
    const storeType = [
        { value: "0", label: "Medical Store" },
        { value: "1", label: "General" },
    ]
    const status = [
        { value: "0", label: "All" },
        { value: "1", label: "Pending" },
        { value: "2", label: "Reject" },
        { value: "3", label: "Open" },
        { value: "4", label: "Close" },
    ]


    const [values, setValues] = useState({
        BarcodeNo: "", PatientName: "", UHID: "",
        requestType: { value: "0", label: "Normal" },
        status: { value: "0", label: "All" },
        storeType: { value: "0", label: "Medical Store" },
        fromDate: moment(new Date()).toDate(),
        toDate: moment(new Date()).toDate(),
    });
  const getBindEmplyee = async () => {

    try {
      const BindEmplyee = await POApprovalMasterBindEmployee();
      if (BindEmplyee?.success) {
        setDropDownState((val) => ({
          ...val,
          BindEmplyee: handleReactSelectDropDownOptions(
            BindEmplyee?.data,
            "ItemName",
            "ItemID"
          ),
        }));

      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    getBindEmplyee()
  }, [])
  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }))
  }
  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
  }
  const handleSearch = async () => {
    if (!values?.FromAmount || !values?.ToAmount || !values?.Category?.CategoryID || !values?.centreId?.value) {
      notify("Please fill all required fields.", "error");
      return;
    }
    try {
      let payload =
      {
        "poApproval": [
          {
            "employeeId": "LSHHI198",
            "fromAmount": values?.FromAmount ? values?.FromAmount : 0,
            "toAmount": values?.ToAmount ? values?.ToAmount : 0,
            "categoryId": values?.Category?.CategoryID,
            "centreId": values?.centreId?.value,
            // "entryDate": "2024-12-10",
            // "entryBy": "komalsingh"
          },
        ]
      }
      const response = await POApprovalMasterSave(payload);
      if (response.success) {
        console.log(response.data)
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      notify(apiResp?.message, "error");
    }
  }

  const mergedData = poMasterData.reduce((acc, current) => {
    const existing = acc.find(
      (item) =>
        item.store === current.store &&
        item.prNo === current.prNo &&
        item.prDate === current.prDate
    );
  
    if (existing) {
      // Merge PO Numbers
      existing.poNumbers = existing.poNumbers || [existing.poNumber];
      if (!existing.poNumbers.includes(current.poNumber)) {
        existing.poNumbers.push(current.poNumber);
      }
  
      // Merge Suppliers
      existing.suppliers = existing.suppliers || [existing.supplier];
      if (!existing.suppliers.includes(current.supplier)) {
        existing.suppliers.push(current.supplier);
      }
  
      // Merge GRN Numbers
      existing.grnNumbers = existing.grnNumbers || [existing.grnNumber];
      if (!existing.grnNumbers.includes(current.grnNumber)) {
        existing.grnNumbers.push(current.grnNumber);
      }
    } else {
      // Add new row
      acc.push({ ...current, poNumbers: [current.poNumber], suppliers: [current.supplier], grnNumbers: [current.grnNumber] });
    }
  
    return acc;
  }, []);
  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("sampleCollectionManagement.sampleCollection.heading")}
          isBreadcrumb={true}
        />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
                    <Input
                        type="text"
                        className="form-control"
                        id="RequestNo"
                        name="RequestNo"
                        value={values?.RequestNo ? values?.RequestNo : ""}
                        onChange={handleChange}
                        lable={t("Request No.")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("Store Type")}
                        id={"storeType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={storeType}
                        handleChange={handleSelect}
                        value={`${values?.storeType?.value}`}
                        name={"storeType"}
                    />
                    <ReactSelect
                        placeholderName={t("Request Type")}
                        id={"requestType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={requestType}
                        handleChange={handleSelect}
                        value={`${values?.requestType?.value}`}
                        name={"requestType"}
                    />
                    {/* <ReactSelect
                        placeholderName="Raised User"
                        dynamicOptions={GetEmployeeWiseCenter?.map((ele) => {
                            return { label: ele.CentreName, value: ele.CentreID };
                        })}
                        searchable={true}
                        name="centreId"
                        value={values?.centreId}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        handleChange={handleSelect}
                        // handleChange={handleReactSelect}
                        // requiredClassName="required-fields"
                    /> */}
                    
                    <ReactSelect
                        placeholderName={t("Status")}
                        id={"status"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={status}
                        handleChange={handleSelect}
                        value={`${values?.status?.value}`}
                        name={"status"}
                    />
                    
                    {/* <ReactSelect
                        placeholderName={t("Item")}
                        id={"item"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        // dynamicOptions={SampleCollected}
                        dynamicOptions={dropDownState?.BindItems}
                        handleChange={handleSelect}
                        value={`${values?.item?.value}`}
                        name={"item"}
                    /> */}

                    <DatePicker
                        className="custom-calendar"
                        id="fromDate"
                        name="fromDate"
                        lable={t("sampleCollectionManagement.sampleCollection.FromDate")}
                        value={values?.fromDate ? values?.fromDate : new Date()}
                        handleChange={handleChange}
                        placeholder={VITE_DATE_FORMAT}
                        respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="toDate"
                        name="toDate"
                        value={values?.toDate ? values?.toDate : new Date()}
                        handleChange={handleChange}
                        lable={t("sampleCollectionManagement.sampleCollection.ToDate")}
                        placeholder={VITE_DATE_FORMAT}
                        respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                    />
                    <div className=" col-sm-2 col-xl-2">
                        <button className="btn btn-sm btn-success" type="button" onClick={handleSearch}>
                            {t("sampleCollectionManagement.sampleCollection.Search")}
                        </button>
                    </div>
                </div>
        {/* <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <Input
            type="number"
            className="form-control required-fields"
            id="OrderNo"
            name="OrderNo"
            value={values?.OrderNo ? values?.OrderNo : ""}
            onChange={handleChange}
            lable={t("Order No")}

            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Supplier Name")}
            id={"supplierName"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            // dynamicOptions={SampleCollected}
            dynamicOptions={dropDownState?.supplierName}
            handleChange={handleSelect}
            value={`${values?.supplierName?.value}`}
            name={"supplierName"}
            requiredClassName="required-fields"
          />

          <ReactSelect
            placeholderName={t("Order Type")}
            id={"OrderType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={
              [{ value: "1", label: "Normal" },
              { value: "2", label: "Urgent" },
              { value: "3", label: "Immediate" }]
            }
            handleChange={handleSelect}
            value={`${values?.OrderType?.value}`}
            name={"OrderType"}
          />
          <ReactSelect
            placeholderName={t("Status")}
            id={"Status"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={
              [{ value: "0", label: "Pending" },
              { value: "2", label: "Reject" },
              { value: "3", label: "Open" },
              { value: "4", label: "Close" },
              ]
            }
            handleChange={handleSelect}
            value={`${values?.Status?.value}`}
            name={"Status"}
          />
          <DatePicker
            className="custom-calendar"
            placeholder=""
            lable="From Date"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            name="FromDate"
            id="FromDate"
            value={values?.FromDate}
            showTime
            hourFormat="12"
            handleChange={handleChange}
          />
          <DatePicker
            className="custom-calendar"
            placeholder=""
            lable="To Date"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            name="ToDate"
            id="ToDate"
            value={values?.ToDate}
            showTime
            hourFormat="12"
            handleChange={handleChange}
          />
          <ReactSelect
            placeholderName={t("Category")}
            id={"category"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={dropDownState?.Category}
            handleChange={handleSelect}
            value={`${values?.category?.value}`}
            name={"category"}
          />
          <div className=" col-sm-2 col-xl-2">
            <button className="btn btn-sm btn-success" type="button" onClick={handleSearch}>
              {t("sampleCollectionManagement.sampleCollection.Search")}
            </button>
          </div>
        </div> */}

        <Heading
          title={t("Approval Master List")}
          isBreadcrumb={false}

        />
      </div>
      <div className="mt-2 spatient_registration_card">
        <Tables
          thead={
            [
              { width: "1%", name: t("SNo") },
              { name: t("Store") },
              { name: t("PR No.") },
              { name: t("View") },
              { name: t("PR Date") },
              { name: t("PR RaisedBy") },
              { name: t("PO Number") },
              { name: t("PO Date") },
              { width: "2%", name: t("Supplier") },
              { width: "2%", name: t("GRN Number") },
              { width: "2%", name: t("GRN Date") },
              // { width: "1%", name: t("Reject") },

            ]

          }
          // tbody={poMasterData?.map((val, index) => ({

          //   sno: index + 1,
          //   store: val.store,
          //   prNo: val.prNo || "",
            
          //   view: "View",
          //   prDate:val?.prDate,
          //   raisedBy: val.raisedBy || "",
          //   poNumber: val.poNumber || "",
          //   poDate: val.poDate || "",

          //   // reject: <i className="fa fa-trash text-danger" /> || "",
          //   supplier: val?.supplier || "",
            
          //   grnNumber: val?.grnNumber || "",
          //   grnDate: val?.grnDate || "",
            

          // }))}
          tbody={mergedData?.map((val, index) => ({
            sno: index + 1,
            store: val.store,
            prNo: val.prNo || "",
            view: "View",
            prDate: val?.prDate,
            raisedBy: val.raisedBy || "",
            poNumbers: val.poNumbers ? val.poNumbers.join(", ") : val.poNumber || "",
            poDate: val.poDate || "",
            suppliers: val.suppliers ? val.suppliers.join(", ") : val.supplier || "",
            grnNumbers: val.grnNumbers ? val.grnNumbers.join(", ") : val.grnNumber || "",
            grnDate: val.grnDate || "",
          }))}
        />
      </div>
    </>
  )
}

