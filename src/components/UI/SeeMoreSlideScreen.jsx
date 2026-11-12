import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { PageIconSVG } from "../SvgIcons";
const SeeMoreSlideScreen = ({
  name,
  seeMore,
  handleChangeComponent,
  data,
  handleBindFrameMenu,
  openFirstItem,
  isRemoveSvg,
  minWidth,
}) => {
  const [t] = useTranslation();
  const [show, setShow] = useState(false);
  const [filterData, setFilterData] = useState(seeMore);
  const [isOpenFromBottom, setIsOpenFromBottom] = useState(true); // To toggle top/bottom positioning
  const [horizontalAlignment, setHorizontalAlignment] = useState("left"); // Manage horizontal positioning
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
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

  const handleSearch = (e) => {
    const { value } = e.target;
    const filterResponse = seeMore.filter((item) =>
      item?.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilterData(filterResponse);
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
  const handleManageAvoidDropdown = () => {
    if (openFirstItem === false) {
      let data = filterData?.map((items) => ({
        label: items?.name,
        value: items?.name,
        component: items?.component,
        ...items,
      }));
      if (data?.length > 0 && show) {
        handleChangeComponent(data[0]);
        setShow(false);
      }
    }
  };

  // Render the card in a portal, so it's not limited by the table row width
  const renderCard = () => {
    if (!show) return null;

    // Get the button's position in the window
    const buttonRect = buttonRef.current.getBoundingClientRect();

    // Define horizontal positioning based on available space
    let horizontalPosition;
    // debugger

    if (buttonRect.left > 150)
      horizontalPosition = `${buttonRect.left - 150 + buttonRect.width / 2}px`; // Centered
    else horizontalPosition = `${buttonRect.left}px`;

    if (minWidth && filterData?.length > 10) {
      horizontalPosition = "912.5px";
    }

    return ReactDOM.createPortal(
      <div
        ref={cardRef}
        className="children-data"
        style={{
          position: "absolute",
          backgroundColor: "white",
          borderRadius: "5px",
          zIndex: 999,
          minWidth: minWidth ? minWidth : "300px", // Ensure the card is wider than the button
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
        <div
          style={{ position: "sticky", top: 0, backgroundColor: "white" }}
          className="p-1"
        >
          <input
            type="text"
            placeholder={t("Search by name")}
            ref={inputRef}
            onChange={handleSearch}
            className="form-control "
          />
        </div>

        {/* Card content */}
        {/* flex-wrap  Removed class from here because data is not splitting 10-10 formate */}
        <div className="d-flex   p-1">
          {handleOPtion(filterData)?.map((columns, i) => {
            return (
              <div className="mx-2" key={i}>
                {columns?.map((item, index) => {
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
                        handleChangeComponent(item);
                      }}
                    >
                      <i className="fas fa-tachometer-alt nav-icon mr-2" />
                      {t(item?.label)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>,
      document.body // Render directly in the body of the document
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
        <span className="p-2" style={{fontWeight: "bold"}}>{name}</span>

        {!isRemoveSvg && <PageIconSVG />}
      </div>

      {/* Render the card */}
      {openFirstItem !== false && renderCard()}
      {handleManageAvoidDropdown()}
    </div>
  );
};

export default SeeMoreSlideScreen;
