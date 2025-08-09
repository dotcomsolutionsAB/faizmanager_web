import React, { useState } from "react";
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
    Button,
    Snackbar,
    Alert,
    CssBaseline,
    Grid,
    IconButton
} from "@mui/material";
import { yellow } from "../../../styles/ThemePrimitives";
import AppTheme from "../../../styles/AppTheme";
import divider from '../../../assets/divider.png';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import { useUser } from "../../../contexts/UserContext";


const SectorForm = () => {
    const {token} = useUser();
    const [collapsed, setCollapsed] = useState(false); // State for collapse
    const [sectorName, setSectorName] = useState("");
    const [secretaryName, setSecretaryName] = useState("");
    const [secretaryMobile, setSecretaryMobile] = useState("");
    const [secretaryEmail, setSecretaryEmail] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    
         // Toggle collapse state
         const handleCollapseToggle = () => {
            setCollapsed((prev) => !prev);
        };

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    const handleSubmit = async () => {
        if (!sectorName) {
            setSnackbar({
                open: true,
                message: "Please fill all the fields before submitting.",
                severity: "warning",
            });
            return;
        }

        const payload = {
            sector_name: sectorName,
            // notes: null,
        };

        try {
            const response = await fetch("https://api.fmb52.com/api/sector", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Include Bearer token in headers
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to create the sector.");
            }

            setSnackbar({
                open: true,
                message: "Sector created successfully!",
                severity: "success",
            });

            // Clear form fields
            setSectorName("");
        } catch (error) {
            console.error("Error submitting sector:", error);
            setSnackbar({
                open: true,
                message: "Failed to create the sector. Please try again.",
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
                        Add/Update Sector
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
                 <Grid container spacing={3} alignItems="center" sx={{pr: 5}}>
                    {/* Sector Name */}
                    <Grid item xs={12} md={3}>
                        {/* <Typography sx={{ fontWeight: "bold" }}>Sector</Typography> */}
                        <TextField
                            label="Sector Name"
                            variant="outlined"
                            size="small"
                            value={sectorName}
                            onChange={(e) => setSectorName(e.target.value)}
                            fullWidth
                            placeholder="Please enter name of the sector.."
                        />
                    </Grid>

                    {/* Secretary Name */}

                    {/* Secretary Mobile */}

                    {/* Secretary Email */}

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

export default SectorForm;
