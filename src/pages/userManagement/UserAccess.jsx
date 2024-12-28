// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   TextField,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableRow,
//   Paper,
//   InputAdornment,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   IconButton,
//   CssBaseline,
//   Chip,
//   ListSubheader,
//   Tooltip,
//   Button,
//   Snackbar,
//   Alert,
//   TableHead
// } from "@mui/material";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import AppTheme from "../../styles/AppTheme";
// import { yellow, brown } from "../../styles/ThemePrimitives";
// import divider from '../../assets/divider.png';
// import { useUser } from '../../UserContext';
// import CancelIcon from "@mui/icons-material/Cancel";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";


// export default function UserAccess() {
//   const { token } = useUser();
//   const [roles, setRoles] = useState(""); // Selected Role
//   const [roleList, setRoleList] = useState([]); // Roles fetched from API
//   const [modules, setModules] = useState([]); // Selected Modules (multiple)

//   const [selectedSectors, setSelectedSectors] = useState([]); // Array for multi-select
//   const [selectedSubSector, setSelectedSubSector] = useState([]); // Array for multi-select
//   const [sectorList, setSectorList] = useState([]); // For storing API data
//   const [subSectorList, setSubSectorList] = useState([]);
//   const [filteredSubSectors, setFilteredSubSectors] = useState([]);
//   const [itsId, setItsId] = useState("");
//   const [user, setUser] = useState(null); // Stores fetched user data
//   const [isValid, setIsValid] = useState(null); // Tracks whether ITS is valid
//   const [apiError, setApiError] = useState("");
//   const [permissionNameMap, setPermissionNameMap] = useState({});
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" }); // Snackbar state
//   const [tableData, setTableData] = useState([]);

//   const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });


//   const handleSectorChange = (event) => {
//     const { value } = event.target;
//     setSelectedSectors(typeof value === "string" ? value.split(",") : value);
//   };

//   const handleSubSectorChange = (event) => {
//     const { value } = event.target;
//     setSelectedSubSector(typeof value === "string" ? value.split(",") : value);
//   };

//   const handleDeleteSector = (event, sectorToDelete) => {
//     event.stopPropagation();
//     setSelectedSectors((prev) => prev.filter((sector) => sector !== sectorToDelete));
//   };

//   const handleDeleteSubSector = (event, subSectorToDelete) => {
//     event.stopPropagation();
//     setSelectedSubSector((prev) => prev.filter((subSector) => subSector !== subSectorToDelete));
//   };
//   // const handleSectorChange = (event) => setSector(event.target.value);


//   // const handleRoleChange = (event) => setRoles(event.target.value);
//   const handleModuleChange = (event) => {
//     const { value } = event.target;
//     setModules(typeof value === "string" ? value.split(",") : value);
//   };

//   // const handleSubSectorChange = (event) => setSelectedSubSector(event.target.value);
//   const [permissions, setPermissions] = useState([]); // Permissions for a Rol
//   const [rolePermissions, setRolePermissions] = useState([]);

//   const handleRoleChange = (event) => setRoles(event.target.value);
//   const [validityDate, setValidityDate] = useState(""); // Initially empty
//   const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
//   const inputRef = useRef(null); // Create a ref for the input element

//   const handleValidityChange = (event) => {
//     const selectedDate = event.target.value;
//     if (selectedDate >= today) {
//       setValidityDate(selectedDate);
//     } else {
//       alert("You cannot select a date in the past.");
//     }
//   };


//   const handleTextFieldClick = () => {
//     if (inputRef.current) {
//       inputRef.current.showPicker(); // Use the `showPicker()` method when the user clicks anywhere in the field
//     }
//   };

//   // const handleSubmit = async () => {
//   //   if (!user || !modules.length || !validityDate) {
//   //     alert("Please make sure all fields are filled before submitting.");
//   //     return;
//   //   }
//   // }

//   const handleSubmit = async () => {
//     if (!user || !modules.length || !validityDate || !selectedSectors.length || !selectedSubSector.length) {
//       setSnackbar({
//         open: true,
//         message: "Please make sure all fields are filled before submitting.",
//         severity: "warning",
//       });
//       return;
//     }

