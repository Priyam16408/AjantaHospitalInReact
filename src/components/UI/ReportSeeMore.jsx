import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ReprintSVG } from "../SvgIcons";
import {
  CurrentStockDischargeSlip,
  CurrentStockGeneralConsertForm,
  CurrentStockSelfDeclaration,
  IPDAdmissionReport,
  IPDPrintSticker,
} from "../../networkServices/BillingsApi";
import { RedirectURL } from "../../networkServices/PDFURL";
import { useTranslation } from "react-i18next";

const ReportSeeMore = ({
  name,
  seeMore,
  handleChangeComponent,
  data,
  handleBindFrameMenu,
}) => {
   const [t] = useTranslation();
  const [show, setShow] = useState(false);
  const [filterData, setFilterData] = useState(seeMore);
  const [isOpenFromBottom, setIsOpenFromBottom] = useState(true); // To toggle top/bottom positioning
  const [horizontalAlignment, setHorizontalAlignment] = useState("left"); // Manage horizontal positioning
  const cardRef = useRef(null);
  const buttonRef = useRef(null); // Ref for the button
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOPtion = (options) => {
    const response = options.map((items) => {
      return {
        label: items?.name,
        value: items?.name,
        component: items?.component,
        ...items,
      };
    });

    const columns = [];
    for (let i = 0; i < response.length; i += 10) {
      const chunk = response.slice(i, i + 10);
      columns.push(chunk);
    }

    return columns;
  };

  const handleToggleCard = async () => {
    handleBindFrameMenu && handleBindFrameMenu(data);
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const spaceBelow = windowHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const spaceLeft = buttonRect.left;
    const spaceRight = windowWidth - buttonRect.right;

    // Check if there's more space below or above and set position accordingly
    if (spaceBelow > 250) {
      setIsOpenFromBottom(true); // Open from bottom
    } else if (spaceAbove > 200) {
      setIsOpenFromBottom(false); // Open from top
    }

    // Check available space on the left and right and set horizontal alignment
    if (spaceRight > 300) {
      setHorizontalAlignment("left"); // Align to the left
    } else if (spaceLeft > 300) {
      setHorizontalAlignment("right"); // Align to the right
    } else {
      setHorizontalAlignment("center"); // Center if not enough space on either side
    }

    setShow(!show);
  };

  const handleOpenPrint = async (type) => {
    try {
      debugger
      console.log("first data", type);
      if (type?.reportType === "Reprint IPD Admission") {
        const reportResp = await IPDAdmissionReport(
          Number(data?.transactionID),
          2
        );
        if (reportResp?.success) {
          RedirectURL(reportResp?.data?.pdfUrl);
        } else {
          notify(reportResp?.data?.message, "error");
        }
      }
      else if (type?.reportType === "Stickers") {
        let payload ={
           "transactionID":Number(data?.transactionID)
        }
        const StickerResp = await IPDPrintSticker(payload);
        if (StickerResp?.success) {
          RedirectURL(StickerResp?.data?.pdfUrl);
        } else {
          notify(StickerResp?.data?.message, "error");
        }
      }
      else if (type?.reportType === "General Consent Form") {
        let payload ={
           "transactionID":Number(data?.transactionID)
        }
        const consentForm = await CurrentStockGeneralConsertForm(payload);
        if (consentForm?.success) {
          RedirectURL(consentForm?.data?.pdfUrl);
        } else {
          notify(consentForm?.data?.message, "error");
        }
      }
      else if (type?.reportType === "Self Declaration") {
        let payload ={
           "transactionID":Number(data?.transactionID)
        }
        const selfDeclaration = await CurrentStockSelfDeclaration(payload);
        if (selfDeclaration?.success) {
          RedirectURL(selfDeclaration?.data?.pdfUrl);
        } else {
          notify(selfDeclaration?.data?.message, "error");
        }
      }
      else if (type?.reportType === "Discharge Slip") {
        let payload ={
           "transactionID":Number(data?.transactionID)
        }
        const dischargeSlip = await CurrentStockDischargeSlip(payload);
        if (dischargeSlip?.success) {
          RedirectURL(dischargeSlip?.data?.pdfUrl);
        } else {
          notify(dischargeSlip?.data?.message, "error");
        }
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  // Focus input when the dropdown is shown
  useEffect(() => {
    if (show) {
      inputRef.current?.focus();
    }
  }, [show]);

  useEffect(() => {
    setFilterData(seeMore);
  }, [seeMore]);
  const reportType = [
    { name:` ${t("Reprint IPD Admission")}`, reportType:"Reprint IPD Admission" },
    { name: `${t("General Consent Form")}` ,reportType:"General Consent Form"},
    { name: `${t("Self Declaration")}`,reportType:"Self Declaration" },
    { name: `${t("Discharge Slip")}`,reportType:"Discharge Slip" },
    { name: `${t("Stickers")}`,reportType:"Stickers" },

    // { name: "PDF" },
  ];
  const renderCard = () => {
    if (!show) return null;

    // Get the button's position in the window
    const buttonRect = buttonRef.current.getBoundingClientRect();

    // Define horizontal positioning based on available space
    let horizontalPosition;

    if (buttonRect.left > 150)
      horizontalPosition = `${buttonRect.left - 110 + buttonRect.width / 2}px`; // Centered
    else horizontalPosition = `${buttonRect.left}px`;

    return ReactDOM.createPortal(
      <div
        ref={cardRef}
        className="children-data"
        style={{
          position: "absolute",
          backgroundColor: "white",
          borderRadius: "5px",
          zIndex: 999,
          minWidth: "200px", // Ensure the card is wider than the button
          maxWidth: "500px", // Set maximum width
          maxHeight: "90%", // Ensure it doesn’t overflow the screen
          overflow: "auto",
          border: "1px solid grey",
          left: horizontalPosition, // Dynamic horizontal alignment
          top: isOpenFromBottom ? `${buttonRect.bottom + 5}px` : "auto", // Position below button
          bottom: isOpenFromBottom
            ? "auto"
            : `${window.innerHeight - buttonRect.top + 5}px`, // Position above button
          transition: "top 0.3s ease, bottom 0.3s ease, left 0.3s ease", // Smooth transition
        }}
      >
        {/* Card content */}
        <div className="d-flex flex-wrap p-1">
          <div className="mx-2">
            {reportType?.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{
                    color: "black",
                    padding: "1px",
                    cursor: "pointer",
                    margin: "1px",
                    maxWidth: "fit-content",
                  }}
                  onClick={() => {
                    setShow(false);
                    handleOpenPrint(item);
                  }}
                >
                  <ReprintSVG />
                  <span className="ml-3">{item?.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div ref={buttonRef}>
      {/* Trigger button */}
      <div
        className="header p-1"
        style={{ cursor: "pointer" }}
        onClick={handleToggleCard}
      >
        {name}
        <ReprintSVG />
      </div>

      {/* Render the card */}
      {renderCard()}
    </div>
  );
};

export default ReportSeeMore;
