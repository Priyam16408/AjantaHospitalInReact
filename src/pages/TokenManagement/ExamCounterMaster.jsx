import React, { useEffect, useState } from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Tables from "@app/components/UI/customTable";
import ExamCounterMasterTable from "../../components/UI/customTable/TokenManagement/ExamCounterMaster/index";
import Input from "../../components/formComponent/Input";
import {
  deleteCounter,
  getCheckCenterExists,
  getCounterList,
  saveCounter,
  updateCounter,
} from "../../networkServices/TokenManagement";
import { notify } from "../../utils/utils";
import Confirm from "../../components/modalComponent/Confirm";
const ExamCounterMaster = () => {
  const [t] = useTranslation();
  const [apiData, setApiData] = useState({
    getCounterAPIData: [],
  });
  const [Counterstate, setCounterState] = useState({
    btnName: t("save"),
    saveCounterstate: "",
    editingCounterId: null,
  });

  const [confirmBoxvisible, setConfirmBoxvisible] = useState({
    show: false,
    alertMessage: "",
    lableMessage: "",
    chidren: "",
  });
  const handleClickCounterName = async () => {
    const customerrors = ErrorHandling();
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
        return;
      }
    }
    try {
      const dataCheck = await getCheckCenterExists(
        Counterstate?.saveCounterstate
      );
      if (dataCheck.data && dataCheck.success === true) {
        notify("Counter already exists try another name", "error");
      } else {
        const data = await saveCounter(Counterstate?.saveCounterstate);
        if (data.success) {
          notify(data?.message, "success");
        }
      }

      getCounterAPIList();
      setCounterState((prev) => ({
        ...prev,
        saveCounterstate: "",
        btnName: "Save",
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const getCounterAPIList = async () => {
    try {
      const data = await getCounterList();
      setApiData((prev) => ({ ...prev, getCounterAPIData: data.data }));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCounterAPIList();
  }, []);

  const handleDeleteCounter = async (params) => {
    console.log(params);
    try {
      const data = await deleteCounter(params);
      if (data.success === true) {
        notify(data?.message, "success");
      }
      setConfirmBoxvisible({ ...confirmBoxvisible, show: false });
      getCounterAPIList();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditData = async (item) => {
    //console.log(item);
    setCounterState((prev) => ({
      ...prev,
      saveCounterstate: item.CounterName,
      btnName: "Update",
      editingCounterId: item.Id,
    }));
  };

  const handleUpdateEditData = async () => {
    try {
      const data = await updateCounter({
        Id: Counterstate.editingCounterId,
        name: Counterstate.saveCounterstate,
      });
      if (data.success === true) {
        notify(data?.message, "success");
      }
      getCounterAPIList();
      setCounterState((prev) => ({
        ...prev,
        saveCounterstate: "",
        btnName: "Save",
      }));
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setCounterState((prev) => ({
      ...prev,
      saveCounterstate: e.target.value,
    }));
  };

  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (!Counterstate?.saveCounterstate) {
      errors.saveCounterstate = "Counter Name Is Required";
      errors.id[errors.id?.length] = "txtCounter";
    }

    return errors;
  };

  const handleConfirmBox = (paramsData) => {
    console.log("paramsData", paramsData);
    setConfirmBoxvisible({
      show: true,
      alertMessage: " Are you sure to Delete Counter",
      lableMessage: "Exam Counter Master",
      chidren: (
        <>
          <div>
            <button
              className="modalConfirmButton"
              onClick={() => handleDeleteCounter(paramsData)}
            >
              Delete
            </button>
            <button
            className="modalCancelButton"
              onClick={() => {
                setConfirmBoxvisible({ ...confirmBoxvisible, show: false });
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ),
    });
  };
  return (
    <>
      <div className="m-2 spatient_registration_card">
        <form className="patient_registration card">
          <Heading
            title={t("TokenManagement.ExamCounterMaster.HeadingName")}
            isBreadcrumb={true}
          />
          <div className="row p-2 align-items-center">
            <Input
              type="text"
              className="form-control required-fields"
              id="txtCounter"
              name="txtCounter"
              value={Counterstate.saveCounterstate}
              onChange={handleChange}
              // onChange={(e) => setSaveCounterState(e.target.value)}
              lable={t("CounterName")}
              placeholder=" "
              required={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            />
            <button
              className="btn btn-sm btn-primary ml-2"
              type="button"
              onClick={
                Counterstate.btnName === "Save"
                  ? handleClickCounterName
                  : handleUpdateEditData
              }
            >
              {Counterstate.btnName}
              {/* {t("TokenManagement.ExamCounterMaster.btnName")} */}
            </button>
          </div>
        </form>
      </div>

      <div>
        <div className="card patient_registration_card my-1 mt-2 ">
          <ExamCounterMasterTable
            tbody={apiData.getCounterAPIData}
            // handleDeleteCounter={handleDeleteCounter}
            handleEditData={handleEditData}
            handleConfirmBox={handleConfirmBox}
          />
        </div>
      </div>

      {confirmBoxvisible.show && (
        <Confirm
          alertMessage={confirmBoxvisible?.alertMessage}
          lableMessage={confirmBoxvisible?.lableMessage}
          confirmBoxvisible={confirmBoxvisible}
        >
          {confirmBoxvisible?.chidren}
        </Confirm>
      )}
    </>
  );
};

export default ExamCounterMaster;
