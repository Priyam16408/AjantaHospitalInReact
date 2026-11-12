import React, { useState } from "react";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import { GetDetailsAgainstRecieptNOApi } from "../../../networkServices/pharmecy";
import ReceiptPaymentModeTable from "./ReceiptPaymentModeTable";
import { notify } from "../../../utils/utils";
const ChangePaymentMode = () => {
  const [t] = useTranslation();
  const [bodyData, setBodyData] = useState([]);
  const [search, setSearch] = useState(""); 

  const handleCustomSelect = (index, name, value) => {
    const updatedData = bodyData.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setBodyData(updatedData);
  };

  const SearchBillPrintAPI = async () => {
    if (!search) {
      notify("Please enter a bill number", "error");
      return;
    }

    try {
      const dataResponse = await GetDetailsAgainstRecieptNOApi(search);
      if (dataResponse?.success) {
        setBodyData(dataResponse.data);
      } else {
        notify(dataResponse?.message, "error");
      }
    } catch (error) {
      console.log(error);
      notify("Something went wrong", "error");
    }
  };

  return (


    <div>
      <div className="card">
        <Heading title="Search Criteria"  className="p-2"  />
        <div className="col-xl-6 col-md-4 col-sm-6 col-12">
        
          <div className="d-flex justify-content-start pt-2" style={{ position: "relative" }}>
            <Input
              type="text"
              className="form-control"
              lable={t("Enter Receipt No")}
              respclass="w-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ position: "absolute", right: "0px" }}>
              <label
                style={{
                  border: "1px solid #ced4da",
                  padding: "2px 5px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
                onClick={SearchBillPrintAPI}
              >
                <i className="fa fa-search" aria-hidden="true"></i>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card patient_registration_card my-1 mt-2">
        <ReceiptPaymentModeTable
          tbody={bodyData}
          SearchBillPrintAPI={SearchBillPrintAPI}
          // setBodyData={setBodyData}
          handleCustomSelect={handleCustomSelect}
        />
      </div>
    </div>

    
  );
};

export default ChangePaymentMode;
