// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './UserReports.css';
// import Sidebar from "../../Components/Sidebar";
// import Topbar from "../../Components/Topbar";


// function UserReports({locale , setLocale})  {
//   const [reports, setReports] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({
//     dateRange: 'all',
//     projectId: '',
//     taskId: '',
//     billableStatus: '',
//   });

//   const [projects, setProjects] = useState([]);
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     fetchProjects();
//     fetchTasks();
//   }, []);

//   useEffect(() => {
//     fetchReports();
//   }, [filters]);

//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/projects`);
//       setProjects(response.data);
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//     }
//   };

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const fetchReports = async () => {

//     try {
//       const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//       const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/timesheet/weekly/user-reports/${userInfo.employeeId}`, {
//         params: filters
//       });
//       setReports(response.data);
//     } catch (err) {
//       console.error('Error fetching reports:', err);
//     } 
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [name]: value
//     }));
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const formatHours = (hours) => {
//     return parseFloat(hours).toFixed(2);
//   };



//   return (
//     <div>
//     <Topbar locale={locale} setLocale={setLocale} />
//     <div className="d-flex">
//        <Sidebar locale={locale} setLocale={setLocale}/>
//     <div className="user-reports">
//       <h1>My Timesheet Reports</h1>
      
//       <div className="filters">
//         <div className="filter-group">
//           <label htmlFor="dateRange">Date Range:</label>
//           <select id="dateRange" name="dateRange" value={filters.dateRange} onChange={handleFilterChange}>
//             <option value="all">All Time</option>
//             <option value="week">This Week</option>
//             <option value="month">This Month</option>
//             <option value="year">This Year</option>
//           </select>
//         </div>
        
//         <div className="filter-group">
//           <label htmlFor="projectId">Project:</label>
//           <select id="projectId" name="projectId" value={filters.projectId} onChange={handleFilterChange}>
//             <option value="">All Projects</option>
//             {projects.map(project => (
//               <option key={project.id} value={project.id}>{project.name}</option>
//             ))}
//           </select>
//         </div>
        
//         <div className="filter-group">
//           <label htmlFor="taskId">Task:</label>
//           <select id="taskId" name="taskId" value={filters.taskId} onChange={handleFilterChange}>
//             <option value="">All Tasks</option>
//             {tasks.map(task => (
//               <option key={task.id} value={task.id}>{task.name}</option>
//             ))}
//           </select>
//         </div>
        
//         <div className="filter-group">
//           <label htmlFor="billableStatus">Billable Status:</label>
//           <select id="billableStatus" name="billableStatus" value={filters.billableStatus} onChange={handleFilterChange}>
//             <option value="">All Status</option>
//             <option value="true">Billable</option>
//             <option value="false">Non-Billable</option>
//           </select>
//         </div>
//       </div>

//       {reports && (
//         <div className="reports-summary">
//           <h2>Total Hours: {formatHours(reports.totalHours)}</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Project</th>
//                 <th>Task</th>
//                 <th>Hours</th>
//                 <th>Status</th>
//                 <th>Billable</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reports.reportData.map((entry, index) => (
//                 <tr key={index}>
//                   <td>{formatDate(entry.date)}</td>
//                   <td>{entry.projectName}</td>
//                   <td>{entry.taskName}</td>
//                   <td>{formatHours(entry.hours)}</td>
//                   <td>{entry.status}</td>
//                   <td>{entry.billable ? 'Yes' : 'No'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//     </div>
//     </div>
//   );
// };

// export default UserReports;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserReports.css';
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";

function UserReports({locale , setLocale}) {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    projectId: '',
    taskId: '',
    billableStatus: '',
  });

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
 
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/timesheet/weekly/user-reports/${userInfo.employeeId}`, {
        params: filters
      });
      setReports(response.data);
      
      // Extract unique projects and tasks from the report data
      const uniqueProjects = new Set();
      const uniqueTasks = new Set();
      response.data.reportData.forEach(entry => {
        uniqueProjects.add(JSON.stringify({ id: entry.projectId, name: entry.projectName }));
        uniqueTasks.add(JSON.stringify({ id: entry.taskId, name: entry.taskName }));
      });
      
      setProjects(Array.from(uniqueProjects).map(JSON.parse));
      setTasks(Array.from(uniqueTasks).map(JSON.parse));
    } catch (err) {
    
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatHours = (hours) => {
    return parseFloat(hours).toFixed(2);
  };



  return (
    <div>
      <Topbar locale={locale} setLocale={setLocale} />
      <div className="d-flex">
        <Sidebar locale={locale} setLocale={setLocale}/>
        <div className="user-reports">
          <h1>My Timesheet Reports</h1>
          
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="dateRange">Date Range:</label>
              <select id="dateRange" name="dateRange" value={filters.dateRange} onChange={handleFilterChange}>
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="projectId">Project:</label>
              <select id="projectId" name="projectId" value={filters.projectId} onChange={handleFilterChange}>
                <option value="">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="taskId">Task:</label>
              <select id="taskId" name="taskId" value={filters.taskId} onChange={handleFilterChange}>
                <option value="">All Tasks</option>
                {tasks.map(task => (
                  <option key={task.id} value={task.id}>{task.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="billableStatus">Billable Status:</label>
              <select id="billableStatus" name="billableStatus" value={filters.billableStatus} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="true">Billable</option>
                <option value="false">Non-Billable</option>
              </select>
            </div>
          </div>

          {reports && (
            <div className="reports-summary">
              <h2>Total Hours: {formatHours(reports.totalHours)}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Project</th>
                    <th>Task</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th>Billable</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.reportData.map((entry, index) => (
                    <tr key={index}>
                      <td>{formatDate(entry.date)}</td>
                      <td>{entry.projectName}</td>
                      <td>{entry.taskName}</td>
                      <td>{formatHours(entry.hours)}</td>
                      <td>{entry.status}</td>
                      <td>{entry.billable ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserReports;