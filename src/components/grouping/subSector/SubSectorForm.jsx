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
    Button,
    Snackbar,
    Alert,
    CssBaseline,
    Grid,
    IconButton,
    Collapse
} from "@mui/material";
import { yellow } from "../../../styles/ThemePrimitives";
import AppTheme from "../../../styles/AppTheme";
import divider from '../../../assets/divider.png';
import { useUser } from "../../../UserContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const SubSectorForm = () => {
    const { token } = useUser();
    const [collapsed, setCollapsed] = useState(false); // Collapse state
    const [subSectorName, setSubSectorName] = useState("");
    const [sectorId, setSectorId] = useState("");

    const [inchargeName, setInchargeName] = useState("");
    const [inchargeMobile, setInchargeMobile] = useState("");
    const [inchargeEmail, setInchargeEmail] = useState("");
    const [sectors, setSectors] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleCollapseToggle = () => {
        setCollapsed((prev) => !prev);
    };


    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    // Fetch sectors from API
    const fetchSectors = async () => {
        try {
            const response = await fetch("https://api.fmb52.com/api/sector", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch sectors.");
            }

            const data = await response.json();
            setSectors(data.data || []);
        } catch (error) {
            console.error("Error fetching sectors:", error);
            setSnackbar({
                open: true,
                message: "Failed to fetch sectors. Please try again later.",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        fetchSectors();
    }, []);

    const handleSubmit = async () => {
        if (!subSectorName || !sectorId) {
            setSnackbar({
                open: true,
                message: "Please fill all the fields before submitting.",
                severity: "warning",
            });
            return;
        }

        const payload = {
            sub_sector_name: subSectorName,
            sector_id: sectorId,
        };

        try {
            const response = await fetch("https://api.fmb52.com/api/sub_sector", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to create the sub-sector.");
            }

            setSnackbar({
                open: true,
                message: "Sub-sector created successfully!",
                severity: "success",
            });

            // Clear form fields
            setSubSectorName("");
            setSectorId("");
        } catch (error) {
            console.error("Error submitting sub-sector:", error);
            setSnackbar({
                open: true,
                message: "Failed to create the sub-sector. Please try again.",
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
                {/* Header */}
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
                        Add/Update Sub-Sector
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
                    <Grid container spacing={3} alignItems="center" sx={{pr : 5}}>
                        {/* Sub-Sector Name */}
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Sub-Sector Name"
                                variant="outlined"
                                size="small"
                                value={subSectorName}
                                onChange={(e) => setSubSectorName(e.target.value)}
                                fullWidth
                                placeholder="Enter Sub-Sector Name"
                            />
                        </Grid>

                        {/* Sector Name */}
                        <Grid item xs={12} md={3}>
<FormControl size="small" fullWidth>
    <InputLabel>Select Sector</InputLabel>
    <Select
        value={sectorId}
        onChange={(e) => setSectorId(e.target.value)}
        label="Select Sector"
    >
        {sectors.map((sector) => (
            <MenuItem key={sector.id} value={sector.id}>
                {sector.name}
            </MenuItem>
        ))}
    </Select>
</FormControl>

                        </Grid>

                        {/* Incharge Name */}

                        {/* Incharge Mobile */}

                        {/* Incharge Email */}
                    </Grid>

                    {/* Submit Button */}
                   <Box sx={{ textAlign: "right", mt: 3 }}>
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
                                   </Box>
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

export default SubSectorForm;
