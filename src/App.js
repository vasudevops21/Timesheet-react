import React, { useEffect, useState } from "react";
import axios from "axios";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import messagesEn from "./locales/en.json";
import messagesFr from "./locales/fr.json";
import messagesEs from "./locales/es.json";
import "./Styles/Topbar.css";
import "./Styles/Styles.css";
import "./index.css";

// Context
import ProfileImageContext from "./Components/ProfileImageContext.js";
import { DateFormatProvider } from "./Displaypages/Project/DateFormatContext.js";
import { TimeFormatProvider } from "./Displaypages/settings/TimeFormatContext.js";
import { TimezoneProvider } from "./Displaypages/settings/TimezoneContext.js";

// Components
import Home from "./Displaypages/Home/Home";
import UserDashboard from "./Displaypages/Home/UserDashboard";
import Homeclient from "./Displaypages/Client/ClientHome.js";
import TimeSheetpage from "./Displaypages/Timesheet/Timesheetpage.js";
import MonthlyAddnewtimesheet from "./Displaypages/Timesheet/Monthly/MonthlyAddnewtimesheet.js";
import WeeklyAddnewtimesheet from "./Displaypages/Timesheet/Weekly/WeeklyAddnewtimesheet.js";
import DailyAddnewtimesheet from "./Displaypages/Timesheet/Daily/DailyAddnewtimesheet.js";
import BiweeklyAddnewtimesheet from "./Displaypages/Timesheet/BiWeekly/BiweeklyAddnewtimesheet.js";
import ExpenseTracker from "./Displaypages/Expense/Expense.js";
import Organization from "./Displaypages/Organization/Organization.js";
import Department from "./Displaypages/Organization/Department.js";
import Team from "./Displaypages/Organization/Team.js";
import Reports from "./Displaypages/Reports/Reports.js";
import UserReports from "./Displaypages/Reports/UserReports.js";
import Projects from "./Displaypages/Project/Project";
import Task from "./Displaypages/Project/Task.js";
import MyTimesheet from "./Displaypages/Timesheet/MyTimesheet.js";
import Timesheetapprovals from "./Displaypages/Timesheet/Timesheetapprovals.js";
import Timesheetviewpage from "./Displaypages/Timesheet/Timesheetviewpage.js";
import UserProfile from "./Displaypages/userProfile/UserProfile.js";
import LoginPage from "./Displaypages/Login/Login-login/Loginpage.js";
import Forgot from "./Displaypages/Login/Login-forget/forgotpassword.js";
import Resetpassword from "./Displaypages/Login/Login-reset/Resetpassword.js";
import Signuppage from "./Displaypages/Login/Login-signup/Signup.js";
import SettingsPages from "./Displaypages/settings/settingspage.js";
import GeneralSettings from "./Displaypages/settings/GeneralSettings.js";
import Timeoffsetup from "./Displaypages/settings/Leave/Timeoff/Timeoff.js";
import HolidaySetup from "./Displaypages/settings/Leave/Holiday/HolidaySetup.js"
import Roles from "./Displaypages/settings/UserAccessControl/Roles.js";
import Permission from "./Displaypages/settings/UserAccessControl/Permission.js";
import Reporting from "./Displaypages/settings/DataAdministration/Reporting.js";
import AuditData from "./Displaypages/settings/DataAdministration/AuditData.js";
import Subscription from "./Displaypages/settings/Payment/subscription.js";
import Chatbot from "./Components/Chatbot";

// Utils
import { hasPermission, getUserRole } from "./utils/auth";

const messages = {
  us: messagesEn,
  fr: messagesFr,
  es: messagesEs,
};

