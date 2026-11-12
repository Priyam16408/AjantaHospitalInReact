

import React, { useEffect, useState } from 'react'
import ReactSelect from '../../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next';
import { FinaceCopyMapping, FInanceBindMainCenter } from '../../../../networkServices/finance';
import { handleReactSelectDropDownOptions, notify } from '../../../../utils/utils';
import MultiSelectComp from '../../../../components/formComponent/MultiSelectComp';

const CopyMapping = ({ setModalData }) => {
    const [allCenter, setAllCentre] = useState([])
    const [dropDownState, setDropDownState] = useState({
        BindCentre: [],

    });

    const [values, setValues] = useState({
        fromCentre: "",
        toCentre: []
    })
    const [t] = useTranslation();

    const handleReactChange = (name, e, key) => {
        setValues((val) => ({ ...val, [name]: e }));
    };
    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues({ ...values, [name]: selectedOptions });
    };
    const getBindCenter = async () => {
        try {
            const response = await FInanceBindMainCenter();
            console.log("first response", response)
            setAllCentre(response?.data)
            setDropDownState((val) => ({
                ...val,
                BindCentre: handleReactSelectDropDownOptions(
                    response?.data,
                    "CentreName",
                    "MainCentreID"
                ),
            }));
            setValues((preV) => ({
                ...preV,
                fromCentre: response.data[0]
            }))
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    useEffect(() => {
        getBindCenter()
    }, [])


    const filteredToCentreOptions =allCenter.filter((centre)=>centre.MainCentreID !==values?.fromCentre?.MainCentreID).map((centre)=>({
        name: centre?.CentreName,
        code: centre?.MainCentreID,
    }))
    let fromtCentreDropdown = allCenter.map((val) => ({

        name: val?.CentreName,
        code: val?.MainCentreID,

    }))
    console.log("values",values)
    const handleSave = async() => {
        if (!values.fromCentre || values.toCentre.length === 0) {
            console.error("Please select both From Centre and To Centre.");
            notify("Please select both From Centre and To Centre.", "error"); 
            return;
        }

       

       try {
        const payload = values.toCentre.map(toCentre => ({
            fromCentreID: values.fromCentre.MainCentreID,
            toCentreID: toCentre.code
        }));
        const response= await FinaceCopyMapping(payload)
        if(response?.success){
             notify(response?.message, "success"); 
             setModalData((val) => ({ ...val, visible: false }))
        }
        else{
            notify(response?.message, "error"); 
        }
       } catch (error) {
        
       }
  
    };

    return (
        <div className="row p-2">

            <ReactSelect
                placeholderName={t("From Centre")}
                // requiredClassName={"required-fields"}
                searchable={true}
                respclass="col-xl-4 col-md-3 col-sm-6 col-12"
                id={"fromCentre"}
                name={"fromCentre"}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={dropDownState?.BindCentre}
                value={values?.fromCentre?.MainCentreID}
            />

            <MultiSelectComp
                respclass="col-xl-4 col-md-3 col-sm-6 col-12"
                name="toCentre"
                id="toCentre"
                placeholderName={t("To Centre")}
                dynamicOptions={filteredToCentreOptions}

                handleChange={handleMultiSelectChange}
                value={values?.toCentre}
            />
 <button className="btn btn-sm btn-primary ml-2"
  onClick={handleSave}
  >   
               {t("Save")}
           </button>
        </div>
    )
}

export default CopyMapping
