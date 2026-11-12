import Tables from "..";
import { ROUNDOFF_VALUE } from "../../../../utils/constant";
import Input from "../../../formComponent/Input";
import { useTranslation } from "react-i18next";
// Component code...

const SurgeryDepartmentDetailsTable = ({
  THEAD,
  tbody,
  handleIndexChange,
  handleDelete,
  payload
}) => {
  const [t]=useTranslation();
  console.log(tbody,"item111111");
  console.log("firstpayload?.RateOn?.value",payload?.RateOn?.value)
  return (
    <div style={{ width: "100%" }}>
      <Tables
        thead={THEAD}
        tbody={tbody?.map((item, index) => {
          return {
            "SNo,": index + 1,
            "CPT Code": item?.rateListID,
            "Surgery Name  ": item?.SurgeryName,
            Department: item?.Department,
            Remarks: (
              <Input
                className="table-input"
                name="Remarks"
                removeFormGroupClass={true}
                type="text"
                onChange={(e) =>
                  handleIndexChange(index, "Remarks", e.target.value, item)
                }
                value={item?.Remarks}
              />
            ),
            
            Rate: (
             payload?.RateOn?.value === "2" ?
           <Input
                className="table-input"
                name="surgeonCharge"
                removeFormGroupClass={true}
                type="number"
                onChange={(e) =>
                  handleIndexChange(
                    index,
                    "surgeonCharge",
                    e.target.value,
                    item
                  )
                }
                // value={payload?.RateOn?.value === "2" ? item?.SurgeonCharge : item?.DocCharge}  
                value={item?.surgeonCharge}
              />
               :
                <Input
                className="table-input"
                name="DocCharge"
                removeFormGroupClass={true}
                type="number"
                onChange={(e) =>
                  handleIndexChange(
                    index,
                    "DocCharge",
                    e.target.value,
                    item
                  )
                }
                value={item?.DocCharge}
                // value={item?.surgeonCharge}
              />
             
            ),
            "Reduce(%)": (
              <Input
                className="table-input"
                removeFormGroupClass={true}
                name="Reduce"
                type="number"
                onChange={(e) =>
                  handleIndexChange(index, "Reduce", e.target.value, item)
                }
                value={item?.Reduce}
              />
            ),
            "New Rate":
              item?.surgeonCharge && item?.Reduce
                ? item.surgeonCharge - item.surgeonCharge * (item.Reduce / 100)
                : item?.surgeonCharge,

            Remove: (
              <button
                onClick={() => handleDelete(item, index)}
                className="btn btn-sm btn-danger"
              >
                {t("Delete")}
              </button>
            ),
          };
        })}
        tableHeight={"tableHeight"}
        style={{ maxHeight: "120px" }}
      />
    </div>
  );
};

export default SurgeryDepartmentDetailsTable;
