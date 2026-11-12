import React, { useEffect, useState } from 'react'
import Input from '../../../components/formComponent/Input'
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import Tables from '../../../components/UI/customTable';
import { getBindReduceitemdetails } from '../../../networkServices/EDP/edpApi';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';

export default function ReduceServiceModal({ data }) {
    const initialValues = { ReduceType: { value: "0" } };
    const [values, setValues] = useState(initialValues);
    const tableData = [
        { ServiceName: "Surgery", SequenceNo: "1", Reduce_per: "", Remarks: "" },
        { ServiceName: "Surgery", SequenceNo: "2", Reduce_per: "", Remarks: "" },
        { ServiceName: "Surgery", SequenceNo: "3", Reduce_per: "", Remarks: "" },
        { ServiceName: "Surgery", SequenceNo: "4", Reduce_per: "", Remarks: "" },
    ];
    const [bodyData, setBodyData] = useState(tableData);

    const [t] = useTranslation();

    const thead = [
        t("S.No."),
        t("Reduce Type"),
        t("Sequnce Type"),
        t("Reduce Per"),
        t("Remarks"),
    ];

    const handleSelect = async (name, value) => {
        let apiResp = await getBindReduceitemdetails(value?.label, data?.PanelID)
        if (apiResp?.success) {
            setBodyData(apiResp?.data)
        }
        setValues((val) => ({
            ...val,
            [name]: value,
        }));
    }



    const handleCustomInput = (index, name, value, type, max = 9999999999999) => {
        if (type === "number") {
            if (!isNaN(value) && Number(value) <= max) {
                const data = JSON.parse(JSON.stringify(bodyData));
                data[index][name] = value;
                setBodyData(data);
            }
        } else {
            const data = JSON.parse(JSON.stringify(bodyData));
            data[index][name] = value;
            setBodyData(data);
        }
    }

    return (
        <>
            <ReactSelect
                placeholderName={t("Reduce Type")}
                searchable={true}
                removeIsClearable={true}
                respclass="w-50"
                dynamicOptions={[{ label: "Select", value: "0" }, { label: "Surgery", value: "1" }]}
                handleChange={handleSelect}
                value={`${values?.ReduceType?.value}`}
                name={"ReduceType"}
            />

            <div> <Tables thead={thead} tbody={bodyData?.map((ele, index) => ({
                SNo: index + 1,
                ItemName: <div style={{ whiteSpace: "normal", width: "100%" }}>{ele?.ServiceName}</div>,
                SequenceNo: ele?.SequenceNo,
                Reduce_Per: <Input
                    type="number"
                    className="table-input"
                    respclass={"w-100"}
                    removeFormGroupClass={true}
                    name={"Reduce_Per	"}
                    value={ele?.Reduce_Per ? ele?.Reduce_Per : ""}
                    onChange={(e) => { handleCustomInput(index, "Reduce_Per", e.target.value, "number", 100) }}
                />,
                OPD: <Input
                    type="number"
                    className="table-input"
                    respclass={"w-100"}
                    removeFormGroupClass={true}
                    name={"Remarks"}
                    value={ele?.Remarks ? ele?.Remarks : ""}
                    onChange={(e) => { handleCustomInput(index, "Remarks", e.target.value, "text") }}
                />,



            }))} /></div>
        </>
    )
}
