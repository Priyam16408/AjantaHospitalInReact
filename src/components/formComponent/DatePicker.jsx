// import React from "react";
// import { Calendar } from "primereact/calendar";

// function DatePicker({
//   name,
//   className,
//   respclass,
//   id,
//   placeholder,
//   lable,
//   value,
//   handleChange,
//   tabIndex,
//   inputClassName,
//   removeFormGroupClass,
//   maxDate,
//   minDate,
//   disable,
//   viewDate,
//   dateFormat
// }) {
//   return (
//     <>
//       <div className={respclass} style={{ position: "relative" }}>
//         {/* <FloatLabel>  */}
//         <div className={removeFormGroupClass ? "" : "form-group"}>
//           <Calendar
//             inputId={id}
//             // id={id}
//             showIcon
//             placeholder={placeholder}
//             className={className}
//             dateFormat={dateFormat?dateFormat:"dd-M-yy"}
//             view={viewDate?viewDate:"date"} 
//             value={value?value:null}
//             name={name}
//             maxDate={maxDate}
//             minDate={minDate}
//             disabled={disable}
//             onChange={handleChange}
//             // onChange={(e) => handleChange(name, e.target.value)}
//             wrapperclassname="datepicker"
//             inputClassName={inputClassName}
//             tabIndex={tabIndex ? tabIndex : "-1"}
//             // disabledDates={}
//             // disabledDays={}

//           />
//           {/* <label htmlFor="birth_date">Birt h Date</label> */}
//           {lable && (
//             <label
//               htmlFor={id}
//               className="labelPicker lable truncate "
//               style={{ fontSize: "5px !important" }}
//             >
//               {lable}
//             </label>
//           )}
//         </div>
//         {/* </FloatLabel> */}
//       </div>
//     </>
//   );
// }

// export default DatePicker;


// updated date picker by akhilesh for manual date enter feature



import React from "react";
import { Calendar } from "primereact/calendar";
import moment from "moment";

function DatePicker({
  name,
  className,
  respclass,
  id,
  placeholder,
  lable,
  value,
  handleChange,
  tabIndex,
  inputClassName,
  removeFormGroupClass,
  maxDate,
  minDate,
  disable,
  viewDate,
  handleSelect,
}) {
  // PrimeReact expects this format for display
  const primeDateFormat = "dd/M/yy";

  // Use moment for parsing typed input
  const handleManualInput = (e) => {
    const manualInput = e.target.value;

    // Match the format you expect users to type: "DD/MM/YYYY"
    const parsed = moment(manualInput, "DD/MM/YYYY", true); // true = strict parsing

    if (parsed.isValid()) {
      // Return value as a native Date object (same as calendar pick)
      handleChange({ target: { name, value: parsed.toDate() } });
    } else {
      console.warn("Invalid date format entered:", manualInput);
      // Optional: add custom invalid-date handling here
    }
  };

  return (
    <div className={respclass} style={{ position: "relative" }}>
      <div className={removeFormGroupClass ? "" : "form-group"}>
        <Calendar
          inputId={id}
          showIcon
          placeholder={placeholder || "DD/MM/YYYY"}
          className={className}
          dateFormat={primeDateFormat} // PrimeReact format (not moment)
          view={viewDate || "date"}
          value={value && String(value) !== "Invalid Date" ? value : null}
          name={name}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disable}
          onChange={handleChange}
          onSelect={handleSelect}
          inputClassName={inputClassName}
          tabIndex={tabIndex || "-1"}
          onInput={handleManualInput}
        />

        {lable && (
          <label
            htmlFor={id}
            className="labelPicker lable truncate"
            style={{ fontSize: "5px !important" }}
          >
            {lable}
          </label>
        )}
      </div>
    </div>
  );
}

export default DatePicker;



// import React from "react";
// import { Calendar } from "primereact/calendar";


// function DatePicker({
//   name,
//   className,
//   respclass,
//   id,
//   placeholder,
//   lable,
//   value,
//   handleChange,
//   tabIndex,
//   inputClassName,
//   removeFormGroupClass,
//   maxDate,
//   minDate,
//   disable,
//   viewDate,
//   dateFormat,
//   handleSelect
// }) {
//   // Handle manual input
//   const handleManualInput = (e) => {
//     const newValue = e.target.value;
//     handleChange({ target: { name, value: newValue } }); 
//   };
//   // const handleChange = (e) => {
//   //   console.log(e.target.value);
//   //   const newValue = e.target.value;
//   //   handleChange({ target: { name, value: newValue } });
//   // };
  
//   return (
//     <div className={respclass} style={{ position: "relative" }}>
//       <div className={removeFormGroupClass ? "" : "form-group"}>

//         <Calendar
//           inputId={id}
//           showIcon
//           placeholder={placeholder}
//           className={className}
//           dateFormat={dateFormat ? dateFormat : "dd-M-yy"}
//           view={viewDate ? viewDate : "date"}
//           value={(value && String(value)!=="Invalid Date") ? value : null}
//           name={name}
//           maxDate={maxDate}
//           minDate={minDate}
//           disabled={disable}
//           onChange={handleChange}
//           onBlur={handleManualInput} 
//           wrapperclassname="datepicker"
//           inputClassName={inputClassName}
//           tabIndex={tabIndex ? tabIndex : "-1"}
//           onSelect={handleSelect} 
//         />
        
//         {lable && ( 
//           <label
//             htmlFor={id}
//             className="labelPicker lable truncate"
//             style={{ fontSize: "5px !important" }}
//           >
//             {lable}
//           </label>
//         )}
//       </div>
//     </div>
//   );
// }

// export default DatePicker;
