import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../index";

const index = (props) => {
  const { thead, tbody } = props;
  const [t] = useTranslation();

  console.log(tbody);

  // const [bodyData, setBodyData] = useState([
  //   {
  //     "#": 1,

  //     Shortcuts: "AEXM2425-000001",
  //     "View Instruction": 1,
  //     "Is Critical": 1,
  //     "Triaging Code": 1,
  //     UHID: 1,
  //     "Patient Name": 1,
  //     Contact: 1,
  //     Sex: 1,
  //     Check: (
  //       <>
  //         <i
  //           className="fa fa-check"
  //           aria-hidden="true"
  //           onClick={() => show("top")}
  //         ></i>
  //       </>
  //     ),
  //   },
  // ]);
  // const handleChange = (e, index) => {
  //   console.log(bodyData);
  //   const { name, value } = e.target;
  //   const data = [...bodyData];
  //   data[index][name] = (
  //     <input
  //       value={value}
  //       onChange={(e) => handleChange(e, index)}
  //       name="input"
  //     />
  //   );
  //   setBodyData(data);
  // };
  return (
    <>
      <Tables
        thead={thead}
        tbody={tbody.map((ele, index) => ({
          SrNo: index + 1,
          UHID: ele?.PatientID,
          IPDNo: ele?.IPDno,
          PatientName: ele?.Pname,
          ContactNo: ele?.ContactNo,
          Panel: ele?.Relation,
          DateOfAdmit: ele?.DateOfAdmit,
          DateOfDischarge: ele?.DateOfDischarge,
          DoctorName: ele?.Name,
          RoomNo: ele?.Room_No,
          BedNo: ele?.Bed_No,
          Floor: ele?.Floor,
          Status: ele?.Status,
          Address: ele?.Address,
        }))}
      />
    </>
  );
};

export default index;
