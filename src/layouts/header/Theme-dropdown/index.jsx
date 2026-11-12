import { StyledDropdown } from "@app/styles/common";
import { Fragment, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { addWindowClass, removeWindowClass } from "@app/utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { useLocalStorage } from "@app/utils/hooks/useLocalStorage";
import { updateTheme } from "../../../networkServices/HeaderApi";
import { notify } from "../../../utils/utils";

const themes = [
  // {
  //     theme: 'blue_theme',
  //     icon: 'blue_icon',
  //     label: 'Blue',
  // },
  // {
  //     theme: 'green_theme',
  //     icon: 'green_icon',
  //     label: 'Green',
  // },
  // {
  //     theme: 'pink_theme',
  //     icon: 'pink_icon',
  //     label: 'Pink',
  // },

  {
    theme: "default_theme",
    icon: "default_icon",
    label: "Default",
  },
  // {
  //   theme: "light_green_theme",
  //   icon: "light_green_icon",
  //   label: "Lite Green",
  // },
  {
    theme: "peach_theme",
    icon: "peach_icon",
    label: "Peach",
  },
  {
    theme: "pale_pink_theme",
    icon: "pale_pink_icon",
    label: "Pale Pink",
  },
  {
    theme: "red_theme",
    icon: "red_icon",
    label: "Red",
  },
  {
    theme: "sky_blue_theme",
    icon: "sky_blue_icon",
    label: "Sky Blue",
  },
  {
    theme: "light_blue_theme",
    icon: "light_blue_icon",
    label: "Lite Blue",
  },
  {
    theme: "pink_theme",
    icon: "pink_icon",
    label: "Pink",
  },
  {
    theme: "purple_theme",
    icon: "purple_icon",
    label: "Purple",
  },
  {
    theme: "gray_theme",
    icon: "gray_icon",
    label: "Gray",
  },
  {
    theme: "pastel_pink_theme",
    icon: "pastel_pink_icon",
    label: "Pastel Pink",
  },
  {
    theme: "light_peach_theme",
    icon: "light_peach_icon",
    label: "Lite Peach",
  },
  {
    theme: "pale_peach_theme",
    icon: "pale_peach_icon",
    label: "Pale Peach",
  },
  {
    theme: "pale_yellow_theme",
    icon: "pale_yellow_icon",
    label: "Pale Yellow",
  },
  {
    theme: "pale_green_theme",
    icon: "pale_green_icon",
    label: "Pale Green",
  },
  {
    theme: "light_celadon_theme",
    icon: "light_celadon_icon",
    label: "Lite Celadon",
  },
  {
    theme: "pale_mint_theme",
    icon: "pale_mint_icon",
    label: "Pale Mint",
  },
  {
    theme: "pale_aqua_theme",
    icon: "pale_aqua_icon",
    label: "Pale Aqua",
  },
  {
    theme: "pale_lavender_blue_theme",
    icon: "pale_lavender_blue_icon",
    label: "Pale Lavender Blue",
  },
  {
    theme: "pale_gray_theme",
    icon: "pale_gray_icon",
    label: "Pale Gray",
  },
  {
    theme: "pale_mauve_theme",
    icon: "pale_mauve_icon",
    label: "Pale Mauve",
  },
  {
    theme: "lavender_blush_theme",
    icon: "lavender_blush_icon",
    label: "Lavender Blush",
  },
  {
    theme: "pale_rose_theme",
    icon: "pale_rose_icon",
    label: "Pale Rose",
  },
  {
    theme: "lite_pale_theme",
    icon: "lite_pale_icon",
    label: "Lite Pale Pink",
  },


  {
    theme: "blush_pink_theme",
    icon: "blush_pink_Icon",
    label: "Blush Pink",
  },
  {
    theme: "light_pink_theme",
    icon: "light_pink_Icon",
    label: "Lite Pink",
  },
];

const ThemeDropdown = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const theme = useLocalStorage("theme", 'get')
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    addWindowClass(theme);
  }, [theme]);

  const themeApiCall = async (item) => {
    let userData = useLocalStorage("userData", 'get')
    let theme = await updateTheme({
      "theme": item,
      "employeeID": userData?.employeeID
    })
    if (theme?.success) {
      notify(theme?.message, "success")
    } else {
      notify(theme?.message, "error")
    }
  }


  const handleSelect = (eventKey) => {
    themeApiCall(eventKey)
    useLocalStorage("theme", 'set', eventKey)
    addWindowClass(eventKey);

    if (eventKey !== theme) {
      removeWindowClass(theme);
    }

    let selectedTheme = themes?.find((theme) => theme?.theme === eventKey);
    setSelectedValue(selectedTheme);
  };

  function handleClick(event, theme, index) {
    event.preventDefault();
    setActiveIndex(index);
    setSelectedValue(theme);
  }

  return (
    <>
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle
          id="dropdown-basic"
          bsPrefix="custom-toggle"
          className="p-0 mx-1 theme-class"
        >
          <FontAwesomeIcon
            icon={faPalette}
            onClick={() => setActiveIndex(null)}
          // style={{ padding: "10px" }}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu className="theme_popup_box">
          {themes?.map((theme, index) => {
            return (
              <Fragment key={index}>
                <Dropdown.Item
                  eventKey={theme?.theme}
                  style={{ position: "relative" }}
                >
                  <span className={theme?.icon}></span>
                  <span
                    className="ml-1"
                    onContextMenu={(e) => {
                      handleClick(e, theme?.theme, index);
                    }}
                  >
                    {theme?.label}
                  </span>
                  {activeIndex === index && (
                    <div
                      className={`theme-save`}
                    >
                      <button
                        onClick={() => {

                          handleSelect(selectedValue);
                        }}
                        className="text-white rounded"
                      >
                        Save theme
                      </button>
                    </div>
                  )}
                </Dropdown.Item>
              </Fragment>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default ThemeDropdown;
