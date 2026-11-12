import React from "react";
import Tables from "..";
import Input from "../../../formComponent/Input";
import Heading from "../../Heading";
import moment from "moment";
import { number } from "../../../../utils/constant";

const ConsignmentReturnTable = ({
    thead,
    tbody,
    handleChangeindex,
    handleChangeCheckbox,
    handleChangeindexString,
}) => {
    return (
        <>
            <div className="row">
                <div className="col-sm-12">
                    <Heading title={"Item Details"} />
                    <Tables
                        thead={thead}
                        tbody={tbody?.map((ele, index) => ({
                            SrNo: index + 1,
                            Select: (
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        handleChangeCheckbox(e, ele, index);
                                    }}
                                    checked={ele?.isChecked ? ele?.isChecked : false}
                                />
                            ),
                            ConsignmentNo: ele?.ConsignmentNo,
                            PostDate: (
                                <div className="text-center">{moment(ele?.PostDate).format("DD-MMM-YYYY")}</div>
                            ),
                            MedExpDate: (
                                <div className="text-center">{moment(ele?.MedExpDate).format("DD-MMM-YYYY")}</div>
                            ), 
                            itemname: ele?.itemname,
                            InititalCount: ele?.InititalCount || "0.0",
                            ReleasedCount: ele?.ReleasedCount || "0.0",
                            ReturnedQuantity: ele?.ReturnedQuantity || "0.0",
                            BalanceQty: ele?.BalanceQty || "0.0",
                            ReturnQty: (
                                <Input
                                    className="table-input"
                                    name="ReturnQty"
                                    type="number"
                                    value={ele?.ReturnQty ?? "0.0"}
                                    onChange={(e) => handleChangeindex(e, index)}
                                    disabled={ele?.isChecked === true ? false : true}
                                />
                            ),
                            Reason: (
                                <Input
                                    className="table-input"
                                    name="Reason"
                                    type="text"
                                    value={ele?.Reason ?? ""}
                                    onChange={(e) => handleChangeindexString(e, index,"Reason")}
                                    disabled={ele?.isChecked === true ? false : true}
                                />
                            ),
                            GetPassNO: (
                                <Input
                                    className="table-input"
                                    name="GetPassNO"
                                    type="text"
                                    value={ele?.GetPassNO ?? ""}
                                    onChange={(e) => handleChangeindexString(e, index,"GetPassNO")}
                                    disabled={ele?.isChecked === true ? false : true}
                                />
                            ),
                        }))}
                        // tableHeight={"tableHeight"}
                        style={{ maxHeight: "162px" }}
                    />
                </div>
            </div>
        </>
    );
};

export default ConsignmentReturnTable;
