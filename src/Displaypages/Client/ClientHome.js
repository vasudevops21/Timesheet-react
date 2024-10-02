import React, { useState, useEffect } from "react";
import "./Addclient.css";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { IconButton, MenuItem } from "@mui/material";
import { Stack, Pagination, Menu, Dialog, Box } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import { FormattedMessage } from "react-intl";
import { BiFilterAlt } from "react-icons/bi";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Select from "react-select";
import PaginationItem from '@mui/material/PaginationItem';
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

function Homeclient({ locale, setLocale }) {
  const [clientid, setclientid] = useState("");
  const [clientsname, setclientsname] = useState("");
  const [emailid, setemailid] = useState("");
  const [contactnumber, setcontactnumber] = useState("");
  const [Businessname, setBusinessname] = useState("");
  const [PrimaryBusinessunit, setPrimaryBusinessunit] = useState("");
  const [Fedaralid, setFedaralid] = useState("");
  const [Website, setWebsite] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [Status, setStatus] = useState("");
  const [Address, setAddress] = useState("");
  const [Client, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [Clientidnumber, setClientidnumber] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset current page to 1 when changing items per page
  };
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({
    clientidnumber: "All",
    clientsname: "All",
    emailid: "All",
    contactnumber: "All",
    status: "All",
    businessname: "All",
    fedaralid: "All",
    primarybusinessunit: "All",
    website: "All",
  });

  const resetForm = () => {
    setclientid("");
    setClientidnumber("");
    setclientsname("");
    setemailid("");
    setcontactnumber("");
    setStatus("");
    setAddress("");
    setBusinessname("");
    setFedaralid("");
    setPrimaryBusinessunit("");
    setWebsite("");
    setErrors({
      clientsname: "",
      emailid: "",
      // Add other fields as needed
    });
  };

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
    clientsname: "",
    emailid: "",
  });

  const validateForm = () => {
    let valid = true;
    //const { name, email, password } = formData;
    const errorsCopy = { ...errors };

    if (!clientsname.trim()) {
      errorsCopy.clientsname = <FormattedMessage id="clientNameRequired" />;
      valid = false;
    } else {
      errorsCopy.clientsname = "";
    }

    if (!emailid.trim()) {
      errorsCopy.emailid = <FormattedMessage id="emailIdRequired" />;
      valid = false;
    } else {
      errorsCopy.emailid = "";
    }

    setErrors(errorsCopy);
    return valid;
  };

  useEffect(() => {
    Load();
  }, []);

  useEffect(() => {
    filterData();
  }, [selectedOptions]);

  useEffect(() => {
    const totalItems = Client.length;
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const newFilteredProjects = Client.slice(firstItemIndex, lastItemIndex);

    setFilteredCustomers(newFilteredProjects);
  }, [Client, currentPage, itemsPerPage]);

  const filterData = () => {
    let filteredData = Client.filter((item) => {
      return (
        (selectedOptions.clientidnumber === "All" ||
          item.clientidnumber === selectedOptions.clientidnumber) &&
        (selectedOptions.clientsname === "All" ||
          item.clientsname === selectedOptions.clientsname) &&
        (selectedOptions.emailid === "All" ||
          item.emailid === selectedOptions.emailid) &&
        (selectedOptions.contactnumber === "All" ||
          item.contactnumber === selectedOptions.contactnumber) &&
        (selectedOptions.status === "All" ||
          item.status === selectedOptions.status) &&
        (selectedOptions.businessname === "All" ||
          item.businessname === selectedOptions.businessname) &&
        (selectedOptions.fedaralid === "All" ||
          item.fedaralid === selectedOptions.fedaralid) &&
        (selectedOptions.primarybusinessunit === "All" ||
          item.primarybusinessunit === selectedOptions.primarybusinessunit) &&
        (selectedOptions.website === "All" ||
          item.website === selectedOptions.website)
      );
    });

    setFilteredCustomers(filteredData); // Update filteredProjects state
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
      clientidnumber: "All",
      clientsname: "All",
      emailid: "All",
      contactnumber: "All",
      status: "All",
      businessname: "All",
      fedaralid: "All",
      primarybusinessunit: "All",
      website: "All",
    });
  };

  // Add 'All' option as the default option
  const clientidnumberOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Client.map((item) => item.clientidnumber))).map(
      (clientidnumber) => ({
        value: clientidnumber,
        label: clientidnumber,
      })
    ),
  ];

  const clientsnameOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Client.map((item) => item.clientsname))).map(
      (clientsname) => ({
        value: clientsname,
        label: clientsname,
      })
    ),
  ];

  const emailidOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Client.map((item) => item.emailid))).map(
      (emailid) => ({
        value: emailid,
        label: emailid,
      })
    ),
  ];

  const contactnumberOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Client.map((item) => item.contactnumber))).map(
      (contactnumber) => ({
        value: contactnumber,
        label: contactnumber,
      })
    ),
  ];

  const statusOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Client.map((item) => item.status))).map((status) => ({
      value: status,
      label: status,
    })),
  ];

  const businessnameOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Client.map((item) => item.businessname))).map(
      (businessname) => ({
        value: businessname,
        label: businessname,
      })
    ),
  ];

  const fedaralidOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Client.map((item) => item.fedaralid))).map(
      (fedaralid) => ({
        value: fedaralid,
        label: fedaralid,
      })
    ),
  ];

  const primarybusinessunitOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Client.map((item) => item.primarybusinessunit))).map(
      (primarybusinessunit) => ({
        value: primarybusinessunit,
        label: primarybusinessunit,
      })
    ),
  ];

  const websiteOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(Client.map((item) => item.website))).map(
      (website) => ({
        value: website,
        label: website,
      })
    ),
  ];

  async function Load() {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/client/getAllClient"
      );
      setClients(result.data);
      setFilteredCustomers(result.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  }

  async function save(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return; // Do not proceed with saving if form is invalid
    }

    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/client/save",
        {
          clientid: clientid,
          clientidnumber: Clientidnumber,
          clientsname: clientsname,
          emailid: emailid,
          contactnumber: contactnumber,
          status: Status,
          address: Address,
          businessname: Businessname,
          fedaralid: Fedaralid,
          primarybusinessunit: PrimaryBusinessunit,
          website: Website,
        }
      );

      toast(<FormattedMessage id="clientRegistrationSuccess" />);
      setclientid("");

      setClientidnumber("");
      setclientsname("");
      setemailid("");
      setcontactnumber("");
      setStatus("");
      setAddress("");
      setBusinessname("");
      setFedaralid("");
      setPrimaryBusinessunit("");
      setWebsite("");
      Load();
      const modal = document.getElementById("exampleModalCenter");
    modal.classList.remove("show");
    modal.style.display = "none";
    } catch (err) {
      toast(<FormattedMessage id="clientRegistrationFailure" />);
    }
  }

  async function editClient(event) {
 
    event.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      return; // Do not proceed with saving if form is invalid
    }
    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/client/update",
        {
          clientid: editingClient.clientid,
          clientidnumber: Clientidnumber,
          clientsname: clientsname,
          emailid: emailid,
          contactnumber: contactnumber,
          status: Status,
          address: Address,
          businessname: Businessname,
          fedaralid: Fedaralid,
          primarybusinessunit: PrimaryBusinessunit,
          website: Website,
        }
      );

      setFilteredCustomers((prevFilteredcustomer) =>
        prevFilteredcustomer.map((client) =>
          client.clientid === editingClient.clientid
            ? {
                ...client,
                // clientidnumber: Clientidnumber,
                clientsname: clientsname,
                emailid: emailid,
                contactnumber: contactnumber,
                status: Status,
                address: Address,
                businessname: Businessname,
                fedaralid: Fedaralid,
                primarybusinessunit: PrimaryBusinessunit,
                website: Website,
              }
            : client
        )
      );

      toast(<FormattedMessage id="clientUpdatedSuccess" />);
      handleCloseEditModal();
      // Load();
    } catch (err) {
      toast(<FormattedMessage id="clientUpdateFailue" />);
    }
  }

  const openEditModal = (client) => {
    setEditingClient(client);
    setclientsname(client.clientsname);
    setClientidnumber(client.Clientidnumber);
    setemailid(client.emailid);
    setcontactnumber(client.contactnumber? client.contactnumber.toString() : "");
    setStatus(client.status);
    setAddress(client.address);
    setBusinessname(client.businessname);
    setFedaralid(client.fedaralid);
    setPrimaryBusinessunit(client.primarybusinessunit);
    setWebsite(client.website);
    const modal = document.getElementById("editModal");
    modal.classList.add("show");
    modal.style.display = "block";
  };

  const handleCloseEditModal = () => {
    setEditingClient(null);
    setclientid("");
    setClientidnumber("");
    setclientsname("");
    setemailid("");
    setcontactnumber("");
    setStatus("");
    setAddress("");
    setBusinessname("");
    setFedaralid("");
    setPrimaryBusinessunit("");
    setWebsite("");
    setErrors({
      clientsname: "",
      emailid: "",
      // Add other fields as needed
    });
    const modal = document.getElementById("editModal");
    modal.classList.remove("show");
    modal.style.display = "none";
  };

  const handleRowSelectionChange = (rowsSelectedData, allRowsSelectedData) => {
    const selectedIds = allRowsSelectedData.map((row) => {
      const rowIndex = row.dataIndex;
      return filteredCustomers[rowIndex].clientid;
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
    responsive: "scroll",
    selectableRows: "multiple",
    onRowSelectionChange: handleRowSelectionChange,
    rowsSelected: filteredCustomers
    .map((row, index) => (selectedRows.includes(row.clientid) ? index : -1))
    .filter((index) => index !== -1),
    onRowsDelete: async (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data.map(
        (row) =>
          Client[(currentPage - 1) * itemsPerPage + row.dataIndex].clientid
      );

      try {
        const deletionResults = await Promise.all(
          idsToDelete.map((clientid) =>
            axios
              .delete(
                process.env.REACT_APP_API_BASE_URL +
                  `/api/v1/client/delete/${clientid}`
              )
              .catch((error) => {
                if (error.response && error.response.status === 409) {
                  // Client mapping cannot be deleted due to existing project
                  toast(
                    <FormattedMessage
                      id="clientAssignedToProject"
                      values={{ clientId: clientid }}
                    />
                  );
                  Load(); //
                  return { clientid, error: true };
                } else {
                  // Other errors
                  throw error;
                }
              })
          )
        );

        const deletedClientIds = deletionResults
          .filter((result) => result && !result.error)
          .map((result) => result.data.clientId);

        const notDeletedClientIds = deletionResults
          .filter((result) => result && result.error)
          .map((result) => result.clientid);

        if (notDeletedClientIds.length > 0) {
          notDeletedClientIds.forEach((id) => {});
        }

        if (deletedClientIds.length > 0) {
          Load(); // Reload data after deletion
          toast(<FormattedMessage id="clientDeleteSuccess" />);
          const totalPages = Math.ceil(
            (Client.length - deletedClientIds.length) / itemsPerPage
          );
          if (currentPage > totalPages) {
            setCurrentPage(totalPages);
          }
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    },
    download: false,
    print: false,
    pagination: false,
    filter: false,
    viewColumns: false,
    search: false,
    responsive: "standard",
    resizableColumns: false,
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
        process.env.REACT_APP_API_BASE_URL + "/api/v1/client/export",
        {
          email: email,
          format: selectedFormat,
        }
      );
      toast.success("Client data exported successfully");
      setEmail("");
      setSelectedFormat("");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export client data");
    } finally {
      setLoading(false); 
    }
  };

  const downloadCSV = () => {
    const columnNames = [
      "Client ID",
      "Client Name",
      "Email Id",
      "Contact Number",
      "Status",
      "Address",
      "businessname",
      "Fedaral Id",
      "Primary Business Unit",
      "Website",
    ];

    // Generate CSV data
    const csvData = [columnNames];
    Client.forEach((Clients) => {
      const rowData = [
        Clients.clientidnumber,
        Clients.clientsname,
        Clients.emailid,
        Clients.contactnumber,
        Clients.status,
        Clients.address,
        Clients.businessname,
        Clients.fedaralid,
        Clients.primarybusinessunit,
        Clients.website,
      ];
      csvData.push(rowData);
    });

    const csvTitle = "Client_data.csv";
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
      "Client ID",
      "Client Name",
      "Email Id",
      "Contact Number",
      "Status",
      "Address",
      "businessname",
      "Fedaral Id",
      "Primary Business Unit",
      "Website",
    ];
    const tableRows = [];

    Client.forEach((Clients) => {
      const ClientData = [
        Clients.clientidnumber,
        Clients.clientsname,
        Clients.emailid,
        Clients.contactnumber,
        Clients.status,
        Clients.address,
        Clients.businessname,
        Clients.fedaralid,
        Clients.primarybusinessunit,
        Clients.website,
      ];
      tableRows.push(ClientData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    const date = new Date().toLocaleDateString();
    doc.save("Client.pdf");
  };

  const columns = [
    // {
    //   name: "clientidnumber",
    //   label: <FormattedMessage id="customerId"></FormattedMessage>,
    //   options: {
    //     setCellProps: () => ({
    //       align: "center",
    //     }),
    //     setCellHeaderProps: (value) => ({
    //       className: "centeredHeaderCell",
    //       style: { whiteSpace: "nowrap" },
    //     }),
    //     display: "true",
    //   },
    // },
    {
      name: "clientsname",
      label: <FormattedMessage id="customerName" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        display: "true",
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
        display: "true",
      },
    },


    {
      name: "fedaralid",
      label: <FormattedMessage id="fedaralId" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        display: "true",
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
        display: "true",
      },
    },
    {
      name: "status",
      label: <FormattedMessage id="status" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        display: "true",
      },
    },
    {
      name: "address",
      label: <FormattedMessage id="Address" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        display: "true",
      },
    },
    {
      name: "businessname",
      label: <FormattedMessage id="Business Name" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        display: "true",
      },
    },

    {
      name: "primarybusinessunit",
      label: <FormattedMessage id="primaryBusinessUnit" />,
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        display: "true",
      },
    },

    {
      name: "website",
      label: <FormattedMessage id="Website" />,
      options: {
        setCellProps: (value) => ({
          align: "center",
          children: (
            <a href={value} target="_blank" rel="noopener noreferrer">
              {value}
            </a>
          ),
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
        display: "true",
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
          const rowData = filteredCustomers[rowIndex];

          return (
            <button
              className="btn btn-sm client_edit_btn"
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
        display: "true",
      },
    },
  ];

  const calculateOriginalIndex = (currentPage, rowIndex) => {
    return (currentPage - 1) * itemsPerPage + rowIndex;
  };

  const totalCount = Client.length;

  const totalPages = Math.ceil(Client.length / itemsPerPage);


  const currentItems = Client.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleClientNameChange = (e) => {
    setclientsname(e.target.value);
    if (errors.clientsname) {
      setErrors((prevErrors) => ({ ...prevErrors, clientsname: "" }));
    }
  };

  const handleEmailNameChange = (e) => {
    setemailid(e.target.value);
    if (errors.emailid) {
      setErrors((prevErrors) => ({ ...prevErrors, emailid: "" }));
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
  //   // setIsSearchOpen(false);
  //   setSearchTerm("");
  //   setFilteredCustomers(Client);
  // };
 
  // const handleSearchChange = (event) => {
  //   const searchValue = event.target.value.toLowerCase();
  //   setSearchTerm(searchValue);
 
  //   const filteredData = Client.filter((emp) => {
  //     return Object.values(emp).some(val =>
  //       val && val.toString().toLowerCase().includes(searchValue)
  //     );
  //   });
 
  //   setFilteredCustomers(filteredData);
  // };

  const renderPagination = () => {
    const totalPages = Math.ceil(Client.length / itemsPerPage);
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
 
  const [visibleColumns_customer, setVisibleColumns] = useState(() => {
    const allColumns = Array.from(Array(columns.length).keys());
    // Load from sessionStorage or localStorage
    const storedColumns = localStorage.getItem("visibleColumns_customer");
    return storedColumns ? JSON.parse(storedColumns) : allColumns;
  });
 
  const handleResetAll = () => {
    setVisibleColumns(columns.map((_, index) => index));
  };
 
  useEffect(() => {
    // Save to sessionStorage or localStorage whenever visibleColumns changes
    localStorage.setItem(
      "visibleColumns_customer",
      JSON.stringify(visibleColumns_customer)
    );
  }, [visibleColumns_customer]);
 
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
      display: visibleColumns_customer.includes(index),
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
    setFilteredCustomers(Client);
    // Load();
  };
 
  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
 
    const filteredData = Client.filter((emp) => {
      return Object.values(emp).some(
        (val) => val && val.toString().toLowerCase().includes(searchValue)
      );
    });
 
    setFilteredCustomers(filteredData);
  };

  
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000} 
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
          <div className="Client-margin">
            <div className="d-flex justify-content-between mt-4 me-5">
              <div className="">
                <p className="customer_head">
                  <FormattedMessage id="customerInformation" />
                </p>
              </div>
              <button
                type="button"
                className="customer_add_button pe-3"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalCenter"
                onClick={resetForm}
              >
                <i className="icon_customer fas fa-plus py-2 ps-3 pe-3 me-2"></i>
                <FormattedMessage id="addCustomer" />
              </button>
            </div>

            <div
              className="modal fade client_popup"
              id="exampleModalCenter"
              tabIndex="-1"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content rounded-5 shadow-lg">
                  <div className="d-flex justify-content-between ms-5 me-5 mt-4 ">
                    <p
                      className="popup_header modal-title font-weight-bold"
                      id="exampleModalLongTitle"
                    >
                      <FormattedMessage id="addCustomers" />
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
                  <p className="popup_sub mt-2 ms-5">
                    <FormattedMessage id="fillCustDetails" />
                  </p>
                  <hr className="hr ms-5"></hr>
                  <div className="modal-body">
                    <div className=" ms-4 me-4 mt-3">
                      <form onSubmit={save} className="needs-validation">
                        <div className=" d-flex ">
                          <div className="form-group col-md-4">
                            <div>
                              <label
                                htmlFor="clientsname"
                                className=" custom_badge"
                              >
                                Customer Name
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <input
                              autoComplete="off"
                              className={`form-control custom_input-customers ${
                                errors.clientsname ? "is-invalid" : ""
                              }`}
                              type="text"
                              id="clientsname"
                              value={clientsname}
                              placeholder="Customer Name"
                              // onChange={(e) => setclientsname(e.target.value)}
                              onChange={handleClientNameChange}
                            />
                            {errors.clientsname && (
                              <div className="invalid-feedback">
                                {errors.clientsname}
                              </div>
                            )}
                          </div>

                          <div className="form-group col-md-4">
                            <label htmlFor="emailid" className="custom_badge">
                              <FormattedMessage id="emailId"></FormattedMessage>
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              autoComplete="off"
                              className={`form-control custom_input-customers ${
                                errors.emailid ? "is-invalid" : ""
                              }`}
                              type="email"
                              id="emailid"
                              placeholder="Email ID"
                              value={emailid}
                              onChange={handleEmailNameChange}
                            />
                            {errors.emailid && (
                              <div className="invalid-feedback">
                                {errors.emailid}
                              </div>
                            )}
                          </div>
                          <div className="form-group col-md-4">
                         
                              <label
                                htmlFor="contactnumber"
                                className="customer_contact_label"
                              >
                                <FormattedMessage id="contactNumber" />
                              </label>
                       
                            {/* <input
                              autoComplete="off"
                              className="form-control custom_input-customers"
                              type="text"
                              id="contactnumber"
                              value={contactnumber}
                              onChange={(e) => setcontactnumber(e.target.value)}
                            /> */}


<ReactPhoneInput
                          searchPlaceholder={'search'}
                             enableSearch={true}
                            className="emp_contact "
                            country={"us"}
                            value={contactnumber}
                            onChange={(phone) => setcontactnumber(phone)}
                            placeholder="Enter contact number"
                            inputStyle={{ width: "100%" }}
                          />


                          </div>
                        </div>

                        <div className=" d-flex mt-4">
                          <div className="form-group col-md-4">
                            <div>
                              <label htmlFor="Status" className="custom_badge">
                                <FormattedMessage id="status"></FormattedMessage>
                              </label>
                            </div>
                            <select
                              autoComplete="off"
                              className="form-select custom_input-customers"
                              type="text"
                              id="Status"
                              placeholder="Status"
                              value={Status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option selected>Select Status</option>
                              <option value="Active">Active</option>
                              <option value="In-Active">In-Active</option>
                            </select>
                          </div>

                          <div className="form-group col-md-4">
                            <div>
                              <label
                                htmlFor="Businessname"
                                className="custom_badge"
                              >
                                <FormattedMessage id="businessName" />
                              </label>
                            </div>
                            <input
                              autoComplete="off"
                              className="form-control custom_input-customers"
                              type="text"
                              id="Businessname"
                              placeholder="Business Name"
                              value={Businessname}
                              onChange={(e) => setBusinessname(e.target.value)}
                            />
                          </div>

                          <div className="form-group col-md-4">
                            <div>
                              <label htmlFor="Address" className="custom_badge">
                                <FormattedMessage id="address" />
                              </label>
                            </div>
                            <input
                              autoComplete="off"
                              className="form-control custom_input-customers"
                              type="text"
                              id="Address"
                               placeholder="Address"
                              value={Address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className=" d-flex mt-4">
                          <div className="form-group col-md-4">
                            <div>
                              <label
                                htmlFor="fedaralid"
                                className="custom_badge"
                              >
                                <FormattedMessage id="fedaralId" />
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <input
                              autoComplete="off"
                              className="form-control custom_input-customers"
                              type="text"
                              id="fedaralid"
                              placeholder="Fedaral Id"
                              value={Fedaralid}
                              onChange={(e) => setFedaralid(e.target.value)}
                            />
                          </div>

                          <div className="form-group col-md-4">
                            <div>
                              <label
                                htmlFor="primarybusinessunit"
                                className="custom_badge"
                              >
                                <FormattedMessage id="primaryBusinessUnit" />
                              </label>
                            </div>
                            <input
                              autoComplete="off"
                              className="form-control custom_input-customers"
                              type="text"
                              id="primarybusinessunit"
                              placeholder="Primary Business Unit"
                              value={PrimaryBusinessunit}
                              onChange={(e) =>
                                setPrimaryBusinessunit(e.target.value)
                              }
                            />
                          </div>

                          <div className="form-group col-md-4">
                            <div>
                              <label htmlFor="Website" className="custom_badge">
                                <FormattedMessage id="website" />
                              </label>
                            </div>
                            <input
                              autoComplete="off"
                              className="form-control custom_input-customers"
                              type="text"
                              id="Website"
                               placeholder="Website"
                              value={Website}
                              onChange={(e) => setWebsite(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="d-flex gap-3 mb-4 mt-4">
                          <div className="col-md-6 text-end">
                            <button
                              type="submit"
                              className="customer_add_button px-4 py-2 border-none"
                            >
                              <i className="icon_customer_add fas fa-plus border-1 rounded-circle border-white me-3"></i>
                              <FormattedMessage id="add" />
                            </button>
                          </div>
                          <div className="col-md-6 text-start">
                            <button
                              type="button"
                              className="customer_cancel_button py-2 px-4"
                              data-bs-dismiss="modal"
                              onClick={resetForm}
                            >
                              <i className="icon_customer_cancel fas fa-times border-1 rounded-circle border-danger me-2"></i>
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

            <Dialog open={dialogOpen} onClose={handleDialogClose} className="">
              {loading && (
                <div className="loading-client fs-3 mt-2">
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
                  <FormattedMessage id="saveFormats" />
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="download2 me-5">
                    <p className="">
                      <FormattedMessage id="pickFormat" />
                    </p>

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
                    <FormattedMessage id="export"></FormattedMessage>
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
                    <FormattedMessage id="cancel" />
                  </button>
                </div>
              </div>
            </Dialog>

            <div className="client_table mt-4 mx-5">
              <div className="mui-datatable-container">
                {loading && (
                  <div className="loading-container">
                    <FacebookCircularProgress />
                  </div>
                )}
                <MUIDataTable
                  className="mui_Customer"
                  data={filteredCustomers}
                  // columns={columns}
                  columns={filteredColumns}
                  // options={options}
                  options={{
                    ...options,
                    onRowSelectionChange: handleRowSelectionChange,
                    rowsSelected: filteredCustomers
                      .map((row, index) =>
                        selectedRows.includes(row.clientid) ? index : -1
                      )
                      .filter((index) => index !== -1),
                  }}
                />
              </div>

              <div className="d-flex justify-content-between mt-2">
                <div className="ms-4 mt-2">
                  <p>
                    <FormattedMessage id="totalRecordCount" /> {totalCount}
                  </p>{" "}
                </div>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => handleMenuItemClick("csv")}>
                    <FormattedMessage id="csv" />
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick("pdf")}>
                    <FormattedMessage id="pdf" />
                  </MenuItem>
                </Menu>
                <div className="d-flex">
                  <div className="me-5">
                    <select
                      className="p-2 count"
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
                      count={Math.ceil(Client.length / itemsPerPage)}
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
            <div className="d-flex gap-3 mb-4 mt-4"></div>
          </div>
        </div>
      </div>
      <div
        className="modal fade client_popup"
        id="editModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content rounded-5 shadow-lg">
            <div className="d-flex justify-content-between ms-5 me-5 mt-4 ">
              <p className="popup_header modal-title font-weight-bold">
                <FormattedMessage id="editCustomer"></FormattedMessage>
              </p>

              <svg
                className="department_close_btn"
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
            <p className="popup_sub mt-2 ms-5">
              <FormattedMessage id="updateCustomerDetails" />
            </p>
            <hr className="hr ms-5"></hr>
            <div className="modal-body">
              <div className="ms-4 me-4 mt-3">
                <form onSubmit={editClient} className="">
                  <div className=" d-flex ">
                    <div className="form-group col-md-4">
                      <label htmlFor="clientsname" className="custom_badge">
                        Customer Name
                        <span className="text-danger">*</span>
                      </label>

  


                      <input
                        autoComplete="off"
                        className={`form-control custom_input-customers ${
                          errors.clientsname ? "is-invalid" : ""
                        }`}
                        type="text"
                        id="clientsname"
                        placeholder="Customer Name"
                        value={clientsname}
                        onChange={handleClientNameChange}
                      />
                      {errors.clientsname && (
                              <div className="invalid-feedback">
                                {errors.clientsname}
                              </div>
                            )}
                    </div>

                    <div className="form-group col-md-4">
                      <label htmlFor="emailid" className="custom_badge">
                        <FormattedMessage id="emailId" />
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        autoComplete="off"
                        className={`form-control custom_input-customers ${
                          errors.emailid ? "is-invalid" : ""
                        }`}
                        type="text"
                        id="emailid"
                        value={emailid}
                            placeholder="emailid"
                        onChange={handleEmailNameChange}
                      />
                       {errors.emailid && (
                              <div className="invalid-feedback">
                                {errors.emailid}
                              </div>
                            )}
                    </div>

                    <div className="form-group col-md-4">
                      <div>
                        <label htmlFor="contactnumber" className="customer_contact_label">
                          <FormattedMessage id="contactNumber" />
                        </label>
                      </div>
                      {/* <input
                        autoComplete="off"
                        className="form-control custom_input-customers"
                        type="text"
                        id="contactnumber"
                        value={contactnumber}
                        onChange={(event) => {
                          setcontactnumber(event.target.value);
                        }}
                      /> */}
                   <ReactPhoneInput
                    
                          searchPlaceholder={'search'}
                             enableSearch={true}
                            className="emp_contact "
                            country={"us"}
                            value={contactnumber? contactnumber : ""}
                            onChange={(phone) => setcontactnumber(phone)}
                            placeholder="Enter contact number"
                            inputStyle={{ width: "100%" }}
                          />
                    </div>
                  </div>

                  <div className=" d-flex mt-4">
                    <div className="form-group col-md-4">
                      <div>
                        <label htmlFor="Status" className="custom_badge">
                          <FormattedMessage id="status" />
                        </label>
                      </div>
                      <select
                        autoComplete="off"
                        className="form-select custom_input-customers"
                        type="text"
                        id="Status"
                            placeholder="Status"
                        value={Status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option selected>Select Status</option>
                        <option value="Active">Active</option>
                        <option value="In-Active">In-Active</option>
                      </select>
                    </div>

                    <div className="form-group col-md-4">
                      <div>
                        <label htmlFor=" BusinessName" className="custom_badge">
                          <FormattedMessage id="businessName" />
                        </label>
                      </div>
                      <input
                        autoComplete="off"
                        className="form-control custom_input-customers"
                        type="text"
                        id="BusinessName"
                            placeholder="Business Name"
                        value={Businessname}
                        onChange={(event) => {
                          setBusinessname(event.target.value);
                        }}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <div>
                        <label htmlFor="Address" className="custom_badge">
                          <FormattedMessage id="address" />
                        </label>
                      </div>
                      <input
                        autoComplete="off"
                        className="form-control custom_input-customers"
                        type="text"
                        id="Address"
                          placeholder="Address"
                        value={Address}
                        onChange={(event) => {
                          setAddress(event.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className=" d-flex mt-4">
                    <div className="form-group col-md-4">
                      <div>
                        <label htmlFor="FedaralId" className="custom_badge">
                          <FormattedMessage id="FedaralId" />
                          <span className="text-danger">*</span>
                        </label>
                      </div>
                      <input
                        autoComplete="off"
                        className="form-control custom_input-customers"
                        type="text"
                        id="FedaralId"
                          placeholder="Fedaral Id"
                        value={Fedaralid}
                        onChange={(event) => {
                          setFedaralid(event.target.value);
                        }}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <div>
                        <label
                          htmlFor=" PrimaryBusinessUnit"
                          className="custom_badge"
                        >
                          <FormattedMessage id="primaryBusinessUnit" />
                        </label>
                      </div>
                      <input
                        autoComplete="off"
                        className="form-control custom_input-customers"
                        type="text"
                            placeholder="Primary Business Unit"
                        id="PrimaryBusinessUnit"
                        value={PrimaryBusinessunit}
                        onChange={(event) => {
                          setPrimaryBusinessunit(event.target.value);
                        }}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <div>
                        <label htmlFor="Address" className="custom_badge">
                          <FormattedMessage id="website"></FormattedMessage>
                        </label>
                      </div>
                      <input
                        autoComplete="off"
                        className="form-control custom_input-customers"
                        type="text"
                        id="Address"
                          placeholder="Website"
                        value={Website}
                        onChange={(event) => {
                          setWebsite(event.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-4 mt-4">
                    <div className="col-md-6 text-end">
                      <button
                        type="submit"
                        className="customer_add_button py-2 px-4 border-none"
                      
                      >
                        <i className="icon_customer_add fas fa-plus border-1 rounded-circle border-white me-2"></i>
                        <FormattedMessage id="saveChanges"></FormattedMessage>
                      </button>
                    </div>
                    <div className="col-md-6 text-start">
                      <button
                        type="button"
                        className="customer_cancel_button py-2 px-4"
                        data-bs-dismiss="modal"
                        onClick={handleCloseEditModal}
                      >
                        <i className="icon_customer_cancel fas fa-times border-1 rounded-circle border-danger me-2"></i>
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
                      <label className="custom_badge_filter">
                        Customer Id:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={clientidnumberOptions}
                      value={{
                        value: selectedOptions.clientidnumber,
                        label: selectedOptions.clientidnumber,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("clientidnumber", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        Customer Name:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={clientsnameOptions}
                      value={{
                        value: selectedOptions.clientsname,
                        label: selectedOptions.clientsname,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("clientsname", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="d-flex">
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

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        Contact Number:
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
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">Status:</label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={statusOptions}
                      value={{
                        value: selectedOptions.status,
                        label: selectedOptions.status,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("status", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        Business Name:
                      </label>
                    </div>

                    <Select
                      className="custom_input_filter"
                      options={businessnameOptions}
                      value={{
                        value: selectedOptions.businessname,
                        label: selectedOptions.businessname,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("businessname", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">Fedaral Id:</label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={fedaralidOptions}
                      value={{
                        value: selectedOptions.fedaralid,
                        label: selectedOptions.fedaralid,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("fedaralid", selectedValue)
                      }
                      isClearable
                    />
                  </div>

                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">
                        Primary Business Unit:
                      </label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={primarybusinessunitOptions}
                      value={{
                        value: selectedOptions.primarybusinessunit,
                        label: selectedOptions.primarybusinessunit,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("primarybusinessunit", selectedValue)
                      }
                      isClearable
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-md-6 mt-3">
                    <div>
                      <label className="custom_badge_filter">Website:</label>
                    </div>
                    <Select
                      className="custom_input_filter"
                      options={websiteOptions}
                      value={{
                        value: selectedOptions.website,
                        label: selectedOptions.website,
                      }}
                      onChange={(selectedValue) =>
                        handleFilterChange("website", selectedValue)
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
                  checked={visibleColumns_customer.includes(columnIndex)}
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

export default Homeclient;

