import React, { useMemo } from 'react'
import Heading from '../UI/Heading'
import LabeledInput from '../formComponent/LabeledInput';
import { useTranslation } from 'react-i18next';

export default function PatientBillingDetails({BillDetails ,heading}) {

  const {t}=useTranslation()
    const handleDataInDetailView = useMemo(() => {
        if (Object.keys(BillDetails)?.length > 0) {
          const data = [
            {
              label: "GrossAmount",
              value: BillDetails[0]?.GrossAmt || "0.00",
            },
            {
              label: "Discount",
              value: BillDetails[0]?.TDiscount || "0.00",
            },
            {
              label: "NetAmount",
              value: BillDetails[0]?.NetAmt || "0.00",
            },
            {
              label: "deductions",
              value: BillDetails[0]?.TotalDeduction || "0.00",
            },
            {
              label: "Tax Amount",
              value: BillDetails[0]?.RecAmt || "0.00",
            },
            {
              label: "NetBillAmount",
              value: (
                parseFloat(BillDetails[0]?.NetAmt) -
                  parseFloat(BillDetails[0]?.TDiscount) || 0
              ).toFixed(2),
            },
            {
              label: "RoundOff",
              value: BillDetails[0]?.RoundOff?BillDetails[0]?.RoundOff:"0",
            },
            {
              label: "Allocated",
              value: BillDetails[0]?.PanelAllocatedAmt?BillDetails[0]?.PanelAllocatedAmt:"0",
            },
            {
              label: "Remaining Amt",
              value: BillDetails[0]?.RemainingAmt?BillDetails[0]?.RemainingAmt:"0.00",
            },
            {
              label: "ApprovedAmount",
              value: BillDetails?.PanelApprovedAmt || "0.00",
            },
          ];
    
          return data;
        } else {
          return [];
        }
      }, [BillDetails]);

      console.log("BillDetailsBillDetails",BillDetails)

  return (
    <>
      <div className="card">
        <Heading title={<>{heading}</>} />
        <div className="row m-2">
          {handleDataInDetailView?.map((data, index) => (
            <>
              <div
                className="col-xl-1 col-md-4 col-sm-6 col-12"
                key={index}
                style={{
                  display: "grid",
                  alignItems: "center",
                }}
              >
                <div className="d-flex align-items-center">
                  {data?.icons}
                  <LabeledInput
                    label={t(data?.label)}
                    value={data?.value}
                    className={"w-100"}
                    style={{ textAligns: "right" }}
                  />
                </div>
              </div>
            </>
          ))}
          {/* <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <div className="d-flex justify-content-left">
              <button className="btn btn-sm btn-success">
                Billing Remarks
              </button>
              <button className="btn btn-sm btn-success ml-3">Request</button>
            </div>
          </div> */}
        </div>
      </div>


    </>
  )
}
