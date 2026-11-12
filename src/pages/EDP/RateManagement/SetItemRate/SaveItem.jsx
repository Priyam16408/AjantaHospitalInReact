import React, { useState } from 'react'
import MultiSelectComp from '../../../../components/formComponent/MultiSelectComp';
import { useTranslation } from 'react-i18next';
import { RateSetupSaveSetItemRate } from '../../../../networkServices/EDP/edpApi';
import { notify } from '../../../../utils/utils';
import { useLocalStorage } from '../../../../utils/hooks/useLocalStorage';

const SaveItem = ({ Branch, values, tableData, handleClose }) => {
    const [t] = useTranslation();
    const ip = useLocalStorage("ip", "get");
    const [centreValues, setCentreValues] = useState({
        BranchCentre: []
    })
    const handleMultiSelectChange = (name, selectedOptions) => {
        setCentreValues({
            ...centreValues,
            [name]: selectedOptions,
        });
    };
    const filteredCentreOptions = Branch?.filter(
        (centre) => centre.CentreID !== values?.centre?.value
    );
    let centreID = centreValues?.BranchCentre?.map((item) => {
        return item.code
    }).join(",")
    const handleSave = async () => {
        const OPDpayload = {
            panelID: Number(values?.panel?.value),
            scheduleChargeID: Number(values?.scheduleCharges?.value),
            centreID: String(centreID || ""),
            dept: Number(values?.department?.value),
            ipAddress: String(ip),
            allRoom: true,
            caseType: 0,
            setItemRateOPD: tableData.map(row => ({
                itemID: Number(row.ItemID),
                rateCurrency: Number(row.RateCurrencyCountryID),
                rate: Number(row.Rate),  // Assuming your row has a Rate property
                itemDisplay: String(row.ItemDisplayName),
                itemNameOPD: String(row.ItemName),
                itemCode: String(row.ItemCode),
                applyIPD: row?.applyIPD, // Assuming you have a way to determine this
                active: Number(row?.IsCurrent), // Assuming you have a way to determine this
            })),
            setItemRateIPD: [
                {
                    "itemID": 0,
                    "rateCurrency": 0,
                    "rate": 0,
                    "itemDisplay": "",
                    "itemCode": "",
                    "active": 0,
                    "caseTypeID": 0,
                    "itemNameIPD": ""
                }
            ]
        };

        const IPDpayload = {
            panelID: Number(values?.panel?.value),
            scheduleChargeID: Number(values?.scheduleCharges?.value),
            centreID: String(centreID || ""),
            dept: Number(values?.department?.value),
            ipAddress: String(ip),
            allRoom: true,
            caseType: Number(values?.CaseType?.value || ""),
            setItemRateOPD: [
                {
                    "itemID": 0,
                    "rateCurrency": 0,
                    "rate": 0,
                    "itemDisplay": "",
                    "itemNameOPD": "",
                    "itemCode": "",
                    "applyIPD": false,
                    "active": 0
                }
            ],
            setItemRateIPD: tableData?.map((val) => (
                {
                    itemID: Number(val?.ItemID || 0),
                    rateCurrency: Number(val?.RateCurrencyCountryID || 0),
                    rate: Number(val?.Rate || 0),
                    itemDisplay: String(val?.ItemDisplayName || ""),
                    itemCode: String(val?.ItemCode || ""),
                    caseTypeID: Number(val?.IPDCaseTypeID || 0),
                    active: Number(val?.IsCurrent || 0),

                    itemNameIPD: String(val?.ItemName || ""),
                }
            ))

        };
        const payload = values?.department?.label == "OPD" ? OPDpayload : IPDpayload;
        try {
            const response = await RateSetupSaveSetItemRate(payload);
            if (response?.message) {
                notify(response?.message, "success");
                handleClose()
            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            console.log("error", error);
        }

    }
    return (
        <div className="mt-2 card">
            <div className="row px-3">
                <div className="">
                    <p>
                        <span>From Panel Name : {values?.panel?.label}</span>
                    </p>

                    <p>
                        <span>From Centre Name : {values?.centre?.label}</span>
                    </p>

                    <MultiSelectComp

                        // respclass="col-xl-8 col-md-4 col-sm-4 col-12"
                        name="BranchCentre"
                        id="BranchCentre"
                        placeholderName={t("Copy Rates to other Centre")}
                        dynamicOptions={filteredCentreOptions?.map((ele) => ({
                            code: ele?.CentreID,
                            name: ele?.CentreName,
                        }))}
                        handleChange={handleMultiSelectChange}
                        value={centreValues?.BranchCentre}
                    // requiredClassName={`required-fields`}
                    />
                </div>
            </div>
            <div className="p-2 d-flex justify-content-end">
                <button
                    className=" btn btn-sm btn-success ml-2 px-3 items-end"
                    onClick={handleSave}
                >
                    {t("Save")}
                </button>
            </div>
        </div>
    )
}

export default SaveItem