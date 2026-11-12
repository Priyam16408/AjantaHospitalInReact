import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import Input from '../../../components/formComponent/Input';
import Tables from '../../../components/UI/customTable';
import { IPDNoByApprovalDays, SaveApprovalDays } from '../../../networkServices/BillingsApi';
import { notify } from '../../../utils/ustil2';

const PanelApprovalDays = () => {
  const [t] = useTranslation();
  const [values, setValues] = useState({
    IPDNo: ""
  })
  const [PannelApprovalData, setPannelApprovalData] = useState([]);

  const theadPannelApproval = [
    { width: "5%", name: t("S.No") },
    { width: "5%", name: t("PatientName") },
    { width: "5%", name: t("PatientID") },
    { width: "5%", name: t("IPD No") },
    { width: "5%", name: t("approval Days") },
    { width: "5%", name: t("Approval By") },
    { width: "5%", name: t("Approval Date") },
    { width: "5%", name: t("Action") },
  ]
  const handleInputChange = (e, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleSearchPannelApproval = async () => {
    try {
      if (!values?.IPDNo) {
        notify("Please Enter IPDNO", "warn")
        setPannelApprovalData([])
        return;
      }
      const response = await IPDNoByApprovalDays(values?.IPDNo);
      if (response.success) {
        setPannelApprovalData(response.data)
      } else {
        notify(response.message, "error")
        setPannelApprovalData([])
      }
    } catch (error) {
      notify(response?.message, "error");
    }
  }

  const handleCustomInput = (index, name, value) => {
    const newMappings = [...PannelApprovalData];
    newMappings[index][name] = value;
    setPannelApprovalData(newMappings)
  };
  const handleSave = async (data) => {
    try {
      const payload = {
        tid: data?.TransactionID,
        approvalDays: data?.ApprovalDays ? data?.ApprovalDays : '',
      }
      const response = await SaveApprovalDays(payload)
      if (response.success === true) {
        notify(response.message, "success")
        handleSearchPannelApproval()
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
          onClick={handleSearchPannelApproval}
          className="btn btn-sm btn-success ms-auto ml-2"
        >
          {t("Search")}
        </button>
      </div>
      {PannelApprovalData.length > 0 &&
        (
          <div className="card">
            <Heading title={t("Pannel Approval")} isBreadcrumb={false} />
            <Tables
              thead={theadPannelApproval}
              tbody={PannelApprovalData.map((val, index) => ({
                "S.No": index + 1,
                PatientName: val.PatientName,
                "UHID": val.PatientID,
                "IPD.No": val.IPDNo,
                "Approval Days": (
                  <Input
                    type="number"
                    className="table-input"
                    removeFormGroupClass={true}
                    display={"left"}
                    name={"ApprovalDays"}
                    value={val?.ApprovalDays}
                    onChange={(e) => { handleCustomInput(index, "ApprovalDays", e.target.value) }}
                  />
                ),
                "Added By": val.UpdateByDays,
                "Add Date": val.ApprovalDaysDate,
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

export default PanelApprovalDays;