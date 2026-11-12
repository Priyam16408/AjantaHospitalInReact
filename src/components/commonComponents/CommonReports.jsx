import React from 'react';
// import { updateReportField } from '../api';

const CommonReport = ({ fields }) => {
   
    const handleCheckboxChange=(e,data)=>{
        console.log(e,data);
        
    }
    return (
        <>
            <div
                style={{
                    maxHeight: "310px",
                    overflowY: "auto",
                }}

            >
                <ul
                    className="d-flex flex-wrap"
                    style={{ listStyle: "none", paddingLeft: 0, gap: "5px" }}
                >
                    {fields?.map((item, index) => (
                        <li
                            key={item.key}
                            className="d-flex align-items-center w-100"
                            style={{ gap: "5px" }}
                        >
                            {console.log(item)}
                            <input
                                type="checkbox"
                                className="theme-color background-theme-color doc-checkbox"
                                checked={item.value}
                                onChange={(e) => handleCheckboxChange(e, index)}
                            />
                            <label className="py-1 px-2 ml-1 rounded mb-0 theme-color background-theme-color">
                                {item?.key}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default CommonReport;
