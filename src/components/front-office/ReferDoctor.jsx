import React, { useState } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import i18n from "@app/utils/i18n";
import Modal from "../modalComponent/Modal";
import ReferedDoctorModal from "../modalComponent/Utils/ReferedDoctorModal";
export default function ReferDoctor({ isDipartment }) {
  const [t] = useTranslation();
  const [visible, setVisible] = useState(false);
  return (
    <>
      {visible && (
        <Modal
          visible={visible}
          setVisible={setVisible}
          Header="Add Refer Doctor"
        >
          <ReferedDoctorModal
            />
        </Modal>
      )}
      <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
        <div className="form-group">
          <ReactSelect
            placeholderName={i18n.t(
              "FrontOffice.OPD.billingDetails.label.ReferalType"
            )}
            id="ReferalType"
            searchable={true}
          />
        </div>
      </div>
      <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
        <div className="row">
          <ReactSelect
            placeholderName={i18n.t(
              "FrontOffice.OPD.billingDetails.label.ReferDoctor"
            )}
            id="ReferDoctor"
            searchable={true}
            respclass="col-sm-10 col-lg-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10 col-11"
          />
          <button className="btn btn-sm  btn-primary">
            <i
              className="fa fa-plus-circle fa-sm new_record_pluse"
              onClick={() => {
                setVisible(true);
              }}
            ></i>
          </button>
        </div>
      </div>
      <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
        <div className="row">
          <ReactSelect
            placeholderName={i18n.t(
              "FrontOffice.OPD.billingDetails.label.PROName"
            )}
            id="PROName"
            searchable={true}
            respclass="col-sm-10 col-lg-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10 col-11"
          />
          <button className="btn btn-sm  btn-primary">
            <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
          </button>
        </div>
      </div>

      {isDipartment && (
        <>
          <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
            <div className="form-group">
              <ReactSelect
                placeholderName={i18n.t(
                  "FrontOffice.OPD.billingDetails.label.Department"
                )}
                id="Department"
                searchable={true}
              />
            </div>
          </div>
          <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
            <div className="form-group">
              <ReactSelect
                placeholderName={i18n.t(
                  "FrontOffice.OPD.billingDetails.label.Doctor"
                )}
                id="Doctor"
                searchable={true}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
