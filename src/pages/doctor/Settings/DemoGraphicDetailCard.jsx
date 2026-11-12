import React from 'react'

const DemoGraphicDetailCard = ({patientDetail}) => {
  return (
    <>
    <div
                  className="full-width-box"
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    marginTop: "10px",
                    // minHeight: "150px",
                    width: "100%",
                    borderRadius: "10px",
                    marginLeft: "10px",
                  }}
                >
                  <h5
                    style={{
                      display: "inline-flex",
                      position: "relative",
                      top: "-20px",
                      background: "#fff",
                      fontSize: "15px !important",
                      fontWeight: "bold",
                      color: "#000",
                      margin: "0",
                      left: "6px",
                    }}
                  >
                    Demograpahic Detail
                  </h5>
          <div className="row">
                    {/* {details.map((item)=>{
                    return(
                      <> */}
                    <div className="col-xl-6 col-md-4 col-sm-4 col-12 mb-2">
                      <div className="demoRight">
                        <h6 className="m-0 ">UHID:</h6>
                        <p className="m-0">{patientDetail?.PatientID}</p>
                      </div>
                      <div className="demoRight">
                        <h6 className="m-0 ">Patient Name:</h6>
                        <p className="m-0">{patientDetail?.Pname}</p>
                      </div>
                      <div className="demoRight">
                        <h6 className="m-0 ">Age/Sex:</h6>
                        <p className="m-0">{`${patientDetail?.Age}/${patientDetail?.Sex}`}</p>
                      </div>
                      <div className="demoRight">
                        <h6 className="m-0 ">Ph No:</h6>
                        <p className="m-0">{patientDetail?.ContactNo}</p>
                      </div>
                      <div className="demoRight">
                        <h6 className="m-0 ">Address:</h6>
                        <p className="m-0">{"N/A"}</p>
                      </div>
                    </div>
                    <div className="col-xl-6 col-md-4 col-sm-4 col-12 mb-2">
                      <div className="demoRight">
                        <h6 className="m-0 ">Panel:</h6>
                        <p className="m-0">{patientDetail?.PanelName}</p>
                      </div>
                      <div className="demoRight">
                        <h6 className="m-0 ">Bill No:</h6>
                        <p className="m-0">{"N/A"}</p>
                      </div>
                      <div className="demoRight">
                        <h6 className="m-0 ">Doctor:</h6>
                        <p className="m-0">{patientDetail?.DName}</p>
                      </div>
                      <div className="demoRight">
                        <h6 className="m-0 ">Department:</h6>
                        <p className="m-0">{"N/A"}</p>
                      </div>
                      <div className="demoRight">
                        <h6 className="m-0 ">Visit Date:</h6>
                        <p className="m-0">{patientDetail?.AppointmentDate}</p>
                      </div>
                    </div>

                    {/* </>
                    )
                  })} */}
                  </div>
                  </div>
    </>
  )
}

export default DemoGraphicDetailCard