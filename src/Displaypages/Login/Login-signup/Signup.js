import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import SignupBanner from "../../../img/login-bg.png";
import { Link, useNavigate } from "react-router-dom";
import Agtlogo from "../../../img/AGTlogoday.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiLock } from "react-icons/ci";
import { LuUser2 } from "react-icons/lu";
import { CiMail } from "react-icons/ci";
import { VscOrganization } from "react-icons/vsc";
import { MdCall } from "react-icons/md";

function Signuppage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    organizationEmail: "",
    mobileNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      let appUrl = window.location.origin 

      await axios.post(
        // process.env.REACT_APP_API_BASE_URL +"/api/v1/login/addUsers", 
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/login/addUsers?appUrl=${encodeURIComponent(appUrl)}`,
        {
        userName: `${formData.firstName} ${formData.lastName}`,
        password: formData.password,
        emailId: formData.email,
        companyName: formData.organization,
        companyEmail: formData.organizationEmail,
     
      });
      toast.success("User registered successfully!");
      // Redirect to login page after successful registration
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error(error.response?.data || "An error occurred during registration");
    }
  };

  const placeholders = [
    { name: "firstName", placeholder: 'First Name', icon: <LuUser2 size={20} color="hsla(0, 0%, 0%, 0.5)"/>, type: 'text' },
    { name: "lastName", placeholder: 'Last Name', icon: <LuUser2 size={20} color="hsla(0, 0%, 0%, 0.5)" />,  type: 'text' },
    { name: "email", placeholder: 'Email Address', icon: <CiMail size={20} color="hsla(0, 0%, 0%, 0.5)" /> ,  type: 'email' },
    { name: "organization", placeholder: 'Organization', icon: <VscOrganization size={20} color="hsla(0, 0%, 0%, 0.5)" /> ,  type: 'text' },
    { name: "organizationEmail", placeholder: 'Organization Email', icon: <CiMail size={20} color="hsla(0, 0%, 0%, 0.5)" /> ,  type: 'email' },
    { name: "mobileNumber", placeholder: 'Mobile Number', icon: <MdCall size={20} color="hsla(0, 0%, 0%, 0.5)" />, type: 'tel' },
    { name: "password", placeholder: 'Password', icon: <CiLock size={20} color="hsla(0, 0%, 0%, 0.5)" /> ,  type: 'password' }
  ];

  return (
    <div className="Signup-background-image">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        overflow: 'auto'
      }}>
        <div className="Signuppage-full-box" style={{
          width: '80%',
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row-reverse'
        }}>
          <div className="Signuppage-first-box" style={{
            height: '100%',
            position: 'relative'
          }}>
            <img
              className="Signupbanner-image"
              src={SignupBanner}
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
              <h6 className="Signup-image-text" style={{ fontSize: '1.8rem' }}><strong>We are delighted to have you here</strong></h6>
              <p className="Signup-image-text-p" style={{ fontSize: '0.800rem' }}>
                Master the art of time management and execute your tasks with strategic finesse.
              </p>
            </div>
          </div>

          <div style={{ width: '50%' }}>
            <div className="Signuppage-secound-box" style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0px',
              boxSizing: 'border-box'
            }}>
              <div className="container-fluid signuppage-logo-height d-flex justify-content-center align-items-start">
                <div className="text-center">
                  <img className="signuppage-logo" src={Agtlogo} alt="" />
                  <h4 className="signuppage-text mt-1 mb-4">Register</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="w-100">
                      {placeholders.map((item, index) => (
                        <div className="form-group signuppage-input-container mb-2" key={index}>
                          <div className="signuppage-blue-line"></div>
                          <div className="signuppage-input-icon">{item.icon}</div>
                          <input 
                            type={item.type} 
                            className="signuppage-form-control"  
                            placeholder={item.placeholder}
                            name={item.name}
                            value={formData[item.name]}
                            onChange={handleChange}
                          />
                        </div>
                      ))}
                    </div>
                    <button type="submit" className="signuppage-button btn btn-block mt-3">Register</button>
                  </form>
                  <p className="mt-3 text-center" style={{ color: "hsla(0, 0%, 0%, 1)" }}>
                    If already have an account? <Link to={'/'} className="signup-Login-button">Login</Link>
                  </p>
                </div>
              </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signuppage;