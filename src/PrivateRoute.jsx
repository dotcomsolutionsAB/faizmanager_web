import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ children }) => {
    const token = Cookies.get('token'); // Check if the token exists in cookies

    return token ? children : <Navigate to="/" state={{ redirectMessage: 'Please log in to access the dashboard.' }} />;
};
// const PrivateRoute = ({ children }) => {
//     const token = Cookies.get('token');
//     if (!token) {
//         return <Navigate to="/" />;
//     }
//     return <>{children}</>;
// };


export default PrivateRoute;
