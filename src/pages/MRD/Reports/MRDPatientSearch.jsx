import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import { RedirectURL, RedirectURLReport } from "../../../networkServices/PDFURL";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { PrintFileLocationInMRD } from "../../../networkServices/ReportsAPI";
import { MRDBindAlmirah, MRDBindMRDRack, MRDBindRackDetail, MRDBindRoom, MRDBindRoomCMB, MRDBindShelf, MRDSetLocation } from "../../../networkServices/MRDApi";
import { useDispatch } from "react-redux";
const MRDPatientSearch = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const initialValues = {
    RoomID: "",
    AlmID: "",
    UHID: "",
    PatientName: "",
    ShelfID: "",
    printType: "1"
  };

  const [values, setValues] = useState({ ...initialValues });
  const [dropDownState, setDropDownState] = useState({
    MRDBindRoomCMB: [],
    MRDBindAlmirah: [],
    MRDBindShelf: [],
  });

  const handleMRDBindRoomCMB = async () => {
    try {
      const response = await MRDBindRoomCMB();
      return response?.data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindAlmirah = async (RmID) => {
    try {
      const response = await MRDBindAlmirah(RmID);
      return response?.data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindShelf = async (AlmID) => {
    try {
      const response = await MRDBindShelf(AlmID);
      return response?.data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDSetLocation = async (TID) => {
    try {
      const response = await MRDSetLocation(TID);
      if (response?.data?.length > 0) {
        const { RmID, AlmID, Narration } = response?.data[0];
        fetchDropDown(RmID, AlmID);

        setValues({
          RoomID: String(RmID),
          AlmID: String(AlmID),
          Remarks: Narration,
          ...response?.data[0],
        });

        return;
      }

      fetchDropDown(values?.RoomID, values?.AlmID);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDropDown = async (RmID, AlmID) => {

    try {
      const [MRDBindRoomCMB, MRDBindAlmirah, MRDBindShelf] = await Promise.all([
        dropDownState?.MRDBindRoomCMB?.length === 0 && handleMRDBindRoomCMB(),
        RmID && handleMRDBindAlmirah(RmID),
        AlmID && handleMRDBindShelf(AlmID),
      ]);

      setDropDownState({
        MRDBindRoomCMB: [
          ...(MRDBindRoomCMB
            ? handleReactSelectDropDownOptions(MRDBindRoomCMB, "NAME", "RmID")
            : dropDownState?.MRDBindRoomCMB),
        ],
        MRDBindAlmirah: [
          ...(MRDBindAlmirah
            ? handleReactSelectDropDownOptions(MRDBindAlmirah, "Name", "AlmID")
            : []),
        ],

        MRDBindShelf: [
          ...(MRDBindShelf
            ? handleReactSelectDropDownOptions(MRDBindShelf, "ShelfNo", "ID")
            : []),
        ],
      });
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };





  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleReactChange = (name, e, obj) => {
    obj[name] = e?.value;
    setValues(obj);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
   
      store.dispatch(setLoading(true));
      try {
       
        const response = await PrintFileLocationInMRD(
          {
          mrno: values?.UHID,
          patientName: values?.PatientName,
          roomName: values?.RoomID?values?.RoomID:"All",
          rack: values?.AlmID,
          shelf: values?.ShelfID,
        },
       
       
      );
        if (response?.success === false) {
          
          notify(response?.message, "error");
        } else {
          RedirectURL(response?.pdfUrl);
         
        }
      } catch (error) {
        console.log(error, "No Record Found.");
      } finally {
        store.dispatch(setLoading(false));
      }
    }

  useEffect(() => {
    handleMRDSetLocation();
  }, []);
  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={t("card patient_registration border")}
          isBreadcrumb={true}
        />
        <form
          className="row p-2 justify-content-centers"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            className="form-control "
            id="UHID"
            lable={t("UHID")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name="UHID"
            value={values.UHID}
            onChange={handleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="PatientName"
            lable={t("Patient Name")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name="PatientName"
            value={values.PatientName}
            onChange={handleChange}
          />
         <ReactSelect
           respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          placeholderName={t("Room")}
          name="RoomID"
          // requiredClassName={"required-fields"}
          dynamicOptions={dropDownState?.MRDBindRoomCMB}
          value={values?.RoomID}
          handleChange={(name, e) =>
            handleReactChange(
              name,
              e,
              {
                ...values,
                AlmID: "",
                ShelfID: "",
              },
              fetchDropDown(e?.value)
            )
          }
        />

        <ReactSelect
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          placeholderName={t("Rack")}
          dynamicOptions={dropDownState?.MRDBindAlmirah}
          // requiredClassName={"required-fields"}
          name={"AlmID"}
          value={values?.AlmID}
          handleChange={(name, e) =>
            handleReactChange(
              name,
              e,
              {
                ...values,
                ShelfID: "",
              },
              fetchDropDown(null, e?.value)
            )
          }
        />
        <ReactSelect
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          placeholderName={t("Shelf")}
          name="ShelfID"
          dynamicOptions={dropDownState?.MRDBindShelf}
          value={values?.ShelfID}
          handleChange={(name, e) =>
            handleReactChange(name, e, { ...values })
          }
        />
          <ReportPrintType
            placeholderName={t("Print Type")}
            id="printType"
            searchable
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            values={values}
            name={"printType"}
            setValues={setValues}
          />
          <div className="box-inner text-center">
            <button className="btn btn-sm btn-primary ml-2" type="submit">
              {t("Report")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default MRDPatientSearch;
