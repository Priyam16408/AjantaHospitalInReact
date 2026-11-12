import React from "react";
import Tables from "../../../UI/customTable/index";
import { useTranslation } from "react-i18next";
const index = ({ tbody,thead,tableHeight }) => {

    const [t] = useTranslation();
   
    return (
        <>
            <Tables
                thead={thead}
                tbody={tbody}
                // tableHeight={tableHeight}
                style={{height:"60vh"}}
            />
        </>
    );
};

export default index;
