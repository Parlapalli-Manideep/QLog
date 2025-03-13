import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Dropdown } from "react-bootstrap";

const Stats = ({ loginSessions, leaves }) => {
  console.log(loginSessions,leaves);
  
  const [filter, setFilter] = useState("1M");
  const [attendanceData, setAttendanceData] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [avgHours, setAvgHours] = useState(0);

  useEffect(() => {
    calculateStats();
  }, [filter, loginSessions, leaves]);

  const calculateStats = () => {
    const totalDays = loginSessions.length;
    const workingDays = loginSessions.filter(s => s.logoutTime).length;
    const leaveDays = leaves.length;
    const absentDays = totalDays - (workingDays + leaveDays);
    
    setAttendanceData([
      { name: "Working Days", value: workingDays },
      { name: "Leaves", value: leaveDays },
      { name: "Absentees", value: absentDays },
    ]);
    
    const earlyLogout = loginSessions.filter(s => s.sessionDuration < 8).length;
    const overtime = loginSessions.filter(s => s.sessionDuration > 9).length;
    const normal = totalDays - (earlyLogout + overtime);

    setSessionData([
      { name: "Early Logout", value: earlyLogout },
      { name: "Normal", value: normal },
      { name: "Overtime", value: overtime },
    ]);

    const totalHours = loginSessions.reduce((sum, s) => sum + s.sessionDuration, 0);
    setAvgHours((totalHours / workingDays).toFixed(2));
  };

  return (
    <div className="container" style={{ marginTop: "85px" }}>
      <h3>Employee Stats</h3>
      <Dropdown onSelect={setFilter}>
        <Dropdown.Toggle variant="primary">Filter: {filter}</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="1M">This Month</Dropdown.Item>
          <Dropdown.Item eventKey="3M">Last 3 Months</Dropdown.Item>
          <Dropdown.Item eventKey="6M">Last 6 Months</Dropdown.Item>
          <Dropdown.Item eventKey="1Y">Last Year</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <div className="row mt-4">
        <div className="col-md-6">
          <h5>Attendance Stats</h5>
          <PieChart width={300} height={300}>
            <Pie data={attendanceData} cx={150} cy={150} outerRadius={80} fill="#8884d8" dataKey="value">
              <Cell fill="#0088FE" />
              <Cell fill="#00C49F" />
              <Cell fill="#FFBB28" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="col-md-6">
          <h5>Session Stats</h5>
          <PieChart width={300} height={300}>
            <Pie data={sessionData} cx={150} cy={150} outerRadius={80} fill="#82ca9d" dataKey="value">
              <Cell fill="#FF8042" />
              <Cell fill="#00C49F" />
              <Cell fill="#0088FE" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
      
      <h5 className="mt-3">Average Working Hours: {avgHours} hrs</h5>
    </div>
  );
};

export default Stats;
