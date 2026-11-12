import React, { useEffect, useState } from "react";
import Heading from "../../UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../formComponent/ReactSelect";
import {
  handleReactSelectDropDownOptions,
  notify,
  reactSelectOptionList,
} from "../../../utils/utils";
import {
  bindEmergencyBillingCtg,
  bindEmergencyRoomBed,
  bindEmergencyRoomType,
  getEmergencyPatientDetailsAPI,
  shipttoIpdSaveEmg,
} from "../../../networkServices/Emergency";
import { GetAllDoctor } from "../../../store/reducers/common/CommonExportFunction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { bindHashCode } from "../../../networkServices/opdserviceAPI";
export default function ShiftToIPD({ data,setVisible }) {
  const { t } = useTranslation();
  const [roomList, setRoomList] = useState({
    roomTypeList: [],
    roomBedNoList: [],
    BillingCategoryList: []
  });
  const dispatch = useDispatch();
  const [payloadData, setPayloadData] = useState({});

  const ReactSelectHandleChange = async (name, e) => {
    if (name === "RoomType") {
      let apiResp = await bindEmergencyRoomBed(e);

      if (apiResp?.success) {
        setRoomList((val) => ({
          ...val,
          roomBedNoList: reactSelectOptionList(apiResp?.data, "Name", "RoomID"),
        }));
      } else {
        setRoomList((val) => ({ ...val, roomBedNoList: [] }));
      }
    }
    setPayloadData((val) => ({ ...val, [name]: e }));
  };

  const bindEmergencyRoomTypeAPI = async () => {
    let apiResp = await bindEmergencyRoomType();
    if (apiResp?.success) {
      setRoomList((val) => ({
        ...val,
        roomTypeList: reactSelectOptionList(
          apiResp?.data,
          "Name",
          "IPDCaseTypeID"
        ),
      }));
    } else {
      setRoomList((val) => ({ ...val, roomTypeList: [] }));
    }
  };
  const bindEmergencyBillingCtgAPI = async () => {
    let apiResp = await bindEmergencyBillingCtg();
    if (apiResp?.success) {
      setRoomList((val) => ({
        ...val,
        BillingCategoryList: reactSelectOptionList(
          apiResp?.data,
          "Name",
          "IPDCaseTypeID"
        ),
      }));
    } else {
      setRoomList((val) => ({ ...val, roomTypeList: [] }));
    }
  };

  const { GetAllDoctorList } = useSelector((state) => state?.CommonSlice);

  useEffect(() => {
    bindEmergencyRoomTypeAPI();
    bindEmergencyBillingCtgAPI()
    dispatch(GetAllDoctor());
  }, []);

  const handleEmgSave = async () => {
    // EmergencyPatientSearch
   
    if (!payloadData?.RoomType?.value) {
      notify("Room Type Field is require", "error")
      return 0
    } else if (!payloadData?.RoomBedNo?.value) {
      notify("Room Bed No Field is require", "error")
      return 0
    } else if (!payloadData?.Doctor?.DoctorID) {
      notify("Doctor Field is require", "error")
      return 0
    } else if (!payloadData?.BillingCategory?.value) {
      notify("Billing Category Field is require", "error")
      return 0
    }

    const hashcode = await bindHashCode();
    let getDetials = await getEmergencyPatientDetailsAPI(data?.EmergencyNo)
    let payload = {
      lTnxNo: String(data?.LTnxNo),
      pid: String(data?.patientID),
      oldTID: String(data?.TID),
      oldRoomId: String(data?.RoomId),
      newRoomId: String(payloadData?.RoomBedNo?.value),
      newBillCategory: String(payloadData?.BillingCategory?.value),
      ipdCaseTypeId: String(getDetials?.data?.IPDCaseTypeID),
      hashCode: String(hashcode?.data),
      doctorID: String(payloadData?.Doctor?.DoctorID),
    };
    let apiResp = await shipttoIpdSaveEmg(payload);
    if (apiResp?.success) {
      notify(apiResp?.message, "success")
      setVisible()
    } else {
      notify(apiResp?.message, "error")
    }
  };
  return (
    <>
      <div className="card patient_registration border mt-2">
        <div className="card card_background">
          <Heading title={<div>Shift Emergency To IPD</div>} />
          <div className="row p-2">
            <ReactSelect
              placeholderName={t("RoomType")}
              id="RoomType"
              searchable={true}
              name="RoomType"
              respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
              requiredClassName={"required-fields"}
              dynamicOptions={roomList?.roomTypeList}
              value={payloadData?.RoomType}
              handleChange={(name, value) => {
                ReactSelectHandleChange(name, value);
              }}
            />
            <ReactSelect
              placeholderName={t("RoomBedNo")}
              id="RoomBedNo"
              searchable={true}
              name="RoomBedNo"
              respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
              requiredClassName={"required-fields"}
              dynamicOptions={roomList?.roomBedNoList}
              value={payloadData?.RoomBedNo}
              handleChange={ReactSelectHandleChange}
            />
            <ReactSelect
              placeholderName={t("Doctor")}
              className="form-control"
              id={"Doctor"}
              name="Doctor"
              dynamicOptions={handleReactSelectDropDownOptions(
                GetAllDoctorList,
                "Name",
                "DoctorID"
              )}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              requiredClassName={"required-fields"}
              value={payloadData?.Doctor?.value}
              //   value={values?.Doctor?.value}
              handleChange={ReactSelectHandleChange}
            />
            <ReactSelect
              placeholderName={t('BillingCategory')}
              id="BillingCategory"
              searchable={true}
              name="BillingCategory"
              respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
              requiredClassName={"required-fields"}
              dynamicOptions={roomList?.BillingCategoryList}
              value={payloadData?.BillingCategory?.value}
              handleChange={ReactSelectHandleChange}
            />
            <div className=" text-right">
              <button
                className="btn btn-sm btn-primary"
                type="button"
                onClick={handleEmgSave}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="card patient_registration border mt-2">
                <Heading title="Doctor Clearance" />
                <div className="row">
                    <div className="col-sm-6">
                        <div className="row p-2">
                            <div className='col-sm-3 d-flex justify-content-center'>
                                    <div style={{ width: "70%", margin: "auto" }}>
                                        <img src={logoitdose} className="img-fluid" />
                                    </div>
                                
                            </div>
                            <div className="col-sm-9">
                                <h1 className='itInfoHeading'>ITDOSE INFOSYSTEMS PVT. LTD.</h1>
                                <p className='itInfoNormalHead'>(Unit of Cuttack Hospitals Pvt.Ltd.)</p>
                                <p className='itInfoNormalHead'>Plot No-3(P), Sector-1, CDA, Bidanasi, Cuttack</p>
                                <p className='itInfoNormalHead'>Mob. No : +91 9238008811</p>
                            </div>
                        </div>
                        <div className="row p-2 d-flex justify-content-center" >
                            <div className="col-sm-11" style={{ border: "1px solid black" }}>
                                <div className="row p-2">
                                    <div className="col-sm-6">
                                        <label className='col-sm-6' >UHID</label>
                                        <label className='col-sm-6' >:AM24-05090001</label>
                                        <label className='col-sm-6' >Patient Name</label>
                                        <label className='col-sm-6' >:Mr.ANIL GAWDE</label>
                                        <label className='col-sm-6' >Age/Gender</label>
                                        <label className='col-sm-6' >:45 YRS/Male</label>
                                        <label className='col-sm-6' >Ph No</label>
                                        <label className='col-sm-6' >:7418526369</label>
                                        <label className='col-sm-6' >Address</label>
                                        <label className='col-sm-6' >:dehradun -Dehradun, INDIA</label>

                                    </div>
                                    <div className="col-sm-6">
                                        <label className='col-sm-6' >Panel</label>
                                        <label className='col-sm-6' >:Cash</label>
                                        <label className='col-sm-6' >Bill No</label>
                                        <label className='col-sm-6' >:ARECM2425-000109</label>
                                        <label className='col-sm-6' >Doctor</label>
                                        <label className='col-sm-6' >:Dr. Administrator</label>
                                        <label className='col-sm-6' >Department</label>
                                        <label className='col-sm-6' >:RADIOLOGIST</label>
                                        <label className='col-sm-6' >Visit Date</label>
                                        <label className='col-sm-6' >:09-May-2024  </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div> */}

    </>
  );
}
