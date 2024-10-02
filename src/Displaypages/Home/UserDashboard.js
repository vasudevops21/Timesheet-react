// import React, { useState, useEffect } from "react";
// import Topbar from "../../Components/Topbar";
// import Sidebar from "../../Components/Sidebar";
// import axios from "axios";
// import Calendar from "./Calendar";
// import "./UserDashboard.css";

// const UserDashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const [workHours, setWorkHours] = useState(null);
//   const [approvalStatus, setApprovalStatus] = useState(null);
//   const [projectHours, setProjectHours] = useState(null);
//   const [progress, setProgress] = useState(null);
//   const [userProfile, setUserProfile] = useState({});

//   useEffect(() => {
//     const retrieveUserProfile = localStorage.getItem("userInfo");
//     if (retrieveUserProfile) {
//       setUserProfile(JSON.parse(retrieveUserProfile));
//     }
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!userProfile || !userProfile.employeeId) return;
     
//       try {
//         console.log(approvalResponse ,"approval status")
//         const [
//           userResponse,
//           hoursResponse,
//           approvalResponse,
//           projectResponse,
//           progressResponse,
//         ] = await Promise.all([
//           axios.get("https://api.example.com/user"),
//           axios.get("https://api.example.com/work-hours"),
//           axios.get(  process.env.REACT_APP_API_BASE_URL +
//            `api/v1/timesheet/weekly/status-counts/${userProfile.employeeId}`
            
//           ),
//           axios.get("https://api.example.com/project-hours"),
//           axios.get("https://api.example.com/progress"),
//         ]);

//         setUserData(userResponse.data);
//         setWorkHours(hoursResponse.data);
//         setApprovalStatus(approvalResponse.data);
//         setProjectHours(projectResponse.data);
//         setProgress(progressResponse.data);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };

//     fetchData();
//   }, [userProfile]);

//   return (
//     <>
//       <div>
//         <Topbar />
//         <div className="d-flex">
//           <Sidebar />
//           <div className="user-dashboard">
//             <div className="dashboard">
//               <div className="container">
//                 <header className="header">
//                   <h1>Welcome back, {userData?.name}!</h1>
//                   <div className="header-info">
//                     <div>
//                       Billable Amount: ${userData?.billableAmount.toFixed(2)}
//                     </div>
//                     <div>Last Week: ${userData?.lastWeekAmount.toFixed(2)}</div>
//                   </div>
//                 </header>

//                 <main className="main-content">
//                   <div className="dashboard-main">
//                     <h2 className="dashboard-title">My Dashboard</h2>
//                     <p className="dashboard-subtitle">
//                       Enhance your work performance through the effective use of
//                       this timesheet.
//                     </p>

//                     <div className="grid">
//                       <div className="usercard card-purple">
//                         <h3>Total Worked Hours</h3>
//                         <p className="total-hours">{workHours?.total}</p>
//                         <p className="previous-week">
//                           {workHours?.previousWeek} hrs worked by previous week
//                         </p>
//                       </div>

//                       <div className="usercard">
//                         <h3>Approval Status</h3>
//                         <div className="status-container">
//                           {approvalStatus &&
//                             Object.entries(approvalStatus).map(
//                               ([key, value]) => (
//                                 <div key={key} className="status-item">
//                                   <div
//                                     className={`status-circle status-${key
//                                       .toLowerCase()
//                                       .replace(" ", "-")}`}
//                                   ></div>
//                                   <p>
//                                     {value} {key}
//                                   </p>
//                                 </div>
//                               )
//                             )}
//                         </div>
//                       </div>

//                       <div className="usercard">
//                         <h3>Project Worked Hours</h3>
//                         <div className="project-hours">
//                           {projectHours &&
//                             Object.entries(projectHours).map(
//                               ([project, hours], index) => (
//                                 <div
//                                   key={project}
//                                   className="project-bar"
//                                   style={{
//                                     height: `${
//                                       (hours /
//                                         Math.max(
//                                           ...Object.values(projectHours)
//                                         )) *
//                                       100
//                                     }%`,
//                                   }}
//                                 ></div>
//                               )
//                             )}
//                         </div>
//                         <div className="project-labels">
//                           {projectHours &&
//                             Object.keys(projectHours).map((project) => (
//                               <span key={project}>{project}</span>
//                             ))}
//                         </div>
//                       </div>

