import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { DischargeSummaryBindHeader } from "../../../networkServices/dischargeSummaryAPI";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";

const DischargeSummarySetHeaderMandatory = () => {
  const [t] = useTranslation();
  const [dropDownState, setDropDownState] = useState({
    BindHeader: [],
  });

  const renderAPiDropDown = async () => {
    try {
      const [BindHeader] = await Promise.all([DischargeSummaryBindHeader()]);

      const reponse = {
        BindHeader: handleReactSelectDropDownOptions(
          BindHeader?.data,
          "HeaderName",
          "Header_Id"
        ),
      };

      setDropDownState(reponse);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    renderAPiDropDown();
  }, []);

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Set Header Mandatory")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t(
              "Discharge Type"
            )}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"Department"}
            name={"Department"}
            removeIsClearable={true}
            // handleChange={handleDischargeSummaryBindHeaderList}
            dynamicOptions={dropDownState?.BindHeader}
            // value={depatmentID}
          />

          <ReactSelect
            placeholderName={t("Header")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"Department"}
            name={"Department"}
            removeIsClearable={true}
            // handleChange={handleDischargeSummaryBindHeaderList}
            // dynamicOptions={handleDepartmentData(GetDepartmentList)}
            // value={depatmentID}
          />
        </div>
      </div>
    </div>
  );
};

export default DischargeSummarySetHeaderMandatory;
