import React, { useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";

function NestedRowTable({
  thead,
  tbody,
  fs,
  getRowClass,
  style,
  tableHeight,
  scrollView,
  getRowClick,
  seondThead,
  WWW,
  SubtableClass,
  handleSubRow,
  zIndex
}) {
  const isMobile = window.innerWidth <= 768;
  const activeRowRef = useRef(null);
  const {t}=useTranslation()
  // Function to handle row click
  const handleRowClick = (rowRef, rowColor, ele) => {
    getRowClick && getRowClick(ele);
    // Reset the previous active row style if it exists
    if (activeRowRef.current) {
      activeRowRef.current.style.backgroundColor = "";
    }
    // Set the new active row style
    if (rowRef) {
      rowRef.style.backgroundColor = "lightblue";
      activeRowRef.current = rowRef;
    }
  };

  return (
    tbody?.length > 0 && (
      <div
        id="no-more-tables"
        style={style}
        className={`${tableHeight} ${scrollView} custom-scrollbar TabScroll`}
      >
        <div className="row">
          <div className="col-12">
            <Table className="mainTable pt-2 pl-2 pr-2" bordered>
              <thead style={{ zIndex: zIndex || 1 }}>{/*  // zIndex is changed */}
                <tr>
                  {thead?.map((headData, index) => (
                    <th
                      key={index}
                      style={{ width: headData?.width ? headData?.width : "" }}
                      className="px-2"
                    >
                      {/* <span className="px-2"> */}
                      {t(headData?.name ? headData?.name : headData)} &nbsp;
                      {/* </span> */}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody style={{ backgroundColor: "white" }}>
                {tbody?.map((ele, index) => {
                  const keys = Object.keys(ele).filter(
                    (key) => key !== "subRow"
                  );
                  // const keys = Object.keys(ele).filter(
                  //   (key) => key !== "colorcode"
                  // );

                  const rowColor = ele.colorcode || ""; // Use colorcode if present

                  return (
                    <React.Fragment key={index}>
                      <tr
                        className={getRowClass ? getRowClass(ele, index) : ""}
                        style={{ backgroundColor: rowColor }}
                        onClick={(e) =>
                          handleRowClick(e.currentTarget, rowColor, ele)
                        }
                      >
                        {keys?.map((bodyData, inx) => (
                          <td
                            key={inx}
                            data-title={
                              thead[inx]?.name ? thead[inx]?.name : thead[inx]
                            }
                            style={{ width: WWW }}
                            className="px-2"
                          >
                            {!Array.isArray(ele[bodyData]) &&
                              ele[bodyData]?.label ? (
                              ele[bodyData]?.label
                            ) : !Array.isArray(ele[bodyData]) &&
                              ele[bodyData] ? (
                              ele[bodyData]
                            ) : (
                              <>&nbsp;</>
                            )}
                            {isMobile && <>&nbsp;</>}
                          </td>
                        ))}
                      </tr>
                      {/* Render the nested table if subRow exists */}
                      {/* {console.log("ele?.subRow?.subRowList",ele)} */}
                      {ele?.subRow?.subRowList &&
                        ele?.subRow?.isopen &&
                        ele?.subRow?.subRowList?.length > 0 && (
                          <tr>
                            <td
                              colSpan={thead?.length}
                              className="nestedTableTD"
                            >
                              <Table
                                className={`nestedTable ${SubtableClass}`}
                                bordered
                              >
                                <thead>
                                  <tr>
                                    {/* {console.log("ele.subRow",ele.subRow[0])} */}
                                    {(
                                      ele?.subRow?.secondThead ?? seondThead
                                    )?.map((key, idx) => (
                                      <th
                                        key={idx}
                                        id={index}
                                        style={{
                                          width: key?.width ? key?.width : "",
                                        }}
                                      >
                                        {key?.name ? key?.name : key} &nbsp;
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* {ele.subRow.map((subRowData, subIndex) => (
                                  <tr key={subIndex}>
                                    {seondThead.map((key, idx) => (
                                      <td key={idx}>{key}</td>
                                    ))}
                                  </tr>
                                ))} */}
                                  {ele?.subRow?.subRowList?.map(
                                    (subRowData, subIndex) => (
                                      <tr
                                        key={subIndex}
                                        className={`${handleSubRow &&
                                          handleSubRow(
                                            subRowData,
                                            index,
                                            subIndex
                                          )}`}
                                        // style={{
                                        //   background:
                                        //     handleSubRow &&
                                        //     handleSubRow(
                                        //       subRowData,
                                        //       index,
                                        //       subIndex
                                        //     ),
                                        // }}
                                      >
                                        {Object.keys(subRowData).map(
                                          (key, idx) => (
                                            <td
                                              key={idx}
                                              data-title={
                                                ele?.subRow?.secondThead ? (
                                                  ele?.subRow?.secondThead[idx]
                                                    ?.name ? (
                                                    ele?.subRow?.secondThead[
                                                      idx
                                                    ]?.name
                                                  ) : ele?.subRow?.secondThead[
                                                    idx
                                                  ] ? (
                                                    ele?.subRow?.secondThead[
                                                    idx
                                                    ]
                                                  ) : (
                                                    <>&nbsp;</>
                                                  )
                                                ) : seondThead[idx]?.name ? (
                                                  seondThead[idx]?.name
                                                ) : seondThead[idx] ? (
                                                  seondThead[idx]
                                                ) : (
                                                  <>&nbsp;</>
                                                )
                                              }
                                            >
                                              {subRowData[key]}{" "}
                                              {isMobile && <>&nbsp;</>}{" "}
                                            </td>
                                          )
                                        )}
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    )
  );
}

export default NestedRowTable;
