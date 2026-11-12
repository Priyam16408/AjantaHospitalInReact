import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";


export default function DepartmentManagement({
    handleChangeModel,
    inputData,
}) {
    const [t] = useTranslation();
    const [inputs, setInputs] = useState(inputData);
    const handlechange = (e) => {
        setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        handleChangeModel(inputs);
    }, [inputs]);
    return (
        <>
            <div className="row p-2">
                <Input
                    lable={t("Department")}
                    className=" form-control"
                    id="addnew"
                    rows={4}
                    respclass="w-100"
                    name="addnew"
                    value={inputs?.addnew ? inputs?.addnew : ""}
                    onChange={handlechange}
                    maxLength={1000}
                />
            </div>
        </>
    )
}