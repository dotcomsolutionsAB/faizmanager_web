"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../../../components/login/Label";
import { Input } from "../../../components/login/Input";
import { cn } from "../../../lib/utils";
import {
  IconPasswordUser,
  IconLogin,
} from "@tabler/icons-react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Login({setUserName }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle location states for various messages
  useEffect(() => {
    if (location.state?.logoutMessage) {
      toast.success(location.state.logoutMessage);
      navigate(location.pathname, { replace: true });
    }
    if (location.state?.redirectMessage) {
      toast.error(location.state.redirectMessage);
      navigate(location.pathname, { replace: true });
    }
    if (location.state?.loggedOut) {
      toast.success("Logged out successfully!");
    }
  }, [location.state, navigate, location.pathname]);

  // Handle login process
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('https://faiz.dotcombusiness.in/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile, password }),
    });

    if (response.ok) {
      const data = await response.json();
      Cookies.set('token', data.data.token, { expires: 1 });
      Cookies.set('mobile', mobile, { expires: 1 }); // Set mobile number in cookies
      setUserName(data.data.name);
      navigate('/dashboard', { state: { loginMessage: 'Welcome back!', mobileNumber: mobile } });
    } else {
      setError('Invalid login credentials');
      toast.error('Invalid login credentials');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('/src/assets/bg.png')`,
      }}
    >
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/src/assets/fmbLogo.png"
            alt="Logo"
            className="h-20 w-50 mb-4"
          />
        </div>
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 text-center">
          Login
        </h2>
        <form className="my-8" onSubmit={handleLogin}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              placeholder="+911234567890"
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </LabelInputContainer>

          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              className="form-checkbox h-4 w-4 text-black dark:text-zinc-900"
            />
            <Label htmlFor="rememberMe">Remember me</Label>
          </div>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Login &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <Link to="/forgot-password">
              <button
                className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                type="button"
              >
                <IconPasswordUser className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Forgot Password
                </span>
                <BottomGradient />
              </button>
            </Link>
            <Link to="/sign-up">
              <button
                className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                type="button"
              >
                <IconLogin className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Sign Up
                </span>
                <BottomGradient />
              </button>
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
