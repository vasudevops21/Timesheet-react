export const PERMISSIONS = {
  Admin: [
    "home",
    "timesheet", "mytimesheet",  "timesheetapprovals", "add-week-timesheet",   "Approvals", "add-timesheet",
    "project",
    "clients",
    "organization",  "addemployee", "employeeaction","deleteemployee",
    "expenses",
    "department","departmentaction","adddepartment",
    "reports",
    "task",
    "userprofile",
    "settings", "Roles",  "Module", "Permission","IpGeoRestrict","DataAdministration","HolidaySetup","Timeoffsetup","payment",
    "Signuppage"
  ],

  User: [
    "home",
    "timesheet", "mytimesheet", "add-week-timesheet", "add-timesheet",
    "userprofile",
    "reports",
  ],
  
  Supervisor: [
   "home",
   "organization",
   "department",
   "timesheet", "mytimesheet",  "timesheetapprovals", "add-week-timesheet",   "Approvals", "add-timesheet",
   "userprofile",
   "settings", "Roles",  "Module", "Permission",
  ],
};