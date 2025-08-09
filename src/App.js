import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogInWithPassword from './pages/login/LogInWithPassword';
import LogInWithOtp from './pages/login/LoginWithOtp';
import Dashboard from './pages/dashboard/Dashboard';
import MumeneenTable from './pages/mumeneen/MumeneenTable';
import MumeneenDetailsTable from './pages/mumeneen/MumeneenDetailsTable';
import Payments from './pages/accounts/Payments';
import Receipts from './pages/accounts/Receipts';
import Expenses from './pages/accounts/Expenses';
import Sector from './pages/grouping/Sector';
import SubSector from './pages/grouping/SubSector';
import Transfers from './pages/grouping/Transfers';
// import Dashboard from './samples/pages/dashboard/Dashboard';
import { UserProvider } from './contexts/UserContext';
import { LicenseInfo } from '@mui/x-license-pro';
import Layout from './Layout';
import NiyazDate from './pages/bookings/NiyazDate';
import SalawataFateha from './pages/bookings/SalawatFateha';
import Zabihat from './pages/bookings/Zabihat';
import Feedback from './pages/feedback/Feedback';
import Notifications from './pages/notifications/Notifications';
import Settings from './pages/settings/Settings';
import UserAccess from './pages/userManagement/UserAccess'
import SignUp from './pages/signUp/SignUp';
import Roles from './pages/userManagement/Roles';
import ForgotPassword from './pages/login/ForgotPassword';
import JamaatTable from './pages/jamaat/Jamaat';
import Niyaz from './pages/niyaz/Niyaz';
import Menu from './pages/menu/Menu';
import NiyazCalendar from './pages/niyazCalendar/NiyazCalendar';
import './App.css'
import ContextWrapper from './contexts/ContextWrapper';
// import SignUp from '.samples/pages/signup/SignUp';
// import Mumeneen from './samples/pages/mumeneen/Mumeneen';
// import MumeneenDetails from './samples/pages/mumeneen/MumeneenDetails';

// Set the MUI Pro license key
LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');

function App() {
  // const [selectedSector, setSelectedSector] = useState([]);
  // const [selectedSubSector, setSelectedSubSector] = useState([]);
  // const [selectedYear, setSelectedYear] = useState([]);

  // // Handle filter changes
  // const handleFilterChange = (sector, subSector, year) => {
  //   setSelectedSector(sector);
  //   setSelectedSubSector(subSector);
  //   setSelectedYear(year);
  // };

  // const resetFilters = () => {
  //   setSelectedSector([]);
  //   setSelectedSubSector([]);
  //   setSelectedYear([]);
  // };


  return (
    <UserProvider>
      <ContextWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<LogInWithPassword />} />
          <Route path="/login-with-otp" element={<LogInWithOtp />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}


          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mumeneen" element={<MumeneenTable />} />
            <Route path="/mumeneen/:family_id" element={<MumeneenDetailsTable />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/sector" element={<Sector />} />
            <Route path="/sub_sector" element={<SubSector />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/niyaz_date" element={<NiyazDate />} />
            <Route path="/salawat_fateha" element={<SalawataFateha />} />
            <Route path="/zabihat" element={<Zabihat />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/user_access" element={<UserAccess />} />
            <Route path="/jamaat" element={<JamaatTable />} />
            <Route path="/niyaz" element={<Niyaz />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/niyaz-calendar" element={<NiyazCalendar />} />
          </Route>
          {/* Optional: Catch-all for unknown routes */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
      </ContextWrapper>

    </UserProvider>
  );
}

export default App;
{/* <Router>
        <Routes>
          <Route path="/" element={<LogInWithPassword />} />
          <Route path="/login-with-otp" element={<LogInWithOtp />} /> */}
{/* <Route path="/sign-up" element={<SignUp />} /> */ }
{/* <Route
            path="/dashboard"
            element={<Dashboard onFilterChange={handleFilterChange} />}
          /> */}
{/* <Route
            path="/mumeneen"
            element={
              <Mumeneen
                selectedSector={selectedSector}
                selectedSubSector={selectedSubSector}
                selectedYear={selectedYear}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
              />
            }
          /> */}
{/* <Route path="/mumeneen/:id" element={<MumeneenDetails />} /> */ }
{/* </Routes>
      </Router> */}