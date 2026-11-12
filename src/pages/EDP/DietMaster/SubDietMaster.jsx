import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { GetDietType, GetMapSubDiet, MapSubDietSave } from "../../../networkServices/EDP/pragyaedp";
import {
    handleReactSelectDropDownOptions,
    reactSelectOptionList,
} from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import { notify } from "../../../utils/ustil2";

export default function SubDietMaster({ handleChangeModel, inputData }) {
    const [t] = useTranslation();
    const initialValues = { SelectedCentre: "", floorCentre: [] };
    const [dietTypes, setDietTypes] = useState([]);
    const [values, setValues] = useState({ ...initialValues });
    console.log("values", values)
    const [selectedDietType, setSelectedDietType] = useState(null);
    
    const [selectedSubDietIds, setSelectedSubDietIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    console.log("Selected", selectedDietType)
    const [dropDownState, setDropDownState] = useState({
        DietType: [],
    });

  

    const [showtable, setShowTable] = useState();
    console.log("showtable", showtable);

    const TheadSearchTable = [
        { width: "5%", name: t("SNo") },
        { width: "25%", name: t("SUb Diet Name") },
        { width: "25%", name: t("Description") },
        { width: "10%", name: t("Active") },]

    const handleReactSelect = (label, value) => {
        setValues((val) => ({ ...val, [label]: value }));
        setSelectedDietType(value);

        if (handleChangeModel) {
            handleChangeModel({ ...values, [label]: value });
        }
    };
    const fetchDietTypes = async () => {
        try {
            const apiResp = await GetDietType();
            if (apiResp && apiResp?.success) {
                const dropDownData = {
                    DietType: [
                        ...handleReactSelectDropDownOptions(apiResp?.data?.data, "NAME", "DocumentID"),
                    ],

                };
                setDropDownState(dropDownData)
            } else {
                console.error("Failed to fetch diet types:", apiResp?.message);
            }
        } catch (error) {
            console.error("Error loading diet type data:", error);
        }
    };
    const handleTablData = async () => {
        try {
            const apiResp = await GetMapSubDiet();
            if (apiResp && apiResp.success) {
                notify("sucessfully dat saved", "sucess")
                setShowTable(apiResp?.data);
                console.log("modal", apiResp?.data)
            } else {
                console.error("Failed to fetch diet types:", apiResp?.message);
            }
        } catch (error) {
            console.error("Error loading diet type data:", "error");
        }
    }

    useEffect(() => {
        fetchDietTypes();
        handleTablData();
    }, []);
    const getDietTypeOptions = () => {
        const options =
            dietTypes.length > 0
                ? dietTypes.map((diet) => ({
                    value: diet.DietID,
                    label: diet.NAME,
                }))
                : [];

        return options;
    };

    const fetchData = async () => {
        try {
            const payload = values?.DietType?.DietID ?? 0;
            const apiResp = await GetMapSubDiet(payload);
            if (apiResp.success) {
                setShowTable(apiResp?.data?.data)

            } else {
                notify(apiResp?.message, "error");
                console.log('error in response:', apiResp);
            }
        } catch (error) {
            console.error("Error loading centre data:", error);
            notify("An error occurred while loading centre data", "error");
        }
    }

     const handleCheckboxChange = (id) => {
        setSelectedSubDietIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        const allIds = showtable.map((item) => item?.subDietID);
        if (selectAll) {
            setSelectedSubDietIds([]);
        } else {
            setSelectedSubDietIds(allIds);
        }
        setSelectAll(!selectAll);
    };

    const handleSaveSubDiet = async () => {
        // console.log("the id is", ID)
        const payload = {
            "dietID": 0,
            "selectedSubDietIds": [
                0
            ],
            "createdBy": "string"
        }
        try {
            const apiResp = await MapSubDietSave(payload);
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

       const thead = [ 
        { name: (   <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                />), width: "1%" },
        { name: "Sub Diet Type" },
        { name: "Description" },
        { name: "Active" }
    ]

    useEffect(() => {
        fetchData();
    }, [values?.DietType?.DietID])
    return (
        <>
            <div className="mt-2">
                <div className="row p-2">
                    <ReactSelect
                        placeholderName={t("Select Diet Type")}
                        name="DietType"
                        className="w-100"
                        value={values?.DietType}
                        handleChange={(name, e) => handleReactSelect(name, e)}
                        // dynamicOptions={getDietTypeOptions()}
                        dynamicOptions={dropDownState?.DietType}
                        removeIsClearable={true}
                        searchable={true}
                        respclass="col-xl-12 col-md-7 col-sm-8 col-12"
                    />
                </div>

                {showtable?.length > 0 && (
                    <div className="card">
                        <Tables
                            thead={thead}
                            tbody={showtable?.map((val, index) => {
                                console.log("Table row data:", val);
                                return ({
                                    sno: (
                                           <input
                                    type="checkbox"
                                    checked={selectedSubDietIds.includes(val?.subDietID)}
                                    onChange={() => handleCheckboxChange(val?.subDietID)}
                                />
                                    ),
                                    DietType: val?.name,
                                    Description: val?.description,
                                    Status: val?.isActive,
                                })
                            })}
                        />
                    </div>
                )}
                <div className="col-sm-2 col-md-4 col-xl-6 col-12">
                    <button
                        className="btn btn-sm btn-success py-1 px-2 mt-1 ml-1 "
                        onClick={handleSaveSubDiet}
                    >
                        {t("Save")}
                    </button>
                </div>

            </div>
        </>
    );
}
 