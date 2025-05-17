// import React from 'react';
// import { Box, CssBaseline, Typography } from '@mui/material';
// import underConstruction from '../../assets/underConstruction.svg'; // Replace with your actual image path
// import AppTheme from '../../styles/AppTheme';
// import { useEffect } from 'react';

// export default function Expenses() {
//       // Set the document title
//       useEffect(() => {
//         document.title = "Expenses - FMB 52"; // Set the title for the browser tab
//       }, []);

//   return (
//     <AppTheme>
//         <CssBaseline />
//         <Box sx={{ width: "100%", mt: 1, pt: 2, pr: 3, pb: 3 , pl: 3}}>
//         <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100vh',
//         textAlign: 'center',
//         backgroundColor: '#f9f9f9',
//         padding: 2,
//       }}
//     >
//       {/* Image */}
//       <Box
//         component="img"
//         src={underConstruction}
//         alt="Under Construction"
//         sx={{
//           width: '200px',
//           marginBottom: 2,
//         }}
//       />

//       {/* Title */}
//       <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
//         We’re working hard to bring this page to life.
//       </Typography>

//       {/* Message */}
//       <Typography variant="body1" sx={{ color: '#555' }}>
//         Thank you for your patience as we build something amazing. <br />
//         Stay tuned!
//       </Typography>
//     </Box>
//         </Box>
//     </AppTheme>
//   );
// }


// // import React, { useState } from 'react';
// // import { Modal, Box, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// // function Expenses() {
// //   const [open, setOpen] = useState(false);
// //   const [selectedReceipt, setSelectedReceipt] = useState(null);

// //   // Example Data (this would typically come from an API or your data source)
// //   const data = [
// //     {
// //       receiptNo: 'FMB/K-12345',
// //       type: 'Cash',
// //       amount: '₹1,29,000.00',
// //       comments: 'Payment via Cash',
// //       user: 'Juzar',
// //       its: '101',
// //       sector: 'Sales',
// //     },
// //     {
// //       receiptNo: 'FMB/K-12346',
// //       type: 'Online',
// //       amount: '₹50,000.00',
// //       comments: 'Payment via Online Transfer',
// //       user: 'Ahmed',
// //       its: '102',
// //       sector: 'Marketing',
// //     },
// //     // More data...
// //   ];

// //   const handleOpen = (receipt) => {
// //     setSelectedReceipt(receipt);
// //     setOpen(true);
// //   };

// //   const handleClose = () => {
// //     setOpen(false);
// //     setSelectedReceipt(null);
// //   };

// //   const handleApprove = () => {
// //     alert('Payment Approved');
// //     handleClose();
// //   };

// //   const handleReject = () => {
// //     alert('Payment Rejected');
// //     handleClose();
// //   };

// //   return (
// //     <div>
// //       <Table sx={{backgroundColor: 'white'}}>
// //         <TableHead>
// //           <TableRow>
// //             <TableCell>Receipt No</TableCell>
// //             <TableCell>Type</TableCell>
// //             <TableCell>Amount</TableCell>
// //             <TableCell>Action</TableCell>
// //           </TableRow>
// //         </TableHead>
// //         <TableBody>
// //           {data.map((receipt) => (
// //             <TableRow key={receipt.receiptNo}>
// //               <TableCell>{receipt.receiptNo}</TableCell>
// //               <TableCell>{receipt.type}</TableCell>
// //               <TableCell>{receipt.amount}</TableCell>
// //               <TableCell>
// //                 <Button onClick={() => handleOpen(receipt)} variant="contained" color="primary">
// //                   View Details
// //                 </Button>
// //               </TableCell>
// //             </TableRow>
// //           ))}
// //         </TableBody>
// //       </Table>

// //       {/* Modal for Detailed Information */}
// //       <Modal
// //         open={open}
// //         onClose={handleClose}
// //         aria-labelledby="modal-modal-title"
// //         aria-describedby="modal-modal-description"
// //       >
// //         <Box sx={{
// //           position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
// //           width: 400, bgcolor: 'background.paper', borderRadius: 1, padding: 3, boxShadow: 24
// //         }}>
// //           {selectedReceipt && (
// //             <>
// //               <Typography id="modal-modal-title" variant="h6" component="h2">
// //                 Receipt Details
// //               </Typography>
// //               <Table>
// //                 <TableBody>
// //                   <TableRow>
// //                     <TableCell>Receipt No:</TableCell>
// //                     <TableCell>{selectedReceipt.receiptNo}</TableCell>
// //                   </TableRow>
// //                   <TableRow>
// //                     <TableCell>Type:</TableCell>
// //                     <TableCell>{selectedReceipt.type}</TableCell>
// //                   </TableRow>
// //                   <TableRow>
// //                     <TableCell>Amount:</TableCell>
// //                     <TableCell>{selectedReceipt.amount}</TableCell>
// //                   </TableRow>
// //                   <TableRow>
// //                     <TableCell>Comments:</TableCell>
// //                     <TableCell>{selectedReceipt.comments}</TableCell>
// //                   </TableRow>
// //                   <TableRow>
// //                     <TableCell>User:</TableCell>
// //                     <TableCell>{selectedReceipt.user}</TableCell>
// //                   </TableRow>
// //                   <TableRow>
// //                     <TableCell>ITS:</TableCell>
// //                     <TableCell>{selectedReceipt.its}</TableCell>
// //                   </TableRow>
// //                   <TableRow>
// //                     <TableCell>Sector:</TableCell>
// //                     <TableCell>{selectedReceipt.sector}</TableCell>
// //                   </TableRow>
// //                 </TableBody>
// //               </Table>
// //               <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
// //                 <Button variant="contained" color="success" onClick={handleApprove}>
// //                   Approve Payment
// //                 </Button>
// //                 <Button variant="outlined" color="error" onClick={handleReject}>
// //                   Reject Payment
// //                 </Button>
// //               </Box>
// //             </>
// //           )}
// //         </Box>
// //       </Modal>
// //     </div>
// //   );
// // }

