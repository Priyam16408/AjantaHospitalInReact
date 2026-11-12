import React, { useCallback, useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import {
  DischargeSummaryBindEMRHeader,
  DischargeSummarySaveEMRHeader,
  DischargeSummarySaveEMRHeaderTable,
} from "../../../networkServices/dischargeSummaryAPI";
import {
  handleDischargeSummarySaveEMRHeaderTablePayload,
  notify,
} from "../../../utils/utils";
import DragAndDropTable from "../../../components/UI/DragAndDropTable";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";

const initalValues = {
  headerName: "",
};


const DischargeSummaryHeaderMaster = () => {
  const [t] = useTranslation();
  const THEAD = [t("S.No."), t("Header Name"), t("Sequence No."), t("Status")];
  const [payload, setPayload] = useState({ ...initalValues });
  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleDischargeSummaryBindEMRHeader = async () => {
    try {
      const response = await DischargeSummaryBindEMRHeader();
      setTableData(response?.data);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleDischargeSummarySaveEMRHeader = async () => {
    try {
      const response = await DischargeSummarySaveEMRHeader(payload?.headerName);
      notify(response?.message, response?.success ? "success" : "error");
      setPayload({ ...initalValues });
      handleDischargeSummaryBindEMRHeader();
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleChangeTableRadio = (e, name, index) => {
    const { value } = e.target;
    const data = [...tableData];
    data[index][name] = value;
    setTableData(data);
  };

  const handleOnDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) {
      return;
    }

    // Create a new array by copying the current state
    const reorderedRows = [...tableData];

    // Remove the item from the source position and insert it in the destination
    const [movedRow] = reorderedRows.splice(source.index, 1);
    reorderedRows.splice(destination.index, 0, movedRow);

    // Use the spread operator to create a new array reference and update the state
    setTableData(reorderedRows); // This ensures a new reference is passed
  };

  const handleTableData = useCallback(
    (tableData) => {
      return tableData?.map((rows, index) => {
        return {
          uniqueID: rows?.Header_ID,
          Sno: index + 1,
          HeaderName: rows?.HeaderName,
          SeqNo: rows?.SeqNo,
          IsActive: (
            <div className="d-flex align-items-center p-1">
              <div className="mx-2">
                <input
                  type="radio"
                  name={`IsActive-${rows?.Header_ID}`}
                  value={1}
                  id={`Active-${rows?.Header_ID}`}
                  checked={Number(rows?.IsActive) === 1}
                  onChange={(e) => handleChangeTableRadio(e, "IsActive", index)}
                />
              </div>
              <label className="m-0" htmlFor={`Active-${rows?.Header_ID}`}>
                {t(rows?.Active)}
              </label>
              <div className="mx-2">
                <input
                  type="radio"
                  name={`IsActive-${rows?.Header_ID}`}
                  value={0}
                  className="mx-1"
                  id={`DeActive-${rows?.Header_ID}`}
                  checked={Number(rows?.IsActive) === 0}
                  onChange={(e) => handleChangeTableRadio(e, "IsActive", index)}
                />
                <label className="m-0" htmlFor={`DeActive-${rows?.Header_ID}`}>
                  {t(rows?.DeActive)}
                </label>
              </div>
            </div>
          ),
        };
      });
    },
    [tableData]
  );

  const handleDischargeSummarySaveEMRHeaderTable = async () => {
    store.dispatch(setLoading(true));
    try {
      const requestBody =
        handleDischargeSummarySaveEMRHeaderTablePayload(tableData);
      const response = await DischargeSummarySaveEMRHeaderTable({
        emrHeader: requestBody,
      });
      notify(response?.message, response?.success ? "success" : "error");
      handleDischargeSummaryBindEMRHeader();
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    handleDischargeSummaryBindEMRHeader();
  }, []);
  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("HeadingName")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control required-fields"
            id="headerName"
            lable={t("HeaderName")}
            placeholder=" "
            required={true}
            value={payload?.headerName}
            respclass="col-10"
            name="headerName"
            onChange={handleChange}
          />
          <div className="col-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleDischargeSummarySaveEMRHeader}
            >
              {t("Save")}
            </button>
          </div>

          <div className="col-12">
            <DragAndDropTable
              thead={THEAD}
              tbody={handleTableData(tableData)}
              handleOnDragEnd={handleOnDragEnd}
              uniqueID={"uniqueID"}
            />
          </div>
          <div className="col-12 mt-1">
            <div className="d-flex align-items-center justify-content-end">
              <button
                className="btn btn-sm btn-primary"
                onClick={handleDischargeSummarySaveEMRHeaderTable}
              >
                {t("Update Sequence Status")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DischargeSummaryHeaderMaster;
