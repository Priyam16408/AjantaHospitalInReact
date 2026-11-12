import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { notify } from '../../../utils/ustil2';
import Tables from '../../../components/UI/customTable';
import { useWindowSize } from '../../../utils/hooks/useWindowSize';
import { Checkbox } from 'primereact/checkbox';
import { bindMaintenanceApi, searchRoomMaintenance, saveRoomCleaningMaintenanceApi } from '../../../networkServices/BillingsApi';

function RoomMaintenanceMark() {
  const [bindData, setBindData] = useState([]);
  const [t] = useTranslation();
  const [values, setValues] = useState({
    TypeName: ""
  });
  const [dropDownState, setDropDownState] = useState({
    GetBindAllMentenance: [
    ],
  });
  const [allSelected, setAllSelected] = useState(false);
  console.log(values);

  const GetBindAllMentenance = async () => {
    try {
      const response = await bindMaintenanceApi();
      setDropDownState((val) => ({
        ...val,
        GetBindAllMentenance: handleReactSelectDropDownOptions(
          response?.data,
          "TypeName",
          "TypeID",
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
    if (!values?.TypeName?.value) {
      notify("Please Select Maintenance type", "warn");
      return;
    }
    try {

      const res = await searchRoomMaintenance(values?.TypeName?.value)
      if (res?.success) {
        setBindData(res?.data)
      } else {
        notify(res?.message, "error")
        setBindData([])
      }
    } catch (error) {
      notify(error?.message, "error")

    }
  }

  const { width } = useWindowSize();
  const isMobile = width <= 800;


  const handleChangeCheckbox = (e, item = null) => {
    const { checked } = e.target;

    if (!item) {

      const updatedList = bindData.map(i => {
        // if (i.MaintenanceStatus === "") {
          return { ...i, isChecked: checked }; // select only allowed items
        // }
        return i; // skip disabled
      });

      // const updatedList = bindData?.map(i => ({ ...i, isChecked: checked }));
      setBindData(updatedList);
      setAllSelected(checked)
    } else {
      const updatedList = bindData?.map(i => i?.RoomID === item?.RoomID ? { ...i, isChecked: checked } : i);
      setBindData(updatedList);
      setAllSelected(updatedList?.every(i => i?.isChecked ? true : false));
    }

  };


  const thead = [
    { name: t("S.No."), width: "1%" },
    { name: t("Room ID"), width: "10%" },
    { name: t("Room Name"), width: "10%" },
    { name: t("Room/Bed No"), width: "10%" },
    { name: t("Cleaning/Maintenance"), width: "10%" },
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
        maintenanceID: Number(values?.TypeName?.value ?? 0),
        maintenanceName: values?.TypeName?.label || ""
      }));
      const response = await saveRoomCleaningMaintenanceApi(payload)
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
      <Heading title={t("Room Maintenance Mark")} isBreadcrumb={true} />
      <div>
        <div className='d-sm-flex m-sm-2 m-1 justify-content-between align-items-center pt-2'>
          <div className='row d-flex w-100'>
            <ReactSelect
              placeholderName={t("Maintenance Type Name")}
              requiredClassName={"required-fields"}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id={"TypeName"}
              name={"TypeName"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={dropDownState?.GetBindAllMentenance}
              value={values?.TypeName}
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
          <Heading title={t("Room Maintenance Mark List")} isBreadcrumb={false} />
          <Tables
            style={{ maxHeight: "45vh" }}
            thead={thead}
            tbody={bindData.map((val, ind) => ({
              id: ind + 1,
              roomId: val?.RoomID,
              name: val?.RoomName,
              bedNo: val?.RoomBedNo,
              clearMaintenance: val?.MaintenanceStatus,
              Actions: (
                <div>
                  <Checkbox
                    className='mt-1'
                    onChange={(e) => {
                      handleChangeCheckbox(e, val);
                    }}
                    // disabled={val?.MaintenanceStatus !== ""}
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

export default RoomMaintenanceMark;