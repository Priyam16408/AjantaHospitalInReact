import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NotificationMenu } from "@app/styles/dropdown-menus";
import { useSelector } from "react-redux";
import { Divider } from "primereact/divider";
import { useState } from "react";
const NotificationsDropdown = () => {
  const [t] = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { GetNotifications } = useSelector((state) => state.CommonSlice);

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 5);
    }
  };

  const handleNextClick = () => {
    if (currentIndex + 5 < GetNotifications?.length) {
      setCurrentIndex(currentIndex + 5);
    }
  };
  return (
    <>
      <NotificationMenu hideArrow>
        <div slot="head">
          <i className="far fa-bell text-white" />
          <span className="badge badge-warning navbar-badge">
            {GetNotifications?.length}
          </span>
        </div>
        <div slot="body">
          <span className="dropdown-item dropdown-header">
            {GetNotifications?.message}
          </span>
          <div className="dropdown-divider" />
          {GetNotifications?.slice(currentIndex, currentIndex + 5)?.map(
            (item, key) => {
              return (
                <Link to={item.pagePath} className="dropdown-item" key={key}>
                  <i className="fas fa-envelope mr-2" />
                  <span>{item?.message}</span>
                  <span className="float-right text-muted text-sm">
                    {t("measurement.quantityUnit", {
                      quantity: "3",
                      unit: "mins",
                    })}
                  </span>
                </Link>
              );
            }
          )}
          <Divider />

          {GetNotifications?.length > 5 && (
            <div className="d-flex justify-content-center mb-3">
              <button
                // className="btn btn-primary btn-sm mx-3"
                className={
                  currentIndex === 0
                    ? "grayColorBtnDisabled btn btn-sm mx-3"
                    : "btn btn-sm btn-primary mx-3"
                }
                type="button"
                onClick={handlePrevClick}
                disabled={currentIndex === 0}
              >
                <i className="pi pi-arrow-left"></i>
              </button>
              <button
                className={
                  currentIndex + 5 >= GetNotifications?.length
                    ? "grayColorBtnDisabled btn btn-sm"
                    : "btn btn-sm btn-primary"
                }
                type="button"
                onClick={handleNextClick}
                disabled={currentIndex + 5 >= GetNotifications?.length}
              >
                <i className="pi pi-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </NotificationMenu>
    </>
  );
};

export default NotificationsDropdown;
