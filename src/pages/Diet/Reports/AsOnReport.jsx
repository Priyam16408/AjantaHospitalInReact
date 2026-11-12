import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading';
import DatePicker from '../../../components/formComponent/DatePicker';
import { useTranslation } from 'react-i18next';
import { wardWiseAsOnDateReportApi } from '../../../networkServices/DietApi';
import moment from 'moment';
import { notify } from '../../../utils/ustil2';
import { RedirectURL } from '../../../networkServices/PDFURL';
const AsOnReport = () => {
    const { t } = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [values, setValues] = useState({
        AsOnDate: new Date(),
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    };
    const handleSearchReport = async () => {
        try {
            const payload = {
                dietIssueDate: moment(values?.AsOnDate).format("DD-MMM-YYYY") || "",
            }
            const response = await wardWiseAsOnDateReportApi(payload);
            if (response?.success) {
                RedirectURL(response?.data);
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
                    id="asOnDate"
                    name="AsOnDate"
                    lable={t("As On Date")}
                    placeholder={VITE_DATE_FORMAT}
                    respclass={"col-xl-3  col-6"}
                    value={values?.AsOnDate ? values?.AsOnDate : new Date()}
                    maxDate={new Date()}
                    handleChange={handleChange}
                />
                <button className="btn btn-sm btn-success ml-2" type="button" onClick={handleSearchReport}>
                    {t("Report")}
                </button>
            </div>
        </div>
    )
}

export default AsOnReport;