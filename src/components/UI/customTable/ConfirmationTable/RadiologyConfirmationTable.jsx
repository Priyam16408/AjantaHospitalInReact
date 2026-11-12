import React, { useState } from "react";
import Tables from "..";
import SlotModal from "../../../modalComponent/Utils/SlotModal";
import Modal from "../../../modalComponent/Modal";
import { Tooltip } from "primereact/tooltip";
import InvestigationModal from "../../../modalComponent/Utils/InvestigationModal";
import moment from "moment";
import Confirm from "../../../modalComponent/Confirm";
import { UpdateRadiologySchedule } from "../../../../networkServices/OPDConfirmation";
import { notify } from "../../../../utils/utils";
import { useTranslation } from "react-i18next";

const RadiologyConfirmationTable = (props) => {
  const { THEAD, tbody, handleModel } = props;
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [t] = useTranslation()
  const [modalData, setModalData] = useState(false);
  const handleSlotModal = (index) => {
    setModalData(true);
    setSelectedRowIndex(index);
  };
  const handleSetData = (modifiedData) => {
    const data = [...tbody];
    data[selectedRowIndex] = modifiedData;
    setModalData(false);
    setSelectedRowIndex(null);
  };

  const [confirmBoxvisible, setConfirmBoxvisible] = useState({
    show: false,
    alertMessage: "",
    lableMessage: "",
    chidren: "",
  });


  const handleUpdateRadiologySchedule = async (APIPARAMS) => {
    console.log(APIPARAMS);
    try {
      const res = await UpdateRadiologySchedule({
        modalityID: String(APIPARAMS?.ModalityID),
        subCategoryID: String(APIPARAMS?.SubcategoryID),
        itemID: String(selectedRowIndex?.ItemID),
        bookingDate: APIPARAMS?.SlotDateDisplay,
        timeSlot: `${APIPARAMS?.FromTimeDisplay} - ${APIPARAMS?.ToTimeDisplay}`,
        bookingID: String(selectedRowIndex?.BookingID),
        isOnlineBooking: String(selectedRowIndex?.isOnlineBooking)
      });
      if (res.success === true) {
        notify(res.message, "success");
        setConfirmBoxvisible({ ...confirmBoxvisible, show: false });
        setModalData(false);
      }

      console.log("ARSHAD", res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmBox = (paramsData) => {
    setConfirmBoxvisible({
      show: true,
      alertMessage: " Are you sure to Update Schedule",
      lableMessage: "Radiology Appointment",
      chidren: (
        <>
          <div>
            <button
              className="modalConfirmButton"
              // style={{padding:".25rem .5rem", backgroundColor:"#22d8a9", borderColor:"#22d8a !important",height:"24px"}}
              onClick={() => {

                handleUpdateRadiologySchedule(paramsData);
              }}

            >
              {t("Update")}
            </button>
            <button
              className="modalCancelButton"
              onClick={() => {
                setConfirmBoxvisible({ ...confirmBoxvisible, show: false });
              }}
            >
              {t("Cancel")}
            </button>

          </div>
        </>
      ),
    });
  };
  return (
    <>
      {tbody.map((item, index) => (
        <Tooltip
          key={index}
          target={`#doctorName-${index}, #visitType-${index}`}
          position="top"
        />
      ))}
      {tbody.length > 0 && (
        <Tables
          thead={THEAD}
          tbody={tbody.map((item, index) => ({
            "#": index + 1,
            UHID: item?.UHID,
            LabNo: item?.LabNo,
            PName: item?.PName,
            Age: item?.Age,
            Mobile: item?.Mobile,
            subcategoryName: item?.subcategoryName,
            TestName: item?.TestName,
            TokenNo: item?.TokenNo,
            TokenRoomName: item?.TokenRoomName,
            BookingDate: item?.BookingDate,
            BookingTime: item?.BookingTime,
            BookingFrom: item?.BookingFrom,
            Actions: (
              <>
                <div
                  className="d-flex justify-content-center"
                  style={{ gap: "10px" }}
                >
                  <button
                    onClick={() => handleSlotModal(item)}
                    className={
                      item?.IsDeptReceive === "1"
                        ? "grayColorBtnDisabled btn btn-sm"
                        : "btn btn-sm btn-primary"
                    }
                    disabled={item?.IsDeptReceive === "1"}
                  >
                    {t("Reschedule")}
                  </button>
                </div>
              </>
            ),
          }))}
          tableHeight={"tableHeight"}
        />
      )}
      {modalData && (
        <Modal
          visible={modalData}
          setVisible={setModalData}
          modalWidth="90vw"
          Header="Doctor Slot"
          footer={<></>}
        >
          {selectedRowIndex !== null && (
            <div>
              <InvestigationModal
                data={{
                  ...selectedRowIndex,
                  Type_ID: selectedRowIndex?.CentreID,
                  AppointedDate: moment().format("YYYY-MM-DD"),

                  ItemDisplayName: selectedRowIndex?.subcategoryName
                }}
                typePage="OPDRadiologyConfirmation"
                handleConfirmBox={handleConfirmBox}
                handleSetData={(e) => handleSetData(e, index)}
              />
            </div>
          )}
        </Modal>
      )}

      {confirmBoxvisible?.show && (
        <Confirm
          alertMessage={confirmBoxvisible?.alertMessage}
          lableMessage={confirmBoxvisible?.lableMessage}
          confirmBoxvisible={confirmBoxvisible}
        >
          {confirmBoxvisible?.chidren}
        </Confirm>
      )}
    </>
  );
};

export default RadiologyConfirmationTable;
