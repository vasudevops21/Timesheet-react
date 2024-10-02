import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Task.css";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import { IconButton } from "@mui/material";
import Select from "react-select";
import MUIDataTable from "mui-datatables";
import { Stack, Pagination, MenuItem, Menu, Dialog } from "@mui/material";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiUserThin } from "react-icons/pi";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { FormattedMessage } from "react-intl";
import { MdOutlineSpeakerNotes } from "react-icons/md";
import { MultiSelect } from "react-multi-select-component";
import { BiFilterAlt } from "react-icons/bi";
import PaginationItem from "@mui/material/PaginationItem";
import { Checkbox, FormControlLabel } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { useDateFormat } from "./DateFormatContext";
import DatePickerComponent from "./DatePickerComponent";

function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) =>
            theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

function Task({ locale, setLocale }) {
  const [taskid, settaskid] = useState("");
  const [taskname, setTaskname] = useState("");
  const [projectname, setProjectname] = useState("");
  const [assignemployees, setAssignemployees] = useState([]);
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [value, setValue] = React.useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [status, setStatus] = useState("");
  const [projectMap, setProjectMap] = useState({});
  const [filteredtasks, setFilteredTasks] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({
    taskid: "All",
    taskname: "All",
    projectname: "All",
    startdate: "All",
    startdate_p: "All",
    enddate: "All",
  });
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const { dateFormat } = useDateFormat();

  const [projectStartDate, setProjectStartDate] = useState(null);
  const [projectEndDate, setProjectEndDate] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);



  useEffect(() => {
    if (selectedProjectName) {
      const project = projects.find(
        (p) => p.projectname === selectedProjectName
      );
      if (project) {
        setProjectStartDate(new Date(project.startdate_p));
        setProjectEndDate(new Date(project.end_date_p));
      }
    }
  }, [selectedProjectName, projects]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskResponse, projectResponse] = await Promise.all([
          axios.get(
            process.env.REACT_APP_API_BASE_URL + "/api/v1/task/getAllTask"
          ),
          axios.get(
            process.env.REACT_APP_API_BASE_URL + "/api/v1/project/getAllProject"
          ),
        ]);
 
        // setTasks(taskResponse.data);
        // setProjects(projectResponse.data);
        // setFilteredTasks(taskResponse.data);

        if (Array.isArray(taskResponse.data)) {
          setTasks(taskResponse.data);
          setFilteredTasks(taskResponse.data);
        } else {
          console.error("Task response data is not an array:", taskResponse.data);
        }
 
        if (Array.isArray(projectResponse.data)) {
          setProjects(projectResponse.data);
        } else {
          console.error("Project response data is not an array:", projectResponse.data);
        }
 
        const map = {};
        projectResponse.data.forEach((project) => {
          map[project.projectid] = project.projectname;
        });
        setProjectMap(map);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const fetchEmployees = async (projectId) => {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_BASE_URL +
          `/api/v1/project/getAssignedEmployees/${projectId}`
      );
      return result.data.assignedEmployees;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  };

  useEffect(() => {
    if (selectedProjectName) {
      const projectId = Object.keys(projectMap).find(
        (key) => projectMap[key] === selectedProjectName
      );
      fetchEmployees(projectId)
        .then((employees) => {
          setAssignedEmployees(employees);
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
        });
    }
  }, [selectedProjectName, projectMap]);

  const handleProjectChange = (event) => {
    const projectName = event.target.value;
    if (errors.selectedProjectName) {
      setErrors((prevErrors) => ({ ...prevErrors, selectedProjectName: "" }));
    }
    setSelectedProjectName(projectName);
    setAssignemployees([]);
  };

  


  useEffect(() => {
    filterData();
  }, [selectedOptions]);

  useEffect(() => {
    const totalItems = tasks.length;
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const newFilteredTasks = tasks.slice(firstItemIndex, lastItemIndex);

    setFilteredTasks(newFilteredTasks);
  }, [tasks, currentPage, itemsPerPage]);

  const filterData = () => {
    let filteredData = tasks.filter((item) => {
      return (
        (selectedOptions.taskid === "All" ||
          item.taskid === selectedOptions.taskid) &&
        (selectedOptions.taskname === "All" ||
          item.taskname === selectedOptions.taskname) &&
        (selectedOptions.projectname === "All" ||
          item.projectname === selectedOptions.projectname) &&
        (selectedOptions.startdate === "All" ||
          item.startdate === selectedOptions.startdate) &&
        (selectedOptions.enddate === "All" ||
          item.enddate === selectedOptions.enddate)
      );
    });

    setFilteredTasks(filteredData); // Update filteredProjects state
  };

  const handleFilterChange = (columnName, selectedValue) => {
    const value = selectedValue ? selectedValue.value : "All"; // Set to "All" if selectedValue is null
    setSelectedOptions({
      ...selectedOptions,
      [columnName]: value,
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    if (dateFormat === "dd/mm/yyyy") {
      return `${day}/${month}/${year}`;
    } else if (dateFormat === "mm/dd/yyyy") {
      return `${month}/${day}/${year}`;
    }
    return date;
  };

  const parseDate = (formattedDate) => {
    if (!formattedDate) return "";
    const [part1, part2, part3] = formattedDate.split("/");
    if (dateFormat === "dd/mm/yyyy") {
      return `${part3}-${part2}-${part1}`;
    } else if (dateFormat === "mm/dd/yyyy") {
      return `${part3}-${part1}-${part2}`;
    }
    return formattedDate;
  };

  const handleReset = () => {
    setSelectedOptions({
      taskid: "All",
      taskname: "All",
      projectname: "All",
      startdate: "All",
      startdate_p: "All",
      enddate: "All",
    });
  };

  // Add 'All' option as the default option
  const taskidOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(tasks.map((item) => item.taskid))).map((taskid) => ({
      value: taskid,
      label: taskid,
    })),
  ];

  const tasknameOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(tasks.map((item) => item.taskname))).map(
      (taskname) => ({
        value: taskname,
        label: taskname,
      })
    ),
  ];

  const projectnameOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(tasks.map((item) => item.projectname))).map(
      (projectname) => ({
        value: projectname,
        label: projectname,
      })
    ),
  ];

  const startdateOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(tasks.map((item) => item.startdate))).map(
      (startdate) => ({
        value: startdate,
        label: startdate,
      })
    ),
  ];

  const enddateOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(tasks.map((item) => item.enddate))).map(
      (enddate) => ({
        value: enddate,
        label: enddate,
      })
    ),
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTaskNameChange = (e) => {
    setTaskname(e.target.value);
    if (errors.taskname) {
      setErrors((prevErrors) => ({ ...prevErrors, taskname: "" }));
    }
  };

 

  const handleStartDateChange = (date) => {
    setStartdate(date);
    if (errors.startdate) {
      setErrors((prevErrors) => ({ ...prevErrors, startdate: "" }));
    }
  };

  const handleEndDateeChange = (date) => {
    setEnddate(date);
    if (errors.enddate) {
      setErrors((prevErrors) => ({ ...prevErrors, enddate: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };

    if (!taskname.trim()) {
      errorsCopy.taskname = <FormattedMessage id="Task Name Required" />;
      valid = false;
    } else {
      errorsCopy.taskname = "";
    }

    if (!selectedProjectName.trim()) {
      errorsCopy.selectedProjectName = (
        <FormattedMessage id="project Name Required" />
      );
      valid = false;
    } else {
      errorsCopy.selectedProjectName = "";
    }

    if (!startdate.trim()) {
      errorsCopy.startdate = (
       "Start Date Required"
      );
      valid = false;
    } else {
      errorsCopy.startdate = "";
    }

    if (!enddate.trim()) {
      errorsCopy.enddate = (
          "End Date Required"
      );
      valid = false;
    } else {
      errorsCopy.enddate = "";
    }

    setErrors(errorsCopy);
    return valid;
  };




  async function save(event) {
    event.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      return;
    }
    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/task/save",
        {
          taskname: taskname,
          projectname: selectedProjectName,
          assignedEmployees: assignemployees,
          startdate: startdate,
          enddate: enddate,
          status: status,
          description: description,
        }
      );
      toast("Task created successfully");
      setTaskname("");
      setAssignemployees([]);
      setStartdate("");
      setEnddate("");
      setStatus("");
      setDescription("");
      setSelectedProjectName("");
      getData(""); // Reset the selected project ID after successful save
      const modal = document.getElementById("exampleModalCenter");
    modal.classList.remove("show");
    modal.style.display = "none";
    } catch (err) {
      toast("Task creation failed");
    }
  }

  async function editTask(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }
    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/task/update",
        {
          taskid: editingTask.taskid,
          taskname: taskname,
          projectname: selectedProjectName, // Use the selected project ID
          assignedEmployees: assignemployees,
          startdate: startdate,
          enddate: enddate,
          status: status,
          // startdate: startdate,
          // enddate: enddate,
          description: description,
        }
      );

      setFilteredTasks((prevFilteredTasks) =>
        prevFilteredTasks.map((task) =>
          task.taskid === editingTask.taskid
            ? {
                ...task,
                taskname: taskname,
                projectName: selectedProjectName,
                // assignedEmployees: assignemployees,
                assignedEmployees: assignemployees.map((item) => ({
                  firstname: item.label,
                  employeeId: item.id,
                })),
                startdate: startdate,
                enddate: enddate,
                status: status,
                description: description,
              }
            : task
        )
      );

      toast.success("Task has been updated successfully");
      handleCloseEditModal();
    } catch (err) {
      toast.error("Task updation faild");
    }
  }

  const handleCloseEditModal = () => {
    setEditingTask(null);
    setTaskname("");
    setAssignemployees([]);
    setStartdate("");
    setEnddate("");
    setStatus("");
    setDescription("");
    setSelectedProjectName("");
    setErrors({
      taskname: "",
    selectedProjectName: "",
    startdate: "",
    enddate:"",
    });
    const modal = document.getElementById("editModal");
    modal.classList.remove("show");
    modal.style.display = "none";
  };

  const openEditModal = (tasks) => {
    setEditingTask(tasks);
    setTaskname(tasks.taskname);
    setSelectedProjectName(tasks.projectName);

    setAssignemployees(
      tasks.assignedEmployees.map((item) => ({
        value: item.employeeId,
        label: `${item.firstname} ${item.lastname}`,
        id: item.employeeId,
      }))
    );
    setStartdate(tasks.startdate);
    setEnddate(tasks.enddate);
    setStatus(tasks.status);
    setDescription(tasks.description);

    const modal = document.getElementById("editModal");
    modal.classList.add("show");
    modal.style.display = "block";
  };

  const resetForm = () => {
    setTaskname("");
    setAssignemployees([]);
    setStartdate("");
    setEnddate("");
    setStatus("");
    setDescription("");
    setSelectedProjectName("");
    setErrors({
      taskname: "",
    selectedProjectName: "",
    startdate: "",
    enddate:"",
    });
  };

  const [errors, setErrors] = useState({
    taskname: "",
    selectedProjectName: "",
    startdate: "",
    enddate:"",
  });


  // const getData = async () => {
  //   try {
  //     // Fetch tasks and projects together
  //     const [taskResponse, projectResponse] = await Promise.all([
  //       axios.get(
  //         process.env.REACT_APP_API_BASE_URL + "/api/v1/task/getAllTask"
  //       ),
  //       axios.get(
  //         process.env.REACT_APP_API_BASE_URL + "/api/v1/project/getAllProject"
  //       ),
  //     ]);

  //     // Set tasks and projects data
  //     setTasks(taskResponse.data);
  //     setProjects(projectResponse.data);
  //     setFilteredTasks(taskResponse.data);

  //     // Create a map of project ids to project names
  //     const map = {};
  //     projectResponse.data.forEach((project) => {
  //       map[project.projectid] = project.projectname;
  //     });
  //     setProjectMap(map);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false); // Set loading to false when data fetching is complete
  //   }
  // };

  const getData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_BASE_URL + "/api/v1/task/getAllTask");
      if (Array.isArray(response.data)) {
        setTasks(response.data);
        setFilteredTasks(response.data);
      } else {
        console.error("Fetched data is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
          setLoading(false); // Set loading to false when data fetching is complete
        }
  };



  const getProject = async () => {
    try {
      
      const response = await axios.get(process.env.REACT_APP_API_BASE_URL + "/api/v1/project/getAllProject");

      if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        console.error("Project response data is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } 
  };

  useEffect(() => {
    getData();
  }, [status]);




  useEffect(() => {
    const fetchData = async () => {
      await getData();
      await getProject();
    };
    fetchData();
  }, []);

  const handleRowSelectionChange = (rowsSelectedData, allRowsSelectedData) => {
    const selectedIds = allRowsSelectedData.map((row) => {
      const rowIndex = row.dataIndex;
      return filteredtasks[rowIndex].taskid;
    });
    setSelectedRows(selectedIds);
  };

  const options = {
    textLabels: {
      body: {
        noMatch: "",
        toolTip: "Sort",
        columnHeaderTooltip: (column) => `Sort for ${column.label}`,
      },
    },
    tableBodyHeight: "430px",
    pagination: false,
    filter: false,
    responsive: "scroll",
    onRowSelectionChange: handleRowSelectionChange,
    rowsSelected: filteredtasks
    .map((row, index) => (selectedRows.includes(row.taskid) ? index : -1))
    .filter((index) => index !== -1),
    onRowsDelete: async (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data.map(
        (row) => tasks[(currentPage - 1) * itemsPerPage + row.dataIndex].taskid
      );
      try {
        await Promise.all(
          idsToDelete.map((taskid) =>
            axios.delete(
              process.env.REACT_APP_API_BASE_URL +
                `/api/v1/task/delete/${taskid}`
            )
          )
        );
        getData(); // Reload data after deletion
        toast("Task Deleted successfully");
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    },

    customHeadCellStyle: {
      fontSize: "16px", // Adjust the font size for table headers
    },
    customBodyCellStyle: {
      fontSize: "14px", // Adjust the font size for table body cells
    },

    download: false, // Disable default download button
    print: false,
    viewColumns: false,
    search: false,
    responsive: "standard", // Make the table responsive
    resizableColumns: false, // Disable default print button
    customToolbar: () => (
      <>
        {isSearchOpen && (
          <div className="d-flex me-2">
            <input
              className="search_input mx-2"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            ></input>
            <SearchIcon className="custom_search_icon filter_btn" />
            <IconButton
              onClick={handleSearchClose}
              className="custom_search_close_icon bg-white"
            >
              <CloseIcon />
            </IconButton>
          </div>
        )}

        <button
          onClick={handleSearchClick}
          className={`filter_btn border-none bg-white px-2 ${
            isSearchOpen ? "d-none d-sm-block" : ""
          }`}
        >
          <SearchIcon />
        </button>

        <button
          className={`filter_btn border-none bg-white pe-2 ${
            isSearchOpen ? "d-none d-sm-block" : ""
          }`}
          onClick={handleClick}
        >
          <HiOutlineAdjustmentsHorizontal className="fs-4" />
        </button>

        <button
          className={`filter_btn border-none bg-white px-2 ${
            isSearchOpen ? "d-none d-sm-block" : ""
          }`}
          type="button"
          data-toggle="modal"
          data-target="#filter"
        >
          <BiFilterAlt className="fs-4" />
        </button>

        {/* <button
          className={`filter_btn border-none bg-white px-2 ${
            isSearchOpen ? "d-none d-sm-block" : ""
          }`}
          onClick={handleDownloadClick}
        >
          <GetAppIcon />
        </button> */}
      </>
    ),
  };

  const columns = [
    // {
    //   name: "taskid",
    //   label: "Task ID",
    //   options: {
    //     setCellProps: () => ({
    //       align: "center",
    //     }),
    //     setCellHeaderProps: (value) => ({
    //       className: "centeredHeaderCell",
    //       style: { whiteSpace: "nowrap" },
    //     }),
    //   },
    // },
    {
      name: "taskname",
      label: "Task Name",
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
      },
    },
    {
      name: "projectName",
      label: "Project Name",
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        customBodyRender: (value, tableMeta, updateValue) => {
          return renderNestedProperty(value);
        },
      },
    },
    {
      name: "startdate",
      label: "Start Date",
      options: {
        customBodyRender: (value) => formatDate(value),
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
      },
    },
    {
      name: "enddate",
      label: "End Date",
      options: {
        customBodyRender: (value) => formatDate(value),
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
      },
    },
    {
      name: "assignedEmployees",
      label: "Assign Employees",
      options: {
        setCellProps: () => ({ align: "center" }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        customBodyRender: (value, tableMeta, updateValue) => {
          const EmployeePopup = ({ employees }) => {
            const [openDropdown, setOpenDropdown] = React.useState(false);
            const [searchTerm, setSearchTerm] = React.useState("");

            const filteredEmployees = employees.filter((employee) =>
              `${employee.firstname} ${employee.lastname}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            );

            return (
              <div style={{ position: "relative", display: "inline-block" }}>
                <Popup
                  trigger={
                    <div
                      onClick={() => setOpenDropdown(!openDropdown)}
                      style={{ cursor: "pointer" }}
                    >
                      {employees.length} <PiUserThin className="ms-2 fs-5" />
                    </div>
                  }
                  position="right center"
                  on={["hover", "focus"]}
                  offsetY={-10}
                  offsetX={20}
                  open={openDropdown}

                  // contentStyle={{ padding: "10px", maxHeight: "300px", overflowY: "auto" }}
                >
                  <div>
                    <input
                      className="assign_employees_search"
                      type="text"
                      placeholder="Search Employees"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: "5px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                    <div className="assign_employees_count">
                      {filteredEmployees.map((employee, index) => (
                        <div key={index} style={{ padding: "5px" }}>
                          <svg
                            className="assign_employees_icon me-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_4545_196)">
                              <path
                                d="M12 7.75C11.0054 7.75 10.0516 8.14509 9.34835 8.84835C8.64509 9.55161 8.25 10.5054 8.25 11.5C8.25 12.4946 8.64509 13.4484 9.34835 14.1517C10.0516 14.8549 11.0054 15.25 12 15.25C12.9946 15.25 13.9484 14.8549 14.6517 14.1517C15.3549 13.4484 15.75 12.4946 15.75 11.5C15.75 10.5054 15.3549 9.55161 14.6517 8.84835C13.9484 8.14509 12.9946 7.75 12 7.75ZM8 17.25C7.00544 17.25 6.05161 17.6451 5.34835 18.3483C4.64509 19.0516 4.25 20.0054 4.25 21V22.188C4.25 22.942 4.796 23.584 5.54 23.705C9.818 24.404 14.182 24.404 18.46 23.705C18.8201 23.6464 19.1476 23.4616 19.3839 23.1837C19.6202 22.9057 19.75 22.5528 19.75 22.188V21C19.75 20.0054 19.3549 19.0516 18.6517 18.3483C17.9484 17.6451 16.9946 17.25 16 17.25H15.66C15.475 17.25 15.291 17.28 15.116 17.336L14.25 17.619C12.788 18.0962 11.212 18.0962 9.75 17.619L8.884 17.336C8.70865 17.2789 8.5254 17.2499 8.341 17.25H8Z"
                                fill="black"
                                fill-opacity="0.5"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_4545_196">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <span className="ms-1">
                            {employee.firstname} {employee.lastname}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </div>
            );
          };

          return <EmployeePopup employees={value} />;
        },
      },
    },
    {
      name: "description",
      label: <FormattedMessage id="Description" />,
      options: {
        setCellProps: () => ({ align: "center" }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        customBodyRender: (value, tableMeta) => {
          const DescriptionPopup = ({ description }) => {
            const [openDropdown, setOpenDropdown] = React.useState(false);

            return (
              <div style={{ position: "relative", display: "inline-block" }}>
                <Popup
                  className="des"
                  trigger={
                    <div
                      onClick={() => setOpenDropdown(!openDropdown)}
                      style={{ cursor: "pointer" }}
                    >
                      <MdOutlineSpeakerNotes className="fs-4 text-secondary" />
                    </div>
                  }
                  position="left center"
                  on={["hover", "focus"]}
                  offsetY={-10}
                  offsetX={20}
                  open={openDropdown}
                >
                  {/* <div style={{ padding: "10px" }}>{value}</div> */}
                  <div className="project_description_popup">
                    <span className="ms-1">{value}</span>
                  </div>
                </Popup>
              </div>
            );
          };

          return <DescriptionPopup description={value} />;
        },
      },
    },
    {
      name: "status",
      label: <FormattedMessage id="status" />,
      options: {
        setCellProps: () => ({
          align: "center",
          style: { position: "sticky", right: 117 },
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap", position: "sticky", right: 117 },
        }),
      },
    },
    {
      name: "action",
      label: "Action",
      options: {
        setCellProps: () => ({
          align: "center",
          style: { position: "sticky", right: 0 },
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { position: "sticky", right: 0, letterSpacing: "2.8px" },
        }),
        customBodyRender: (value, tableMeta, updateValue) => {
          const originalIndex = calculateOriginalIndex(
            currentPage,
            tableMeta.rowIndex
          );

          const rowIndex = tableMeta.rowIndex;
          const rowData = filteredtasks[rowIndex];

          return (
            <button
              className="btn btn-sm project_edit_btn"
              data-bs-toggle="modal"
              data-bs-target="#editModal"
              onClick={() => openEditModal(rowData)}
            >
              <svg
                className="me-1"
                viewBox="0 0 24 24"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path d="M6 18.7V21a1 1 0 01-2 0v-5a1 1 0 011-1h5a1 1 0 110 2H7.1A7 7 0 0019 12a1 1 0 112 0 9 9 0 01-15 6.7zM18 5.3V3a1 1 0 012 0v5a1 1 0 01-1 1h-5a1 1 0 010-2h2.9A7 7 0 005 12a1 1 0 11-2 0 9 9 0 0115-6.7z" />
              </svg>
              Update
            </button>
          );
        },
      },
    },
  ];

  const calculateOriginalIndex = (currentPage, rowIndex) => {
    return (currentPage - 1) * itemsPerPage + rowIndex;
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset current page to 1 when changing items per page
  };

  const totalCount = tasks.length;

  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  const currentItems = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(tasks.length / itemsPerPage);
    const paginationItems = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <PaginationItem
            key={i}
            page={i}
            selected={i === currentPage}
            onClick={(e) => handlePageChange(e, i)}
          />
        );
      }
    } else {
      paginationItems.push(
        <PaginationItem
          key={1}
          page={1}
          selected={1 === currentPage}
          onClick={(e) => handlePageChange(e, 1)}
        />
      );

      if (currentPage > 4) {
        paginationItems.push(
          <PaginationItem key="start-ellipsis" disabled page="..." />
        );
      }

      for (
        let i = Math.max(2, currentPage - 2);
        i <= Math.min(totalPages - 1, currentPage + 2);
        i++
      ) {
        paginationItems.push(
          <PaginationItem
            key={i}
            page={i}
            selected={i === currentPage}
            onClick={(e) => handlePageChange(e, i)}
          />
        );
      }

      if (currentPage < totalPages - 3) {
        paginationItems.push(
          <PaginationItem key="end-ellipsis" disabled page="..." />
        );
      }

      paginationItems.push(
        <PaginationItem
          key={totalPages}
          page={totalPages}
          selected={totalPages === currentPage}
          onClick={(e) => handlePageChange(e, totalPages)}
        />
      );
    }

    return paginationItems;
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [visibleColumns_task, setVisibleColumns] = useState(() => {
    const allColumns = Array.from(Array(columns.length).keys());
    // Load from sessionStorage or localStorage
    const storedColumns = localStorage.getItem("visibleColumns_task");
    return storedColumns ? JSON.parse(storedColumns) : allColumns;
  });

  const handleResetAll = () => {
    setVisibleColumns(columns.map((_, index) => index));
  };

  useEffect(() => {
    // Save to sessionStorage or localStorage whenever visibleColumns changes
    localStorage.setItem(
      "visibleColumns_task",
      JSON.stringify(visibleColumns_task)
    );
  }, [visibleColumns_task]);

  const handleColumnVisibilityChange = (columnIndex) => {
    setVisibleColumns((prevVisibleColumns) => {
      if (prevVisibleColumns.includes(columnIndex)) {
        return prevVisibleColumns.filter((index) => index !== columnIndex);
      } else {
        return [...prevVisibleColumns, columnIndex];
      }
    });
  };

  const filteredColumns = columns.map((column, index) => ({
    ...column,
    options: {
      ...column.options,
      display: visibleColumns_task.includes(index),
    },
  }));

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);

    setSearchTerm(""); // Clear the search term
    setFilteredTasks(filteredtasks); // Reset the filtered data
    // getData();
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toString().toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = tasks.filter((row) => {
      return Object.entries(row).some(([key, value]) => {
        if (key === "projectname" && value) {
          // Debugging: log the value of projectname
          console.log("projectname value:", value);

          if (Array.isArray(value)) {
            return value.some((project) => {
              if (project && project.projectname) {
                return project.projectname.toLowerCase().includes(searchValue);
              }
              return false;
            });
          } else if (value && typeof value === "object" && value.projectname) {
            // Handle case if projectname is not an array but a nested object
            return value.projectname.toLowerCase().includes(searchValue);
          } else if (typeof value === "string") {
            // Handle case if projectname is a simple string
            return value.toLowerCase().includes(searchValue);
          }
          return false;
        } else {
          // Handle other columns
          return (
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchValue)
          );
        }
      });
    });
    setFilteredTasks(filteredData);
  };

  const renderNestedProperty = (value) => {
    if (value && typeof value === "object") {
      // Access nested property
      return value.project;
    }
    return value;
  };


  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000} // 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div>
        <Topbar locale={locale} setLocale={setLocale} />
        <div className="d-flex">
          <Sidebar locale={locale} setLocale={setLocale} />
          <div className="project-margin ">
            <div className="d-flex justify-content-between mt-3">
              <div>
                <Box
                  sx={{ width: "100%", typography: "body1" }}
                  className="ms-5"
                >
                  <TabContext value={value}>
                    <Box>
                      <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab
                          label="Project"
                          value="2"
                          component={Link}
                          to="/project"
                        />
                        <Tab
                          label="Task"
                          value="1"
                          component={Link}
                          to="/project/task"
                        />
                      </TabList>
                    </Box>
                  </TabContext>
                </Box>
              </div>
              <div className="me-5 mt-1">
                <button
                  type="button"
                  className="project_add_btn pe-3"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalCenter"
                  onClick={resetForm}
                >
                  <i className="icon_project fas fa-plus py-2 ps-3 pe-3 me-2"></i>
                  Add Task
                </button>
              </div>
            </div>

            <div
              className="modal fade project_popup"
              id="exampleModalCenter"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered modal-xl"
                role="document"
              >
                <div className="modal-content rounded-5 shadow-lg">
                  <div className="d-flex justify-content-between ms-5 me-5 mt-4 ">
                    <p
                      className="popup_header modal-title font-weight-bold"
                      id="exampleModalLongTitle"
                    >
                      ADD TASK
                    </p>
                    <button
                      type="button"
                      className="close "
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={resetForm}
                    >
                      <svg
                        className="close project_close_btn"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 18L18 6M18 18L6 6"
                          stroke="#F8F8F8"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="popup_sub mt-2 ms-5">PLEASE FILL OUT DETAILS</p>
                  <hr className="hr ms-5"></hr>
                  <div className="modal-body">
                    <div className=" ms-4 me-4">
                      <form onSubmit={save} className="">
                        {/* <form className=""> */}
                        <div className=" d-flex row">
                          <div className="form-group col-md-4 mt-3">
                            <label
                              htmlFor="projectname"
                              className="custom_badge"
                            >
                              Task Name
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              autoComplete="off"
                              // className="form-control custom_input-project"
                              className={`form-control custom_input-project ${
                                errors.taskname ? "is-invalid" : ""
                              }`}
                              type="text"
                              id="taskname"
                              value={taskname}
                              placeholder="Task Name"
                              // onChange={(event) => {
                              //   setTaskname(event.target.value);
                              // }}
                              onChange={handleTaskNameChange}
                            />
                               {errors.taskname && (
                              <div className="invalid-feedback">
                                {errors.taskname}
                              </div>
                              )}
                          </div>

                          <div className="form-group col-md-4 mt-3">
                            <label
                              htmlFor="clientname"
                              className="custom_badge"
                            >
                              Project Name
                              <span className="text-danger">*</span>
                            </label>

                            <select
                              // className="form-select custom_input-project"
                              className={`form-select custom_input-project ${
                                errors.selectedProjectName ? "is-invalid" : ""
                              }`}
                              id="Project"
                              value={selectedProjectName}
                              onChange={handleProjectChange}
                            >
                              <option value="">Select Project</option>
                              {projects.map((project) => (
                                <option
                                  key={project.projectid}
                                  value={project.projectname}
                                >
                                  {project.projectname}
                                </option>
                              ))}
                            </select>
                            {errors.selectedProjectName && (
                              <div className="invalid-feedback">
                                {errors.selectedProjectName}
                              </div>
                            )}
                          </div>

                          <div className="form-group col-md-4 mt-3 multiselect_assign_employees">
                            <label
                              htmlFor="assigneeemployees"
                              className="custom_badge2"
                            >
                              Assign Employees
                            </label>

                            <MultiSelect
                              className="multiselect_input"
                              options={assignedEmployees.map((employee) => ({
                                value: employee.employeeId,
                                label: `${employee.firstname} ${employee.lastname}`,
                                id: employee.employeeId,
                              }))}
                              value={assignemployees}
                              onChange={setAssignemployees}
                              labelledBy="Select"
                              overrideStrings={{
                                allItemsAreSelected:
                                  "All Employees are selected...",
                              }}
                            />
                          </div>
                        </div>

                        <div className="d-flex row">
                          <div className="form-group col-md-4 mt-3">
                            <label
                              htmlFor="startdate"
                              // className="custom_badge custom_date_format_label"
                              className={` custom_badge custom_date_format_label  ${
                                errors.startdate ? "is-invalid" : ""
                              }`}
                            >
                              <FormattedMessage id="startDate" />
                              <span className="text-danger">*</span>
                            </label>
                            <DatePickerComponent
                              selectedDate={startdate}
                              // onDateChange={(date) => setStartdate(date)}
                              onDateChange={handleStartDateChange}
                              error={!!errors.startdate}
                              minDate={projectStartDate}
                              maxDate={projectEndDate}
                            />
                              {errors.startdate && (
                              <div className="error-message">
                                {errors.startdate}
                              </div>
                            )}
                          </div>

                          <div className="form-group col-md-4 mt-3">
                            <label
                              htmlFor="enddate"
                              // className="custom_badge custom_date_format_label"
                              className={` custom_badge custom_date_format_label  ${
                                errors.enddate ? "is-invalid" : ""
                              }`}
                            >
                              <FormattedMessage id="endDate" />
                              <span className="text-danger">*</span>
                            </label>
                            <DatePickerComponent
                              selectedDate={enddate}
                              // onDateChange={(date) => setEnddate(date)}
                              onDateChange={handleEndDateeChange}
                              error={!!errors.enddate}
                              minDate={projectStartDate}
                              maxDate={projectEndDate}
                            />
                             {errors.enddate && (
                              <div className="error-message">
                                {errors.enddate}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="d-flex row">
                          <div className="form-group col-md-8 mt-3">
                            <label
                              htmlFor="description_p"
                              className="custom_badge"
                            >
                              Description
                            </label>
                            <textarea
                              className="form-control custom_input-project"
                              type="textarea"
                              id="description_p"
                              value={description}
                              onChange={(event) => {
                                setDescription(event.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="d-flex gap-3 mb-4">
                          <div className="col-md-6 text-end">
                            <button
                              type="submit"
                              className="project_add_button py-2 px-4 border-none"
                              // data-bs-dismiss="modal"
                              onClick={save}
                            >
                              <i className="icon_project_add fas fa-plus border-1 rounded-circle border-white me-3"></i>
                              Add
                            </button>
                          </div>
                          <div className="col-md-6 text-start">
                            <button
                              type="button"
                              className="project_cancel_button py-2 px-4 "
                              data-bs-dismiss="modal"
                              onClick={resetForm}
                            >
                              <i className="icon_project_cancel fas fa-times border-1 rounded-circle border-danger me-2"></i>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="task_table mx-5">
              <div>
                <div className="mui-datatable-container">
                  {loading && (
                    <div className="loading-container">
                      <FacebookCircularProgress />
                    </div>
                  )}
                  <MUIDataTable
                    className="mui_task mt-4"
                    data={filteredtasks}
                    columns={filteredColumns}
                    // options={options}
                    options={{
                      ...options,
                      onRowSelectionChange: handleRowSelectionChange,
                      rowsSelected: filteredtasks
                        .map((row, index) =>
                          selectedRows.includes(row.taskid) ? index : -1
                        )
                        .filter((index) => index !== -1),
                    }}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <div className="ms-4 mt-2">
                  <p>
                    Total Record Count:
                    {totalCount}
                  </p>{" "}
                  {/* Display the total count of rows */}
                </div>
                <div className="d-flex">
                  <div className="me-5  ">
                    <select
                      className="p-2 count "
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                    >
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                    </select>
                  </div>

                  <Stack spacing={1}>
                    <Pagination
                      count={Math.ceil(tasks.length / itemsPerPage)}
                      page={currentPage}
                      onChange={handlePageChange}
                      renderItem={(item) => (
                        <PaginationItem
                          component="div"
                          {...item}
                          selected={item.page === currentPage}
                        />
                      )}
                    />
                  </Stack>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade project_popup"
        id="editModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-xl"
          role="document"
        >
          <div className="modal-content rounded-5 shadow-lg">
            <div className="d-flex justify-content-between ms-5 me-5 mt-4 ">
              <p
                className="popup_header modal-title font-weight-bold"
                id="exampleModalLongTitle"
              >
                Edit Task
              </p>
              <button
                type="button"
                className="close "
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetForm}
              >
                <svg
                  className="close project_close_btn"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 18L18 6M18 18L6 6"
                    stroke="#F8F8F8"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="popup_sub mt-2 ms-5">PLEASE FILL OUT DETAILS</p>
            <hr className="hr ms-5"></hr>
            <div className="modal-body">
              <div className=" ms-4 me-4">
                <form onSubmit={editTask} className="">
                  {/* <form className=""> */}
                  <div className=" d-flex row">
                    <div className="form-group col-md-4 mt-3">
                      <label htmlFor="projectname" className="custom_badge">
                        Task Name
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        autoComplete="off"
                        className={`form-control custom_input-project ${
                          errors.taskname ? "is-invalid" : ""
                        }`}
                        type="text"
                        id="taskname"
                        value={taskname}
                        placeholder="Task Name"
                        onChange={handleTaskNameChange}
                      />
                          {errors.taskname && (
                              <div className="invalid-feedback">
                                {errors.taskname}
                              </div>
                              )}
                    </div>


                    <div className="form-group col-md-4 mt-3">
                      <label htmlFor="clientname" className="custom_badge">
                        Project Name
                        <span className="text-danger">*</span>
                      </label>

                      <select
                        className="form-select custom_input-project"
                        id="Project"
                        value={selectedProjectName}
                        onChange={handleProjectChange}
                      >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                          <option
                            key={project.projectid}
                            value={project.projectname}
                          >
                            {project.projectname}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-md-4 mt-3 multiselect_assign_employees">
                      <label
                        htmlFor="assigneeemployees"
                        className="custom_badge2"
                      >
                        Assign Employees
                      </label>

                      <MultiSelect
                        className="multiselect_input"
                        options={assignedEmployees.map((employee) => ({
                          value: employee.employeeId,
                          label: `${employee.firstname} ${employee.lastname}`,
                          id: employee.employeeId, // Unique identifier
                        }))}
                        value={assignemployees}
                        onChange={setAssignemployees}
                        labelledBy="Select"
                        overrideStrings={{
                          allItemsAreSelected: "All Employees are selected...",
                        }}
                      />
                    </div>
                  </div>

                  {/* <div className="d-flex row">
                    <div className="form-group col-md-4 mt-3">
                      <label htmlFor="startdate_p" className="custom_badge">
                        Start Date
                      
                      </label>
                      <input
                        className="form-control custom_input-project"
                        type="Date"
                        id="startdate_p"
                        value={startdate}
                        onChange={(event) => {
                          setStartdate(event.target.value);
                        }}
                      />
                    </div>

                    <div className="form-group col-md-4 mt-3">
                      <label htmlFor="end_date_p" className="custom_badge">
                        End Date
                      </label>
                      <input
                        className="form-control custom_input-project"
                        type="Date"
                        id="end_date_p"
                        value={enddate}
                        onChange={(event) => {
                          setEnddate(event.target.value);
                        }}
                      />
                    </div>
                  </div> */}
                  <div className="d-flex row">
                    <div className="form-group col-md-4 mt-3">
                      <label
                        htmlFor="startdate"
                        className="custom_badge custom_date_format_label"
                      >
                        <FormattedMessage id="startDate" />
                        <span className="text-danger">*</span>
                      </label>
                      <DatePickerComponent
                        selectedDate={startdate}
                        onDateChange={handleStartDateChange}
                        error={!!errors.startdate}
                        minDate={projectStartDate}
                        maxDate={projectEndDate}
                      />
                       {errors.startdate && <div className="error-message">{errors.startdate}</div>}
                    </div>

                    <div className="form-group col-md-4 mt-3">
                      <label
                        htmlFor="enddate"
                        className="custom_badge custom_date_format_label"
                      >
                        <FormattedMessage id="endDate" />
                        <span className="text-danger">*</span>
                      </label>
                      <DatePickerComponent
                        selectedDate={enddate}
                        onDateChange={handleEndDateeChange}
                        error={!!errors.enddate}
                        minDate={projectStartDate}
                        maxDate={projectEndDate}
                      />
                       {errors.enddate && <div className="error-message">{errors.enddate}</div>}
                    </div>
                  </div>
                  <div className="d-flex row">
                    <div className="form-group col-md-8 mt-3">
                      <label htmlFor="description" className="custom_badge">
                        Description
                      </label>
                      <textarea
                        className="form-control custom_input-project"
                        type="textarea"
                        id="description"
                        value={description}
                        onChange={(event) => {
                          setDescription(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-3 mb-4">
                    <div className="col-md-6 text-end">
                      <button
                        type="submit"
                        className="project_add_button py-2 px-4 border-none"
                    
                      >
                        <i className="icon_project_add fas fa-plus border-1 rounded-circle border-white me-3"></i>
                        Save Changes
                      </button>
                    </div>
                    <div className="col-md-6 text-start">
                      <button
                        type="button"
                        className="project_cancel_button py-2 px-4 "
                        data-bs-dismiss="modal"
                        onClick={handleCloseEditModal}
                      >
                        <i className="icon_project_cancel fas fa-times border-1 rounded-circle border-danger me-2"></i>
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="filter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content p-3">
            <div className="">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="">
                <div className="d-flex ">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label
                        htmlFor="projectidOptions"
                        className="custom_badge_filter"
                      >
                        Taskid:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={taskidOptions}
                      value={{
                        value: selectedOptions.taskid,
                        label: selectedOptions.taskid,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("taskid", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">Task Name:</label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={tasknameOptions}
                      value={{
                        value: selectedOptions.taskname,
                        label: selectedOptions.taskname,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("taskname", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        Project Name:
                      </label>
                    </div>
                     <Select
                      className="custom_input_filter"
                      options={projectnameOptions}
                      value={{
                        value: selectedOptions.projectname,
                        label: selectedOptions.projectname,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("projectname", selectedValue)
                      }
                      isClearable
                    /> 
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">Start Date:</label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={startdateOptions}
                      value={{
                        value: selectedOptions.startdate,
                        label: selectedOptions.startdate,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("startdate", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">End Date:</label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={enddateOptions}
                      value={{
                        value: selectedOptions.enddate,
                        label: selectedOptions.enddate,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("enddate", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>
                <div className="mt-4 ms-3">
                  <button className="btn filter_btn" onClick={handleReset}>
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Menu
        className="custom_filter_column"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <p className="ms-3">View Columns</p>
        {columns.map((column, columnIndex) => (
          <MenuItem key={columnIndex}>
            <FormControlLabel
              className="custom_filter_menu"
              control={
                <Checkbox
                  checked={visibleColumns_task.includes(columnIndex)}
                  onChange={() => handleColumnVisibilityChange(columnIndex)}
                />
              }
              label={column.label}
            />
          </MenuItem>
        ))}
        <MenuItem>
          <button
            className="btn btn-sm mt-4 custom_filter_btn"
            onClick={handleResetAll}
          >
            Reset All
          </button>
        </MenuItem>
      </Menu>
    </>
  );
}

export default Task;
