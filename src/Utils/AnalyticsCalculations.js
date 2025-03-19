import { getUserById } from "../Services/Users";

export const calculateAttendanceMetrics = async (manager, attendanceRange) => {
  if (!manager?.staff) return null;

  let activeCount = 0;
  let leaveCount = 0;
  const todayDate = new Date().toLocaleDateString("en-CA");
  let presentDays = 0;
  let leaveDays = 0;
  let absentDays = 0;
  let totalDays = 0;
  
  const hourDistribution = Array(24).fill(0);
  
  const employeePerformance = [];
  
  const monthlyAttendance = {
    present: Array(12).fill(0),
    leave: Array(12).fill(0),
    absent: Array(12).fill(0)
  };
  
  const weekdayDistribution = {
    present: Array(7).fill(0),
    leave: Array(7).fill(0),
    absent: Array(7).fill(0)
  };

  for (const employeeId of manager.staff) {
    try {
      const employee = await getUserById(employeeId, "employee");

      if (!employee) continue;

      if (employee.loginSessions && employee.loginSessions.length > 0) {
        const lastSession = employee.loginSessions[employee.loginSessions.length - 1];
        if (lastSession.loginTime && !lastSession.logoutTime) {
          activeCount++;
        }
      }

      const currentYear = new Date().getFullYear().toString();
      if (employee?.leaves?.includes(todayDate)) {
        leaveCount++;
      }

      if (!employee.loginSessions || employee.loginSessions.length === 0) {
        continue;
      }

      const employeeStats = calculateEmployeeStats(employee, attendanceRange);
      employeePerformance.push({
        name: employee.name,
        attendance: employeeStats.attendancePercentage,
        leaves: employeeStats.leavesCount,
        absents: employeeStats.absentsCount
      });

      employee.loginSessions.forEach(session => {
        if (session.loginTime) {
          const loginHour = new Date(session.loginTime).getHours();
          hourDistribution[loginHour]++;
        }
      });

      const firstLoginDate = new Date(employee.loginSessions[0].loginTime);
      const today = new Date();
      
      let startDate = getDateRangeStart(attendanceRange) || firstLoginDate;
      if (startDate < firstLoginDate) startDate = firstLoginDate;
      
      let currentDate = new Date(startDate);
      while (currentDate <= today) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {  
          const dateString = currentDate.toLocaleDateString("en-CA");
          totalDays++;
          
          const wasPresent = employee.loginSessions.some(session => {
            const sessionDate = new Date(session.loginTime).toLocaleDateString("en-CA");
            return sessionDate === dateString;
          });
          
          const wasOnLeave = employee?.leaves?.includes(dateString);
          
          const month = currentDate.getMonth();
          const weekday = currentDate.getDay();
          
          if (wasPresent) {
            presentDays++;
            monthlyAttendance.present[month]++;
            weekdayDistribution.present[weekday]++;
          } else if (wasOnLeave) {
            leaveDays++;
            monthlyAttendance.leave[month]++;
            weekdayDistribution.leave[weekday]++;
          } else {
            absentDays++;
            monthlyAttendance.absent[month]++;
            weekdayDistribution.absent[weekday]++;
          }
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } catch (error) {
      console.error(`Error fetching employee ${employeeId}:`, error);
    }
  }

  const absentCount = manager.staff.length - activeCount - leaveCount;

  return {
    todayAttendance: {
      active: activeCount,
      onLeave: leaveCount,
      absent: absentCount
    },
    totalWorkingDays: totalDays,
    totalPresents: presentDays,
    totalLeaves: leaveDays,
    totalAbsents: absentDays,
    pieChartData: [
      { name: "Present", value: presentDays },
      { name: "Leave", value: leaveDays },
      { name: "Absent", value: absentDays }
    ],
    hourDistribution: hourDistribution.map((count, hour) => ({
      hour: hour,
      count: count
    })),
    employeePerformance,
    monthlyAttendance: getMonthlyAttendanceData(monthlyAttendance),
    weekdayDistribution: getWeekdayDistributionData(weekdayDistribution)
  };
};

const calculateEmployeeStats = (employee, attendanceRange) => {
  const startDate = getDateRangeStart(attendanceRange) || new Date(employee.loginSessions[0].loginTime);
  const today = new Date();
  
  let workingDays = 0;
  let presentDays = 0;
  let leavesDays = 0;
  
  let currentDate = new Date(startDate);
  while (currentDate <= today) {
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {  
      const dateString = currentDate.toLocaleDateString("en-CA");
      workingDays++;
      
      const wasPresent = employee.loginSessions.some(session => {
        const sessionDate = new Date(session.loginTime).toLocaleDateString("en-CA");
        return sessionDate === dateString;
      });
      
      const wasOnLeave = employee?.leaves?.includes(dateString);
      
      if (wasPresent) {
        presentDays++;
      } else if (wasOnLeave) {
        leavesDays++;
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const absentDays = workingDays - presentDays - leavesDays;
  const attendancePercentage = (presentDays / workingDays) * 100;
  
  return {
    attendancePercentage: attendancePercentage.toFixed(1),
    leavesCount: leavesDays,
    absentsCount: absentDays
  };
};

const getDateRangeStart = (attendanceRange) => {
  const today = new Date();
  
  switch (attendanceRange) {
    case "1m":
      return new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    case "3m":
      return new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
    case "6m":
      return new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
    case "1y":
      return new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    default:
      return null; 
  }
};

const getMonthlyAttendanceData = (monthlyAttendance) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return monthNames.map((month, index) => ({
    month,
    present: monthlyAttendance.present[index],
    leave: monthlyAttendance.leave[index],
    absent: monthlyAttendance.absent[index]
  }));
};

const getWeekdayDistributionData = (weekdayDistribution) => {
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return weekdayNames.map((day, index) => ({
    day,
    present: weekdayDistribution.present[index],
    leave: weekdayDistribution.leave[index],
    absent: weekdayDistribution.absent[index]
  }));
};