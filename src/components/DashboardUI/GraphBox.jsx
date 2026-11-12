import React from "react";
import { useTranslation } from "react-i18next";

const GraphBox = ({
  data,
  width,
  options,
  component: Component,
  height,
  headName,
  handleGraphChange,
  value,
}) => {

  const [t] = useTranslation()
  let updatedData = data?.labels?.map((val) => {
    val = t(val);
    return val

  })
  // console.log("sss",data)
  // console.log({datasets:data?.datasets,labels:updatedData  })

  return (
    <>
      <div className={`mainBox1`} style={{ width: width, height: height }}>
        <div className="mainHeader">
          <h4>{t(headName)}</h4>
          <select
            name="defaultChart"
            id="multipleCharts"
            value={value}
            onChange={handleGraphChange}
          >
            <option value="Bar chart">{t("Bar chart")}</option>
            <option value="Line chart">{t("Line chart")}</option>
            <option value="Pie chart">{t("Pie chart")}</option>
            <option value="Curve Line chart">{t("Curve Line chart")}</option>
            <option value="Polar Area chart">{t("Polar Area chart")}</option>
            <option value="Stacked Bar Chart">{t("Stacked Bar Chart")}</option>
          </select>
        </div>
        {Component && (
          <div className="chart-container">
            <Component data={{datasets:data?.datasets,labels:updatedData  }} options={options} />
          </div>
        )}
      </div>
    </>
  );
};

export default GraphBox;
