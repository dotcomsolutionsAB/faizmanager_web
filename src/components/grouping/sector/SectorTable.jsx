// import React, { useState, useEffect } from "react";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Typography,
//     Paper,
//     Box,
//     Button,
//     Snackbar,
//     Alert,
//     CssBaseline,
//     IconButton
// } from "@mui/material";
// import { yellow } from "../../../styles/ThemePrimitives";
// import EditIcon from "@mui/icons-material/Edit";
// import AppTheme from "../../../styles/AppTheme";
// import { useUser } from "../../../UserContext";

// const SectorTable = () => {
//     const { token } = useUser();
//     const [sectorData, setSectorData] = useState([]);
//     const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//     const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

//     const fetchSectorData = async () => {
//         try {
//             const response = await fetch("https://api.fmb52.com/api/sector", {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error(`Error ${response.status}: ${response.statusText}`);
//             }

//             const data = await response.json();
//             setSectorData(data.data || []);
//         } catch (error) {
//             console.error("Error fetching sector data:", error);
//             setSnackbar({
//                 open: true,
//                 message: "Failed to fetch sector data.",
//                 severity: "error",
//             });
//         }
//     };

//     useEffect(() => {
//         fetchSectorData();
//     }, []);

//     const extractDetails = (notes) => {
//         const details = {
//             secretary: "",
//             mobile: "",
//             email: "",
//         };

//         const matches = notes.match(/Secretary: (.*?), Mobile: (.*?), Email: (.*)/);
//         if (matches) {
//             details.secretary = matches[1] || "";
//             details.mobile = matches[2] || "";
//             details.email = matches[3] || "";
//         }
//         return details;
//     };

//     return (
//         <AppTheme>
//             <CssBaseline />
// <Box
//     sx={{
//         mt: 2,
//         pt: 2,
//         pb: 3,
//         pl: 3,
//         pr: 3,
//         mr: 2,
//         ml: 2,
//         mb: 3,
//         backgroundColor: "#fff",
//         border: "1px solid #F4EBD0",
//         borderRadius: 2,
//         boxShadow: 1,
//     }}
// >
// <Typography
//     variant="h6"
//     sx={{
//         fontWeight: "bold",
//         marginBottom: 1,
//         padding: "8px 16px",
//         borderRadius: 1,
//     }}
// >
//     Sector Details Table
// </Typography>
//                 <TableContainer component={Paper} sx={{ border: `1px solid ${yellow[300]}` }}>
//                     <Table sx={{ minWidth: 650 }} aria-label="sector table">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>SN</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Sector Name</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Secretary</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Mobile</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Email</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Actions</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {sectorData.map((sector, index) => {
//                                 const details = extractDetails(sector.notes || "");
//                                 return (
//                                     <TableRow key={sector.id}>
//                                         <TableCell>{index + 1}</TableCell>
//                                         <TableCell>{sector.name}</TableCell>
//                                         <TableCell>{details.secretary || "N/A"}</TableCell>
//                                         <TableCell>{details.mobile || "N/A"}</TableCell>
//                                         <TableCell>{details.email || "N/A"}</TableCell>
//                                         <TableCell>
//                                             <Button
//                                                 variant="contained"
//                                                 color="primary"
//                                                 sx={{
//                                                     backgroundColor: yellow[400],
//                                                     "&:hover": {
//                                                         backgroundColor: yellow[100],
//                                                         color: "#000",
//                                                     },
//                                                 }}
//                                             >
//                                                 Actions
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 );
//                             })}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//                 <Snackbar
//                     open={snackbar.open}
//                     autoHideDuration={6000}
//                     onClose={handleSnackbarClose}
//                     anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//                 >
//                     <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
//                         {snackbar.message}
//                     </Alert>
//                 </Snackbar>
//             </Box>
//         </AppTheme>
//     );
// };

// export default SectorTable;


import React, { useEffect, useState } from "react";
import {
    Typography,
    Box,
    Button,
    CssBaseline,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { yellow, brown } from "../../../styles/ThemePrimitives";
import AppTheme from "../../../styles/AppTheme";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../../../UserContext";
import divider from '../../../assets/divider.png';

const SectorTable = () => {
    const { token } = useUser();
    const [sectors, setSectors] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedSector, setSelectedSector] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedSector(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleActionsClick = (event, sector) => {
        setSelectedSector(sector);
        setAnchorEl(event.currentTarget);
    };

    const fetchSectors = async () => {
        try {
            const response = await fetch("https://api.fmb52.com/api/sector", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const data = await response.json();
            console.log("Raw API Response:", data.data);

            // Transform sector data
            const transformedSectors = data.data.map((sector) => ({
                id: sector.id, // Use `id` for unique rows
                name: sector.name || "N/A", // Sector name
                secretary: sector.notes?.split(",")[0]?.split(":")[1]?.trim() || "N/A", // Extract secretary from notes
                mobile: sector.notes?.match(/Mobile:\s*(\d+)/)?.[1] || "N/A", // Extract mobile from notes
                email: sector.notes?.match(/Email:\s*([\w.-]+@[\w.-]+)/)?.[1] || "N/A", // Extract email from notes
            }));

            console.log("Transformed Sector Data:", transformedSectors);
            setSectors(transformedSectors);
        } catch (error) {
            console.error("Error fetching sectors:", error);
            setSnackbar({
                open: true,
                message: "Failed to fetch sector data.",
                severity: "error",
            });
        }
    };

    const handleEditSector = (sector) => {
        console.log("Edit sector:", sector);
        setSelectedSector(sector);
        setDialogOpen(true);
    };

    const handleDeleteSector = (sector) => {
        console.log("Delete sector:", sector);
        setSnackbar({
            open: true,
            message: `Deleted sector: ${sector.name}`,
            severity: "success",
        });
    };

    const columns = [
        {
            field: "name",
            headerName: "Sector Name",
            flex: 1,
            renderCell: (params) => (
                <span style={{ fontWeight: "bold", color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "secretary",
            headerName: "Secretary",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "mobile",
            headerName: "Mobile",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700], display: 'flex', alignItems: 'center' }}>{params.value}</span>
            ),
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    size="small"
                    onClick={(event) => handleActionsClick(event, params.row)}
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
            ),
        },
    ];

    useEffect(() => {
        fetchSectors();
    }, []);

    return (
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
                    Sectors
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
                <Box
                    sx={{
                        width: "100%",
                        height: 500,
                    }}
                >
                    <DataGridPro
                        rows={sectors}
                        columns={columns}
                        getRowId={(row) => row.id}
                        rowHeight={100}
                        checkboxSelection
                        pagination
                        pageSizeOptions={[5, 10, 25]}
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
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <MenuItem
                    onClick={() => {
                        console.log("Edit sector:", selectedSector);
                        setDialogOpen(true);
                        handleMenuClose();
                    }}
                >
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        console.log("Delete sector:", selectedSector);
                        setSnackbar({
                            open: true,
                            message: `Deleted sector: ${selectedSector?.name}`,
                            severity: "success",
                        });
                        handleMenuClose();
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>

            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Edit Sector
                    <IconButton onClick={handleDialogClose} sx={{ float: "right" }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Edit details for sector: {selectedSector?.name}</Typography>
                    {/* Add form fields for editing the sector */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => console.log("Save changes for:", selectedSector)} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </AppTheme>
    );
};

export default SectorTable;
