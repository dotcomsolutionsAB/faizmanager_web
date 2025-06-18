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
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Snackbar,
//     Alert,
//     CssBaseline,
//     Menu, MenuItem, Tooltip,
// } from "@mui/material";
// import { yellow , brown} from "../../../styles/ThemePrimitives";
// import { useUser } from "../../../UserContext";
// import divider from "../../../assets/divider.png";
// import CloseIcon from "@mui/icons-material/Close"; // Import the Close Icon
// import IconButton from "@mui/material/IconButton"; // Import IconButton for clickable close icon
// import AppTheme from "../../../styles/AppTheme";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// const UserAccessTable = () => {
//     const { token } = useUser();
//     const [tableData, setTableData] = useState([]);
//     const [userDetails, setUserDetails] = useState({});
//     const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);

//     const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

//     const handleDialogClose = () => {
//         setDialogOpen(false);
//         setSelectedUser(null);
//     };

//     const fetchTableData = async () => {
//         try {
//             const response = await fetch("https://api.fmb52.com/api/users/with-permissions", {
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
//             setTableData(data.data || []);
//             fetchUserDetails(data.data.map((user) => user.user_id));
//         } catch (error) {
//             console.error("Error fetching table data:", error);
//             setSnackbar({
//                 open: true,
//                 message: "Failed to fetch table data.",
//                 severity: "error",
//             });
//         }
//     };

//     const fetchUserDetails = async (userIds) => {
//         const userDetailsMap = {};
//         try {
//             const userDetailsPromises = userIds.map(async (id) => {
//                 const response = await fetch(`https://api.fmb52.com/api/user_details/${id}`, {
//                     method: "GET",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 if (!response.ok) {
//                     throw new Error(`Error ${response.status}: ${response.statusText}`);
//                 }

//                 const data = await response.json();
//                 userDetailsMap[id] = data.data[0];
//             });

//             await Promise.all(userDetailsPromises);
//             setUserDetails(userDetailsMap);
//         } catch (error) {
//             console.error("Error fetching user details:", error);
//             setSnackbar({
//                 open: true,
//                 message: "Failed to fetch user details.",
//                 severity: "error",
//             });
//         }
//     };

//     const groupPermissions = (permissions) => {
//         const grouped = {};
//         permissions.forEach((perm) => {
//             if (perm && typeof perm.permission_name === "string") {
//                 const [module, action] = perm.permission_name.split(".");
//                 if (!grouped[module]) grouped[module] = [];
//                 grouped[module].push(action.charAt(0).toUpperCase() + action.slice(1));
//             } else {
//                 console.warn("Invalid permission object:", perm);
//             }
//         });
//         return grouped;
//     };



// const formatName = (name) => {
//     return name
//         .split("_") // Split words by underscores
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
//         .join(" "); // Join the words with spaces
// };


//     const handleViewPermissions = (user) => {
//         setSelectedUser({
//             ...user,
//             groupedPermissions: groupPermissions(user.permissions),
//         });
//         setDialogOpen(true);
//     };



//     const ActionButtonWithOptions = ({ row, onEdit, onDelete }) => {
//         const [anchorEl, setAnchorEl] = useState(null);
//         const open = Boolean(anchorEl);

//         // Open the menu
//         const handleClick = (event) => {
//             setAnchorEl(event.currentTarget);
//         };

//         // Close the menu
//         const handleClose = () => {
//             setAnchorEl(null);
//         };

//         return (
//             <Box>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleClick}
//                     sx={{
//                         // fontSize: '0.9rem',
//                         backgroundColor: yellow[400], // Apply yellow theme color
//                         '&:hover': {
//                             backgroundColor: yellow[100], // Hover effect color
//                             color: '#000',
//                         },
//                     }}
//                 >
//                     Actions
//                 </Button>

