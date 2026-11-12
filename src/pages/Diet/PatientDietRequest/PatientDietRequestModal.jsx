import React from 'react';
import { useTranslation } from 'react-i18next';
import Tables from '../../../components/UI/customTable';
import Input from '../../../components/formComponent/Input';

const PatientDietRequestModal = ({
    pateintCompoTable,
    setPateintCompoTable,
    onSave
}) => {
    // debugger
    const [t] = useTranslation();

    console.log("Pateint", pateintCompoTable)
    // const [bindingData , setBindingData] = useState

    // const pateintCompoTable = Array.isArray(pateintCompoTable) ? pateintCompoTable : [];
    // console.log("safeCompo", pateintCompoTable)

    const TheadSearchTable1 = [
        {
            width: "5%",
            name: (
                <input
                    type="checkbox"
                    checked={
                        pateintCompoTable.length > 0 &&
                        pateintCompoTable.every(item => item.checked)
                    }
                    onChange={(e) => {
                        if (pateintCompoTable.length > 0) {
                            const updated = pateintCompoTable.map(item => ({
                                ...item,
                                checked: e.target.checked,
                            }));
                            setPateintCompoTable(updated);
                        }
                    }}
                />
            ),
        },
        { width: "5%", name: t("SNo") },
        { width: "10%", name: t("Component Name") },
        { width: "10%", name: t("QTY") },
        { width: "10%", name: t("Rate") },
        { width: "10%", name: t("Type") },
        { width: "10%", name: t("Unit") },
        { width: "10%", name: t("Calories") },
        { width: "10%", name: t("Protein") },
        { width: "10%", name: t("Sodium") },
        { width: "10%", name: t("SaturatedFat") },
        { width: "10%", name: t("T_Fat") },
        { width: "10%", name: t("Calcium") },
        { width: "10%", name: t("Iron") },
        { width: "10%", name: t("Zinc") },
    ];

    // const handleSave = () => {
    //     if (onSave) {
    //         onSave();
    //     }
    // };

    return (
        <>
            <div className="card">
                <Tables
                    thead={TheadSearchTable1}
                    tbody={pateintCompoTable?.map((val, index) =>
                    ({
                        select: (
                            <input
                                type="checkbox"
                                checked={val?.checked || false}
                                onChange={(e) => {
                                    const updated = [...pateintCompoTable];
                                    updated[index].checked = e.target.checked;
                                    setPateintCompoTable(updated);
                                }}
                            />
                        ),
                        sno: index + 1,
                        CompoenntName: val?.ComponentName || '',
                        QTY: (
                            <Input
                                type="number"
                                className="form-control"
                                value={val?.qty || ''}
                                onChange={(e) => {
                                    const updated = [...pateintCompoTable];
                                    updated[index].qty = e.target.value;
                                    setPateintCompoTable(updated);
                                }}
                                placeholder="0"
                                style={{ minWidth: "50px" }}
                            />
                        ),
                        Rate: val?.RateListID || "0",
                        TYpe: val?.Type || '',
                        Unit: val?.Type || '',
                        Calories: val?.Calories || '',
                        Protein: val?.Protein || '',
                        Sodium: val?.Sodium || '',
                        SaturatedFat: val?.SaturatedFat || '',
                        T_Fat: val?.T_Fat || '',
                        Calcium: val?.Calcium || '',
                        Iron: val?.Iron || '',
                        zinc: val?.zinc || '',
                    })
                    )}
                    style={{ maxHeight: "50vh" }}
                />
                
            </div>
        </>
    );
};

export default PatientDietRequestModal;