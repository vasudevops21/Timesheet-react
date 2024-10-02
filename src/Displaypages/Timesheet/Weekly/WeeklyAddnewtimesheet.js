// import Sidebar from "../../../Components/Sidebar";
// import Topbar from "../../../Components/Topbar";
// import React, { useState, useEffect } from "react";
// import "./WeeklyAddnewtimesheet.css";
// import { Link, useNavigate } from "react-router-dom";
// import { startOfWeek, addDays, format, addWeeks, subWeeks } from "date-fns";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { IoMdAddCircleOutline } from "react-icons/io";
// import axios from "axios";
// import ReactSelect from "react-select";
// import { FaRegCommentDots } from "react-icons/fa";
// import { useParams, useLocation } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Tooltip } from "react-tooltip";
// import { useTimeFormat } from "../../settings/TimeFormatContext";

// const getWeekDates = (firstDayOfWeek) => {
//   const weekDates = [];
//   let currentDate = startOfWeek(firstDayOfWeek, { weekStartsOn: 1 }); // 1 represents Monday

//   for (let i = 0; i < 7; i++) {
//     weekDates.push({
//       date: format(currentDate, "yyyy-MM-dd"),
//       day: format(currentDate, "EEEE"),
//     });
//     currentDate = addDays(currentDate, 1);
//   }

//   return weekDates;
// };

// const WeeklyAddnewtimesheet = ({ locale, setLocale }) => {
//   const [userProfile, setUserProfile] = useState({});
//   const [empname, setempname] = useState("");
//   const navigate = useNavigate();

//   const firstDayOfCurrentWeek = startOfWeek(new Date());
//   const currentDate = new Date();

//   const [currentDateTime, setCurrentDateTime] = useState(new Date());
//   const { timeFormat  } = useTimeFormat();

//   // useEffect(() => {

//   //   const fetchtimeformat = async () => {
//   //     try {
//   //       const result = await axios.get(
//   //         `${process.env.REACT_APP_API_BASE_URL}/api/v1/settings/getGeneralSettingInfo`
//   //       );
//   //       settimeFormat(result.data.timeFormat);
//   //     } catch (error) {
//   //       console.error("Error fetching company name:", error);
//   //     }
//   //   };
//   //   fetchtimeformat();
//   // }, [settimeFormat]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentDateTime(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const formatDate = (date) => {
//     const options = {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: timeFormat === '12-hours' ? 'numeric' : '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: timeFormat === '12-hours'
//     };

//     let formattedDate = date.toLocaleString('en-US', options);
//     formattedDate = formattedDate.replace(',', '');
//     return formattedDate;
//   };

//   // const options = {
//   //   day: "2-digit",
//   //   month: "2-digit",
//   //   year: "numeric",
//   //   hour: "2-digit",
//   //   minute: "2-digit",
//   //   hour12: true,
//   // };
//   // let formattedDate = currentDate.toLocaleString("en-US", options);
//   // formattedDate = formattedDate.replace(",", " ");

//   const [selectedWeek, setSelectedWeek] = useState(
//     getWeekDates(firstDayOfCurrentWeek)
//   );
//   const [Project, setProject] = useState([]);
//   const [Projects, setProjects] = useState([]);
//   const [showcommentBoxicon, setShowcommentBoxicon] = useState(false);
//   const [clickedInputIndex, setClickedInputIndex] = useState(null);
//   const [clickedRowIndex, setClickedRowIndex] = useState(null);
//   const [contentRows, setContentRows] = useState([

//     {
//       dayHours: [0, 0, 0, 0, 0, 0, 0],
//       commenttext: [[], [], [], [], [], [], []],
//       selectedWeek: getWeekDates(firstDayOfCurrentWeek),
//       selectProject: "Select Project",
//       selectedPayType: "regularhour",
//       projectId: "project id",
//     },
//   ]);
//   const [selectedTasks, setSelectedTasks] = useState({});

//   const { id } = useParams();
//   const location = useLocation();
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [timesheetData, setTimesheetData] = useState(null);
//   const [projectValue, setProjectValue] = useState(null);
//   const [selectedPayType, setSelectedPayType] = useState("regularhour");

//   const saveTimesheet = async (buttonClicked, event) => {
//     const calculateTotalHoursForDay = (dayIndex) => {
//       return contentRows.reduce(
//         (total, row) => total + row.dayHours[dayIndex],
//         0
//       );
//     };

//     const dayComments = contentRows.map((row) =>
//       row.commenttext.map((commentArray) =>
//         Array.isArray(commentArray) ? commentArray.join(", ") : ""
//       )
//     );

//     const timesheet = {
//       employeeId: userProfile.employeesid,
//       employeeName: userProfile.firstname,
//       status: buttonClicked,
//       submittedDate: currentDate,
//       startDate: selectedWeek ? selectedWeek[0].date : null,
//       endDate: selectedWeek ? selectedWeek[6].date : null,
//       projectName: projectValue ? projectValue.label : "",
//       projectId: projectValue ? projectValue.key : "",
//       payType: contentRows[0].selectedPayType,
//       totalBillableHours: calculateOverallTotalHours(),
//       sunday: calculateTotalHoursForDay(0),
//       monday: calculateTotalHoursForDay(1),
//       tuesday: calculateTotalHoursForDay(2),
//       wednesday: calculateTotalHoursForDay(3),
//       thursday: calculateTotalHoursForDay(4),
//       friday: calculateTotalHoursForDay(5),
//       saturday: calculateTotalHoursForDay(6),
//       totalDayHours: calculateOverallTotalHours(),
//       totalRegularHours: calculateTotalRegularHours(),
//       totalOvertimeHours: calculateTotalOvertimeHours(),
//       comments: dayComments.flat(),
//     };

//     try {
//       console.log(isEditMode);
//       console.log(timesheetData);
//       if (isEditMode) {
//         if (timesheetData) {
//           timesheet.timesheetId = timesheetData.timesheetId;
//           const response = await axios.post(
//             process.env.REACT_APP_API_BASE_URL +
//               `/api/v1/timesheet/weekly/update/${timesheet.timesheetId}`,
//             timesheet
//           );
//           if (buttonClicked === "submitted") {
//             toast("Submitted Timesheet was successfully updated.");
//             setTimeout(() => {
//               navigate("/timesheet/mytimesheet");
//             }, 2000);
//           } else if (buttonClicked === "draft") {
//             toast("Saved Timesheet was successfully updated");
//             setTimeout(() => {
//               navigate("/timesheet");
//             }, 2000);
//           } else {
//             console.log("error");
//             throw new Error(`Error updating timesheet: ${response.data}`);
//           }
//         } else {
//           throw new Error("Timesheet data is not available for editing");
//         }
//       } else {
//         await axios.post(
//           process.env.REACT_APP_API_BASE_URL + "/api/v1/timesheet/weekly/save",
//           timesheet
//         );
//         setSelectedPayType();
//         setProject("");
//         setContentRows([
//           {
//             dayHours: [0, 0, 0, 0, 0, 0, 0],
//             commenttext: ["", "", "", "", "", "", ""],
//             selectProject: "Select Project",
//           },
//         ]);
//         if (buttonClicked === "submitted") {
//           toast("Timesheet submitted successfully");
//           setTimeout(() => {
//             navigate("/timesheet/mytimesheet");
//           }, 2000);
//         } else if (buttonClicked === "draft") {
//           toast("Timesheet saved successfully");
//           setTimeout(() => {
//             navigate("/timesheet");
//           }, 2000);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       if (buttonClicked === "submitted") {
//         toast("Timesheet submission failed: " + err.message);
//       } else if (buttonClicked === "draft") {
//         toast("Timesheet save failed: " + err.message);
//       }
//     }
//   };

//   const handleInputClick = (rowIndex, columnIndex) => {
//     setClickedRowIndex(rowIndex);
//     setClickedInputIndex(columnIndex);
//   };
//   useEffect(() => {
//     const retrieveUserProfile = localStorage.getItem("userInfo");
//     if (retrieveUserProfile) {
//       const userProfile = JSON.parse(retrieveUserProfile);
//       setUserProfile(userProfile);
//       Loadproject();
//     }
//   }, []);

//   useEffect(() => {
//     const retrieveUserProfile = localStorage.getItem("userInfo");
//     if (retrieveUserProfile) {
//       const userProfile = JSON.parse(retrieveUserProfile);
//       setUserProfile(userProfile);

//       async function fetchData() {
//         try {
//           const response = await axios.get(
//             process.env.REACT_APP_API_BASE_URL +
//               `/api/v1/project/getProjectsWithTasks/${userProfile.employeeId}`
//           );
//           setProject(Array.isArray(response.data) ? response.data : []); // Ensure Project is an array
//         } catch (error) {
//           console.error("Error fetching projects:", error);
//           setProject([]); // Set Project to an empty array if an error occurs
//         }
//       }
//       fetchData();
//     }
//   }, []);

//   useEffect(() => {
//     (async () => {
//       await Loadproject();
//       if (location.state && location.state.timesheet) {
//         const timesheetData = location.state.timesheet;
//         setTimesheetData(timesheetData);
//         setIsEditMode(true);

//         // Check if Project is an array before using find
//         if (Array.isArray(Project)) {
//           const selectedProject = Project.find(
//             (project) => project.projectName === timesheetData.projectName
//           );
//           if (selectedProject) {
//             setProjectValue({
//               key: timesheetData.projectId,
//               value: selectedProject.projectName,
//               label: selectedProject.projectName,
//             });
//           }
//         } else {
//           console.log("Project is not an array");
//         }

//         setSelectedWeek(getWeekDates(new Date(timesheetData.startDate)));
//         setContentRows([
//           {
//             dayHours: [
//               timesheetData.sunday,
//               timesheetData.monday,
//               timesheetData.tuesday,
//               timesheetData.wednesday,
//               timesheetData.thursday,
//               timesheetData.friday,
//               timesheetData.saturday,
//             ],
//             commenttext: timesheetData.comments
//               ? timesheetData.comments.map((comment) => [comment])
//               : [[], [], [], [], [], [], []],
//             selectProject: timesheetData.projectName,
//             projectId: timesheetData.projectId,
//             selectedPayType: timesheetData.payType,
//             selectTask: null,
//           },
//         ]);
//       }
//     })();
//   }, [id, location.state]);

//   async function Loadproject() {
//     try {
//       const retrieveUserProfile = localStorage.getItem("userInfo");
//       if (retrieveUserProfile) {
//         const userProfile = JSON.parse(retrieveUserProfile);
//         const response = await axios.get(
//           process.env.REACT_APP_API_BASE_URL +
//             `/api/v1/project/getProjectsWithTasks/${userProfile.employeeId}`
//         );

//         setProject(response.data);
//       } else {
//         setProject([]);
//       }
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setProject([]);
//     }
//   }

//   const handleWeekChange = (date) => {
//     const firstDayOfWeek = startOfWeek(date, { weekStartsOn: 1 });
//     updateSelectedWeek(firstDayOfWeek);
//   };

//   const updateSelectedWeek = (firstDayOfWeek) => {
//     const weekDates = getWeekDates(firstDayOfWeek);
//     setSelectedWeek(weekDates);
//     console.log("Selected Week:", weekDates);
//   };

//   const handlePrevWeek = () => {
//     if (selectedWeek) {
//       const firstDayOfPrevWeek = subWeeks(new Date(selectedWeek[0].date), 1);
//       updateSelectedWeek(firstDayOfPrevWeek);
//     }
//   };

//   const handleNextWeek = () => {
//     if (selectedWeek) {
//       const firstDayOfNextWeek = addWeeks(new Date(selectedWeek[0].date), 1);
//       updateSelectedWeek(firstDayOfNextWeek);
//     }
//   };

//   const handleCancel = () => {
//     const resetRows = contentRows.map((row) => ({
//       dayHours: [0, 0, 0, 0, 0, 0, 0],
//       commenttext: ["", "", "", "", "", "", ""],
//       selectProject: "Select Project",
//       projectId: "",
//       selectedPayType: "regularhour",
//     }));
//     setContentRows(resetRows);
//     setProjectValue(null);
//   };

//   const handleCircleIconClick = () => {
//     handleAddNewRow("addnew");
//   };

//   const handleAddIconClick = () => {
//     handleAddNewRow("paytypeadd");
//   };

//   const handleTaskAddIconClick = (rowIndex) => {
//     handleAddNewRow("taskadd", rowIndex);
//   };

//   // const handleAddNewRow = (iconType, rowIndex) => {
//   //   setContentRows((prevRows) => {
//   //     const newRow = {
//   //       iconType: iconType,
//   //       dayHours: [0, 0, 0, 0, 0, 0, 0],
//   //       commenttext: ["", "", "", "", "", "", ""],
//   //       selectProject:
//   //         prevRows[rowIndex]?.selectProject?.value || "Select Project",
//   //       projectId: prevRows[rowIndex]?.projectId || "",
//   //       selectedPayType: "regularhour",
//   //       selectTask: null,
//   //     };

//   //     if (rowIndex !== undefined) {
//   //       return [
//   //         ...prevRows.slice(0, rowIndex + 1),
//   //         newRow,
//   //         ...prevRows.slice( rowIndex + 1),
//   //       ];
//   //     } else {
//   //       return [...prevRows, newRow];
//   //     }
//   //   });
//   //   console.log(iconType);
//   // };

//   const handleAddNewRow = (iconType, rowIndex) => {
//     setContentRows((prevRows) => {
//       const newRow = {
//         iconType: iconType,
//         dayHours: [0, 0, 0, 0, 0, 0, 0],
//         commenttext: ["", "", "", "", "", "", ""],
//         selectProject: rowIndex !== undefined ? prevRows[rowIndex].selectProject : "Select Project",
//         projectId: rowIndex !== undefined ? prevRows[rowIndex].projectId : "",
//         selectedPayType: "regularhour",
//         selectTask: null,
//       };

//       if (rowIndex !== undefined) {
//         return [
//           ...prevRows.slice(0, rowIndex + 1),
//           newRow,
//           ...prevRows.slice(rowIndex + 1),
//         ];
//       } else {
//         return [...prevRows, newRow];
//       }
//     });

//     setSelectedTasks(prevSelectedTasks => {
//       const newSelectedTasks = {...prevSelectedTasks};
//       // Shift all tasks after the inserted row
//       for (let i = contentRows.length; i > rowIndex; i--) {
//         newSelectedTasks[i] = newSelectedTasks[i - 1];
//       }
//       // Clear the task for the new row
//       newSelectedTasks[rowIndex + 1] = null;
//       return newSelectedTasks;
//     });

//   };

//   // const handleDeleteRow = (index) => {
//   //   const updatedRows = [...contentRows];
//   //   updatedRows.splice(index, 1);
//   //   setContentRows(updatedRows);
//   // };

//   const handleDeleteRow = (index) => {
//     const updatedRows = [...contentRows];
//     updatedRows.splice(index, 1);
//     setContentRows(updatedRows);

//     setSelectedTasks(prevSelectedTasks => {
//       const newSelectedTasks = {...prevSelectedTasks};
//       delete newSelectedTasks[index];
//       // Shift all tasks after the deleted row
//       for (let i = index; i < contentRows.length - 1; i++) {
//         newSelectedTasks[i] = newSelectedTasks[i + 1];
//       }
//       delete newSelectedTasks[contentRows.length - 1];
//       return newSelectedTasks;
//     });
//   };

//   const handleDayHoursChange = (event, rowIndex, dayIndex) => {
//     const updatedRows = [...contentRows];
//     updatedRows[rowIndex].dayHours[dayIndex] =
//       parseFloat(event.target.value) || 0;
//     setContentRows(updatedRows);
//   };

//   // const handleTaskChange = (selectedOption, rowIndex) => {
//   //   const updatedRows = [...contentRows];
//   //   updatedRows[rowIndex].selectTask = selectedOption;
//   //   setContentRows(updatedRows);
//   // };

//   // const handleTaskChange = (selectedOption, rowIndex) => {
//   //   setContentRows(prevRows => {
//   //     const updatedRows = [...prevRows];
//   //     updatedRows[rowIndex] = {
//   //       ...updatedRows[rowIndex],
//   //       selectTask: selectedOption
//   //     };
//   //     return updatedRows;
//   //   });
//   // };

// const handleTaskChange = (selectedOption, rowIndex) => {
//   setContentRows(prevRows => {
//     const updatedRows = [...prevRows];
//     updatedRows[rowIndex] = {
//       ...updatedRows[rowIndex],
//       selectTask: selectedOption
//     };
//     return updatedRows;
//   });

