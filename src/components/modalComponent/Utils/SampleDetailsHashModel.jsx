import React from "react";
import { useTranslation } from "react-i18next";


export default function SampleDetailsHashModel({ inputData }) {
  // console.log("Aaaaaaa",inputData)
  const [t] = useTranslation();
  return (
    <div>
      <h4 className="text-center  sampleCollectiondetaiol" >{t("Name of Person")} : <span className="text-red sampleCollectiondetaiol">  {inputData?.name} </span> </h4>
      <h4 className="text-center  sampleCollectiondetaiol" >{t("Date Time")}: <span className="text-red sampleCollectiondetaiol"> {inputData?.date} </span> </h4>
    </div>

  );
}
