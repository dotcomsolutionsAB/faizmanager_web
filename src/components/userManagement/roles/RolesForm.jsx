import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Button,
    Snackbar,
    Alert,
    CssBaseline,
    ListSubheader,
    IconButton
} from "@mui/material";
import { yellow } from "../../../styles/ThemePrimitives";
import AppTheme from "../../../styles/AppTheme";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUser } from "../../../UserContext";
import divider from '../../../assets/divider.png';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";

const RolesForm = () => {
    const { token } = useUser();
    const [collapsed, setCollapsed] = useState(false); // State for collapse
    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState([]); // Selected permissions
    const [remarks, setRemarks] = useState("");
    const [allPermissions, setAllPermissions] = useState([]); // Available permissions from API
    const [permissionNameMap, setPermissionNameMap] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

         // Toggle collapse state
         const handleCollapseToggle = () => {
            setCollapsed((prev) => !prev);
        };

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    // Fetch permissions from API and format them
    const fetchPermissions = async () => {
        try {
            const response = await fetch("https://api.fmb52.com/api/permissions/all", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch permissions.");
            }

            const data = await response.json();
            const permissions = data.permissions || [];

            // Create a human-readable permission map
            const formattedPermissions = permissions.reduce((acc, permission) => {
                const [module, action] = permission.name.split(".");
                const humanReadableName = `${action.charAt(0).toUpperCase() + action.slice(1)} ${module.charAt(0).toUpperCase() + module.slice(1)
                    }`.replace("_", " ");
                acc[permission.name] = humanReadableName;
                return acc;
            }, {});

            setPermissionNameMap(formattedPermissions);
            setAllPermissions(permissions);
        } catch (error) {
            console.error("Error fetching permissions:", error);
            setSnackbar({
                open: true,
                message: "Failed to fetch permissions. Please try again later.",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const handleSubmit = async () => {
        if (!roleName || permissions.length === 0 || !remarks) {
            setSnackbar({
                open: true,
                message: "Please fill all the fields before submitting.",
                severity: "warning",
            });
            return;
        }

        const payload = {
            name: roleName,
            permissions: permissions,
            remarks: remarks,
        };

        try {
            const response = await fetch("https://api.fmb52.com/api/roles/create-with-permissions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to create the role.");
            }

            setSnackbar({
                open: true,
                message: "Role created successfully!",
                severity: "success",
            });

            // Clear form fields
            setRoleName("");
            setPermissions([]);
            setRemarks("");
        } catch (error) {
            console.error("Error submitting role:", error);
            setSnackbar({
                open: true,
                message: "Failed to create the role. Please try again.",
                severity: "error",
            });
        }
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
                 {/* Header with Collapse Icon */}
                 <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
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
                        Add/Update Roles
                    </Typography>
                    {/* Collapse Icon */}
                    <IconButton
                        onClick={handleCollapseToggle}
                        sx={{
                            color: yellow[300],
                            "&:hover": {
                                color: yellow[400],
                            },
                        }}
                    >
                        {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </IconButton>
                </Box>
                {!collapsed && (
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
                )}
                <Collapse in={!collapsed}>
                <TableContainer component={Paper} sx={{ border: `1px solid ${yellow[300]}` }}>
                    <Table>
                        <TableBody>
                            {/* Name of the Role */}
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: "bold",
                                        backgroundColor: yellow[300],
                                        color: "white",
                                        width: "20%",
                                    }}
                                >
                                    Role Name:
                                </TableCell>
                                <TableCell sx={{
                                    borderBottom: `1px solid ${yellow[300]}`,
                                }}>
                                    <TextField
                                        label="Enter Role Name"
                                        variant="outlined"
                                        size="small"
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                        sx={{
                                            width: "60%",
                                            border: `1px solid ${yellow[300]}`,
                                            borderRadius: "8px",
                                        }}
                                    />
                                </TableCell>
                            </TableRow>

                            {/* Permissions Dropdown */}
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: "bold",
                                        backgroundColor: yellow[300],
                                        color: "white",
                                    }}
                                >
                                    Permissions:
                                </TableCell>
                                <TableCell sx={{
                                    borderTop: `1px solid ${yellow[300]}`,
                                    borderBottom: `1px solid ${yellow[300]}`,
                                }}>
                                    <FormControl size="small" sx={{ width: "60%" }}>
                                        <InputLabel>Select Permissions</InputLabel>
                                        <Select
                                            multiple
                                            value={permissions}
                                            onChange={(event) => {
                                                const { value } = event.target;
                                                setPermissions(typeof value === "string" ? value.split(",") : value);
                                            }}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip
                                                            key={value}
                                                            label={permissionNameMap[value] || value}
                                                            onMouseDown={(e) => e.stopPropagation()}
                                                            onDelete={() =>
                                                                setPermissions((prev) =>
                                                                    prev.filter((permission) => permission !== value)
                                                                )
                                                            }
                                                            deleteIcon={<CancelIcon />}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                            sx={{
                                                border: `1px solid ${yellow[300]}`,
                                                borderRadius: "8px",
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                        width: 300,
                                                    },
                                                },
                                            }}
                                        >
                                            {Object.entries(
                                                allPermissions.reduce((acc, { name }) => {
                                                    const [module] = name.split(".");
                                                    if (!acc[module]) acc[module] = [];
                                                    acc[module].push(name);
                                                    return acc;
                                                }, {})
                                            ).map(([module, items]) => {
                                                const allSelected = items.every((item) => permissions.includes(item));
                                                const someSelected =
                                                    items.some((item) => permissions.includes(item)) && !allSelected;

                                                return (
                                                    <React.Fragment key={module}>
                                                        <ListSubheader
                                                            sx={{
                                                                fontWeight: "bold",
                                                                backgroundColor: yellow[100],
                                                                color: "#000",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                            }}
                                                        >
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={allSelected}
                                                                    onChange={() => {
                                                                        if (allSelected) {
                                                                            setPermissions((prev) =>
                                                                                prev.filter((perm) => !items.includes(perm))
                                                                            );
                                                                        } else {
                                                                            setPermissions((prev) =>
                                                                                Array.from(new Set([...prev, ...items]))
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                                {module.charAt(0).toUpperCase() + module.slice(1)}
                                                            </Box>
                                                        </ListSubheader>
                                                        {items.map((permission) => (
                                                            <MenuItem key={permission} value={permission}>
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={permissions.includes(permission)}
                                                                        onChange={() => {
                                                                            if (permissions.includes(permission)) {
                                                                                setPermissions((prev) =>
                                                                                    prev.filter((perm) => perm !== permission)
                                                                                );
                                                                            } else {
                                                                                setPermissions((prev) => [...prev, permission]);
                                                                            }
                                                                        }}
                                                                    />
                                                                    {permissionNameMap[permission]}
                                                                </Box>
                                                            </MenuItem>
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>

                            {/* Remarks */}
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: "bold",
                                        backgroundColor: yellow[300],
                                        color: "white",
                                    }}
                                >
                                    Remarks:
                                </TableCell>
                                <TableCell sx={{
                                    borderTop: `1px solid ${yellow[300]}`,
                                    borderBottom: `1px solid ${yellow[300]}`,
                                }}>
                                    <TextField
                                        label="Enter Remarks"
                                        multiline
                                        // rows={4}
                                        siz="small"
                                        variant="outlined"
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        sx={{
                                            width: "60%",
                                            border: `1px solid ${yellow[300]}`,
                                            borderRadius: "8px",
                                        }}

                                    />
                                </TableCell>
                            </TableRow>

                            {/* Submit Button */}
                            <TableRow>
                                <TableCell colSpan={2} sx={{ textAlign: "center", padding: "20px" }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                        sx={{
                                            color: "white",
                                            backgroundColor: yellow[300],
                                            "&:hover": {
                                                backgroundColor: yellow[200],
                                                color: "#000",
                                            },
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                </Collapse>
            </Box>

            {/* Snackbar */}
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

export default RolesForm;
