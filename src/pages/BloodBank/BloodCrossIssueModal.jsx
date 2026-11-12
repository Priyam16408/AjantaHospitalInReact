import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import Input from '../../components/formComponent/Input'
import ReactSelect from '../../components/formComponent/ReactSelect'
import { getCtbNoApi } from '../../networkServices/BloodBank/BloodBank'
import { notify } from '../../utils/ustil2'

export const BloodCrossIssueModal = ({ handleChangeModal, Id, tid }) => {

    const { t } = useTranslation()
    const [values, setValues] = useState({
        CTBNo: "",
        CrossIssue: "",
        Id: Id || ''
    })
    const [crossIssueOptions, setCrossIssueOptions] = useState([]);

    const handleReactSelectChange = (name, val) => {
        setValues((prev) => ({
            ...prev,
            [name]: val.value,
        }));
    }
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setValues((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // }

    const handleSubmit = () => {
        handleChangeModal(values);
    };
    const renderCtbNo = async () => {
        try {
            const resp = await getCtbNoApi(tid)
            if (resp?.success) {
                setCrossIssueOptions(resp?.data?.map((item) => (
                    {
                        label: item?.CtbNo,
                        value: item?.CtbNo
                    }
                )));
            } else {
                notify(resp?.message, "error")
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        renderCtbNo()
    }, [])
    
    return (
        <div className='row'>
            {/* <div className="d-flex justify-content-start align-items-center col-xl-12 col-md-12 col-sm-12 col-12 " style={{ gap: "5px" }}> */}
            
                <ReactSelect
                    placeholderName={t("CTBNo")}
                    name="CTBNo"
                    value={`${values?.CTBNo?.value}`}
                    handleChange={handleReactSelectChange}
                    dynamicOptions={crossIssueOptions}
                    searchable={true}
                    id={"CTBNo"}
                    respclass="col-xl-6 col-md-6 col-sm-12 "
                    removeIsClearable={true}
                />
                <ReactSelect
                    placeholderName={t("Cross Issue")}
                    name="CrossIssue"
                    value={`${values?.CrossIssue.value}`}
                    handleChange={handleReactSelectChange}
                    dynamicOptions={[
                        { label: "Cross", value: "cross" },
                        { label: "Issue", value: "issue" }
                    ]}
                    searchable={true}
                    id={"CrossIssue"}
                    respclass="col-xl-6 col-md-6 col-sm-12 "
                    removeIsClearable={true}
                />

            {/* </div> */}
            <div className='w-full text-right p-2'>

                <button className='btn btn-primary' onClick={handleSubmit}>Save</button>
            </div>
        </div>
    )
}
