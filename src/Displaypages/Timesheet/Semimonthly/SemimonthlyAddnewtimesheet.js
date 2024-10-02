import Sidebar from "../../../Components/Sidebar";
import Topbar from "../../../Components/Topbar";
import React, { useState, useEffect } from "react";
import './SemimonthlyAddnewtimesheet.css'
import { Link, useNavigate } from "react-router-dom";
import { startOfMonth, addDays, format, addMonths, subMonths } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdAddCircleOutline } from "react-icons/io";
import axios from "axios";
import ReactSelect from 'react-select';
import { FaRegCommentDots } from "react-icons/fa";
import { useParams, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from 'react-tooltip';

const getSemiMonthDates = (selectedDate) => {
  const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() < 16 ? 1 : 16);
  const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const midDate = addDays(startDate, 14);
  const dates = [];

  let currentDate = startDate;
  while (currentDate <= (startDate.getDate() === 1 ? midDate : endDate)) {
    dates.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      day: format(currentDate, 'EEEE'),
    });
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};


const SemimonthlyAddnewtimesheet = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
  let formattedDate = currentDate.toLocaleString('en-US', options);
  formattedDate = formattedDate.replace(',', ' ');
const [selectedSemiMonthly, setSelectedSemiMonthly] = useState(getSemiMonthDates(new Date()));
  const startOfCurrentMonth = startOfMonth(new Date());
  const [Project, setProject] = useState([]);
  const [showcommentBoxicon, setShowcommentBoxicon] = useState(false);
  const [clickedInputIndex, setClickedInputIndex] = useState(null);
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [contentRows, setContentRows] = useState([
    {
      dayHours: Array(selectedSemiMonthly.length).fill(0),
      commenttext: Array(selectedSemiMonthly.length).fill(""),
      selectedSemiMonthly: getSemiMonthDates(startOfCurrentMonth),
      selectProject: "Select Project",
      selectedPayType: "regularhour",
    },
  ]);

  const { id } = useParams();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [timesheetData, setTimesheetData] = useState(null);
  const [projectValue, setProjectValue] = useState(null);
  const [selectedPayType, setSelectedPayType] = useState('regularhour');

  const saveTimesheet = async (buttonClicked, event) => {
    const calculateTotalHoursForDay = (dayIndex) => {
      return contentRows.reduce((total, row) => total + row.dayHours[dayIndex], 0);
    };

    const dayComments = contentRows.map((row) =>
      row.commenttext.map((commentArray) =>
        Array.isArray(commentArray) ? commentArray.join(", ") : ""
      )
    );

    const timesheet = {
      employeeId: "AGT09887",
      employeeName: "John Claddies",
      status: buttonClicked,
      submittedDate: currentDate,
      startDate: selectedSemiMonthly[0].date,
      endDate: selectedSemiMonthly[selectedSemiMonthly.length - 1].date,
      projectName: projectValue ? projectValue.label : "Select project",
      projectId: projectValue ? projectValue.value : "id-3030303",
      totalBillableHours: calculateOverallTotalHours(),
      totalDayHours: calculateOverallTotalHours(),
      totalRegularHours: calculateTotalRegularHours(),
      totalOvertimeHours: calculateTotalOvertimeHours(),
      comments: dayComments.flat(),
    };

    selectedSemiMonthly.forEach((day, index) => {
      timesheet[`day${index + 1}`] = calculateTotalHoursForDay(index);
    });

    try {
      console.log(isEditMode);
      console.log(timesheetData);
      if (isEditMode) {
        if (timesheetData) {
          timesheet.timesheetId = timesheetData.timesheetId;
          const response = await axios.post(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/semimonthly/update/${timesheet.timesheetId}`, timesheet);
          if (buttonClicked === 'submitted') {
            toast("Submitted Timesheet was successfully updated.");
            setTimeout(() => {
              navigate('/timesheet/mytimesheet');
            }, 2000);
          } else if (buttonClicked === 'In-use') {
            toast("Saved Timesheet was successfully updated");
            setTimeout(() => {
              navigate('/timesheet');
            }, 2000);
          } else {
            console.log("errorrr");
            throw new Error(`Error updating timesheet: ${response.data}`);
          }
        } else {
          throw new Error('Timesheet data is not available for editing');
        }
      } else {
        await axios.post(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/semimonthly/save`, timesheet);
        setSelectedPayType();
        setProject("");
        setContentRows([{ dayHours: Array(selectedSemiMonthly.length).fill(0), commenttext: Array(selectedSemiMonthly.length).fill(""), selectProject: "Select Project" }]);
        if (buttonClicked === 'submitted') {
          toast('Timesheet submitted successfully');
          setTimeout(() => {
            navigate('/timesheet/mytimesheet');
          }, 2000);
        } else if (buttonClicked === 'In-use') {
          toast('Timesheet saved successfully');
          setTimeout(() => {
            navigate('/timesheet');
          }, 2000);
        }
      }
    } catch (err) {
      console.error(err);
      if (buttonClicked === 'submitted') {
        toast('Timesheet submission failed: ' + err.message);
      } else if (buttonClicked === 'In-use') {
        toast('Timesheet save failed: ' + err.message);
      }
    }
  };

  const handleInputClick = (rowIndex, columnIndex) => {
    setClickedRowIndex(rowIndex);
    setClickedInputIndex(columnIndex);
  };

  useEffect(() => {
    (async () => {
      await Loadproject();
      if (location.state && location.state.timesheet) {
        const timesheetData = location.state.timesheet;
        setTimesheetData(timesheetData);
        setIsEditMode(true);
        setProjectValue({ value: timesheetData.projectId, label: timesheetData.projectName });
        setSelectedSemiMonthly(getSemiMonthDates(new Date(timesheetData.startDate)));
        setContentRows([
          {
            dayHours: selectedSemiMonthly.map((day, index) => timesheetData[`day${index + 1}`]),
            commenttext: timesheetData.comments ? timesheetData.comments.map(comment => [comment]) : Array(selectedSemiMonthly.length).fill([]),
            selectProject: timesheetData.projectName,
            selectedPayType: timesheetData.payType,
          },
        ]);
      }
    })();
  }, [id, location.state]);

  async function Loadproject() {
    try {
      const result = await axios.get(process.env.REACT_APP_API_BASE_URL + `/api/v1/project/getAllProject`);
      setProject(result.data?.length > 0 ? result.data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProject([]);
    }
  }

  // const handleSemiMonthlyChange = (date) => {
  //   const startDate = date.getDate() === 1 ? date : new Date(date.getFullYear(), date.getMonth(), 16);
  //   updateSelectedSemiMonthly(startDate);
  // };

 
const handleSemiMonthlyChange = (date) => {
  setSelectedSemiMonthly(getSemiMonthDates(date));
};

  const updateSelectedSemiMonthly = (startDate) => {
    const semiMonthlyDates = getSemiMonthDates(startDate);
    setSelectedSemiMonthly(semiMonthlyDates);
    console.log('Selected Semi-Monthly:', semiMonthlyDates);
  };

  const handlePrevSemiMonthly = () => {
    if (selectedSemiMonthly) {
      const startDate = new Date(selectedSemiMonthly[0].date);
      const prevStartDate = startDate.getDate() === 1 ? new Date(startDate.getFullYear(), startDate.getMonth() - 1, 16) : new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      updateSelectedSemiMonthly(prevStartDate);
    }
  };

  const handleNextSemiMonthly = () => {
    if (selectedSemiMonthly) {
      const startDate = new Date(selectedSemiMonthly[0].date);
      const nextStartDate = startDate.getDate() === 1 ? new Date(startDate.getFullYear(), startDate.getMonth(), 16) : new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
      updateSelectedSemiMonthly(nextStartDate);
    }
  };

  const handleCancel = () => {
    const resetRows = contentRows.map((row) => ({
      dayHours: Array(selectedSemiMonthly.length).fill(0),
      commenttext: Array(selectedSemiMonthly.length).fill(""),
      selectProject: "Select Project"
    }));
    setContentRows(resetRows);
  };

  const handleCircleIconClick = () => {
    handleAddNewRow('addnew');
  };

  const handleAddIconClick = () => {
    handleAddNewRow('paytypeadd');
  };

  const handleTaskAddIconClick = () => {
    handleAddNewRow('taskadd');
  };

  const handleAddNewRow = (iconType) => {
    setContentRows(prevRows => [
      ...prevRows,
      {
        iconType: iconType,
        dayHours: Array(selectedSemiMonthly.length).fill(0),
        commenttext: Array(selectedSemiMonthly.length).fill(""),
        selectProject: "Select Project",
        projectId: "",
        selectedPayType: "regularhour"
      }
    ]);
    console.log(iconType)
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...contentRows];
    updatedRows.splice(index, 1);
    setContentRows(updatedRows);
  };

  const handleDayHoursChange = (event, rowIndex, dayIndex) => {
    const updatedRows = [...contentRows];
    updatedRows[rowIndex].dayHours[dayIndex] = parseFloat(event.target.value) || 0;
    setContentRows(updatedRows);
  };

  const handleCommentChange = (event, rowIndex, dayIndex) => {
    const updatedRows = [...contentRows];
    const inputValue = event.target.value;
    updatedRows[rowIndex].commenttext[dayIndex] = inputValue.split('\n');
    setContentRows(updatedRows);
  };

  const handleProjectChange = (selectedOption, rowIndex) => {
    if (selectedOption) {
      const updatedRows = [...contentRows];
      updatedRows[rowIndex].selectProject = selectedOption.value || "Select Project";
      setContentRows(updatedRows);
    }
  };

  const handlePayTypeChange = (selectedOption, rowIndex) => {
    if (selectedOption) {
      const updatedRows = [...contentRows];
      updatedRows[rowIndex].selectedPayType = selectedOption || "regularhour";
      setContentRows(updatedRows);
    }
  };

  const calculateTotalHours = (dayHours) => {
    return dayHours.reduce((total, hours) => total + hours, 0);
  };

  const calculateOverallTotalHours = () => {
    return contentRows.reduce((total, row) => total + calculateTotalHours(row.dayHours), 0);
  };

  const calculatedayHourstotal = (dayIndex) => {
    let totaldayHours = 0;
    contentRows.forEach(row => {
      totaldayHours += row.dayHours[dayIndex];
    });
    return totaldayHours;
  };

  const calculateRegularHours = (dayIndex) => {
    let totalRegularHours = 0;
    contentRows.forEach(row => {
      if (row.selectedPayType === 'regularhour') {
        totalRegularHours += row.dayHours[dayIndex];
      }
    });
    return totalRegularHours;
  };

  const calculateOvertimeHours = (dayIndex) => {
    let totalOvertimeHours = 0;
    contentRows.forEach(row => {
      if (row.selectedPayType === 'overtimehour') {
        totalOvertimeHours += row.dayHours[dayIndex];
      }
    });
    return totalOvertimeHours;
  };

  const calculateTotalRegularHours = () => {
    let totalRegularHours = 0;
    selectedSemiMonthly.forEach((day, dayIndex) => {
      totalRegularHours += calculateRegularHours(dayIndex);
    });
    return totalRegularHours;
  };

  const calculateTotalOvertimeHours = () => {
    let totalOvertimeHours = 0;
    selectedSemiMonthly.forEach((day, dayIndex) => {
      totalOvertimeHours += calculateOvertimeHours(dayIndex);
    });
    return totalOvertimeHours;
  };

  const CustomDatePickerInput = ({ value, onClick }) => {
    return (
      <div className="custom-date-picker-input"  >
        <div className="ms-3 me-2 cursor-pointer custom-date-picker-input-arrow" onClick={handlePrevSemiMonthly}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 7L9 12L14 17" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div className="d-flex cursor-pointer" onClick={onClick}>
          <div className=" custom-date-picker-input-icon me-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 22H10C6.229 22 4.343 22 3.172 20.828C2 19.657 2 17.771 2 14V12C2 8.229 2 6.343 3.172 5.172C4.343 4 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C22 6.343 22 8.229 22 12V14C22 17.771 22 19.657 20.828 20.828C20.175 21.482 19.3 21.771 18 21.898M7 4V2.5M17 4V2.5M21.5 9H10.75M2 9H5.875" stroke="black" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" />
              <path d="M18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18C16.7348 18 16.4804 17.8946 16.2929 17.7071C16.1054 17.5196 16 17.2652 16 17C16 16.7348 16.1054 16.4804 16.2929 16.2929C16.4804 16.1054 16.7348 16 17 16C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17ZM18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14C16.7348 14 16.4804 13.8946 16.2929 13.7071C16.1054 13.5196 16 13.2652 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM8 17C8 17.2652 7.89464 17.5196 7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18C6.73478 18 6.48043 17.8946 6.29289 17.7071C6.10536 17.5196 6 17.2652 6 17C6 16.7348 6.10536 16.4804 6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17ZM8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13Z" fill="black" fill-opacity="0.6" />
            </svg>
          </div>
          {value}
        </div>
        <div className="ms-2 me-3 cursor-pointer custom-date-picker-input-arrow" onClick={handleNextSemiMonthly}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10 7L15 12L10 17" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    );
  };

  const isWeekend = (dayIndex) => {
    const day = new Date(selectedSemiMonthly[dayIndex].date).getDay();
    return day === 0 || day === 6; // Sunday is 0, Saturday is 6 
  };

  const [isReactSelectClicked, setIsReactSelectClicked] = useState(false);

    const handleSelectFocus = () => {
        setIsReactSelectClicked(true); // Set state to true when ReactSelect is focused
    };

    const handleSelectBlur = () => {
        setIsReactSelectClicked(false); // Set state to false when ReactSelect is blurred
    };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000} // 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Tooltip id="my-tooltip-comment" />
      <div>
        <Topbar />
        <div className="d-flex">
          <Sidebar />
          <div className="container " style={{ overflow: 'auto', maxHeight: 'calc(100vh - 50px)' }}>
            <div className="back-button-icon-timesheet-semimonth d-flex ms-4 mt-4 mb-3">
              <Link to={"/timesheet"} style={{ textDecoration: 'none' }}>
                <div className="back-button-icon-timesheet-semimonth-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M4.99992 12.5L4.11617 13.3838L3.23242 12.5L4.11617 11.6163L4.99992 12.5ZM26.2499 22.5C26.2499 22.8315 26.1182 23.1495 25.8838 23.3839C25.6494 23.6183 25.3314 23.75 24.9999 23.75C24.6684 23.75 24.3505 23.6183 24.116 23.3839C23.8816 23.1495 23.7499 22.8315 23.7499 22.5H26.2499ZM10.3662 19.6338L4.11617 13.3838L5.88367 11.6163L12.1337 17.8663L10.3662 19.6338ZM4.11617 11.6163L10.3662 5.36627L12.1337 7.13377L5.88367 13.3838L4.11617 11.6163ZM4.99992 11.25H17.4999V13.75H4.99992V11.25ZM26.2499 20V22.5H23.7499V20H26.2499ZM17.4999 11.25C19.8206 11.25 22.0462 12.1719 23.6871 13.8128C25.328 15.4538 26.2499 17.6794 26.2499 20H23.7499C23.7499 18.3424 23.0914 16.7527 21.9193 15.5806C20.7472 14.4085 19.1575 13.75 17.4999 13.75V11.25Z" fill="black" fill-opacity="0.6" />
                  </svg>
                </div>
              </Link>
              <p className="back-button-icon-timesheet-semimonth-p">Timesheet</p>
            </div>
            <div className="employee-semimonth-details ">
              <div className="row container employee-details-semimonth-timesheet d-flex justify-content-between">
                <div className="employee-name-timesheet-semimonth p-2 pt-3 col-auto">
                  <label className="employee-name-timesheet-semimonth-label mb-2">Employee Name</label>
                  <div className="employee-name-timesheet-semimonth-box-input">John Claddies</div>
                </div>
                <div className="employee-ID-timesheet-semimonth p-2 pt-3 col-auto">
                  <label className="employee-ID-timesheet-semimonth-label mb-2">Employee ID</label>
                  <div className="employee-ID-timesheet-semimonth-box-input">AGT09887</div>
                </div>
                <div className="employee-status-timesheet-semimonth p-2 pt-3 col-auto">
                  <label className="employee-status-timesheet-semimonth-label mb-2">Status</label>
                  <div className="employee-status-timesheet-semimonth-box-input">Re-Called</div>
                </div>
                <div className="employee-current-date-timesheet-semimonth p-2 pt-3 col-auto">
                  <label className="employee-current-date-timesheet-semimonth-label mb-2">Current Time and Date</label>
                  <div className="employee-current-date-timesheet-semimonth-box-input d-flex">{formattedDate}
                    <div className="ps-2 employee-current-date-timesheet-semimonth-box-input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M14 22H10C6.229 22 4.343 22 3.172 20.828C2 19.657 2 17.771 2 14V12C2 8.229 2 6.343 3.172 5.172C4.343 4 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C22 6.343 22 8.229 22 12V14C22 17.771 22 19.657 20.828 20.828C20.175 21.482 19.3 21.771 18 21.898M7 4V2.5M17 4V2.5M21.5 9H10.75M2 9H5.875" stroke="black" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18C16.7348 18 16.4804 17.8946 16.2929 17.7071C16.1054 17.5196 16 17.2652 16 17C16 16.7348 16.1054 16.4804 16.2929 16.2929C16.4804 16.1054 16.7348 16 17 16C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17ZM18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14C16.7348 14 16.4804 13.8946 16.2929 13.7071C16.1054 13.5196 16 13.2652 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM8 17C8 17.2652 7.89464 17.5196 7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18C6.73478 18 6.48043 17.8946 6.29289 17.7071C6.10536 17.5196 6 17.2652 6 17C6 16.7348 6.10536 16.4804 6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17ZM8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13Z" fill="black" fill-opacity="0.6" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="employee-select-semimonth-timesheet-calendar p-2 pt-3 col-auto">
                  <label className="employee-select-semimonth-timesheet-calendar-label mb-2">Select Date</label>
                  <div className="employee-select-semimonth-timesheet-calendar-box-input">
                    <DatePicker
                      className="timesheet-semimonth-calendar-wrapper-date-picker"
                      selected={selectedSemiMonthly ? new Date(selectedSemiMonthly[0].date) : null}
                      onChange={handleSemiMonthlyChange}
                      showWeekNumbers
                      dateFormat={`MM/dd/yyyy - ${selectedSemiMonthly ? format(new Date(selectedSemiMonthly[selectedSemiMonthly.length - 1].date), 'MM/dd/yyyy') : ''}`}
                      selectsStart
                      startDate={selectedSemiMonthly ? new Date(selectedSemiMonthly[0].date) : null}
                      endDate={selectedSemiMonthly ? new Date(selectedSemiMonthly[selectedSemiMonthly.length - 1].date) : null}
                      customInput={<CustomDatePickerInput />}
                      calendarStartDay={1}
                    />
                  </div>
                </div>
                <div className="employee-reported-hours-timesheet-wesemimonthek p-2 pt-3 col-auto">
                  <label className="employee-reported-hours-timesheet-semimonth-label pt-4">Reported Hours</label>
                  <div className="employee-reported-hours-timesheet-semimonth-box-input">{calculateOverallTotalHours()} Hrs</div>
                </div>
              </div>
              <div className="employee-add-entries-details-semimonth-timesheet table-responsive">
                <table class="table table-borderless custom-table-semimonth ">
                  <thead >
                    <tr className="employee-add-entries-details-semimonth-timesheet-table-head">
                      <th scope="col" className="custom-table-header-semimonth-timesheet-entries-project">Project Name</th>
                      <th scope="col" className="custom-table-header-semimonth-timesheet-entries-task">Task Name</th>
                      <th scope="col" className="custom-table-header-semimonth-timesheet-entries">Pay type</th>
                      {selectedSemiMonthly.map((day, dayIndex) => (
                        <th
                          key={day.date}
                          className={`add-day-${dayIndex + 1}`}
                          style={{
                            whiteSpace: 'nowrap',
                            fontSize: '13.5px',
                            paddingTop: '20px',
                            paddingBottom: '20px',
                            paddingLeft: '15px',
                            paddingRight: '15px',
                            
                            alignItems: 'center',
                          
                            textAlign: 'center',
                            fontWeight: '500',
                            backgroundColor: '#787DBD',
                            color: isWeekend(dayIndex) ? '#FFFFFF80' : 'white',
                          }}
                        >
                          <div>
                            <label className="timesheet-semimonth-add-hours-box-label" htmlFor={`working-hours-${dayIndex + 1}`}>
                              <div>{`${format(new Date(day.date), 'EEE')}`}</div>
                              <div>{`${format(new Date(day.date), 'MMM dd')}`}</div>
                            </label>
                          </div>
                        </th>
                      ))}
                      <th scope="col" className="custom-table-header-semimonth-timesheet-entries-total" >Total</th>
                      <th scope="col" className="custom-table-header-semimonth-timesheet-entries-delete" ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentRows.map((row, index) => (
                      <tr key={index} className="employee-add-entries-details-semimonth-timesheet-table-body1">
                        {row.iconType !== 'paytypeadd' && row.iconType !== 'taskadd' ? (
                          <td className="custom-table-body-semimonth-timesheet-entries" style={{ position: isReactSelectClicked ? '' : 'sticky' }}>
                            <div className="d-flex">
                            <div className="timesheet-semimonth-add-new-work-hours" id={`timesheet-semimonth-add-new-work-hours-${index}`}>
                              <div className="timesheet-semimonth-add-new-work-hours-icon ms-3 mt-2" onClick={handleCircleIconClick}>
                                <IoMdAddCircleOutline style={{ fontSize: '22px', color: 'rgba(0, 0, 0, 0.50)', backgroundColor: '#EEECEC ', marginTop: '16px', cursor: 'pointer' }} />
                              </div>
                            </div>
                            <div>
                            <ReactSelect
                              className="timesheet-semimonth-select-project-id-display-label me-2"
                              value={row.selectProject.value}
                              onChange={(selectedOption) => {
                                handleProjectChange(selectedOption, index);
                              }}
                              id={`timesheet-semimonth-select-project-id-display-label-${index + 1}`}
                              onFocus={handleSelectFocus}
                              onBlur={handleSelectBlur}
                              options={Array.isArray(Project) ? Project.map((project) => ({
                                key: project.projectid,
                                value: project.projectname,
                                label: project.projectname
                              })) : []}
                              placeholder="Select Project" />
                            </div>
                            </div>
                          </td>
                        ) : <td className="custom-table-body-semimonth-timesheet-entries" style={{ position: isReactSelectClicked ? '' : 'sticky' }}></td>}
                        {row.iconType !== 'paytypeadd' ? (
                          <td className="custom-table-body-semimonth-timesheet-entries">
                            <div className="d-flex">
                              <div className="timesheet-semimonth-add-new-task-icon mt-2 me-1" onClick={handleTaskAddIconClick}>
                                <IoMdAddCircleOutline style={{ fontSize: '22px', color: 'rgba(0, 0, 0, 0.50)', backgroundColor: '#EEECEC ', marginTop: '16px', cursor: 'pointer' }} />
                              </div>
                              <div>
                                <ReactSelect
                                  className="timesheet-semimonth-select-task-id-display-label me-2"
                                  value={row.selectProject.value}
                                  onChange={(selectedOption) => {
                                    handleProjectChange(selectedOption, index);
                                  }}
                                  id={`timesheet-semimonth-select-task-id-display-label-${index + 1}`}
                                  options={Array.isArray(Project) ? Project.map((project) => ({
                                    key: project.projectid,
                                    value: project.projectname,
                                    label: project.projectname
                                  })) : []}
                                  placeholder="Select Task" />
                              </div>
                            </div>
                          </td>
                        ) : <td className="custom-table-body-semimonth-timesheet-entries"></td>}
                        <td className="custom-table-body-semimonth-timesheet-entries">
                          <div className="d-flex flex-row">
                            <div className="timesheet-semimonth-add-new-pay-type-icon" id={`timesheet-semimonth-add-new-pay-type-icon-${index}`} onClick={handleAddIconClick}>
                              <IoMdAddCircleOutline style={{ fontSize: '22px', color: 'rgba(0, 0, 0, 0.50)', marginTop: '20px', cursor: 'pointer' }} />
                            </div>
                            <div class="timesheet-semimonth-pay-type-select-custom-dropdown">
                              <select class="form-select timesheet-semimonth-pay-type-select" id={`timesheet-semimonth-pay-type-select-${index}`} onChange={(e) => handlePayTypeChange(e.target.value, index)} value={row.selectedPayType}>
                                <option value="regularhour">R</option>
                                <option value="overtimehour">OT</option>
                              </select>
                            </div>
                          </div>
                        </td>
                        {selectedSemiMonthly.map((day, dayIndex) => (
                          <td key={day.date} className="custom-table-body-semimonth-timesheet-entries">
                            <div className="timesheet-semimonth-add-hours-box d-flex flex-row">
                              <input
                                className="timesheet-semimonth-add-hours-box-show"
                                type="number"
                                id={`working-hours-semimonth-timesheet-${dayIndex + 1}`}
                                onChange={(event) => handleDayHoursChange(event, index, dayIndex)}
                                onClick={() => handleInputClick(index, dayIndex)}
                                onMouseEnter={() => handleInputClick(index, dayIndex)}
                                value={contentRows[index].dayHours[dayIndex]}
                                style={{
                                  color: isWeekend(dayIndex) ? '#00000050' : '#00000080',
                                }}
                              />
                              {clickedInputIndex === dayIndex && clickedRowIndex === index && (
                                <div className="timesheet-semimonth-add-hours-box-show-icon"  >
                                  <FaRegCommentDots style={{ fontSize: '20px', marginTop: '9px', color: isWeekend(dayIndex) ? '#00000050' : '#00000080', cursor: 'pointer' }} className="timesheet-weekly-enter-commend-box " data-bs-toggle="modal" data-bs-target={`#commentpopupModal-${index}-${dayIndex + 1}`} data-tooltip-id="my-tooltip-comment" data-tooltip-content={contentRows[index].commenttext[dayIndex] || "No comments"}/>
                                  
                                  {/* popup comment box start*/}
                                  <div class="modal commentpopupModal-timesheet-semimonth" id={`commentpopupModal-${index}-${dayIndex + 1}`} tabindex="-1" aria-labelledby="commentpopupModalLabel" aria-hidden="true"  >
                                    <div class="modal-dialog modal-dialog-centered search-semimonth">
                                      <div class="modal-content timesheet-semimonth-comment-text-model">
                                        <div class="modal-body">
                                          <div>
                                            <div className="d-flex justify-content-between">
                                              <div className="modal-title d-flex flex-row" id="commentpopupModalLabel">
                                                <h5 className="timesheet-semimonth-comment-text-model-title-name mt-2">Submission Date &nbsp; - &nbsp; &nbsp;</h5>
                                                <h5 className="timesheet-semimonth-comment-text-model-title-date mt-2"> {`${format(new Date(day.date), 'EEE MMM dd')} - ${new Date(day.date).getFullYear()}`}</h5>
                                              </div>
                                              <div className="timesheet-semimonth-comment-text-model-title-close-icon" data-bs-dismiss="modal" aria-label="Close">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                  <path d="M4 12L12 4M12 12L4 4" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                              </div>
                                            </div>
                                            <div className="timesheet-semimonth-comment-text-model-title-emptyline"></div>
                                            <textarea
                                              id={`timesheet-semimonth-comment-textarea-${dayIndex + 1}`}
                                              className="timesheet-semimonth-comment-textarea-name"
                                              rows="4"
                                              placeholder="Leave a comment for Authorizer..."
                                              value={contentRows[index].commenttext[dayIndex]}
                                              onChange={(event) => handleCommentChange(event, index, dayIndex)}
                                            />
                                            <div className="d-flex justify-content-end">
                                              <button type="button" class="btn timesheet-semimonth-comment-text-model-share-comment" data-bs-dismiss="modal">Share Comment</button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* popup comment box end */}
                                </div>
                              )}
                            </div>
                          </td>
                        ))}
                        <td className="custom-table-body-semimonth-timesheet-entries-total">
                          <div className="timesheet-semimonth-add-total-hours-box">
                            <div >
                              <input
                                className="timesheet-semimonth-add-total-hours-box-show"
                                type="text"
                                id="timesheet-semimonth-add-total-hours-box-label"
                                value={calculateTotalHours(row.dayHours)}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="custom-table-body-semimonth-timesheet-entries-delete" >
                          <div className="timesheet-semimonth-add-new-work-hours-delete">
                            <div className="timesheet-semimonth-add-new-work-hours-icon-delete" onClick={() => handleDeleteRow(index)}>
                              {index !== 0 && (
                                <React.Fragment>
                                  <div className="timesheet-semimonth-add-new-work-hours-icon-display-delete-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                                      <path d="M1.71112 5.6904L2.59192 14.4168C2.64072 14.7856 4.42152 15.9984 6.99992 16C9.57992 15.9984 11.3607 14.7856 11.4087 14.4168L12.2903 5.6904C10.9431 6.444 8.92952 6.8 6.99992 6.8C5.07192 6.8 3.05752 6.444 1.71112 5.6904ZM9.53432 1.208L8.84712 0.4472C8.58152 0.0688 8.29352 0 7.73272 0H6.26792C5.70792 0 5.41912 0.0688 5.15432 0.4472L4.46712 1.208C2.41112 1.5672 0.919922 2.52 0.919922 3.2232V3.3592C0.919922 4.5968 3.64232 5.6 6.99992 5.6C10.3583 5.6 13.0807 4.5968 13.0807 3.3592V3.2232C13.0807 2.52 11.5903 1.5672 9.53432 1.208ZM8.65592 3.472L7.79992 2.4H6.19992L5.34552 3.472H3.98552C3.98552 3.472 5.47512 1.6952 5.67432 1.4544C5.82632 1.2704 5.98152 1.2 6.18312 1.2H7.81752C8.01992 1.2 8.17512 1.2704 8.32712 1.4544C8.52552 1.6952 10.0159 3.472 10.0159 3.472H8.65592Z" fill="black" fill-opacity="0.5" />
                                    </svg>
                                  </div>
                                </React.Fragment>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="employee-add-entries-details-semimonth-timesheet-table-body2">
                      <td colspan="3" className="custom-table-body-semimonth-timesheet-entries">
                        <div className="d-flex justify-content-end timesheet-semimonth-regular-hours-calculation">Regular :</div>
                      </td>
                      {selectedSemiMonthly.map((day, dayIndex) => (
                        <td key={dayIndex} className="custom-table-body-semimonth-timesheet-entries">
                          <div className="timesheet-semimonth-regular-hours-calculation">{calculateRegularHours(dayIndex)}</div>
                        </td>
                      ))}
                      <td colSpan={selectedSemiMonthly.length} className="custom-table-body-semimonth-timesheet-entries-rg-total">
                        <div className="timesheet-semimonth-regular-hours-calculation-final">{calculateTotalRegularHours()}</div>
                      </td>
                    </tr>
                    <tr className="employee-add-entries-details-semimonth-timesheet-table-body2">
                      <td colspan="3" className="custom-table-body-semimonth-timesheet-entries">
                        <div className="d-flex justify-content-end timesheet-semimonth-overtime-hours-calculation">Overtime :</div>
                      </td>
                      {selectedSemiMonthly.map((day, dayIndex) => (
                        <td key={dayIndex} className="custom-table-body-semimonth-timesheet-entries">
                          <div className="timesheet-semimonth-overtime-hours-calculation">{calculateOvertimeHours(dayIndex)}</div>
                        </td>
                      ))}
                      <td colSpan={selectedSemiMonthly.length} className="custom-table-body-semimonth-timesheet-entries-ot-total">
                        <div className="timesheet-semimonth-overtime-hours-calculation-final">{calculateTotalOvertimeHours()}</div>
                      </td>
                    </tr>
                    <tr className="employee-add-entries-details-semimonth-timesheet-table-body2">
                      <td colSpan="3" className="custom-table-body-semimonth-timesheet-entries">
                        <div className="d-flex justify-content-end timesheet-semimonth-total-hours-calculation">Total :</div>
                      </td>
                      {selectedSemiMonthly.map((day, dayIndex) => (
                        <td key={dayIndex} className="custom-table-body-semimonth-timesheet-entries">
                          <div className="timesheet-semimonth-total-hours-calculation">{calculatedayHourstotal(dayIndex)}</div>
                        </td>
                      ))}
                      <td colSpan={selectedSemiMonthly.length} className="custom-table-body-semimonth-timesheet-entries-final-total">
                        <div className="timesheet-semimonth-total-hours-calculation-final">{calculateOverallTotalHours()}</div>
                      </td>
                    </tr>
                    <tr >
                      <td colSpan="30" className="empty-space-color-table"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row copy-last-semimonth-and-save-submit-cancel-button d-flex justify-content-between">
                <div className="copy-last-semimonth-activity  ms-4 col-auto">
                <div className="d-flex flex-md-row flex-column">
                    <div className="d-flex flex-column">
                      <div className="copy-last-semimonth-activity-select-option mt-3 me-4 ">
                        <select className="form-select copy-last-semimonth-activity-select-option-form" aria-label="Default select example">
                          <option value="1">Copy activities Only</option>
                          <option value="2">Copy activities and Time</option>
                        </select>
                      </div>
                    </div>
                    <div className="copy-last-semimonth-activity-save-button ms-3 mt-2 ">
                      <div className="button btn d-flex copy-last-semimonth-activity-save-button-and-icon">
                        <div className="copy-last-semimonth-activity-save-button-div ps-2 pe-2">Save</div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M0 2.75C0 2.02065 0.289731 1.32118 0.805456 0.805456C1.32118 0.289731 2.02065 0 2.75 0H12.715C13.5769 5.14719e-05 14.4035 0.342495 15.013 0.952L17.048 2.987C17.658 3.597 18 4.424 18 5.286V15.25C18 15.9793 17.7103 16.6788 17.1945 17.1945C16.6788 17.7103 15.9793 18 15.25 18H2.75C2.02065 18 1.32118 17.7103 0.805456 17.1945C0.289731 16.6788 0 15.9793 0 15.25V2.75ZM2.75 1.5C2.06 1.5 1.5 2.06 1.5 2.75V15.25C1.5 15.94 2.06 16.5 2.75 16.5H3V11.25C3 10.6533 3.23705 10.081 3.65901 9.65901C4.08097 9.23705 4.65326 9 5.25 9H12.75C13.3467 9 13.919 9.23705 14.341 9.65901C14.7629 10.081 15 10.6533 15 11.25V16.5H15.25C15.94 16.5 16.5 15.94 16.5 15.25V5.286C16.5 4.821 16.316 4.376 15.987 4.048L13.952 2.013C13.6937 1.75422 13.3607 1.58286 13 1.523V4.25C13 4.54547 12.9418 4.83805 12.8287 5.11104C12.7157 5.38402 12.5499 5.63206 12.341 5.84099C12.1321 6.04992 11.884 6.21566 11.611 6.32873C11.3381 6.4418 11.0455 6.5 10.75 6.5H6.25C5.65326 6.5 5.08097 6.26295 4.65901 5.84099C4.23705 5.41903 4 4.84674 4 4.25V1.5H2.75ZM13.5 16.5V11.25C13.5 11.0511 13.421 10.8603 13.2803 10.7197C13.1397 10.579 12.9489 10.5 12.75 10.5H5.25C5.05109 10.5 4.86032 10.579 4.71967 10.7197C4.57902 10.8603 4.5 11.0511 4.5 11.25V16.5H13.5ZM5.5 1.5V4.25C5.5 4.664 5.836 5 6.25 5H10.75C10.9489 5 11.1397 4.92098 11.2803 4.78033C11.421 4.63968 11.5 4.44891 11.5 4.25V1.5H5.5Z" fill="black" fill-opacity="0.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="timesheet-semimonth-submit-save-cancel-button d-flex flex-row col-auto ms-4 mt-3 mb-4">
                  <div className="button btn d-flex flex-row timesheet-semimonth-button-submit mb-2" onClick={() => saveTimesheet('submitted')}>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 13V5.749C20.0001 5.67006 19.9845 5.59189 19.9543 5.51896C19.9241 5.44603 19.8798 5.37978 19.824 5.324L16.676 2.176C16.5636 2.06345 16.4111 2.00014 16.252 2H4.6C4.44087 2 4.28826 2.06321 4.17574 2.17574C4.06321 2.28826 4 2.44087 4 2.6V21.4C4 21.5591 4.06321 21.7117 4.17574 21.8243C4.28826 21.9368 4.44087 22 4.6 22H14" stroke="#38BA7C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16 2V5.4C16 5.55913 16.0632 5.71174 16.1757 5.82426C16.2883 5.93679 16.4409 6 16.6 6H20M16 19H22M22 19L19 16M22 19L19 22" stroke="#38BA7C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div className="timesheet-semimonth-button-submit-div ps-2" >Sign</div>
                  </div>
                  <div className="button btn d-flex flex-row timesheet-semimonth-button-save mb-2" onClick={() => saveTimesheet('In-use')}>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7 21H17C18.0609 21 19.0783 20.5786 19.8284 19.8284C20.5786 19.0783 21 18.0609 21 17V7.414C20.9999 7.14881 20.8946 6.89449 20.707 6.707L17.293 3.293C17.1055 3.10545 16.8512 3.00006 16.586 3H7C5.93913 3 4.92172 3.42143 4.17157 4.17157C3.42143 4.92172 3 5.93913 3 7V17C3 18.0609 3.42143 19.0783 4.17157 19.8284C4.92172 20.5786 5.93913 21 7 21Z" stroke="#787DBD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17 21V14C17 13.7348 16.8946 13.4804 16.7071 13.2929C16.5196 13.1054 16.2652 13 16 13H8C7.73478 13 7.48043 13.1054 7.29289 13.2929C7.10536 13.4804 7 13.7348 7 14V21M9 3H15V6C15 6.26522 14.8946 6.51957 14.7071 6.70711C14.5196 6.89464 14.2652 7 14 7H10C9.73478 7 9.48043 6.89464 9.29289 6.70711C9.10536 6.51957 9 6.26522 9 6V3Z" stroke="#787DBD" stroke-width="2" />
                        <path d="M11 17H13" stroke="#787DBD" stroke-width="2" stroke-linecap="round" />
                      </svg>
                    </div>
                    <div className="timesheet-semimonth-button-save-div ps-2" >Save</div>
                  </div>
                  <div className="button btn d-flex flex-row timesheet-semimonth-button-reset mb-2" onClick={handleCancel}>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M7.5 5.5L4.5 2.5H10.5C12.0976 2.49986 13.6587 2.97788 14.9823 3.87253C16.306 4.76718 17.3315 6.03751 17.927 7.52C18.297 8.441 18.5 9.447 18.5 10.5C18.5 12.6217 17.6571 14.6566 16.1569 16.1569C14.6566 17.6571 12.6217 18.5 10.5 18.5C8.37827 18.5 6.34344 17.6571 4.84315 16.1569C3.34285 14.6566 2.5 12.6217 2.5 10.5C2.5 9.01 2.87 7.028 4.038 5.409M7.5 7.5L13.5 13.5M7.5 13.5L13.5 7.5" stroke="#FF7F7F" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div className="timesheet-semimonth-button-reset-div ps-2">Reset</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="white-space-timesheet">
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default SemimonthlyAddnewtimesheet;