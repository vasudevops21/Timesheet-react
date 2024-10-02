import './Resetpassword.css';
import { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import React from 'react';
import setAuthHeader from '../SetAuthHeader';
import { ToastContainer, toast } from 'react-toastify';
import { FormattedMessage } from "react-intl";
import forgotagtlogo from '../../../img/AGTlogoday.png';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import resetBanner from '../../../img/login-bg.png';



function Resetpassword({ locale, setLocale }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const navigate = useNavigate(); 



  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
  }, [searchParams]);


  const handleNewPasswordChange = (event) => {
    const newPasswordValue = event.target.value;
    setNewPassword(newPasswordValue);
    checkPasswordMatch(newPasswordValue, confirmPassword);
  };
  
  const handleConfirmPasswordChange = (event) => {
    const confirmPasswordValue = event.target.value;
    setConfirmPassword(confirmPasswordValue);
    checkPasswordMatch(newPassword, confirmPasswordValue);
  };
  
  const checkPasswordMatch = (newPassword, confirmPassword) => {
    if(newPassword !== null && newPassword !=="" && newPassword !== undefined && confirmPassword !== null &&
    confirmPassword !== undefined && newPassword === confirmPassword){
      console.log(newPassword , confirmPassword);
      setPasswordsMatch(true);
    } else {
      console.log(newPassword , confirmPassword);
      setPasswordsMatch(false);
    }
  };


   const handleSubmit = async (event) => {
    console.log("handleSubmit called");
    if(passwordsMatch){
    event.preventDefault();
      try {
        await axios.post(process.env.REACT_APP_API_BASE_URL+"/api/v1/login/resetPassword", null, {
          params:{
            token : searchParams.get("token"),
            password : newPassword
            }
        });
        toast("Password updated Successfully");
        setShowRedirect(true);
        setTimeout(() => {
          navigate('/');
      }, 3000); // 5000 milliseconds = 5 seconds
      } catch (err) {
        toast("Password Update Failed");
      }
    }
  };


  return (
    <div className="reset-background-image">
      <div className="reset-common-div" >
        <div className="resetpassword-page-fullbox" style={{
          width: '80%',
          maxWidth: '1100px',
          // height:'90%',
          margin: '0 auto',
          display: 'flex'
        }}>
          <div className="resetpage-first-box" >
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0px', boxSizing: 'border-box' }}>
              <div className='' style={{ justifyContent: 'center' }}>
                <div className="reset-header text-center">
                  <img className="reset-logo" src={forgotagtlogo} alt="Logo" />
                  <h6 className="reset-text-top " style={{ fontWeight: '800' }}>
                    <svg className="reset-text-icon " width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 2C19.5946 1.99968 18.2087 2.32857 16.9532 2.96031C15.6978 3.59205 14.6079 4.50908 13.7707 5.63792C12.9335 6.76675 12.3723 8.07599 12.1322 9.46074C11.8921 10.8455 11.9797 12.2672 12.388 13.612L2 24V30H8L18.388 19.612C19.6259 19.9878 20.9303 20.0922 22.2122 19.9183C23.4941 19.7443 24.7235 19.2961 25.8165 18.604C26.9095 17.912 27.8405 16.9925 28.546 15.9081C29.2515 14.8237 29.7149 13.6 29.9047 12.3203C30.0945 11.0407 30.0062 9.7351 29.6458 8.49264C29.2854 7.25019 28.6613 6.10003 27.8162 5.12056C26.9711 4.14109 25.9247 3.35532 24.7485 2.81681C23.5722 2.2783 22.2937 1.9997 21 2ZM21 18C20.3115 17.9996 19.6268 17.8979 18.968 17.698L17.821 17.35L16.974 18.197L13.793 21.378L12.414 20L11 21.414L12.379 22.793L10.793 24.379L9.414 23L8 24.414L9.379 25.793L7.172 28H4V24.828L13.802 15.026L14.65 14.179L14.302 13.032C13.8746 11.623 13.9023 10.1151 14.3814 8.72277C14.8604 7.33045 15.7662 6.12463 16.97 5.27683C18.1739 4.42902 19.6144 3.98242 21.0867 4.00053C22.559 4.01864 23.9881 4.50056 25.1707 5.37772C26.3533 6.25488 27.2292 7.48262 27.6738 8.8863C28.1184 10.29 28.1091 11.7981 27.6471 13.1962C27.1852 14.5942 26.2941 15.8111 25.1008 16.6735C23.9074 17.5359 22.4724 18.0001 21 18Z" fill="url(#paint0_linear_3326_104)" />
                      <path d="M22 12C23.1046 12 24 11.1046 24 10C24 8.89543 23.1046 8 22 8C20.8954 8 20 8.89543 20 10C20 11.1046 20.8954 12 22 12Z" fill="url(#paint1_linear_3326_104)" />
                      <defs>
                        <linearGradient id="paint0_linear_3326_104" x1="16.001" y1="2" x2="16.001" y2="30" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#787DBD" />
                          <stop offset="1" stop-color="#065399" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_3326_104" x1="22" y1="8" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#787DBD" />
                          <stop offset="1" stop-color="#065399" />
                        </linearGradient>
                      </defs>
                    </svg>
                    Reset your password
                    <ToastContainer
        position="top-center"
        autoClose={1000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
                  </h6>
                </div>
              </div>
              <form className='reset-form align-items-center justify-content-center' onSubmit={handleSubmit}>
                <div className='form-group d-flex reset-input reset-input-icons pt-3'>
                  <div className='reset-inputbox'></div>
                  <div className='reset-line-email'>

                    <svg
                      className="reset-input-icon"
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
                  <p className="reset-input3  reset-input-field  ">{searchParams.get('email')}</p>
                </div>


                <div className="form-group d-flex reset-input-icons pt-3">
                  <div className="reset-inputbox1"></div>
                  <div className="reset-line">
                    <div className="reset-input-container ">
                      <input
                        className="reset-input3  reset-input-field form-control"
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="New password"
                        id="newPassword"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                      />
                      <svg
                        className="reset-input-icon"
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
                      <div className="reset-inputbox2"></div>
                    </div>
                    {showNewPassword ? (
                      <IoEyeOutline
                        className="reset-eye-icon"
                        onClick={toggleNewPasswordVisibility}
                      />
                    ) : (
                      <IoEyeOffOutline
                        className="reset-eye-icon"
                        onClick={toggleNewPasswordVisibility}
                      />
                    )}
                  </div>
                </div>

                <div className="form-group d-flex reset-input-icons pt-3">
                  <div className="reset-inputbox1"></div>
                  <div className="reset-line">
                    <div className="reset-input-container ">
                      <input
                        className="reset-input3  reset-input-field form-control"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                      />
                      <svg
                        className="reset-input-icon"
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
                    {showConfirmPassword ? (
                      <IoEyeOutline
                        className="reset-eye-icon"
                        onClick={toggleConfirmPasswordVisibility}
                      />
                    ) : (
                      <IoEyeOffOutline
                        className="reset-eye-icon"
                        onClick={toggleConfirmPasswordVisibility}
                      />
                    )}
                  </div>
                </div>
                <div className='reset-input-icons'>
                  {/* <button type="submit" className="reset-button  btn px-5" style={{ display: !showRedirect ? 'block' : 'none', }} disabled={!passwordsMatch} onChange={handleConfirmPasswordChange} >Update Password</button> */}
                  {/* <Link to='/' className="button-top" style={{ display: showRedirect ? 'block' : 'none', marginLeft: '220px', color: 'white', fontWeight: '700' }}>Please Login Again</Link> */}
                  <button type="submit" className="reset-button  btn px-5"  disabled={!passwordsMatch} onChange={handleConfirmPasswordChange} >Update Password</button>
                  {/* <Link to='/' className="reset-button  btn px-5" onChange={handleConfirmPasswordChange}>Update Password</Link> */}

                </div>
              </form>
            </div>
          </div>
          


          <div className="resetpage-second-box" style={{ width: '50%' }}>
            <div className="reset-second-box" style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              position: 'relative'
            }}>
              <img
                className='reset-image'
                src={resetBanner}
                alt="TEST"
                style={{
                  width: '100%',
                  height: '100%',

                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  width: '100%',
                  cursor: 'default'
                }}
              >
                <h6 className="reset-image-text" style={{ fontSize: '1.8rem' }}>
                  <strong>We are delighted to have you here</strong>
                </h6>
                <p
                  className="reset-image-text1 mt-2"
                  style={{
                    fontSize: '0.800rem',
                    textAlign: 'center'
                  }}
                >
                  Master the art of time management and execute your tasks with strategic finesse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resetpassword;


