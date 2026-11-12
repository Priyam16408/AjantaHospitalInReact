import React from "react";
import TextAreaInput from "../formComponent/TextAreaInput";
import ReactSelect from "../formComponent/ReactSelect";
import { handleReactSelectDropDownOptions } from "../../utils/utils";



const SystemMaticEmergency = (props) => {

  // const [breasts, setBreasts] = useState("")

  const breastOptions = [
    { label: "Normal", value: "Normal" },
    { label: "Retracted Fibroadenosis", value: "Retracted Fibroadenosis" },
    { label: "Lump", value: "Lump" },
  ]


 const handleSelect = (name, value) => {
  console.log(name, value);

  setPrisciptionForm((val) => ({
    ...val,
    [name]: value ? value.value : null, // ✅ safely handle clear
  }));
};

  const {prisciptionForm, setPrisciptionForm, handlechangebyPrisciption,onFocus  } = props
  const TEXTAREA_RENDER = [
    {
      typeName:"CVS",
      name:"CVS",
      value:prisciptionForm.CVS,
      onChange:handlechangebyPrisciption,
      id:"1"
    },
    {
      typeName:"RS",
      name:"RS",
      value:prisciptionForm.RS,
      onChange:handlechangebyPrisciption,
      id:"2"
    },
    {
      typeName:"PA",
      name:"PA",
      value:prisciptionForm.PA,
      onChange:handlechangebyPrisciption,
      id:"3"
    },
    {
      typeName:"CNS",
      name:"CNS",
      value:prisciptionForm.CNS,
      onChange:handlechangebyPrisciption,
      id:"4"
    },
    {
      typeName:"General",
      name:"General",
      value:prisciptionForm.General,
      onChange:handlechangebyPrisciption,
      id:"5"
    },
    {
      typeName:"ENT",
      name:"ENT",
      value:prisciptionForm.ENT,
      onChange:handlechangebyPrisciption,
      id:"6"
    },
    {
      typeName:"Pallor",
      name:"pallor",
      value:prisciptionForm.pallor,
      onChange:handlechangebyPrisciption,
      id:"7"
    },
    {
      typeName:"Odema",
      name:"odema",
      value:prisciptionForm.odema,
      onChange:handlechangebyPrisciption,
      id:"8"
    },
    {
      typeName:"Uterus",
      name:"uterus",
      value:prisciptionForm.uterus,
      onChange:handlechangebyPrisciption,
      id:"9"
    },
    {
      typeName:"Varicose Veins",
      name:"varicoseVeins",
      value:prisciptionForm.varicoseVeins,
      onChange:handlechangebyPrisciption,
      id:"10"
    },
    {
      typeName:"Respiratory System - Breath Sounds",
      name:"respiratory",
      value:prisciptionForm.respiratory,
      onChange:handlechangebyPrisciption,
      id:"11"
    },
    {
      typeName:"Any adventitious Sounds",
      name:"anyAdventitiousSounds",
      value:prisciptionForm.anyAdventitiousSounds,
      onChange:handlechangebyPrisciption,
      id:"12"
    },
   
  ];
  return (
    <div className="col-sm-12">
      <div className="row mt-2">
        {TEXTAREA_RENDER?.map((ele, index) => (
          <div className="col-xl-2 col-md-3 col-sm-6 col-12 " key={index}>
            {/* <div className="row"> */}
              {/* <label htmlFor={ele.id} className="col-3 ">{ele.typeName}</label> */}
              <TextAreaInput id={ele.name} lable={ele.typeName} className="col-12" name={ele.name} value={ele.value} onChange={ele.onChange} placeholder=" " onFocus={onFocus} rows={1}/>
            {/* </div> */}
          </div>
        ))}
        <div className="col-xl-4 col-md-6 col-sm-6 col-12 ">
        
          <ReactSelect
            placeholderName={"Breasts-Nipples"}
            id={"breasts"}
            searchable={true}
            name={"breasts"}
            respclass=""
            dynamicOptions={[...handleReactSelectDropDownOptions(breastOptions, "label", "value")]}
            handleChange={handleSelect}
            value={
              prisciptionForm?.breasts
            }
            removeIsClearable={false}
          />
      
        </div>
      </div>
    </div>
  );
};

export default SystemMaticEmergency;
