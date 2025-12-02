import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  Paper,
  CssBaseline,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import AppTheme from "../../styles/AppTheme";
import { useUser } from "../../contexts/UserContext";
import { yellow, brown } from "../../styles/ThemePrimitives";
import divider from '../../assets/divider.png';

const NiyazTable = () => {
  const { token } = useUser(); // Assuming token is fetched from UserContext
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const columns = [
    {
      field: "niyaz_id",
      headerName: "Niyaz ID",
      flex: 1,
      renderCell: (params) => (
<span style={{ color: brown[700] }}>{params.value}</span>
      ),
    },
    {
      field: "details",
      headerName: "Details",
      flex: 2,
      renderCell: (params) => {
        const { hof_name, menu, fateha, comments } = params.row;
        return (
          <Box sx={{pt: 1, pb: 1}}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {hof_name}
            </Typography>
            <Typography variant="body2" sx={{color: brown[700]}}>Menu: {menu}</Typography>
            <Typography variant="body2" sx={{color: brown[700]}}>
              Fateha: {fateha || "N/A"}
            </Typography>
            <Typography variant="body2" sx={{color: brown[700]}}>
              Comments: {comments || "N/A"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      flex: 1,
      renderCell: (params) => (
        <span style={{ color: brown[700] }}>          ₹{params.value.toLocaleString()}
</span>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
 <span style={{ color: brown[700] }}>{params.value}</span>
      ),
    },
    
  ];

  const fetchData = async () => {
    try {
      const response = await fetch("https://api.fmb52.com/api/view-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        const formattedRows = result.data.flatMap((item) =>
          item.records.map((record) => ({
            id: `${item.niyaz_id}-${record.family_id}`, // Unique ID for each row
            niyaz_id: item.niyaz_id,
            hof_name: record.hof_name,
            menu: record.menu,
            fateha: record.fateha,
            comments: record.comments,
            total_amount: record.total_amount,
            date: record.date,
          }))
        );
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    // <AppTheme>
    //   <CssBaseline />
    //   <Box
    //     sx={{
    //       mt: 2,
    //       pt: 2,
    //       pb: 3,
    //       pl: 3,
    //       pr: 3,
    //       mr: 2,
    //       ml: 2,
    //       mb: 3,
    //       backgroundColor: "#fff",
    //       border: "1px solid #F4EBD0",
    //       borderRadius: 2,
    //       boxShadow: 1,
    //     }}
    //   >
    //     <Paper
    //       sx={{
    //         width: "100%",
    //         boxShadow: 1,
    //         overflowX: "auto",
    //         p: 1,
    //         "@media (max-width: 600px)": {
    //           p: 1,
    //         },
    //       }}
    //     >
    //       <Typography
    //         variant="h6"
    //         sx={{
    //           fontWeight: "bold",
    //           marginBottom: 1,
    //           padding: "8px 16px",
    //           borderRadius: 1,
    //         }}
    //       >
    //         Niyaz
    //       </Typography>
    //        <Box
    //                                           sx={{
    //                                               width: "calc(100% + 48px)",
    //                                               position: "relative",
    //                                               height: {
    //                                                   xs: 10,
    //                                                   sm: 15,
    //                                                   md: 15,
    //                                                   lg: 15,
    //                                                   xl: 15,
    //                                               },
    //                                               backgroundImage: `url(${divider})`,
    //                                               backgroundSize: "contain",
    //                                               backgroundRepeat: "repeat-x",
    //                                               backgroundPosition: "center",
    //                                               mb: 2,
    //                                               marginLeft: "-48px",
    //                                               marginRight: "-48px",
    //                                           }}
    //                                       />
          // {loading ? (
          //   <Box
          //     sx={{
          //       display: "flex",
          //       justifyContent: "center",
          //       alignItems: "center",
          //       minHeight: "50vh",
          //     }}
          //   >
          //     <CircularProgress />
          //   </Box>
          // ) : error ? (
          //   <Typography color="error">{error}</Typography>
          // ) : (
          //   <Box sx={{ height: 500, width: "100%", }}>
          //     <DataGridPro
          //       rows={rows}
          //       columns={columns}
          //       disableSelectionOnClick
          //       checkboxSelection
          //       rowHeight={100}
          //       pagination
          //       pageSize={10}
          //       rowsPerPageOptions={[10, 25, 50]}
          //       componentsProps={{
          //         columnMenu: {
          //           backgroundColor: "#f5f5f5",
          //         },
          //       }}
          //       sx={{
                                           
          //                                  '& .MuiDataGrid-cell': {
          //                                      '&:hover': {
          //                                          backgroundColor: yellow[200],
          //                                      },
          //                                  },
          //                                  '& .MuiDataGrid-row:hover': {
          //                                      backgroundColor: yellow[100],
          //                                  },
          //                                  "& .MuiDataGrid-columnHeaderTitle": { color: yellow[400] },
          //                              }}
          //     />
          //   </Box>
          // )}
    //     </Paper>

    //     <Snackbar
    //       open={snackbarOpen}
    //       autoHideDuration={3000}
    //       onClose={handleCloseSnackbar}
    //       anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    //     >
    //       <Alert
    //         onClose={handleCloseSnackbar}
    //         severity={snackbarSeverity}
    //         sx={{ width: "100%" }}
    //       >
    //         {snackbarMessage}
    //       </Alert>
    //     </Snackbar>
    //   </Box>
    // </AppTheme>

    <AppTheme>
    <CssBaseline />
    <Box
        sx={{
            mt: 2,
            pt: 2,
            pb: 3,
            pl: 3,
            pr: 3,
            mr: 2,
            ml: 2,
            mb: 3,
            backgroundColor: "#fff",
            border: "1px solid #F4EBD0",
            borderRadius: 2,
            boxShadow: 1,
        }}
    >
        <Typography
            variant="h6"
            sx={{
                fontWeight: "bold",
                marginBottom: 1,
                padding: "8px 16px",
                borderRadius: 1,
            }}
        >
            Miqaat Niyaz
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
            <Box sx={{ height: 500, width: "100%", }}>
              <DataGridPro
                rows={rows}
                columns={columns}
                disableSelectionOnClick
                checkboxSelection
                rowHeight={100}
                pagination
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                componentsProps={{
                  columnMenu: {
                    backgroundColor: "#f5f5f5",
                  },
                }}
                sx={{
                                           
                                           '& .MuiDataGrid-cell': {
                                               '&:hover': {
                                                   backgroundColor: yellow[200],
                                               },
                                           },
                                           '& .MuiDataGrid-row:hover': {
                                               backgroundColor: yellow[100],
                                           },
                                           "& .MuiDataGrid-columnHeaderTitle": { color: yellow[400] },
                                       }}
              />
            </Box>
          )}
    </Box>


{/* 
    <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
    </Snackbar> */}
</AppTheme>
  );
};

export default NiyazTable;
