import React from "react";

const DashboardSection = (props) => {
  const { generateColors, data, backColor1,title, ele } = props;
  return (
    <>
      <div className="mainBox1">
        <div className="mainHeader">
          <h4>{title}</h4>
          {/* <p>Sales Summary</p> */}
        </div>
        <div className="mainBoxes">
         
                  <div
                    className="box1 box2d"
                    style={{ backgroundColor: generateColors}}
                  >
                    <i
                      className={
                        ele.ColorCode === 1
                          ? "pi pi-arrow-up-right"
                          : "pi pi-arrow-down-left"
                      }
                      style={{
                        color: ele.ColorCode === 1 ? "#3CD856" : "red",
                        backgroundColor:
                          ele.ColorCode === 1 ? "#edf9ef" : "#fff5f5",
                      }}
                    />
                    <div className="d-flex align-items-center justify-content-between">
                      <h4 style={{ color: "#1b1b25" }}>
                        {ele.TypeName || ele.TextField}
                        {/* {maxLengthChecker(ele.TypeName, 8)} */}
                      </h4>
                      <p style={{ color: "#1b1b25" }}>
                        {ele.CurrDayValue || ele.ValueField}
                      </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <h4 style={{ color: "#1b1b25" }}>{ele.LastDayValue}</h4>
                      <p style={{ color: "#1b1b25" }}>{ele.CurrentTrend}</p>
                    </div>
                  </div>
               
        </div>
      </div>
    </>
  );
};

export default DashboardSection;
