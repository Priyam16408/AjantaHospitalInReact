import React, { useState, useRef, useEffect } from "react";
import Tables from "..";
import Modal from "../../../modalComponent/Modal";
import CancelButton from "../../CancelButton";
import SaveButton from "../../SaveButton";
import { useDispatch, useSelector } from "react-redux";
import { GetPatientUploadDocument } from "../../../../store/reducers/common/CommonExportFunction";

const DOCUMENTDATA = [
  {
    name: "Pan Card",
    image: "",
  },
  {
    name: "Voter Card",
    image: "",
  },
  {
    name: "Aadhar Card",
    image: "",
  },
  {
    name: "Driving Licence",
    image: "",
  },
  {
    name: "Passport",
    image: "",
  },
  {
    name: "OPD CARD",
    image: "",
  },
  {
    name: "ID CARD NO.",
    image: "",
  },
  {
    name: "Initial Assessment",
    image: "",
  },
];

function DocumentUploadTable() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [bodyData, setBodyData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [cameraStream, setCameraStream] = useState(null); // New state to store camera stream

  // modal code
  const show = () => setVisible(true);
  const show1 = () => setVisible1(true);
  const dispatch = useDispatch();

  const { GetPatientUploadDocumentList } = useSelector((state) => state.CommonSlice);


  useEffect(() => {
    if(!GetPatientUploadDocumentList?.length){
      dispatch(GetPatientUploadDocument({ patientID: "AM24-05030001" }));
    }
  }, [dispatch]);

  useEffect(() => {
    setBodyData(GetPatientUploadDocumentList)
  }, [GetPatientUploadDocumentList?.length])

  console.log("GetPatientUploadDocumentList",GetPatientUploadDocumentList)
  const THEAD = [
    "S.No.",
    "Research Form",
    "Upload",
    "Scan",
    "Capture",
    "Remarks",
    "View",
  ];

  // Function to close camera stream
  const closeCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  // Function to start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream); // Store camera stream
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const takePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 200, 150);
  };

  return (
    <>
      {visible && (
        <Modal
          visible={visible}
          setVisible={() => {
            closeCameraStream();
            setVisible(false);
          }}
          modalWidth="50vw"
          Header="Scanning Image"
          buttons={
            <SaveButton
              btnName={"Scanning"}
              onClick={() => setVisible(false)}
            />
          }
        >
          <div className="d-flex justify-content-center">
            <img
              src="https://img.freepik.com/free-vector/realistic-neon-lights-background_23-2148907367.jpg"
              alt=""
              width={"500px"}
              height={"300px"}
            />
          </div>
        </Modal>
      )}
      {visible1 && (
        <Modal
          visible={visible1}
          setVisible={() => {
            closeCameraStream(); // Close camera stream before closing modal
            setVisible1(false);
          }}
          Header="Capture Image"
        // buttons={
        //   <SaveButton btnName={"Savse"} onClick={() => setVisible1(false)} />
        // }
        >
          <div className="d-flex align-items-start">
            <button onClick={startCamera} className="btn btn-primary">
              Open Camera
            </button>

            <video ref={videoRef} width="400" height="300" autoPlay></video>

            <button onClick={takePhoto} className="btn btn-primary">
              Capture Photo
            </button>

            <canvas ref={canvasRef} width="400" height="300"></canvas>
          </div>
        </Modal>
      )}
      <Tables
        thead={THEAD}
        tbody={bodyData?.map((row, index) => ({
          "S.no": <span onClick={() => handleRowClick(index)}>{index + 1}</span>,
          name: <>{row?.formName}</>,
          upload: (
            <>
              <input className="table-input" type="file" />
            </>
          ),
          Scan: (
            <>

              <i className="fa fa-expand"></i>
            </>
          ),
          capture: (
            <>
              <i
                className="pi pi-camera
"
                aria-hidden="true"
                onClick={show1}
              ></i>
            </>
          ),
          remarks: <><input className="table-input" type="text" /></>,
          view: (
            <>
              <i className="pi pi-eye " aria-hidden="true"></i>
            </>
          ),
        }))}
      />
    </>
  );
}

export default DocumentUploadTable;