//                 <Menu
//                     anchorEl={anchorEl}
//                     open={open}
//                     onClose={handleClose}
//                     anchorOrigin={{
//                         vertical: "bottom",
//                         horizontal: "left",
//                     }}
//                     transformOrigin={{
//                         vertical: "top",
//                         horizontal: "left",
//                     }}
//                 >
//                     {/* Edit Permissions Option */}
//                     <MenuItem
//                         onClick={() => {
//                             onEdit(row);
//                             handleClose();
//                         }}
//                     >
//                         <Tooltip title="Edit Permissions" placement="left">
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <EditIcon  sx={{ color: brown[200] }} />
//                                 Edit Permissions
//                             </Box>
//                         </Tooltip>
//                     </MenuItem>

//                     {/* Delete Permissions Option */}
//                     <MenuItem
//                         onClick={() => {
//                             onDelete(row);
//                             handleClose();
//                         }}
//                     >
//                         <Tooltip title="Delete Permissions" placement="left">
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <DeleteIcon  sx={{ color: brown[200] }} />
//                                 Delete Permissions
//                             </Box>
//                         </Tooltip>
//                     </MenuItem>
//                 </Menu>
//             </Box>
//         );
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
//                     User Permissions
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
//                     <Table sx={{ minWidth: 650 }} aria-label="user access table">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>ITS ID</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Name</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Email</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Mobile</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Permissions</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>Actions</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {tableData.map((row, index) => {
//                                 const userDetail = userDetails[row.user_id];
//                                 return (
//                                     <TableRow key={index}>
//                                         <TableCell>{userDetail?.its}</TableCell>
//                                         <TableCell>{userDetail?.name}</TableCell>
//                                         <TableCell>{userDetail?.email}</TableCell>
//                                         <TableCell>{userDetail?.mobile}</TableCell>
//                                         <TableCell>
//                                             <Button
//                                                 variant="contained"
//                                                 size="small"
//                                                 color="primary"
//                                                 onClick={() => handleViewPermissions(row)}
//                                                 sx={{
//                                                     // fontSize: '0.9rem',
//                                                     backgroundColor: yellow[400], // Apply yellow theme color
//                                                     '&:hover': {
//                                                         backgroundColor: yellow[100], // Hover effect color
//                                                         color: '#000',
//                                                     },
//                                                 }}
//                                             >
//                                                 View Permissions
//                                             </Button>
//                                         </TableCell>
//                                          <TableCell>
//                                             {/*<Button variant="contained" size="small" color="primary" sx={{
//                                                 fontSize: '0.9rem',
//                                                 backgroundColor: yellow[400], // Apply yellow theme color
//                                                 '&:hover': {
//                                                     backgroundColor: yellow[100], // Hover effect color
//                                                     color: '#000',
//                                                 },
//                                             }}>
//                                                 Actions
//                                             </Button> */}
//                                              <ActionButtonWithOptions
//                         row={row}
//                         onEdit={(selectedRow) => console.log("Edit Permissions for:", selectedRow)}
//                         onDelete={(selectedRow) => console.log("Delete Permissions for:", selectedRow)}
//                     />

//                                         </TableCell>
//                                     </TableRow>
//                                 );
//                             })}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//     <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
//         <DialogTitle sx={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             User Permissions
//             <IconButton
//                 aria-label="close"
//                 onClick={handleDialogClose}
//                 sx={{
//                     // borderRadius: "50%",
//                     padding: 1.5,
//                     minWidth: "auto",
//                     height: { xs: 35, sm: 40 },
//                     width: { xs: 35, sm: 40 },
//                     backgroundColor: "#ffffff", // Default background color
//                     border: "2px solid #774936", // Border color
//                     "&:hover": {
//                         backgroundColor: "#f7ebe3", // Hover background color
//                         border: "2px solid #774936", // Border color

