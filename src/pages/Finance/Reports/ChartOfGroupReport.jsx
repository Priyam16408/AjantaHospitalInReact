import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { BindChartOfAccount, BindGroupTable, bindMainGroupAPI, ChartOfGroupExcel, ChartOfUpdateGroupName, FinanceBindBranchCentre, SaveNewGroupAPI, searchGetParentsData } from '../../../networkServices/finance';
import { handleReactSelectDropDownOptions, notify } from '../../../utils/utils';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import CentreWiseRecordModal from '../Master/ChartOfGroup/CentreWiseRecordModal';
import ChartOfAccountModal from '../Master/ChartOfGroup/ChartOfAccountModal';
import { exportToExcel } from '../../../utils/exportLibrary';
import { transformDataInTranslate } from '../../../components/WrapTranslate';
import { ExcelIconSVG } from '../../../components/SvgIcons';
import UpdateGroupNameModal from '../Master/ChartOfGroup/UpdateGroupNameModal';
import { buildHierarchyTree } from '../../../utils/ustil2';
import TreeViewTable from '../../../components/UI/customTable/TreeViewTable';
import Heading from '../../../components/UI/Heading';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import Input from '../../../components/formComponent/Input';
import Modal from '../../../components/modalComponent/Modal';
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp';

const ChartOfGroupReport = () => {
    const [t] = useTranslation()
    const thead = [{ name: t("Code") }, { name: t("Group Name"), width: "70%" }, { name: t("Amount") }]
    const [bodyData, setBodyData] = useState([])
    //   console.log("bodyData",bodyData)
    const [mainGroupList, setMainGroupList] = useState([])

    const [values, setValues] = useState({
        BranchCentre: []
    })
    //   console.log("values",values)
    const ip = useLocalStorage("ip", "get")
    const [modalData, setModalData] = useState({ visible: false });
    const [dropDownState, setDropDownState] = useState({
        BindCentres: []
    })
    const handleMultiSelectChange = (name, selectedOptions) => {
        // console.log("name, selectedOptions",name, selectedOptions)
        setValues({
            ...values,
            [name]: selectedOptions,
        });
    };

    const data = [
        {
            id: 1,
            groupName: "Group A",
            children: [
                {
                    id: 2,
                    groupName: "Group A.1",
                    children: [
                        {
                            id: 3,
                            groupName: "Group A.1.1",
                            children: [
                                {
                                    id: 4,
                                    groupName: "Group A.1.1.1",
                                    children: [
                                        {
                                            id: 5,
                                            groupName: "Group A.1.1.1.1",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 122,
                    groupName: "Group A.1",
                    children: [
                        {
                            id: 222,
                            groupName: "Group A.1.1",
                            children: [
                                {
                                    id: 44444,
                                    groupName: "Group A.1.1.1",
                                    children: [
                                        {
                                            id: 22323,
                                            groupName: "Group A.1.1.1.1",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 2,
            groupName: "Group A",
            children: [
                {
                    id: 22,
                    groupName: "Group A.1",
                    children: [
                        {
                            id: 33,
                            groupName: "Group A.1.1",
                            children: [
                                {
                                    id: 42,
                                    groupName: "Group A.1.1.1",
                                    children: [
                                        {
                                            id: 52,
                                            groupName: "Group A.1.1.1.1",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    const handleClick = async (val, type, ind) => {
        console.log("handleClick val", val, type, ind);
    
        if (type === "close" || type === "open") {
            const CentreID = values?.BranchCentre?.map((val) => val?.code).join(",");
            if (!CentreID) {
                notify("Branch Centre is Required", "error");
                return;
            }
    
            let payload = {
                BranchCentreID: CentreID,
                ParentsID: val?.id
            };
    
            let newBodyData = toggleChildren(bodyData, val.id, payload);
            setBodyData(newBodyData);
        }
    };
    
    // 🏆 **Recursive Function for Toggle Open/Close**
    const toggleChildren = (data, parentId, payload) => {
        return data.map((item) => {
            if (item.id == parentId) {
                if (item?.children?.length > 0) {
                    // 🛑 Already Open → Close it
                    return { ...item, children: [] };
                } else {
                    // ✅ Closed → Fetch Data and Open it
                    return fetchChildrenData(item, payload);
                }
            } else if (item?.children?.length > 0) {
                return { ...item, children: toggleChildren(item.children, parentId, payload) };
            }
            return item;
        });
    };
    
    // 📡 **Function to Fetch Children from API**
    const fetchChildrenData = (item, payload) => {
        searchGetParentsData(payload).then((apiResp) => {
            if (apiResp?.success) {
                let newChildren = apiResp?.data?.map((value) => ({
                    id: value?.GroupCode,
                    groupName: value?.GroupName,
                    Amount: value?.Amount,
                    children: []
                }))
                .reverse(); // 🔄 Reverse the order of children
    
                setBodyData((prevData) => updateChildren(prevData, item.id, newChildren));
            } else {
                notify(apiResp?.message, "error");
            }
        });
    
        return {
            ...item,
            children: [{ loading: true }] //  Show loading indicator before fetching data
        };
    };
    
    // 🔄 **Recursive Function to Update Fetched Children**
    const updateChildren = (data, parentId, newChildren) => {
        return data.map((item) => {
            if (item.id == parentId) {
                return { ...item, children: newChildren };
            } else if (item?.children?.length > 0) {
                return { ...item, children: updateChildren(item.children, parentId, newChildren) };
            }
            return item;
        });
    };
   

    const handleUpdateName = async (data) => {
        let payload = {
            "name": String(data?.GroupName),
            "gid": String(data?.GroupCode)
        }
        let apiResp = await ChartOfUpdateGroupName(payload)
        if (apiResp?.success) {
            notify(apiResp?.message)
            setBodyData()
            //   getBindGroupTable()
            setModalData((val) => ({ ...val, visible: false }))
        } else {
            notify(apiResp?.message, "error")
        }
    }

    const handleEdit = (e, val) => {
        e.stopPropagation()
        setModalData({
            visible: true,
            width: "20vw",
            modalData: val,
            label: t("Update Name"),
            buttonName: t("Update"),
            CallAPI: handleUpdateName,
            // footer: <></>,
            Component: <UpdateGroupNameModal inputData={val} setModalData={setModalData} />,
        });
    }

    const getBindGroupTable = async () => {
        const apiResp = await BindGroupTable();
        if (apiResp?.success) {
            const newResp = apiResp?.data?.map((val) => ({ ...val, GroupName: <span> {val?.GroupName} </span> }))
            let data = buildHierarchyTree(newResp, [])
            setBodyData(data)
        }
    }

    const bindCantre = async () => {
        let apiResp = await FinanceBindBranchCentre()
        if (apiResp?.success) {
            setDropDownState((val) => ({
                ...val,
                BindCentres: handleReactSelectDropDownOptions(
                    apiResp?.data,
                    "CentreName",
                    "CentreID"
                ),
            }));
            setMainGroupList(handleReactSelectDropDownOptions(apiResp?.data, "CentreName", "CentreID"))
        }
    }


    useEffect(() => {
        bindCantre()
        // getBindGroupTable()
        // bindMainGroup()
    }, [])

    //   console.log("valuesvalues",values)
    const handelSearchGroup = async () => {
        const CentreID = values?.BranchCentre?.map((val) => val?.code).join(",");
        if (!CentreID) {
            notify("Branch Centre is Required", "error")
            return
        }
        let payload = {
            BranchCentreID: CentreID,
            ParentsID: "0"
        }
        // console.log("payload",payload)
        const apiResp = await searchGetParentsData(payload)
        if (apiResp?.success) {
            //   setValues({})
            //   notify(apiResp?.message)
            //   getBindGroupTable()


            const newResp = apiResp?.data?.map((val) => ({ ...val, GroupName: <span> {val?.GroupName} </span>, }))
            let data = buildHierarchyTree(apiResp?.data, ["Amount"])
            console.log("data", data)
            setBodyData(data)
        } else {
            notify(apiResp?.message, "error")
        }
    }



    return (<>
        <div className="mt-2 spatient_registration_card">
            <div className="patient_registration card p-2">
                {/* <Heading title={t("Chart Of Group")} isBreadcrumb={false} /> */}
              
                {/* <Heading isBreadcrumb={true} title={"Patient Return"} secondTitle={<span onClick={handleExportExcel}>
                <ExcelIconSVG />
                 </span>}/> */}


                <div className="row p-2">
                    {/* {console.log("dropDownState?.BindCentres",dropDownState?.BindCentres)} */}
                    <MultiSelectComp
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="BranchCentre"
                        id="BranchCentre"
                        placeholderName={t("Branch Centre")}
                        // dynamicOptions={[]}
                        dynamicOptions={dropDownState?.BindCentres?.map((ele) => ({
                            code: ele?.CentreID,
                            name: ele?.CentreName
                        }))}
                        //     code: ele?.CentreID,
                        //     name: ele?.CentreName,
                        // }))}
                        handleChange={handleMultiSelectChange}
                        value={values?.BranchCentre}
                        requiredClassName={`required-fields`}
                    />


                    <div className="col-xl-1 col-md-2 col-sm-2 col-4">
                        <button className="btn btn-sm btn-success px-4" type='button' onClick={handelSearchGroup} >{t("Search")}</button>
                    </div>
                    {/* <div className="col-xl-2 col-md-2 col-sm-2 col-4">
            <button className="btn btn-sm btn-success" type='button' onClick={centreWiseRecord}>{t("View Centre Wise Record")}</button>
          </div> */}

                </div>

                {console.log("bodyData", bodyData)}

                <TreeViewTable thead={thead}
                    tbody={bodyData}

                    isSNo={false} isTreeOpen={true} handleClick={handleClick} style={{ maxHeight: "63vh" }} />
            </div>
        </div>

        {/* {modalData?.visible && (
      <Modal
        visible={modalData?.visible}
        setVisible={() => {
          setModalData((val) => ({ ...val, visible: false }));
        }}
        modalData={modalData?.modalData}
        modalWidth={modalData?.width}
        Header={modalData?.label}
        buttonType="button"
        buttonName={modalData?.buttonName}
        footer={modalData?.footer}
        handleAPI={modalData?.CallAPI}
      >
        {modalData?.Component}
      </Modal>
    )} */}

    </>

    );
};

export default ChartOfGroupReport;