//     const body = {
//       user_id: user.id, // Get the ID from the stored user
//       permissions: modules.map((moduleName) => ({
//         name: moduleName, // Module name from dropdown
//         valid_from: today, // Current date
//         valid_to: validityDate, // Selected validity date
//       })),
//       sub_sector_ids: filteredSubSectors
//         .filter((subSector) => selectedSubSector.includes(subSector.sub_sector_name))
//         .map((subSector) => subSector.id), // Map selected sub-sectors to their IDs
//     };

//     console.log("body", body);

//     try {
//       const response = await fetch("https://api.fmb52.com/api/users/assign-permissions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`, // Include Bearer token in headers
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body), // Convert the request body to JSON
//       });

//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setSnackbar({
//         open: true,
//         message: "Permissions successfully assigned!",
//         severity: "success",
//       });
//       console.log("Response data:", data);
//     } catch (error) {
//       console.error("Error submitting permissions:", error);
//       setSnackbar({
//         open: true,
//         message: "There was an error submitting the permissions. Please try again.",
//         severity: "error",
//       });
//     }
//   };

//   // Hardcoded values for sector, subSector, and year
 
 
//   const year = "1445-1446";
//   const sector = ["all"];
//   const subSector = ["all"];

//   const fetchData = async () => {
//     try {
//       const sectorParams = sector.map((s) => `sector[]=${encodeURIComponent(s)}`).join("&");
//       const subSectorParams = subSector.map((s) => `sub_sector[]=${encodeURIComponent(s)}`).join("&");
  
//       const url = `https://api.fmb52.com/api/get_all_user?year=${year}&${sectorParams}&${subSectorParams}`;
  
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`, // Include Bearer token in headers
//           "Content-Type": "application/json",
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }
  
//       const data = await response.json();
//       const foundUser = data.data.find((user) => user.its === itsId); // Match user by ITS
//       if (foundUser) {
//         setUser(foundUser); // Update the state with the found user details
//         setIsValid(true);
//         // Store user details in localStorage for persistence
//         localStorage.setItem("foundUserDetails", JSON.stringify(foundUser));
//         const storedUser = JSON.parse(localStorage.getItem("foundUserDetails"));
// console.log("Stores user",storedUser); // Logs the stored user details

//       } else {

//         setUser(null);
//         setIsValid(false);
//         // Remove previously stored user details if not found
//         localStorage.removeItem("foundUserDetails");
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setApiError(
//         "The data is currently unavailable, but we are working to resolve this. Thank you for your patience!"
//       );
//       setUser(null);
//       setIsValid(false);
//     }
//   };
//   // Fetch roles from /api/roles/all
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await fetch("https://api.fmb52.com/api/roles/all", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         if (!response.ok) throw new Error("Failed to fetch roles");
//         const data = await response.json();
//         setRoleList(data.roles || []); // Assuming "roles" array is returned
//       } catch (error) {
//         console.error("Error fetching roles:", error);
//       }
//     };

//     fetchRoles();
//   }, [token]);

//   // // Fetch permissions when a role is selected
//   // useEffect(() => {
//   //   if (!roles) return; // Only fetch if a role is selected

//   //   const fetchPermissions = async () => {
//   //     try {
//   //       const response = await fetch(`https://api.fmb52.com/api/roles/${roles}/permissions`, {
//   //         method: "GET",
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       });
//   //       if (!response.ok) throw new Error("Failed to fetch permissions");
//   //       const data = await response.json();
//   //       setPermissions(data.permissions || []); // Store permissions
//   //     } catch (error) {
//   //       console.error("Error fetching permissions:", error);
//   //     }
//   //   };

//   //   fetchPermissions();
//   // }, [roles, token]);

//   // Fetch permissions when a role is selected
//   // useEffect(() => {

//   //   const fetchPermissions = async () => {
//   //     try {
//   //       const response = await fetch(`https://api.fmb52.com/api/permissions/all`, {
//   //         method: "GET",
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       });
//   //       if (!response.ok) throw new Error("Failed to fetch permissions");
//   //       const data = await response.json();
//   //       setPermissions(data.permissions || []); // Store permissions
//   //     } catch (error) {
//   //       console.error("Error fetching permissions:", error);
//   //     }
//   //   };

//   //   fetchPermissions();
//   // }, [token]);

//   // // Fetch permissions for the selected role
//   // useEffect(() => {
//   //   if (!roles) {
//   //     // If no role is selected, show all permissions unchecked
//   //     setRolePermissions([]);
//   //     return;
//   //   }

