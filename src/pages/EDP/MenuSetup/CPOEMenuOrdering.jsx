import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading';
import EDPSeeMoreList from '../EDPSeeMoreList';
import SlideScreen from '../../../components/front-office/SlideScreen';
import SeeMoreSlideScreen from '../../../components/UI/SeeMoreSlideScreen';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import Tables from '../../../components/UI/customTable';
import CustomSelect from '../../../components/formComponent/CustomSelect';
import CustomDragAndDropTable from '../../../components/UI/customTable/CustomDragAndDropTable';
import { useEffect } from 'react';
import { MenuSetupBindAllMenuAPI, MenuSetupBindLoginTypeAPI } from '../../../networkServices/EDP/mayankedp';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';

export default function CPOEMenuOrdering({ data }) {

    const [t] = useTranslation()
    const [values, setValues] = useState({ Type: { value: "1" } })
    const [roleList, setRoleList] = useState([])
    const [bodyData, setBodyData] = useState([])
    const [payloadDataList, setPayloadDataList] = useState([])

    const thead = [
        { name: t("S.No."), width: "1%" },
        { name: t("Menu Name"), width: "10%" },
        { name: t("Sequesnce Number"), width: "1%" },
        { name: t("Active"), width: "1%" },
    ];

    const [visible, setVisible] = useState(false);
    const [seeMore, setSeeMore] = useState([]);
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

    const handleSelect = async (name, value) => {
        if (name === "Type") {
            let apiResp = await MenuSetupBindAllMenuAPI(values?.Role?.value, value?.value)
            if (apiResp?.success) {
                setBodyData(apiResp?.data)
            } else {
                setBodyData([])
            }
        } else {
            let apiResp = await MenuSetupBindAllMenuAPI(value?.value, values?.Type?.value)
            if (apiResp?.success) {
                setBodyData(apiResp?.data)
            } else {
                setBodyData([])
            }
        }
        setValues((prev) => ({ ...prev, [name]: value }));
    };
    const handleActiveIActive = (name, e, index) => {
        let data = JSON.parse(JSON.stringify(bodyData));
        data[index][name] = e?.value;
        setBodyData(data);
    };

    const MenuSetupBindLoginType = async () => {
        let apiResp = await MenuSetupBindLoginTypeAPI();
        if (apiResp?.success) {
            setRoleList(apiResp?.data)
        }
        console.log("first", apiResp)
    }

    useEffect(() => {
        MenuSetupBindLoginType()
    }, [])

    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">

                    <Heading
                        title={data?.breadcrumb}
                        data={data}
                        isBreadcrumb={true}
                        isSlideScreen={true}
                        frameName="EDP-CENTRE"

                    // secondTitle={<><EDPSeeMoreList
                    //     ModalComponent={ModalComponent}
                    //     setSeeMore={setSeeMore}
                    //     data={{}}
                    //     isRemoveSvg={true}
                    //     setVisible={() => { setVisible(false)}}
                    //     handleBindFrameMenu={[{
                    //         "FileName": "Add Centre",
                    //         "URL": "CenterMaster",
                    //         "FrameName": "EDP-CENTRE",
                    //         "Description": "CenterMaster"
                    //     }]}
                    //     openFirstItem={false}
                    //     name={<button className='btn text-white'> {t("Create Centre")} </button>
                    //     }
                    // />
                    // </>
                    // }
                    />

                    <div className='row p-2'>
                        <ReactSelect
                            placeholderName={t("Role")}
                            id={"Role"}
                            searchable={true}
                            removeIsClearable={true}
                            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            dynamicOptions={handleReactSelectDropDownOptions(roleList, "RoleName", "ID")}
                            handleChange={handleSelect}
                            value={values?.Role?.value}
                            name={"Role"}
                        />
                        <ReactSelect
                            placeholderName={t("Type")}
                            id={"Type"}
                            searchable={true}
                            removeIsClearable={true}
                            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            dynamicOptions={[
                                { "label": "CPOE Menu", "value": "1" },
                                { "label": "Prescription Tab", "value": "2" },
                            ]}
                            handleChange={handleSelect}
                            value={values?.Type?.value}
                            name={"Type"}
                        />
                    </div>

                    {bodyData?.length > 0 &&
                        <>
                            <CustomDragAndDropTable thead={thead} setTbody={setBodyData} tbody={bodyData?.map((val, index) => ({
                                SNO: index + 1,
                                MenuName: val?.MenuName,
                                SeqNum: index + 1,
                                IsActive: (
                                    <CustomSelect
                                        option={[
                                            { label: "Active", value: "1" },
                                            { label: "In Active", value: "0" },
                                        ]}
                                        placeHolder={"Select"}
                                        name="IsActive"
                                        isRemoveSearchable={true}
                                        value={val?.IsActive}
                                        onChange={(name, e) => handleActiveIActive(name, e, index)}
                                    />
                                ),
                            }))} />

                            <div className="mt-2 mb-1 text-right">
                                <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields"
                                    type="button">
                                    {t("Save")}
                                </button>
                            </div></>
                    }
                </div>
            </div>
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
