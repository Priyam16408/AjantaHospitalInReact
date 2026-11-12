import React from "react";

import Tables from "../../../../components/UI/customTable";
import Heading from "../../../../components/UI/Heading";
import Input from "../../../../components/formComponent/Input";

const DetailsTablse = ({
  thead,
  tbody,
  handleChangeCheckbox,
  handleCustomInput,
}) => {
  console.log(tbody);
  return (
    <>
      {tbody?.length > 0 && (
        <>
          <Heading title={"Search Result"} />
          {/* <div className="row"> */}
          <Tables
            thead={thead}
            tbody={tbody?.map((ele, index) => ({
              Action: (
                <div className="text-center">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      handleChangeCheckbox(e, ele, index);
                    }}
                    checked={ele?.isChecked ? ele?.isChecked : false}
                  />
                </div>
              ),
              ItemName: ele?.ItemName,
              BatchNumber: ele?.BatchNumber,

              MedExpiryDate: ele?.MedExpiryDate,
             
            }))}
            style={{ maxHeight: "162px" }}
          />
          {/* </div> */}
        </>
      )}
    </>
  );
};

export default DetailsTablse;
