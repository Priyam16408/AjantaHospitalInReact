import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";  
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import LabeledInput from "../../../components/formComponent/LabeledInput";

export default function BloodCollectionDetails({
  handleChangeModel,
  inputData,
}) {
  const [t] = useTranslation();
  const [values, setValues] = useState(inputData); 
  console.log("the inputData data is in modal",inputData);

  useEffect(() => {
    handleChangeModel(values);
  }, [values]);

 

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };  

  
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };


    const DonationCompleted = [
        
    { value: "select", label: "select" },
    { value: "0", label: "No" },
    { value: "1", label: "Yes" },
  ];
  
 
  return (
    <>
   <div className="d-flex align-items-baseline w-100">
  <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-3 w-100">
    {/* Static Input Fields */}
    <div className="col mb-1 ">
      <LabeledInput label={t("Donor ID")} value={inputData?.Visitor_ID} />
    </div>
    <div className="col mb-1">
      <LabeledInput label={t("Name")} value={inputData?.Name} />
    </div>
    <div className="col mb-1">
      <LabeledInput label={t("Sex")} value={inputData?.Gender} />
    </div>
    <div className="col mb-1">
      <LabeledInput label={t("Blood Group")} value={inputData?.BloodGroup} />
    </div>
    <div className="col mb-1">
      <LabeledInput label={t("Bag Type")} value={inputData?.BagType} />
    </div>
    <div className="col mb-1">
      <LabeledInput label={t("Qty")} value={inputData?.Quantity} />
    </div>
    <div className="col mb-1">
      <LabeledInput label={t("Entry Date")} value={inputData?.dtEntry} />
    </div>

    {/* Editable Input Fields */}
    <div className="col mb-1">
      <Input
        type="text"
        className="form-control"
        id="VisitorId"
        name="VisitorId"
        value={values?.VisitorId || ""}
        onChange={handleChange}
        lable={t("Visitor ID")}
      />
    </div>

    <div className="col mb-1">
         <ReactSelect
            placeholderName={t("Donation Completed")}
            id={"DonationCompleted"}
            searchable={true}
            removeIsClearable={true}
            dynamicOptions={DonationCompleted}
            handleChange={handleSelect}
            value={`${values?.DonationCompleted?.value}`}
            name={"DonationCompleted"}
          />
    </div>

    <div className="col mb-1">
      <Input
        type="text"
        className="form-control"
        id="remark"
        name="remark"
        value={values?.remark || ""}
        onChange={handleChange}
        lable={t("Remark")}
      />
    </div> 

     <div className="col mb-1 d-flex ">
      <Input
        type="checkbox"
       
      />
      <label className="ml-1" > Poor/Shocked Collection</label>
    </div> 

    {values?.DonationCompleted?.value=="1" ?<>
      <div className="col mb-1">
         <ReactSelect
              placeholderName={t("Bag Type ")}
              id={"bagType"}
              searchable={true}
              removeIsClearable={true} 
           
              handleChange={handleSelect}
              value={`${values?.bagType?.value}`}
              name={"bagType"}
            />
    </div>

    <div className="col mb-1">
      <Input
        type="text"
        className="form-control"
        id="tubeNo"
        name="tubeNo"
        value={values?.tubeNo || ""}
        onChange={handleChange}
        lable={t("Tube No")}
      />
    </div> 
    </>:""}


  </div>
</div>

    </>
  );
}