//                       <div className="usercard">
//                         <h3>My Progress</h3>
//                         <div className="progress-circle">
//                           <svg viewBox="0 0 36 36">
//                             <path
//                               className="progress-circle-bg"
//                               d="M18 2.0845
//                         a 15.9155 15.9155 0 0 1 0 31.831
//                         a 15.9155 15.9155 0 0 1 0 -31.831"
//                             />
//                             <path
//                               className="progress-circle-value"
//                               d="M18 2.0845
//                         a 15.9155 15.9155 0 0 1 0 31.831
//                         a 15.9155 15.9155 0 0 1 0 -31.831"
//                               strokeDasharray={`${progress?.total}, 100`}
//                             />
//                           </svg>
//                           <div className="progress-circle-text">
//                             {progress?.total}
//                           </div>
//                         </div>
//                         <div className="progress-bar-container">
//                           {progress &&
//                             Object.entries(progress)
//                               .filter(([key]) => key !== "total")
//                               .map(([key, value]) => (
//                                 <div key={key}>
//                                   <div className="progress-bar-label">
//                                     <span>{key}</span>
//                                     <span>{value}%</span>
//                                   </div>
//                                   <div className="progress-bar">
//                                     <div
//                                       className={`progress-bar-value progress-bar-${key
//                                         .toLowerCase()
//                                         .replace(" ", "-")}`}
//                                       style={{ width: `${value}%` }}
//                                     ></div>
//                                   </div>
//                                 </div>
//                               ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="dashboard-sidebar">
//                     <div className="usercard card-red">
//                       <h3>Missed Entries in Calendar</h3>
//                     </div>
//                     <Calendar />
//                   </div>
//                 </main>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserDashboard;


// import React, { useState, useEffect } from "react";
// import Topbar from "../../Components/Topbar";
// import Sidebar from "../../Components/Sidebar";
// import axios from "axios";
// import Calendar from "./Calendar";
// import "./UserDashboard.css";

// const UserDashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const [workHours, setWorkHours] = useState(null);
//   const [approvalStatus, setApprovalStatus] = useState(null);
//   const [projectHours, setProjectHours] = useState(null);
//   const [progress, setProgress] = useState(null);
//   const [userProfile, setUserProfile] = useState({});

//   useEffect(() => {
//     const retrieveUserProfile = localStorage.getItem("userInfo");
//     if (retrieveUserProfile) {
//       setUserProfile(JSON.parse(retrieveUserProfile));
//     }
//   }, []);

//   // const fetchUserData = async () => {
//   //   const response = await axios.get("https://api.example.com/user");
//   //   setUserData(response.data);
//   // };

//   // const fetchWorkHours = async () => {
//   //   const response = await axios.get("https://api.example.com/work-hours");
//   //   setWorkHours(response.data);
//   // };

//   const fetchApprovalStatus = async () => {
//     if (!userProfile.employeeId) return;
//     const response = await axios.get(
//       `${process.env.REACT_APP_API_BASE_URL}api/v1/timesheet/weekly/status-counts/${userProfile.employeeId}`
//     );
//     setApprovalStatus(response.data);
//     console.log("Approval status:", response.data);
//   };

//   // const fetchProjectHours = async () => {
//   //   const response = await axios.get("https://api.example.com/project-hours");
//   //   setProjectHours(response.data);
//   // };

//   // const fetchProgress = async () => {
//   //   const response = await axios.get("https://api.example.com/progress");
//   //   setProgress(response.data);
//   // };

//   useEffect(() => {
//     // fetchUserData();
//     // fetchWorkHours();
//     fetchApprovalStatus();
//     // fetchProjectHours();
//     // fetchProgress();
//   }, [userProfile]);

//   return (
//     <>
//       <div>
//         <Topbar />
//         <div className="d-flex">
//           <Sidebar />
//           <div className="user-dashboard">
//             <div className="dashboard">
//               <div className="container">
//                 <header className="header">
//                   <h1>Welcome back, {userData?.name}!</h1>
//                   <div className="header-info">
//                     <div>
//                       Billable Amount: ${userData?.billableAmount?.toFixed(2)}
//                     </div>
//                     <div>Last Week: ${userData?.lastWeekAmount?.toFixed(2)}</div>
//                   </div>
//                 </header>

