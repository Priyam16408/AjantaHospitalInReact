import React from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";

const PaymentControl = () => {
  const [t] = useTranslation();
  return (
    <>
      <div className="paymentControl">
        <div className="container-fluid">
          <div style={{ backgroundColor: "#f9f9f9" }}>
            <div className="container-fluid">
              <div className="row">
                <div className="col-6">
                  <div className="main-table-container">
                    <div className="pymentMode mb-2">
                      <div className="col-3">
                        <div className="input-container">
                          <ReactSelect
                            placeholderName={t(
                              "FrontOffice.OPD.Confirmation.label.Bill"
                            )}
                            id={"Title"}
                            searchable={true}
                            // respclass="col-xl-2.5 col-md-3 col-sm-4 col-12 input-text"
                          />
                          {/* <select className="input-text">
                            <option>-- Payment Mode --</option>
                            <option value="">Cash</option>
                            <option value="">Cheque</option>
                            <option value="">Credit</option>
                            <option value="">Paytm</option>
                          </select> */}
                        </div>
                      </div>
                      <div className="col-4">
                        <p
                          className="m-0"
                          style={{
                            fontSize: "14px",
                            color: "red",
                            fontWeight: 700,
                            textAlign: "center",
                          }}
                          // style={{ fontSize: "12px", color: "#30dfb4" }}
                        >
                          Factor :1 INR = 1 INR
                        </p>
                      </div>
                      <div className="col-3">
                        <div className="input-container">
                        <ReactSelect
                            placeholderName={t(
                              "FrontOffice.OPD.Confirmation.label.Bill"
                            )}
                            id={"Title"}
                            searchable={true}
                            // respclass="col-xl-2.5 col-md-3 col-sm-4 col-12 input-text"
                          />
                        </div>
                      </div>
                    </div>
                    <table
                      className="table table-striped tablwe-responsive"
                      style={{
                        fontSize: "11px",
                        borderSpacing: "0",
                        borderCollapse: "separate",
                      }}
                    >
                      <thead>
                        <tr>
                          <th>Payment Mode</th>
                          <th>Paid Amount </th>

                          <th>Bank Name </th>
                          <th>Ref No. </th>
                          <th>Machine </th>
                          <th>Base</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Cash</td>
                          <td>₹ 1500</td>
                          <td>
                          <ReactSelect
                            placeholderName={t(
                              "FrontOffice.OPD.Confirmation.label.Bill"
                            )}
                            id={"Title"}
                            searchable={true}
                            // respclass="col-xl-2.5 col-md-3 col-sm-4 col-12 input-text"
                          />
                          </td>
                          <td>
                            {" "}
                            <input
                              type="text"
                              name=""
                              id=""
                              className=""
                              placeholder="₹ 0.00"
                            />
                          </td>
                          <td>
                          <ReactSelect
                            placeholderName={t(
                              "FrontOffice.OPD.Confirmation.label.Bill"
                            )}
                            id={"Title"}
                            searchable={true}
                            // respclass="col-xl-2.5 col-md-3 col-sm-4 col-12 input-text"
                          />
                          </td>
                          <td>₹ 1500</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-2">
                  <div className="formsec1">
                    <label htmlFor="">Gross Amount</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    />
                  </div>
                  <div className="formsec1">
                    {/* <input type="checkbox" /> */}
                    <label htmlFor="">Co-Payment Amt.</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    />
                  </div>
                  <div className="formsec1">
                    {/* <input type="checkbox" /> */}
                    <label htmlFor="">Co-Payment %</label>
                    {/* <input type="text" name="" id="" className="form-control" /> */}
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="₹ 0.00"
                        // className="plusInput"
                        // placeholder="Recipient's username"
                      />
                      {/* <span className="input-group-text" id="basic-addon2">
                        <AiOutlinePlus className="plusIcon" />
                      </span> */}
                    </div>
                  </div>
                  <div className="formsec1">
                    {/* <input type="checkbox" /> */}
                    <label htmlFor="">Paid Amount</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    />
                  </div>
                  <div className="formsec1">
                    {/* <input type="checkbox" /> */}
                    <label htmlFor="">Discount Reason</label>
                    <div
                      className="input-container"
                      style={{ marginLeft: "auto",width:"45%"  }}
                    >
                    <ReactSelect
                            placeholderName={t(
                              "FrontOffice.OPD.Confirmation.label.Bill"
                            )}
                            id={"Title"}
                            searchable={true}
                            // respclass="col-xl-2.5 col-md-3 col-sm-4 col-12 input-text"
                          />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <div className="formsec1">
                    <label htmlFor="">Discount</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    />
                  </div>
                  <div className="formsec1">
                    <label htmlFor="">Discount (%)</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    />
                  </div>
                  <div className="formsec1">
                    <label htmlFor="">Round Off</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    />
                  </div>

                  <div className="formsec1">
                    <label htmlFor="">Tax Amount</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    />
                  </div>
                  <div className="formsec1">
                    <label htmlFor="">Approved By</label>
                    <div
                      className="input-container"
                      style={{ marginLeft: "auto", width:"45%" }}
                    >
                      <ReactSelect
                            placeholderName={t(
                              "FrontOffice.OPD.Confirmation.label.Bill"
                            )}
                            id={"Title"}
                            searchable={true}
                            // respclass="col-xl-2.5 col-md-3 col-sm-4 col-12 input-text"
                          />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <div className="formsec1">
                    <label htmlFor="">Net Amount</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    />
                  </div>
                  <div className="formsec1">
                    <label htmlFor="">Patient Payable</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    />
                  </div>
                  <div className="formsec1">
                    <label htmlFor="">Panel Payable</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    />
                  </div>

                  <div className="formsec1">
                    <label htmlFor="">Balance</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    />
                  </div>
                  <div className="formsec1">
                    <button className="button">Make Bill</button>
                    {/* <label htmlFor="">Net Amount</label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="form-control"
                      placeholder="₹ 0.00"
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentControl;
