import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import CancelButton from '../../../components/UI/CancelButton';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import Tables from "../../../components/UI/customTable/index.jsx";
export default function ViewItem({ handleClose, inputData, storeType }) {
    const [t] = useTranslation();

    const ip = useLocalStorage("ip", "get")
    const { employeeID } = useLocalStorage("userData", "get")

    const [inputs, setInputs] = useState(inputData)
    const handlechange = (e) => {
        setInputs((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    // useEffect(() => {
    //     handleChangeModel(inputs)
    // }, [inputs])



    

    return (<>
        <div className="row p-2">

            <Tables 
            thead={
                [
                    "Department Name",
                    "Item Name",
                    "Current Stock",
                    "Average Consumption"

                ]
            }
            tbody={
                [
                    {
                      storeType:  storeType,
                      ItemName: inputData.ItemName,
                    CurrentStock: inputData.CurrentStock? inputData.CurrentStock : "0" ,
                   AverageStock: inputData.AvgConsumption? inputData.AvgConsumption : "0"
                }
                ]
            }
            />


        </div>
        <div className="ftr_btn">

            <CancelButton
                cancleBtnName={"Close"}
                onClick={() => handleClose()}
            />
        </div>

    </>
    )
}
