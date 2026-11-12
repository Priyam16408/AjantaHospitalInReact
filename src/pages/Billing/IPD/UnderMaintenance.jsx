import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { notify } from '../../../utils/ustil2';
import Tables from '../../../components/UI/customTable';
import { useWindowSize } from '../../../utils/hooks/useWindowSize';
import { Checkbox } from 'primereact/checkbox';
import { searchUnderMaintenanceApi, RoomType, markUnderMaintainanceSave } from '../../../networkServices/BillingsApi';

function UnderMaintenance() {
  const [bindData, setBindData] = useState([]);
  const [t] = useTranslation();
  const [values, setValues] = useState({
    IPDCaseTypeID: ""
  });
  const [dropDownState, setDropDownState] = useState({
    GetBindAllMentenance: [
    ],
  });


  const [selectedItems, setSelectedItems] = useState([]); // to store selected items
  const [allSelected, setAllSelected] = useState(false);

  const GetBindAllMentenance = async () => {
    try {
      const response = await RoomType();
      setDropDownState((val) => ({
        ...val,
        GetBindAllMentenance: handleReactSelectDropDownOptions(
          response?.data,
          "Name",
          "IPDCaseTypeID",
        ),
      }));
    } catch (error) {
      console.error(error, "SomeThing Went Wrong");
      notify("Error fetching center data", "error");
    }
  };

  useEffect(() => {
    GetBindAllMentenance();
  }, [])

  const handleReactChange = (name, e) => {
    setValues((val) => ({ ...val, [name]: e }));

  };


  const handleSearchMaintain = async () => {
    if (!values?.roomType?.value) {
      notify("Please Select Room Type", "warn");
      return;
    }
    try {
      const res = await searchUnderMaintenanceApi(values?.roomType?.value)
      if (res?.success) {
        setBindData(res?.data)
      } else {
        notify(res?.message, "error");
        setBindData([]);
      }
    } catch (error) {
      notify(error?.message || "something going wrong");
    }

  }

  const { width } = useWindowSize();
  const isMobile = width <= 800;


  const handleChangeCheckbox = (e, item = null) => {
    const { checked } = e.target;
    if (!item) {
      const updatedList = bindData.map(i => {
        if (i.IsMaintenance == 0) {
          return { ...i, isChecked: checked };
        }
        return i; 
      });
      // const updatedList = bindData?.map(i => ({ ...i, isChecked: checked }));
      setBindData(updatedList);
      setAllSelected(checked)
    } else {
      const updatedList = bindData?.map(i => i.RoomID === item.RoomID ? { ...i, isChecked: checked } : i);
      setBindData(updatedList);
      setAllSelected(updatedList?.every(i => i?.isChecked ? true : false));
    }

  };


  const thead = [
    { name: t("S.No."), width: "1%" },
    { name: t("Room ID"), width: "10%" },
    { name: t("name"), width: "10%" },
    { name: t("bed No"), width: "10%" },
    { name: t("Cleaning/Maintenance"), width: "10%" },
    { name: t("IPD.NO"), width: "10%" },
    {
      width: "1%",
      name: isMobile ? (
        t("check")
      ) : (
        <Checkbox
          checked={allSelected}
          onChange={(e) => {
            handleChangeCheckbox(e);
          }}
        />
      ),
    },

  ];


  const handleSaveMapping = async () => {

    if (bindData?.filter((val) => val?.isChecked)?.length === 0) {
      notify("Please select at least one row.", "warn");
      return;
    }
    try {
      const data = bindData.filter((val) => val.isChecked);
      const payload = data?.map((val) => ({
        roomID: Number(val?.RoomID ?? 0),
        maintenanceName: val?.MaintenanceStatus || "",
        ipdCaseTypeID: Number(val?.IPDCaseTypeID ?? 0)
      }));

      const response = await markUnderMaintainanceSave(payload)
      if (response?.success) {
        notify(response?.message, "success")
        handleSearchMaintain()
      } else {
        notify(response?.message, "error")
      }

    } catch (error) {
      notify(error?.message, "error")
    }

  }



  return (
    <div className="card border">
      <Heading title={t("Mark Under Maintenance")} isBreadcrumb={true} />
      <div>
        <div className='d-sm-flex m-sm-2 m-1 justify-content-between align-items-center pt-2'>
          <div className='row d-flex w-100'>
            <ReactSelect
              // isDisabled={true}
              placeholderName={t("Room Type")}
              requiredClassName={"required-fields"}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id={"roomType"}
              name={"roomType"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={dropDownState?.GetBindAllMentenance}
              value={values?.roomType}
            />
            <button
              onClick={handleSearchMaintain}
              className="btn btn-sm btn-success ms-auto ml-2"
            >
              {t("Search")}
            </button>
          </div>
          {bindData.length > 0 &&
            <div className="text-right">
              <button className="btn btn-primary btn-sm px-4 ml-1" onClick={handleSaveMapping}>
                {t("Save")}
              </button>
            </div>
          }
        </div>
      </div>
      {bindData.length > 0 &&
        <>
          <Heading title={t("Under Maintenance Mark List")} isBreadcrumb={false} />
          <Tables
            style={{ maxHeight: "45vh" }}
            thead={thead}
            tbody={bindData.map((val, ind) => ({
              id: ind + 1,
              RoomID: val?.RoomID,
              RoomName: val?.RoomName,
              RoomBedNo: val?.RoomBedNo,
              IsMaintenance: val?.MaintenanceStatus,

              IPDNO: val?.IPDNO,
              Actions: (
                <div>
                  <Checkbox
                    className='mt-1'
                    onChange={(e) => {
                      handleChangeCheckbox(e, val);
                    }}
                    disabled={val?.IsMaintenance !== 0}
                    checked={val?.isChecked || false}
                  />

                </div>
              ),
            }))}
          // isSearch={true}
          />


        </>
      }
    </div>
  )
}

export default UnderMaintenance;