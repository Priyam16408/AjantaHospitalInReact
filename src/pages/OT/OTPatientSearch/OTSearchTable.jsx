import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BindFrameMenuByRoleID } from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";

import Tables from "../../../components/UI/customTable";
import SlideScreen from "../../../components/front-office/SlideScreen";
import SeeMoreSlideScreen from "../../../components/UI/SeeMoreSlideScreen";
import OTSeeMoreList from "../OTSeeMoreList";
import { PageIconSVG } from "../../../components/SvgIcons";
import Modal from "../../../components/modalComponent/Modal";
import BookingConfirmationModal from "./BookingConfirmationModal";
import { handleReceivePatientAPI, SaveBookingConfirmation } from "../../../networkServices/OT/otAPI";
import { notify } from "../../../utils/utils";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const OTSearchTable = (props) => {
  const isMobile = window.innerWidth <= 768;
  const { THEAD, tbody, handleSearch, values } = props;
  const [modalData, setModalData] = useState({ visible: false, modalData: "" });
  const [t] = useTranslation();
  const [visible, setVisible] = useState(false);
  const [seeMore, setSeeMore] = useState([]);
  const dispatch = useDispatch();
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  // console.log(renderComponent);

  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        BindFrameMenuByRoleID({
          frameName: "IPD",
        })
      );
    };
    fetchData();
  }, [dispatch]);

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };

  const getRowClass = (val,index) => {
    const data = tbody[index];
    if(data?.IsPatientReceived === 1){
      return "color-indicator-1-bg";
    }else if (data?.IPDNo) {
      return "color-indicator-2-bg";
    }else{
      return "color-indicator-3-bg";
    }
  };

  const handleSaveBookingCOnfirmation = async (data) => {
    if (!data?.MapIPDPatient?.value) {
      notify("Please Map IPD Patient", "error");
      return 0;
    }
    debugger
    const { PatientID, PatientName, Age, Gender, Address, Phone, TransactionID, OTBookingID } = data
    let payload = {
      patientID: PatientID ? PatientID : "",
      patientName: PatientName ? PatientName : "",
      age: Age ? Age : "",
      gender: Gender ? Gender : "",
      address: Address ? Address : "",
      contactNo: Phone ? Phone : "",
      transactionID: TransactionID ? TransactionID : "",
      bookingID: OTBookingID ? OTBookingID : ""
    }
    let apiResp = await SaveBookingConfirmation(payload);
    if (apiResp?.success) {
      notify(apiResp?.message, "success");
      handleSearch()
      setModalData({ visible: false });
    } else {
      notify(apiResp?.message, "error");
    }

  }

  const handleOpenModal = (data) => {
    setModalData({
      visible: true,
      size: "60vw",
      modalData: data,
      label: t("Booking Confirmation Details"),
      CallAPI: handleSaveBookingCOnfirmation,
      Component: <BookingConfirmationModal data={data} setModalData={setModalData} />,
    });
  };

  const handleReceivePatient = async (data) => {
   
    const payload = {
      "iPAdress": useLocalStorage("ip", "get"),
      "otBookingID": String(data?.OTBookingID?data?.OTBookingID:"")
    }
    let apiResp = await handleReceivePatientAPI(payload);
    if (apiResp?.success) {
      notify(apiResp?.message, "success");
      handleSearch()
      setModalData({ visible: false });
    }
  }
  const handleOpenModalReceivePatient = (data) => {
    setModalData({
      visible: true,
      size: "20vw",
      modalData: data,
      label: t("Booking Confirmation Details"),
      CallAPI: handleReceivePatient,
      Component: <p className="text-center text-bold">{t("Do You Want To Receive Patient ?")}</p>,
    });
  };

  return (
    <>
      {tbody?.length > 0 && (
        <>
          <Tables
            thead={THEAD}
            tbody={tbody?.map((item, index) => ({
              SNo: index + 1,
              Select: (
                <>
                  {item?.IsPatientReceived === 1 ?
                    <OTSeeMoreList
                      ModalComponent={ModalComponent}
                      setSeeMore={setSeeMore}
                      data={item}
                      handleBindFrameMenu={[
                        {
                          Description: "Create OT TAT",
                          FileName: "Create OT TAT",
                          FrameName: "Create OT TAT",
                          URL: "CreateOTTAT",
                          header: true,
                        },
                        {
                          Description: "Flow Sheet",
                          FileName: "Flow Sheet",
                          FrameName: "Flow Sheet",
                          URL: "FlowSheet",
                          header: true,
                        },
                        {
                          Description: "OT Images",
                          FileName: "OT Images",
                          FrameName: "OT Images",
                          URL: "UploadOtImages",
                          header: true,
                        },
                        {
                          Description: "OT Notes",
                          FileName: "OT Notes",
                          FrameName: "OT Notes",
                          URL: "OtNotes",
                          header: true,
                        },
                        {
                          Description: "OT Procedure Template",
                          FileName: "OT Procedure Template",
                          FrameName: "OT Procedure Template",
                          URL: "OtProcedureTemplate",
                          header: true,
                        },

                        {
                          Description: "OT TAT Analysis",
                          FileName: "OT TAT Analysis",
                          FrameName: "OT TAT Analysis",
                          URL: "OTtatAnalysis",
                          header: true,
                        },
                        {
                          Description: "Anesthesia Notes",
                          FileName: "Anesthesia Notes",
                          FrameName: "Anesthesia Notes",
                          URL: "AnesthesiaNotes",
                          header: true,
                        },
                        {
                          Description: "Post Anesthesia Orders/Monitoring",
                          FileName: "Post Anesthesia Orders/Monitoring",
                          FrameName: "Post Anesthesia Orders/Monitoring",
                          URL: "PostAnesthesiaOrders",
                          header: true,
                        },
                        {
                          Description: "Count Sheet",
                          FileName: "Count Sheet",
                          FrameName: "Count Sheet",
                          URL: "CountSheet",
                          header: true,
                        },
                        {
                          Description: "Surgery Safety Check List",
                          FileName: "Surgery Safety Check List",
                          FrameName: "Surgery Safety Check List",
                          URL: "SurgerySafetyCheckList",
                          header: true,
                        },
                      ]}
                      isShowPatient={true}
                    /> :
                    item?.IPDNo ?
                      <span className="ml-1" onClick={() => handleOpenModalReceivePatient(item)}> <PageIconSVG /> </span> :
                      <span className="ml-1" onClick={() => handleOpenModal(item)}> <PageIconSVG /> </span>
                  }
                </>
              ),
              PatientID: item?.PatientID,
              IPDNo: item?.IPDNo,
              PName: item?.PName,
              ageSex: item?.AgeSex,
              OTNumber: item?.OTNumber,
              OTName: item?.OTName,
              DoctorName: item?.DoctorName,
              SurgeryDate: item?.SurgeryDate,
              SurgerySortTiming: item?.SurgerySortTiming,
              ConfirmedDate: item?.ConfirmedDate,
            }))}
            // tableHeight={"scrollView"}
            style={{ maxHeight: "60vh" }}
            getRowClass={getRowClass}
            isSearch={true}
          />
          <SlideScreen
            visible={visible}
            setVisible={() => {
              setVisible(false);
              setRenderComponent({
                name: null,
                component: null,
              });
            }}
            Header={
              <SeeMoreSlideScreen
                name={renderComponent?.name}
                seeMore={seeMore}
                handleChangeComponent={handleChangeComponent}
              />
            }
          >
            {renderComponent?.component}
          </SlideScreen>
        </>
      )}

      <Modal
        visible={modalData?.visible}
        setVisible={() => {
          setModalData((val) => ({ ...val, visible: false }));
        }}
        modalData={modalData?.modalData}
        modalWidth={modalData?.size}
        Header={modalData?.label}
        buttonType="button"
        buttonName={modalData?.buttonName}
        footer={modalData?.footer}
        handleAPI={modalData?.CallAPI}
      >
        {modalData?.Component}
      </Modal>
    </>
  );
};

export default OTSearchTable;
