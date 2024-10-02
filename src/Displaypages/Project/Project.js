import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { IconButton } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import "./Project.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BiFilterAlt } from "react-icons/bi";
import { Stack, Pagination, MenuItem, Menu, Dialog, Box } from "@mui/material";
import Select, { components } from 'react-select';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormattedMessage } from "react-intl";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { PiUserThin } from "react-icons/pi";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { Link } from "react-router-dom";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { MdOutlineSpeakerNotes } from "react-icons/md";
import { MultiSelect } from "react-multi-select-component";
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

function Projects({ locale, setLocale }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAddEmployeePopup, setOpenAddEmployeePopup] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [projectid, setprojectid] = useState("");
  const [projectname, setprojectname] = useState("");
  const [clientname, setclientname] = useState([]);
  const [projectManager, setprojectManager] = useState("");
  const [assigneeemployees, setassigneeemployees] = useState([]);
  const [startdate_p, setstartdate_p] = useState("");
  const [end_date_p, setend_date_p] = useState("");
  const [description_p, setdescription_p] = useState("");
  const [email, setEmail] = useState("");
  const [Projects, setProjects] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [Clients, setClients] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [option, setOption] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [status, setStatus] = useState("");
  const [projectcost, setprojectcost] = useState("");
  const [cummulativeHours, setcummulativeHours] = useState("");
  const [billableStatus, setBillableStatus] = useState("");
  const [value, setValue] = React.useState("1");
  const [editingClient, setEditingClient] = useState(null);
  const endpoint =
    process.env.REACT_APP_API_BASE_URL + "/api/v1/project/getAllProject";
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dateFormat } = useDateFormat();
  const [projectManagers, setProjectManagers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [team , setTeam] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [useTeams, setUseTeams] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
const [teamMembers, setTeamMembers] = useState({});

  const [selectedOptions, setSelectedOptions] = useState({
    projectidnumber: "All",
    projectname: "All",
    Clients: "All",
    projectManager: "All",
    startdate_p: "All",
    end_date_p: "All",
    billablestatus: "All",
    projectcost: "All",
    cummulativeHours: "All",
  });

  const resetForm = () => {
    setprojectid("");
    setprojectname("");
    setclientname([]);
    setprojectManager("");
    setassigneeemployees([]);
    setstartdate_p("");
    setend_date_p("");
    setdescription_p("");
    setStatus("");
    setBillableStatus("");
    setprojectcost("");
    setcummulativeHours("");
    setSelectedTeams([]);
    setErrors({
      projectname: "",
      clientname: "",
      projectManager: "",
      startdate_p: "",
      end_date_p: "",
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

  const totalCount = Projects.length;

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const [errors, setErrors] = useState({
    projectname: "",
    clientname: "",
    projectManager: "",
    startdate_p: "",
    end_date_p: "",
  });

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };

    if (!projectname.trim()) {
      errorsCopy.projectname = <FormattedMessage id="project Name Required" />;
      valid = false;
    } else {
      errorsCopy.projectname = "";
    }

    if (!projectManager.trim()) {
      errorsCopy.projectManager = (
        <FormattedMessage id="project Manager Required" />
      );
      valid = false;
    } else {
      errorsCopy.projectManager = "";
    }

    if (!startdate_p.trim()) {
      errorsCopy.startdate_p = "Start Date Required";
      valid = false;
    } else {
      errorsCopy.startdate_p = "";
    }

    if (!end_date_p.trim()) {
      errorsCopy.end_date_p = "End Date Required";
      valid = false;
    } else {
      errorsCopy.end_date_p = "";
    }

    setErrors(errorsCopy);
    return valid;
  };

  async function save(event) {
    event.preventDefault();

    let selectedClientNames = [];
    if (Array.isArray(clientname)) {
      selectedClientNames = clientname.map((option) => ({
        value: option.value,
        label: option.label,
        id: option.id,
      }));
    } else {
      // If only one client is selected, convert it into an array
      selectedClientNames.push({
        value: clientname.value,
        label: clientname.label,
        id: clientname.id,
      });
    }

  
    const isValid = validateForm();

    if (!isValid) {
      return;
    }
    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/project/save",
        {
          projectid: projectid,
          projectname: projectname,
          clientname: selectedClientNames,
          projectManager: projectManager,
          assigneeemployees: assigneeemployees,
          startdate_p: startdate_p,
          end_date_p: end_date_p,
          description_p: description_p,
          status: status,
          billablestatus: billableStatus,
          projectcost: projectcost,
          cummulativeHours: cummulativeHours,
          teamname: selectedTeams.map(team => ({
            value: team.value.toString(),
            label: team.label
          }))
        }
      );
      toast(
        <FormattedMessage id="projectRegistrationSuccess"></FormattedMessage>
      );
      setprojectid("");
      setprojectname("");
      setclientname([]);
      setprojectManager("");
      setassigneeemployees([]);
      setstartdate_p("");
      setend_date_p("");
      setdescription_p("");
      setStatus("");
      setBillableStatus("");
      setprojectcost("");
      setcummulativeHours("");
      getData("");
      const modal = document.getElementById("exampleModalCenter");
      modal.classList.remove("show");
      modal.style.display = "none";
    } catch (err) {
      toast(<FormattedMessage id="projectRegistrationFailed" />);
    }
  }

  async function editClient(event) {
    event.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      return;
    }
    
    try {
      let formattedClientNames = [];
      if (Array.isArray(clientname)) {
        formattedClientNames = clientname.map((option) => ({
          value: option.value,
          label: option.label,
          id: option.id,
        }));
      } else {
        formattedClientNames.push({
          value: clientname.value,
          label: clientname.label,
          id: clientname.id,
        });
      }


      const teamData = useTeams ? selectedTeams.map(team => ({
        value: team.value.toString(),
        label: team.label
      })) : [];

      

      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/project/update",
        {
          projectid: editingClient.projectid,
          projectname: projectname,
          clientname: formattedClientNames,
          projectManager: projectManager,
          assigneeemployees: assigneeemployees,
          startdate_p: startdate_p,
          end_date_p: end_date_p,
          description_p: description_p,
          status: status,
          billablestatus: billableStatus,
          projectcost: projectcost,
          cummulativeHours: cummulativeHours,
          teamname: teamData,
          useTeams: useTeams
        }
      );

      setFilteredProjects((prevFilteredprojects) =>
        prevFilteredprojects.map((project) =>
          project.projectid === editingClient.projectid
            ? {
                ...project,
                projectname: projectname,
                clientname: formattedClientNames.map((client) => ({
                  clientid: client.id,
                  clientsname: client.label,
                })),
                projectManager: projectManager,
                assigneeemployees: assigneeemployees.map((item) => ({
                  firstname: item.label,
                  employeeId: item.id,
                })),
                startdate_p: startdate_p,
                end_date_p: end_date_p,
                description_p: description_p,
                status: status,
                billablestatus: billableStatus,
                projectcost: projectcost,
                cummulativeHours: cummulativeHours,
                teamname: teamData
              }
            : project
        )
      );

      toast.success(
        <FormattedMessage id="projectUpdatedSuccess"></FormattedMessage>
      );
      handleCloseEditModal();
      // getData();
    } catch (err) {
      toast.error(<FormattedMessage id="projectUpdateFailed" />);
    }
  }

  const openEditModal = (Projects) => {
    setEditingClient(Projects);
    setprojectname(Projects.projectname);
    setclientname(
      Projects.clientname.map((item) => ({
        value: item.clientid,
        label: item.clientsname,
        id: item.clientid,
      }))
    );
    setprojectManager(Projects.projectManager);
    setassigneeemployees(
      Projects.assigneeemployees.map((item) => ({
        value: item.employeeId,
        label: item.firstname,
        id: item.employeeId,
      }))
    );
    setstartdate_p(Projects.startdate_p);
    setend_date_p(Projects.end_date_p);
    setdescription_p(Projects.description_p);
    setStatus(Projects.status);
    setBillableStatus(Projects.billablestatus);
    setprojectcost(Projects.projectcost);
    setcummulativeHours(Projects.cummulativeHours);
    setTeam(Projects.teamname)
    const modal = document.getElementById("editModal");
    modal.classList.add("show");
    modal.style.display = "block";
  };

  const handleCloseEditModal = () => {
    setEditingClient(null);
    setprojectid("");
    setprojectname("");
    setclientname([]);
    setprojectManager("");
    setassigneeemployees([]);
    setstartdate_p("");
    setend_date_p("");
    setdescription_p("");
    setStatus("");
    setBillableStatus("");
    setprojectcost("");
    setcummulativeHours("");
    setTeam("");
    setErrors({
      projectname: "",
      projectManager: "",
      startdate_p: "",
      end_date_p: ""
    });
    const modal = document.getElementById("editModal");
    modal.classList.remove("show");
    modal.style.display = "none";
  };

  async function Load() {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_BASE_URL +
          "/api/v1/Organization/getAllOrganization"
      );
      setOption(result.data);
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  }

  const Loadclient = async () => {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/client/getAllClient"
      );
      setClients(result.data);
      console.log("client",result.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  async function Loademployees() {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_BASE_URL +
          "/api/v1/Organization/getAllOrganization"
      );
      setEmployees(result.data);
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  const fetchData = async () => {
    try {
    
      const response = await fetch(endpoint);
      const fetchedData = await response.json();
      const updatedData = fetchedData.map((item) => ({
        ...item,
        TheRemainingtime: item.cummulativeHours
          ? calculateRemainingTime(item.cummulativeHours)
          : "",
      }));

      return updatedData; 
    } catch (error) {
      console.error("Error fetching data:", error);
      return []; 
    }
  };

  async function getTeam() {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/teams/get"
      );
      setTeam(result.data);
      console.log("team data", result.data);
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  }

  useEffect(() => {
    const fetchAllTeamMembers = async () => {
      const membersPromises = selectedTeams.map(team => fetchTeamMembers(team.value));
      const membersResults = await Promise.all(membersPromises);
      const newTeamMembers = {};
      selectedTeams.forEach((team, index) => {
        newTeamMembers[team.value] = membersResults[index];
      });
      setTeamMembers(newTeamMembers);
    };
  
    if (selectedTeams.length > 0) {
      fetchAllTeamMembers();
    } else {
      setTeamMembers({});
    }
  }, [selectedTeams]);

  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/teams/${teamId}/members`);
      return response.data.map(member => ({
        value: member.employeeId,
        label: `${member.firstname} ${member.lastname}`,
        id: member.employeeId
      }));
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to fetch team members");
      return [];
    }
  };

  useEffect(() => {
    fetchData().then((updatedData) => {
      setProjects(updatedData);
    });
  }, [Projects.map((item) => item.cummulativeHours).join(",")]);

  useEffect(() => {
    Loadclient();
    getTeam();
  }, []);

  useEffect(() => {
    (async () => {
      await Loademployees();
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await Load();
      await getData();
      await getProjectManager();
    };
    fetchData();
  }, [status]);

  useEffect(() => {
    filterData();
  }, [selectedOptions]);

  useEffect(() => {
    const totalItems = Projects.length;
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const newFilteredProjects = Projects.slice(firstItemIndex, lastItemIndex);

    setFilteredProjects(newFilteredProjects);
  }, [Projects, currentPage, itemsPerPage]);

  // Function to calculate remaining time
  const calculateRemainingTime = (cummulativeHours) => {
    const totalWorkingHours = 40; // Assuming 40 is the total working hours
    return cummulativeHours - totalWorkingHours;
  };

  const filterData = () => {
    let filteredData = Projects.filter((item) => {
      return (
        (selectedOptions.projectidnumber === "All" ||
          item.projectidnumber === selectedOptions.projectidnumber) &&
        (selectedOptions.projectname === "All" ||
          item.projectname === selectedOptions.projectname) &&
        (selectedOptions.Clients === "All" ||
          item.clientname.some(
            (client) => client.clientidnumber === selectedOptions.Clients
          )) &&
        (selectedOptions.projectManager === "All" ||
          item.projectManager === selectedOptions.projectManager) &&
        (selectedOptions.startdate_p === "All" ||
          item.startdate_p === selectedOptions.startdate_p) &&
        (selectedOptions.end_date_p === "All" ||
          item.end_date_p === selectedOptions.end_date_p) &&
        (selectedOptions.billablestatus === "All" ||
          item.billablestatus === selectedOptions.billablestatus)
      );
    });

    setFilteredProjects(filteredData); // Update filteredProjects state
  };

  const handleFilterChange = (columnName, selectedValue) => {
    const value = selectedValue ? selectedValue.value : "All"; // Set to "All" if selectedValue is null
    setSelectedOptions({
      ...selectedOptions,
      [columnName]: value,
    });
  };

  const handleReset = () => {
    setSelectedOptions({
      projectidnumber: "All",
      projectname: "All",
      Clients: "All",
      projectManager: "All",
      startdate_p: "All",
      end_date_p: "All",
      billablestatus: "All",
      projectcost: "All",
      cummulativeHours: "All",
    });
  };

  const projectidOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Projects.map((item) => item.projectidnumber))).map(
      (projectidnumber) => ({
        value: projectidnumber,
        label: projectidnumber,
      })
    ),
  ];

  const projectOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Projects.map((item) => item.projectname))).map(
      (projectname) => ({
        value: projectname,
        label: projectname,
      })
    ),
  ];

  const clientOptions = [
    { value: "All", label: "All" },
    ...Clients.map((client) => ({
      value: client.clientidnumber,
      label: client.clientsname,
    })),
  ];

  const projectManagerOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Projects.map((item) => item.projectManager))).map(
      (projectManager) => ({
        value: projectManager,
        label: projectManager,
      })
    ),
  ];

  const startdateOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Projects.map((item) => item.startdate_p))).map(
      (startdate_p) => ({
        value: startdate_p,
        label: startdate_p,
      })
    ),
  ];

  const enddateOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Projects.map((item) => item.end_date_p))).map(
      (end_date_p) => ({
        value: end_date_p,
        label: end_date_p,
      })
    ),
  ];

  const billablestatusOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Projects.map((item) => item.billablestatus))).map(
      (billablestatus) => ({
        value: billablestatus,
        label: billablestatus,
      })
    ),
  ];

  const getProjectManager = async () => {
    try {
 
      const response = await axios.get(process.env.REACT_APP_API_BASE_URL + "/api/v1/project/projectManagers");
      setProjectManagers(response.data); // Add 'roles' property with default value  
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  };



  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(endpoint);
  
      if (Array.isArray(response.data)) {
        const projectsWithTeam = response.data.map(project => ({
          ...project,
          teamName: project.team || project.teamname // Make sure this matches your backend field name
        }));
        setProjects(projectsWithTeam);
        setFilteredProjects(projectsWithTeam);
      } else {
        console.error("Project response data is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelectionChange = (rowsSelectedData, allRowsSelectedData) => {
    const selectedIds = allRowsSelectedData.map((row) => {
      const rowIndex = row.dataIndex;
      return filteredProjects[rowIndex].projectid;
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
    rowsSelected: filteredProjects
    .map((row, index) => (selectedRows.includes(row.projectid) ? index : -1))
    .filter((index) => index !== -1),

    onRowsDelete: async (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data.map(
        (row) =>
          Projects[(currentPage - 1) * itemsPerPage + row.dataIndex].projectid
      );
      try {
        await Promise.all(
          idsToDelete.map((projectid) =>
            axios.delete(
              process.env.REACT_APP_API_BASE_URL +
                `/api/v1/project/delete/${projectid}`
            )
          )
        );
        toast(<FormattedMessage id="projectDeletedSuccess" />);
        getData(); // Reload data after deletion
        const totalPages = Math.ceil(
          (Projects.length - idsToDelete.length) / itemsPerPage
        );
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    },

    onRowsDelete: async (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data.map(
        (row) =>
          Projects[(currentPage - 1) * itemsPerPage + row.dataIndex].projectid
      );

      try {
        let hasAssociatedEmployees = false;
        await Promise.all(
          idsToDelete.map(async (projectid) => {
            const project = Projects.find((p) => p.projectid === projectid);
            if (project.assigneeemployees.length > 0) {
              // Project has associated employees
              hasAssociatedEmployees = true;
            } else {
              // Project has no associated employees, proceed with deletion
              await axios.delete(
                process.env.REACT_APP_API_BASE_URL +
                  `/api/v1/project/delete/${projectid}`
              );
            }
          })
        );

        if (hasAssociatedEmployees) {
          toast(
            <FormattedMessage
              id="project Has Associated Employees Cannot Delete"
              values={{ count: 1 }}
            />
          );
        } else {
          toast(
            <FormattedMessage
              id="projectDeletedSuccess"
              values={{ count: idsToDelete.length }}
            />
          );
        }

        const totalPages = Math.ceil(
          (Projects.length -
            idsToDelete.length +
            (hasAssociatedEmployees ? 1 : 0)) /
            itemsPerPage
        );
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }

        getData(); // Reload data after deletion
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

        <button
          className={`filter_btn border-none bg-white px-2 ${
            isSearchOpen ? "d-none d-sm-block" : ""
          }`}
          onClick={handleDownloadClick}
        >
          <GetAppIcon />
        </button>
      </>
    ),
  };

  const handleDownloadClick = () => {
    setDialogType("download");
    setDialogOpen(true);
  };

  const handleExportClick = () => {
    setDialogType("export");
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const downloadAction = () => {
    switch (selectedFormat) {
      case "csv":
        downloadCSV();
        break;
      case "pdf":
        downloadPDF();
        break;
      default:
        break;
    }
  };

  const handleMenuItemClick = (format) => {
    setSelectedFormat(format);
    if (dialogType === "download") {
      downloadAction();
    } else if (dialogType === "export") {
      exportAction();
    }
    setDialogOpen(false);
  };

  const exportAction = async () => {
    setLoading(true);
    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/project/export",
        {
          email: email,
          format: selectedFormat,
        }
      );
      toast.success("project data export successfully");
      setEmail("");
      setSelectedFormat("");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export client data");
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  };

  const downloadCSV = () => {
    // Define column names
    const columnNames = [
      "Project ID",
      "Project Name",
      "Client Name",
      "Supervisor",
      "Start Date",
      "End Date",
      "Billable Status",
      "Status",
    ];

    // Generate CSV data
    const csvData = [columnNames];
    Projects.forEach((Project) => {
      const rowData = [
        Project.projectidnumber,
        Project.projectname,
        Project.clientname,
        Project.projectManager,
        Project.startdate_p,
        Project.end_date_p,
        Project.billablestatus,
        Project.status,
      ];
      csvData.push(rowData);
    });

    const csvTitle = "Project_data.csv";
    const csvReport = csvData.map((row) => row.join(",")).join("\n");
    // Create CSV file and trigger download
    const csvBlob = new Blob([csvReport], { type: "text/csv" });
    const csvUrl = window.URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.setAttribute("download", csvTitle);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF("p", "pt", "letter");

    const tableColumn = [
      "Project ID",
      "Project Name",
      "Client Name",
      "project Manager",
      "Start Date",
      "End Date",
      "Billable Status",
      "Status",
    ];
    const tableRows = [];

    Projects.forEach((pro) => {
      const employeeData = [
        pro.projectidnumber,
        pro.projectname,
        pro.clientname,
        pro.projectManager,
        pro.startdate_p,
        pro.end_date_p,
        pro.billablestatus,
        pro.status,
      ];
      tableRows.push(employeeData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    const date = new Date().toLocaleDateString();
    doc.save("Project.pdf");
  };

  const renderNestedProperty = (value) => {
    if (value && typeof value === "object") {
      // Access nested property
      return value.clientsname;
    }
    return value;
  };

  const renderNestedPropertyTeam = (value) => {
    if (value && typeof value === "object") {
      // Access nested property
      return value.teamName;
    }
    return value;
  };

  const columns = [
    {
      name: "projectidnumber",
      label: <FormattedMessage id="projectId" />,
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
      name: "projectname",
      label: <FormattedMessage id="projectName" />,
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
      name: "clientname",
      label: <FormattedMessage id="clientName" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        customBodyRender: (value) => {
          if (value && value.length > 0) {
            // If there are assigned clients, map through them and display their names
            return value.map((client, index) => (
              <span key={index}>{client.clientsname}</span>
            ));
          } else {
            return renderNestedProperty(value); // Assuming renderNestedProperty handles the case when value is an array
          }
        },
      },
    },

    {
      name: "projectManager",
      label: <FormattedMessage id="Supervisor" />,
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
      name: "teamname",
      label: <FormattedMessage id="Team Name" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        customBodyRender: (value) => {
          if (value && value.length > 0) {
            // If there are assigned clients, map through them and display their names
            return value.map((team, index) => (
              <span key={index}>{team.teamName}</span>
            ));
          } else {
            return renderNestedPropertyTeam(value); // Assuming renderNestedProperty handles the case when value is an array
          }
        },
      },
    },
    {
      name: "assigneeemployees",
      label: <FormattedMessage id="assignEmployees" />,
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
      name: "startdate_p",
      label: <FormattedMessage id="startDate" />,
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
      name: "end_date_p",
      label: <FormattedMessage id="endDate" />,
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
      name: "cummulativeHours",
      label: <FormattedMessage id="Cummulative Hours" />,
      options: {
        setCellProps: () => ({ align: "center" }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        renderCell: (params) => {
          const { value } = params;
          return `${value} hrs`;
        },
        customBodyRender: (value) => {
          return value ? `${value} hours` : ""; // Add 'hours' only if value exists
        },
      },
    },
    {
      name: "Utilization",
      label: <FormattedMessage id="Utilization" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        customBodyRender: (value) => {
          return value ? `${value} hours` : ""; // Add 'hours' only if value exists
        },
      },
    },
    {
      name: "TheRemainingtime",
      label: (
        <FormattedMessage
          id="The Remaining
      time"
        />
      ),
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        customBodyRender: (value) => {
          return value ? `${value} hours` : ""; // Add 'hours' only if value exists
        },
      },
    },
    {
      name: "projectcost",
      label: <FormattedMessage id="Project Cost" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        customBodyRender: (value) => {
          return value ? `$ ${value}` : ""; // Add 'hours' only if value exists
        },
      },
    },
    {
      name: "billablestatus",
      label: <FormattedMessage id="billableStatus" />,
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
      name: "description_p",
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
          style: { position: "sticky", right: 115 },
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap", position: "sticky", right: 115 },
        }),
      },
    },

    {
      name: "action",
      label: <FormattedMessage id="action" />,
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
          const rowData = filteredProjects[rowIndex];

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

  const totalPages = Math.ceil(Projects.length / itemsPerPage);

  const currentItems = Projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await save(event); // Call your save function
      setOpenAddEmployeePopup(false); // Close the dialog
    } catch (error) {}
  };

  const handleOptionChange = (event) => {
    setBillableStatus(event.target.value);
  };

  const handleProjectTypeChange = (event) => {
    const selectedEmployeeType = event.target.value;
    setBillableStatus(selectedEmployeeType);
  };

  const handleProjectNameChange = (e) => {
    setprojectname(e.target.value);
    if (errors.projectname) {
      setErrors((prevErrors) => ({ ...prevErrors, projectname: "" }));
    }
  };

  const handleClientNameChange = (selectedOption) => {
    setclientname(selectedOption);
    if (errors.clientname) {
      setErrors((prevErrors) => ({ ...prevErrors, clientname: "" }));
    }
  };

  const handleProjectManagerChange = (e) => {
    setprojectManager(e.target.value);
    if (errors.projectManager) {
      setErrors((prevErrors) => ({ ...prevErrors, projectManager: "" }));
    }
  };

  const handleStartDateChange = (date) => {
    setstartdate_p(date);
    if (errors.startdate_p) {
      setErrors((prevErrors) => ({ ...prevErrors, startdate_p: "" }));
    }
  };

  const handleEndDateChange = (date) => {
    setend_date_p(date);
    if (errors.end_date_p) {
      setErrors((prevErrors) => ({ ...prevErrors, end_date_p: "" }));
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(Projects.length / itemsPerPage);
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

  // const renderPaginationItems = (item) => {
  //   if (item.page === 1 || item.page === 2 || item.page === totalPages || item.page === currentPage || Math.abs(currentPage - item.page) <= 1) {
  //     return <PaginationItem {...item} />;
  //   }
  //   if (item.page === 3) {
  //     return <PaginationItem {...item} page="..." disabled />;
  //   }
  //   return null;
  // };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [visibleColumns_project, setVisibleColumns] = useState(() => {
    const allColumns = Array.from(Array(columns.length).keys());
    // Load from sessionStorage or localStorage
    const storedColumns = localStorage.getItem("visibleColumns_project");
    return storedColumns ? JSON.parse(storedColumns) : allColumns;
  });

  const handleResetAll = () => {
    setVisibleColumns(columns.map((_, index) => index));
  };

  useEffect(() => {
    // Save to sessionStorage or localStorage whenever visibleColumns changes
    localStorage.setItem(
      "visibleColumns_project",
      JSON.stringify(visibleColumns_project)
    );
  }, [visibleColumns_project]);

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
      display: visibleColumns_project.includes(index),
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
    setFilteredProjects(Projects); // Reset the filtered data
    // getData();
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toString().toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = Projects.filter((row) =>
      Object.entries(row).some(([key, value]) => {
        if (key === "clientname") {
          // Handle the nested structure of clientname
          return value.some(
            (client) =>
              client.clientsname &&
              client.clientsname.toLowerCase().includes(searchValue)
          );
        } else {
          // Handle other columns
          return (
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchValue)
          );
        }
      })
    );
    setFilteredProjects(filteredData);
  };





  // Custom Option component with checkbox
const Option = props => (
  <components.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      onChange={() => null}
    />{' '}
    <label>{props.label}</label>
  </components.Option>
);

// Custom GroupHeading component
const GroupHeading = props => (
  <components.GroupHeading {...props}>
    <strong>{props.data.label}</strong>
  </components.GroupHeading>
);

const TeamMemberSelect = ({ selectedTeams, teamMembers, assigneeemployees, setassigneeemployees, team }) => {
  // Function to get team name from teamId
  const getTeamName = (teamId) => {
    const foundTeam = team.find(t => t.teamId === teamId);
    return foundTeam ? foundTeam.teamName : 'Unknown Team';
  };

  // Prepare options with correct team names
  const options = selectedTeams.map(selectedTeam => ({
    label: getTeamName(selectedTeam.value),
    options: teamMembers[selectedTeam.value] || []
  }));

  return (
    <div className="form-group col-md-4 multiselect_assign_employees">
      <label htmlFor="teamMembers" className="fs-5 custom_badge">
        <FormattedMessage id="selectTeamMembers" />
      </label>
      <Select
        isMulti
        options={options}
        value={assigneeemployees}
        onChange={setassigneeemployees}
        placeholder="Select Team Members"
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{ Option, GroupHeading }}
        styles={{
          option: (base) => ({
            ...base,
            display: 'flex',
            alignItems: 'center',
          }),
        }}
      />
    </div>
  );
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
                      {/* <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example" */}
                      <TabList
                        onChange={handleChange}
                        TabIndicatorProps={{
                          style: {
                            backgroundColor: "#787DBD",
                          },
                        }}
                      >
                        <Tab
                          label="Project"
                          value="1"
                          component={Link}
                          to="/project"
                        />
                        <Tab
                          label="Task"
                          value="2"
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
                  <FormattedMessage id="addProject" />
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
                      <FormattedMessage id="addProject" />
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
                  <p className="popup_sub mt-2 ms-5">
                    <FormattedMessage id="fillProjectDetails" />
                  </p>
                  <hr className="hr ms-5"></hr>
                  <div className="modal-body">
                    <div className=" ms-4 me-4 mt-2">
                      <form onSubmit={save} className="">
                        <div className=" d-flex ">
                          <div className="form-group col-md-4">
                            <label
                              htmlFor="projectname"
                              className="fs-5 custom_badge"
                            >
                              <FormattedMessage id="projectName" />
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              autoComplete="off"
                              className={`form-control custom_input-project ${
                                errors.projectname ? "is-invalid" : ""
                              }`}
                              type="text"
                              id="projectname"
                              value={projectname}
                              onChange={handleProjectNameChange}
                              placeholder="Project name"
                            />
                            {errors.projectname && (
                              <div className="invalid-feedback">
                                {errors.projectname}
                              </div>
                            )}
                          </div>

                          <div className="form-group col-md-4">
                            <label
                              htmlFor="clientname"
                              className="custom_badge_select"
                            >
                              <FormattedMessage id="clientName" />
                            </label>

                            <Select
                              className="custom_select"
                              closeMenuOnSelect={true}
                              options={Clients.map((client) => ({
                                value: client.clientid,
                                label: client.clientsname,
                              }))}
                              value={clientname}
                              onChange={handleClientNameChange}
                              placeholder="Client name"
                            />

                            {errors.clientname && (
                              <div className="invalid-feedback">
                                {errors.clientname}
                              </div>
                            )}
                          </div>

                          <div className="form-group col-md-4">
                            <label
                              htmlFor="Supervisor"
                              className="fs-5 custom_badge"
                            >
                              <FormattedMessage id="Supervisor" />
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-select input1 ${
                                errors.projectManager ? "is-invalid" : ""
                              }`}
                              type="text"
                              id="Supervisor"
                              value={projectManager}
                              onChange={handleProjectManagerChange}
                            >
                              <option value="" selected>
                                Select...
                              </option>
                              {projectManagers.map((employee) => (
                                <option
                                  key={employee.employeeId}
                                  value={employee.name}
                                >
                                  {employee.name}
                                </option>
                              ))}
                            </select>
                            {errors.projectManager && (
                              <div className="invalid-feedback">
                                {errors.projectManager}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="d-flex mt-3">
                          <div className="form-group col-md-4">
                            <label
                              htmlFor="start_date_p"
                      
                              className={` custom_badge custom_date_format_label  ${
                                errors.startdate_p ? "is-invalid" : ""
                              }`}
                            >
                              <FormattedMessage id="startDate" />
                              <span className="text-danger">*</span>
                            </label>
                            <DatePickerComponent
                              selectedDate={startdate_p}
                    
                              onDateChange={handleStartDateChange}
                              error={!!errors.startdate_p}
                            />
                             {errors.startdate_p && <div className="error-message">{errors.startdate_p}</div>}
                            
                          </div>
                          <div className="form-group col-md-4">
                            <label
                              htmlFor="end_date_p"
                              className={` custom_badge custom_date_format_label  ${
                                errors.startdate_p ? "is-invalid" : ""
                              }`}
                            >
                              <FormattedMessage id="endDate" />
                              <span className="text-danger">*</span>
                            </label>
                            <DatePickerComponent
                              selectedDate={end_date_p}
                              // onDateChange={(date) => setend_date_p(date)}
                              onDateChange={handleEndDateChange}
                              error={!!errors.end_date_p}
                              minDate={
                                startdate_p ? new Date(startdate_p) : null
                              }
                            />
                             {errors.end_date_p && <div className="error-message">{errors.end_date_p}</div>}
                          </div>
{/* 
                          <div className="form-group col-md-4 multiselect_assign_employees">
                            <label
                              htmlFor="assigneeemployees"
                              className="fs-5 custom_badge2"
                            >
                              <FormattedMessage id="assignEmployees" />
                            </label>

                            <MultiSelect
                              className="multiselect_input"
                              options={employees.map((employee) => ({
                                value: employee.employeeId,
                                label: `${employee.firstname} ${employee.lastname}`,
                                id: employee.employeeId, // Unique identifier
                              }))}
                              value={assigneeemployees}
                              onChange={setassigneeemployees}
                              placeholder="Assign Employees"
                              labelledBy="Select"
                              overrideStrings={{
                                allItemsAreSelected:
                                  "All Employees are selected...",
                              }}
                            />
                          </div> */}
                        

                        {useTeams && (
    <>
      <div className="form-group col-md-4">
        <label htmlFor="teams" className="fs-5 custom_badge">
          <FormattedMessage id="selectTeams" />
        </label>
        <Select
          // isMulti
          options={team.map((t) => ({
            value: t.teamId,
            label: t.teamName,
          }))}
          value={selectedTeams}
          onChange={(selected) => {
            setSelectedTeams(selected);
            setassigneeemployees([]);
          }}
          placeholder="Select Teams"
        />
      </div>

      
    </>
  )}

  {!useTeams && (
    <div className="form-group col-md-4 multiselect_assign_employees">
      <label htmlFor="assigneeemployees" className="fs-5 custom_badge2">
        <FormattedMessage id="assignEmployees" />
      </label>
      <MultiSelect
        className="multiselect_input"
        options={employees.map((employee) => ({
          value: employee.employeeId,
          label: `${employee.firstname} ${employee.lastname}`,
          id: employee.employeeId,
        }))}
        value={assigneeemployees}
        onChange={setassigneeemployees}
        labelledBy="Select"
        overrideStrings={{
          allItemsAreSelected: "All Employees are selected...",
        }}
      />
    </div>
  )}

                      <div className="form-group col-md-4">
    <label htmlFor="useTeams" className="fs-5 custom_badge">
      <FormattedMessage id="useTeams" />
    </label>
    <input
      type="checkbox"
      id="useTeams"
      checked={useTeams}
      onChange={(e) => {
        setUseTeams(e.target.checked);
        if (!e.target.checked) {
          setSelectedTeams([]);
          setTeamMembers({});
          setassigneeemployees([]);
        }
      }}
    />
  </div>
                        </div>

                        <div className="d-flex mt-3">
                      
{selectedTeams.length > 0 && (
  <TeamMemberSelect
    selectedTeams={selectedTeams}
    teamMembers={teamMembers}
    assigneeemployees={assigneeemployees}
    setassigneeemployees={setassigneeemployees}
    team={team}
  />
)}
                        {/* {selectedTeams.length > 0 && (
                        <div className="form-group col-md-4 multiselect_assign_employees">
        <label htmlFor="teamMembers" className="fs-5 custom_badge">
          <FormattedMessage id="selectTeamMembers" />
        </label>
        <Select
          isMulti
          options={Object.entries(teamMembers).map(([teamId, members]) => ({
            label: team.find(t => t.teamId === teamId)?.teamName || 'Unknown Team',
            options: members
          }))}
          value={assigneeemployees}
          onChange={setassigneeemployees}
          placeholder="Select Team Members"
        />
      </div>
      )} */}
                        {/* {selectedTeams.length > 0 && (
  <div className="form-group col-md-4 multiselect_assign_employees">
    <label htmlFor="teamMembers" className="fs-5 custom_badge">
      <FormattedMessage id="selectTeamMembers" />
    </label>
    <MultiSelect
      className="multiselect_input"
      options={selectedTeams.map(team => ({
        label: team.label,
        options: teamMembers[team.value] || []
      }))}
      value={selectedTeamMembers}
      onChange={setSelectedTeamMembers}
      labelledBy="Select"
      groupBy={(option) => option.label}
      overrideStrings={{
        allItemsAreSelected: "All Team Members are selected...",
      }}
    />
  </div>
)} */}
                     


                          <div className="form-group col-md-4">
                            <label
                              htmlFor="Cummulative Hours"
                              className="fs-5 custom_badge"
                            >
                              <FormattedMessage id="Cummulative Hours" />
                            </label>
                            <input
                              autoComplete="off"
                              className="form-control custom_input-project"
                              type="text"
                              id="Cummulative Hours"
                              value={cummulativeHours}
                              placeholder="Cummulative Hours"
                              onChange={(event) => {
                                setcummulativeHours(event.target.value);
                              }}
                            />
                          </div>

                          {/* <div className="form-group col-md-4">
                            <label
                              htmlFor="Project Cost"
                              className="fs-5 custom_badge"
                            >
                              <FormattedMessage id="Project Cost" />
                            </label>
                            <input
                              autoComplete="off"
                              className="form-control custom_input-project"
                              type="text"
                              id="Project Cost"
                              value={projectcost}
                              placeholder="Project Cost"
                              onChange={(event) => {
                                setprojectcost(event.target.value);
                              }}
                            />
                          </div> */}
                        </div>
                        <div className="d-flex mt-3">
                          <div className="form-group mt-2 ms-4">
                            <label className="radio" htmlFor="billableStatus">
                              <FormattedMessage id="billableStatus:" />
                            </label>
                          </div>
                          <div className="mt-2 ms-2">
                            <input
                              type="radio"
                              name="options"
                              value="Billable"
                              checked={billableStatus === "Billable"}
                              onChange={handleOptionChange}
                            />
                          </div>
                          <div className="ms-1 mt-2">
                            <label>
                              {" "}
                              <FormattedMessage id="billable"></FormattedMessage>
                            </label>
                          </div>

                          <div className="d-flex ms-3">
                            <div className="mt-2">
                              <input
                                type="radio"
                                name="options"
                                value="Non-Billable"
                                checked={billableStatus === "Non-Billable"}
                                onChange={handleOptionChange}
                              />
                            </div>
                            <div className="ms-2 mt-2">
                              <label>
                                <FormattedMessage id="nonBillable"></FormattedMessage>
                              </label>
                            </div>
                          </div>

                          <div className="form-group col-md-6">
                            <label
                              htmlFor="description_p"
                              className="fs-5 custom_badge"
                            >
                              <FormattedMessage id="description"></FormattedMessage>
                            </label>
                            <textarea
                              className="form-control custom_input-project"
                              type="textarea"
                              id="description_p"
                              value={description_p}
                              onChange={(event) => {
                                setdescription_p(event.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="d-flex gap-3 mb-4">
                          <div className="col-md-6 text-end">
                            <button
                              type="submit"
                              className="project_add_button py-2 px-4 border-none"
                              // data-dismiss="modal"
                              // onClick={save}
                            >
                              <i className="icon_project_add fas fa-plus border-1 rounded-circle border-white me-3"></i>
                              <FormattedMessage id="add" />
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
                              <FormattedMessage id="cancel" />
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="project_table mx-5">
              <div>
                <div className="mui-datatable-container">
                  {loading && (
                    <div className="loading-container">
                      <FacebookCircularProgress />
                    </div>
                  )}
                  <MUIDataTable
                    className="mui_project mt-4"
                    data={filteredProjects}
                    columns={filteredColumns}
                    // options={options}
                    options={{
                      ...options,
                      onRowSelectionChange: handleRowSelectionChange,
                      rowsSelected: filteredProjects
                        .map((row, index) =>
                          selectedRows.includes(row.projectid) ? index : -1
                        )
                        .filter((index) => index !== -1),
                    }}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <div className="ms-4 mt-2">
                  <p>
                    <FormattedMessage id="Total Record Count:"></FormattedMessage>{" "}
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
                      count={Math.ceil(Projects.length / itemsPerPage)}
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
            {/* Pagination component */}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onClose={handleDialogClose} className="">
        {loading && (
          <div className="loading-project fs-3 mt-2">
            <FacebookCircularProgress />
          </div>
        )}
        <div className="export ">
          <div className="d-flex justify-content-between ms-5 mt-5">
            <p className="font-weight-bold export_head ">
              <FormattedMessage id="export" />
            </p>

            <svg
              onClick={handleDialogClose}
              className="export_close_icon me-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="20"
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
          </div>

          <p className="export_p ms-5">
            <FormattedMessage id="saveFormats"></FormattedMessage>
          </p>
          <hr className="hr ms-5"></hr>

          <div className="d-flex my-5 mx-5 mb-5 justify-content-between">
            <div>
              <p className="">
                <FormattedMessage id="emailExport" />
              </p>

              <div className="d-flex export_email">
                <svg
                  className="mt-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 21C10.758 21 9.589 20.764 8.493 20.292C7.39767 19.8193 6.44467 19.178 5.634 18.368C4.82333 17.5587 4.18167 16.6067 3.709 15.512C3.23633 14.4173 3 13.2477 3 12.003C3 10.759 3.236 9.589 3.708 8.493C4.18067 7.39767 4.822 6.44467 5.632 5.634C6.44133 4.82333 7.39333 4.18167 8.488 3.709C9.58267 3.23633 10.7523 3 11.997 3C13.241 3 14.411 3.23633 15.507 3.709C16.603 4.18167 17.556 4.823 18.366 5.633C19.1767 6.443 19.8183 7.39533 20.291 8.49C20.7637 9.58533 21 10.7553 21 12V12.988C21 13.8307 20.7107 14.5433 20.132 15.126C19.5533 15.7087 18.8427 16 18 16C17.404 16 16.8607 15.8367 16.37 15.51C15.8787 15.1833 15.5153 14.748 15.28 14.204C14.9 14.7513 14.425 15.1877 13.855 15.513C13.285 15.8377 12.6667 16 12 16C10.886 16 9.94067 15.612 9.164 14.836C8.38733 14.06 7.99933 13.1147 8 12C8 10.886 8.388 9.94067 9.164 9.164C9.94 8.38733 10.8853 7.99933 12 8C13.114 8 14.0593 8.388 14.836 9.164C15.6127 9.94 16.0007 10.8853 16 12V12.988C16 13.5373 16.196 14.01 16.588 14.406C16.9807 14.802 17.4513 15 18 15C18.5487 15 19.0193 14.802 19.412 14.406C19.804 14.01 20 13.5373 20 12.988V12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20H17V21H12ZM12 15C12.8333 15 13.5417 14.7083 14.125 14.125C14.7083 13.5417 15 12.8333 15 12C15 11.1667 14.7083 10.4583 14.125 9.875C13.5417 9.29167 12.8333 9 12 9C11.1667 9 10.4583 9.29167 9.875 9.875C9.29167 10.4583 9 11.1667 9 12C9 12.8333 9.29167 13.5417 9.875 14.125C10.4583 14.7083 11.1667 15 12 15Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                </svg>

                <input
                  className="bg-white p-2 export_input"
                  type="email"
                  placeholder="Email ID"
                  // label="Email"
                  // variant="outlined"
                  // fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="download2 me-5">
              <p className="">
                <FormattedMessage id="pickFormat" />
              </p>

              {/* <InputLabel id="format-select-label">Format</InputLabel> */}
              <select
                className="bg-white p-2 export_format"
                // labelId="format-select-label"
                id="format-select"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                label="Format"
              >
                <option selected></option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>

          <div className="export_button d-flex gap-3 py-3">
            <button
              type="button"
              className="btn export_btn "
              onClick={downloadAction}
            >
              <svg
                className="me-2"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 15.577L8.462 12.038L9.169 11.319L11.5 13.65V5H12.5V13.65L14.83 11.32L15.538 12.038L12 15.577ZM5 19V14.962H6V18H18V14.962H19V19H5Z"
                  fill="black"
                  fill-opacity="0.5"
                />
              </svg>
              <FormattedMessage id="download" />
            </button>
            <button
              type="button"
              className="btn export_btn "
              onClick={exportAction}
            >
              <svg
                className="me-2"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M16.7188 8.75V16.25C16.7188 16.5401 16.6035 16.8183 16.3984 17.0234C16.1933 17.2285 15.9151 17.3438 15.625 17.3438H4.375C4.08492 17.3438 3.80672 17.2285 3.6016 17.0234C3.39648 16.8183 3.28125 16.5401 3.28125 16.25V8.75C3.28125 8.45992 3.39648 8.18172 3.6016 7.9766C3.80672 7.77148 4.08492 7.65625 4.375 7.65625H6.25C6.37432 7.65625 6.49355 7.70564 6.58146 7.79354C6.66936 7.88145 6.71875 8.00068 6.71875 8.125C6.71875 8.24932 6.66936 8.36855 6.58146 8.45646C6.49355 8.54436 6.37432 8.59375 6.25 8.59375H4.375C4.33356 8.59375 4.29382 8.61021 4.26451 8.63951C4.23521 8.66882 4.21875 8.70856 4.21875 8.75V16.25C4.21875 16.2914 4.23521 16.3312 4.26451 16.3605C4.29382 16.3898 4.33356 16.4062 4.375 16.4062H15.625C15.6664 16.4062 15.7062 16.3898 15.7355 16.3605C15.7648 16.3312 15.7812 16.2914 15.7812 16.25V8.75C15.7812 8.70856 15.7648 8.66882 15.7355 8.63951C15.7062 8.61021 15.6664 8.59375 15.625 8.59375H13.75C13.6257 8.59375 13.5065 8.54436 13.4185 8.45646C13.3306 8.36855 13.2812 8.24932 13.2812 8.125C13.2812 8.00068 13.3306 7.88145 13.4185 7.79354C13.5065 7.70564 13.6257 7.65625 13.75 7.65625H15.625C15.9151 7.65625 16.1933 7.77148 16.3984 7.9766C16.6035 8.18172 16.7188 8.45992 16.7188 8.75ZM7.20625 5.33125L9.53125 3.00703V10.625C9.53125 10.7493 9.58064 10.8685 9.66854 10.9565C9.75645 11.0444 9.87568 11.0938 10 11.0938C10.1243 11.0938 10.2435 11.0444 10.3315 10.9565C10.4194 10.8685 10.4688 10.7493 10.4688 10.625V3.00703L12.7937 5.33125C12.8367 5.3773 12.8884 5.41424 12.9459 5.43986C13.0034 5.46548 13.0655 5.47926 13.1284 5.48037C13.1914 5.48148 13.2539 5.4699 13.3122 5.44633C13.3706 5.42275 13.4236 5.38766 13.4681 5.34315C13.5127 5.29864 13.5478 5.24562 13.5713 5.18725C13.5949 5.12888 13.6065 5.06636 13.6054 5.00342C13.6043 4.94048 13.5905 4.87841 13.5649 4.82091C13.5392 4.76341 13.5023 4.71166 13.4563 4.66875L10.3313 1.54375C10.2434 1.45597 10.1242 1.40666 10 1.40666C9.87578 1.40666 9.75664 1.45597 9.66875 1.54375L6.54375 4.66875C6.4977 4.71166 6.46076 4.76341 6.43514 4.82091C6.40952 4.87841 6.39574 4.94048 6.39463 5.00342C6.39352 5.06636 6.4051 5.12888 6.42867 5.18725C6.45225 5.24562 6.48734 5.29864 6.53185 5.34315C6.57636 5.38766 6.62938 5.42275 6.68775 5.44633C6.74612 5.4699 6.80864 5.48148 6.87158 5.48037C6.93452 5.47926 6.99659 5.46548 7.05409 5.43986C7.11159 5.41424 7.16334 5.3773 7.20625 5.33125Z"
                  fill="black"
                  fill-opacity="0.5"
                />
              </svg>
              <FormattedMessage id="export" />
            </button>

            <button
              className="btn export_btn pt-1 "
              type="button"
              // color="secondary"
              onClick={handleDialogClose}
            >
              <svg
                className="export_cancel me-2"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7.33316 18.2567L6.74316 17.6667L11.4098 13L6.74316 8.33333L7.33316 7.74333L11.9998 12.41L16.6665 7.74333L17.2565 8.33333L12.5898 13L17.2565 17.6667L16.6665 18.2567L11.9998 13.59L7.33316 18.2567Z"
                  fill="black"
                  fill-opacity="0.5"
                />
              </svg>
              <FormattedMessage id="cancel" />
            </button>
          </div>
        </div>
      </Dialog>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleMenuItemClick("csv")}>CSV</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("pdf")}>PDF</MenuItem>
      </Menu>

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
                <FormattedMessage id="editProject" />
              </p>

              <svg
                className="project_close_btn"
                data-bs-dismiss="modal"
                aria-label="Close"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                onClick={handleCloseEditModal}
              >
                <path
                  d="M6 18L18 6M18 18L6 6"
                  stroke="#F8F8F8"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <p className="popup_sub mt-4 ms-5">
              <FormattedMessage id="fillProjectDetails" />
            </p>
            <hr className="hr ms-5"></hr>
            <div className="modal-body">
              <div className=" ms-4 me-4 mt-3">
                <form onSubmit={editClient}>
                  <div className=" d-flex ">
                    <div className="form-group col-md-4">
                      <label
                        htmlFor="projectname"
                        className="fs-5 custom_badge"
                      >
                        <FormattedMessage id="projectName" />{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        autoComplete="off"
                        className={`form-control custom_input-project ${
                          errors.projectname ? "is-invalid" : ""
                        }`}
                        type="text"
                        id="projectname"
                        value={projectname}
                        placeholder="Project Name"
                        onChange={handleProjectNameChange}
                      />

                            {errors.projectname && (
                              <div className="invalid-feedback">
                                {errors.projectname}
                              </div>
                            )}

                    </div>

                    <div className="form-group col-md-4">
                      <label
                        htmlFor="clientname"
                        className="custom_badge_select"
                      >
                        <FormattedMessage id="clientName" />
                        <span className="text-danger">*</span>
                      </label>

                      <Select
                      className="custom_select"
                      placeholder="Customer Name"
                        closeMenuOnSelect={true}
                        options={Clients.map((client) => ({
                          value: client.clientid,
                          label: client.clientsname,
                          id: client.clientid,
                        }))}
                        value={clientname}
                        onChange={setclientname}
                      />

                      {errors.clientname && (
                        <div className="invalid-feedback">
                          {errors.clientname}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-4">
                      <label htmlFor="Supervisor" className="fs-5 custom_badge">
                        <FormattedMessage id="Supervisor" />{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select input1 ${
                          errors.projectManager ? "is-invalid" : ""
                        }`}
                        type="text"
                        id="Supervisor"
                        placeholder="Supervisor"
                        value={projectManager}
                        onChange={handleProjectManagerChange}
                      >
                        <option value="" selected></option>
                        {projectManagers.map((employee) => (
                          <option
                            key={employee.employeeId}
                            value={employee.name}
                          >
                            {employee.name}
                          </option>
                        ))}
                      </select>
                            {errors.projectManager && (
                              <div className="invalid-feedback">
                                {errors.projectManager}
                              </div>
                            )}
                      
                    </div>
                  </div>

                  <div className="d-flex mt-3">
                    <div className="form-group col-md-4">
                      <label
                        htmlFor="start_date_p"
                        className="custom_badge custom_date_format_label"
                      >
                        <FormattedMessage id="startDate" />
                        <span className="text-danger">*</span>
                      </label>
                      <DatePickerComponent
                        selectedDate={startdate_p}
                        onDateChange={handleStartDateChange}
                        // onDateChange={(date) => setstartdate_p(date)}
                        error={!!errors.startdate_p}
                      />
                       {errors.startdate_p && <div className="error-message">{errors.startdate_p}</div>}
                    </div>
                    <div className="form-group col-md-4">
                      <label
                        htmlFor="end_date_p"
                        className="custom_badge custom_date_format_label"
                      >
                        <FormattedMessage id="endDate" />
                        <span className="text-danger">*</span>
                      </label>
                      <DatePickerComponent
                        selectedDate={end_date_p}
                        onDateChange={handleEndDateChange}
                        // onDateChange={(date) => setend_date_p(date)}
                        minDate={startdate_p ? new Date(startdate_p) : null}
                        error={!!errors.end_date_p}
                      />
                       {errors.end_date_p && <div className="error-message">{errors.end_date_p}</div>}
                    </div>

                    
                    {useTeams ? (
              <div className="d-flex mt-3">
                <div className="form-group col-md-4">
                  <label htmlFor="teams" className="fs-5 custom_badge">
                    <FormattedMessage id="selectTeams" />
                  </label>
                  <Select
                    options={team.map((t) => ({
                      value: t.teamId,
                      label: t.teamName,
                    }))}
                    value={selectedTeams}
                    onChange={(selected) => {
                      setSelectedTeams(selected);
                      setassigneeemployees([]);
                    }}
                    placeholder="Select Teams"
                  />
                </div>
                
                {selectedTeams.length > 0 && (
                  <TeamMemberSelect
                    selectedTeams={selectedTeams}
                    teamMembers={teamMembers}
                    assigneeemployees={assigneeemployees}
                    setassigneeemployees={setassigneeemployees}
                    team={team}
                  />
                )}
              </div>
            ) : (
              <div className="form-group col-md-4 multiselect_assign_employees">
                <label htmlFor="assigneeemployees" className="fs-5 custom_badge2">
                  <FormattedMessage id="assignEmployees" />
                </label>
                <MultiSelect
                  className="multiselect_input"
                  options={employees.map((employee) => ({
                    value: employee.employeeId,
                    label: `${employee.firstname} ${employee.lastname}`,
                    id: employee.employeeId,
                  }))}
                  value={assigneeemployees}
                  onChange={setassigneeemployees}
                  labelledBy="Select"
                  overrideStrings={{
                    allItemsAreSelected: "All Employees are selected...",
                  }}
                />
              </div>
            )}
                    {/* <div className="form-group col-md-4 multiselect_assign_employees">
                      <label
                        htmlFor="assigneeemployees"
                        className="fs-5 custom_badge2"
                      >
                        <FormattedMessage id="assignEmployees" />
                      </label>

                      <MultiSelect
                        className="multiselect_input"
                        options={employees.map((employee) => ({
                          value: employee.employeeId,
                          label: `${employee.firstname} ${employee.lastname}`,
                          id: employee.employeeId, // Unique identifier
                        }))}
                        value={assigneeemployees}
                        onChange={setassigneeemployees}
                        labelledBy="Select"
                        overrideStrings={{
                          allItemsAreSelected: "All Employees are selected...",
                        }}
                      />
                    </div> */}
                  </div>

                  <div className="form-group col-md-4">
                <label htmlFor="useTeams" className="fs-5 custom_badge">
                  <FormattedMessage id="useTeams" />
                </label>
                <input
                  type="checkbox"
                  id="useTeams"
                  checked={useTeams}
                  onChange={(e) => {
                    setUseTeams(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedTeams([]);
                      setTeamMembers({});
                      setassigneeemployees([]);
                    }
                  }}
                />
              </div>
        

                  <div className="d-flex mt-3">
                    {/* <div className="form-group col-md-4">
                      <label htmlFor="Status" className="fs-5 custom_badge">
                        <FormattedMessage id="status" />:
                      </label>
                      <select
                        className="form-select input1"
                        value={Status}
                        onChange={(event) => {
                          setStatus(event.target.value);
                        }}
                      >
                        <option value="" selected></option>
                        <option value="Assigned">Assigned</option>
                        <option value="UnAssigned">UnAssigned</option>
                      </select>
                    </div> */}

                    <div className="form-group col-md-4">
                      <label
                        htmlFor="Cummulative Hours"
                        className="fs-5 custom_badge"
                      >
                        <FormattedMessage id="Cummulative Hours" />
                      </label>
                      <input
                        className="form-control custom_input-project"
                        type="text"
                        id="Cummulative Hours"
                        placeholder="Cummulative Hours"
                        value={cummulativeHours}
                        onChange={(event) => {
                          setcummulativeHours(event.target.value);
                        }}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label
                        htmlFor="Project Cost"
                        className="fs-5 custom_badge"
                      >
                        <FormattedMessage id="Project Cost" />
                      </label>
                      <input
                        className="form-control custom_input-project"
                        type="text"
                        id="Project Cost"
                           placeholder="Project Cost"
                        value={projectcost}
                        onChange={(event) => {
                          setprojectcost(event.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="d-flex row mt-3">
                    <div className="form-group d-flex col-md-5 ms-2">
                      <div>
                        <label className="radio mt-2" htmlFor="billableStatus">
                          Billable Status:
                        </label>
                      </div>
                      <div className="mt-2 ms-2">
                        <input
                          type="radio"
                          id="Billable"
                          name="options"
                          value="Billable"
                          checked={billableStatus === "Billable"}
                          onChange={handleOptionChange}
                        />
                      </div>
                      <div className="ms-2 mt-2">
                        <label htmlFor="Billable"> Billable</label>
                      </div>

                      <div className="d-flex ms-3">
                        <div className="mt-2">
                          <input
                            type="radio"
                            id="Non-Billable"
                            name="options"
                            value="Non-Billable"
                            checked={billableStatus === "Non-Billable"}
                            onChange={handleOptionChange}
                          />
                        </div>
                        <div className="ms-2 mt-2" htmlFor="Non-Billable">
                          <label htmlFor="Non-Billable">Non-billable</label>
                        </div>
                      </div>
                    </div>

                    <div className="form-group col-md-5">
                      <label
                        htmlFor="description_p"
                        className="fs-5 custom_badge"
                      >
                        <FormattedMessage id="description" />
                      </label>
                      <textarea
                        className="form-control custom_input-project"
                        type="textarea"
                        id="description_p"
                        value={description_p}
                        onChange={(event) => {
                          setdescription_p(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-3 mb-4 mt-4">
                    <div className="col-md-6 text-end">
                      <button
                        type="submit"
                        className="project_add_button py-2 px-4 border-none"
                      
                      >
                        <i className="icon_project_add fas fa-plus border-1 rounded-circle border-white me-2"></i>
                        <FormattedMessage id="saveChanges" />
                      </button>
                    </div>
                    <div className="col-md-6 text-start">
                      <button
                        type="button"
                        className="project_cancel_button py-2 px-4"
                        data-bs-dismiss="modal"
                        onClick={handleCloseEditModal}
                      >
                        <i className="icon_project_cancel fas fa-times border-1 rounded-circle border-danger me-2"></i>
                        <FormattedMessage id="cancel" />
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
                        projectid:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={projectidOptions}
                      value={{
                        value: selectedOptions.projectidnumber,
                        label: selectedOptions.projectidnumber,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("projectidnumber", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        projectname:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={projectOptions}
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
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">clientname:</label>
                    </div>
                    <Select
                       className="custom_input_filter"
                      options={clientOptions}
                      value={clientOptions.find(
                        (option) => option.value === selectedOptions.Clients
                      )}
                      onChange={(selectedValue) =>
                        handleFilterChange("Clients", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        projectManager:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={projectManagerOptions}
                      value={{
                        value: selectedOptions.projectManager,
                        label: selectedOptions.projectManager,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("projectManager", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">startdate:</label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={startdateOptions}
                      value={{
                        value: selectedOptions.startdate_p,
                        label: selectedOptions.startdate_p,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("startdate_p", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">enddate:</label>
                    </div>

                    <Select
                      className="custom_input_filter"
                      options={enddateOptions}
                      value={{
                        value: selectedOptions.end_date_p,
                        label: selectedOptions.end_date_p,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("end_date_p", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        billablestatus:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={billablestatusOptions}
                      value={{
                        value: selectedOptions.billablestatus,
                        label: selectedOptions.billablestatus,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("billablestatus", selectedValue)
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
                  checked={visibleColumns_project.includes(columnIndex)}
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

export default Projects;