function App() {
  const [locale, setLocale] = useState(() => {
    const storedLocale = localStorage.getItem("locale");
    return storedLocale || "us";
  });
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyinitial, setCompanyInitial] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [timesheetCycle, setTimesheetCycle] = useState("");

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

  const handleTimesheetCycleChange = (cycle) => {
    setTimesheetCycle(cycle);
  };

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <TimezoneProvider value={{ timezone: selectedTimezone, setTimezone: setSelectedTimezone }}>
        <TimeFormatProvider>
          <DateFormatProvider>
            <ProfileImageContext.Provider
              value={{
                profileImageUrl,
                setProfileImageUrl,
                userProfile,
                setUserProfile,
                companyLogo,
                setCompanyLogo,
                companyName,
                setCompanyName,
                companyinitial,
                setCompanyInitial,
              }}
            >
              <Router>
                <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/signup" element={<Signuppage locale={locale} setLocale={setLocale} />} />
                  <Route path="/forgot" element={<Forgot />} />
                  <Route path="/resetpassword" element={<Resetpassword />} />
                  
                  {/* Protected Routes */}
                  <Route path="/home" element={<PrivateRoute component={<Home />} requiredPermission="home" />} />
                  <Route path="/timesheet" element={<PrivateRoute component={<TimeSheetpage />} requiredPermission="timesheet" />} />
                  <Route path="/timesheet/mytimesheet" element={<PrivateRoute component={<MyTimesheet />} requiredPermission="mytimesheet" />} />
                  <Route path="/timesheet/timesheetapprovals" element={<PrivateRoute component={<Timesheetapprovals />} requiredPermission="timesheetapprovals" />} />
                  {/* <Route path="/timesheet/viewtimesheet" element={<PrivateRoute component={<Timesheetviewpage />} requiredPermission="timesheet" />} /> */}
                  <Route path="/expense" element={<PrivateRoute component={<ExpenseTracker />} requiredPermission="expenses" />} />
                  <Route path="/organization" element={<PrivateRoute component={<Organization />} requiredPermission="organization" />} />
                  <Route path="/organization/department" element={<PrivateRoute component={<Department />} requiredPermission="department" />} />
                  <Route path="/organization/team" element={<PrivateRoute component={<Team />} requiredPermission="department" />} />
                  <Route path="/reports" element={<PrivateRoute component={<Reports />} requiredPermission="reports" />} />
                  <Route path="/project" element={<PrivateRoute component={<Projects />} requiredPermission="project" />} />
                  <Route path="/project/task" element={<PrivateRoute component={<Task />} requiredPermission="task" />} />
                  <Route path="/clients" element={<PrivateRoute component={<Homeclient />} requiredPermission="clients" />} />
                  <Route path="/userprofile" element={<PrivateRoute component={<UserProfile />} requiredPermission="userprofile" />} />
                  <Route path="/user/reports" element={<PrivateRoute component={<UserReports />} requiredPermission="reports" />} />
                  <Route path="/timesheet/edit-week-timesheet/:id" element={ <PrivateRoute component={<WeeklyAddnewtimesheet />} requiredPermission="timesheet"/>}/>
                  <Route path="/timesheet/view-week-timesheet/:id" element={<PrivateRoute   component={<WeeklyAddnewtimesheet isViewModeTimesheet="true" />}requiredPermission="timesheet"  />  }/>
                  
               
                 
                 
                 
                     
                     
                     
                  
                  {/* Settings Routes */}
                  <Route path="/settings" element={<PrivateRoute component={<SettingsPages />} requiredPermission="settings" />} />
                  <Route path="/settings/general" element={<PrivateRoute component={<GeneralSettings onTimesheetCycleChange={handleTimesheetCycleChange} setCompanyLogo={setCompanyLogo} timesheetCycle={timesheetCycle} />} requiredPermission="settings" />} />
                  <Route path="/settings/Leave/Holiday/HolidaySetup" element={<PrivateRoute component={<HolidaySetup />} requiredPermission="settings" />} />
                  <Route path="/settings/UserAcceesControl/Roles" element={<PrivateRoute component={<Roles />} requiredPermission="Roles" />} />
                  <Route path="/settings/UserAcceesControl/Permission" element={<PrivateRoute component={<Permission />} requiredPermission="Permission" />} />
                  <Route path="/settings/DataAdministration/Reporting" element={<PrivateRoute component={<Reporting />} requiredPermission="DataAdministration" />} />
                  <Route path="/settings/DataAdministration/AuditData" element={<PrivateRoute component={<AuditData />} requiredPermission="DataAdministration" />} />
                  <Route path="/settings/payment" element={<PrivateRoute component={<Subscription />} requiredPermission="payment" />} />
                  {/* <Route path="/settings/HolidaySetup" element={<PrivateRoute component={<HolidaySetup />} requiredPermission="HolidaySetup" />} /> */}
                  <Route path="/settings/Leave/Timeoff/Timeoff" element={<PrivateRoute component={<Timeoffsetup />} requiredPermission="Timeoffsetup" />} />
                  {/* Timesheet Cycle Routes */}
                  <Route 
                    path="/timesheet/add-week-timesheet" 
                    element={
                      <PrivateRoute 
                        component={<TimesheetCyclePage timesheetCycle={timesheetCycle} locale={locale} setLocale={setLocale} />} 
                        requiredPermission="add-timesheet" 
                      />
                    } 
                  />
                </Routes>
                <Chatbot />
              </Router>
            </ProfileImageContext.Provider>
          </DateFormatProvider>
        </TimeFormatProvider>
      </TimezoneProvider>
    </IntlProvider>
  );
}

function PrivateRoute({ component, requiredPermission }) {
  const isAuthenticated = localStorage.getItem("userInfo");
  const currentUserRole = getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const hasAccess = hasPermission(requiredPermission);

  if (!hasAccess) {
    return <UnauthorizedPage />;
  }

  // Adjust component based on user role if necessary
  let renderedComponent = component;
  if (requiredPermission === "home") {
    renderedComponent = currentUserRole === "Admin" ? <Home /> : <UserDashboard />;
  }
  if (requiredPermission === "reports") {
    renderedComponent = currentUserRole === "Admin" ? <Reports /> : <UserReports />;
  }

  return renderedComponent;
}

function UnauthorizedPage() {
  return <div>Unauthorized access</div>;
}

function TimesheetCyclePage({ timesheetCycle, locale, setLocale }) {
  switch (timesheetCycle) {
    case "Monthly":
      return <MonthlyAddnewtimesheet locale={locale} setLocale={setLocale} />;
    case "BiWeekly":
      return <BiweeklyAddnewtimesheet locale={locale} setLocale={setLocale} />;
    case "Daily":
      return <DailyAddnewtimesheet locale={locale} setLocale={setLocale} />;
    default:
      return <WeeklyAddnewtimesheet locale={locale} setLocale={setLocale} />;
  }
}

export default App;