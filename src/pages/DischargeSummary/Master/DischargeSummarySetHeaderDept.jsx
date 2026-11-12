import React, { useCallback, useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useDispatch } from "react-redux";
import { GetBindDepartment } from "../../../store/reducers/common/CommonExportFunction";
import { useSelector } from "react-redux";
import {
  DischargeSummarySaveSetHeaderDeptWisePayload,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../utils/utils";
import {
  DischargeSummaryBindHeaderList,
  DischargeSummarySaveSetHeaderDeptWise,
} from "../../../networkServices/dischargeSummaryAPI";
import Tables from "../../../components/UI/customTable";
import Input from "../../../components/formComponent/Input";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";


const DischargeSummarySetHeaderDept = () => {
  const [t] = useTranslation();
  const THEAD = [t("Select"), t("S.No."), t("Header Name"), t("Seq. No.")];
  const dispatch = useDispatch();
  const { GetDepartmentList } = useSelector((state) => state?.CommonSlice);
  const [tableData, setTableData] = useState([]);
  const [depatmentID, setDepartmentID] = useState("");

  const handleDepartmentData = useCallback(
    (departmentArray) => {
      return handleReactSelectDropDownOptions(departmentArray, "Name", "ID");
    },
    [GetDepartmentList]
  );

  const handleDischargeSummaryBindHeaderList = async (_, e) => {
    dispatch(setLoading(true));
    try {
      const response = await DischargeSummaryBindHeaderList(e?.value);
      setTableData(response?.data);
      setDepartmentID(e?.value);
    } catch (error) {
      console.log(error, "Something Went Wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleTableChange = (e, index) => {
    const { name, value, checked, type } = e.target;
    const data = [...tableData];
    data[index][name] = type === "checkbox" ? checked : value;
    setTableData(data);
  };

  const handleTable = useCallback(
    (tableData) => {
      return tableData?.map((item, index) => {
        return {
          select: (
            <input
              type="checkbox"
              checked={
                typeof item?.chk === "string"
                  ? item?.chk === "false"
                    ? false
                    : true
                  : item?.chk
              }
              name="chk"
              onChange={(e) => handleTableChange(e, index)}
            />
          ),
          Sno: index + 1,
          HeaderName: item?.HeaderName,
          SeqNo: (
            <Input
              type="text"
              className="table-input"
              removeFormGroupClass={true}
              name="SeqNo"
              value={item?.SeqNo}
              onChange={(e) => handleTableChange(e, index)}
            />
          ),
        };
      });
    },
    [tableData]
  );

  const handleDischargeSummarySaveSetHeaderDeptWise = async () => {
    dispatch(setLoading(true))
    try {
      const requestBody =
        DischargeSummarySaveSetHeaderDeptWisePayload(tableData);
      const response = await DischargeSummarySaveSetHeaderDeptWise({
        department: Number(depatmentID),
        btnSave: requestBody,
      });

      notify(response?.message, response?.success ? "success" : "error");
      handleDischargeSummaryBindHeaderList(_, { value: depatmentID });
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }finally{
        dispatch(setLoading(false))
    }
  };

  useEffect(() => {
    if (GetDepartmentList?.length === 0) dispatch(GetBindDepartment());
  }, []);
  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("HeadingName")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Department")}
            searchable={true}
            respclass="col-md-6 col-12"
            id={"Department"}
            name={"Department"}
            removeIsClearable={true}
            handleChange={handleDischargeSummaryBindHeaderList}
            dynamicOptions={handleDepartmentData(GetDepartmentList)}
            value={depatmentID}
          />

          <div className="col-12">
            <Tables thead={THEAD} tbody={handleTable(tableData)} />
          </div>

          <div className="col-12 mt-1 d-flex align-items-center justify-content-end">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleDischargeSummarySaveSetHeaderDeptWise}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DischargeSummarySetHeaderDept;
