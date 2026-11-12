import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Input from '../../../../components/formComponent/Input';
import ReactSelect from '../../../../components/formComponent/ReactSelect';
import { useSelector } from 'react-redux';
import Heading from '../../../../components/UI/Heading';
import { handleReactSelectDropDownOptions, notify } from '../../../../utils/utils';
import { POApprovalMasterBindEmployee, POApprovalMasterSave, POBindCategoryApprovalMaster, PODeleteApprovalMaster, PoMasterBindApprovalMaster, PurchaseBindGetItems } from '../../../../networkServices/Purchase';
import Tables from '../../../../components/UI/customTable';
export default function ApprovalMaster() {
    const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
    const [poMasterData, setPoMasterData] = useState([])
    let [t] = useTranslation()
    const [dropDownState, setDropDownState] = useState({
        BindEmplyee: [],
        Category: []
    })
    const [values, setValues] = useState({
        ToAmount: "",
        FromAmount: "",
        EmployeeName: {},
        Category: {},
        centreId: {},
    });
console.log("values",values)
    const getBindEmplyee = async (centreID) => {

        try {
            const BindEmplyee = await POApprovalMasterBindEmployee(centreID);
            if (BindEmplyee?.success) {
                setDropDownState((val) => ({
                    ...val,
                    BindEmplyee: handleReactSelectDropDownOptions(
                        BindEmplyee?.data,
                        "EmployeeName",
                        "EmployeeID"
                    ),
                }));

            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
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
    const deleteItem = async (ID) => {

        try {
            const response = await PODeleteApprovalMaster(ID)
            if (response?.success) {
                notify("success","deleted")
                notify("success",response?.message)
                getBindApprovalMaster()
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    useEffect(() => {
        getBindApprovalMaster()
        // getBindEmplyee()
        POCategoryApprovalMaster()
    }, [])
    const handleSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
        console.log("name",name,value)
        if(name==="centreId"){
            getBindEmplyee(value?.value)
        }
    }
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
       
    }
    const handleSave = async () => {
        if (!values?.FromAmount || !values?.ToAmount || !values?.Category?.CategoryID || !values?.centreId?.value) {
            notify("Please fill all required fields.", "error");
            return;
        }
        try {
            let payload =
            {
                "poApproval": [
                    {
                        "employeeId": values?.EmployeeName?.value,

                        "fromAmount": values?.FromAmount ? values?.FromAmount : 0,
                        "toAmount": values?.ToAmount ? values?.ToAmount : 0,
                        "categoryId": values?.Category?.CategoryID,
                        "centreId": values?.centreId?.value,
                        // "entryDate": "2024-12-10",
                        // "entryBy": "komalsingh"
                    },
                ]
            }
            const response = await POApprovalMasterSave(payload);
            console.log(response.data)
            if (response.success) {
                notify(response?.message, "success");
                console.log(response.data)
                getBindApprovalMaster()
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
    return (
        <>
            <div className="m-2 spatient_registration_card card">
                <Heading
                    title={t("sampleCollectionManagement.sampleCollection.heading")}
                    isBreadcrumb={true}
                />
                <div className="row p-2">
                    <ReactSelect
                        placeholderName={t("CentreName")}
                        dynamicOptions={GetEmployeeWiseCenter?.map((ele) => {
                            return { label: ele.CentreName, value: ele.CentreID };
                        })}
                        searchable={true}
                        name="centreId"
                        value={values?.centreId}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        handleChange={handleSelect}
                        // handleChange={handleReactSelect}
                        requiredClassName="required-fields"
                    />
                    {console.log("values?.EmployeeName",values)}
                    <ReactSelect
                        placeholderName={t("EmployeeName")}
                        id={"EmployeeName"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        // dynamicOptions={SampleCollected}
                        dynamicOptions={dropDownState?.BindEmplyee}
                        handleChange={handleSelect}
                        value={`${values?.EmployeeName}`}
                        name={"EmployeeName"}
                        requiredClassName="required-fields"
                    />
                     <Input
                        type="number"
                        className="form-control required-fields"
                        id="FromAmount"
                        name="FromAmount"
                        value={values?.FromAmount ? values?.FromAmount : ""}
                        onChange={handleChange}
                        lable={t("From Amount")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />

                    <Input
                        type="number"
                        className="form-control required-fields"
                        id="ToAmount"
                        name="ToAmount"
                        value={values?.ToAmount ? values?.ToAmount : ""}
                        // onChange={handleChange}
                        onChange={(e) => {
                            if (e.target.value.length <= 10) {
                              handleChange(e);
                            }
                          }}
                        lable={t("To Amount")}
                        max={10}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />
                   
                    <ReactSelect
                        placeholderName={t("Category")}
                        id={"Category"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={dropDownState?.Category}
                        handleChange={handleSelect}
                        value={`${values?.Category?.value}`}
                        name={"Category"}
                    />

                    <div className=" col-sm-2 col-xl-2">
                        <button className="btn btn-sm btn-success" type="button" onClick={handleSave}>
                            {t("Save")}
                        </button>
                    </div>
                </div>

                <Heading
                    title={t("Approval Master List")}
                    isBreadcrumb={false}

                />
            </div>
            <div className="mt-2 spatient_registration_card">
                <Tables
                    thead={
                        [
                            { width: "1%", name: t("SNo") },
                            { name: t("CentreName") },
                            { name: t("EmployeeName") },
                            { name: t("EntryDate") },
                            { name: t("EntryBy") },
                            { name: t("FromAmount") },
                            { name: t("ToAmount") },
                            { name: t("Category") },
                            { width: "2%", name: t("Delete") },
                            // { width: "1%", name: t("Reject") },

                        ]

                    }
                    tbody={poMasterData?.map((val, index) => ({

                        sno: index + 1,
                        CentreName: val.CentreName,
                        EmployeeName: val.EmployeeName || "",
                        EntryDate: val.EntryDate || "",
                        EntryBy: val.EntryBy || "",
                        FromAmount: val.FromAmount || "",

                        // reject: <i className="fa fa-trash text-danger" /> || "",
                        ToAmount: val?.ToAmount || "",
                        CategoryName: val?.CategoryName || "",
                        Delete: (
                            <span
                                onClick={() => deleteItem(val?.Id)}
                            >
                                <i className="fa fa-trash text-danger" />
                            </span>
                        ),

                    }))}
                />
            </div>
        </>
    )
}

