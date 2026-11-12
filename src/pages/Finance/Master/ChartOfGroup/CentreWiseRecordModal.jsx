import React, { useEffect } from 'react'
import ReactSelect from '../../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { CentreWiseGroup, ChartOfGroupUpdateStatus } from '../../../../networkServices/finance'
import TreeViewTable from '../../../../components/UI/customTable/TreeViewTable'
import { BindMainCenter } from '../../../../networkServices/Pettycash'
import { handleReactSelectDropDownOptions, notify } from '../../../../utils/utils'
import { useLocalStorage } from '../../../../utils/hooks/useLocalStorage'
import { buildHierarchyTree } from '../../../../utils/ustil2'
import Modal from '../../../../components/modalComponent/Modal'

export default function CentreWiseRecordModal() {
    const [t] = useTranslation()
    const userData = useLocalStorage("userData", "get")
    const [values, setValues] = useState({ MainGroup: { value: Number(userData?.defaultCentre) } })
    const [centreList, setCentreList] = useState([])
    const thead = [t("S.No."), { name: t("Code") }, { name: t("Group Name"), width: "70%" }, t("Status")]
    const [bodyData, setBodyData] = useState([])
    const [modalData, setModalData] = useState({ visible: false });
    const handleReactSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }))
    }
    const getCentreList = async () => {
        let apiResp = await BindMainCenter()
        if (apiResp?.success) {
            setCentreList(apiResp?.data)
        }
    }
    useEffect(() => {
        getCentreList()
        handelSearch()
    }, [])

    const handelSearch = async () => {
        let apiResp = await CentreWiseGroup(values?.MainGroup?.value)
        if (apiResp?.success) {
            const newResp = apiResp?.data?.map((val) => ({ ...val, Active: <span className={`${val?.ISEditable === 1 && "text-primary font-weight-bold"}`}>{val?.Active}</span> }))
            let data = buildHierarchyTree(newResp, ["Active"])
            setBodyData(data)
        }
    }

    const handleChangeStatus = async (data) => {
        let payload = {
            "cid": Number(values?.MainGroup?.value),
            "groupCode": data?.id,
            "isActive": data?.Active?.props?.children === "IN-Active" ? 0 : 1
        }

        let apiResp = await ChartOfGroupUpdateStatus(payload)
        if(apiResp?.success){
            notify(apiResp?.message)
            handelSearch()
            setModalData((val) => ({ ...val, visible: false }))
        }else{
            notify(apiResp?.message,"error")
        }
        console.log("ASdasd", apiResp)

    }
    const handleClick = async (val, type) => {
        if (type === "Active" && val?.Active?.props?.className !== "false") {
            setModalData({
                visible: true,
                width: "20vw",
                modalData: val,
                label: t("Are You Sure?"),
                buttonName: t("Save"),
                CallAPI: handleChangeStatus,
                footer: <></>,
                Component: <h3 className='text-center'>{t("Do You Want To Change Status?")}</h3>,
            });
        }

    }

    return (

        <>
            <div className='row p-2'>
                <ReactSelect
                    placeholderName={t("Main Group")}
                    id="MainGroup"
                    name="MainGroup"
                    requiredClassName={"required-fields"}
                    value={values?.MainGroup?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    removeIsClearable={true}
                    isDisabled={true}
                    dynamicOptions={handleReactSelectDropDownOptions(centreList, "CentreName", "MainCentreID")}
                    searchable={true}
                    respclass="col-xl-4 col-md-4 col-sm-4 col-12"
                />
                <div className="col-xl-1 col-md-4 col-sm-4 col-12">
                    <button className="btn btn-sm btn-success px-4" type='button' onClick={handelSearch} >{t("Search")}</button>
                </div>
            </div>
            {bodyData?.length > 0 &&
                <TreeViewTable thead={thead} tbody={bodyData} isSNo={true} isTreeOpen={true} handleClick={handleClick} style={{ maxHeight: "60vh" }} />
            }
            {modalData?.visible && (
                <Modal
                    visible={modalData?.visible}
                    setVisible={() => {
                        setModalData((val) => ({ ...val, visible: false }));
                    }}
                    modalData={modalData?.modalData}
                    modalWidth={modalData?.width}
                    Header={modalData?.label}
                    buttonType="button"
                    buttonName={modalData?.buttonName}
                    // footer={modalData?.footer}
                    handleAPI={modalData?.CallAPI}
                >
                    {modalData?.Component}
                </Modal>
            )}
        </>

    )
}
