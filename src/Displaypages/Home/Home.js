import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import "./home.css";
import { useDateFormat } from "../Project/DateFormatContext";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define MainComponent as an arrow function
const MainComponent = ({ locale, setLocale }) => {
  const [selectedOption, setSelectedOption] = useState("Timesheet");
  const { dateFormat } = useDateFormat();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (dateFormat === "dd/mm/yyyy") {
      return date.toLocaleDateString('en-GB');
    } else if (dateFormat === "mm/dd/yyyy") {
      return date.toLocaleDateString('en-US');
    }
    return dateString;
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // timesheet dashboard-----------------------------------------------------------------------------------------------
  const barChartData = {
    labels: [
      "Total Hours Worked",
      "Approved Timesheets",
      "Pending Timesheets",
      "Rejected Timesheets",
      "Not Submitted",
    ],
    datasets: [
      {
        data: [55, 15, 80, 30, 50],
        backgroundColor: [
          "#8884d8",
          "#82ca9d",
          "#ffc658",
          "#ff8042",
          "#a4a4a4",
        ],
      },
    ],
  };


  const doughnutChartData = {
    // labels: ["Approved", "Pending", "Rejected", "Not Submitted"],
    datasets: [
      {
        data: [15, 80, 30, 50],
        backgroundColor: ["#82ca9d", "#ffc658", "#ff8042", "#a4a4a4"],
      },
    ],
  };

  const legendData = [
    { color: "#82ca9d", label: "Approved" },
    { color: "#ffc658", label: "Pending" },
    { color: "#ff8042", label: "Rejected" },
    { color: "#a4a4a4", label: "Not Submitted" },
  ];

  const tableData = [
    {
      id: "AGT-09895",
      name: "Oliver john",
      status: "Approved",
      totalHours: "08:30 hrs",
      workHours: "08:30 hrs",
    },
    // Add more rows as needed
  ];

  //Employee Dashboard------------------------------------------------------------------------------------------

  const [tableDataEmployee, settableDataEmployee] = useState([]);
  const [barChartDataEmployees, setbarChartDataEmployees] = useState([]);
  const [barChartDataEmployeess, setbarChartDataEmployeess] = useState([]);
  const [barChartDataEmployeessz, setbarChartDataEmployeessz] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
 
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
 
  const filteredData = tableDataEmployee.filter((row) => {
    const isActiveSearch = searchTerm.toLowerCase() === "active";
    const isActiveRow = row.status?.toLowerCase() === "active";
 
    if (isActiveSearch && !isActiveRow) return false;
 
    const searchValue = searchTerm.toLowerCase();
    return (
      row.id.toLowerCase().includes(searchValue) ||
      row.name.toLowerCase().includes(searchValue) ||
      row.status?.toLowerCase().includes(searchValue)
    );
  });

  
  useEffect(() => {
    getData();
  }, []);


  const getData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/Organization/dashboard"
      );
      settableDataEmployee(response.data.employeeSummary);
      setbarChartDataEmployees(response.data.totalEmployees);
      setbarChartDataEmployeess(response.data.statusCounts["active"]);
      setbarChartDataEmployeessz(response.data.statusCounts["in-active"]);
      console.log("employee", response.data.totalEmployees);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const employeeCounts = barChartDataEmployees;
  const activeCounts = barChartDataEmployeess;
  const inactiveCounts = barChartDataEmployeessz;

  const barChartDataEmployee = {
    labels: ["Total Employees", "Active Counts", "In-Active Counts"],
    datasets: [
      {
        data: [employeeCounts, activeCounts, inactiveCounts],
        backgroundColor: ["#8884d8", "#82ca9d", "#a4a4a4"],
        barThickness: 70,
      },
    ],
  };

  const doughnutChartDataEmployee = {
    labels: ["Total Employees", "Active Counts", "In-Active Counts"],
    datasets: [
      {
        data: [employeeCounts, activeCounts, inactiveCounts],
        backgroundColor: ["#8884d8", "#82ca9d", "#a4a4a4"],
      },
    ],
  };

  const legendDataemployee = [
    { color: "#8884d8", label: "Total Employees" },
    { color: "#82ca9d", label: "Active Counts" },
    { color: "#a4a4a4", label: "In-Active Counts" },
  ];

  //Project Dashboard------------------------------------------------------------------------------------------

  const [tableDataProject, settableDataProject] = useState([]);
  const [barChartDataProjectz, setbarChartDataProject] = useState([]);
  const [barChartDataProjects, setbarChartDataProjects] = useState([]);
  const [barChartDataProjectss, setbarChartDataProjectss] = useState([]);
  const [searchTermproject, setSearchTermproject] = useState("");
  const [barChartDataProjectnotstarted, setbarChartDataProjectnotstarted] =
    useState([]);

  useEffect(() => {
    getDataProject();
  }, []);

  const getDataProject = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL +
          "/api/v1/project/projects/dashboard"
      );
      settableDataProject(response.data.projectSummary);
      setbarChartDataProject(response.data.totalProjects);
      setbarChartDataProjects(response.data.statusCounts.Completed);
      setbarChartDataProjectss(response.data.statusCounts["In Progress"]);
      setbarChartDataProjectnotstarted(
        response.data.statusCounts["Not Started"]
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


 
  const handleSearchproject = (event) => {
    setSearchTermproject(event.target.value);
  };
 
  const filteredDataproject = tableDataProject.filter((row) =>
    Object.values(row).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchTermproject.toLowerCase())
    )
  );

  const ProjectsCounts = barChartDataProjectz;
  const activesCountsproject = barChartDataProjects;
  const in_activesCountsproject = barChartDataProjectss;
  const notstartedcount = barChartDataProjectnotstarted;

  const barChartDataProject = {
    labels: [
      "Total Project",
      "Project Completed",
      "In Progress",
      "Not Started",
    ],
    datasets: [
      {
        data: [
          ProjectsCounts,
          activesCountsproject,
          in_activesCountsproject,
          notstartedcount,
        ],
        backgroundColor: ["#8884d8", "#82ca9d", "#a4a4a4", "#ff8042"],
        barThickness: 70,
      },
    ],
  };

  const doughnutChartDataProject = {
    labels: [
      "Total Project",
      "Project Completed",
      " In Progress",
      "Not Started",
    ],
    datasets: [
      {
        data: [
          ProjectsCounts,
          activesCountsproject,
          in_activesCountsproject,
          notstartedcount,
        ],
        backgroundColor: ["#8884d8", "#82ca9d", "#a4a4a4", "#ff8042"],
      },
    ],
  };

  const legendDataProject = [
    { color: "#8884d8", label: "Total Project" },
    { color: "#82ca9d", label: "Project Completed" },
    { color: "#a4a4a4", label: " In Progress" },
    { color: "#ff8042", label: " Not Started" },
  ];

  //Task Dashboard------------------------------------------------------------------------------------------

  const [tableDataTask, settableDataTask] = useState([]);
  const [barChartDataTask, setbarChartDataTask] = useState([]);
  const [barChartDataTasks, setbarChartDataTasks] = useState([]);
  const [barChartDataTaskz, setbarChartDataTaskz] = useState([]);
  const [barChartDataTasknotstarted, setbarChartDataTasknotstarted] = useState(
    []
  );

  useEffect(() => {
    getDataTask();
  }, []);

  const getDataTask = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/task/dashboard"
      );
      settableDataTask(response.data.taskSummary);
      setbarChartDataTask(response.data.totalTasks);
      setbarChartDataTasks(response.data.statusCounts.Completed);
      setbarChartDataTaskz(response.data.statusCounts["In Progress"]);
      setbarChartDataTasknotstarted(response.data.statusCounts["Not Started"]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const taskCounts = barChartDataTask;
  const activesCountstask = barChartDataTasks;
  const in_activesCountstask = barChartDataTaskz;
  const notstartedcounttask = barChartDataTasknotstarted;

  const barChartDataTaskzz = {
    labels: ["Total Task", "Task Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [
          taskCounts,
          activesCountstask,
          in_activesCountstask,
          notstartedcounttask,
        ],
        backgroundColor: ["#8884d8", "#82ca9d", "#a4a4a4", "#ff8042"],
        barThickness: 70,
      },
    ],
  };

  const doughnutChartDataTask = {
    labels: ["Total Task", "Task Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [
          taskCounts,
          activesCountstask,
          in_activesCountstask,
          notstartedcounttask,
        ],
        backgroundColor: ["#8884d8", "#82ca9d", "#a4a4a4", "#ff8042"],
      },
    ],
  };

  const legendDataTask = [
    { color: "#8884d8", label: "Total Task" },
    { color: "#82ca9d", label: "Task Completed" },
    { color: "#a4a4a4", label: " In Progress" },
    { color: "#ff8042", label: " Not Started" },
  ];

  //client Dashboard------------------------------------------------------------------------------------------

  const [tableDataclient, settableDataclient] = useState([]);
  const [barChartDataclient, setbarChartDataclient] = useState([]);
  const [barChartDataclientz, setbarChartDataclientz] = useState([]);
  const [barChartDataclientnotstarted, setbarChartDataclientnotstarted] =
    useState([]);

  useEffect(() => {
    getDataClient();
  }, []);

  const getDataClient = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/client/dashboard"
      );
      settableDataclient(response.data.clientSummary);
      setbarChartDataclient(response.data.totalClients);
      setbarChartDataclientz(response.data.statusCounts["Active"]);
      setbarChartDataclientnotstarted(response.data.statusCounts["In-Active"]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const clientCounts = barChartDataclient;
  const activesCountclient = barChartDataclientz;
  const inactivecountclient = barChartDataclientnotstarted;

  const barChartDataClientzz = {
    labels: ["Total customers", "Active customers", "In-Active customers"],
    datasets: [
      {
        data: [clientCounts, activesCountclient, inactivecountclient],
        backgroundColor: ["#8884d8", "#82ca9d", "#a4a4a4"],
        barThickness: 70,
      },
    ],
  };

  const doughnutChartDataClient = {
    labels: ["Total customers", "Active customers", "In-Active customers"],
    datasets: [
      {
        data: [clientCounts, activesCountclient, inactivecountclient],
        backgroundColor: ["#8884d8", "#82ca9d", "#a4a4a4"],
      },
    ],
  };

  const legendDataClient = [
    { color: "#8884d8", label: "Total customers" },
    { color: "#82ca9d", label: "Active customers" },
    { color: "#a4a4a4", label: "In-Active customers" },
  ];

  return (
    <div>
      <Topbar locale={locale} setLocale={setLocale} />
      <div className="d-flex">
        <Sidebar locale={locale} setLocale={setLocale} />

        <div className="dashboard">
          {/*--------------------------------------------------- Timesheet------------------------------------------------- */}
          {selectedOption === "Timesheet" && (
            <div>
              <div className="dashboard_timesheet_head">
                <div className="summary">
                  <div className="summary-item">
                    <span className="icon">⏱️</span>
                    <span className="label">Total Hours Worked</span>
                    <span className="value">8:30 Hours</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">✅</span>
                    <span className="label">Approved Timesheets</span>
                    <span className="value">15</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">⏳</span>
                    <span className="label">Pending Timesheets</span>
                    <span className="value">15</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">❌</span>
                    <span className="label">Rejected Timesheets</span>
                    <span className="value">5</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">📝</span>
                    <span className="label">Not Submitted</span>
                    <span className="value">15</span>
                  </div>
                </div>
                <div>
                  <div className="summary-item">
                    <select onChange={handleChange} value={selectedOption}>
                      <option value="Timesheet">Timesheet</option>
                      <option value="Employee">Employee</option>
                      <option value="Project">Project</option>
                      <option value="Task">Task</option>
                      <option value="Client">Client</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="row d-flex chart_and_table">
                  <div className="charts col">
                    <div className="chart-container">
                      <h3>Timesheet </h3>
                      <div className="chart-wrapper">
                        <div className="bar-chart">
                          <Bar
                            data={barChartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                x: {
                                  barPercentage: 0.5, // Adjust the bar width
                                  categoryPercentage: 0.5, // Adjust the category width
                                },
                              },
                            }}
                          />
                        </div>
                      </div>

                      <div className="doughnut-legend-container">
                        <div className="doughnut-chart">
                          <Doughnut
                            data={doughnutChartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              cutout: "70%", // Adjust the cutout percentage to decrease the ring width
                              plugins: {
                                legend: {
                                  display: false, // Disable the default legend
                                },
                              },
                            }}
                          />
                        </div>
                        <div className="chart-legend">
                          {legendData.map((item, index) => (
                            <div key={index} className="legend-item">
                              <span
                                className="legend-color"
                                style={{ backgroundColor: item.color }}
                              ></span>
                              <span className="legend-label">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table table_col col">
                    {/* <TableContainer component={Paper}> */}
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Employee ID</TableCell>
                          <TableCell>Employee Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Total Hours</TableCell>
                          <TableCell>Work Hours</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.totalHours}</TableCell>
                            <TableCell>{row.workHours}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {/* </TableContainer> */}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/*--------------------------------------------------- Employee------------------------------------------------- */}
          {selectedOption === "Employee" && (
            <div>
            <div className="dashboard_timesheet_head ms-3">
              <div className="summary gap-5">
                <div className="summary-item">
                  <span className="icon">⏱️</span>
                  <span className="label">Total Employees</span>
                  <span className="value">{employeeCounts}</span>
                </div>
                <div className="summary-item">
                  <span className="icon">✅</span>
                  <span className="label">Active Counts</span>
                  <span className="value">{activeCounts}</span>
                </div>
                <div className="summary-item">
                  <span className="icon">📝</span>
                  <span className="label">In-Active Counts</span>
                  <span className="value">{inactiveCounts}</span>
                </div>
              </div>
              <div>
                <div className="summary-item">
                  <select
                    className="dashboard_select"
                    onChange={handleChange}
                    value={selectedOption}
                  >
                    <option value="Timesheet">Timesheet</option>
                    <option value="Employee">Employee</option>
                    <option value="Project">Project</option>
                    <option value="Task">Task</option>
                    <option value="Client">Client</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row d-flex chart_and_table ms-3">
              <div className="charts col-md-6">
                <div className="chart-container">
                  <h4>Employee Dashboard</h4>
                  <div className="chart-wrapper">
                    <div className="bar-chart px-5">
                      <Bar
                        data={barChartDataEmployee}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>

                  <div className="doughnut-legend-container">
                    <div className="doughnut-chart">
                      <Doughnut
                        data={doughnutChartDataEmployee}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          cutout: "70%", // Adjust the cutout percentage to decrease the ring width
                          plugins: {
                            legend: {
                              display: false, // Disable the default legend
                            },
                          },
                        }}
                      />
                    </div>
                    <div className="chart-legend">
                      {legendDataemployee.map((item, index) => (
                        <div key={index} className="legend-item">
                          <span
                            className="legend-color"
                            style={{ backgroundColor: item.color }}
                          ></span>
                          <span className="legend-label">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="filter-container">
                  <input className="search_dashboard p-2"
                    type="text"
                    placeholder="Search ..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="table_emp ">
                  <Table className="table_dashboard">
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee ID</TableCell>
                        <TableCell>Employee Name</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
          )}
          {/*--------------------------------------------------- Project------------------------------------------------- */}
          {selectedOption === "Project" && (
            <div>
              <div className="dashboard_timesheet_head ms-3">
                <div className="summary gap-3">
                  <div className="summary-item">
                    <span className="icon">⏱️</span>
                    <span className="label">Total Projects</span>
                    <span className="value">{ProjectsCounts}</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">✅</span>
                    <span className="label">Completed project</span>
                    <span className="value">{activesCountsproject}</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">⏳</span>
                    <span className="label">In Progress </span>
                    <span className="value">{in_activesCountsproject}</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">❌</span>
                    <span className="label">Not Started</span>
                    <span className="value">{notstartedcount}</span>
                  </div>
                </div>
                <div>
                  <div className="summary-item">
                    <select onChange={handleChange} value={selectedOption}>
                      <option value="Timesheet">Timesheet</option>
                      <option value="Employee">Employee</option>
                      <option value="Project">Project</option>
                      <option value="Task">Task</option>
                      <option value="Client">Client</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="row d-flex chart_and_table ms-3">
                  <div className="charts col-md-6">
                    <div className="chart-container">
                      <h3>Project Dashboard </h3>
                      <div className="chart-wrapper">
                        <div className="bar-chart">
                          <Bar
                            data={barChartDataProject}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                x: {
                                  barPercentage: 0.5, // Adjust the bar width
                                  categoryPercentage: 0.5, // Adjust the category width
                                },
                              },
                            }}
                          />
                        </div>
                      </div>

                      <div className="doughnut-legend-container">
                        <div className="doughnut-chart">
                          <Doughnut
                            data={doughnutChartDataProject}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              cutout: "70%", // Adjust the cutout percentage to decrease the ring width
                              plugins: {
                                legend: {
                                  display: false, // Disable the default legend
                                },
                              },
                            }}
                          />
                        </div>
                        <div className="chart-legend">
                          {legendDataProject.map((item, index) => (
                            <div key={index} className="legend-item">
                              <span
                                className="legend-color"
                                style={{ backgroundColor: item.color }}
                              ></span>
                              <span className="legend-label">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                  <div className="filter-container">
                    <input className="search_dashboard p-2"
                      type="text"
                      placeholder="Search ..."
                      value={searchTermproject}
                      onChange={handleSearchproject}
                    />
                  </div>
                  <div className="table_emp ">
                    <Table className="table_dashboard">
                      <TableHead>
                        <TableRow>
                          <TableCell>Project ID</TableCell>
                          <TableCell>Project Name</TableCell>
                          <TableCell>Project Manager</TableCell>
                          <TableCell>Start Date</TableCell>
                          <TableCell>End Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredDataproject.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.manager}</TableCell>
                            <TableCell>{formatDate(row.startDate)}</TableCell>
                            <TableCell>{formatDate(row.endDate)}</TableCell>
                            {/* <TableCell>{row.startDate}</TableCell>
                            <TableCell>{row.endDate}</TableCell> */}
                            <TableCell>{row.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/*--------------------------------------------------- Task------------------------------------------------- */}

          {selectedOption === "Task" && (
            <div>
              <div className="dashboard_timesheet_head">
                <div className="summary">
                  <div className="summary-item">
                    <span className="icon">⏱️</span>
                    <span className="label">Total Task</span>
                    <span className="value">{taskCounts}</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">✅</span>
                    <span className="label">Completed Task</span>
                    <span className="value">{activesCountstask}</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">⏳</span>
                    <span className="label">In Progress </span>
                    <span className="value">{in_activesCountstask}</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">❌</span>
                    <span className="label">Not Started</span>
                    <span className="value">{notstartedcounttask}</span>
                  </div>
                </div>
                <div>
                  <div className="summary-item">
                    <select onChange={handleChange} value={selectedOption}>
                      <option value="Timesheet">Timesheet</option>
                      <option value="Employee">Employee</option>
                      <option value="Project">Project</option>
                      <option value="Task">Task</option>
                      <option value="Client">Client</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="row d-flex chart_and_table">
                  <div className="charts col">
                    <div className="chart-container">
                      <h3>Task Dashboard </h3>
                      <div className="chart-wrapper">
                        <div className="bar-chart">
                          <Bar
                            data={barChartDataTaskzz}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                x: {
                                  barPercentage: 0.5, // Adjust the bar width
                                  categoryPercentage: 0.5, // Adjust the category width
                                },
                              },
                            }}
                          />
                        </div>
                      </div>

                      <div className="doughnut-legend-container">
                        <div className="doughnut-chart">
                          <Doughnut
                            data={doughnutChartDataTask}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              cutout: "70%", // Adjust the cutout percentage to decrease the ring width
                              plugins: {
                                legend: {
                                  display: false, // Disable the default legend
                                },
                              },
                            }}
                          />
                        </div>
                        <div className="chart-legend">
                          {legendDataTask.map((item, index) => (
                            <div key={index} className="legend-item">
                              <span
                                className="legend-color"
                                style={{ backgroundColor: item.color }}
                              ></span>
                              <span className="legend-label">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table table_col col">
                    {/* <TableContainer component={Paper}> */}
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Task ID</TableCell>
                          <TableCell>Task Name</TableCell>
                          <TableCell>Project Name</TableCell>
                          <TableCell>Start Date</TableCell>
                          <TableCell>End Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableDataTask.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.projectName}</TableCell>
                            <TableCell>{formatDate(row.startDate)}</TableCell>
                            <TableCell>{formatDate(row.endDate)}</TableCell>
                            {/* <TableCell>{row.startDate}</TableCell>
                            <TableCell>{row.endDate}</TableCell> */}
                            <TableCell>{row.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*--------------------------------------------------- Client------------------------------------------------- */}
          {selectedOption === "Client" && (
            <div>
              <div className="dashboard_timesheet_head">
                <div className="summary">
                  <div className="summary-item">
                    <span className="icon">⏱️</span>
                    <span className="label">Total customer</span>
                    <span className="value">{clientCounts}</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">✅</span>
                    <span className="label">Active Customer</span>
                    <span className="value">{activesCountclient}</span>
                  </div>
                  <div className="summary-item">
                    <span className="icon">⏳</span>
                    <span className="label">In Active</span>
                    <span className="value">{inactivecountclient}</span>
                  </div>
                </div>
                <div>
                  <div className="summary-item">
                    <select onChange={handleChange} value={selectedOption}>
                      <option value="Timesheet">Timesheet</option>
                      <option value="Employee">Employee</option>
                      <option value="Project">Project</option>
                      <option value="Task">Task</option>
                      <option value="Client">Client</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="row d-flex chart_and_table">
                  <div className="charts col">
                    <div className="chart-container">
                      <h3>Customers Dashboard </h3>
                      <div className="chart-wrapper">
                        <div className="bar-chart">
                          <Bar
                            data={barChartDataClientzz}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                x: {
                                  barPercentage: 0.5, // Adjust the bar width
                                  categoryPercentage: 0.5, // Adjust the category width
                                },
                              },
                            }}
                          />
                        </div>
                      </div>

                      <div className="doughnut-legend-container">
                        <div className="doughnut-chart">
                          <Doughnut
                            data={doughnutChartDataClient}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              cutout: "70%", // Adjust the cutout percentage to decrease the ring width
                              plugins: {
                                legend: {
                                  display: false, // Disable the default legend
                                },
                              },
                            }}
                          />
                        </div>
                        <div className="chart-legend">
                          {legendDataClient.map((item, index) => (
                            <div key={index} className="legend-item">
                              <span
                                className="legend-color"
                                style={{ backgroundColor: item.color }}
                              ></span>
                              <span className="legend-label">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table table_col col">
                    {/* <TableContainer component={Paper}> */}
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Customer ID</TableCell>
                          <TableCell>Customer Name</TableCell>
                          <TableCell>Email Id </TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableDataclient.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MainComponent;
