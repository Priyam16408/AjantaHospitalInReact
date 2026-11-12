import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import { useTranslation } from 'react-i18next'
import Tables from '../../../components/UI/customTable'
import WrapTranslate from '../../../components/WrapTranslate'
import SlideScreen from '../../../components/front-office/SlideScreen'
import SeeMoreSlideScreen from '../../../components/UI/SeeMoreSlideScreen'
import { useDispatch } from 'react-redux'
import EDPSeeMoreList from '../EDPSeeMoreList'
import { LoadPrescriptionView } from '../../../networkServices/EDP/edpApi'
import { BindFrameMenuByRoleID } from '../../../store/reducers/common/CommonExportFunction'
import { useSelector } from 'react-redux'
import { PageIconSVG } from '../../../components/SvgIcons'

export default function CentreManagementTable({ data, body, centreList, handleSearch }) {
    const [t] = useTranslation()
    const tHead = [
        { name: "S.No." },
        { name: "Action" },
        { name: "Center Name" },
        { name: "Address", width: "40%" },
        { name: "Contact" },
        { name: "Centre Code" },
        { name: "Latitude" },
        { name: "Longitude" },
        { name: "Active" },
    ];
    const [visible, setVisible] = useState(false);
    const [seeMore, setSeeMore] = useState([]);
    const dispatch = useDispatch()
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



    const { BindFrameMenuByRoleIDS } = useSelector((state) => state?.CommonSlice);
    useEffect(() => {
        dispatch(BindFrameMenuByRoleID({ frameName: "EDP-CENTRE" }));
    }, [])


    return (
        <>
            <Heading
                title={data?.breadcrumb}
                data={data}
                isBreadcrumb={true}
                isSlideScreen={true}
                frameName="EDP-CENTRE"

                secondTitle={<><EDPSeeMoreList
                    ModalComponent={ModalComponent}
                    setSeeMore={setSeeMore}
                    data={{ centreList: centreList }}
                    isRemoveSvg={true}
                    setVisible={() => { setVisible(false); handleSearch(); }}
                    handleBindFrameMenu={[{
                        "FileName": "Add Centre",
                        "URL": "CenterMaster",
                        "FrameName": "EDP-CENTRE",
                        "Description": "CenterMaster"
                    }]}
                    openFirstItem={false}
                    name={<button className='btn text-white '> {t("Create Centre")} </button>
                    }
                />
                </>}
            />
            <Tables thead={WrapTranslate(tHead, "name")} isSearch={true} tbody={body?.map((val, index) => ({
                Sno: index + 1,
                Select: (
                    <>
                        <EDPSeeMoreList
                            ModalComponent={ModalComponent}
                            setSeeMore={setSeeMore}
                            data={{ ...val, centreList: centreList }}
                            setVisible={() => {

                                handleSearch()
                                setVisible(false);
                            }}
                            handleBindFrameMenu={BindFrameMenuByRoleIDS}
                            isShowPatient={true}
                        />
                    </>
                ),
                CentreName: val?.CentreName,
                Address: <div style={{ whiteSpace: "normal", width: "100%" }}>{val?.Address}</div>,
                MobileNo: val?.MobileNo,
                CentreCode: val?.CentreCode,
                Latitude: val?.Latitude,
                Longitude: val?.Longitude,
                Active: val?.Active,

            }))} />
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
