import React, { useEffect, useRef, useState } from "react";
import { ArrowDownIconSVG, ArrowRightIconSVG } from "../../SvgIcons";


function TreeViewTable({ thead, tbody, isSNo, isTreeOpen, handleClick, style, scrollView, tableHeight, isRemoveArrow=true, isShowBorder }) {

  // in tbody array of object and make sure object must have three key id,groupName and children 
  let SNo = 0

  let obj = {}
  const [expanded, setExpanded] = useState({});
  const openTree = (data) => {
    data?.map((val) => {
      obj[val?.id] = true
      if (val?.children?.length > 0) {
        openTree(val?.children)
      }
      setExpanded(obj)
    })
  }
  useEffect(() => {
    if (tbody?.length === 0) {
      setExpanded({})
    }
    if (isTreeOpen) {
      openTree(tbody)
    }
  }, [tbody])



  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderRows = (items, level = 0) => {

    return items.map((item, index) => {
      const keys = Object.keys(item)?.filter((key) => (key !== "children"));
      SNo += 1
      return (
        <React.Fragment key={Math.random()}>
          <tr className="border-b " key={index}>

            {keys?.map((bodyData, inx) => {
              if (bodyData !== "groupName") {
                if (isSNo && bodyData === "id") {
                  return <><td className="flex items-center px-2 " key={Math.random()}>{item?.id?.length === 1 ? <strong>{SNo}</strong> : SNo}  </td>
                    {/* {item?.id?.isHideId && */}
                    <td className="flex items-center" key={Math.random() + 1} onClick={handleClick ? () => { handleClick(item, bodyData, index) } : () => { }}>  {item?.id?.length === 1 ? <strong>{item[bodyData]}</strong> : item[bodyData]} </td>
                    {/*  } */}
                  </>
                } else {

                  return <>
                    <td className="flex items-center" key={Math.random()} onClick={handleClick ? () => { handleClick(item, bodyData, index) } : () => { }}>  {(item?.groupName?.isHideId && bodyData === "id") ? <></> : item?.id?.length === 1 ? <strong>{item[bodyData]}</strong> : item[bodyData]}
                    </td>
                  </>
                }
              } else {

                return <td className=" flex items-center" key={Math.random()}>
                  <div style={{ paddingLeft: `${level * 30}px`, marginBottom: "0px" }}>
                    {isRemoveArrow ? ((item[bodyData] && item?.children?.length > 0)) && (
                      <span onClick={() => toggleExpand(item.id)} className="mr-2 pointer-cursor no-print" >
                        {
                          isRemoveArrow ?
                            expanded[item.id] ?
                              <span onClick={handleClick ? () => { handleClick(item, "close", index) } : () => { }}> <ArrowDownIconSVG /></span>
                              :
                              <span  onClick={handleClick ? () => { handleClick(item, "open", index) } : () => { }}> <ArrowRightIconSVG /> </span>
                            :
                            <></>
                        }
                      </span>
                    ): <span onClick={() => toggleExpand(item.id)} className="mr-2 pointer-cursor no-print" >
                    {
                      // isRemoveArrow ?
                        expanded[item.id] ?
                          <span onClick={handleClick ? () => { handleClick(item, "close", index) } : () => { }}> <ArrowDownIconSVG /></span>
                          :
                          <span  onClick={handleClick ? () => { handleClick(item, "open", index) } : () => { }}> <ArrowRightIconSVG /> </span>
                        // :
                        // <></>
                    }
                  </span>}
                    <span onClick={handleClick ? () => { handleClick(item, bodyData, index) } : () => { }} className={`${handleClick && "pointer-cursor"}`}> {item?.id?.length === 1 ? <strong>{item[bodyData]?.name ? item[bodyData]?.name : item[bodyData]}</strong> : item[bodyData]?.name ? item[bodyData]?.name : item[bodyData]} </span>
                  </div>
                </td>
              }
            })}

          </tr>

          {item.children?.length > 0 && expanded[item.id] && renderRows(item.children, level + 1)}
        </React.Fragment>
      )
    });
  };

  return (
    // <div className="  spatient_registration_card">
    //   <div className="patient_registration card">
    <>
      {tbody?.length > 0 &&
        <div style={style}
          className={`${tableHeight} ${scrollView} custom-scrollbar TabScroll pb-2`}>
          <table className={`w-full  mainTreeTable mainTable ${isShowBorder ? "mainTreeTableBorder" : ""}`} style={{ border: "none" }}>
            <thead id="treeviewTable">
              <tr className="bg-gray-200 ">
                {thead?.map((val, index) => {
                  return <th className="p-2 text-left" key={Math.random()}
                    style={{ width: val?.width ? val?.width : "", textAlign: val?.textAlign ? val?.textAlign : "" }}>{val?.name ? val.name : val}</th>

                })}
              </tr>
            </thead>
            <tbody>{renderRows(tbody)}</tbody>
          </table>
        </div>
      }
    </>
    //   </div>
    //  </div>
  );



}

export default TreeViewTable;
