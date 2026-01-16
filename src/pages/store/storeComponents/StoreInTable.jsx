import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    CssBaseline,
    IconButton,
    Collapse,
    Stack,
    Button,
    Divider,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CardContent,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

import AppTheme from "../../../styles/AppTheme";
import dividerImg from "../../../assets/divider.png";
import { useUser } from "../../../contexts/UserContext";
import { formatDateToDDMMYYYY } from "../../../util";

const formatDate = (iso) => {
    return formatDateToDDMMYYYY(iso);
};

const formatMoney = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    const n = Number(val);
    if (Number.isNaN(n)) return String(val);
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const safeText = (v, fallback = "—") => (v === null || v === undefined || v === "" ? fallback : v);

const normalize = (s) => String(s ?? "").trim().toLowerCase();
const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

const StoreInTable = () => {
    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    // pagination
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(20);
    const offset = useMemo(() => page * limit, [page, limit]);

    // expand rows
    const [openMap, setOpenMap] = useState({}); // { [id]: boolean }

    // filters
    const [search, setSearch] = useState("");
    const [vendorFilter, setVendorFilter] = useState("");
    const [itemFilter, setItemFilter] = useState("");

    // (same behavior as your old code; API doesn't return total count)
    const hasNext = rows.length === limit;

    const toggleRow = (id) => setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = {
                Accept: "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            };

            const url = `${base}/store-in?offset=${offset}&limit=${limit}`;
            const resp = await fetch(url, { method: "GET", headers });

            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            const json = await resp.json();
            const serverRows = Array.isArray(json?.data) ? json.data : [];

            // ✅ client-side filter (same API, no backend changes)
            const s = normalize(search);
            const v = normalize(vendorFilter);
            const it = normalize(itemFilter);

            const filtered = serverRows.filter((r) => {
                const vendorName =
                    typeof r?.vendor === "string"
                        ? r.vendor
                        : r?.vendor?.name || r?.vendor?.vendor_name || (r?.vendor_id ? `Vendor #${r.vendor_id}` : "Legacy / NA");

                const matchesSearch = !s
                    ? true
                    : [
                        r?.invoice_no,
                        r?.remarks,
                        r?.vendor_id,
                        vendorName,
                        r?.date,
                        r?.total,
                        r?.transportation,
                    ]
                        .map((x) => normalize(x))
                        .join(" ")
                        .includes(s);

                const matchesVendor = !v ? true : normalize(vendorName) === v;

                const matchesItem = !it
                    ? true
                    : (Array.isArray(r?.items) ? r.items : []).some((x) => normalize(x?.item?.name) === it);

                return matchesSearch && matchesVendor && matchesItem;
            });

            setRows(filtered);
        } catch (e) {
            console.error("StoreIn fetch failed:", e);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset, limit]);

    // Re-fetch current page when filters change (debounced)
    useEffect(() => {
        const t = setTimeout(() => {
            fetchData();
        }, 350);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, vendorFilter, itemFilter]);

    const handlePrev = () => setPage((p) => Math.max(0, p - 1));
    const handleNext = () => {
        if (hasNext) setPage((p) => p + 1);
    };

    const handleLimit = (n) => {
        setPage(0);
        setLimit(n);
    };

    const VendorCell = ({ row }) => {
        const v = row?.vendor;
        const name =
            typeof v === "string"
                ? v
                : v?.name || v?.vendor_name || (row?.vendor_id ? `Vendor #${row.vendor_id}` : "Legacy / NA");

        return <>{safeText(name)}</>;
    };

    const ParticularCell = ({ row }) => {
        const remarks = safeText(row?.remarks, "");
        const transportation = safeText(row?.transportation, "");
        const itemsCount = Array.isArray(row?.items) ? row.items.length : 0;

        const topLine = [remarks ? remarks : null, transportation ? `Transport: ${formatMoney(transportation)}` : null]
            .filter(Boolean)
            .join(" • ");

        return (
            <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {topLine || "—"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {itemsCount > 0 ? `${itemsCount} item(s)` : "No items"}
                </Typography>
            </Box>
        );
    };

    const onView = (row) => {
        alert(`Open details for Store-In ID: ${row?.id}`);
    };

    // Options from CURRENT PAGE rows (same as your other pages approach)
    const vendorOptions = useMemo(() => {
        const names = rows.map((r) => {
            const v = r?.vendor;
            return typeof v === "string"
                ? v
                : v?.name || v?.vendor_name || (r?.vendor_id ? `Vendor #${r.vendor_id}` : "Legacy / NA");
        });
        return uniq(names).sort((a, b) => a.localeCompare(b));
    }, [rows]);

    const itemOptions = useMemo(() => {
        const names = [];
        for (const r of rows) {
            const its = Array.isArray(r?.items) ? r.items : [];
            for (const it of its) if (it?.item?.name) names.push(String(it.item.name));
        }
        return uniq(names).sort((a, b) => a.localeCompare(b));
    }, [rows]);

    return (
        <AppTheme>
            <CssBaseline />

            {/* ✅ Same layout style as your newer tables */}
            <Box
                sx={{
                    // mt: 2,
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
                {/* Header + Filters */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 1.5,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Store In
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.5,
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: { xs: "flex-start", md: "flex-end" },
                        }}
                    >
                        {/* Search */}
                        <TextField
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            placeholder="Search..."
                            sx={{ width: { xs: "100%", sm: 220 } }}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ display: "flex", alignItems: "center", mr: 1, color: "text.secondary" }}>
                                        <SearchIcon fontSize="small" />
                                    </Box>
                                ),
                            }}
                        />

                        {/* Vendor */}
                        <FormControl size="small" sx={{ width: { xs: "100%", sm: 220 } }}>
                            <InputLabel id="storein-vendor-label">Vendor</InputLabel>
                            <Select
                                labelId="storein-vendor-label"
                                value={vendorFilter}
                                label="Vendor"
                                onChange={(e) => setVendorFilter(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>All</em>
                                </MenuItem>
                                {vendorOptions.map((v) => (
                                    <MenuItem key={v} value={v}>
                                        {v}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Items */}
                        <FormControl size="small" sx={{ width: { xs: "100%", sm: 240 } }}>
                            <InputLabel id="storein-item-label">Items</InputLabel>
                            <Select
                                labelId="storein-item-label"
                                value={itemFilter}
                                label="Items"
                                onChange={(e) => setItemFilter(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>All</em>
                                </MenuItem>
                                {itemOptions.map((nm) => (
                                    <MenuItem key={nm} value={nm}>
                                        {nm}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Keep refresh (feature same as your code) */}
                        <Button variant="outlined" onClick={fetchData} disabled={loading} sx={{ height: 40, borderRadius: 2 }}>
                            Refresh
                        </Button>
                    </Box>
                </Box>

                {/* Divider */}
                <Box
                    sx={{
                        width: "calc(100% + 32px)",
                        ml: "-16px",
                        mr: "-16px",
                        height: { xs: 10, sm: 15 },
                        backgroundImage: `url(${dividerImg})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "repeat-x",
                        backgroundPosition: "center",
                        my: 2,
                    }}
                />

                <CardContent sx={{ pt: 0, px: 0 }}>
                    <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
                        {loading ? (
                            <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={50}></TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Vendor</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Invoice No</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }} align="right">
                                                Total
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Particular</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }} align="center" width={90}>
                                                Action
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {rows.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7}>
                                                    <Box sx={{ p: 3, textAlign: "center", opacity: 0.75 }}>No records found.</Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            rows.map((row) => {
                                                const isOpen = !!openMap[row.id];
                                                const items = Array.isArray(row?.items) ? row.items : [];

                                                return (
                                                    <React.Fragment key={row.id}>
                                                        <TableRow hover>
                                                            <TableCell>
                                                                <IconButton size="small" onClick={() => toggleRow(row.id)}>
                                                                    {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                                </IconButton>
                                                            </TableCell>

                                                            <TableCell>
                                                                <VendorCell row={row} />
                                                            </TableCell>

                                                            <TableCell sx={{ fontFamily: "monospace" }}>{safeText(row?.invoice_no)}</TableCell>

                                                            <TableCell>{formatDate(row?.date)}</TableCell>

                                                            <TableCell align="right" sx={{ fontWeight: 800 }}>
                                                                {formatMoney(row?.total)}
                                                            </TableCell>

                                                            <TableCell>
                                                                <ParticularCell row={row} />
                                                            </TableCell>

                                                            <TableCell align="center">
                                                                <IconButton size="small" onClick={() => onView(row)} title="View">
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>

                                                        {/* Expanded items */}
                                                        <TableRow>
                                                            <TableCell colSpan={7} sx={{ p: 0, borderBottom: isOpen ? "none" : undefined }}>
                                                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                                    <Box sx={{ p: 2 }}>
                                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                                                                            Items
                                                                        </Typography>

                                                                        {items.length === 0 ? (
                                                                            <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                                                                No items.
                                                                            </Typography>
                                                                        ) : (
                                                                            <Box sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 2, overflow: "hidden" }}>
                                                                                <Table size="small">
                                                                                    <TableHead>
                                                                                        <TableRow>
                                                                                            <TableCell sx={{ fontWeight: 800 }}>Item</TableCell>
                                                                                            <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                                                                                            <TableCell sx={{ fontWeight: 800 }}>Unit</TableCell>
                                                                                            <TableCell sx={{ fontWeight: 800 }} align="right">
                                                                                                Qty
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ fontWeight: 800 }} align="right">
                                                                                                Rate
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ fontWeight: 800 }} align="right">
                                                                                                Total
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    </TableHead>
                                                                                    <TableBody>
                                                                                        {items.map((it) => (
                                                                                            <TableRow key={it.id}>
                                                                                                <TableCell sx={{ fontWeight: 700 }}>{safeText(it?.item?.name)}</TableCell>
                                                                                                <TableCell>{safeText(it?.item?.category)}</TableCell>
                                                                                                <TableCell>{safeText(it?.item?.unit)}</TableCell>
                                                                                                <TableCell align="right">{safeText(it?.qty)}</TableCell>
                                                                                                <TableCell align="right">{formatMoney(it?.rate)}</TableCell>
                                                                                                <TableCell align="right" sx={{ fontWeight: 700 }}>
                                                                                                    {formatMoney(it?.total)}
                                                                                                </TableCell>
                                                                                            </TableRow>
                                                                                        ))}
                                                                                    </TableBody>
                                                                                </Table>
                                                                            </Box>
                                                                        )}

                                                                        <Divider sx={{ my: 2 }} />

                                                                        <Stack
                                                                            direction={{ xs: "column", sm: "row" }}
                                                                            spacing={1}
                                                                            justifyContent="space-between"
                                                                        >
                                                                            <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                                                                Remarks: {safeText(row?.remarks)}
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                                                                Transportation: {formatMoney(row?.transportation)} {"  "}•{"  "} Total:{" "}
                                                                                {formatMoney(row?.total)}
                                                                            </Typography>
                                                                        </Stack>
                                                                    </Box>
                                                                </Collapse>
                                                            </TableCell>
                                                        </TableRow>
                                                    </React.Fragment>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        {/* Pagination footer (same feature) */}
                        <Box sx={{ p: 2 }}>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                alignItems={{ xs: "stretch", sm: "center" }}
                                justifyContent="space-between"
                            >
                                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                                    Page: {page + 1} • Showing {rows.length} record(s)
                                </Typography>

                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button variant="outlined" onClick={() => handleLimit(10)} disabled={loading || limit === 10}>
                                        10
                                    </Button>
                                    <Button variant="outlined" onClick={() => handleLimit(20)} disabled={loading || limit === 20}>
                                        20
                                    </Button>
                                    <Button variant="outlined" onClick={() => handleLimit(50)} disabled={loading || limit === 50}>
                                        50
                                    </Button>

                                    <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: "none", sm: "block" } }} />

                                    <Button variant="outlined" onClick={handlePrev} disabled={loading || page === 0}>
                                        Prev
                                    </Button>
                                    <Button variant="contained" onClick={handleNext} disabled={loading || !hasNext}>
                                        Next
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Paper>
                </CardContent>
            </Box>
        </AppTheme>
    );
};

export default StoreInTable;
