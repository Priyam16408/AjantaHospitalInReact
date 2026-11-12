import React, { useState } from 'react'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next'
import CreateItemMaster from '../ItemManagment/CreateItemMaster';
import SlideScreen from '../../../components/front-office/SlideScreen';
import SeeMoreSlideScreen from '../../../components/UI/SeeMoreSlideScreen';
import EDPSeeMoreList from '../EDPSeeMoreList';
import Heading from '../../../components/UI/Heading';
import IPDpkgMasterMain from '../PackageManagment/IPDpkgMasterMain';
import OPDpkgMasterMain from '../PackageManagment/OPDpkgMasterMain';
import CreateLab from '../LaboratoryManagement/CreateLab';
import SurgeryMaster from '../SurgeryManagement/SurgeryMaster';

export default function AccessMasters({ data }) {
    const [t] = useTranslation()
    const masters = [
        { label: "Item Master", value: "1" },
        { label: "Store Item Master", value: "2" },
        { label: "Investigation Master", value: "3" },
        { label: "OPD Package Master", value: "4" },
        { label: "IPD Package Master", value: "5" },
        { label: "Surgery Master", value: "6" }
    ];
    const [Type, setType] = useState("1");

    const [visible, setVisible] = useState(false);
    const [seeMore, setSeeMore] = useState([]);
    // const dispatch = useDispatch()
    const [renderComponent, setRenderComponent] = useState({
        name: "",
        component: null,
    });
    const handleChangeComponent = (e) => {
        ModalComponent(e?.label, e?.component);
    };
    const ModalComponent = (name, component) => {
        setVisible(true);
        setRenderComponent({
            name: name,
            component: component,
        });
    };
    
    const handleRenderComponent = (type) => {

        if (type === "1") {
            return <CreateItemMaster  data={data}/>
        } else if (type === "2") {
            return <>Not Found </>
        } else if (type === "3") {
            return <CreateLab data={data}/>
        } else if (type === "4") {
            return <OPDpkgMasterMain data={data}/>
        } else if (type === "5") {
            return <IPDpkgMasterMain data={data}/>
        } else if (type === "6") {
            return <SurgeryMaster data={data}/>
        } 

    }
    return (
        <>
            <div className="spatient_registration_card">
                <div className="patient_registration card">
                    <Heading
                        title={t("Access Master")}
                        isBreadcrumb={false}
                    />

                    <div className='row p-2'>
                        <ReactSelect
                            placeholderName={t("Type")}
                            id="Type"
                            requiredClassName={"required-fields"}
                            name="Type"
                            removeIsClearable={true}
                            value={Type}
                            handleChange={(name, e) => setType(e?.value)}
                            dynamicOptions={masters}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />


                    </div>

                </div>
            </div>
            {handleRenderComponent(Type)}
            <SlideScreen
                visible={visible}
                setVisible={() => {
                    setVisible(false);
                    setRenderComponent({
                        name: null,
                        component: null,
                    });
                }}
                Header={
                    <SeeMoreSlideScreen
                        name={renderComponent?.name}
                        seeMore={seeMore}
                        handleChangeComponent={handleChangeComponent}
                    />
                }
            >
                {renderComponent?.component}
            </SlideScreen>
        </>
    )
}
