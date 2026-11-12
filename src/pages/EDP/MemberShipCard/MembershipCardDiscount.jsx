import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import {
  edpMemberShipGetBindData,
  GetBindConfig,
  GetBindDataCard,
} from "../../../networkServices/EDP/karanedp";
import { reactSelectOptionList } from "../../../utils/utils";
import { notify } from "../../../utils/ustil2";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import Modal from "../../../components/modalComponent/Modal";
import CardMaster from "./CardMaster";
import { EDPBindOPdPackage, EDPSaveData } from "../../../networkServices/EDP/govindedp";
import { Tooltip } from "primereact/tooltip";

const MembershipCardDiscount = (data) => {
  const [t] = useTranslation();

  const initialValues = {
    discount: "",
    freeOPDPackage: {
      label: "No",
      value: "No",
    },
  };

  const [values, setValues] = useState({ ...initialValues });
  console.log("Values", values);
  const [tableData, setTableData] = useState([]);
  const [membershipChecked, setMembershipChecked] = useState(false);
  const [isCheckedAmt, setIsCheckedAmt] = useState(false);
  const [opdChecked, setOPDChecked] = useState(false);
  console.log("tableData", tableData);

  const [dropDownState, setDropDownState] = useState({
    CardName: [],
    CategoryName: [],
  });

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const [modalData, setModalData] = useState({
    show: false,
    component: null,
    size: null,
    header: null,
  });

  const [opdTableData, setOPDTableData] = useState([]);
  console.log("opdTable", opdTableData);

  const handleReactSelect = (label, value) => {
    if (label === "CategoryName" && !values?.CardName?.value) {
      setValues((val) => ({ ...val, [label]: value }));
      notify("Please select the card name.", "error");
      return;
    }
    setValues((val) => ({ ...val, [label]: value }));
  };

  const cardData = async () => {
    const response = await edpMemberShipGetBindData();

    const responeData = {
      BindCard: reactSelectOptionList(response?.data, "NAME", "ID"),
    };

    setDropDownState(responeData);
  };

  const CategoryData = async () => {
    const response = await GetBindConfig();
    const responseData = {
      CategoryName: reactSelectOptionList(response?.data, "NAME", "id"),
    };
    setDropDownState((prev) => ({ ...prev, ...responseData }));
  };

  const MemberShipCardData = async () => {
    const payload = {
      cardID: values?.CardName?.value,
      configID: values?.CategoryName?.value,
    };

    const response = await GetBindDataCard(payload);

    if (response?.success) {
      const modifiedData = response.data.map((item) => ({
        ...item,
        particularItem: "OP",
        isChecked: false,
      }));

      setTableData(modifiedData);
    } else {
      notify(response?.message, "error");
    }
  };

  const isMobile = window.innerWidth <= 800;

  const handleChangeHead = (e) => {
    const { name, value } = e?.target;
    let updatedtbl = opdTableData?.map((val) => {
      val[name] = value;
      return val;
    });
    setOPDTableData(updatedtbl);
  };

  const handleCheckMembership = () => {
    setMembershipChecked(!membershipChecked);

    setTableData(
      tableData.map((item) => ({
        ...item,
        isChecked: !item.isChecked,
      }))
    );
  };

  const handleMembershipIsAmt = () => {
    setIsCheckedAmt(!isCheckedAmt);
    setTableData(
      tableData.map((item) => ({
        ...item,
        particularItem: isCheckedAmt ? "OP" : "OA",
      }))
    );
  };

  const handleOPDpkgList = () => {
    setOPDChecked(!opdChecked);
    setOPDTableData(
      opdTableData.map((item) => ({
        ...item,
        isChecked: !item.isChecked,
      }))
    );
  };

  const MembershipCardDiscounted = [
    {
      name: <input type="checkbox" onChange={() => handleCheckMembership()} />,
      width: "1%",
    },
    { name: "S.No.", width: "1%" },
    { name: "Name" },
    {
      name: (
        <>
          <input
            type="checkbox"
            className="mr-2"
            onChange={() => handleMembershipIsAmt()}
          />
          <span>{t("IsAmt")}</span>
        </>
      ),
    },
    { name: "OPD" },
    { name: "IPD(%)" },
    { name: "Exceptional", width: "1%" },
  ];

  const opdPkgListHead = [
    {
      name: <input type="checkbox" onChange={() => handleOPDpkgList()} />,
      width: "2%",
    },
    { name: "S.No.", width: "1%" },
    { name: "Name" },
    {
      width: "20%",
      name: isMobile ? (
        t("Days")
      ) : (
        <>
          <Tooltip
            target={`#validityDays`}
            position="top"
            content={t("Days")}
            event="focus"
            className="ToolTipCustom"
          />
          <input
            type="text"
            className="table-input"
            id="validityDays"
            placeholder={t("Days")}
            name="validityDays"
            onChange={handleChangeHead}
          />
        </>
      ),
    },
  ];

  const OPDPackageList = [
    { name: <input type="checkbox" /> },
    { name: "S.No.", width: "1%" },
    { name: "Name" },
    {
      name: (
        <>
          <span>{t("Days")}</span>
          <Input
            type="text"
            className={"form-control required-fields"}
            lable={t("OT Name")}
            placeholder=" "
            //   id="ItemName"
            name="OTName"
            onChange={(e) => handleInputChange(e, 0, "OTName")}
            value={values?.OTName}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        </>
      ),
    },
  ];

  const handleCheck = (e, index) => {
    const data = [...tableData];
    data[index].isChecked = e.target.checked;
    setTableData(data);
  };

  const itemData = async () => {
    const CardID = values?.CardName?.value;

    const response = await EDPBindOPdPackage(CardID);
    if (response?.success) {
      setOPDTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    itemData();
  }, [values?.CardName?.value]);

  const handleCustomSelect = (index, name, e) => {
    const data = [...tableData];
    data[index][name] = e.value;
    setTableData(data);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...tableData];
    data[index][name] = value;
    setTableData(data);
  };
  const handleOPDChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...opdTableData];
    data[index][name] = value;
    setOPDTableData(data);
  };

  const handleExceptionalModal = (ele) => {
    console.log("ele", ele);
    console.log("Valuesinside", values);
    setModalData({
      show: true,

      component: (
        <div>
          <CardMaster data={ele} incomingValues={values} />
        </div>
      ),
      size: "65vw",
      header: "Set Itemwise Discount",
    });
  };
  useEffect(() => {
    if (values?.CardName?.value && values?.CategoryName?.value) {
      MemberShipCardData();
    }
  }, [values?.CardName?.value, values?.CategoryName?.value]);

  const handleOPDtableChange = (e, index) => {
    const data = [...opdTableData];
    data[index].isChecked = e.target.checked;
    setOPDTableData(data);
  };

  const handleSave = async () => {
    const filterTableData = tableData.filter((item) => item.isChecked === true);
    const filterOPDTableData = opdTableData.filter(
      (item) => item.isChecked === true
    );

    let payload = [];

    filterTableData.forEach((tableItem) => {
      if (
        filterOPDTableData.length > 0 &&
        values?.freeOPDPackage?.value === "Yes"
      ) {
        filterOPDTableData.forEach((opdItem) => {
          const [itemId, packageId] = opdItem?.Id?.split("#") || [];

          payload.push({
            cardId: String(values?.CardName?.value),
            subCatId: String(tableItem?.SubCategoryID),
            subCatName: String(tableItem?.Name),
            opd: Number(tableItem?.OPD) ?? 0,
            isOPDPer: tableItem?.particularItem === "OP" ? 1 : 0,
            ipd: Number(tableItem?.IPD) ?? 0,
            isIPDPer: tableItem?.particularItem === "OP" ? 1 : 0,
            packageId: String(packageId) ?? "",
            itemId: String(itemId) ?? "",
            packageName: String(opdItem?.TypeName) ?? "",
            validityDays: String(opdItem?.validityDays) ?? "",
            isOPDPackage: String(1),
          });
        });
      } else {
        payload.push({
          cardId: String(values?.CardName?.value),
          subCatId: String(tableItem?.SubCategoryID),
          subCatName: String(tableItem?.Name),
          opd: Number(tableItem?.OPD) ?? 0,
          isOPDPer: tableItem?.particularItem === "OP" ? 1 : 0,
          ipd: Number(tableItem?.IPD) ?? 0,
          isIPDPer: tableItem?.particularItem === "OA" ? 1 : 0,
          packageId: "",
          itemId: "",
          packageName: "",
          validityDays: "",
          isOPDPackage: 0,
        });
      }
    });

    console.log("Final Payload", payload);

    const response = await EDPSaveData(payload);
    if (response?.success) {
      notify(response?.message, "success");
      setTableData([]);
      setOPDTableData([]);
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    cardData();
    CategoryData();
  }, []);

  return (
    <div className="card">
      <Heading title={data?.title} isBreadcrumb={true} isSlideScreen={false} />
      <div className="row p-2">
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Card Name")}
          name="CardName"
          value={values?.CardName?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.BindCard}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Category Name")}
          name="CategoryName"
          value={values?.CategoryName?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.CategoryName}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Free OPD Package")}
          name="freeOPDPackage"
          value={values?.freeOPDPackage?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
      </div>
      <div>
        {opdTableData?.length > 0 &&
          values?.freeOPDPackage?.value === "Yes" && (
            <div className="card">
              <Heading title={t("OPD Package List ")} isBreadcrumb={false} />
              <Tables
                thead={opdPkgListHead}
                tbody={opdTableData?.map((ele, i) => {
                  return {
                    Checkbox: (
                      <>
                        <input
                          type="checkbox"
                          onChange={(e) => handleOPDtableChange(e, i)}
                          checked={ele?.isChecked}
                        />
                      </>
                    ),
                    SNo: i + 1,
                    TypeName: ele.TypeName,
                    Days: (
                      <>
                        <Input
                          type="number"
                          className="table-input"
                          name={"validityDays"}
                          removeFormGroupClass={true}
                          value={ele?.validityDays}
                          onChange={(e) => handleOPDChange(e, i)}
                        />
                      </>
                    ),
                  };
                })}
                style={{
                  minHeight: "50vh",
                  maxHeight: "50vh",
                  overflowY: "scroll",
                }}
              />
              {/* <div className="col-xl-2 col-md-4 col-sm-4 col-12 p-2">
            <button className="btn btn-sm btn-success">{t("Save")}</button>
          </div> */}
            </div>
          )}
        {tableData?.length > 0 && (
          <>
            <Heading
              title={t("Membership Card Discounted Details")}
              isBreadcrumb={false}
            />
            <Tables
              thead={MembershipCardDiscounted}
              tbody={tableData?.map((ele, i) => {
                return {
                  Checkbox: (
                    <>
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheck(e, i)}
                        checked={ele?.isChecked}
                      />
                    </>
                  ),
                  SNo: i + 1,
                  OTName: ele.Name,
                  isAmt: (
                    <>
                      <CustomSelect
                        isRemoveSearchable={true}
                        option={[
                          { label: "In Percentage", value: "OP" },
                          { label: "In Amount", value: "OA" },
                        ]}
                        placeHolder={t("Select Particulars")}
                        value={
                          ele?.particularItem
                            ? ele?.particularItem
                            : { label: "In Percentage", value: "OP" }
                        }
                        name="particularItem"
                        onChange={(name, e) => handleCustomSelect(i, name, e)}
                      />
                    </>
                  ),
                  opd: (
                    <>
                      <Input
                        type="number"
                        className="table-input"
                        name={"OPD"}
                        removeFormGroupClass={true}
                        value={ele?.OPD}
                        onChange={(e) => handleChange(e, i)}
                      />
                    </>
                  ),
                  IPD: (
                    <>
                      <Input
                        type="number"
                        className="table-input"
                        name={"IPD"}
                        removeFormGroupClass={true}
                        value={ele?.IPD}
                        onChange={(e) => handleChange(e, i)}
                      />
                    </>
                  ),
                  Exceptional: (
                    <div
                      className="fa fa-check"
                      onClick={() => handleExceptionalModal(ele)}
                    ></div>
                  ),
                };
              })}
              style={{
                minHeight: "50vh",
                maxHeight: "50vh",
                overflowY: "scroll",
              }}
            />
          </>
        )}
        {(tableData?.length > 0 ||
          (opdTableData?.length > 0 &&
            values?.freeOPDPackage?.value === "Yes")) && (
          <div className="col-xl-2 col-md-4 col-sm-4 col-12 p-2">
            <button className="btn btn-sm btn-success" onClick={handleSave}>
              {t("Save")}
            </button>
          </div>
        )}
      </div>

      {
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
      }
    </div>
  );
};

export default MembershipCardDiscount;
