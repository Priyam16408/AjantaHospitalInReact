import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../index";

const index = (props) => {
  const { thead, tbody } = props;
  const [t] = useTranslation();

  console.log(tbody);

  return (
    <>
      <Tables
        thead={thead}
        tbody={tbody.map((ele, index) => ({
          SrNo: index + 1,
          PackageName: ele?.PackageName,
          FromDate: ele?.FromDate,
          ToDate: ele?.ToDate,
          Name: ele?.Name,
        }))}
      />
    </>
  );
};

export default index;
