import React, { useState } from "react";
import Tables from "..";
import { ReprintSVG } from "../../../SvgIcons";
import { useTranslation } from "react-i18next";
import Modal from "../../../modalComponent/Modal";
import { viewItem } from "../../../../networkServices/InventoryApi";
import ViewIndentModal from "../../../modalComponent/Utils/ViewIndentModal";
import { PrintIndent } from "../../../../networkServices/BillingsApi";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import { notify } from "../../../../utils/utils";

const ViewRequisitionTable = ({ THEAD, tbody ,handleSearchViewReqDetails}) => {
  const [t] = useTranslation();
  const [viewDetails, setViewDetails] = useState([]);
  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
    prescription: null,
  });
  const handleSelect = (e, index, item, view) => {
    const { name, checked } = e.target;
    const data = [...view];
    data[index][name] = checked;
    handleSetModeldata(data,"",item);
    setViewDetails(data);
  
  };

  const handleSetModeldata = (data, prescription, val) => {
    console.log("Data from handleSetModelDaa", data);
    if(data == undefined){
      notify("Record not found" , "error")
    }
    setModalData({
      visible: data === undefined ? false : true,
      prescription: prescription ? prescription : modalData?.prescription,
      component: (
        <ViewIndentModal
          view={data}
          handleSelect={handleSelect}
          setModalData={setModalData}
          val={val}
          handleSearchViewReqDetails={handleSearchViewReqDetails}
        />
      ),
      size: "50vw",
      Header: t("Requisition Detail"),
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
  };

  const GetViewIndent = async (val, prescription) => {
    // console.log(val);
    const IndentNo = val?.indentno;
    const Status = val?.StatusNew;
    try {
      const response = await viewItem(IndentNo, Status);
      const data = response?.data?.dtnew?.map((ele) => {
        ele.isReject = false;
        return ele;
      });
      console.log("Data ViewItem" , data);
      setViewDetails(data);
      handleSetModeldata(data, prescription, val);
    } catch (error) {
      console.error(error);
    }
  };
  const getOpenReportInPDF = async (item) => {
    const IndentNo = item?.indentno;

    try {
      const response = await PrintIndent(IndentNo);

      RedirectURL(response?.data?.pdfUrl);
    } catch (error) {
      console.error(error);
    }
  };
  const getRowClass = (value,index) => {
    const val = tbody[index];
    console.log("first" , val?.StatusNew) 
    if(val?.StatusNew === "CLOSE"){
      return "color-indicator-11-bg";
    }
    if(val?.StatusNew === "OPEN"){
      return "color-indicator-16-bg";
    }
    if (val?.StatusNew === "APPROVED") {
      return "color-indicator-1-bg";
    }
    if (val?.StatusNew === "REJECT") {
      return "color-indicator-2-bg";
    }
    // if (val?.StatusNew === "OPEN") {
    //   return "rgb(196, 173, 233)";
    // }
    if (val?.StatusNew === "PARTIAL") {
      return "color-indicator-4-bg";
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
      <Tables
        thead={THEAD}
        tbody={tbody?.map((item, index) => ({
          "Sr No": index + 1,
          FromCentre: item?.FromCentre,
          dtEntry: item?.dtEntry,
          indentno: item?.indentno,
          deptto: item?.deptto,
          DeptFrom: item?.DeptFrom,
          View: (
            <i className="fa fa-eye" onClick={() => GetViewIndent(item)}></i>
          ),
          Print: (
            <div onClick={() => getOpenReportInPDF(item)}>
              <ReprintSVG />
            </div>
          ),
          // colorcode: getRowClass(item),
        }))}
        getRowClass={getRowClass}
        tableHeight={"tableHeight"}
        style={{ maxHeight: "200px" }}
      />
    </>
  );
};

export default ViewRequisitionTable;
