import React from 'react'
import { useTranslation } from 'react-i18next'
import { UploadFileIcon, UploadSuccessIcon } from '../SvgIcons'

export default  function BrowseButton ({handleImageChange,accept,label,className,value,name}) {
  const [t]=useTranslation()
  return (
    <>
         <input
            type="file"
            id={name?name:"fileInput"}
            onChange={handleImageChange}
            name={name}
            style={{ display: "none" }}
            accept={accept}
          />
          <button className={`btn btn-sm ${className}` }>
            <label htmlFor={name?name:"fileInput"} className="text-white file-type-browse pointer-cursor">
             {label?label:t("Browse")} {value ? <UploadSuccessIcon/> : <UploadFileIcon/>}
            </label>
          </button>
    </>
  )
}
