
import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { filterByTypes, handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {PurchaGetBindAllCenter,

} from "../../../../networkServices/Purchase";

import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import Heading from "../../../../components/UI/Heading";
import Tables from "../../../../components/UI/customTable";
import Input from "../../../../components/formComponent/Input";
import { BindVoucherBillingScreenControls } from "../../../../networkServices/finance";
import DatePicker from "../../../../components/formComponent/DatePicker";
const FinancialYearBook = () => {
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();

  const localData = useLocalStorage("userData", "get")
  const [tbodyData, setTbodyData] = useState([{
    sn: "1"
  }]);

  const [values, setValues] = useState({
   
    allCenter: {
      CentreID: 1,
      CentreName: "MOHANDAI OSWAL HOSPITAL",
      IsDefault: 0,
      label: "MOHANDAI OSWAL HOSPITAL", value: 1
    },
    openclose:""
   


  });

  const [dropDownState, setDropDownState] = useState({
    GetBindAllCenter: [],
    Currency:[]
  });
  const getPurchaGetBindAllCenterAPI = async () => {
    try {
      const GetBindAllCenter = await PurchaGetBindAllCenter();
      setDropDownState((val) => ({
        ...val,
        GetBindAllCenter: handleReactSelectDropDownOptions(
          GetBindAllCenter?.data,
          "CentreName",
          "CentreID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const bindListData = async () => {
    let apiResp = await BindVoucherBillingScreenControls(1)
    if (apiResp?.success) {
      const BindEmplyee = filterByTypes(apiResp?.data, [11], ["TypeID"], "TextField", "ValueField")
      const currencyDetails = filterByTypes(apiResp?.data, [4], ["TypeID"], "TextField", "ValueField")
      setDropDownState((val) => ({
        ...val,
        // BindEmplyee: BindEmplyee,
        Currency:currencyDetails
      }));
    } else {
      // setList([])
    }
  }

  useEffect(() => {
    bindListData()
  }, [])

  useEffect(() => {
    getPurchaGetBindAllCenterAPI();
  
    // getItemsBySubCategory(values?.category?.value);
  }, []);


  const handleReactChange = (name, e, key) => {
   
    setValues((val) => ({ ...val, [name]: e }));
   

  };
  const THEAD = [

  
    { width: "1%", name: t("SNo") },
    { width: "5%", name: t("Transaction Type") },
    { width: "5%", name: t("Centre Name") },
    { width: "5%", name: t("HIS Department") },
    { width: "5%", name: t("Finance Department") },
    { width: "5%", name: t("Account Name") },
    { width: "5%", name: t("Store Type") },
    { width: "5%", name: t("Delete") },


  ];

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Book Closing")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Center")}
            // requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"allCenter"}
            name={"allCenter"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.GetBindAllCenter}
            value={values?.allCenter?.value}
          />
          
         
<ReactSelect
            // requiredClassName={"required-fields"}


            placeholderName={t("Financial Year")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"userType"}
            name={"userType"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "01-Apr-2024 To 31-Mar-2025", value: "1" },
             
            ]}
            value={values?.userType?.value}

          />
         
<ReactSelect
            // requiredClassName={"required-fields"}


            placeholderName={t("Open/Close")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"openclose"}
            name={"openclose"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "Open", value: "o" },
              { label: "Close", value: "c" },
             
            ]}
            value={values?.openclose?.value}

          />

{/* 
<DatePicker
          className="custom-calendar"
          placeholder=""
          lable={t("FromDate")}
          respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
          name="fromDate"
          id="fromDate"
          value={values?.fromDate}
          showTime
          hourFormat="12"
          handleChange={(date) => handleChange(date, "fromDate")}
        />
         */}
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <button
              className="btn btn-sm btn-primary mr-1"
            // onClick={() => setIsFalse(!isFalse)}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        <div className=" mt-2 spatient_registration_card">
          <Heading title={t("Voucher Mapping")} isBreadcrumb={false} />
          <Tables

            thead={THEAD}
            tbody={tbodyData?.map((val, index) => ({
             
              sno: index + 1,
              VoucherCode: "BP-000001",
              VoucherList: "BP-Bank Payment",
              AmountLimit: <Input
                className="table-input"
                name="Remarks"
                removeFormGroupClass={true}
                type="text"
              // onChange={(e) =>
              //   handleIndexChange(index, "Remarks", e.target.value, item)
              // }
              // value={item?.Remarks ? item?.Remarks : ""}
              />,
              EntryDate: "24-Jan-2025 02:39 PM",
              EntryBy: "Mr. Administrator",


            }))}

            style={{ maxHeight: "23vh" }}
          />
        </div>
      </div>
    </div>
  )
}

export default FinancialYearBook