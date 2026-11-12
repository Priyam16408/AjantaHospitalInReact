import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next';
import Input from '../../../components/formComponent/Input';
import { DietComponentBindGrid, DietComponentMasterSave, DietComponentMasterUpdate } from '../../../networkServices/EDP/pragyaedp';
import Tables from '../../../components/UI/customTable';
import { notify } from '../../../utils/utils';

const ComponentMaster = () => {

    const initialValue = {
        CompoenetName: "",
        Calories: "",
        Description: "",
        SaturatedFat: "",
        Protein: "",
        Sodium: "",
        TFat: "",
        Calcium: "",
        Iron: "",
        Zinc: "",
        Type: "",
        Status: { label: "Yes", value: "1" },
        Unit: "",
        ComponentID: "",
        itemID: "",
    }
    const [t] = useTranslation();

    const StatusOptions = [
        { label: "YES", value: "1" },
        { label: "NO", value: "0" }
    ];

    const TypeOptions = [
        { label: "Select", value: "0" },
        { label: "Solid", value: "1" },
        { label: "Liquid", value: "2" },
        { label: "Powder", value: "3" },
        { label: "Paste", value: "4" },
        { label: "Semi-Solid", value: "5" },
        { label: "Grains", value: "6" },
    ]

    const UnitOptions = [
        { label: "Select", value: "0" },
        { label: "Soup Laddle", value: "1" },
        { label: "Piece", value: "2" },
        { label: "Slice", value: "3" },
        { label: "Roll", value: "4" },
        { label: "1Tbs", value: "5" },
        { label: "Whole", value: "6" },
        { label: "Teaspoon", value: "7" },
        { label: "Tablespoon", value: "8" },
        { label: "Triangle", value: "9" },
        { label: "Cup", value: "10" },
        { label: "Pallet", value: "11" },
        { label: "Finger", value: "12" },
        { label: "Bowl", value: "13" },
        { label: "Ball", value: "14" },
        { label: "Stew Laddle", value: "15" },
        { label: "Cup 200 ml", value: "16" },
        { label: "Plate", value: "17" },
        { label: "Set", value: "18" },
    ]

    const [roommasterSearchData, setRoomMasterSearchData] = useState([]);
    const [showbtn, setSHowBtn] = useState(true);
    const [ID, setId] = useState("");

    const [values, setValues] = useState({...initialValue})

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelect = (name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleEditClick = (rowData) => {
        setId(rowData.ID);

        setValues({
            CompoenetName: rowData.Name || "",
            Calories: rowData.Calories || "",
            Description: rowData.Description || "",
            SaturatedFat: rowData.SaturatedFat || "",
            Protein: rowData.Protein || "",
            Sodium: rowData.Sodium || "",
            TFat: rowData.TFat || "",
            Calcium: rowData.Calcium || "",
            Iron: rowData.Iron || "",
            Zinc: rowData.Zinc || "",
            Type: {value:rowData?.Type},
            Status: rowData?.IsActive === "Yes" ? { value: "1" } : { value: "0" },
            Unit:   {label:rowData?.Unit,value: rowData?.Unit},
            ComponentID: rowData.ComponentID,
            itemID: rowData.itemID || "",
        });
        setSHowBtn(false);
    }

    const TheadSearchTable = [
        { width: "3%", name: t("SNo") },
        { width: "8%", name: t("Component Name") },
        { width: "5%", name: t("Description") },
        { width: "8%", name: t("Type") },
        { width: "8%", name: t("Unit") },
        { width: "4%", name: t("Calories(Kcal)	") },
        { width: "5%", name: t("Protein(g)") },
        { width: "5%", name: t("Sodium(g)") },
        { width: "5%", name: t("Saturated Fat(g)") },
        { width: "5%", name: t("TFat(g)") },
        { width: "5%", name: t("Calcium(mg)") },
        { width: "5%", name: t("Iron(mg)") },
        { width: "5%", name: t("Zinc(mg)") },
        { width: "5%", name: t("Active") },
        { width: "5%", name: t("Edit") },
    ];

    const handleDietBindGrid = async () => {
        try {
            const apiResp = await DietComponentBindGrid();
            if (apiResp.success) {
                setRoomMasterSearchData(apiResp?.data)
                console.log('dataoftable', apiResp?.data)
            } else {
                notify(apiResp?.message, "error");
                console.log('error in response:', apiResp);
            }
        } catch (error) {
            console.error("Error loading centre data:", error);
            notify("An error occurred while loading centre data", "error");
        }
    }

    const handleSaveDietChart = async () => {
        if (!values.CompoenetName || values.CompoenetName.trim() === "") {
            notify("Please fill Component Name", "error");
            return;
        }

        if (!values.Type || values.Type.value === "0") {
            notify("Please Select Type", "error");
            return;
        }

        if (!values.Unit || values.Unit.value === "0") {
            notify("Please Select Unit", "error");
            return;
        }

        const payload = {
            "typeName": values?.CompoenetName,
            "description": values?.Description,
            "isActive": values?.Status?.value,
            "type": values?.Type?.label,
            "unit": values?.Unit?.label,
            "calories": values?.Calories,
            "protein": values?.Protein,
            "sodium": values?.Sodium,
            "saturatedFat": values?.SaturatedFat,
            "tFat": values?.TFat,
            "calcium": values?.Calcium,
            "iron": values?.Iron,
            "zinc": values?.Zinc
        }
        try {
            const apiResp = await DietComponentMasterSave(payload);
            if (apiResp?.success) {
                console.log("the apiresponse is in the table", apiResp?.data?.CompoenetName);
                notify(apiResp?.message, "success");
                setSHowBtn(true);
                handleDietBindGrid();
                clearForm();
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.error("Error loading surgery data:", error);
            notify("An error occurred while loading surgery data", "error");
        }
    }

    const handelUpdateDietChart = async () => {
        if (!values.CompoenetName || values.CompoenetName.trim() === "") {
            notify("Please fill Component Name", "error");
            return;
        }

        if (!values.Type || values.Type.value === "0") {
            notify("Please select Type", "error");
            return;
        }

        if (!values.Unit || values.Unit.value === "0") {
            notify("Please select Unit", "error");
            return;
        }

        console.log("the id is", ID);

        const payload = {
            "id": ID,
            "typeName": values?.CompoenetName,
            "description": values?.Description,
            "isActive": values?.Status?.value,
            "type": values?.Type?.label,
            "unit": values?.Unit?.label,
            "calories": values?.Calories,
            "protein": values?.Protein,
            "sodium": values?.Sodium,
            "saturatedFat": values?.SaturatedFat,
            "tFat": values?.TFat,
            "calcium": values?.Calcium,
            "iron": values?.Iron,
            "zinc": values?.Zinc,
            "itemId": values?.itemID
        }
        try {
            const apiResp = await DietComponentMasterUpdate(payload);
            if (apiResp?.success) {
                console.log("the apiresponse is in the table", apiResp?.data);
                notify(apiResp?.message, "success");
                setSHowBtn(true);
                handleDietBindGrid();
                clearForm();
            } else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.error("Error loading surgery data:", error);
            notify("An error occurred while loading surgery data", "error");
        }
    }

    const clearForm = () => {
        setValues(initialValue);
    }

    const handleCancel = () => {
        setSHowBtn(true);
        clearForm();
    }

    useEffect(() => {
        handleDietBindGrid();
    }, [])

    return (
        <>
            <div className="mt-2 card">
                <Heading
                    title={t("Master")}
                    isBreadcrumb={false}
                />
                <div className="row mb-2 mt-2">
                    <Input
                        type="text"
                        className="form-control required-fields"
                        id="CompoenetName"
                        name="CompoenetName"
                        value={values?.CompoenetName}
                        onChange={handleChange}
                        lable={t("Component Name")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"

                    />
                    <Input
                        type="number"
                        className="form-control "
                        id="Calories"
                        name="Calories"
                        value={values?.Calories}
                        onChange={handleChange}
                        lable={t("Calories (KCal)")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"

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
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"

                    />
                    <Input
                        type="number"
                        className="form-control "
                        id="Protein"
                        name="Protein"
                        value={values?.Protein}
                        onChange={handleChange}
                        lable={t("Protein")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"

                    />
                    <Input
                        type="number"
                        className="form-control "
                        id="SaturatedFat"
                        name="SaturatedFat"
                        value={values?.SaturatedFat}
                        onChange={handleChange}
                        lable={t("SaturatedFat")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"

                    />
                    <Input
                        type="number"
                        className="form-control "
                        id="Sodium"
                        name="Sodium"
                        value={values?.Sodium}
                        onChange={handleChange}
                        lable={t("Sodium")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"

                    />
                    <Input
                        type="number"
                        className="form-control "
                        id="TFat"
                        name="TFat"
                        value={values?.TFat}
                        onChange={handleChange}
                        lable={t("TFat")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"

                    />
                    <Input
                        type="number"
                        className="form-control "
                        id="Calcium"
                        name="Calcium"
                        value={values?.Calcium}
                        onChange={handleChange}
                        lable={t("Calcium")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"

                    />
                    <Input
                        type="number"
                        className="form-control "
                        id="Iron"
                        name="Iron"
                        value={values?.Iron}
                        onChange={handleChange}
                        lable={t("Iron")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"

                    />
                    <Input
                        type="number"
                        className="form-control "
                        id="Zinc"
                        name="Zinc"
                        value={values?.Zinc}
                        onChange={handleChange}
                        lable={t("Zinc")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"

                    />
                    <ReactSelect
                        placeholderName={t("Status")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        id="Status"
                        name="Status"
                        removeIsClearable={true}
                        dynamicOptions={StatusOptions}
                        handleChange={handleSelect}
                        value={values?.Status?.value}
                        defaultValue={values?.Status?.label}
                    />

                    

                    <ReactSelect
                        placeholderName={t("Type")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        className="form-control"
                        requiredClassName={"required-fields"}
                        id="Type"
                        name="Type"
                        removeIsClearable={true}
                        dynamicOptions={TypeOptions}
                        handleChange={handleSelect} 
                        value={values?.Type?.value}
                        defaultValue={values?.Type?.value}
                    />

                    <ReactSelect
                        placeholderName={t("Unit")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        className="form-control"
                        requiredClassName={"required-fields"}
                        id="Unit"
                        name="Unit"
                        removeIsClearable={true}
                        dynamicOptions={UnitOptions}
                        handleChange={handleSelect}
                        value={values?.Unit?.value}
                    />

                    {showbtn ? (
                        <button
                            className="btn btn-sm btn-success py-1 px-2 mt-1"
                            style={{ width: "70px" }}
                            onClick={handleSaveDietChart}
                        >
                            {t("Save")}
                        </button>
                    ) : (
                        <button
                            className="btn btn-sm btn-success py-1 px-2 mt-1"
                            style={{ width: "70px" }}
                            onClick={handelUpdateDietChart}
                        >
                            {t("Update")}
                        </button>
                    )}

                    <button
                        className="btn btn-sm btn-success py-1 px-2 mt-1 ml-1"
                        style={{ width: "70px" }}
                        onClick={handleCancel}
                    >
                        {t("Cancel")}
                    </button>
                </div>
                <Heading
                    title={t("Diet Type Detail")}
                    isBreadcrumb={false}
                />
                {roommasterSearchData.length > 0 && (
                    <div className="card">
                        <Tables
                            thead={TheadSearchTable}
                            tbody={roommasterSearchData?.map((val, index) => {
                                // console.log("Table row data:", val);
                                return ({
                                    sno: index + 1,
                                    CompoenetName: val.Name || "",
                                    Description: val.Description || "",
                                    Type: val.Type || "",
                                    Unit: val.Unit || "",
                                    Calories: val.Calories || "",
                                    Protein: val.Protein || "",
                                    Sodium: val.Sodium || "",
                                    SaturatedFat: val.SaturatedFat || "",
                                    TFat: val.T_Fat || "",
                                    Calcium: val.Calcium || "",
                                    Iron: val.Iron || "",
                                    Zinc: val.Zinc || "",
                                    Status: val.IsActive,
                                    Edit: <i
                                        className='fa fa-edit'
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => { handleEditClick(val) }}
                                    />
                                })
                            })}
                            style={{maxHeight:"60vh"}}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default ComponentMaster