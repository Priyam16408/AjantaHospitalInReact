import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../../components/formComponent/DatePicker';
import { dietRequisitionReportApi } from '../../../networkServices/DietApi';
import moment from 'moment';
import { notify } from '../../../utils/ustil2';
import { exportToExcel } from '../../../utils/exportLibrary';

const DietRequestReport = () => {
    const { t } = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [values, setValues] = useState({
        toDate: new Date(),
        fromDate: new Date()
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    };

    const ExceldataFormatter = (tableData) => {
        const HardCopy = JSON.parse(JSON.stringify(tableData));
        const modifiedResponseData = HardCopy?.map((ele, index) => {
            // delete ele?.TypeID;

            return { ...ele };
        });

        return modifiedResponseData;
    };

    const handleSearchReport = async () => {
        try {

            const payload = {
                fromDate: moment(values?.fromDate).format("DD-MMM-YYYY") || "",
                toDate: moment(values?.toDate).format("DD-MMM-YYYY") || "",
            }
            const response = await dietRequisitionReportApi(payload);
            if (response?.success) {
                exportToExcel(
                    ExceldataFormatter(response?.data),
                    "Diet Request Report",
                    "",
                    "Diet_Request_Report",
                    "Diet_Request_Report"
                );
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message);
        }

    }
    return (
        <div className="mt-2 card">
            <Heading isBreadcrumb={true} />
            <div className="row p-2">
                <DatePicker
                    className="custom-calendar"
                    id="fromDate"
                    name="fromDate"
                    lable={t("FromDate")}
                    placeholder={VITE_DATE_FORMAT}
                    respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    value={values?.fromDate ? values?.fromDate : new Date()}
                    maxDate={new Date()}
                    handleChange={handleChange}
                />

                <DatePicker
                    className="custom-calendar"
                    respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                    id="toDate"
                    name="toDate"
                    value={values?.toDate ? values?.toDate : new Date()}
                    handleChange={handleChange}
                    lable={t("ToDate")}
                    maxDate={new Date()}
                    placeholder={VITE_DATE_FORMAT}
                />
                <button className="btn btn-sm btn-success ml-2" type="button" onClick={handleSearchReport}>
                    {t("Excel Report")}
                </button>
            </div>
        </div>
    )
}

export default DietRequestReport;