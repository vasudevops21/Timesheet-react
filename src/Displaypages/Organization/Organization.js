import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import {
  IconButton,
  Dialog,
  DialogContent,
  Menu,
  MenuItem,
  Stack,
  Pagination,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import "./Organization.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormattedMessage } from "react-intl";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { hasPermission } from '../../utils/auth';
import Modal from "react-bootstrap/Modal";
import { BiFilterAlt } from "react-icons/bi";
import Select from "react-select";
import DeleteIcon from "@mui/icons-material/Delete";
import PaginationItem from "@mui/material/PaginationItem";
import { Checkbox, FormControlLabel } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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

function Organization({ locale, setLocale }) {
  const [employee, setEmployee] = useState([]);
  const [editedData, setEditedData] = useState({
    employeeId: "",
    employeesid: "",
    firstname: "",
    lastname: "",
    emailid: "",
    contactnumber: "",
    type: "",
    department: {},
    role: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAddEmployeePopup, setOpenAddEmployeePopup] = useState(false);
  const [openEditEmployeePopup, setOpenEditEmployeePopup] = useState(false);
  const [inviteStatus, setInviteStatus] = useState({});
  const [EmployeeID, setEmployeeID] = useState("");
  const [EmployeesID, setEmployeesID] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [EmailID, setEmailID] = useState("");
  const [ContactNumber, setContactNumber] = useState();
  const [Roles, setRoles] = useState("");
  const [email, setEmail] = useState("");
  const [status, setstatus] = useState("");
  const [Employementtype, setEmployementtype] = useState("");
  const [employeer, setEmployeer] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [Department, setDepartment] = useState({});
  const [department, setdepartment] = useState([]);
  const [value, setValue] = React.useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredorg, setFilteredorg] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({
    employeesid: "All",
    firstname: "All",
    lastname: "All",
    emailid: "All",
    contactnumber: "All",
    type: "All",
    department: "All",
    role: "All",
  });
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const resetForm = () => {
    setEmployeesID("");
    setFirstName("");
    setLastName("");
    setEmailID("");
    setContactNumber("");
    setEmployementtype("");
    setDepartment({});
    setRoles("");
    setErrors({
      FirstName: "",
      EmailID: "",
      // Add other fields as needed
    });
  };

  // const formatContactNumber = (number) => {
  //   if (!number) return "";
  //   const numberStr = number.toString();
  //   return numberStr.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  // };

  
  const formatContactNumber = (number) => {
    if (!number) return "";
  
    const numberStr = number.toString().replace(/\D/g, '');
  
    // Detect country code and format accordingly
    if (numberStr.startsWith('1') && numberStr.length === 11) {
      // USA & Canada: +1 (XXX) XXX-XXXX
      return `+1 (${numberStr.slice(1, 4)}) ${numberStr.slice(4, 7)}-${numberStr.slice(7)}`;
    } else if (numberStr.startsWith('44') && numberStr.length === 12) {
      // UK: +44 XXXX XXX XXX
      return `+44 ${numberStr.slice(2, 6)} ${numberStr.slice(6, 9)} ${numberStr.slice(9)}`;
    } else if (numberStr.startsWith('91') && numberStr.length === 12) {
      // India: +91 XXXXX XXXXX
      return `+91 ${numberStr.slice(2, 7)} ${numberStr.slice(7)}`;
    } else {
      // Default format: +X XXX XXX XXXX
      return `+${numberStr.slice(0, 1)} ${numberStr.slice(1, 4)} ${numberStr.slice(4, 7)} ${numberStr.slice(7)}`;
    }
  };
  

  const [errors, setErrors] = useState({
    FirstName: "",
    EmailID: "",
  });

  const validateForm = () => {
    let valid = true;
    //const { name, email, password } = formData;
    const errorsCopy = { ...errors };

    if (!FirstName.trim()) {
      errorsCopy.FirstName = <FormattedMessage id="firstNameRequired" />;
      valid = false;
    } else {
      errorsCopy.FirstName = "";
    }

    if (!EmailID.trim()) {
      errorsCopy.EmailID = (
        <FormattedMessage id="emailIdRequired"></FormattedMessage>
      );
      valid = false;
    } else {
      errorsCopy.EmailID = "";
    }

    setErrors(errorsCopy);
    return valid;
  };

  const handleClientNameChange = (e) => {
    setFirstName(e.target.value);
    if (errors.FirstName) {
      setErrors((prevErrors) => ({ ...prevErrors, FirstName: "" }));
    }
  };

  const handleEmailidChange = (e) => {
    setEmailID(e.target.value);
    if (errors.EmailID) {
      setErrors((prevErrors) => ({ ...prevErrors, EmailID: "" }));
    }
  };

  const endpoint =
    process.env.REACT_APP_API_BASE_URL +
    "/api/v1/Organization/getAllOrganization";
  const updateEndpoint =
    process.env.REACT_APP_API_BASE_URL + "/api/v1/Organization/update";

  async function save(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const emailExists = employee.some((emp) => emp.emailid === EmailID);
    if (emailExists) {
      toast.error(<FormattedMessage id="Email Already Exists" />);
      return;
    }

    const contactExists = employee.some(
      (emp) => emp.contactnumber === ContactNumber
    );
    if (contactExists) {
      toast.error(<FormattedMessage id="Contact Already Exists" />);
      return;
    }

    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/Organization/save",
        {
          employeeId: EmployeeID,
          employeesid: EmployeesID,
          firstname: FirstName,
          lastname: LastName,
          emailid: EmailID,
          contactnumber: ContactNumber,
          type: Employementtype,
          department: Department ? Department : {},
          role: Roles,
        }
      );

      toast(
        <FormattedMessage id="employeeRegistrationSuccess"></FormattedMessage>
      );
      setEmployeeID("");
      setEmployeesID("");
      setFirstName("");
      setLastName("");
      setEmailID("");
      setContactNumber("");
      setEmployementtype("");
      setDepartment({});
      setRoles("");
      getData("");
    } catch (err) {
      toast(<FormattedMessage id="employeeRegistrationFailed" />);
    }
  }

  const getData = async () => {
    try {
      const response = await axios.get(endpoint);
      const employeeData = response.data;

      if (employeeData && Array.isArray(employeeData)) {
        const mappedData = employeeData.map((employee) => ({
          employeeId: employee.employeeId,
          employeename: `${employee.firstname} ${employee.lastname}`,
          firstname: employee.firstname,
          lastname: employee.lastname,
          employeesid: employee.employeesid,
          emailid: employee.emailid,
          contactnumber: employee.contactnumber,
          type: employee.type,
          department: employee.department,
          role: employee.role,
        }));
        setFilteredorg(mappedData);
        setEmployee(mappedData);
      } else {
        console.error("Invalid employee data:", employeeData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL +
          "/api/v1/Department/getAllDepartment"
      );
      setdepartment(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
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
          (employee) => employee.firstname
        );
        setEmployeer(employeeFirstNames);
      } else {
        throw new Error("Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    fetchDepartment();
  }, []);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    fetchInviteStatus();
  }, []);

  useEffect(() => {
    filterData();
  }, [selectedOptions]);

  useEffect(() => {
    const totalItems = employee.length;
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const newFilteredProjects = employee.slice(firstItemIndex, lastItemIndex);

    setFilteredorg(newFilteredProjects);
  }, [employee, currentPage, itemsPerPage]);

  const filterData = () => {
    let filteredData = employee.filter((item) => {
      return (
        (selectedOptions.employeesid === "All" ||
          item.employeesid === selectedOptions.employeesid) &&
        (selectedOptions.firstname === "All" ||
          item.firstname === selectedOptions.firstname) &&
        (selectedOptions.lastname === "All" ||
          item.lastname === selectedOptions.lastname) &&
        (selectedOptions.emailid === "All" ||
          item.emailid === selectedOptions.emailid) &&
        (selectedOptions.contactnumber === "All" ||
          item.contactnumber === selectedOptions.contactnumber) &&
        (selectedOptions.type === "All" ||
          item.type === selectedOptions.type) &&
        (selectedOptions.department === "All" ||
          item.department?.departmentid === selectedOptions.department) &&
        (selectedOptions.role === "All" || item.role === selectedOptions.role)
      );
    });

    setFilteredorg(filteredData);
  };

  const handleFilterChange = (columnName, selectedValue) => {
    const value = selectedValue ? selectedValue.value : "All";
    setSelectedOptions({
      ...selectedOptions,
      [columnName]: value,
    });
  };

  const handleReset = () => {
    setSelectedOptions({
      employeesid: "All",
      firstname: "All",
      lastname: "All",
      emailid: "All",
      contactnumber: "All",
      type: "All",
      department: "All",
      role: "All",
    });
  };

  const employeesidOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(employee.map((item) => item.employeesid))).map(
      (employeesid) => ({
        value: employeesid,
        label: employeesid,
      })
    ),
  ];

  const firstnameOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(employee.map((item) => item.firstname))).map(
      (firstname) => ({
        value: firstname,
        label: firstname,
      })
    ),
  ];

  const lastnameOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(employee.map((item) => item.lastname))).map(
      (lastname) => ({
        value: lastname,
        label: lastname,
      })
    ),
  ];

  const emailidOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(employee.map((item) => item.emailid))).map(
      (emailid) => ({
        value: emailid,
        label: emailid,
      })
    ),
  ];

  const contactnumberOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(employee.map((item) => item.contactnumber))).map(
      (contactnumber) => ({
        value: contactnumber,
        label: contactnumber,
      })
    ),
  ];

  const typeOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(employee.map((item) => item.type))).map((type) => ({
      value: type,
      label: type,
    })),
  ];

  const departmentOptions = [
    { value: "All", label: "All" },
    ...department.map((dept) => ({
      value: dept.departmentid,
      label: dept.departmentname,
    })),
  ];

  const roleOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(employee.map((item) => item.role))).map((role) => ({
      value: role,
      label: role,
    })),
  ];

  const fetchInviteStatus = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/invite-status/getstatus"
      );
      const statusData = response.data;

      // Assuming statusData is an array of objects with employeeId and status properties
      const statusMap = {};
      statusData.forEach((status) => {
        statusMap[status.employeeId] = status.status;
      });

      setInviteStatus(statusMap);
    } catch (error) {
      console.error("Error fetching invite status:", error);
    }
  };

  useEffect(() => {
    const retrieveUserProfile = localStorage.getItem("userInfo");
    if (retrieveUserProfile) {
      const userProfile = JSON.parse(retrieveUserProfile);
      setUserProfile(userProfile);
      localStorage.setItem("currentUserId", userProfile.employeeId);
    }
  }, []);

  const handleDownloadClick = () => {
    setDialogType("download");
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
      case "adp":
        downloadADP();
        break;
      case "dxf":
        downloadDXF();
        break;
      case "doc":
        downloadDOC();
        break;
      case "iff":
        downloadIFF();
        break;

      default:
        break;
    }
  };

  const downloadCSV = () => {
    const columnNames = [
      "employeesid",
      "First Name",
      "Last Name",
      "Email",
      "Contact Number",
      "Employment Type",
      "Role",
    ];

    const csvData = [columnNames];
    employee.forEach((emp) => {
      const rowData = [
        emp.employeesid,
        emp.firstname,
        emp.lastname,
        emp.emailid,
        emp.contactnumber,
        emp.type,
        emp.role,
      ];
      csvData.push(rowData);
    });

    const csvTitle = "employee_data.csv";
    const csvReport = csvData.map((row) => row.join(",")).join("\n");
    const csvBlob = new Blob([csvReport], { type: "text/csv" });
    const csvUrl = window.URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.setAttribute("download", csvTitle);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAction = async () => {
    setLoading(true);
    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/Organization/export",
        {
          email: email,
          format: selectedFormat,
        }
      );
      toast.success("Employee data export successfully");
      setEmail("");
      setSelectedFormat("");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export Employee data");
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  };

  const handleOpenAddEmployeePopup = () => {
    setOpenAddEmployeePopup(true);
  };

  const handleCloseAddEmployeePopup = () => {
    setOpenAddEmployeePopup(false);
    resetForm();
  };

  const handleCloseEditEmployeePopup = () => {
    setOpenEditEmployeePopup(false);
  };

  const handlePhoneInputChange = (value) => {
    setEditedData((prevState) => ({
      ...prevState,
      contactnumber: value,
    }));
  };

  const handleEditInputChange = (event, field) => {
    let selectedDepartment = {};

    if (field === "department" && !isNullOrUndefined(event.target.value)) {
      selectedDepartment = department.find(
        (dept) => dept.departmentid == event.target.value
      );
    }

    setEditedData((prevState) => ({
      ...prevState,
      [field]:
        field === "department" && selectedDepartment
          ? selectedDepartment
          : event.target.value || "",
    }));
  };

  const isNullOrUndefined = (value) => {
    return value === undefined || value === null || value === "";
  };

  const handleEditSubmit = async (editedData) => {
    try {
      await axios.post(updateEndpoint, editedData);
      setFilteredorg((prevEmployee) =>
        prevEmployee.map((emp) =>
          emp.employeeId === editedData.employeeId
            ? {
                ...emp,
                ...editedData,
                department: editedData.department || emp.department,
                employeename: `${editedData.firstname || emp.firstname} ${
                  editedData.lastname || emp.lastname
                }`,
              }
            : emp
        )
      );
      toast(<FormattedMessage id="employeeUpdateSuccess"></FormattedMessage>);
      // getData();
      handleCloseEditEmployeePopup();
    } catch (err) {
      toast(<FormattedMessage id="employeeUpdateFail" />);
    }
  };

  const handleRowSelectionChange = (rowsSelectedData, allRowsSelectedData) => {
    const selectedIds = allRowsSelectedData.map((row) => {
      const rowIndex = row.dataIndex;
      return filteredorg[rowIndex].employeeId;
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
      selectedRows: {
        text: "Employee(s) selected",
        delete: "Delete",
        deleteAria: "Delete Selected Rows",
      },
    },
    tableBodyHeight: "430px",
    jumpToPage: true,
    onRowSelectionChange: handleRowSelectionChange,
    rowsSelected: filteredorg
      .map((row, index) => (selectedRows.includes(row.employeeId) ? index : -1))
      .filter((index) => index !== -1),
    filter: false,
    responsive: "scroll",
    selectableRows: "multiple",
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
      const handleDelete = async () => {
        if (!hasPermission("deleteemployee")) {
          // User doesn't have permission to delete employees
          return;
        }

        const confirmDelete = window.confirm(
          <FormattedMessage id="employeeDelete" />
        );
        getData();
        if (!confirmDelete) return; // If user cancels, exit function

        const idsToDelete = selectedRows.data.map(
          (row) =>
            employee[(currentPage - 1) * itemsPerPage + row.dataIndex]
              .employeeId
        );
        try {
          await Promise.all(
            idsToDelete.map((employeeId) =>
              axios.delete(
                process.env.REACT_APP_API_BASE_URL +
                  `/api/v1/Organization/delete/${employeeId}`
              )
            )
          );
          getData(); // Reload data after deletion
          toast(<FormattedMessage id="employeeDeleteSuccess" />);
          const totalPages = Math.ceil(
            (employee.length - idsToDelete.length) / itemsPerPage
          );
          if (currentPage > totalPages) {
            setCurrentPage(totalPages);
          }
        } catch (error) {
          console.error("Error deleting data:", error);
        }
      };

      return hasPermission("deleteemployee") ? (
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      ) : null;
    },

    customHeadCellStyle: {
      fontSize: "16px", // Adjust the font size for table headers
    },
    customBodyCellStyle: {
      fontSize: "14px", // Adjust the font size for table body cells
    },

    download: false,
    pagination: false, // Disable default download button
    print: false,
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

  const downloadPDF = () => {
    const doc = new jsPDF("p", "pt", "letter");

    const tableColumn = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Contact Number",
      "Employementtype",
    ];
    const tableRows = [];

    employee.forEach((employee) => {
      const employeeData = [
        employee.employeesid,
        employee.firstname,
        employee.lastname,
        employee.emailid,
        employee.contactnumber,
        employee.type,
        employee.department,

        // Add more fields as needed
      ];
      tableRows.push(employeeData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      styles: {
        cellPadding: 8,
        valign: "middle",
        halign: "left",
      },
    });

    const date = new Date().toLocaleDateString();
    // doc.text(`Employees Information ()`, 50, 40);
    doc.save("employees_information.pdf");
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

  const handleOpenEditEmployeePopup = (rowData) => {
    setEditedData({ ...rowData });
    setOpenEditEmployeePopup(true);
  };

  const downloadADP = () => {
    // Generate ADP-formatted data
    const adpData = generateADPData();

    // Create ADP file and trigger download
    const adpTitle = "employee_data.adp";
    const adpBlob = new Blob([adpData], { type: "text/plain" });
    const adpUrl = window.URL.createObjectURL(adpBlob);
    const link = document.createElement("a");
    link.href = adpUrl;
    link.setAttribute("download", adpTitle);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateADPData = () => {
    let adpData = "";

    // Header
    adpData += "ADP Employee Data\n";

    // Employee information
    employee.forEach((emp) => {
      adpData += `ID: ${emp.employeesid}, `;
      adpData += `Name: ${emp.firstname} ${emp.lastname}, `;
      adpData += `Email: ${emp.emailid}, `;
      adpData += `Contact Number: ${emp.contactnumber}\n`;
    });

    return adpData;
  };

  const downloadDXF = () => {};

  const downloadDOC = async () => {};

  // Call downloadDOC() when you want to trigger the download

  const downloadIFF = () => {};

  const columns = [
    {
      name: "employeesid",
      label: <FormattedMessage id="employeesId" />,
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
      name: "employeename",
      label: <FormattedMessage id="employeeName"></FormattedMessage>,
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
      name: "emailid",
      label: <FormattedMessage id="emailId" />,
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
      name: "contactnumber",
      label: <FormattedMessage id="contactNumber" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        customBodyRender: (value) => {
          return formatContactNumber(value);
        },
      },
    },
    {
      name: "department",
      label: <FormattedMessage id="department" />,
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
      name: "type",
      label: <FormattedMessage id="employeementType" />,
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
      name: "role",
      label: <FormattedMessage id="roles"></FormattedMessage>,
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
      name: "status",
      label: <FormattedMessage id="status" />,
      options: {
        setCellProps: () => ({ align: "center" }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const rowData = filteredorg[rowIndex];
          const currentUserId = userProfile?.employeeId;
          const isCurrentUser = rowData && rowData.employeeId === currentUserId;

          if (isCurrentUser) {
            return "active";
          } else {
            const currentEmployeeStatus =
              (rowData && inviteStatus[rowData.employeeId]) || "";
            return currentEmployeeStatus;
          }
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
          style: { position: "sticky", right: 0, letterSpacing: "2.8px" },
        }),
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowIndex = tableMeta.rowIndex;
          const rowData = filteredorg[rowIndex];
          const currentUserId = userProfile?.employeeId;
          const isCurrentUser = rowData && rowData.employeeId === currentUserId;
          const currentEmployeeStatus = isCurrentUser
            ? "active"
            : (rowData && inviteStatus[rowData.employeeId]) || "";

          const handleSendInviteClick = (employee) => {
            setSelectedEmployee(employee);
            setShowModal(true);
          };
          const handleSendInviteConfirm = () => {
            if (selectedEmployee) {
              handleSendInvite(selectedEmployee);
              setShowModal(false);
            }
          };
          const handleReSendInviteConfirm = () => {
            if (selectedEmployee) {
              handleReSendInvite(selectedEmployee);
              setShowModal(false);
            }
          };

          return (
            <>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn-sm edit_employee_btn border-none"
                  onClick={() => handleOpenEditEmployeePopup(rowData)}
                >
                  <svg
                    className="me-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                  >
                    <path
                      d="M2.84482 11.788C4.69968 13.6429 7.11053 14.1986 8.29568 14.3126C8.64396 14.3526 8.83825 14.1383 8.86482 13.9174C8.89168 13.6832 8.74425 13.4286 8.40968 13.3817C7.33825 13.2343 5.12168 12.7523 3.51453 11.1252C0.889391 8.49344 0.393962 4.51572 2.53682 2.37287C4.27796 0.638582 7.17739 0.859439 9.31368 2.01115L10.01 1.33487C7.41168 -0.225419 3.91625 -0.352561 1.8671 1.70315C-0.570324 4.14744 -0.248895 8.6943 2.84482 11.788ZM12.662 2.29915L13.1974 1.76344C13.4517 1.50915 13.4654 1.13401 13.2042 0.892867L13.03 0.732296C12.8025 0.51801 12.4474 0.524582 12.1997 0.758867L11.6708 1.30144L12.662 2.29915ZM6.15968 8.78773L12.1728 2.78115L11.1751 1.7903L5.16853 7.7903L4.61282 9.06915C4.55911 9.20973 4.69968 9.35058 4.84711 9.30344L6.15968 8.78773ZM5.28253 9.78572C7.47196 11.9754 10.9942 12.8394 12.9631 10.8772C14.5702 9.26344 14.3625 6.39715 12.6417 3.93315L11.9588 4.61601C13.3245 6.6383 13.5925 8.90858 12.2934 10.2074C10.7134 11.788 8.10139 11.038 6.30682 9.34372L5.28253 9.78572Z"
                      fill="white"
                    />
                  </svg>
                  Edit
                </button>

                <button
                  type="button"
                  data-toggle="modal"
                  data-target="#sentModal"
                  className="invite_btn font-weight-3 btn-sm"
                  onClick={() => handleSendInviteClick(rowData)}
                >
                  <svg
                    className="send_invite_btn me-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M4.16675 13.1225V15C4.16675 15.221 4.25455 15.4329 4.41083 15.5892C4.56711 15.7455 4.77907 15.8333 5.00008 15.8333H15.0001C15.2211 15.8333 15.4331 15.7455 15.5893 15.5892C15.7456 15.4329 15.8334 15.221 15.8334 15V13.1225M10.1684 4.93079V12.0141M12.9551 6.88913L10.1684 4.16663L7.38175 6.88913"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {currentEmployeeStatus === "active" ||
                  currentEmployeeStatus === "pending"
                    ? "Resend Invite"
                    : "Send Invite"}
                </button>

                {/* {isCurrentUser && (
                  <button
                    type="button"
                    className="invite_btn font-weight-3 btn-sm"
                
                  >
                    <svg
                      className="send_invite_btn me-1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M4.16675 13.1225V15C4.16675 15.221 4.25455 15.4329 4.41083 15.5892C4.56711 15.7455 4.77907 15.8333 5.00008 15.8333H15.0001C15.2211 15.8333 15.4331 15.7455 15.5893 15.5892C15.7456 15.4329 15.8334 15.221 15.8334 15V13.1225M10.1684 4.93079V12.0141M12.9551 6.88913L10.1684 4.16663L7.38175 6.88913"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <FormattedMessage id="sendInvite"></FormattedMessage>
                  </button>
                )} */}
              </div>

              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <div className="my-3">
                  <p className="text-center">
                    Are you sure you want to send an invite to{" "}
                    <span className="font-weight-bold">
                      {" "}
                      {selectedEmployee?.firstname} {selectedEmployee?.lastname}{" "}
                    </span>
                    ?
                  </p>

                  <div className="d-flex gap-4 justify-content-center">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="px-3">Cancel</span>
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={
                        currentEmployeeStatus === "active" ||
                        currentEmployeeStatus === "pending"
                          ? handleReSendInviteConfirm
                          : handleSendInviteConfirm
                      }
                    >
                      <span className="px-4">OK</span>
                    </button>
                  </div>
                </div>
              </Modal>
            </>
          );
        },
      },
    },
  ];

  const handleSendInvite = async (employee) => {
    try {
      // Prepare the data to be sent in the API request

      let appUrl = window.location.origin 

      const inviteData = {
        employeeId: employee.employeeId,
        emailAddress: employee.emailid,
        firstName: employee.firstname,
        lastName: employee.lastname,
        appURl:appUrl,
      };

      // Update the inviteStatus state with the new status (sending)
      setInviteStatus({ ...inviteStatus, [employee.employeeId]: "sending" });

      // Make the API request to send the invitation
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/login/invitations/send?appUrl=${appUrl}`,
        inviteData
    );

      if (response.status === 200) {
        // Update the backend with the new inviteStatus
        await axios.post(
          process.env.REACT_APP_API_BASE_URL +
            `/api/invite-status/${employee.employeeId}`,
          { status: "active" }
        );

        fetchInviteStatus();
        toast.success("Invitation sent successfully");
      } else {
        throw new Error("Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");

      // Update the backend with the previous inviteStatus
      await axios.post(
        process.env.REACT_APP_API_BASE_URL +
          `/api/invite-status/${employee.employeeId}`,
        { status: "pending" }
      );

      // Update the inviteStatus state with the previous status (pending)
      setInviteStatus({ ...inviteStatus, [employee.employeeId]: "pending" });
    }
  };

  

  const handleReSendInvite = async (employee) => {
    try {
        let appUrl = window.location.origin;
        const inviteData = {
            employeeId: employee.employeeId,
            appURl:appUrl,

        };

        setInviteStatus({ ...inviteStatus, [employee.employeeId]: "resending" });

        const response = await axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/login/invitations/resend/${employee.employeeId}?appUrl=${appUrl}`,
            inviteData
        );

        if (response.status === 200) {
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/invite-status/${employee.employeeId}`,
                { status: "active" }
            );

            fetchInviteStatus();
            toast.success("Invitation resent successfully");
        }
    } catch (error) {
        console.error("Error resending invitation:", error);
        toast.error("Failed to resend invitation");

        await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/invite-status/${employee.employeeId}`,
            { status: "pending" }
        );

        setInviteStatus({ ...inviteStatus, [employee.employeeId]: "pending" });
    }
};

  const renderNestedProperty = (value) => {
    if (value && typeof value === "object") {
      // Access nested property
      return value.departmentname;
    }
    return value;
  };

  const handleSubmits = async (event) => {
    event.preventDefault();
    try {
      console.log(editedData);
      await handleEditSubmit(editedData); // Call your save function with editedData
      // getData();
      setOpenEditEmployeePopup(false); // Close the dialog
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleOptionChange = (event) => {
    setEmployementtype(event.target.value);
  };

  const totalCount = employee.length;

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset current page to 1 when changing items per page
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(employee.length / itemsPerPage);

  const renderPagination = () => {
    const totalPages = Math.ceil(employee.length / itemsPerPage);
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

  const [visibleColumns_employee, setVisibleColumns] = useState(() => {
    // Load from sessionStorage or localStorage
    const storedColumns = localStorage.getItem("visibleColumns_employee");
    return storedColumns
      ? JSON.parse(storedColumns)
      : columns.map((_, index) => index);
  });

  const handleResetAll = () => {
    setVisibleColumns(columns.map((_, index) => index));
  };

  useEffect(() => {
    // Save to sessionStorage or localStorage whenever visibleColumns changes
    localStorage.setItem(
      "visibleColumns_employee",
      JSON.stringify(visibleColumns_employee)
    );
  }, [visibleColumns_employee]);

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
      display: visibleColumns_employee.includes(index),
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
    setFilteredorg(employee);
    // getData();
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toString().toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = employee.filter((row) =>
      Object.entries(row).some(([key, value]) => {
        if (key === "department" && value) {
          // Handle the nested structure of department
          if (Array.isArray(value)) {
            return value.some((dept) => {
              if (dept && dept.departmentname) {
                return dept.departmentname.toLowerCase().includes(searchValue);
              }
              return false;
            });
          } else if (value && value.departmentname) {
            // Handle case if department is not an array but a nested object
            return value.departmentname.toLowerCase().includes(searchValue);
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
      })
    );
    setFilteredorg(filteredData);
  };

  const getModifiedColumns = (columns, visibleColumns, hasPermission) => {
    return columns
      .filter((column) => {
        // First, filter out columns based on permissions
        if (column.name === "action") {
          return hasPermission("employeeaction");
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

  // Usage
  const modifiedColumns = getModifiedColumns(
    columns,
    visibleColumns_employee,
    hasPermission
  );

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
          <div className="employee-margin">
            <div className="d-flex justify-content-between ms-5">
              <div>
                <Box
                  sx={{ width: "100%", typography: "body1" }}
                  className="mt-3"
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
                          label={
                            <FormattedMessage id="employee"></FormattedMessage>
                          }
                          value="1"
                          component={Link}
                          to="/organization"
                        />
                        <Tab
                          label={
                            <FormattedMessage id="department"></FormattedMessage>
                          }
                          value="2"
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
              </div>
              <div className="mt-4 me-5">
                {hasPermission("addemployee") && (
                  <button
                    onClick={handleOpenAddEmployeePopup}
                    className="org_add_btn pe-3"
                  >
                    <i className="icon_org fas fa-plus py-2 ps-3 pe-3 me-2"></i>
                    <FormattedMessage id="addEmployee" />
                  </button>
                )}
              </div>
            </div>

            <Dialog
              open={openAddEmployeePopup}
              onClose={handleCloseAddEmployeePopup}
            >
              <div className=" mt-3 popup rounded-5">
                <div className="ms-3 d-flex justify-content-between">
                  <p className="popup_header font-weight-bold">
                    <FormattedMessage id="addEmployee"></FormattedMessage>
                  </p>

                  {/* <ClearIcon /> */}
                  <svg
                    onClick={handleCloseAddEmployeePopup}
                    className="org_close_btn"
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
                <div className="ms-4">
                  <p className="popup_sub mt-3">
                    <FormattedMessage id="fillDetails" />
                  </p>
                </div>

                <hr className="hr mt-4 ms-4"></hr>

                <DialogContent className="edit">
                  <div className="popup1 ">
                    <form className="" onSubmit={save}>
                      <div className=" d-flex gap-2">
                        <div className="form-group col-md-4">
                          <label
                            className="custom_badge-organization form-label"
                            for="FirstName"
                          >
                            <FormattedMessage id="firstName" />{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            className={`form-control custom_input-Organization ${
                              errors.FirstName ? "is-invalid" : ""
                            }`}
                            autoComplete="off"
                            fullWidth
                            id="FirstName"
                            value={FirstName}
                            onChange={handleClientNameChange}
                            placeholder="Firstname"
                          />
                          {errors.FirstName && (
                            <div className="invalid-feedback">
                              {errors.FirstName}
                            </div>
                          )}
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            className="custom_badge-organization"
                            htmlFor="Last Name"
                          >
                            <FormattedMessage id="lastName" />
                          </label>
                          <input
                            className="form-control custom_input-Organization"
                            autoComplete="off"
                            fullWidth
                            id="LastName"
                            value={LastName}
                              placeholder="Lastname"
                            onChange={(event) => {
                              setLastName(event.target.value);
                            }}
                          />
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            className="custom_badge-organization"
                            htmlFor="user-id"
                          >
                            <FormattedMessage id="emailId" />{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            autoComplete="off"
                            className={`form-control custom_input-Organization ${
                              errors.EmailID ? "is-invalid" : ""
                            }`}
                            fullWidth
                            id="EmailID"
                            value={EmailID}
                              placeholder="Email ID"
                            onChange={handleEmailidChange}
                          />
                          {errors.EmailID && (
                            <div className="invalid-feedback">
                              {errors.EmailID}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className=" d-flex gap-2 my-2">
                        <div className="form-group col-md-4">
                          <label
                            className=" emp_contact_label"
                            htmlFor="password"
                          >
                            <FormattedMessage id="contactNumber" />
                          </label>

                          <ReactPhoneInput
                          searchPlaceholder={'search'}
                             enableSearch={true}
                            className="emp_contact "
                            country={"us"}
                              placeholder="Contact Number"
                            value={ContactNumber}
                            onChange={(phone) => setContactNumber(phone)}
                          
                            inputStyle={{ width: "100%" }}
                          />
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            className="custom_badge-organization"
                            htmlFor="Department"
                          >
                            <FormattedMessage id="Department" />
                          </label>
                          <select
                            className="form-select input1"
                            id="Department"
                              placeholder="Department"
                            value={Department.departmentid || ""}
                            onChange={(e) => {
                              console.log(e.target.value);
                              let selectedDepartment = {};
                              if (department) {
                                selectedDepartment = department.find(
                                  (department) =>
                                    department.departmentid == e.target.value
                                );
                              }
                              setDepartment(selectedDepartment);
                            }}
                          >
                            <option value="">Select Department</option>
                            {department.map((department, index) => (
                              <option
                                key={department.departmentid}
                                value={department.departmentid}
                              >
                                {department.departmentname}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            className="custom_badge-organization"
                            htmlFor="Last Name"
                          >
                            <FormattedMessage id="roles" />
                          </label>
                          <select
                            className="form-select input1"
                            autoComplete="off"
                            fullWidth
                            id="Roles"
                     
                            value={Roles}
                            onChange={(event) => {
                              setRoles(event.target.value);
                            }}
                          >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="User">User</option>
                          </select>
                        </div>
                      </div>

                      <div className=" d-flex gap-2 my-2">
                        <div className="form-group mt-2 ms-4">
                          <label className="radio" htmlFor="Employementtype">
                        Employee type :
                          </label>
                        </div>
                        <div className="mt-2">
                          <input
                            type="radio"
                            name="options"
                            value="Full-Time"
                            checked={Employementtype === "Full-Time"}
                            onChange={handleOptionChange}
                          />
                        </div>
                        <div className="ms-1 mt-2">
                          <label>
                            {" "}
                            <FormattedMessage id="Full-Time"></FormattedMessage>
                          </label>
                        </div>

                        <div className="d-flex ms-3">
                          <div className="mt-2">
                            <input
                              type="radio"
                              name="options"
                              value="Sub-Contract"
                              checked={Employementtype === "Sub-Contract"}
                              onChange={handleOptionChange}
                            />
                          </div>
                          <div className="ms-2 mt-2">
                            <label>
                              <FormattedMessage id="subContract"></FormattedMessage>
                            </label>
                          </div>
                        </div>

                        <div className=" d-flex gap-2 my-2"></div>
                      </div>

                      <div className="text-end d-flex gap-2 ms-5 me-5">
                        <div className="form-group col-md-6">
                          <button
                            type="submit"
                            className="employee_add_button py-2 px-4 border-none"
                            // onClick={handleSubmit}
                          >
                            <i className="icon_employee_add fas fa-plus border-1 rounded-circle border-white me-3"></i>
                            <FormattedMessage id="add" />
                          </button>
                        </div>
                        <div className="form-group col-md-6 text-start">
                          <button
                            type="button"
                            className="employee_cancel_button py-2 px-4"
                            onClick={handleCloseAddEmployeePopup}
                          >
                            <i className="icon_employee_cancel fas fa-times border-1 rounded-circle border-danger me-2"></i>
                            <FormattedMessage id="cancel" />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </div>
            </Dialog>

            <Dialog
              open={openEditEmployeePopup}
              onClose={handleCloseEditEmployeePopup}
            >
              <div className="mt-3 popup rounded-5">
                <div className="ms-3 d-flex justify-content-between">
                  <p className="popup_header font-weight-bold">Edit Employee</p>

                  <svg
                    onClick={handleCloseEditEmployeePopup}
                    className="org_close_btn"
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
                <p className="popup_sub mt-4 ms-4">
                  <FormattedMessage id="updateEmployeeDetails"></FormattedMessage>
                </p>
                <hr className="hr mt-4 ms-4"></hr>
                <DialogContent className="edit">
                  <div className="popup1 ">
                    <div className=" d-flex gap-2">
                      <div className="form-group col-md-4">
                        <p
                          className="custom_badge-organization"
                          htmlFor="first-name"
                        >
                          <FormattedMessage id="firstName" />
                        </p>
                        <input
                          className="form-control custom_input-Organization"
                          autoComplete="off"
                          fullWidth
                          id="FirstName"
                            placeholder="First Name"
                          value={editedData.firstname || ""}
                          onChange={(event) =>
                            handleEditInputChange(event, "firstname")
                          }
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <p
                          className="custom_badge-organization"
                          htmlFor="last-name"
                        >
                          <FormattedMessage id="lastName" />
                        </p>
                        <input
                          className="form-control custom_input-Organization"
                          autoComplete="off"
                          required
                          fullWidth
                            placeholder="Last Name"
                          id="LastName"
                          value={editedData.lastname || ""}
                          onChange={(event) =>
                            handleEditInputChange(event, "lastname")
                          }
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <p
                          className="custom_badge-organization"
                          htmlFor="email-id"
                        >
                          <FormattedMessage id="emailId" />
                        </p>
                        <input
                          type="email"
                          className="form-control custom_input-Organization"
                          autoComplete="off"
                          fullWidth
                          id="EmailID"
                               placeholder="Email ID"
                          value={editedData.emailid || ""}
                          onChange={(event) =>
                            handleEditInputChange(event, "emailid")
                          }
                        />
                      </div>
                    </div>

                    <div className=" d-flex gap-2 my-2">
                      <div className="form-group col-md-4">
                        <p
                          className=" emp_contact_label"
                          htmlFor="contact-number"
                        >
                          <FormattedMessage id="contactNumber" />
                        </p>

                        <ReactPhoneInput
                            searchPlaceholder={'search'}
                        enableSearch={true}
                          className="emp_contact"
                          country={"us"}
                          value={
                            editedData.contactnumber
                              ? String(editedData.contactnumber)
                              : ""
                          }
                          onChange={handlePhoneInputChange}
                          placeholder="Enter contact number"
                          inputStyle={{ width: "100%" }}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <label
                          className="custom_badge-organization"
                          htmlFor="Last Name"
                        >
                          <FormattedMessage id="roles" />
                        </label>
                        <select
                          className="form-select input1"
                          autoComplete="off"
                          required
                          fullWidth
                          id="Roles"
                          value={editedData.role || ""}
                          onChange={(event) =>
                            handleEditInputChange(event, "role")
                          }
                        >
                          <option value="">Select Role</option>
                          <option value="Admin">Admin</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="User">User</option>
                        </select>
                      </div>

                      <div className="form-group col-md-4">
                        <p
                          className="custom_badge-organization"
                          htmlFor="Department"
                        >
                          <FormattedMessage id="department"></FormattedMessage>
                        </p>
                        <select
                          className="form-select input1"
                          id="Department"
                          value={editedData.department?.departmentid ?? {}}
                          onChange={(e) =>
                            handleEditInputChange(e, "department")
                          }
                        >
                          <option value="">Select Department</option>
                          {department.map((department, index) => (
                            <option key={index} value={department.departmentid}>
                              {department.departmentname}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className=" d-flex gap-2 my-2">
                    <div className="form-group mt-2 ms-4">
                      <label className="radio" htmlFor="Employementtype">
                      Employee type :
                      </label>
                    </div>
                    <div className="mt-2">
                      <input
                        type="radio"
                        name="options"
                        value="Full-Time"
                        checked={editedData.type === "Full-Time"}
                        onChange={(event) =>
                          handleEditInputChange(event, "type")
                        }
                      />
                    </div>
                    <div className="ms-1 mt-2">
                      <label>
                        <FormattedMessage id="Full-Time" />
                      </label>
                    </div>

                    <div className="d-flex ms-3">
                      <div className="mt-2">
                        <input
                          type="radio"
                          name="options"
                          value="Sub-Contract"
                          checked={editedData.type === "Sub-Contract"}
                          onChange={(event) =>
                            handleEditInputChange(event, "type")
                          }
                        />
                      </div>
                      <div className="ms-2 mt-2">
                        <label>Sub-Contract</label>
                      </div>
                    </div>
                  </div>

                  <div className="text-end d-flex gap-2 ms-5 me-5">
                    <div className="form-group col-md-6">
                      <button
                        type="submit"
                        className="employee_add_button py-2 px-4 border-none"
                        onClick={handleSubmits}
                      >
                        <i className="icon_employee_add fas fa-plus border-1 rounded-circle border-white me-2"></i>
                        <FormattedMessage id="saveChanges" />
                      </button>
                    </div>
                    <div className="form-group col-md-6 text-start">
                      <button
                        type="button"
                        className="employee_cancel_button py-2 px-4"
                        onClick={handleCloseEditEmployeePopup}
                      >
                        <i className="icon_employee_cancel fas fa-times border-1 rounded-circle border-danger me-2"></i>
                        <FormattedMessage id="cancel" />
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </div>
            </Dialog>

            <Dialog open={dialogOpen} onClose={handleDialogClose} className="">
              {loading && (
                <div className="loading-org fs-3 mt-2">
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
                  <FormattedMessage id="quickySaveFormats" />
                </p>
                <hr className="hr ms-5"></hr>

                <div className="d-flex my-5 mx-5 mb-5 justify-content-between">
                  <div>
                    <p className="">
                      <FormattedMessage id="emailExport"></FormattedMessage>
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
                    <p className="">Pick any one format</p>

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

            <div className="employee_table mt-4 mx-5">
              <div>
                <div className="mui-datatable-container">
                  {loading && (
                    <div className="loading-container">
                      <FacebookCircularProgress />
                    </div>
                  )}
                  <MUIDataTable
                    className="mui_org"
                    data={filteredorg}
                    columns={modifiedColumns}
                    options={{
                      ...options,
                      onRowSelectionChange: handleRowSelectionChange,
                      rowsSelected: filteredorg
                        .map((row, index) =>
                          selectedRows.includes(row.employeeId) ? index : -1
                        )
                        .filter((index) => index !== -1),
                    }}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <div className="ms-4 mt-2">
                  <p>
                    <FormattedMessage id="Total Record Count :" /> {totalCount}
                  </p>{" "}
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
                      count={Math.ceil(employee.length / itemsPerPage)}
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
                      <label className="custom_badge_filter1">
                        Employee Id:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter1"
                      options={employeesidOptions}
                      value={{
                        value: selectedOptions.employeesid,
                        label: selectedOptions.employeesid,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("employeesid", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter1">
                        First Name:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter1"
                      options={firstnameOptions}
                      value={{
                        value: selectedOptions.firstname,
                        label: selectedOptions.firstname,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("firstname", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">Last Name:</label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={lastnameOptions}
                      value={{
                        value: selectedOptions.lastname,
                        label: selectedOptions.lastname,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("lastname", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">Email Id:</label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={emailidOptions}
                      value={{
                        value: selectedOptions.emailid,
                        label: selectedOptions.emailid,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("emailid", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        Contactnumber:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={contactnumberOptions}
                      value={{
                        value: selectedOptions.contactnumber,
                        label: selectedOptions.contactnumber,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("contactnumber", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        Employee Type:
                      </label>
                    </div>

                    <Select
                      className="custom_input_filter"
                      options={typeOptions}
                      value={{
                        value: selectedOptions.type,
                        label: selectedOptions.type,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("type", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">Department:</label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={departmentOptions}
                      value={departmentOptions.find(
                        (option) => option.value === selectedOptions.department
                      )}
                      onChange={(selectedValue) =>
                        handleFilterChange("department", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">Role:</label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={roleOptions}
                      value={{
                        value: selectedOptions.role,
                        label: selectedOptions.role,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("role", selectedValue)
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
                  checked={visibleColumns_employee.includes(columnIndex)}
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

export default Organization;
