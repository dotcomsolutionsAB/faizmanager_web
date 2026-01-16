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
    CssBaseline,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Button } from "@mui/material"; // if Button not already imported
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import dividerImg from "../../../assets/divider.png";
import { useUser } from "../../../contexts/UserContext";
import { formatDateToDDMMYYYY } from "../../../util";

const formatDate = (d) => {
    return formatDateToDDMMYYYY(d);
};

export default function StoreItemTable() {
    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const [items, setItems] = useState([]);
    const [loadingFirst, setLoadingFirst] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const LIMIT = 30;
    const [offset, setOffset] = useState(0);

    const containerRef = useRef(null);

    // Action menu state
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

    const buildUrl = ({ nextOffset }) => {
        // NOTE: backend should support these params.
        const params = new URLSearchParams();
        params.set("limit", String(LIMIT));
        params.set("offset", String(nextOffset));

        if (search?.trim()) params.set("search", search.trim());
        if (category) params.set("category", category);

        return `${base}/store-items?${params.toString()}`;
    };

    const fetchPage = async ({ reset = false } = {}) => {
        if (!token) return;

        reset ? setLoadingFirst(true) : setLoadingMore(true);

        try {
            const nextOffset = reset ? 0 : offset;
            const url = buildUrl({ nextOffset });

            const resp = await fetch(url, { method: "GET", headers });
            if (!resp.ok) throw new Error("Failed to fetch store items");

            const json = await resp.json();
            const rows = Array.isArray(json?.data) ? json.data : [];

            if (reset) {
                setItems(rows);
                setOffset(rows.length);
            } else {
                setItems((prev) => {
                    const seen = new Set(prev.map((x) => x.id));
                    const merged = [...prev];
                    for (const r of rows) if (!seen.has(r.id)) merged.push(r);
                    return merged;
                });
                setOffset((prev) => prev + rows.length);
            }

            setHasMore(rows.length === LIMIT);
        } catch (e) {
            console.error("StoreItemTable error:", e);
            if (reset) setItems([]);
            setHasMore(false);
        } finally {
            setLoadingFirst(false);
            setLoadingMore(false);
        }
    };

    const handleExportExcel = () => {
        // use same filters (search/category) if your backend supports them
        const params = new URLSearchParams();
        if (search?.trim()) params.set("search", search.trim());
        if (category) params.set("category", category);

        // your existing route (change if different)
        const url = `${base}/store-items/export/excel?${params.toString()}`;

        // simplest: open download in new tab
        window.open(url, "_blank");
    };

    // Initial load
    useEffect(() => {
        if (token) {
            setHasMore(true);
            setOffset(0);
            if (containerRef.current) containerRef.current.scrollTop = 0;
            fetchPage({ reset: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, base]);

    // Re-load on filter change (debounced search)
    useEffect(() => {
        if (!token) return;

        const t = setTimeout(() => {
            setHasMore(true);
            setOffset(0);
            if (containerRef.current) containerRef.current.scrollTop = 0;
            fetchPage({ reset: true });
        }, 350);

        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, category]);

    const handleScroll = (e) => {
        const el = e.currentTarget;
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;

        if (nearBottom && hasMore && !loadingFirst && !loadingMore) {
            fetchPage({ reset: false });
        }
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

    // Placeholder actions (wire APIs later)
    const onUpdateStock = (row) => {
        console.log("Update Stock:", row);
        closeMenu();
    };
    const onUpdate = (row) => {
        console.log("Update:", row);
        closeMenu();
    };
    const onDelete = (row) => {
        console.log("Delete:", row);
        closeMenu();
    };

    // Category options derived from loaded items (for now)
    const categoryOptions = useMemo(() => {
        const set = new Set();
        for (const it of items) {
            if (it?.category) set.add(String(it.category));
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [items]);

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
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 1.5,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Store Items
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
                            placeholder="Search items..."
                            sx={{ width: { xs: "100%", sm: 260 } }}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ display: "flex", alignItems: "center", mr: 1, color: "text.secondary" }}>
                                        <SearchIcon fontSize="small" />
                                    </Box>
                                ),
                            }}
                        />

                        <FormControl size="small" sx={{ width: { xs: "100%", sm: 220 } }}>
                            <InputLabel id="store-items-category-label">Category</InputLabel>
                            <Select
                                labelId="store-items-category-label"
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
                        <Button
                            variant="contained"
                            onClick={handleExportExcel}
                            startIcon={<FileDownloadOutlinedIcon />}
                            sx={{ height: 40 }}
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
                                        <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Last Purchase</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Current Stock</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "right", width: 80 }}>
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                                No items found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.map((it) => (
                                            <TableRow
                                                key={it.id}
                                                hover
                                                sx={{
                                                    transition: "0.2s",
                                                    "&:hover": { backgroundColor: "rgba(0,0,0,0.03)" },
                                                }}
                                            >
                                                <TableCell sx={{ fontWeight: 600 }}>{it.name}</TableCell>
                                                <TableCell sx={{ color: "text.secondary" }}>{it.category || "-"}</TableCell>

                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {it.last_purchase ?? "-"}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(it.date || it.current_stock_date || it.updated_at)}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell sx={{ textAlign: "right", fontWeight: 700 }}>
                                                    {it.current_stock ?? 0}
                                                </TableCell>

                                                <TableCell sx={{ textAlign: "right" }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => openMenu(e, it)}
                                                        aria-label="more"
                                                    >
                                                        <MoreVertIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}

                                    {loadingMore && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                                                <CircularProgress size={22} />
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!hasMore && items.length > 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 2, color: "text.secondary" }}>
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
                    <MenuItem onClick={() => onUpdateStock(menuRow)}>
                        <ListItemIcon>
                            <Inventory2OutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Update Stock</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => onUpdate(menuRow)}>
                        <ListItemIcon>
                            <EditOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Update</ListItemText>
                    </MenuItem>

                    <Divider />

                    <MenuItem
                        onClick={() => onDelete(menuRow)}
                        sx={{ color: "error.main" }}
                    >
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
