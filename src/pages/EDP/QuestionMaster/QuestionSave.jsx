import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Input from '../../../components/formComponent/Input';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { useSelector } from 'react-redux';
import Heading from '../../../components/UI/Heading';
import { handleReactSelectDropDownOptions, notify } from '../../../utils/utils';
import { POBindCategoryApprovalMaster, PODeleteApprovalMaster, PoMasterBindApprovalMaster } from '../../../networkServices/Purchase';
import Tables from '../../../components/UI/customTable';
import TextAreaInput from '../../../components/formComponent/TextAreaInput';
import { FeedBackDeleteQuestionMaster, FeedBackSaveQuestionMaster, FeedBackSearchQuestionMaster, FeedBackUpdateQuestionMaster, GetQuestionDepartment } from '../../../networkServices/edpApi';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import SaveDepartment from './SaveDepartment';
import Modal from '../../../components/modalComponent/Modal';
export default function QuestionMaster() {
    const [modalData, setModalData] = useState({ visible: false })
    const { VITE_DATE_FORMAT } = import.meta.env;
    const { GetRoleList } = useSelector((state) => state?.CommonSlice);

    const [poMasterData, setPoMasterData] = useState([])
    const [bindDetails, setBindDetails] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    let [t] = useTranslation()
    const [dropDownState, setDropDownState] = useState({
        GetQueDEPT: [],

    })
    const [values, setValues] = useState({

        roleID: {},
        Question: "",
        toDate: moment().format("YYYY-MM-DD"),
        fromDate: moment().format("YYYY-MM-DD"),
        rearchroleID: { label: "ALL", value: "ALL" },
        questionID: ""

    });

    console.log("values", values)

    const POCategoryApprovalMaster = async () => {
        try {
            const Category = await POBindCategoryApprovalMaster();
            if (Category?.success) {
                setDropDownState((val) => ({
                    ...val,
                    Category: handleReactSelectDropDownOptions(
                        Category?.data,
                        "Name",
                        "CategoryID"
                    ),
                }));

            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const GetQuestionDepartmentList = async () => {
        try {
            const response = await GetQuestionDepartment();
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    GetQueDEPT: handleReactSelectDropDownOptions(
                        response?.data,
                        "DepartmentName",
                        "DepartmentID"
                    ),
                }));

            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

    const getBindApprovalMaster = async () => {

        try {
            const BindApprovalMaster = await PoMasterBindApprovalMaster();
            if (BindApprovalMaster?.success) {

                setPoMasterData(BindApprovalMaster?.data)
            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const deleteItem = async (val) => {
        console.log("val", val)
        const payload = {
            "departmentID": val?.DepartmentID,
            "questionID": val?.QuestionID
        }
        try {
            const response = await FeedBackDeleteQuestionMaster(payload)
            if (response?.success) {


                handleSearch()
            }
            else {
                notify("warn", response?.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    useEffect(() => {
        getBindApprovalMaster()
        GetQuestionDepartmentList()
        POCategoryApprovalMaster()
    }, [])

    const handleSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
        // console.log("name",name,value)
        // if(name==="centreId"){
        //     getBindEmplyee(value?.value)
        // }
    }
    const searchHandleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevState) => ({
            ...prevState,
            [name]: moment(value).format("YYYY-MM-DD"),
        }));
    };
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))

    }
    const handleSave = async () => {
        if (!values?.roleID?.value || !values?.Question) {
            notify("Please fill all required fields.", "error");
            return;
        }
        try {
            let payload = {
                "department": String(values?.roleID?.value),
                "question": String(values?.Question)
            }

            const response = await FeedBackSaveQuestionMaster(payload);
            console.log(response.data)
            if (response.success) {
                notify(response?.message, "success");
                console.log(response.data)
                setValues((preV) => ({
                    ...preV,
                    Question: ""
                }))
            } else {
                notify(response?.message, "error");
                console.error(
                    "API returned success as false or invalid response:",
                    response
                );

            }
        } catch (error) {
            console.error("Error fetching department data:", error);

        }
    }
    const handleSearch = async () => {

        try {
            let payload = {
                "department": String(values?.rearchroleID?.value),
                "fromDate": "",
                "toDate":"",
            }


            const response = await FeedBackSearchQuestionMaster(payload);
            console.log(response.data)
            if (response.success) {
                setBindDetails(response.data)

                console.log(response.data)

            } else {
                notify(response?.message, "error");

            }
        } catch (error) {
            console.error("Error ", error);

        }
    }
    const handleUpdate = async (val) => {

        try {
            let payload = {
                "departmentID": values?.roleID,
                "questionID": values?.questionID,
                "question": values?.Question
            }

            const response = await FeedBackUpdateQuestionMaster(payload);
            console.log(response.data)
            if (response.success) {
                setValues((preV) => ({
                    ...preV,
                    roleID: {},
                    Question: "",

                    rearchroleID: { label: "ALL", value: "ALL" },
                    questionID: ""
                }))
                notify(response?.message, "success");
                console.log(response.data)
                setIsEdit(false)
                handleSearch()
            } else {
                notify(response?.message, "error");
                console.error(
                    "API returned success as false or invalid response:",
                    response
                );

            }
        } catch (error) {
            console.error("Error fetching department data:", error);

        }
    }

    const handleEdit = (val) => {

        setIsEdit(true)
        setValues((preV) => ({
            ...preV,
            Question: val?.Question,
            roleID: val?.DepartmentID,
            questionID: val?.QuestionID
        }))
        // console.log("val", val)
    }

    const handleOpen = () => {

        setModalData({
            visible: true,
            width: "30vw",
            Heading: "60vh",
            label: t("Department Add"),
            footer: <></>,
            Component: <SaveDepartment setModalData={setModalData} GetQuestionDepartmentList={GetQuestionDepartmentList} />,

        })

    }
    return (
        <>{modalData?.visible && (
            <Modal
                visible={modalData?.visible}
                setVisible={() => { setModalData({ visible: false }) }}
                modalData={modalData?.URL}
                modalWidth={modalData?.width}
                Header={modalData?.label}
                buttonType="button"
                footer={modalData?.footer}
            >
                {modalData?.Component}
            </Modal>
        )}
            <div className=" spatient_registration_card card">
                <Heading
                    title={t("sampleCollectionManagement.sampleCollection.heading")}
                    isBreadcrumb={true}
                />
                <div className="row px-2 pt-2">
                    {/* <ReactSelect
                        placeholderName={t(
                            "Department"
                        )}
                        id={"Department"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                        requiredClassName="required-fields"
                        dynamicOptions={GetRoleList?.map((ele) => {
                            return {
                                label: ele?.roleName,
                                value: ele?.deptLedgerNo,
                            };
                        })}
                        name={"roleID"}
                        value={values.roleID}
                        handleChange={handleSelect}
                        isDisabled={isEdit?true:false}
                    //   handleChange={handleReactSelectChange}
                    />  */}
                    <div className="col-xl-2 col-md-2 col-sm-6 col-12">
                        <div className="box-size">
                            <div className="box-upper">
                                <ReactSelect
                                    placeholderName={t(
                                        "Department"
                                    )}
                                    id={"Department"}
                                    searchable={true}
                                    // respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                                    requiredClassName="required-fields"
                                    dynamicOptions={dropDownState?.GetQueDEPT}

                                    name={"roleID"}
                                    value={values.roleID}
                                    handleChange={handleSelect}
                                    isDisabled={isEdit ? true : false}
                                //   handleChange={handleReactSelectChange}
                                />

                            </div>
                            <div className="box-inner">
                                <button
                                    className="btn btn-sm btn-primary"
                                    type="button"
                                    onClick={handleOpen}
                                >
                                    <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                        <TextAreaInput
                            id="Question"
                            lable={t("Question")}
                            rows={"1"}
                            className="w-100 required-fields h-24"

                            //   onFocus={onFocus}
                            name="Question"
                            value={values.Question}
                            onChange={handleChange}
                            placeholder=" "
                        />
                    </div>


                    <div className=" col-sm-2 col-xl-2">

                        {
                            isEdit ? <div className='gap-2'>
                                <button className="btn btn-sm btn-success mr-2" type="button" onClick={handleUpdate}>
                                    {t("Update")}
                                </button>
                                <button className="btn btn-sm btn-success" type="button"
                                    onClick={() => setIsEdit(false)}
                                >
                                    {t("Cancel")}
                                </button>
                            </div> :
                                <button className="btn btn-sm btn-success" type="button" onClick={handleSave}>
                                    {t("Save")}
                                </button>
                        }

                    </div>
                </div>


            </div>
            <div className=' spatient_registration_card card'>
                <Heading
                    title={t("Department Question List")}
                    isBreadcrumb={false}

                />
                <div className="row px-2 pt-2">
                    <ReactSelect
                        placeholderName={t(
                            "Department"
                        )}
                        id={"Department"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                        requiredClassName="required-fields"
                        dynamicOptions={[
                            { label: "ALL", value: "ALL" },
                            ...(dropDownState?.GetQueDEPT)
                        ]}
                        name={"rearchroleID"}
                        value={values.rearchroleID?.value}
                        handleChange={handleSelect}
                    //   handleChange={handleReactSelectChange}
                    />
                    {/* <DatePicker
                        className="custom-calendar"
                        id="From Data"
                        name="fromDate"
                        lable={t("From Date")}
                        placeholder={VITE_DATE_FORMAT}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        value={
                            values.fromDate
                                ? moment(values.fromDate, "YYYY-MM-DD").toDate()
                                : null
                        }
                        maxDate={new Date()}
                        handleChange={searchHandleChange}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="DOB"
                        name="toDate"
                        lable={t("To Date")}
                        value={
                            values.toDate
                                ? moment(values.toDate, "YYYY-MM-DD").toDate()
                                : null
                        }
                        maxDate={new Date()}
                        handleChange={searchHandleChange}
                        placeholder={VITE_DATE_FORMAT}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    /> */}
                    <div className=" col-xl-2 col-md-3 col-sm-6 col-12">
                        <button className="btn btn-sm btn-success" type="button" onClick={handleSearch}>
                            {t("Search")}
                        </button>

                    </div>
                    <Tables
                        thead={
                            [
                                { width: "1%", name: t("SNo") },
                                { name: t("Department") },
                                { name: t("Question") },
                                { name: t("EntryDate") },
                                { name: t("EntryBy") },

                                { name: t("Edit") },
                                { width: "2%", name: t("Delete") },
                                // { width: "1%", name: t("Reject") },

                            ]

                        }
                        tbody={bindDetails?.map((val, index) => ({

                            sno: index + 1,
                            Department: val.DepartmentName,
                            Question: val.Question || "",
                            EntryDate: val.EntryDate || "",
                            EntryBy: val.EntryBy || "",

                            Edit: (
                                <span
                                    onClick={() => handleEdit(val)}
                                >
                                    <i className="fa fa-edit text-edit" />
                                </span>
                            ),
                            Delete: (
                                <span
                                    onClick={() => deleteItem(val)}
                                >
                                    <i className="fa fa-trash text-danger" />
                                </span>
                            ),

                        }))}
                    />
                </div>
            </div>
        </>
    )
}