// // export default Expenses;

// import { useUser } from "../../UserContext";
// import { useState, useEffect } from "react";
// import { Box, CircularProgress, Typography, IconButton,  Paper,
//     CssBaseline, Chip, Stack, Divider } from '@mui/material'

// export default function Receipts() {
//     const [allReceiptsData, setAllReceiptsData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { user } = useUser(); // Get user data, including the Bearer token from UserContext
//     useEffect(() => {
//         if (!user.token) return;

//         const fetchAllReceiptsData = async () => {
//           try {
//             const response = await fetch(`https://api.fmb52.com/api/receipts`, {
//               method: 'GET',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${user.token}`,
//               },
//             });

//             if (!response.ok) {
//               throw new Error(`Error fetching receipts: ${response.statusText}`);
//             }

//             const data = await response.json();
//             console.log(data);
//             setAllReceiptsData(data.data || []); // Assuming the API response contains a "data" field for receipts
//             setLoading(false);
//           } catch (error) {
//             setError(error.message);
//             setLoading(false);
//           }
//         };

//         fetchAllReceiptsData();
//       }, [user.token]);

//        if (loading) {
//     return <CircularProgress />;  // Show loading spinner while data is being fetched
//   }

//   if (error) {
//     return <Typography color="error">{`Error: ${error}`}</Typography>;  // Display error message if the fetch fails
//   }
//     return(
//         <h1>Receipts Page is under development</h1>
//     )
// }


// import { useUser } from "../../UserContext";
// import { useState, useEffect } from "react";
// import { Box, CircularProgress, Typography, Paper, CssBaseline } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import AppTheme from "../../styles/AppTheme";

// export default function Receipts() {
//   const [allReceiptsData, setAllReceiptsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useUser(); // Get user data, including the Bearer token from UserContext

//   useEffect(() => {
//     if (!user.token) return;

//     const fetchAllReceiptsData = async () => {
//       try {
//         const response = await fetch(`https://api.fmb52.com/api/receipts`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Error fetching receipts: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setAllReceiptsData(data.data || []); // Assuming the API response contains a "data" field for receipts
//         setLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchAllReceiptsData();
//   }, [user.token]);

//   if (loading) {
//     return <CircularProgress />; // Show loading spinner while data is being fetched
//   }

//   if (error) {
//     return <Typography color="error">{`Error: ${error}`}</Typography>; // Display error message if the fetch fails
//   }

//   // Define the columns for DataGrid
//   const columns = [
//     { field: "receipt_no", headerName: "Receipt No", width: 150 },
//     { field: "name", headerName: "Name", width: 250 },
//     { field: "sector", headerName: "Sector", width: 150 },
//     { field: "sub_sector", headerName: "Sub Sector", width: 150 },
//     { field: "amount", headerName: "Amount", width: 150 },
//     { field: "date", headerName: "Date", width: 150 },
//     { field: "status", headerName: "Status", width: 150 },
//   ];

//   // Map the receipt data to rows for the DataGrid
//   const rows = allReceiptsData.map((receipt, index) => ({
//     id: index,
//     receipt_no: receipt.receipt_no,
//     name: receipt.name,
//     sector: receipt.sector,
//     sub_sector: receipt.sub_sector,
//     amount: receipt.amount,
//     date: receipt.date,
//     status: receipt.status,
//   }));

//   return (
//     <AppTheme>
//         <CssBaseline />    
//         <Box sx={{ width: "100%", padding: 2 }}>
//       <Typography variant="h4" gutterBottom>
//         Receipts
//       </Typography>
//       <Paper sx={{ height: 400, width: "100%" }}>
//         <DataGrid rows={rows} columns={columns} pageSize={5} />
//       </Paper>
//     </Box>
//     </AppTheme>
//   );
// }


import { Box, CssBaseline } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import { useEffect } from "react";
import ExpensesForm from "../../components/accounts/expenses/ExpensesFrom";
import ExpensesTable from "../../components/accounts/expenses/ExpensesTable";
import PaymentsForm from "../../components/accounts/payments/PaymentsForm";
import PaymentsTable from "../../components/accounts/payments/PaymentsTable";


const Sector = () => {
      // Set the document title
      useEffect(() => {
        document.title = "Payments - FMB 52"; // Set the title for the browser tab
      }, []);
    
  return (
    <AppTheme>
      <CssBaseline />

      {/* Form Component */}
      <PaymentsForm/>

      {/* Table Component */}
      <PaymentsTable />
    </AppTheme>
  );
};

export default Sector;