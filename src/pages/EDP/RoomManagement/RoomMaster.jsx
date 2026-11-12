import React, { useEffect, useState } from 'react'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import Heading from '../../../components/UI/Heading'
import { useSSR, useTranslation } from 'react-i18next';
import Input from '../../../components/formComponent/Input';
import TextAreaInput from '../../../components/formComponent/TextAreaInput';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';
import { EDPBindAllCentre } from '../../../networkServices/edpApi';
import GroupingManagemnt from '../SurgeryManagement/GroupingManagemnt';
import Modal from '../../../components/modalComponent/Modal';
import GroupingRoomMaster from './GroupingRoomMaster';
import FloorRoomManagemment from './FloorRoomManagemment';
import { InsertNewRoomType, InsertRoomDatalog, RoomBindCentre, SaveRoomData, SearchRoomById, SearchRoomData } from '../../../networkServices/EDP/pragyaedp';
import { notify } from '../../../utils/ustil2';
import Tables from '../../../components/UI/customTable';

const RoomMaster = () => {
    const [t] = useTranslation();
    const ip = localStorage.getItem("ip");
    const [btnShow, setBtnShow] = useState(false);
    const [roomIdval, setRoomId] = useState();


    const [values, setValues] = useState({
        centerName: "",
        roomType: "",
        Name: "",
        roomNo: "",
        floor: "",
        bedNo: "",
        descifany: "",
        status: "",
        doctorShare: "",
        actualBed: "",
    })

    const [modalData, setModalData] = useState({});

    const handleSelect = (name, value) => {

        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }



    const TheadSearchTable = [
        { width: "5%", name: t("SNo") },

        { width: "5%", name: t("Room Type") },
        { width: "5%", name: t("Room Name") },
        { width: "5%", name: t("Bed No") },
        { width: "5%", name: t("Floor") },
        { width: "5%", name: t("Description") },
        { width: "5%", name: t("Status") },
        { width: "5%", name: t("IsCount") },
        { width: "5%", name: t("Edit") },


    ];


    const StatusOptions = [
        { label: "True", value: "1" },
        { label: "False", value: "0" }
    ];

    const DocterShareOptions = [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" }
    ];

    const ActualBedOptions = [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" }
    ];
    const [bindCentre, setBindCentre] = useState([]);

    const [handleModelData, setHandleModelData] = useState({});
    // const [handle] = useState();

    const handleBindSelectCentre = async () => {

        try {
            const apiResp = await RoomBindCentre();
            if (apiResp.success) {
                setBindCentre(apiResp?.data);
            } else {
                notify(apiResp?.message, "error");
                console.log('error in response:', apiResp);
            }
        } catch (error) {
            console.error("Error loading centre data:", error);
            notify("An error occurred while loading centre data", "error");
        }
    }

    useEffect(() => {
        handleBindSelectCentre();
    }, []);

    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleOpentModel = (data) => {
        setModalData(data);
    };

    // SearchRoomData

    const [roommasterSearchData, setRoomMasterSearchData] = useState([]);

    const handleSearchRoomData = async () => {

        try {
            const apiResp = await SearchRoomData(0);
            if (apiResp.success) {
                setRoomMasterSearchData(apiResp?.data);
            } else {
                notify(apiResp?.message, "error");
                console.log('error in response:', apiResp);

            }
        } catch (error) {
            console.error("Error loading centre data:", error);
            notify("An error occurred while loading centre data", "error");
        }
    }

    const handleSaveRoomType = async (data) => {
        let payload = {
            "billingCategoryId": data?.billingCategory?.value,
            "roomType": data?.addnew,
            "description": data?.description,
            "ipAddress": ip,
            "centerID": data?.centerName?.value,
            "dept": data?.department?.value,
            "isDiscountable": 0
        }
        let apiResp = await InsertNewRoomType(payload);
        console.log("the pauload is", payload);
        if (apiResp?.success) {
            notify(apiResp?.message, "success");

            setHandleModelData((val) => ({ ...val, isOpen: false }));
        } else {
            console.log(apiResp?.message);
            notify(apiResp?.message, "error");
        }
    };

    const AddNewRoomType = (item) => {
        setHandleModelData({
            label: t("Add New Room Type"),
            buttonName: t("Save"),
            // buttonName: t("Cancel"),
            width: "30vw",
            isOpen: true,
            Component: (
                <GroupingRoomMaster
                    inputData={item}
                    handleChangeModel={handleOpentModel}
                />
            ),
            handleInsertAPI: handleSaveRoomType,
            // extrabutton: <></>,
        });
    };

    const handleReactSelect = (label, value) => {
        setValues((val) => ({ ...val, [label]: value }));
    };

    const handleOpenFloor = (item) => {
        setHandleModelData({
            label: t("Add New Room Type"),
            buttonName: t("Save"),
            // buttonName: t("Cancel"),
            width: "30vw",
            isOpen: true,
            Component: (
                <FloorRoomManagemment
                    inputData={item}
                    handleChangeModel={handleChangeRejectModel}
                />
            ),
            // handleInsertAPI: handleSaveresult,
            // extrabutton: <></>,
        });
    };

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const payload = {
            "id": 0,
            "updaterID": "string",
            "location": "string",
            "hospCode": values?.centerName?.value || 12,
            "room_ID": values?.roomType?.value || 22,
            "floor": values?.floor?.value || 22,
            "ipdCaseType_ID": "string",
            "creator_ID": "string",
            "description": values?.descifany,
            "creator_Date": "string",
            "name": values?.Name,
            "room_No": values?.roomNo,
            "bed_No": values?.bedNo,
            "isActive": 0,
            "isCountable": 0,
            "ipAddress": ip,
            "centreID": 0
        }
        try {
            const apiResp = await SaveRoomData(payload);
            if (apiResp.success) {
                console.log("the apiresponse is in the table", apiResp.data);
                notify(apiResp?.message, "success");

                // setValues({
                //     ...values,
                //     Name: "",
                //     BankCut: "",
                // });

            } else {
                notify(apiResp?.message, "error");
                // setLoadSurgeryData([]);
            }
        } catch (error) {
            console.error("Error loading surgery data:", error);
            notify("An error occurred while loading surgery data", "error");

        }
    }

    const [tableData, setTableData] = useState([]);
    const handleSearch = async () => {
        try {
            const apiResp = await SearchRoomData();
            if (apiResp.success) {
                setTableData(apiResp?.data);
                console.log("the data from search", apiResp); s
            } else {
                notify(apiResp?.message, "error");
                // setLoadSurgeryData([]);
            }
        } catch (error) {
            console.error("Error loading surgery data:", error);
            notify("An error occurred while loading surgery data", "error");

        }
    }

    const handleUpdate = async (index) => {
        const data = roommasterSearchData[index];
        console.log("the roomId is in handleUpdate", data?.RoomId);
        console.log("the data is in roomidSearch", data);
        try {
            const apiResp = await SearchRoomById(data?.Room_No);
            if (apiResp.success) {
                setBtnShow(true);
                const editData = apiResp?.data;
                setRoomId(editData?.roomID);

                setValues({
                    centerName: "",
                    roomType: "",
                    Name: editData?.name,
                    roomNo: editData?.room_No,
                    floor: editData?.floor,
                    bedNo: editData?.bed_No,
                    descifany: editData?.description,
                    status: editData?.isActive,
                    doctorShare: "",
                    actualBed: "",
                });
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.error("Error loading surgery data:", error);
            notify("An error occurred while loading surgery data", "error");

        }
    }


    const handleUpdateRoomMaster = async () => {
        const payload =
        {
            "id": 0,
            "updaterID": "string",
            "location": "string",
            "hospCode": "string",
            "room_ID": roomIdval,
            "floor": 11,
            "ipdCaseType_ID": "string",
            "creator_ID": "string",
            "description": values?.descifany,
            "creator_Date": "string",
            "name": values?.Name,
            "room_No": values?.roomNo,
            "bed_No": values?.bedNo,
            "isActive": 0,
            "isCountable": 0,
            "ipAddress": ip,
            "centreID": values?.centerName?.value
        }
        try {
            const apiResp = await InsertRoomDatalog(payload);
            if (apiResp.success) {
                console.log("the apiresponse is in the table", apiResp.data);
                notify(apiResp?.message, "success");
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.error("Error loading surgery data:", error);
            notify("An error occurred while loading surgery data", "error");

        }
    }


    useEffect(() => {
        handleSearch();
        handleSearchRoomData();
    }, []);




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
                    footer={handleModelData?.footer}
                    handleAPI={handleModelData?.handleInsertAPI}
                >
                    {handleModelData?.Component}
                </Modal>
            )}
            <div className='mt-2 card'>
                <Heading title="Room Master" isBreadcrumb={false} />
                <div className='row p-2'>

                    <ReactSelect
                        placeholderName={t("Center Name")}
                        removeIsClearable={true}
                        name="centerName"
                        value={values?.centerName?.value}
                        handleChange={handleSelect}
                        dynamicOptions={[
                            ...handleReactSelectDropDownOptions(
                                bindCentre,
                                "CentreName",
                                "CentreID"
                            ),
                        ]}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    // defaultValue={initialState.Edit}
                    />



                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="Name"
                        name="Name"
                        value={values.Name}
                        onChange={handleChange}
                        lable={t("Room Name")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        style={{ width: "100%" }}
                    />

                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="roomNo"
                        name="roomNo"
                        value={values.roomNo}
                        onChange={handleChange}
                        lable={t("Room No")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        style={{ width: "100%" }}
                    />


                    <Input
                        type="text"
                        className="form-control"
                        id="bedNo"
                        name="bedNo"
                        // value={values.Name}
                        // onChange={handleChange}
                        lable={t("Bed No")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        style={{ width: "100%" }}
                    />
                    <TextAreaInput
                        type="text"
                        className="form-control"
                        id="descifany"
                        name="descifany"
                        value={values.descifany}
                        onChange={handleChange}
                        lable={t("Desc.(if any)")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        style={{ width: "100%" }}
                    />

                    <ReactSelect
                        placeholderName={t("Status")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="status"
                        name="status"
                        removeIsClearable={true}
                        dynamicOptions={StatusOptions}
                        handleChange={handleSelect}
                        value={values.status?.value}
                    />


                    <ReactSelect
                        placeholderName={t("Docter Share")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="doctorShare"
                        name="doctorShare"
                        removeIsClearable={true}
                        dynamicOptions={DocterShareOptions}
                        handleChange={handleSelect}
                        value={values.doctorShare?.value}
                    />


                    <ReactSelect
                        placeholderName={t("Actual Bed")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-122"
                        id="actualBed"
                        name="actualBed"
                        removeIsClearable={true}
                        dynamicOptions={ActualBedOptions}
                        handleChange={handleSelect}
                        value={values.actualBed?.value}
                    />

                    <ReactSelect
                        placeholderName={t("Floor")}
                        removeIsClearable={true}
                        name="floor"
                        value={values?.floor?.value}
                        handleChange={handleSelect}
                        // dynamicOptions={EditableOptions}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    // onClick={handleOpenFloor} 
                    />
                    <button className="btn btn-sm btn-primary mt-sm-2 mb-sm-2 ml-sm-2">
                        {t("New")}
                    </button>


                    <ReactSelect
                        placeholderName={t("Room Type")}
                        removeIsClearable={true}
                        name="roomType"
                        value={values?.roomType?.value}
                        handleChange={handleSelect}
                        // dynamicOptions={EditableOptions}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    // defaultValue={initialState.Edit}
                    />
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                            AddNewRoomType();
                        }}>{t("New")}</button>

                    <div className="col-sm-4 col-xl-2 col-md-4">
                        {btnShow ? <button className="btn btn-sm btn-success px-4 mr-2" onClick={handleUpdateRoomMaster}>{t("Update")}</button>
                            : <button className="btn btn-sm btn-success" onClick={handleSave}>{t("Save")}</button>
                        }
                        <button className="btn btn-sm btn-success ml-2">{t("Clear")}</button>
                    </div>
                </div>
                {roommasterSearchData.length > 0 && (
                    <div className="card">
                        <Tables
                            thead={TheadSearchTable}
                            tbody={roommasterSearchData?.map((val, index) => ({
                                sno: index + 1,
                                RoomType: val?.RoomType,
                                RoomNo: val?.Room_No,
                                BedNo: val?.Bed_No,
                                Floor: val?.Floor,
                                Descriptiom: val?.Description,
                                Status: val?.IsActive,
                                IsCount: val?.IsCountable,
                                Edit: <i onClick={() => handleUpdate(index)} className='fa fa-edit' />
                            }))}
                            tableHeight={"scrollView"}
                        //   style={{ height: "60vh", padding: "2px" }} 
                        />

                    </div>
                )}


            </div>
        </>
    )
}

export default RoomMaster;