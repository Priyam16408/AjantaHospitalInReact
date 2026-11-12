import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '../../../components/UI/Heading';
import Input from '../../../components/formComponent/Input';
import DatePicker from '../../../components/formComponent/DatePicker';
import { requestRoomDetailApi, saveRequestRoomDetailApi } from '../../../networkServices/BillingsApi';
import moment from 'moment';
import { notify } from '../../../utils/ustil2';
import Tables from '../../../components/UI/customTable';
import { Checkbox } from 'primereact/checkbox';
import { useWindowSize } from '../../../utils/hooks/useWindowSize';

const RequestRoomShift = () => {
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const isMobile = width <= 800;
    const [allSelected, setAllSelected] = useState(false);
    const thead = [
        { name: t("S.No."), width: "1%" },
        { name: t("Requst Date"), width: "10%" },
        { name: t("IPD.NO"), width: "10%" },
        { name: t("Transaction ID"), width: "10%" },
        { name: t("Patient ID"), width: "10%" },
        { name: t("Patient Name"), width: "10%" },
        { name: t("Previous Room Name"), width: "10%" },
        { name: t("Requst By"), width: "10%" },
        { name: t("Request Room Name"), width: "10%" },
        {
            width: "1%",
            name: isMobile ? (
                t("check")
            ) : (
                <Checkbox
                    checked={allSelected}
                    onChange={(e) => {
                        handleChangeCheckbox(e);
                    }}
                />
            ),
        },
    ]
    const [values, setValues] = useState({

    })
    const [tableData, setTableData] = useState([]);
    const { VITE_DATE_FORMAT } = import.meta.env;
    const handleInputChange = (e, label) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [label]: value }));
    };

    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
    };

    const handleSearch = async () => {
        const payload = {
            fromDate: values?.IPDNo ? "" : moment(values?.fromDate).format("YYYY-MM-DD"),
            ToDate: values?.IPDNo ? "" : moment(values?.toDate).format("YYYY-MM-DD"),
            ipdNo: values?.IPDNo ? values?.IPDNo : ""
        }
        try {
            const response = await requestRoomDetailApi(payload)
            if (response.success) {
                setTableData(response?.data)
                notify(response?.message, "success")
            } else {
                setTableData([])
                notify(response?.message, "error");
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }

    const handleSaveRequestRoomDetail = async () => {
        if (tableData?.filter((val) => val?.isChecked)?.length === 0) {
            notify("Please select at least one row.", "warn");
            return;
        }
        debugger
        try {
            const data = tableData.filter((val) => val.isChecked);
            const payload = data?.map((val) => ({
                id: Number(val?.ID ?? 0),
                transactionID: Number(val?.TransactionID ?? 0)
            }));

            const resp = await saveRequestRoomDetailApi(payload);
            if (resp?.success) {
                notify(resp?.message, "success")
                handleSearch()
            } else {
                notify(resp?.message, "error")
            }

        } catch (error) {
            notify(error?.message, "error")
        }
    }


    const handleChangeCheckbox = (e, item = null) => {
        const { checked } = e.target;
        if (!item) {
            const updatedList = tableData.map(i => {
                if (i.STATUS !== 'Approved') {
                    return { ...i, isChecked: checked };
                }
                return i;
            });
            setTableData(updatedList);
            setAllSelected(checked)
        } else {
            const updatedList = tableData?.map(i => i.TransactionID === item.TransactionID ? { ...i, isChecked: checked } : i);
            setTableData(updatedList);
            setAllSelected(updatedList?.every(i => i?.STATUS !== 'Approved' ? true : false));
        }

    };

    return (
        <div className="card border">
            <Heading isBreadcrumb={true} isSlideScreen={false} />
            <div>
                <div className='d-md-flex m-sm-2 m-1 justify-content-between align-items-center pt-2'>
                    <div className="row d-flex w-100">
                        <Input
                            className={"form-control"}
                            lable={t("IPDNo")}
                            placeholder=" "
                            id="IPDNo"
                            name="IPDNo"
                            onChange={(e) => handleInputChange(e, "IPDNo")}
                            value={values?.IPDNo}
                            required={true}
                            respclass="col-xl-2 col-md-2 col-sm-3 col-12"
                        />

                        <DatePicker
                            className="custom-calendar"
                            id="fromDate"
                            name="fromDate"
                            lable={t("FromDate")}
                            value={values?.fromDate || new Date()}
                            handleChange={handleChange}
                            placeholder={VITE_DATE_FORMAT}
                            respclass={"col-xl-2 col-md-3 col-sm-3 col-12"}
                        />

                        <DatePicker
                            className="custom-calendar"
                            id="toDate"
                            name="toDate"
                            value={values?.toDate || new Date()}
                            handleChange={handleChange}
                            lable={t("ToDate")}
                            placeholder={VITE_DATE_FORMAT}
                            respclass={"col-xl-2 col-md-3 col-sm-3 col-12"}
                        />

                        <button
                            onClick={handleSearch}
                            className="btn btn-sm btn-success ms-auto ml-2"
                        >
                            {t("Search")}
                        </button>
                    </div>
                    {tableData.length > 0 &&
                        <div className="text-right">
                            <button className="btn btn-primary btn-sm px-4 ml-1" onClick={handleSaveRequestRoomDetail}>
                                {t("Shift")}
                            </button>
                        </div>

                    }
                </div>
                {tableData.length > 0 &&
                    <>
                        <Heading title={t("Request Room Shift List")} isBreadcrumb={false} />
                        <Tables
                            style={{ maxHeight: "45vh" }}
                            thead={thead}
                            tbody={tableData.map((val, ind) => ({
                                id: ind + 1,
                                RequestDate: val?.RequestDate ? val?.RequestDate : "-",
                                IPDNO: val?.IPDNo,
                                TransactionID: val?.TransactionID,
                                PatientID: val?.PatientID,
                                PatientName: val?.PatientName,
                                PreviousRoomName: val?.PreviousRoomName,
                                RequstBy: val?.RequstBy,
                                RequestRoomName: val?.RequestRoomName,

                                Actions: (
                                    <div>
                                        <Checkbox
                                            className='mt-1'
                                            onChange={(e) => {
                                                handleChangeCheckbox(e, val);
                                            }}
                                            disabled={val?.STATUS === 'Approved'}
                                            checked={val?.isChecked || false}
                                        />

                                    </div>
                                ),
                            }))}
                            isSearch={true}
                        />


                    </>
                }
            </div>
        </div>
    )
}

export default RequestRoomShift;