import React, { useEffect, useState } from 'react'
import Input from '../../../components/formComponent/Input';
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { SubDietBindGrid, SubDietTypeSave, SubDietTypeUpdate } from '../../../networkServices/EDP/pragyaedp';
import Tables from '../../../components/UI/customTable';
import { notify } from '../../../utils/ustil2';
import DepartmentManagement from '../SurgeryManagement/DepartmentManagement';
import Modal from '../../../components/modalComponent/Modal';
import SubDietMaster from './SubDietMaster';

const SubDietTypeMaster = () => {
    const [t] = useTranslation();


    const [values, setValues] = useState({
        SubDietType: "",
        Description: "",
        Status: "",
        id: "",
    })

    const [roommasterSearchData, setRoomMasterSearchData] = useState([]);
    const [showbtn, setSHowBtn] = useState(true);
    const [handleModelData, setHandleModelData] = useState({});
    const [modalData, setModalData] = useState({});

    const StatusOptions = [
        { label: "YES", value: "1" },
        { label: "NO", value: "0" }
    ];

    const [ID, setId] = useState("");

    const TheadSearchTable = [
        { width: "5%", name: t("SNo") },
        { width: "25%", name: t("SUb Diet Name") },
        { width: "25%", name: t("Description") },
        { width: "10%", name: t("Active") },
        { width: "5%", name: t("Edit") },

    ];
    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelect = (name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const BindTableData = async () => {
        try {
            const apiResp = await SubDietBindGrid();
            if (apiResp.success) {
                // console.log('dataoftable', apiResp?.data)
                setRoomMasterSearchData(apiResp?.data)

            } else {
                notify(apiResp?.message, "error");
                console.log('error in response:', apiResp);
            }
        } catch (error) {
            console.error("Error loading centre data:", error);
            notify("An error occurred while loading centre data", "error");
        }
    }

    const handleSaveSubDietChart = async () => {
        const payload = {
            "name": values?.SubDietType,
            "description": values?.Description,
            "isActive": Number(values?.Status?.value),
        }
        try {
            const apiResp = await SubDietTypeSave(payload);
            if (apiResp?.success) {
                console.log("the apiresponse is in the table", apiResp?.data);
                notify(apiResp?.message, "success")
                setSHowBtn(true);
                BindTableData();
                clearForm();
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.error("Error loading surgery data:", error);
            notify("An error occurred while loading surgery data", "error");
        }
    }
    const handleEDit = (rowData) => {
        setSHowBtn(false);
        console.log("the data is ", rowData);
        setId(rowData?.SubDietID);

        setValues({
            SubDietType: rowData.Name,
            Description: rowData.Description,
            Status: {
                label: rowData.IsActive === "Yes" ? "YES" : "NO",
                value: rowData.IsActive === "Yes" ? "1" : "0"
            },
            id: rowData.DietID
        });
    }
    const handelUpdateSubDiet = async () => {
        console.log("the id is", ID)
        const payload = {
            "id": ID,
            "name": values?.SubDietType,
            "description": values?.Description,
            "isActive": Number(values?.Status?.value),
        }
        try {
            const apiResp = await SubDietTypeUpdate(payload);
            if (apiResp?.success) {
                console.log("the apiresponse is in the table", apiResp?.data);
                setSHowBtn(true);
                BindTableData();
                notify(apiResp?.message, "success")
                clearForm();
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.error("Error loading surgery data:", error);
            notify("An error occurred while loading surgery data", "error");
        }
    }
    const handleAddDepartment = (item) => {
        setHandleModelData({
            label: t("Map Diet Type To Sub Type"),
            buttonName: t("Save"),
            width: "60vw",
            isOpen: true,
            Component: (
                <div>
                    <SubDietMaster
                        inputData={item}
                        handleChangeModel={handleChangeRejectModel}
                    />
                </div>
            ),
            footer: <></>,
            //   handleInsertAPI: handleSaveresult,
        });
    };
    const clearForm = () => {
        setValues({
            SubDietType: "",
            Description: "",
            Status: "",
        });
    }
    const handleCancel = () => {
        setSHowBtn(true);
        clearForm();
    }
    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleChangeRejectModel = (data) => {
        setModalData(data);
    };

    useEffect(() => {
        BindTableData();
    }, [])

    return (
        <>
            {handleModelData?.isOpen && (
                <Modal
                    visible={handleModelData?.isOpen}
                    setVisible={setIsOpen}
                    modalWidth={handleModelData?.width}
                    Header={t(handleModelData?.label)}
                    buttonType={"submit"}
                    buttons={handleModelData?.extrabutton}
                    buttonName={handleModelData?.buttonName}
                    modalData={modalData}
                    setModalData={setModalData}
                    footer={<></>}
                    handleAPI={handleModelData?.handleInsertAPI}
                >
                    {handleModelData?.Component}
                </Modal>
            )}
            <div className="mt-2 card">
                <Heading title={t("Master")} isBreadcrumb={false} />

                <div className="row mb-2 mt-2">
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="SubDietType"
                        name="SubDietType"
                        value={values?.SubDietType}
                        onChange={handleChange}
                        lable={t("Sub Diet Type")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />

                    <Input
                        type="text"
                        className="form-control "
                        id="Description"
                        name="Description"
                        value={values?.Description}
                        onChange={handleChange}
                        lable={t("Description")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />

                    <ReactSelect
                        placeholderName={t("Status")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="Status"
                        name="Status"
                        removeIsClearable={true}
                        dynamicOptions={StatusOptions}
                        handleChange={handleSelect}
                        value={values?.Status?.value}
                    />

                    {showbtn ? (
                        <button
                            className="btn btn-sm btn-success py-1 px-2 mt-1"
                            style={{ width: "70px" }}
                            onClick={handleSaveSubDietChart}
                        >
                            {t("Save")}
                        </button>
                    ) : (
                        <button
                            className="btn btn-sm btn-success py-1 px-2 mt-1"
                            style={{ width: "70px" }}
                            onClick={handelUpdateSubDiet}
                        >
                            {t("Update")}
                        </button>
                    )}

                    <button
                        className="btn btn-sm btn-success py-1 px-2 mt-1 ml-1"
                        style={{ width: "70phandleAddDepartmentx" }}
                        onClick={handleCancel}
                    >
                        {t("Cancel")}
                    </button>


                    <button
                        className="btn btn-sm btn-success py-1 px-2 mt-1 ml-1"
                        onClick={handleAddDepartment}
                    >
                        {t("Map Diet Type To Sub Type")}
                    </button>
                </div>

                {roommasterSearchData.length > 0 && (
                    <div className="card">
                        <Tables
                            thead={TheadSearchTable}
                            tbody={roommasterSearchData?.map((val, index) => {
                                console.log("Table row data:", val);
                                return ({
                                    sno: index + 1,
                                    SubDietType: val?.Name,
                                    Description: val?.Description,
                                    Status: val?.IsActive,
                                    Edit: <i
                                        className='fa fa-edit' onClick={() => handleEDit(val)} />
                                })
                            })}
                        />
                    </div>
                )}

            </div>

        </>
    )
}

export default SubDietTypeMaster;