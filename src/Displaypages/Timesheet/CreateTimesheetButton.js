import React from "react";
import { useNavigate } from "react-router-dom";

const CreateTimesheetButton = ({ timesheetCycle }) => {
  const navigate = useNavigate();

  const handleCreateTimesheet = () => {
    let redirectPath;
    switch (timesheetCycle) {
      case "Monthly":
        redirectPath = "/timesheet/add-monthly-timesheet";
        break;
      case "BiWeekly":
        redirectPath = "/timesheet/add-biweekly-timesheet";
        break;
      case "Daily":
        redirectPath = "/timesheet/add-daily-timesheet";
        break;
      case "Weekly":
        redirectPath = "/timesheet/add-week-timesheet";
        break;
      default:
        console.error("Unknown timesheet cycle:", timesheetCycle);
        return;
    }

    console.log("Redirecting to:", redirectPath);
    navigate(redirectPath);
  };

  return (
    <button
      className="button btn timesheet-create-top-button-btn d-flex justify-content-between"
      onClick={handleCreateTimesheet}
    >
      <div className="timesheet-create-top-button-btn-div ms-2">
        Create TimeSheet
      </div>
      <div className="me-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <g clip-path="url(#clip0_3328_4684)">
            <path
              d="M10 0C4.47656 0 0 4.47656 0 10C0 15.5234 4.47656 20 10 20C15.5234 20 20 15.5234 20 10C20 4.47656 15.5234 0 10 0ZM10 18.332C5.39844 18.332 1.66797 14.6016 1.66797 10C1.66797 5.39844 5.39844 1.66797 10 1.66797C14.6016 1.66797 18.332 5.39844 18.332 10C18.332 14.6016 14.6016 18.332 10 18.332ZM10.832 3.33203H9.16406V10.832H15V9.16406H10.832V3.33203Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_3328_4684">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </button>
  );
};

export default CreateTimesheetButton;
