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
//     CssBaseline,
//     Snackbar,
//     Alert,
// } from "@mui/material";
// import { yellow } from "../../../styles/ThemePrimitives";
// import AppTheme from "../../../styles/AppTheme";
// import { useUser } from "../../../UserContext";
// import divider from "../../../assets/divider.png";

// const RolesTable = () => {
//     const { token } = useUser();
//     const [roles, setRoles] = useState([]); // Store roles fetched from the API
//     const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//     const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

//     // Fetch roles from API
//     const fetchRoles = async () => {
//         try {
//             const response = await fetch("https://api.fmb52.com/api/roles/all", {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to fetch roles.");
//             }

//             const data = await response.json();
//             setRoles(data.roles || []);
//         } catch (error) {
//             console.error("Error fetching roles:", error);
//             setSnackbar({
//                 open: true,
//                 message: "Failed to fetch roles. Please try again later.",
//                 severity: "error",
//             });
//         }
//     };

//     useEffect(() => {
//         fetchRoles();
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
//                     Roles
//                 </Typography>
                // <Box
                //     sx={{
                //         width: "calc(100% + 48px)",
                //         position: "relative",
                //         height: {
                //             xs: 10,
                //             sm: 15,
                //             md: 15,
                //             lg: 15,
                //             xl: 15,
                //         },
                //         backgroundImage: `url(${divider})`,
                //         backgroundSize: "contain",
                //         backgroundRepeat: "repeat-x",
                //         backgroundPosition: "center",
                //         mb: 2,
                //         marginLeft: "-24px",
                //         marginRight: "-24px",
                //     }}
                // />
//                 <TableContainer component={Paper} sx={{ border: `1px solid ${yellow[300]}` }}>
//                     <Table sx={{ minWidth: 650 }} aria-label="roles table">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                                     Name of the Role
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                                     Remarks
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                                     Validity
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                                     Actions
//                                 </TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {roles.map((role) => (
//                                 <TableRow key={role.id}>
//                                     <TableCell>{role.name}</TableCell>
//                                     <TableCell>{role.remarks || "N/A"}</TableCell>
//                                     <TableCell>
//                                         {new Date(role.created_at).toLocaleDateString()} -{" "}
//                                         {new Date(role.updated_at).toLocaleDateString()}
//                                     </TableCell>
//                                     <TableCell>
//                                         <Button
//                                             variant="contained"
//                                             color="primary"
//                                             sx={{
//                                                 backgroundColor: yellow[400],
//                                                 "&:hover": {
//                                                     backgroundColor: yellow[100],
//                                                     color: "#000",
//                                                 },
//                                             }}
//                                             onClick={() => console.log(`Edit role: ${role.name}`)}
//                                         >
//                                             Edit
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Box>

//             {/* Snackbar for messages */}
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={handleSnackbarClose}
//                 anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//             >
//                 <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </AppTheme>
//     );
// };

// export default RolesTable;
import React, { useEffect, useState } from "react";
import {
    Typography,
    Box,
    Button,
    CssBaseline,
    Snackbar,
    Alert,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { yellow, brown } from "../../../styles/ThemePrimitives";
import AppTheme from "../../../styles/AppTheme";
import { useUser } from "../../../UserContext";
import divider from "../../../assets/divider.png";


const RolesTable = () => {
    const { token } = useUser();
    const [roles, setRoles] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    const fetchRoles = async () => {
        try {
            const response = await fetch("https://api.fmb52.com/api/roles/all", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch roles.");
            }

            const data = await response.json();

            console.log("Raw API Response:", data.roles); // Log raw API response
            data.roles.forEach((role, index) => console.log(`Role ${index}:`, role)); // Log each role

            // Transform roles to ensure consistency
            const transformedRoles = data.roles.map((role) => ({
                ...role,
                id: role.id, // Ensure `id` exists
                remarks: role.remarks || "N/A", // Provide fallback for missing remarks
                created_at: role.created_at || null, // Provide fallback for missing created_at
                updated_at: role.updated_at || null, // Provide fallback for missing updated_at
            }));

            console.log("Transformed Roles:", transformedRoles); // Log transformed roles
            setRoles(transformedRoles);
        } catch (error) {
            console.error("Error fetching roles:", error);
            setSnackbar({
                open: true,
                message: "Failed to fetch roles. Please try again later.",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        console.log("Final roles data passed to DataGridPro:", roles);
    }, [roles]);

    const columns = [
        {
            field: "name",
            headerName: "Name of the Role",
            flex: 1,
            headerClassName: "datagrid-header",
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "remarks",
            headerName: "Remarks",
            flex: 1,
            renderCell: (params) => {
                console.log("Row data for Remarks:", params?.row);
                return <span style={{ color: brown[700] }}>{params?.row?.remarks || "N/A"}</span>;
            },
            headerClassName: "datagrid-header",
        },
        {
            field: "validity",
            headerName: "Validity",
            flex: 1.5,
            renderCell: (params) => {
                console.log("Row data for Validity:", params?.row);
                if (!params?.row) return <span style={{ color: brown[700] }}>N/A</span>;
                const createdAt = params.row.created_at
                    ? new Date(params.row.created_at).toLocaleDateString()
                    : "N/A";
                const updatedAt = params.row.updated_at
                    ? new Date(params.row.updated_at).toLocaleDateString()
                    : "N/A";
                return (
                    <span style={{ color: brown[700] }}>
                        {`${createdAt} - ${updatedAt}`}
                    </span>
                );
            },
            headerClassName: "datagrid-header",
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: yellow[400],
                        "&:hover": {
                            backgroundColor: yellow[100],
                            color: "#000",
                        },
                    }}
                    onClick={() => console.log(`Edit role: ${params?.row?.name}`)}
                >
                    Edit
                </Button>
            ),
            headerClassName: "datagrid-header",
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
                    Roles
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
                <Box sx={{ height: 500, width: "100%" }}>
                    <DataGridPro
                        rows={roles}
                        columns={columns}
                        getRowId={(row) => row.id} // Ensure unique row identifier
                        rowHeight={100}
                        checkboxSelection
                        disableSelectionOnClick
                        pagination
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10, page: 0 },
                            },
                        }}
                        sx={{
                            "& .MuiDataGrid-cell": {
                                color: brown[700], // Apply brown color to all cells
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                color: yellow[400], // Apply brown color to header titles
                            },
                            '& .MuiDataGrid-cell': {
                                            '&:hover': {
                                              backgroundColor: yellow[200],
                                            },
                                          },
                                          '& .MuiDataGrid-row:hover': {
                                            backgroundColor: yellow[100],
                                          },
                        }}
                    />
                </Box>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AppTheme>
    );
};

export default RolesTable;



