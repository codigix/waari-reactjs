import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { post } from "../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../store/actions/authActions";

// image
import loginbg from "../../images/pic1.png";

function ForgotPassword() {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            email: "",
        },

        validationSchema: Yup.object({
            email: Yup.string().email("Please enter valid email address").required(),
           
        }),

        onSubmit: async (values) => {
            try {
                const data = {
                    email: values.email,
                };

                setIsLoading(true);
                const response = await post(`/forget-password`, data);


                    toast.success(response.data.message);

                    navigate("/verify-forget-password-otp", {state: {email: values.email}})
                    
            } catch (error) {
                console.log(error?.response?.data?.message[0]);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="authincation">

            <div className="container  position-relative overflow-hidden p-7 mx-auto">
                <div className="d-flex justify-content-center h-100 align-items-center">
                    <div className="authincation-content style-2">
                        <div className="row no-gutters">
                            <div className="col-xl-12 tab-content">
                                <div
                                    id="sign-in"
                                    className="auth-form   form-validation"
                                >
   
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            validation.handleSubmit();
                                            return false;
                                        }}
                                        className="login-form shadow-md rounded-lg  mb-4"
                                    >
                                        <h3 className="text-center mb-4 text-black">
                                            Send OTP
                                        </h3>

                                        <div className="form-group mb-3">
                                            <label
                                                className="mb-1"
                                                htmlFor="val-email"
                                            >
                                                <strong>Email</strong>
                                            </label>
                                            <div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control "
                                                    placeholder="Type Your Email Address"
                                                    onChange={
                                                        validation.handleChange
                                                    }
                                                    onBlur={
                                                        validation.handleBlur
                                                    }
                                                    value={
                                                        validation.values.email
                                                    }
                                                />
                                            </div>
                                            {validation.touched.email &&
                                            validation.errors.email ? (
                                                <span className="error">
                                                    {validation.errors.email}
                                                </span>
                                            ) : null}
                                        </div>
                                
                                        <div className="text-center form-group mb-3">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-submit btn-block"
                                                disabled={isLoading}
                                            >
                                                {isLoading
                                                    ? "Sending..."
                                                    : "Send"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