//                     },
//                 }}
//             >
//                 <CloseIcon sx={{
//                     color: "#774936", // Icon color
//                     fontSize: { xs: 20, sm: 24 }, // Adjust icon size for different screen sizes
//                 }} />
//             </IconButton>
//         </DialogTitle>
//         <Box
//             sx={{
//                 width: "calc(100% + 24px)",
//                 position: "relative",
//                 height: {
//                     xs: 10,
//                     sm: 15,
//                     md: 15,
//                     lg: 15,
//                     xl: 15,
//                 },
//                 backgroundImage: `url(${divider})`,
//                 backgroundSize: "contain",
//                 backgroundRepeat: "repeat-x",
//                 backgroundPosition: "center",
//                 //   mb: 2,
//                 marginLeft: "-24px",
//                 marginRight: "-24px",
//             }}
//         />
//         <DialogContent>
//             {selectedUser && (
//                 <>
//                     <Typography variant="h6">{selectedUser.user_name}</Typography>
//                     {/* <Typography>Role: {selectedUser.user_role}</Typography> */}
//                     {/* <Typography variant="body1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
//     Permissions:
//   </Typography> */}
//                     <TableContainer
//                         component={Paper}
//                         sx={{
//                             border: `1px solid ${yellow[300]}`,
//                             boxShadow: 1,
//                             borderRadius: 2,
//                             overflow: "hidden",
//                             mt: 2,
//                         }}
//                     >
//                         <Table sx={{ minWidth: 650 }} size="small">
//                             <TableHead>
//                                 <TableRow sx={{ backgroundColor: yellow[300] }}>
//                                     <TableCell
//                                         sx={{
//                                             fontWeight: "bold",
//                                             color: "white",
//                                             // textAlign: "center",
//                                             fontSize: "1rem",
//                                         }}
//                                     >
//                                         Module
//                                     </TableCell>
//                                     <TableCell
//                                         sx={{
//                                             fontWeight: "bold",
//                                             color: "white",
//                                             // textAlign: "center",
//                                             fontSize: "1rem",
//                                         }}
//                                     >
//                                         Actions
//                                     </TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {Object.entries(selectedUser.groupedPermissions).map(([module, actions]) => (
//                                     <TableRow
//                                         key={module}
//                                         sx={{
//                                             "&:nth-of-type(odd)": {
//                                                 backgroundColor: "#f7f7f7",
//                                             },
//                                             "&:hover": {
//                                                 backgroundColor: "#f0f0f0",
//                                             },
//                                         }}
//                                     >
//                                         <TableCell
//                                             sx={{
//                                                 //   textAlign: "center",
//                                                 fontWeight: "500",
//                                                 fontSize: "0.9rem",
//                                                 color: "#333",
//                                             }}
//                                         >
//                                             {formatName(module)}
//                                         </TableCell>
//                                         <TableCell
//                                             sx={{
//                                                 textAlign: "center",
//                                                 fontSize: "0.9rem",
//                                                 color: "#555",
//                                             }}
//                                         >
//                                             <Box
//                                                 sx={{
//                                                     display: "flex",
//                                                     flexWrap: "wrap",
//                                                     gap: 1,
//                                                     // justifyContent: "center",
//                                                 }}
//                                             >
//                                                 {actions.map((action, index) => (
//                                                     <Typography
//                                                         key={index}
//                                                         sx={{
//                                                             backgroundColor: yellow[100],
//                                                             color: yellow[900],
//                                                             padding: "4px 8px",
//                                                             borderRadius: "4px",
//                                                             fontSize: "0.8rem",
//                                                         }}
//                                                     >
//                                                         {formatName(action)}
//                                                     </Typography>
//                                                 ))}
//                                             </Box>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>

//                 </>
//             )}
//         </DialogContent>
//         <DialogActions>
//             <Button onClick={handleDialogClose} color="primary" variant="outlined" sx={{ margin: 2 }}>
//                 Close
//             </Button>
//         </DialogActions>
//     </Dialog>

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

// export default UserAccessTable;


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
    TableCell,
    TableBody,
    TableContainer,
    TableRow,
    TableHead,
    Paper,
    Table,
     Menu, MenuItem
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { yellow, brown } from "../../../styles/ThemePrimitives";
import { useUser } from "../../../UserContext";
import divider from "../../../assets/divider.png";
import AppTheme from "../../../styles/AppTheme";
import CloseIcon from "@mui/icons-material/Close";
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';