//                 <main className="main-content">
//                   <div className="dashboard-main">
//                     <h2 className="dashboard-title">My Dashboard</h2>
//                     <p className="dashboard-subtitle">
//                       Enhance your work performance through the effective use of
//                       this timesheet.
//                     </p>

//                     <div className="grid">
//                       <div className="usercard card-purple">
//                         <h3>Total Worked Hours</h3>
//                         <p className="total-hours">{workHours?.total}</p>
//                         <p className="previous-week">
//                           {workHours?.previousWeek} hrs worked by previous week
//                         </p>
//                       </div>

//                       <div className="usercard">
//                         <h3>Approval Status</h3>
//                         <div className="status-container">
//                           {approvalStatus &&
//                             Object.entries(approvalStatus).map(
//                               ([key, value]) => (
//                                 <div key={key} className="status-item">
//                                   <div
//                                     className={`status-circle status-${key
//                                       .toLowerCase()
//                                       .replace(" ", "-")}`}
//                                   ></div>
//                                   <p>
//                                     {value} {key}
//                                   </p>
//                                 </div>
//                               )
//                             )}
//                         </div>
//                       </div>

//                       <div className="usercard">
//                         <h3>Project Worked Hours</h3>
//                         <div className="project-hours">
//                           {projectHours &&
//                             Object.entries(projectHours).map(
//                               ([project, hours], index) => (
//                                 <div
//                                   key={project}
//                                   className="project-bar"
//                                   style={{
//                                     height: `${
//                                       (hours /
//                                         Math.max(
//                                           ...Object.values(projectHours)
//                                         )) *
//                                       100
//                                     }%`,
//                                   }}
//                                 ></div>
//                               )
//                             )}
//                         </div>
//                         <div className="project-labels">
//                           {projectHours &&
//                             Object.keys(projectHours).map((project) => (
//                               <span key={project}>{project}</span>
//                             ))}
//                         </div>
//                       </div>

//                       <div className="usercard">
//                         <h3>My Progress</h3>
//                         <div className="progress-circle">
//                           <svg viewBox="0 0 36 36">
//                             <path
//                               className="progress-circle-bg"
//                               d="M18 2.0845
//                         a 15.9155 15.9155 0 0 1 0 31.831
//                         a 15.9155 15.9155 0 0 1 0 -31.831"
//                             />
//                             <path
//                               className="progress-circle-value"
//                               d="M18 2.0845
//                         a 15.9155 15.9155 0 0 1 0 31.831
//                         a 15.9155 15.9155 0 0 1 0 -31.831"
//                               strokeDasharray={`${progress?.total}, 100`}
//                             />
//                           </svg>
//                           <div className="progress-circle-text">
//                             {progress?.total}
//                           </div>
//                         </div>
//                         <div className="progress-bar-container">
//                           {progress &&
//                             Object.entries(progress)
//                               .filter(([key]) => key !== "total")
//                               .map(([key, value]) => (
//                                 <div key={key}>
//                                   <div className="progress-bar-label">
//                                     <span>{key}</span>
//                                     <span>{value}%</span>
//                                   </div>
//                                   <div className="progress-bar">
//                                     <div
//                                       className={`progress-bar-value progress-bar-${key
//                                         .toLowerCase()
//                                         .replace(" ", "-")}`}
//                                       style={{ width: `${value}%` }}
//                                     ></div>
//                                   </div>
//                                 </div>
//                               ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="dashboard-sidebar">
//                     <div className="usercard card-red">
//                       <h3>Missed Entries in Calendar</h3>
//                     </div>
//                     <Calendar />
//                   </div>
//                 </main>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserDashboard;


