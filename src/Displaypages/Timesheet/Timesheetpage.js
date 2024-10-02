// import React from "react";
import "./Timesheetpage.css";
import "./../../Styles/Topbar.css";
import LeftSidebar from "../../Components/Sidebar";
import { Link } from "react-router-dom";
import Topbar from "../../Components/Topbar";
import Grid from "@mui/material/Grid";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Sidebar from "../../Components/Sidebar";
import Timesheetweekdatadraft from "./Timesheetsavedata";
import CreateTimesheetButton from "./CreateTimesheetButton"
import { hasPermission } from '../../utils/auth';
import { useNavigate } from "react-router-dom";

export default function TimeSheetpage({ locale, setLocale }) {
  const [value, setValue] = React.useState("1");

  const [timesheetCycle, setTimesheetCycle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchTimesheetCycleFromDatabase();
  }, []);

  const fetchTimesheetCycleFromDatabase = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/settings/getGeneralSettingInfo`
      );
      const { timesheetCycle: fetchedTimesheetCycle } = response.data;
      setTimesheetCycle(fetchedTimesheetCycle);
    } catch (error) {
      console.error("Error fetching settings info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Topbar locale={locale} setLocale={setLocale} />
      <div className="d-flex">
        <Sidebar locale={locale} setLocale={setLocale} />
        <div
          className="container"
          style={{ overflow: "auto", maxHeight: "calc(100vh - 50px)" }}
        >
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ paddingTop: "10px" }}>
                <TabList
                  onChange={handleChange}
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "#787DBD",
                    },
                  }}
                >
                  <Tab
                    component={Link}
                    to="/timesheet"
                    label="Add Timesheet"
                    value="1"
                    sx={{
                      "&.Mui-selected": {
                        color: "#787DBD",
                      },
                      color: "#787DBD",
                      marginRight: "30px",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  />
               
                  <Tab
                    component={Link}
                    to="/timesheet/mytimesheet"
                    label="My Timesheets"
                    value="2"
                    sx={{
                      "&.Mui-selected": {
                        color: "#787DBD",
                      },
                      color: "#787DBD",
                      textTransform: "none",
                      marginRight: "30px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  />
         
                  {hasPermission("Approvals") && (
                    <Tab
                      component={Link}
                      to="/timesheet/timesheetapprovals"
                      label="Approvals"
                      value="3"
                      sx={{
                        "&.Mui-selected": {
                          color: "#787DBD",
                        },
                        color: "#787DBD",
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </TabList>
              </Box>

              <TabPanel value="1" className="scrollable-tab-panel">
                <div>
                  <div className="container-fluid">
                    <div className="timesheet-top-button row ">
                      <div className="d-flex justify-content-end">
                        <div className="d-flex justify-content-end">
                          <CreateTimesheetButton
                            timesheetCycle={timesheetCycle}
                            isLoading={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Timesheetweekdatadraft />
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </div>
  );
}

// export default TimeSheetpage
