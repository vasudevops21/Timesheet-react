import { useState } from "react";
import axios from "axios";
import "./forgotpassword.css";
import agtlogo from "../../../img//AGTlogoday.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import forgotBanner from "../../../img/login-bg.png";
import React from "react";

function Forgot() {
  const [password, setpassword] = useState();
  const [emailId, setEmailId] = useState(null);
  const navigate = useNavigate();

  async function send(event) {
    event.preventDefault();
    if (emailId == null || emailId == "") {
      toast.error("Please enter email id");
    } else {
      try {
        let appUrl = window.location.origin + "/resetpassword";
        await axios.post(
          process.env.REACT_APP_API_BASE_URL + "/api/v1/login/forgetPassword",
          null,
          {
            params: {
              emailId: emailId,
              appUrl: appUrl,
            },
          }
        );
        toast.success("Password reset link sent successfully!");
        setEmailId("");
      } catch (err) {
        toast.error("Failed to send password reset link!");
      }
    }
  }

  return (
    <div className="forgot-background-image">
      <div
        className=""
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <div
          className="forgetpassword-page-fullbox"
          container
          style={{
            width: "80%",
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ flex: 1, order: 2 }}>
            <div
              className="forgotpage-first-box"
              style={{
                height: "100%",
                display: "flex",
                position: "relative",
              }}
            >
              <img
                className="forgotbanner-image"
                src={forgotBanner}
                alt="TEST"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  width: "100%",
                  cursor: "default",
                }}
              >
                <h6
                  variant="h6"
                  className="forgot-image-text"
                  style={{ fontSize: "1.8rem", color: "white" }}
                >
                  <strong>We are delighted to have you here</strong>
                </h6>
                <p
                  variant="body1"
                  className="forgot-image-text1 mt-2"
                  align="center"
                  style={{ fontSize: "0.800rem", color: "white" }}
                >
                  Master the art of time management and execute your tasks with
                  strategic finesse.
                </p>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, order: 1 }}>
            <div
              className="forgotpage-second-box"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img className="forgot-logo" src={agtlogo} alt="Logo" />
              <div className="forgot-header text-center d-flex ">
                <h1
                  className=""
                  style={{
                    fontWeight: "800",
                    fontSize: "16px",
                    color: "hsla(236, 34%, 61%, 1)",
                  }}
                >
                  <svg
                    className="forgot-text-icon"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 2C19.5946 1.99968 18.2087 2.32857 16.9532 2.96031C15.6978 3.59205 14.6079 4.50908 13.7707 5.63792C12.9335 6.76675 12.3723 8.07599 12.1322 9.46074C11.8921 10.8455 11.9797 12.2672 12.388 13.612L2 24V30H8L18.388 19.612C19.6259 19.9878 20.9303 20.0922 22.2122 19.9183C23.4941 19.7443 24.7235 19.2961 25.8165 18.604C26.9095 17.912 27.8405 16.9925 28.546 15.9081C29.2515 14.8237 29.7149 13.6 29.9047 12.3203C30.0945 11.0407 30.0062 9.7351 29.6458 8.49264C29.2854 7.25019 28.6613 6.10003 27.8162 5.12056C26.9711 4.14109 25.9247 3.35532 24.7485 2.81681C23.5722 2.2783 22.2937 1.9997 21 2ZM21 18C20.3115 17.9996 19.6268 17.8979 18.968 17.698L17.821 17.35L16.974 18.197L13.793 21.378L12.414 20L11 21.414L12.379 22.793L10.793 24.379L9.414 23L8 24.414L9.379 25.793L7.172 28H4V24.828L13.802 15.026L14.65 14.179L14.302 13.032C13.8746 11.623 13.9023 10.1151 14.3814 8.72277C14.8604 7.33045 15.7662 6.12463 16.97 5.27683C18.1739 4.42902 19.6144 3.98242 21.0867 4.00053C22.559 4.01864 23.9881 4.50056 25.1707 5.37772C26.3533 6.25488 27.2292 7.48262 27.6738 8.8863C28.1184 10.29 28.1091 11.7981 27.6471 13.1962C27.1852 14.5942 26.2941 15.8111 25.1008 16.6735C23.9074 17.5359 22.4724 18.0001 21 18Z"
                      fill="url(#paint0_linear_3326_104)"
                    />
                    <path
                      d="M22 12C23.1046 12 24 11.1046 24 10C24 8.89543 23.1046 8 22 8C20.8954 8 20 8.89543 20 10C20 11.1046 20.8954 12 22 12Z"
                      fill="url(#paint1_linear_3326_104)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_3326_104"
                        x1="16.001"
                        y1="2"
                        x2="16.001"
                        y2="30"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#787DBD" />
                        <stop offset="1" stop-color="#065399" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_3326_104"
                        x1="22"
                        y1="8"
                        x2="22"
                        y2="12"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#787DBD" />
                        <stop offset="1" stop-color="#065399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  Forgot Password
                </h1>
              </div>
              <p className="forgot-text-color text-center">
                We will sending a reset password link to your email
              </p>
              <form className="forget-form ">
                <div className="f-inputbox forgot-form-group d-flex forgetinput-icons">
                  <div className="forgot-inputbox"></div>
                  <div className="forgot-ia">
                    <div className="forget-input-container">
                      <input
                        type="text"
                        className="form-control forget-input4 input-field-forget  "
                        name="email"
                        id="username"
                        value={emailId}
                        onChange={(event) => setEmailId(event.target.value)}
                        placeholder="Email-Id"
                      />
                      <svg
                        className="forgot-input-svg"
                        width="20"
                        height="16"
                        viewBox="0 0 20 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.5"
                          d="M20 2C20 0.9 19.1 0 18 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2ZM18 2L10 7L2 2H18ZM18 14H2V4L10 9L18 4V14Z"
                          fill="black"
                          fillOpacity="0.6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="input-icons">
                  <button
                    type="submit"
                    className="forgot-button btn px-6"
                    onClick={send}
                  >
                    Send
                  </button>
                  <ToastContainer
                    position="top-center"
                    autoClose={10000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    style={{ zIndex: 1000 }}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
