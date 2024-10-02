import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Timesheetsavedata.css';
import { FaFilter, FaPencilAlt, FaSave } from 'react-icons/fa';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { startOfWeek, getWeek, addDays, format } from 'date-fns';
import ReactSelect from 'react-select';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";

const columns = [
  { field: 'employeeName', headerName: 'Employee Name' , tooltipname: 'Employee Name'},
  { field: 'employeeid', headerName: 'Employee Id' , tooltipname: 'Employee ID' },
  { field: 'startDate', headerName: 'Start Date' , tooltipname: 'Start Date' },
  { field: 'endDate', headerName: 'End Date' , tooltipname: 'End Date' },
  { field: 'totalDayHours', headerName: 'W' , tooltipname: 'Total Work Hours'},
  { field: 'holidaysHours', headerName: 'H' , tooltipname: 'Total Holiday Hours'},
  { field: 'leaveHours', headerName: 'L' , tooltipname: 'Total Leave Hours'},
  { field: 'totalBillableHours', headerName: 'Total Hours' , tooltipname: 'Total Hours' },
];

export default function Timesheetweekdatadraft() {
  const navigate = useNavigate();
  const [timesheets, setTimesheets] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(columns.map((col) => col.field));
  const [manageColumnsVisible, setManageColumnsVisible] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [rowCheckboxes, setRowCheckboxes] = useState({});
  const [error, setError] = useState(null);
  const [timesheetToDelete, setTimesheetToDelete] = useState(null);

  useEffect(() => {
    fetchTimesheets('In-use');
  }, []);
  useEffect(() => {
    const checkboxes = {};
    timesheets.forEach((row) => {
      checkboxes[row.id] = selectAllChecked;
    });
    setRowCheckboxes(checkboxes);
  }, [selectAllChecked, timesheets]);

  const fetchTimesheets = async (status) => {
    try {

            const userInfoString = localStorage.getItem("userInfo");
      const userInfo = JSON.parse(userInfoString);
      const employeeId = userInfo["employeeId"];


      const response = await axios.get(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/weekly/list/${employeeId}`);
      const filteredTimesheets = response.data
        .filter(timesheet => timesheet.status === status)
        .map(timesheet => {
          const days = timesheet.days;
          const startDate = days.length > 0 ? days[0].startDate : '';
          const endDate = days.length > 0 ? days[days.length - 1].startDate : '';
  
          // Get all unique project names
          const projectNames = [...new Set(days.flatMap(day => 
            day.weeklyEntries.map(entry => entry.projectName)))];
  
          return {
            id: timesheet.id,
            employeeName: timesheet.employeeName,
            employeeid: timesheet.employeesId,
            status: timesheet.status,
            currentDateTime: timesheet.currentDateTime,
            totalDayHours: timesheet.reportedHours,
            totalHours: timesheet.totalHours,
            totalRegularHours: timesheet.totalRegularHours,
            totalOvertimeHours: timesheet.totalOvertimeHours,
            startDate: startDate,
            endDate: endDate,
            projects: projectNames.join(', '),
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
      setTimesheets(filteredTimesheets);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      setError('Failed to fetch timesheets');
    }
  };
  const handleColumnToggle = (field) => {
    setVisibleColumns((prevColumns) => {
      if (prevColumns.includes(field)) {
        return prevColumns.filter((col) => col !== field);
      } else {
        return [...prevColumns, field];
      }
    });
  };

  const handleSelectAllChange = () => {
    setSelectAllChecked(!selectAllChecked);
  };

  const handleRowCheckboxChange = (id) => {
    setRowCheckboxes((prevCheckboxes) => {
      return {
        ...prevCheckboxes,
        [id]: !prevCheckboxes[id],
      };
    });
  };

  const handleDeleteTimesheet = async (id) => {
    try {
      // Make a DELETE request to your backend API to delete the timesheet entry
      await axios.delete(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/weekly/delete/${id}`);

      // After successful deletion, update the state to reflect the changes
      setTimesheets(timesheets.filter(timesheet => timesheet.id !== id));
      toast.success('Timesheet deleted successfully');
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      toast.error('Failed to delete timesheet');
    }
  };

  const handleSubmitTimesheets = async () => {
    try {
      const selectedTimesheets = Object.entries(rowCheckboxes)
        .filter(([, checked]) => checked)
        .map(([id]) => timesheets.find((timesheet) => timesheet.id === parseInt(id)));
  
      if (selectedTimesheets.length === 0) {
        setError('Please select at least one timesheet to submit.');
        return;
      }
      
      for (const timesheet of selectedTimesheets) {
        const updatedTimesheet = {
          id: timesheet.id,
          employeeName: timesheet.employeeName,
          employeeId: timesheet.employeeId,
          employeesId: timesheet.employeesId,
          status: 'Submitted',
          currentDateTime: new Date().toISOString(),
          reportedHours: timesheet.reportedHours,
          totalHours: timesheet.totalHours,
          totalRegularHours: timesheet.totalRegularHours,
          totalOvertimeHours: timesheet.totalOvertimeHours,
          days: timesheet.days.map(day => ({
            startDate: day.startDate,
            weeklyEntries: day.weeklyEntries.map(entry => ({
              projectId: entry.projectId,
              projectName: entry.projectName,
              taskId: entry.taskId,
              taskName: entry.taskName,
              regularHours: entry.regularHours,
              regularComments: entry.regularComments,
              overtimeHours: entry.overtimeHours,
              overtimeComments: entry.overtimeComments
            }))
          }))
        };
        
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/timesheet/weekly/update/${timesheet.id}`,
          updatedTimesheet
        );
        
        if (response.status !== 200) {
          throw new Error(`Error submitting timesheet ${timesheet.id}`);
        }
      }
      
      toast.success('Timesheets submitted successfully');
      fetchTimesheets('In-use'); // Refresh the list
      setTimeout(() => {
        navigate('/timesheet/mytimesheet');
      }, 2000);
    } catch (error) {
      console.error('Error submitting timesheets:', error);
      toast.error('Failed to submit timesheets');
    }
  };
  
  return (
    <div className='container-fluid timesheet-save-draft-data'>
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
      <Tooltip id="my-tooltip-draft-heading" />
      {error && <div className="error-message">{error}</div>}
      <div className='p-3 pt-4 mt-3'>
        {/* <div className="timesheet-week-table-column-filter-button">
          <div
            className="button btn d-flex align-items-center timesheet-week-table-column-filter-button-and-icon"
            data-bs-toggle="modal"
            data-bs-target="#draftfilterpopupModal"
          >
            <div className="timesheet-week-table-column-filter-button-div ps-1 pe-1">Filter</div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.3722 6.482C14.0042 6.126 14.3208 5.948 14.4935 5.66067C14.6668 5.374 14.6668 5.028 14.6668 4.336V3.876C14.6668 2.992 14.6668 2.54933 14.3735 2.27467C14.0815 2 13.6102 2 12.6668 2H3.3335C2.39083 2 1.9195 2 1.62683 2.27467C1.3335 2.54933 1.3335 2.992 1.3335 3.87667V4.33667C1.3335 5.028 1.3335 5.374 1.50683 5.66067C1.68016 5.94733 1.9955 6.126 2.62816 6.482L4.57016 7.57533C4.99416 7.814 5.20683 7.93333 5.35883 8.06533C5.67483 8.33933 5.8695 8.662 5.9575 9.05867C6.00016 9.248 6.00016 9.47067 6.00016 9.91533V11.6953C6.00016 12.3013 6.00016 12.6047 6.16816 12.8407C6.33616 13.0773 6.63483 13.194 7.23083 13.4273C8.4835 13.9167 9.1095 14.1613 9.55483 13.8827C10.0002 13.6047 10.0002 12.968 10.0002 11.6947V9.91467C10.0002 9.47067 10.0002 9.248 10.0428 9.058C10.1266 8.66944 10.3375 8.31989 10.6422 8.06467"
                  stroke="black"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div> */}
      </div>
      <div style={{}}>
        <div
          className="modal filter-data-column-popup"
          id="draftfilterpopupModal"
          tabIndex="-1"
          aria-labelledby="draftfilterpopupModalLabel" aria-hidden="true">
          <div className="modal-dialog filter-data-column-popup-model-dialog">
            <div className="modal-content ">
              <div className="modal-body" id="draftfilterpopupModalLabel">
                <h5 className="modal-title filter-data-column-popup-body-title mb-3">Which Field Do you want?</h5>
                {columns.map((col) => (
                  <div key={col.field} className="d-flex flex-row align-items-center">
                    <div>
                      <input
                        className="filter-data-column-popup-body-input"
                        type="checkbox"
                        checked={visibleColumns.includes(col.field)}
                        onChange={() => handleColumnToggle(col.field)}
                      />
                    </div>
                    <div>
                      <label className="filter-data-column-popup-body-label">{col.headerName}</label>
                    </div>
                  </div>
                ))}
                <div>
                  <div className="button btn filter-data-column-popup-body-label-reset-all d-flex align-items-center mt-2">
                    <div className="filter-data-column-popup-body-label-reset-all-div">Reset All</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="timesheet-save-draft-data-table-weekly table-responsive ">
          <table className="timesheet-save-draft-data-table table table-borderless">
            <thead>
              <tr className="timesheet-save-draft-data-table-head-tr">
                <th scope="col" className="timesheet-save-draft-data-table-head-th-checkbox">
                  <input
                    type="checkbox"
                    checked={selectAllChecked}
                    onChange={handleSelectAllChange}
                    className="timesheet-save-draft-data-table-head-tr-checkbox"
                  />
                </th>
                {columns.map((col) =>
                  visibleColumns.includes(col.field) ? (
                    <th key={col.field} scope="col" className="timesheet-save-draft-data-table-head-th-column" data-tooltip-id="my-tooltip-draft-heading" data-tooltip-content={col.tooltipname}> 
                      <div className="timesheet-save-draft-data-table-head-tr-column">{col.headerName}</div>
                    </th>
                  ) : null
                )}
                <th scope="col" className="timesheet-save-draft-data-table-head-option">
                  <div className="timesheet-save-draft-data-table-head-option-div">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody className="timesheet-save-draft-data-table-body">
              {timesheets.map((row) => (
                <tr key={row.id} className="timesheet-save-draft-data-table-body-tr">
                  <td className="timesheet-save-draft-data-table-body-td-checkbox-td">
                    <input
                      type="checkbox"
                      className="timesheet-save-draft-data-table-body-td-checkbox"
                      checked={rowCheckboxes[row.id]}
                      onChange={() => handleRowCheckboxChange(row.id)}
                    />
                  </td>
                  {columns.map((col) =>
                    visibleColumns.includes(col.field) ? (
                      <td key={col.field} className="timesheet-save-draft-data-table-body-td-column-td">
                        <div className="timesheet-save-draft-data-table-body-td-column">{row[col.field]}</div>
                      </td>
                    ) : null
                  )}
                  <td className="d-flex flex-row timesheet-save-draft-data-table-body-td-option-td">
                    <Link
                      //  to="/timesheet/viewtimesheet"
                       to={`/timesheet/view-week-timesheet/${row.id}`}
                      className="button btn timesheet-week-table-save-data-view-button d-flex flex-row"
                      state={{ timesheet: row }}
                    >
                      <div className="pe-1 d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                          <path
                            d="M6.00016 2.97332C6.64696 2.76828 7.32165 2.66482 8.00016 2.66665C10.7882 2.66665 12.6855 4.33332 13.8168 5.80265C14.3835 6.53998 14.6668 6.90732 14.6668 7.99998C14.6668 9.09332 14.3835 9.46065 13.8168 10.1973C12.6855 11.6666 10.7882 13.3333 8.00016 13.3333C5.21216 13.3333 3.31483 11.6666 2.1835 10.1973C1.61683 9.46132 1.3335 9.09265 1.3335 7.99998C1.3335 6.90665 1.61683 6.53932 2.1835 5.80265C2.52907 5.35112 2.9139 4.93104 3.3335 4.54732"
                            stroke="white"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10 7.99997C10 8.5304 9.78929 9.03911 9.41421 9.41418C9.03914 9.78926 8.53043 9.99997 8 9.99997C7.46957 9.99997 6.96086 9.78926 6.58579 9.41418C6.21071 9.03911 6 8.5304 6 7.99997C6 7.46954 6.21071 6.96083 6.58579 6.58576C6.96086 6.21068 7.46957 5.99997 8 5.99997C8.53043 5.99997 9.03914 6.21068 9.41421 6.58576C9.78929 6.96083 10 7.46954 10 7.99997Z"
                            stroke="white"
                          />
                        </svg>
                      </div>
                      <div className="d-flex align-items-center">View</div>
                    </Link>
                    <Link
  to={`/timesheet/edit-week-timesheet/${row.id}`}
  className="button btn timesheet-week-table-save-data-edit-button d-flex flex-row"
  state={{ 
    timesheet: {
      ...row,
      employeeId: row.employeeid, // Ensure employeeId is passed correctly
      days: row.days.map(day => ({
        ...day,
        weeklyEntries: day.entries.map(entry => ({
          ...entry,
          projectId: entry.projectId || "", // Ensure projectId is included
          taskId: entry.taskId || "", // Ensure taskId is included
        }))
      }))
    } 
  }}
>
  <div className="pe-1 d-flex align-items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2.84458 11.788C4.69943 13.6429 7.11029 14.1986 8.29543 14.3126C8.64372 14.3526 8.838 14.1383 8.86458 13.9174C8.89143 13.6832 8.744 13.4286 8.40943 13.3817C7.338 13.2343 5.12143 12.7523 3.51429 11.1252C0.889147 8.49344 0.393718 4.51572 2.53658 2.37287C4.27772 0.638582 7.17715 0.859439 9.31343 2.01115L10.0097 1.33487C7.41143 -0.225419 3.916 -0.352561 1.86686 1.70315C-0.570568 4.14744 -0.249139 8.6943 2.84458 11.788ZM12.6617 2.29915L13.1971 1.76344C13.4514 1.50915 13.4651 1.13401 13.204 0.892867L13.0297 0.732296C12.8023 0.51801 12.4471 0.524582 12.1994 0.758867L11.6706 1.30144L12.6617 2.29915ZM6.15943 8.78773L12.1726 2.78115L11.1749 1.7903L5.16829 7.7903L4.61258 9.06915C4.55886 9.20973 4.69943 9.35058 4.84686 9.30344L6.15943 8.78773ZM5.28229 9.78572C7.47172 11.9754 10.994 12.8394 12.9629 10.8772C14.57 9.26344 14.3623 6.39715 12.6414 3.93315L11.9586 4.61601C13.3243 6.6383 13.5923 8.90858 12.2931 10.2074C10.7131 11.788 8.10115 11.038 6.30657 9.34372L5.28229 9.78572Z" fill="white" />
    </svg>
  </div>
  <div className="d-flex align-items-center">Edit</div>
</Link>
                    {/* onClick={() => handleDeleteTimesheet(row.id)} */}
                    <button 
                      className="button btn timesheet-week-table-save-data-delete-button d-flex flex-row" data-bs-toggle="modal" data-bs-target="#drafttimesheetdeleteconformationpopupModal"
                      onClick={() => setTimesheetToDelete(row.id)}
                    >
                      <div className="pe-1 d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15" fill="none">
                          <path
                            d="M1.71112 5.6904L2.59192 14.4168C2.64072 14.7856 4.42152 15.9984 6.99992 16C9.57992 15.9984 11.3607 14.7856 11.4087 14.4168L12.2903 5.6904C10.9431 6.444 8.92952 6.8 6.99992 6.8C5.07192 6.8 3.05752 6.444 1.71112 5.6904ZM9.53432 1.208L8.84712 0.4472C8.58152 0.0688 8.29352 0 7.73272 0H6.26792C5.70792 0 5.41912 0.0688 5.15432 0.4472L4.46712 1.208C2.41112 1.5672 0.919922 2.52 0.919922 3.2232V3.3592C0.919922 4.5968 3.64232 5.6 6.99992 5.6C10.3583 5.6 13.0807 4.5968 13.0807 3.3592V3.2232C13.0807 2.52 11.5903 1.5672 9.53432 1.208ZM8.65592 3.472L7.79992 2.4H6.19992L5.34552 3.472H3.98552C3.98552 3.472 5.47512 1.6952 5.67432 1.4544C5.82632 1.2704 5.98152 1.2 6.18312 1.2H7.81752C8.01992 1.2 8.17512 1.2704 8.32712 1.4544C8.52552 1.6952 10.0159 3.472 10.0159 3.472H8.65592Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <div className="d-flex align-items-center">Delete</div>
                    </button>
                    {/* popup for delete conformation start */}
                    <div class="modal deleteconformationpopupModalLabel-draft-timesheet-delete fade" id="drafttimesheetdeleteconformationpopupModal" tabindex="-1" aria-labelledby="drafttimesheetdeleteconformationpopupModalLabel" aria-hidden="true">
                          <div class="modal-dialog  modal-dialog-centered">
                            <div class="modal-content draft-timesheet-weekly-delete-conformation-model-content">
                              <div class="modal-body" id='drafttimesheetdeleteconformationpopupModalLabel'>
                                <div className='d-flex justify-content-end'>
                                  <div className="draft-timesheet-weekly-delete-conformation-model-close-icon" data-bs-dismiss="modal" aria-label="Close">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <path d="M4 12L12 4M12 12L4 4" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                  </div>
                                </div >
                                <div className='draft-timesheet-weekly-delete-conformation-model-heading-icon d-flex flex-row align-items-end mt-3'>
                                  <div className='draft-timesheet-weekly-delete-conformation-model-icon-svg me-2'>
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
                                  <div className='d-flex flex-column draft-timesheet-weekly-delete-conformation-model-heading-div-head '>
                                    <div className='draft-timesheet-weekly-delete-conformation-model-heading-div'>Delete Timesheet</div>
                                    <div className='draft-timesheet-weekly-delete-conformation-model-heading-div-p mt-3'>Are you certain you wish to proceed with the deletion of this?</div>
                                  </div>
                                </div>
                                <div className='draft-timesheet-weekly-delete-conformation-button d-flex flex-row justify-content-center mt-5 mb-4'>
                                  <div className="button btn d-flex flex-row draft-timesheet-weekly-delete-conformation-button-delete-btn mb-2 me-4"
                                    onClick={() => {
                                      handleDeleteTimesheet(timesheetToDelete);
                                      setTimesheetToDelete(null);  // Reset after deletion
                                    }}
                                    data-bs-dismiss="modal"
                                  >
                                    <div>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M7 21C6.45 21 5.97933 20.8043 5.588 20.413C5.19667 20.0217 5.00067 19.5507 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8043 20.021 18.413 20.413C18.0217 20.805 17.5507 21.0007 17 21H7ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="white" />
                                      </svg>
                                    </div>
                                    <div className="draft-timesheet-weekly-delete-conformation-button-delete-div ps-2" >Delete</div>
                                  </div>
                                  <div className="button btn d-flex flex-row draft-timesheet-weekly-delete-conformation-button-cancel-btn mb-2 ms-2" data-bs-dismiss="modal">
                                    <div>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M8.4 17L12 13.4L15.6 17L17 15.6L13.4 12L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4L10.6 12L7 15.6L8.4 17ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825 4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267 15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667 22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175 19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="black" fill-opacity="0.6" />
                                      </svg>
                                    </div>
                                    <div className="draft-timesheet-weekly-delete-conformation-button-cancel-div ps-2" >Cancel</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* popup for delete conformation end */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='timesheet-weekly-save-draft-data-submit-and-cancel-button d-flex flex-row justify-content-end'>
          <div className="button btn timesheet-weekly-save-draft-data-submit-button d-flex flex-row"onClick={handleSubmitTimesheets}>
            <div className='timesheet-weekly-save-draft-data-submit-button-icon'>
              <svg width="25" height="25" xmlns="http://www.w3.org/2000/svg"
                fill-rule="evenodd" fill='white' clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm7 7.457l-9.005 9.565-4.995-5.865.761-.649 4.271 5.016 8.24-8.752.728.685z" /></svg>
            </div>
            <div className='timesheet-weekly-save-draft-data-submit-button-div'>Sign</div>
          </div>
        </div>
      </div>
    </div>
  );
}
