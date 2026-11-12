import React, { useState } from 'react'
import Heading from '../../../../components/UI/Heading'
import { t } from 'i18next'
import DatePicker from '../../../../components/formComponent/DatePicker'
import moment from 'moment'
import { LoadCentreChartOfAccountAPI } from '../../../../networkServices/finance'
import { useLocalStorage } from '../../../../utils/hooks/useLocalStorage'
import { AutoComplete } from 'primereact/autocomplete'

const UploadBalanceInvoice = () => {
    const VITE_DATE_FORMAT = import.meta.env.VITE_DATE_FORMAT
    const initialState = {
        VoucherDate: new Date(),
    }
    const [values , setValues] = useState({...initialState});
    const [items , setItems] = useState([]);
    const [bodyData , setBodyData] = useState([]);
    const userData = useLocalStorage("userData", "get");

    console.log("Values" , values)
    // const [values , setValues] = useState(...initialState);
    const handleChange = (e) => {
        const {name , value} = e.target;
        setValues((val) => ({ ...val, [name]: value }));
    }

    const validateInvestigation = async (e, name) => {
        const { value } = e;
        console.log("values from validate", value);
        value.branchCentre = { value: userData?.defaultCentre };
        value.balanceType = { value: value?.balanceType };
        setValues((val) => ({ ...val, [name]: "" }));
        setBodyData((val) => [...val, value]);
      };

      const search = async (event, name) => {
        setValues((val) => ({ ...val, [name]: event?.query }));
        if (event?.query?.length > 2) {
          const payload = {
            // groupCode: String(values?.ChartOfGroup?.value),
            accountTypeID: 0,
            // currencyCode: String(values?.Currency?.value),
            accountName: String(event?.query),
          };
          let results = await LoadCentreChartOfAccountAPI(payload);
          if (results?.success) {
            setValues((val) => ({ ...val, [name]: event?.query }));
            setItems(results?.data);
          } else {
            setItems([]);
            // notify(results?.message,"error")
          }
        } else {
          // setItems([])
        }
      };

      const itemTemplate = (item) => {
        return (
          <div className="p-clearfix">
            <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
              {item?.TextField}
            </div>
          </div>
        );
      };
    
    // const handleSelectDate = (e) => {
    //     const {name , value} = e.target;
    //     setValues((val) => ({ ...val, [name]: value }));
    // }
  return (
    <div className='mt-2 card border'>
        <Heading title={t("Upload Opening Balance Invoice")} isBreadcrumb={true} />
        <div className='row p-2'>
        <DatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="VoucherDate"
          name="VoucherDate"
          value={
            values?.VoucherDate
              ? moment(values?.VoucherDate).toDate()
              : new Date()
          }
          maxDate={new Date()}
          handleChange={handleChange}
        //   handleSelectDate={handleSelectDate}
          lable={t("Voucher Date")}
          placeholder={VITE_DATE_FORMAT}
        />
        <div className="col-xl-4 col-md-6 col-sm-6 col-12">
          <AutoComplete
            value={
              values?.AccountName?.TextField
                ? values?.AccountName?.TextField
                : values?.AccountName
            }
            suggestions={items}
            completeMethod={(e) => {
              search(e, "AccountName", 5);
            }}
            className="w-100"
            onSelect={(e) => validateInvestigation(e, "AccountName")}
            id="AccountName"
            itemTemplate={itemTemplate}
          />
          <label
            className="label lable truncate ml-3 p-1"
            style={{ fontSize: "5px !important" }}
          >
            {t("Account Name")}
          </label>
        </div>
        </div>
    </div>
  )
}

export default UploadBalanceInvoice