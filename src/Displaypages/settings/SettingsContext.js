import React, { createContext, useState } from 'react';
import defaultImage from './Settingprofile.png';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [imagePreview, setImagePreview] = useState(defaultImage);
  const [companyLogo, setCompanyLogo] = useState(null);

  const fileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast('File size exceeds the maximum limit of 1MB.');
        event.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setCompanyLogo(file);
    }
  };

  const contextValue = {
    imagePreview,
    setImagePreview,
    companyLogo,
    setCompanyLogo,
    fileInputRef,
    handleButtonClick,
    handleFileChange,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};