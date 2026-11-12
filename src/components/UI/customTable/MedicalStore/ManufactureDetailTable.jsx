import React, { useState } from "react";
import Tables from "..";
import ViewManufactureMasterModal from "../../../modalComponent/Utils/MedicalStore/ViewManufactureMasterModal";
import { useTranslation } from "react-i18next";
import Modal from "../../../modalComponent/Modal";
import { UpdateManufacture } from "../../../../networkServices/InventoryApi";
import { notify } from "../../../../utils/utils";
import ReactSelect from "../../../formComponent/ReactSelect";

const ManufactureDetailTable = ({
  thead,
  tbody,
  setTableData,
  ip,
  handleSearch,
  CentreWiseCache
}) => {
  console.log("TableData from ManufactureDetailTable" , tbody);
  const [t] = useTranslation();
  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
    prescription: null,
  });

  const handleSetModeldata = (data, prescription) => {
    console.log("Data from handleSetModelDaa" , data);
    setModalData({
      visible: true,
      prescription: prescription ? prescription : modalData?.prescription,
      component: (
        <ViewManufactureMasterModal
          view={data}
          setModalData={setModalData}
          handleSearch={handleSearch}
          CentreWiseCache={CentreWiseCache}
          setTableData={setTableData}
        />
      ),
      size: "70vw",
      Header: t("Edit Manufacture"),
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
      {console.log("Tbody" , tbody)}
      {tbody?.length > 0 && (
        <>
          <Tables
            thead={thead}
            tbody={tbody?.map((ele, index) => ({
              SrNo: index + 1,
              CompanyName: ele?.CompanyName,
              Address1: ele?.Address1,
              Address2: ele?.Address2,
              PinCode: ele?.PinCode,
              City: ele?.CityName,
              // City: (
              //   <ReactSelect
              //     placeholderName={t("City")}
              //     searchable={true}
              //     respclass="w-100 pr-2"
              //     id="City"
              //     dynamicOptions={
              //       values?.districtID
              //         ? filterByTypes(
              //             CentreWiseCache,
              //             [
              //               10,
              //               values?.StateID?.value
              //                 ? parseInt(values?.StateID?.value)
              //                 : values?.StateID,
              //               values?.districtID?.value
              //                 ? parseInt(values?.districtID?.value)
              //                 : values?.districtID,
              //             ],
              //             ["TypeID", "StateID", "DistrictID"],
              //             "TextField",
              //             "ValueField"
              //           )
              //         : []
              //     }
              //     name="cityID"
              //     value={`${values?.cityID}`}
              //     handleChange={handleReactSelect}
              //   />
              // ),
              ContactPerson: ele?.ContactPerson,
              Phone: ele?.Phone,
              Fax: ele?.Fax,
              Email: ele?.Email,
              IsActive: ele?.IsActive === "Active" ? "Active" : "Inactive",
              UserName: ele?.UserName,
              IsAsset:  ele?.IsAsset === "Yes" ? "Yes" : "No"
              ,
              edit: (
                <div
                  className="text-center"
                  onClick={() => handleSetModeldata(ele)}
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

export default ManufactureDetailTable;