//   //   const fetchRolePermissions = async () => {
//   //     try {
//   //       const response = await fetch(`https://api.fmb52.com/api/roles/${roles}/permissions`, {
//   //         method: "GET",
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       });
//   //       if (!response.ok) throw new Error("Failed to fetch role permissions");
//   //       const data = await response.json();
//   //       const rolePermissions = data.permissions.map((permission) => permission.name);
//   //       setRolePermissions(rolePermissions); // Store role-specific permissions
//   //     } catch (error) {
//   //       console.error("Error fetching role permissions:", error);
//   //       setRolePermissions([]);
//   //     }
//   //   };

//   //   fetchRolePermissions();
//   // }, [roles, token]);

//  useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         const response = await fetch(`https://api.fmb52.com/api/permissions/all`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         if (!response.ok) throw new Error("Failed to fetch permissions");

//         const data = await response.json();
//         const permissions = data.permissions || [];

//         // Store permissions in state
//         setPermissions(permissions);

//         // Generate permissionNameMap dynamically
//         const generatedPermissionNameMap = permissions.reduce((acc, { name }) => {
//           const [module, action] = name.split(".");
//           const humanReadableName = `${action.charAt(0).toUpperCase() + action.slice(1)} ${
//             module.charAt(0).toUpperCase() + module.slice(1)
//           }`.replace("_", "-");
//           acc[name] = humanReadableName;
//           return acc;
//         }, {});

//         setPermissionNameMap(generatedPermissionNameMap);
//       } catch (error) {
//         console.error("Error fetching permissions:", error);
//       }
//     };

//     fetchPermissions();
//   }, [token]);
  
//   // Fetch permissions for the selected role
//   useEffect(() => {
//     if (!roles) {
//       setModules([]); // Clear selected modules if no role is selected
//       return;
//     }
  
//     const fetchRolePermissions = async () => {
//       try {
//         const response = await fetch(`https://api.fmb52.com/api/roles/${roles}/permissions`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         if (!response.ok) throw new Error("Failed to fetch role permissions");
  
//         const data = await response.json();
//         const rolePermissions = data.permissions.map((permission) => permission.name);
  
//         // Combine role-specific permissions with currently selected modules
//         setModules((prevModules) => {
//           const combinedPermissions = new Set([...prevModules, ...rolePermissions]);
//           return Array.from(combinedPermissions); // Convert back to array
//         });
  
//         setRolePermissions(rolePermissions); // Update state for role-specific permissions
//       } catch (error) {
//         console.error("Error fetching role permissions:", error);
//         setRolePermissions([]);
//       }
//     };
  
//     fetchRolePermissions();
//   }, [roles, token]);

  
//   // Check if a module is selected for the role
//   const isModuleChecked = (moduleName) => rolePermissions.includes(moduleName);



//   // Fetch sectors from API
//   useEffect(() => {
//     const fetchSectors = async () => {
//       try {
//         const response = await fetch("https://api.fmb52.com/api/sector", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) throw new Error("Failed to fetch sectors");

//         const data = await response.json();
//         setSectorList(data.data || []);
//       } catch (error) {
//         console.error("Error fetching sectors:", error);
//       }
//     };

//     fetchSectors();
//   }, [token]);

//   // Fetch sub-sectors from API
//   useEffect(() => {
//     const fetchSubSectors = async () => {
//       try {
//         const response = await fetch("https://api.fmb52.com/api/sub_sector", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) throw new Error("Failed to fetch sub-sectors");

//         const data = await response.json();
//         setSubSectorList(data.data || []);
//       } catch (error) {
//         console.error("Error fetching sub-sectors:", error);
//       }
//     };

//     fetchSubSectors();
//   }, [token]);

//  // Filter sub-sectors based on selected sectors and automatically select them
// useEffect(() => {
//   const filtered = subSectorList.filter((subSector) =>
//     selectedSectors.includes(subSector.sector_name)
//   );

//   // Automatically check all filtered sub-sectors
//   const allSubSectorNames = filtered.map((subSector) => subSector.sub_sector_name);
//   setFilteredSubSectors(filtered); // Update filtered sub-sectors
//   setSelectedSubSector(allSubSectorNames); // Automatically check all
// }, [selectedSectors, subSectorList]);

