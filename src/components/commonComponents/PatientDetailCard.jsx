import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BillingSeeMoreList from "./BillingSeeMoreList";
import SeeMoreSlideScreen from "../UI/SeeMoreSlideScreen";
import PatientReceivedConfirmationModal from "../modalComponent/Utils/PatientReceivedConfirmationModal";
import Button from "../formComponent/Button";
import Modal from "../modalComponent/Modal";
import { IsReceivedPatient } from "../../networkServices/BillingsApi";
import { notify } from "../../utils/utils";

function PatientDetailCard({ ModalComponent, setSeeMore, data, handleSubmit }) {
  const [t] = useTranslation();

  const { BindFrameMenuByRoleIDS } = useSelector((state) => state?.CommonSlice);
  console.log("BindFrameMenuByRoleIDS", BindFrameMenuByRoleIDS)
  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });

  // Handle patient received logic
  const handleisPatientReceived = async () => {
    const response = await IsReceivedPatient({
      tid: data?.transactionID,
      isReceived: 1,
    });
    if (response.success) {
      setModalHandlerState({ ...modalHandlerState, show: false });
      handleSubmit();
      notify(response?.message, "success");
    } else {
      console.log("Error: ", response.errorMessage);
    }
  };

  const handleModalState = () => {
    setModalHandlerState({
      show: true,
      header: t("Alert!!!"),
      size: "20vw",
      component: <PatientReceivedConfirmationModal />,
      footer: (
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <Button
              name={t("Yes")}
              className={"btn btn-sm btn-primary mx-1"}
              handleClick={handleisPatientReceived}
            />
          </div>
        </div>
      ),
    });
  };

  const handleComponentRender = async (data, items) => {
    // debugger
    const componentData = BillingSeeMoreList([items], data);
    ModalComponent(componentData[0]?.name, componentData[0]?.component);
    const forsetSeeMore = BillingSeeMoreList(BindFrameMenuByRoleIDS, data);
    setSeeMore(forsetSeeMore);
  };

  const handleBindFrameMenuByRoleIDS = useCallback(
    (dataBind) => {
      return dataBind?.map((items, _) => {
        return {
          ...items,
          name: items?.FileName,
        };
      });
    },
    [BindFrameMenuByRoleIDS]
  );

  return (
    <>
      <div style={{ position: "relative" }}>
        {BindFrameMenuByRoleIDS?.length > 0 &&
          (Number(data?.isPatientReceived) === 0 ? (
            <div
              onClick={handleModalState}
              className="header p-1"
              style={{ cursor: "pointer" }}
            >
              <svg
                width={17}
                height={17}
                viewBox="0 0 64 64"
                fill={"black"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="12"
                  y="8"
                  width="40"
                  height="48"
                  rx="4"
                  ry="4"
                  fill="#fff"
                  stroke="#000"
                  strokeWidth="2"
                />
                <rect
                  x="24"
                  y="4"
                  width="16"
                  height="8"
                  rx="2"
                  ry="2"
                  fill="#f2c744"
                  stroke="#000"
                  strokeWidth="2"
                />
                <circle cx="18" cy="22" r="3" fill="#ff5f5f" />
                <rect x="26" y="20" width="20" height="2" rx="1" fill="#000" />
                <circle cx="18" cy="32" r="3" fill="#ff995f" />
                <rect x="26" y="30" width="20" height="2" rx="1" fill="#000" />
                <circle cx="18" cy="42" r="3" fill="#ffcf5f" />
                <rect x="26" y="40" width="20" height="2" rx="1" fill="#000" />
              </svg>
            </div>
          ) : (
            <SeeMoreSlideScreen
              seeMore={handleBindFrameMenuByRoleIDS(BindFrameMenuByRoleIDS)}
              handleChangeComponent={(item) =>
                handleComponentRender(data, item)
              }
            />
          ))}

        {modalHandlerState?.show && (
          <Modal
            visible={modalHandlerState?.show}
            setVisible={() =>
              setModalHandlerState({
                show: false,
                component: null,
                size: null,
              })
            }
            modalWidth={modalHandlerState?.size}
            Header={modalHandlerState?.header}
            footer={modalHandlerState?.footer}
          >
            {modalHandlerState?.component}
          </Modal>
        )}
      </div>
    </>
  );
}

export default PatientDetailCard;
