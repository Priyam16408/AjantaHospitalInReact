import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import {
  BinddonorBloodGroup,
  BloodGroupSerach,
  SaveCollectionRecord,
} from "../../../networkServices/blooadbankApi";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import Modal from "../../../components/modalComponent/Modal";
import BloodCollectionDetails from "./BloodCollectionDetails";
import { notify } from "../../../utils/ustil2";

const { VITE_DATE_FORMAT } = import.meta.env;

function DiscardBloodStock() {
  const [t] = useTranslation();
  const [values, setValues] = useState({
    stockid: "",
    collectionid: "",
    tubeno: "",
    expiryFrom: new Date(),
    expiryto: new Date(),
  });

  const [bloodBank, setBloodBank] = useState([]);
  const [bloodCollectionData, setBloodCollectionData] = useState([]);

  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});

  const isMobile = window.innerWidth <= 800;

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handledBinddonorBloodGroup = async () => {
    try {
      const response = await BinddonorBloodGroup();
      if (response.success) {
        setBloodBank(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBloodBank([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBloodBank([]);
    }
  };

  // bloodCollectionSearchData

  const handleSearchData = async () => {
    const payload = {
      donationId: values?.bloodColId,
      donorID: values?.donorID,
      name: values?.donorName,
      bloodgroupText: "All",
      donationfrom: moment(values?.fromDate).format("DD-MMM-YYYY"),
      donationTo: moment(values?.toDate).format("DD-MMM-YYYY"),
    };
    try {
      const response = await BloodGroupSerach(payload);
      if (response.success) {
        setBloodCollectionData(response?.data);
      } else {
        notify(response?.message, "error");
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBloodCollectionData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBloodCollectionData([]);
    }
  };

  const handleSaveModaldata = async (data) => {
    const payload = {
      bbTubeNo: data?.tubeNo,
      qntySingle: data?.Quantity,
      qntyDouble: "string",
      remark: data?.remark,
      donerId: data?.Visitor_ID,
      visitID: data?.Visit_ID,
      bagType: "string",
      completed: "string",
      isDonated: data?.DonationCompleted?.va,
      isShocked: 0,
    };
    try {
      const response = await SaveCollectionRecord(payload);
      if (response.success) {
        notify(response?.message, "success");
        setHandleModelData({ isOpen: false });
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const theadbloodCollection = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Collection ID") },
    { width: "15%", name: t("Name") },
    { width: "15%", name: t("Sex") },
    { width: "15%", name: t("Group") },
    { width: "10%", name: t("Collection Date") },
    { width: "10%", name: t("Status") },
  ];

  const handleChangeRejectModel = (data) => {
    setModalData(data);
  };

  const handleopenModal = (item) => {
    setHandleModelData({
      label: t("Blood Collection Details"),
      buttonName: t("Save"),
      width: "60vw",
      isOpen: true,
      Component: (
        <BloodCollectionDetails
          inputData={item}
          handleChangeModel={handleChangeRejectModel}
        />
      ),
      handleInsertAPI: handleSaveModaldata,
      extrabutton: <></>,
      // footer: <></>,
    });
  };

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  useEffect(() => {
    handledBinddonorBloodGroup();
  }, []);

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}
      <div className="m-2 spatient_registration_card card">
        <Heading title={t("Discard Blood Stock")} isBreadcrumb={false} />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <Input
            type="text"
            className="form-control"
            id="stockid"
            placeholder=" "
            name="stockid"
            value={values?.bloodColId || ""}
            onChange={handleChange}
            lable={t("Stock ID")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="collectionid"
            name="collectionid"
            value={values?.collectionid || ""}
            onChange={handleChange}
            lable={t("Collection ID")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="tubeno"
            name="tubeno"
            value={values?.tubeno || ""}
            onChange={handleChange}
            lable={t("Tube No")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <DatePicker
            id="expiryFrom"
            name="expiryFrom"
            placeholder={VITE_DATE_FORMAT}
            lable={t("Expiry From")}
            className="custom-calendar"
            value={values?.expiryFrom}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
          />

          <DatePicker
            id="expiryto"
            name="expiryto"
            placeholder={VITE_DATE_FORMAT}
            lable={t("Expiry To")}
            className="custom-calendar"
            value={values?.expiryto}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
          />

          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={handleSearchData}
            >
              {t("Search")}
            </button>
          </div>
        </div>

        {bloodCollectionData.length > 0 && (
          <div className="card">
            <Tables
              thead={theadbloodCollection}
              tbody={bloodCollectionData?.map((val, index) => ({
                sno: index + 1,
                collectionId: val.Bloodcollection_id,
                name: val.name || "",
                sexGroup: val.Gender || "",
                Group: val?.BloodGroup || "",
                CollectionDate: val.Collecteddate || "",
                status: (
                  <i
                    onClick={() => {
                      handleopenModal(val);
                    }}
                    className="fa fa-check"
                  />
                ),
              }))}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default DiscardBloodStock;
