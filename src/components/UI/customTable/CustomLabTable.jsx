import React from "react";
import Table from "react-bootstrap/Table";
function CustomLabTable({ children}) {
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <Table className="mainTable pt-2 pl-2 pr-2 pb-2" bordered>
            {children}
          </Table>
        </div>
      </div>
    </div>
  );
}

export default CustomLabTable;