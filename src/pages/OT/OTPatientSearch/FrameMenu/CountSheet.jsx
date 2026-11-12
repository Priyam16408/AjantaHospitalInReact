import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../../components/UI/Heading";
import {
  OTCountSheetSave,
  OTCountSheetSearch,
  OTGetExitingOTsAPI,
} from "../../../../networkServices/OT/otAPI";
import Tables from "../../../../components/UI/customTable";
import Input from "../../../../components/formComponent/Input";
import { notify } from "../../../../utils/ustil2";

export default function CountSheet({ data, setVisible }) {
  const [t] = useTranslation();
  const isMobile = window.innerWidth <= 769;
  const [bodyData, setBodyData] = useState([]);
  console.log("bodyData", bodyData);
  const handleAllCheck = (e) => {
    const data = JSON.parse(JSON.stringify(bodyData));
    data.map((val) => {
      val.isChecked = e.target.checked;
    });
    setBodyData(data);
  };
  const thead1 = [
    {
      name: isMobile ? (
        t("Check")
      ) : (
        <input className="" onChange={handleAllCheck} type="checkbox" />
      ),
      width: "1%",
    },
    { name: t("Surgeon") },
    { name: t("initial"), width: "5%" },
    { name: t("Additional"), width: "15%" },
    { name: t("Total"), width: "5%" },
    { name: t("CountFirst"), width: "5%" },
    { name: t("Additional"), width: "15%" },
    { name: t("Total"), width: "5%" },
    { name: t("Second"), width: "5%" },
    { name: t("Final"), width: "5%" },
  ];

  const handleCustomInput = (index, name, value, type, max = 9999999999999) => {
    if (type === "number") {
      // && Number(value) <= max
      if (!isNaN(value)) {
        const data = JSON.parse(JSON.stringify(bodyData));
        data[index][name] = value;
        const {
          initial,
          addInitial1,
          addInitial2,
          addInitial3,
          addInitial4,
          addInitial5,
          CountFirst,
          FistAdd1,
          FistAdd2,
          FistAdd3,
          FistAdd4,
          CountSecond,
          Total2,
        } = data[index];
        if (
          name === "initial" ||
          name === "addInitial1" ||
          name === "addInitial2" ||
          name === "addInitial3" ||
          name === "addInitial4" ||
          name === "addInitial5"
        ) {
          data[index]["Total1"] =
            Number(initial ? initial : 0) +
            Number(addInitial1 ? addInitial1 : 0) +
            Number(addInitial2 ? addInitial2 : 0) +
            Number(addInitial3 ? addInitial3 : 0) +
            Number(addInitial4 ? addInitial4 : 0) +
            Number(addInitial5 ? addInitial5 : 0);
        } else if (
          name === "CountFirst" ||
          name === "FistAdd1" ||
          name === "FistAdd2" ||
          name === "FistAdd3" ||
          name === "FistAdd4"
        ) {
          data[index]["Total2"] =
            Number(CountFirst ? CountFirst : 0) +
            Number(FistAdd1 ? FistAdd1 : 0) +
            Number(FistAdd2 ? FistAdd2 : 0) +
            Number(FistAdd3 ? FistAdd3 : 0) +
            Number(FistAdd4 ? FistAdd4 : 0);
          data[index]["Final"] =
            Number(CountSecond ? CountSecond : 0) +
            Number(data[index]["Total2"] ? data[index]["Total2"] : 0);
        } else {
          data[index]["Final"] =
            Number(CountSecond ? CountSecond : 0) + Number(Total2 ? Total2 : 0);
        }
        setBodyData(data);
      }
    }
  };

  const bindCountSheetData = async () => {
    const response = await OTCountSheetSearch(data?.TransactionID);
    if (response?.success) {
      setBodyData(
        response?.data?.map((ele) => ({
          ...ele,
          isChecked: ele?.SurgeonID ? true : false,
        }))
      );
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSave = async () => {
    const newDataPayload = bodyData?.filter((ele) => ele?.isChecked);

    const payload = {
      tid: data?.TransactionID,
      pid: data?.PatientID,
      countsheetDetail: newDataPayload?.map((ele) => ({
        chk: ele?.isChecked ? ele?.isChecked : true,
        lblSurgeon: ele?.Surgeon ? ele?.Surgeon : "",
        txtSurgeon: ele?.Surgeon ? ele?.Surgeon : "",
        surgeonID: ele?.MasterSurgeonID ? ele?.MasterSurgeonID : "",
        surgeonName: ele?.surgeonmaster ? ele?.surgeonmaster : "",
        initial: ele?.initial ? ele?.initial : 0,
        addInitial1: ele?.addInitial1 ? ele?.addInitial1 : 0,
        addInitial2: ele?.addInitial2 ? ele?.addInitial2 : 0,
        addInitial3: ele?.addInitial3 ? ele?.addInitial3 : 0,
        addInitial4: ele?.addInitial4 ? ele?.addInitial4 : 0,
        addInitial5: ele?.addInitial5 ? ele?.addInitial5 : 0,
        total1: ele?.Total1 ? ele?.Total1 : 0,
        countFirst: ele?.CountFirst ? ele?.CountFirst : 0,
        fistAdd1: ele?.FistAdd1 ? ele?.FistAdd1 : 0,
        fistAdd2: ele?.FistAdd2 ? ele?.FistAdd2 : 0,
        fistAdd3: ele?.FistAdd3 ? ele?.FistAdd3 : 0,
        fistAdd4: ele?.FistAdd4 ? ele?.FistAdd4 : 0,
        total2: ele?.Total2 ? ele?.Total2 : 0,
        countSecond: ele?.CountSecond ? ele?.CountSecond : 0,
        final: ele?.Final ? ele?.Final : 0,
      })),
    };

    console.log("Payload", payload);

    const response = await OTCountSheetSave(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setVisible(false);
      bindCountSheetData();
    } else {
      notify(response?.message, "error");
    }
  };
  useEffect(() => {
    bindCountSheetData();
  }, []);

  return (
    <>
      <div className="spatient_registration_card">
        <div className="patient_registration ">
          <Heading
            title={data?.breadcrumb}
            data={data}
            isSlideScreen={true}
            isBreadcrumb={true}
          />
          {bodyData?.length > 0 && (
            <>
              <Tables
                style={{ maxHeight: "54vh" }}
                thead={thead1}
                tbody={bodyData?.map((ele, index) => ({
                  checkbox: (
                    <input
                      type="checkbox"
                      checked={ele?.isChecked}
                      onChange={(e) => {
                        handleCustomInput(
                          index,
                          "isChecked",
                          e.target.checked,
                          "number",
                          100
                        );
                      }}
                    />
                  ),
                  Surgeon: ele?.Surgeon,
                  initial: (
                    <Input
                      type="number"
                      disabled={!ele?.isChecked}
                      className="table-input"
                      respclass={"w-100"}
                      removeFormGroupClass={true}
                      name={"initial"}
                      value={ele?.initial ? ele?.initial : ""}
                      onChange={(e) => {
                        handleCustomInput(
                          index,
                          "initial",
                          e.target.value,
                          "number",
                          100
                        );
                      }}
                    />
                  ),
                  Additional: (
                    <div className="d-flex">
                      <Input
                        type="number"
                        disabled={!ele?.isChecked}
                        className="table-input"
                        respclass={"w-100"}
                        removeFormGroupClass={true}
                        name={"addInitial1"}
                        value={ele?.addInitial1 ? ele?.addInitial1 : ""}
                        onChange={(e) => {
                          handleCustomInput(
                            index,
                            "addInitial1",
                            e.target.value,
                            "number",
                            100
                          );
                        }}
                      />
                      <Input
                        type="number"
                        disabled={!ele?.isChecked}
                        className="table-input"
                        respclass={"w-100"}
                        removeFormGroupClass={true}
                        name={"addInitial2"}
                        value={ele?.addInitial2 ? ele?.addInitial2 : ""}
                        onChange={(e) => {
                          handleCustomInput(
                            index,
                            "addInitial2",
                            e.target.value,
                            "number",
                            100
                          );
                        }}
                      />
                      <Input
                        type="number"
                        disabled={!ele?.isChecked}
                        className="table-input"
                        respclass={"w-100"}
                        removeFormGroupClass={true}
                        name={"addInitial3"}
                        value={ele?.addInitial3 ? ele?.addInitial3 : ""}
                        onChange={(e) => {
                          handleCustomInput(
                            index,
                            "addInitial3",
                            e.target.value,
                            "number",
                            100
                          );
                        }}
                      />
                      <Input
                        type="number"
                        disabled={!ele?.isChecked}
                        className="table-input"
                        respclass={"w-100"}
                        removeFormGroupClass={true}
                        name={"addInitial4"}
                        value={ele?.addInitial4 ? ele?.addInitial4 : ""}
                        onChange={(e) => {
                          handleCustomInput(
                            index,
                            "addInitial4",
                            e.target.value,
                            "number",
                            100
                          );
                        }}
                      />
                      <Input
                        type="number"
                        disabled={!ele?.isChecked}
                        className="table-input"
                        respclass={"w-100"}
                        removeFormGroupClass={true}
                        name={"addInitial5"}
                        value={ele?.addInitial5 ? ele?.addInitial5 : ""}
                        onChange={(e) => {
                          handleCustomInput(
                            index,
                            "addInitial5",
                            e.target.value,
                            "number",
                            100
                          );
                        }}
                      />
                    </div>
                  ),
                  Total: (
                    <Input
                      type="number"
                      disabled={!ele?.isChecked}
                      readOnly
                      className="table-input"
                      respclass={"w-100"}
                      removeFormGroupClass={true}
                      name={"Total1"}
                      value={ele?.Total1 ? ele?.Total1 : ""}
                      onChange={(e) => {
                        handleCustomInput(
                          index,
                          "Total1",
                          e.target.value,
                          "number",
                          100
                        );
                      }}
                    />
                  ),
                  CountFirst: (
                    <Input
                      type="number"
                      disabled={!ele?.isChecked}
                      className="table-input"
                      respclass={"w-100"}
                      removeFormGroupClass={true}
                      name={"CountFirst"}
                      value={ele?.CountFirst ? ele?.CountFirst : ""}
                      onChange={(e) => {
                        handleCustomInput(
                          index,
                          "CountFirst",
                          e.target.value,
                          "number",
                          100
                        );
                      }}
                    />
                  ),
                  AdditionalSecond: (
                    <div className="d-flex">
                      <Input
                        type="number"
                        disabled={!ele?.isChecked}
                        className="table-input"
                        respclass={"w-100"}
                        removeFormGroupClass={true}
                        name={"FistAdd1"}
                        value={ele?.FistAdd1 ? ele?.FistAdd1 : ""}
                        onChange={(e) => {
                          handleCustomInput(
                            index,
                            "FistAdd1",
                            e.target.value,
                            "number",
                            100
                          );
                        }}
                      />
                      <Input
                        type="number"
                        disabled={!ele?.isChecked}
                        className="table-input"
                        respclass={"w-100"}
                        removeFormGroupClass={true}
                        name={"FistAdd2"}
                        value={ele?.FistAdd2 ? ele?.FistAdd2 : ""}
                        onChange={(e) => {
                          handleCustomInput(
                            index,
                            "FistAdd2",
                            e.target.value,
                            "number",
                            100
                          );
                        }}
                      />
                      <Input
                        type="number"
                        disabled={!ele?.isChecked}
                        className="table-input"
                        respclass={"w-100"}
                        removeFormGroupClass={true}
                        name={"FistAdd3"}
                        value={ele?.FistAdd3 ? ele?.FistAdd3 : ""}
                        onChange={(e) => {
                          handleCustomInput(
                            index,
                            "FistAdd3",
                            e.target.value,
                            "number",
                            100
                          );
                        }}
                      />
                      <Input
                        type="number"
                        disabled={!ele?.isChecked}
                        className="table-input"
                        respclass={"w-100"}
                        removeFormGroupClass={true}
                        name={"FistAdd4"}
                        value={ele?.FistAdd4 ? ele?.FistAdd4 : ""}
                        onChange={(e) => {
                          handleCustomInput(
                            index,
                            "FistAdd4",
                            e.target.value,
                            "number",
                            100
                          );
                        }}
                      />
                    </div>
                  ),
                  Total2: (
                    <Input
                      type="number"
                      disabled={!ele?.isChecked}
                      className="table-input"
                      respclass={"w-100"}
                      removeFormGroupClass={true}
                      readOnly
                      name={"Total2"}
                      value={ele?.Total2 ? ele?.Total2 : ""}
                      onChange={(e) => {
                        handleCustomInput(
                          index,
                          "Total2",
                          e.target.value,
                          "number",
                          100
                        );
                      }}
                    />
                  ),
                  Second: (
                    <Input
                      type="number"
                      disabled={!ele?.isChecked}
                      className="table-input"
                      respclass={"w-100"}
                      removeFormGroupClass={true}
                      name={"CountSecond"}
                      value={ele?.CountSecond ? ele?.CountSecond : ""}
                      onChange={(e) => {
                        handleCustomInput(
                          index,
                          "CountSecond",
                          e.target.value,
                          "number",
                          100
                        );
                      }}
                    />
                  ),
                  Final: (
                    <Input
                      type="number"
                      disabled={!ele?.isChecked}
                      className="table-input"
                      respclass={"w-100"}
                      removeFormGroupClass={true}
                      name={"Final"}
                      value={ele?.Final ? ele?.Final : ""}
                      onChange={(e) => {
                        handleCustomInput(
                          index,
                          "Final",
                          e.target.value,
                          "number",
                          100
                        );
                      }}
                    />
                  ),
                }))}
              />

              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-success px-3 mt-1"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  {t("Save")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
