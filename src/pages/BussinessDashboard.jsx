import React from "react";
import BussinessDashboardTable from "../components/UI/customTable/BussinessDashboardTable";
import { BUSSINESS_THEADS } from "../utils/constant";
import Welcome from "../components/WelComeCard/Welcome";
import IconsColor from "../utils/IconsColor";
import { useTranslation } from "react-i18next";
import WrapTranslate from "../components/WrapTranslate";

const BussinessDashboard = ({ apiData, headSetName }) => {
  const [t]=useTranslation()
  const generateRandomColor = (numColors) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  const handleTableData = (name, data) => {
    const returnData = {
      thead: WrapTranslate(BUSSINESS_THEADS[name]) ?? [],
      tbody: [],
      className: "col-md-6 col-12 col-xl-3 col-lg-4",
      height: "150px",
    };

    switch (name) {
      case "51":
        for (let i = 0; i < data.length; i++) {
          const { Type, CTAmt, ColorCode, PTAmt } = data[i];
          returnData.tbody.push({
            Type,
            CTAmt,
            PTAmt,
            ColorCode: <IconsColor ColorCode={Number(ColorCode)} />,
          });
        }

        return returnData;

      case "52":
        for (let i = 0; i < data.length; i++) {
          const { Type, CTAmt, ColorCode, PTAmt } = data[i];
          returnData.tbody.push({
            Type,
            CTAmt,
            PTAmt,
            ColorCode: <IconsColor ColorCode={Number(ColorCode)} />,
          });
        }

        return returnData;

      case "53":
        for (let i = 0; i < data.length; i++) {
          const { Type, CTAmt, ColorCode, PTAmt } = data[i];
          returnData.tbody.push({
            Type,
            CTAmt,
            PTAmt,
            ColorCode: <IconsColor ColorCode={Number(ColorCode)} />,
          });
        }

        return returnData;

      case "54":
        for (let i = 0; i < data.length; i++) {
          const { Type, CTAmt, ColorCode, PTAmt } = data[i];
          returnData.tbody.push({
            Type,
            CTAmt,
            PTAmt,
            ColorCode: <IconsColor ColorCode={Number(ColorCode)} />,
          });
        }

        return returnData;

      case "55":
        for (let i = 0; i < data.length; i++) {
          const {
            Department,
            OPD_CTAmt,
            OPD_PTAmt,
            IPD_CTAmt,
            IPD_PTAmt,
            EMG_CTAmt,
            EMG_PTAmt,
            ColorCode,
          } = data[i];
          returnData.tbody.push({
            Department,
            OPD_CTAmt,
            OPD_PTAmt,
            IPD_CTAmt,
            IPD_PTAmt,
            EMG_CTAmt,
            EMG_PTAmt,
            ColorCode: <IconsColor ColorCode={Number(ColorCode)} />,
          });
        }

        returnData.className = "col-md-6 col-12 col-xl-6 col-lg-4";

        return returnData;

      case "56":
        for (let i = 0; i < data.length; i++) {
          const {
            Department,
            OPD_CTAmt,
            OPD_PTAmt,
            IPD_CTAmt,
            IPD_PTAmt,
            EMG_CTAmt,
            EMG_PTAmt,
            ColorCode,
          } = data[i];
          returnData.tbody.push({
            Department,
            OPD_CTAmt,
            OPD_PTAmt,
            IPD_CTAmt,
            IPD_PTAmt,
            EMG_CTAmt,
            EMG_PTAmt,
            ColorCode: <IconsColor ColorCode={Number(ColorCode)} />,
          });
        }

        returnData.className = "col-md-6 col-12 col-xl-6 col-lg-4";

        return returnData;

      case "57":
        for (let i = 0; i < data.length; i++) {
          const {
            DrName,
            OPD_CTAmt,
            OPD_PTAmt,
            IPD_CTAmt,
            IPD_PTAmt,
            EMG_CTAmt,
            EMG_PTAmt,
            ColorCode,
          } = data[i];
          returnData.tbody.push({
            DrName,
            OPD_CTAmt,
            OPD_PTAmt,
            IPD_CTAmt,
            IPD_PTAmt,
            EMG_CTAmt,
            EMG_PTAmt,
            ColorCode: <IconsColor ColorCode={Number(ColorCode)} />,
          });
        }

        returnData.className = "col-md-6 col-12 col-xl-6 col-lg-4";

        return returnData;

      case "58":
        for (let i = 0; i < data.length; i++) {
          const {
            PanelName,
            OPD_CTAmt,
            OPD_PTAmt,
            IPD_CTAmt,
            IPD_PTAmt,
            EMG_CTAmt,
            EMG_PTAmt,
            ColorCode,
          } = data[i];
          returnData.tbody.push({
            PanelName,
            OPD_CTAmt,
            OPD_PTAmt,
            IPD_CTAmt,
            IPD_PTAmt,
            EMG_CTAmt,
            EMG_PTAmt,
            ColorCode: <IconsColor ColorCode={Number(ColorCode)} />,
          });
        }

        returnData.className = "col-md-6 col-12 col-xl-6 col-lg-4";

        return returnData;

      default:
        return returnData;
    }
  };

  const RenderDiv = ({ items, data, index }) => {
    const { thead, tbody, className, height } = handleTableData(
      String(data[0]?.GraphTypeID),
      data
    );
    const randomColor = generateRandomColor();
    return (
      <div className={className} key={index}>
        <div
          className="mainBox1"
          style={{
            backgroundColor: randomColor,
            boxShadow: "0px 0px 5px #626262",
          }}
        >
          <div
            className="mainHeader justify-content-center"
            style={{ fontWeight: "900" }}
          >
            {t(items?.name)}
          </div>
          <div>
            <BussinessDashboardTable
              thead={thead}
              tbody={tbody}
              tableHeight={height}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="row">
      <div className="col-md-6 col-12 col-xl-6 col-lg-4">
        <Welcome />
      </div>
      {headSetName.map((items, index) => {
        if (apiData[items?.name].length > 0) {
          return (
            <RenderDiv
              items={items}
              data={apiData[items?.name]}
              index={index}
            />
          );
        }
      })}
    </div>
  );
};

export default BussinessDashboard;
