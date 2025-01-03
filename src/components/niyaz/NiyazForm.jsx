import React, { useState } from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Snackbar,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    CssBaseline,
    Collapse,
} from "@mui/material";
import { yellow } from "../../styles/ThemePrimitives";
import AppTheme from "../../styles/AppTheme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import divider from '../../assets/divider.png';

const NiyazForm = () => {
    const [collapsed, setCollapsed] = useState(false); // Collapse state
    const [niyazType, setNiyazType] = useState("");
    const [entries, setEntries] = useState([{ name: "", hub: "" }]); // Repeater state
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const nameOptions = ["Option 1", "Option 2", "Option 3"];
    const [date, setDate] = useState("");


    const handleCollapseToggle = () => setCollapsed((prev) => !prev);

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    const handleAddEntry = () => setEntries([...entries, { name: "", hub: "" }]);

    const handleRemoveEntry = (index) => {
        const updatedEntries = entries.filter((_, i) => i !== index).map((entry, idx) => ({
            ...entry,
            sno: idx + 1, // Recalculate S. No.
        }));
        setEntries(updatedEntries);
    };

    const handleEntryChange = (index, field, value) => {
        const updatedEntries = [...entries];
        updatedEntries[index][field] = value;
        setEntries(updatedEntries);
    };

    const handleSubmit = async () => {
        if (!niyazType || entries.some((entry) => !entry.name || !entry.hub)) {
            setSnackbar({
                open: true,
                message: "Please fill all the fields before submitting.",
                severity: "warning",
            });
            return;
        }

        const payload = {
            niyaz_type: niyazType,
            entries: entries.map(({ name, hub }) => ({ name, hub })),
        };

        try {
            const response = await fetch("https://api.example.com/api/niyaz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to create the niyaz entry.");

            setSnackbar({
                open: true,
                message: "Niyaz entry created successfully!",
                severity: "success",
            });

            // Clear form fields
            setNiyazType("");
            setEntries([{ sno: 1, name: "", hub: "" }]);
        } catch (error) {
            console.error("Error submitting niyaz entry:", error);
            setSnackbar({
                open: true,
                message: "Failed to create the niyaz entry. Please try again.",
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
                        Add/Update Niyaz
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
                    <Grid container spacing={3} sx={{ mt: 2, }}>
                        {/* Niyaz Type */}
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Niyaz Type</InputLabel>
                                <Select
                                    value={niyazType}
                                    onChange={(e) => setNiyazType(e.target.value)}
                                >
                                    <MenuItem value="Type 1">Type 1</MenuItem>
                                    <MenuItem value="Type 2">Type 2</MenuItem>
                                    <MenuItem value="Type 3">Type 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Date Field */}
                        <Grid container spacing={3} sx={{ mb: 1 }}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Date"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label does not overlap with the input
                                    }}
                                    value={date} // State for date field
                                    onChange={(e) => setDate(e.target.value)} // Handler to update state
                                />
                            </Grid>
                        </Grid>


                        {/* Repeater for Name and Hub */}
                        {entries.map((entry, index) => (
                            <Grid container spacing={3} key={index} sx={{ mb: 1 }}>
                                {/* S. No. Field */}
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        label="S. No."
                                        value={index + 1}
                                        InputProps={{ readOnly: true }}
                                        fullWidth
                                    />
                                </Grid>
                                {/* Name Field */}
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>{`Name ${index + 1}`}</InputLabel>
                                        <Select
                                            value={entry.name}
                                            onChange={(e) =>
                                                handleEntryChange(index, "name", e.target.value)
                                            }
                                        >
                                            {nameOptions.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {/* Hub Field */}
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label={`Hub ${index + 1}`}
                                        value={entry.hub}
                                        onChange={(e) =>
                                            handleEntryChange(index, "hub", e.target.value)
                                        }
                                        placeholder="Enter hub details..."
                                        fullWidth
                                    />
                                </Grid>
                                {/* Remove Entry Button */}
                                <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center" }}>
                                    <IconButton onClick={() => handleRemoveEntry(index)}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleAddEntry}
                            sx={{ ml: 3 }}
                        >
                            Add Niyaz Karnar
                        </Button>
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

export default NiyazForm;
