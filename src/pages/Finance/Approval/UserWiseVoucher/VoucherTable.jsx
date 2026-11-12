import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import Tables from "../../../../components/UI/customTable";
import { BindBranchCentre, FinanceCentreWise_Coa_Mapping, FinanceSaveMappingData } from "../../../../networkServices/finance";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";


const VoucherTable = () => {
  const [bindData, setBindData] = useState([]);
  const [t] = useTranslation();
  const localData = useLocalStorage("userData", "get");
  const [values, setValues] = useState({
    center: {value:localData?.defaultCentre},
  });
  const [dropDownState, setDropDownState] = useState({
    GetBindAllCenter: [],
  });
  const [selectedItems, setSelectedItems] = useState([]); // to store selected items
  const [allSelected, setAllSelected] = useState(false);
 
  const handleSaveMapping = async () => {
    if (selectedItems.length === 1) {
        notify("Please select at least one row.", "warn");
        return;
    }

    const payload = bindData.map(item => ({
      coaid:String(item?.COAID || ""),
      centreId: String(values.center?.CentreID || values.center?.value || ""),
      isActive: selectedItems.some(selectedItem => selectedItem.COAID === item.COAID) ? "1" : "0"
  }));

    try {
      const apiResp = await FinanceSaveMappingData(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        getMappingData(); 
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
      console.error(error);
    }
  };

  const getMappingData = async () => {
    try {
      const response = await FinanceCentreWise_Coa_Mapping(values?.center?.value);
      if (response?.success) {
        const initialBindData = response?.data.map(item => ({ ...item, isChecked: item.IsActive === 1 }));
        setBindData(initialBindData);
        const initiallySelected = initialBindData.filter(item => item.IsActive === 1);
        setSelectedItems(initiallySelected);
        setAllSelected(initialBindData.every(item => item.isChecked));
      } else {
        console.log(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching mapping data:", error);
      notify("Error fetching mapping data", "error");
    }
  };

  const GetBindAllCenter = async () => {
    try {
      const response = await BindBranchCentre();
      setDropDownState((val) => ({
        ...val,
        GetBindAllCenter: handleReactSelectDropDownOptions(
          response?.data,
          "CentreName",
          "CentreID"
        ),
      }));
    } catch (error) {
      console.error(error, "SomeThing Went Wrong");
      notify("Error fetching center data", "error");
    }
  };

  useEffect(() => {
    getMappingData();
    GetBindAllCenter();
  }, []);


  const handleChangeCheckbox = (e, ele) => {
    const { checked } = e.target;

    // Update isChecked in bindData
    const updatedBindData = bindData.map(item =>
      item.COAID === ele.COAID ? { ...item, isChecked: checked } : item
    );
    setBindData(updatedBindData);

    // Update selectedItems
    if (checked) {
      setSelectedItems([...selectedItems, ele]);
    } else {
      setSelectedItems(selectedItems.filter(item => item.COAID !== ele.COAID));
    }

    // Update allSelected state
    setAllSelected(updatedBindData.every(item => item.isChecked));
  };

  const handleChangeCheckboxHeader = (e) => {
    const { checked } = e.target;
    setAllSelected(checked);

    // Update isChecked in bindData
    const updatedBindData = bindData.map(item => ({ ...item, isChecked: checked }));
    setBindData(updatedBindData);

    // Update selectedItems
    if (checked) {
      setSelectedItems([...bindData]);
    } else {
      setSelectedItems([]);
    }
  };


  const isMobile = window.innerWidth <= 800;

  const thead = [
    { name: t("S.No."), width: "1%" },
    { name: t("A/C Type"), width: "10%" },
    { name: t("COG Code"), width: "10%" },
    { name: t("COG Name"), width: "10%" },
    { name: t("COA Name"), width: "10%" },
    { name: t("Entry By"), width: "10%" },
    { name: t("Entry Date"), width: "10%" },
    {
      width: "1%",
      name: isMobile ? (
        t("check")
      ) : (
        <input
          type="checkbox"
          name="checkbox"
          style={{ marginLeft: "3px" }}
          checked={allSelected}
          onChange={(e) => {
            handleChangeCheckboxHeader(e);
          }}
        />
      ),
    },

  ];

  const handleReactChange = (name, e) => {
    setValues((val) => ({ ...val, [name]: e }));
  };

  return (
    <div className="card border">
      <Heading title={t("Centre Wise COA Mapping")} isBreadcrumb={false} />

      <div className="row p-2">
        <ReactSelect
          isDisabled={true}
          placeholderName={t("Centre Name")}
          // requiredClassName={"required-fields"}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          id={"center"}
          name={"center"}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactChange(name, e)}
          dynamicOptions={dropDownState?.GetBindAllCenter}
          value={values?.center?.value || values?.center?.CentreID}
        />
      </div>
      <Heading title={t("COA Mapping")} isBreadcrumb={false} />
      <Tables
        style={{ maxHeight: "45vh" }}
        thead={thead}
        tbody={bindData.map((val, ind) => ({
          id: ind + 1,
          ACtype: val?.AccountType,
          COGcode: val?.COGCode,
          COGname: val?.COGName,
          COAname: val?.COAName,
          EntryBy: val?.EntryBy,
          EntryDate: val?.EntryDate,
          Actions: (
            <div>
              {val?.STATUS !== "Completed" ? (
                <input
                  type="checkbox"
                  onChange={(e) => {
                    handleChangeCheckbox(e, val);
                  }}
                  checked={val?.isChecked}
                />
              ) : (
                ""
              )}
            </div>
          ),
        }))}
        isSearch={true}
      />

      <div className={"col-12 mt-2 mb-2"}>
        <div className="text-right">
          <button className="btn btn-primary btn-sm px-4 ml-1" onClick={handleSaveMapping}>
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherTable;

