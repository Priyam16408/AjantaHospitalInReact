import React from "react";

export default function DoctorPrescriptionModalPrint({ url,isPrint }) {



  return (
    <div className="bg-white p-1 rounded-2xl shadow-lg w-[80%] h-[80%] relative">

      <iframe
        src={url}
        title="Prescription Modal Print"
        style={{ height: "100vh", width: "100%" }}
        id="myIframe"
      />
    </div>
  );
}
