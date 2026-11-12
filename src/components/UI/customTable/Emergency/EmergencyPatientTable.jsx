import React, { useEffect, useState } from "react";
import Tables from "../index";
import { useTranslation } from "react-i18next";
import SlideScreen from "../../../front-office/SlideScreen";
import SeeMoreSlideScreen from "../../SeeMoreSlideScreen";
import { TempRoomOut } from "../../../SvgIcons";
import EmergencySeeMoreList from "../../../commonComponents/EmergencySeeMoreList";
import { BindFrameMenuByRoleID } from "../../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
const index = ({ tbody, setOpenPageModal, ReleaseForIPD, EmergencyPatientSearch }) => {

    const [bodyData, setBodyData] = useState([])
    const [visible, setVisible] = useState(false);
    const [seeMore, setSeeMore] = useState([]);
    // const [BindFrameMenuByRoleIDS, setBindFrameMenuByRoleIDS] = useState([])
    const dispatch = useDispatch()
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
    const { BindFrameMenuByRoleIDS } = useSelector((state) => state?.CommonSlice);

    const [t] = useTranslation();
    const thead = [
        { width: "5%", name: t("Select"), textAlign: "center" },
        // { width: "1%", name: t("EmergencyModule.SNo") },
        t("TriagingCode"),
        t("InDateTime"),
        t("UHID"),
        t("EmergencyNo"),
        t("PatientName"),
        t("AgeSex"),
        t("Doctor"),
        t("Panel"),
        { width: "1%", name: t("ReleaseForIPD") },
    ]



    // console.log("getListBindMenugetListBindMenu",ListBindMenu)

    useEffect(() => {
        dispatch(
            BindFrameMenuByRoleID({
                frameName: "Emergency",
            })
        );
    }, [])



    const hanleclickTemp = (ele, index) => {
        setOpenPageModal({
            isShow: true,
            component: <h3 className="text-center"> <strong style={{ color: "red" }}>{t("Do You Want To Release Patient For IPD ?")} </strong> </h3>,
            size: "20vw",
            Header: t("Alert"),
            modalData: ele,
            handleAPI: ReleaseForIPD,
            buttonName: t("Release")
        })
    }


    useEffect(() => {
        let data = tbody?.map((ele, index) => ({
            actions: (
                <>
                <EmergencySeeMoreList
                    ModalComponent={ModalComponent}
                    setSeeMore={setSeeMore}
                    data={ele}
                    setVisible={() => {
                        EmergencyPatientSearch()
                        setVisible(false);
                    }}
                    handleBindFrameMenu={BindFrameMenuByRoleIDS}
                    isShowPatient={true}
                />
                </>
            ),
            // SrNo: index + 1,
            UHID: <div style={{ background: ele?.ColorCode, padding: "5px" }}> {ele?.CodeType} </div>,
            
            InDateTime: ele?.InDateTime,
            PatientID: ele?.PatientID,
            EmergencyNo: ele?.EmergencyNo,
            Name: ele?.Name,
            AgeSex: ele?.AgeSex,
            Doctor: ele?.Doctor,
            // VisitType: ele?.VisitType,
            Panel: ele?.Panel,
            Action: ele?.Status !== "RFI" && <span onClick={() => { hanleclickTemp(ele, index) }}> <TempRoomOut /></span>
        }))
        setBodyData(data)
    }, [tbody])

    const handleChangeComponent = (e) => {
        ModalComponent(e?.label, e?.component);
    };

    const handleClassOnRow = (val, name) => {
        let data = tbody?.find((item) => { return item?.PatientID === val?.UHID })
        if (data?.Status === "Call" && name === "Patient Name") {
            return "blink-text text-danger"
        }
    }

    const getRowClass = (val, index) => {
        let data = tbody[index]
        if (data?.Status === "IN") {
            return "statusEmergency"
        }
        if (data?.Status === "OUT") {
            return "statusIsPaid"
        }
        if (data?.Status === "RFI") {
            return "statusDocOut"
        }
        if (data?.Status === "STI") {
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
