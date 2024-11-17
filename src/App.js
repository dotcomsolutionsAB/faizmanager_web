// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogInWithPassword from './pages/login/LogInWithPassword';
import LogInWithOtp from './pages/login/LoginWithOtp';
import Dashboard from './pages/dashboard/Dashboard';
import {UserProvider} from './UserContext';
import { LicenseInfo } from '@mui/x-license-pro';

// Set the MUI Pro license key
LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');


function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LogInWithPassword />} />
        <Route path="/login-with-otp" element={<LogInWithOtp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
