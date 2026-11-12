import React, { useCallback, useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import {
  MRDBindCaseType,
  MRDBindDischargeType,
  MRDBindPanelIPD,
  MRDBindParentPanel,
  MRDBindPatientType,
  MRDPatientSearchMRDRecieved,
  MRDSearchGrid,
} from "../../../networkServices/MRDApi";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import {
  handleReactSelectDropDownOptions,
  MRDPatientSearchMRDRecievedPayload,
  notify,
} from "../../../utils/utils";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import { GetBindDoctorDept } from "../../../networkServices/opdserviceAPI";
import { BIND_FILE_STATUS, FromAgesTOAges } from "../../../utils/constant";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import SeeMoreSlideScreen from "../../../components/UI/SeeMoreSlideScreen";
import IconsColor from "../../../utils/IconsColor";
import { useDispatch } from "react-redux";
import { BindFrameMenuByRoleID } from "../../../store/reducers/common/CommonExportFunction";
import SlideScreen from "../../../components/front-office/SlideScreen";
import { useSelector } from "react-redux";
import MRDSeeMoreList from "../../../components/commonComponents/MRDSeeMoreList";
import { exportToExcel } from "../../../utils/exportLibrary";

const DEFAULTALLOPTION = [
  {
    label: "All",
    value: "0",
  },
];

const PatientSearchMRD = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const dispatch = useDispatch();
  const { BindFrameMenuByRoleIDS } = useSelector((state) => state?.CommonSlice);

  const [payload, setPayload] = useState({
    rdbselectedtype: "1",
    rdblAdDis: "",
    ucFromDate: new Date(),
    ucToDate: new Date(),
    patientName: "",
    pid: "",
    transactionNo: "",
    company: "",
    doctorId: "",
    roomId: "",
    loginRoomTypeID: "",
    department: "",
    ageFrom: "",
    ageTo: "",
    parentPanel: "",
    status: "2",
    patientType: "IPD",
    dischageType: "All",
  });
  const [isDisabled, setIsDisabled] = useState(false);

  const [dropDownState, setDropDownState] = useState({
    BindPatientType: [],
    BindCaseType: [],
    BindPanelIPD: [],
    BindParentPanel: [],
    BindDischargeType: [],
    BindDoctorDept: [],
  });

  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
    show: false,
  });

  const [tableData, setTableData] = useState([]);

  const handleMainMRDChecked = (e) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data.forEach((items, index) => {
      items[name] = checked;
    });
    setTableData(data);
  };

  const ModalComponent = (name, component, show) => {
    setRenderComponent({
      name: name,
      component: component,
      show: show,
    });
  };

  const THEAD = [
    {name:<input
      type="checkbox"
      checked={tableData.every((item, _) => item?.chkBox)}
      name="chkBox"
      onChange={handleMainMRDChecked}
    />},
    " ",
    t( "S.No."),
    t("PatientType"),
    t("Summary"),
    t("File Registered"),
    t("File Status"),
    t("IPD No."),
    t("UHID"),
    t("Name"),
    t("Age/Sex"),
    t("Address"),
    t("Admit Date & Time"),
    t("Discharge Date & Time"),
    t("Stay Days & Time"),
    t("DischargeType"),
    t("Day & Time After Discharge"),
    t("DoctorName"),
    t("Panel"),
    t("Room Type"),
    t("Room /Bed No"),
    t("Bill Status"),

  ];

  const handleMRDBindPatientType = async () => {
    try {
      const response = await MRDBindPatientType();
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindCaseType = async () => {
    try {
      const response = await MRDBindCaseType();
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindPanelIPD = async () => {
    try {
      const response = await MRDBindPanelIPD();
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindParentPanel = async () => {
    try {
      const response = await MRDBindParentPanel();
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindDischargeType = async () => {
    try {
      const response = await MRDBindDischargeType();
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const renderApiCall = async () => {
    store.dispatch(setLoading(true));
    try {
      const [
        BindPatientType,
        BindCaseType,
        BindPanelIPD,
        BindParentPanel,
        BindDischargeType,
        BindDoctorDept,
      ] = await Promise.all([
        handleMRDBindPatientType(),
        handleMRDBindCaseType(),
        handleMRDBindPanelIPD(),
        handleMRDBindParentPanel(),
        handleMRDBindDischargeType(),
        GetBindDoctorDept("ALL"),
      ]);
      const dropDownData = {
        BindPatientType: [
          ...DEFAULTALLOPTION,
          ...handleReactSelectDropDownOptions(
            BindPatientType?.data,
            "PType",
            "PType"
          ),
        ],
        BindCaseType: [
          ...DEFAULTALLOPTION,
          ...handleReactSelectDropDownOptions(
            BindCaseType?.data,
            "Name",
            "IPDCaseTypeID"
          ),
        ],
        BindPanelIPD: [
          ...DEFAULTALLOPTION,
          ...handleReactSelectDropDownOptions(
            BindPanelIPD?.data,
            "company_Name",
            "panelID"
          ),
        ],
        BindParentPanel: [
          ...DEFAULTALLOPTION,
          ...handleReactSelectDropDownOptions(
            BindParentPanel?.data,
            "Company_Name",
            "PanelID"
          ),
        ],
        BindDischargeType: [
          ...DEFAULTALLOPTION,
          ...handleReactSelectDropDownOptions(BindDischargeType?.data),
        ],

        BindDoctorDept: [
          ...DEFAULTALLOPTION,
          ...handleReactSelectDropDownOptions(
            BindDoctorDept?.data,
            "Name",
            "DoctorID"
          ),
        ],
      };

      setDropDownState(dropDownData);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  const handleMRDSearchGrid = async () => {
    store.dispatch(setLoading(true));
    try {
      const response = await MRDSearchGrid({
        ...payload,
        ucFromDate: moment(payload?.ucFromDate).format("DD-MMM-YYYY"),
        ucToDate: moment(payload?.ucToDate).format("DD-MMM-YYYY"),
      });
      setTableData(response?.data);
      if (!response?.success) notify(response?.message, "error");
    } catch (error) {
      console.log(error, "Something Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  const handleMRDChecked = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked;
    setTableData(data);
  };

  const handleBindFrameMenuByRoleIDS = useCallback(
    (dataBind) => {
      return dataBind?.map((items, _) => {
        return {
          ...items,
          name: items?.FileName,
        };
      });
    },
    [BindFrameMenuByRoleIDS]
  );
  const [patientDetail, setPatientDetail] = useState({});
  const handleComponentRender = async (data, items, show) => {
    setPatientDetail(data);
    const componentData = MRDSeeMoreList([items], data);
    ModalComponent(componentData[0]?.name, componentData[0]?.component, show);
    const forsetSeeMore = MRDSeeMoreList(BindFrameMenuByRoleIDS, data);
  };

  const handleTableRender = (tableData) => {
    return tableData.map((item, index) => {
      const {
        type,
        mrD_IsFile,
        dischargeSummary,
        patientID,
        pName,
        ageSex,
        address,
        admitDate,
        dischargeDate,
        stayDays,
        dischargeType,
        daysAfterDischarge,
        dName,
        company_Name,
        roomName,
        billStatus,
        chkBox,
      } = item;
      return {
        checkbox:
          String(mrD_IsFile) === "1" ? (
            ""
          ) : (
            <input
              type="checkbox"
              name="chkBox"
              checked={chkBox}
              onChange={(e) => handleMRDChecked(e, index)}
            />
          ),
        seeMore:
          String(mrD_IsFile) === "1" ? (
            <SeeMoreSlideScreen
              seeMore={handleBindFrameMenuByRoleIDS(BindFrameMenuByRoleIDS)}
              handleChangeComponent={(row) => {
                handleComponentRender(item, row, true);
              }}
            />
          ) : (
            " "
          ),
        Sno: <div className="py-2">{index + 1}</div>,
        type: type,
        // Summary: String(dischargeSummary) === "1" ? <SeeMoreSlideScreen /> : "",
        Summary: "",
        FileRegistered: null,
        FileStatus: null,
        IPDNo: null,
        UHID: patientID,
        Name: pName,
        ageSex: ageSex,
        address: address,
        admitDate: admitDate,
        dischargeDate: dischargeDate,
        stayDays: stayDays,
        dischargeType: dischargeType,
        daysAfterDischarge: daysAfterDischarge,
        dName: dName,
        company_Name: company_Name,
        roomName: roomName,
        Bed_No: "",
        billStatus: billStatus,
        colorcode: String(mrD_IsFile) === "1" ? "lightgreen" : "lightpink",
      };
    });
  };
  const ExceldataFormatter = (tableData) => {
    const HardCopy = JSON.parse(JSON.stringify(tableData));
    // debugger;
    const modifiedResponseData = HardCopy?.map((ele, index) => {
      // delete ele?.TypeID;
      // delete ele?.TypeName;
      // delete ele?.DetailID;
      // delete ele?.ColorCode;

      return { ...ele };
    });

    return modifiedResponseData;
  };

  const handleMRDPatientSearchMRDRecieved = async () => {
    store.dispatch(setLoading(true));
    try {
      const requestBody = await MRDPatientSearchMRDRecievedPayload(tableData);
      if (requestBody?.length > 0) {
        const response = await MRDPatientSearchMRDRecieved({
          mrdRecieved: requestBody,
        });
        notify(response?.message, response?.success ? "success" : "error");
        if (response?.success) handleMRDSearchGrid();
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleReactChange = (name, e, setKey) => {
    setPayload({ ...payload, [name]: e?.[setKey] });
  };

  useEffect(() => {
    renderApiCall();
    dispatch(
      BindFrameMenuByRoleID({
        frameName: "MRD",
      })
    );
  }, []);
  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            title={t("HeadingName")}
            isBreadcrumb={false}
          />
          <div className="row p-2">
            <ReactSelect
              placeholderName={t("Patient Type")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"patientType"}
              name={"patientType"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              // handleChange={handleDischargeSummaryBindHeaderList}
              dynamicOptions={dropDownState?.BindPatientType}
              value={payload?.patientType}
            />

            <Input
              type="text"
              className="form-control"
              id="pid"
              lable={t("UHID")}
              placeholder=" "
              required={true}
              value={payload?.pid}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="pid"
              onChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              id="patientName"
              lable={t("Patient Name")}
              placeholder=" "
              required={true}
              value={payload?.patientName}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="patientName"
              onChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              id="transactionNo"
              lable={t("IPDNo")}
              placeholder=" "
              required={true}
              value={payload?.transactionNo}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="transactionNo"
              onChange={handleChange}
            />

            <div className="col-xl-2 col-md-4 col-sm-6 col-12">
              <div className="row">
                <Input
                  type="text"
                  className="form-control"
                  id="ageFrom"
                  name="ageFrom"
                  value={payload?.ageFrom}
                  onChange={handleChange}
                  lable={t("From Age")}
                  placeholder=" "
                  respclass="col-md-6 col-7"
                  showTooltipCount={true}
                />
                <ReactSelect
                  placeholderName={t("Age From")}
                  searchable={true}
                  respclass="col-md-6 col-5"
                  id={"AgeFrom"}
                  name={"AgeFrom"}
                  removeIsClearable={true}
                  handleChange={(name, e) =>
                    handleReactChange(name, e, "value")
                  }
                  // handleChange={handleDischargeSummaryBindHeaderList}
                  dynamicOptions={FromAgesTOAges}
                  // value={depatmentID}
                />
              </div>
            </div>

            <div className="col-xl-2 col-md-4 col-sm-6 col-12">
              <div className="row">
                <Input
                  type="text"
                  className="form-control"
                  id="ageTo"
                  name="ageTo"
                  value={payload?.ageTo}
                  onChange={handleChange}
                  lable={t("To Age")}
                  placeholder=" "
                  respclass="col-md-6 col-7"
                  showTooltipCount={true}
                />
                <ReactSelect
                  placeholderName={t("Age To")}
                  searchable={true}
                  respclass="col-md-6 col-5"
                  id={"AgeTo"}
                  name={"AgeTo"}
                  removeIsClearable={true}
                  handleChange={(name, e) =>
                    handleReactChange(name, e, "value")
                  }
                  dynamicOptions={FromAgesTOAges}
                  // value={depatmentID}
                />
              </div>
            </div>

            <ReactSelect
              placeholderName={t("RoomType")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"roomId"}
              name={"roomId"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={dropDownState?.BindCaseType}
              value={payload?.roomId}
            />

            <ReactSelect
              placeholderName={t("Panel")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"company"}
              name={"company"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={dropDownState?.BindPanelIPD}
              value={payload?.company}
            />

            <ReactSelect
              placeholderName={t("ParentPanel")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"parentPanel"}
              name={"parentPanel"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={dropDownState?.BindParentPanel}
              value={payload?.parentPanel}
            />

            <ReactSelect
              placeholderName={t("FileStatus")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"status"}
              name={"status"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={BIND_FILE_STATUS}
              value={payload?.status}
            />

            <ReactSelect
              placeholderName={t("DischargeType")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"dischageType"}
              name={"dischageType"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={dropDownState?.BindDischargeType}
              value={payload?.dischageType}
            />

            <ReactSelect
              placeholderName={t("Doctor")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"doctorId"}
              removeIsClearable={true}
              name={"doctorId"}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={dropDownState?.BindDoctorDept}
              value={payload?.doctorId}
            />

            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              lable={t("FromDate")}
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              name="ucFromDate"
              id="ucFromDate"
              value={payload?.ucFromDate}
              showTime
              hourFormat="12"
              handleChange={handleChange}
            />

            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              lable={t("ToDate")}
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              name="ucToDate"
              id="ucToDate"
              value={payload?.ucToDate}
              showTime
              hourFormat="12"
              handleChange={handleChange}
            />

            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <button
                className="btn btn-sm btn-primary mx-1"
                onClick={handleMRDSearchGrid}
              >
                {t("Search")}
              </button>

              <button
                className="btn btn-sm btn-primary mx-1"
                onClick={handleMRDPatientSearchMRDRecieved}
              >
                {t("Receive")}
              </button>
              <span
                className={`pointer-cursor ${isDisabled ? "disabled" : ""}`}
                onClick={() =>
                  exportToExcel(ExceldataFormatter(tableData), "MRD File")
                }
              >
                <IconsColor ColorCode={"Excel"} />
              </span>
            </div>
          </div>

          <div className="row p-2 flex-row-reverse">
            <div className="col-12 d-flex justify-content-end">
              <ColorCodingSearch label={t("Received")} color={"lightgreen"} />
              <ColorCodingSearch label={t("Not Received")} color={"lightpink"} />
            </div>
          </div>
        </div>
        <div className="patient_registration card">
          <Tables
            thead={THEAD}
            tbody={handleTableRender(tableData)}
            scrollView={"scrollView"}
          />
        </div>
      </div>

      <SlideScreen
        visible={renderComponent?.show}
        setVisible={() => {
          setRenderComponent({
            name: null,
            component: null,
            show: false,
          });
        }}
        Header={
          <SeeMoreSlideScreen
            name={renderComponent?.name}
            seeMore={handleBindFrameMenuByRoleIDS(BindFrameMenuByRoleIDS)}
            handleChangeComponent={(item) => {
              handleComponentRender(patientDetail, item, true);
            }}
          />
        }
      >
        {renderComponent?.component}
      </SlideScreen>
    </>
  );
};

export default PatientSearchMRD;
