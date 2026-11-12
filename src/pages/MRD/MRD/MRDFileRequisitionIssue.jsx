import React, { useCallback, useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import {
  MRDBindPatientType,
  MRDSearchRequisition,
} from "../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import SeeMoreSlideScreen from "../../../components/UI/SeeMoreSlideScreen";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { BindFrameMenuByRoleID } from "../../../store/reducers/common/CommonExportFunction";
import MRDSeeMoreList from "../../../components/commonComponents/MRDSeeMoreList";
import SlideScreen from "../../../components/front-office/SlideScreen";



const MRDFileRequisitionIssue = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const dispatch = useDispatch();
  const { BindFrameMenuByRoleIDS } = useSelector((state) => state?.CommonSlice);

  const [dropDownState, setDropDownState] = useState({
    BindPatientType: [],
  });

  const [payload, setPayload] = useState({
    mrNo: "",
    pName: "",
    ipdNo: "",
    fromDate: new Date(),
    toDate: new Date(),
    mrdFileNo: "",
    pType: "IPD",
  });
  const THEAD = [
    t("Select"),
    t("S.No."),
    t("PType"),
    t("MRD No"),
    t("IPD No"),
    t("Patient Name"),
    t("MRD File No"),
    t("Requested By / Approved By"),
    t("Requested / Approved Date"),
  ];
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
    show: false,
  });

  const [tableData, setTableData] = useState([]);

  const handleMRDBindPatientType = async () => {
    try {
      const response = await MRDBindPatientType();
      return t("response");
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const renderAPI = async () => {
    try {
      const [BindPatientType] = await Promise.all([handleMRDBindPatientType()]);
      const dropDownData = {
        BindPatientType: [
          ...handleReactSelectDropDownOptions(
            BindPatientType?.data,
            "PType",
            "PType"
          ),
        ],
      };
      setDropDownState(dropDownData);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleReactChange = (name, e, key) => {
    setPayload({
      ...payload,
      [name]: e?.[key],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleMRDSearchRequisition = async () => {
    store.dispatch(setLoading(true));
    try {
      const response = await MRDSearchRequisition({
        ...payload,
        fromDate: moment(payload?.fromDate).format("DD-MM-YYYY"),
        toDate: moment(payload?.toDate).format("DD-MM-YYYY"),
      });

      if (!response?.success) {
        notify(response?.message, "error");
      }

      setTableData(response?.data);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
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

  const ModalComponent = (name, component, show) => {
    setRenderComponent({
      name: name,
      component: component,
      show: show,
    });
  };
  const [patientDetail, setPatientDetail] = useState({})
  const handleComponentRender = async (data, items, show) => {
    setPatientDetail(data)
    const componentData = MRDSeeMoreList([items], data);
    ModalComponent(componentData[0]?.name, componentData[0]?.component, show);
    const forsetSeeMore = MRDSeeMoreList(BindFrameMenuByRoleIDS, data);
  };

  const handleTableData = (tableData) => {
    return tableData.map((item, index) => {
      const {
        type,
        PatientID,
        TransNo,
        pName,
        FileID,
        RequestedName,
        ApprovedBy,
        RejectedDate,
        ApprovedDate,
        IsIssue,
      } = item;
      return {
        select: (
          <SeeMoreSlideScreen
            seeMore={handleBindFrameMenuByRoleIDS(BindFrameMenuByRoleIDS)}
            handleChangeComponent={(row) => {
              handleComponentRender({...item,transactionID:item?.TransactionID}, row, true);
            }}
          />
        ),
        SNo: index + 1,
        type: type,
        PatientID: PatientID,
        TransNo: TransNo,
        PatientName: pName,
        FileID: FileID,
        RequestByAndApprove: RequestedName + "/" + ApprovedBy,
        RequestedApprovedDate: RejectedDate + "/" + ApprovedDate,
        colorcode: String(IsIssue) === "1" ? "#f7f778" : "lightpink",
      };
    });
  };

  useEffect(() => {
    renderAPI();
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
            title={t("MRD File Requisition Issue")}
            isBreadcrumb={false}
          />
          <div className="row p-2">
            <ReactSelect
              placeholderName={t("PatientType")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"pType"}
              name={"pType"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={dropDownState?.BindPatientType}
              value={payload?.pType}
            />

            <Input
              type="text"
              className="form-control"
              id="mrNo"
              lable={t("UHID")}
              placeholder=" "
              required={true}
              value={payload?.mrNo}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="mrNo"
              onChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              id="pName"
              lable={t("PatientName")}
              placeholder=" "
              required={true}
              value={payload?.pName}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="pName"
              onChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              id="ipdNo"
              lable={t("IPDNo")}
              placeholder=" "
              required={true}
              value={payload?.ipdNo}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="ipdNo"
              onChange={handleChange}
            />

            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              lable={t("FromDate")}
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              name="fromDate"
              id="fromDate"
              value={payload?.fromDate}
              showTime
              hourFormat="12"
              handleChange={handleChange}
            />

            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              lable={t("ToDate")}
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              name="toDate"
              id="toDate"
              value={payload?.toDate}
              showTime
              hourFormat="12"
              handleChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              id="mrdFileNo"
              lable={t("MRD File No")}
              placeholder=" "
              required={true}
              value={payload?.mrdFileNo}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="mrdFileNo"
              onChange={handleChange}
            />

            <div className="col-xl-2 col-md-4 col-sm-6 col-12">
              <button
                className="btn btn-sm btn-primary mx-1"
                onClick={handleMRDSearchRequisition}
              >
                {t("Search")}
              </button>
              <button className="btn btn-sm btn-primary mx-1">{t("Clear")}</button>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-end p-1">
            <ColorCodingSearch label={t("Already Issued")} color={"#f7f778"} />
            <ColorCodingSearch label={t("NotIssued")} color={"lightpink"} />
          </div>
        </div>
      </div>

      <div className="patient_registration card">
        <div className="row">
          <div className="col-12">
            <Tables thead={THEAD} tbody={handleTableData(tableData)} />
          </div>
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
        // Header={<SeeMoreSlideScreen name={renderComponent?.name} />}
        Header={<SeeMoreSlideScreen name={renderComponent?.name}
        seeMore={handleBindFrameMenuByRoleIDS(BindFrameMenuByRoleIDS)}
        handleChangeComponent={(item) => { handleComponentRender(patientDetail, item, true) }}
      />}
      >
        {renderComponent?.component}
      </SlideScreen>
    </>
  );
};

export default MRDFileRequisitionIssue;
