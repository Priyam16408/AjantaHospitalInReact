import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { setWindowClass } from "@app/utils/helpers";
import { signInAction } from "../../store/reducers/loginSlice/loginSlice";
import Input from "@app/components/formComponent/Input";
import logoitdose from "@app/assets/image/logoitdose.png";
import { useLocalStorage } from "@app/utils/hooks/useLocalStorage";
import { notify } from "../../utils/utils";

const LoginComponent = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [t] = useTranslation();

  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },

    onSubmit: async (values) => {
      const errors = {};
      if (!values.userName) {
        errors.userName = "User Name is required";
        notify(errors.userName, "error");
      } else if (values.userName.length < 3) {
        errors.userName = "At least 3 characters are required";
        notify(errors.userName, "error");
      }
      if (!values.password) {
        errors.password = "Password is required";
        notify(errors.password, "error");
      }

      // If there are validation errors, return early
      if (Object.keys(errors).length > 0) {
        return;
      }
      try {
        let loginData = await dispatch(signInAction(values));
       
        if (loginData?.payload?.data?.userDetails?.themeName) {
          useLocalStorage(
            "theme",
            "set",
            loginData?.payload?.data?.userDetails?.themeName
          );
          setWindowClass(
            `hold-transition login-page ${loginData?.payload?.data?.userDetails?.themeName}`
          );
        } else {
          notify(loginData?.payload?.message,"error")
          useLocalStorage("theme", "set", "default_theme");
          setWindowClass("hold-transition login-page default_theme");
        }
        navigate("/dashboard");
      } catch (error) {
        console.error("Error occurred:", error);
      }
    },
  });

  return (
    <>
      <form
        className="card card-outline card-primary border text-center py-3"
        onSubmit={handleSubmit}
      >
        <div className="card-body ">
          <Link to="/">
            <img className="logoStyle" src={logoitdose} />
          </Link>
          <h5 className="cardTitle my-3"> Sign in to start your session</h5>
          <div className="row">
            <div className="col-sm-12 d-flex mt-4">
              <div className="maindiv">
                <Input
                  type="text"
                  className="form-control"
                  id="text"
                  name="userName"
                  lable={t("Username")}
                  placeholder=" "
                  value={values?.userName}
                  onChange={handleChange}
                />
              </div>
              <div className="icondiv">
                <i className="fas fa-envelope" />
              </div>
              {/* {touched.email && errors.email ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                ) : ( */}
            </div>
            <div className="col-sm-12 d-flex mt-4">
              <div className="maindiv">
                <Input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  lable={t("Password")}
                  placeholder=" "
                  value={values?.password}
                  onChange={handleChange}
                />
              </div>
              <div className="icondiv">
                <i className="fas fa-lock" />
              </div>
              {/* {touched.password && errors.password ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                ) : ( */}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 mt-4">
              <button
                className=" btn btn-sm btn-primary btn-block"
                // onClick={handleSubmit}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default LoginComponent;