// // Fetch table data from the API
// const fetchTableData = async () => {
//   try {
//     const response = await fetch("https://api.fmb52.com/api/users/with-permissions", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error ${response.status}: ${response.statusText}`);
//     }

//     const data = await response.json();
//     setTableData(data.data || []); // Update table data
//   } catch (error) {
//     console.error("Error fetching table data:", error);
//     setSnackbar({
//       open: true,
//       message: "Failed to fetch table data.",
//       severity: "error",
//     });
//   }
// };

// // Fetch table data on component mount
// useEffect(() => {
//   fetchTableData();
// }, []);




//   return (
//     <AppTheme>
//       <CssBaseline />
//       <Box
//         sx={{
//           // maxWidth: 900,
//           mt: 16, pt: 2,
//           pb: 3,
//           mb: 1,
//           pl: 3,
//           pr: 3,
//           mr: 2,
//           ml: 2,
//           // margin: "auto",
//           // padding: 4,
//           backgroundColor: "#fff",
//           border: "1px solid #F4EBD0",
//           borderRadius: 2,
//           boxShadow: 1,
//         }}
//       >
//         {/* Header */}
//         <Typography
//           variant="h6"
//           sx={{
//             fontWeight: "bold",
//             marginBottom: 1,
//             // backgroundColor: "#F9F6E9",
//             padding: "8px 16px",
//             borderRadius: 1,
//           }}
//         >
//           User Access Details
//         </Typography>
//         <Box
//           sx={{
//             width: 'calc(100% + 48px)', // Add the parent's padding back
//             position: 'relative',
//             height: {
//               xs: 10, // Height for extra-small screens
//               sm: 15, // Height for small screens
//               md: 15, // Height for medium screens
//               lg: 15, // Height for large screens
//               xl: 15, // Height for extra-large screens
//             },
//             backgroundImage: `url(${divider})`, // Replace with your image path
//             backgroundSize: 'contain', // Ensure the divider image scales correctly
//             backgroundRepeat: 'repeat-x', // Repeat horizontally
//             backgroundPosition: 'center',
//             //  my: { xs: 1.5, sm: 2, md: 2.5 }, // Vertical margin adjusted for different screen sizes
//             mb: 2,
//             marginLeft: '-24px', // Adjust to counter the container padding/margins
//             marginRight: '-24px', // Adjust symmetrically
//           }}
//         />
//         {/* Table Layout */}
//         <TableContainer component={Paper} sx={{ border: `1px solid ${yellow[300]}`, }} elevation={0}>
//           <Table sx={{ minWidth: 650, }} aria-label="user access table">
//             <TableBody>
//               {/* ITS ID */}
//               <TableRow>
//                 <TableCell
//                   sx={{
//                     fontWeight: "bold",
//                     backgroundColor: yellow[300],
//                     color: "white",
//                     width: "20%",
//                   }}
//                 >
//                   User ITS Id:
//                 </TableCell>
//                 <TableCell
//                   sx={{
//                     // border: `1px solid ${yellow[300]}`,
//                     display: "flex", // Align items in a row
//                     alignItems: "center", // Align vertically centered
//                     justifyContent: "space-between", // Space between TextField and Name
//                     gap: 2, // Add spacing between elements
//                   }}
//                 >
//                   {/* TextField */}
//                   <TextField
//                     label="Enter ITS ID"
//                     variant="outlined"
//                     size="small"
//                     value={itsId}
//                     onChange={(e) => setItsId(e.target.value)}

                    
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") fetchData(); // Trigger validation on Enter
//                     }}
//                     onBlur={() => {
//                       if (itsId) {
//                         fetchData(); // Trigger validation when the field loses focus
//                       }
//                     }}
//                     sx={{
//                       width: "40%",
//                       border: `1px solid ${yellow[300]}`,
//                       borderRadius: "8px",
//                     }}
//                   />

//                   {/* Name and Green Checkmark */}
//                   {isValid !== null && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1, // Space between icon and text
//                         mt: 1, // Add spacing between input and feedback
//                         color: isValid ? "green" : "red", // Conditional color
//                       }}
//                     >
//                       {isValid ? (
//                         <>
//                           <CheckCircleOutlineIcon sx={{ color: "green" }} />
//                           <Typography variant="body2" sx={{ fontWeight: 600, color: "green" }}>
//                             {user?.name || "Valid User"}
//                           </Typography>
//                         </>
//                       ) : (
//                         <>
//                           <ErrorOutlineIcon sx={{ color: "red" }} />
//                           <Typography variant="body2" sx={{ fontWeight: 600, color: "red" }}>
//                             Invalid ITS ID
//                           </Typography>
//                         </>
//                       )}
//                     </Box>
//                   )}

