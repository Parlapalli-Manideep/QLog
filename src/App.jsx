// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// import LandingPage from './Pages/LandingPage/LandingPage';
// import AuthPage from './Pages/LoginPage/AuthPage';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/LandingPage" />} />
//         <Route path="/LandingPage" element={<LandingPage />} />
//         <Route path="/Login" element={<AuthPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// import LandingPage from './Pages/LandingPage/LandingPage';
// import AuthPage from './Pages/LoginPage/AuthPage';
// // import Employee from './Pages/Employee/Employee';  
// // import Manager from './Pages/Manager/Manager';    
// import Employee from './Pages/EmployeePage/Employee';
// import Manager from './Pages/MangerPage/Manager';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/LandingPage" />} />
//         <Route path="/LandingPage" element={<LandingPage />} />
//         <Route path="/Login" element={<AuthPage />} />
//         <Route path="/Employee" element={<Employee />} /> 
//         <Route path="/Manager" element={<Manager />} />  
//         </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import AuthPage from './Pages/LoginPage/AuthPage';
import Employee from './Pages/EmployeePage/Employee';
import Manager from './Pages/ManagerPage/Manager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/LandingPage" />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/Login" element={<AuthPage />} />
        <Route path="/Employee" element={<Employee />} />
        <Route path="/Manager" element={<Manager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

