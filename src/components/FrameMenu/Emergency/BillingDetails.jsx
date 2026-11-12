import React, { useEffect, useState } from 'react'
import Heading from '../../UI/Heading';
import EMGSevices from './EMGSevices';
import { DiscountSVG, RateSVG } from '../../SvgIcons';
import { Tooltip } from 'primereact/tooltip';
import SlideScreen from '../../front-office/SlideScreen';
import Modal from '../../modalComponent/Modal';
import RateChange from '../../modalComponent/Utils/patientBillingModal/RateChange';
import BillingDetailsTable from '../../UI/customTable/Emergency/BillingDetailsTable';
import { getEmergencyBillItemDetails, getEmergencyPatientDetailsAPI } from '../../../networkServices/Emergency';
import Discountchange from '../../modalComponent/Utils/patientBillingModal/Discountchange';
import { GetAllAuthorization, GetBindDepartment, PatientBillingAllTabSave } from '../../../networkServices/BillingsApi';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import { notify } from '../../../utils/utils';
import { useTranslation } from 'react-i18next';


export default function BillingDetails({ data }) {
    const [billDetailList, setBillDetailList] = useState([]);
    const [department, setDepartment] = useState([]);

    const [t] = useTranslation()
    const ip = useLocalStorage("ip", "get");
    const [patientDetail, setPatientDetail] = useState(data)

    const [slideScreenState, setSlideScreenState] = useState({
        name: "",
        component: null,
    });
    const [modalState, setModalState] = useState({
        show: false,
        name: null,
        component: null,
        size: null,
    });
    const getBillingDetailListApi = async () => {
        let apiResp = await getEmergencyBillItemDetails(data?.LTnxNo);
        if (apiResp?.success) {
            let modifyData = apiResp?.data?.map((val) => {
                val.isChecked = false
                return val
            })
            setBillDetailList(modifyData)
        } else {
            setBillDetailList([])
        }
    }
    const iconElements = [
        {
            Component: RateSVG,
            tooltipText: t("Set Rate"),
            onClick: () =>
                handleModalState(
                    true,
                    t("Set Rate"),
                    <RateChange
                        handlePatientBillingAllTabSave={handlePatientBillingAllTabSave}
                    />,
                    "25vw",
                    <></>
                ),
        },
        {
            Component: DiscountSVG,
            tooltipText: t("Set Discount"),
            onClick: () =>
                handleModalState(
                    true,
                    t("Set Discount"),
                    <Discountchange
                        handlePatientBillingAllTabSave={handlePatientBillingAllTabSave}
                    />,
                    "25vw",
                    <></>
                ),
        },

    ];
    const handleModalState = (show, name, component, size, footer) => {
        setModalState({
            show: show,
            name: name,
            component: component,
            size: size,
            footer: footer,
        });
    };

    const getEmergencyPatientDetails = async () => {

        let apiResp = await getEmergencyPatientDetailsAPI(data?.EmergencyNo)
        if (apiResp?.success) {
            setPatientDetail((val) => ({ ...val, ...apiResp?.data }))
        }
    }

    useEffect(() => {
        getEmergencyPatientDetails()
    }, [])


    const GetBindAuthorization = async () => {
        try {
            const datas = await GetAllAuthorization();
            return datas?.data;
        } catch (error) {
            console.log(error);
        }
    };

    const GetBindBillDepartment = async () => {
        const transID = data?.transactionID;
        try {
            const response = await GetBindAuthorization();
            const datas = await GetBindDepartment(transID, response[0]?.CanViewRate);
            setDepartment(datas?.data);
            setAuthorization(response[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePatientBillingAllTabSave = async (payload) => {
        store.dispatch(setLoading(true));
        try {
            payload.ipAddress = String(ip);
            const checkedData = [];

            billDetailList?.map((val, index) => {
                if (val?.isChecked) {
                    checkedData.push(`'${val?.LedgerTnxID}'`)
                }
            })

            // for (let i = 0; i < billDetailList?.length; i++) {
            //     const { subRow } = billDetailList[i];
            //         if (subRow?.subRowList[j]?.["isChecked"] === true) {
            //             checkedData.push(`'${subRow?.subRowList[j]?.["LtNo"]}'`);

            //     }
            // }
            payload.ltdNo = checkedData.join(",");
            // debugger
            const response = await PatientBillingAllTabSave(payload);
            notify(response?.message, response?.success ? "success" : "error");
            if (response?.success) {
                handleModalState(false, null, null, null, <></>)
                getBillingDetailListApi()
            }
        } catch (error) {
            console.log(error, "Something Went Wrong");
        } finally {
            store.dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        getBillingDetailListApi()
    }, [slideScreenState?.show])


    const handleRowChange = (e, index) => {
        const { name, checked } = e.target;
        const data = JSON.parse(JSON.stringify(billDetailList));
        data[index][name] = checked;
        setBillDetailList(data);
    };
    const handleSlideScreen = () => {
        setSlideScreenState({
            name: "Add Services Details",
            show: true,
            component: (
                <div className="card patient_registration border mt-2">
                    <div className="row p-2">
                        <div className="col-sm-12">
                            <EMGSevices
                                data={patientDetail}
                                setSlideScreenState={setSlideScreenState}
                            />
                        </div>
                    </div>
                </div>
            ),
        });
    };
    return (
        <>

            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading
                        title={<div>{t("Department Details")}</div>}
                        secondTitle={
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={handleSlideScreen}
                            >
                                {t("Add Services")}
                            </button>
                        }
                    />
                    <div className="d-flex align-items-center justify-content-end p-1">
                        {iconElements.map((item, index) => (
                            <div key={index} style={{ display: "inline-block" }}>
                                <Tooltip
                                    target={`#icon-${index}`}
                                    content={item.tooltipText}
                                    event="hover"
                                    position="top"
                                />
                                <span
                                    id={`icon-${index}`}
                                    onClick={item.onClick ? item.onClick : null}
                                >
                                    <item.Component />
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="row p-2">
                        <div className="col-12">

                            <BillingDetailsTable tbody={billDetailList} handleRowChange={handleRowChange} setBillDetailList={setBillDetailList} handleModalState={handleModalState} GetBindBillDepartment={getBillingDetailListApi} />
                        </div>
                    </div>
                </div>
            </div>

            <SlideScreen
                visible={slideScreenState?.show}
                setVisible={() =>
                    setSlideScreenState({
                        show: false,
                        name: "",
                        component: null,
                    })
                }
                Header={slideScreenState?.name}
            >
                {slideScreenState?.component}
            </SlideScreen>

            <Modal
                Header={modalState?.name}
                modalWidth={modalState?.size}
                visible={modalState?.show}
                setVisible={() => {
                    handleModalState(false, null, null, null, <></>);
                }}
                footer={modalState?.footer}
            >
                {modalState?.component}
            </Modal>

        </>
    )
}
