import React, { useState } from "react";
import Tables from "..";
import ViewVendorMasterModal from "../../../modalComponent/Utils/MedicalStore/ViewVendorMasterModal";
import { useTranslation } from "react-i18next";
import Modal from "../../../modalComponent/Modal";
import { UpdateManufacture } from "../../../../networkServices/InventoryApi";
import { notify } from "../../../../utils/utils";

const VendorDetailTable = ({
  thead,
  tbody,
  setTableData,
  ip,
  handleSearch,
}) => {
  console.log("TableData in VendorDetailTablezz", tbody);
  const [t] = useTranslation();
  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
    prescription: null,
  });
  console.log("TableData in VendorDetailTable", tbody?.terms);
  const [termsSelected , setTermsSelected] = useState(tbody?.terms)
  console.log("termsSelected from new state" , termsSelected)

  const handleSetModeldata = (data , tbody) => {
    console.log("Data" , data , "Pesciption" , tbody);
    setModalData({
      visible: true,
      // prescription: prescription ? prescription : modalData?.prescription,
      component: (
        <ViewVendorMasterModal
          view={data}
          termsSelected={tbody?.terms}
          setModalData={setModalData}
          handleSearch={handleSearch}
          setTermsSelected={setTermsSelected}
          setTableData={setTableData}
        />
      ),
      size: "70vw",
      Header: t("Supplier Detail"),
      setVisible: false,
      footer: <></>,
    });
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
      {console.log("TableData before sendign", tbody)}
      {tbody?.details?.length > 0 && (
        <>
          <Tables
            thead={thead}
            tbody={tbody?.details?.map((ele, index) => ({
              SrNo: index + 1,
              VendorType: ele?.VendorType,
              Category: ele?.VendorCategory,
              Name: ele?.VendorName,
              GSTINNo: ele?.Ven_GSTINNo,
              Address1: ele?.Address1,
              Address2: ele?.Address2,
              Address3: ele?.Address3,
              City: ele?.City,
              Country: ele?.Country,
              MobileNo: ele?.Mobile,
            //   UserName: ele?.UserName,
            //   IsAsset: ele?.IsAsset,
              edit: (
                <div
                  className="text-center"
                  onClick={() => handleSetModeldata(ele, tbody)}
                >
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </div>
              ),
            }))}
            tableHeight={"tableHeight"}
            style={{ maxHeight: "150px" }}
          />
        </>
      )}
    </>
  );
};

export default VendorDetailTable;
