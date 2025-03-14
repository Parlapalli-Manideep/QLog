import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateWorkingHours, classifySession, formatDate, formatTime } from '../../Utils/AttendanceCalculations';

const DownloadTablePDF = ({ columns ,data, fileName = 'sessions_report.pdf' }) => {
  return() => {
    const doc = new jsPDF();

    const headers = columns;

    const body = data.map(({ loginTime, logoutTime }) => {
      const status = classifySession(loginTime, logoutTime);
      return [
        formatDate(loginTime),
        formatTime(loginTime),
        formatTime(logoutTime),
        calculateWorkingHours(loginTime, logoutTime),
        status
      ];
    });

    autoTable(doc, {
      head: [headers],
      body: body,
    });

    doc.save(fileName);
  };
};

export default DownloadTablePDF;
