import React, { useEffect } from "react";
import { GetAuthorization } from "../../../networkServices/BillingsApi";

const DischargeIntimationModal = ({ item, handleChangeModel }) => {
  useEffect(() => {
    handleChangeModel(item);
  }, [item]);
  //console.log(item);
  return (
    <div className="row">
      <>
        <div className="col-sm-12 text-center">
          <div>
            <label className="text-danger bold"> Are you Sure!</label>
          </div>
          <label> You want {item?.Step} ?</label>
        </div>
      </>
    </div>
  );
};

export default DischargeIntimationModal;
