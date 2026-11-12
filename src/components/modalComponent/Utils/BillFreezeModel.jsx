import React from "react";

const BillFreezeModel = ({data}) => {
    console.log(data)
  return (
    <>
      <div className="row">
        <div className="col-sm-12 text-center">
          {/* <label className="" > */}
            <p className="text-danger bold" style={{fontSize:"50px !important"}}>

            You are about to Freez bill. after bill freez no further services or item can be added into the bill.
            </p>
          {/* </label> */}
        </div>
      </div>
    </>
  );
};

export default BillFreezeModel;
