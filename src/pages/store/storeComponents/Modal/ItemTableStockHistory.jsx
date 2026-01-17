import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Dialog,
    DialogContent,
    IconButton,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Divider,
    Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dividerImg from "../../../../assets/divider.png";

const fmtDate = (d) => {
    if (!d) return "-";
    try {
        return new Date(d).toLocaleDateString("en-GB"); // dd/mm/yyyy
    } catch {
        return d;
    }
};

const fmtMoney = (v) => {
    if (v === null || v === undefined || v === "") return "-";
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

const fmtQty = (v) => {
    if (v === null || v === undefined || v === "") return "-";
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return n.toLocaleString("en-IN", { maximumFractionDigits: 3 });
};

export default function ItemTableStockHistory({ open, onClose, item, token, base }) {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);

    const LIMIT = 10;
    const [offset, setOffset] = useState(0);

    const headers = useMemo(
        () => ({
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        }),
        [token]
    );

    const fetchHistory = async (id, nextOffset = 0) => {
        if (!id || !token) return;
        setLoading(true);

        try {
            const url = `${base}/store-items/stock_history/${id}?limit=${LIMIT}&offset=${nextOffset}`;
            const resp = await fetch(url, { method: "GET", headers });
            const json = await resp.json();

            const data = json?.data || {};
            setMeta(data);
            setRows(Array.isArray(data?.history) ? data.history : []);
        } catch (e) {
            console.error("Stock history error:", e);
            setMeta(null);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && item?.id) {
            setOffset(0);
            fetchHistory(item.id, 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, item?.id]);

    const titleName = meta?.item?.name || item?.name || "Item";
    const currentStock = meta?.item?.current_stock ?? item?.current_stock ?? "-";

    const handlePrev = () => {
        const next = Math.max(0, offset - LIMIT);
        setOffset(next);
        fetchHistory(item.id, next);
    };

    const handleNext = () => {
        const next = offset + LIMIT;
        setOffset(next);
        fetchHistory(item.id, next);
    };

    // We don’t get total count. If API returns exactly LIMIT, assume next exists.
    const hasNext = rows.length === LIMIT;
    const hasPrev = offset > 0;

    const particulars = (r) => {
        if (r?.type === "in") {
            // show invoice + vendor
            const inv = r?.invoice_no ? `Invoice: ${r.invoice_no}` : "Invoice: -";
            const vn = r?.vendor_name ? `Vendor: ${r.vendor_name}` : r?.vendor_id ? `Vendor #${r.vendor_id}` : "";
            return [inv, vn].filter(Boolean).join(" • ");
        }
        // out
        const mq = r?.miqat ? `Miqat: ${r.miqat}` : "Miqat: -";
        return mq;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <Box sx={{ px: 3, pt: 2, pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Stock History
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Divider image like your UI */}
            <Box
                sx={{
                    width: "100%",
                    height: { xs: 10, sm: 14 },
                    backgroundImage: `url(${dividerImg})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "center",
                    mb: 2,
                }}
            />

            <DialogContent sx={{ pt: 0, pb: 3 }}>
                {/* Header row with item + current stock badge */}
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 2 }}>
                    <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: 18 }}>{titleName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Opening stock shown from history
                        </Typography>
                    </Box>

                    <Chip
                        label={`CURRENT STOCK : ${fmtQty(currentStock)}`}
                        sx={{
                            fontWeight: 800,
                            borderRadius: 2,
                            px: 1.5,
                            py: 2,
                            border: "2px solid #7A4A21",
                            // color: "#fff",
                        }}
                    />
                </Box>

                <Paper
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        borderColor: "rgba(0,0,0,0.12)",
                    }}
                >
                    {loading ? (
                        <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Particulars</TableCell>
                                    <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>Qty</TableCell>
                                    <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>Rate</TableCell>
                                    <TableCell sx={{ fontWeight: 800, textAlign: "right" }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                            No history found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map((r, idx) => {
                                        const isIn = r?.type === "in";
                                        return (
                                            <TableRow key={idx} hover>
                                                <TableCell sx={{ whiteSpace: "nowrap" }}>{fmtDate(r?.stock_date)}</TableCell>

                                                <TableCell>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                            {particulars(r)}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ fontWeight: 900, color: isIn ? "green" : "red" }}
                                                        >
                                                            {isIn ? "↑" : "↓"}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell sx={{ textAlign: "right", fontWeight: 700 }}>
                                                    {fmtQty(r?.qty)}
                                                </TableCell>

                                                <TableCell sx={{ textAlign: "right" }}>{fmtMoney(r?.rate)}</TableCell>

                                                <TableCell sx={{ textAlign: "right", fontWeight: 800 }}>
                                                    {fmtMoney(r?.total)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    )}
                </Paper>

                <Divider sx={{ my: 2 }} />

                {/* Pagination footer */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                        Showing {rows.length} record(s) • Offset: {offset}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={handlePrev} disabled={loading || !hasPrev}>
                            Prev
                        </Button>
                        <Button variant="contained" onClick={handleNext} disabled={loading || !hasNext}>
                            Next
                        </Button>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
