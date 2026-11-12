import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";
import BrowseButton from '../../formComponent/BrowseButton';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import UploadImageModal from './UploadImageModal';

export default function EditUserDetailModel({ handleChangeModel, inputData }) {
  const [t] = useTranslation();
  const [isuploadOpen, setIsuploadOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();
  const [preview, setPreview] = useState(inputData?.preview);

  const [inputs, setInputs] = useState(inputData)
  const handlechange = (e) => {
    setInputs((val) => ({ ...val, [e.target.name]: e.target.value }))
  }
  useEffect(() => {
    handleChangeModel(inputs)
  }, [inputs])

  const handleChangeImage = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setPreview(reader.result);
      // setInputs((val) => ({ ...val, preview: reader.result }))
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  
  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    closeCameraStream();
    reader.onloadend = () => {
      // setImage(file);
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const startCamera = async () => {
    try {
      setCameraStream({active:true});
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };
  const closeCameraStream = () => {
    setCameraStream({active:false});
  };

  const takePhoto = (photo) => {
    setPreview(photo)
    setInputs((val) => ({ ...val, preview: photo }))
  };
  return (
    <>
    <div className="row p-2">
      <Input
        type="text"
        className="form-control"
        id="MobileNo"
        name="MobileNo"
        lable={t("modalComponent.Utils.EditUserDetailModel.MobileNo")}
        placeholder=" "
        respclass="col-xl-3 col-md-3 col-sm-4 col-12"
        value={inputs?.MobileNo?inputs?.MobileNo:""}
        onChange={handlechange}
      />
      
      <Input
        type="text"
        className="form-control"
        id="EmailId"
        name="EmailId"
        lable={t("modalComponent.Utils.EditUserDetailModel.EmailId")}
        placeholder=" "
        respclass="col-xl-3 col-md-3 col-sm-4 col-12"
        value={inputs?.EmailId?inputs?.EmailId:""}
        onChange={handlechange}
      />
      <div className=' col-sm-4 col-12 text-center previewImage '>
            <img
              src={preview}
              onClick={() => setIsuploadOpen(true)}
              className='previewImage border-0'
            />
         
        {/* <BrowseButton accept="image/*" handleImageChange={(e) => { handleChangeImage(e) }} label={t("modalComponent.Utils.EditUserDetailModel.photo")} />

        <img src={`${inputs?.preview}`} alt="" className='previewImage' /> */}
      </div>

    </div>

    {isuploadOpen && (
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
          handleAPI={(data) => { setInputs((val) => ({ ...val, preview: data?.preview })); setIsuploadOpen(false); closeCameraStream() }}
        />
      )}
    </>
  )
}
