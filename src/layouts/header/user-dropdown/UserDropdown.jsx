import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { StyledBigUserImage, StyledSmallUserImage } from "@app/styles/common";
import {
  UserBody,
  UserFooter,
  UserHeader,
  UserMenuDropdown,
} from "@app/styles/dropdown-menus";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import Modal from "../../../components/modalComponent/Modal";
import EditUserDetailModel from "../../../components/modalComponent/Utils/EditUserDetailModel";
import ChangePasswordModel from "../../../components/modalComponent/Utils/ChangePasswordModel";
import {
  updatePassword,
  updateUserDetail,
} from "../../../networkServices/HeaderApi";
import { inputBoxValidation, notify } from "../../../utils/utils";
import Input from "../../../components/formComponent/Input";
import UploadImageModal from "../../../components/modalComponent/Utils/UploadImageModal";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../../utils/constant";
import "../../../../src/index.css";
import UploadSignature from "../../../components/modalComponent/Utils/UploadSignature";
import doctorPng from "../../../assets/image/doctor-p.jpg";

// declare const FB;

const UserDropdown = ({
  dropdownOpen,
  setDropdownOpen,
  isMobile,
  setLocalImage,
}) => {
  const localData = useLocalStorage("userData", "get"); // get Data from localStorage
  const navigate = useNavigate();
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const authentication = useSelector((state) => state?.auth?.authentication);
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isuploadOpen, setIsuploadOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();
  const [preview, setPreview] = useState(localData?.employeePhoto);

  const dropdownRef = useRef(null);

  //  const [isOpen,setIsOpen] = useState(false)
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});

  const [inputs, setInputs] = useState({
    MobileNo: localData?.mobile,
    EmailId: localData?.email,
    showDropdown: false,
    buttonName: "edit",
    preview: localData?.employeePhoto,
  });
  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  useEffect(() => {
    if (!dropdownOpen) {
      setInputs((val) => ({ ...val, preview: localData?.employeePhoto }));
    }
  }, [dropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown
      }
    };
    // Add event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updatePasswordApi = async (password) => {
    const apiResponse = await updatePassword(password);
    if (apiResponse?.success) {
      notify(apiResponse?.message, "success");
      setDropdownOpen(false);
      setIsOpen();
    } else {
      notify(apiResponse?.message, "error");
    }
    if (
      apiResponse?.status === 400 &&
      Object.keys(apiResponse?.data?.errors)?.length > 0
    ) {
      let errormessage =
        apiResponse?.data?.errors?.ConfirmPassword?.length > 0 &&
        apiResponse?.data?.errors?.ConfirmPassword[0];
      apiResponse?.data?.errors?.Password?.length > 0
        ? (errormessage = apiResponse?.data?.errors?.Password[0])
        : "";
      apiResponse?.data?.errors?.OldPassword?.length > 0
        ? (errormessage = apiResponse?.data?.errors?.OldPassword[0])
        : "";
      notify(errormessage, "error");
    }
  };

  const updateUserApi = async (userData) => {
    // debugger

    const apiResponse = await updateUserDetail(userData, localData?.employeeID);

    if (apiResponse?.success) {
      useLocalStorage("userData", "set", apiResponse?.data?.loginResponse);
      if (isMobile) {
        setLocalImage(apiResponse?.data?.loginResponse?.employeePhoto);
      }
      notify(apiResponse?.message, "success");
      setDropdownOpen(false);
      setIsOpen();
    } else {
      notify(apiResponse?.message, "error");
      // setInputs((val)=>({...val,preview: localData?.employeePhoto}))
    }

    if (apiResponse?.status === 400) {
      notify(apiResponse?.data?.message, "error");
      // setInputs((val)=>({...val,preview: localData?.employeePhoto}))
    }
  };

  const handleChangeModel = (data) => {
    setModalData(data);
  };

  const handleModelOpen = (type) => {
    if (type === "editDetail") {
      setInputs((val) => ({ ...val, buttonName: "edit" }));

      updateUserApi(inputs);
    } else if (type === "changePassword")
      setHandleModelData({
        label: t("Change Password"),
        width: "60vw",
        isOpen: true,
        Component: (
          <ChangePasswordModel
            handleChangeModel={handleChangeModel}
            inputData={{}}
          />
        ),
        handleInsertAPI: updatePasswordApi,
        buttonName: t("Update Password"),
      });
  };

  const handleModelSignature = () => {
    setHandleModelData({
      label: t("Update Signature"),
      width: "40vw",
      isOpen: true,
      modalData: { preview: inputs?.preview, mayank: "test" },
      Component: (
        <UploadSignature
          handleChangeModel={handleChangeModel}
          setHandleModelData={setHandleModelData}
        />
      ),
      // handleInsertAPI: updateUserApi,
      footer: <></>,
      buttonName: t("Save"),
    });
  };

  const handlechange = (e) => {
    setIsDropdownOpen(true);
    setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    closeCameraStream();
    reader.onloadend = () => {
      // setImage(file);
      // setPreview(reader.result);
      setInputs((val) => ({
        ...val,
        showDropdown: !inputs?.showDropdown,
        preview: reader.result,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setCameraStream({ active: true });
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };
  const closeCameraStream = () => {
    setCameraStream({ active: false });
  };
  const takePhoto = (photo) => {
    // setPreview(photo)
    setInputs((val) => ({ ...val, preview: photo }));
  };

  const uploadImageFun = () => {
    setInputs((val) => ({ ...val, showDropdown: !inputs?.showDropdown }));
  };

  return (
    <div>
      {!isMobile ? (
        <div>
          <img
            src={`${localData?.employeePhoto ||doctorPng}`}
            alt=""
            width={25}
            height={25}
            className="rounded-circle"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
          />
        </div>
      ) : (
        ""
      )}

      {dropdownOpen ? (
        <div className="manage_usermodel bg-color-container" ref={dropdownRef}>
          <div className="">
            <img
              src={`${inputs?.preview}`}
              alt=""
              style={{
                borderRadius: "50%",
                height: "100px",
                width: "100px",
                marginBottom: "2px",
              }}
              onClick={uploadImageFun}
            />

            {inputs?.showDropdown ? (
              <div className="profile-upload-btn">
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  accept="image/*"
                />
                <label
                  htmlFor="fileInput"
                  className="text-white profile-upload-file"
                >
                  <p className="buttonclasss m-0 p-1">{t("Upload Image")}</p>
                </label>
                {/* <p className='m-0 p-1'>Capture Image</p> */}
              </div>
            ) : (
              ""
            )}

            <div className="headerUserDropdownField">
              <div className="d-flex pb-1 ml-3 mr-3 mt-2">
                <span className="headerUserDropdownLabel">
                  {t("Mobile Number")}
                </span>
                <input
                  className="form-control headerUserDropdowninput"
                  type="text"
                  name="MobileNo"
                  id="MobileNo"
                  value={inputs?.MobileNo}
                  onChange={(e) => {
                    inputBoxValidation(
                      MOBILE_NUMBER_VALIDATION_REGX,
                      e,
                      handlechange
                    );
                  }}
                  // readOnly={inputs?.buttonName === "edit" ? true : false}
                />
              </div>
              <div className="d-flex mb-3 ml-3 mr-3">
                <span className="headerUserDropdownLabel">{t("Email")}</span>
                <input
                  className="form-control headerUserDropdowninput"
                  type="text"
                  name="EmailId"
                  id="EmailId"
                  value={inputs?.EmailId}
                  onChange={handlechange}
                  // readOnly={inputs?.buttonName === "edit" ? true : false}
                />
              </div>
            </div>
          </div>

          {/* <UserFooter className='possition-relative p-4'> */}
          <div
            className="d-flex justify-space-around  position-absolute"
            style={{
              bottom: "0",
              padding: "5px",
              gap: "5px",
              right: "50%",
              transform: "translate(50%, 0)",
            }}
          >
            {/* {inputs?.buttonName === "edit" ? */}
            {false ? (
              <button
                type="button"
                className="text-white rounded Edit_detail"
                onClick={() => {
                  setInputs((val) => ({ ...val, buttonName: "save" }));
                }}
              >
                {t("Edit Detail")}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="text-white rounded Edit_detail"
                  onClick={() => {
                    handleModelOpen("editDetail");
                  }}
                >
                  {t("Update Detail")}
                </button>

                <button
                  type="button"
                  className="text-white rounded Edit_detail"
                  onClick={() => {
                    handleModelSignature();
                  }}
                >
                  {t("Update Signature")}
                </button>
              </>
            )}
            <button
              type="button"
              className="text-white rounded Edit_detail"
              onClick={() => {
                handleModelOpen("changePassword");
              }}
            >
              {t("Change Password")}
            </button>
          </div>
          {/* </UserFooter>  */}
        </div>
      ) : (
        ""
      )}

      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={handleModelData?.label}
          buttonType={"button"}
          buttonName={handleModelData?.buttonName}
          // buttons={handleModelData?.extrabutton}
          footer={handleModelData?.footer}
          modalData={modalData}
          setModalData={setModalData}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      {/* {isuploadOpen && (
        <UploadImageModal
          isuploadOpen={isuploadOpen}
          closeCameraStream={closeCameraStream}
          setIsuploadOpen={setIsuploadOpen}
          // preview={preview}
          modalData={{ preview: preview }}
          setModalData={setPreview}
          handleImageChange={handleImageChange}
          startCamera={startCamera}
          videoRef={videoRef}
          cameraStream={cameraStream}
          takePhoto={takePhoto}
          // canvasRef={canvasRef}
          handleAPI={(data) => { setIsDropdownOpen(true); setInputs((val) => ({ ...val, preview: data?.preview })); setIsuploadOpen(false); closeCameraStream() }}
        />
      )} */}
    </div>
  );
};

export default UserDropdown;
