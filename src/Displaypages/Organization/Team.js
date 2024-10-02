import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import MUIDataTable from "mui-datatables";
import "./Team.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { FormattedMessage } from "react-intl";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Tooltip } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { MultiSelect } from "react-multi-select-component";
import { PiUserThin } from "react-icons/pi";
import Popup from "reactjs-popup";

function Team({ locale, setLocale }) {
  const [teams, setTeams] = useState([]);
  const [value, setValue] = useState("3");
  const [newTeam, setNewTeam] = useState({ teamName: "", employees: [] });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTeam, setSearchTeam] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setSearchTeam(teams);
    // getData();
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toString().toLowerCase();
    setSearchTerm(searchValue);

    const filteredData = teams.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchValue)
      )
    );
    setSearchTeam(filteredData);
  };

  useEffect(() => {
    fetchTeams(0);
  }, []);

  useEffect(() => {
    fetchTeams();
    fetchEmployees();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/v1/teams/get"
      );
      setTeams(response.data);
      setSearchTeam(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL +
          "/api/v1/Organization/getAllOrganization"
      );
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    if (selectedTeam) {
      setSelectedTeam({ ...selectedTeam, [e.target.name]: e.target.value });
    } else {
      setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
    }
  };

  const handleEmployeeChange = (selected) => {
    if (selectedTeam) {
      setSelectedTeam({
        ...selectedTeam,
        employees: selected.map((option) => ({
          employeeId: option.value,
          firstname: option.label.split(" ")[0],
          lastname: option.label.split(" ")[1] || "",
        })),
      });
    } else {
      setNewTeam({
        ...newTeam,
        employees: selected.map((option) => ({
          employeeId: option.value,
          firstname: option.label.split(" ")[0],
          lastname: option.label.split(" ")[1] || "",
        })),
      });
    }
    setSelectedEmployees(selected);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/teams/save`,
        newTeam
      );
      setTeams([...teams, response.data]);
      fetchTeams();
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/teams/${selectedTeam.teamId}`,
        selectedTeam
      );
      setTeams(
        teams.map((team) =>
          team.teamId === selectedTeam.teamId ? response.data : team
        )
      );
      fetchTeams();
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  const openEditModal = (team) => {
    const selectedEmployees = team.employees.map((emp) => ({
      value: emp.employeeId,
      label: `${emp.firstname} ${emp.lastname}`,
      id: emp.employeeId,
    }));
    setSelectedTeam({
      ...team,
      employees: team.employees || [],
    });
    setSelectedEmployees(selectedEmployees);
    const modal = document.getElementById("updateTeamModal");
    modal.classList.add("show");
    modal.style.display = "block";
  };

  const columns = [
    // {
    //   name: "teamId",
    //   label: "Team ID",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   }
    // },
    {
      name: "teamName",
      label: "Team Name",

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
      name: "employees",
      label: "Team Members",
      options: {
        setCellProps: () => ({
          align: "center",
        }),
        setCellHeaderProps: (value) => ({
          className: "centeredHeaderCell",
          style: { whiteSpace: "nowrap" },
        }),
      //   customBodyRender: (value, tableMeta) => {
      //     if (!value || !Array.isArray(value)) {
      //       return <div>No members</div>;
      //     }

      //     const employeeNames = value
      //       .map(
      //         (employee) =>
      //           employee.firstname || `Employee ${employee.employeesid}`
      //       )
      //       .join(", ");
      //     return (
      //       <Tooltip title={employeeNames} arrow>
      //         <div style={{ cursor: "pointer" }}>
      //           <GroupIcon /> {value.length}
      //         </div>
      //       </Tooltip>
      //     );
      //   },
      // },



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
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const rowData = teams[rowIndex];
          return (
            <button
              type="button"
              className="btn btn-secondary pe-3"
              data-bs-toggle="modal"
              data-bs-target="#updateTeamModal"
              onClick={() => openEditModal(rowData)}
            >
              Update
            </button>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "checkbox",
    responsive: "standard",
    tableBodyHeight: "430px",
    download: false, // Disable default download button
    print: false,
    pagination: false,
    viewColumns: false,
    filter: false,
    search: false,
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
      </>
    ),
  };

  return (
    <>
      <Topbar locale={locale} setLocale={setLocale} />
      <div className="d-flex">
        <Sidebar locale={locale} setLocale={setLocale} />
        <div className="teams-margin">
          <div className="d-flex justify-content-between ms-5">
            <Box sx={{ width: "100%", typography: "body1" }} className="mt-3">
              <TabContext value={value}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    TabIndicatorProps={{
                      style: {
                        backgroundColor: "#787DBD",
                      },
                    }}
                  >
                    <Tab
                      label={<FormattedMessage id="employee" />}
                      value="1"
                      component={Link}
                      to="/organization"
                    />
                    <Tab
                      label={<FormattedMessage id="department" />}
                      value="2"
                      component={Link}
                      to="/organization/department"
                    />
                    <Tab
                      label={<FormattedMessage id="team" />}
                      value="3"
                      component={Link}
                      to="/organization/team"
                    />
                  </TabList>
                </Box>
              </TabContext>
            </Box>
            <div>
              <div className="mt-4 me-5">
                <button
                  type="button"
                  className="teams_add_btn pe-3"
                  data-bs-toggle="modal"
                  data-bs-target="#addTeamModal"
                >
                  <i className="icon_teams fas fa-plus py-2 ps-3 pe-3 me-2"></i>
                  Add Team
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="deparment_table mt-4 mx-5">
              <MUIDataTable
                className="mui_teams"
                // data={teams}
                data={searchTeam}
                columns={columns}
                options={options}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Team Modal */}
      <div
        className="modal fade"
        id="addTeamModal"
        tabIndex="-1"
        aria-labelledby="addTeamModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addTeamModalLabel">
                Add New Team
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="teamName" className="form-label">
                  Team Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="teamName"
                  name="teamName"
                  value={newTeam.teamName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="employeeIds" className="form-label">
                  Employee IDs
                </label>
                <MultiSelect
                  options={employees.map((employee) => ({
                    value: employee.employeeId,
                    label: `${employee.firstname} ${employee.lastname}`,
                    id: employee.employeeId,
                  }))}
                  value={selectedEmployees}
                  onChange={handleEmployeeChange}
                  labelledBy="Select"
                  placeholder="Assign Employees"
                  overrideStrings={{
                    allItemsAreSelected: "All Employees are selected...",
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                data-bs-dismiss="modal"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Team Modal */}
      <div
        className="modal fade"
        id="updateTeamModal"
        tabIndex="-1"
        aria-labelledby="updateTeamModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateTeamModalLabel">
                Update Team
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="teamName" className="form-label">
                  Team Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="teamName"
                  name="teamName"
                  value={selectedTeam?.teamName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="employeeIds" className="form-label">
                  Employee IDs (comma-separated)
                </label>
                <MultiSelect
                  options={employees.map((employee) => ({
                    value: employee.employeeId,
                    label: `${employee.firstname} ${employee.lastname}`,
                    id: employee.employeeId,
                  }))}
                  value={selectedEmployees}
                  onChange={handleEmployeeChange}
                  labelledBy="Select"
                  placeholder="Assign Employees"
                  overrideStrings={{
                    allItemsAreSelected: "All Employees are selected...",
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
                data-bs-dismiss="modal"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Team;
