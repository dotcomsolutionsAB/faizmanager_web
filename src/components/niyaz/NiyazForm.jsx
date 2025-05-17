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
import { useEffect } from "react";
import { useUser } from "../../UserContext";

const NiyazForm = () => {
    const { token, currency } = useUser();
    const [collapsed, setCollapsed] = useState(false); // Collapse state
    const [niyazType, setNiyazType] = useState("");
    const [entries, setEntries] = useState([{ name: "", hub: "" }]); // Repeater state
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [nameOptions, setNameOptions] = useState([]);
    const [nameList, setNameList] = useState([]); 
    const [niyazTypeId, setNiyazTypeId] = useState(null);
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

        if (field === "name") {
            const selectedUser = nameList.find((user) => user.name === value);
            if (selectedUser) {
                updatedEntries[index].hub = selectedUser.hub_amount; // Automatically populate hub amount
            }
        
            setEntries(updatedEntries);
        }
    };

    const handleNiyazTypeChange = async (e) => {
        const selectedId = e.target.value;
        setNiyazTypeId(selectedId); // Save the selected Niyaz Type ID
        setNiyazType(nameOptions.find((option) => option.id === selectedId)?.name || "");

        // Fetch the list of names based on the selected Niyaz Type ID
        try {
            const response = await fetch(`https://api.fmb52.com/api/users-by-slab/${selectedId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log(data,data)
            if (data.success) {
                setNameList(data.data); // Populate the Name dropdown
            } else {
                setSnackbar({
                    open: true,
                    message: "Failed to fetch names for the selected Niyaz Type.",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error("Error fetching names:", error);
            setSnackbar({
                open: true,
                message: "Error fetching names. Please try again.",
                severity: "error",
            });
        }
    };


    const handleSubmit = async () => {
        if (!niyazTypeId || entries.some((entry) => !entry.name || !entry.hub)) {
            setSnackbar({
                open: true,
                message: "Please fill all the fields before submitting.",
                severity: "warning",
            });
            return;
        }
    
        // Extract family IDs from the selected names
        const familyIds = entries
            .map((entry) => {
                const selectedUser = nameList.find((user) => user.name === entry.name);
                return selectedUser ? selectedUser.family_id : null;
            })
            .filter((id) => id); // Remove null/undefined values
    
        const payload = {
            hub_slab_id: niyazTypeId,
            family_ids: familyIds,
        };
    
        try {
            const response = await fetch("https://api.fmb52.com/api/niyaz/add", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Add token for authorization
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
    
            if (response.ok && data.success) {
                setSnackbar({
                    open: true,
                    message: "Niyaz added successfully!",
                    severity: "success",
                });
    
                // Clear form fields
                setNiyazType("");
                setNiyazTypeId(null);
                setEntries([{ name: "", hub: "" }]);
                setNameList([]);
            } else {
                throw new Error(data.message || "Failed to add Niyaz.");
            }
        } catch (error) {
            console.error("Error submitting niyaz entry:", error);
            setSnackbar({
                open: true,
                message: error.message || "Failed to add Niyaz. Please try again.",
                severity: "error",
            });
        }
    };
    

    const fetchNiyazTypes = async () => {
        try {
            const response = await fetch("https://api.fmb52.com/api/hub-slabs", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }); // Replace with actual API URL
            const data = await response.json();
            if (data.success) {
                setNameOptions(data.data);
            } else {
                setSnackbar({
                    open: true,
                    message: "Failed to fetch niyaz types.",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error("Error fetching niyaz types:", error);
            setSnackbar({
                open: true,
                message: "Error fetching niyaz types.",
                severity: "error",
            });
        }
    };

     const currencyCode = currency?.currency_code || 'INR';
  const currencySymbol = currency?.currency_symbol || '₹';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
    }).format(value || 0);
  };


    useEffect(() => {
        fetchNiyazTypes();
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
                                     value={niyazTypeId || ""}
                                     onChange={handleNiyazTypeChange}
                                >
                                    {nameOptions.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                           {`${option.name} (${formatCurrency(option.amount)})`}
                                        </MenuItem>
                                    ))}
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
                                        <InputLabel>{`Select HOF`}</InputLabel>
                                        <Select
                                            value={entry.name}
                                            onChange={(e) =>
                                                handleEntryChange(index, "name", e.target.value)
                                            }
                                        >
                                           {nameList.map((user) => (
                        <MenuItem key={user.id} value={user.name}>
                            {user.name}
                        </MenuItem>
                    ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {/* Hub Field */}
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label={`Hub`}
                                        value={entry.hub}
                                        onChange={(e) => handleEntryChange(index, "hub", e.target.value)}
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
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AppTheme>
    );
};

export default NiyazForm;
