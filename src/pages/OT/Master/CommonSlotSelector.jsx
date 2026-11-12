import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import DatePicker from "../../../components/formComponent/DatePicker";
import { notify } from "../../../utils/utils";

const CommonSlotSelector = ({
  reactSelectType,
  data = {},
  onSetValues = () => { },
  fetchSlotsAPI,
  dayOptions = [],
  slotDisplayMap = {},
  slotClassMap = {},
  setModalData,
  isSingleOt
}) => {
  const [t] = useTranslation();

  const [modalValues, setModalValues] = useState({ ...data });
  const [otSlots, setOtSlots] = useState(data?.OTs || [])

  const defaultSlotClassMap = {
    Available: "slot-available",
    Booked: "slot-booked",
    "Not Available": "slot-not-available",
    Confirmed: "slot-confirmed",
    Selected: "slot-selected",
    ...slotClassMap,
  };

  const handleSelectedSlotClass = (item) => {
    
    return defaultSlotClassMap[item?.status]
  }

  const handleDaySelect = async (label, value) => {
    setModalValues((val) => ({ ...val, [label]: value }));
    onSetValues((val) => ({ ...val, [label]: value }));

    if (fetchSlotsAPI && typeof fetchSlotsAPI === "function") {
      const newOTs = await fetchSlotsAPI(value?.value, data?.DoctorName?.value);
      if (newOTs) {
        setOtSlots(newOTs);
        setModalData((val) => ({ ...val, modalData: newOTs }));
      }
    }
  };

  const onSelectSlot = (slot, ot, type) => {
    const newOtSlots = JSON.parse(JSON.stringify(otSlots));
    const index = newOtSlots.findIndex((o) => o.otid === ot.otid)

    // check if slot is already selected 
    if (index !== -1) {
      if (newOtSlots[index]["slots"][slot?.index]?.status === "Selected") {
        // condition to check if slot is not allowed to remove
        if (newOtSlots[index]["slots"][slot?.index - 1]?.status === "Selected" && newOtSlots[index]["slots"][slot?.index + 1]?.status === "Selected") {
          notify("Slot Not Allowed To Remove !", "error")
        } else {
          newOtSlots[index]["slots"][slot?.index] = { ...newOtSlots[index]["slots"][slot?.index], status: "Available" }
        }
      } else {

        const firstSelectedIndex = ot?.slots?.findIndex((s) => s.status === "Selected")

        // This COndition for only select slot from single OT floor 
        if (isSingleOt) {
          let data = otSlots?.find((val) => {
            if (val?.slots?.find((s) => s.status === "Selected")) {
              return val
            }
          })
          if (data?.otid && data?.otid !== ot?.otid) {
            notify("Invalid Slot Selection !", "error")
            return 0
          }
        }

        // Check first time slot selection
        if (firstSelectedIndex === -1) {
          newOtSlots[index]["slots"][slot?.index] = { ...newOtSlots[index]["slots"][slot?.index], status: "Selected", }
        } else {
          // logic to select multiple slots as per the first selected slot to last selected slot 
          const start = slot?.index > firstSelectedIndex ? firstSelectedIndex : slot?.index
          const end = slot?.index > firstSelectedIndex ? slot?.index : firstSelectedIndex
          let isSelected = false
          for (let i = start; i <= end; i++) {
            if (ot?.slots[i]?.status !== "Available" && ot?.slots[i]?.status !== "Selected") {
              isSelected = true
            }
          }
          if (isSelected) {
            notify("Invalid Slot Selection !", "error")
          } else {
            for (let i = start; i <= end; i++) {
              newOtSlots[index]["slots"][i] = { ...newOtSlots[index]["slots"][i], status: "Selected" }
            }
          }
        }
      }
    }
    setOtSlots(newOtSlots);
    setModalData((val) => ({ ...val, modalData: newOtSlots }));
  }
  return (
    <div className="row">
      {reactSelectType === 1 ? (
        <ReactSelect
          requiredClassName="required-fields"
          placeholderName={t("OT Day")}
          name="SelectDay"
          value={modalValues?.SelectDay?.value || ""}
          handleChange={(name, e) => handleDaySelect(name, e)}
          dynamicOptions={dayOptions}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
      ) : (
        <DatePicker
          className="custom-calendar"
          placeholder=""
          lable="OTDate"
          name="OTDate"
          id="OTDate"
          value={modalValues?.OTDate}
          showTime
          hourFormat="12"
          handleChange={(name, e) => handleDaySelect(name, e)}
        />
      )}

      <div className="d-flex flex-wrap">
        {Object.entries(slotDisplayMap).map(([status, label]) => (
          <div key={status} className="d-flex align-items-center mx-2">
            <ColorCodingSearch label={t(status)} color={label} />
          </div>
        ))}
      </div>

      <div className="slot-container">
        {otSlots?.map((ot) => (
          <div key={ot.otid} className="ot-section">
            <h3 className="ot-name">{ot.otName}</h3>
            <div className="row" style={{ gap: "5px", marginBottom: "9px" }}>
              {ot?.slots?.length > 0 ? (
                ot?.slots?.map((slot, index) => {
                  const isAvailable = slot.status === "Available" || slot.status === "Selected";
                  return (
                    <div
                      key={index}
                      className={`slot-box ${handleSelectedSlotClass(slot)}`}
                      onClick={isAvailable ? () => onSelectSlot(slot, ot, "singleClick") : undefined
                      }
                      // onDoubleClick={
                      //   isAvailable
                      //     ? () => onSelectSlot(slot, ot, "doubleClick")
                      //     : undefined
                      // }
                      title={`${slot.startDisplayTime} - ${slot.endDisplayTime}`}
                      style={{
                        cursor: isAvailable ? "pointer" : "not-allowed",
                        opacity: isAvailable ? 1 : 0.6,
                      }}
                    >
                      <div className="slot-pill-time">
                        {slot.startDisplayTime} - {slot.endDisplayTime}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="blink-red" style={{ color: "red" }}>
                  {t("No Slots Available")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommonSlotSelector;
