// import React, { useEffect, useState } from "react";
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
//     CssBaseline
// } from "@mui/material";
// import { yellow } from "../../../styles/ThemePrimitives";
// import AppTheme from "../../../styles/AppTheme";
// import { useUser } from "../../../UserContext";

// const SubSectorTable = () => {
//     const {token} = useUser();
//     const [tableData, setTableData] = useState([]);
//     const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//     const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

//     const fetchTableData = async () => {
//         try {
//             const response = await fetch("https://api.fmb52.com/api/sub_sector", {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,

//                 },
//             });

//             if (!response.ok) {
//                 throw new Error(`Error ${response.status}: ${response.statusText}`);
//             }

//             const data = await response.json();
//             setTableData(data.data || []);
//         } catch (error) {
//             console.error("Error fetching table data:", error);
//             setSnackbar({
//                 open: true,
//                 message: "Failed to fetch table data.",
//                 severity: "error",
//             });
//         }
//     };

//     useEffect(() => {
//         fetchTableData();
//     }, []);

//     return (
//         <AppTheme>
//             <CssBaseline />
//             <Box
//                 sx={{
//                     mt: 2,
//                     pt: 2,
//                     pb: 3,
//                     pl: 3,
//                     pr: 3,
//                     mr: 2,
//                     ml: 2,
//                     mb: 3,
//                     backgroundColor: "#fff",
//                     border: "1px solid #F4EBD0",
//                     borderRadius: 2,
//                     boxShadow: 1,
//                 }}
//             >
//                 <Typography
//                     variant="h6"
//                     sx={{
//                         fontWeight: "bold",
//                         marginBottom: 1,
//                         padding: "8px 16px",
//                         borderRadius: 1,
//                     }}
//                 >
//                     Sub-Sector Details Table
//                 </Typography>
//                 <TableContainer component={Paper} sx={{ border: `1px solid ${yellow[300]}` }}>
//                     <Table sx={{ minWidth: 650 }} aria-label="subsector table">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>SN</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Sub-Sector</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Incharge</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Mobile</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Email</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Actions</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {tableData.map((row, index) => {
//                                 const { sector_name, sub_sector_name, notes } = row;
//                                 const inchargeMatch = notes.match(/Incharge: (.*?),/);
//                                 const mobileMatch = notes.match(/Mobile: (.*?),/);
//                                 const emailMatch = notes.match(/Email: (.*)/);

//                                 return (
//                                     <TableRow key={row.id}>
//                                         <TableCell>{index + 1}</TableCell>
//                                         <TableCell>{`${sector_name}-${sub_sector_name}`}</TableCell>
//                                         <TableCell>{inchargeMatch ? inchargeMatch[1] : "N/A"}</TableCell>
//                                         <TableCell>{mobileMatch ? mobileMatch[1] : "N/A"}</TableCell>
//                                         <TableCell>{emailMatch ? emailMatch[1].trim() : "N/A"}</TableCell>
//                                         <TableCell>
//                                             <Button
//                                                 variant="contained"
//                                                 size="small"
//                                                 color="primary"
//                                                 sx={{
//                                                     backgroundColor: yellow[400],
//                                                     '&:hover': {
//                                                         backgroundColor: yellow[100],
//                                                         color: '#000',
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

// export default SubSectorTable;


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

const SubSectorTable = () => {
    const { token } = useUser();
    const [subSectors, setSubSectors] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedSubSector, setSelectedSubSector] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedSubSector(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleActionsClick = (event, subSector) => {
        setSelectedSubSector(subSector);
        setAnchorEl(event.currentTarget);
    };

    const fetchSubSectors = async () => {
        try {
            const response = await fetch("https://api.fmb52.com/api/sub_sector", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const data = await response.json();
            console.log("Raw API Response:", data.data);

            // Transform sub-sector data
            const transformedSubSectors = data.data.map((subSector) => ({
                id: subSector.id, // Use `id` for unique rows
                subSectorName: subSector.sub_sector_name || "N/A", // Sub-Sector name
                sectorName: subSector.sector_name || "N/A", // Sector name
                incharge: subSector.notes?.split(",")[0]?.split(":")[1]?.trim() || "N/A", // Extract incharge from notes
                mobile: subSector.notes?.match(/Mobile:\s*(\d+)/)?.[1] || "N/A", // Extract mobile from notes
                email: subSector.notes?.match(/Email:\s*([\w.-]+@[\w.-]+)/)?.[1] || "N/A", // Extract email from notes
            }));

            console.log("Transformed Sub-Sector Data:", transformedSubSectors);
            setSubSectors(transformedSubSectors);
        } catch (error) {
            console.error("Error fetching sub-sector data:", error);
            setSnackbar({
                open: true,
                message: "Failed to fetch sub-sector data.",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        fetchSubSectors();
    }, []);

    const columns = [
        {
            field: "subSectorName",
            headerName: "Sub-Sector Name",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "sectorName",
            headerName: "Sector Name",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "incharge",
            headerName: "Incharge",
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
                <span style={{ color: brown[700] }}>{params.value}</span>
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
                    Sub-Sectors
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
                        rows={subSectors}
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
                        console.log("Edit sub-sector:", selectedSubSector);
                        setDialogOpen(true);
                        handleMenuClose();
                    }}
                >
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        console.log("Delete sub-sector:", selectedSubSector);
                        setSnackbar({
                            open: true,
                            message: `Deleted sub-sector: ${selectedSubSector?.subSectorName}`,
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
                    Edit Sub-Sector
                    <IconButton onClick={handleDialogClose} sx={{ float: "right" }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Edit details for sub-sector: {selectedSubSector?.subSectorName}
                    </Typography>
                    {/* Add form fields for editing the sub-sector */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => console.log("Save changes for:", selectedSubSector)} color="primary">
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

export default SubSectorTable;
