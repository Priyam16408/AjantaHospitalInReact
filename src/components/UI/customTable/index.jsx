import React, { useEffect, useMemo, useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import {
  SortSVGIcon,
  IncreaseIngSortSVGIcon,
  DecreaseIngSortSVGIcon,
} from "../../../components/SvgIcons/index.jsx";
import Input from "../../formComponent/Input.jsx";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
function Tables({
  thead,
  tbody,
  fs,
  getRowClass,
  style,
  tableHeight,
  scrollView,
  getRowClick,
  WWW,
  handleClassOnRow,
  handleDoubleClick,
  isSearch,
  notSingleClick = true,
}) {
  const [t] = useTranslation();
  const [handleLanguageStatus, setHandleLanguageStatus] = useState(true);
  const [search, setSearch] = useState("");
  // { index, type: "ASC" | "DESC" } | null
  const [sort, setSort] = useState(null);
  const isMobile = window.innerWidth <= 768;
  const activeRowRef = useRef(null);

  // Rows are derived from props, never copied into state. Copying `tbody` into
  // state and syncing it in an effect made the table render one commit behind
  // its props, which reset controlled inputs (medicine name, remarks, ...) to
  // their previous value for a frame and swallowed keystrokes when typing fast.
  const bodyData = useMemo(() => {
    let rows = tbody || [];

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((obj) =>
        Object.values(obj)?.some(
          (value) => typeof value === "string" && value?.toLowerCase().includes(q)
        )
      );
    }

    if (sort && rows.length > 0) {
      const typeName = Object?.keys(rows[0])[sort.index];
      rows = [...rows].sort((a, b) => {
        if (new Date(a[typeName]).toString() === "Invalid Date") {
          return sort.type === "DESC"
            ? b[typeName]?.localeCompare(a[typeName])
            : a[typeName]?.localeCompare(b[typeName]);
        }
        return sort.type === "DESC"
          ? new Date(b[typeName]) - new Date(a[typeName])
          : new Date(a[typeName]) - new Date(b[typeName]);
      });
    }

    return rows;
  }, [tbody, search, sort]);

  const theadData = useMemo(() => {
    if (!(tbody?.length > 0)) return [];
    return (
      thead?.map((val, index) => {
        const base = typeof val === "object" ? { ...val } : { name: val };
        const isElementCell =
          typeof Object?.values(tbody[0])[index] === "object";
        let type = isElementCell ? "" : "N";
        if (type === "N" && sort?.index === index) {
          type = sort.type;
        }
        return { ...base, type };
      }) || []
    );
  }, [thead, tbody, sort, handleLanguageStatus]);

  // i18next.on("languageChanged", (lng) => {
  //   console.log("Asdasd",lag)
  //   setHandleLanguageStatus(!handleLanguageStatus)
  // });

  // Handle Sort Functionality

  const handleSortTable = (index, type) => {
    setSort({ index, type });
  };

  // handle Search Item
  const handleItemSearch = (e) => {
    setSearch(e?.target?.value || "");
  };

  // Function to handle row click
  const handleRowClick = (rowRef, ele, index) => {
    getRowClick && getRowClick(ele, index);

    if (activeRowRef.current) {
      // Reset the previous active row to its original color
      const originalColor = activeRowRef.current.getAttribute(
        "data-original-color"
      );
      activeRowRef.current.style.backgroundColor = originalColor;
    }

    // Set the new active row style
    if (rowRef) {
      // Store the original color of the new active row
      rowRef.setAttribute("data-original-color", rowRef.style.backgroundColor);
      rowRef.style.backgroundColor = "lightblue";
      activeRowRef.current = rowRef;
    }
  };

  return (
    <>
      {tbody?.length > 0 && isSearch && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "2px",
          }}
        >
          <Input
            type="text"
            className="table-input my-1"
            respclass={"width-250"}
            removeFormGroupClass={true}
            placeholder={t("Search")}
            onChange={handleItemSearch}
            // placeholderLabel={<i className="fa fa-search search_icon" aria-hidden="true"></i>}
          />
        </div>
      )}
      {(bodyData?.length > 0 || search) && (
        <div
          id="no-more-tables"
          style={style}
          className={`${tableHeight} ${scrollView} custom-scrollbar TabScroll`}
        >
          <div className="row">
            <div className="col-12">
              <Table className="mainTable pt-2  " bordered>
                <thead style={{ zIndex: 1 }}>
                  <tr>
                    {theadData?.map((headData, index) => (
                      <th
                        key={index}
                        style={{
                          width: headData?.width ? headData?.width : "",
                          textAlign: headData?.textAlign
                            ? headData?.textAlign
                            : "",
                          marginLeft: "3px",
                        }}
                        className={`${headData?.className ? headData?.className : ""}`}
                      >
                        {headData?.type === "" && (
                          <> {headData?.name ? headData.name : headData}</>
                        )}
                        {headData?.type === "N" && (
                          <span
                            className="pointer-cursor"
                            onClick={() => {
                              handleSortTable(index, "ASC");
                            }}
                          >
                            {headData?.name ? headData.name : headData}

                            <SortSVGIcon />
                          </span>
                        )}
                        {headData?.type === "ASC" && (
                          <span
                            className="pointer-cursor"
                            onClick={() => {
                              handleSortTable(index, "DESC");
                            }}
                          >
                            {" "}
                            {headData?.name ? headData.name : headData}
                            <IncreaseIngSortSVGIcon />
                          </span>
                        )}
                        {headData?.type === "DESC" && (
                          <span
                            className="pointer-cursor"
                            onClick={() => {
                              handleSortTable(index, "ASC");
                            }}
                          >
                            {" "}
                            {headData?.name ? headData.name : headData}
                            <DecreaseIngSortSVGIcon />
                          </span>
                        )}
                        &nbsp;
                      </th>
                    ))}
                  </tr>
                </thead>
                {bodyData?.length > 0 ? (
                  <tbody style={{ backgroundColor: "white" }}>
                    {bodyData?.map((ele, index) => {
                      const keys = Object.keys(ele).filter(
                        (key) => key !== "colorcode"
                      );
                      const rowColor = ele.colorcode || "";
                      // console.log(rowColor)
                      return (
                        <tr
                          key={index}
                          className={getRowClass ? getRowClass(ele, index) : ""}
                          style={{ backgroundColor: rowColor }}
                          onClick={(e) =>
                            notSingleClick
                              ? handleRowClick(e.currentTarget, ele, index)
                              : undefined
                          }
                          onDoubleClick={(e) =>
                            handleDoubleClick && handleDoubleClick(ele, index)
                          }
                        >
                          {keys?.map((bodyData, inx) => (
                            <td
                              key={inx}
                              data-title={
                                theadData[inx]?.name
                                  ? theadData[inx]?.name
                                  : theadData[inx]
                              }
                              style={{ width: WWW }}
                              className={`
                            ${
                              handleClassOnRow
                                ? handleClassOnRow(
                                    ele,
                                    theadData[inx]?.name
                                      ? theadData[inx]?.name
                                      : theadData[inx]
                                  )
                                : "px-2"
                            }`}
                            >
                              {ele[bodyData]?.label ? (
                                ele[bodyData]?.label
                              ) : ele[bodyData] ? (
                                ele[bodyData]
                              ) : (
                                <>&nbsp;</>
                              )}
                              {isMobile && <>&nbsp;</>}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <td colSpan="200" className="text-center">
                    {" "}
                    {t("No data found")}
                  </td>
                )}
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Tables;
