import React, { useEffect, useMemo, useRef, useState } from "react";
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
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    CardContent,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import dividerImg from "../../../assets/divider.png";
import { useUser } from "../../../contexts/UserContext";
import StoreVendorViewModal from "./Modal/StoreVendorViewModal";

const safeText = (v, fallback = "—") => (v === null || v === undefined || v === "" ? fallback : v);
const normalize = (s) => String(s ?? "").trim().toLowerCase();
const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

export default function StoreVendorTable() {
    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const containerRef = useRef(null);

    const [allRows, setAllRows] = useState([]); // keep all vendors
    const [rows, setRows] = useState([]); // filtered rows
    const [loading, setLoading] = useState(true);

    const [viewOpen, setViewOpen] = useState(false);
    const [viewVendorId, setViewVendorId] = useState(null);

    // filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(""); // using state as "category" (until backend adds category field)

    // Action menu
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuRow, setMenuRow] = useState(null);
    const menuOpen = Boolean(menuAnchorEl);

    const headers = useMemo(
        () => ({
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        }),
        [token]
    );

    const fetchVendors = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const url = `${base}/store-vendors`;
            const resp = await fetch(url, { method: "GET", headers });
            if (!resp.ok) throw new Error("Failed to fetch vendors");

            const json = await resp.json();
            const data = Array.isArray(json?.data) ? json.data : [];
            setAllRows(data);
        } catch (e) {
            console.error("StoreVendorTable error:", e);
            setAllRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, base]);

    // filter (debounced)
    useEffect(() => {
        const t = setTimeout(() => {
            const s = normalize(search);
            const c = normalize(category);

            const filtered = allRows.filter((v) => {
                const matchesSearch = !s
                    ? true
                    : [
                        v?.vendor_code,
                        v?.name,
                        v?.mobile,
                        v?.email,
                        v?.gstin,
                        v?.city,
                        v?.state,
                        v?.remarks,
                    ]
                        .map(normalize)
                        .join(" ")
                        .includes(s);

                // "Category" is not in response; using state as category dropdown for now.
                const matchesCategory = !c ? true : normalize(v?.state) === c;

                return matchesSearch && matchesCategory;
            });

            setRows(filtered);

            if (containerRef.current) containerRef.current.scrollTop = 0;
        }, 300);

        return () => clearTimeout(t);
    }, [search, category, allRows]);

    // dropdown options (State as "Category")
    const categoryOptions = useMemo(() => {
        const vals = allRows.map((x) => safeText(x?.state, "")).filter(Boolean);
        return uniq(vals).sort((a, b) => a.localeCompare(b));
    }, [allRows]);

    // Export (placeholder route - change when ready)
    const handleExportExcel = () => {
        const params = new URLSearchParams();
        if (search?.trim()) params.set("search", search.trim());
        if (category) params.set("category", category);

        // change this when your real export endpoint is ready
        const url = `${base}/store-vendors/export/excel?${params.toString()}`;
        window.open(url, "_blank");
    };

    // Menu handlers
    const openMenu = (event, row) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuRow(row);
    };
    const closeMenu = () => {
        setMenuAnchorEl(null);
        setMenuRow(null);
    };

    // Placeholder actions
    const onView = (row) => {
        closeMenu();
        setViewVendorId(row?.id);
        setViewOpen(true);
    };

    const onEdit = (row) => {
        console.log("Edit vendor:", row);
        closeMenu();
    };
    const onDelete = (row) => {
        console.log("Delete vendor:", row);
        closeMenu();
    };

    return (
        <>
            <CssBaseline />
            <Box
                sx={{
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
                        Vendors
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
                            placeholder="Search vendor..."
                            sx={{ width: { xs: "100%", sm: 240 } }}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ display: "flex", alignItems: "center", mr: 1, color: "text.secondary" }}>
                                        <SearchIcon fontSize="small" />
                                    </Box>
                                ),
                            }}
                        />

                        {/* Category (mapped to state for now) */}
                        <FormControl size="small" sx={{ width: { xs: "100%", sm: 200 } }}>
                            <InputLabel id="vendor-category-label">Category</InputLabel>
                            <Select
                                labelId="vendor-category-label"
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>All</em>
                                </MenuItem>
                                {categoryOptions.map((c) => (
                                    <MenuItem key={c} value={c}>
                                        {c}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Export */}
                        <Button
                            variant="contained"
                            onClick={handleExportExcel}
                            startIcon={<FileDownloadOutlinedIcon />}
                            sx={{ height: 40, borderRadius: 2 }}
                        >
                            Export Excel
                        </Button>

                        {/* Refresh */}
                        <Button variant="outlined" onClick={fetchVendors} disabled={loading} sx={{ height: 40, borderRadius: 2 }}>
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
                            <TableContainer ref={containerRef}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800 }}>Vendor Code</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Mobile</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>GSTIN</TableCell>
                                            <TableCell sx={{ fontWeight: 800, textAlign: "right", width: 80 }}>
                                                Action
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {rows.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <Box sx={{ p: 3, textAlign: "center", opacity: 0.75 }}>No vendors found.</Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            rows.map((v) => (
                                                <TableRow
                                                    key={v.id}
                                                    hover
                                                    sx={{ transition: "0.2s", "&:hover": { backgroundColor: "rgba(0,0,0,0.03)" } }}
                                                >
                                                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 700 }}>
                                                        {safeText(v.vendor_code)}
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{safeText(v.name)}</TableCell>
                                                    <TableCell>{safeText(v.mobile)}</TableCell>
                                                    <TableCell>{safeText(v.email)}</TableCell>
                                                    <TableCell sx={{ fontFamily: "monospace" }}>{safeText(v.gstin)}</TableCell>

                                                    <TableCell sx={{ textAlign: "right" }}>
                                                        <IconButton size="small" onClick={(e) => openMenu(e, v)} aria-label="more">
                                                            <MoreVertIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </CardContent>

                {/* Action Menu */}
                <Menu
                    anchorEl={menuAnchorEl}
                    open={menuOpen}
                    onClose={closeMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <MenuItem onClick={() => onView(menuRow)}>
                        <ListItemIcon>
                            <VisibilityOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>View Details</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => onEdit(menuRow)}>
                        <ListItemIcon>
                            <EditOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={() => onDelete(menuRow)} sx={{ color: "error.main" }}>
                        <ListItemIcon sx={{ color: "error.main" }}>
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                </Menu>
            </Box>

            <StoreVendorViewModal
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                vendorId={viewVendorId}
                token={token}
                base={base}
            />

        </>
    );
}
