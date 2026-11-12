import React from 'react'
import { useTranslation } from "react-i18next";
const SaveButton = ({btnName,onClick , disabled}) => {
    const [t] =useTranslation ();
  return (
    <button className={`text-white ${disabled? "cursor-disable":""}`} onClick={onClick} disabled={disabled} >{t(btnName)}</button>
  )
}

export default SaveButton