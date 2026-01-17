import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Dialog,
    DialogContent,
    Grid,
    CircularProgress,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dividerImg from "../../../../assets/divider.png";

const safeText = (v, fallback = "—") =>
    v === null || v === undefined || v === "" ? fallback : v;

export default function StoreVendorViewModal({ open, onClose, vendorId, token, base }) {
    const [loading, setLoading] = useState(false);
    const [vendor, setVendor] = useState(null);

    const headers = useMemo(
        () => ({
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        }),
        [token]
    );

    useEffect(() => {
        const fetchVendor = async () => {
            if (!open || !vendorId || !token) return;

            setLoading(true);
            setVendor(null);

            try {
                const resp = await fetch(`${base}/store-vendors/${vendorId}`, {
                    method: "GET",
                    headers,
                });

                const json = await resp.json().catch(() => ({}));

                if (!resp.ok || json?.success === false) {
                    alert(json?.message || "Unable to fetch vendor details");
                    onClose?.();
                    return;
                }

                setVendor(json?.data || null);
            } catch (e) {
                console.error("Vendor details error:", e);
                alert("Something went wrong");
                onClose?.();
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [open, vendorId, token, base, headers, onClose]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            scroll="body"
            PaperProps={{
                sx: { borderRadius: 3, overflow: "hidden", maxHeight: "none" },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 3,
                    pt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    View Details
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

            <DialogContent sx={{ pt: 0, px: 3, pb: 3 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ display: "grid", gap: 1.2 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                            {safeText(vendor?.name)}
                        </Typography>

                        <Box sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 2, p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Vendor Code
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {safeText(vendor?.vendor_code)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Mobile
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {safeText(vendor?.mobile)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {safeText(vendor?.email)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        GSTIN
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {safeText(vendor?.gstin)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Address
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {[
                                            safeText(vendor?.address_1, ""),
                                            safeText(vendor?.address_2, ""),
                                            safeText(vendor?.city, ""),
                                            safeText(vendor?.state, ""),
                                        ]
                                            .filter(Boolean)
                                            .join(", ") || "—"}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Remarks
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {safeText(vendor?.remarks)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Bank Name
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {safeText(vendor?.bank_name)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Branch
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {safeText(vendor?.branch)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Account
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {safeText(vendor?.account)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        IFSC
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {safeText(vendor?.ifs)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
