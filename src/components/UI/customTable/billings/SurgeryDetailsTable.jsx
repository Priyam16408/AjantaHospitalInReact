import React, { useEffect } from "react";
import Tables from "..";
import Input from "../../../formComponent/Input";
import CustomSelect from "../../../formComponent/CustomSelect";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { GetBindAllDoctorConfirmation } from "../../../../store/reducers/common/CommonExportFunction";

const SurgeryDetailsTable = ({
  THEAD,
  tbody,
  handleCustomSelect,
  handleItemsChange,
  handleSelect,
}) => {
  const dispatch = useDispatch();
  const { GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );

  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
      })
    );
  }, [dispatch]);
  console.log("tbody", tbody);
  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody?.map((item, index) => {
          return {
            Select: (
              <input
                type="checkbox"
                name="IsChecked"
                checked={item.IsChecked}
                onChange={(e) => handleSelect(e, index, item)}
              />
            ),
            "SNo,": index + 1,
            Type: item?.Type,
            Doctor:
              item?.Type_ID === 3 ? (
                ""
              ) : (
                <>
                  <CustomSelect
                    option={[
                      ...GetBindAllDoctorConfirmationData.map((item) => {
                        return {
                          label: item?.Name,
                          value: item?.DoctorID,
                        };
                      }),
                    ]}
                    placeHolder="Select Doctor"
                    value={item?.Doctor}
                    onChange={(name, e) => handleCustomSelect(index, name, e)}
                    name="Doctor"
                    isDisable={!item?.IsChecked}
                  />
                  {console.log("item?.Doctor", item)}
                </>
              ),

            "Charges (%)": (
              <Input
                className="table-input"
                name="DoctorChargePer"
                removeFormGroupClass={true}
                type="number"
                onChange={(e) =>
                  handleItemsChange(
                    index,
                    "DoctorChargePer",
                    e.target.value,
                    item
                  )
                }
                value={item?.DoctorChargePer}
                disabled={item?.IsChecked == true ? false : true}
              />
            ),
            "Charges (Amount)": (
              <Input
                className="table-input"
                name="chargeAmt"
                removeFormGroupClass={true}
                type="number"
                onChange={(e) =>
                  handleItemsChange(index, "chargeAmt", e.target.value, item)
                }
                value={item?.chargeAmt}
                disabled={true}
                // disabled={item?.IsChecked == true ? false : true}
              />
            ),
            "Discount (%)": (
              <Input
                className="table-input"
                name="DiscountPer"
                removeFormGroupClass={true}
                type="number"
                onChange={(e) =>
                  handleItemsChange(index, "DiscountPer", e.target.value, item)
                }
                value={item?.DiscountPer}
                disabled={item?.IsChecked == true ? false : true}
              />
            ),
            "Discount (Amount)": (
              <Input
                className="table-input"
                name="DiscountAmt"
                removeFormGroupClass={true}
                type="number"
                onChange={(e) =>
                  handleItemsChange(index, "DiscountAmt", e.target.value, item)
                }
                value={item?.DiscountAmt}
                disabled={item?.IsChecked == true ? false : true}
              />
            ),
            "Net Amount": item?.NetAmt ? item?.NetAmt : "0.00",
            "Panel Non-Payable": item?.isPayable === 0 ? "Yes" : "No",
            "Panel Co-Payment": item?.CoPayment ? item?.CoPayment : "0.0000",
          };
        })}
        tableHeight={"tableHeight"}
        style={{ maxHeight: "120px" }}
      />
    </>
  );
};

export default SurgeryDetailsTable;
