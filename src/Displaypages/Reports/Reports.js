
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import "./Reports.css";
 import Sidebar from "../../Components/Sidebar";
 import Topbar from "../../Components/Topbar";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function HomePage ({ locale, setLocale }){
  const barChartData = {
    labels: ['Total Hours Worked', 'Approved Timesheets', 'Pending Timesheets', 'Rejected Timesheets', 'Not Submitted'],
    datasets: [
      
      {
        data: [55, 15, 80, 30, 50],
        backgroundColor: ['#6c5ce7', '#00b894', '#fdcb6e', '#ff7675', '#636e72'],
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Approved', 'Pending', 'Rejected', 'Not Submitted'],
    datasets: [
      {
        data: [15, 18, 3, 15],
        backgroundColor: ['#00b894', '#fdcb6e', '#ff7675', '#636e72'],
      },
    ],
  };

  const employeeData = [
    { id: 'AGT-09895', name: 'Oliver john', status: 'Approved', totalHours: '08:30 hrs', workHours: '08:30 hrs' },
    // Add more employee data as needed
  ];

  return (
    <div>
              <Topbar locale={locale} setLocale={setLocale} />
              <div className="d-flex">
                 <Sidebar locale={locale} setLocale={setLocale}/>
    <div className="dashboard">
      <div className="summary">
        <div className="summary-item">
          <span className="icon">⏱️</span>
          <div>
            <h3>Total Hours Worked</h3>
            <p>8:30 Hours</p>
          </div>
        </div>
        <div className="summary-item approved">
          <span className="icon">✅</span>
          <div>
            <h3>Approved Timesheets</h3>
            <p>15</p>
          </div>
        </div>
        <div className="summary-item pending">
          <span className="icon">⏳</span>
          <div>
            <h3>Pending Timesheets</h3>
            <p>18</p>
          </div>
        </div>
        <div className="summary-item rejected">
          <span className="icon">❌</span>
          <div>
            <h3>Rejected Timesheets</h3>
            <p>3</p>
          </div>
        </div>
        <div className="summary-item not-submitted">
          <span className="icon">📝</span>
          <div>
            <h3>Not Submitted</h3>
            <p>15</p>
          </div>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container">
          <h2>Business & Working Hours Utilization</h2>
          <div className="chart-wrapper">
            <Bar data={barChartData} options={{ indexAxis: 'y', responsive: true }} />
            <Doughnut data={doughnutChartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      <div className="employee-table">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Status</th>
              <th>Total Hours</th>
              <th>Work Hours</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((employee, index) => (
              <tr key={index}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.status}</td>
                <td>{employee.totalHours}</td>
                <td>{employee.workHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
};

export default HomePage;
