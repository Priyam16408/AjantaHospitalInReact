import React from "react";
import Accordion from "../../../../components/UI/Accordion";
import PreOpInstruction from "../AccordianComponents/PreOpInstruction";
import { useTranslation } from "react-i18next";
import Heading from "../../../../components/UI/Heading";
import PlaneOfAnesthesia from "../AccordianComponents/PlaneOfAnesthesia";
import PreanestheticEvaluation from "../AccordianComponents/PreanestheticEvaluation";

const AnesthesiaNotes = ({ data }) => {
  const [t] = useTranslation();
  return (
    <>
      <div className="card mb-2">
        <Accordion
          title={t("PRE OP INSTRUCTIONS")}
          isBreadcrumb={false}
          defaultValue={true}
        >
          <PreOpInstruction data={data} />

        </Accordion>
      </div>
      <div className="card mb-2">
        <Accordion
          title={t("PREANESTHETIC EVALUATION (DEPT OF ANAESTHESIOLOGY & ICU)")}
          isBreadcrumb={false}
          defaultValue={true}
        >
          <PreanestheticEvaluation data={data} />
        </Accordion>
      </div >

      <div className="card mb-2">
        <Accordion
          title={t("PLAN OF ANESTHESIA")}
          isBreadcrumb={false}
          defaultValue={true}
        >
          <PlaneOfAnesthesia data={data} />
        </Accordion>
      </div >
    </>
  );
};

export default AnesthesiaNotes;
