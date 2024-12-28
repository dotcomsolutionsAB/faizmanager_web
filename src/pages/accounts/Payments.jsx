// import React from 'react';
// import { Box, CssBaseline, Typography } from '@mui/material';
// import underConstruction from '../../assets/underConstruction.svg'; // Replace with your actual image path
// import AppTheme from '../../styles/AppTheme';

// export default function Payments() {
//   return (
//     <AppTheme>
//         <CssBaseline />
//         <Box sx={{ width: "100%",  mt: 11, pt: 9, pr: 3, pb: 3 , pl: 3}}>
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

// import React, { useState } from 'react';
// import { Tab, Tabs, Box, Button, Typography } from '@mui/material';

// function Payments() {
//   const [value, setValue] = useState(0);

//   const handleTabChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <Box sx={{ width: '100%', maxWidth: 800, margin: 'auto', border: 1, borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper', pt: 15 }}>
//       {/* Tab Header */}
//       <Tabs value={value} onChange={handleTabChange} aria-label="receipt tabs" variant="fullWidth">
//         <Tab label="Summary" />
//         <Tab label="Details" />
//         <Tab label="Actions" />
//       </Tabs>

//       {/* Tab Content */}
//       <TabPanel value={value} index={0}>
//         <Typography variant="h6">Receipt No: FMB/K-12345</Typography>
//         <Typography variant="body1">Type: Cash</Typography>
//         <Typography variant="body1">Amount: ₹1,29,000.00</Typography>
//       </TabPanel>
//       <TabPanel value={value} index={1}>
//         <Typography variant="body1"><strong>Comments:</strong> Payment via Cash.</Typography>
//         <Typography variant="body1"><strong>User:</strong> Juzar</Typography>
//         <Typography variant="body1"><strong>ITS:</strong> 101</Typography>
//         <Typography variant="body1"><strong>Sector:</strong> Sales</Typography>
//       </TabPanel>
//       <TabPanel value={value} index={2}>
//         <Button variant="contained" color="primary" onClick={() => alert('Payment Approved')}>
//           Approve Payment
//         </Button>
//         <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={() => alert('Payment Rejected')}>
//           Reject Payment
//         </Button>
//       </TabPanel>
//     </Box>
//   );
// }

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// }

// export default Payments;

import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function Payments() {

  const [open, setOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Example Data (this would typically come from an API or your data source)
  const data = [
    {
      receiptNo: 'FMB/K-12345',
      type: 'Cash',
      amount: '₹1,29,000.00',
      comments: 'Payment via Cash',
      user: 'Juzar',
      its: '101',
      sector: 'Sales',
    },
    {
      receiptNo: 'FMB/K-12346',
      type: 'Online',
      amount: '₹50,000.00',
      comments: 'Payment via Online Transfer',
      user: 'Ahmed',
      its: '102',
      sector: 'Marketing',
    },
    // More data...
  ];

  const handleOpen = (receipt) => {
    setSelectedReceipt(receipt);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReceipt(null);
  };

  const handleApprove = () => {
    alert('Payment Approved');
    handleClose();
  };

  const handleReject = () => {
    alert('Payment Rejected');
    handleClose();
  };

      // Set the document title
      useEffect(() => {
        document.title = "Payments - FMB 52"; // Set the title for the browser tab
      }, []);
    

  return (
    <div>
      <Table sx={{backgroundColor: 'white'}}>
        <TableHead>
          <TableRow>
            <TableCell>Receipt No</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((receipt) => (
            <TableRow key={receipt.receiptNo}>
              <TableCell>{receipt.receiptNo}</TableCell>
              <TableCell>{receipt.type}</TableCell>
              <TableCell>{receipt.amount}</TableCell>
              <TableCell>
                <Button onClick={() => handleOpen(receipt)} variant="contained" color="primary">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Detailed Information */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 400, bgcolor: 'background.paper', borderRadius: 1, padding: 3, boxShadow: 24
        }}>
          {selectedReceipt && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Receipt Details
              </Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Receipt No:</TableCell>
                    <TableCell>{selectedReceipt.receiptNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Type:</TableCell>
                    <TableCell>{selectedReceipt.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Amount:</TableCell>
                    <TableCell>{selectedReceipt.amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Comments:</TableCell>
                    <TableCell>{selectedReceipt.comments}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>User:</TableCell>
                    <TableCell>{selectedReceipt.user}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ITS:</TableCell>
                    <TableCell>{selectedReceipt.its}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sector:</TableCell>
                    <TableCell>{selectedReceipt.sector}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button variant="contained" color="success" onClick={handleApprove}>
                  Approve Payment
                </Button>
                <Button variant="outlined" color="error" onClick={handleReject}>
                  Reject Payment
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default Payments;

