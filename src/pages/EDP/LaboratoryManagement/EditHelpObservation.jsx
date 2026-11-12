import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";

export default function EditHelpObservationModel({ handleChangeModel, inputData }) {

    const [t] = useTranslation();
    const [inputs, setInputs] = useState(inputData);
    const handlechange = (e) => {
        setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
    };


    useEffect(() => {
        handleChangeModel(inputs);
    }, [inputs]);
    console.log(inputs);


    return (
        <>
            <div className="row p-2">

                <Input
                    type="text"
                    className="form-control required-fields"
                    id="HELP"
                    name="HELP"
                    respclass="w-100"
                    value={inputs?.HELP ? inputs?.HELP : ""}
                    lable={t("HELP")}
                    placeholder=" "
                    maxLength={1000}
                    onChange={handlechange}
                />

            </div>

        </>

    );
}
