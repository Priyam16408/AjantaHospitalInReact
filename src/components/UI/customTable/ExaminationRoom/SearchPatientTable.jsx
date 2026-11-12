import React, { useEffect, useState } from "react";
import Tables from "../../../UI/customTable/index";
import { useTranslation } from "react-i18next";
import SlideScreen from "../../../front-office/SlideScreen";

import SeeMoreSlideScreen from "../../SeeMoreSlideScreen";
import PatientDetailCard from "../../../commonComponents/PatientDetailCard";
import DocVitalSignPatientDetailCard from "../../../commonComponents/DocVitalSignPatientDetailCard";
import { getListBindMenu } from "../../../../networkServices/DoctorApi";
import { TempRoomOut } from "../../../SvgIcons";
import { UpdateTemperatureRoomOut } from "../../../../networkServices/examinationApi";
import { notify } from "../../../../utils/utils";
const index = ({ tbody, handleClickPatientWise, setOpenPageModal, handleAPITempRoomOut }) => {

    const [bodyData, setBodyData] = useState([])
    const [visible, setVisible] = useState(false);
    const [seeMore, setSeeMore] = useState([]);
    const [BindFrameMenuByRoleIDS, setBindFrameMenuByRoleIDS] = useState([])
    const [renderComponent, setRenderComponent] = useState({
        name: "",
        component: null,
    });
    const ModalComponent = (name, component) => {
        setVisible(true);
        setRenderComponent({
            name: name,
            component: component,
        });
    };
    const [t] = useTranslation();
    const thead = [
        { width: "5%", name: t("Select"), textAlign: "center" },
        { width: "1%", name: t("SNO") },
        t("UHID"),
        t("PatientName"),
        t("Contact"),
        t("Sex"),
        t("AppointmentOn"),
        t("Doctor"),
        t("Panel"),
        t("VisitType"),
        { width: "1%", name: t("TepRoomOut") },
    ]



    // console.log("getListBindMenugetListBindMenu",ListBindMenu)

    const bindFrameMenuByRoleIDS = async (TID) => {
        let apiResp = await getListBindMenu(TID)
        setBindFrameMenuByRoleIDS(apiResp)
        if (apiResp?.success) {
        } else {
            return []
        }

    }

    const hanleclickTemp = (ele, index) => {
        setOpenPageModal({
            isShow: true,
            component: <h3 className="text-center"> <strong style={{ color: "red" }}>{t("TepRoomOutContent")} </strong> </h3>,
            size: "20vw",
            Header: t("TepRoomOutHeading"),
            modalData: ele,
            handleAPI: handleAPITempRoomOut,
            buttonName: t("OUT")
        })
    }

    useEffect(() => {
        let data = tbody?.map((ele, index) => ({
            actions: (
                <DocVitalSignPatientDetailCard
                    ModalComponent={ModalComponent}
                    setSeeMore={setSeeMore}
                    data={ele}
                    handleBindFrameMenu={bindFrameMenuByRoleIDS}
                    handleSubmit={handleClickPatientWise}
                    keyName={"menuName"}
                    BindFrameMenuByList={BindFrameMenuByRoleIDS}
                    isShowPatient={true}
                />
            ),
            SrNo: index + 1,
            UHID: ele?.MRNo,
            Pname: ele?.Pname,
            ContactNo: ele?.ContactNo,
            Sex: ele?.Sex,
            AppointmentDate: ele?.AppointmentDate,
            DName: ele?.DName,
            PanelName: ele?.PanelName,
            VisitType: ele?.VisitType,
            TempRoomOut: ele?.IsCompleated === "Pending" && ele?.IsPaid === 1 && <span onClick={() => { hanleclickTemp(ele, index) }}><TempRoomOut /></span>
        }))
        setBodyData(data)
    }, [tbody])

    const handleChangeComponent = (e) => {
        ModalComponent(e?.label, e?.component);
    };

    const handleClassOnRow = (val,name) => {
        let data = tbody?.find((item) => { return item?.PatientID === val?.UHID })
        if (data?.Status === "Call" && name==="Patient Name") {
            return "blink-text text-danger"
        }
    }

    const getRowClass = (val) => {
        let data = tbody?.find((item) => { return item?.PatientID === val?.UHID })
        
        if (data?.IsEmergency === "1") {
            return "statusEmergency"
        }
        if (val?.IsPaid === 0) {
            return "statusIsPaid"
        }
        if (val?.Status === "Out") {
            return "statusDocOut"
        }
        if (val?.Status === "IN") {
            return "statusDoCIN"
        }
    };

    return (
        <>
            <Tables
                thead={thead}
                tbody={bodyData}
                getRowClass={getRowClass}
                style={{ height: "60vh" }}
                handleClassOnRow={handleClassOnRow}
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
    );
};

export default index;
