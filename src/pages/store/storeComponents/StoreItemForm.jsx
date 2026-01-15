import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    CssBaseline,
    Grid,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Collapse,
} from "@mui/material";
import { yellow } from "../../../styles/ThemePrimitives";
import divider from "../../../assets/divider.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useUser } from "../../../contexts/UserContext";

const StoreItemForm = ({ onSuccess }) => {
    const formRef = useRef(null);
    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const [collapsed, setCollapsed] = useState(false);

    // form fields
    const [name, setName] = useState("");
    const [unit, setUnit] = useState("");
    const [category, setCategory] = useState("");
    const [minimumStockLevel, setMinimumStockLevel] = useState("");

    // dropdown data
    const [unitOptions, setUnitOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    // loading
    const [loadingMeta, setLoadingMeta] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // snackbar
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleSnackbarClose = () => setSnackbar((p) => ({ ...p, open: false }));
    const handleCollapseToggle = () => setCollapsed((prev) => !prev);

    // ✅ Fetch units + categories
    const fetchMeta = async () => {
        if (!token || loadingMeta) return;
        setLoadingMeta(true);

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            };

            // Adjust endpoints if yours differ:
            // units:   GET /store/units
            // categories: GET /store/categories
            const [uResp, cResp] = await Promise.all([
                fetch(`${base}/store/units`, { method: "GET", headers }),
                fetch(`${base}/store/categories`, { method: "GET", headers }),
            ]);

            const uJson = await uResp.json();
            const cJson = await cResp.json();

            // units response:
            // { success:true, data:{ units:[...] } }
            const units = uJson?.data?.units;
            const cats = cJson?.data?.categories;

            setUnitOptions(Array.isArray(units) ? units : []);
            setCategoryOptions(Array.isArray(cats) ? cats : []);
        } catch (err) {
            console.error("Meta fetch error:", err);
            setUnitOptions([]);
            setCategoryOptions([]);
            setSnackbar({
                open: true,
                message: "Unable to fetch units/categories. Please try again later.",
                severity: "error",
            });
        } finally {
            setLoadingMeta(false);
        }
    };

    useEffect(() => {
        fetchMeta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const resetForm = () => {
        setName("");
        setUnit("");
        setCategory("");
        setMinimumStockLevel("");
    };

    const handleSubmit = async () => {
        if (!token) return;

        // small validation
        if (!name.trim()) {
            setSnackbar({ open: true, message: "Name is required.", severity: "error" });
            return;
        }
        if (!unit) {
            setSnackbar({ open: true, message: "Unit is required.", severity: "error" });
            return;
        }
        if (!category) {
            setSnackbar({ open: true, message: "Category is required.", severity: "error" });
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                name: name.trim(),
                units: unit, // field name in your Product model is `units`
                category,
                low_stock_level: Number(minimumStockLevel || 0), // field name in your model: low_stock_level
            };

            const resp = await fetch(`${base}/store-items`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await resp.json();

            if (resp.ok && (data?.success === true || data?.status === true || data?.code === 200)) {
                setSnackbar({
                    open: true,
                    message: data?.message || "Store item created successfully!",
                    severity: "success",
                });
                resetForm();
                if (onSuccess) onSuccess(); // ✅ parent can refresh table
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                setSnackbar({
                    open: true,
                    message: data?.message || "Submission failed.",
                    severity: "error",
                });
            }
        } catch (err) {
            console.error("Submit error:", err);
            setSnackbar({
                open: true,
                message: "Error occurred during submission.",
                severity: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <CssBaseline />
            <Box
                ref={formRef}
                sx={{
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
                {/* Header + Collapse Toggle */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            marginBottom: 1,
                            padding: "8px 16px",
                            borderRadius: 1,
                        }}
                    >
                        Add Store Item
                    </Typography>

                    <IconButton
                        onClick={handleCollapseToggle}
                        sx={{
                            color: yellow[300],
                            "&:hover": { color: yellow[400] },
                        }}
                    >
                        {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </IconButton>
                </Box>

                {/* Divider only when expanded */}
                {!collapsed && (
                    <Box
                        sx={{
                            width: "calc(100% + 48px)",
                            position: "relative",
                            height: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 },
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
                    <Grid container spacing={3} alignItems="center" sx={{ pr: 5 }}>
                        {/* Name */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>

                        {/* Unit (from API) */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth disabled={loadingMeta}>
                                <InputLabel id="unit-select-label">Unit</InputLabel>
                                <Select
                                    labelId="unit-select-label"
                                    value={unit}
                                    label="Unit"
                                    onChange={(e) => setUnit(e.target.value)}
                                    MenuProps={{
                                        PaperProps: { style: { maxHeight: 300 } },
                                    }}
                                >
                                    {unitOptions.map((u) => (
                                        <MenuItem key={u} value={u}>
                                            {u}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Category (from API) */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth disabled={loadingMeta}>
                                <InputLabel id="cat-select-label">Category</InputLabel>
                                <Select
                                    labelId="cat-select-label"
                                    value={category}
                                    label="Category"
                                    onChange={(e) => setCategory(e.target.value)}
                                    MenuProps={{
                                        PaperProps: { style: { maxHeight: 300 } },
                                    }}
                                >
                                    {categoryOptions.map((c) => (
                                        <MenuItem key={c} value={c}>
                                            {c}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Minimum Stock Level */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Minimum Stock Level"
                                value={minimumStockLevel}
                                onChange={(e) => setMinimumStockLevel(e.target.value)}
                            />
                        </Grid>

                        {/* Submit row (bottom right) */}
                        <Grid item xs={12} sx={{ textAlign: "right" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={submitting}
                                sx={{
                                    color: "white",
                                    backgroundColor: yellow[300],
                                    "&:hover": { backgroundColor: yellow[200], color: "#000" },
                                    minWidth: 140,
                                }}
                            >
                                {submitting ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                            </Button>
                        </Grid>
                    </Grid>
                </Collapse>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                sx={{ height: "100%" }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default StoreItemForm;
