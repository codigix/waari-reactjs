import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { post } from "../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../store/actions/authActions";

// image
import loginbg from "../../images/pic1.png";

function Login(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .min(3, "Please enter atleast three letters ")
        .required("Please enter Email Id")
        .matches(
          /^(?=.*[a-zA-Z\u0900-\u097F])[a-zA-Z0-9\u0900-\u097F\s!@#$%^&*()-=_+[\]{}|;':",.<>/?]+$/,
          {
            message: "Only digits are not allowed",
          }
        ),
      password: Yup.string()
        .min(6, "Length of the password should be atleast 6 digits")
        .required("Please enter the Password"),
    }),

    onSubmit: async (values) => {
      try {
        const data = {
          email: values.email,
          password: values.password,
        };

        setIsLoading(true);
        const response = await post(`/user-login`, data);

        if (response?.data.token && response?.data?.roleId != 1) {
          dispatch(login(response?.data?.token, response?.data?.permissions, response?.data?.roleId, response?.data?.userId ))
          toast.success("login successfull");
          
          navigate("/dashboard");
        } else {
          navigate("/verify-otp", {state: {email: values.email}});
        }
      } catch (error) {
        console.log(error?.response?.data?.message[0]);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const showEye = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
      <div className="login-aside text-center  d-flex flex-column flex-row-auto">
        <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
          <div className="text-center mb-4 pt-5">
            <img src={import.meta.env.VITE_WAARI_LOGO_PATH} alt="" className="login-logo" />
          </div>
          <h3 className="mb-2">Welcome back!</h3>
          {/* <p>
            User Experience & Interface Design <br />
            Strategy SaaS Solutions
          </p> */}
        </div>
        <div
          className="aside-image"
          style={{ backgroundImage: "url(" + loginbg + ")" }}
        ></div>
      </div>
      <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
        <div className="d-flex justify-content-center h-100 align-items-center">
          <div className="authincation-content style-2">
            <div className="row no-gutters">
              <div className="col-xl-12 tab-content">
                <div id="sign-in" className="auth-form   form-validation">
                  {props.errorMessage && (
                    <div className="bg-red-300 text-red-900 border border-red-900 p-1 my-2">
                      {props.errorMessage}
                    </div>
                  )}
                  {props.successMessage && (
                    <div className="bg-green-300 text-green-900 border border-green-900 p-1 my-2">
                      {props.successMessage}
                    </div>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                    className="login-form shadow-md rounded-lg  mb-4"
                  >
                    <h3 className="text-center mb-4 text-black">
                      Sign in your account
                    </h3>
                    <div className="form-group mb-3">
                      <label className="mb-1" htmlFor="val-email">
                        <strong>Email</strong>
                      </label>
                      <div>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Type Your Email Address"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email}
                        />
                      </div>
                      {validation.touched.email && validation.errors.email ? (
                        <span className="error">{validation.errors.email}</span>
                      ) : null}
                    </div>
                    <div className="form-group mb-3">
                      <label className="mb-1">
                        <strong>Password</strong>
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          name="password"
                          placeholder="Type Your Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password}
                        />
                        <div className="input-group-addon-pass">
                          <span onClick={() => showEye()}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`${showPassword ? "" : "d-none"}`}
                              height="1em"
                              viewBox="0 0 576 512"
                            >
                              <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`${showPassword ? "d-none" : ""}`}
                              height="1em"
                              viewBox="0 0 640 512"
                            >
                              <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      {validation.touched.password &&
                      validation.errors.password ? (
                        <span className="error">
                          {validation.errors.password}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-center form-group mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary btn-submit btn-block"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing In" : "Sign In"}
                      </button>
                    </div>
                  </form>
                  <div className="new-account mt-3 d-flex  justify-content-end">
										<Link className="" to="/forgot-password">Forgot password? </Link>
									</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
