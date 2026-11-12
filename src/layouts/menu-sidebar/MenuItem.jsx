import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MenuItem = ({ menuItem, isSearched }) => {
  const [t] = useTranslation();
  const [isMenuExtended, setIsMenuExtended] = useState(isSearched);
  const [isExpandable, setIsExpandable] = useState(isSearched);
  const [isMainActive, setIsMainActive] = useState(false);
  const [isOneOfChildrenActive, setIsOneOfChildrenActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuExtended(!isMenuExtended);
  };

  const handleMainMenuAction = () => {
    if (isExpandable) {
      toggleMenu();
      return;
    }
    navigate(menuItem.url ? menuItem.url : "/");
  };

  const calculateIsActive = (url) => {
    setIsMainActive(false);
    setIsOneOfChildrenActive(false);
    if (isExpandable && menuItem && menuItem.children) {
      menuItem.children.forEach((item) => {
        if (item.Url === url.pathname || isSearched) {
          setIsOneOfChildrenActive(true);
          setIsMenuExtended(true);
        }
      });
    } else if (menuItem.url === url.pathname) {
      setIsMainActive(true);
    }
  };

  useEffect(() => {
    if (location) {
      calculateIsActive(location);
    }
  }, [location, isExpandable, menuItem, isSearched]);

  useEffect(() => {
    if (!isMainActive && !isOneOfChildrenActive && !isSearched) {
      setIsMenuExtended(false);
    }
  }, [isMainActive, isOneOfChildrenActive, isSearched]);

  useEffect(() => {
    setIsExpandable(
      Boolean(menuItem && menuItem.children && menuItem.children.length > 0)
    );
  }, [menuItem]);

  return (
    <li className={`nav-item${isMenuExtended ? " menu-open" : ""}`}>
      <a
        className={`nav-link${
          isMainActive || isOneOfChildrenActive ? "active" : ""
        }`}
        role="link"
        onClick={handleMainMenuAction}
        style={{ cursor: "pointer", margin: 0 }}
      >
        <i className={`${menuItem.menuName === "DASHBOARD" ? "fas fa-tachometer-alt nav-icon" : menuItem.menuIcon } nav-icon mr-2`} />
        <p>{t(menuItem.menuName)}</p>
        {isExpandable ? <i className="right fas fa-angle-left" /> : null}
      </a>
      <ul className="nav nav-treeview nav-link pl-4 ">
        {isExpandable &&
          menuItem &&
          menuItem.children &&
          menuItem.children.map((item) => (
            <li className="nav-item" key={item.childrenName}>
             
              <NavLink
                className="nav-link rounded"
                to={`${item.url}`}
                state={{ data: item?.BreadCrumb }}
              >
                <i className="fas fa-tachometer-alt nav-icon mr-2" />
                <p>{t(item.childrenName)}</p>
              </NavLink>
            </li>
          ))}
      </ul>
    </li>
  );
};

export default MenuItem;
