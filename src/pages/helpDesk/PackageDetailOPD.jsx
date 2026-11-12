import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import LabeledInput from "../../components/formComponent/LabeledInput";
import PackageDetailTable from "../../components/UI/customTable/helpDesk/PackageDetailTable/index";
import {
  BindOPDPackage,
  BindPackageRate,
  PackageDetail,
} from "../../networkServices/PackageDetailOPDApi";

export default function PackageDetailOPD() {
  const { t } = useTranslation();
  const [Package, setPackage] = useState([]);
  const [Rate, setRate] = useState([]);
  const [bodyData, setBodyData] = useState({
    PackageID: "",
  });
  const [tableData, setTableData] = useState([]);

  const getBindOPDPackage = async () => {
    try {
      const dataRes = await BindOPDPackage();
      const options = dataRes.data.map((item) => ({
        value: item.PackID,
        label: item.Name,
      }));
      setPackage(options);
    } catch (error) {
      console.error(error);
    }
  };

  const getBindPackageRate = async (PackageID) => {
    try {
      const PanelID = 1;
      const panelCurrencyFactor = 1;
      const dataRes = await BindPackageRate(
        PackageID,
        PanelID,
        panelCurrencyFactor
      );
      setRate(dataRes.data[0]?.Rate || "0");
    } catch (error) {
      console.error(error);
    }
  };

  const searchPackageDetailOPD = async (PackageID) => {
    try {
      const dataRes = await PackageDetail(PackageID);
      setTableData(dataRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReactSelect = (name, value) => {
    setBodyData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "PackageID") {
      searchPackageDetailOPD(value.value);
      getBindPackageRate(value.value);
    }
  };

  useEffect(() => {
    getBindOPDPackage();
  }, []);

  const PackageTHEAD = [
    t("S.No."),
    t("Package Name"),
    t("Valid From"),
    t("Valid To"),
    t("Investigation Name"),
  ];

  return (
    <>
      <div className="card patient_registration border">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Package_Name")}
            id="PackageID"
            name="PackageID"
            value={bodyData?.PackageID}
            handleChange={handleReactSelect}
            removeIsClearable={true}
            dynamicOptions={Array.isArray(Package) ? Package : []}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          {bodyData?.PackageID && (
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={t("rate")}
                value={Rate}
              />
            </div>
          )}
        </div>
      </div>
      <div className="patient_registration card">
        <PackageDetailTable thead={PackageTHEAD} tbody={tableData} />
      </div>
    </>
  );
}
