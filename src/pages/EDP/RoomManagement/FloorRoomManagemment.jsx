import { Input } from '@profabric/react-components'
import React from 'react'

const FloorRoomManagemment = () => {

    const dynamicArray = Array.from({ length: 20 }, (v, i) => ({
        label: `${i + 1}`,
        value: `${i + 1}`,
    }));
    return (
        <>
            <div className="row p-2 w-200">
                <Input
                    lable={t("Floor Name")}
                    className="form-control required-fields"
                    id="addnew"
                    rows={4}
                    respclass="w-100"
                    name="addnew"
                    value={inputs?.addnew ? inputs?.addnew : ""}
                    onChange={handlechange}
                    maxLength={1000}
                />

                <ReactSelect
                    placeholderName={t("Sequence No.")}
                    searchable={true}
                    respclass="w-100"
                    id="Sequence No."
                    className="form-control required-fields"
                    name="Sequence No."
                    removeIsClearable={true}
                    dynamicOptions={dynamicArray}
                // handleChange={handleSelect}
                // value={values.Status?.value}
                />
            </div>
        </>
    )
}

export default FloorRoomManagemment