//   setSelectedTasks(prevSelectedTasks => ({
//     ...prevSelectedTasks,
//     [rowIndex]: selectedOption ? selectedOption.value : null
//   }));
// };

//   const handleCommentChange = (event, rowIndex, dayIndex) => {
//     const updatedRows = [...contentRows];
//     const inputValue = event.target.value;
//     updatedRows[rowIndex].commenttext[dayIndex] = inputValue.split("\n");

//     setContentRows(updatedRows);
//   };

//   // const handleProjectChange = (selectedOption, rowIndex) => {
//   //   if (selectedOption) {
//   //     const updatedRows = [...contentRows];
//   //     updatedRows[rowIndex].selectProject = selectedOption;
//   //     updatedRows[rowIndex].selectTask = null; // Reset the selectTask value
//   //     setContentRows(updatedRows);
//   //   }
//   // };

//   const handleProjectChange = (selectedOption, rowIndex) => {
//     if (selectedOption) {
//       const updatedRows = [...contentRows];
//       updatedRows[rowIndex].selectProject = selectedOption;
//       updatedRows[rowIndex].selectTask = null; // Reset the selectTask value
//       setContentRows(updatedRows);

//       // Clear the selected task for this row
//       setSelectedTasks(prevSelectedTasks => {
//         const newSelectedTasks = {...prevSelectedTasks};
//         delete newSelectedTasks[rowIndex];
//         return newSelectedTasks;
//       });
//     }
//   };

//   const handlePayTypeChange = (selectedOption, rowIndex) => {
//     if (selectedOption) {
//       const updatedRows = [...contentRows];
//       updatedRows[rowIndex].selectedPayType = selectedOption || "regularhour";
//       setContentRows(updatedRows);
//     } else {
//     }
//   };

//   const calculateTotalHours = (dayHours) => {
//     return dayHours.reduce((total, hours) => total + hours, 0);
//   };

//   const calculateOverallTotalHours = () => {
//     return contentRows.reduce(
//       (total, row) => total + calculateTotalHours(row.dayHours),
//       0
//     );
//   };

//   const calculatedayHourstotal = (dayIndex) => {
//     let totaldayHours = 0;
//     contentRows.forEach((row) => {
//       totaldayHours += row.dayHours[dayIndex];
//     });
//     return totaldayHours;
//   };

//   const calculateRegularHours = (dayIndex) => {
//     let totalRegularHours = 0;
//     contentRows.forEach((row) => {
//       if (row.selectedPayType === "regularhour") {
//         totalRegularHours += row.dayHours[dayIndex];
//       }
//     });
//     return totalRegularHours;
//   };

//   const calculateOvertimeHours = (dayIndex) => {
//     let totalOvertimeHours = 0;
//     contentRows.forEach((row) => {
//       if (row.selectedPayType === "overtimehour") {
//         totalOvertimeHours += row.dayHours[dayIndex];
//       }
//     });
//     return totalOvertimeHours;
//   };

//   const calculateTotalRegularHours = () => {
//     let totalRegularHours = 0;
//     selectedWeek.forEach((day, dayIndex) => {
//       totalRegularHours += calculateRegularHours(dayIndex);
//     });
//     return totalRegularHours;
//   };

//   const calculateTotalOvertimeHours = () => {
//     let totalRegularHours = 0;
//     selectedWeek.forEach((day, dayIndex) => {
//       totalRegularHours += calculateOvertimeHours(dayIndex);
//     });
//     return totalRegularHours;
//   };

//   const CustomDatePickerInput = ({ value, onClick }) => {
//     return (
//       <div className="custom-date-picker-input">
//         <div
//           className="ms-3 me-2 cursor-pointer custom-date-picker-input-arrow"
//           onClick={handlePrevWeek}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//           >
//             <path
//               d="M14 7L9 12L14 17"
//               stroke="white"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//             />
//           </svg>
//         </div>
//         <div className="d-flex cursor-pointer" onClick={onClick}>
//           <div className=" custom-date-picker-input-icon me-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//             >
//               <path
//                 d="M14 22H10C6.229 22 4.343 22 3.172 20.828C2 19.657 2 17.771 2 14V12C2 8.229 2 6.343 3.172 5.172C4.343 4 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C22 6.343 22 8.229 22 12V14C22 17.771 22 19.657 20.828 20.828C20.175 21.482 19.3 21.771 18 21.898M7 4V2.5M17 4V2.5M21.5 9H10.75M2 9H5.875"
//                 stroke="black"
//                 stroke-opacity="0.6"
//                 stroke-width="1.5"
//                 stroke-linecap="round"
//               />
//               <path
//                 d="M18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18C16.7348 18 16.4804 17.8946 16.2929 17.7071C16.1054 17.5196 16 17.2652 16 17C16 16.7348 16.1054 16.4804 16.2929 16.2929C16.4804 16.1054 16.7348 16 17 16C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17ZM18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14C16.7348 14 16.4804 13.8946 16.2929 13.7071C16.1054 13.5196 16 13.2652 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM8 17C8 17.2652 7.89464 17.5196 7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18C6.73478 18 6.48043 17.8946 6.29289 17.7071C6.10536 17.5196 6 17.2652 6 17C6 16.7348 6.10536 16.4804 6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17ZM8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13Z"
//                 fill="black"
//                 fill-opacity="0.6"
//               />
//             </svg>
//           </div>
//           {value}
//         </div>
//         <div
//           className="ms-2 me-3 cursor-pointer custom-date-picker-input-arrow"
//           onClick={handleNextWeek}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//           >
//             <path
//               d="M10 7L15 12L10 17"
//               stroke="white"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//             />
//           </svg>
//         </div>
//       </div>
//     );
//   };

//   const isWeekend = (dayIndex) => {
//     const day = new Date(selectedWeek[dayIndex].date).getDay();
//     return day === 0 || day === 6; // Sunday is 0, Saturday is 6
//   };

//   return (
//     <>
//       <ToastContainer
//         position="top-center"
//         autoClose={2000} // 5 seconds
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//       <Tooltip id="my-tooltip-comment" />
//       <div>
//         <Topbar locale={locale} setLocale={setLocale} />
//         <div className="d-flex">
//           <Sidebar locale={locale} setLocale={setLocale} />
//           <div
//             className="container "
//             style={{ overflow: "auto", maxHeight: "calc(100vh - 50px)" }}
//           >
//             <div className="back-button-icon-timesheet d-flex ms-4 mt-4 mb-3">
//               <Link to={"/timesheet"} style={{ textDecoration: "none" }}>
//                 <div className="back-button-icon-timesheet-icon">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="30"
//                     height="30"
//                     viewBox="0 0 30 30"
//                     fill="none"
//                   >
//                     <path
//                       d="M4.99992 12.5L4.11617 13.3838L3.23242 12.5L4.11617 11.6163L4.99992 12.5ZM26.2499 22.5C26.2499 22.8315 26.1182 23.1495 25.8838 23.3839C25.6494 23.6183 25.3314 23.75 24.9999 23.75C24.6684 23.75 24.3505 23.6183 24.116 23.3839C23.8816 23.1495 23.7499 22.8315 23.7499 22.5H26.2499ZM10.3662 19.6338L4.11617 13.3838L5.88367 11.6163L12.1337 17.8663L10.3662 19.6338ZM4.11617 11.6163L10.3662 5.36627L12.1337 7.13377L5.88367 13.3838L4.11617 11.6163ZM4.99992 11.25H17.4999V13.75H4.99992V11.25ZM26.2499 20V22.5H23.7499V20H26.2499ZM17.4999 11.25C19.8206 11.25 22.0462 12.1719 23.6871 13.8128C25.328 15.4538 26.2499 17.6794 26.2499 20H23.7499C23.7499 18.3424 23.0914 16.7527 21.9193 15.5806C20.7472 14.4085 19.1575 13.75 17.4999 13.75V11.25Z"
//                       fill="black"
//                       fill-opacity="0.6"
//                     />
//                   </svg>
//                 </div>
//               </Link>
//               <p className="back-button-icon-timesheet-p">Timesheet</p>
//             </div>
//             <div className="employee-week-details ">
//               <div className="row container employee-details-week-timesheet d-flex justify-content-between">
//                 <div className="employee-name-timesheet-week p-2 pt-3 col-auto">
//                   <label className="employee-name-timesheet-week-label mb-2">
//                     Employee Name
//                   </label>
//                   <div className="employee-name-timesheet-week-box-input">
//                     <input
//                       className="emp-weekly"
//                       autoComplete="off"
//                       type="text"
//                       id="projectname"
//                       value={userProfile.firstname}
//                       onChange={(e) => setempname(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="employee-ID-timesheet-week p-2 pt-3 col-auto">
//                   <label className="employee-ID-timesheet-week-label mb-2">
//                     Employee ID
//                   </label>
//                   <div className="employee-ID-timesheet-week-box-input">
//                     <input
//                       className="emp-weekly"
//                       autoComplete="off"
//                       type="text"
//                       id="projectname"
//                       value={userProfile.employeesid}
//                     />
//                   </div>
//                 </div>
//                 <div className="employee-status-timesheet-week p-2 pt-3 col-auto">
//                   <label className="employee-status-timesheet-week-label mb-2">
//                     Status
//                   </label>
//                   <div className="employee-status-timesheet-week-box-input">
//                     Re-Called
//                   </div>
//                 </div>
//                 <div className="employee-current-date-timesheet-week p-2 pt-3 col-auto">
//                   <label className="employee-current-date-timesheet-week-label mb-2">
//                     Current Time and Date
//                   </label>
//                   <div className="employee-current-date-timesheet-week-box-input d-flex">
//                     {/* {formattedDate} */}
//                     {formatDate(currentDateTime)}
//                     <div className="ps-2 employee-current-date-timesheet-week-box-input-icon">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                       >
//                         <path
//                           d="M14 22H10C6.229 22 4.343 22 3.172 20.828C2 19.657 2 17.771 2 14V12C2 8.229 2 6.343 3.172 5.172C4.343 4 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C22 6.343 22 8.229 22 12V14C22 17.771 22 19.657 20.828 20.828C20.175 21.482 19.3 21.771 18 21.898M7 4V2.5M17 4V2.5M21.5 9H10.75M2 9H5.875"
//                           stroke="black"
//                           stroke-opacity="0.6"
//                           stroke-width="1.5"
//                           stroke-linecap="round"
//                         />
//                         <path
//                           d="M18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18C16.7348 18 16.4804 17.8946 16.2929 17.7071C16.1054 17.5196 16 17.2652 16 17C16 16.7348 16.1054 16.4804 16.2929 16.2929C16.4804 16.1054 16.7348 16 17 16C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17ZM18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14C16.7348 14 16.4804 13.8946 16.2929 13.7071C16.1054 13.5196 16 13.2652 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM8 17C8 17.2652 7.89464 17.5196 7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18C6.73478 18 6.48043 17.8946 6.29289 17.7071C6.10536 17.5196 6 17.2652 6 17C6 16.7348 6.10536 16.4804 6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17ZM8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13Z"
//                           fill="black"
//                           fill-opacity="0.6"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="employee-select-week-timesheet-calendar p-2 pt-3 col-auto">
//                   <label className="employee-select-week-timesheet-calendar-label mb-2">
//                     Select Date
//                   </label>
//                   <div className="employee-select-week-timesheet-calendar-box-input">
//                     <DatePicker
//                       className="timesheet-week-calendar-wrapper-date-picker"
//                       selected={
//                         selectedWeek ? new Date(selectedWeek[0].date) : null
//                       }
//                       onChange={handleWeekChange}
//                       showWeekNumbers
//                       dateFormat={`MM/dd/yyyy - ${
//                         selectedWeek
//                           ? format(new Date(selectedWeek[6].date), "MM/dd/yyyy")
//                           : ""
//                       }`}
//                       selectsStart
//                       startDate={
//                         selectedWeek ? new Date(selectedWeek[0].date) : null
//                       }
//                       endDate={
//                         selectedWeek ? new Date(selectedWeek[6].date) : null
//                       }
//                       customInput={<CustomDatePickerInput />}
//                       calendarStartDay={1}
//                     />
//                   </div>
//                 </div>
//                 <div className="employee-reported-hours-timesheet-week p-2 pt-3 col-auto">
//                   <label className="employee-reported-hours-timesheet-week-label pt-4">
//                     Reported Hours
//                   </label>
//                   <div className="employee-reported-hours-timesheet-week-box-input">
//                     {calculateOverallTotalHours()} Hrs
//                   </div>
//                 </div>
//               </div>

//               <div className="employee-add-entries-details-week-timesheet table-responsive">
//                 <table class="table table-borderless custom-table ">
//                   <thead>
//                     <tr className="employee-add-entries-details-week-timesheet-table-head">
//                       <th
//                         scope="col"
//                         className="custom-table-header-week-timesheet-entries-project"
//                       >
//                         Project Name
//                       </th>
//                       <th
//                         scope="col"
//                         className="custom-table-header-week-timesheet-entries-task"
//                       >
//                         Task Name
//                       </th>
//                       <th
//                         scope="col"
//                         className="custom-table-header-week-timesheet-entries"
//                       >
//                         Pay type
//                       </th>
//                       {selectedWeek.map((day, dayIndex) => (
//                         <th
//                           key={day.date}
//                           className={`add-day-${dayIndex + 1}`}
//                           style={{
//                             whiteSpace: "nowrap",
//                             fontSize: "13.5px",
//                             paddingTop: "20px",
//                             paddingBottom: "20px",
//                             paddingLeft: "15px",
//                             paddingRight: "15px",

//                             alignItems: "center",

//                             textAlign: "center",
//                             fontWeight: "500",
//                             backgroundColor: "#787DBD",
//                             color: isWeekend(dayIndex) ? "#FFFFFF80" : "white",
//                           }}
//                         >
//                           <div>
//                             <label
//                               className="timesheet-add-hours-box-label"
//                               htmlFor={`working-hours-${dayIndex + 1}`}
//                             >
//                               <div>{`${format(
//                                 new Date(day.date),
//                                 "EEE"
//                               )}`}</div>
//                               <div>{`${format(
//                                 new Date(day.date),
//                                 "MMM dd"
//                               )}`}</div>
//                             </label>
//                           </div>
//                         </th>
//                       ))}
//                       <th
//                         scope="col"
//                         className="custom-table-header-week-timesheet-entries"
//                       >
//                         Total
//                       </th>
//                       <th
//                         scope="col"
//                         className="custom-table-header-week-timesheet-entries"
//                       ></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {contentRows.map((row, index) => (
//                       <tr key={index}>
//                         {row.iconType !== 'paytypeadd' && row.iconType !== 'taskadd' ? (
//                           <td className="custom-table-body-week-timesheet-entries">
//                             <div className="d-flex">
//                               <div
//                                 className="timesheet-weekly-add-new-work-hours"
//                                 id={`timesheet-weekly-add-new-work-hours-${index}`}
//                               >
//                                 <div
//                                   className="timesheet-weekly-add-new-work-hours-icon ms-3 mt-2"
//                                   onClick={handleCircleIconClick}
//                                 >
//                                   <IoMdAddCircleOutline
//                                     style={{
//                                       fontSize: "22px",
//                                       color: "rgba(0, 0, 0, 0.50)",
//                                       backgroundColor: "#EEECEC ",
//                                       marginTop: "16px",
//                                       cursor: "pointer",
//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                               <div>
//                                 <ReactSelect
//                                   className="timesheet-week-select-project-id-display-label me-2"
//                                   value={row.selectProject}
//                                   onChange={(selectedOption) =>
//                                     handleProjectChange(selectedOption, index)
//                                   }
//                                   id={`timesheet-week-select-project-id-display-label-${
//                                     index + 1
//                                   }`}
//                                   options={
//                                     Array.isArray(Project)
//                                       ? Project.map((project) => ({
//                                           key: project.projectId,
//                                           value: project.projectName,
//                                           label: project.projectName,
//                                         }))
//                                       : []
//                                   }
//                                   placeholder="Select Project"
//                                 />
//                               </div>
//                             </div>
//                           </td>
//                         ) : (
//                           <td className="custom-table-body-week-timesheet-entries"></td>
//                         )}
//                         {row.iconType !== 'paytypeadd' ? (
//                         // {row.iconType !== "paytypeadd" &&
//                         // row.iconType !== "addnew" ? (
//                           <td className="custom-table-body-week-timesheet-entries">
//                             <div className="d-flex">
//                               <div
//                                 className="timesheet-weekly-add-new-task-icon mt-2 me-1"
//                                 onClick={() => handleTaskAddIconClick(index)}
//                               >
//                                 <IoMdAddCircleOutline
//                                   style={{
//                                     fontSize: "22px",
//                                     color: "rgba(0, 0, 0, 0.50)",
//                                     backgroundColor: "#EEECEC ",
//                                     marginTop: "16px",
//                                     cursor: "pointer",
//                                   }}
//                                 />
//                               </div>

