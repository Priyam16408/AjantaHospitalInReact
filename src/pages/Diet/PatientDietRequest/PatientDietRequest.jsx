import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '../../../components/UI/Heading';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { BindDietType, BindSubDietType, BindWard, DietBindMenu, DietIssueBindGrid, DietRequestSearch, Diettiming, GetComponent } from '../../../networkServices/EDP/pragyaedp';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from "moment";
import { BindFloor } from '../../../networkServices/nursingWardAPI';
import ColorCodingSearch from '../../../components/commonComponents/ColorCodingSearch';
import { notify } from '../../../utils/ustil2';
import { FaSearch } from 'react-icons/fa';
import Tables from '../../../components/UI/customTable';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';
import CustomSelect from '../../../components/formComponent/CustomSelect';
import Modal from '../../../components/modalComponent/Modal';
import Input from '../../../components/formComponent/Input';
import PatientDietRequestModal from './PatientDietRequestModal';


const PatientDietRequest = () => {

    const [t] = useTranslation();

    const initialValue = {
        fromDate: moment(new Date()).toDate(),
        Floor: "",
        DietTiming: "",
        Ward: "",
        DietType: "",
        SubDiet: "",
        Menu: "",
    }
    const [values, setValues] = useState({ ...initialValue });
    const [dietTimingOptions, setDietTimingOptions] = useState([]);
    const [dietFloor, setDietFloor] = useState();
    const [PateintWard, setPateintWard] = useState();
    const [tableResponse, setTableResponse] = useState({});
    const [handleModelData, setHandleModelData] = useState({});
    const [modalData, setModalData] = useState({});
    //tableDropdowns api...
    const [dietTypeDropDown, setDieTypeDropDown] = useState();
    // console.log('type dropdown', dietTypeDropDown)
    // const [subDietDropDown, setSubDietDropDown] = useState();


    //  patient component table 
    const [pateintCompoTable, setPateintCompoTable] = useState({});
    console.log('vcompo', pateintCompoTable)


    // console.log('freeze data ', dietTypeDropDown)


    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));

    };

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDietFlor = async () => {
        try {
            const apiResp = await BindFloor();
            if (apiResp.success) {
                const mappedOptions = apiResp.data.map(item => ({
                    value: item.id,
                    label: item.name
                }));
                setDietFloor(mappedOptions);
            } else notify(apiResp.message, "error");
        } catch (error) {
            notify("Error loading diet timing data", "error");
        }
    };


    const handleDietTiming = async () => {
        try {
            const apiResp = await Diettiming();
            if (apiResp.success) {
                // console.log("id of dietimign" , api)
                const mappedOptions = apiResp.data.map(item => ({
                    value: item.ID,
                    label: item.NAME
                }));
                setDietTimingOptions(mappedOptions);
            } else notify(apiResp.message, "error");
        } catch (error) {
            notify("Error loading diet timing data", "error");
        }
    };


    const handleWardSelection = async () => {
        try {
            const apiResp = await BindWard();
            if (apiResp.success) {
                console.log('bindward data render ', apiResp.data)
                const mappedOptions = apiResp.data.map(item => ({
                    value: item.IPDCaseTypeID,
                    label: item.Name
                }));
                setPateintWard(mappedOptions);
            } else notify(apiResp.message, "error");
        } catch (error) {
            notify("Error loading diet timing data", "error");
        }
    };

    const handleMapSearchDiet = async () => {
        if (values.DietTiming === "") {
            notify("DietTiming Field is Required", "error");
            return;
        }
        try {
            const formattedDate = moment(values?.fromDate).format("YYYY-MM-DD");
            const [apiResp, dietTypelist] = await Promise.all([
                DietRequestSearch(values?.Ward?.value, values?.DietTiming?.value, formattedDate, values?.Floor?.label),
                BindDietType(values?.DietTiming?.value)
            ]);
            if (apiResp.success) {
                const data = apiResp.data?.map((val) => ({
                    ...val,
                    DietTypeList: handleReactSelectDropDownOptions(dietTypelist?.data, "SubDietName", "SubdietID"),
                    SubDietList: [],
                    menuList: [],

                }))
                setTableResponse(data);
                notify("Data fetched successfully", "success");
            } else {
                notify(apiResp.message, "error");
                setTableResponse([])

            }
        } catch (error) {
            notify("Error loading diet data", "error");
            setTableResponse([])

        }
    };


    const handleSubDietDropDown = async (value, index, name) => {
        try {
            const response = await BindSubDietType(value?.SubdietID, value?.DietID);
            if (response.success) {
                const data = JSON.parse(JSON.stringify(tableResponse))
                data[index][name] = value
                data[index]["SubDietList"] = handleReactSelectDropDownOptions(response?.data, "SubDietName", "SubDietID")
                setTableResponse(data)
            } else {
                console.error(
                    "API returned success as false or invalid response:",
                    response
                );
                // setDepartmentData([]);
            }
        } catch (error) {
            console.error("Error fetching department data:", error);
            // setDepartmentData([]);
        }
    };
    console.log('tableres', tableResponse)

    const handleMenuDropDown = async (value, index, name, val) => {
        try {
            // debuggersss
            const formattedDate = moment(values?.fromDate).format("YYYY-MM-DD");
            const response = await DietBindMenu(
                val?.DietType?.SubdietID,
                val?.DietType?.DietID,
                value?.SubDietID,
                formattedDate

            );
            const data = JSON.parse(JSON.stringify(tableResponse))
            data[index][name] = value
            if (response.success) {
                console.log('MENU DATA', response)

                data[index]["menuList"] = handleReactSelectDropDownOptions(response?.data, "Name", "DietMenuID")

                console.log('data', data)
            } else {
                console.error(
                    "API returned success as false or invalid response:",
                    response
                );
                // setDepartmentData([]);
            } setTableResponse(data)
        } catch (error) {
            console.error("Error fetching department data:", error);
            // setDepartmentData([]);s
        }
    };
    const TheadSearchTable = [
        { width: "0%", name: t("SNo") },
        { width: "8%", name: t("IPD NO.") },
        { width: "8%", name: t("UHID") },
        { width: "9%", name: t("Patient Name") },
        { width: "12%", name: t("Diet Type") },
        { width: "12%", name: t("Sub Diet") },
        { width: "12%", name: t("Menu") },
        { width: "1%", name: t("pateint compo.") },
        { width: "0%", name: t("patient rec.") },
        { width: "1%", name: t("attendance comp.") },
        { width: "0%", name: t("attendance rec.") },
    ];

    // const TheadSearchTable1 = [
    //     {
    //         width: "5%",
    //         name: (
    //             <input
    //                 type="checkbox"
    //                 checked={
    //                     pateintCompoTable?.length > 0 &&
    //                     pateintCompoTable.every(item => item.checked)
    //                 }
    //                 onChange={(e) => {
    //                     const updated = pateintCompoTable.map(item => ({
    //                         ...item,
    //                         checked: e.target.checked,
    //                     }));
    //                     setPateintCompoTable(updated);
    //                 }}
    //             />
    //         ),
    //     },
    //     { width: "5%", name: t("SNo") },
    //     { width: "10%", name: t("Component Name") },
    //     { width: "10%", name: t("QTY") },
    //     { width: "10%", name: t("Rate") },
    //     { width: "10%", name: t("Type") },
    //     { width: "10%", name: t("Unit") },
    //     { width: "10%", name: t("Calories") },
    //     { width: "10%", name: t("Protein") },
    //     { width: "10%", name: t("Sodium") },
    //     { width: "10%", name: t("SaturatedFat") },
    //     { width: "10%", name: t("T_Fat") },
    //     { width: "10%", name: t("Calcium") },
    //     { width: "10%", name: t("Iron") },
    //     { width: "10%", name: t("Zinc") },
    // ];
    useEffect(() => {
        handleDietTiming();
        handleDietFlor();
        handleWardSelection();
    }, []);

    const handleSelectTabel = async (value, index, name, val) => {

        let data = JSON.parse(JSON.stringify(tableResponse))
        data[index][name] = value

        if (name === "DietType") {
            handleSubDietDropDown(value, index, name)
        } else if (name === "SubDiet") {
            handleMenuDropDown(value, index, name, val)
        } else {
            setTableResponse(data)
        }
    }



    const handleAddDepartment = async (val) => {
        const formattedDate = moment(values?.fromDate).format("YYYY-MM-DD");

        const payload = {
            // dietTimeID: val?.OrderTime?.toString) ?? "0",
            dietTimeID: "2",
            subDietID: val?.DietType?.SubdietID?.toString() ?? "0",
            menuID: val?.Menu?.DietMenuID?.toString() ?? "0",
            ipdCaseTypeID: val?.IPDCaseTypeID?.toString() ?? "0",
            panelID: val?.PanelID?.toString() ?? "0",
            tid: val?.TransactionID?.toString() ?? "0",
            room_ID: val?.RoomID?.toString() ?? "0",
            isFreeze: val?.IsFreeze?.toString() ?? "0",
            patientID: val?.PatientID?.toString() ?? "0",
            requestDate: formattedDate,
        };

        const handleSaveAll = () => {
            notify('SAVE BUTTON CLICK', "success")
            console.log('Data to save:', pateintCompoTable);
            setHandleModelData((val) => ({ ...val, isOpen: false }));
        }

        const apiResp = await GetComponent(payload);
        // debuggers
        if (apiResp?.success) {
            const tableData = apiResp?.data?.data
            setPateintCompoTable(tableData);
            setHandleModelData({
                label: t("Component Name"),
                buttonName: t("Save"),
                width: "80vw",
                isOpen: true,
                handleInsertAPI: handleSaveAll,
                Component: (
                    <>
                        <PatientDietRequestModal
                            pateintCompoTable={tableData}
                            setPateintCompoTable={setPateintCompoTable}
                            onSave={handleSaveAll}
                        />
                    </>
                ),
            });
            notify(apiResp?.message, "success");
        } else {
            notify(apiResp?.message, "error");
        }


    };
    const handleReceive = () => {

    }


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
            <div className="mt-2 card">
                <Heading isBreadcrumb={true} />

                <div className="row p-2">
                    <DatePicker
                        id="fromDate"
                        width
                        name="fromDate"
                        lable={t("From Date")}
                        value={values?.fromDate || new Date()}
                        handleChange={handleChange}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        className="custom-calendar"
                        maxDate={values?.toDate}
                    />

                    <ReactSelect
                        placeholderName={t("Floor")}
                        searchable
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="Floor"
                        name="Floor"
                        // removeIsClearable 
                        dynamicOptions={dietFloor}
                        handleChange={handleSelect}
                        value={values?.Floor}
                    />

                    <ReactSelect
                        placeholderName={t("Ward")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="Ward"
                        name="Ward"
                        removeIsClearable={true}
                        dynamicOptions={PateintWard}
                        handleChange={handleSelect}
                        value={values?.Ward}
                    />

                    <ReactSelect
                        placeholderName={t("Diet Timing")}
                        searchable
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="DietTiming"
                        name="DietTiming"
                        // removeIsClearable
                        requiredClassName="required-fields"
                        dynamicOptions={dietTimingOptions}
                        handleChange={handleSelect}
                        value={values?.DietTiming}

                    />
                    <button className="btn btn-sm btn-success py-0 px-1 mt-1 mb-1 p-3" onClick={handleMapSearchDiet}>
                        {t("Search")}
                    </button>
                </div>

                <Heading
                    title=""
                    isBreadcrumb={false}
                    secondTitle={
                        <>
                            <ColorCodingSearch label={t("Fixed")} color="lightcyan" />
                            <ColorCodingSearch label={t("Freezed")} color="lemonchiffon" />
                            <ColorCodingSearch label={t("Issued")} color="yellowgreen" />
                            <ColorCodingSearch label={t("Received")} color="lightseagreen" />
                            <ColorCodingSearch label={t("Pending")} color="pink" />
                        </>
                    }
                />

                {tableResponse.length > 0 && (
                    <div className="card">
                        <Tables
                            thead={TheadSearchTable}
                            tbody={tableResponse?.map((val, index) => {
                                console.log("Table row data:", val);
                                return ({

                                    sno: index + 1,
                                    // Type: val?.Type,
                                    IPDNO: val?.IPDNo,
                                    UHID: val?.PatientID,
                                    PatientName: val?.PName,
                                    DietType: <CustomSelect
                                        placeHolder={t("Diet Type")}
                                        searchable={true}
                                        id="DietType"
                                        name="DietType"
                                        option={val?.DietTypeList}
                                        onChange={(name, value) => { handleSelectTabel(value, index, "DietType", val) }}
                                        value={val?.DietType?.value}
                                    />,
                                    SubDiet: <CustomSelect
                                        placeHolder={t("Sub Diet")}
                                        searchable={true}
                                        id="SubDiet"
                                        name="SubDiet"
                                        option={val?.SubDietList}
                                        onChange={(name, value) => { handleSelectTabel(value, index, "SubDiet", val) }}
                                        value={val?.SubDiet?.value}
                                    />,
                                    Menu: <CustomSelect
                                        placeHolder={t("Menu")}
                                        searchable={true}
                                        id="Menu"
                                        name="Menu"
                                        option={val?.menuList}
                                        onChange={(name, value) => { handleSelectTabel(value, index, "Menu", val) }}
                                        value={val?.Menu?.value}
                                    />,

                                    pateintCompo: (
                                        <div className="d-flex justify-content-center align-items-center">
                                            <FaSearch onClick={() => handleAddDepartment(val)} />
                                        </div>
                                    ),

                                    pateintRec: <button className="btn btn-sm btn-success py-0 px-1 tbl-btn d-flex justify-content-center align-items-center " onClick={handleReceive} >
                                        {t("Receive")}
                                    </button>,
                                    attendanceCompo: (
                                        <div className="d-flex justify-content-center align-items-center">
                                            <FaSearch />
                                        </div>
                                    ),
                                    attendanceRec: <button className="btn btn-sm btn-success py-0 px-1 tbl-btn d-flex justify-content-center " >
                                        {t("Receive")}
                                    </button>,
                                })
                            })}
                            style={{ maxHeight: "60vh" }}
                        />
                    </div>
                )}
            </div>

        </>
    )
}

export default PatientDietRequest