//                   {/* Error Message Section */}
//                   {apiError && (
//                     <Typography variant="body2" color="error" sx={{ mt: 1 }}>
//                       {apiError}
//                     </Typography>
//                   )}
//                 </TableCell>
//               </TableRow>


//               {/* Validity */}
//               <TableRow>
//                 <TableCell
//                   sx={{
//                     fontWeight: "bold",
//                     backgroundColor: yellow[300],
//                     color: "white",
//                   }}
//                 >
//                   Validity of User:
//                 </TableCell>
//                 <TableCell sx={{
//                   borderTop: `1px solid ${yellow[300]}`,
//                   borderBottom: `1px solid ${yellow[300]}`,
//                 }}>
//                   <TextField
//                     type="date" // Use the date input type
//                     variant="outlined"
//                     size="small"
//                     value={validityDate} // Bind to state
//                     onChange={(event) => setValidityDate(event.target.value)} // Handle changes
//                     inputRef={inputRef} // Attach the ref to the input element
//                     onClick={handleTextFieldClick} // Open the calendar when the field is clicked
//                     inputProps={{
//                       min: today, // Disable dates before today
//                     }}
//                     sx={{
//                       width: "40%",
//                       border: `1px solid ${yellow[300]}`,
//                       borderRadius: "8px",
//                     }}
//                   />

//                 </TableCell>
//               </TableRow>

//               {/* Assign Roles */}
//               <TableRow>
//                 <TableCell
//                   sx={{
//                     fontWeight: "bold",
//                     backgroundColor: yellow[300],
//                     color: "white",
//                   }}
//                 >
//                   Assign Roles:
//                 </TableCell>
//                 {/* <TableCell
//                   sx={{
//                     borderTop: `1px solid ${yellow[300]}`,
//                     borderBottom: `1px solid ${yellow[300]}`,
//                   }}
//                 >
//                   <FormControl size="small" sx={{ width: "40%" }}>
//                     <InputLabel>Select Role</InputLabel>
//                     <Select
//                       value={roles}
//                       onChange={handleRoleChange}
//                       label="Select Role"
//                       sx={{
//                         border: `1px solid ${yellow[300]}`,
//                         borderRadius: "8px",
//                       }}
//                     >
//                       <MenuItem value="">None</MenuItem>
//                       {permissions.map((permission) => (
//                         <MenuItem key={permission.id} value={permission.name}>
//                           {permission.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </TableCell> */}

//                 <TableCell sx={{
//                   borderTop: `1px solid ${yellow[300]}`,
//                   borderBottom: `1px solid ${yellow[300]}`,
//                 }}>
//                   <FormControl size="small" sx={{ width: "40%" }}>
//                     <InputLabel>Select Role</InputLabel>
//                     <Select
//                       value={roles}
//                       onChange={(e) => setRoles(e.target.value)} // Update selected role
//                       label="Select Role"
//                       sx={{
//                         border: `1px solid ${yellow[300]}`,
//                         borderRadius: "8px",
//                       }}
//                     >
//                       <MenuItem value="">None</MenuItem>
//                       {roleList.map((role) => (
//                         <MenuItem key={role.id} value={role.id}>
//                           {role.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </TableCell>
//               </TableRow>