//                               <div>
//                                 <ReactSelect
//                                   className="timesheet-week-select-task-id-display-label me-2"
//                                   value={row.selectTask}
//                                   onChange={(selectedOption) =>
//                                     handleTaskChange(selectedOption, index)
//                                   }
//                                   id={`timesheet-week-select-task-id-display-label-${
//                                     index + 1
//                                   }`}
//                                   // options={
//                                   //   row.selectProject && Array.isArray(Project)
//                                   //     ? Project.find(
//                                   //         (project) =>
//                                   //           project.projectName ===
//                                   //           (typeof row.selectProject ===
//                                   //           "object"
//                                   //             ? row.selectProject.value
//                                   //             : row.selectProject)
//                                   //       )?.tasks?.map((task) => ({
//                                   //         key: task.taskid,
//                                   //         value: task.taskname,
//                                   //         label: task.taskname,
//                                   //       })) || []
//                                   //     : []
//                                   // }
//                                   options={
//                                     row.selectProject && Array.isArray(Project)
//                                       ? Project.find(
//                                           (project) =>
//                                             project.projectName ===
//                                             (typeof row.selectProject === "object"
//                                               ? row.selectProject.value
//                                               : row.selectProject)
//                                         )?.tasks?.filter(task =>
//                                           !Object.values(selectedTasks).includes(task.taskname) ||
//                                           selectedTasks[index] === task.taskname
//                                         ).map((task) => ({
//                                           key: task.taskid,
//                                           value: task.taskname,
//                                           label: task.taskname,
//                                         })) || []
//                                       : []
//                                   }
//                                   placeholder="Select Task"
//                                 />
//                               </div>
//                             </div>
//                           </td>
//                         ) : (
//                           <td className="custom-table-body-week-timesheet-entries"></td>
//                         )}

//                         <td className="custom-table-body-week-timesheet-entries">
//                           <div className="d-flex flex-row">
//                             <div
//                               className="timesheet-weekly-add-new-pay-type-icon"
//                               id={`timesheet-weekly-add-new-pay-type-icon-${index}`}
//                               onClick={handleAddIconClick}
//                             >
//                               <IoMdAddCircleOutline
//                                 style={{
//                                   fontSize: "22px",
//                                   color: "rgba(0, 0, 0, 0.50)",
//                                   marginTop: "20px",
//                                   cursor: "pointer",
//                                 }}
//                               />
//                             </div>

//                             <div class="timesheet-weekly-pay-type-select-custom-dropdown">
//                               <select
//                                 class="form-select timesheet-weekly-pay-type-select"
//                                 id={`timesheet-weekly-pay-type-select-${index}`}
//                                 onChange={(e) =>
//                                   handlePayTypeChange(e.target.value, index)
//                                 }
//                                 value={row.selectedPayType}
//                               >
//                                 <option value="regularhour">R</option>
//                                 <option value="overtimehour">OT</option>
//                               </select>
//                             </div>
//                           </div>
//                         </td>
//                         {selectedWeek.map((day, dayIndex) => (
//                           <td
//                             key={day.date}
//                             className="custom-table-body-week-timesheet-entries"
//                           >
//                             <div className="timesheet-weekly-add-hours-box d-flex flex-row">
//                               <input
//                                 className="timesheet-weekly-add-hours-box-show"
//                                 type="number"
//                                 id={`working-hours-weekly-timesheet-${
//                                   dayIndex + 1
//                                 }`}
//                                 onChange={(event) =>
//                                   handleDayHoursChange(event, index, dayIndex)
//                                 }
//                                 onClick={() =>
//                                   handleInputClick(index, dayIndex)
//                                 }
//                                 onMouseEnter={() =>
//                                   handleInputClick(index, dayIndex)
//                                 }
//                                 value={contentRows[index].dayHours[dayIndex]}
//                                 style={{
//                                   color: isWeekend(dayIndex)
//                                     ? "#00000050"
//                                     : "#00000080",
//                                 }}
//                               />
//                               {clickedInputIndex === dayIndex &&
//                                 clickedRowIndex === index && (
//                                   <div className="timesheet-weekly-add-hours-box-show-icon">
//                                     <FaRegCommentDots
//                                       style={{
//                                         fontSize: "20px",
//                                         marginTop: "9px",
//                                         color: isWeekend(dayIndex)
//                                           ? "#00000050"
//                                           : "#00000080",
//                                         cursor: "pointer",
//                                       }}
//                                       className="timesheet-weekly-enter-commend-box "
//                                       data-bs-toggle="modal"
//                                       data-bs-target={`#commentpopupModal-${index}-${
//                                         dayIndex + 1
//                                       }`}
//                                       data-tooltip-id="my-tooltip-comment"
//                                       data-tooltip-content={
//                                         contentRows[index].commenttext[
//                                           dayIndex
//                                         ] || "No comments"
//                                       }
//                                     />

//                                     <div
//                                       class="modal commentpopupModal-timesheet-weekly"
//                                       id={`commentpopupModal-${index}-${
//                                         dayIndex + 1
//                                       }`}
//                                       tabindex="-1"
//                                       aria-labelledby="commentpopupModalLabel"
//                                       aria-hidden="true"
//                                     >
//                                       <div class="modal-dialog modal-dialog-centered search-weekly">
//                                         <div class="modal-content timesheet-weekly-comment-text-model">
//                                           <div class="modal-body">
//                                             <div>
//                                               <div className="d-flex justify-content-between">
//                                                 <div
//                                                   className="modal-title d-flex flex-row"
//                                                   id="commentpopupModalLabel"
//                                                 >
//                                                   <h5 className="timesheet-weekly-comment-text-model-title-name mt-2">
//                                                     Submission Date &nbsp; -
//                                                     &nbsp; &nbsp;
//                                                   </h5>
//                                                   <h5 className="timesheet-weekly-comment-text-model-title-date mt-2">
//                                                     {" "}
//                                                     {`${format(
//                                                       new Date(day.date),
//                                                       "EEE MMM dd"
//                                                     )} - ${new Date(
//                                                       day.date
//                                                     ).getFullYear()}`}
//                                                   </h5>
//                                                 </div>
//                                                 <div
//                                                   className="timesheet-weekly-comment-text-model-title-close-icon"
//                                                   data-bs-dismiss="modal"
//                                                   aria-label="Close"
//                                                 >
//                                                   <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     width="16"
//                                                     height="16"
//                                                     viewBox="0 0 16 16"
//                                                     fill="none"
//                                                   >
//                                                     <path
//                                                       d="M4 12L12 4M12 12L4 4"
//                                                       stroke="#F8F8F8"
//                                                       stroke-width="2"
//                                                       stroke-linecap="round"
//                                                       stroke-linejoin="round"
//                                                     />
//                                                   </svg>
//                                                 </div>
//                                               </div>
//                                               <div className="timesheet-weekly-comment-text-model-title-emptyline"></div>
//                                               <textarea
//                                                 id={`timesheet-weekly-comment-textarea-${
//                                                   dayIndex + 1
//                                                 }`}
//                                                 className="timesheet-weekly-comment-textarea-name"
//                                                 rows="4"
//                                                 placeholder="Leave a comment for Authorizer..."
//                                                 value={
//                                                   contentRows[index]
//                                                     .commenttext[dayIndex]
//                                                 }
//                                                 onChange={(event) =>
//                                                   handleCommentChange(
//                                                     event,
//                                                     index,
//                                                     dayIndex
//                                                   )
//                                                 }
//                                               />
//                                               <div className="d-flex justify-content-end">
//                                                 <button
//                                                   type="button"
//                                                   class="btn timesheet-weekly-comment-text-model-share-comment"
//                                                   data-bs-dismiss="modal"
//                                                 >
//                                                   Share Comment
//                                                 </button>
//                                               </div>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                             </div>
//                           </td>
//                         ))}
//                         <td className="custom-table-body-week-timesheet-entries">
//                           <div className="timesheet-weekly-add-total-hours-box">
//                             <div>
//                               <input
//                                 className="timesheet-weekly-add-total-hours-box-show"
//                                 type="text"
//                                 id="timesheet-weekly-add-total-hours-box-label"
//                                 value={calculateTotalHours(row.dayHours)}
//                               />
//                             </div>
//                           </div>
//                         </td>
//                         <td className="custom-table-body-week-timesheet-entries">
//                           <div className="timesheet-weekly-add-new-work-hours-delete">
//                             <div
//                               className="timesheet-weekly-add-new-work-hours-icon-delete"
//                               onClick={() => handleDeleteRow(index)}
//                             >
//                               {index !== 0 && (
//                                 <React.Fragment>
//                                   <div className="timesheet-weekly-add-new-work-hours-icon-display-delete-icon">
//                                     <svg
//                                       xmlns="http://www.w3.org/2000/svg"
//                                       width="14"
//                                       height="16"
//                                       viewBox="0 0 14 16"
//                                       fill="none"
//                                     >
//                                       <path
//                                         d="M1.71112 5.6904L2.59192 14.4168C2.64072 14.7856 4.42152 15.9984 6.99992 16C9.57992 15.9984 11.3607 14.7856 11.4087 14.4168L12.2903 5.6904C10.9431 6.444 8.92952 6.8 6.99992 6.8C5.07192 6.8 3.05752 6.444 1.71112 5.6904ZM9.53432 1.208L8.84712 0.4472C8.58152 0.0688 8.29352 0 7.73272 0H6.26792C5.70792 0 5.41912 0.0688 5.15432 0.4472L4.46712 1.208C2.41112 1.5672 0.919922 2.52 0.919922 3.2232V3.3592C0.919922 4.5968 3.64232 5.6 6.99992 5.6C10.3583 5.6 13.0807 4.5968 13.0807 3.3592V3.2232C13.0807 2.52 11.5903 1.5672 9.53432 1.208ZM8.65592 3.472L7.79992 2.4H6.19992L5.34552 3.472H3.98552C3.98552 3.472 5.47512 1.6952 5.67432 1.4544C5.82632 1.2704 5.98152 1.2 6.18312 1.2H7.81752C8.01992 1.2 8.17512 1.2704 8.32712 1.4544C8.52552 1.6952 10.0159 3.472 10.0159 3.472H8.65592Z"
//                                         fill="black"
//                                         fill-opacity="0.5"
//                                       />
//                                     </svg>
//                                   </div>
//                                 </React.Fragment>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                     <tr>
//                       <td
//                         colspan="3"
//                         className="custom-table-body-week-timesheet-entries"
//                       >
//                         <div className="d-flex justify-content-end timesheet-week-regular-hours-calculation">
//                           Regular :
//                         </div>
//                       </td>
//                       {selectedWeek.map((day, dayIndex) => (
//                         <td
//                           key={dayIndex}
//                           className="custom-table-body-week-timesheet-entries"
//                         >
//                           <div className="timesheet-week-regular-hours-calculation">
//                             {calculateRegularHours(dayIndex)}
//                           </div>
//                         </td>
//                       ))}
//                       <td
//                         colSpan={selectedWeek.length}
//                         className="custom-table-body-week-timesheet-entries"
//                       >
//                         <div className="timesheet-week-regular-hours-calculation-final">
//                           {calculateTotalRegularHours()}
//                         </div>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td
//                         colspan="3"
//                         className="custom-table-body-week-timesheet-entries"
//                       >
//                         <div className="d-flex justify-content-end timesheet-week-overtime-hours-calculation">
//                           Overtime :
//                         </div>
//                       </td>
//                       {selectedWeek.map((day, dayIndex) => (
//                         <td
//                           key={dayIndex}
//                           className="custom-table-body-week-timesheet-entries"
//                         >
//                           <div className="timesheet-week-overtime-hours-calculation">
//                             {calculateOvertimeHours(dayIndex)}
//                           </div>
//                         </td>
//                       ))}
//                       <td
//                         colSpan={selectedWeek.length}
//                         className="custom-table-body-week-timesheet-entries"
//                       >
//                         <div className="timesheet-week-overtime-hours-calculation-final">
//                           {calculateTotalOvertimeHours()}
//                         </div>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td
//                         colSpan="3"
//                         className="custom-table-body-week-timesheet-entries"
//                       >
//                         <div className="d-flex justify-content-end timesheet-week-total-hours-calculation">
//                           Total :
//                         </div>
//                       </td>
//                       {selectedWeek.map((day, dayIndex) => (
//                         <td
//                           key={dayIndex}
//                           className="custom-table-body-week-timesheet-entries"
//                         >
//                           <div className="timesheet-week-total-hours-calculation">
//                             {calculatedayHourstotal(dayIndex)}
//                           </div>
//                         </td>
//                       ))}
//                       <td
//                         colSpan={selectedWeek.length}
//                         className="custom-table-body-week-timesheet-entries"
//                       >
//                         <div className="timesheet-week-total-hours-calculation-final">
//                           {calculateOverallTotalHours()}
//                         </div>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td colSpan="13" className="empty-space-color-table"></td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//               <div className="row copy-last-week-and-save-submit-cancel-button d-flex justify-content-between">
//                 <div className="copy-last-week-activity  ms-4 col-auto">
//                   <div className="d-flex flex-md-row flex-column">
//                     <div className="d-flex flex-column">
//                       <div className="copy-last-week-activity-select-option mt-3 me-4 ">
//                         <select
//                           className="form-select copy-last-week-activity-select-option-form"
//                           aria-label="Default select example"
//                         >
//                           <option value="1">Copy activities Only</option>
//                           <option value="2">Copy activities and Time</option>
//                         </select>
//                       </div>
//                     </div>
//                     <div className="copy-last-week-activity-save-button ms-3 mt-2 ">
//                       <div className="button btn d-flex copy-last-week-activity-save-button-and-icon">
//                         <div className="copy-last-week-activity-save-button-div ps-2 pe-2">
//                           Save
//                         </div>

