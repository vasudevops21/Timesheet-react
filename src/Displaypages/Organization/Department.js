import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import "./Department.css";
import "jspdf-autotable";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { PiUserThin } from "react-icons/pi";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import {
  Stack,
  Pagination,
  IconButton,
  Dialog,
  MenuItem,
  Menu,
} from "@mui/material";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GetAppIcon from "@mui/icons-material/GetApp";
import jsPDF from "jspdf";
import { FormattedMessage } from "react-intl";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { BiFilterAlt } from "react-icons/bi";
import { hasPermission } from '../../utils/auth';
import { MultiSelect } from "react-multi-select-component";
import PaginationItem from "@mui/material/PaginationItem";
import { Checkbox, FormControlLabel } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

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

function Department({ locale, setLocale }) {
  const [department, setDepartment] = useState([]);
  const [Departmentid, setDepartmentid] = useState("");
  const [Departmentname, setDepartmentname] = useState("");
  const [Departmentlead, setDepartmentlead] = useState("");
  const [value, setValue] = React.useState("1");
  const [editingClient, setEditingClient] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [access, setAccess] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtereddep, setFilteredDep] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({
    departmentid: "All",
    departmentname: "All",
    departmentlead: "All",
  });

  const totalCount = department.length;

  const resetForm = () => {
    setDepartmentname("");
    setDepartmentlead("");
    setAccess([]);
    setErrors({
      Departmentname: "",
      // Add other fields as needed
    });
  };
  const [errors, setErrors] = useState({
    Departmentname: "",
  });

  const validateForm = () => {
    let valid = true;
    //const { name, email, password } = formData;
    const errorsCopy = { ...errors };

    if (!Departmentname.trim()) {
      errorsCopy.Departmentname = (
        <FormattedMessage id="departmentNameRequired" />
      );
      valid = false;
    } else {
      errorsCopy.Departmentname = "";
    }

    setErrors(errorsCopy);
    return valid;
  };

  const handleChanges = (selectedItems) => {
    console.log("selected Value", selectedItems);
    setAccess(selectedItems);
  };
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset current page to 1 when changing items per page
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchEmployees(0);
  }, []);

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const endpoint =
    process.env.REACT_APP_API_BASE_URL + "/api/v1/Department/getAllDepartment";

  async function save(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return; // Do not proceed with saving if form is invalid
    }
    console.log("Access State:", access); // Add this line to check access state

    // Create accessPayload from the access state
    const accessPayload = access.map((employee) => ({
      value: employee.value,
      label: employee.label,
      id: employee.id,
    }));

    console.log(accessPayload);
    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/Department/save",
        {
          departmentid: Departmentid,
          departmentname: Departmentname,
          departmentlead: Departmentlead,
          access: accessPayload,
        }
      );
      console.log(access);
      toast(
        <FormattedMessage id="departmentRegistrationSuccess"></FormattedMessage>
      );
      setDepartmentid("");
      setDepartmentname("");
      setDepartmentlead("");
      setAccess([]);
      getData("");
    } catch (err) {
      toast.error(
        <FormattedMessage id="departmentRegistrationFailed"></FormattedMessage>
      );
    }
  }

  const getData = async () => {
    try {
      const response = await axios.get(endpoint);
      setFilteredDep(response.data);
      setDepartment(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  };

  const fetchEmployees = async (departmentid) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL +
          `/api/v1/Organization/findByDepartmentIdOrNull/${departmentid}`
      );
      const employeeOptions = response.data.map((employee) => ({
        value: employee.employeeId,
        label: employee.firstname,
        id: employee.employeeId,
      }));
      setEmployees(employeeOptions);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL +
          "/api/v1/Organization/getAllOrganization"
      );
      if (response) {
        const employeeFirstNames = response.data.map(
          (employee) => `${employee.firstname} ${employee.lastname}`
        );
        setEmployee(employeeFirstNames);
      } else {
        throw new Error("Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const openEditModal = (department) => {
    setEditingClient(department);
    setDepartmentname(department.departmentname);
    setDepartmentlead(department.departmentlead);
    setAccess(
      department.access.map((employee) => ({
        value: employee.id,
        label: employee.label,
        id: employee.id,
      }))
    );

    const modal = document.getElementById("editModal");
    modal.classList.add("show");
    modal.style.display = "block";
    console.log(department);
    fetchEmployees(department.departmentid);
  };

  const handleCloseEditModal = () => {
    setEditingClient(null);
    setDepartmentid("");
    setDepartmentname("");
    setDepartmentlead("");
    setAccess([]);
  };

  async function editClient(event) {
    event.preventDefault();
    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/Department/update",
        {
          departmentid: editingClient.departmentid,
          departmentname: Departmentname,
          departmentlead: Departmentlead,
          access: access,
        }
      );

      setFilteredDep((prevFiltereddep) =>
        prevFiltereddep.map((dep) =>
          dep.departmentid === editingClient.departmentid
            ? {
                ...dep,
                departmentname: Departmentname,
                departmentlead: Departmentlead,
                access: access,
              }
            : dep
        )
      );

      toast.success(<FormattedMessage id="departmentUpdatedSuccess" />);
      handleCloseEditModal();
      // getData();
    } catch (err) {
      toast.error(
        <FormattedMessage id="departmentUpdateFailed"></FormattedMessage>
      );
    }
  }

  useEffect(() => {
    filterData();
  }, [selectedOptions]);

  useEffect(() => {
    const totalItems = department.length;
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const newFilteredTasks = department.slice(firstItemIndex, lastItemIndex);

    setFilteredDep(newFilteredTasks);
  }, [department, currentPage, itemsPerPage]);

  // Function to calculate remaining time
  const calculateRemainingTime = (cummulativeHours) => {
    const totalWorkingHours = 40; // Assuming 40 is the total working hours
    return cummulativeHours - totalWorkingHours;
  };

  const filterData = () => {
    let filteredData = department.filter((item) => {
      return (
        (selectedOptions.departmentid === "All" ||
          item.departmentid === selectedOptions.departmentid) &&
        (selectedOptions.departmentname === "All" ||
          item.departmentname === selectedOptions.departmentname) &&
        (selectedOptions.departmentlead === "All" ||
          item.departmentlead === selectedOptions.departmentlead)
      );
    });

    setFilteredDep(filteredData); // Update filteredProjects state
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
      departmentid: "All",
      departmentname: "All",
      departmentlead: "All",
    });
  };

  // Add 'All' option as the default option
  const departmentidOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(department.map((item) => item.departmentid))).map(
      (departmentid) => ({
        value: departmentid,
        label: departmentid,
      })
    ),
  ];

  const departmentnameOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(department.map((item) => item.departmentname))).map(
      (departmentname) => ({
        value: departmentname,
        label: departmentname,
      })
    ),
  ];

  const departmentleadOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(department.map((item) => item.departmentlead))).map(
      (departmentlead) => ({
        value: departmentlead,
        label: departmentlead,
      })
    ),
  ];

  const handleRowSelectionChange = (rowsSelectedData, allRowsSelectedData) => {
    const selectedIds = allRowsSelectedData.map((row) => {
      const rowIndex = row.dataIndex;
      return filtereddep[rowIndex].departmentid;
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
    jumpToPage: true,
    filter: false,
    responsive: "scroll",
    selectableRows: "multiple",
    onRowSelectionChange: handleRowSelectionChange,
    rowsSelected: filtereddep
    .map((row, index) => (selectedRows.includes(row.departmentid) ? index : -1))
    .filter((index) => index !== -1),

    setTableProps: () => ({
      style: {
        width: "100%", // Adjust width of the table
      },
    }),

    onRowsDelete: async (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data.map(
        (row) =>
          department[(currentPage - 1) * itemsPerPage + row.dataIndex]
            .departmentid
      );
      try {
        // Check if any of the deleted departments have assigned employees
        const departmentsWithEmployees = department.filter(
          (dept) =>
            idsToDelete.includes(dept.departmentid) && dept.access.length > 0
        );
        if (departmentsWithEmployees.length > 0) {
          toast(<FormattedMessage id="pleaseRemoveEmployee" />);
          getData();
        } else {
          await Promise.all(
            idsToDelete.map((departmentid) =>
              axios.delete(
                process.env.REACT_APP_API_BASE_URL +
                  `/api/v1/Department/delete/${departmentid}`
              )
            )
          );
          // Reload data after deletion
          toast.success(<FormattedMessage id="deptDeletedSuccess" />);
          getData();

          // Update the current page index if necessary
          const totalPages = Math.ceil(
            (department.length - idsToDelete.length) / itemsPerPage
          );
          if (currentPage > totalPages) {
            setCurrentPage(totalPages);
          }
        }
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
    pagination: false,
    viewColumns: false,
    search: false,
    responsive: "standard", // Make the table responsive
    resizableColumns: false,
    fixedHeader: true, // Fix the header
    fixedSelectColumn: false, // Disable default print button
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

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const exportAction = async () => {
    setLoading(true);
    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/Department/export",
        {
          email: email,
          format: selectedFormat,
        }
      );
      toast.success("Department data exported successfully");
      setEmail("");
      setSelectedFormat("");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export Department data");
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  };

  const downloadCSV = () => {
    // Define column names
    const columnNames = ["Department Id", "Department Name", "Department Lead"];

    // Generate CSV data
    const csvData = [columnNames];
    department.forEach((Departments) => {
      const rowData = [
        Departments.departmentid,
        Departments.departmentname,
        Departments.departmentlead,
      ];
      csvData.push(rowData);
    });

    const csvTitle = "Department_data.csv";
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

    const tableColumn = ["Department Id", "Department Name", "Department Lead"];
    const tableRows = [];

    department.forEach((Departments) => {
      const ClientData = [
        Departments.departmentid,
        Departments.departmentname,
        Departments.departmentlead,
      ];
      tableRows.push(ClientData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    const date = new Date().toLocaleDateString();
    doc.save("Department.pdf");
  };

  const columns = [
    {
      name: "departmentname",
      label: <FormattedMessage id="deptName" />,
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
      name: "departmentlead",
      label: <FormattedMessage id="deptLead" />,
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
      name: "access",
      label: <FormattedMessage id="access" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        // customBodyRender: (value, tableMeta, updateValue) => {
        //   return renderNestedProperty(value);
        // },
        customBodyRender: (value, tableMeta, updateValue) => {
          const EmployeePopup = ({ employees }) => {
            const [openDropdown, setOpenDropdown] = React.useState(false);
            const [searchTerm, setSearchTerm] = React.useState("");

            const filteredEmployees = employees.filter((employee) =>
              `${employee.label}`
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
                          <span className="ms-1">{employee.label}</span>
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
      name: "action",
      label: <FormattedMessage id="action" />,
      options: {
        setCellProps: () => ({
          align: "center",
          style: { position: "sticky", right: 0 },
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { position: "sticky", right: 0 },
        }),
        customBodyRender: (value, tableMeta, updateValue) => {
          const originalIndex = calculateOriginalIndex(
            currentPage,
            tableMeta.rowIndex
          );

          const rowIndex = tableMeta.rowIndex;
          const rowData = filtereddep[rowIndex];

          return (
            <button
              className="btn btn-sm department_edit_btn"
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
              <FormattedMessage id="update" />
            </button>
          );
        },
      },
    },
  ];

  // const modifiedColumns = columns.filter((column) => {
  //   if (column.name === "action") {
  //     // Check if the user has permission to see the "action" column
  //     return hasPermission("departmentaction");
  //   }
  //   return true; // Include all other columns
  // });

  const calculateOriginalIndex = (currentPage, rowIndex) => {
    return (currentPage - 1) * itemsPerPage + rowIndex;
  };

  const totalPages = Math.ceil(department.length / itemsPerPage);

  // Slice data to display only current page's data
  const currentItems = department.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const renderNestedProperty = (value) => {
    console.log(value);
    let returnObject = "";
    if (value && Array.isArray(value)) {
      // Check if value is an array
      returnObject = value.map((item) => item.label).join(", ");
    }
    return returnObject;
  };

  const handleEmployeeChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedEmployees(selectedOptions);
  };

  const handleDepartmentnameChange = (e) => {
    setDepartmentname(e.target.value);
    if (errors.Departmentname) {
      setErrors((prevErrors) => ({ ...prevErrors, Departmentname: "" }));
    }
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

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const [visibleColumns, setVisibleColumns] = useState(() => {
  //   const allColumns = Array.from(Array(columns.length).keys());
  //   // Load from sessionStorage or localStorage
  //   const storedColumns = localStorage.getItem('visibleColumns');
  //   return storedColumns ? JSON.parse(storedColumns) : allColumns;
  // });

  // const handleResetAll = () => {
  //   setVisibleColumns(columns.map((_, index) => index));
  // };

  // useEffect(() => {
  //   // Save to sessionStorage or localStorage whenever visibleColumns changes
  //   localStorage.setItem("visibleColumns", JSON.stringify(visibleColumns));
  // }, [visibleColumns]);

  // const handleColumnVisibilityChange = (columnIndex) => {
  //   setVisibleColumns((prevVisibleColumns) => {
  //     if (prevVisibleColumns.includes(columnIndex)) {
  //       return prevVisibleColumns.filter((index) => index !== columnIndex);
  //     } else {
  //       return [...prevVisibleColumns, columnIndex];
  //     }
  //   });
  // };

  // const filteredColumns = columns.map((column, index) => ({
  //   ...column,
  //   options: {
  //     ...column.options,
  //     display: visibleColumns.includes(index),
  //   },
  // }));

  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");

  // const handleSearchClick = () => {
  //   setIsSearchOpen(!isSearchOpen);
  // };

  // const handleSearchClose = () => {

  //   setSearchTerm("");
  //   setFilteredDep(department);
  // };

  // const handleSearchChange = (event) => {
  //   const searchValue = event.target.value.toString().toLowerCase();
  //   setSearchTerm(searchValue);

  //   const filteredData = department.filter((row) =>
  //     Object.values(row).some((value) =>
  //       value.toString().toLowerCase().includes(searchValue)
  //     )
  //   );
  //   setFilteredDep(filteredData);
  // };

  const renderPagination = () => {
    const totalPages = Math.ceil(department.length / itemsPerPage);
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

  const [visibleColumns_dep, setVisibleColumns] = useState(() => {
    const allColumns = Array.from(Array(columns.length).keys());
    // Load from sessionStorage or localStorage
    const storedColumns = localStorage.getItem("visibleColumns_dep");
    return storedColumns ? JSON.parse(storedColumns) : allColumns;
  });

  const handleResetAll = () => {
    setVisibleColumns(columns.map((_, index) => index));
  };

  useEffect(() => {
    // Save to sessionStorage or localStorage whenever visibleColumns changes
    localStorage.setItem(
      "visibleColumns_dep",
      JSON.stringify(visibleColumns_dep)
    );
  }, [visibleColumns_dep]);

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
      display: visibleColumns_dep.includes(index),
    },
  }));

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setFilteredDep(department);
    // getData();
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toString().toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = department.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchValue)
      )
    );
    setFilteredDep(filteredData);
  };

  const getModifiedColumns = (columns, visibleColumns, hasPermission) => {
    return columns
      .filter((column) => {
        // First, filter out columns based on permissions
        if (column.name === "action") {
          return hasPermission("departmentaction");
        }
        return true;
      })
      .map((column, index) => {
        // Then, apply the visibility mapping
        const isVisible = visibleColumns.includes(index);
        return {
          ...column,
          options: {
            ...column.options,
            display: isVisible,
          },
        };
      });
  };

  const modifiedColumns = getModifiedColumns(
    columns,
    visibleColumns_dep,
    hasPermission
  );

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000} // 25 seconds
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
          <div className="deparment-margin">
            <div className="d-flex justify-content-between ms-5">
              <Box sx={{ width: "100%", typography: "body1" }} className="mt-3">
                <TabContext value={value}>
                  <Box>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        label="Employee"
                        value="2"
                        component={Link}
                        to="/organization"
                      />
                      <Tab
                        label="Department"
                        value="1"
                        component={Link}
                        to="/organization/department"
                      />
                       <Tab
              label={
                <FormattedMessage id="team"></FormattedMessage>
              }
              value="3"
              component={Link}
              to="/organization/team"
            />
                    </TabList>
                  </Box>
                </TabContext>
              </Box>

              <div className="mt-4 me-5">
                {hasPermission("adddepartment") && (
                  <button
                    type="button"
                    className="department_add_btn pe-3"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    onClick={resetForm}
                  >
                    <i className="icon_department fas fa-plus py-2 ps-3 pe-3 me-2"></i>
                    <FormattedMessage id="addDepartment" />
                  </button>
                )}
              </div>
            </div>

            <div
              className="modal fade department_popup"
              id="exampleModalCenter"
              tabIndex="-1"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content rounded-5 shadow-lg">
                  <div className="d-flex justify-content-between ms-5 me-5 mt-4 ">
                    <p
                      className="popup_header modal-title font-weight-bold"
                      id="exampleModalLongTitle"
                    >
                      <FormattedMessage id="addDepartment" />
                    </p>

                    <svg
                      onClick={resetForm}
                      className="department_close_btn"
                      data-bs-dismiss="modal"
                      aria-label="Close"
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
                  </div>
                  <p className="popup_sub mt-3 ms-5">
                    <FormattedMessage id="fillDeptDetails" />
                  </p>
                  <hr className="hr ms-5 mt-3"></hr>
                  <div className="modal-body">
                    <div className=" ms-4 me-4 mt-3">
                      <form onSubmit={save} className="needs-validation">
                        <div className=" d-flex ">
                          <div className="form-group col-md-6">
                            <div>
                              <label
                                htmlFor="Departmentname"
                                className="custom_badge-department"
                              >
                                <FormattedMessage id="deptName" />
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <input
                              className={`form-control custom_input-department ${
                                errors.Departmentname ? "is-invalid" : ""
                              }`}
                              autoComplete="off"
                              type="text"
                          placeholder="Department Name"
                              id="Departmentname"
                              value={Departmentname}
                              onChange={handleDepartmentnameChange}
                            />
                            {errors.Departmentname && (
                              <div className="invalid-feedback">
                                {errors.Departmentname}
                              </div>
                            )}
                          </div>

                          <div className="form-group col-md-6">
                            <label
                              htmlFor="Departmentlead"
                              className="custom_badge-department"
                            >
                              <FormattedMessage id="deptLead" />
                            </label>
                            <select
                              className="form-control input1"
                              id="Departmentlead"
                              value={Departmentlead}
                              onChange={(e) =>
                                setDepartmentlead(e.target.value)
                              }
                            >
                              <option value="">Select Department Lead</option>
                              {employee.map((employee, index) => (
                                <option key={index} value={employee}>
                                  {employee}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="form-group col-md-6 multiselect_assign_employees">
                          <label htmlFor="Access" className="multiselect_label">
                            <FormattedMessage id="access" />
                          </label>
                          <MultiSelect
                            className="multiselect_input"
                            options={employees}
                            value={access}
                            onChange={setAccess}
                            labelledBy="Select"
                            overrideStrings={{
                              allItemsAreSelected:
                                "All Employees are selected...",
                            }}
                          />
                        </div>

                        <div className="d-flex gap-3 mb-4 mt-4">
                          <div className="col-md-6 text-end">
                            <button
                              type="submit"
                              className="department_add_button py-2 px-4 border-none"
                              data-bs-dismiss="modal"
                            >
                              <i className="department_add_button icon_department_add fas fa-plus border-1 rounded-circle border-white me-3"></i>
                              <FormattedMessage id="add" />
                            </button>
                          </div>
                          <div className="col-md-6 text-start">
                            <button
                              type="button"
                              className="department_cancel_button py-2 px-4"
                              data-bs-dismiss="modal"
                              onClick={resetForm}
                            >
                              <i className="icon_department_cancel fas fa-times border-1 rounded-circle border-danger me-2"></i>
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

            <div className="deparment_table mt-4 mx-5">
              <div>
                <div className="mui-datatable-container">
                  {loading && (
                    <div className="loading-container">
                      <FacebookCircularProgress />
                    </div>
                  )}
                  <MUIDataTable
                    className="mui_dep"
                    data={filtereddep}
                    columns={modifiedColumns}
                    options={{
                      ...options,
                      onRowSelectionChange: handleRowSelectionChange,
                      rowsSelected: filtereddep
                        .map((row, index) =>
                          selectedRows.includes(row.departmentid) ? index : -1
                        )
                        .filter((index) => index !== -1),
                    }}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <div className="ms-4 mt-2">
                  <p>
                    <FormattedMessage id="totalRecordCount" /> {totalCount}
                  </p>{" "}
                  {/* Display the total count of rows */}
                </div>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => handleMenuItemClick("csv")}>
                    CSV
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick("pdf")}>
                    PDF
                  </MenuItem>
                </Menu>
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
                      count={Math.ceil(department.length / itemsPerPage)}
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

      <Dialog open={dialogOpen} onClose={handleDialogClose} className="">
        {loading && (
          <div className="loading-dep fs-3 mt-2">
            <FacebookCircularProgress />
          </div>
        )}
        <div className="export ">
          <div className="d-flex justify-content-between ms-5 mt-5">
            <p className="font-weight-bold export_head ">EXPORT</p>

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
            QUICKLY SAVE YOUR DETAILS IN VARIOUS FORMATS
          </p>
          <hr className="hr ms-5"></hr>

          <div className="d-flex my-5 mx-5 mb-5 justify-content-between">
            <div>
              <p className="">Enter your Email to Export</p>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="download2 me-5">
              <p className="">Pick any one format</p>

              <select
                className="bg-white p-2 export_format"
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
              Download
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
              Export
            </button>

            <button
              className="btn export_btn pt-1 "
              type="button"
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
              Cancel
            </button>
          </div>
        </div>
      </Dialog>

      <div
        className="modal fade department_popup"
        id="editModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content rounded-5 shadow-lg">
            <div className="d-flex justify-content-between ms-5 me-5 mt-4 ">
              <p className="popup_header modal-title font-weight-bold">
                <FormattedMessage id="editDepart" />
              </p>
              <svg
                onClick={handleCloseEditModal}
                className="department_close_btn"
                data-bs-dismiss="modal"
                aria-label="Close"
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
            </div>
            <p className="popup_sub mt-2 ms-5">
              <FormattedMessage id="updateDepartDetails" />
            </p>
            <hr className="hr ms-5"></hr>
            <div className="modal-body">
              <div className="ms-4 me-4 mt-3">
                <form onSubmit={editClient}>
                  <div className=" d-flex ">
                    <div className="form-group col-md-6">
                      <label
                        htmlFor="Departmentname"
                        className="custom_badge-department"
                      >
                        <FormattedMessage id="DeptName" />
                      </label>
                      <input
                        className="form-control custom_input-department"
                        autoComplete="off"
                        type="text"
                             placeholder="Department Name"
                        id="Departmentname"
                        value={Departmentname}
                        onChange={(event) => {
                          setDepartmentname(event.target.value);
                        }}
                      />
                    </div>

                    <div className="form-group col-md-6">
                      <label
                        htmlFor="Departmentlead"
                        className="custom_badge-department"
                      >
                        <FormattedMessage id="DeptLead" />
                      </label>
                      <select
                        className="form-select custom_input-department"
                        type="text"
                        id="Departmentlead"
                        value={Departmentlead}
                        onChange={(event) => {
                          setDepartmentlead(event.target.value);
                        }}
                      >
                        <option value="">Select Department Lead</option>
                        {employee.map((employee, index) => (
                          <option key={index} value={employee}>
                            {employee}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="d-flex mt-4">
                    <div className="form-group col-md-6 multiselect_assign_employees">
                      <label htmlFor="Access" className="multiselect_label">
                        Access :
                      </label>

                      <MultiSelect
                        className="multiselect_input"
                        options={employees}
                        value={access}
                        onChange={setAccess}
                        labelledBy="Select"
                        overrideStrings={{
                          allItemsAreSelected: "All Employees are selected...",
                        }}
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-3 mb-4 mt-4">
                    <div className="col-md-6 text-end">
                      <button
                        type="submit"
                        className="department_add_button py-2 px-4 border-none"
                        data-bs-dismiss="modal"
                      >
                        <i className="icon_department_add fas fa-plus border-1 rounded-circle border-white me-2"></i>
                        <FormattedMessage id="saveChanges" />
                      </button>
                    </div>
                    <div className="col-md-6 text-start">
                      <button
                        type="button"
                        className="department_cancel_button py-2 px-4"
                        data-bs-dismiss="modal"
                        onClick={handleCloseEditModal}
                      >
                        <i className="icon_department_cancel fas fa-times border-1 rounded-circle border-danger me-2"></i>
                        <FormattedMessage id="cancel"></FormattedMessage>
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
                        Department Id:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={departmentidOptions}
                      value={{
                        value: selectedOptions.departmentid,
                        label: selectedOptions.departmentid,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("departmentid", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        Department Name:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={departmentnameOptions}
                      value={{
                        value: selectedOptions.departmentname,
                        label: selectedOptions.departmentname,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("departmentname", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        Department Lead:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={departmentleadOptions}
                      value={{
                        value: selectedOptions.departmentlead,
                        label: selectedOptions.departmentlead,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("departmentlead", selectedValue)
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
                  checked={visibleColumns_dep.includes(columnIndex)}
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

export default Department;
