import React from 'react';
import { Header } from '../header/HeaderComponent';
import { SidebarDemo } from '../sidebar/SidebarComponent';
import { useLocation } from "react-router-dom";

const Layout = ({ children, userName }) => {
    const location = useLocation();

    // Exclude header and footer on login page
    const hideHeaderFooter = location.pathname === "/";

    return (
        <div className="min-h-screen flex flex-col">
            {!hideHeaderFooter && <Header userName={userName} />}
            <div className="flex flex-1">
                {/* Sidebar */}
                {!hideHeaderFooter && (
                    <div className="flex-shrink-0">
                        <SidebarDemo />
                    </div>
                )}

                {/* Main Content (Dashboard or any other page) */}
                <div className="flex-grow p-4">
                    {children}
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default Layout;
