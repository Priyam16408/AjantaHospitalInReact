import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import Input from '../../../components/formComponent/Input';
import Tables from '../../../components/UI/customTable';
import { IPDNoByCeilingDetails, SaveCeilingAmount } from '../../../networkServices/BillingsApi';
import { notify } from '../../../utils/ustil2';

const PatientCelling = () => {
  const [t] = useTranslation();
  const [values, setValues] = useState({
    IPDNo: ""
  })
  const [PatientCeilingData, setPatientCeilingData] = useState([]);


  const theadPatientCeiling = [
    { width: "5%", name: t("S.NO") },
    { width: "5%", name: t("UHID") },
    { width: "5%", name: t("PatientName") },
    { width: "5%", name: t("IPD.No") },
    { width: "5%", name: t("Ceiling Amount") },
    { width: "5%", name: t("Added By") },
    { width: "5%", name: t("Add Date") },
    { width: "5%", name: t("Action") },
  ]
  const handleInputChange = (e, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleSearPatientCeiling = async () => {
    try {
      if (!values?.IPDNo) {
        notify("Please Enter IPDNO", "warn")
        setPatientCeilingData([])
        return;
      }
      const response = await IPDNoByCeilingDetails(values?.IPDNo);
      if (response.success) {
        setPatientCeilingData(response.data)
      } else {
        notify(response.message, "error")
        setPatientCeilingData([])
      }
    } catch (error) {
      notify(response?.message, "error");
    }
  }

  const handleCustomInput = (index, name, value, type, max = 9999999999999) => {
    if (type === "number") {
      if (!isNaN(value) && Number(value) <= max) {
        const newMappings = [...PatientCeilingData];
        newMappings[index][name] = value;
        setPatientCeilingData(newMappings)
      }
    }

  };
  const handleSave = async (data) => {
    try {
      const payload = {
        ceilingID: data?.CeilingID ? Number(data?.CeilingID) : 0,
        tid: data?.TransactionID,
        ceilingAmount: data?.CeilingAmount ? String(data?.CeilingAmount) : '0',
      }
      const response = await SaveCeilingAmount(payload)
      if (response.success === true) {
        notify(response.message, "success")
        handleSearPatientCeiling()
      } else {
        notify(response.message, "error")
      }
    } catch (error) {

    }

  }
  return (
    <div className="spatient_registration_card  card">
      <Heading isBreadcrumb={true} isSlideScreen={false} />
      <div className="row p-2">
        <Input
          className={"form-control required-fields"}
          lable={t("IPDNo")}
          placeholder=" "
          id="IPDNo"
          name="IPDNo"
          onChange={(e) => handleInputChange(e, "IPDNo")}
          value={values?.IPDNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <button
          onClick={handleSearPatientCeiling}
          className="btn btn-sm btn-success ms-auto ml-2"
        >
          {t("Search")}
        </button>
      </div>
      {
        PatientCeilingData.length > 0 &&
        (
          <div className="card">
            <Heading title={t("Patient CEILING")} isBreadcrumb={false} />
            <Tables
              thead={theadPatientCeiling}
              tbody={PatientCeilingData.map((val, index) => ({
                "S.NO": index + 1,
                "UHID": val.PatientID,
                PatientName: val.PatientName,
                "IPD.No": val.IPDNo,
                "Ceiling Amount": (
                  <Input
                    type="text"
                    className="table-input"
                    removeFormGroupClass={true}
                    display={"left"}
                    name={"CeilingAmount"}
                    value={val?.CeilingAmount}
                    onChange={(e) => { handleCustomInput(index, "CeilingAmount", e.target.value, "number", 1000000000) }}
                  />
                ),
                "Added By": val.AddedBy,
                "Add Date": val.EntryDate,
                "Action": (
                  <>

                    <button
                      className="btn btn-sm btn-primary tbl-btn"
                      onClick={() => handleSave(val)}
                    >
                      {t("Save")}
                    </button>
                  </>
                )
              }))}
            // tableHeight="scrollView"
            // style={{ height: "50vh", padding: "1px" }}
            />
          </div>
        )
      }
    </div>
  )
}

export default PatientCelling;