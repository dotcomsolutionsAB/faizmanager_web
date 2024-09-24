import React, { useEffect, useState } from 'react';
import Table from './Table';
import Cookies from 'js-cookie';

const TableComponent = ({ mobileNumber }) => {
    const [rowData, setRowData] = useState([]);
    // const mobileNumber = Cookies.get('mobile'); // Getting mobile number from cookies
  
    useEffect(() => {
      const fetchData = async () => {
        // if (!mobileNumber) {
        //   console.warn("Mobile number not available in cookies.");
        //   return; // Exit if mobile number is undefined
        // }
        const token = Cookies.get('token');
        if (!token) {
          console.warn("Token not available in cookies.");
          return; // Exit if token is undefined
        }
  
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
  
  
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };
  
        try {
          const response = await fetch('https://faiz.dotcombusiness.in/api/fetch_user', requestOptions);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setRowData(data.data); // Assuming 'data.data' contains the relevant user data
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  return (
    <div>
      <Table rowData={rowData} />
    </div>
  );
};

export default TableComponent;
