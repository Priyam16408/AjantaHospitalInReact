import React from "react";
import { BedSVG } from "../../../components/SvgIcons";
import { Tooltip } from "primereact/tooltip";

const BedDetail = ({ bedDetails }) => {
  
  const handleToolTipData = (data) => {
    return data?.PDetails.replace(/&#13;/g, "\n");
  };

  return (
    <div style={{ maxHeight: "50vh", overflowY: "scroll" }}>
      <table className="w-100" cellSpacing={0}>
        <tbody>
          {Object.keys(bedDetails)?.map((items, index) => {
            return (
              <>
                <tr key={index}>
                  <td className="text-center bg-primary" colSpan={2}>
                    {items}
                  </td>
                </tr>
{console.log("aaaaaaaaaaaaaaaaajjjjjjjjjjj",bedDetails)}
                {Object.keys(bedDetails[items])?.map((row, inx) => {
                  return (
                    <tr key={inx} className="w-100">
                      <td style={{ width: "150px" }}>{row}</td>
                      <td>
                        {bedDetails[items][row]?.map((ele, key) => {
                          return (
                            <>
                              <span
                                key={key}
                                id={`${row + key}`}
                                data-pr-position="top"
                                data-pr-tooltip={handleToolTipData(ele)}
                                className="mx-1"
                              >
                                {ele?.img ? (
                                  <img src={ele?.img} width={"5%"} />
                                ) : (
                                  <BedSVG fill={"orange"} />
                                )}
                              </span>
                            </>
                          );
                        })}
                      </td>
                    </tr>
                  );
                })}
              </>
            );
          })}

          <Tooltip
            target="[data-pr-tooltip]"
            event="hover"
            content={(item) => (
              <span
                dangerouslySetInnerHTML={{ __html: handleToolTipData(item) }}
              />
            )}
          />
        </tbody>
      </table>
    </div>
  );
};

export default BedDetail;
