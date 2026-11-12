import React, { useState } from "react";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";
import Heading from "../../components/UI/Heading";
import { IPDAdvanceGetCTBDetails, IPDAdvanceGetCTBDetailsReport } from "../../networkServices/BillingsApi";
import { RedirectURL } from "../../networkServices/PDFURL";
import { ReprintSVG } from "../../components/SvgIcons";
import Modal from "../../components/modalComponent/Modal";
const CTBbillrePrintTable = ({ THEAD, tbody, transactionID }) => {
  const [t] = useTranslation();
  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
    prescription: null,
  });
  const theadd = [
    t("S.No."),
    t("Name"),
    t("Rate"),
    t("Qty"),
    t("Gross Amount"),
    t("Disc Amt"),
    t("Net Amt"),
  ];

  const getRowClass = (val) => {
    console.log(val);
    let slotConfirmationDetail = tbody?.find(
      (item) => item?.ReciptNo === val?.ReciptNo
      //   (item) => item?.ReciptNo === val?.ReciptNo
    );
    console.log("slotConfirmationDetail", slotConfirmationDetail);
    if (slotConfirmationDetail?.ReciptNo) {
      return "color-indicator-24-bg";
    } else if (!slotConfirmationDetail?.ReciptNo) {
      return "color-indicator-25-bg";
    }
  };

  const handPrint = async () => {
    let payload = {
      ledgerTransactionNo: transactionID,
    }

    try {
      const response = await IPDAdvanceGetCTBDetailsReport(payload);
      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
      }
      else {
        console.log("error", response?.message)
      }

    } catch (error) {
      console.error(error);
    }
  };
  const geBindDetails = async (LedgerTransactionNo) => {
    
    // const TransactionID = data?.transactionID;
    try {
      const response = await IPDAdvanceGetCTBDetails(LedgerTransactionNo);
      console.log("res", response)
      if (response?.success) {
        setModalData({
          visible: true,
          // prescription: prescription ? prescription : modalData?.prescription,
          component: (
            <div>
              <Tables
                thead={theadd}

                tbody={response?.data?.map((item, index) => ({
                  SNo: index + 1,
                  "name": item?.ItemName,
                  "rate": item?.rate,
                  qty: item?.Quantity,
                  GrossAmount: item?.GrossAmount,
                  DiscAmt: item?.DiscAmt ? item?.DiscAmt : "0",

                  NetAmount: item?.NetAmount,


                }))}
              // tableHeight={"tableHeight"}
              // // style={{ maxHeight: "120px" }}
              // getRowClass={getRowClass}
              />
            </div>
            // <ViewItem data={data} />
          ),
          size: "50vw",
          Header: (
            "Details"
          ),
          // Header:`${t("Purchase Request Detail")} `,
          setVisible: false,
          footer: (
            <>
              <button
                className="btn btn-sm btn-success mx-1"
                onClick={() => setModalData((val) => ({ ...val, visible: false }))}
              >
                {t("Close")}
              </button>{" "}
            </>
          ),
        });
      }
      // setDetail(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {modalData.visible && (
        <Modal
          visible={modalData.visible}
          Header={modalData.Header}
          modalWidth={modalData?.size}
          onHide={modalData?.setVisible}
          setVisible={() => {
            setModalData((val) => ({ ...val, visible: false }));
          }}
          footer={modalData?.footer}
        >
          {modalData?.component}
        </Modal>
      )}
      <Heading
        title={t("CTB Details")}
        secondTitle={
          <>
            <ColorCodingSearch color={"color-indicator-25-bg"}  label={t("UnPaid")} />
            <ColorCodingSearch color={"color-indicator-24-bg"} label={t("Paid")} />
          </>
        }
      />
      <Tables
        thead={THEAD}

        tbody={tbody?.map((item, index) => ({
          SNo: index + 1,
          "date": item?.DATE,
          "CTB No.": item?.CTBNo,
          ReciptNo: item?.ReciptNo,
          "View": <i className="fa fa-eye" onClick={()=>geBindDetails(item?.LedgerTransactionNo)}></i>,
          "Print": <span onClick={handPrint}> <ReprintSVG /></span>,

        }))}
        tableHeight={"tableHeight"}
        // style={{ maxHeight: "120px" }}
        getRowClass={getRowClass}
      />
    </>
  );
};

export default CTBbillrePrintTable;
