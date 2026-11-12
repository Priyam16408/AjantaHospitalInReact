import React, { useState } from 'react'
import Input from '../../../components/formComponent/Input';
import { useTranslation } from 'react-i18next';
import { SaveQuestionDepartment } from '../../../networkServices/edpApi';
import { notify } from '../../../utils/ustil2';

const SaveDepartment = ({setModalData,GetQuestionDepartmentList }) => {
    const [t] = useTranslation();
    const [values, setValues] = useState({
        name: "",

    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    }
    const handleSave = async () => {
        if (!values?.name ) {
            notify("Please fill all Department fields.", "warn");
            return;
        }
        const payload={
  "departmentName": values?.name || ""
}
        try {
            const response=await SaveQuestionDepartment(payload)
            if(response?.success){
notify(response?.message,"success")
GetQuestionDepartmentList()
setModalData({ visible: false })
            }
            else{
notify(response?.message,"error")
            }
        } catch (error) {
            console.log("error",error)
        }
        // try {
        //     let payload = {
        //         "department": String(values?.name),
        //         "question": String(values?.Question)
        //     }

        //     const response = await FeedBackSaveQuestionMaster(payload);
        //     console.log(response.data)
        //     if (response.success) {
        //         notify(response?.message, "success");
        //         console.log(response.data)
        //         setValues((preV) => ({
        //             ...preV,
        //             Question: ""
        //         }))
        //     } else {
        //         notify(response?.message, "error");
        //         console.error(
        //             "API returned success as false or invalid response:",
        //             response
        //         );

        //     }
        // } catch (error) {
        //     console.error("Error fetching department data:", error);

        // }
    }

    return (
        <div>
            <Input

                type="text"
                className="form-control required-fields"
                id={t("name")}

                lable={t("Name")}
                // placeholder=" "
                value={values?.name}
                respclass="   col-8"
                name="name"
                onChange={handleChange}
            />
            <div className="d-flex justify-content-end">
                <button className="btn btn-sm btn-success mr-2" type="button"
                    onClick={handleSave}
                >
                    {t("Save")}
                </button>
                <button className="btn btn-sm btn-success" type="button"
                onClick={() => setModalData({ visible: false })}
                >
                    {t("Cancel")}
                </button>
            </div>
        </div>
    )
}

export default SaveDepartment