"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";

export const FloatingNavbar = ({ navItems, className, userName }) => {
  const navigate = useNavigate();
  
  // Get the first letter of the user's name
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : "U";

  // Handle logout and redirect to login page
  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/", { state: { loggedOut: true } }); // Passing state to login page
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: 0 }} // Start fully visible and stationary
        animate={{ y: 0, opacity: 1 }} // Stay stationary and visible
        transition={{ duration: 0.2 }}
        className={cn(
          "flex max-w-fit fixed top-1 right-1 border border-transparent dark:border-white/[0.2] rounded-sm dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {/* Display 'Hello, user' and the first letter of the user's name */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium dark:text-white text-neutral-600">
            Hello, {userName || "User"}
          </span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700">
            <span className="text-lg font-bold dark:text-white text-neutral-600">
              {firstLetter}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        {navItems.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            to={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            <span className="hidden sm:block">{navItem.icon}</span>
          </Link>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full"
        >
          <span>Log Out</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
