import React, { useState } from "react";
import Tables from "..";
import Input from "@app/components/formComponent/Input";
import ReactSelect from "../../../formComponent/ReactSelect";

function UpdateTable() {
  const [bodyData, setBodyData] = useState([
    {
      "S.no": 1,
      testCode: "123",
      as: "Asdas",
      input: 0,
      select: 0,
      Remarks: 1,
      Rate: 1,
    },
    {
      "S.no": 2,
      testCode: "123",
      as: "Asdas",
      input: 0,
      select: 0,
      Remarks: 1,
      Rate: 1,
    },
    {
      "S.no": 3,
      testCode: "123",
      as: "Asdas",
      input: 0,
      select: 0,
      Remarks: 1,
      Rate: 1,
    },
  ]);

  const THEAD = [
    "Payment Mode",
    "Paid Amount",
    "Currency",
    "Bank Name",
    "Ref No.",
    "Machine",
    "Base",
  ];

  const handleChange = (e, index, name) => {
    const { value } = e.target;
    const data = [...bodyData];
    data[index][name] = value;
    setBodyData(data);
  };

  const handleRowClick = (index) => {
    setSelectedRowIndex(index);
    setModalData(true);
  };



  return (
    <>
      <Tables
        thead={THEAD}
        tbody={bodyData.map((row, index) => ({
          ...row,
          "S.no": (
            <span onClick={() => handleRowClick(index)}>{row["S.no"]}</span>
          ),
          input: (
            <>
              {/* <Input
                type="text"
                className="form-control"
                id="PatientName"
                placeholder=" "
                required={true}
                value={row.input}
                onChange={(e) => handleChange(e, index, "input")}
                name="input"
              /> */}
              <input
                className="table-input"
                value={row.input}
                onChange={(e) => handleChange(e, index, "input")}
                name="input"
              />
            </>
          ),
          select: (
            <>
              {/* <ReactSelect
                placeholderName={"1"}
                id="Marital_Status"
                searchable={true}
                alue={row.select}
                onChange={(e) => handleChange(e, index, "select")}
                name="select"
              /> */}
              <select
                className="table-input"
                value={row.select}
                onChange={(e) => handleChange(e, index, "select")}
                name="select"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </>
          ),
        }))}
      />
    </>
  );
}

export default UpdateTable;
