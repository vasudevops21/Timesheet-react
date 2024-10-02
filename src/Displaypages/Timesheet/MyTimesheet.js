import './MyTimesheet.css';

import { Link } from 'react-router-dom';
import Topbar from "../../Components/Topbar";
import Grid from '@mui/material/Grid';
import { hasPermission } from '../../utils/auth';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Sidebar from '../../Components/Sidebar';

import MUIDataTable from "mui-datatables";
import { IconButton } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { HiMail } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { TiExportOutline } from "react-icons/ti";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, navigate, useNavigate } from 'react-router-dom';
import { startOfWeek, getWeek, addDays, format } from 'date-fns';
import ReactSelect from 'react-select';
import ReactTooltip from 'react-tooltip';
import { Document, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, BorderStyle, PageOrientation, Packer } from 'docx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx'

export default function MyTimesheet() {

  const { id, setid } = useParams();
  const { state } = useLocation();
  const [timesheet, setTimesheet] = useState(state?.timesheet || []);
  const navigate = useNavigate();
  const [isViewMode, setIsViewMode] = useState(state?.isViewMode || false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTimesheetData, setCurrentTimesheetData] = useState(null);
  const [error, setError] = useState(null);
  const [editingTimesheetStatus, setEditingTimesheetStatus] = useState(null);
  const [editingTimesheet, setEditingTimesheet] = useState(null);
  const [deletingTimesheet, setDeletingTimesheet] = useState({ id: null, status: null });
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async (status) => {
    try {

      const userInfoString = localStorage.getItem("userInfo");
      const userInfo = JSON.parse(userInfoString);
      const employeeId = userInfo["employeeId"];

      const response = await axios.get(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/weekly/list/${employeeId}`);
      const filteredTimesheets = response.data
        .filter(timesheet => {
          if (status) {
            return timesheet.status === status;
          } else {
            return timesheet.status === 'Submitted' || timesheet.status === 'Approved' || timesheet.status === 'Rejected' || timesheet.status === 'Approved (Freezed)';
          }
        })
        .map(timesheet => {
          const days = timesheet.days;
          const startDate = days.length > 0 ? days[0].startDate : '';
          const endDate = days.length > 0 ? days[days.length - 1].startDate : '';

          // Get all unique project names
          const projectNames = [...new Set(days.flatMap(day =>
            day.weeklyEntries.map(entry => entry.projectName)))];

          const taskNames = [...new Set(days.flatMap(day =>
            day.weeklyEntries.map(entry => entry.taskName)))];

          return {
            id: timesheet.id,
            employeeName: timesheet.employeeName,
            employeeId: timesheet.employeeId,
            employeesId: timesheet.employeesId,
            status: timesheet.status,
            currentDateTime: timesheet.currentDateTime,
            totalBillableHours: timesheet.reportedHours,
            totalHours: timesheet.totalHours,
            totalRegularHours: timesheet.totalRegularHours,
            totalOvertimeHours: timesheet.totalOvertimeHours,
            startDate: startDate,
            endDate: endDate,
            projects: projectNames.join(', '),
            tasks: taskNames.join(', '),
            days: days.map(day => ({
              date: day.startDate,
              entries: day.weeklyEntries.map(entry => ({
                projectName: entry.projectName,
                taskName: entry.taskName,
                regularHours: entry.regularHours,
                regularComments: entry.regularComments,
                overtimeHours: entry.overtimeHours,
                overtimeComments: entry.overtimeComments
              }))
            }))
          };
        });
      setTimesheet(filteredTimesheets);
      if (filteredTimesheets.length > 0) {
        setCurrentTimesheetData(filteredTimesheets[0]);
      } else {
        console.warn('No timesheet data available');
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      setError('Failed to fetch timesheets');
    }
  };


  const handleDeleteTimesheet = async (id, status) => {
    if (status === 'Approved' || status === 'Rejected' || status === 'Approved (Freezed)') {
      return; // Do nothing if the status is 'Approved'
    }
    try {
      // Make a DELETE request to your backend API to delete the timesheet entry
      await axios.delete(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/weekly/delete/${id}`);

      // After successful deletion, update the state to reflect the changes
      setTimesheet(timesheet.filter(timesheet => timesheet.id !== id));
    } catch (error) {
      console.error('Error deleting timesheet:', error);
    }
  };

  // const handleEditClick = async (id, status) => {
  //   if (status === 'Approved') {
  //     return; 
  //   }
  //   try {
  //     const response = await axios.get(`http://localhost:8080/api/v1/timesheet/weekly/view/${id}`);
  //     console.log(response.data);
  //     const timesheetData = response.data;
  //     setIsEditMode(true);
  //     setIsViewMode(false);
  //     navigate(`/timesheet/edit-week-timesheet/${id}`, { state: { timesheet: timesheetData , disableSaveButton: true , activeRevisionButton: true } });
  //   } catch (error) {
  //     console.error('Error fetching timesheet:', error);
  //   }
  // };
  // const handleEditClick = async (id, status) => {
  //   // if (status === 'Approved') {
  //   //   return; 
  //   // }
  //   try {
  //     const response = await axios.get(`http://localhost:8080/api/v1/timesheet/weekly/view/${id}`);
  //     console.log(response.data);
  //     const timesheetData = response.data;
  //     setIsEditMode(true);
  //     setIsViewMode(false);
  //     navigate(`/timesheet/edit-week-timesheet/${id}`, { state: { timesheet: timesheetData, disableSaveButton: true, activeRevisionButton: true } });
  //   } catch (error) {
  //     console.error('Error fetching timesheet:', error);
  //   }
  // };

  const handleEditClick = async (id, status) => {
    if (status === 'Approved (Freezed)') {
      return; // Do nothing if the status is 'Approved (Freezed)'
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/timesheet/weekly/view/${id}`);
      console.log("Fetched timesheet data:", response.data);
      const timesheetData = response.data;
      setIsEditMode(true);
      setIsViewMode(false);
      setEditingTimesheetStatus(status);
      navigate(`/timesheet/edit-week-timesheet/${id}`, { 
        state: { 
          timesheet: timesheetData, 
          disableSaveButton: true, 
          activeRevisionButton: true,
          editMode: true // Add this flag to indicate edit mode
        } 
      });
    } catch (error) {
      console.error('Error fetching timesheet:', error);
    }
  };

  const handleViewClick = async (id, status) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/timesheet/weekly/view/${id}`);
      console.log("Fetched timesheet data:", response.data);
      const timesheetData = response.data;
      setIsEditMode(true);
      setIsViewMode(false);
      setEditingTimesheetStatus(status);
      navigate(`/timesheet/view-week-timesheet/${id}`, { 
        state: { 
          timesheet: timesheetData, 
          disableSaveButton: true, 
          activeRevisionButton: true,
          editMode: true // Add this flag to indicate edit mode
        } 
      });
    } catch (error) {
      console.error('Error fetching timesheet:', error);
    }
  };

  const getStatusiconvalueDetails = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return {
          color: '#38BA7C', // green color
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="none">
              <path d="M14.2497 8.75005C13.7497 11.25 11.8647 13.604 9.21974 14.13C7.92973 14.3869 6.59155 14.2303 5.39574 13.6824C4.19993 13.1346 3.20746 12.2234 2.55963 11.0786C1.91181 9.93389 1.64165 8.61393 1.78765 7.30672C1.93364 5.99951 2.48833 4.77167 3.37274 3.79805C5.18674 1.80005 8.24974 1.25005 10.7497 2.25005" stroke="#38BA7C" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M5.75 7.75L8.25 10.25L14.25 3.75" stroke="#38BA7C" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          )
        };
      case 'rejected':
        return {
          color: '#FF7F7F', // red color
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="none">
              <path d="M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14Z" fill="#FF7F7F" />
              <path d="M10.7 11.5L8 8.8L5.3 11.5L4.5 10.7L7.2 8L4.5 5.3L5.3 4.5L8 7.2L10.7 4.5L11.5 5.3L8.8 8L11.5 10.7L10.7 11.5Z" fill="#FF7F7F" />
            </svg>
          )
        };
      default:
        return {
          color: 'rgba(255, 165, 0, 0.70)', // orange color for submitted or other statuses
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 11H17C17.2652 11 17.5196 11.1054 17.7071 11.2929C17.8946 11.4804 18 11.7348 18 12C18 12.2652 17.8946 12.5196 17.7071 12.7071C17.5196 12.8946 17.2652 13 17 13H12C11.7348 13 11.4804 12.8946 11.2929 12.7071C11.1054 12.5196 11 12.2652 11 12V6C11 5.73478 11.1054 5.48043 11.2929 5.29289C11.4804 5.10536 11.7348 5 12 5C12.2652 5 12.5196 5.10536 12.7071 5.29289C12.8946 5.48043 13 5.73478 13 6V11ZM12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20Z" fill="#FFA500" fill-opacity="0.7" />
            </svg>
          )
        };
    }
  };

  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    {
      name: "id",
      label: "S.No",
      download: true,
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "employeeName",
      label: "Employee Name",
      download: true,
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { minWidth: '200px', height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "employeesId",
      label: "Employee Id",
      download: true,
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { minWidth: '200px', height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "startDate",
      label: "Start Date",
      download: true,
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { minWidth: '220px', height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "endDate",
      label: "End Date",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { minWidth: '220px', height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "projects",
      label: "Project Name",
      download: true,
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { minWidth: '200px', height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "projectId",
      label: "Project Id",
      download: true,
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { minWidth: '200px', height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "tasks",
      label: "Task Name",
      download: true,
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { minWidth: '200px', height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "revision",
      label: "Revision",
      download: true,
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "totalBillableHours",
      label: "Total Hours",
      download: true,
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { minWidth: '200px', height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "status",
      label: "Status",
      download: true,
      options: {
        filter: true,
        sort: false,
        setCellProps: (value) => {
          let tooltipText;
          if (value === "Rejected") {
            tooltipText = "Rejected";
          } else if (value === "Submitted") {
            tooltipText = "Waiting for the Approver";
          } else {
            tooltipText = value;
          }
          return {
            align: "center",
            style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
            title: tooltipText,
          };
        },
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { minWidth: '200px', height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "billtype",
      label: "Bill Type",
      download: true,
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          align: "center",
          style: { minWidth: '200px', height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
      }
    },
    {
      name: "options",
      label: "Actions",
      options: {
        filter: true,
        sort: false,
        setCellProps: () => ({
          align: "center",
          style: { position: "sticky", right: -1, backgroundColor: '#EEECEC', color: 'rgba(0,0,0,0.50', fontSize: '14px', fontWeight: 400 },
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          align: "center",
          style: { position: "sticky", right: -1, backgroundColor: '#EEECEC', height: '70px', color: '#FFF', fontSize: '16px', fontWeight: 700 },
        }),
        customBodyRender: (value, tableMeta, updateValue) => {
          const id = tableMeta.rowData[0];
          const status = tableMeta.rowData[10]; // Assuming status is in the 11th column
          const isDisabled = status === 'Approved (Freezed)';
          const isDeleteallow = status === 'Submitted';
          return (
            <div className='d-flex flex-row my-timesheet-table-data-option-button-view-edit-delete'>

              <div className="button btn my-timesheet-table-data-option-button-view d-flex flex-row align-items-center" onClick={() => {handleViewClick(tableMeta.rowData[0], tableMeta.rowData[10])}}>
                <div className='my-timesheet-table-data-option-button-view-icon' >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5.99967 2.97332C6.64647 2.76828 7.32116 2.66482 7.99967 2.66665C10.7877 2.66665 12.685 4.33332 13.8163 5.80265C14.383 6.53998 14.6663 6.90732 14.6663 7.99998C14.6663 9.09332 14.383 9.46065 13.8163 10.1973C12.685 11.6666 10.7877 13.3333 7.99967 13.3333C5.21167 13.3333 3.31434 11.6666 2.18301 10.1973C1.61634 9.46132 1.33301 9.09265 1.33301 7.99998C1.33301 6.90665 1.61634 6.53932 2.18301 5.80265C2.52858 5.35112 2.91342 4.93104 3.33301 4.54732" stroke="white" stroke-linecap="round" />
                    <path d="M10 8C10 8.53043 9.78929 9.03914 9.41421 9.41421C9.03914 9.78929 8.53043 10 8 10C7.46957 10 6.96086 9.78929 6.58579 9.41421C6.21071 9.03914 6 8.53043 6 8C6 7.46957 6.21071 6.96086 6.58579 6.58579C6.96086 6.21071 7.46957 6 8 6C8.53043 6 9.03914 6.21071 9.41421 6.58579C9.78929 6.96086 10 7.46957 10 8Z" stroke="white" />
                  </svg>
                </div>
                <div className='my-timesheet-table-data-option-button-view-div'>View</div>
              </div>
              {/* <div className={`button btn my-timesheet-table-data-option-button-edit d-flex flex-row ${tableMeta.rowData[10] === 'Approved' ? 'my-timesheet-table-data-option-button-edit-disabled-button' : ''}`}
                 onClick={() => handleEditClick(id, tableMeta.rowData[10])} disabled={tableMeta.rowData[10] === 'Approved'}>
                <div className='my-timesheet-table-data-option-button-edit-icon'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.84458 12.788C5.69943 14.6429 8.11029 15.1986 9.29543 15.3126C9.64372 15.3526 9.838 15.1383 9.86458 14.9174C9.89143 14.6832 9.744 14.4286 9.40943 14.3817C8.338 14.2343 6.12143 13.7523 4.51429 12.1252C1.88915 9.49344 1.39372 5.51572 3.53658 3.37287C5.27772 1.63858 8.17715 1.85944 10.3134 3.01115L11.0097 2.33487C8.41143 0.774581 4.916 0.647439 2.86686 2.70315C0.429432 5.14744 0.750861 9.6943 3.84458 12.788ZM13.6617 3.29915L14.1971 2.76344C14.4514 2.50915 14.4651 2.13401 14.204 1.89287L14.0297 1.7323C13.8023 1.51801 13.4471 1.52458 13.1994 1.75887L12.6706 2.30144L13.6617 3.29915ZM7.15943 9.78773L13.1726 3.78115L12.1749 2.7903L6.16829 8.7903L5.61258 10.0692C5.55886 10.2097 5.69943 10.3506 5.84686 10.3034L7.15943 9.78773ZM6.28229 10.7857C8.47172 12.9754 11.994 13.8394 13.9629 11.8772C15.57 10.2634 15.3623 7.39715 13.6414 4.93315L12.9586 5.61601C14.3243 7.6383 14.5923 9.90858 13.2931 11.2074C11.7131 12.788 9.10115 12.038 7.30657 10.3437L6.28229 10.7857Z" fill="white" />
                  </svg>
                </div>
                <div className='my-timesheet-table-data-option-button-edit-div'>Edit</div>
              </div> */}
              {/* onClick={() => handleEditClick(id, tableMeta.rowData[10])} */}
              <div className={`button btn my-timesheet-table-data-option-button-edit d-flex flex-row align-items-center ${isDisabled ? 'my-timesheet-table-data-option-button-edit-disabled-button' : ''}`}
                onClick={() => {
                  if (!isDisabled) {
                    setEditingTimesheetStatus(tableMeta.rowData[10]);
                    setEditingTimesheet({ id: tableMeta.rowData[0], status: tableMeta.rowData[10] });
                  }
                }}
                data-bs-toggle={isDisabled ? "" : "modal"}
                data-bs-target={isDisabled ? "" : "#timesheeteditconformationpopupModal"}
              >

                <div className='my-timesheet-table-data-option-button-edit-icon'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.84458 12.788C5.69943 14.6429 8.11029 15.1986 9.29543 15.3126C9.64372 15.3526 9.838 15.1383 9.86458 14.9174C9.89143 14.6832 9.744 14.4286 9.40943 14.3817C8.338 14.2343 6.12143 13.7523 4.51429 12.1252C1.88915 9.49344 1.39372 5.51572 3.53658 3.37287C5.27772 1.63858 8.17715 1.85944 10.3134 3.01115L11.0097 2.33487C8.41143 0.774581 4.916 0.647439 2.86686 2.70315C0.429432 5.14744 0.750861 9.6943 3.84458 12.788ZM13.6617 3.29915L14.1971 2.76344C14.4514 2.50915 14.4651 2.13401 14.204 1.89287L14.0297 1.7323C13.8023 1.51801 13.4471 1.52458 13.1994 1.75887L12.6706 2.30144L13.6617 3.29915ZM7.15943 9.78773L13.1726 3.78115L12.1749 2.7903L6.16829 8.7903L5.61258 10.0692C5.55886 10.2097 5.69943 10.3506 5.84686 10.3034L7.15943 9.78773ZM6.28229 10.7857C8.47172 12.9754 11.994 13.8394 13.9629 11.8772C15.57 10.2634 15.3623 7.39715 13.6414 4.93315L12.9586 5.61601C14.3243 7.6383 14.5923 9.90858 13.2931 11.2074C11.7131 12.788 9.10115 12.038 7.30657 10.3437L6.28229 10.7857Z" fill="white" />
                  </svg>
                </div>
                <div className='my-timesheet-table-data-option-button-edit-div'>Edit</div>
              </div>

              <div className={`button btn my-timesheet-table-data-option-button-delete d-flex flex-row align-items-center ${!isDeleteallow ? 'my-timesheet-table-data-option-button-delete-disabled-button' : ''}`}
                disabled={tableMeta.rowData[10] !== 'Submitted'}
                data-bs-toggle={!isDeleteallow ? "" : "modal"}
                data-bs-target={!isDeleteallow ? "" : "#timesheetdeleteconformationpopupModal"}
                onClick={() => setDeletingTimesheet({ id: tableMeta.rowData[0], status: tableMeta.rowData[10] })}
              >
                <div className='my-timesheet-table-data-option-button-delete-icon'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <path d="M1.71112 5.6904L2.59192 14.4168C2.64072 14.7856 4.42152 15.9984 6.99992 16C9.57992 15.9984 11.3607 14.7856 11.4087 14.4168L12.2903 5.6904C10.9431 6.444 8.92952 6.8 6.99992 6.8C5.07192 6.8 3.05752 6.444 1.71112 5.6904ZM9.53432 1.208L8.84712 0.4472C8.58152 0.0688 8.29352 0 7.73272 0H6.26792C5.70792 0 5.41912 0.0688 5.15432 0.4472L4.46712 1.208C2.41112 1.5672 0.919922 2.52 0.919922 3.2232V3.3592C0.919922 4.5968 3.64232 5.6 6.99992 5.6C10.3583 5.6 13.0807 4.5968 13.0807 3.3592V3.2232C13.0807 2.52 11.5903 1.5672 9.53432 1.208ZM8.65592 3.472L7.79992 2.4H6.19992L5.34552 3.472H3.98552C3.98552 3.472 5.47512 1.6952 5.67432 1.4544C5.82632 1.2704 5.98152 1.2 6.18312 1.2H7.81752C8.01992 1.2 8.17512 1.2704 8.32712 1.4544C8.52552 1.6952 10.0159 3.472 10.0159 3.472H8.65592Z" fill="white" />
                  </svg>
                </div>
                <div className='my-timesheet-table-data-option-button-delete-div'>Delete</div>
              </div>

            </div>

          );
        },
      }
    },
  ];

  const options = {
    pagination: false,
    selectableRows: false,
    tableBodyHeight: "370px",
    download: false,
    print: false,
    responsive: "standard",
    customToolbar: () => (
      <>
        <IconButton >
          <GetAppIcon data-bs-toggle="modal" data-bs-target="#exportpopupModal" />
        </IconButton>
        {/* { <IconButton>
          <PrintIcon />
        </IconButton> } */}
      </>
    ),
  };


  const handleDownload = async () => {

    const downloadColumns = columns.filter(column => column.download);

    const dataToDownload = timesheet.map(row => {
      const rowData = {};
      downloadColumns.forEach(column => {
        rowData[column.label] = row[column.name];
      });
      return rowData;
    });

    if (dataToDownload.length === 0) {
      alert("No data to download. The table is empty.");
      return;
    }


    let content;
    let mimeType;
    let fileExtension;

    switch (selectedFormat) {
      case 'pdf':
        content = generatePDF(dataToDownload);
        mimeType = 'application/pdf';
        fileExtension = 'pdf';
        break;
      case 'excel':
        content = generateExcel(dataToDownload);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
        break;
      case 'csv':
        content = generateCSV(dataToDownload);
        mimeType = 'text/csv';
        fileExtension = 'csv';
        break;
      case 'doc':
        const doc = generateDocx(dataToDownload);
        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'Timesheet.docx';
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return; 
      case 'xml':
        content = generateXML(dataToDownload);
        mimeType = 'application/xml';
        fileExtension = 'xml';
        break;
      case 'rtf':
        content = generateRTF(dataToDownload);
        mimeType = 'application/rtf';
        fileExtension = 'rtf';
         break;
      default:
    }

   
    const blob = new Blob([content], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timesheet.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const generateCSV = (data) => {
    if (!data || !data.length) {
      return '';
    }


    const headers = Object.keys(data[0]);


    const formatDate = (date) => {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }
      if (typeof date === 'number' && date > 10000000000) {
        return new Date(date).toISOString().split('T')[0];
      }
      return String(date);
    };

    const formatCSVField = (field) => {
      if (field === undefined || field === null) {
        return '\t'; 
      }
      return '\t' + String(field).replace(/,/g, ' '); 
    };
    // Create CSV content
    const csvRows = [
      headers.map(formatCSVField).join(','), // Header row
      ...data.map(row =>
        headers.map(header => {
          let value = row[header];
          // Check if the header suggests it's a date field
          if (header.toLowerCase().includes('date')) {
            value = formatDate(value);
          }
          return formatCSVField(value);
        }).join(',')
      )
    ];
    const csvContent = csvRows.join('\n');
    // Add UTF-8 BOM to ensure Excel opens the file with correct encoding
    const BOM = '\uFEFF';
    return BOM + csvContent;
  };
  const generateExcel = (data) => {
    if (!data || !data.length) {
      return new Uint8Array();
    }

    
    const workbook = XLSX.utils.book_new();

    
    const stringData = data.map(row =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, value === undefined || value === null ? '' : String(value)])
      )
    );

   
    const worksheet = XLSX.utils.json_to_sheet(stringData);

    
    const columnWidths = Object.keys(data[0]).map(key => ({ wch: key.length + 5 }));
    worksheet['!cols'] = columnWidths;

   
    for (let cell in worksheet) {
      if (cell[0] === '!') continue; 

      if (!worksheet[cell].s) worksheet[cell].s = {}; 

      
      worksheet[cell].s.alignment = { horizontal: 'left', vertical: 'center' };

     
      worksheet[cell].z = '@';
    }

   
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet");

   
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();

   
    const headers = Object.keys(data[0]);

    
    const tableData = data.map(row =>
      headers.map(header => row[header])
    );

    doc.autoTable({
      head: [headers],
      body: tableData,
      theme: 'plain', 
      styles: {
        fontSize: 6,
        cellPadding: 1,
        overflow: 'hidden',
        halign: 'left',
        lineWidth: 0.1, 
        lineColor: [200, 200, 200]
      },
      headStyles: {
        fillColor: [125, 131, 191],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 10 }, 
        1: { cellWidth: 20 },
        2: { cellWidth: 15 },
        3: { cellWidth: 15 },
        4: { cellWidth: 15 },
        5: { cellWidth: 20 },
        6: { cellWidth: 15 },
        7: { cellWidth: 20 },
        8: { cellWidth: 15 },
        9: { cellWidth: 25 },
        10: { cellWidth: 15 },
        11: { cellWidth: 15 }
      },
      margin: { top: 10 },
      didDrawCell: (data) => {
       

        doc.setDrawColor(200, 200, 200)
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'S');
      }
    });

    return doc.output('arraybuffer');
  };

  const generateDocx = (data) => {
    const tableStyle = {
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      margins: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      },
    };

    const cellStyle = {
      margins: {
        top: 40,
        bottom: 40,
        right: 40,
        left: 40,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
      },
    };

    const headerStyle = {
      ...cellStyle,
      shading: {
        fill: "D3D3D3", 
      },
    };

    const textStyle = {
      size: 16, 
    };

    const headerTextStyle = {
      ...textStyle,
      bold: true,
    };

   
    const columnWidths = Object.keys(data[0]).map(key => {
      const maxContentLength = Math.max(
        key.length,
        ...data.map(row => String(row[key]).length)
      );
      return Math.min(Math.max(maxContentLength * 150, 1500), 4000); // Min 1500, Max 4000
    });

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
            },
          },
        },
        children: [
          new Table({
            ...tableStyle,
            rows: [
              new TableRow({
                children: Object.keys(data[0]).map((key, index) =>
                  new TableCell({
                    ...headerStyle,
                    width: {
                      size: columnWidths[index],
                      type: WidthType.DXA,
                    },
                    children: [new Paragraph({
                      children: [new TextRun({
                        text: key,
                        ...headerTextStyle,
                      })],
                      alignment: 'center',
                    })],
                  })
                ),
              }),
              ...data.map(row =>
                new TableRow({
                  children: Object.values(row).map((value, index) =>
                    new TableCell({
                      ...cellStyle,
                      width: {
                        size: columnWidths[index],
                        type: WidthType.DXA,
                      },
                      children: [new Paragraph({
                        children: [new TextRun({
                          text: (value || '').toString(),
                          ...textStyle,
                        })],
                        alignment: 'center',
                      })],
                    })
                  ),
                })
              ),
            ],
          }),
        ],
      }],
    });
    return doc;
  };

  const generateXML = (data) => {
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<timesheets>\n';

    data.forEach((row, index) => {
      xmlContent += '  <timesheet>\n';
      Object.entries(row).forEach(([key, value]) => {
        
        const xmlKey = key.replace(/\s+/g, '_');
        xmlContent += `    <${xmlKey}>${escapeXml(value)}</${xmlKey}>\n`;
      });
      xmlContent += '  </timesheet>\n';
    });

    xmlContent += '</timesheets>';
    return xmlContent;
  };

  function escapeXml(unsafe) {
    if (typeof unsafe !== 'string') {
      console.error('escapeXml expects a string input:', unsafe);
      return unsafe; 
    }
    return unsafe.replace(/[<>&'"]/g, function (c) {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  }

  const generateRTF = (data) => {
    if (!data || data.length === 0) {
      return '{\\rtf1\\ansi\\deff0 No data available.}';
    }
  
    const headers = Object.keys(data[0]);
  

    const columnWidths = headers.map(header => {
      const headerLength = header.length;
      const maxDataLength = Math.max(...data.map(row => String(row[header] || '').length));
      return Math.max(headerLength, maxDataLength, 10) * 120; 
    });
  
   
    const pageWidth = 15840;
    const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    const scaleFactor = totalWidth > pageWidth ? (pageWidth - 1440) / totalWidth : 1; 
    const adjustedWidths = columnWidths.map(width => Math.floor(width * scaleFactor));
  
    
    const tableWidth = adjustedWidths.reduce((sum, width) => sum + width, 0);
  
 
    let rtf = '{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fswiss\\fcharset0 Arial;}}\n';
    rtf += '{\\colortbl ;\\red0\\green0\\blue0;}\n';
    rtf += `\\viewkind4\\uc1\\pard\\sa200\\sl276\\slmult1\\qc\\f0\\fs20\n`;
    rtf += `\\landscape\\paperw15840\\paperh12240\\margl720\\margr720\\margt720\\margb720\n`;
  
  
    rtf += `\\pard\\qc\\tqc\\tx${pageWidth / 2}\n`;
  
 
    rtf += `{\\pard\\par\\trowd\\trqc\\trgaph70\\trpaddl70\\trpaddr70\\trpaddfl3\\trpaddfr3\n`;
  
 
    let cellX = 0;
    adjustedWidths.forEach((width) => {
      cellX += width;
      rtf += `\\clbrdrl\\brdrw10\\brdrs\\clbrdrt\\brdrw10\\brdrs\\clbrdrr\\brdrw10\\brdrs\\clbrdrb\\brdrw10\\brdrs\\cellx${cellX}\n`;
    });
  
  
    rtf += '\\pard\\intbl\\qc\\b ';
    headers.forEach((header) => {
      rtf += `${escapeRTF(header)}\\cell `;
    });
    rtf += '\\row\n';
  
  
    data.forEach((row) => {
      rtf += `\\trowd\\trqc\\trgaph70\\trpaddl70\\trpaddr70\\trpaddfl3\\trpaddfr3\n`;
      cellX = 0;
      adjustedWidths.forEach((width) => {
        cellX += width;
        rtf += `\\clbrdrl\\brdrw10\\brdrs\\clbrdrt\\brdrw10\\brdrs\\clbrdrr\\brdrw10\\brdrs\\clbrdrb\\brdrw10\\brdrs\\cellx${cellX}\n`;
      });
      rtf += '\\pard\\intbl\\qc ';
      headers.forEach((header) => {
        let cellValue = row[header] != null ? row[header] : '';
        rtf += escapeRTF(String(cellValue)) + '\\cell ';
      });
      rtf += '\\row\n';
    });
  
  
    rtf += '}\\par}\n}';
  
    return rtf;
  };
  
  const escapeRTF = (text) => {
    return text
      .replace(/[\\{}]/g, '\\$&')
      .replace(/\n/g, '\\par ')
      .replace(/[^\u0000-\u007F]/g, (char) => '\\u' + char.charCodeAt(0) + '?');
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
                  <Tab component={Link} to="/timesheet/mytimesheet" label="My Timesheets" value="1" sx={{
                    '&.Mui-selected': {
                      color: '#787DBD',
                    },
                    color: '#787DBD',
                    textTransform: 'none',
                    marginRight: '30px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }} />
                    {hasPermission("Approvals") && (
                  <Tab component={Link} to="/timesheet/timesheetapprovals" label="Approvals" value="3" sx={{
                    '&.Mui-selected': {
                      color: '#787DBD',
                    },
                    color: '#787DBD',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }} />
                )}
                </TabList>
              </Box>

              <TabPanel value="1" className="scrollable-tab-panel mx-2" >
                <div>
                  <div className='container' >
                    <div className='timesheet-week-mytimesheet-table-box'>
                      <div className='timesheet-week-mytimesheet-table-datas'>
                        <MUIDataTable className='timesheet-week-mytimesheet-table-datas-mui '
                          // title={"My Timesheet List"}
                          data={timesheet}
                          columns={columns}
                          options={options}
                        />
                        {/* popup for delete conformation start */}
                        <div class="modal deleteconformationpopupModalLabel-mytimesheet-delete fade" id="timesheetdeleteconformationpopupModal" tabindex="-1" aria-labelledby="timesheetdeleteconformationpopupModalLabel" aria-hidden="true">
                          <div class="modal-dialog  modal-dialog-centered">
                            <div class="modal-content timesheet-weekly-delete-conformation-model-content">
                              <div class="modal-body" id='timesheetdeleteconformationpopupModalLabel'>
                                <div className='d-flex justify-content-end'>
                                  <div className="timesheet-weekly-delete-conformation-model-close-icon" data-bs-dismiss="modal" aria-label="Close">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <path d="M4 12L12 4M12 12L4 4" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                  </div>
                                </div >
                                <div className='timesheet-weekly-delete-conformation-model-heading-icon d-flex flex-row align-items-end justify-content-center mt-3'>
                                  <div className='timesheet-weekly-delete-conformation-model-icon-svg me-2'>
                                    <svg width="90" height="110" viewBox="0 0 102 137" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <mask id="path-1-inside-1_4035_16032" fill="white">
                                        <path d="M17 68C17 65.2386 19.2386 63 22 63H79C81.7614 63 84 65.2386 84 68V122C84 130.284 77.2843 137 69 137H32C23.7157 137 17 130.284 17 122V68Z" />
                                      </mask>
                                      <path d="M17 68C17 65.2386 19.2386 63 22 63H79C81.7614 63 84 65.2386 84 68V122C84 130.284 77.2843 137 69 137H32C23.7157 137 17 130.284 17 122V68Z" fill="white" stroke="#FF7F7F" stroke-width="14" mask="url(#path-1-inside-1_4035_16032)" />
                                      <rect x="0.254395" y="52.4956" width="79.6364" height="9.04959" rx="4.5248" transform="rotate(-40.6555 0.254395 52.4956)" fill="#FF7F7F" />
                                      <mask id="path-3-inside-2_4035_16032" fill="white">
                                        <path d="M13.0617 33.1466C10.7823 30.4924 11.0862 26.493 13.7403 24.2137L28.8442 11.2427C31.4984 8.96339 35.4977 9.26723 37.7771 11.9214C40.0564 14.5755 39.7526 18.5749 37.0984 20.8543L21.9946 33.8252C19.3404 36.1046 15.341 35.8007 13.0617 33.1466Z" />
                                      </mask>
                                      <path d="M6.55532 34.7797C3.19652 30.8686 3.64425 24.9752 7.55537 21.6164L27.2111 4.73636C31.1222 1.37756 37.0156 1.82529 40.3744 5.7364L33.2253 15.8304C33.1048 15.6902 32.8935 15.6741 32.7533 15.7946L17.6494 28.7655C17.5092 28.886 17.4931 29.0973 17.6135 29.2375L6.55532 34.7797ZM41.9042 16.7272L17.1888 37.9524L41.9042 16.7272ZM19.7187 35.7798C15.8076 39.1386 9.91413 38.6908 6.55532 34.7797C3.19652 30.8686 3.64425 24.9752 7.55537 21.6164L17.6494 28.7655C17.5092 28.886 17.4931 29.0973 17.6135 29.2375C19.8929 31.8917 21.8544 33.9457 21.9946 33.8252L19.7187 35.7798ZM27.2111 4.73636C31.1222 1.37756 37.0156 1.82529 40.3744 5.7364C43.7332 9.64752 43.2855 15.5409 39.3744 18.8998L37.0984 20.8543C37.2387 20.7338 35.5046 18.4846 33.2253 15.8304C33.1048 15.6902 32.8935 15.6741 32.7533 15.7946L27.2111 4.73636Z" fill="#FF7F7F" mask="url(#path-3-inside-2_4035_16032)" />
                                      <rect x="41" y="81" width="6" height="36" rx="3" fill="#FF7F7F" />
                                      <rect x="56" y="81" width="6" height="36" rx="3" fill="#FF7F7F" />
                                      <g clip-path="url(#clip0_4035_16032)">
                                        <path d="M61.1575 36.2083C62.9383 32.2042 66.0682 28.754 70.3654 26.7348C77.9057 23.1919 86.5872 25.1109 92.0175 30.8538L88.7848 33.9168C86.7117 31.7236 83.9993 30.2405 81.034 29.6788C78.0687 29.1172 75.0018 29.5056 72.2702 30.7888C69.1081 32.2746 66.7703 34.7983 65.4001 37.7385L74.0284 40.8504L59.4342 47.7078L52.5768 33.1135L61.1575 36.2083Z" fill="#FF7F7F" />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_4035_16032">
                                          <rect width="43" height="43" fill="white" transform="matrix(-0.905069 0.425264 0.425264 0.905069 82.918 5)" />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  </div>
                                  <div className='d-flex flex-column'>
                                    <div className='timesheet-weekly-delete-conformation-model-heading-div'>Delete Timesheet</div>
                                    <div className='timesheet-weekly-delete-conformation-model-heading-div-p mt-2'>Are you certain you wish to proceed with the deletion of this?</div>
                                  </div>
                                </div>
                                <div className='timesheet-weekly-delete-conformation-button d-flex flex-row justify-content-center mt-5 mb-4'>
                                  <div className="button btn d-flex flex-row timesheet-weekly-delete-conformation-button-delete-btn mb-2 me-4"
                                    onClick={() => {
                                      if (deletingTimesheet.id && deletingTimesheet.status) {
                                        handleDeleteTimesheet(deletingTimesheet.id, deletingTimesheet.status);
                                      }
                                    }}
                                    data-bs-dismiss="modal"
                                  >
                                    <div>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M7 21C6.45 21 5.97933 20.8043 5.588 20.413C5.19667 20.0217 5.00067 19.5507 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8043 20.021 18.413 20.413C18.0217 20.805 17.5507 21.0007 17 21H7ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="white" />
                                      </svg>
                                    </div>
                                    <div className="timesheet-weekly-delete-conformation-button-delete-div ps-2" >Delete</div>
                                  </div>
                                  <div className="button btn d-flex flex-row timesheet-weekly-delete-conformation-button-cancel-btn mb-2 ms-2" data-bs-dismiss="modal">
                                    <div>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M8.4 17L12 13.4L15.6 17L17 15.6L13.4 12L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4L10.6 12L7 15.6L8.4 17ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825 4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267 15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667 22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175 19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="black" fill-opacity="0.6" />
                                      </svg>
                                    </div>
                                    <div className="timesheet-weekly-delete-conformation-button-cancel-div ps-2" >Cancel</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* popup for delete conformation end */}

                        {/* popup for edit conformation start */}
                        <div class="modal editconformationpopupModalLabel-mytimesheet-edit fade" id="timesheeteditconformationpopupModal" tabindex="-1" aria-labelledby="timesheeteditconformationpopupModalLabel" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content timesheet-weekly-edit-conformation-model-content">
                              <div class="modal-body" id="timesheeteditconformationpopupModalLabel">
                                <div className='d-flex justify-content-end'>
                                  <div className="timesheet-weekly-edit-conformation-model-close-icon" data-bs-dismiss="modal" aria-label="Close">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <path d="M4 12L12 4M12 12L4 4" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                  </div>
                                </div >

                                <div className="timesheet-weekly-edit-conformation-icon-and-heading d-flex justify-content-center mt-3">
                                  <div className='d-flex flex-row align-items-center'>
                                    <div className='me-4'>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                                        <path d="M87.5 54.5835C87.0834 54.5835 86.25 55.0002 85.8334 55.4168L81.6667 59.5835L90.4167 68.3335L94.5834 64.1668C95.4167 63.3335 95.4167 61.6668 94.5834 60.8335L89.1667 55.4168C88.75 55.0002 88.3334 54.5835 87.5 54.5835ZM79.5834 62.0835L54.1667 87.0835V95.8335H62.9167L88.3334 70.4168L79.5834 62.0835ZM52.0834 29.1668V50.8335L68.75 60.8335L64.5834 65.0002L45.8334 54.1668V29.1668H52.0834ZM45.8334 91.2502C24.5834 89.1668 8.33337 71.2502 8.33337 50.0002C8.33337 27.0835 27.0834 8.3335 50 8.3335C72.0834 8.3335 90 25.4168 91.6667 47.0835C90.4167 46.6668 89.1667 46.2502 87.5 46.2502C85.8334 46.2502 84.5834 46.6668 83.3334 47.0835C81.6667 30.0002 67.5 16.6668 50 16.6668C31.6667 16.6668 16.6667 31.6668 16.6667 50.0002C16.6667 67.0835 29.5834 81.2502 46.25 82.9168L45.8334 83.7502V91.2502Z" fill="#FFA500" fill-opacity="0.7" />
                                      </svg>
                                    </div>
                                    <div className='ms-2 me-2'>
                                      <div className='timesheet-weekly-edit-conformation-icon-and-heading-div-edit'>Edit Timesheet</div>
                                      {editingTimesheetStatus && (
                                        <div className='d-flex flex-row align-items-center mt-2'>
                                          <div className='timesheet-weekly-edit-conformation-icon-and-heading-div-current-status'>Current Status :</div>
                                          <div className='timesheet-weekly-edit-conformation-icon-and-heading-div-current-status-value-icon d-flex flex-row align-items-center ms-2'>
                                            <div className='timesheet-weekly-edit-conformation-icon-and-heading-div-current-status-icon'>
                                              {getStatusiconvalueDetails(editingTimesheetStatus).icon}
                                            </div>
                                            <div className='timesheet-weekly-edit-conformation-icon-and-heading-div-current-status-value ms-1' style={{ color: getStatusiconvalueDetails(editingTimesheetStatus).color }}>
                                              {editingTimesheetStatus}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="timesheet-weekly-edit-conformation-phara-div d-flex justify-content-center mt-4 mb-2">Are you certain you wish to proceed with this edit?</div>
                                <div className='timesheet-weekly-edit-conformation-button d-flex flex-row justify-content-center mt-4 mb-4'>
                                  <div className="button btn d-flex flex-row timesheet-weekly-edit-conformation-button-edit-btn mb-2 me-4"
                                    onClick={() => {
                                      if (editingTimesheet) {
                                        handleEditClick(editingTimesheet.id, editingTimesheet.status);
                                      }
                                    }}  >
                                    <div>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M16 5.00011L19 8.00011M20.385 6.58511C20.7788 6.19126 21.0001 5.65709 21.0001 5.10011C21.0001 4.54312 20.7788 4.00895 20.385 3.61511C19.9912 3.22126 19.457 3 18.9 3C18.343 3 17.8088 3.22126 17.415 3.61511L9 12.0001V15.0001H12L20.385 6.58511Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      </svg>
                                    </div>
                                    <div className="timesheet-weekly-edit-conformation-button-edit-div ps-2" >Edit</div>
                                  </div>
                                  <div className="button btn d-flex flex-row timesheet-weekly-edit-conformation-button-cancel-btn mb-2 ms-2" data-bs-dismiss="modal">
                                    <div>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M8.4 17L12 13.4L15.6 17L17 15.6L13.4 12L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4L10.6 12L7 15.6L8.4 17ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825 4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267 15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667 22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175 19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="black" fill-opacity="0.6" />
                                      </svg>
                                    </div>
                                    <div className="timesheet-weekly-edit-conformation-button-cancel-div ps-2" >Cancel</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* popup for edit conformation end */}

                        {/* popup for export start */}
                        <div className="modal exportpopupModalLabel-mytimesheet-download fade" id="exportpopupModal" tabindex="-1" aria-labelledby="exportpopupModalLabel" aria-hidden="true">
                          <div className="modal-dialog modal-dialog-centered export-my-timesheet">
                            <div className="modal-content timesheet-weekly-export-download-model">
                              {/* <div class="modal-header timesheet-weekly-export-download-modal-header">
                                
                              </div> */}
                              <div class="modal-body timesheet-weekly-export-download-modal-body">
                                <div>
                                  <div className='d-flex flex-row justify-content-between'>
                                    <div className='d-flex flex-column'>
                                      <h5 class="modal-title timesheet-weekly-export-download-model-title" id="exportpopupModalLabel">EXPORT</h5>
                                      <p class="timesheet-weekly-export-download-model-title-p">QUICKLY SAVE YOUR TIMESHEETS IN VARIOUS FORMATS</p>
                                    </div>
                                    {/* <button type="button" className="timesheet-weekly-export-download-model-close-icon " data-bs-dismiss="modal" aria-label="Close"><IoClose style={{ fontSize: '20px', paddingBottom: '3px' }} /></button> */}
                                    <div className="timesheet-weekly-export-download-model-close-icon" data-bs-dismiss="modal" aria-label="Close">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M4 12L12 4M12 12L4 4" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="timesheet-weekly-export-download-empty-line "></div>
                                  <div className='d-flex flex-row justify-content-between timesheet-weekemail-passing-export-format-export'>
                                    <div className='email-passing-export-timesheet-week' >
                                      <label className='email-passing-export-timesheet-week-label'>Enter your email to export</label>
                                      <div className='d-flex flex-row email-passing-export-timesheet-week-input-and-icon'>
                                        {/* <HiMail className='email-passing-export-timesheet-week-icon' /> */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                          <path d="M12 21C10.758 21 9.589 20.764 8.493 20.292C7.39767 19.8193 6.44467 19.178 5.634 18.368C4.82333 17.5587 4.18167 16.6067 3.709 15.512C3.23633 14.4173 3 13.2477 3 12.003C3 10.759 3.236 9.589 3.708 8.493C4.18067 7.39767 4.822 6.44467 5.632 5.634C6.44133 4.82333 7.39333 4.18167 8.488 3.709C9.58267 3.23633 10.7523 3 11.997 3C13.241 3 14.411 3.23633 15.507 3.709C16.603 4.18167 17.556 4.823 18.366 5.633C19.1767 6.443 19.8183 7.39533 20.291 8.49C20.7637 9.58533 21 10.7553 21 12V12.988C21 13.8307 20.7107 14.5433 20.132 15.126C19.5533 15.7087 18.8427 16 18 16C17.404 16 16.8607 15.8367 16.37 15.51C15.8787 15.1833 15.5153 14.748 15.28 14.204C14.9 14.7513 14.425 15.1877 13.855 15.513C13.285 15.8377 12.6667 16 12 16C10.886 16 9.94067 15.612 9.164 14.836C8.38733 14.06 7.99933 13.1147 8 12C8 10.886 8.388 9.94067 9.164 9.164C9.94 8.38733 10.8853 7.99933 12 8C13.114 8 14.0593 8.388 14.836 9.164C15.6127 9.94 16.0007 10.8853 16 12V12.988C16 13.5373 16.196 14.01 16.588 14.406C16.9807 14.802 17.4513 15 18 15C18.5487 15 19.0193 14.802 19.412 14.406C19.804 14.01 20 13.5373 20 12.988V12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20H17V21H12ZM12 15C12.8333 15 13.5417 14.7083 14.125 14.125C14.7083 13.5417 15 12.8333 15 12C15 11.1667 14.7083 10.4583 14.125 9.875C13.5417 9.29167 12.8333 9 12 9C11.1667 9 10.4583 9.29167 9.875 9.875C9.29167 10.4583 9 11.1667 9 12C9 12.8333 9.29167 13.5417 9.875 14.125C10.4583 14.7083 11.1667 15 12 15Z" fill="black" fill-opacity="0.5" />
                                        </svg>
                                        <input className='email-passing-export-timesheet-week-input' placeholder='Email ID'></input>
                                      </div>
                                    </div>
                                    <div className='d-flex flex-column format-export-timesheet-week'>
                                      <label className='format-export-timesheet-week-label'>Pick any one format</label>
                                      <select className='format-export-timesheet-week-select' onChange={(e) => setSelectedFormat(e.target.value)}>
                                        <option value="pdf">PDF</option>
                                        <option value="excel">Excel</option>
                                        <option value="doc">Doc</option>
                                        <option value="xml">XML</option>
                                        <option value="csv">CSV</option>
                                        <option value="rtf">RTF</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className='d-flex justify-content-center timesheet-weekly-export-download-modal-footer'>
                                  <div className='d-flex flex-row'>
                                    <div className="button btn d-flex flex-row timesheet-weekly-export-download-modal-footer-btn-download" onClick={handleDownload}>
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
                                      <div className="timesheet-weekly-export-download-modal-footer-btn-download-div">Download</div>
                                    </div>
                                    <div className="button btn d-flex flex-row timesheet-weekly-export-download-modal-footer-btn-export">
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
                                      <div className="timesheet-weekly-export-download-modal-footer-btn-export-div">Export</div>
                                    </div>
                                    <div className="button btn d-flex flex-row timesheet-weekly-export-download-modal-footer-btn-close">
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
                                      <div className="timesheet-weekly-export-download-modal-footer-btn-close-div">Close</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* <div class="modal-footer d-flex justify-content-center timesheet-weekly-export-download-modal-footer">
                                
                              </div> */}
                            </div>
                          </div>
                        </div>

                        {/* popup for export end */}
                      </div>

                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </div>
  )
}
