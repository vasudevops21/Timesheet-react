import React, { useEffect, useRef, useState, useContext } from "react";
import "./GeneralSettings.css";
import Topbar from "../../Components/Topbar";
import Sidebar from "../../Components/Sidebar";
import SettingTopBar from "./SettingTopBar";
import { IoCallOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormattedMessage } from "react-intl";
import axios from "axios";
import ProfileImageContext from "../../Components/ProfileImageContext";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDateFormat } from "../Project/DateFormatContext";
import { IoLocationOutline } from "react-icons/io5";
import { GoOrganization } from "react-icons/go";
import { useTimeFormat } from "./TimeFormatContext";
import moment from "moment-timezone";

const americanCountries = [
  {
    name: "United States",
    timezones: moment.tz.names().filter((tz) => tz.startsWith("US/")),
  },
  {
    name: "Canada",
    timezones: moment.tz.names().filter((tz) => tz.startsWith("Canada/")),
  },
];

function GeneralSettings({
  locale,
  setLocale,
  onTimesheetCycleChange,
  timesheetCycle: initialTimesheetCycle,
}) {
  const [settingId, setSettingId] = useState("");
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [timeFormat, setTimeFormat] = useState("");
  // const [dateFormat, setDateFormat] = useState("");
  const [standardWorkHoursPerDay, setStandardWorkHoursPerDay] = useState("");
  const [standardWorkdaysPerWeek, setStandardWorkdaysPerWeek] = useState("");
  const [dailyOvertime, setDailyOvertime] = useState(false);
  const [restdayOvertime, setRestdayOvertime] = useState(false);
  const [dailyDoubleOvertime, setDailyDoubleOvertime] = useState(false);
  const [publicHolidayOvertime, setPublicHolidayOvertime] = useState(false);
  const [weeklyOvertime, setWeeklyOvertime] = useState(false);
  const [billable, setBillable] = useState(true);
  const [billableRate, setBillableRate] = useState(0);
  const [language, setLanguage] = useState("");
  const [currency, setCurrency] = useState("");
  const [autoSave, setAutoSave] = useState(false);
  const [expenseTracking, setExpenseTracking] = useState(false);
  const [costRate, setCostRate] = useState(false);
  const [captureScreensheets, setCaptureScreensheets] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [employee, setEmployee] = useState(null);
  const { setCompanyLogo: setContextCompanyLogo } =
    useContext(ProfileImageContext);
  const { setCompanyName: setContextCompanyName } =
    useContext(ProfileImageContext);
  const [editMode, setEditMode] = useState(false);
  const [timesheetCycle, setTimesheetCycle] = useState(initialTimesheetCycle);
  const ref = React.useRef();
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);
  const [startDay, setStartDay] = useState(0);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const imgRef = useRef(null);
  const { dateFormat, setDateFormat } = useDateFormat();
  const { timeFormat: contextTimeFormat, setTimeFormat: setContextTimeFormat } =
    useTimeFormat();
  const [selectedTimezone, setSelectedTimezone] = useState("");

  useEffect(() => {
    (async () => {
      await LoadGeneralSettings();
    })();
  }, []);

  useEffect(() => {
    // When component mounts, set the context timeFormat to match the component state
    setContextTimeFormat(timeFormat);
  }, []);

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast("File size exceeds the maximum limit of 1MB.");
        event.target.value = null;
        return;
      }
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  }

  function getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    // Fill the canvas with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  }

  async function handleCropComplete(crop) {
    setCompletedCrop(crop);
  }

  async function handleSaveCrop() {
    if (completedCrop && imgRef.current) {
      const croppedImageBlob = await getCroppedImg(
        imgRef.current,
        completedCrop
      );
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
      setImagePreview(croppedImageUrl);
      setCompanyLogo(croppedImageBlob);
    } else {
      // If no cropping was done, use the original file
      setCompanyLogo(originalFile);
    }
    setShowCropModal(false);
  }

  async function LoadGeneralSettings() {
    try {
      const userInfoString = localStorage.getItem("userInfo");
      const userInfo = JSON.parse(userInfoString);
      const result = await axios.get(
        process.env.REACT_APP_API_BASE_URL +
          `/api/v1/settings/getGeneralSettingInfo`
        // process.env.REACT_APP_API_BASE_URL +
        //   `/api/v1/settings/getGeneralSettingInfo/${userInfo["employeeId"]}`
      );
      console.log("Result value", result);
      loadGeneralSettingData(result.data);
      setCompanyLogo(result.data.companyLogo);
      setTimesheetCycle(result.data.timesheetCycle);
    } catch (error) {
      console.error("Error fetching settings info");
    }
  }

  function isValidEmail(email) {
    // Define a regular expression pattern for email validation.
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  const loadGeneralSettingData = (data) => {
    setSettingId(data.settingsId);
    setCompanyName(data.companyName);
    setAddress(data.address);
    setBillable(data.billable);
    setBillableRate(data.billableRate);
    setTimeFormat(data.timeFormat);
    setCaptureScreensheets(data.captureScreenshot);
    setLanguage(data.language);
    setCurrency(data.currency);
    setDailyDoubleOvertime(data.dailyDoubleOverTime);
    setDailyOvertime(data.dailyOverTime);
    setDateFormat(data.dateFormat);
    setPublicHolidayOvertime(data.publicHolidayOverTime);
    setExpenseTracking(data.expenseTracking);
    setPhone(data.contactNumber);
    setWebsite(data.website);
    setAutoSave(data.autoSave);
    setStartDay(data.workDaysPerWeek);
    setStandardWorkHoursPerDay(data.workHoursPerDay);
    setCountry(data.country);
    setEmployee(data.employee);
    setWeeklyOvertime(data.weeklyOvertime);
    setTimesheetCycle(data.timesheetCycle);
    setSelectedTimezone(data.timezone ? data.timezone.split(" - ")[1] : "");

    if (data.companyLogo) {
      setImagePreview(`data:image/jpeg;base64,${data.companyLogo}`);
    } else {
      setImagePreview(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleStartDayChange = (event) => {
    setStartDay(parseInt(event.target.value));
  };

  const handleEmailChange = (event) => {
    if (isValidEmail(event.target.value)) {
      setWebsite(event.target.value);
    }
  };

  const handleModifySettings = () => {
    setEditMode(true); // Enter edit mode
  };

  // Modify your existing handleTimeFormatChange function
  const handleTimeFormatChange = (event) => {
    const newTimeFormat = event.target.value;
    setTimeFormat(newTimeFormat);
    setContextTimeFormat(newTimeFormat);
  };

  async function handleSaveAndClose(event) {
    // Handle saving settings
    onTimesheetCycleChange(timesheetCycle);
    setEditMode(false); // Exit edit mode
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", companyLogo);

    const selectedTimezoneWithUTC = americanCountries
      .find((c) => c.name === country)
      ?.timezones.find((tz) => tz.name === selectedTimezone);

    const settingData = {
      settingsId: settingId,
      companyName: companyName,
      contactNumber: phone,
      address: address,
      country: country,
      timezone: selectedTimezone
        ? `${moment.tz(selectedTimezone).format("UTC Z")} - ${selectedTimezone}`
        : null,
      timeFormat: timeFormat,
      dateFormat: dateFormat,
      workHoursPerDay: standardWorkHoursPerDay,
      workDaysPerWeek: startDay,
      dailyOverTime: dailyOvertime,
      restDayOverTime: restdayOvertime,
      dailyDoubleOverTime: dailyDoubleOvertime,
      publicHolidayOvertime: publicHolidayOvertime,
      weeklyOvertime: weeklyOvertime,
      billableStatus: billable,
      currency: currency,
      captureScreenshot: captureScreensheets,
      autoSave: autoSave,
      website: website,
      employee: employee,
      timesheetCycle: timesheetCycle,
    };
    const data = JSON.stringify(settingData);
    const blob = new Blob([data], {
      type: "application/json",
    });
    formData.append("settingDTO", blob);
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_BASE_URL +
          "/api/v1/settings/updateGeneralSetting",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast(<FormattedMessage id="settingUpdatedSuccess"></FormattedMessage>);
      loadGeneralSettingData();
      setContextCompanyLogo(response.data.companyLogo);
      setContextCompanyName(response.data.companyName);
    } catch (err) {}
  }

  const handleTimesheetCycleChange = (e) => {
    const selectedCycle = e.target.value;
    setTimesheetCycle(selectedCycle);
    // localStorage.setItem("timesheetCycle", selectedCycle);
  };

  const getCompanyInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length === 1) {
      return name.slice(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000} // 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Topbar
        locale={locale}
        setLocale={setLocale}
        companyLogo={imagePreview}
      />
      <div className="d-flex">
        <Sidebar locale={locale} setLocale={setLocale} />
        <div className="settings-general-body ">
          <SettingTopBar locale={locale} setLocale={setLocale} />
          <>
            {/* <Grid container spacing={1}> */}
            <div className="settings-full">
              <div className="settings-general-allcontent row d-flex ">
                <div className="settings-genaral-columnone col-md-3">
                  <div className="settings-general-details-content">
                    <h2 className="settings-general-heading-company font-weight-bold">
                      <FormattedMessage id="companyLogo" />
                    </h2>
                    <p className="settings-general-paragraph-text">
                      <FormattedMessage id="acceptedFormats" />
                    </p>
                    <div className="d-flex gap-2">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="settings-general-image-preview"
                        />
                      ) : (
                        <div
                          className="settings-general-image-placeholder d-flex align-items-center justify-content-center"
                          style={{
                            width: "55px",
                            height: "55px",
                            borderRadius: "50%",
                            backgroundColor: "#f0f0f0",
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {getCompanyInitials(companyName)}
                        </div>
                      )}
                      <input
                        type="file"
                        accept=".png,.jpg,.gif"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={!editMode}
                      />
                      <button
                        className="settings-general-image-button"
                        onClick={handleButtonClick}
                        disabled={!editMode}
                      >
                        <FormattedMessage id="uploadImage" />
                      </button>
                    </div>

                    {showCropModal && (
                      <div className="crop-modal">
                        <ReactCrop
                          src={imagePreview}
                          crop={crop}
                          onChange={(newCrop) => setCrop(newCrop)}
                          onComplete={handleCropComplete}
                        >
                          <img
                            ref={imgRef}
                            src={imagePreview}
                            alt="Crop preview"
                            style={{ maxHeight: "70vh" }}
                          />
                        </ReactCrop>
                        <div className="crop-modal-buttons">
                          <button onClick={handleSaveCrop}>Save</button>
                          <button onClick={() => setShowCropModal(false)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <div>
                        <h4 className="settings-general-heading-text font-weight-bold">
                          <FormattedMessage id="Company Name" />
                        </h4>
                        <div className="d-flex gap-2 ms-5">
                          <div>
                            <GoOrganization />
                          </div>

                          {editMode ? (
                            <input
                              className="settings-general-heading-name font-weight-bold px-2"
                              type="text"
                              placeholder="Company Name"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                            />
                          ) : (
                            <input
                              className="settings-general-heading-name-edit font-weight-bold"
                              type="text"
                              value={companyName}
                              readOnly
                            />
                          )}
                        </div>
                      </div>

                      {/* <div className="settings-general-company-details-container"> */}
                      <h4 className="settings-general-heading-text font-weight-bold">
                        <FormattedMessage id="addressInfo" />
                      </h4>
                      <div className="ms-5">
                        <div className="d-flex gap-2 mt-2">
                          <div>
                            <IoLocationOutline />
                          </div>
                          {editMode ? (
                            <div>
                              <input
                                className="settings-general-heading-address-edit px-2"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            </div>
                          ) : (
                            <div>
                              <input
                                className="settings-general-heading-address"
                                type="text"
                                value={address}
                                readOnly
                              />
                            </div>
                          )}
                        </div>

                        <div className="d-flex gap-3 mt-2">
                          <div className="settings-general-company-details-icon">
                            <IoCallOutline />
                          </div>
                          {editMode ? (
                            <input
                              className="settings-general-company-details-edit px-2"
                              type="text"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          ) : (
                            <input
                              className="settings-general-company-details"
                              type="text"
                              value={phone}
                              readOnly
                            />
                          )}
                        </div>

                        <div className="d-flex gap-3 mt-2">
                          <div className="settings-general-company-details-icon1">
                            <CiMail />
                          </div>
                          {editMode ? (
                            <input
                              className={`settings-general-company-details-edit px-2 ${
                                isValidEmail(website)
                                  ? "border-default"
                                  : "border-red"
                              }`}
                              type="text"
                              value={website}
                              onChange={handleEmailChange}
                            />
                          ) : (
                            <input
                              className="settings-general-company-details1"
                              type="text"
                              value={website}
                              readOnly
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        {!editMode && (
                          <button
                            className="settings-general-modify-button"
                            onClick={handleModifySettings}
                          >
                            <FormattedMessage id="modifySettings" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {editMode && (
                    <div>
                      <button
                        className="settings-general-save-button"
                        onClick={handleSaveAndClose}
                      >
                        <FormattedMessage id="save" />
                      </button>
                      <button
                        className="settings-general-close-button"
                        onClick={() => setEditMode(false)}
                      >
                        <FormattedMessage id="close" />
                      </button>
                    </div>
                  )}
                </div>

                <div
                  className="settings-genaral-columntwo mt-2 col-md-5"
                  style={{
                    borderLeft: "1px solid #D9D9D9",
                    borderRight: "1px solid #D9D9D9",
                    marginTop: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <div className="settings-general-local-content">
                    <div className="settings-general-local-text">
                      <h2 className="settings-general-textsize font-weight-bold">
                        <FormattedMessage id="localSettings" />
                      </h2>
                      {editMode ? (
                        <div className="settings-general-space-text">
                          <div className="settings-general-input-container">
                            <label className="settings-general-label">
                              <FormattedMessage id="countryRegion" />
                            </label>
                            <select
                              className="settings-general-input-edit"
                              type="text"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                            >
                              <option value=""></option>
                              <option value="United States">
                                United States
                              </option>
                              <option value="Canada">Canada</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="settings-general-space-text">
                          <div className="settings-general-input-container">
                            <label className="settings-general-label">
                              <FormattedMessage id="countryRegion" />
                            </label>
                            <select
                              className="settings-general-input"
                              type="text"
                              value={country}
                              readOnly
                            >
                              <option value=""></option>
                              <option value="United States">
                                United States
                              </option>
                              <option value="Canada">Canada</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div className="settings-general-space-timezone ">
                        <div className="settings-general-input-container">
                          <label className="settings-general-label">
                            <FormattedMessage id="timeZone" />
                          </label>
                          <select
                            className="settings-general-input-edit"
                            value={selectedTimezone}
                            onChange={(e) =>
                              setSelectedTimezone(e.target.value)
                            }
                            disabled={!editMode || !country}
                          >
                            <option value="">Select a timezone</option>
                            {country &&
                              americanCountries
                                .find((c) => c.name === country)
                                ?.timezones.map((tz) => (
                                  <option key={tz} value={tz}>
                                    {`${moment.tz(tz).format("UTC Z")} - ${tz}`}
                                  </option>
                                ))}
                          </select>
                        </div>
                      </div>

                      <h2 className="settings-general-textsize font-weight-bold mt-3">
                        <FormattedMessage id="displaySettings" />
                      </h2>
                      {editMode ? (
                        <div className="settings-general-space-timeformat">
                          <div className="settings-general-input-container">
                            <label className="settings-general-label">
                              <FormattedMessage id="timeFormat" />
                            </label>
                            <select
                              className="setting-timeFormat-dropdown"
                              autoComplete="off"
                              fullWidth
                              id="Timeformat"
                              value={timeFormat}
                              onChange={handleTimeFormatChange}
                              // onChange={(event) => {
                              //   setTimeFormat(event.target.value);
                              // }}
                            >
                              <option value=""></option>
                              <option value="12-hours">12-hours</option>
                              <option value="24-hours">24-hours</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="settings-general-space-timeformat">
                          <div className="settings-general-input-container">
                            <label className="settings-general-label">
                              <FormattedMessage id="timeFormat" />
                            </label>
                            <select
                              className="setting-timeFormat-dropdown"
                              autoComplete="off"
                              fullWidth
                              id="Timeformat"
                              value={timeFormat}
                              onChange={(event) => {
                                setTimeFormat(event.target.value);
                              }}
                              disabled
                            >
                              <option value=""></option>
                              <option value="12-hours">12-hours</option>
                              <option value="24-hours">24-hours</option>
                            </select>
                          </div>
                        </div>
                      )}
                      {editMode ? (
                        <div className="settings-general-space-dateformat">
                          <div className="settings-general-input-container">
                            <label className="settings-general-label">
                              <FormattedMessage id="dateFormat" />
                            </label>
                            <select
                              className="settings-general-input-date-edit"
                              value={dateFormat}
                              onChange={(e) => setDateFormat(e.target.value)}
                            >
                              <option value=""></option>
                              <option value="dd/mm/yyyy">dd/mm/yyyy</option>
                              <option value="mm/dd/yyyy">mm/dd/yyyy</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="settings-general-space-dateformat">
                          <div className="settings-general-input-container">
                            <label className="settings-general-label">
                              <FormattedMessage id="dateFormat" />
                            </label>
                            <select
                              className="settings-general-input"
                              value={dateFormat}
                              onChange={(e) => setDateFormat(e.target.value)}
                              disabled
                            >
                              <option value=""></option>
                              <option value="dd/mm/yyyy">dd/mm/yyyy</option>
                              <option value="mm/dd/yyyy">mm/dd/yyyy</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <h2 className="settings-general-textsize font-weight-bold">
                        {" "}
                        <FormattedMessage id="workSchedule" />
                      </h2>

                      {editMode ? (
                        <div className="settings-general-space-workweek">
                          <div className="settings-general-input-container">
                            <label className="settings-general-label">
                              Standard week start day
                            </label>
                            <select
                              className="settings-general-input-week-edit"
                              id="start-day"
                              value={startDay}
                              onChange={handleStartDayChange}
                            >
                              {daysOfWeek.map((day, index) => (
                                <option key={day} value={index}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="settings-general-space-workweek">
                          <div className="settings-general-input-container">
                            <label className="settings-general-label">
                              Standard week start day
                            </label>
                            <select
                              className="settings-general-input-week-edit"
                              id="start-day"
                              value={startDay}
                              onChange={handleStartDayChange}
                            >
                              {daysOfWeek.map((day, index) => (
                                <option key={day} value={index}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="d-flex settings-general-local-weeklyOverTime">
                          <label
                            className="settings-general-label-weeklyovertime"
                            htmlFor="weeklyOvertime"
                          >
                            <FormattedMessage id="timesheetCycle"></FormattedMessage>
                          </label>
                          <div className="">
                            {editMode ? (
                              <select
                                className="settings-general-toggle-weeklyovertime-edit1"
                                value={timesheetCycle}
                                onChange={handleTimesheetCycleChange}
                              >
                                <option value="">Select</option>
                                <option value="Weekly">Weekly</option>
                                <option value="BiWeekly">BiWeekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Daily">Daily</option>
                              </select>
                            ) : (
                              <select
                                className="settings-general-toggle-weeklyovertime-edit1"
                                value={timesheetCycle}
                                onChange={handleTimesheetCycleChange}
                                disabled
                              >
                                <option value="">Select</option>
                                <option value="Weekly">Weekly</option>
                                <option value="BiWeekly">BiWeekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Daily">Daily</option>
                              </select>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex settings-general-local-weeklyOverTime mt-3">
                          <label
                            className="settings-general-label-weeklyovertime"
                            htmlFor="weeklyOvertime"
                          >
                            Approval Freeze Period:
                          </label>
                          <div className="">
                            {editMode ? (
                              <select
                                className="settings-general-toggle-weeklyovertime-edit1"
                                // value={timesheetCycle}
                                // onChange={handleTimesheetCycleChange}
                              >
                                <option value="">Select</option>
                                <option value="For one week">
                                  For one week
                                </option>
                                <option value="For Two week">
                                  For Two week
                                </option>
                              </select>
                            ) : (
                              <select
                                className="settings-general-toggle-weeklyovertime-edit1"
                                // value={timesheetCycle}
                                // onChange={handleTimesheetCycleChange}
                                disabled
                              >
                                <option value="">Select</option>
                                <option value="For one week">
                                  For one week
                                </option>
                                <option value="For Two week">
                                  For Two week
                                </option>
                              </select>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-genaral-columnthree col-md-3 ">
                  <div className="settings-general-project-content">
                    <div className="settings-general-project-languager d-flex">
                      <div>
                        <label className="settings-general-project-label-languager">
                          <FormattedMessage id="language" />
                        </label>
                      </div>
                      <div>
                        {" "}
                        {editMode ? (
                          <select
                            className="settings-general-project-input-languager-edit"
                            placeholder="English"
                            type="text"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                          >
                            <option value="English">English</option>
                          </select>
                        ) : (
                          <select
                            className="settings-general-project-input-languager-edit"
                            placeholder="English"
                            type="text"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            disabled
                          >
                            <option value="English">English</option>
                          </select>
                        )}
                      </div>
                    </div>

                    <div className="settings-general-project-currency mt-2 d-flex">
                      <div>
                        <label className="settings-general-project-label-currency">
                          <FormattedMessage id="currencies"></FormattedMessage>
                        </label>
                      </div>
                      <div>
                        {editMode ? (
                          <select
                            className="settings-general-project-input-currency-edit"
                            placeholder="USD"
                            type="text"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                          >
                            <option value="USD">USD</option>
                          </select>
                        ) : (
                          <select
                            className="settings-general-project-input-currency-edit"
                            placeholder="USD"
                            type="text"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            disabled
                          >
                            <option value="USD">USD</option>
                          </select>
                        )}
                      </div>
                    </div>

                    <h2 className="settings-general-textsize font-weight-bold mt-3">
                      <FormattedMessage id="overtimeRules" />
                    </h2>

                    <div className="settings-general-space-overtime">
                      <label
                        className=" settings-general-label-daily form-check-label "
                        htmlFor="flexSwitchCheckDefault"
                      >
                        <FormattedMessage id="dailyOvertime" />
                      </label>
                      <div className="form-check form-switch">
                        {editMode ? (
                          <input
                            className=" settings-general-toggle-daily-edit form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                            checked={dailyOvertime}
                            onChange={() => setDailyOvertime(!dailyOvertime)}
                          />
                        ) : (
                          <input
                            className=" settings-general-toggle-daily form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                            checked={dailyOvertime}
                            readOnly
                          />
                        )}
                      </div>
                    </div>

                    <div class="settings-general-local-overtime">
                      <label class="settings-general-label-restdayovertime">
                        <FormattedMessage id="restDayOvertime" />
                      </label>
                      <div class="form-check form-switch">
                        {editMode ? (
                          <input
                            class=" settings-general-toggle-restdayovertime-edit form-check-input "
                            type="checkbox"
                            id="restdayOvertime"
                            checked={restdayOvertime}
                            onChange={() =>
                              setRestdayOvertime(!restdayOvertime)
                            }
                          />
                        ) : (
                          <input
                            class=" settings-general-toggle-restdayovertime form-check-input "
                            type="checkbox"
                            id="restdayOvertime"
                            checked={restdayOvertime}
                            readOnly
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className=" settings-general-overtime"> */}
                  <div className="settings-general-local-overtime">
                    <label
                      class="form-check-label settings-general-label-weeklyovertime"
                      for="weeklyOvertime"
                    >
                      <FormattedMessage id="weeklyOvertime" />
                    </label>
                    <div class="form-check form-switch">
                      {editMode ? (
                        <input
                          class="form-check-input settings-general-toggle-weeklyovertime-edit form-check-input"
                          type="checkbox"
                          id="weeklyOvertime"
                          checked={weeklyOvertime}
                          onChange={() => setWeeklyOvertime(!weeklyOvertime)}
                        />
                      ) : (
                        <input
                          class="form-check-input settings-general-toggle-weeklyovertime"
                          type="checkbox"
                          id="weeklyOvertime"
                          checked={weeklyOvertime}
                          readOnly
                        />
                      )}
                    </div>
                  </div>

                  <div class="settings-general-local-overtime">
                    <label class="settings-general-label-publicovertime">
                      Public Holiday Overtime
                    </label>
                    <div class="form-check form-switch">
                      {editMode ? (
                        <input
                          class="settings-general-toggle-publicovertime-edit form-check-input"
                          type="checkbox"
                          checked={publicHolidayOvertime}
                          onChange={() =>
                            setPublicHolidayOvertime(!publicHolidayOvertime)
                          }
                        />
                      ) : (
                        <input
                          class="settings-general-toggle-publicovertime form-check-input"
                          type="checkbox"
                          checked={publicHolidayOvertime}
                          readOnly
                        />
                      )}
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

export default GeneralSettings;
