import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import TextAreaInput from '../../../components/formComponent/TextAreaInput'
import BrowseButton from '../../../components/formComponent/BrowseButton'
import { notify } from '../../../utils/utils'
import { handleSaveUpdateCentreAPI } from '../../../networkServices/EDP/edpApi'
import { SaveUpdateCentrePayload } from '../../../utils/ustil2'

export default function CenterMaster({ data, setVisible }) {
  const [t] = useTranslation()
  const initialValues = { fileExtension: "", Active: { value: "1" }, FollowIPDNo: { value: "1" }, DiscountType: { value: "0" }, type: "save" }
  const [values, setValues] = useState(initialValues)
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((val) => ({ ...val, [name]: value }))

  }

  useEffect(() => {
    if (data?.CentreID) {
      setValues((val) => ({ ...val, ...data, type: "edit" }))
    }
  }, [data])
  const handleSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }))
  }

  const handleImageChange = (e) => {
    const file = e?.target?.files[0];

    if (file) {
      // Check if file size exceeds 5MB (5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        notify("File size exceeds 5MB. Please choose a smaller file.", "error");
        return;
      }
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        const fileExtension = file?.name.split(".").pop();
        setValues((val) => ({ ...val, [e?.target?.name]: base64String }))
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  const handleSaveCentre = async () => {
    if (values?.FollowIPDNo?.value === "0" && !values?.Centre) {
      notify("Please Select Centre Field", "error")
      return 0
    }
    
    let payload = SaveUpdateCentrePayload(values, data)
    let apiResp = await handleSaveUpdateCentreAPI(payload, values?.type);
    if (apiResp?.success) {
      notify(apiResp?.message)
      setVisible()
      setValues(initialValues)
    } else {
      notify(apiResp?.message, "error")
    }

  }

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading title={t("Centre Master Details")} isBreadcrumb={true} />
          <div className='row p-2'>
            <Input
              type="text"
              className="form-control required-fields"
              id="CentreName"
              placeholder=" "
              name="CentreName"
              value={values?.CentreName ? values?.CentreName : ""}
              onChange={handleChange}
              lable={t("Centre Name")}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="CentreCode"
              placeholder=" "
              name="CentreCode"
              value={values?.CentreCode ? values?.CentreCode : ""}
              onChange={handleChange}
              lable={t("Centre Code")}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control "
              id="Website"
              placeholder=" "
              name="Website"
              value={values?.Website ? values?.Website : ""}
              onChange={handleChange}
              lable={t("Website")}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="ContactNo"
              placeholder=" "
              name="ContactNo"
              value={values?.ContactNo ? values?.ContactNo : ""}
              onChange={handleChange}
              lable={t("Contact No.")}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control "
              id="LandlineNo"
              placeholder=" "
              name="LandlineNo"
              value={values?.LandlineNo ? values?.LandlineNo : ""}
              onChange={handleChange}
              lable={t("Landline No.")}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="EmailAddress"
              placeholder=" "
              name="EmailAddress"
              value={values?.EmailAddress ? values?.EmailAddress : ""}
              onChange={handleChange}
              lable={t("Email")}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
            <ReactSelect
              placeholderName={t("Discount Type")}
              id={"DiscountType"}
              searchable={true}
              requiredClassName={"required-fields"}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              dynamicOptions={[
                { "label": "Select", "value": "0" },
                { "label": "Cash", "value": "Cash" },
                { "label": "Corporate", "value": "Corporate" }
              ]}
              handleChange={handleSelect}
              value={values?.DiscountType?.value}
              name={"DiscountType"}
            />
            <TextAreaInput
              lable={t("Address")}
              placeholder=""
              className="w-100 required-fields h-24"
              id="Address"
              rows={1}
              name="Address"
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              value={values?.Address ? values?.Address : ""}
              maxLength={200}
              onChange={handleChange}
            />
            <Input
              type="text"
              className="form-control "
              id="Latitude"
              placeholder=" "
              name="Latitude"
              value={values?.Latitude ? values?.Latitude : ""}
              onChange={handleChange}
              lable={t("Latitude")}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control "
              id="Longitude"
              placeholder=" "
              name="Longitude"
              value={values?.Longitude ? values?.Longitude : ""}
              onChange={handleChange}
              lable={t("Longitude")}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
            {values?.FollowIPDNo?.value === "1" ?
              <Input
                type="text"
                className="form-control "
                id="Prefix"
                placeholder=" "
                name="Prefix"
                value={values?.Prefix ? values?.Prefix : ""}
                onChange={handleChange}
                lable={t("Prefix")}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
              :
              <ReactSelect
                placeholderName={t("Centre")}
                id={"Centre"}
                searchable={true}
                removeIsClearable={true}
                requiredClassName={"required-fields"}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                dynamicOptions={data?.centreList?.filter((val) => val?.value !== data?.CentreID)}
                handleChange={handleSelect}
                value={values?.Centre?.value}
                name={"Centre"}
              />
            }

            <Input
              type="text"
              className="form-control "
              id="printBarcode"
              placeholder=" "
              name="printBarcode"
              value={values?.printBarcode ? values?.printBarcode : ""}
              onChange={handleChange}
              lable={t("Printed Barcode")}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />

            <div className="col-xl-2 col-md-3 col-sm-4 col-6">
              <BrowseButton
                label={t("Header logo")}
                handleImageChange={handleImageChange}
                className={`btn-primary  w-100 px-xl-3 mb-2`}
                value={values?.headerLogo}
                name="headerLogo"
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-6">
              <BrowseButton
                label={t("Footer logo")}
                handleImageChange={handleImageChange}
                className={`btn-primary  w-100 px-xl-3 mb-2`}
                value={values?.Footerlogo}
                name="Footerlogo"
              />
            </div> 
            <ReactSelect
              placeholderName={t("Follow IPD No")}
              id={"FollowIPDNo"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              dynamicOptions={[{ label: "Self", value: "1" }, { label: "Follow", value: "0" }]}
              handleChange={handleSelect}
              value={values?.FollowIPDNo?.value}
              name={"FollowIPDNo"}
            />
            <div className="col-xl-2 col-md-3 col-sm-4 col-6 ">
              <BrowseButton
                label={t("Is Nabl Center")}
                handleImageChange={handleImageChange}
                className={`btn-primary  w-100 px-xl-2 mb-2`}
                value={values?.IsNablCenter}
                name="IsNablCenter"
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-6">
              <BrowseButton
                label={t("IsCAP/ISO")}
                handleImageChange={handleImageChange}
                className={`btn-primary  w-100 px-xl-3 mb-2`}
                value={values?.IsCAPISO}
                name="IsCAPISO"
              />
            </div>
            <ReactSelect
              placeholderName={t("Active")}
              id={"Active"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-1 col-md-3 col-sm-4 col-12"
              dynamicOptions={[{ label: "Active", value: "1" }, { label: "In-Active", value: "0" }]}
              handleChange={handleSelect}
              value={values?.Active?.value}
              name={"Active"}
            />
            <div className="col-xl-1 col-md-1 col-sm-2 col-3">
              <button className="btn btn-sm btn-primary mr-1 px-4" onClick={handleSaveCentre}>
                {t(values?.type === "save" ? "Save" : "Update")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
