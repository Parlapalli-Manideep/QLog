import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/LandingPage/LandingPage";
import Employee from "./Pages/EmployeePage/Employee";
import Manager from "./Pages/ManagerPage/Manager";
import { LoginForm } from "./Components/Authentication/LoginForm";
import { SignupForm } from "./Components/Authentication/SignupForm";
import Attendance from "./Components/Employee/Attendance";
import Stats from "./Components/Employee/Stats";
import QRCodeComponent from "./Components/Employee/QRCodeComponent";
import ProfilePage from "./Components/Employee/Profile";
import EmployeeHome from "./Components/Employee/Home";
import ManagerHome from "./Components/Manager/Home";
import Employees from "./Components/Manager/Employees";
import Manage from "./Components/Manager/Manage";
import Analytics from "./Components/Manager/Analytics";
import ManagerProfile from "./Components/Manager/ManagerProfile"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
    />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        <Route path="/employee" element={<Employee />}>
          <Route path="home" element={<EmployeeHome />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="stats" element={<Stats />} />
          <Route path="qrcode" element={<QRCodeComponent />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="/manager" element={<Manager />}>
          <Route path="home" element={<ManagerHome />} />
          <Route path="employees" element={<Employees />} />
          <Route path="manage" element={<Manage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<ManagerProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

