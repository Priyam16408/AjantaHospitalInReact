import React, { useState } from "react";
import Tables from "../../UI/customTable";
import SlotModal from "./SlotModal";
import Modal from "../Modal";
import { Tooltip } from "primereact/tooltip";
import CustomSelect from "../../formComponent/CustomSelect";
import { useSelector } from "react-redux";
import { filterByTypes } from "../../../utils/utils";
import InvestigationModal from "./InvestigationModal";

const PackageDetails = ({ data, handlePackageData }) => {
  const THEAD = [
    "Slot",
    "Type",
    "Department",
    "Sub Department",
    "Item Name",
    "Doctor",
    "Qty",
  ];

  const { BindResource, GetAllDoctorList } = useSelector(
    (state) => state?.CommonSlice
  );

  const [modalData, setModalData] = useState({
    show: false,
    component: null,
    size: null,
    header: null,
  });

  const handleSplit = (data, replace, byreplace) => {
    return data ? data.replace(replace, byreplace) : data;
  };

  const handleSetData = (modifiedData, index) => {
    const datavalue = [...data?.PackageTable];
    datavalue[index] = modifiedData;
    setModalData({
      show: false,
      component: null,
      header: null,
      size: null,
    });
    handlePackageData({ ...data, PackageTable: datavalue });
  };

  const handleCustomSelect = (index, name, e) => {
    const datavalue = [...data?.PackageTable];
    if (name === "Investigation_Id") {
      datavalue[index][name] = e?.value;
      datavalue[index]["DoctorID"] = e?.value;
      datavalue[index]["DoctorName"] = e?.label;
    } else {
      datavalue[index][name] = e?.value;
      datavalue[index]["DoctorName"] = e?.label;
    }
    handlePackageData({ ...data, PackageTable: datavalue });
  };

  const handleSlotModal = (index) => {
    setModalData({
      show: true,
      component: (
        <div>
          <SlotModal
            data={{
              ...data?.PackageTable[index],
              Item:data?.PackageTable[index]?.DoctorName,
              Type_ID: data?.PackageTable[index]?.Investigation_Id,
              AppointedDate: data?.AppointedDate,
            }}
            handleSetData={(e) => handleSetData(e, index)}
          />
        </div>
      ),
      size: "90vw",
      header: "Doctor Slot",
    });
  };

  const handleInvestigationSlot = (index) => {
    setModalData({
      show: true,
      component: (
        <div>
          <InvestigationModal
            data={{
              ...data?.PackageTable[index],
              Type_ID: data?.PackageTable[index]?.Investigation_Id,
              AppointedDate: data?.AppointedDate,
              ItemDisplayName:data?.PackageTable[index]?.Item
            }}
            handleSetData={(e) => handleSetData(e, index)}
          />
        </div>
      ),
      size: "90vw",
      header: "Investigation Slot",
    });
  };

  const InvestigationSlot = ({ index, row }) => {
    // categoryID===7
    return (
      <>
        <Tooltip
          target={`#InvestigationSlot${index}`}
          position="mouse"
          content={handleSplit(row?.AppointedDateTime, "#", " ")}
          event="hover"
          className="ToolTipCustom"
        />
        <i
          className="fa fa-calendar"
          aria-hidden="true"
          id={`InvestigationSlot${index}`}
          onClick={() => handleInvestigationSlot(index)}
        ></i>
      </>
    );
  };

  const settleValue = (row, index) => {
    const tableData = {
      Slot: null,
      PackageTypeName: null,
      Department: null,
      SubDepartment: null,
      ItemName: null,
      Doctor: null,
      Qty: null,
    };

    // Slot
    if (row?.PackageType === 2) {
      tableData.Slot = (
        <>
          <Tooltip
            target={`#appointMent-Package${index}`}
            position="mouse"
            content={handleSplit(row?.AppointedDateTime, "#", " ")}
            event="hover"
            className="ToolTipCustom"
          />
          <i
            className="fa fa-calendar"
            aria-hidden="true"
            id={`appointMent-Package${index}`}
            onClick={() => handleSlotModal(index)}
          ></i>
        </>
      );
    }

    if(row?.PackageType===1){
       if (
        row?.CategoryID === 7 &&
        data?.isMobileBooking === 0
      ) {
        tableData.Slot = <InvestigationSlot index={index} row={row} />; // popup function 1
      }
    }

    // PackageTypeName
    tableData.PackageTypeName = <div>{row?.PackageTypeNameCap}</div>;

    // department

    tableData.Department = <div>{row?.Department}</div>;

    // sub Department

    tableData.SubDepartment = <div>{row?.VisitType}</div>;

    // ItemName
    if (row?.PackageType === 2) {
      
      if (["0", 0, ""].includes(row?.InvestigationIdActual)) {
        tableData.ItemName = (
          <CustomSelect
            option={filterByTypes(
              GetAllDoctorList,
              [row?.DocDepartmentID],
              ["DocDepartmentID"],
              "label",
              "value"
            )}
            value={row?.DoctorID}
            placeHolder="Select Doctor"
            name="Investigation_Id"
            onChange={(name, e) => handleCustomSelect(index, name, e)}
          />
        );
      } else {
        tableData.ItemName = <div>{row?.Item}</div>;
      }
    } else {
      tableData.ItemName = <div>{row?.Item}</div>;
    }

    // Doctor
    if (row?.PackageType !== 2) {
      tableData.Doctor = (
        <CustomSelect
          option={GetAllDoctorList}
          value={row?.DoctorID}
          placeHolder="Select Doctor"
          name="DoctorID"
          onChange={(name, e) => handleCustomSelect(index, name, e)}
        />
      );
    }

    // Qty

    tableData.Qty = <div>{row?.Quantity}</div>;

    return tableData;
  };

  console.log("sahil", data);
  console.log("doctor", GetAllDoctorList);

  return (
    <>
      <Tables
        thead={THEAD}
        tbody={ data?.PackageTable?.length>0 ? data?.PackageTable?.map((row, index) => {
          const {
            Slot,
            PackageTypeName,
            Department,
            SubDepartment,
            ItemName,
            Doctor,
            Qty,
          } = settleValue(row, index);
          return {
            Slot: Department !== "RADIOLOGY" ? null : Slot,
            PackageTypeName: PackageTypeName,
            Department: Department,
            SubDepartment: SubDepartment,
            ItemName: ItemName,
            Doctor: Doctor,
            Qty: Qty,
          };
        }) : []}
      />

      {modalData?.show && (
        <Modal
          visible={modalData?.show}
          setVisible={() =>
            setModalData({
              show: false,
              component: null,
              size: null,
            })
          }
          modalWidth={modalData?.size}
          Header={modalData?.header}
          footer={<></>}
        >
          {modalData?.component}
        </Modal>
      )}
    </>
  );
};

export default PackageDetails;
