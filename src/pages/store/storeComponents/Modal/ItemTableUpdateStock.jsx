import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dividerImg from "../../../../assets/divider.png";
import { yellow } from "./../../../../styles/ThemePrimitives";
import { formatDateToDDMMYYYY } from "../../../../util";

const safe = (v, fb = "") => (v === null || v === undefined ? fb : v);

export default function ItemTableUpdateStock({ open, onClose, item, token, onSuccess }) {
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const [qty, setQty] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const snackbarTimerRef = useRef(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const showSnackbar = (message, severity = "success") => {
        if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
        snackbarTimerRef.current = setTimeout(() => {
            setSnackbar((p) => ({ ...p, open: false }));
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
        };
    }, []);

    // reset on open/item change
    useEffect(() => {
        if (open) setQty("");
    }, [open, item?.id]);

    const stockDate = useMemo(() => {
        const d = item?.current_stock_date || item?.date || item?.updated_at;
        return d ? formatDateToDDMMYYYY(d) : "—";
    }, [item]);

    const handleSubmit = async () => {
        if (!item?.id || !token) return;

        const n = Number(qty);
        if (qty === "" || !Number.isFinite(n) || n < 0) {
            showSnackbar("Please enter a valid quantity.", "error");
            return;
        }

        setSubmitting(true);
        try {
            const url = `${base}/store-items/update_stock`;

            const resp = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    item_id: item.id,
                    new_stock: n,
                }),
            });

            const data = await resp.json();

            if (resp.ok && data?.success === true) {
                showSnackbar(data?.message || "Current stock updated successfully", "success");

                // close modal & refresh table
                setTimeout(() => {
                    onClose?.();
                    onSuccess?.(); // ✅ reload table
                }, 400);
            } else {
                showSnackbar(data?.message || "Failed to update stock.", "error");
            }
        } catch (e) {
            console.error("Update stock error:", e);
            showSnackbar("Error occurred while updating stock.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        overflow: "hidden",
                    },
                }}
            >
                <DialogContent sx={{ p: 0 }}>
                    {/* Header */}
                    <Box sx={{ px: 2.5, pt: 2, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                            Update Current Stock
                        </Typography>

                        <IconButton size="small" onClick={onClose} sx={{ color: "text.secondary" }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Divider like your theme */}
                    <Box
                        sx={{
                            width: "100%",
                            height: 14,
                            backgroundImage: `url(${dividerImg})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "repeat-x",
                            backgroundPosition: "center",
                        }}
                    />

                    {/* Body */}
                    <Box sx={{ px: 2.5, py: 2.2 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
                            {safe(item?.name, "—")}
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 0.4, color: "text.secondary" }}>
                            Opening stock {safe(item?.current_stock, 0)}
                            {item?.unit ? ` ${item.unit}` : ""} as on {stockDate}
                        </Typography>

                        <TextField
                            fullWidth
                            sx={{ mt: 2 }}
                            placeholder="Enter Qty"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            type="number"
                            inputProps={{ min: 0, step: "any" }}
                        />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2.5 }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={submitting}
                                sx={{
                                    px: 3.5,
                                    borderRadius: 1,
                                    color: "#fff",
                                    backgroundColor: "#7A3E0E", // close to screenshot brown
                                    "&:hover": { backgroundColor: "#6A360C" },
                                }}
                            >
                                {submitting ? <CircularProgress size={20} color="inherit" /> : "SUBMIT"}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
