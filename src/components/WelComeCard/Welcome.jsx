import React, { useEffect, useState } from "react";
import Img from "../../assets/image/Flat-Journalist.png";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
const Welcome = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("");
  const [t]=useTranslation();

  const localData = useLocalStorage("userData", "get");

  // Function to format the date as "Month Day, Year" in IST
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  // Function to get the current time in IST
  const getCurrentTimeInIST = () => {
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60000; // Get offset in milliseconds
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5.5 hours)
    const istTime = new Date(now.getTime() + utcOffset + istOffset);
    return istTime;
  };

  // Function to set the current date and greeting in the specified format
  const updateDateAndGreeting = () => {
    const istTime = getCurrentTimeInIST();
    setCurrentDate(formatDate(istTime));

    const currentHour = istTime.getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else if (currentHour < 21) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  };

  useEffect(() => {
    // Set the initial date and greeting
    updateDateAndGreeting();

    // Calculate the time until midnight in IST
    const istTime = getCurrentTimeInIST();
    const millisTillMidnight =
      new Date(
        istTime.getFullYear(),
        istTime.getMonth(),
        istTime.getDate() + 1,
        0,
        0,
        0
      ) - istTime;

    // Set a timeout to update the date and greeting at midnight in IST
    const timeoutId = setTimeout(() => {
      updateDateAndGreeting();

      // Set an interval to update the date and greeting every 24 hours thereafter
      setInterval(updateDateAndGreeting, 24 * 60 * 60 * 1000);
    }, millisTillMidnight);

    // Clear the timeout and interval on component unmount
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    
    <div>
      <div className="welcome_wrp" id="welcome_wrp">
        <div className="col-md-12 col-sm-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h2>{t(greeting)} 👋</h2>
              <h3>{currentDate}</h3>
              <h1>{t("Welcome Back!")} {localData?.empName?.length>25?localData?.empName?.slice(0,25)+"...":localData?.empName} </h1>
              <p></p>
            </div>

            <div>
              <img src={Img} alt="" width={"137px"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

{
  /* <div className="col-md-6">
        <div className="birthDay-Box">
          <div className="birthdayHead" id="birthdayHead">
            <span style={{ fontWeight: 700, color: "#fb5353" }}>
              BirthDay List{" "}
            </span>
            ({moment().format("dddd, MMMM Do YYYY")})
          </div>
          <div
            style={{
              padding: "2px",
            }}
          >
            <Marque height={handleHeightOfBirthDaycard()}>
              {birthDayData?.map((item, index) => (
                <div className="birthdayBody mt-2" key={index}>
                  <div
                    className="thread"
                    style={{
                      backgroundColor: generateRandomColor(),
                      fontSize: "10px",
                      padding: "2px 5px",
                      borderRadius: "0px 5px 5px 0px",
                      display: "inline",
                      color: "black",
                      fontWeight: "600",
                    }}
                  >
                    {item?.Department}
                  </div>
                  <div className="d-flex justify-content-between p-2">
                    <div className="deatils">
                      <div style={{ fontWeight: 800 }}>
                        {item?.EmployeeName}
                      </div>
                      <div>
                        {item?.EmployeeAge}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 64 64"
                          width="20"
                          height="20"
                        >
                          <rect
                            x="10"
                            y="30"
                            width="44"
                            height="20"
                            rx="4"
                            ry="4"
                            fill="#FFB74D"
                          />

                          <path
                            d="M10 30 Q16 24, 22 30 T32 30 T42 30 T54 30"
                            fill="#FFCC80"
                          />

                          <rect
                            x="18"
                            y="16"
                            width="4"
                            height="14"
                            fill="#90CAF9"
                          />
                          <rect
                            x="30"
                            y="16"
                            width="4"
                            height="14"
                            fill="#90CAF9"
                          />
                          <rect
                            x="42"
                            y="16"
                            width="4"
                            height="14"
                            fill="#90CAF9"
                          />

                          <circle cx="20" cy="14" r="2" fill="#FFEB3B" />
                          <circle cx="32" cy="14" r="2" fill="#FFEB3B" />
                          <circle cx="44" cy="14" r="2" fill="#FFEB3B" />

                          <rect
                            x="10"
                            y="40"
                            width="44"
                            height="4"
                            fill="#F57C00"
                          />
                          <rect
                            x="10"
                            y="44"
                            width="44"
                            height="6"
                            fill="#EF6C00"
                          />

                          <rect
                            x="8"
                            y="50"
                            width="48"
                            height="4"
                            rx="2"
                            ry="2"
                            fill="#BDBDBD"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <img src={item?.EmployeePhoto} className="img-holder" />
                    </div>
                  </div>
                </div>
              ))}
            </Marque>
          </div>
        </div>
      </div> */
}
