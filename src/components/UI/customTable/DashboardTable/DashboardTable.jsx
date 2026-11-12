import React, { useEffect, useState } from "react";
import Tables from "..";
import { useTranslation } from "react-i18next";
import IconsColor from "../../../../utils/IconsColor";
import {
  exportHtmlToPDF,
  exportToExcel,
} from "../../../../utils/exportLibrary";
import DashboardTemplate from "../../../../pdfTemplate/DashboardTemplate";

const DashboardTable = (props) => {
  const { tbody, Header, TimeDuration } = props;
  const [t] = useTranslation();
  const [Tbody, setTbody] = useState([]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const HardCopy = JSON.parse(JSON.stringify(tbody ?? []));
    const modifiedResponseData = HardCopy?.map((ele, index) => {
      const ColorCode = (
        <div className="d-flex align-items-center">
          <IconsColor ColorCode={ele?.ColorCode} />
          <div>{ele?.CurrentTrend}</div>
        </div>
      );
      delete ele?.TypeID;
      delete ele?.TypeName;
      delete ele?.DetailID;
      delete ele?.ColorCode;
      delete ele?.CurrentTrend;

      return { ...ele, Trend: ColorCode };
    });
    setTbody(modifiedResponseData);
  }, [tbody]);

  const THEAD = [
    t("S.No."),
    ...(Tbody?.length > 0
      ? Object.keys(Tbody[0]).map((key) => t(capitalizeFirstLetter(key)))
      : []),
  ];

  const ExceldataFormatter = (tableData) => {
    const HardCopy = JSON.parse(JSON.stringify(tableData));
    const modifiedResponseData = HardCopy?.map((ele, index) => {
      delete ele?.TypeID;
      delete ele?.TypeName;
      delete ele?.DetailID;
      delete ele?.ColorCode;

      return { ...ele };
    });

    return modifiedResponseData;
  };

  return Tbody?.length > 0 ? (
    <>
      <div className="d-flex justify-content-end align-items-center">
        <div className="mx-2" style={{ fontWeight: "800" }}>
          {t("Export To")}:
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => exportToExcel(ExceldataFormatter(tbody), Header)}
        >
          <IconsColor ColorCode={"Excel"} />
        </div>
        <div
          style={{ cursor: "pointer" }}
          // onClick={() => exportHtmlToPDF(tbody)}
          onClick={() => exportHtmlToPDF("hidden-template", Header)}
        >
          <IconsColor ColorCode={"PDF"} />
        </div>
      </div>
      <div id="html-to-pdf" style={{ width: "100%" }}>
        <Tables
          thead={THEAD}
          tbody={Tbody.map((e, index) => {
            return {
              "S.No": index + 1,
              ...e,
            };
          })}
          // style={{height:"70vh"}}
        />

        {/* pdf template html hidden */}

        <DashboardTemplate
          thead={THEAD}
          tbody={Tbody.map((e, index) => {
            return {
              "S.No": index + 1,
              ...e,
            };
          })}
          Header={Header}
          TimeDuration={TimeDuration}
        />
      </div>
    </>
  ) : (
    <>
      <h1 style={{ color: "#000", fontSize: "30px" }}>No Data Found</h1>
    </>
  );
};

export default DashboardTable;
