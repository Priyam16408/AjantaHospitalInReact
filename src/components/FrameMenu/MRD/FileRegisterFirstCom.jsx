import React, { useState, useEffect } from "react";
import {
  MRDBindDocuments,
  MRDFileRegisterSave,
} from "../../../networkServices/MRDApi";
import Heading from "../../UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../UI/customTable";
import Input from "../../formComponent/Input";
import HtmlSelect from "../../formComponent/HtmlSelect";
import { AMOUNT_REGX } from "../../../utils/constant";
import { MRDFileRegisterSavePayload, notify } from "../../../utils/utils";

const DOCUMENT_TYPE = [
  {
    label: "Received and Completed",
    value: "a",
  },
  {
    label: "Received and InComplete",
    value: "b",
  },
  {
    label: "Document Not Received",
    value: "c",
  },
  {
    label: "Document Not Required",
    value: "d",
  },
];

const FileRegisterFirstCom = ({ data, setPatientDetail }) => {
  const [t] = useTranslation();
  const [tableData, setTabledata] = useState([]);
  const [dtfileno, setDtfileno] = useState();
  const [remainingHeight, setRemainingHeight] = useState(0);

  // const handleChangeHead = (e) => {
  //   let data = JSON.parse(JSON.stringify(tableData))
  //   data?.map((val) => {
  //     val[e.target.value] = "true"
  //     return val
  //   })
  //   setTabledata(data)

  // }

  const handleChangeHead = (e, index) => {
    const { value } = e.target;
    const obj = {
      a: "false",
      b: "false",
      c: "false",
      d: "false",
    };

    obj[value] = "true";

    const data = [...tableData]?.map((val) => {
      val = { ...val, ...obj }
      return val
    })
    setTabledata(data);
  };

  const THEAD = [
    "SeqNo.",
    { name: "Name", width: "40%" },
    "Qty.",
    {
      name: (
        <HtmlSelect
          placeHolder={"Select Document Type"}
          option={DOCUMENT_TYPE}
          className={"table-input"}
          onChange={handleChangeHead}
        />
      ),
      width: "30%",
    },
  ];

  const handleMRDBindDocuments = async (transactionID) => {
    try {
      const response = await MRDBindDocuments(transactionID);
      if(response?.success){
        setTabledata(response?.data?.dt);
        setDtfileno(response?.data?.dtfileno[0])
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleCheckValue = (a, b, c, d) => {
    if (a === "true") return "a";
    if (b === "true") return "b";
    if (c === "true") return "c";
    if (d === "true") return "d";
  };


  const handleSelectChange = (e, index) => {
    const { value } = e.target;
    const obj = {
      a: "false",
      b: "false",
      c: "false",
      d: "false",
    };

    obj[value] = "true";

    const data = [...tableData];

    Object.keys(obj).forEach((ele, _) => {
      data[index][ele] = obj[ele];
    });

    setTabledata(data);
  };

  const handleChangeInput = (e, index, ...rest) => {
    const { name, value } = e.target;
    const data = [...tableData];
    if (rest?.length > 0 && rest.some((ele) => ele === false)) {
      return;
    } else {
      data[index][name] = value;
    }

    setTabledata(data);
  };

  const handleMRDFileRegisterSave = async () => {
    try {
      const requestBody = MRDFileRegisterSavePayload(data, tableData,dtfileno);
      // debugger
      const response = await MRDFileRegisterSave(requestBody);
      if (response?.success) {
        notify(response?.message, "success")
        handleMRDBindDocuments(data?.transactionID)
        setPatientDetail({ ...data }, { doc: "" })
        return response;
      } else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleTableData = (tableData) => {
    return tableData?.map((item, index) => {
      const { sequenceNo, name, docQty, a, b, c, d } = item;
      return {
        sequenceNo: sequenceNo,
        name: name,
        docQty: (
          <Input
            className="table-input"
            type={"text"}
            removeFormGroupClass={true}
            value={docQty}
            name="docQty"
            onChange={(e) =>
              handleChangeInput(e, index, AMOUNT_REGX(3).test(e.target.value))
            }
          />
        ),
        Type: (<>
          <HtmlSelect
            placeHolder={"Select Document Type"}
            option={DOCUMENT_TYPE}
            className={"table-input"}
            value={handleCheckValue(a, b, c, d)}
            onChange={(e) => handleSelectChange(e, index)}
          />
        </>
        ),
      };
    });
  };

  useEffect(() => {
    handleMRDBindDocuments(data?.transactionID);
  }, []);

  useEffect(() => {
    const calculateHeight = () => {
      const headerHeight =
        document.querySelector("#screen-height").offsetHeight;
      const remainingHeight = headerHeight - 70;
      setRemainingHeight(remainingHeight);
    };

    calculateHeight();

    window.addEventListener("resize", calculateHeight);

    return () => window.removeEventListener("resize", calculateHeight);
  }, [document.querySelector("#screen-height")?.offsetHeight]);

  return (
    <div>
      <Heading
        title={t("MRDs.PatientSearchMRD.HeadingName")}
        isBreadcrumb={false}
      />
      <div className="p-1">
        <Tables
          thead={THEAD}
          tbody={handleTableData(tableData)}
          style={{
            height: remainingHeight,
          }}
        />

        <div className="d-flex align-items-center justify-content-end pt-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={handleMRDFileRegisterSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileRegisterFirstCom;
