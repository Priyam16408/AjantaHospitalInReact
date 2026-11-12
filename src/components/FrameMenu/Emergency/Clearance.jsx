import React, { useEffect, useState } from 'react';
import Heading from '../../UI/Heading';
import { useTranslation } from 'react-i18next';
import Modal from '../../modalComponent/Modal';
import EmergencyClearanceModal from '../../modalComponent/Utils/Emergency/EmergencyClearanceModal';
import { CheckClearanceAPI, SaveClearanceAPI } from '../../../networkServices/Emergency';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { notify } from '../../../utils/utils';
export default function Clearance({ data }) {
    
    const { t } = useTranslation();
    const [modalData, setModalData] = useState({});
    const [clearanceDetail, setClearanceDetail] = useState({ type: 0 });
    const handleModal = (label, width, Component = null, API, URL) => {
        setModalData({
            visible: true,
            width: width,
            label,
            Component,
            handleInsertAPI: API,
            URL: URL,
        });
    };
    const closeModal = () => {
        setModalData((prevData) => ({ ...prevData, visible: false }));
    };

    const CheckClearance = async (url, type) => {
        let apiResp = await CheckClearanceAPI(data?.TID, url)
        if (apiResp?.success) {
            setClearanceDetail((val) => ({ ...val, [url]: apiResp?.message }))
        } else {
            setClearanceDetail((val) => ({ ...val, type: type }))
        }
    }

    const handleCheckCLR = () => {
        CheckClearance("CheckBillingClearanceEMG", 3)
        CheckClearance("CheckNursingClearanceEMG", 2)
        CheckClearance("CheckDoctorClearanceEMG", 1)
    }

    useEffect(() => {
        handleCheckCLR()
    }, [])

    const handleInsertAPI = async (url) => {
        const userID = useLocalStorage("userData", "get")
        let payload = {
            id: userID?.employeeID,
            transactionID: String(data?.transactionID)
        }
        const apiResp = await SaveClearanceAPI(payload, url)
        if (apiResp?.success) {
            notify(apiResp?.message, "success")
            handleCheckCLR()
            closeModal()
        } else {
            notify(apiResp?.message, "error")
        }

    }

    return (
        <>
            <div className="card patient_registration border mt-2">
                {(clearanceDetail?.type === 1 || clearanceDetail?.CheckDoctorClearanceEMG) && <>
                    <Heading title="Doctor Clearance" />
                    <div className="row p-2 d-flex justify-content-center">
                        {clearanceDetail?.CheckDoctorClearanceEMG ?
                            <strong className='text-danger'>{clearanceDetail?.CheckDoctorClearanceEMG}</strong>
                            :
                            clearanceDetail?.type === 1 && <div className="col-sm-1">
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() =>
                                        handleModal(
                                            'Doctor Clearance',
                                            '20vw',
                                            <EmergencyClearanceModal name={"Do you want to clear patient from doctor department ?"} />,
                                            handleInsertAPI,
                                            "SaveDoctorClearanceEMG"
                                        )
                                    }
                                >
                                    Doctor Clearance
                                </button>
                            </div>

                        }
                    </div>
                </>
                }

                {(clearanceDetail?.type === 2 || clearanceDetail?.CheckNursingClearanceEMG) && <>
                    <Heading title="Nursing Clearance" />
                    <div className="row p-2 d-flex justify-content-center">
                        {clearanceDetail?.CheckNursingClearanceEMG ?

                            <strong className='text-danger'>{clearanceDetail?.CheckNursingClearanceEMG}</strong>

                            :
                            <div className="col-sm-1">
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() =>
                                        handleModal(
                                            'Nursing Clearance',
                                            '20vw',
                                            <EmergencyClearanceModal name={"Do you want to clear patient from Nursing department ?"} />,
                                            handleInsertAPI,
                                            "SaveNursingClearanceEMG"
                                        )
                                    }
                                >
                                    Nursing Clearance
                                </button>
                            </div>
                        }
                    </div>
                </>}

                {(clearanceDetail?.type === 3 || clearanceDetail?.CheckBillingClearanceEMG) && <>
                    <Heading title="Billing Clearance" />
                    <div className="row p-2 d-flex justify-content-center">
                        {clearanceDetail?.CheckBillingClearanceEMG ?

                            <strong className='text-danger'>{clearanceDetail?.CheckBillingClearanceEMG}</strong>

                            : <div className="col-sm-1">
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() =>
                                        handleModal(
                                            'Billing Clearance',
                                            '20vw',
                                            <EmergencyClearanceModal name={"Do you want to clear patient from billing department ?"} />,
                                            handleInsertAPI,
                                            "SaveBillingClearanceEMG"
                                        )
                                    }
                                >
                                    Billing Clearance
                                </button>
                            </div>}
                    </div>
                </>}

            </div>

            {modalData.visible && (
                <Modal
                    visible={modalData.visible}
                    setVisible={closeModal}
                    modalData={modalData?.URL}
                    modalWidth={modalData.width}
                    Header={t(modalData.label)}
                    buttonType="button"
                    buttonName="Yes"
                    handleAPI={modalData?.handleInsertAPI}
                >
                    {modalData.Component}
                </Modal>
            )}
        </>

    );
}
