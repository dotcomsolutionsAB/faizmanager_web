import { useState } from 'react'
import './App.css'
import { Login } from './pages/ui/login/LoginPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './pages/ui/forgotPassword/forgotPasswordPage';
import SignUp from './pages/ui/signup/signUpPage';
import Dashboard from './pages/ui/dashboard/DashboardPage';
import Layout from './components/layout/Layout';
import Mumeneen from './pages/ui/mumeneen/Mumeneen';
import { useLocation } from 'react-router-dom';



function App() {
  const [userName, setUserName] = useState('');
  return (
    <BrowserRouter>
    <Layout userName={userName}>
      <Routes>
        <Route path='/' element={<Login setUserName={setUserName} />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path='/mumeneen' element={<Mumeneen />} />
      </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;