//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="18"
//                           height="18"
//                           viewBox="0 0 18 18"
//                           fill="none"
//                         >
//                           <path
//                             d="M0 2.75C0 2.02065 0.289731 1.32118 0.805456 0.805456C1.32118 0.289731 2.02065 0 2.75 0H12.715C13.5769 5.14719e-05 14.4035 0.342495 15.013 0.952L17.048 2.987C17.658 3.597 18 4.424 18 5.286V15.25C18 15.9793 17.7103 16.6788 17.1945 17.1945C16.6788 17.7103 15.9793 18 15.25 18H2.75C2.02065 18 1.32118 17.7103 0.805456 17.1945C0.289731 16.6788 0 15.9793 0 15.25V2.75ZM2.75 1.5C2.06 1.5 1.5 2.06 1.5 2.75V15.25C1.5 15.94 2.06 16.5 2.75 16.5H3V11.25C3 10.6533 3.23705 10.081 3.65901 9.65901C4.08097 9.23705 4.65326 9 5.25 9H12.75C13.3467 9 13.919 9.23705 14.341 9.65901C14.7629 10.081 15 10.6533 15 11.25V16.5H15.25C15.94 16.5 16.5 15.94 16.5 15.25V5.286C16.5 4.821 16.316 4.376 15.987 4.048L13.952 2.013C13.6937 1.75422 13.3607 1.58286 13 1.523V4.25C13 4.54547 12.9418 4.83805 12.8287 5.11104C12.7157 5.38402 12.5499 5.63206 12.341 5.84099C12.1321 6.04992 11.884 6.21566 11.611 6.32873C11.3381 6.4418 11.0455 6.5 10.75 6.5H6.25C5.65326 6.5 5.08097 6.26295 4.65901 5.84099C4.23705 5.41903 4 4.84674 4 4.25V1.5H2.75ZM13.5 16.5V11.25C13.5 11.0511 13.421 10.8603 13.2803 10.7197C13.1397 10.579 12.9489 10.5 12.75 10.5H5.25C5.05109 10.5 4.86032 10.579 4.71967 10.7197C4.57902 10.8603 4.5 11.0511 4.5 11.25V16.5H13.5ZM5.5 1.5V4.25C5.5 4.664 5.836 5 6.25 5H10.75C10.9489 5 11.1397 4.92098 11.2803 4.78033C11.421 4.63968 11.5 4.44891 11.5 4.25V1.5H5.5Z"
//                             fill="black"
//                             fill-opacity="0.5"
//                           />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="timesheet-weekly-submit-save-cancel-button d-flex flex-row col-auto ms-4 mt-3 mb-4">
//                   <div
//                     className="button btn d-flex flex-row timesheet-weekly-button-submit mb-2"
//                     onClick={() => saveTimesheet("submitted")}
//                   >
//                     <div>
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                       >
//                         <path
//                           d="M20 13V5.749C20.0001 5.67006 19.9845 5.59189 19.9543 5.51896C19.9241 5.44603 19.8798 5.37978 19.824 5.324L16.676 2.176C16.5636 2.06345 16.4111 2.00014 16.252 2H4.6C4.44087 2 4.28826 2.06321 4.17574 2.17574C4.06321 2.28826 4 2.44087 4 2.6V21.4C4 21.5591 4.06321 21.7117 4.17574 21.8243C4.28826 21.9368 4.44087 22 4.6 22H14"
//                           stroke="#38BA7C"
//                           stroke-width="1.5"
//                           stroke-linecap="round"
//                           stroke-linejoin="round"
//                         />
//                         <path
//                           d="M16 2V5.4C16 5.55913 16.0632 5.71174 16.1757 5.82426C16.2883 5.93679 16.4409 6 16.6 6H20M16 19H22M22 19L19 16M22 19L19 22"
//                           stroke="#38BA7C"
//                           stroke-width="1.5"
//                           stroke-linecap="round"
//                           stroke-linejoin="round"
//                         />
//                       </svg>
//                     </div>
//                     <div className="timesheet-weekly-button-submit-div ps-2">
//                       Sign
//                     </div>
//                   </div>
//                   <div
//                     className="button btn d-flex flex-row timesheet-weekly-button-save mb-2"
//                     onClick={() => saveTimesheet("draft")}
//                   >
//                     <div>
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                       >
//                         <path
//                           d="M7 21H17C18.0609 21 19.0783 20.5786 19.8284 19.8284C20.5786 19.0783 21 18.0609 21 17V7.414C20.9999 7.14881 20.8946 6.89449 20.707 6.707L17.293 3.293C17.1055 3.10545 16.8512 3.00006 16.586 3H7C5.93913 3 4.92172 3.42143 4.17157 4.17157C3.42143 4.92172 3 5.93913 3 7V17C3 18.0609 3.42143 19.0783 4.17157 19.8284C4.92172 20.5786 5.93913 21 7 21Z"
//                           stroke="#787DBD"
//                           stroke-width="2"
//                           stroke-linecap="round"
//                           stroke-linejoin="round"
//                         />
//                         <path
//                           d="M17 21V14C17 13.7348 16.8946 13.4804 16.7071 13.2929C16.5196 13.1054 16.2652 13 16 13H8C7.73478 13 7.48043 13.1054 7.29289 13.2929C7.10536 13.4804 7 13.7348 7 14V21M9 3H15V6C15 6.26522 14.8946 6.51957 14.7071 6.70711C14.5196 6.89464 14.2652 7 14 7H10C9.73478 7 9.48043 6.89464 9.29289 6.70711C9.10536 6.51957 9 6.26522 9 6V3Z"
//                           stroke="#787DBD"
//                           stroke-width="2"
//                         />
//                         <path
//                           d="M11 17H13"
//                           stroke="#787DBD"
//                           stroke-width="2"
//                           stroke-linecap="round"
//                         />
//                       </svg>
//                     </div>
//                     <div className="timesheet-weekly-button-save-div ps-2">
//                       Save
//                     </div>
//                   </div>
//                   <div
//                     className="button btn d-flex flex-row timesheet-weekly-button-reset mb-2"
//                     onClick={handleCancel}
//                   >
//                     <div>
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="21"
//                         height="21"
//                         viewBox="0 0 21 21"
//                         fill="none"
//                       >
//                         <path
//                           d="M7.5 5.5L4.5 2.5H10.5C12.0976 2.49986 13.6587 2.97788 14.9823 3.87253C16.306 4.76718 17.3315 6.03751 17.927 7.52C18.297 8.441 18.5 9.447 18.5 10.5C18.5 12.6217 17.6571 14.6566 16.1569 16.1569C14.6566 17.6571 12.6217 18.5 10.5 18.5C8.37827 18.5 6.34344 17.6571 4.84315 16.1569C3.34285 14.6566 2.5 12.6217 2.5 10.5C2.5 9.01 2.87 7.028 4.038 5.409M7.5 7.5L13.5 13.5M7.5 13.5L13.5 7.5"
//                           stroke="#FF7F7F"
//                           stroke-linecap="round"
//                           stroke-linejoin="round"
//                         />
//                       </svg>
//                     </div>
//                     <div className="timesheet-weekly-button-reset-div ps-2">
//                       Reset
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="white-space-timesheet"></div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default WeeklyAddnewtimesheet;

import Sidebar from "../../../Components/Sidebar";
import Topbar from "../../../Components/Topbar";
import React, { useState, useEffect } from "react";
import "./WeeklyAddnewtimesheet.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { startOfWeek, addDays, format, addWeeks, subWeeks } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {
  faPlus,
  faTrash,
  faEdit,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { IoMdAddCircleOutline, IoIosSave } from "react-icons/io";
