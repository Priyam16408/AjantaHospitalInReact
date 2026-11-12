import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from '../../../components/formComponent/Input'
import Tables from '../../../components/UI/customTable'
import Heading from "../../../components/UI/Heading";
import { notify } from "../../../utils/utils";
import { ServicesSetupSaveDisplayName, ServicesSetupUpdateDisplayName, SetupBindDisplayName } from "../../../networkServices/EDP/edpApi";
// import Input from "../../../components/formComponent/Input";
const DisplayNameMaster = () => {
    const [t] = useTranslation();
      const [values, setValues] = useState({
        name: "",
        ID: ""
    })
    const [isEdit, setIsEdit] = useState(false)
    const [tableData, setTableData] = useState([{
        "S.No.": "1"
    }])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    }
    const getItems = async () => {
        try {

            const response = await SetupBindDisplayName();
            if (response.success) {
                setTableData(response.data)
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.error("Error fetching department data:", error);
            notify(apiResp?.message, "error");
        }
    };

    const handleSave = async () => {
        try {
            let payload = values.name

            if (!payload) {
                notify("Please Fill New Display Name", "error")
                return
            }
            const response = await ServicesSetupSaveDisplayName(payload);
            if (response.success) {
                notify(response?.message, "success")
                setValues({
                    name: "",
                    ID: ""
                })
                getItems()
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.error("Error fetching department data:", error);
            notify(apiResp?.message, "error");
        }
    };


    useEffect(() => {
        getItems()
    }, [])
    const THEAD = [
        { name: t("S.No."), width: "0.2%" },
        { name: t("Display Name"),},
        { name: t("Edit"), width: "5%" },
    ]
    const handleEdit = (val) => {
        setIsEdit(true)
        setValues((preV) => ({
            ...preV,
            name: val?.Name,
            ID: val?.ID

        }))
    }
    const handleUpdate = async () => {
        try {
            let payload = {
                name: values.name,
                ID: values?.ID
            }
            const response = await ServicesSetupUpdateDisplayName(payload);
            if (response.success) {
                getItems()
                setIsEdit(false)
                setValues({
                    name: "",
                    ID: ""
                })
                notify("Update Sucessfully", "success")
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            notify(apiResp?.message, "error");
        }
    };

    const handleCancel = () => {
        setValues((PreV) => ({
            ...PreV,
            name: "",
            ID: ""
        }));
        setIsEdit(!isEdit)
    }
    return (
        <div className="spatient_registration_card card">
            <Heading
                title={t("Display Name Master")}
                isBreadcrumb={false}

            />
            <div className="row p-2">
                <Input

                    type="text"
                    className="form-control required-fields"
                    id={t("name")}

                    lable={t("New Display Name")}
                    // placeholder=" "
                    value={values?.name}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    name="name"
                    onChange={handleChange}
                />

                {
                    isEdit ? <div className="col-xl-2 col-md-3 col-sm-6 col-12">
                        <button
                            className="btn btn-sm btn-primary mx-1 px-4"
                            onClick={handleUpdate}
                        >

                            {t("Update")}
                        </button>
                        <button
                            className="btn btn-sm btn-primary mx-1 px-4"
                            onClick={() => handleCancel()}
                        >
                            {t("Cancel")}

                        </button>
                    </div> : <div className="col-xl-2 col-md-3 col-sm-6 col-12">
                        <button
                            className="btn btn-sm btn-primary mx-1 px-4"
                            onClick={handleSave}
                        >

                            {t("Save")}
                        </button>

                    </div>
                }


            </div>
            <Heading title={t("Display Name")} isBreadcrumb={false} />
            <div className="patient_registration card">
                <div className="row">
                    <div className="col-12">
                        <Tables
                        isSearch={true}
                            thead={THEAD}
                            tbody={tableData?.map((val, ind) => ({

                                Sno: ind + 1,
                                name: val?.Name,

                                Edit: <span onClick={() => handleEdit(val)}><i className="fa fa-edit" /></span>,

                            }))}
                            tableHeight={"scrollView"}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayNameMaster