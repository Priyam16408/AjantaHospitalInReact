import React, { useState } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import i18n from "@app/utils/i18n";
import ReferedDoctorModal from "../modalComponent/Utils/ReferedDoctorModal";

import Input from "@app/components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReferDoctor from "../front-office/ReferDoctor";

const BillingDetails = ({ Panel,isDipartment }) => {
  const {show,setShow} = useState(false)
  const [t] = useTranslation();
  return (
    <>
     {show && (
        <ReferedDoctorModal
          isOpen={show}
          onClose={() => {
            setShow(false);
          }}
        />
      )}
      <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2">
        <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
          <div className="form-group">
          <p>Available Amt. : 0</p>
            {/* <ReactSelect
              placeholderName={i18n.t(
                "FrontOffice.OPD.billingDetails.label.PanelGroup"
              )}
              id="PanelGroup"
              searchable={true}
            /> */}
          </div>
        </div>
       
       

       


       {/* <ReferDoctor isDipartment={isDipartment}/> */}

      </div>

      <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2">
      <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
          <div className="form-group">
            <ReactSelect
              placeholderName={"Type"}
              id="ParentPanel"
              searchable={true}
            />
          </div>
        </div>
        <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
          <div className="form-group">
          <Input
              type="text"
              className="form-control"
              id="Policy_No"
              name="barcode"
              lable="Amount"
            //   lable={t("FrontOffice.OPD.billingDetails.label.Policy_No")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-12 col-sm-4 col-12"
            />
          </div>
        </div>
        
        <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
          <div className="form-group d-flex ">
            <ReactSelect
              placeholderName="Reason"
              id="IgnorePolicy"
              searchable={true}
              respclass="opdadvance"
            />
              <div className="box-inner">
                  <button
                    className="btn btn-sm btn-primary ml-2"
                    // onClick={() => {
                    //   setVisible(true);
                    // }}
                    // onClick={() => setVisible1(true)}
                    type="button"
                  >
                    <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                  </button>
                </div>
          </div>
        </div>



      {false && Panel !== 'Cash' &&
          <>
            <Input
              type="text"
              className="form-control"
              id="Policy_No"
              name="barcode"
              lable={t("FrontOffice.OPD.billingDetails.label.Policy_No")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control"
              id="Policy_Card_No"
              name="barcode"
              lable={t("FrontOffice.OPD.billingDetails.label.Policy_Card_No")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control"
              id="Name_On_Card"
              name="barcode"
              lable={t("FrontOffice.OPD.billingDetails.label.Name_On_Card")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
            />
            <Input
              type="date"
              className="form-control"
              id="Expire_Date"
              name="barcode"
              lable={t("FrontOffice.OPD.billingDetails.label.Expire_Date")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
            />

            <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
              <div className="form-group">
                <ReactSelect
                  placeholderName={i18n.t("FrontOffice.OPD.billingDetails.label.IgnorePolicy")}
                  id="IgnorePolicy"
                  searchable={true}
                />
              </div>
            </div>

            <Input
              type="text"
              className="form-control"
              id="Approval_Amount"
              name="barcode"
              lable={t("FrontOffice.OPD.billingDetails.label.Approval_Amount")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control"
              id="Approval_Remark"
              name="barcode"
              lable={t("FrontOffice.OPD.billingDetails.label.Approval_Remark")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
            />

            <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
            <button
              className="btn btn-primary btn-sm  btn-block "
              type="button"
            >
              {t("FrontOffice.OPD.billingDetails.label.Panel_Required_Document", {
                quantity: "0",
              })}
            </button>
            </div>
            {/* <Input
              type="button"
              className="form-control"
              id="Documents"
              name="barcode"
              lable={t("FrontOffice.OPD.billingDetails.label.Documents")}
              placeholder=" "
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
            /> */}
          </>
        }
      </div>
    </>
  );
};

export default BillingDetails;