//               {/* Assign Modules */}
//               <TableRow>
//                 <TableCell
//                   sx={{
//                     fontWeight: "bold",
//                     backgroundColor: yellow[300],
//                     color: "white",
//                   }}
//                 >
//                   Assign Modules:
//                 </TableCell>
//                 {/* <TableCell sx={{
//                 borderTop: `1px solid ${yellow[300]}`,
//                 borderBottom: `1px solid ${yellow[300]}`,
//               }}>
//                 <FormControl size="small" sx={{width: '40%'}}>
//                   <InputLabel>Select From List</InputLabel>
//                   <Select
//                     value={modules}
//                     onChange={handleModuleChange}
//                     label="Select From List"
//                     sx={{
//                       border: `1px solid ${yellow[300]}`,
//                       borderRadius: '8px'
//                     }}
//                   >
//                     <MenuItem value="">None</MenuItem>
//                     <MenuItem value="Sales">Sales</MenuItem>
//                     <MenuItem value="Inventory">Inventory</MenuItem>
//                     <MenuItem value="Finance">Finance</MenuItem>
//                   </Select>
//                 </FormControl>
//               </TableCell> */}
//                 <TableCell sx={{
//                   borderTop: `1px solid ${yellow[300]}`,
//                   borderBottom: `1px solid ${yellow[300]}`,
//                 }}>
//                   <FormControl size="small" sx={{ width: "40%" }}>
//                     <InputLabel>Select Module</InputLabel>
//                     {/* <Select
//                       value={modules}
//                       onChange={(e) => setModules(e.target.value)} // Update selected module
//                       label="Select Module"
//                       sx={{
//                         border: `1px solid ${yellow[300]}`,
//                         borderRadius: "8px",
//                       }}
//                     >
//                       <MenuItem value="">None</MenuItem>
//                       {permissions.map((permission) => (
//                         <MenuItem key={permission.id} value={permission.name}>
//                           {permissionNameMap[permission.name] || permission.name}
//                         </MenuItem>
//                       ))}
//                     </Select> */}
// <Select
//       multiple
//       value={modules}
//       onChange={(event) => {
//         const { value } = event.target;
//         setModules(typeof value === "string" ? value.split(",") : value);
//       }}
//       renderValue={(selected) => {
//         const displayedItems = selected.slice(0, 2); // Show only the first 2 items
//         const hiddenItems = selected.slice(2); // Hidden items for +N more
//         const moreCount = hiddenItems.length;

//         return (
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//             {displayedItems.map((value) => (
//               <Chip
//                 key={value}
//                 label={permissionNameMap[value] || value}
//                 onMouseDown={(e) => e.stopPropagation()}
//                 onDelete={(event) =>
//                   setModules((prev) => prev.filter((module) => module !== value))
//                 }
//                 deleteIcon={<CancelIcon />}
//               />
//             ))}
//             {moreCount > 0 && (
//               <Tooltip
//                 title={
//                   <Box sx={{ display: "flex", flexDirection: "column" }}>
//                     {hiddenItems.map((value) => (
//                       <Box key={value}>{permissionNameMap[value] || value}</Box>
//                     ))}
//                   </Box>
//                 }
//                 arrow
//               >
//                 <Chip
//                   label={`+${moreCount} more`}
//                   sx={{
//                     backgroundColor: "#f5f5f5",
//                     cursor: "pointer",
//                   }}
//                 />
//               </Tooltip>
//             )}
//           </Box>
//         );
//       }}
//       sx={{ border: "1px solid #F4EBD0", borderRadius: "8px" }}
//       MenuProps={{
//         PaperProps: {
//           style: {
//             maxHeight: 300,
//             width: 300,
//           },
//         },
//       }}
//     >
//       {Object.entries(permissionNameMap).map(([key, label]) => (
//         <MenuItem key={key} value={key}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <input
//               type="checkbox"
//               checked={modules.includes(key)}
//               onChange={() => {
//                 if (modules.includes(key)) {
//                   setModules((prev) => prev.filter((module) => module !== key));
//                 } else {
//                   setModules((prev) => [...prev, key]);
//                 }
//               }}
//             />
//             {label}
//           </Box>
//         </MenuItem>
//       ))}
//     </Select>

//                   </FormControl>
//                 </TableCell>
//               </TableRow>

