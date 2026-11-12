import React, { useEffect } from 'react'

export default function CustomCheckboxHeading({ setValues, respclass, data,setList,index,list }) {

    const [value, setValue] = React.useState({});
    useEffect(() => {
        setValue(data)
    }, [data])
    const handleChange = (e, ind, type) => {
        let updatedData = JSON.parse(JSON.stringify(data?.type === "single" ? data?.options : value?.options));
        if (type === "checkbox") {
            updatedData[ind]["value"] = e?.target?.checked;
        }else{
            updatedData[ind]["inputValue"] = e?.target?.value;
        }
        setValue((val) => ({ ...val, options: updatedData }));
        let obj = {}
        obj.name = data?.name
        obj.label = data?.label
        obj.options = updatedData
        setValues((val) => ({ ...val, [data?.name]: obj }));
        if(list?.length>0){
            const updatedList = JSON.parse(JSON.stringify(list));
            updatedList[index] = obj;
            setList(updatedList)
        }

        // setList((val) => ([...val, obj]));
    }

    return (
        <>
            <div className={`${respclass} mb-2`} style={{ border: "1px solid #e7e4e4", height: "40px", position: "relative", display: "flex", alignItems: "center", }}>
                <div className='tesy d-flex'>
                    <sapn className="font-weight-bold fs-11" style={{
                        position: 'absolute',
                        transform: 'translate(5%, -122%)',
                        fontSize: '11px'
                    }} >{data?.label}</sapn>

                    {value?.options?.map((option, optIdx) => (
                        <div className="form-check mr-2 ml-2 d-flex" key={optIdx} style={{ flex: "auto" }}>
                            <input
                                className="form-check-input table-checkbox"
                                type="checkbox"
                                name={`${data?.name}_${option?.label}`}
                                id={`${data?.name}_${option?.label}`}
                                checked={option?.value}
                                onChange={(e) =>
                                    handleChange(e, optIdx, "checkbox")
                                }
                            />
                            <label
                                className="form-check-label ml-1"
                                htmlFor={`${data?.name}_${option?.label}`}
                            >
                                {option?.label}
                            </label>
                            {/* data.name}_${option?.label */}
                            {(option?.type === "textbox" && option?.value) && <input type="text" onChange={(e) => handleChange(e, optIdx, "textbox")} name={`${data.name}_${option?.label}`} id={`${data.name}_${option?.label + optIdx}`} placeholder={`${option?.name}`} value={option?.inputValue} className="form-control ml-1" style={{ width: "100px", marginRight: "2px" }} />}
                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}
