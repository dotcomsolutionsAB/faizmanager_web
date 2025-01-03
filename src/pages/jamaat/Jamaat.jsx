import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  CssBaseline,
   Chip,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import AppTheme from "../../styles/AppTheme";
import { useUser } from "../../UserContext";
import { yellow } from "../../styles/ThemePrimitives";
import divider from '../../assets/divider.png';

const JamaatTable = () => {
    const {token} = useUser();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const columns = [
    { field: "name", headerName: "Jamaat Name", flex: 1 },
    { field: "mobile", headerName: "Mobile", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "validity", headerName: "Validity", flex: 1 },
    {
      field: "currency",
      headerName: "Currency",
      flex: 1,
      renderCell: () => "N/A", // Default value as no currency field in the response
    },
    {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => {
          const status = params.value || "Inactive";
          let chipColor;
  
          // Set chip color based on status
          switch (status) {
            case "trial":
              chipColor = "warning";
              break;
            case "active":
              chipColor = "success";
              break;
            default:
              chipColor = "error";
          }
  
          return (
            <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%"
          }}
        >
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            color={chipColor}
            variant="outlined"
            size="small"
            sx={{ textTransform: "capitalize" }}
          />
        </Box>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        sortable: false,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%"
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleActionsClick(params.row.id)}
               sx={{
                                      backgroundColor: yellow[400],
                                      "&:hover": {
                                          backgroundColor: yellow[100],
                                          color: "#000",
                                      },
                                  }}
            >
              Actions
            </Button>
          </Box>
        ),
      },
  ];

  const fetchData = async () => {
    try {
      const response = await fetch("https://api.fmb52.com/api/jamiat", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Replace with your token
        },
      });

      const result = await response.json();

      if (response.ok) {
        const formattedRows = result.data.map((item, index) => ({
          id: item.id,
          name: item.name || "N/A",
          mobile: item.mobile || "N/A",
          email: item.email || "N/A",
          validity: item.validity || "N/A",
          status: item.status || "Inactive",
        }));

        setRows(formattedRows);
      } else {
        setError(result.message || "Failed to fetch data.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleActionsClick = (id) => {
    setSnackbarMessage(`Action button clicked for Jamaat ID: ${id}`);
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppTheme>
        <CssBaseline />
 <Box sx={{ width: '100%', overflowX: 'auto', mt: 5, pt: 9, pr: 2, pb: 3, pl: 2 }}>
     <Paper
            sx={{
              width: '100%',
              boxShadow: 1,
              overflowX: 'auto',
              p: 1,
              '@media (max-width: 600px)': {
                p: 1,
              },
            }}
          >
        <Typography  variant="h6"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: 1,
                        padding: "8px 16px",
                        borderRadius: 1,
                    }}>
          Jamaat Management
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
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGridPro
              rows={rows}
              columns={columns}
              disableSelectionOnClick
              pagination
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              componentsProps={{
                columnMenu: {
                  backgroundColor: "#f5f5f5",
                },
              }}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                },
                "& .MuiDataGrid-cell": {
                  color: "#555",
                },
              }}
            />
          </Box>
        )}
                </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

      </Box>
    </AppTheme>
  );
};

export default JamaatTable;
