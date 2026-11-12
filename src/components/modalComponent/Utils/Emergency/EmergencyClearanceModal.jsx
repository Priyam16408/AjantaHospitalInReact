import React from 'react'

const EmergencyClearanceModal = ({name}) => {
    return (
        <>
            <div className="row">
                <div className="col-sm-12 text-center">
                    <div>
                        <label className="text-danger bold"> Are you Sure!</label>
                    </div>
                    <label> {name}</label>
                </div>
            </div>
        </>
    )
}

export default EmergencyClearanceModal
