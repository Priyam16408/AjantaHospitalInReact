import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Input from '../../../../components/formComponent/Input';
import ReactSelect from '../../../../components/formComponent/ReactSelect';
import DatePicker from '../../../../components/formComponent/DatePicker';
import ColorCodingSearch from '../../../../components/commonComponents/ColorCodingSearch';
import { useDispatch } from 'react-redux';
import { GetBindAllDoctorConfirmation, GetBindDepartment, getBindPanelList } from '../../../../store/reducers/common/CommonExportFunction';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Heading from '../../../../components/UI/Heading';
import { handleReactSelectDropDownOptions } from '../../../../utils/utils';
import { PurchaseBindGetItems } from '../../../../networkServices/Purchase';
export default function RequestAnalysis() {
    const {GetEmployeeWiseCenter} = useSelector((state) => state.CommonSlice);
    let [t] = useTranslation()
    const { VITE_DATE_FORMAT } = import.meta.env;
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

    const getItemApi = async () => {
        try {
          const BindItems = await PurchaseBindGetItems();
          if (BindItems?.success) {
            setDropDownState((val) => ({
              ...val,
              BindItems: handleReactSelectDropDownOptions(
                BindItems?.data,
                "ItemName",
                "ItemID"
              ),
            }));
    
          }
        } catch (error) {
          console.log(error, "SomeThing Went Wrong");
        }
      };
useEffect(()=>{
    getItemApi()
},[])
    const dispatch = useDispatch()
    const handleSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    useEffect(() => {
        dispatch(GetBindAllDoctorConfirmation({ Department: "All" }));
        dispatch(GetBindDepartment());
        dispatch(getBindPanelList());
    }, [dispatch]);

    const handleSearch = async () => {
        console.log("handleSearch clicked")
    }

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
                        respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="toDate"
                        name="toDate"
                        value={values?.toDate ? values?.toDate : new Date()}
                        handleChange={handleChange}
                        lable={t("sampleCollectionManagement.sampleCollection.ToDate")}
                        placeholder={VITE_DATE_FORMAT}
                        respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
                    />
                    <div className=" col-sm-2 col-xl-2">
                        <button className="btn btn-sm btn-success" type="button" onClick={handleSearch}>
                            {t("sampleCollectionManagement.sampleCollection.Search")}
                        </button>
                    </div>
                </div>

                <Heading
                    title={t("Search Result")}
                    isBreadcrumb={false}
                    secondTitle={<>
                        <ColorCodingSearch label={t("Pending")} color="#add8e6" />
                        <ColorCodingSearch label={t("Close")} color="#9acd32" />
                        <ColorCodingSearch label={t("Reject")} color="#ffb6c1" />
                        <ColorCodingSearch label={t("Open")} color="#ffff00" />
                        </>}
                />
            </div>
        </>
    )
}
