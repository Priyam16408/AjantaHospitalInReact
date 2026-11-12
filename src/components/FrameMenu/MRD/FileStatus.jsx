import React, { useCallback, useEffect, useState } from "react";
import Heading from "../../UI/Heading";
import { useTranslation } from "react-i18next";
import LabeledInput from "../../formComponent/LabeledInput";
import { MRDGetFileStatus } from "../../../networkServices/MRDApi";
import Tables from "../../UI/customTable";
import ColorCodingSearch from "../../commonComponents/ColorCodingSearch";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import { notify } from "../../../utils/utils";

const THEAD = [
  "S.No.",
  "File No.",
  "IPD No.",
  "UHID",
  "Room Name",
  "Rack",
  "Document",
];

const COLOR_CODE_LABEL = [
  {
    label: "ALL",
    value: "ALL",
  },
  {
    label: "Received and Completed",
    value: "A",
  },
  {
    label: "Received and InComplete",
    value: "B",
  },
  {
    label: "Document Not Received",
    value: "C",
  },
  {
    label: "Document Not Required ",
    value: "D",
  },
];

const COLOR_STATUS = {
  ALL: "#F778A1",
  A: "#64E986",
  B: "#6699FF",
  C: "#FFA500",
  D: "#F75D59",
};

const FileStatus = ({ data }) => {
  const [t] = useTranslation();

  const [tableData, setTableData] = useState([]);

  const handleMRDGetFileStatus = async (tid, Status) => {
    store.dispatch(setLoading(true));
    try {
      const response = await MRDGetFileStatus({
        tid: String(tid),
        status: String(Status),
      });
      
      if (!response?.success)
        notify(response?.message, response?.success ? "success" : "error");

      setTableData(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  const handleTableData = (tableData) => {
    return tableData?.map((row, index) => {
      const { FileID, PID, TransNO, RoomName, Almirah, Document, Status } = row;
      return {
        SNO: <div className="p-1">{index + 1}</div>,
        FileID: FileID,
        TransNO: TransNO,
        PID: PID,
        RoomName: RoomName,
        Almirah: Almirah,
        Document: Document,
        colorcode: COLOR_STATUS[Status],
      };
    });
  };

  const handleLabelData = (data, TransNO) => {
    const LabelData = [
      {
        label: "Patient Type",
        value: data?.type,
      },
      {
        label: "Patient Name",
        value: data?.pName,
      },
      {
        label: "MLC Number",
        value: "",
      },
      {
        label: "Bill No.",
        value: data?.billNo,
      },
      {
        label: "Discharge Date",
        value: data?.dischargeDate,
      },
      {
        label: "IPD No.",
        value: TransNO,
      },
    ];

    return LabelData.map((row, index) => (
      <div className="col-xl-2 col-md-3 col-sm-4 col-12" key={index}>
        <LabeledInput
          label={row?.label}
          value={row?.value}
          className={"w-100"}
        />
      </div>
    ));
  };

  useEffect(() => {
    handleMRDGetFileStatus(data?.transactionID, "ALL");
  }, [data]);

  return (
    <div>
      <Heading title={t("File Status")} isBreadcrumb={false} />

      <div className="row mt-1 p-1">
        {handleLabelData(data, tableData[0]?.TransNO)}

        <div className="col-12 mt-2 d-flex align-items-center justify-content-end">
          {COLOR_CODE_LABEL.map((row, index) => (
            <ColorCodingSearch
            key={index}
              label={row?.label}
              color={COLOR_STATUS[row?.value]}
              onClick={() =>
                handleMRDGetFileStatus(data?.transactionID, row?.value)
              }
            />
          ))}
        </div>
      </div>

      <div className="row py-1">
        <div className="col-12">
          <Tables thead={THEAD} tbody={handleTableData(tableData)} />
        </div>
      </div>
    </div>
  );
};

export default FileStatus;
