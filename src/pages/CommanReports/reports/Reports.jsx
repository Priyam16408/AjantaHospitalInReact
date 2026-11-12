import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading';
import CommonReports from '../../../components/commonComponents/CommonReports';
import { getCollectionReportApi } from '../../../networkServices/commonReportsApi';
import { notify } from '../../../utils/ustil2';
import { useSelector } from "react-redux";
import Modal from '../../../components/modalComponent/Modal';
import TimePicker from '../../../components/formComponent/TimePicker';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
const Reports = () => {
    const [t] = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [reportItems, setReportsItems] = useState(null);
    const [values, setValues] = useState({
        fromTime: "",
        toTime: "",
    })
    const {
        GetEmployeeWiseCenter,
        GetBindAllDoctorConfirmationData,
        GetDepartmentList,
        GetBindReferDoctorList,
    } = useSelector((state) => state?.CommonSlice);
    const enabledFields = reportItems?.filter((item) => item.value === true);


    const getCommonReport = async () => {
        try {
            const response = await getCollectionReportApi()
            if (response?.success) {
                notify(response?.message, "success")
                setReportsItems(response?.data)
            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            notify(response?.message, "error");
        }
    }
    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues({ ...values, [name]: selectedOptions });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }
    const handleSelect=()=>{
        
    }

    const renderComponents = (item) => {
        console.log(item);

        switch (item.key) {
            case "Centre":
                return (
                    <MultiSelectComp
                        placeholderName={t("Centre")}
                        id={"Centre"}
                        name="Centre"
                        value={values?.Centre}
                        requiredClassName={"required-fields"}
                        handleChange={handleMultiSelectChange}
                        dynamicOptions={GetEmployeeWiseCenter?.map((item) => ({
                            name: item?.CentreName,
                            code: item?.CentreID,
                        }))}
                        searchable={true}
                    // respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />

                );
            case "FromTime":
                return (
                    <TimePicker
                        lable={t("Time")}
                        // respclass="col-xl-1 col-md-4 col-sm-4 col-12"
                        id="fromtime"
                        name="fromtime"
                        value={moment(values?.fromtime).toDate()}
                        handleChange={handleChange}
                        className={"required-fields"}
                    />
                )
            case "ToTime":
                return (
                    <TimePicker
                        lable={t("Time")}
                        // respclass="col-xl-1 col-md-4 col-sm-4 col-12"
                        id="totime"
                        name="totime"
                        value={moment(values?.totime).toDate()}
                        handleChange={handleChange}
                        className={"required-fields"}
                    />
                )
            case "ReportType":
                return (
                    <ReactSelect
                        placeholderName={t("report Type")}
                        searchable={true}
                        // respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="reportType"
                        name="reportType"
                        removeIsClearable={true}
                        dynamicOptions={[
                            { label: "Summary Report", value: "0" },
                            { label: "Detail Report", value: "1" }
                        ]}
                        handleChange={handleSelect}
                        value={values?.reportType}
                    />
                )
            default:
                return (<></>)
        }
    }
    useEffect(() => {
        getCommonReport()
    }, [])

    console.log(reportItems);

    return (
        <div className='card md:mt-2'>
            <Heading title="Common Reports" isBreadcrumb={false}
                secondTitle={
                    <div className='mt-1' style={{ cursor: "pointer" }}>
                        <i
                            onClick={() => setShowModal(true)}
                            className="pi pi-spins pi-cog"
                            aria-hidden="true"
                        ></i>
                    </div>
                }
            />
            <div className="row">
                {enabledFields?.map((item) => (
                    <div
                        key={item.key}
                        className="col-xl-2 col-md-4 col-sm-4 col-12 mt-2 p-2"
                    >
                        {renderComponents(item)}
                    </div>
                ))}
            </div>

            {showModal && (
                <Modal
                    visible={showModal}
                    setVisible={() => setShowModal(false)}
                    modalWidth="40vw"

                    Header={"Common Reports"}
                    buttonType={"button"}
                    footer={<></>}
                >
                    <CommonReports
                        fields={reportItems}
                        onClose={() => getCommonReport()}
                    // reload={loadFields}
                    />
                </Modal>
            )}
        </div>
    )
}

export default Reports;