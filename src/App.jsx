import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/LandingPage/LandingPage";
import Employee from "./Pages/EmployeePage/Employee";
import Manager from "./Pages/ManagerPage/Manager";
import { AuthLayout } from "./Components/Authentication/AuthenticationLayout";
import { LoginForm } from "./Components/Authentication/LoginForm";
import { SignupForm } from "./Components/Authentication/SignupForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route 
          path="/login" 
          element={
            <LoginForm />
          } 
        />
        <Route 
          path="/signup" 
          element={
              <SignupForm />
          } 
        />
        
        <Route path="/employee" element={<Employee />} />
        <Route path="/manager" element={<Manager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
