import React from "react";
import { maxLengthChecker } from "../../utils/utils";
import { useTranslation } from "react-i18next";

const generateRandomColor = (numColors) => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.2)`;
};

const CardSection = ({
  CardName,
  dataMap,
  Type,
  handleClickGetDashboardDetailAPI,
}) => {
  const [t] = useTranslation()
  const ICON_TYPE = (Type, ele) => {
    ele.TypeName=t(ele?.TypeName)
    ele.TextField=t(ele?.TextField)
    switch (Type) {
      case 1:
        return (
          <>
            <i
              className={
                ele.ColorCode === 1
                  ? "pi pi-arrow-up-right"
                  : "pi pi-arrow-down-left"
              }
              style={{
                color: ele.ColorCode === 1 ? "#3CD856" : "red",
                backgroundColor: ele.ColorCode === 1 ? "#edf9ef" : "#fff5f5",
              }}
            />
            <div className="d-flex align-items-center justify-content-between">
              <h4 style={{ color: "#1b1b25" }}>
                {ele.TypeName || ele.TextField}
              </h4>
              <p style={{ color: "#1b1b25" }}>
                {ele.CurrDayValue || ele.ValueField}
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h4 style={{ color: "#1b1b25" }}>{ele.LastDayValue}</h4>
              <p style={{ color: "#1b1b25" }}>{ele.CurrentTrend}</p>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className=" d-flex align-items-center justify-content-between">
              <h4 style={{ color: "#000" }}>{ele.TypeName || ele.TextField}</h4>
              <p style={{ color: "#000" }}>
                {ele.CurrDayValue || ele.ValueField}
              </p>
            </div>
            <div className="">
              <div className="nameIcon d-flex align-items-center justify-content-between">
                <i
                  className={
                    ele.ColorCode === 1
                      ? "bi bi-graph-up-arrow"
                      : "bi bi-graph-down-arrow"
                  }
                  style={{
                    color: ele.ColorCode === 1 ? "#3ea04f" : "red",
                    // backgroundColor:
                    //   ele.ColorCode === 1 ? "#f2fcf4" : "#fff5f5",
                    margin: 0,
                    // marginTop:"30px"
                  }}
                >
                  <p
                    style={{
                      color: ele.ColorCode === 1 ? "#3ea04f" : "red",
                      marginTop: "30px",
                    }}
                  >
                    {ele.CurrentTrend}
                  </p>
                </i>
                <h4 style={{ color: "#000" }}>{ele.LastDayValue}</h4>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <i
              className={
                ele.ColorCode === 1 ? "pi pi-arrow-up" : "pi pi-arrow-down"
              }
              style={{
                color: ele.ColorCode === 1 ? "#3CD856" : "red",
                backgroundColor: ele.ColorCode === 1 ? "#edf9ef" : "#fff5f5",
              }}
            />
            <div className="d-flex align-items-center justify-content-between">
              <h4 style={{ color: "#1b1b25" }}>
                {ele.TypeName || ele.TextField}
              </h4>
              <p style={{ color: "#1b1b25" }}>
                {ele.CurrDayValue || ele.ValueField}
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h4 style={{ color: "#1b1b25" }}>{ele.LastDayValue}</h4>
              <p style={{ color: "#1b1b25" }}>{ele.CurrentTrend}</p>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div
              className="d-flex align-items-center justify-content-between "
              style={{ margin: "10px 0" }}
            >
              <h4 style={{ color: "#1b1b25" }}>
                {maxLengthChecker(ele.TypeName, 12)}
              </h4>
              <i
                className={
                  ele.ColorCode === 1
                    ? "bi bi-arrow-up-short"
                    : "bi bi-arrow-down-short"
                }
                style={{
                  color: ele.ColorCode === 1 ? "#3CD856" : "red",
                  backgroundColor: ele.ColorCode === 1 ? "#edf9ef" : "#fff5f5",
                }}
              >
                <p
                  style={{
                    color: ele.ColorCode === 1 ? "#3ea04f" : "red",
                    fontSize: "12px",
                  }}
                >
                  {ele.ColorCode === 1
                    ? `+${ele.CurrDayValue}`
                    : `${ele.CurrDayValue}`}
                </p>
              </i>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h4 style={{ color: "#1b1b25" }}>{ele.LastDayValue}</h4>
              <p
                style={{
                  color: ele.ColorCode === 1 ? "#3ea04f" : "red",
                  fontSize: "12px",
                }}
              >
                {ele.CurrentTrend}
              </p>
            </div>
          </>
        );

      default:
        break;
    }
  };

  // console.log(Type);

  return [1, 2, 3, 4].includes(Number(Type)) ? (
    <div className="mainBox1" id="sda">
      <div className="mainHeader">
        <h4>{t(CardName)}</h4>
      </div>
      <div className="mainBoxes">
        {dataMap?.map((ele, index) => {

          let randomColor = generateRandomColor();
          return (
            <>
              <div
                className="box1 box2d"
                style={{
                  backgroundColor: randomColor,
                }}
                key={index}
                onClick={() => handleClickGetDashboardDetailAPI(CardName, ele)}
              >
                {ICON_TYPE(Type, ele)}
              </div>
            </>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="row">
      {Number(Type) === 5 ? (
        <div className="col-md-6 col-sm-12 heightSec">
          <div className="box box-down cyan">
            {dataMap?.map((item, index) => {
              return (
                <>
                  <div className="subBoxM" key={index}>
                    <h2>{item.TypeName}</h2>
                    <p>{item?.CurrDayValue}</p>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="col-md-6 col-sm-12 heightSec">
          <div className="box box-down orange">
            {dataMap?.map((item, index) => {
              return (
                <>
                  <div className="subBoxM" key={index}>
                    <h2>{item.TypeName}</h2>
                    <p>{item?.CurrDayValue}</p>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardSection;
