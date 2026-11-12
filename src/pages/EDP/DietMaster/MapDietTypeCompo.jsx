import React, { useEffect, useState } from 'react';
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import Input from '../../../components/formComponent/Input';
import { notify } from '../../../utils/ustil2';
import {
    BindSubMenu,
    Diettiming,
    GetDietType,
    MapDietSave,
    MapDietSearch,
    MenuName
} from '../../../networkServices/EDP/pragyaedp';
import Tables from '../../../components/UI/customTable';

const MapDietTypeCompo = () => {
    const [t] = useTranslation();

    const initialValue = {
        DietTiming: "",
        DietType: "",
        DietSpecialisation: "",
        MenuName: "",
        componentName: "",
        CreatedBy: "",
        subDietID: "",
    }
    const [values, setValues] = useState({ ...initialValue });

    const [dietTimingOptions, setDietTimingOptions] = useState([]);
    const [dietTypeOption, setDietTypeOption] = useState([]);
    const [dataSpecOption, setDataSpecOption] = useState([]);
    const [dataMenuNameSelection, setDataMenuNameSelection] = useState([]);
    const [tableResponse, setTableResponse] = useState([]);
    const [selectedRows, setSelectedRows] = useState({});
    const [editableQty, setEditableQty] = useState({});
    const [nutritionTotals, setNutritionTotals] = useState({
        Calories: 0,
        Protein: 0,
        Sodium: 0,
        SaturatedFat: 0,
        T_Fat: 0,
        Calcium: 0,
        Iron: 0,
        Zinc: 0
    });

    const TheadSearchTable = [
        {
            width: "5%",
            name: (
                <input
                    type="checkbox"
                    onChange={(e) => {
                        const checked = e.target.checked;
                        const allSelected = {};
                        tableResponse.forEach((_, idx) => {
                            allSelected[idx] = checked;
                        });
                        setSelectedRows(allSelected);
                        localStorage.setItem("selectedRows", JSON.stringify(allSelected));
                    }}
                    checked={
                        Object.keys(selectedRows).length === tableResponse.length &&
                        Object.values(selectedRows).every((val) => val)
                    }
                />
            ),
        },
        { width: "5%", name: t("SNo") },
        { width: "25%", name: t("component Name") },
        { width: "10%", name: t("Type") },
        { width: "15%", name: t("unit") },
        { width: "10%", name: t("Calories(Kcal)") },
        { width: "5%", name: t("Protein (g") },
        { width: "5%", name: t("Sodium (g)") },
        { width: "10%", name: t("Saturated Fat (g)") },
        { width: "25%", name: t("TFat (g") },
        { width: "15%", name: t("Calcium (mg)") },
        { width: "10%", name: t("Iron (mg") },
        { width: "5%", name: t("Zinc (mg)") },
        { width: "35%", name: t("Qty") },
        { width: "10%", name: t("Previous Qty:") },
    ];

    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleRowSelect = (index) => {
        setSelectedRows((prev) => {
            const newSelection = { ...prev, [index]: !prev[index] };
            localStorage.setItem("selectedRows", JSON.stringify(newSelection));
            return newSelection;
        });
    };

    const handleQtyChange = (index, e) => {
        const newValue = e.target.value;
        if (!isNaN(newValue)) {
            const updatedQty = { ...editableQty, [index]: newValue };
            setEditableQty(updatedQty);
            localStorage.setItem("editableQty", JSON.stringify(updatedQty));
        }
    };

    const handleDietTiming = async () => {
        try {
            const apiResp = await Diettiming();
            if (apiResp.success) {
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

    const handleDietType = async () => {
        try {
            const apiResp = await GetDietType();
            if (apiResp.success) {
                const mappedOptions = apiResp.data.data.map(item => ({
                    value: item.DietID,
                    label: item.NAME
                }));
                setDietTypeOption(mappedOptions);
            } else notify(apiResp.message, "error");
        } catch (error) {
            notify("Error loading diet type data", "error");
        }
    };

    const handleSubMenu = async () => {
        try {
            const apiResp = await BindSubMenu(values?.DietType?.value);
            if (apiResp.success) {
                const mappedOptions = apiResp.data.map(item => ({
                    value: item.SubDietID,
                    label: item.Name
                }));
                setDataSpecOption(mappedOptions);
            } else notify(apiResp.message, "error");
        } catch (error) {
            notify("Error loading submenu data", "error");
        }
    };

    const handleMenuNameOption = async () => {
        try {
            const apiResp = await MenuName(values?.DietSpecialisation?.value);
            if (apiResp.success) {
                const mappedOptions = apiResp.data.map(item => ({
                    value: item.DietMenuID,
                    label: item.NAME
                }));
                setDataMenuNameSelection(mappedOptions);
            } else notify(apiResp.message, "error");
        } catch (error) {
            notify("Error loading menu name data", "error");
        }
    };

    const handleMapSearchDiet = async () => {
        try {
            const apiResp = await MapDietSearch(
                values?.DietTiming?.value,
                values?.DietType?.value,
                values?.DietSpecialisation?.value,
                values?.MenuName?.value
            );
            if (apiResp.success) {
                notify("Data fetched successfully", "success");
                setTableResponse(apiResp.data);
                const savedSelections = localStorage.getItem("selectedRows");
                const savedQty = localStorage.getItem("editableQty");
                if (savedSelections) {
                    setSelectedRows(JSON.parse(savedSelections));
                } else {
                    setSelectedRows({});
                }

                if (savedQty) {
                    setEditableQty(JSON.parse(savedQty));
                } else {
                    setEditableQty({});
                }
            } else notify(apiResp.message, "error");
        } catch (error) {
            notify("Error loading diet data", "error");
        }
    };

    const handleSaveTableDiet = async () => {
        const payload = [];

        Object.entries(selectedRows).forEach(([index, isSelected]) => {
            if (isSelected) {
                const row = tableResponse[index];
                const qtyValue = editableQty[index] || 0;

                payload.push({
                    dietID: values?.DietType?.value || 0,
                    subDietID: values?.DietSpecialisation?.value || 0,
                    componentID: row?.ComponentID || 0,
                    subDietName: values?.DietSpecialisation?.value || "",
                    componentName: row?.Name || "",
                    qty: Number(qtyValue),
                    dietTimeID: values?.DietTiming?.value || 0,
                    dietmenuID: values?.MenuName?.value || 0,
                    createdBy: values?.CreatedBy || "EMP001"
                });
            }
        });

        if (payload.length === 0) {
            notify("Please select at least one row and enter quantity", "error");
            return;
        }

        try {
            localStorage.setItem("selectedRows", JSON.stringify(selectedRows));
            localStorage.setItem("editableQty", JSON.stringify(editableQty));

            const apiResp = await MapDietSave(payload);
            if (apiResp?.success) {
                notify(apiResp.message, "success");
            } else {
                notify(apiResp.message, "error");
            }
        } catch (error) {
            notify("Error saving diet menu", "error");
        }
    };
    useEffect(() => {
        const totals = {
            Calories: 0,
            Protein: 0,
            Sodium: 0,
            SaturatedFat: 0,
            T_Fat: 0,
            Calcium: 0,
            Iron: 0,
            Zinc: 0
        };

        Object.entries(selectedRows).forEach(([index, isSelected]) => {
            if (isSelected && editableQty[index]) {
                const qty = parseFloat(editableQty[index]);
                const row = tableResponse[index];
                if (!isNaN(qty) && row) {
                    totals.Calories += row.Calories * qty;
                    totals.Protein += row.Protein * qty;
                    totals.Sodium += row.Sodium * qty;
                    totals.SaturatedFat += row.SaturatedFat * qty;
                    totals.T_Fat += row.T_Fat * qty;
                    totals.Calcium += row.Calcium * qty;
                    totals.Iron += row.Iron * qty;
                    totals.Zinc += row.Zinc * qty;
                }
            }
        });

        setNutritionTotals(totals);
    }, [editableQty, selectedRows, tableResponse]);

    useEffect(() => {
        handleDietTiming();
        handleDietType();
    }, []);

    useEffect(() => {
        if (values?.DietType?.value) handleSubMenu();
    }, [values?.DietType]);

    useEffect(() => {
        if (values?.DietSpecialisation?.value) handleMenuNameOption();
    }, [values?.DietSpecialisation]);

    return (
        <>
            <div className="mt-2 card">
                <Heading title={t("Map")} isBreadcrumb={false} />
                <div className="row p-2">
                    <ReactSelect
                        placeholderName={t("Diet Timing")}
                        searchable
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="DietTiming"
                        name="DietTiming"
                        removeIsClearable
                        requiredClassName="required-fields"
                        dynamicOptions={dietTimingOptions}
                        handleChange={handleSelect}
                        value={values?.DietTiming}
                    />
                    <ReactSelect
                        placeholderName={t("Diet Type")}
                        searchable
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="DietType"
                        name="DietType"
                        removeIsClearable
                        requiredClassName="required-fields"
                        dynamicOptions={dietTypeOption}
                        handleChange={handleSelect}
                        value={values?.DietType}
                    />
                    <ReactSelect
                        placeholderName={t("Diet Specialisation")}
                        searchable
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="DietSpecialisation"
                        name="DietSpecialisation"
                        removeIsClearable
                        requiredClassName="required-fields"
                        dynamicOptions={dataSpecOption}
                        handleChange={handleSelect}
                        value={values?.DietSpecialisation}
                    />
                    <ReactSelect
                        placeholderName={t("Menu Name")}
                        searchable
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="MenuName"
                        name="MenuName"
                        removeIsClearable
                        requiredClassName="required-fields"
                        dynamicOptions={dataMenuNameSelection}
                        handleChange={handleSelect}
                        value={values?.MenuName}
                    />
                    <button className="btn btn-sm btn-success py-1 px-2 mt-1" onClick={handleMapSearchDiet}>
                        {t("Search")}
                    </button>
                </div>

                {tableResponse.length > 0 && (
                    <>
                        <div className="card mb-2">
                            <div className="row">
                                {Object.entries(nutritionTotals).map(([key, value]) => (
                                    <div className="col-xl-2 col-md-3 col-sm-4 col-6" key={key}>
                                        <strong>{t(key)}:</strong> {value.toFixed(2)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card">
                            <Tables
                                thead={TheadSearchTable}
                                tbody={tableResponse.map((val, index) => {
                                    const isSelected = selectedRows[index];
                                    return {
                                        Checkbox: (
                                            <input
                                                type="checkbox"
                                                checked={!!isSelected}
                                                onChange={() => handleRowSelect(index)}
                                            />
                                        ),
                                        SNo: index + 1,
                                        componentName: val?.Name,
                                        Type: val?.Type,
                                        unit: val?.Unit,
                                        Calories: val?.Calories,
                                        Protein: val?.Protein,
                                        Sodium: val?.Sodium,
                                        SaturatedF: val?.SaturatedFat,
                                        TFat: val?.T_Fat,
                                        Calcium: val?.Calcium,
                                        Iron: val?.Iron,
                                        Zinc: val?.Zinc,
                                        Qty: (
                                            <Input
                                                type="text"
                                                className="form-control"
                                                // id={`Qty_${index}`}
                                                name={`Qty_${index}`}
                                                value={editableQty[index] || ""}
                                                onChange={(e) => handleQtyChange(index, e)}
                                                placeholder="0"
                                                style={{ minWidth: "50px" }}
                                                disabled={!isSelected}
                                            />
                                        ),
                                        Previous: "0.00000",
                                    };
                                })}
                            />
                        </div>
                        <div className="d-flex justify-content-end mt-2">
                            <button className="btn btn-sm btn-success py-0 px-1 mt-1 mb-1 p-3" onClick={handleSaveTableDiet}>
                                {t("Save")}
                            </button>
                        </div>
                    </>

                )}

            </div>
        </>
    );
};

export default MapDietTypeCompo;