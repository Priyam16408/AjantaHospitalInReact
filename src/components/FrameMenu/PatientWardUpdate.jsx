import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import Heading from "../UI/Heading";
import { notify } from '../../utils/ustil2';
import { BindWard } from '../../networkServices/EDP/pragyaedp';
import { deletePatientIssueApi, getPatientKitchenDietListApi, updatePatientIssueApi } from '../../networkServices/DietApi';
import Tables from '../UI/customTable';
import ReactSelect from '../formComponent/ReactSelect';
import { Checkbox } from 'primereact/checkbox';
import { useWindowSize } from '../../utils/hooks/useWindowSize';

export default function PatientWardUpdate(props) {
  const { transactionID } = props?.data || {};
  const [dietList, setDietList] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [PateintWard, setPateintWard] = useState();
  const [values, setValues] = useState({});
  const { t } = useTranslation();


  const handleCheckboxChange = (e, item = null) => {
    const { checked } = e.target;

    if (!item) {
      const updatedList = dietList?.map(i => ({ ...i, isChecked: checked }));
      setDietList(updatedList);
      setAllSelected(checked);
    } else {

      const updatedList = dietList?.map(i =>
        i.ID === item.ID ? { ...i, isChecked: checked } : i
      );
      setDietList(updatedList);
      setAllSelected(updatedList?.every(i => i?.isChecked ? true : false));
    }
  };

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const { width } = useWindowSize();
  const isMobile = width <= 800;

  const THEAD = [
    { name: t("S.No"), width: "1%" },
    { name: t("Reg No"), width: "15%" },
    { name: t("IPD No"), width: "15%" },
    { name: t("Ward"), width: "10%" },
    { name: t("Diagnosis"), width: "10%" },
    { name: t("Diet"), width: "10%" },
    { name: t("Type of Diet"), width: "10%" },
    { name: t("Is Current"), width: "5%" },
    { name: t("Entry Date"), width: "10%" },
    {
      width: "1%",
      name: isMobile ? (
        t("check")
      ) : (
        <Checkbox
          checked={allSelected}
          onChange={(e) => {
            handleCheckboxChange(e);
          }}
        />
      ),
    },
  ]

  const handleGetPatientDietList = async () => {
    try {
      const response = await getPatientKitchenDietListApi(transactionID);
      if (response?.success) {
        setDietList(response?.data);
      } else {
        notify(response?.message || "Something went wrong");
        setDietList([]);
      }
    } catch (error) {
      notify(error?.message, "error");
    }
  }

  const handleWardSelection = async () => {
    try {
      const apiResp = await BindWard();
      if (apiResp.success) {
        const mappedOptions = apiResp?.data?.map(item => ({
          value: item?.IPDCaseTypeID,
          label: item?.Name
        }));
        setPateintWard(mappedOptions);
      } else notify(apiResp.message, "error");
    } catch (error) {
      notify("Error loading diet timing data", "error");
    }
  };

  const handleUpdateWard = async () => {
    if (dietList?.filter((val) => val?.isChecked)?.length === 0) {
      notify("Please select at least one row.", "warn");
      return;
    }

    if (!values?.Ward) {
      notify("Please select ward", "warn");
      return;
    }
    try {

      const filter = dietList?.filter((val) => val.isChecked);
      const res = filter?.map((val) => ({
        id: val?.ID,
        transactionID: val?.TransactionID,
        patientID: val?.PatientID,
        ipdno: val?.IPDNO,
        oldWardId: val?.WardId,
        oldWardName: val?.Ward,
        newWardId: values?.Ward?.value || '',
        newWardName: values?.Ward?.label || '',
      }));
      const response = await updatePatientIssueApi(res)
      if (response.success) {
        notify(response.message, "success")
        handleGetPatientDietList()
        setAllSelected(false);
        setValues({})
      } else {
        notify(response.message, "error");
        setAllSelected(false)
        setValues({})
      }
    } catch (error) {
      notify(error?.message, "error");
    }

  }

  const handleDeleteWard = async () => {
    if (dietList?.filter((val) => val?.isChecked)?.length === 0) {
      notify("Please select at least one row.", "warn");
      return;
    }
    try {
      const filter = dietList?.filter((val) => val?.isChecked);
      const res = filter?.map((val) => ({
        id: val?.ID
      }));
      const response = await deletePatientIssueApi(res)
      if (response?.success) {
        notify(response?.message, "success")
        handleGetPatientDietList()
        setAllSelected(false);
        setValues({})
      } else {
        notify(response?.message, "error");
        setAllSelected(false)
        setValues({})
      }

    } catch (error) {
      notify(error?.message, "error");
    }

  }


  useEffect(() => {
    handleGetPatientDietList();
    handleWardSelection();
  }, []);

  return (
    <div>
      <Heading title={"Diet Details"} isBreadcrumb={false} />
      {dietList?.length > 0 && (
        <>
          <div className='d-sm-flex m-sm-0 m-1 justify-content-between align-items-center pt-2'>
            <ReactSelect
              placeholderName={t("Ward")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              id="Ward"
              name="Ward"
              removeIsClearable={true}
              dynamicOptions={PateintWard}
              handleChange={handleSelect}
              value={values?.Ward}
            />

            <div className="text-right">
              <button className="btn btn-primary btn-sm px-4 ml-1" onClick={handleDeleteWard}>
                {t("Delete")}
              </button>
              <button className="btn btn-primary btn-sm px-4 ml-1" onClick={handleUpdateWard}>
                {t("Update")}
              </button>
            </div>
          </div>
          <Tables
            thead={THEAD}
            tbody={dietList?.map((item, index) => ({
              sno: index + 1,
              regNo: item?.PatientID || "N/A",
              ipdNo: item?.IPDNO,
              ward: item?.Ward || "N/A",
              diagnosis: item?.Diagnosis || "N/A",
              diet: item?.DietName,
              typeOfDiet: item?.TypeOfDiet || "N/A",
              isCurrent: item?.IsCurrent ? "Yes" : "No",
              entryDate: item?.EntryDate,
              Actions: (
                <div>
                  <Checkbox className='mt-1'
                    onChange={(e) => {
                      handleCheckboxChange(e, item);
                    }}
                    checked={item?.isChecked || false}
                  />
                </div>
              ),

            }))}
          />
        </>

      )}
    </div>
  )
}
