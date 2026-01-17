import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Dialog,
    DialogContent,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    IconButton,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dividerImg from "../../../../assets/divider.png";

export default function ItemTableUpdate({
    open,
    onClose,
    item,
    token,
    base,
    onSuccess,
}) {
    const [name, setName] = useState("");
    const [unit, setUnit] = useState("");
    const [category, setCategory] = useState("");
    const [minStock, setMinStock] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // You can replace these with API driven lists later
    const UNIT_OPTIONS = ["kg", "ltr", "pcs", "box"];
    const CATEGORY_OPTIONS = ["Grocery", "GENERAL", "Vegetable", "Spices"];

    useEffect(() => {
        if (item) {
            setName(item.name || "");
            setUnit(item.unit || "");
            setCategory(item.category || "");
            setMinStock(item.minimum_stock_level ?? "");
        }
    }, [item]);

    const handleSubmit = async () => {
        if (!item?.id || !token) return;

        if (!name.trim()) return alert("Name is required");
        if (!unit) return alert("Unit is required");
        if (!category) return alert("Category is required");

        setSubmitting(true);
        try {
            const resp = await fetch(`${base}/store-items/${item.id}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: name.trim(),
                    unit,
                    category,
                    minimum_stock_level: Number(minStock || 0),
                }),
            });

            const data = await resp.json();

            if (resp.ok && data?.success !== false) {
                onClose();
                onSuccess?.();
            } else {
                alert(data?.message || "Update failed");
            }
        } catch (e) {
            console.error("Update item error:", e);
            alert("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            scroll="body"   // ✅ stop internal scroll
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden", // ✅ hide any inner overflow
                    maxHeight: "none",  // ✅ remove MUI max-height that causes scroll
                },
            }}
        >
            {/* Header */}
            <Box sx={{ px: 3, pt: 2, display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Update Item
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Divider */}
            <Box
                sx={{
                    width: "100%",
                    height: 14,
                    backgroundImage: `url(${dividerImg})`,
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    mb: 2,
                }}
            />

            <DialogContent sx={{ pt: 0, px: 3, pb: 3, overflow: "hidden" }}>
                <Grid container spacing={2}>
                    {/* Name */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>

                    {/* Unit */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Unit</InputLabel>
                            <Select value={unit} label="Unit" onChange={(e) => setUnit(e.target.value)}>
                                {UNIT_OPTIONS.map((u) => (
                                    <MenuItem key={u} value={u}>
                                        {u}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {CATEGORY_OPTIONS.map((c) => (
                                    <MenuItem key={c} value={c}>
                                        {c}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Minimum Stock */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Minimum Stock Level"
                            value={minStock}
                            onChange={(e) => setMinStock(e.target.value)}
                        />
                    </Grid>

                    {/* Submit */}
                    <Grid item xs={12} sx={{ textAlign: "right", mt: 1 }}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={submitting}
                            sx={{ minWidth: 140 }}
                        >
                            {submitting ? <CircularProgress size={20} /> : "Update"}
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
