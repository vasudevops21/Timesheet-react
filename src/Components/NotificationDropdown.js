import React, { useState, useEffect, useRef } from 'react';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <svg
        onClick={toggleDropdown}
        className="notification-icon"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
       <g id="style=stroke">
                    <g id="notification-bell">
                      <path
                        id="vector (Stroke)"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.87378 18.6934C9.28799 18.6934 9.62378 19.0291 9.62378 19.4434C9.62378 19.6166 9.66765 19.7955 9.76263 19.9722C9.85831 20.15 10.0063 20.3258 10.21 20.4827C10.4138 20.6396 10.6653 20.7712 10.9534 20.8631C11.2413 20.955 11.5544 21.0035 11.8734 21.0035C12.1923 21.0035 12.5054 20.955 12.7933 20.8631C13.0814 20.7712 13.3329 20.6396 13.5367 20.4827C13.7404 20.3258 13.8884 20.15 13.9841 19.9722C14.0791 19.7955 14.1229 19.6166 14.1229 19.4434C14.1229 19.0291 14.4587 18.6934 14.8729 18.6934C15.2871 18.6934 15.6229 19.0291 15.6229 19.4434C15.6229 19.8769 15.5116 20.2987 15.3051 20.6827C15.0993 21.0653 14.8054 21.3989 14.452 21.6711C14.0987 21.9431 13.6889 22.1519 13.2492 22.2922C12.8093 22.4325 12.3422 22.5035 11.8734 22.5035C11.4045 22.5035 10.9374 22.4325 10.4975 22.2922C10.0578 22.1519 9.64798 21.9431 9.29471 21.6711C8.94129 21.3989 8.64739 21.0653 8.44158 20.6827C8.23509 20.2987 8.12378 19.8769 8.12378 19.4434C8.12378 19.0291 8.45957 18.6934 8.87378 18.6934Z"
                      />
                      <path
                        id="vector (Stroke)_2"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.28966 2.36993C10.5476 1.24631 13.1934 1.20809 15.4828 2.26601L15.6874 2.36056C18.0864 3.46909 19.6223 5.87083 19.6223 8.51353L19.6223 9.82417C19.6223 10.8777 19.8519 11.9185 20.2951 12.8742L20.5598 13.445C21.7754 16.0663 20.1923 19.1303 17.3509 19.6555L17.2146 18.918L17.3509 19.6555L17.1907 19.6851C13.6756 20.3349 10.0711 20.3349 6.55594 19.6851C3.6763 19.1529 2.15285 15.967 3.54631 13.3914L3.77272 12.9729C4.3316 11.9399 4.62426 10.7839 4.62426 9.60942L4.62426 8.28813C4.62426 5.77975 6.04397 3.48746 8.28966 2.36993ZM14.8536 3.62766C12.9772 2.76057 10.8086 2.7919 8.95794 3.71284C7.22182 4.57679 6.12426 6.34893 6.12426 8.28813L6.12426 9.60942C6.12426 11.0332 5.76949 12.4345 5.09201 13.6867L4.86561 14.1052C3.95675 15.785 4.95039 17.863 6.82857 18.2101C10.1635 18.8265 13.5832 18.8265 16.9181 18.2101L17.0783 18.1805C18.9561 17.8334 20.0024 15.8084 19.199 14.076L18.9343 13.5053C18.3994 12.3518 18.1223 11.0956 18.1223 9.82416L18.1223 8.51353C18.1223 6.45566 16.9263 4.58543 15.0582 3.72221L14.8536 3.62766Z"
                      />
                    </g>
                  </g>
                </svg>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li>Notification 1</li>
            <li>Notification 2</li>
            <li>Notification 3</li>
            <li>Notification 1</li>
            <li>Notification 2</li>
            <li>Notification 3</li>
            <li>Notification 1</li>
            <li>Notification 2</li>
            <li>Notification 3</li>
            <li>Notification 1</li>
            <li>Notification 2</li>
            <li>Notification 3</li>
          </ul>
        </div>
      )}
    </div>
  );
}