//               {/* Sector */}
//               <TableRow>
//                 <TableCell
//                   sx={{
//                     fontWeight: "bold",
//                     backgroundColor: yellow[300],
//                     color: "white",
//                   }}
//                 >
//                   Sector:
//                 </TableCell>
//                 <TableCell sx={{
//                   borderTop: `1px solid ${yellow[300]}`,
//                   borderBottom: `1px solid ${yellow[300]}`,
//                 }}>
//                   <FormControl size="small" sx={{ width: '40%' }}>
//                     <InputLabel>Select Sectors</InputLabel>
//                     <Select
//                       multiple
//                       value={selectedSectors}
//                       onChange={handleSectorChange}
//                       renderValue={(selected) => (
//                         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                           {selected.map((value) => (
//                             <Chip
//                               key={value}
//                               label={value}
//                               onMouseDown={(e) => e.stopPropagation()}
//                               onDelete={(event) => handleDeleteSector(event, value)}
//                               deleteIcon={<CancelIcon />}
//                             />
//                           ))}
//                         </Box>
//                       )}
//                       sx={{ border: "1px solid #F4EBD0", borderRadius: "8px" }}
//                     >
//                       {sectorList.map((sectorItem) => (
//                         <MenuItem key={sectorItem.id} value={sectorItem.name}>
//                           {sectorItem.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </TableCell>
//               </TableRow>

//               {/* Sub-Sector */}
// {/* Sub-Sector */}
// <TableRow>
//   <TableCell
//     sx={{
//       fontWeight: "bold",
//       backgroundColor: yellow[300],
//       color: "white",
//     }}
//   >
//     Sub - Sector:
//   </TableCell>
//   <TableCell
//     sx={{
//       borderTop: `1px solid ${yellow[300]}`,
//       borderBottom: `1px solid ${yellow[300]}`,
//     }}
//   >
//     <FormControl size="small" sx={{ width: '40%' }}>
//       <InputLabel>Select Sub-Sector</InputLabel>
//       <Select
//         multiple
//         value={selectedSubSector}
//         onChange={handleSubSectorChange}
//         renderValue={(selected) => {
//           const displayedItems = selected.slice(0, 5); // Display up to 6 items
//           const hiddenItems = selected.slice(5); // Remaining items
//           const moreCount = hiddenItems.length; // Count of hidden items
        
//           return (
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//               {displayedItems.map((value) => (
//                 <Chip
//                   key={value}
//                   label={value}
//                   onMouseDown={(e) => e.stopPropagation()}
//                   onDelete={(event) => handleDeleteSubSector(event, value)}
//                   deleteIcon={<CancelIcon />}
//                 />
//               ))}
//               {moreCount > 0 && (
//                 <Tooltip
//                   title={
//                     <Box sx={{ display: "flex", flexDirection: "column" }}>
//                       {hiddenItems.map((value) => (
//                         <Box key={value}>{value}</Box>
//                       ))}
//                     </Box>
//                   }
//                   arrow
//                 >
//                   <Chip
//                     label={`+${moreCount} more`}
//                     sx={{
//                       backgroundColor: "#f5f5f5",
//                       cursor: "pointer",
//                     }}
//                   />
//                 </Tooltip>
//               )}
//             </Box>
//           );
//         }}
        
//         sx={{ border: "1px solid #F4EBD0", borderRadius: "8px" }}
//         MenuProps={{
//           PaperProps: {
//             style: {
//               maxHeight: 300,
//               width: 300,
//             },
//           },
//         }}
//       >
//         {selectedSectors.reduce((acc, sectorName) => {
//           const sectorSubSectors = filteredSubSectors.filter(
//             (subSector) => subSector.sector_name === sectorName
//           );
//           return acc.concat(
//             <ListSubheader
//               key={sectorName}
//               sx={{
//                 fontWeight: "bold",
//                 position: "sticky",
//                 top: 0,
//                 backgroundColor: yellow[100],
//                 zIndex: 1,
//               }}
//             >
//               {sectorName}
//             </ListSubheader>,
//             sectorSubSectors.map((subSector) => (
//               <MenuItem key={subSector.id} value={subSector.sub_sector_name}>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <input
//                     type="checkbox"
//                     checked={selectedSubSector.includes(subSector.sub_sector_name)}
//                     onChange={() => {
//                       if (selectedSubSector.includes(subSector.sub_sector_name)) {
//                         setSelectedSubSector((prev) =>
//                           prev.filter((name) => name !== subSector.sub_sector_name)
//                         );
//                       } else {
//                         setSelectedSubSector((prev) => [...prev, subSector.sub_sector_name]);
//                       }
//                     }}
//                   />
//                   {subSector.sub_sector_name}
//                 </Box>
//               </MenuItem>
//             ))
//           );
//         }, [])}
//       </Select>
//     </FormControl>
//   </TableCell>
// </TableRow>

