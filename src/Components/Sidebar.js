import React, { useState, useCallback ,useEffect} from "react";
import "../Styles/Sidebar.css";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { FormattedMessage } from "react-intl";
// import { hasPermission } from "../utils/permissions";
import { hasPermission } from '../utils/auth';
const Sidebar = ({ locale, setLocale }) => {
  const [activeLinks, setActiveLinks] = useState({
    Home: false,
    TimeSheet: false,
    project: false,
    Clients: false,
    organization: false,
    Expenses: false,
    Reports: false,
  });

  const handleLinkClick = useCallback((linkName) => {
    setActiveLinks((prevActiveLinks) => ({
      ...Object.keys(prevActiveLinks).reduce((acc, key) => {
        acc[key] = key === linkName;
        return acc;
      }, {}),
    }));
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const linkName = Object.keys(activeLinks).find((key) =>
      currentPath.includes(key.toLowerCase())
    );
    if (linkName) {
      handleLinkClick(linkName);
    }
  }, [ handleLinkClick]);



  const [isOpen, setIsOpen] = useState(false);
  // const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    setIsOpen(false);
  }, [window.location.pathname]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="side-and-top-bar ">
      <div className="topbar-component ">{/* <Topbar /> */}</div>
      <div className="sidebar-component d-flex flex-row ">
        <div
          className={
            isOpen
              ? "left-sidebar-expand d-flex flex-row"
              : "left-sidebar d-flex flex-row"
          }
        >
          <div className="left-sidebar-toggle">
            <ul>
              {hasPermission("home") && (
                <li
                  className={`d-flex flex-row ${
                    activeLinks["Home"] ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Home")}
                >
                  <Link
                    to="/home"
                    className={`sidebar-link ${
                      activeLinks["Home"] ? "clicked" : ""
                    }`}
                    alt="home icon"
                  >
                    <svg
                      className={`sidebar-icon ${
                        activeLinks["Home"] ? "clicked" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 18 18"
                      fill="white"
                    >
                      <path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0Z" />
                    </svg>
                    <span
                      className="sidebar-text ms-4"
                      style={{ display: isOpen ? "block" : "none" }}
                    >
                      <FormattedMessage id="Home" />
                    </span>
                  </Link>
                </li>
              )}

              {hasPermission("timesheet") && (
                <li
                  className={`d-flex flex-row ${
                    activeLinks["TimeSheet"] ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("TimeSheet")}
                >
                  <Link
                    to="/timesheet"
                    className={`sidebar-link ${
                      activeLinks["TimeSheet"] ? "clicked" : ""
                    }`}
                    alt="timesheet icon"
                  >
                    <svg
                      className={`sidebar-icon ${
                        activeLinks["TimeSheet"] ? "clicked" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 25 25"
                    >
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M22.7222 5.55564V5.05564H22.2222H20.6388V4.66675H22.3911C22.4865 4.66881 22.5806 4.68942 22.6682 4.72743C22.7569 4.76592 22.8371 4.82151 22.9043 4.89102C22.9716 4.96053 23.0244 5.0426 23.0599 5.13254C23.0954 5.22248 23.1128 5.31853 23.1111 5.41519L23.1111 5.41519V5.42369V20.9654H23.111L23.1111 20.9739C23.1128 21.0705 23.0954 21.1666 23.0599 21.2565C23.0244 21.3465 22.9715 21.4285 22.9043 21.498L23.2638 21.8456L22.9043 21.498C22.8371 21.5675 22.7569 21.6231 22.6682 21.6616C22.5806 21.6996 22.4865 21.7202 22.3911 21.7223H2.60882C2.5134 21.7202 2.41928 21.6996 2.33171 21.6616C2.24302 21.6231 2.16278 21.5675 2.09558 21.498C2.02837 21.4285 1.97552 21.3465 1.94004 21.2565C1.90455 21.1666 1.88714 21.0705 1.88878 20.9739H1.88885V20.9654V5.42369H1.88892L1.88878 5.4152C1.88714 5.31852 1.90455 5.22248 1.94004 5.13254C1.97552 5.0426 2.02837 4.96053 2.09558 4.89102C2.16278 4.82151 2.24302 4.76592 2.33171 4.72743C2.41929 4.68942 2.51342 4.66881 2.60884 4.66675H4.36107V5.05564H2.77774H2.27774V5.55564V20.8334V21.3334H2.77774H22.2222H22.7222V20.8334V5.55564Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M6.05566 10.2222H6.44455V10.6111H6.05566V10.2222Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M10.2227 10.2222H10.6115V10.6111H10.2227V10.2222Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M14.3887 10.2222H14.7776V10.6111H14.3887V10.2222Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M18.5557 10.2222H18.9446V10.6111H18.5557V10.2222Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M6.05566 13.6943H6.44455V14.0832H6.05566V13.6943Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M10.2227 13.6943H10.6115V14.0832H10.2227V13.6943Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M14.3887 13.6943H14.7776V14.0832H14.3887V13.6943Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M18.5557 13.6943H18.9446V14.0832H18.5557V13.6943Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M6.05566 17.1667H6.44455V17.5556H6.05566V17.1667Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M10.2227 17.1667H10.6115V17.5556H10.2227V17.1667Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M14.3887 17.1667H14.7776V17.5556H14.3887V17.1667Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M18.5557 17.1667H18.9446V17.5556H18.5557V17.1667Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M7.08194 6.38752C7.04547 6.42399 6.99601 6.44447 6.94444 6.44447C6.89287 6.44447 6.84342 6.42399 6.80695 6.38752C6.77049 6.35105 6.75 6.3016 6.75 6.25003V2.08336C6.75 2.03179 6.77049 1.98233 6.80695 1.94587C6.84342 1.9094 6.89287 1.88892 6.94444 1.88892C6.99601 1.88892 7.04547 1.9094 7.08194 1.94587L7.43549 1.59231L7.08194 1.94587C7.1184 1.98233 7.13889 2.03179 7.13889 2.08336V6.25003C7.13889 6.3016 7.1184 6.35105 7.08194 6.38752Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M18.1933 6.38752C18.1568 6.42399 18.1073 6.44447 18.0558 6.44447C18.0042 6.44447 17.9547 6.42399 17.9183 6.38752C17.8818 6.35106 17.8613 6.3016 17.8613 6.25003V2.08336C17.8613 2.03179 17.8818 1.98233 17.9183 1.94587C17.9547 1.9094 18.0042 1.88892 18.0558 1.88892C18.1073 1.88892 18.1568 1.9094 18.1933 1.94587C18.2297 1.98233 18.2502 2.03179 18.2502 2.08336V6.25003C18.2502 6.3016 18.2297 6.35106 18.1933 6.38752Z"
                        stroke="white"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["TimeSheet"] ? "clicked" : ""
                        }`}
                        d="M9.52734 4.66675H15.4718V5.05564H9.52734V4.66675Z"
                        stroke="white"
                      />
                    </svg>

                    <span
                      className="sidebar-text"
                      style={{ display: isOpen ? "block" : "none" }}
                    >
                      <FormattedMessage id="Timesheet" />
                    </span>
                  </Link>
                </li>
              )}

              {hasPermission("organization") && (
                <li
                  className={`d-flex flex-row ${
                    activeLinks["organization"] ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("organization")}
                >
                  <Link
                    to="/organization"
                    className={`sidebar-link ${
                      activeLinks["organization"] ? "clicked" : ""
                    }`}
                    alt="organization icon"
                  >
                    <svg
                      className={`sidebar-icon ${
                        activeLinks["organization"] ? "clicked" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 25 25"
                      fill="white"
                    >
                      <path d="M11.4101 11.5903C10.4486 11.5903 9.50879 11.3052 8.70938 10.771C7.90998 10.2369 7.28692 9.47767 6.91899 8.58942C6.55106 7.70117 6.4548 6.72376 6.64236 5.7808C6.82993 4.83784 7.29291 3.97167 7.97275 3.29183C8.65259 2.61199 9.51875 2.14902 10.4617 1.96145C11.4047 1.77388 12.3821 1.87015 13.2703 2.23807C14.1586 2.606 14.9178 3.22906 15.4519 4.02847C15.9861 4.82787 16.2712 5.76772 16.2712 6.72916C16.2712 8.0184 15.759 9.25485 14.8474 10.1665C13.9358 11.0781 12.6993 11.5903 11.4101 11.5903ZM11.4101 3.31249C10.7233 3.31249 10.052 3.51613 9.48101 3.89766C8.91 4.2792 8.46496 4.82148 8.20216 5.45595C7.93935 6.09041 7.87059 6.78856 8.00457 7.46211C8.13854 8.13565 8.46924 8.75434 8.95484 9.23994C9.44044 9.72554 10.0591 10.0562 10.7327 10.1902C11.4062 10.3242 12.1044 10.2554 12.7388 9.99263C13.3733 9.72982 13.9156 9.28478 14.2971 8.71377C14.6787 8.14277 14.8823 7.47145 14.8823 6.78471C14.8823 6.32873 14.7925 5.87722 14.618 5.45595C14.4435 5.03468 14.1877 4.6519 13.8653 4.32948C13.5429 4.00705 13.1601 3.75129 12.7388 3.5768C12.3176 3.4023 11.8661 3.31249 11.4101 3.31249ZM15.2781 12.4305C11.5201 11.5849 7.58856 11.9922 4.08368 13.5903C3.60166 13.8205 3.19498 14.183 2.91097 14.6354C2.62697 15.0878 2.47734 15.6116 2.47952 16.1458V20.2778C2.47952 20.369 2.49748 20.4593 2.53238 20.5435C2.56728 20.6278 2.61843 20.7043 2.68291 20.7688C2.7474 20.8333 2.82395 20.8845 2.90821 20.9194C2.99246 20.9543 3.08276 20.9722 3.17396 20.9722C3.26516 20.9722 3.35546 20.9543 3.43971 20.9194C3.52397 20.8845 3.60052 20.8333 3.66501 20.7688C3.72949 20.7043 3.78064 20.6278 3.81554 20.5435C3.85044 20.4593 3.8684 20.369 3.8684 20.2778V16.1458C3.86236 15.8755 3.93536 15.6092 4.07846 15.3798C4.22156 15.1503 4.42852 14.9677 4.67396 14.8542C6.78526 13.8793 9.0846 13.3791 11.4101 13.3889C12.7131 13.3872 14.0116 13.5411 15.2781 13.8472V12.4305ZM15.3753 19.0347H19.6392V20.0069H15.3753V19.0347Z" />
                      <path d="M23.0349 14.9097H19.4447V16.2986H22.3405V22.1111H12.5002V16.2986H16.8752V16.5903C16.8752 16.7745 16.9484 16.9511 17.0786 17.0813C17.2088 17.2116 17.3855 17.2847 17.5697 17.2847C17.7538 17.2847 17.9305 17.2116 18.0607 17.0813C18.1909 16.9511 18.2641 16.7745 18.2641 16.5903V13.8889C18.2641 13.7047 18.1909 13.5281 18.0607 13.3979C17.9305 13.2676 17.7538 13.1945 17.5697 13.1945C17.3855 13.1945 17.2088 13.2676 17.0786 13.3979C16.9484 13.5281 16.8752 13.7047 16.8752 13.8889V14.9097H11.8058C11.6216 14.9097 11.445 14.9829 11.3147 15.1131C11.1845 15.2434 11.1113 15.42 11.1113 15.6042V22.8056C11.1113 22.9897 11.1845 23.1664 11.3147 23.2966C11.445 23.4268 11.6216 23.5 11.8058 23.5H23.0349C23.2191 23.5 23.3958 23.4268 23.526 23.2966C23.6562 23.1664 23.7294 22.9897 23.7294 22.8056V15.6042C23.7294 15.42 23.6562 15.2434 23.526 15.1131C23.3958 14.9829 23.2191 14.9097 23.0349 14.9097Z" />
                    </svg>
                    <span
                      className="sidebar-text"
                      style={{ display: isOpen ? "block" : "none" }}
                    >
                      <FormattedMessage id="Employee" />
                    </span>
                  </Link>
                </li>
              )}

              {hasPermission("project") && (
                <li
                  className={`d-flex flex-row ${
                    activeLinks["project"] ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("project")}
                >
                  <Link
                    to="/project"
                    className={`sidebar-link ${
                      activeLinks["project"] ? "clicked" : ""
                    }`}
                    alt="Projects icon"
                  >
                    <svg
                      className={`sidebar-icon ${
                        activeLinks["project"] ? "clicked" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      stroke=""
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path
                        className={`sidebar-icon ${
                          activeLinks["project"] ? "clicked" : ""
                        }`}
                        d="M17.2523 12.4899C16.9683 14.8549 15.4193 15.7999 14.7503 16.4859C14.0803 17.1739 14.2003 17.3109 14.2453 18.3199C14.2528 18.4447 14.2346 18.5698 14.192 18.6873C14.1493 18.8049 14.083 18.9125 13.9972 19.0034C13.9114 19.0944 13.8079 19.1668 13.693 19.2163C13.5781 19.2657 13.4543 19.2911 13.3293 19.2909H10.6713C10.5462 19.2909 10.4224 19.2655 10.3076 19.216C10.1927 19.1665 10.0892 19.0941 10.0033 19.0032C9.91744 18.9122 9.85105 18.8047 9.80822 18.6872C9.7654 18.5697 9.74703 18.4447 9.75425 18.3199C9.75425 17.3299 9.84625 17.0999 9.25025 16.4859C8.49025 15.7259 6.70225 14.6529 6.70225 11.7019C6.69769 10.9689 6.84502 10.2429 7.13496 9.56963C7.42491 8.8964 7.85118 8.29053 8.3869 7.79022C8.92262 7.2899 9.55618 6.90599 10.2476 6.66269C10.9391 6.41938 11.6735 6.32196 12.4044 6.37656C13.1354 6.43116 13.8472 6.63659 14.4948 6.97992C15.1424 7.32324 15.7119 7.79701 16.1674 8.37136C16.6228 8.9457 16.9544 9.60817 17.1411 10.317C17.3278 11.0258 17.3657 11.7657 17.2523 12.4899Z"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        className={`sidebar-icon ${
                          activeLinks["project"] ? "clicked" : ""
                        }`}
                        d="M10.46 19.236V20.748C10.46 21.161 10.69 21.5 10.973 21.5H13.026C13.311 21.5 13.54 21.16 13.54 20.748V19.236M11.22 8.69595C10.6295 8.69622 10.0633 8.93097 9.64588 9.34858C9.22845 9.7662 8.99396 10.3325 8.99396 10.923M19.332 11.904H21.166M17.486 5.89195L18.787 4.59095M18.486 17L19.787 18.3M12 2.37695V3.85995M5.23996 4.58995L6.53196 5.89195M4.23996 18.3L5.53196 17M4.66796 11.904H2.83496"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span
                      className="sidebar-text"
                      style={{ display: isOpen ? "block" : "none" }}
                    >
                      <FormattedMessage id="Projects" />
                    </span>
                  </Link>
                </li>
              )}

              {hasPermission("clients") && (
                <li
                  className={`d-flex flex-row ${
                    activeLinks["Clients"] ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Clients")}
                >
                  <Link
                    to="/clients"
                    className={`sidebar-link ${
                      activeLinks["Clients"] ? "clicked" : ""
                    }`}
                    alt="organization icon"
                  >
                    <svg
                      className={`sidebar-icon ${
                        activeLinks["Clients"] ? "clicked" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 5C11.0717 5 10.1815 5.36875 9.52513 6.02513C8.86875 6.6815 8.5 7.57174 8.5 8.5C8.5 9.42826 8.86875 10.3185 9.52513 10.9749C10.1815 11.6313 11.0717 12 12 12C12.9283 12 13.8185 11.6313 14.4749 10.9749C15.1313 10.3185 15.5 9.42826 15.5 8.5C15.5 7.57174 15.1313 6.6815 14.4749 6.02513C13.8185 5.36875 12.9283 5 12 5ZM12 7C12.3978 7 12.7794 7.15804 13.0607 7.43934C13.342 7.72064 13.5 8.10218 13.5 8.5C13.5 8.89782 13.342 9.27936 13.0607 9.56066C12.7794 9.84196 12.3978 10 12 10C11.6022 10 11.2206 9.84196 10.9393 9.56066C10.658 9.27936 10.5 8.89782 10.5 8.5C10.5 8.10218 10.658 7.72064 10.9393 7.43934C11.2206 7.15804 11.6022 7 12 7ZM5.5 8C4.83696 8 4.20107 8.26339 3.73223 8.73223C3.26339 9.20107 3 9.83696 3 10.5C3 11.44 3.53 12.25 4.29 12.68C4.65 12.88 5.06 13 5.5 13C5.94 13 6.35 12.88 6.71 12.68C7.08 12.47 7.39 12.17 7.62 11.81C6.89148 10.8606 6.49767 9.69672 6.5 8.5V8.22C6.2 8.08 5.86 8 5.5 8ZM18.5 8C18.14 8 17.8 8.08 17.5 8.22V8.5C17.5 9.7 17.11 10.86 16.38 11.81C16.5 12 16.63 12.15 16.78 12.3C17.2412 12.7471 17.8577 12.998 18.5 13C18.94 13 19.35 12.88 19.71 12.68C20.47 12.25 21 11.44 21 10.5C21 9.83696 20.7366 9.20107 20.2678 8.73223C19.7989 8.26339 19.163 8 18.5 8ZM12 14C9.66 14 5 15.17 5 17.5V19H19V17.5C19 15.17 14.34 14 12 14ZM4.71 14.55C2.78 14.78 0 15.76 0 17.5V19H3V17.07C3 16.06 3.69 15.22 4.71 14.55ZM19.29 14.55C20.31 15.22 21 16.06 21 17.07V19H24V17.5C24 15.76 21.22 14.78 19.29 14.55ZM12 16C13.53 16 15.24 16.5 16.23 17H7.77C8.76 16.5 10.47 16 12 16Z" />
                    </svg>
                    <span
                      className="sidebar-text"
                      style={{ display: isOpen ? "block" : "none" }}
                    >
                      <FormattedMessage id="Customers" />
                    </span>
                  </Link>
                </li>
              )}
              {hasPermission("reports") && (
                <li
                  className={`d-flex flex-row ${
                    activeLinks["Reports"] ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Reports")}
                >
                  <Link
                    to="/reports"
                    className={`sidebar-link ${
                      activeLinks["Reports"] ? "clicked" : ""
                    }`}
                    alt="Reports icon"
                  >
                    <svg
                      className={`sidebar-icon ${
                        activeLinks["Reports"] ? "clicked" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path
                        className={`sidebar-icon ${
                          activeLinks["Reports"] ? "clicked" : ""
                        }`}
                        d="M9 21H15M9 21V16M9 21H3.6C3.44087 21 3.28826 20.9368 3.17574 20.8243C3.06321 20.7117 3 20.5591 3 20.4V16.6C3 16.4409 3.06321 16.2883 3.17574 16.1757C3.28826 16.0632 3.44087 16 3.6 16H9M15 21V9M15 21H20.4C20.5591 21 20.7117 20.9368 20.8243 20.8243C20.9368 20.7117 21 20.5591 21 20.4V3.6C21 3.44087 20.9368 3.28826 20.8243 3.17574C20.7117 3.06321 20.5591 3 20.4 3H15.6C15.4409 3 15.2883 3.06321 15.1757 3.17574C15.0632 3.28826 15 3.44087 15 3.6V9M9 16V9.6C9 9.44087 9.06321 9.28826 9.17574 9.17574C9.28826 9.06321 9.44087 9 9.6 9H15"
                        stroke="white"
                      />
                    </svg>
                    <span
                      className="sidebar-text"
                      style={{ display: isOpen ? "block" : "none" }}
                    >
                      <FormattedMessage id="Reports" />
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="top_section d-flex align-items-center justify-content-center">
            <div
              className="sidebar-right-arrow-left d-flex align-items-center justify-content-center"
              onClick={toggle}
            >
              <IoIosArrowForward className="bars" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
