import React from "react";
import { useTranslation } from "react-i18next";



const CancelButton = ({ cancleBtnName, onClick }) => {
  const [t] =useTranslation ();
  return (
    <>
      <button onClick={onClick} className='text-white'>{t(cancleBtnName)}</button>
    </>
  );
};

export default CancelButton;
