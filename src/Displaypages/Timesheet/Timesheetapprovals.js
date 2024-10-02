import React, { useState, useEffect } from 'react';


import { Link } from 'react-router-dom';
import Topbar from "../../Components/Topbar.js";
import './Timesheetapprovals.css'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Sidebar from '../../Components/Sidebar.js';
import { IoClose } from "react-icons/io5";
import Table from 'react-bootstrap/Table';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams, useLocation, navigate, useNavigate } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';



function Timesheetapprovals() {

  const { state } = useLocation();
  const [timesheet, setTimesheet] = useState(state?.timesheet || []);
  const [currentTimesheetData, setCurrentTimesheetData] = useState(null);

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    fetchTimesheets();
  }, []);

  console.log(timesheet);

  const fetchTimesheets = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/weekly/list`);
      const filteredTimesheets = response.data
        .filter(timesheet => 
          timesheet.status === 'Submitted' || 
          timesheet.status === 'Approved' || 
          timesheet.status === 'Rejected' || 
          timesheet.status === 'Approved (Freezed)'
        )
        .map(timesheet => {
          const days = timesheet.days;
          const startDate = days.length > 0 ? days[0].startDate : '';
          const endDate = days.length > 0 ? days[days.length - 1].startDate : '';
          return { ...timesheet, startDate, endDate };
        });
  
      setTimesheet(filteredTimesheets);
  
      // Set the first timesheet data as currentTimesheetData
      if (filteredTimesheets.length > 0) {
        setCurrentTimesheetData(filteredTimesheets[0]);
      } else {
        console.warn('No timesheet data available');
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    }
  };
  
const getUniqueProjectNames = (timesheetData) => {
  const projectNames = new Set();
  timesheetData.days.forEach(day => {
    day.weeklyEntries.forEach(entry => {
      if (entry.projectName) {
        projectNames.add(entry.projectName);
      }
    });
  });
  return Array.from(projectNames);
};

  const [buttonsDisabledApproved, setButtonsDisabledApproved] = useState(currentTimesheetData?.status === 'Approved');
  const [buttonsDisabledRejected, setButtonsDisabledRejected] = useState(currentTimesheetData?.status === 'Rejected');
  const [buttonsDisabledDeclineApproved, setButtonsDisabledDeclineApproved] = useState(currentTimesheetData?.status === 'Submitted');
  useEffect(() => {
    setButtonsDisabledApproved(currentTimesheetData?.status === 'Approved');
    setButtonsDisabledRejected(currentTimesheetData?.status === 'Rejected');
    setButtonsDisabledDeclineApproved(currentTimesheetData?.status === 'Submitted');
  }, [currentTimesheetData]);

  const handleApproveTimesheet = () => {
    const updatedTimesheet = { ...currentTimesheetData, status: 'Approved' };

    axios.put(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/weekly/update/${currentTimesheetData.id}`, updatedTimesheet)
      .then(response => {
        console.log('Timesheet status updated successfully');
        // Update the local state or perform any other necessary actions
        setTimesheet(timesheet.map(t => t.id === currentTimesheetData.id ? updatedTimesheet : t));
      })
      .catch(error => {
        console.error('Error updating timesheet status:', error);
      });
  };



  const handleRejectedTimesheet = () => {
    const updatedTimesheet = { ...currentTimesheetData, status: 'Rejected' };

    axios.put(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/weekly/update/${currentTimesheetData.id}`, updatedTimesheet)
      .then(response => {
        console.log('Timesheet status updated successfully');
        // Update the local state or perform any other necessary actions
        setTimesheet(timesheet.map(t => t.id === currentTimesheetData.id ? updatedTimesheet : t));
      })
      .catch(error => {
        console.error('Error updating timesheet status:', error);
      });
  };

  const handleDeclineApprovalTimesheet = () => {
    const updatedTimesheet = { ...currentTimesheetData, status: 'Submitted' };

    axios.put(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/weekly/update/${currentTimesheetData.id}`, updatedTimesheet)
      .then(response => {
        console.log('Timesheet status updated successfully');
        // Update the local state or perform any other necessary actions
        setTimesheet(timesheet.map(t => t.id === currentTimesheetData.id ? updatedTimesheet : t));
      })
      .catch(error => {
        console.error('Error updating timesheet status:', error);
      });
  };

  const handleFreezeApproveTimesheet = () => {
    const updatedTimesheet = { ...currentTimesheetData, status: 'Approved (Freezed)' };

    axios.put(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/weekly/update/${currentTimesheetData.id}`, updatedTimesheet)
      .then(response => {
        console.log('Timesheet status updated successfully');
        // Update the local state or perform any other necessary actions
        setTimesheet(timesheet.map(t => t.id === currentTimesheetData.id ? updatedTimesheet : t));
      })
      .catch(error => {
        console.error('Error updating timesheet status:', error);
      });
  };


  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedMembers, setSelectedMembers] = useState([]);
  const Members = [
    { name: 'vicky' },
    { name: 'subash' },
    { name: 'ragav' },
    { name: 'vasu' },
  ];

  const [selectedStatus, setSelectedStatus] = useState([{ name: 'Pending' }]);
  const Status = [
    { name: 'Approved' },
    { name: 'Pending' },
    { name: 'Freezed' },
    { name: 'Rejected' },
  ];

  const [filteredTimesheet, setFilteredTimesheet] = useState([]);

  useEffect(() => {
    filterTimesheetByStatus();
  }, [timesheet, selectedStatus]);

  const filterTimesheetByStatus = () => {
    if (selectedStatus.length === 0) {
      setFilteredTimesheet(timesheet);
    } else {
      const filtered = timesheet.filter(timesheetData =>
        selectedStatus.some(status => {
          if (status.name === 'Pending') {
            return timesheetData.status === 'Pending' || timesheetData.status === 'Submitted';
          }
          else if (status.name === 'Freezed') {
            return timesheetData.status === 'Approved (Freezed)';
          }
          else {
            return status.name === timesheetData.status;
          }
        })
      );
      setFilteredTimesheet(filtered);
    }
  };

  const [selectedCustomperiod, setSelectedCustomperiod] = useState([]);
  const Customperiod = [
    { name: 'This Week' },
    { name: 'Last Week' },
    { name: 'This Month' },
    { name: 'Last Month' },
    { name: 'Today' },
    { name: 'Custom' },
  ];

  const selectedCustomperiodTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.name}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  const selectedCustomperiodOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.name}</div>
      </div>
    );
  };

  const handlecustomperiodChange = (selectedOption) => {
    setSelectedCustomperiod(selectedOption.value);
  };
  const selectedCustomperiodvalue = selectedCustomperiod.name
  // console.log('Selected Option:', selectedCustomperiod.name);

  const [date, setDate] = useState(new Date());
  const [customstartDate, setCustomStartDate] = useState();
  const [customendDate, setCustomEndDate] = useState();

  const [weekDatesthisweek, setWeekDatesthisweek] = useState([]);
  const [weekDateslastweek, setWeekDateslastweek] = useState([]);
  const [monthDatesthismonth, setMonthDatesthismonth] = useState([]);
  const [monthDateslastmonth, setMonthDateslastmonth] = useState([]);

  useEffect(() => {
    //thisweek filter 
    // Get today's date
    const todaythisweek = new Date();
    // Get the day index of today (0 for Sunday, 1 for Monday, etc.)
    const dayIndexthisweek = todaythisweek.getDay();
    // Calculate the start date of the current week (Sunday)
    const startDatethisweek = new Date(todaythisweek);
    startDatethisweek.setDate(todaythisweek.getDate() - dayIndexthisweek + 1);
    // Create an array to hold the dates of the current week
    const datesthisweek = [];
    for (let i = 0; i < 7; i++) {
      const datethisweek = new Date(startDatethisweek);
      datethisweek.setDate(startDatethisweek.getDate() + i);
      datesthisweek.push(datethisweek);
    }
    // Set the weekDates state
    setWeekDatesthisweek(datesthisweek);

    //last week filter
    const todaylastweek = new Date();
    const dayIndexlastweek = todaylastweek.getDay();
    const startDatelastweek = new Date(todaylastweek);
    startDatelastweek.setDate(todaylastweek.getDate() - dayIndexlastweek - 6);
    const dateslastweek = [];
    for (let i = 0; i < 7; i++) {
      const datelastweek = new Date(startDatelastweek);
      datelastweek.setDate(startDatelastweek.getDate() + i);
      dateslastweek.push(datelastweek);
    }
    setWeekDateslastweek(dateslastweek);

    //this month filter
    const todaythismonth = new Date();
    const firstDayOfMonththismonth = new Date(todaythismonth.getFullYear(), todaythismonth.getMonth(), 1);
    const lastDayOfMonththismonth = new Date(todaythismonth.getFullYear(), todaythismonth.getMonth() + 1, 0);
    const datesthismonth = [];
    for (let i = firstDayOfMonththismonth.getDate(); i <= lastDayOfMonththismonth.getDate(); i++) {
      const datethismonth = new Date(todaythismonth.getFullYear(), todaythismonth.getMonth(), i);
      datesthismonth.push(datethismonth);
    }
    setMonthDatesthismonth(datesthismonth);

    //last month filter
    const todaylastmonth = new Date();
    const firstDayOfPreviousMonthlastmonth = new Date(todaylastmonth.getFullYear(), todaylastmonth.getMonth() - 1, 1);
    const lastDayOfPreviousMonthlastmonth = new Date(todaylastmonth.getFullYear(), todaylastmonth.getMonth(), 0);
    const dateslastmonth = [];
    for (let i = firstDayOfPreviousMonthlastmonth.getDate(); i <= lastDayOfPreviousMonthlastmonth.getDate(); i++) {
      const datelastmonth = new Date(todaylastmonth.getFullYear(), todaylastmonth.getMonth() - 1, i);
      dateslastmonth.push(datelastmonth);
    }
    setMonthDateslastmonth(dateslastmonth);

  }, []);

  // const currentDatetoday = new Date();
  // const optionstoday = { weekday: 'short', month: 'short', day: 'numeric' };
  // const formattedDatetoday = currentDatetoday.toLocaleString('en-US', optionstoday);


  const handlecalandarChange = (range) => {
    const [customstartDate, customendDate] = range;
    setCustomStartDate(customstartDate);
    setCustomEndDate(customendDate);
  };

  const CustomDatePickerInput = ({ value, onClick, placeholder }) => {
    return (
      <div className="timesheet-approval-filter-custom-date-picker ps-3  d-flex justify-content-between" onClick={onClick}>
        <div className='timesheet-approval-filter-custom-date-picker-value'>{value ? value : placeholder}</div>
        <div className='d-flex justify-content-end'>
          <div className='timesheet-approval-filter-custom-date-picker-icon-emptyline'></div>
          <FontAwesomeIcon icon={faCalendarAlt} className="timesheet-approval-filter-custom-date-picker-icon opacity-50" />
        </div>
      </div>
    );
  };


  // const formatDate = (date) => {
  //   // Format date as "MM/DD/YYYY"
  //   return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  // };

  // const formatDate = (date) => {
  //   const options = { weekday: 'short', month: 'short', day: 'numeric' };
  //   return date.toLocaleDateString('en-US', options);
  // };


  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const [weekday, rest] = formattedDate.split(', ');
    return (
      <div>
        <div>{weekday}</div>
        <div>{rest}</div>
      </div>
    );
  };

  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const renderSelectedDatescustomhead = () => {
    if (customstartDate && customendDate) {
      const dates = getDatesBetween(customstartDate, customendDate);
      return dates.map((date, index) => (
        <th key={index} className='timesheet-approval-data-table-head-th-column-dates'>
          <div className='timesheet-approval-data-table-head-th-column-div-dates'>
            {formatDate(date)}
          </div>
        </th>
      ));
    }
    return null;
  };

  const renderSelectedDatescustombody = () => {
    if (customstartDate && customendDate) {
      const dates = getDatesBetween(customstartDate, customendDate);
      return dates.map((date, index) => (
        <td key={index} className='timesheet-approval-data-table-body-td-column-dates'>
          <div className='timesheet-approval-data-table-body-td-column-div-dates'>
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-regular mb-4' />
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-overtime' />
          </div>
        </td>
      ));
    }
    return null;
  };



  const renderSelectedDatestodayhead = () => {
    if (selectedCustomperiodvalue === 'Today') {
      return (
        <th className='timesheet-approval-data-table-head-th-column-dates'>
          <div className='timesheet-approval-data-table-head-th-column-div-dates'>
            {formatDate(date)}
          </div>
        </th>
      );
    }
    return null;
  };

  const renderSelectedDatestodaybody = () => {
    if (selectedCustomperiodvalue === 'Today') {
      return (
        <td className='timesheet-approval-data-table-body-td-column-dates'>
          <div className='timesheet-approval-data-table-body-td-column-div-dates'>
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-regular mb-4' />
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-overtime' />
          </div>
        </td>
      );
    }
    return null;
  };
  console.log(selectedCustomperiodvalue)

  const renderSelectedDatesthisweekhead = () => {
    if (selectedCustomperiodvalue === 'This Week') {
      return weekDatesthisweek.map((date, index) => (
        <th key={index} className='timesheet-approval-data-table-head-th-column-dates'>
          <div className='timesheet-approval-data-table-head-th-column-div-dates'>
            {/* {date.toDateString()} */}
            {formatDate(date)}
          </div>
        </th>
      ));
    }
    return null;
  };


  const renderSelectedDatesthisweekbody = () => {
    if (selectedCustomperiodvalue === 'This Week') {
      return weekDatesthisweek.map((date, index) => (
        <td key={index} className='timesheet-approval-data-table-body-td-column-dates'>
          <div className='timesheet-approval-data-table-body-td-column-div-dates'>
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-regular mb-4' />
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-overtime' />
          </div>
        </td>
      ));
    }
    return null;
  };

  const renderSelectedDefaultDatesthisweekhead = () => {
    if (selectedCustomperiodvalue === undefined) {
      return weekDatesthisweek.map((date, index) => (
        <th key={index} className='timesheet-approval-data-table-head-th-column-dates'>
          <div className='timesheet-approval-data-table-head-th-column-div-dates'>
            {formatDate(date)}
          </div>
        </th>
      ));
    }
    return null;
  };

  const renderSelectedDefaultDatesthisweekbody = () => {
    if (selectedCustomperiodvalue === undefined) {
      return weekdays.map((day, i) => (

        <td key={i} className='timesheet-approval-data-table-body-td-column-dates'>
          {timesheet.map((timesheetData, index) => (
            <div className='timesheet-approval-data-table-body-td-column-div-dates'>
              <input
                type='number'
                className='timesheet-approval-data-table-body-td-column-div-dates-inputs-regular mb-4'
                value={timesheetData[day]}
              />
              <input
                type='number'
                className='timesheet-approval-data-table-body-td-column-div-dates-inputs-overtime'
              />
            </div>
          ))}
        </td>

      ));
    }
    return null;
  };

  console.log(timesheet)

  const renderSelectedDateslastweekhead = () => {
    if (selectedCustomperiodvalue === 'Last Week') {
      return weekDateslastweek.map((date, index) => (
        <th key={index} className='timesheet-approval-data-table-head-th-column-dates'>
          <div className='timesheet-approval-data-table-head-th-column-div-dates'>
            {/* {date.toDateString()} */}
            {formatDate(date)}
          </div>
        </th>
      ));
    }
    return null;
  };

  const renderSelectedDateslastweekbody = () => {
    if (selectedCustomperiodvalue === 'Last Week') {
      return weekDateslastweek.map((date, index) => (
        <td key={index} className='timesheet-approval-data-table-body-td-column-dates'>
          <div className='timesheet-approval-data-table-body-td-column-div-dates'>
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-regular mb-4' />
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-overtime' />
          </div>
        </td>
      ));
    }
    return null;
  };

  const renderSelectedDatesthismonthhead = () => {
    if (selectedCustomperiodvalue === 'This Month') {
      return monthDatesthismonth.map((date, index) => (
        <th key={index} className='timesheet-approval-data-table-head-th-column-dates'>
          <div className='timesheet-approval-data-table-head-th-column-div-dates'>
            {/* {date.toDateString()} */}
            {formatDate(date)}
          </div>
        </th>
      ));
    }
    return null;
  };

  const renderSelectedDatesthismonthbody = () => {
    if (selectedCustomperiodvalue === 'This Month') {
      return monthDatesthismonth.map((date, index) => (
        <td key={index} className='timesheet-approval-data-table-body-td-column-dates'>
          <div className='timesheet-approval-data-table-body-td-column-div-dates'>
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-regular mb-4' />
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-overtime' />
          </div>
        </td>
      ));
    }
    return null;
  };

  const renderSelectedDateslastmonthhead = () => {
    if (selectedCustomperiodvalue === 'Last Month') {
      return monthDateslastmonth.map((date, index) => (
        <th key={index} className='timesheet-approval-data-table-head-th-column-dates'>
          <div className='timesheet-approval-data-table-head-th-column-div-dates'>
            {/* {date.toDateString()} */}
            {formatDate(date)}
          </div>
        </th>
      ));
    }
    return null;
  };

  const renderSelectedDateslastmonthbody = () => {
    if (selectedCustomperiodvalue === 'Last Month') {
      return monthDateslastmonth.map((date, index) => (
        <td key={index} className='timesheet-approval-data-table-body-td-column-dates'>
          <div className='timesheet-approval-data-table-body-td-column-div-dates'>
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-regular mb-4' />
            <input type='number' className='timesheet-approval-data-table-body-td-column-div-dates-inputs-overtime' />
          </div>
        </td>
      ));
    }
    return null;
  };

  const [isOpenapprovaldiscardbutton, setIsOpenapprovaldiscardbutton] = useState(false);

  const toggleDropdownapprovaldiscardbutton = () => {
    setIsOpenapprovaldiscardbutton(!isOpenapprovaldiscardbutton);
  };



  return (
    <div>
      <Topbar />
      <div className="d-flex">
        {/* <Sidebar/> */}
        <Sidebar />
        <div className='container' style={{ overflow: 'auto', maxHeight: 'calc(100vh - 50px)' }}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>

              <Box sx={{ paddingTop: '10px' }}>
                <TabList onChange={handleChange} TabIndicatorProps={{
                  style: {
                    backgroundColor: '#787DBD',
                  }
                }}
                >
                  <Tab component={Link} to="/timesheet" label="Add Timesheet" value="2" sx={{
                    '&.Mui-selected': {
                      color: '#787DBD',
                    },
                    color: '#787DBD',
                    marginRight: '30px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }} />
                  <Tab component={Link} to="/timesheet/mytimesheet" label="My Timesheets" value="3" sx={{
                    '&.Mui-selected': {
                      color: '#787DBD',
                    },
                    color: '#787DBD',
                    textTransform: 'none',
                    marginRight: '30px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }} />
                  <Tab component={Link} to="/timesheet/timesheetapprovals" label="Approvals" value="1" sx={{
                    '&.Mui-selected': {
                      color: '#787DBD',
                    },
                    color: '#787DBD',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }} />
                </TabList>
              </Box>

              <TabPanel value="1" className="scrollable-tab-panel mx-2" >
                <div>
                  <div className='timesheet-approval-filter-all d-flex justify-content-between row'>
                    <div className='timesheet-approval-filter-member-status d-flex flex-row col-auto mt-1 '>
                      <div className="card flex justify-content-center timesheet-approval-filter-members ">
                        <MultiSelect value={selectedMembers} onChange={(e) => setSelectedMembers(e.value)} options={Members} optionLabel="name"
                          filter placeholder="Members" maxSelectedLabels={3} className="timesheet-approval-filter-members-multiselect" />
                      </div>
                      <div className="card flex justify-content-center timesheet-approval-filter-status ms-4">
                        <MultiSelect value={selectedStatus} onChange={(e) => setSelectedStatus(e.value)} options={Status} optionLabel="name"
                          filter placeholder="Status" maxSelectedLabels={3} className="timesheet-approval-filter-status-multiselect" />
                      </div>
                    </div>
                    <div className='timesheet-approval-filter-export-customperiod-selectdate d-flex flex-column flex-md-row col-auto' >
                      <div className='timesheet-approval-page-filter-and-export mt-1 me-4'>
                        <button className="button d-flex flex-row justify-content-between timesheet-approval-page-filter-and-export-button" data-bs-toggle="modal" data-bs-target="#approvalexportpopupModal">
                          <div className="timesheet-approval-page-filter-and-export-button-div">Export</div>
                          <div className='d-flex pt-2 pe-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M16.5104 18.077H2.40591C2.37772 18.0771 2.3498 18.0716 2.32374 18.0608C2.29769 18.0501 2.27402 18.0343 2.25409 18.0143C2.23415 17.9944 2.21836 17.9707 2.2076 17.9447C2.19684 17.9186 2.19134 17.8907 2.19141 17.8625V3.758C2.19141 3.6395 2.28741 3.5435 2.40591 3.5435H12.6459C12.6741 3.5435 12.702 3.54905 12.728 3.55983C12.754 3.57061 12.7777 3.58641 12.7976 3.60633C12.8175 3.62624 12.8333 3.64989 12.8441 3.67591C12.8549 3.70194 12.8604 3.72983 12.8604 3.758C12.8604 3.78617 12.8549 3.81406 12.8441 3.84009C12.8333 3.86611 12.8175 3.88976 12.7976 3.90967C12.7777 3.92959 12.754 3.94539 12.728 3.95617C12.702 3.96695 12.6741 3.9725 12.6459 3.9725H2.62041V17.649H16.2959V7.621C16.2959 7.56411 16.3185 7.50955 16.3587 7.46933C16.399 7.4291 16.4535 7.4065 16.5104 7.4065C16.5673 7.4065 16.6219 7.4291 16.6621 7.46933C16.7023 7.50955 16.7249 7.56411 16.7249 7.621V17.8625C16.7249 17.9194 16.7023 17.9739 16.6621 18.0142C16.6219 18.0544 16.5673 18.077 16.5104 18.077ZM18.7864 8.1195C18.7582 8.11957 18.7303 8.11406 18.7042 8.10331C18.6782 8.09255 18.6545 8.07675 18.6346 8.05682C18.6147 8.03689 18.5989 8.01322 18.5881 7.98716C18.5773 7.96111 18.5718 7.93319 18.5719 7.905V1.429H12.1119C12.055 1.429 12.0005 1.4064 11.9602 1.36617C11.92 1.32595 11.8974 1.27139 11.8974 1.2145C11.8974 1.15761 11.92 1.10305 11.9602 1.06283C12.0005 1.0226 12.055 1 12.1119 1H18.7869C18.9054 1 19.0009 1.0955 19.0009 1.2145V7.9055C19.001 7.93366 18.9955 7.96156 18.9847 7.98759C18.9739 8.01361 18.9581 8.03725 18.9382 8.05715C18.9183 8.07704 18.8946 8.09279 18.8685 8.10349C18.8425 8.11419 18.8146 8.11963 18.7864 8.1195Z" fill="white" />
                              <path d="M8.83016 11.405C8.78799 11.4046 8.74687 11.3918 8.71192 11.3682C8.67697 11.3446 8.64972 11.3113 8.63357 11.2723C8.61743 11.2334 8.61309 11.1905 8.62111 11.1491C8.62912 11.1077 8.64914 11.0696 8.67866 11.0395L18.5412 1.15698C18.5822 1.12144 18.6352 1.10276 18.6895 1.10469C18.7438 1.10662 18.7953 1.12903 18.8338 1.1674C18.8722 1.20577 18.8947 1.25727 18.8967 1.31155C18.8987 1.36583 18.8801 1.41886 18.8447 1.45998L8.98216 11.342C8.96221 11.362 8.93852 11.3778 8.91244 11.3886C8.88635 11.3994 8.85839 11.405 8.83016 11.405Z" fill="white" />
                            </svg>
                          </div>
                        </button>
                      </div>

                      {/* ****************** */}

                      {/* popup for export start */}
                      <div class="modal timesheet-weekly-approval-export-download-model-class" id="approvalexportpopupModal" tabindex="-1" aria-labelledby="approvalexportpopupModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered timesheet-weekly-approval-export-download-model-dialog">
                          <div class="modal-content timesheet-weekly-approval-export-download-model">
                            {/* <div class="modal-header timesheet-weekly-export-download-modal-header">
                                
                              </div> */}
                            <div class="modal-body timesheet-weekly-approval-export-download-modal-body">
                              <div>
                                <div className='d-flex flex-row justify-content-between'>
                                  <div className='d-flex flex-column'>
                                    <h5 class="modal-title timesheet-weekly-approval-export-download-model-title" id="approvalexportpopupModalLabel">EXPORT</h5>
                                    <p class="timesheet-weekly-approval-export-download-model-title-p">QUICKLY SAVE YOUR TIMESHEETS IN VARIOUS FORMATS</p>
                                  </div>
                                  {/* <button type="button" className="timesheet-weekly-approval-export-download-model-close-icon" data-bs-dismiss="modal" aria-label="Close"><IoClose style={{ fontSize: '20px', paddingBottom: '3px' }} /></button> */}
                                  <div className="timesheet-weekly-approval-export-download-model-close-icon" data-bs-dismiss="modal" aria-label="Close">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <path d="M4 12L12 4M12 12L4 4" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                  </div>
                                </div>
                                <div className="timesheet-weekly-approval-export-download-empty-line "></div>
                                <div className='d-flex flex-row justify-content-between timesheet-weekemail-passing-approval-export-format-export'>
                                  <div className='email-passing-export-timesheet-week-approval' >
                                    <label className='email-passing-export-timesheet-week-approval-label'>Enter your email to export</label>
                                    <div className='d-flex flex-row email-passing-export-timesheet-week-approval-input-and-icon'>
                                      {/* <HiMail className='email-passing-export-timesheet-week-icon' /> */}
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 21C10.758 21 9.589 20.764 8.493 20.292C7.39767 19.8193 6.44467 19.178 5.634 18.368C4.82333 17.5587 4.18167 16.6067 3.709 15.512C3.23633 14.4173 3 13.2477 3 12.003C3 10.759 3.236 9.589 3.708 8.493C4.18067 7.39767 4.822 6.44467 5.632 5.634C6.44133 4.82333 7.39333 4.18167 8.488 3.709C9.58267 3.23633 10.7523 3 11.997 3C13.241 3 14.411 3.23633 15.507 3.709C16.603 4.18167 17.556 4.823 18.366 5.633C19.1767 6.443 19.8183 7.39533 20.291 8.49C20.7637 9.58533 21 10.7553 21 12V12.988C21 13.8307 20.7107 14.5433 20.132 15.126C19.5533 15.7087 18.8427 16 18 16C17.404 16 16.8607 15.8367 16.37 15.51C15.8787 15.1833 15.5153 14.748 15.28 14.204C14.9 14.7513 14.425 15.1877 13.855 15.513C13.285 15.8377 12.6667 16 12 16C10.886 16 9.94067 15.612 9.164 14.836C8.38733 14.06 7.99933 13.1147 8 12C8 10.886 8.388 9.94067 9.164 9.164C9.94 8.38733 10.8853 7.99933 12 8C13.114 8 14.0593 8.388 14.836 9.164C15.6127 9.94 16.0007 10.8853 16 12V12.988C16 13.5373 16.196 14.01 16.588 14.406C16.9807 14.802 17.4513 15 18 15C18.5487 15 19.0193 14.802 19.412 14.406C19.804 14.01 20 13.5373 20 12.988V12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20H17V21H12ZM12 15C12.8333 15 13.5417 14.7083 14.125 14.125C14.7083 13.5417 15 12.8333 15 12C15 11.1667 14.7083 10.4583 14.125 9.875C13.5417 9.29167 12.8333 9 12 9C11.1667 9 10.4583 9.29167 9.875 9.875C9.29167 10.4583 9 11.1667 9 12C9 12.8333 9.29167 13.5417 9.875 14.125C10.4583 14.7083 11.1667 15 12 15Z" fill="black" fill-opacity="0.5" />
                                      </svg>
                                      <input className='email-passing-export-timesheet-week-approval-input' placeholder='Email ID'></input>
                                    </div>
                                  </div>
                                  <div className='d-flex flex-column format-export-timesheet-week-approval'>
                                    <label className='format-export-timesheet-week-approval-label'>Pick any one format</label>
                                    <select className='format-export-timesheet-week-approval-select'>
                                      <option value="pdf">PDF</option>
                                      <option value="excel">Excel</option>
                                      <option value="doc">Doc</option>
                                      <option value="xml">XML</option>
                                      <option value="csv">CSV</option>
                                      <option value="iff">IFF</option>
                                      <option value="adp">ADP</option>
                                      <option value="dxf">DXF</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div class="d-flex justify-content-center timesheet-weekly-approval-export-download-modal-footer">
                                <div className='d-flex flex-row'>
                                  <div className="button btn d-flex flex-row timesheet-weekly-approval-export-download-modal-footer-btn-download">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                      <g filter="url(#filter0_dd_2576_286)">
                                        <circle cx="15" cy="15" r="13" fill="#D9D9D9" />
                                      </g>
                                      <defs>
                                        <filter id="filter0_dd_2576_286" x="0" y="0" width="30" height="30" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                          <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                          <feOffset dx="1" dy="1" />
                                          <feGaussianBlur stdDeviation="0.5" />
                                          <feComposite in2="hardAlpha" operator="out" />
                                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2576_286" />
                                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                          <feOffset dx="-1" dy="-1" />
                                          <feGaussianBlur stdDeviation="0.5" />
                                          <feComposite in2="hardAlpha" operator="out" />
                                          <feColorMatrix type="matrix" values="0 0 0 0 0.0560025 0 0 0 0 0.600501 0 0 0 0 0.772448 0 0 0 0.15 0" />
                                          <feBlend mode="normal" in2="effect1_dropShadow_2576_286" result="effect2_dropShadow_2576_286" />
                                          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2576_286" result="shape" />
                                        </filter>
                                      </defs>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="-4 0 24 20" fill="none">
                                        <path d="M12 15.577L8.462 12.038L9.169 11.319L11.5 13.65V5H12.5V13.65L14.83 11.32L15.538 12.038L12 15.577ZM5 19V14.962H6V18H18V14.962H19V19H5Z" fill="black" fill-opacity="0.5" />
                                      </svg>
                                    </svg>

                                    {/* <BsFillArrowDownCircleFill className="timesheet-weekly-export-download-modal-footer-btn-download-icon" /> */}
                                    <div className="timesheet-weekly-approval-export-download-modal-footer-btn-download-div">Download</div>
                                  </div>
                                  <div className="button btn d-flex flex-row timesheet-weekly-approval-export-download-modal-footer-btn-export">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                      <g filter="url(#filter0_dd_2576_297)">
                                        <circle cx="15" cy="15" r="13" fill="#D9D9D9" />
                                      </g>
                                      <defs>
                                        <filter id="filter0_dd_2576_297" x="0" y="0" width="30" height="30" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                          <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                          <feOffset dx="1" dy="1" />
                                          <feGaussianBlur stdDeviation="0.5" />
                                          <feComposite in2="hardAlpha" operator="out" />
                                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2576_297" />
                                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                          <feOffset dx="-1" dy="-1" />
                                          <feGaussianBlur stdDeviation="0.5" />
                                          <feComposite in2="hardAlpha" operator="out" />
                                          <feColorMatrix type="matrix" values="0 0 0 0 0.0560025 0 0 0 0 0.600501 0 0 0 0 0.772448 0 0 0 0.15 0" />
                                          <feBlend mode="normal" in2="effect1_dropShadow_2576_297" result="effect2_dropShadow_2576_297" />
                                          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2576_297" result="shape" />
                                        </filter>
                                      </defs>

                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -3 13 20" fill="none">
                                        <path d="M16.7188 8.75V16.25C16.7188 16.5401 16.6035 16.8183 16.3984 17.0234C16.1933 17.2285 15.9151 17.3438 15.625 17.3438H4.375C4.08492 17.3438 3.80672 17.2285 3.6016 17.0234C3.39648 16.8183 3.28125 16.5401 3.28125 16.25V8.75C3.28125 8.45992 3.39648 8.18172 3.6016 7.9766C3.80672 7.77148 4.08492 7.65625 4.375 7.65625H6.25C6.37432 7.65625 6.49355 7.70564 6.58146 7.79354C6.66936 7.88145 6.71875 8.00068 6.71875 8.125C6.71875 8.24932 6.66936 8.36855 6.58146 8.45646C6.49355 8.54436 6.37432 8.59375 6.25 8.59375H4.375C4.33356 8.59375 4.29382 8.61021 4.26451 8.63951C4.23521 8.66882 4.21875 8.70856 4.21875 8.75V16.25C4.21875 16.2914 4.23521 16.3312 4.26451 16.3605C4.29382 16.3898 4.33356 16.4062 4.375 16.4062H15.625C15.6664 16.4062 15.7062 16.3898 15.7355 16.3605C15.7648 16.3312 15.7812 16.2914 15.7812 16.25V8.75C15.7812 8.70856 15.7648 8.66882 15.7355 8.63951C15.7062 8.61021 15.6664 8.59375 15.625 8.59375H13.75C13.6257 8.59375 13.5065 8.54436 13.4185 8.45646C13.3306 8.36855 13.2812 8.24932 13.2812 8.125C13.2812 8.00068 13.3306 7.88145 13.4185 7.79354C13.5065 7.70564 13.6257 7.65625 13.75 7.65625H15.625C15.9151 7.65625 16.1933 7.77148 16.3984 7.9766C16.6035 8.18172 16.7188 8.45992 16.7188 8.75ZM7.20625 5.33125L9.53125 3.00703V10.625C9.53125 10.7493 9.58064 10.8685 9.66854 10.9565C9.75645 11.0444 9.87568 11.0938 10 11.0938C10.1243 11.0938 10.2435 11.0444 10.3315 10.9565C10.4194 10.8685 10.4688 10.7493 10.4688 10.625V3.00703L12.7937 5.33125C12.8367 5.3773 12.8884 5.41424 12.9459 5.43986C13.0034 5.46548 13.0655 5.47926 13.1284 5.48037C13.1914 5.48148 13.2539 5.4699 13.3122 5.44633C13.3706 5.42275 13.4236 5.38766 13.4681 5.34315C13.5127 5.29864 13.5478 5.24562 13.5713 5.18725C13.5949 5.12888 13.6065 5.06636 13.6054 5.00342C13.6043 4.94048 13.5905 4.87841 13.5649 4.82091C13.5392 4.76341 13.5023 4.71166 13.4563 4.66875L10.3313 1.54375C10.2434 1.45597 10.1242 1.40666 10 1.40666C9.87578 1.40666 9.75664 1.45597 9.66875 1.54375L6.54375 4.66875C6.4977 4.71166 6.46076 4.76341 6.43514 4.82091C6.40952 4.87841 6.39574 4.94048 6.39463 5.00342C6.39352 5.06636 6.4051 5.12888 6.42867 5.18725C6.45225 5.24562 6.48734 5.29864 6.53185 5.34315C6.57636 5.38766 6.62938 5.42275 6.68775 5.44633C6.74612 5.4699 6.80864 5.48148 6.87158 5.48037C6.93452 5.47926 6.99659 5.46548 7.05409 5.43986C7.11159 5.41424 7.16334 5.3773 7.20625 5.33125Z" fill="black" fill-opacity="0.5" />
                                      </svg>

                                    </svg>

                                    {/* <div className="timesheet-weekly-export-download-modal-footer-btn-export-icon-container">
                                      <TiExportOutline className="timesheet-weekly-export-download-modal-footer-btn-export-icon" />
                                    </div> */}
                                    <div className="timesheet-weekly-approval-export-download-modal-footer-btn-export-div">Export</div>
                                  </div>
                                  <div className="button btn d-flex flex-row timesheet-weekly-approval-export-download-modal-footer-btn-close">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                      <g filter="url(#filter0_dd_2576_303)">
                                        <circle cx="15" cy="15" r="13" fill="#D9D9D9" />
                                      </g>
                                      <defs>
                                        <filter id="filter0_dd_2576_303" x="0" y="0" width="30" height="30" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                          <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                          <feOffset dx="1" dy="1" />
                                          <feGaussianBlur stdDeviation="0.5" />
                                          <feComposite in2="hardAlpha" operator="out" />
                                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2576_303" />
                                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                          <feOffset dx="-1" dy="-1" />
                                          <feGaussianBlur stdDeviation="0.5" />
                                          <feComposite in2="hardAlpha" operator="out" />
                                          <feColorMatrix type="matrix" values="0 0 0 0 0.0560025 0 0 0 0 0.600501 0 0 0 0 0.772448 0 0 0 0.15 0" />
                                          <feBlend mode="normal" in2="effect1_dropShadow_2576_303" result="effect2_dropShadow_2576_303" />
                                          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2576_303" result="shape" />
                                        </filter>
                                      </defs>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20" fill="none">
                                        <path d="M7.33316 18.2567L6.74316 17.6667L11.4098 13L6.74316 8.33333L7.33316 7.74333L11.9998 12.41L16.6665 7.74333L17.2565 8.33333L12.5898 13L17.2565 17.6667L16.6665 18.2567L11.9998 13.59L7.33316 18.2567Z" fill="black" fill-opacity="0.5" />
                                      </svg>
                                    </svg>

                                    {/* <AiFillCloseCircle className="timesheet-weekly-export-download-modal-footer-btn-close-icon" /> */}
                                    <div className="timesheet-weekly-approval-export-download-modal-footer-btn-close-div">Close</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                      {/* popup for export start */}

                      {/* ****************** */}
                      {/* <div className="card flex justify-content-center timesheet-approval-filter-customperiod ms-4">
                        <MultiSelect value={selectedCustomperiod} onChange={(e) => setSelectedCustomperiod(e.value)} options={Customperiod} optionLabel="name"
                          filter placeholder="Select Period" maxSelectedLabels={3} className="timesheet-approval-filter-customperiod-multiselect" />
                      </div> */}

                      <div className="card flex justify-content-center timesheet-approval-filter-customperiod me-4 mt-1">
                        <Dropdown value={selectedCustomperiod} onChange={handlecustomperiodChange} options={Customperiod} optionLabel="name" placeholder="Select Period"
                          filter valueTemplate={selectedCustomperiodTemplate} itemTemplate={selectedCustomperiodOptionTemplate} className="timesheet-approval-filter-customperiod-multiselect" />
                      </div>

                      {selectedCustomperiodvalue === "Custom" && (
                        <div className='timesheet-approval-filter-custom-datepicker me-4 mt-1'>
                          <DatePicker
                            selected={customstartDate}
                            onChange={handlecalandarChange}
                            startDate={customstartDate}
                            endDate={customendDate}
                            selectsRange
                            placeholderText="Select dates"

                            className='timesheet-approval-filter-custom-date-picker'
                            customInput={<CustomDatePickerInput />}
                          />
                        </div>
                      )}

                    </div>
                  </div>

                  {/* ******************** */}

                  <div className='timesheet-approval-table-background mt-5'>
                    <div className="timesheet-approval-data-table-weekly table-responsive ">
                      <table className='timesheet-approval-data-table table table-borderless'>
                        <thead className='timesheet-approval-data-table-head'>
                          <tr className='timesheet-approval-data-table-head-tr'>
                            <th className='timesheet-approval-data-table-head-th-column-members'><div className='timesheet-approval-data-table-head-th-column-div-members '>Members</div></th>
                            <th className='timesheet-approval-data-table-head-th-column-project'><div className='timesheet-approval-data-table-head-th-column-div-project'>Project</div></th>
                            <th className='timesheet-approval-data-table-head-th-column-timeperiods'><div className='timesheet-approval-data-table-head-th-column-div-timeperiods'>Time Periods</div></th>
                            <th className='timesheet-approval-data-table-head-th-column-paytype'><div className='timesheet-approval-data-table-head-th-column-div-paytype'>Pay type</div></th>

                            {selectedCustomperiodvalue === undefined && (
                              renderSelectedDefaultDatesthisweekhead()
                            )}

                            {selectedCustomperiodvalue === "Custom" && (
                              renderSelectedDatescustomhead()
                            )}
                            {selectedCustomperiodvalue === "Today" && (
                              renderSelectedDatestodayhead()
                            )}
                            {selectedCustomperiodvalue === "This Week" && (
                              renderSelectedDatesthisweekhead()
                            )}
                            {selectedCustomperiodvalue === "Last Week" && (
                              renderSelectedDateslastweekhead()
                            )}
                            {selectedCustomperiodvalue === "This Month" && (
                              renderSelectedDatesthismonthhead()
                            )}
                            {selectedCustomperiodvalue === "Last Month" && (
                              renderSelectedDateslastmonthhead()
                            )}

                            <th className='timesheet-approval-data-table-head-th-column-total'>
                              <div className='timesheet-approval-data-table-head-th-column-div-total'>TOTAL</div>
                            </th>
                            <th className='timesheet-approval-data-table-head-th-column-approvalicon'>
                              <div className='timesheet-approval-data-table-head-th-column-approvalicon-div'>
                                Status
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTimesheet.map((timesheetData, index) => (
                            <tr key={index} className='timesheet-approval-data-table-body-tr'>
                              <td className='timesheet-approval-data-table-body-td-column-member'><div className='timesheet-approval-data-table-body-td-column-div-member'>{timesheetData.employeeName}</div></td>
                              <td className='timesheet-approval-data-table-body-td-column-project'><div className='timesheet-approval-data-table-body-td-column-div-project'>{getUniqueProjectNames(timesheetData).join(', ') || 'No Project'}</div></td>
                              <td className='timesheet-approval-data-table-body-td-column-timeperiods'>
                                <div className='timesheet-approval-data-table-body-td-column-div1-timeperiods'>
                                  <div className='mt-1'>{new Date(timesheetData.startDate).toLocaleDateString()}</div>
                                  <div className='mt-1'>to</div>
                                  <div className='mt-1'>{new Date(timesheetData.endDate).toLocaleDateString()}</div>
                                </div>
                              </td>
                              <td className='timesheet-approval-data-table-body-td-column-paytype'>
                                <div class="timesheet-approval-data-table-body-td-column-div-paytype">
                                  <div className='timesheet-approval-data-table-body-td-column-div-paytype-regular pb-4'>Regular</div>
                                  <div className='timesheet-approval-data-table-body-td-column-div-paytype-overtime'>Overtime</div>
                                </div>
                              </td>
                              {selectedCustomperiodvalue === undefined &&
                                weekdays.map((day, i) => (
                                  <td key={i} className='timesheet-approval-data-table-body-td-column-dates'>
                                    <div className='timesheet-approval-data-table-body-td-column-div-dates'>
                                      <input
                                        type='number'
                                        className='timesheet-approval-data-table-body-td-column-div-dates-inputs-regular mb-4'
                                        value={timesheetData.days[i]?.weeklyEntries.reduce((sum, entry) => sum + (entry.regularHours || 0), 0) || 0}
                                      />
                                      <input
                                        type='number'
                                        className='timesheet-approval-data-table-body-td-column-div-dates-inputs-overtime'
                                        value={timesheetData.days[i]?.weeklyEntries.reduce((sum, entry) => sum + (entry.overtimeHours || 0), 0) || 0}
                                      />
                                    </div>
                                  </td>
                                ))
                              }

                              {selectedCustomperiodvalue === "Custom" && (
                                renderSelectedDatescustombody()
                              )}
                              {selectedCustomperiodvalue === "Today" && (
                                renderSelectedDatestodaybody()
                              )}
                              {selectedCustomperiodvalue === "This Week" && (
                                renderSelectedDatesthisweekbody()
                              )}
                              {selectedCustomperiodvalue === "Last Week" && (
                                renderSelectedDateslastweekbody()
                              )}
                              {selectedCustomperiodvalue === "This Month" && (
                                renderSelectedDatesthismonthbody()
                              )}
                              {selectedCustomperiodvalue === "Last Month" && (
                                renderSelectedDateslastmonthbody()
                              )}

                              <td className='timesheet-approval-data-table-body-td-column-total'>
                                <div className='timesheet-approval-data-table-body-td-column-div-total'>
                                  <input type='number' className='timesheet-approval-data-table-body-td-column-div-total-inputs-regular mb-3' defaultValue={timesheetData.totalRegularHours} />
                                  <input type='number' className='timesheet-approval-data-table-body-td-column-div-total-inputs-overtime' defaultValue={timesheetData.totalOvertimeHours} />
                                </div>
                              </td>
                              <td className='timesheet-approval-data-table-body-td-column-approvalicon' >

                                <div className={`button btn timesheet-approval-data-table-body-td-column-approvalicon-div-button d-flex flex-row ${timesheetData.status === 'Submitted'
                                  ? 'timesheet-approval-data-table-body-td-column-approvalicon-div-button-pending'
                                  : timesheetData.status === 'Approved'
                                    ? 'timesheet-approval-data-table-body-td-column-approvalicon-div-button-approved'
                                    : timesheetData.status === 'Approved (Freezed)'
                                      ? 'timesheet-approval-data-table-body-td-column-approvalicon-div-button-approved-freezed'
                                      : 'timesheet-approval-data-table-body-td-column-approvalicon-div-button-rejected'
                                  }`} data-bs-toggle="modal" data-bs-target="#timesheetapprovalpopupModal" onClick={() => setCurrentTimesheetData(timesheetData)}
                                >
                                  <div className='timesheet-approval-data-table-body-td-column-approvalicon-div-button-div'>{timesheetData.status === 'Submitted' ? 'Pending' : timesheetData.status === 'Approved (Freezed)' ? 'Freezed' : timesheetData.status}</div>
                                  <div className='timesheet-approval-data-table-body-td-column-approvalicon-svg '>
                                    {timesheetData.status === 'Submitted' ? (
                                      <div className='ms-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                          <path d="M0 8.01421C0 6.56483 0.362345 5.22203 1.07993 3.9929C1.79751 2.76377 2.77087 1.79041 4 1.07282C5.22913 0.35524 6.56483 0 8.0071 0C9.08703 0 10.1243 0.213144 11.1119 0.632327C12.0995 1.05151 12.9449 1.627 13.6625 2.33748C14.3801 3.04796 14.9485 3.90053 15.3677 4.8952C15.7869 5.88988 16 6.92007 16 8.01421C16 9.09414 15.7869 10.1314 15.3677 11.119C14.9485 12.1066 14.373 12.9591 13.6625 13.6696C12.952 14.3801 12.0995 14.9485 11.1119 15.3677C10.1243 15.7869 9.09414 16 8.0071 16C6.92007 16 5.87567 15.7869 4.8881 15.3677C3.90053 14.9485 3.04796 14.373 2.33037 13.6625C1.61279 12.952 1.05151 12.0995 0.625222 11.119C0.198934 10.1385 0 9.10124 0 8.01421ZM1.76199 8.01421C1.76199 9.69805 2.373 11.1616 3.60213 12.405C4.83126 13.6341 6.29485 14.2451 8.0071 14.2451C9.12966 14.2451 10.1741 13.968 11.1261 13.4067C12.0782 12.8455 12.8455 12.0924 13.4067 11.1332C13.968 10.1741 14.2522 9.13677 14.2522 8.01421C14.2522 6.89165 13.968 5.84725 13.4067 4.8881C12.8455 3.92895 12.0853 3.16874 11.1261 2.60746C10.167 2.04618 9.12966 1.76909 8.0071 1.76909C6.88455 1.76909 5.84014 2.04618 4.8881 2.60746C3.93606 3.16874 3.16874 3.92895 2.60036 4.8881C2.03197 5.84725 1.76199 6.89165 1.76199 8.01421ZM4.09947 8.00711C4.09947 7.8437 4.15631 7.7016 4.26998 7.58792C4.38366 7.47425 4.52575 7.41741 4.68917 7.41741H7.38188V3.28242C7.38188 3.11901 7.43872 2.97691 7.5524 2.86323C7.66607 2.74956 7.80817 2.69272 7.97158 2.69272C8.13499 2.69272 8.27709 2.74956 8.39076 2.86323C8.50444 2.97691 8.56128 3.11901 8.56128 3.28242V8.02131C8.56128 8.18472 8.50444 8.32682 8.39076 8.4405C8.27709 8.55417 8.13499 8.61101 7.97158 8.61101C7.90053 8.61101 7.8579 8.61101 7.83659 8.60391H4.68206C4.51865 8.60391 4.37655 8.54707 4.26288 8.42629C4.15804 8.31183 4.09976 8.16232 4.09947 8.00711Z" fill="white" />
                                        </svg>
                                      </div>
                                    ) : timesheetData.status === 'Approved' ? (
                                      <div className='ms-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                          <path d="M14.2507 8.74998C13.7507 11.25 11.8657 13.604 9.22071 14.13C7.9307 14.3869 6.59252 14.2303 5.39672 13.6824C4.20091 13.1345 3.20843 12.2233 2.56061 11.0786C1.91278 9.93383 1.64263 8.61387 1.78862 7.30666C1.93461 5.99944 2.4893 4.77161 3.37371 3.79798C5.18771 1.79998 8.25071 1.24998 10.7507 2.24998" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                          <path d="M5.75 7.75L8.25 10.25L14.25 3.75" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                      </div>
                                    ) : timesheetData.status === 'Approved (Freezed)' ? (
                                      <div className='ms-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                          <path d="M14.2507 8.74998C13.7507 11.25 11.8657 13.604 9.22071 14.13C7.9307 14.3869 6.59252 14.2303 5.39672 13.6824C4.20091 13.1345 3.20843 12.2233 2.56061 11.0786C1.91278 9.93383 1.64263 8.61387 1.78862 7.30666C1.93461 5.99944 2.4893 4.77161 3.37371 3.79798C5.18771 1.79998 8.25071 1.24998 10.7507 2.24998" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                          <path d="M5.75 7.75L8.25 10.25L14.25 3.75" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                      </div>
                                    ) :
                                      <div className='ms-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                          <path d="M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14Z" fill="white" />
                                          <path d="M10.7 11.5L8 8.8L5.3 11.5L4.5 10.7L7.2 8L4.5 5.3L5.3 4.5L8 7.2L10.7 4.5L11.5 5.3L8.8 8L11.5 10.7L10.7 11.5Z" fill="white" />
                                        </svg>
                                      </div>}
                                  </div>
                                </div>
                              </td>

                              {/* ******************** */}

                              <div class="modal timesheet-weekly-approval-model" id="timesheetapprovalpopupModal" tabindex="-1" aria-labelledby="timesheetapprovalpopupModalLabel" aria-hidden="true">
                                <div class="modal-dialog  timesheet-weekly-approval-model-dialog">
                                  <div class="modal-content timesheet-weekly-approval-model-content">
                                    {/* <div class="modal-header timesheet-weekly-export-download-modal-header">
                                
                              </div> */}
                                    <div class="modal-body timesheet-weekly-approval-modal-body">
                                      <div className='d-flex justify-content-between'>
                                        <h5 class="modal-title timesheet-weekly-approval-model-title mt-3 mb-4" id="timesheetapprovalpopupModalLabel">
                                          {currentTimesheetData && (
                                            <span className='d-flex gap-2'>
                                              <div>Effective from</div>
                                              <div>{new Date(currentTimesheetData.startDate).toLocaleDateString()} to{' '}
                                                {new Date(currentTimesheetData.endDate).toLocaleDateString()}</div>
                                            </span>
                                          )}
                                        </h5>
                                        <div className="timesheet-weekly-approval-model-close-icon" data-bs-dismiss="modal" aria-label="Close">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M4 12L12 4M12 12L4 4" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                          </svg>
                                        </div>
                                      </div>
                                      <textarea
                                        id="timesheet-weekly-approval-model-comment-textarea-id"
                                        className="timesheet-weekly-approval-model-comment-textarea-name p-2"
                                        rows="6"
                                        placeholder="Please provide your commentary"
                                      />

                                      <div className='timesheet-weekly-approval-model-approve-reject-button d-flex justify-content-between'>
                                        <div className='d-flex flex-row'>
                                          {currentTimesheetData?.status === 'Approved (Freezed)' ? (
                                            <button type="button" className="btn timesheet-weekly-approval-model-un-freezed-approval-button mt-3 me-2"
                                            onClick={handleApproveTimesheet} data-bs-dismiss="modal">
                                              Undo Freeze Approval
                                            </button>
                                          ) : (
                                            <>
                                              <button type="button" className={`btn timesheet-weekly-approval-model-approve-button mt-3 me-3 ${buttonsDisabledApproved ? 'timesheet-weekly-approval-model-approve-button-disabled' : ''
                                                }`} onClick={handleApproveTimesheet} data-bs-dismiss="modal" disabled={buttonsDisabledApproved}>Approve</button>
                                              <button type="button" className={`btn timesheet-weekly-approval-model-reject-button mt-3 me-3 ${buttonsDisabledRejected ? 'timesheet-weekly-approval-model-reject-button-disabled' : ''
                                                }`} onClick={handleRejectedTimesheet} data-bs-dismiss="modal" disabled={buttonsDisabledRejected}>Reject</button>
                                              <button type="button" className={`btn timesheet-weekly-approval-model-discardapproval-button mt-3 me-3 ${buttonsDisabledDeclineApproved ? 'timesheet-weekly-approval-model-discardapproval-button-disabled' : ''
                                                }`} data-bs-dismiss="modal" onClick={handleDeclineApprovalTimesheet} disabled={buttonsDisabledDeclineApproved} >Decline Approval</button>
                                              {currentTimesheetData?.status === 'Approved' && (
                                                <button type="button" className={`btn timesheet-weekly-approval-model-freezed-approval-button mt-3 me-2
                                            }`} onClick={handleFreezeApproveTimesheet} data-bs-dismiss="modal">Freeze Approval</button>
                                              )}
                                            </>
                                          )}
                                        </div>
                                        {/* <div className='d-flex flex-column'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" onClick={toggleDropdownapprovaldiscardbutton} style={{ cursor: 'pointer' , marginLeft: '82px' , marginTop: '10px'}}>
                                          <g opacity="0.5">
                                            <path d="M10 7.5C9.50555 7.5 9.0222 7.64662 8.61108 7.92133C8.19995 8.19603 7.87952 8.58648 7.6903 9.04329C7.50108 9.50011 7.45157 10.0028 7.54804 10.4877C7.6445 10.9727 7.8826 11.4181 8.23223 11.7678C8.58187 12.1174 9.02732 12.3555 9.51228 12.452C9.99723 12.5484 10.4999 12.4989 10.9567 12.3097C11.4135 12.1205 11.804 11.8 12.0787 11.3889C12.3534 10.9778 12.5 10.4945 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5ZM10 11.25C9.75277 11.25 9.5111 11.1767 9.30554 11.0393C9.09998 10.902 8.93976 10.7068 8.84515 10.4784C8.75054 10.2499 8.72579 9.99861 8.77402 9.75614C8.82225 9.51366 8.9413 9.29093 9.11612 9.11612C9.29093 8.9413 9.51366 8.82225 9.75614 8.77402C9.99861 8.72579 10.2499 8.75054 10.4784 8.84515C10.7068 8.93976 10.902 9.09998 11.0393 9.30554C11.1767 9.5111 11.25 9.75277 11.25 10C11.25 10.3315 11.1183 10.6495 10.8839 10.8839C10.6495 11.1183 10.3315 11.25 10 11.25ZM3.75 7.5C3.25555 7.5 2.7722 7.64662 2.36108 7.92133C1.94995 8.19603 1.62952 8.58648 1.4403 9.04329C1.25108 9.50011 1.20157 10.0028 1.29804 10.4877C1.3945 10.9727 1.6326 11.4181 1.98223 11.7678C2.33187 12.1174 2.77732 12.3555 3.26228 12.452C3.74723 12.5484 4.24989 12.4989 4.70671 12.3097C5.16352 12.1205 5.55397 11.8 5.82868 11.3889C6.10338 10.9778 6.25 10.4945 6.25 10C6.25 9.33696 5.98661 8.70107 5.51777 8.23223C5.04893 7.76339 4.41304 7.5 3.75 7.5ZM3.75 11.25C3.50277 11.25 3.2611 11.1767 3.05554 11.0393C2.84998 10.902 2.68976 10.7068 2.59515 10.4784C2.50054 10.2499 2.47579 9.99861 2.52402 9.75614C2.57225 9.51366 2.6913 9.29093 2.86612 9.11612C3.04093 8.9413 3.26366 8.82225 3.50614 8.77402C3.74861 8.72579 3.99995 8.75054 4.22836 8.84515C4.45676 8.93976 4.65199 9.09998 4.78934 9.30554C4.92669 9.5111 5 9.75277 5 10C5 10.3315 4.86831 10.6495 4.63388 10.8839C4.39946 11.1183 4.08152 11.25 3.75 11.25ZM16.25 7.5C15.7555 7.5 15.2722 7.64662 14.8611 7.92133C14.45 8.19603 14.1295 8.58648 13.9403 9.04329C13.7511 9.50011 13.7016 10.0028 13.798 10.4877C13.8945 10.9727 14.1326 11.4181 14.4822 11.7678C14.8319 12.1174 15.2773 12.3555 15.7623 12.452C16.2472 12.5484 16.7499 12.4989 17.2067 12.3097C17.6635 12.1205 18.054 11.8 18.3287 11.3889C18.6034 10.9778 18.75 10.4945 18.75 10C18.75 9.33696 18.4866 8.70107 18.0178 8.23223C17.5489 7.76339 16.913 7.5 16.25 7.5ZM16.25 11.25C16.0028 11.25 15.7611 11.1767 15.5555 11.0393C15.35 10.902 15.1898 10.7068 15.0952 10.4784C15.0005 10.2499 14.9758 9.99861 15.024 9.75614C15.0723 9.51366 15.1913 9.29093 15.3661 9.11612C15.5409 8.9413 15.7637 8.82225 16.0061 8.77402C16.2486 8.72579 16.4999 8.75054 16.7284 8.84515C16.9568 8.93976 17.152 9.09998 17.2893 9.30554C17.4267 9.5111 17.5 9.75277 17.5 10C17.5 10.3315 17.3683 10.6495 17.1339 10.8839C16.8995 11.1183 16.5815 11.25 16.25 11.25Z" fill="black" />
                                          </g>
                                        </svg>
                                        {isOpenapprovaldiscardbutton && (
                                          <button type="button" class="btn timesheet-weekly-approval-model-discardapproval-button ">Discard Approval</button>
                                        )}
                                      </div> */}
                                      </div>
                                      <div className="d-flex align-items-center ">
                                        {/* <input className="timesheet-weekly-approval-model-form-check-input-email me-2" type="checkbox" id="timesheetweeklyapprovalmodelformchecklabelemail" /> */}
                                        <label className="timesheet-weekly-approval-model-form-check-label-email mt-3 me-2" for="timesheetweeklyapprovalmodelformchecklabelemail">
                                          Correspond with via email
                                        </label>
                                        <label className="timesheet-weekly-approval-model-form-check-label-email-id mt-3" for="timesheetweeklyapprovalmodelformchecklabelemail">
                                          Vicky@gmail.com
                                        </label>
                                      </div>
                                      {/* <div >
                                      <div className='timesheet-weekly-approval-model-history-of-approvals-heading mt-3'>History Of Approvals</div>
                                      <p className='timesheet-weekly-approval-model-history-of-approvals-p mt-2'>Mon 5th feb 2024 partially approved by administrator</p>

                                    </div> */}
                                    </div>
                                    {/* <div class="modal-footer">

                                  </div> */}
                                  </div>
                                </div>
                              </div>

                              {/* popup for export end */}

                              {/* ******************** */}
                            </tr>

                            // {/* <tr>
                            //   <td className='timesheet-approval-data-table-body-tr-empty' colSpan={12}></td>
                            // </tr> */}
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ******************** */}


                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </div>
  )
}

export default Timesheetapprovals