const UserAccessTable = ({setEditUserData}) => {
    const { token } = useUser();
    const [tableData, setTableData] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedUser(null);
    };
    const handleActionClick = (action, row) => {
  if (action === "Edit Hub") {
    setEditUserData(row); // 🔥 Send row to the form for editing
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top to focus on form
  }
};


const fetchTableData = async () => {
    try {
        const response = await fetch("https://api.fmb52.com/api/users/with-permissions", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

        const data = await response.json();

        const transformedData = data.data.map((user) => ({
            id: user.user_id,
            its: user.its || "N/A",
            name: user.user_name || "N/A",
            email: user.user_email || "N/A",
            mobile: user.mobile || "N/A",
            role: user.user_role || "N/A",
            role_id: user.role_id || null,
            permissions: user.permissions || [],
            sector_names: user.sector_names || [],
            sub_sector_names: user.sub_sector_names || [],
        }));

        setTableData(transformedData);
    } catch (error) {
        console.error("Error fetching table data:", error);
        setSnackbar({
            open: true,
            message: "Failed to fetch table data.",
            severity: "error",
        });
    }
};


    const fetchUserDetails = async (userIds) => {
        const userDetailsMap = {};
        try {
            const userDetailsPromises = userIds.map(async (id) => {
                const response = await fetch(`https://api.fmb52.com/api/user_details/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
                const data = await response.json();
                userDetailsMap[id] = {
                    its: data.data[0]?.its || "N/A", // Extract ITS or set to "N/A"
                    mobile: data.data[0]?.mobile || "N/A", // Extract mobile or set to "N/A"
                }; // Extract ITS or set to "N/A"
            });

            await Promise.all(userDetailsPromises);
            console.log("Fetched User Details (ITS):", userDetailsMap); // Debugging
            return userDetailsMap;
        } catch (error) {
            console.error("Error fetching user details:", error);
            setSnackbar({
                open: true,
                message: "Failed to fetch user details.",
                severity: "error",
            });
            return {};
        }
    };


    const handleViewPermissions = (user) => {
        const groupedPermissions = groupPermissions(user.permissions);
        setSelectedUser({
            ...user,
            groupedPermissions,
        });
        setDialogOpen(true);
    };

    const groupPermissions = (permissions) => {
        const grouped = {};
        permissions.forEach((perm) => {
            const [module, action] = perm.permission_name.split(".");
            if (!grouped[module]) grouped[module] = [];
            grouped[module].push(action.charAt(0).toUpperCase() + action.slice(1));
        });
        return grouped;
    };

    const formatName = (name) => {
        return name
            .split("_") // Split words by underscores
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(" "); // Join the words with spaces
    };
  const ActionButtonWithOptions = ({ onActionClick, row }) => {
    const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the dropdown menu
    const open = Boolean(anchorEl);

    // Open the menu
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    // Close the menu
    const handleClose = () => {
      setAnchorEl(null);
    };




     const handleDeleteClick = () => {

        console.log("Delete")
      handleClose();
    };

    // Set the document title
    useEffect(() => {
      document.title = "User Access- FMB 52"; // Set the title for the browser tab
    }, []);

    return (
      <Box>
        {/* Actions Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          Actions
          {/* <MoreVertIcon /> */}

        </Button>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}

          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >



          {/* Edit Option */}
          <MenuItem onClick={() => { onActionClick("Edit Hub", row); handleClose(); }}>
            <Tooltip title="Edit" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <EditIcon sx={{ color: brown[200] }} />
                Edit
              </Box>
            </Tooltip>
          </MenuItem>

          {/* Delete Option */}
          <MenuItem onClick={handleDeleteClick}>
            <Tooltip title="Delete" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <DeleteIcon sx={{ color: brown[200] }} />
                Delete
              </Box>
            </Tooltip>
          </MenuItem>
        </Menu>
      </Box>
    );
  };
    const columns = [
        {
            field: "its",
            headerName: "ITS ID",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "name",
            headerName: "Name",
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
            field: "mobile",
            headerName: "Mobile",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "role",
            headerName: "Role",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "permissions",
            headerName: "Permissions",
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleViewPermissions(params.row)}
                    sx={{
                        backgroundColor: yellow[400],
                        "&:hover": {
                            backgroundColor: yellow[100],
                            color: "#000",
                        },
                    }}
                >
                    View Permissions
                </Button>
            ),
        },
         {
              field: 'action',
              headerName: 'Action',
              width: 170,
              sortable: true,
              renderCell: (params) => (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <ActionButtonWithOptions onActionClick={handleActionClick} row={params.row} />
                </Box>
              ),
            },
    ];

    useEffect(() => {
        fetchTableData();
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
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    User Permissions
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
                        rows={tableData || []} // Ensure rows is always an array
                        columns={columns}
                        getRowId={(row) => row.id} // Use transformed `id` for row ID
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

            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    User Permissions
                    <IconButton
                        aria-label="close"
                        onClick={handleDialogClose}
                        sx={{
                            // borderRadius: "50%",
                            padding: 1.5,
                            minWidth: "auto",
                            height: { xs: 35, sm: 40 },
                            width: { xs: 35, sm: 40 },
                            backgroundColor: "#ffffff", // Default background color
                            border: "2px solid #774936", // Border color
                            "&:hover": {
                                backgroundColor: "#f7ebe3", // Hover background color
                                border: "2px solid #774936", // Border color

                            },
                        }}
                    >
                        <CloseIcon sx={{
                            color: "#774936", // Icon color
                            fontSize: { xs: 20, sm: 24 }, // Adjust icon size for different screen sizes
                        }} />
                    </IconButton>
                </DialogTitle>
                <Box
                    sx={{
                        width: "calc(100% + 24px)",
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
                        //   mb: 2,
                        marginLeft: "-24px",
                        marginRight: "-24px",
                    }}
                />
                <DialogContent>
                    {selectedUser && (
                        <>
                            <Typography variant="h6">{selectedUser.user_name}</Typography>
                            {/* <Typography>Role: {selectedUser.user_role}</Typography> */}
                            {/* <Typography variant="body1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                Permissions:
              </Typography> */}
                            <TableContainer
                                component={Paper}
                                sx={{
                                    border: `1px solid ${yellow[300]}`,
                                    boxShadow: 1,
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    mt: 2,
                                }}
                            >
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: yellow[300] }}>
                                            <TableCell
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: "white",
                                                    // textAlign: "center",
                                                    fontSize: "1rem",
                                                }}
                                            >
                                                Module
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: "white",
                                                    // textAlign: "center",
                                                    fontSize: "1rem",
                                                }}
                                            >
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.entries(selectedUser.groupedPermissions).map(([module, actions]) => (
                                            <TableRow
                                                key={module}
                                                sx={{
                                                    "&:nth-of-type(odd)": {
                                                        backgroundColor: "#f7f7f7",
                                                    },
                                                    "&:hover": {
                                                        backgroundColor: "#f0f0f0",
                                                    },
                                                }}
                                            >
                                                <TableCell
                                                    sx={{
                                                        //   textAlign: "center",
                                                        fontWeight: "500",
                                                        fontSize: "0.9rem",
                                                        color: "#333",
                                                    }}
                                                >
                                                    {formatName(module)}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        textAlign: "center",
                                                        fontSize: "0.9rem",
                                                        color: "#555",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            gap: 1,
                                                            // justifyContent: "center",
                                                        }}
                                                    >
                                                        {actions.map((action, index) => (
                                                            <Typography
                                                                key={index}
                                                                sx={{
                                                                    backgroundColor: yellow[100],
                                                                    color: yellow[900],
                                                                    padding: "4px 8px",
                                                                    borderRadius: "4px",
                                                                    fontSize: "0.8rem",
                                                                }}
                                                            >
                                                                {formatName(action)}
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary" variant="outlined" sx={{ margin: 2 }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </AppTheme>
    );
};

export default UserAccessTable;






