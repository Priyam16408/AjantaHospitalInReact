import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  BindDocDetails,
  IPDAdvanceGetCTBList,
} from "../../networkServices/BillingsApi";
import CTBbillrePrintTable from "./CTBbillrePrintTable";
import { GetBindAllDoctorConfirmation } from "../../store/reducers/common/CommonExportFunction";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

const CTBBillRePrint = ({ activeClass, data }) => {
  console.log("data",data)
  const { t } = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const dispatch = useDispatch();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [detail, setDetail] = useState([]);



  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
      })
    );
  }, [dispatch]);

  const geBindDetails = async () => {
    const TransactionID = data?.transactionID;
    try {
      const response = await IPDAdvanceGetCTBList(TransactionID);
      console.log("res",response)
      setDetail(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    geBindDetails();
  }, []);
  // const geBindDocDetails = async () => {
  //   const TransactionID = data?.transactionID;
  //   try {
  //     const response = await BindDocDetails(TransactionID);
  //     setDetail(response?.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   geBindDocDetails();
  // }, []);

  const thead = [
    t("S.No."),
    t("Date"),
    t("CTB No."),
    t("Recipt No."),
    t("View"),
    t("Print"),
   
  ];
  return (
    <>
    
      <div className="row">
        <div className="col-sm-12">
          {/* <DoctorShiftTable THEAD={thead} tbody={detail} /> */}
          <CTBbillrePrintTable  THEAD={thead} tbody={detail} transactionID={data?.transactionID}/>
        </div>
      </div>
    </>
  );
};

export default CTBBillRePrint;


// import React from 'react'
// import DatePicker from '../formComponent/DatePicker'
// import Heading from '../UI/Heading'
// import { useTranslation } from 'react-i18next';
// import ReactSelect from '../formComponent/ReactSelect';

// const CTBBillRePrint = () => {
//    const [t] = useTranslation();
//   return (
//      <div className="card mt-2">
//         <Heading title={t("CTB Details")} />
//         <div className="row p-2">
//           <DatePicker
//             className="custom-calendar"
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             id="date"
//             name="date"
//             // value={payload?.date ? payload?.date : new Date()}
//             // handleChange={handleChange}
//             // lable={t("Date")}
//             // placeholder={VITE_DATE_FORMAT}
//           />
//           <ReactSelect
//             placeholderName={t("Rate On")}
//             searchable={true}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
//             id={"RateOn"}
//             name={"RateOn"}
//             // value={payload?.RateOn?.value}
//             // removeIsClearable={true}
//             // handleChange={(name, e) =>
//             //   handleReactSelect(
//             //     name,
//             //     e,
//             //     getBindDocType(e?.value, items[0]?.Surgery_ID)
//             //   )
//             // }
//             // dynamicOptions={RateOnOptions}
//           />
        
//           </div>
//           </div>
//   )
// }

// export default CTBBillRePrint