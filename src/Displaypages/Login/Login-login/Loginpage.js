import "./Loginpage.css";
import { FaUser } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import loginBanner from "../../../img/login-bg.png";
import React from "react";
import setAuthHeader from "../SetAuthHeader";
import { ToastContainer, toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import Agtlogo from "../../../img/AGTlogoday.png";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function LoginPage({ locale, setLocale }) {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  async function login(event) {
    event.preventDefault();
    const formValid = validateInputs();
    if (formValid) {
      setValidated(true);
      try {
        const result = await axios.post(
          process.env.REACT_APP_API_BASE_URL +
            "/api/v1/login/loginAuthenticate",
          {
            userName: username,
            password: password,
          }
        );
        if (result && result.data) {
          localStorage.setItem(
            "userInfo",
            JSON.stringify(result.data.employeeDTO)
          );
          setAuthHeader(result.data.accessToken);
          toast.success("login Successfully");
          // await fetchTimesheetCycleFromDatabase();
          setTimeout(() => {
            navigate("/home");
          }, 1000);
          setusername("");
          setpassword("");
        }
      } catch (err) {
        toast.error("Login Failed");
      }
    }
  }

  function isValidEmail(email) {
    // Define a regular expression pattern for email validation.
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

 function validateEmailAddress(email) {
    if(isValidEmail(email)){
      setValidEmail(true);
    }else{
      setValidEmail(false);
    }
  }

 function validateEmail(e) {
  const {value} =e.target;
  setusername(value);
  validateEmailAddress(value);
 }

  const validateInputs = () => {
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return false;
    }
    return true;
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // const fetchTimesheetCycleFromDatabase = async () => {
  //   try {
  //     const userInfoString = localStorage.getItem("userInfo");
  //     const userInfo = JSON.parse(userInfoString);
  //     const employeeId = userInfo["employeeId"];

  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/api/v1/settings/getGeneralSettingInfo/${employeeId}`
  //     );

  //     const { timesheetCycle: fetchedTimesheetCycle } = response.data;
  //     localStorage.setItem("timesheetCycle", fetchedTimesheetCycle);
  //   } catch (error) {
  //     console.error("Error fetching settings info:", error);
  //   }
  // };

  return (
    <div className="login-background-image">
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      overflow: 'auto'
    }}>
      <div className="loginpage-full-box" style={{
        width: '80%',
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row-reverse' // Add this line
      }}>
        
          <div className="loginpage-first-box" style={{
            height: '100%',
            position: 'relative'
          }}>
            <img
              className="loginbanner-image"
              src={loginBanner}
              alt="TEST"
              style={{
                width: '100%',
                height: '100%',
              
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              width: '100%',
              cursor: 'default'
            }}>
              <h6 className="login-image-text" style={{ fontSize: '1.8rem' }}><strong>We are delighted to have you here</strong></h6>
              <p className="login-image-text-p" style={{ fontSize: '0.800rem' }}>
                Master the art of time management and execute your tasks with strategic finesse.
              </p>
            </div>
          </div>
        
        <div style={{ width: '50%' }}>
          <div className="loginpage-secound-box" style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0px',
            boxSizing: 'border-box'
          }}>
            <div className="login-header text-center">
              <img className="login-logo" src={Agtlogo} alt="Logo" />
              <h6 className="login-text-top">Login to Your Account</h6>
            </div>
              <form className="login-form align-items-center justify-content-center">
                <div className="login-form-group d-flex login-input-icons">
                  <div className="login-input-box"></div>
                  <div className="login-line">
                    <div className="login-input-container">
                      <input
                        type="text"
                        className={`login-input login-input-field form-control ${username.length > 0 ? "is-valid" : "is-invalid"}`}
                        name="email"
                        id="username"
                        value={username}
                        onChange={(event) => {
                          setusername(event.target.value);
                        }}
                        placeholder=" Email-Id"
                        required
                      />
                      <svg
                        className="login-input-icon"
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
                <div className="login-form-group d-flex login-input-icons pt-3">
                  <div className="login-input-box"></div>
                  <div className="login-line">
                    <div className="login-input-container">
                      <input
                        className={`login-input login-input-field form-control ${password.length > 0 ? "is-valid" : "is-invalid"}`}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        id="password"
                        value={password}
                        onChange={(event) => {
                          setpassword(event.target.value);
                        }}
                        required
                      />
                      <svg
                        className="login-input-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_3516_2194)">
                          <path
                            opacity="0.5"
                            d="M16.667 11.3334V10.0001C16.667 9.64646 16.5265 9.30732 16.2765 9.05727C16.0264 8.80722 15.6873 8.66675 15.3337 8.66675H2.00033C1.6467 8.66675 1.30756 8.80722 1.05752 9.05727C0.807468 9.30732 0.666992 9.64646 0.666992 10.0001V18.0001C0.666992 18.3537 0.807468 18.6928 1.05752 18.9429C1.30756 19.1929 1.6467 19.3334 2.00033 19.3334H15.3337C15.6873 19.3334 16.0264 19.1929 16.2765 18.9429C16.5265 18.6928 16.667 18.3537 16.667 18.0001V16.6667M16.667 11.3334H11.3337C10.6264 11.3334 9.94814 11.6144 9.44804 12.1145C8.94794 12.6146 8.66699 13.2928 8.66699 14.0001C8.66699 14.7073 8.94794 15.3856 9.44804 15.8857C9.94814 16.3858 10.6264 16.6667 11.3337 16.6667H16.667M16.667 11.3334C17.3742 11.3334 18.0525 11.6144 18.5526 12.1145C19.0527 12.6146 19.3337 13.2928 19.3337 14.0001C19.3337 14.7073 19.0527 15.3856 18.5526 15.8857C18.0525 16.3858 17.3742 16.6667 16.667 16.6667M4.66699 8.66675V4.66675C4.66699 3.60588 5.08842 2.58847 5.83856 1.83832C6.58871 1.08818 7.60613 0.666748 8.66699 0.666748C9.72786 0.666748 10.7453 1.08818 11.4954 1.83832C12.2456 2.58847 12.667 3.60588 12.667 4.66675V8.66675M16.0003 14.0001H17.3337M13.3337 14.0001H14.667M10.667 14.0001H12.0003"
                            stroke="black"
                            strokeOpacity="0.6"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_3516_2194">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <div className="inputbox2"></div>
                    </div>
                    {showPassword ? (
                        <IoEyeOutline
                          className="login-eye-icon"
                          onClick={togglePasswordVisibility}
                        />
                      ) : (
                        <IoEyeOffOutline
                          className="login-eye-icon"
                          onClick={togglePasswordVisibility}
                        />
                      )}
                  </div>
                </div>
                <div className="login-input-icons">
                  <button
                    type="submit"
                    className="loginButton btn px-5"
                    value="Login"
                    onClick={login}
                  >
                    LOGIN
                  </button>
                </div>
                <div>
                  <a className='login-forget' href="/forgot" style={{ textDecoration: 'none' }}>Forgot Password?</a>
                </div>
              </form>
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
            style={{ zIndex: 1000, width: "auto" }}
          />
              <div>
                <div
                  position="top-center"
                  autoClose={10000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  style={{ zIndex: 1000, width: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default LoginPage;