import React, { useState, useEffect } from "react";
import Topbar from "../../Components/Topbar";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import Calendar from "./Calendar";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [weeklyHours, setWeeklyHours] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [projectHours, setProjectHours] = useState(null);
  const [progress, setProgress] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const retrieveUserProfile = localStorage.getItem("userInfo");
    if (retrieveUserProfile) {
      setUserProfile(JSON.parse(retrieveUserProfile));
    }
  }, []);

  const fetchApprovalStatus = async () => {
    if (!userProfile || !userProfile.employeeId) {
      console.error("User profile or employee ID is missing");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/timesheet/weekly/status-counts/${userProfile.employeeId}`
      );
      setApprovalStatus(response.data);
      console.log("Approval status:", response.data);
    } catch (error) {
      console.error("Error fetching approval status:", error);
    }
  };

  const fetchProjectHours = async () => {
    if (!userProfile || !userProfile.employeeId) {
      console.error("User profile or employee ID is missing");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/timesheet/weekly/project-hours/${userProfile.employeeId}`
      );
      setProjectHours(response.data);
      console.log("Project hours:", response.data);
    } catch (error) {
      console.error("Error fetching project hours:", error);
    }
  };


  const fetchWeeklyHours = async () => {
    if (!userProfile || !userProfile.employeeId) {
      console.error("User profile or employee ID is missing");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/timesheet/weekly/weekly-hours/${userProfile.employeeId}`
      );
      setWeeklyHours(response.data);
      console.log("Weekly hours:", response.data);
    } catch (error) {
      console.error("Error fetching weekly hours:", error);
    }
  };
  useEffect(() => {
    if (userProfile) {
      fetchApprovalStatus();
      fetchProjectHours();
      fetchWeeklyHours();
    }
  }, [userProfile]);

  return (
    <>
      <div>
        <Topbar />
        <div className="d-flex">
          <Sidebar />
          <div className="user-dashboard">
            <div className="dashboard">
              <div className="container">
                <header className="header">
                  <h1>Welcome back, {userProfile?.firstname || 'User'}!</h1>
                  <div className="header-info">
                    <div>
                      Billable Amount: ${userData?.billableAmount?.toFixed(2) || '0.00'}
                    </div>
                    <div>Last Week: ${userData?.lastWeekAmount?.toFixed(2) || '0.00'}</div>
                  </div>
                </header>

                <main className="main-content">
                  <div className="dashboard-main">
                    <h2 className="dashboard-title">My Dashboard</h2>
                    <p className="dashboard-subtitle">
                      Enhance your work performance through the effective use of
                      this timesheet.
                    </p>

                    <div className="grid">
                      <div className="usercard card-purple">
                        <h3>Weekly Work Hours</h3>
                        <p className="total-hours">Current Week: {weeklyHours?.currentWeek?.toFixed(2) || '0'} hrs</p>
                        <p className="previous-week">
                          Previous Week: {weeklyHours?.previousWeek?.toFixed(2) || '0'} hrs
                        </p>
                      </div>

                      <div className="usercard">
                        <h3>Approval Status</h3>
                        <div className="status-container">
                          {approvalStatus &&
                            Object.entries(approvalStatus).map(
                              ([key, value]) => (
                                <div key={key} className="status-item">
                                  <div
                                    className={`status-circle status-${key
                                      .toLowerCase()
                                      .replace(" ", "-")}`}
                                  ></div>
                                  <p>
                                    {value} {key}
                                  </p>
                                </div>
                              )
                            )}
                        </div>
                      </div>

                      <div className="usercard">
                        <h3>Project Worked Hours</h3>
                        <div className="project-hours">
                          {projectHours &&
                            Object.entries(projectHours).map(
                              ([project, hours], index) => (
                                <div
                                  key={project}
                                  className="project-bar"
                                  style={{
                                    height: `${
                                      (hours /
                                        Math.max(
                                          ...Object.values(projectHours)
                                        )) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              )
                            )}
                        </div>
                        <div className="project-labels">
                          {projectHours &&
                            Object.entries(projectHours).map(([project, hours]) => (
                              <span key={project}>{project}: {hours} hrs</span>
                            ))}
                        </div>
                      </div>

                      {/* Progress component remains unchanged */}

                    </div>
                  </div>

                  <div className="dashboard-sidebar">
                    <div className="usercard card-red">
                      <h3>Missed Entries in Calendar</h3>
                    </div>
                    <Calendar />
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;