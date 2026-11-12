import React, { useEffect, useState } from 'react'
import Heading from '../../components/UI/Heading'
import ReactSelect from '../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next'
import Input from '../../components/formComponent/Input'
import DatePicker from '../../components/formComponent/DatePicker'
import Modal from '../../components/modalComponent/Modal'
import { notify, reactSelectOptionList } from '../../utils/utils'
import { BindCentreList, SampleDispatchSearch, SampleTransferSearchInvestigation, SaveSampleTransferAPI } from '../../networkServices/SampleCollectionAPI'
import SearchOptionTable from "../../components/UI/customTable/SampleCollection/SearchOptionTable"
import DispatchSamplesTable from "../../components/UI/customTable/SampleCollection/DispatchSamplesTable"

export default function SampleTransfer() {
  const { VITE_DATE_FORMAT } = import.meta.env;

  let [t] = useTranslation()
  const [values, setValues] = useState({
    TransferredTo: { label: "", value: 4 },
    BarcodeNo: "AM050062",
    DispatchCenterTo: { label: "", value: "" },
    fromDate: new Date(),
    toDate: new Date(),

  })
  const [handleModelData, setHandleModelData] = useState({});
  const [centreList, setCentreList] = useState([]);
  const [searchOptionTbody, setSearchOptionTbody] = useState([]);
  const [dispatchSamplesTbody, setDispatchSamplesTbody] = useState([]);

  const [modalData, setModalData] = useState({});


  const bindDispatchSampleList = async (data) => {
    const apiResp = await SampleDispatchSearch(data)
    if (apiResp?.success) {
      setDispatchSamplesTbody(apiResp?.data)
    } else {
      notify(apiResp?.message, "error")
    }
    console.log("apiResp", apiResp)
  }

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };
  const handleSelect = (name, value) => {
    let obj = { ...values, [name]: value }
    setValues(obj)
    if (name === "DispatchCenterTo") {
      bindDispatchSampleList(obj)
    }
  }
  const handleChange = (e) => {
    let obj = { ...values, [e.target.name]: e.target.value }
    setValues(obj)
    if (e.target.name === "toDate" || e.target.name === "fromDate") {
      bindDispatchSampleList(obj)
    }
  }

  const handleChangeCheckboxHeader = (e) => {
    let respData = searchOptionTbody?.map((val) => {
      val.isChecked = e?.target?.checked
      return val
    })
    setSearchOptionTbody(respData)
  }

  const handleChangeCheckbox = (e, ele, index) => {
    let data = [...searchOptionTbody]
    data[index].isChecked = e?.target?.checked
    setSearchOptionTbody(data)
  }
  const bindTransferCentre = async () => {
    let apiResp = await BindCentreList()
    if (apiResp?.success) {
      setCentreList(reactSelectOptionList(apiResp?.data, "CentreName", "CentreID"))
    } else {
      setCentreList([])
    }

  }


  useEffect(() => {
    bindTransferCentre()
  }, [])

  const ErrorHandling = () => {
    let errors = {};
    if (!values?.TransferredTo?.value) {
      errors.TransferredTo = "Transferred To Field Is Required";
    }
    if (!values?.BarcodeNo) {
      errors.BarcodeNo = "Barcode No Field Is Required";
    }
    return errors;
  };

  const handleSearchSample = async () => {
    const customerrors = ErrorHandling();
    if (Object.keys(customerrors)?.length > 0) {
      console.log("Sss", Object.keys(customerrors)?.length)
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[0], "error");
      }
      return false;
    }

    const apiResp = await SampleTransferSearchInvestigation(values?.BarcodeNo)
    if (apiResp?.success) {
      const updatedItems = apiResp?.data?.map(item => ({
        ...item,
        isChecked: false
      }));
      setSearchOptionTbody(updatedItems)
    } else {
      setSearchOptionTbody([])
    }
  }
  const SaveSampleTransfer = async () => {
    let apiResp = await SaveSampleTransferAPI(searchOptionTbody)
    if (apiResp?.success) {
      notify(apiResp?.message, 'success')
      handleSearchSample()
    } else {
      notify(apiResp?.message, 'error')
    }
  }

  const handleChangeCheckboxHeaderDispatch = (e) => {
    let respData = dispatchSamplesTbody?.map((val) => {
      val.isChecked = e?.target?.checked
      return val
    })
    setDispatchSamplesTbody(respData)
  }

  const handleChangeCheckboxDispatch = (e, ele, index) => {
    let data = [...dispatchSamplesTbody]
    data[index].isChecked = e?.target?.checked
    setDispatchSamplesTbody(data)
  }
  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("heading")}
          isBreadcrumb={true}
        />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 pt-2 px-2">
          <Input
            type="text"
            className="form-control required-fields"
            id="BarcodeNo"
            name="BarcodeNo"
            value={values?.BarcodeNo ? values?.BarcodeNo : ""}
            onChange={handleChange}
            lable={t("BarcodeNo")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("TransferredTo")}
            id={"TransferredTo"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={centreList}
            handleChange={handleSelect}
            value={`${values?.TransferredTo?.value}`}
            name={"TransferredTo"}
            requiredClassName="required-fields"
          />

          <div className=" col-sm-2 col-xl-2">
            <button className="btn btn-sm btn-success" type="button" onClick={handleSearchSample}>
              {t("Search")}
            </button>
          </div>




        </div>
        {searchOptionTbody?.length > 0 ?
          <div className='p-1'>
            <SearchOptionTable tbody={searchOptionTbody} handleChangeCheckboxHeader={handleChangeCheckboxHeader} handleChangeCheckbox={handleChangeCheckbox} />

            <div className="d-flex mt-2">
              <button className="btn btn-sm btn-success ml-auto" type="button" onClick={SaveSampleTransfer}>
                {t("TransferedSample")}
              </button>
            </div>
          </div> :
          ""}


      </div>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("DispatchSamples")}
          isBreadcrumb={false}
        />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">

          <ReactSelect
            placeholderName={t("DispatchCenterTo")}
            id={"DispatchCenterTo"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={centreList}
            handleChange={handleSelect}
            value={`${values?.DispatchCenterTo?.value}`}
            name={"DispatchCenterTo"}
            requiredClassName="required-fields"
          />

          <DatePicker
            className="custom-calendar"
            id="fromDate"
            name="fromDate"
            lable={t("FromDate")}
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
            lable={t("ToDate")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
          />


        </div>

        {dispatchSamplesTbody?.length > 0 ?
          <div className='p-1'>
            <DispatchSamplesTable tbody={dispatchSamplesTbody} handleChangeCheckboxHeader={handleChangeCheckboxHeaderDispatch} handleChangeCheckbox={handleChangeCheckboxDispatch} />

            <div className="d-flex mt-2">
              <button className="btn btn-sm btn-success ml-auto" type="button" onClick={SaveSampleTransfer}>
                {t("TransferedSample")}
              </button>
            </div>
          </div> :
          ""}

      </div>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}
    </>
  )
}
