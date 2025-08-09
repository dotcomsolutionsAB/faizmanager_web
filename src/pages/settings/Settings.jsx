// import React from 'react';
// import { Box, CssBaseline, Typography } from '@mui/material';
// import underConstruction from '../../assets/underConstruction.svg'; // Replace with your actual image path
// import AppTheme from '../../styles/AppTheme';

// export default function Settings() {
//   return (
//     <AppTheme>
//         <CssBaseline />
//         <Box sx={{ width: "100%", pt: 11, pr: 3, pb: 3 , pl: 3}}>
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


import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CssBaseline,
} from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import divider from '../../assets/divider.png';
import * as XLSX from "xlsx";
import { yellow, brown } from "../../styles/ThemePrimitives";
import { useState } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useUser } from "../../contexts/UserContext";
import { CircularProgress, Alert, Snackbar } from '@mui/material';
const SettingsPage = () => {
  const {token} = useUser();
  const [uploadedData, setUploadedData] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileObject, setFileObject] = useState(null); // Store the file object for the API call
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false); // Loader state
  const tableHeaders = [
    "ITS ID",
    "HOF FM TYPE",
    "HOF ID",
    "FAMILY ID",
    "FULL NAME",
    "FULL NAME ARABIC",
    "FIRST PREFIX",
    "AGE",
    "GENDER",
    "MOBILE",
    "EMAIL",
    "WHATSAPP NO.",
    "ADDRESS",
    "SECTOR",
    "SUB SECTOR"
  ];

  const normalizeHeader = (header) => header.replace(/[^a-z0-9]/gi, "").toLowerCase();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file.name);
    setFileObject(file); // Save the file object for the API call

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (parsedData.length > 0) {
        const fileHeaders = parsedData[0].map((header) => normalizeHeader(header || ""));

        const headerMapping = {};
        tableHeaders.forEach((header) => {
          const normalizedHeader = normalizeHeader(header);
          const index = fileHeaders.indexOf(normalizedHeader);
          if (index !== -1) {
            headerMapping[header] = index;
          }
        });

        const filteredData = parsedData.slice(1).map((row) =>
          tableHeaders.map((header) =>
            headerMapping[header] !== undefined ? row[headerMapping[header]] || "N/A" : "N/A"
          )
        );

        setUploadedData(filteredData);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSimulateImport = () => {
    if (uploadedData.length > 1) {
      const preview = uploadedData.slice(0, 5);
      setPreviewData(preview);
    }
  };

  const handleImport = async () => {
    if (!fileObject) {
      setSnackbarMessage("Please select a file before importing.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    console.log("Import triggered")
    setLoading(true); 

    const formData = new FormData();
    formData.append("file", fileObject);

    try {
      const response = await fetch(`https://api.fmb52.com/api/its_upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include Bearer token
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSnackbarMessage(data.message || "Data imported successfully!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(data.message || "Failed to import data.");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("An error occurred while importing data. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false); 
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };



  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          mt: 16,
          pt: 2,
          pb: 3,
          pl: 3,
          pr: 3,
          mr: 2,
          ml: 2,
          mb: 1,
          backgroundColor: "#fff",
          border: "1px solid #F4EBD0",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: 1,
            padding: "8px 16px",
            borderRadius: 1,
          }}>
          Import Mumeneen
        </Typography>
        <Box
          sx={{
            width: "calc(100% + 48px)",
            position: "relative",
            height: {
              xs: 10,
              sm: 15,
              md: 15,
              lg: 15,
              xl: 15,
            },
            backgroundImage: `url(${divider})`,
            backgroundSize: "contain",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center",
            mb: 2,
            marginLeft: "-24px",
            marginRight: "-24px",
          }}
        />



        {/* Instructions */}
        <Paper
          elevation={3}
          sx={{
            padding: "16px",
            marginBottom: "20px",
            backgroundColor: yellow[50]
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1, color: yellow[400] }}>
            Steps to Import Mumeneen Data
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1, color: brown[700] }}>
            1. Log in to <strong>its52.org</strong> and go to <strong>"Mumineen Database"</strong>.
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1, color: brown[700] }}>
            2. Select and download the following columns:
          </Typography>
          <Typography variant="body2" sx={{ marginLeft: 2, marginBottom: 1, color: brown[700] }}>
            - ITS ID, HOF FM TYPE, HOF ID, Family ID, Full Name, Full Name Arabic, First Prefix, Age, Gender, Mobile, Email,
            WhatsApp No, Address, Sector, Sub Sector.
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1, color: brown[700] }}>
            3. New <strong>"Sector"</strong> and <strong>"Sub Sector"</strong> names will be auto-created on import.
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1, color: brown[700] }}>
            4. Preview the data before finalizing the import.
          </Typography>
        </Paper>

        {/* Table and File Upload */}
        <Box sx={{
          maxHeight: 300, // Set max height for vertical scrolling
          overflowX: "auto", // Horizontal scrolling
          overflowY: "auto", // Vertical scrolling
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
          mb: 3,
        }}>
          <Table
            sx={{
              marginBottom: "20px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
            }}
          >
            <TableHead>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontWeight: "bold",
                      position: "sticky",
                      top: 0,
                      backgroundColor: yellow[50], // Header background color
                      zIndex: 1,
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {previewData ? (
                previewData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableHeaders.length} align="center">
                    Sample data will be displayed here
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* File Upload Section */}
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            mb: 3,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ pr: 4 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", marginBottom: 1 }}
              >
                Choose CSV File
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "8px",
                }}
              >
                {/* Hidden File Input */}
                <input
                  type="file"
                  accept=".csv, .xlsx"
                  id="file-upload"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                {/* Custom Button with Icon */}
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    backgroundColor: brown[700],
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: brown[900],
                    },
                  }}
                  htmlFor="file-upload"
                  startIcon={<AttachFileIcon />} // Attach File Icon
                >
                  Browse File
                </Button>
                {/* Display Selected File Name or Placeholder */}
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: selectedFile ? "normal" : "italic",
                    color: selectedFile ? brown[700] : brown[500],
                  }}
                >
                  {selectedFile || "No file chosen"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>

              <Box display="flex" gap={2}>
              <Button
  variant={!loading ? "contained" : "outlined"}
  disabled={loading}
  onClick={handleImport}
  sx={{
    fontSize: '0.9rem',
    backgroundColor: loading ? yellow[100] : yellow[200], // Dim color when loading
    '&:hover': {
      backgroundColor: loading ? yellow[100] : yellow[200], // No hover effect when loading
      color: "#000",
    },
  }}
>
  {loading ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress
        size={20}
        sx={{ color: yellow[400], marginRight: 1 }}
      />
      Importing...
    </Box>
  ) : (
    'Import'
  )}
</Button>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleSimulateImport}
                >
                  Simulate Import
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
       {/* Snackbar */}
       <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
};

export default SettingsPage;
