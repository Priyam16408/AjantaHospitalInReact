// MainContent.js
import React from "react";
import "./Login.css";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
// import logo from "@app/assets/image/logo.png";
import LogoNeo from "@app/assets/image/LogoNeo.png";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { notify } from "../../utils/utils";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { signInAction } from "../../store/reducers/loginSlice/loginSlice";
import { speakMessage } from "../../utils/ustil2";

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const [t] = useTranslation();

  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },

    onSubmit: async (values) => {
      const errors = {};

      if (!values.userName || !values.password) {
        errors.userName = "Both Fields is required";
        notify(errors.userName, "error");
      } else if (values.userName.length < 3) {
        errors.userName = "At least 3 characters are required";
        notify(errors.userName, "error");
      }
      // if (!values.password) {
      //   errors.password = "Password is required";
      //   notify(errors.password, "error");
      // }

      // If there are validation errors, return early
      if (Object.keys(errors).length > 0) {
        return;
      }
      try {
        let loginData = await dispatch(signInAction(values));
        const response = loginData?.payload;
        if (!response.success) {
          notify(response.message || "Login failed", "error");
          return;
        }

        if (loginData?.payload?.data?.userDetails?.themeName) {
          useLocalStorage(
            "theme",
            "set",
            loginData?.payload?.data?.userDetails?.themeName
          );
        } else {
          useLocalStorage("theme", "set", "default_theme");
        }
        if (loginData?.payload?.success) {
          speakMessage(
            `Welcome ${loginData?.payload?.data?.userDetails?.empName ? loginData?.payload?.data?.userDetails?.empName : ""}`
          );
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    },
  });
  return (
    <div className="background-login-containers">
      <div
        className="contentss"
        style={{ textAlign: "center", justifyContent: "center" }}
      >
        <Link to="/">
          <img
            className="logoStyle"
            src={LogoNeo}
            alt="Logo"
            style={{ width: "150px" }}
          />
          {/* <img className="logoStyle" src={logo} alt="Logo" /> */}
        </Link>
        <h1 className="Login-heading">Login</h1>
        <p>Sign In to start your session</p>

        <form onSubmit={handleSubmit}>
          <div className="input-container py-2">
            <div className="input-wrapper">
              <input
                type="text"
                id="userName"
                name="userName"
                className="input-field"
                placeholder="User Name"
                value={values.userName}
                onChange={handleChange}
              />
              <span className="icon">
                <i
                  className="fa fa-user-circle text-white"
                  aria-hidden="true"
                ></i>
              </span>
            </div>
            {/* {touched.userName && errors.userName && (
              <div className="error">{errors.userName}</div>
            )} */}
          </div>

          <div className="input-container py-2">
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="input-field"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
              />
              <span
                className="icon password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} text-white`}
                  aria-hidden="true"
                ></i>
              </span>
            </div>
            {/* {touched.password && errors.password && (
              <div className="error">{errors.password}</div>
            )} */}
          </div>

          <div
            className="input-container pt-4 justify-content-center"
            style={{ cursor: "pointer" }}
          >
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                border: "1px solid #fff",
                padding: "3px 17px",
                borderRadius: "3px",
                backgroundColor: "#fff",
                color: "#6f42c1",
                fontWeight: "bolder",
                cursor: "pointer",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </form>

        {/* Uncomment for Forget Password Link */}
        {/* <div className="input-container pt-4 justify-content-center">
          <Link to="/forget-password" className="text-light forget">
            Forget Password
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
