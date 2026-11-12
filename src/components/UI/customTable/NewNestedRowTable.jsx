import React, { useRef, useState } from "react";
import Table from "react-bootstrap/Table";

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
  WWW
}) {
  const isMobile = window.innerWidth <= 768;
  const activeRowRef = useRef(null);

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
              <thead style={{ zIndex: 1 }}>
                <tr>
                  {thead?.map((headData, index) => (
                    <th
                      key={index}
                      style={{ width: headData?.width ? headData?.width : "" }}
                    >
                      {headData?.name ? headData?.name : headData} &nbsp;
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
                        className={getRowClass ? getRowClass(ele) : ""}
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
                          >
                            {(!Array.isArray(ele[bodyData])) && ele[bodyData]?.label
                              ? ele[bodyData]?.label
                              : (!Array.isArray(ele[bodyData])) && ele[bodyData]}
                            {isMobile && <>&nbsp;</>}
                          </td>
                        ))}
                      </tr>
                      {/* Render the nested table if subRow exists */}
                      {ele?.subRow?.subRowList && ele?.subRow?.isopen && ele?.subRow?.subRowList?.length > 0 && (
                        <tr >
                          <td colSpan={thead?.length} className="nestedTableTD">
                            <Table className="nestedTable" bordered>
                              <thead>
                                <tr>
                                  {/* {console.log("ele.subRow",ele.subRow[0])} */}
                                  {seondThead?.map((key, idx) => (
                                    <th key={idx}>{key}</th>
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
                                {ele?.subRow?.subRowList?.map((subRowData, subIndex) => (
                                  <tr key={subIndex}>
                                    {Object.keys(subRowData).map((key, idx) => (
                                      <td key={idx}>{subRowData[key]}</td>
                                    ))}
                                  </tr>
                                ))}
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
