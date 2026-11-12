import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import { useTranslation } from 'react-i18next'
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { CentreManagementSearch, EDPBindAllCentre } from '../../../networkServices/EDP/edpApi';
import Tables from '../../../components/UI/customTable';
import WrapTranslate from '../../../components/WrapTranslate';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';
import { SelectIconSVG } from '../../../components/SvgIcons';
import CentreManagementTable from './CentreManagementTable';
import SeeMoreSlideScreen from '../../../components/UI/SeeMoreSlideScreen';
import EDPSeeMoreList from '../EDPSeeMoreList';

export default function index() {
    const [t] = useTranslation();
    const [bindData, setBindData] = useState({ centreList: [], tabelData: [] });
    const binCentreList = async () => {
        const response = await EDPBindAllCentre();
        if (response?.success) {
            setBindData((prevData) => ({ ...prevData, centreList: handleReactSelectDropDownOptions(response?.data, "CentreName", "CentreID") }));
        }
    }
    useEffect(() => {
        binCentreList();
        handleSearch()
    }, [])
    const handleSearch = async () => {
        let apiResp = await CentreManagementSearch();
        if (apiResp?.success) {
            setBindData((prevData) => ({ ...prevData, tabelData: apiResp?.data }));
        }

    }


 
 

    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                   

                    <CentreManagementTable body={bindData?.tabelData} centreList={bindData?.centreList} handleSearch={handleSearch}/>

                </div>
            </div>

        </>
    )
}
