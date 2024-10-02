import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from 'date-fns';
import { useDateFormat } from './DateFormatContext';
import "./Project.css";

const DatePickerComponent = ({ selectedDate, onDateChange , minDate, maxDate, error }) => {
  const { dateFormat } = useDateFormat();

  const dateFormatMap = {
    'dd/mm/yyyy': 'dd/MM/yyyy',
    'mm/dd/yyyy': 'MM/dd/yyyy',
  };

  const handleDateChange = (date) => {
    onDateChange(date ? format(date, 'yyyy-MM-dd') : '');
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return new Date(year, month - 1, day);
  };

  return (
    <DatePicker
      selected={parseDate(selectedDate)}
      onChange={handleDateChange}
      dateFormat={dateFormatMap[dateFormat]}
      placeholderText={dateFormatMap[dateFormat]}
      className={`form-control custom_input-project project_date ${error ? 'is-invalid' : ''}`}
      // className="form-control custom_input-project project_date"
      minDate={minDate}
      maxDate={maxDate}
    />
  );
};

export default DatePickerComponent;