//               <TableRow>
//   <TableCell
//     colSpan={2} // Span across two columns to center within the table
//     sx={{
//       textAlign: "center", // Center the content horizontally
//       padding: "20px", // Add padding for vertical centering
//     }}
//   >
//     <Button
//       variant="contained"
//       color="primary"
//       onClick={handleSubmit} // Trigger form submission logic
//       disabled={!isValid} // Disable the button if the user is invalid
//       sx={{
//         color: "white", // Button text color
//         backgroundColor: yellow[300], // Button background color
//         borderColor: yellow[300], // Border color
//         "&:hover": {
//           backgroundColor: yellow[200], // Hover background color
//           borderColor: "#e0d4b0", // Hover border color
//           color: "#000", // Hover text color
//         },
//         "&:disabled": {
//           backgroundColor: "#d3d3d3", // Disabled background color
//           color: "#a0a0a0", // Disabled text color
//         },
//       }}
//     >
//       Submit
//     </Button>
//   </TableCell>
// </TableRow>



//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//  {/* Table Box */}
//  <Box
//         sx={{
//           mt: 2,
//           pt: 2,
//           pb: 3,
//           pl: 3,
//           pr: 3,
//           mr: 2,
//           ml: 2,
//           mb: 3,
//           backgroundColor: "#fff",
//           border: "1px solid #F4EBD0",
//           borderRadius: 2,
//           boxShadow: 1,
//         }}
//       >
//         {/* Header */}
//         <Typography
//           variant="h6"
//           sx={{
//             fontWeight: "bold",
//             marginBottom: 1,
//             // backgroundColor: "#F9F6E9",
//             padding: "8px 16px",
//             borderRadius: 1,
//           }}
//         >
//           User Access Details
//         </Typography>
//         <Box
//           sx={{
//             width: 'calc(100% + 48px)', // Add the parent's padding back
//             position: 'relative',
//             height: {
//               xs: 10, // Height for extra-small screens
//               sm: 15, // Height for small screens
//               md: 15, // Height for medium screens
//               lg: 15, // Height for large screens
//               xl: 15, // Height for extra-large screens
//             },
//             backgroundImage: `url(${divider})`, // Replace with your image path
//             backgroundSize: 'contain', // Ensure the divider image scales correctly
//             backgroundRepeat: 'repeat-x', // Repeat horizontally
//             backgroundPosition: 'center',
//             //  my: { xs: 1.5, sm: 2, md: 2.5 }, // Vertical margin adjusted for different screen sizes
//             mb: 2,
//             marginLeft: '-24px', // Adjust to counter the container padding/margins
//             marginRight: '-24px', // Adjust symmetrically
//           }}
//         />
//         <TableContainer component={Paper} sx={{ border: `1px solid ${yellow[300]}` }}>
//           <Table sx={{ minWidth: 650 }} aria-label="user access table">
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                   SN
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                   ITS ID
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                   Name
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                   Modules
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                   Roles
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                   Sector
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                   User Validity
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold", backgroundColor: yellow[300], color: "white" }}>
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tableData.map((row, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{row.user_id}</TableCell>
//                   <TableCell>{row.user_name}</TableCell>
//                   <TableCell>{row.permissions.length}</TableCell>
//                   <TableCell>{row.user_role}</TableCell>
//                   <TableCell>{/* Add sector logic if available */}</TableCell>
//                   <TableCell>{/* Add validity logic if available */}</TableCell>
//                   <TableCell>
//                     <Button variant="outlined" size="small" color="primary">
//                       Actions
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//          {/* Snackbar for messages */}
//          <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={handleSnackbarClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
//             {snackbar.message}
//           </Alert>
//         </Snackbar>

//     </AppTheme>
//   );
// }


import React from "react";
import { Box, CssBaseline } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import UserAccessForm from "../../components/userManagement/userAccess/userAccessForm"; // Adjust the path as needed
import UserAccessTable from "../../components/userManagement/userAccess/userAccessTable"; // Adjust the path as needed
import { useEffect } from "react";

const UserAccess = () => {
      // Set the document title
      useEffect(() => {
        document.title = "Permissions - FMB 52"; // Set the title for the browser tab
      }, []);
    
  return (
    <AppTheme>
      <CssBaseline />

      {/* Form Component */}
      <UserAccessForm />

      {/* Table Component */}
      <UserAccessTable />
    </AppTheme>
  );
};

export default UserAccess;

