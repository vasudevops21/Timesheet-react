import React, { useState, useEffect } from "react";
import './Timesheetviewpage.css'
import Topbar from "../../Components/Topbar";
import Sidebar from "../../Components/Sidebar";
import Table from 'react-bootstrap/Table';
import { Link, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { startOfWeek, addDays, format } from 'date-fns';
import { IoMdAddCircleOutline, IoIosSave } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";

const getWeekDates = (firstDayOfWeek) => {
    return Array.from({ length: 7 }, (_, index) => {
        const currentDate = addDays(firstDayOfWeek, index);
        return {
            date: format(currentDate, 'yyyy-MM-dd'),
            day: format(currentDate, 'EEEE'),
        };
    });
};

function Timesheetviewpage() {

    const currentDate = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    let formattedDate = currentDate.toLocaleString('en-US', options);
    formattedDate = formattedDate.replace(',', ' ');
    console.log(formattedDate);

    const firstDayOfCurrentWeek = startOfWeek(new Date());
    const [selectedWeek, setSelectedWeek] = useState(getWeekDates(firstDayOfCurrentWeek));
    const [Project, setProject] = useState([]);
    const [clickedInputIndex, setClickedInputIndex] = useState(null);
    const [clickedRowIndex, setClickedRowIndex] = useState(null);
    const [contentRows, setContentRows] = useState([
        {
            dayHours: [0, 0, 0, 0, 0, 0, 0],
            commenttext: [[], [], [], [], [], [], []],
            selectedWeek: getWeekDates(firstDayOfCurrentWeek),
            selectProject: "Select Project",
            selectedPayType: "regularhour",
        },
    ]);




    const handleInputClick = (rowIndex, columnIndex) => { // Update handleInputClick to accept row index and column index
        setClickedRowIndex(rowIndex); // Set the clicked row index
        setClickedInputIndex(columnIndex); // Set the clicked input index
    };

    const handleWeekChange = (date) => {
        const firstDayOfWeek = startOfWeek(date);
        updateSelectedWeek(firstDayOfWeek);
    };

    const handleCommentChange = (event, rowIndex, dayIndex) => {
        const updatedRows = [...contentRows];
        const inputValue = event.target.value;
        updatedRows[rowIndex].commenttext[dayIndex] = inputValue.split('\n')
        //updatedRows[rowIndex].commenttext[dayIndex] = event.target.value || "";
        setContentRows(updatedRows);
    };

    const updateSelectedWeek = (firstDayOfWeek) => {
        const weekDates = getWeekDates(firstDayOfWeek);
        setSelectedWeek(weekDates);
        console.log('Selected Week:', weekDates);
    };

    const handlePayTypeChange = (selectedOption, rowIndex) => {
        if (selectedOption) {
            const updatedRows = [...contentRows];
            updatedRows[rowIndex].selectedPayType = selectedOption || "regularhour"; // Set selected pay type
            setContentRows(updatedRows);
            // setSelectedPayType(selectedOption);
        } else {
            // Handle case when no option is selected
        }
    };

    const calculateTotalHours = (dayHours) => {
        return dayHours.reduce((total, hours) => total + hours, 0);
    };

    const calculateOverallTotalHours = () => {
        return contentRows.reduce((total, row) => total + calculateTotalHours(row.dayHours), 0);
    };

    const calculatedayHourstotal = (dayIndex) => {
        let totaldayHours = 0;
        contentRows.forEach(row => {
            totaldayHours += row.dayHours[dayIndex];
        });
        return totaldayHours;
    };

    // const calculateRegularHours = (dayIndex) => {
    //     const totalDayHours = calculatedayHourstotal(dayIndex);
    //     return totalDayHours;
    // };

    const calculateRegularHours = (dayIndex) => {
        let totalRegularHours = 0;
        contentRows.forEach(row => {
            // Check if the selected pay type is 'regularhour'
            if (row.selectedPayType === 'regularhour') {
                totalRegularHours += row.dayHours[dayIndex];
            }
        });
        return totalRegularHours;
    };

    const calculateOvertimeHours = (dayIndex) => {
        let totalOvertimeHours = 0;
        contentRows.forEach(row => {
            // Check if the selected pay type is 'overtimehour'
            if (row.selectedPayType === 'overtimehour') {
                totalOvertimeHours += row.dayHours[dayIndex];
            }
        });
        return totalOvertimeHours;
    };


    const calculateTotalRegularHours = () => {
        let totalRegularHours = 0;
        selectedWeek.forEach((day, dayIndex) => {
            totalRegularHours += calculateRegularHours(dayIndex);
        });
        return totalRegularHours;
    };
    const calculateTotalOvertimeHours = () => {
        let totalRegularHours = 0;
        selectedWeek.forEach((day, dayIndex) => {
            totalRegularHours += calculateOvertimeHours(dayIndex);
        });
        return totalRegularHours;
    };

    const handleCircleIconClick = () => {
        handleAddNewRow('addnew');
    };

    // For the icon representing 'add'
    const handleAddIconClick = () => {
        handleAddNewRow('paytypeadd');
    };

    // Function to add a new row with the specified iconType
    const handleAddNewRow = (iconType) => {
        // Add the new row to the contentRows array with the specified iconType
        setContentRows(prevRows => [
            ...prevRows,
            {
                iconType: iconType, // Set the iconType for the new row
                dayHours: [0, 0, 0, 0, 0, 0, 0],
                commenttext: ["", "", "", "", "", "", ""],
                selectProject: "Select Project",
                projectId: "",
                selectedPayType: "regularhour"
            }
        ]);
        console.log(iconType)
    };


    const handleDeleteRow = (index) => {
        const updatedRows = [...contentRows];
        updatedRows.splice(index, 1);
        setContentRows(updatedRows);
    };

    const handleDayHoursChange = (event, rowIndex, dayIndex) => {
        const updatedRows = [...contentRows];
        updatedRows[rowIndex].dayHours[dayIndex] = parseFloat(event.target.value) || 0;
        setContentRows(updatedRows);
    };

    const CustomDatePickerInputviewpage = ({ value, onClick }) => {
        return (
            <div className="custom-date-picker-input ps-2 d-flex" onClick={onClick} >
                {value}
                {/* <FontAwesomeIcon icon={faCalendarAlt} className="ps-2 opacity-50" /> */}
                <div className="ps-2 custom-date-picker-input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M14 22H10C6.229 22 4.343 22 3.172 20.828C2 19.657 2 17.771 2 14V12C2 8.229 2 6.343 3.172 5.172C4.343 4 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C22 6.343 22 8.229 22 12V14C22 17.771 22 19.657 20.828 20.828C20.175 21.482 19.3 21.771 18 21.898M7 4V2.5M17 4V2.5M21.5 9H10.75M2 9H5.875" stroke="black" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18C16.7348 18 16.4804 17.8946 16.2929 17.7071C16.1054 17.5196 16 17.2652 16 17C16 16.7348 16.1054 16.4804 16.2929 16.2929C16.4804 16.1054 16.7348 16 17 16C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17ZM18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14C16.7348 14 16.4804 13.8946 16.2929 13.7071C16.1054 13.5196 16 13.2652 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM8 17C8 17.2652 7.89464 17.5196 7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18C6.73478 18 6.48043 17.8946 6.29289 17.7071C6.10536 17.5196 6 17.2652 6 17C6 16.7348 6.10536 16.4804 6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17ZM8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13Z" fill="black" fill-opacity="0.5" />
                    </svg>
                </div>
            </div>
        );
    };


    return (
        <>
            <div>
                <Topbar />
                <div className="d-flex">
                    <Sidebar />
                    <div className="container " style={{ overflow: 'auto', maxHeight: 'calc(100vh - 50px)' }}>
                        <div className="back-button-icon-timesheet d-flex m-4">
                            <Link to={"/timesheet"} style={{ textDecoration: 'none' }}>
                                <div className="back-button-icon-timesheet-view-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                        <path d="M4.99992 12.5L4.11617 13.3838L3.23242 12.5L4.11617 11.6163L4.99992 12.5ZM26.2499 22.5C26.2499 22.8315 26.1182 23.1495 25.8838 23.3839C25.6494 23.6183 25.3314 23.75 24.9999 23.75C24.6684 23.75 24.3505 23.6183 24.116 23.3839C23.8816 23.1495 23.7499 22.8315 23.7499 22.5H26.2499ZM10.3662 19.6338L4.11617 13.3838L5.88367 11.6163L12.1337 17.8663L10.3662 19.6338ZM4.11617 11.6163L10.3662 5.36627L12.1337 7.13377L5.88367 13.3838L4.11617 11.6163ZM4.99992 11.25H17.4999V13.75H4.99992V11.25ZM26.2499 20V22.5H23.7499V20H26.2499ZM17.4999 11.25C19.8206 11.25 22.0462 12.1719 23.6871 13.8128C25.328 15.4538 26.2499 17.6794 26.2499 20H23.7499C23.7499 18.3424 23.0914 16.7527 21.9193 15.5806C20.7472 14.4085 19.1575 13.75 17.4999 13.75V11.25Z" fill="black" fill-opacity="0.5" />
                                    </svg>
                                </div>
                            </Link>
                            <p className="back-button-icon-timesheet-view-p">Timesheet</p>
                        </div>
                        <div className="employee-week-details-view-page ">
                            <div className="row container employee-details-week-timesheet-view-page d-flex justify-content-between">
                                <div className="employee-name-timesheet-week-view-page p-2 pt-3 col-auto">
                                    <label className="employee-name-timesheet-week-label-view-page mb-2">Employee Name</label>
                                    <div className="employee-name-timesheet-week-box-input-view-page">John Claddies</div>
                                </div>
                                <div className="employee-ID-timesheet-week-view-page p-2 pt-3 col-auto">
                                    <label className="employee-ID-timesheet-week-label-view-page mb-2">Employee ID</label>
                                    <div className="employee-ID-timesheet-week-box-input-view-page">AGT09887</div>
                                </div>
                                <div className="employee-status-timesheet-week-view-page p-2 pt-3 col-auto">
                                    <label className="employee-status-timesheet-week-label-view-page mb-2">Status</label>
                                    <div className="employee-status-timesheet-week-box-input-view-page">Re-Called</div>
                                </div>
                                <div className="employee-current-date-timesheet-week-view-page p-2 pt-3 col-auto">
                                    <label className="employee-current-date-timesheet-week-label-view-page mb-2">Current Time and Date</label>
                                    <div className="employee-current-date-timesheet-week-box-input-view-page d-flex">{formattedDate}
                                        <div className="ps-2 employee-current-date-timesheet-week-box-input-icon-view-page">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M14 22H10C6.229 22 4.343 22 3.172 20.828C2 19.657 2 17.771 2 14V12C2 8.229 2 6.343 3.172 5.172C4.343 4 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C22 6.343 22 8.229 22 12V14C22 17.771 22 19.657 20.828 20.828C20.175 21.482 19.3 21.771 18 21.898M7 4V2.5M17 4V2.5M21.5 9H10.75M2 9H5.875" stroke="black" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18C16.7348 18 16.4804 17.8946 16.2929 17.7071C16.1054 17.5196 16 17.2652 16 17C16 16.7348 16.1054 16.4804 16.2929 16.2929C16.4804 16.1054 16.7348 16 17 16C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17ZM18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14C16.7348 14 16.4804 13.8946 16.2929 13.7071C16.1054 13.5196 16 13.2652 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM8 17C8 17.2652 7.89464 17.5196 7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18C6.73478 18 6.48043 17.8946 6.29289 17.7071C6.10536 17.5196 6 17.2652 6 17C6 16.7348 6.10536 16.4804 6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17ZM8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13Z" fill="black" fill-opacity="0.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="employee-select-week-timesheet-calendar-view-page p-2 pt-3 col-auto">
                                    <label className="employee-select-week-timesheet-calendar-label-view-page mb-2">Select Date</label>
                                    <div className="employee-select-week-timesheet-calendar-box-input-view-page">
                                        <DatePicker
                                            className="timesheet-week-calendar-wrapper-date-picker-view-page"
                                            selected={selectedWeek ? new Date(selectedWeek[0].date) : null}
                                            onChange={handleWeekChange}
                                            showWeekNumbers
                                            dateFormat={`MM/dd/yyyy - ${selectedWeek ? format(new Date(selectedWeek[6].date), 'MM/dd/yyyy') : ''}`}
                                            selectsStart
                                            startDate={selectedWeek ? new Date(selectedWeek[0].date) : null}
                                            endDate={selectedWeek ? new Date(selectedWeek[6].date) : null}
                                            customInput={<CustomDatePickerInputviewpage />}
                                        />

                                    </div>
                                </div>
                                <div className="employee-reported-hours-timesheet-week-view-page p-2 pt-3 col-auto">
                                    <label className="employee-reported-hours-timesheet-week-label-view-page pt-4">Reported Hours</label>
                                    <div className="employee-reported-hours-timesheet-week-box-input-view-page">{calculateOverallTotalHours()} Hrs</div>
                                </div>
                            </div>

                            <div className="employee-add-entries-details-week-timesheet-view-page table-responsive">
                                <table class="table table-borderless custom-table ">
                                    <thead >
                                        <tr className="employee-add-entries-details-week-timesheet-table-head-view-page">
                                            <th scope="col" className="custom-table-header-week-timesheet-entries-view-page" ></th>
                                            <th scope="col" className="custom-table-header-week-timesheet-entries-project-view-page">Projects</th>
                                            <th scope="col" className="custom-table-header-week-timesheet-entries-projectid-view-page">Project ID</th>
                                            <th scope="col" className="custom-table-header-week-timesheet-entries-view-page">Pay type</th>
                                            {selectedWeek.map((day, dayIndex) => (
                                                <th key={day.date} className={`add-day-${dayIndex + 1}`} style={{ whiteSpace: 'nowrap', backgroundColor: '#787DBD', color: 'white', fontSize: '14px', padding: '20px', alignItems: 'center', textAlign: 'center' }}>
                                                    <div>
                                                        <label className="timesheet-add-hours-box-label-view-page" htmlFor={`working-hours-${dayIndex + 1}`}>
                                                            <div>{`${format(new Date(day.date), 'EEE')}`}</div>
                                                            <div>{`${format(new Date(day.date), 'MMM dd')}`}</div>
                                                        </label>
                                                    </div>
                                                </th>
                                            ))}
                                            <th scope="col" className="custom-table-header-week-timesheet-entries-view-page" >Total</th>
                                            <th scope="col" className="custom-table-header-week-timesheet-entries-view-page" ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contentRows.map((row, index) => (
                                            <tr key={index}>
                                                {row.iconType !== 'paytypeadd' ? (
                                                    <td className="custom-table-body-week-timesheet-entries-view-page">
                                                        <div className="timesheet-weekly-add-new-work-hours-view-page" id={`timesheet-weekly-add-new-work-hours-view-page-${index}`}>
                                                            <div className="timesheet-weekly-add-new-work-hours-icon-view-page ms-3 mt-1" onClick={handleCircleIconClick}>
                                                                <IoMdAddCircleOutline style={{ fontSize: '22px', color: 'rgba(0, 0, 0, 0.50)', backgroundColor: '#EEECEC ', marginTop: '16px', cursor: 'pointer' }} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                ) : <td className="custom-table-body-week-timesheet-entries-view-page"></td>}
                                                {row.iconType !== 'paytypeadd' ? (
                                                    <td className="custom-table-body-week-timesheet-entries-view-page">
                                                        <p className="timesheet-weekly-select-project-view-page ">{row.selectProject}</p>

                                                    </td>
                                                ) : <td className="custom-table-body-week-timesheet-entries-view-page"></td>}
                                                {row.iconType !== 'paytypeadd' ? (
                                                    <td className="custom-table-body-week-timesheet-entries-view-page">
                                                        <p className="timesheet-weekly-select-project-description-view-page" id={`timesheet-weekly-select-project-description-${index}`}>id-3030303</p>
                                                    </td>
                                                ) : <td className="custom-table-body-week-timesheet-entries-view-page"></td>}

                                                <td className="custom-table-body-week-timesheet-entries-view-page">
                                                    <div className="d-flex flex-row">
                                                        <div className="timesheet-weekly-add-new-pay-type-icon-view-page" id={`timesheet-weekly-add-new-pay-type-icon-${index}`} onClick={handleAddIconClick}>
                                                            <IoMdAddCircleOutline style={{ fontSize: '22px', color: 'rgba(0, 0, 0, 0.50)', marginTop: '20px', cursor: 'pointer' }} />
                                                        </div>

                                                        <div class="timesheet-weekly-pay-type-select-custom-dropdown-view-page">
                                                            <select class="form-select timesheet-weekly-pay-type-select-view-page" id={`timesheet-weekly-pay-type-select-${index}`} onChange={(e) => handlePayTypeChange(e.target.value, index)} value={row.selectedPayType}>
                                                                <option value="regularhour">R</option>
                                                                <option value="overtimehour">OT</option>
                                                            </select>
                                                        </div>

                                                    </div>
                                                </td>
                                                {selectedWeek.map((day, dayIndex) => (
                                                    <td key={day.date} className="custom-table-body-week-timesheet-entries-view-page">
                                                        <div className="timesheet-weekly-add-hours-box-view-page d-flex flex-row mt-1 me-3">
                                                            <input
                                                                className="timesheet-weekly-add-hours-box-show-view-page"
                                                                type="number"
                                                                id={`working-hours-weekly-timesheet-${dayIndex + 1}`}
                                                                onChange={(event) => handleDayHoursChange(event, index, dayIndex)}
                                                                onClick={() => handleInputClick(index, dayIndex)}
                                                                value={contentRows[index].dayHours[dayIndex]}
                                                            />
                                                            {clickedInputIndex === dayIndex && clickedRowIndex === index && (
                                                                <div className="timesheet-weekly-add-hours-box-show-icon-view-page"  >
                                                                    <FaRegCommentDots style={{ fontSize: '20px', marginTop: '9px', color: 'rgba(0, 0, 0, 0.50)' }} className="timesheet-weekly-enter-commend-box-view-page " data-bs-toggle="modal" data-bs-target={`#commentpopupModalviewpage-${index}-${dayIndex + 1}`} />
                                                                    {/* popup comment box start*/}
                                                                    <div class="modal commentpopupModal-timesheet-weekly-view-page" id={`commentpopupModalviewpage-${index}-${dayIndex + 1}`} tabindex="-1" aria-labelledby="commentpopupModalLabelviewpage" aria-hidden="true"  >
                                                                        <div class="modal-dialog modal-dialog-centered search-weekly-view-page">
                                                                            <div class="modal-content timesheet-weekly-comment-text-model-view-page">

                                                                                <div class="modal-body">
                                                                                    <div>
                                                                                        <div className="d-flex justify-content-between">
                                                                                            <div className="modal-title d-flex flex-row" id="commentpopupModalLabelviewpage">
                                                                                                <h5 className="timesheet-weekly-comment-text-model-title-name-view-page mt-2">Submission Date &nbsp; - &nbsp; &nbsp;</h5>
                                                                                                <h5 className="timesheet-weekly-comment-text-model-title-date-view-page mt-2"> {`${format(new Date(day.date), 'EEE MMM dd')} - ${new Date(day.date).getFullYear()}`}</h5>
                                                                                            </div>
                                                                                            <div className="timesheet-weekly-comment-text-model-title-close-icon-view-page" data-bs-dismiss="modal" aria-label="Close">
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                                                    <path d="M4 12L12 4M12 12L4 4" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                                                </svg>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="timesheet-weekly-comment-text-model-title-emptyline-view-page"></div>
                                                                                        <textarea
                                                                                            id={`timesheet-weekly-comment-textarea-${dayIndex + 1}`}
                                                                                            className="timesheet-weekly-comment-textarea-name-view-page"
                                                                                            rows="4"
                                                                                            placeholder="Leave a comment for Authorizer..."
                                                                                            value={contentRows[index].commenttext[dayIndex]}
                                                                                            onChange={(event) => handleCommentChange(event, index, dayIndex)}
                                                                                        />
                                                                                        <div className="d-flex justify-content-end">
                                                                                            <button type="button" class="btn timesheet-weekly-comment-text-model-share-comment-view-page" data-bs-dismiss="modal">Share Comment</button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* popup comment box end */}
                                                                </div>
                                                            )}

                                                        </div>
                                                    </td>
                                                ))}
                                                <td className="custom-table-body-week-timesheet-entries-view-page">
                                                    <div className="timesheet-weekly-add-total-hours-box-view-page pt-1">
                                                        {/* <label className="timesheet-add-total-hours-box-label" htmlFor="timesheet-add-total-hours-box-label" >{index === 0 ? "Total Hours" : null}</label> */}
                                                        <div >
                                                            <input
                                                                className="timesheet-weekly-add-total-hours-box-show-view-page"
                                                                type="text"
                                                                id="timesheet-weekly-add-total-hours-box-label"
                                                                value={calculateTotalHours(row.dayHours)}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="custom-table-body-week-timesheet-entries-view-page" >
                                                    <div className="timesheet-weekly-add-new-work-hours-delete-view-page">
                                                        <div className="timesheet-weekly-add-new-work-hours-icon-delete-view-page" onClick={() => handleDeleteRow(index)}>
                                                            {index !== 0 && (
                                                                <React.Fragment>
                                                                    <label htmlFor={`timesheet-weekly-add-new-work-hours-icon-display-box-delete-${index}`} className="timesheet-weekly-add-new-work-hours-icon-display-label-delete-view-page"></label>
                                                                    {/* <FontAwesomeIcon
                                                                    icon={faTrash}
                                                                    style={{ fontSize: '20px', color: 'red', padding: '10px' }}

                                                                /> */}
                                                                    <div className="timesheet-weekly-add-new-work-hours-icon-display-delete-icon-view-page">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                                                                            <path d="M1.71112 5.6904L2.59192 14.4168C2.64072 14.7856 4.42152 15.9984 6.99992 16C9.57992 15.9984 11.3607 14.7856 11.4087 14.4168L12.2903 5.6904C10.9431 6.444 8.92952 6.8 6.99992 6.8C5.07192 6.8 3.05752 6.444 1.71112 5.6904ZM9.53432 1.208L8.84712 0.4472C8.58152 0.0688 8.29352 0 7.73272 0H6.26792C5.70792 0 5.41912 0.0688 5.15432 0.4472L4.46712 1.208C2.41112 1.5672 0.919922 2.52 0.919922 3.2232V3.3592C0.919922 4.5968 3.64232 5.6 6.99992 5.6C10.3583 5.6 13.0807 4.5968 13.0807 3.3592V3.2232C13.0807 2.52 11.5903 1.5672 9.53432 1.208ZM8.65592 3.472L7.79992 2.4H6.19992L5.34552 3.472H3.98552C3.98552 3.472 5.47512 1.6952 5.67432 1.4544C5.82632 1.2704 5.98152 1.2 6.18312 1.2H7.81752C8.01992 1.2 8.17512 1.2704 8.32712 1.4544C8.52552 1.6952 10.0159 3.472 10.0159 3.472H8.65592Z" fill="black" fill-opacity="0.5" />
                                                                        </svg>
                                                                    </div>
                                                                </React.Fragment>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                        <tr >
                                            <td colspan="4" className="custom-table-body-week-timesheet-entries-view-page pt-2">
                                                <div className="d-flex justify-content-end timesheet-week-regular-hours-calculation-view-page">Regular :</div>
                                            </td>
                                            {selectedWeek.map((day, dayIndex) => (
                                                <td key={dayIndex} className="custom-table-body-week-timesheet-entries-view-page pt-2">
                                                    <div className="timesheet-week-regular-hours-calculation-view-page">{calculateRegularHours(dayIndex)}</div>
                                                </td>
                                            ))}
                                            <td colSpan={selectedWeek.length} className="custom-table-body-week-timesheet-entries-view-page pt-2">
                                                <div className="timesheet-week-regular-hours-calculation-final-view-page">{calculateTotalRegularHours()}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="4" className="custom-table-body-week-timesheet-entries-view-page pt-1">
                                                <div className="d-flex justify-content-end timesheet-week-overtime-hours-calculation-view-page">Overtime :</div>
                                            </td>
                                            {selectedWeek.map((day, dayIndex) => (
                                                <td key={dayIndex} className="custom-table-body-week-timesheet-entries-view-page pt-1">
                                                    <div className="timesheet-week-overtime-hours-calculation-view-page">{calculateOvertimeHours(dayIndex)}</div>
                                                </td>
                                            ))}
                                            <td colSpan={selectedWeek.length} className="custom-table-body-week-timesheet-entries-view-page pt-1">
                                                <div className="timesheet-week-overtime-hours-calculation-final-view-page">{calculateTotalOvertimeHours()}</div>
                                            </td>
                                        </tr>
                                        <tr >
                                            <td colSpan="4" className="custom-table-body-week-timesheet-entries-view-page pt-1">
                                                <div className="d-flex justify-content-end timesheet-week-total-hours-calculation-view-page">Total :</div>
                                            </td>
                                            {selectedWeek.map((day, dayIndex) => (
                                                <td key={dayIndex} className="custom-table-body-week-timesheet-entries-view-page pt-1">
                                                    <div className="timesheet-week-total-hours-calculation-view-page">{calculatedayHourstotal(dayIndex)}</div>
                                                </td>
                                            ))}
                                            <td colSpan={selectedWeek.length} className="custom-table-body-week-timesheet-entries-view-page pt-1">
                                                <div className="timesheet-week-total-hours-calculation-final-view-page">{calculateOverallTotalHours()}</div>
                                            </td>
                                        </tr>
                                        <tr >
                                            <td colSpan="13" className="empty-space-color-table-view-page"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <div className="white-space-timesheet-view-page">
                        </div>
                    </div>

                </div>


            </div>
        </>
    )
}
export default Timesheetviewpage