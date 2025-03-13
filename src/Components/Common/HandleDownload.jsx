const handleDownload = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Employee Attendance Records", 14, 10);

    // Define columns and rows
    const tableColumn = ["Date", "Login Time", "Logout Time", "Working Hours", "Status"];
    const tableRows = filteredSessions.map(({ loginTime, logoutTime }) => {
        const date = formatDate(loginTime);
        const login = formatTime(loginTime);
        const logout = formatTime(logoutTime);
        const workingHours = calculateWorkingHours(loginTime, logoutTime);
        const status = classifySession(loginTime, logoutTime);
        return [date, login, logout, workingHours, status];
    });

    // Generate table
    doc.autoTable({
        startY: 20, // Start table below title
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 10, halign: "center" }, // Center align text
        theme: "striped",
    });

    // Save the PDF
    doc.save("Attendance_Report.pdf");
};