import axios from "axios";
import ReactSelect from "react-select";
import { FaRegCommentDots } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { MdAdd } from "react-icons/md";
import { Diversity1 } from "@mui/icons-material";
import { useParams, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import Select from "react-select";
import { useTimeFormat } from "../../settings/TimeFormatContext";

// const getWeekDates = (firstDayOfWeek) => {
//     return Array.from({ length: 7 }, (_, index) => {
//         const currentDate = addDays(firstDayOfWeek, index);
//         return {
//             date: format(currentDate, 'yyyy-MM-dd'),
//             day: format(currentDate, 'EEEE'),
//         };
//     });
// };
const getWeekDates = (firstDayOfWeek) => {
  const weekDates = [];
  let currentDate = startOfWeek(firstDayOfWeek, { weekStartsOn: 1 }); // 1 represents Monday

  for (let i = 0; i < 7; i++) {
    weekDates.push({
      date: format(currentDate, "yyyy-MM-dd"),
      day: format(currentDate, "EEEE"),
    });
    currentDate = addDays(currentDate, 1);
  }

  return weekDates;
};

const WeeklyAddnewtimesheet = ({ locale, setLocale, isViewModeTimesheet = false }) => {
  const [userProfile, setUserProfile] = useState({});
  const [empname, setempname] = useState("");
  const navigate = useNavigate();
  const getCurrentWeek = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    return getWeekDates(start);
  };
  const firstDayOfCurrentWeek = startOfWeek(new Date());
  const currentDate = new Date();
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { timeFormat } = useTimeFormat();

  const [selectedWeek, setSelectedWeek] =useState(getCurrentWeek());
  const [Project, setProject] = useState([]);
  const [showcommentBoxicon, setShowcommentBoxicon] = useState(false);
  const [clickedInputIndex, setClickedInputIndex] = useState(null);
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [contentRows, setContentRows] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({});
  const { id } = useParams();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);

  const [timesheetData, setTimesheetData] = useState(null);
  const [projectValue, setProjectValue] = useState(null);
  const [selectedPayType, setSelectedPayType] = useState("regularhour");
  const disableSaveButton = location.state?.disableSaveButton || false;
  const activeRevisionButton = location.state?.activeRevisionButton || false;
  const [timesheetStatusvalue, setTimesheetStatusvalue] = useState("New");
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = {
      // weekday: "short",
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: timeFormat === "12-hours" ? "2-digit" : "2-digit",
      minute: "2-digit",
      hour12: timeFormat === "12-hours",
    };

    let formattedDate = date.toLocaleString("en-US", options);
    formattedDate = formattedDate.replace(",", "");
    return formattedDate;
  };

  const saveTimesheet = async (buttonClicked, event) => {
    const calculateTotalHoursForDay = (dayIndex) => {
      return contentRows.reduce((total, row) => total + row.dayHours[dayIndex], 0);
    };

    const timesheet = {
      employeeId: userProfile.employeeId,
      employeesId: userProfile.employeesid,
      employeeName: userProfile.firstname,
      status: buttonClicked,
      currentDateTime: new Date().toISOString(),
      reportedHours: calculateOverallTotalHours().toString(),
      totalHours: calculateOverallTotalHours().toString(),
      totalRegularHours: calculateTotalRegularHours().toString(),
      totalOvertimeHours: calculateTotalOvertimeHours().toString(),
      days: selectedWeek.map((day, index) => ({
        startDate: day.date,
        weeklyEntries: contentRows.map((row, rowIndex) => ({
          projectId: row.selectProject?.key || (rowIndex > 0 ? contentRows[rowIndex - 1].selectProject?.key || "" : ""),
          projectName: row.selectProject?.value || (rowIndex > 0 ? contentRows[rowIndex - 1].selectProject?.value || "" : ""),
          taskId: row.selectTask?.key || (rowIndex > 0 ? contentRows[rowIndex - 1].selectTask?.key || "" : ""),
          taskName: row.selectTask?.value || (rowIndex > 0 ? contentRows[rowIndex - 1].selectTask?.value || "" : ""),
          regularHours: row.selectedPayType === "regularhour" ? row.dayHours[index].toString() : "0",
          regularComments: row.selectedPayType === "regularhour" ? (Array.isArray(row.commenttext[index]) ? row.commenttext[index].join(", ") : row.commenttext[index] || "") : "",
          overtimeHours: row.selectedPayType === "overtimehour" ? row.dayHours[index].toString() : "0",
          overtimeComments: row.selectedPayType === "overtimehour" ? (Array.isArray(row.commenttext[index]) ? row.commenttext[index].join(", ") : row.commenttext[index] || "") : "",
        })),
      })),
    };

    console.log('Prepared timesheet object:', timesheet);

    try {
      if (isEditMode) {
        if (timesheetData) {
          timesheet.id = timesheetData.id;
          const response = await axios.put(
            process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/weekly/update/${timesheet.id}`,
            timesheet
          );

          if (buttonClicked === "Submitted") {
            toast("Submitted Timesheet was successfully updated.");
            setTimeout(() => {
              navigate("/timesheet/mytimesheet");
            }, 2000);
          } else if (buttonClicked === "In-use") {
            toast("Saved Timesheet was successfully updated");
            setTimeout(() => {
              navigate("/timesheet");
            }, 2000);
          } else {
            console.error("Error updating timesheet:", response.data);
            throw new Error(`Error updating timesheet: ${response.data}`);
          }
        } else {
          throw new Error("Timesheet data is not available for editing");
        }
      } else {
        await axios.post(process.env.REACT_APP_API_BASE_URL + `/api/v1/timesheet/weekly/save`, timesheet);
        setSelectedPayType();
        setProject("");
        setContentRows([
          {
            dayHours: [0, 0, 0, 0, 0, 0, 0],
            commenttext: ["", "", "", "", "", "", ""],
            selectProject: { value: "Select Project", label: "Select Project" },
          },
        ]);

        if (buttonClicked === "Submitted") {
          toast("Timesheet submitted successfully");
          setTimeout(() => {
            navigate("/timesheet/mytimesheet");
          }, 2000);
        } else if (buttonClicked === "In-use") {
          toast("Timesheet saved successfully");
          setTimeout(() => {
            navigate("/timesheet");
          }, 2000);
        }
      }
    } catch (err) {
      console.error(err);
      if (buttonClicked === "Submitted") {
        toast("Timesheet submission failed: " + err.message);
      } else if (buttonClicked === "In-use") {
        toast("Timesheet save failed: " + err.message);
      }
    }
  };

  const handleInputClick = (rowIndex, columnIndex) => {
    setClickedRowIndex(rowIndex);
    setClickedInputIndex(columnIndex);
  };

  useEffect(() => {
    const retrieveUserProfile = localStorage.getItem("userInfo");
    if (retrieveUserProfile) {
      const userProfile = JSON.parse(retrieveUserProfile);
      setUserProfile(userProfile);
      Loadproject();
    }
  }, []);

  useEffect(() => {
    const retrieveUserProfile = localStorage.getItem("userInfo");
    if (retrieveUserProfile) {
      const userProfile = JSON.parse(retrieveUserProfile);
      setUserProfile(userProfile);

      async function fetchDatas() {
        try {
          const response = await axios.get(
            process.env.REACT_APP_API_BASE_URL +
            `/api/v1/project/getProjectsWithTasks/${userProfile.employeeId}`
          );
          setProject(Array.isArray(response.data) ? response.data : []); // Ensure Project is an array
        } catch (error) {
          console.error("Error fetching projects:", error);
          setProject([]); // Set Project to an empty array if an error occurs
        }
      }
      fetchDatas();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await Loadproject(); // Assuming this function loads project data

      if (location.state && location.state.timesheet) {
        const timesheetData = location.state.timesheet;

        if (timesheetData && timesheetData.days) {
          const groupedEntries = {};

          timesheetData.days.forEach((day, dayIndex) => {
            if (day.entries) {
              day.entries.forEach((entry) => {
                const key = `${entry.projectName}-${entry.taskName}-${entry.regularHours > 0 ? "regularhour" : "overtimehour"
                  }`;
                if (!groupedEntries[key]) {
                  groupedEntries[key] = {
                    dayHours: new Array(7).fill(0),
                    commenttext: new Array(7).fill(""),
                    selectProject: {
                      value: entry.projectName,
                      label: entry.projectName,
                    },
                    selectTask: {
                      value: entry.taskName,
                      label: entry.taskName,
                    },
                    projectId: entry.id,
                    selectedPayType:
                      entry.regularHours > 0 ? "regularhour" : "overtimehour",
                  };
                }

                if (parseFloat(entry.regularHours) > 0) {
                  groupedEntries[key].dayHours[dayIndex] = parseFloat(
                    entry.regularHours || "0"
                  );
                  groupedEntries[key].commenttext[dayIndex] =
                    entry.regularComments || "";
                }

                if (parseFloat(entry.overtimeHours) > 0) {
                  groupedEntries[key].dayHours[dayIndex] = parseFloat(
                    entry.overtimeHours || "0"
                  );
                  groupedEntries[key].commenttext[dayIndex] =
                    entry.overtimeComments || "";
                }
              });
            } else if (day.weeklyEntries) {
              day.weeklyEntries.forEach((entry) => {
                const key = `${entry.projectName}-${entry.taskName}-${entry.regularHours > 0 ? "regularhour" : "overtimehour"
                  }`;
                if (!groupedEntries[key]) {
                  groupedEntries[key] = {
                    dayHours: new Array(7).fill(0),
                    commenttext: new Array(7).fill(""),
                    selectProject: {
                      value: entry.projectName,
                      label: entry.projectName,
                    },
                    selectTask: {
                      value: entry.taskName,
                      label: entry.taskName,
                    },
                    projectId: entry.id,
                    selectedPayType:
                      entry.regularHours > 0 ? "regularhour" : "overtimehour",
                  };
                }

                if (parseFloat(entry.regularHours) > 0) {
                  groupedEntries[key].dayHours[dayIndex] = parseFloat(
                    entry.regularHours || "0"
                  );
                  groupedEntries[key].commenttext[dayIndex] =
                    entry.regularComments || "";
                }

                if (parseFloat(entry.overtimeHours) > 0) {
                  groupedEntries[key].dayHours[dayIndex] = parseFloat(
                    entry.overtimeHours || "0"
                  );
                  groupedEntries[key].commenttext[dayIndex] =
                    entry.overtimeComments || "";
                }
              });
            }
          });

          // Filter out empty rows
          const filteredRows = Object.values(groupedEntries).filter(
            (row) =>
              row.dayHours.some((hours) => hours > 0) ||
              row.commenttext.some((comment) => comment !== "")
          );

          setContentRows(filteredRows);
          setTimesheetData(timesheetData);
          setIsEditMode(true);
          setTimesheetStatusvalue(timesheetData.status || "New");

          if (
            timesheetData.days &&
            timesheetData.days[0] &&
            timesheetData.days[0].date
          ) {
            setSelectedWeek(getWeekDates(new Date(timesheetData.days[0].date)));
          } else if (
            timesheetData.days &&
            timesheetData.days[0] &&
            timesheetData.days[0].startDate
          ) {
            setSelectedWeek(
              getWeekDates(new Date(timesheetData.days[0].startDate))
            );
          } else {
            console.error("No start date found in timesheet data");
          }
        } else {
          console.error("No timesheet data found");
        }
      } else {
        // Handle case when no timesheet data is available
        setContentRows([
          {
            dayHours: new Array(7).fill(0),
            commenttext: new Array(7).fill(""),
            selectProject: { value: "Select Project", label: "Select Project" },
            selectTask: { value: "Select Task", label: "Select Task" },
            projectId: "",
            selectedPayType: "regularhour",
          },
        ]);
      }
    };

    fetchData();
  }, [location.state]);

  console.log("Fetched timesheet data:", timesheetData);
  console.log("Set contentRows:", contentRows);

  async function Loadproject() {
    try {
      const retrieveUserProfile = localStorage.getItem("userInfo");
      if (retrieveUserProfile) {
        const userProfile = JSON.parse(retrieveUserProfile);
        const response = await axios.get(
          process.env.REACT_APP_API_BASE_URL +
          `/api/v1/project/getProjectsWithTasks/${userProfile.employeeId}`
        );

        setProject(response.data);
      } else {
        setProject([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProject([]);
    }
  }

  const handleWeekChange = (date) => {
    const firstDayOfWeek = startOfWeek(date, { weekStartsOn: 1 });
    updateSelectedWeek(firstDayOfWeek);
  };

  const updateSelectedWeek = (firstDayOfWeek) => {
    const weekDates = getWeekDates(firstDayOfWeek);
    setSelectedWeek(weekDates);
    console.log("Selected Week:", weekDates);
  };

  const handlePrevWeek = () => {
    if (selectedWeek) {
      const firstDayOfPrevWeek = subWeeks(new Date(selectedWeek[0].date), 1);
      updateSelectedWeek(firstDayOfPrevWeek);
    }
  };

  const handleNextWeek = () => {
    if (selectedWeek) {
      const firstDayOfNextWeek = addWeeks(new Date(selectedWeek[0].date), 1);
      updateSelectedWeek(firstDayOfNextWeek);
    }
  };

  const handleCancel = () => {
    const resetRows = contentRows.map((row) => ({
      dayHours: [0, 0, 0, 0, 0, 0, 0],
      commenttext: ["", "", "", "", "", "", ""],
      selectProject: "Select Project",
      projectId: "",
      selectedPayType: "regularhour",
    }));
    setContentRows(resetRows);
    setProjectValue(null);
  };

  // For the icon representing 'circle'
  const handleCircleIconClick = () => {
    handleAddNewRow("addnew");
  };

  // For the icon representing 'add'
  const handleAddIconClick = (rowIndex) => {
    const currentRow = contentRows[rowIndex];
  if (currentRow.selectedPayType !== "overtimehour") {
    handleAddNewRow("paytypeadd", rowIndex);
  }
    // handleAddNewRow("paytypeadd", rowIndex);
  };

  const handleTaskAddIconClick = (rowIndex) => {
    handleAddNewRow("taskadd", rowIndex);
  };

  const handleLeaveIconClick = () => {
    handleAddNewRow("addnewleave");
  };


  // Function to add a new row with the specified iconType
  const handleAddNewRow = (iconType, rowIndex) => {
    setContentRows((prevRows) => {
      const newRow = {
        iconType: iconType,
        dayHours: [0, 0, 0, 0, 0, 0, 0],
        commenttext: ["", "", "", "", "", "", ""],
        selectProject: rowIndex !== undefined ? prevRows[rowIndex].selectProject : "Select Project",
        projectId: rowIndex !== undefined ? prevRows[rowIndex].projectId : "",
        selectedPayType: "regularhour",
        selectTask: iconType === "taskadd" ? null : (rowIndex !== undefined ? prevRows[rowIndex].selectTask : null),
      };

      let updatedRows = [...prevRows];
      if (iconType === "taskadd") {
        // Find the last pay type row for this project or the project row itself
        let insertIndex = rowIndex;
        while (insertIndex < updatedRows.length &&
          updatedRows[insertIndex].selectProject === updatedRows[rowIndex].selectProject) {
          insertIndex++;
        }
        updatedRows.splice(insertIndex, 0, newRow);
      } else if (iconType === "paytypeadd") {
        updatedRows.splice(rowIndex + 1, 0, newRow);
      } else {
        updatedRows.push(newRow);
      }

      const finalRows = [
        ...updatedRows.filter(row => row.iconType !== "addnewleave"),
        ...updatedRows.filter(row => row.iconType === "addnewleave"),
      ];
   
      return finalRows;

      // return updatedRows;
    });
    // if (iconType === "taskadd") {
    //   // Find the last pay type row for this project or the project row itself
    //   let insertIndex = rowIndex;
    //   while (insertIndex < updatedRows.length &&
    //     updatedRows[insertIndex].selectProject === updatedRows[rowIndex].selectProject &&
    //     updatedRows[insertIndex].iconType !== "addnew") {
    //     insertIndex++;
    //   }
    //   updatedRows.splice(insertIndex, 0, newRow);
    // } else if (iconType === "paytypeadd") {
    //   updatedRows.splice(rowIndex + 1, 0, newRow);
    // } else {
    //   updatedRows.push(newRow);
    // }

    // Update selectedTasks if necessary
    if (iconType === "taskadd") {
      setSelectedTasks(prevSelectedTasks => {
        const newSelectedTasks = { ...prevSelectedTasks };
        for (let i = contentRows.length; i > rowIndex; i--) {
          newSelectedTasks[i] = newSelectedTasks[i - 1];
        }
        newSelectedTasks[rowIndex + 1] = null;
        return newSelectedTasks;
      });
    }
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...contentRows];
    updatedRows.splice(index, 1);
    setContentRows(updatedRows);

    setSelectedTasks((prevSelectedTasks) => {
      const newSelectedTasks = { ...prevSelectedTasks };
      delete newSelectedTasks[index];
      // Shift all tasks after the deleted row
      for (let i = index; i < contentRows.length - 1; i++) {
        newSelectedTasks[i] = newSelectedTasks[i + 1];
      }
      delete newSelectedTasks[contentRows.length - 1];
      return newSelectedTasks;
    });
  };
  // };

  const handleDayHoursChange = (event, rowIndex, dayIndex) => {
    const updatedRows = [...contentRows];
    updatedRows[rowIndex].dayHours[dayIndex] =
      parseFloat(event.target.value) || 0;
    setContentRows(updatedRows);
  };
  const handleDayHoursFocus = (rowIndex, dayIndex) => {
    const updatedRows = [...contentRows];

    // Clear the input if the current value is 0
    if (updatedRows[rowIndex].dayHours[dayIndex] === 0) {
      updatedRows[rowIndex].dayHours[dayIndex] = '';
      setContentRows(updatedRows);
    }
  };

  // const handleDayHoursChange = (event, rowIndex, dayIndex) => {
  //   const updatedRows = [...contentRows];
  //   const inputValue = event.target.value || 0;

  //   // Update with the new input value
  //   updatedRows[rowIndex].dayHours[dayIndex] = inputValue;
  //   setContentRows(updatedRows);
  // };

  const handleDayHoursBlur = (rowIndex, dayIndex) => {
    const updatedRows = [...contentRows];

    // If the input is empty after blur, reset it to 0
    if (updatedRows[rowIndex].dayHours[dayIndex] === '') {
      updatedRows[rowIndex].dayHours[dayIndex] = 0;
      setContentRows(updatedRows);
    }
  };



  const handleCommentChange = (event, rowIndex, dayIndex) => {
    const updatedRows = [...contentRows];
    const inputValue = event.target.value;
    updatedRows[rowIndex].commenttext[dayIndex] = inputValue.split("\n");
    //updatedRows[rowIndex].commenttext[dayIndex] = event.target.value || "";
    setContentRows(updatedRows);
  };

  // const handleTaskChange = (selectedOption, rowIndex) => {
  //   setContentRows((prevRows) => {
  //     const updatedRows = [...prevRows];
  //     updatedRows[rowIndex] = {
  //       ...updatedRows[rowIndex],
  //       selectTask: selectedOption,
  //     };
  //     return updatedRows;
  //   });

  // const handleProjectChange = (selectedOption, index) => {
  //   const updatedRows = [...contentRows];
  //   updatedRows[index].selectProject = selectedOption;
  //   setContentRows(updatedRows);
  //   console.log("Updated contentRows after project change:", updatedRows);
  // };

  const handleProjectChange = (selectedOption, rowIndex) => {
    if (selectedOption) {
      const updatedRows = [...contentRows];
      updatedRows[rowIndex].selectProject = selectedOption;
      updatedRows[rowIndex].selectTask = null; // Reset the selectTask value
      setContentRows(updatedRows);

      // Clear the selected task for this row
      setSelectedTasks(prevSelectedTasks => {
        const newSelectedTasks = { ...prevSelectedTasks };
        delete newSelectedTasks[rowIndex];
        return newSelectedTasks;
      });
    }
  };

  const handleTaskChange = (selectedOption, rowIndex) => {
    setContentRows(prevRows => {
      const updatedRows = [...prevRows];
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        selectTask: selectedOption
      };
      return updatedRows;
    });

    setSelectedTasks(prevSelectedTasks => ({
      ...prevSelectedTasks,
      [rowIndex]: selectedOption ? selectedOption.value : null
    }));
  };

  // const handleTaskChange = (selectedOption, rowIndex) => {
  //   setContentRows((prevRows) => {
  //     const updatedRows = [...prevRows];
  //     updatedRows[rowIndex] = {
  //       ...updatedRows[rowIndex],
  //       selectTask: selectedOption,
  //     };
  //     return updatedRows;
  //   });
  // }

  // const handleTaskChange = (selectedOption, index) => {
  //   const updatedRows = [...contentRows];
  //   updatedRows[index].selectTask = selectedOption;
  //   setContentRows(updatedRows);
  //   console.log("Updated contentRows after task change:", updatedRows);
  // };

  //   const handleTaskChange = (selectedOption, rowIndex) => {
  //   setContentRows(prevRows => {
  //     const updatedRows = [...prevRows];
  //     updatedRows[rowIndex] = {
  //       ...updatedRows[rowIndex],
  //       selectTask: selectedOption
  //     };
  //     return updatedRows;
  //   });

  //   setSelectedTasks(prevSelectedTasks => ({
  //     ...prevSelectedTasks,
  //     [rowIndex]: selectedOption ? selectedOption.value : null
  //   }));
  // };

  const handlePayTypeChange = (selectedOption, rowIndex) => {
    if (selectedOption) {
      const updatedRows = [...contentRows];
      updatedRows[rowIndex].selectedPayType = selectedOption || "regularhour"; // Set selected pay type
      setContentRows(updatedRows);
      // setSelectedPayType(selectedOption);
    } else {
      // Handle case when no option is selected
    }
  };

  const handleLeaveTypeChange = (selectedOption, rowIndex) => {
    if (selectedOption) {
      const updatedRows = [...contentRows];
      updatedRows[rowIndex].selectedLeaveType = selectedOption || "paidtimeoff"; // Set selected pay type
      setContentRows(updatedRows);
      // setSelectedPayType(selectedOption);
    } else {
      // Handle case when no option is selected
    }
  };

  // const calculateTotalHours = (dayHours) => {
  //   return dayHours.reduce((total, hours) => total + hours);
  // };
  const calculateTotalHours = (dayHours) => {
    return dayHours.reduce((total, hours) => {
      // Ensure each `hours` is converted to a number
      return total + parseFloat(hours || 0);
    }, 0); // Start with a total of 0
  };



  const calculateOverallTotalHours = () => {
    return contentRows.reduce(
      (total, row) => total + calculateTotalHours(row.dayHours),
      0
    );
  };

  const calculatedayHourstotal = (dayIndex) => {
    let totaldayHours = 0;
    contentRows.forEach((row) => {
      totaldayHours += row.dayHours[dayIndex];
    });
    return totaldayHours;
  };

  // const calculateRegularHours = (dayIndex) => {
  //   return contentRows.reduce(
  //     (total, row) =>
  //       total +
  //       (row.selectedPayType === "regularhour" ? row.dayHours[dayIndex] : 0),
  //     0
  //   );
  // };
  const calculateRegularHours = (dayIndex) => {
    return contentRows.reduce(
      (total, row) =>
        total + (row.selectedPayType === "regularhour" ? parseFloat(row.dayHours[dayIndex]) || 0 : 0),
      0
    );
  };



  const calculateOvertimeHours = (dayIndex) => {
    return contentRows.reduce(
      (total, row) =>
        total + (row.selectedPayType === "overtimehour" ? parseFloat(row.dayHours[dayIndex]) || 0 : 0),
      0
    );
  };

  const calculateTotalRegularHours = () => {
    let totalRegularHours = 0;
    selectedWeek.forEach((day, dayIndex) => {
      totalRegularHours += calculateRegularHours(dayIndex);
    });
    return totalRegularHours;
  };

  const calculateTotalOvertimeHours = () => {
    let totalRegularHours = 0;
    selectedWeek.forEach((day, dayIndex) => {
      totalRegularHours += calculateOvertimeHours(dayIndex);
    });
    return totalRegularHours;
  };

  const getWeekLabel = (selectedWeek) => {
    if (selectedWeek) {
      const currentWeek = getWeekDates(
        startOfWeek(new Date(), { weekStartsOn: 1 })
      );
      const prevWeek = getWeekDates(
        subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)
      );
      const nextWeek = getWeekDates(
        addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)
      );

      if (selectedWeek[0].date === currentWeek[0].date) {
        return "This Week";
      } else if (selectedWeek[0].date === prevWeek[0].date) {
        return "Previous Week";
      } else if (selectedWeek[0].date === nextWeek[0].date) {
        return "Next Week";
      }
    }
    return "";
  };

  const CustomDatePickerInput = ({ value, onClick }) => {
    return (
      <div className="custom-date-picker-input">
        <div
          className={`ms-3 me-2 cursor-pointer  ${isViewModeTimesheet ? 'custom-date-picker-input-arrow-disable' : 'custom-date-picker-input-arrow'}`}
          onClick={isViewModeTimesheet ? null : handlePrevWeek}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M14 7L9 12L14 17"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div className="d-flex cursor-pointer" onClick={isViewModeTimesheet ? null : onClick}>
          <div className=" custom-date-picker-input-icon me-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M14 22H10C6.229 22 4.343 22 3.172 20.828C2 19.657 2 17.771 2 14V12C2 8.229 2 6.343 3.172 5.172C4.343 4 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C22 6.343 22 8.229 22 12V14C22 17.771 22 19.657 20.828 20.828C20.175 21.482 19.3 21.771 18 21.898M7 4V2.5M17 4V2.5M21.5 9H10.75M2 9H5.875"
                stroke="black"
                stroke-opacity="0.6"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18C16.7348 18 16.4804 17.8946 16.2929 17.7071C16.1054 17.5196 16 17.2652 16 17C16 16.7348 16.1054 16.4804 16.2929 16.2929C16.4804 16.1054 16.7348 16 17 16C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17ZM18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14C16.7348 14 16.4804 13.8946 16.2929 13.7071C16.1054 13.5196 16 13.2652 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM8 17C8 17.2652 7.89464 17.5196 7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18C6.73478 18 6.48043 17.8946 6.29289 17.7071C6.10536 17.5196 6 17.2652 6 17C6 16.7348 6.10536 16.4804 6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17ZM8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13Z"
                fill="black"
                fill-opacity="0.6"
              />
            </svg>
          </div>
          <div>
            {getWeekLabel(selectedWeek) ||
              `${selectedWeek
                ? format(new Date(selectedWeek[0].date), "MM/dd/yyyy")
                : ""
              } - ${selectedWeek
                ? format(new Date(selectedWeek[6].date), "MM/dd/yyyy")
                : ""
              }`}
          </div>
          {/* {value} */}
        </div>
        <div
          className={`ms-3 me-2 cursor-pointer  ${isViewModeTimesheet ? 'custom-date-picker-input-arrow-disable' : 'custom-date-picker-input-arrow'}`}
          onClick={isViewModeTimesheet ? null : handleNextWeek}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M10 7L15 12L10 17"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    );
  };

  const isWeekend = (dayIndex) => {
    const day = new Date(selectedWeek[dayIndex].date).getDay();
    return day === 0 || day === 6; // Sunday is 0, Saturday is 6
  };

  // const explainationcodeandvalue = [
  //     { label: 'Leave ( Correct Leave Only )', value: 'leave-correct-leave-only' },
  //     { label: 'Project  ( Correct Project Only )', value: 'project-correct-project-only' },
  //     { label: 'Task ( Correct Task Only )', value: 'task-correct-task-only' },
  //     { label: 'Pay Type ( Correct Pay Type Only )', value: 'paytype-correct-paytype-only' },
  //     { label: 'GLC ( Correct GLC Only )', value: 'GLC-correct-GLC-only' },
  //     { label: 'PLC ( Correct PLC Only )', value: 'PLC-correct-PLC-only' },
  //     { label: 'HRS ( Change in Hours Only )', value: 'HRS-Change-in-Hours-Only' },
  //     { label: 'Comments ( Change Comments Only )', value: 'comment-change-comments-only' },
  //     ];
  const explainationcodeandvalue = [
    {
      code: "Leave",
      content: "Correct Leave Only",
      codecontent: "Leave ( Correct Leave Only )",
    },
    {
      code: "Project",
      content: "Correct Project Only",
      codecontent: "Project ( Correct Project Only )",
    },
    {
      code: "Task",
      content: "Correct Task Only",
      codecontent: "Task ( Correct Task Only )",
    },
    {
      code: "Pay Type",
      content: "Correct Pay Type Only",
      codecontent: "Pay Type ( Correct Pay Type Only )",
    },
    {
      code: "GLC",
      content: "Correct GLC Only",
      codecontent: "GLC ( Correct GLC Only )",
    },
    {
      code: "PLC",
      content: "Correct PLC Only",
      codecontent: "PLC ( Correct PLC Only )",
    },
    {
      code: "HRS",
      content: "Change in Hours Only",
      codecontent: "HRS ( Change in Hours Only )",
    },
    {
      code: "Comments",
      content: "Change Comments Only",
      codecontent: "Comments ( Change Comments Only )",
    },
  ];

  const explainationcodeandvalueoptions = explainationcodeandvalue.map(
    (item) => ({
      value: item.code,
      label: item.codecontent,
    })
  );
  const [selectedexplainationCode, setSelectedexplainationCode] =
    useState(null);
  const [explainationcontent, setexplainationContent] = useState("");
  const handleSelectexplainationcontentChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedexplainationCode(selectedOption.value);
      const selectedContent =
        explainationcodeandvalue.find(
          (item) => item.code === selectedOption.value
        )?.content || "";
      setexplainationContent(selectedContent);
    } else {
      setSelectedexplainationCode(null);
      setexplainationContent("");
    }
  };

  // const [explanationContent, setExplanationContent] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState("");
  // const handleExplanationChange = (e) => setExplanationContent(e.target.value);
  const handleAdditionalInfoChange = (e) =>
    setAdditionalInformation(e.target.value);
  const isSubmitEnabled =
    additionalInformation.trim() !== "" || selectedexplainationCode !== null;

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
      <Tooltip
        id="sign-revision-button-tooltip"
        place="top"
        effect="solid"
        //   delayShow={300}
        // disabled={!!isSubmitEnabled}
        style={{
          backgroundColor: "#787DBD",
          color: "#fff",
        }}
      />
      <div>
        <Topbar locale={locale} setLocale={setLocale} />
        <div className="d-flex">
          <Sidebar locale={locale} setLocale={setLocale} />
          <div
            className="container "
            style={{ overflow: "auto", maxHeight: "calc(100vh - 50px)" }}
          >
            <div className="back-button-icon-timesheet d-flex ms-4 mt-4 mb-3">
              <Link to={"/timesheet"} style={{ textDecoration: "none" }}>
                {/* <FontAwesomeIcon icon={faCircleArrowLeft} className="back-button-icon-timesheet-i" /> */}
                <div className="back-button-icon-timesheet-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                  >
                    <path
                      d="M4.99992 12.5L4.11617 13.3838L3.23242 12.5L4.11617 11.6163L4.99992 12.5ZM26.2499 22.5C26.2499 22.8315 26.1182 23.1495 25.8838 23.3839C25.6494 23.6183 25.3314 23.75 24.9999 23.75C24.6684 23.75 24.3505 23.6183 24.116 23.3839C23.8816 23.1495 23.7499 22.8315 23.7499 22.5H26.2499ZM10.3662 19.6338L4.11617 13.3838L5.88367 11.6163L12.1337 17.8663L10.3662 19.6338ZM4.11617 11.6163L10.3662 5.36627L12.1337 7.13377L5.88367 13.3838L4.11617 11.6163ZM4.99992 11.25H17.4999V13.75H4.99992V11.25ZM26.2499 20V22.5H23.7499V20H26.2499ZM17.4999 11.25C19.8206 11.25 22.0462 12.1719 23.6871 13.8128C25.328 15.4538 26.2499 17.6794 26.2499 20H23.7499C23.7499 18.3424 23.0914 16.7527 21.9193 15.5806C20.7472 14.4085 19.1575 13.75 17.4999 13.75V11.25Z"
                      fill="black"
                      fill-opacity="0.6"
                    />
                  </svg>
                </div>
              </Link>
              <p className="back-button-icon-timesheet-p">Timesheet</p>
            </div>
            <div className="employee-week-details ">
              <div className="row container employee-details-week-timesheet d-flex justify-content-between">
                <div className="employee-name-timesheet-week p-2 pt-3 col-auto">
                  <label className="employee-name-timesheet-week-label mb-2">
                    Employee Name
                  </label>
                  <div className="employee-name-timesheet-week-box-input">
                    <input
                      className="emp-weekly"
                      autoComplete="off"
                      type="text"
                      id="projectname"
                      value={userProfile.firstname}
                      onChange={(e) => setempname(e.target.value)}
                    />
                  </div>{" "}
                </div>
                <div className="employee-ID-timesheet-week p-2 pt-3 col-auto">
                  <label className="employee-ID-timesheet-week-label mb-2">
                    Employee ID
                  </label>
                  <div className="employee-ID-timesheet-week-box-input">
                    <input
                      className="emp-weekly"
                      autoComplete="off"
                      type="text"
                      id="projectname"
                      value={userProfile.employeesid}
                    />
                  </div>
                </div>
                <div className="employee-status-timesheet-week p-2 pt-3 col-auto">
                  <label className="employee-status-timesheet-week-label mb-2">
                    Status
                  </label>
                  <div className="employee-status-timesheet-week-box-input">
                    {timesheetStatusvalue}
                  </div>
                </div>
                <div className="employee-current-date-timesheet-week p-2 pt-3 col-auto">
                  <label className="employee-current-date-timesheet-week-label mb-2">
                    Current Time and Date
                  </label>
                  <div className="employee-current-date-timesheet-week-box-input d-flex justify-content-between">
                    {/* {formattedDate} */}
                    {formatDate(currentDateTime)}
                    <div className="pe-3 employee-current-date-timesheet-week-box-input-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M14 22H10C6.229 22 4.343 22 3.172 20.828C2 19.657 2 17.771 2 14V12C2 8.229 2 6.343 3.172 5.172C4.343 4 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C22 6.343 22 8.229 22 12V14C22 17.771 22 19.657 20.828 20.828C20.175 21.482 19.3 21.771 18 21.898M7 4V2.5M17 4V2.5M21.5 9H10.75M2 9H5.875"
                          stroke="black"
                          stroke-opacity="0.6"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18C16.7348 18 16.4804 17.8946 16.2929 17.7071C16.1054 17.5196 16 17.2652 16 17C16 16.7348 16.1054 16.4804 16.2929 16.2929C16.4804 16.1054 16.7348 16 17 16C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17ZM18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14C16.7348 14 16.4804 13.8946 16.2929 13.7071C16.1054 13.5196 16 13.2652 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM8 17C8 17.2652 7.89464 17.5196 7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18C6.73478 18 6.48043 17.8946 6.29289 17.7071C6.10536 17.5196 6 17.2652 6 17C6 16.7348 6.10536 16.4804 6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17ZM8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13Z"
                          fill="black"
                          fill-opacity="0.6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="employee-select-week-timesheet-calendar p-2 pt-3 col-auto">
                  <label className="employee-select-week-timesheet-calendar-label mb-2">
                    Select Date
                  </label>
                  <div className="employee-select-week-timesheet-calendar-box-input">
                    <DatePicker
                      className="timesheet-week-calendar-wrapper-date-picker"
                      selected={
                        selectedWeek ? new Date(selectedWeek[0].date) : null
                      }
                      onChange={handleWeekChange}
                      showWeekNumbers
                      dateFormat={`MM/dd/yyyy - ${selectedWeek
                        ? format(new Date(selectedWeek[6].date), "MM/dd/yyyy")
                        : ""
                        }`}
                      selectsStart
                      startDate={
                        selectedWeek ? new Date(selectedWeek[0].date) : null
                      }
                      endDate={
                        selectedWeek ? new Date(selectedWeek[6].date) : null
                      }
                      customInput={<CustomDatePickerInput />}
                      calendarStartDay={1}
                      disabled={isViewModeTimesheet}
                    />
                  </div>
                </div>
                {/* <div className="employee-reported-hours-timesheet-week p-2 pt-3 col-auto">
                  <label className="employee-reported-hours-timesheet-week-label pt-4">
                    Reported Hours
                  </label>
                  <div className="employee-reported-hours-timesheet-week-box-input">
                    {calculateOverallTotalHours()} Hrs
                  </div>
                </div> */}
                <div className="employee-timeoff-timesheet-week p-2 mt-5 col-auto">
                  <div className="button btn employee-timeoff-timesheet-week-button-btn d-flex align-items-center mt-2 ps-3 pe-3" onClick={isViewModeTimesheet ? null : handleLeaveIconClick} >
                    <div className="me-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clip-path="url(#clip0_91_284)">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.61904 6.49982C6.08746 7.02378 5.68115 7.66108 5.43047 8.36411C5.17978 9.06715 5.0912 9.81774 5.17134 10.5598C5.17665 10.6101 5.172 10.6609 5.15767 10.7093C5.14333 10.7578 5.1196 10.803 5.08781 10.8423C5.05603 10.8815 5.01681 10.9142 4.97241 10.9383C4.92801 10.9624 4.87929 10.9776 4.82904 10.9829C4.77878 10.9882 4.72797 10.9836 4.67951 10.9692C4.63105 10.9549 4.58589 10.9312 4.5466 10.8994C4.50732 10.8676 4.47468 10.8284 4.45054 10.784C4.42641 10.7396 4.41126 10.6908 4.40596 10.6406C4.31364 9.78343 4.41616 8.91649 4.70586 8.10451C4.99557 7.29253 5.46498 6.55649 6.07904 5.95136C8.33827 3.7229 11.9829 3.75905 14.219 6.02674C16.4552 8.29444 16.4406 11.9383 14.1806 14.1667C13.1343 15.1999 11.73 15.79 10.2598 15.8144C9.70391 15.8246 9.14946 15.7544 8.61365 15.606C8.51532 15.5788 8.43179 15.5138 8.38144 15.425C8.3311 15.3363 8.31806 15.2312 8.34519 15.1329C8.37232 15.0346 8.43741 14.951 8.52613 14.9007C8.61485 14.8503 8.71993 14.8373 8.81827 14.8644C9.28296 14.9932 9.76383 15.0541 10.246 15.0452C11.519 15.0252 12.7352 14.5143 13.6406 13.6191C15.5952 11.6914 15.6113 8.53444 13.6713 6.56674C11.7313 4.59905 8.57365 4.57213 6.61904 6.49982Z" fill="#FFFFF0" />
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.0725 11.0482C5.03886 11.0859 4.99813 11.1166 4.95263 11.1385C4.90714 11.1605 4.85776 11.1732 4.80733 11.1761C4.7569 11.179 4.70641 11.1718 4.65872 11.1552C4.61104 11.1385 4.5671 11.1126 4.52942 11.079L3.20635 9.90208C3.16567 9.86943 3.13207 9.82885 3.10757 9.7828C3.08307 9.73676 3.06819 9.68621 3.06384 9.63424C3.05949 9.58226 3.06575 9.52995 3.08225 9.48047C3.09875 9.43099 3.12514 9.38539 3.15982 9.34643C3.1945 9.30747 3.23673 9.27597 3.28397 9.25385C3.3312 9.23172 3.38243 9.21944 3.43456 9.21773C3.48669 9.21603 3.53862 9.22495 3.58719 9.24395C3.63577 9.26294 3.67997 9.29162 3.71712 9.32823L5.04019 10.5052C5.07798 10.5387 5.10879 10.5793 5.13087 10.6248C5.15295 10.6702 5.16585 10.7196 5.16885 10.77C5.17185 10.8204 5.16489 10.871 5.14836 10.9187C5.13182 10.9664 5.10605 11.0105 5.0725 11.0482Z" fill="#FFFFF0" />
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.47732 10.9999C4.50762 11.0403 4.54559 11.0744 4.58905 11.1001C4.63251 11.1258 4.68061 11.1428 4.73061 11.1499C4.78062 11.157 4.83153 11.1543 4.88046 11.1417C4.92939 11.1292 4.97537 11.1072 5.01578 11.0768L6.55424 9.923C6.59465 9.8927 6.62869 9.85473 6.65442 9.81127C6.68015 9.76781 6.69708 9.7197 6.70422 9.6697C6.71136 9.6197 6.70859 9.56878 6.69605 9.51986C6.68352 9.47093 6.66147 9.42495 6.63116 9.38454C6.60086 9.34413 6.56289 9.31009 6.51943 9.28436C6.47597 9.25862 6.42786 9.2417 6.37786 9.23456C6.32786 9.22742 6.27694 9.23019 6.22801 9.24273C6.17909 9.25526 6.13311 9.27731 6.0927 9.30762L4.55424 10.4615C4.47263 10.5227 4.41868 10.6138 4.40426 10.7148C4.38983 10.8157 4.41611 10.9183 4.47732 10.9999ZM10.0004 7.30762C10.1024 7.30762 10.2002 7.34814 10.2724 7.42027C10.3445 7.4924 10.385 7.59023 10.385 7.69223V10.3845C10.385 10.4865 10.3445 10.5844 10.2724 10.6565C10.2002 10.7286 10.1024 10.7692 10.0004 10.7692C9.89839 10.7692 9.80056 10.7286 9.72843 10.6565C9.6563 10.5844 9.61578 10.4865 9.61578 10.3845V7.69223C9.61578 7.59023 9.6563 7.4924 9.72843 7.42027C9.80056 7.34814 9.89839 7.30762 10.0004 7.30762Z" fill="#FFFFF0" />
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.6922 10.3844C12.6922 10.4864 12.6516 10.5842 12.5795 10.6563C12.5074 10.7285 12.4095 10.769 12.3075 10.769H9.99985C9.89784 10.769 9.80001 10.7285 9.72789 10.6563C9.65576 10.5842 9.61523 10.4864 9.61523 10.3844C9.61523 10.2824 9.65576 10.1845 9.72789 10.1124C9.80001 10.0403 9.89784 9.99976 9.99985 9.99976H12.3075C12.4095 9.99976 12.5074 10.0403 12.5795 10.1124C12.6516 10.1845 12.6922 10.2824 12.6922 10.3844Z" fill="#FFFFF0" />
                          <path d="M3.19188 3.75223C3.11772 3.67797 3.0761 3.57729 3.07617 3.47234C3.07624 3.36739 3.118 3.26677 3.19226 3.19261C3.26652 3.11845 3.3672 3.07683 3.47215 3.0769C3.5771 3.07698 3.67772 3.11874 3.75188 3.193L16.8065 16.2476C16.8807 16.3218 16.9223 16.4224 16.9223 16.5272C16.9223 16.6321 16.8807 16.7327 16.8065 16.8068C16.7323 16.881 16.6318 16.9227 16.5269 16.9227C16.422 16.9227 16.3214 16.881 16.2473 16.8068L3.19188 3.75223Z" fill="#F9F9F9" />
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0002 18.8461C14.8855 18.8461 18.8463 14.8853 18.8463 9.99991C18.8463 5.11452 14.8855 1.15375 10.0002 1.15375C5.11477 1.15375 1.154 5.11452 1.154 9.99991C1.154 14.8853 5.11477 18.8461 10.0002 18.8461ZM10.0002 19.6153C15.3109 19.6153 19.6155 15.3107 19.6155 9.99991C19.6155 4.68914 15.3109 0.384521 10.0002 0.384521C4.68938 0.384521 0.384766 4.68914 0.384766 9.99991C0.384766 15.3107 4.68938 19.6153 10.0002 19.6153Z" fill="#F9F9F9" />
                        </g>
                        <defs>
                          <clipPath id="clip0_91_284">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="employee-timeoff-timesheet-week-button-btn-div">Time Off</div>
                  </div>

                </div>
              </div>
              <div className="employee-add-entries-details-week-timesheet">
                <table class="table table-borderless custom-table ">
                  <thead>
                    <tr className="employee-add-entries-details-week-timesheet-table-head">
                      <th
                        scope="col"
                        className="custom-table-header-week-timesheet-entries-project"
                      >
                        Project Name
                      </th>
                      <th
                        scope="col"
                        className="custom-table-header-week-timesheet-entries-task"
                      >
                        Task Name
                      </th>
                      <th
                        scope="col"
                        className="custom-table-header-week-timesheet-entries"
                      >
                        Pay type
                      </th>
                      {selectedWeek.map((day, dayIndex) => (
                        <th
                          key={day.date}
                          className={`add-day-${dayIndex + 1}`}
                          style={{
                            whiteSpace: "nowrap",
                            fontSize: "13.5px",
                            paddingTop: "20px",
                            paddingBottom: "20px",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            alignItems: "center",
                            textAlign: "center",
                            fontWeight: "500",
                            backgroundColor: "#787DBD",
                            color: isWeekend(dayIndex) ? "#FFFFFF80" : "white",
                          }}
                        >
                          <div>
                            <label
                              className="timesheet-add-hours-box-label"
                              htmlFor={`working-hours-${dayIndex + 1}`}
                            >
                              <div>{`${format(
                                new Date(day.date),
                                "EEE"
                              )}`}</div>
                              <div>{`${format(
                                new Date(day.date),
                                "MMM dd"
                              )}`}</div>
                            </label>
                          </div>
                        </th>
                      ))}
                      <th
                        scope="col"
                        className="custom-table-header-week-timesheet-entries"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="custom-table-header-week-timesheet-entries"
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentRows.map((row, index) => (
                      <tr key={index}>
                        {row.iconType !== "paytypeadd" &&
                          row.iconType !== "taskadd" && row.iconType !== "addnewleave" ? (
                          <td className="custom-table-body-week-timesheet-entries">
                            <div className="d-flex">
                              <div
                                className="timesheet-weekly-add-new-work-hours ms-3"
                                id={`timesheet-weekly-add-new-work-hours-${index}`}
                              >
                                {!isViewModeTimesheet && (
                                  <div
                                    className="timesheet-weekly-add-new-work-hours-icon mt-2"
                                    onClick={handleCircleIconClick}
                                  >
                                    {/* <label htmlFor="timesheet-weekly-add-new-work-hours-icon-display-box" className="timesheet-weekly-add-new-work-hours-icon-display-label"></label> */}
                                    <IoMdAddCircleOutline
                                      style={{
                                        fontSize: "22px",
                                        color: "rgba(0, 0, 0, 0.50)",
                                        // backgroundColor: "#EEECEC ",
                                        marginTop: "16px",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                              <div>
                                <ReactSelect
                                  className="timesheet-week-select-project-id-display-label me-2"
                                  value={row.selectProject}
                                  onChange={(selectedOption) =>
                                    handleProjectChange(selectedOption, index)
                                  }
                                  id={`timesheet-week-select-project-id-display-label-${index + 1
                                    }`}
                                  options={
                                    Array.isArray(Project)
                                      ? Project.map((project) => ({
                                        key: project.projectId,
                                        value: project.projectName,
                                        label: project.projectName,
                                      }))
                                      : []
                                  }
                                  placeholder="Select Project"
                                  isDisabled={isViewModeTimesheet}
                                />
                              </div>
                            </div>
                          </td>
                        ) : row.iconType === "addnewleave" ? (
                          <td className="custom-table-body-week-timesheet-entries">
                            <div className="add-new-leave-content ms-4">
                            <ReactSelect
                                  className="timesheet-weekly-leave-type-select ms-2"
                                  value={row.selectProject}
                                  onChange={(selectedOption) =>
                                    handleProjectChange(selectedOption, index)
                                  }
                                  id={`timesheet-weekly-leave-type-select-${index + 1
                                    }`}
                                  options={
                                    Array.isArray(Project)
                                      ? Project.map((project) => ({
                                        key: project.projectId,
                                        value: project.projectName,
                                        label: project.projectName,
                                      }))
                                      : []
                                  }
                                  placeholder="Select Leave"
                                  isDisabled={isViewModeTimesheet}
                                />
                              {/* <select
                                class="form-select timesheet-weekly-leave-type-select me-2"
                                id={`timesheet-weekly-leave-type-select-${index}`}
                                onChange={(e) =>
                                  handleLeaveTypeChange(e.target.value, index)
                                }
                                value={row.selectedLeaveType}
                              >
                                <option value="paidtimeoff">Paid time off</option>
                                <option value="unpaidtimeoff">Unpaid time off</option>
                              </select> */}
                            </div>
                          </td>
                        ) : (
                          <td className="custom-table-body-week-timesheet-entries"></td>
                        )}
                        {row.iconType !== "paytypeadd" && row.iconType !== "addnewleave" ? (
                          <td className="custom-table-body-week-timesheet-entries">
                            <div className="d-flex">
                              {!isViewModeTimesheet && (
                                <div
                                  className="timesheet-weekly-add-new-task-icon mt-2 me-1"
                                  // onClick={() => handleTaskAddIconClick(index)}
                                  onClick={() => handleAddNewRow("taskadd", index)}
                                >
                                  <IoMdAddCircleOutline
                                    style={{
                                      fontSize: "22px",
                                      color: "rgba(0, 0, 0, 0.50)",
                                      // backgroundColor: "#EEECEC ",
                                      marginTop: "16px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </div>
                              )}
                              <div>
                                <ReactSelect
                                  className="timesheet-week-select-task-id-display-label me-2"
                                  value={row.selectTask}
                                  onChange={(selectedOption) =>
                                    handleTaskChange(selectedOption, index)
                                  }
                                  id={`timesheet-week-select-task-id-display-label-${index + 1
                                    }`}
                                  options={
                                    row.selectProject && Array.isArray(Project)
                                      ? Project.find(
                                        (project) =>
                                          project.projectName ===
                                          (typeof row.selectProject ===
                                            "object"
                                            ? row.selectProject.value
                                            : row.selectProject)
                                      )
                                        ?.tasks?.filter(
                                          (task) =>
                                            !Object.values(
                                              selectedTasks
                                            ).includes(task.taskname) ||
                                            selectedTasks[index] ===
                                            task.taskname
                                        )
                                        .map((task) => ({
                                          key: task.taskid,
                                          value: task.taskname,
                                          label: task.taskname,
                                        })) || []
                                      : []
                                  }
                                  placeholder="Select Task"
                                  isDisabled={isViewModeTimesheet}
                                />{" "}
                              </div>
                            </div>
                          </td>
                        ) : (
                          <td className="custom-table-body-week-timesheet-entries"></td>
                        )}
                        {row.iconType !== "addnewleave" ? (
                          <td className="custom-table-body-week-timesheet-entries">
                            <div className="d-flex flex-row">
                              {!isViewModeTimesheet && (
                                <div
                                  className="timesheet-weekly-add-new-pay-type-icon"
                                  id={`timesheet-weekly-add-new-pay-type-icon-${index}`}
                                  // onClick={handleAddIconClick(index)}
                                  // onClick={() => handleAddIconClick(index)}
                                  onClick={() => handleAddIconClick(index)}
                                  style={{
                                    cursor: row.selectedPayType === "overtimehour" ? "not-allowed" : "pointer",
                                    opacity: row.selectedPayType === "overtimehour" ? 0.5 : 1,
                                  }}
                                >
                                  <IoMdAddCircleOutline
                                    style={{
                                      fontSize: "22px",
                                      color: "rgba(0, 0, 0, 0.50)",
                                      marginTop: "20px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </div>
                              )}
                              <div class="timesheet-weekly-pay-type-select-custom-dropdown">
                                <select
                                  class="form-select timesheet-weekly-pay-type-select"
                                  id={`timesheet-weekly-pay-type-select-${index}`}
                                  onChange={(e) =>
                                    handlePayTypeChange(e.target.value, index)
                                  }
                                  value={row.selectedPayType}
                                  disabled={isViewModeTimesheet}
                                >
                                  <option value="regularhour">R</option>
                                  <option value="overtimehour">OT</option>

                                </select>
                              </div>
                            </div>
                          </td>
                        
                        ) : row.iconType === "addnewleave" ? (
                          <td className="custom-table-body-week-timesheet-entries">
                            <div className="add-new-leave-content-paytype">
                            <select
                                  class="form-select timesheet-weekly-pay-type-select"
                                  id={`timesheet-weekly-pay-type-select-${index}`}
                                  onChange={(e) =>
                                    handlePayTypeChange(e.target.value, index)
                                  }
                                  value={row.selectedPayType}
                                  disabled={isViewModeTimesheet}
                                >
                                  <option value="regularhour">R</option>
                                  <option value="overtimehour">OT</option>

                                </select>
                            </div>
                          </td>
                        ) : (
                          <td className="custom-table-body-week-timesheet-entries"></td>
                        )}

                        {selectedWeek.map((day, dayIndex) => (
                          <td
                            key={day.date}
                            className="custom-table-body-week-timesheet-entries"
                          >
                            <div className="timesheet-weekly-add-hours-box d-flex flex-row">
                              <input
                                className="timesheet-weekly-add-hours-box-show"
                                type="number"
                                id={`working-hours-weekly-timesheet-${dayIndex + 1
                                  }`}
                                onChange={(event) => isViewModeTimesheet ? null : handleDayHoursChange(event, index, dayIndex)}

                                onClick={() => isViewModeTimesheet ? null : handleInputClick(index, dayIndex)}
                                // onClick={() =>
                                //   handleInputClick(index, dayIndex)
                                // }
                                onMouseEnter={() =>
                                  handleInputClick(index, dayIndex)
                                }
                                value={contentRows[index].dayHours[dayIndex]}

                                onFocus={() => isViewModeTimesheet ? null : handleDayHoursFocus(index, dayIndex)}
                                // onFocus={() => handleDayHoursFocus(index, dayIndex)}

                                onBlur={() => handleDayHoursBlur(index, dayIndex)}

                                style={{
                                  color: isWeekend(dayIndex)
                                    ? "#00000050"
                                    : "#00000080",
                                }}

                              />
                              {clickedInputIndex === dayIndex &&
                                clickedRowIndex === index && (
                                  <div className="timesheet-weekly-add-hours-box-show-icon">
                                    <FaRegCommentDots
                                      style={{
                                        fontSize: "20px",
                                        marginTop: "9px",
                                        color: isWeekend(dayIndex)
                                          ? "#00000050"
                                          : "#00000080",
                                        cursor: "pointer",
                                      }}
                                      className="timesheet-weekly-enter-commend-box "
                                      data-bs-toggle="modal"
                                      data-bs-target={`#commentpopupModal-${index}-${dayIndex + 1
                                        }`}
                                      data-tooltip-id="my-tooltip-comment"
                                      data-tooltip-content={
                                        contentRows[index].commenttext[
                                        dayIndex
                                        ] || "No comments"
                                      }
                                    />

                                    {/* popup comment box start*/}
                                    <div
                                      class="modal commentpopupModal-timesheet-weekly"
                                      id={`commentpopupModal-${index}-${dayIndex + 1
                                        }`}
                                      tabindex="-1"
                                      aria-labelledby="commentpopupModalLabel"
                                      aria-hidden="true"
                                    >
                                      <div class="modal-dialog modal-dialog-centered search-weekly">
                                        <div class="modal-content timesheet-weekly-comment-text-model">
                                          <div class="modal-body">
                                            <div>
                                              <div className="d-flex justify-content-between">
                                                <div
                                                  className="modal-title d-flex flex-row"
                                                  id="commentpopupModalLabel"
                                                >
                                                  <h5 className="timesheet-weekly-comment-text-model-title-name mt-2">
                                                    Submission Date &nbsp; -
                                                    &nbsp; &nbsp;
                                                  </h5>
                                                  <h5 className="timesheet-weekly-comment-text-model-title-date mt-2">
                                                    {" "}
                                                    {`${format(
                                                      new Date(day.date),
                                                      "EEE MMM dd"
                                                    )} - ${new Date(
                                                      day.date
                                                    ).getFullYear()}`}
                                                  </h5>
                                                </div>
                                                <div
                                                  className="timesheet-weekly-comment-text-model-title-close-icon"
                                                  data-bs-dismiss="modal"
                                                  aria-label="Close"
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                  >
                                                    <path
                                                      d="M4 12L12 4M12 12L4 4"
                                                      stroke="#F8F8F8"
                                                      stroke-width="2"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                    />
                                                  </svg>
                                                </div>
                                              </div>
                                              <div className="timesheet-weekly-comment-text-model-title-emptyline"></div>
                                              <textarea
                                                id={`timesheet-weekly-comment-textarea-${dayIndex + 1
                                                  }`}
                                                className="timesheet-weekly-comment-textarea-name"
                                                rows="4"
                                                placeholder="Leave a comment for Authorizer..."
                                                value={
                                                  contentRows[index]
                                                    .commenttext[dayIndex]
                                                }
                                                onChange={(event) => isViewModeTimesheet ? null : handleCommentChange(event, index, dayIndex)}
                                              />
                                              <div className="d-flex justify-content-end">
                                                <button
                                                  type="button"
                                                  class="btn timesheet-weekly-comment-text-model-share-comment"
                                                  data-bs-dismiss="modal"
                                                >
                                                  Share Comment
                                                </button>
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
                        <td className="custom-table-body-week-timesheet-entries">
                          <div className="timesheet-weekly-add-total-hours-box">
                            {/* <label className="timesheet-add-total-hours-box-label" htmlFor="timesheet-add-total-hours-box-label" >{index === 0 ? "Total Hours" : null}</label> */}
                            <div>
                              <input
                                className="timesheet-weekly-add-total-hours-box-show"
                                type="text"
                                id="timesheet-weekly-add-total-hours-box-label"
                                value={calculateTotalHours(row.dayHours)}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="custom-table-body-week-timesheet-entries">
                          <div className="timesheet-weekly-add-new-work-hours-delete">
                            <div
                              className="timesheet-weekly-add-new-work-hours-icon-delete"
                              onClick={() => handleDeleteRow(index)}
                            >
                              {index !== 0 && (
                                <React.Fragment>
                                  <div className="timesheet-weekly-add-new-work-hours-icon-display-delete-icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14"
                                      height="16"
                                      viewBox="0 0 14 16"
                                      fill="none"
                                    >
                                      <path
                                        d="M1.71112 5.6904L2.59192 14.4168C2.64072 14.7856 4.42152 15.9984 6.99992 16C9.57992 15.9984 11.3607 14.7856 11.4087 14.4168L12.2903 5.6904C10.9431 6.444 8.92952 6.8 6.99992 6.8C5.07192 6.8 3.05752 6.444 1.71112 5.6904ZM9.53432 1.208L8.84712 0.4472C8.58152 0.0688 8.29352 0 7.73272 0H6.26792C5.70792 0 5.41912 0.0688 5.15432 0.4472L4.46712 1.208C2.41112 1.5672 0.919922 2.52 0.919922 3.2232V3.3592C0.919922 4.5968 3.64232 5.6 6.99992 5.6C10.3583 5.6 13.0807 4.5968 13.0807 3.3592V3.2232C13.0807 2.52 11.5903 1.5672 9.53432 1.208ZM8.65592 3.472L7.79992 2.4H6.19992L5.34552 3.472H3.98552C3.98552 3.472 5.47512 1.6952 5.67432 1.4544C5.82632 1.2704 5.98152 1.2 6.18312 1.2H7.81752C8.01992 1.2 8.17512 1.2704 8.32712 1.4544C8.52552 1.6952 10.0159 3.472 10.0159 3.472H8.65592Z"
                                        fill="black"
                                        fill-opacity="0.5"
                                      />
                                    </svg>
                                  </div>
                                </React.Fragment>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {contentRows.length > 1 && (
                      <tr>
                        <td
                          colspan="3"
                          className="custom-table-body-week-timesheet-entries"
                        >
                          <div className="d-flex justify-content-end timesheet-week-regular-hours-calculation">
                            Regular :
                          </div>
                        </td>
                        {selectedWeek.map((day, dayIndex) => (
                          <td
                            key={dayIndex}
                            className="custom-table-body-week-timesheet-entries"
                          >
                            <div className="timesheet-week-regular-hours-calculation">
                              {calculateRegularHours(dayIndex)}
                            </div>
                          </td>
                        ))}
                        <td className="custom-table-body-week-timesheet-entries">
                          <div className="timesheet-week-regular-hours-calculation-final">
                            {calculateTotalRegularHours()}
                          </div>
                        </td>
                        <td
                          colSpan={selectedWeek.length}
                          className="custom-table-body-week-timesheet-entries"
                        ></td>
                      </tr>
                    )}
                    {contentRows.some(row => row.selectedPayType === 'overtimehour') && (
                      <tr>
                        <td
                          colspan="3"
                          className="custom-table-body-week-timesheet-entries"
                        >
                          <div className="d-flex justify-content-end timesheet-week-overtime-hours-calculation">
                            Overtime :
                          </div>
                        </td>
                        {selectedWeek.map((day, dayIndex) => (
                          <td
                            key={dayIndex}
                            className="custom-table-body-week-timesheet-entries"
                          >
                            <div className="timesheet-week-overtime-hours-calculation">
                              {calculateOvertimeHours(dayIndex)}
                            </div>
                          </td>
                        ))}
                        <td className="custom-table-body-week-timesheet-entries">
                          <div className="timesheet-week-overtime-hours-calculation-final">
                            {calculateTotalOvertimeHours()}
                          </div>
                        </td>
                        <td
                          colSpan={selectedWeek.length}
                          className="custom-table-body-week-timesheet-entries"
                        ></td>
                      </tr>
                    )}

                    <tr>
                      <td
                        colSpan="3"
                        className="custom-table-body-week-timesheet-entries"
                      >
                        <div className="d-flex justify-content-end timesheet-week-total-hours-calculation">
                          Total :
                        </div>
                      </td>
                      {selectedWeek.map((day, dayIndex) => (
                        <td
                          key={dayIndex}
                          className="custom-table-body-week-timesheet-entries"
                        >
                          <div className="timesheet-week-total-hours-calculation">
                            {calculatedayHourstotal(dayIndex)}
                          </div>
                        </td>
                      ))}
                      <td className="custom-table-body-week-timesheet-entries">
                        <div className="timesheet-week-total-hours-calculation-final">
                          {calculateOverallTotalHours()}
                        </div>
                      </td>
                      <td
                        colSpan={selectedWeek.length}
                        className="custom-table-body-week-timesheet-entries"
                      ></td>
                    </tr>

                    <tr>
                      <td colSpan="13" className="empty-space-color-table"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* <div className="row copy-last-week-and-save-submit-cancel-button d-flex justify-content-between"> */}
              {!isViewModeTimesheet && (
                <div className={`row copy-last-week-and-save-submit-cancel-button d-flex ${activeRevisionButton ? "justify-content-between" : "justify-content-end"
                  }`}>
                  {/* {!activeRevisionButton && (
                  <div className="copy-last-week-activity  ms-4 col-auto">
                    <div className="d-flex flex-md-row flex-column">
                      <div className="d-flex flex-column">
                       
 
                        <div className="copy-last-week-activity-select-option mt-3 me-4 ">
                          <select
                            className="form-select copy-last-week-activity-select-option-form"
                            aria-label="Default select example"
                          >
                            <option value="1">Copy activities Only</option>
                            <option value="2">Copy activities and Time</option>
                          </select>
                         
                        </div>
                      </div>
                      <div className="copy-last-week-activity-save-button ms-3 mt-2 ">
                        <div className="button btn d-flex copy-last-week-activity-save-button-and-icon">
                          <div className="copy-last-week-activity-save-button-div ps-2 pe-2">
                            Save
                          </div>
               
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <path
                              d="M0 2.75C0 2.02065 0.289731 1.32118 0.805456 0.805456C1.32118 0.289731 2.02065 0 2.75 0H12.715C13.5769 5.14719e-05 14.4035 0.342495 15.013 0.952L17.048 2.987C17.658 3.597 18 4.424 18 5.286V15.25C18 15.9793 17.7103 16.6788 17.1945 17.1945C16.6788 17.7103 15.9793 18 15.25 18H2.75C2.02065 18 1.32118 17.7103 0.805456 17.1945C0.289731 16.6788 0 15.9793 0 15.25V2.75ZM2.75 1.5C2.06 1.5 1.5 2.06 1.5 2.75V15.25C1.5 15.94 2.06 16.5 2.75 16.5H3V11.25C3 10.6533 3.23705 10.081 3.65901 9.65901C4.08097 9.23705 4.65326 9 5.25 9H12.75C13.3467 9 13.919 9.23705 14.341 9.65901C14.7629 10.081 15 10.6533 15 11.25V16.5H15.25C15.94 16.5 16.5 15.94 16.5 15.25V5.286C16.5 4.821 16.316 4.376 15.987 4.048L13.952 2.013C13.6937 1.75422 13.3607 1.58286 13 1.523V4.25C13 4.54547 12.9418 4.83805 12.8287 5.11104C12.7157 5.38402 12.5499 5.63206 12.341 5.84099C12.1321 6.04992 11.884 6.21566 11.611 6.32873C11.3381 6.4418 11.0455 6.5 10.75 6.5H6.25C5.65326 6.5 5.08097 6.26295 4.65901 5.84099C4.23705 5.41903 4 4.84674 4 4.25V1.5H2.75ZM13.5 16.5V11.25C13.5 11.0511 13.421 10.8603 13.2803 10.7197C13.1397 10.579 12.9489 10.5 12.75 10.5H5.25C5.05109 10.5 4.86032 10.579 4.71967 10.7197C4.57902 10.8603 4.5 11.0511 4.5 11.25V16.5H13.5ZM5.5 1.5V4.25C5.5 4.664 5.836 5 6.25 5H10.75C10.9489 5 11.1397 4.92098 11.2803 4.78033C11.421 4.63968 11.5 4.44891 11.5 4.25V1.5H5.5Z"
                              fill="black"
                              fill-opacity="0.5"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}
                  {activeRevisionButton && (
                    <div className="timesheet-weekly-reason-revision-button ms-4 mt-3 mb-4 col-auto">
                      <div
                        className="button btn d-flex flex-row timesheet-weekly-reason-revision-button-btn"
                        data-bs-toggle="modal"
                        data-bs-target="#reasonrevisionpopupModal"
                      >
                        <div className="timesheet-weekly-reason-revision-button-btn-div">
                          Reason for Revision
                        </div>
                      </div>
                      {/* popup revision box start*/}
                      <div
                        class="modal reasonrevisionpopupModal-timesheet-weekly"
                        id="reasonrevisionpopupModal"
                        tabindex="-1"
                        aria-labelledby="reasonrevisionpopupModalLabel"
                        aria-hidden="true"
                      >
                        <div class="modal-dialog modal-dialog-centered reasonrevision-modal-dialog">
                          <div class="modal-content timesheet-weekly-reasonrevision-modal-content">
                            <div
                              class="modal-body timesheet-weekly-reasonrevision-modal-body mt-2 ms-4 me-3"
                              id="reasonrevisionpopupModalLabel"
                            >
                              <div className="d-flex justify-content-between">
                                <div className="modal-title d-flex flex-row">
                                  <div className="timesheet-weekly-reasonrevision-modal-title">
                                    Revision
                                  </div>
                                </div>
                                <div
                                  className="timesheet-weekly-reasonrevision-model-title-close-icon"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                  >
                                    <path
                                      d="M4 12L12 4M12 12L4 4"
                                      stroke="#F8F8F8"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="timesheet-weekly-reasonrevision-modal-sub-title mt-3">
                                Please fill out details
                              </div>
                              <div className="timesheet-weekly-reasonrevision-model-title-emptyline mt-3"></div>
                              <div className="timesheet-weekly-revision-explaination-code d-flex flex-row mt-4">
                                <div className="timesheet-weekly-revision d-flex flex-row align-items-center">
                                  <label className="timesheet-weekly-revision-label">
                                    Revision :
                                  </label>
                                  <div className="timesheet-weekly-revision-box-input-div">
                                    <input
                                      className="timesheet-weekly-revision-box-input"
                                      type="number"
                                      value={"02"}
                                    />
                                  </div>
                                </div>
                                <div className="timesheet-weekly-explaination-code d-flex flex-row align-items-center ms-5">
                                  <label className="timesheet-weekly-explaination-code-label">
                                    Explaination Code :
                                  </label>
                                  <div className="timesheet-weekly-explaination-code-box-input">
                                    <Select
                                      className="timesheet-weekly-explaination-code-box-select-input"
                                      options={explainationcodeandvalueoptions}
                                      placeholder="Search Here..."
                                      isClearable={true}
                                      onChange={
                                        handleSelectexplainationcontentChange
                                      }
                                      formatOptionLabel={(option) => option.label}
                                      value={
                                        selectedexplainationCode
                                          ? {
                                            value: selectedexplainationCode,
                                            label: selectedexplainationCode,
                                          }
                                          : null
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex flex-row mt-5">
                                <div className="d-flex flex-column">
                                  <label className="timesheet-weekly-brief-explaination-revision-label">
                                    Explaination for Revision
                                  </label>
                                  <textarea
                                    id="timesheet-weekly-brief-explaination-revision-comment-textarea"
                                    className="timesheet-weekly-brief-explaination-revision-comment-textarea-name mt-3"
                                    rows="6"
                                    placeholder="Select the Explaination Code ..."
                                    value={explainationcontent}
                                    // onChange={handleExplanationChange}
                                    readOnly
                                  />
                                </div>
                                <div className="d-flex flex-column ms-5">
                                  <label className="timesheet-weekly-additional-information-revision-label">
                                    Additional Information
                                  </label>
                                  <textarea
                                    id="timesheet-weekly-additional-information-revision-comment-textarea"
                                    className="timesheet-weekly-additional-information-revision-comment-textarea-name mt-3"
                                    rows="6"
                                    placeholder="Enter the comments ..."
                                    onChange={handleAdditionalInfoChange}
                                  />
                                </div>
                              </div>
                              <div className="timesheet-weekly-explaination-submit-model-comment-div mb-4">
                                <button
                                  type="button"
                                  class={`btn timesheet-weekly-explaination-submit-model-comment ${isSubmitEnabled
                                    ? "timesheet-weekly-explaination-submit-model-comment-enabled"
                                    : ""
                                    }`}
                                  data-bs-dismiss="modal"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* popup revision box end */}
                    </div>
                  )}
                  <div className="timesheet-weekly-submit-save-cancel-button d-flex flex-row col-auto ms-4 mt-3 mb-4">
                    {/* <div className="button btn d-flex flex-row timesheet-weekly-button-submit mb-2" onClick={() => saveTimesheet('submitted')}> */}
                    {activeRevisionButton && (
                      <div
                        className={`button btn d-flex flex-row timesheet-weekly-button-submit mb-2 ${!isSubmitEnabled
                          ? "timesheet-weekly-button-submit-disabled"
                          : ""
                          }`}
                        onClick={() =>
                          isSubmitEnabled ? saveTimesheet("Submitted") : null
                        }
                        disabled={!isSubmitEnabled}
                        data-tooltip-id="sign-revision-button-tooltip"
                        data-tooltip-content={
                          !isSubmitEnabled ? "Enter the Revision Comment" : ""
                        }
                      >
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M20 13V5.749C20.0001 5.67006 19.9845 5.59189 19.9543 5.51896C19.9241 5.44603 19.8798 5.37978 19.824 5.324L16.676 2.176C16.5636 2.06345 16.4111 2.00014 16.252 2H4.6C4.44087 2 4.28826 2.06321 4.17574 2.17574C4.06321 2.28826 4 2.44087 4 2.6V21.4C4 21.5591 4.06321 21.7117 4.17574 21.8243C4.28826 21.9368 4.44087 22 4.6 22H14"
                              stroke="#38BA7C"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M16 2V5.4C16 5.55913 16.0632 5.71174 16.1757 5.82426C16.2883 5.93679 16.4409 6 16.6 6H20M16 19H22M22 19L19 16M22 19L19 22"
                              stroke="#38BA7C"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="timesheet-weekly-button-submit-div ps-2">
                          Sign
                        </div>
                      </div>
                    )}
                    {!activeRevisionButton && (
                      <div
                        className="button btn d-flex flex-row timesheet-weekly-button-submit mb-2"
                        onClick={() => saveTimesheet("Submitted")}
                      >
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M20 13V5.749C20.0001 5.67006 19.9845 5.59189 19.9543 5.51896C19.9241 5.44603 19.8798 5.37978 19.824 5.324L16.676 2.176C16.5636 2.06345 16.4111 2.00014 16.252 2H4.6C4.44087 2 4.28826 2.06321 4.17574 2.17574C4.06321 2.28826 4 2.44087 4 2.6V21.4C4 21.5591 4.06321 21.7117 4.17574 21.8243C4.28826 21.9368 4.44087 22 4.6 22H14"
                              stroke="#38BA7C"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M16 2V5.4C16 5.55913 16.0632 5.71174 16.1757 5.82426C16.2883 5.93679 16.4409 6 16.6 6H20M16 19H22M22 19L19 16M22 19L19 22"
                              stroke="#38BA7C"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="timesheet-weekly-button-submit-div ps-2">
                          Sign
                        </div>
                      </div>
                    )}
                    <div
                      className={`button btn d-flex flex-row timesheet-weekly-button-save mb-2 ${disableSaveButton
                        ? "timesheet-weekly-button-save-disabled-save-button"
                        : ""
                        }`}
                      // onClick={() => saveTimesheet('draft')}
                      onClick={() =>
                        disableSaveButton ? null : saveTimesheet("In-use")
                      }
                      disabled={disableSaveButton}
                    >
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M7 21H17C18.0609 21 19.0783 20.5786 19.8284 19.8284C20.5786 19.0783 21 18.0609 21 17V7.414C20.9999 7.14881 20.8946 6.89449 20.707 6.707L17.293 3.293C17.1055 3.10545 16.8512 3.00006 16.586 3H7C5.93913 3 4.92172 3.42143 4.17157 4.17157C3.42143 4.92172 3 5.93913 3 7V17C3 18.0609 3.42143 19.0783 4.17157 19.8284C4.92172 20.5786 5.93913 21 7 21Z"
                            stroke="#787DBD"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M17 21V14C17 13.7348 16.8946 13.4804 16.7071 13.2929C16.5196 13.1054 16.2652 13 16 13H8C7.73478 13 7.48043 13.1054 7.29289 13.2929C7.10536 13.4804 7 13.7348 7 14V21M9 3H15V6C15 6.26522 14.8946 6.51957 14.7071 6.70711C14.5196 6.89464 14.2652 7 14 7H10C9.73478 7 9.48043 6.89464 9.29289 6.70711C9.10536 6.51957 9 6.26522 9 6V3Z"
                            stroke="#787DBD"
                            stroke-width="2"
                          />
                          <path
                            d="M11 17H13"
                            stroke="#787DBD"
                            stroke-width="2"
                            stroke-linecap="round"
                          />
                        </svg>
                      </div>
                      <div className="timesheet-weekly-button-save-div ps-2">
                        Save
                      </div>
                    </div>
                    <div
                      className="button btn d-flex flex-row timesheet-weekly-button-reset mb-2"
                      onClick={handleCancel}
                    >
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="21"
                          viewBox="0 0 21 21"
                          fill="none"
                        >
                          <path
                            d="M7.5 5.5L4.5 2.5H10.5C12.0976 2.49986 13.6587 2.97788 14.9823 3.87253C16.306 4.76718 17.3315 6.03751 17.927 7.52C18.297 8.441 18.5 9.447 18.5 10.5C18.5 12.6217 17.6571 14.6566 16.1569 16.1569C14.6566 17.6571 12.6217 18.5 10.5 18.5C8.37827 18.5 6.34344 17.6571 4.84315 16.1569C3.34285 14.6566 2.5 12.6217 2.5 10.5C2.5 9.01 2.87 7.028 4.038 5.409M7.5 7.5L13.5 13.5M7.5 13.5L13.5 7.5"
                            stroke="#FF7F7F"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="timesheet-weekly-button-reset-div ps-2">
                        Reset
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="white-space-timesheet"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeeklyAddnewtimesheet;