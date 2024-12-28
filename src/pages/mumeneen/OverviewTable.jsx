import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, IconButton,  Paper,
  CssBaseline, Chip, Stack, Divider } from '@mui/material';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { useUser } from '../../UserContext'; // Assuming useUser is in the correct path
import { jsPDF } from 'jspdf';
import PrintIcon from '@mui/icons-material/Print'; // Importing Material UI Print Icon
import { yellow, brown } from '../../styles/ThemePrimitives';
import AppTheme from '../../styles/AppTheme';


const OverviewTable = ({ familyId }) => {
  const [receiptsData, setReceiptsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser(); // Get user data, including the Bearer token from UserContext
  // const [paginationModel, setPaginationModel] = useState({
  //   page: 0,
  //   pageSize: 10,
  // });

  const ReceiptCard = ({ receipt }) => {
    return (
      <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        p: 2,
        mb: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h6">{receipt.receipt_no}</Typography>
        <Divider />
        {/* Removed the Chip components */}
        <Stack direction="row" spacing={1} justifyContent="space-between" flexWrap="wrap">
  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
    <Typography variant="body2" color="textSecondary">
      Name: {receipt.name || 'N/A'} | 
    </Typography>
    <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
      ITS: {receipt.its || 'N/A'}
    </Typography>
  </Box>

  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
  <Typography variant="body2" color="textSecondary">
      Sector: {receipt.sector || 'N/A'} - {receipt.sub_sector || 'N/A'} |
    </Typography>
    <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
      Folio: {receipt.folio_no || 'N/A'}
    </Typography>
  </Box>
</Stack>
        <Divider />
        <Stack direction="row" spacing={1} flexWrap="wrap">
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4caf50" }}>
            ₹{receipt.amount || 'N/A'}
          </Typography>
        </Stack>
        <Divider />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 1 }}>
  <Stack direction="row" spacing={2} flexWrap="wrap">
    {/* Mode and Details Section */}
    <Typography variant="body2" color="textSecondary">
      Mode: {receipt.mode || '--'}
    </Typography>

    {receipt.mode === 'cheque' && (
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
          Bank Name: {receipt.bank_name || '--'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Cheque Date: {receipt.cheque_date || '--'}
        </Typography>
      </Box>
    )}

    {(receipt.mode === 'online' || receipt.mode === 'neft') && (
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
          Transaction ID: {receipt.transaction_id || '--'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Transaction Date: {receipt.transaction_date || '--'}
        </Typography>
      </Box>
    )}

    {receipt.mode === 'cash' && (
      <Typography variant="body2" color="textSecondary">
       Details: --
      </Typography>
    )}
  </Stack>

  {/* Print Icon Section */}
  <IconButton color="primary" onClick={() => handlePrint(receipt)}>
    <PrintIcon />
  </IconButton>
</Box>

      </Stack>
    </Box>
    );
  };

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth <= 900) {
  //       // For medium screens, set pageSize to 5
  //       setPaginationModel((prev) => ({ ...prev, pageSize: 5 }));
  //     } else {
  //       // For larger screens, set pageSize to 10
  //       setPaginationModel((prev) => ({ ...prev, pageSize: 10 }));
  //     }
  //   };
  
  //   handleResize(); // Set initial page size on mount
  //   window.addEventListener('resize', handleResize); // Listen to window resize
  
  //   return () => {
  //     window.removeEventListener('resize', handleResize); // Cleanup on unmount
  //   };
  // }, []); // Only run once on mount

  useEffect(() => {
    if (!user.token || !familyId) return;

    const fetchReceiptsData = async () => {
      try {
        const response = await fetch(`https://api.fmb52.com/api/receipts/by_family_ids`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ family_ids: [familyId] }),
        });

        if (!response.ok) {
          throw new Error(`Error fetching receipts: ${response.statusText}`);
        }

        const data = await response.json();
        setReceiptsData(data.data || []); // Assuming the API response contains a "data" field for receipts
        setLoading(false);
      } catch (error) {
        setError('The data is currently unavailable, but we are working to resolve this. Thank you for your patience!');
        setLoading(false);
      }
    };

    fetchReceiptsData();
  }, [familyId, user.token]);

  // Function to generate and open the PDF
  const handlePrint = (row) => {
    const doc = new jsPDF();
    const { name, its, sector, folio_no, mode, receipt_no, date, comments, amount } = row;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(16);

    // Title (Centered)
    doc.text('Receipt Details', 105, 20, null, null, 'center');
    
    // Adding a line after the title for styling
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    // Add receipt information with styling
    doc.setFontSize(12);
    doc.text(`Receipt No: ${receipt_no || 'N/A'}`, 14, 35);
    doc.text(`Date: ${date || 'N/A'}`, 14, 45);
    doc.text(`Mode: ${mode || 'N/A'}`, 14, 55);

    // Add information in a structured format (like a table)
    const info = [
      { label: 'Name', value: name || 'N/A' },
      { label: 'ITS', value: its || 'N/A' },
      { label: 'Sector', value: sector || 'N/A' },
      { label: 'Folio No', value: folio_no || 'N/A' },
      { label: 'Comments', value: comments || 'N/A' },
      { label: 'Amount', value: `₹${amount || 'N/A'}` },
    ];

    let yPosition = 70; // Starting Y position for content

    info.forEach((item) => {
      doc.setFont('Helvetica', 'bold');
      doc.text(`${item.label}:`, 14, yPosition);
      doc.setFont('Helvetica', 'normal');
      doc.text(item.value, 60, yPosition);
      yPosition += 10; // Spacing between rows
    });

    // Open the generated PDF in a new tab
    // doc.save(`receipt_${receipt_no || 'N/A'}.pdf`);

     // Convert the PDF to a data URL
  const pdfDataUri = doc.output('datauristring'); // This creates a Data URI for the PDF

  // Open the PDF in a new tab
  const newTab = window.open();
  if (newTab) {
    newTab.document.write('<html><head><title>Receipt</title></head><body><embed width="100%" height="100%" src="' + pdfDataUri + '" type="application/pdf"></embed></body></html>');
  }
  };


  // const columns = [
  //   {
  //     field: 'Name',
  //     headerName: 'Details',
  //     flex: 2, // Dynamically adjust the width
  //     minWidth: 120, 
  //     renderCell: (params) => {
  //       const name = params.row.name || 'N/A';
  //       const its = params.row.its || 'N/A';
  //       const sector = params.row.sector || 'N/A';
  //       const folioNo = params.row.folio_no || 'N/A';

  //       return (
  //         <Box sx={{ lineHeight: '1.5', wordWrap: 'break-word', paddingTop: 2 }}>
  //         <Typography variant="body2">
  //           <span style={{ color: yellow[300] }}><strong>Name: </strong></span>
  //           <span style={{ color: brown[700] }}>{name}</span>
  //         </Typography>
  //         <Typography variant="body2">
  //           <span style={{ color: yellow[300] }}><strong>ITS: </strong></span>
  //           <span style={{ color: brown[700] }}>{its}</span>
  //         </Typography>
  //         <Typography variant="body2">
  //           <span style={{ color: yellow[300]}}><strong>Sector: </strong></span>
  //           <span style={{ color: brown[700] }}>{sector}</span>
  //         </Typography>
  //         <Typography variant="body2">
  //           <span style={{ color:  yellow[300] }}><strong>Folio No: </strong></span>
  //           <span style={{ color: brown[700] }}>{folioNo}</span>
  //         </Typography>
  //       </Box>
        
  //       );
  //     },
  //   },
  //   {
  //     field: 'Mode',
  //     headerName: 'Receipt Info',
  //     flex: 1, // Dynamically adjust the width
  //     minWidth: 200,
  //     renderCell: (params) => {
  //       const mode = params.row.mode || 'N/A';
  //       const receiptNo = params.row.receipt_no || 'N/A';
  //       const date = params.row.date || 'N/A';
  //       const year = new Date(date).getFullYear() || 'N/A';
  //       const comments = params.row.comments || 'N/A';

  //       return (
  //         <Box sx={{ lineHeight: '1.5', wordWrap: 'break-word', paddingTop: 0.5 }}>
  //           <Typography variant="body2"><span style={{ color: yellow[300] }}><strong>Mode: </strong></span>
  //           <span style={{ color: brown[700] }}>{mode}</span></Typography>
  //           <Typography variant="body2"><span style={{ color: yellow[300] }}><strong>Receipt No: </strong></span>
  //           <span style={{ color: brown[700] }}>{receiptNo}</span></Typography>
  //           <Typography variant="body2"><span style={{ color: yellow[300] }}><strong>Date: </strong></span>
  //           <span style={{ color: brown[700] }}>{date}</span></Typography>
  //           <Typography variant="body2"><span style={{ color: yellow[300] }}><strong>Year: </strong></span>
  //           <span style={{ color: brown[700] }}>{year}</span></Typography>
  //           <Typography variant="body2"><span style={{ color: yellow[300] }}><strong>Comments: </strong></span>
  //           <span style={{ color: brown[700] }}>{comments}</span></Typography>
  //         </Box>
  //       );
  //     },
  //   },
  //   {
  //     field: 'amount',
  //     headerName: 'Amount',
  //     flex: 1, // Dynamically adjust the width
  //     minWidth: 50,
  //     renderCell: (params) => {
  //       return (
  //         <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
  //       <Typography variant="body2" sx={{ color: brown[700] }}>
  //         {params.value}
  //       </Typography>
  //     </Box>
  //       );
  //     },
  //   },
  //   {
  //     field: 'print',
  //     headerName: 'Print',
  //     width: 60,
  //     renderCell: (params) => {
  //       return (
  //         <Box 
  //         sx={{
  //           display: 'flex', 
  //           // justifyContent: 'center', 
  //           alignItems: 'center', 
  //           height: '100%'
  //         }}
  //       >
  //         <IconButton onClick={() => handlePrint(params.row)} sx={{ color: brown[700] }}>
  //           <PrintIcon />
  //         </IconButton>
  //       </Box>
  //       );
  //     },
  //   },
  // ];

  // Loading and error states
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <AppTheme>
        <CssBaseline />
        <Paper
      sx={{
        // p: 4,
        borderRadius: '8px',
        // boxShadow: 3,
        backgroundColor: '#F7F4F1',
        // maxWidth: '800px',
        // margin: '20px auto',
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
          <Box sx={{ p: 4 }}>
      {receiptsData.map((receipt, index) => (
        <ReceiptCard key={index} receipt={receipt} />
      ))}
    </Box>
   {/* <DataGridPro
        rows={receiptsData}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        pageSize={5}
        rowsPerPageOptions={[5]}
        rowHeight={110} 
        disableSelectionOnClick
        checkboxSelection
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        getRowId={(row) => row.receipt_no} // Use receipt_no as the unique identifier
        sx={{
          '& .MuiDataGrid-columnHeaders': {
     color: yellow[400], // Optional: Set text color to black for better contrast
     '&:hover': {
       backgroundColor: yellow[300], // Set hover color for headers
     },
   },
   '& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within': {
     outline: 'none', // Remove focus outline for headers
   },
   '& .MuiDataGrid-columnHeaderTitle': {
     fontWeight: 'bold', // Optional: Make the header titles bold
   },
   '& .MuiDataGrid-cell': {
     '&:hover': {
       backgroundColor: yellow[200], // Set hover color for cells
     },
   },
   '& .MuiDataGrid-row:hover': {
     backgroundColor: yellow[100], // Entire row hover background color
   },
           '@media (max-width: 600px)': {
             '& .MuiDataGrid-columnHeaders': {
               fontSize: '0.75rem', // Reduce font size on smaller screens
             },
             '& .MuiDataGrid-cell': {
               fontSize: '0.75rem', // Reduce font size for cells on smaller screens
             },
           },
         }}
      /> */}
      </Paper>
    </AppTheme>
  );
};

export default OverviewTable;
