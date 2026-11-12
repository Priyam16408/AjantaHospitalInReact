import React from 'react'

const PatientCleareance = () => {
  return (
    <>
      <div className="row">
        <div className="col-sm-1">
          <label>Naration: </label>
        </div>
        <div className="col-sm-11">
          <textarea className="w-100" />
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="col-sm-3">
          <button className="btn btn-sm btn-success">Patient Cleareance</button>
        </div>
      </div>
    </>
  )
}

export default PatientCleareance