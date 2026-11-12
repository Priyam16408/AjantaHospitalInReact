import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  BindAvailablePages,
  BindPendingPages,
  CommonAPIGetDoctorIDByEmployeeID,
  getDoctorDepartmentLitsApi,
  MenuInsert,
  MenuUpdate,
  SequenceUpdate,
} from "../../../networkServices/DoctorApi";
import { notify } from "../../../utils/utils";
import { CheckBox } from "rc-easyui";
import { Checkbox } from "primereact/checkbox";
import ReactSelect from "../../../components/formComponent/ReactSelect";

const DoctorPresciptionOrdering = ({
  getDoctorID,
  getLoadPrescriptionView,
  patientDetail,
}) => {
  const localData = useLocalStorage("userData", "get");

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [doctorDepartment, setDoctorDepartment] = useState([]);
  const [doctorID, setDoctorID] = useState(null);
  const [DepartmentID, setDepartmentID] = useState("");
  const handleCheckbox = async (e, index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].isChecked = e.target.checked;
    setPosts(updatedPosts);

    if (e.target.checked) {
      await handleMenuInsert(updatedPosts.filter((post) => post.isChecked));
    } else {
      await handleMenuUpdate(updatedPosts.filter((post) => !post.isChecked));
    }
  };

  console.log(DepartmentID, "Department");
  // const handleCheckbox = async (e, index) => {
  //   e.stopPropagation();

  //   const updatedPosts = [...posts];
  //   updatedPosts[index].isChecked = !updatedPosts[index].isChecked;
  //   setPosts(updatedPosts);

  //   if (updatedPosts[index].isChecked) {
  //     await handleMenuInsert(updatedPosts.filter((post) => post.isChecked));
  //   } else {
  //     await handleMenuUpdate(updatedPosts.filter((post) => !post.isChecked));
  //   }
  // };

  const getCurrentDoctorID = async () => {
    try {
      const response = await CommonAPIGetDoctorIDByEmployeeID();
      setDoctorID(response?.data[0]?.doctorID);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSelect = (name, value) => {
    setDepartmentID(value?.value);
  };

  const handleGetDoctorDepartments = async () => {
    try {
      const res = await getDoctorDepartmentLitsApi(doctorID);
      setDoctorDepartment(res.data);
    } catch (error) {
      notify(error.response?.message, "error");
      console.log(error);
    }
  };

  const handleMenuUpdate = async (list) => {
    if (!list || list.length === 0) return;

    const payload = {
      cpoeMenuList: list.map((item, index) => ({
        sequenceNo: (index + 1).toString(),
        roleID: localData?.defaultRole,
        menuID: item.Id.toString(),
        doctor_ID: getDoctorID,
        DepartmentID: DepartmentID,
      })),
      cpoE_Type: 2,
    };

    try {
      setIsLoading(true);
      const res = await MenuUpdate(payload);
      if (res.success) {
        notify(res.message, "success");
        fetchAllData();
        if (patientDetail) {
          const { PatientID, TransactionID } = patientDetail;
          console.log("PatientID,TransactionID", PatientID, TransactionID);
          getLoadPrescriptionView(TransactionID, PatientID);
        }
      }
    } catch (error) {
      console.error("Error with MenuUpdate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuInsert = async (list) => {
    if (!list || list.length === 0) return;

    const payload = {
      cpoeMenuList: list.map((item, index) => ({
        sequenceNo: (index + 1).toString(),
        roleID: localData?.defaultRole,
        menuID: item.Id.toString(),
        doctor_ID: getDoctorID,
        DepartmentID: DepartmentID,
      })),
      cpoE_Type: 2,
    };

    try {
      setIsLoading(true);
      const res = await MenuInsert(payload);
      if (res.success) {
        notify(res.message, "success");
        fetchAllData();
        if (patientDetail) {
          const { PatientID, TransactionID } = patientDetail;
          getLoadPrescriptionView(TransactionID, PatientID);
        }
      }
    } catch (error) {
      console.error("Error with MenuInsert:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [availableResp, pendingResp] = await Promise.all([
        BindAvailablePages({
          DoctorId: getDoctorID,
          RoleID: localData?.defaultRole,
          departmentId: DepartmentID,
        }),
        BindPendingPages({
          DoctorId: getDoctorID,
          RoleID: localData?.defaultRole,
          departmentId: DepartmentID,
        }),
      ]);

      const availableData =
        availableResp?.data?.map((item) => ({ ...item, isChecked: true })) ||
        [];
      const pendingData =
        pendingResp?.data?.map((item) => ({ ...item, isChecked: false })) || [];

      setPosts([...availableData, ...pendingData]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Reorder the list locally
    const newPosts = Array.from(posts);
    const [removed] = newPosts.splice(source.index, 1);
    newPosts.splice(destination.index, 0, removed);

    // Update the sequence numbers
    const updatedPosts = newPosts.map((item, index) => ({
      ...item,
      sequenceNo: (index + 1).toString(),
    }));

    setPosts(updatedPosts);

    // Trigger API call to update the sequence on the backend
    try {
      setIsLoading(true);

      const payload = {
        cpoeMenuList: updatedPosts.map((item, index) => ({
          sequenceNo: (index + 1).toString(),
          roleID: localData?.defaultRole,
          menuID: item.Id.toString(),
          doctor_ID: getDoctorID,
          DepartmentID: DepartmentID,
        })),
        cpoE_Type: 2,
      };

      const res = await SequenceUpdate(payload);
      if (res.success) {
        notify(res.message, "success");
        fetchAllData(); // Refresh data if needed
        if (patientDetail) {
          const { PatientID, TransactionID } = patientDetail;
          getLoadPrescriptionView(TransactionID, PatientID);
        }
      }
    } catch (error) {
      console.error("Error updating sequence:", error);
      notify("Failed to update sequence", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const defaultKey = doctorDepartment?.find((ele) => ele?.IsDefault === 1);
    setDepartmentID(defaultKey?.DepartmentID);
  }, [doctorDepartment]);

  useEffect(() => {
    if (DepartmentID) {
      fetchAllData();
    }
  }, [DepartmentID, doctorID]);

  useEffect(() => {
    getCurrentDoctorID();
    if (doctorID) {
      handleGetDoctorDepartments();
    }
  }, [doctorID]);

  return (
    <div className="row">  
      <div className="col-xl-8 col-12 w1 pl-4"> 
        <ReactSelect
          dynamicOptions={doctorDepartment?.map((ele) => {
            return {
              value: ele?.DepartmentID,
              label: ele?.DepartmentName,
            };
          })}
          name={"departmentName"}
          value={DepartmentID}
          handleChange={handleSelect}
          placeholderName={"Doctor Department"}
          id={"Select"}

        />
      </div>
      <div className="col-md-12">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable ">
            {(provided) => (
              <ul
                className="d-flex flex-wrap gap-2  droppable-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  listStyle: "none",
                  minHeight: "300px",
                  padding: "10px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {posts.length === 0 ? (
                  <p>No data available</p>
                ) : (
                  posts.map((post, index) => (
                    <Draggable
                      key={post.Id}
                      draggableId={post.Id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          className="draggable-item p-2 d-flex align-items-center w-100"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            margin: "8px 0",
                            borderRadius: "4px",
                            width: "100%",
                            height: "20px",
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: "10px",
                            // justifyContent:"center",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-center">
                            <span className="checkbox-index">{index + 1}.</span>

                            <input
                              type="checkbox"
                              id={`checkbox-${index}`}
                              checked={post.isChecked}
                              className="theme-color background-theme-color doc-checkbox"
                              style={{
                                width: "16px",
                                height: "14px",
                                display: "inline-block",
                                flexShrink: 0,
                                // accentColor:"currentcolor",
                              }}
                              onChange={(e) => handleCheckbox(e, index)}
                              // id={index + 1}
                            />

                            <label
                              htmlFor={`checkbox-${index}`}
                              className="py-2 px-3 ml-1 rounded mb-0 theme-color background-theme-color"
                              style={{
                                // cursor: "pointer",
                                // transition: "all 0.5s ease",
                                // userSelect: "none",
                                // minWidth: "270px",

                                cursor: "pointer",
                                transition: "all 0.5s ease",
                                userSelect: "none",
                                minWidth: "270px",
                                // padding: "8px 12px",
                                borderRadius: "4px",
                                backgroundColor:
                                  "var(--background-theme-color)",
                                flexGrow: 1,
                              }}
                              for={`checkbox-${index}`}
                            >
                              {post.DisplayName}
                            </label>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default DoctorPresciptionOrdering;
