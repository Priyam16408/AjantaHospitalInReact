import React, { Fragment } from 'react'
import PatientRegistration from "../../pages/frontOffice/PatientRegistration/Index";
import PanelDetails from '../front-office/PanelDetails';

// PatientID, setVisible, bindDetailAPI,handleBindPanelByPatientID
export default function SeeMoreList(BindSeeMoreListData, PatientRegistrationArg) {
    let seeMore = []
    BindSeeMoreListData?.map((item) => {
        let obj = {}
        if (item?.MenuURL === "PatientRegistration") {
            obj.name = item?.MenuName
            obj.component = <PatientRegistration PatientID={PatientRegistrationArg?.PatientID} type={"update"} setVisible={PatientRegistrationArg?.setVisible} bindDetail={true} bindDetailAPI={PatientRegistrationArg?.bindDetailAPI} />
        } else if (item?.MenuURL==="Add/RemovePanelsList") {
            obj.name = item?.MenuName
            obj.component = <PatientRegistration  PatientID={PatientRegistrationArg?.PatientID} type={"panelDetail"} setVisible={PatientRegistrationArg?.setVisible} bindDetail={true} bindDetailAPI={PatientRegistrationArg?.bindDetailAPI} updateButtonName={"Update Panel"} handleBindPanelByPatientID={PatientRegistrationArg?.handleBindPanelByPatientID}/>
        }else {
            obj.name = item?.MenuName
            obj.component = <Fragment />
        }
        seeMore.push(obj);
    });



    return seeMore;
}
