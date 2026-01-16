import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Typography,
    CardContent,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Menu,
    ListItemIcon,
    ListItemText,
    Divider,
    Button,
    CssBaseline,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import dividerImg from "../../../assets/divider.png";
import { useUser } from "../../../contexts/UserContext";

const safeStr = (v) => String(v ?? "").trim();
const normalize = (s) => safeStr(s).toLowerCase();

const fmtDate = (iso) => {
    if (!iso) return "-";
    try {
        return new Date(iso).toLocaleDateString();
    } catch {
        return iso;
    }
};

export default function StoreOutTable() {
    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const [rowsAll, setRowsAll] = useState([]); // keep full list in memory (client filter)
    const [rows, setRows] = useState([]); // paged chunk shown
    const [loadingFirst, setLoadingFirst] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [dishFilter, setDishFilter] = useState(""); // dish name
    const [itemFilter, setItemFilter] = useState(""); // item name
    const [dateFilter, setDateFilter] = useState(""); // YYYY-MM-DD

    const LIMIT = 20;
    const [offset, setOffset] = useState(0);

    const containerRef = useRef(null);

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

    const getUniqueDishNames = (storeOut) => {
        const items = Array.isArray(storeOut?.items) ? storeOut.items : [];
        const names = items
            .map((x) => x?.dish?.name)
            .filter(Boolean)
            .map((n) => String(n));
        return Array.from(new Set(names));
    };

    const getUniqueItemNames = (storeOut) => {
        const items = Array.isArray(storeOut?.items) ? storeOut.items : [];
        const names = items
            .map((x) => x?.item?.name)
            .filter(Boolean)
            .map((n) => String(n));
        return Array.from(new Set(names));
    };

    const getMenuText = (storeOut) => {
        // from remarks: "... | Menu: ...."
        const r = safeStr(storeOut?.remarks);
        const idx = r.toLowerCase().indexOf("menu:");
        if (idx === -1) return "-";
        return r.slice(idx + 5).trim() || "-";
    };

    const applyClientFilters = (all) => {
        let out = Array.isArray(all) ? all : [];

        const s = normalize(search);
        const d = normalize(dishFilter);
        const it = normalize(itemFilter);
        const dt = safeStr(dateFilter); // YYYY-MM-DD

        if (s) {
            out = out.filter((x) => {
                const hay = [
                    x?.miqat,
                    x?.remarks,
                    String(x?.no_of_thaali ?? ""),
                    getMenuText(x),
                ]
                    .map(normalize)
                    .join(" ");
                return hay.includes(s);
            });
        }

        if (dt) {
            out = out.filter((x) => {
                try {
                    const d1 = new Date(x?.date);
                    const y = d1.getFullYear();
                    const m = String(d1.getMonth() + 1).padStart(2, "0");
                    const dd = String(d1.getDate()).padStart(2, "0");
                    return `${y}-${m}-${dd}` === dt;
                } catch {
                    return false;
                }
            });
        }

        if (d) {
            out = out.filter((x) => getUniqueDishNames(x).some((nm) => normalize(nm) === d));
        }

        if (it) {
            out = out.filter((x) => getUniqueItemNames(x).some((nm) => normalize(nm) === it));
        }

        return out;
    };

    const fetchAll = async () => {
        if (!token) return;

        setLoadingFirst(true);
        try {
            // NOTE: Your endpoint supports offset/limit, but we need full list for client filters + dropdowns.
            // For now we’ll just fetch a "big" chunk. Later we can switch to server-side filtering/paging.
            const url = `${base}/store-out`;
            // const url = `${base}/store-out?offset=0&limit=500`;

            const resp = await fetch(url, { method: "GET", headers });
            if (!resp.ok) throw new Error("Failed to fetch store-out");

            const json = await resp.json();
            const all = Array.isArray(json?.data) ? json.data : [];

            setRowsAll(all);

            const filtered = applyClientFilters(all);
            const first = filtered.slice(0, LIMIT);

            setRows(first);
            setOffset(first.length);
            setHasMore(LIMIT < filtered.length);

            if (containerRef.current) containerRef.current.scrollTop = 0;
        } catch (e) {
            console.error("StoreOutTable error:", e);
            setRowsAll([]);
            setRows([]);
            setHasMore(false);
        } finally {
            setLoadingFirst(false);
            setLoadingMore(false);
        }
    };

    const fetchMore = () => {
        if (loadingFirst || loadingMore || !hasMore) return;

        setLoadingMore(true);
        try {
            const filtered = applyClientFilters(rowsAll);
            const next = filtered.slice(offset, offset + LIMIT);

            setRows((prev) => {
                const seen = new Set(prev.map((x) => x.id));
                const merged = [...prev];
                for (const r of next) if (!seen.has(r.id)) merged.push(r);
                return merged;
            });

            const newOffset = offset + next.length;
            setOffset(newOffset);
            setHasMore(newOffset < filtered.length);
        } finally {
            setLoadingMore(false);
        }
    };

    // Initial load
    useEffect(() => {
        if (token) fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, base]);

    // Reload on filters (debounced)
    useEffect(() => {
        if (!token) return;
        const t = setTimeout(() => {
            const filtered = applyClientFilters(rowsAll);
            const first = filtered.slice(0, LIMIT);

            setRows(first);
            setOffset(first.length);
            setHasMore(LIMIT < filtered.length);

            if (containerRef.current) containerRef.current.scrollTop = 0;
        }, 350);

        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, dishFilter, itemFilter, dateFilter]);

    const handleScroll = (e) => {
        const el = e.currentTarget;
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
        if (nearBottom) fetchMore();
    };

    // Dropdown options from full data
    const dishOptions = useMemo(() => {
        const set = new Set();
        for (const r of rowsAll) for (const d of getUniqueDishNames(r)) set.add(String(d));
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [rowsAll]);

    const itemOptions = useMemo(() => {
        const set = new Set();
        for (const r of rowsAll) for (const it of getUniqueItemNames(r)) set.add(String(it));
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [rowsAll]);

    const handleExportExcel = () => {
        const params = new URLSearchParams();
        if (search?.trim()) params.set("search", search.trim());
        if (dishFilter) params.set("dish", dishFilter);
        if (itemFilter) params.set("item", itemFilter);
        if (dateFilter) params.set("date", dateFilter);

        // Change when your export endpoint ready:
        const url = `${base}/store-out/export/excel?${params.toString()}`;
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
    const onUpdate = (row) => {
        console.log("Update StoreOut:", row);
        closeMenu();
    };
    const onDelete = (row) => {
        console.log("Delete StoreOut:", row);
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
                        Store Out
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
                        <TextField
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            placeholder="Search..."
                            sx={{ width: { xs: "100%", sm: 200 } }}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ display: "flex", alignItems: "center", mr: 1, color: "text.secondary" }}>
                                        <SearchIcon fontSize="small" />
                                    </Box>
                                ),
                            }}
                        />

                        {/* Dish filter */}
                        <FormControl size="small" sx={{ width: { xs: "100%", sm: 200 } }}>
                            <InputLabel id="store-out-dish-label">Dishes</InputLabel>
                            <Select
                                labelId="store-out-dish-label"
                                value={dishFilter}
                                label="Dishes"
                                onChange={(e) => setDishFilter(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>All</em>
                                </MenuItem>
                                {dishOptions.map((d) => (
                                    <MenuItem key={d} value={d}>
                                        {d}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Item filter */}
                        <FormControl size="small" sx={{ width: { xs: "100%", sm: 220 } }}>
                            <InputLabel id="store-out-item-label">Items</InputLabel>
                            <Select
                                labelId="store-out-item-label"
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

                        {/* Date */}
                        <TextField
                            type="date"
                            size="small"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            sx={{ width: { xs: "100%", sm: 170 } }}
                            InputLabelProps={{ shrink: true }}
                        />

                        {/* Export */}
                        <Button
                            variant="contained"
                            onClick={handleExportExcel}
                            startIcon={<FileDownloadOutlinedIcon />}
                            sx={{ height: 40, borderRadius: 2 }}
                        >
                            Export Excel
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

                <CardContent sx={{ pt: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                    {loadingFirst ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer
                            component={Paper}
                            ref={containerRef}
                            onScroll={handleScroll}
                            sx={{
                                boxShadow: 0,
                                borderRadius: 2,
                                flex: 1,
                                maxHeight: { xs: 520, md: 560 },
                                overflowY: "auto",
                                "&::-webkit-scrollbar": { width: "8px" },
                                "&::-webkit-scrollbar-thumb": { backgroundColor: "transparent", borderRadius: "10px" },
                                "&:hover::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0,0,0,0.25)" },
                            }}
                        >
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Miqaat</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Remarks</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Menu</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Thali</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "right", width: 80 }}>
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {rows.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                                No records found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        rows.map((r) => (
                                            <TableRow
                                                key={r.id}
                                                hover
                                                sx={{ transition: "0.2s", "&:hover": { backgroundColor: "rgba(0,0,0,0.03)" } }}
                                            >
                                                <TableCell sx={{ fontWeight: 700 }}>{fmtDate(r.date)}</TableCell>
                                                <TableCell sx={{ color: "text.secondary" }}>{r.miqat || "-"}</TableCell>

                                                <TableCell sx={{ color: "text.secondary", maxWidth: 380 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }} noWrap>
                                                        {r.remarks || "-"}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Updated: {fmtDate(r.updated_at)}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell sx={{ color: "text.secondary" }}>{getMenuText(r)}</TableCell>

                                                <TableCell sx={{ textAlign: "right", fontWeight: 800 }}>
                                                    {r.no_of_thaali ?? 0}
                                                </TableCell>

                                                <TableCell sx={{ textAlign: "right" }}>
                                                    <IconButton size="small" onClick={(e) => openMenu(e, r)} aria-label="more">
                                                        <MoreVertIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}

                                    {loadingMore && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 2 }}>
                                                <CircularProgress size={22} />
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!hasMore && rows.length > 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 2, color: "text.secondary" }}>
                                                End of list
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>

                {/* Action Menu */}
                <Menu
                    anchorEl={menuAnchorEl}
                    open={menuOpen}
                    onClose={closeMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <MenuItem onClick={() => onUpdate(menuRow)}>
                        <ListItemIcon>
                            <EditOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Update</ListItemText>
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
        </>
    );
}
