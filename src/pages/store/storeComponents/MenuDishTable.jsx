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
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import dividerImg from "../../../assets/divider.png";
import { useUser } from "../../../contexts/UserContext";

export default function MenuDishTable() {
    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const [dishes, setDishes] = useState([]);
    const [loadingFirst, setLoadingFirst] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [itemFilter, setItemFilter] = useState(""); // item name for now

    const LIMIT = 30;
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

    const normalize = (s) => String(s ?? "").trim().toLowerCase();

    const getDishItemsText = (dish) => {
        const arr = Array.isArray(dish?.items) ? dish.items : [];
        const names = arr
            .map((x) => x?.item?.name)
            .filter(Boolean)
            .map((n) => String(n));
        // unique + readable
        return Array.from(new Set(names)).join(", ");
    };

    const applyClientFilters = (rows) => {
        // NOTE: your /store-dishes currently returns full list (no pagination params shown).
        // So we do filtering client-side for now.
        let out = Array.isArray(rows) ? rows : [];

        const s = normalize(search);
        const c = normalize(category);
        const it = normalize(itemFilter);

        if (s) out = out.filter((d) => normalize(d?.name).includes(s));
        if (c) out = out.filter((d) => normalize(d?.category) === c);

        if (it) {
            out = out.filter((d) => {
                const items = Array.isArray(d?.items) ? d.items : [];
                return items.some((x) => normalize(x?.item?.name) === it);
            });
        }

        return out;
    };

    const fetchPage = async ({ reset = false } = {}) => {
        if (!token) return;

        reset ? setLoadingFirst(true) : setLoadingMore(true);

        try {
            // Your API sample returns array in data (no pagination)
            // If later you add ?limit&offset support, we can switch.
            const url = `${base}/store-dishes`;
            const resp = await fetch(url, { method: "GET", headers });
            if (!resp.ok) throw new Error("Failed to fetch store dishes");

            const json = await resp.json();
            const rowsRaw = Array.isArray(json?.data) ? json.data : [];

            const rows = applyClientFilters(rowsRaw);

            // For now: we’ll still keep “infinite” style, but since backend is not paged,
            // we show the first LIMIT and simulate paging from filtered list.
            const start = reset ? 0 : offset;
            const nextChunk = rows.slice(start, start + LIMIT);

            if (reset) {
                setDishes(nextChunk);
                setOffset(nextChunk.length);
            } else {
                setDishes((prev) => {
                    const seen = new Set(prev.map((x) => x.id));
                    const merged = [...prev];
                    for (const r of nextChunk) if (!seen.has(r.id)) merged.push(r);
                    return merged;
                });
                setOffset((prev) => prev + nextChunk.length);
            }

            setHasMore(start + LIMIT < rows.length);
        } catch (e) {
            console.error("StoreDishTable error:", e);
            if (reset) setDishes([]);
            setHasMore(false);
        } finally {
            setLoadingFirst(false);
            setLoadingMore(false);
        }
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

    // Reload on filters (debounced)
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
    }, [search, category, itemFilter]);

    const handleScroll = (e) => {
        const el = e.currentTarget;
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;

        if (nearBottom && hasMore && !loadingFirst && !loadingMore) {
            fetchPage({ reset: false });
        }
    };

    // Filters options derived from current loaded/available data (works because API gives full list)
    // For better UX, we derive from the currently shown dishes + also keep stable list after first fetch.
    const categoryOptions = useMemo(() => {
        const set = new Set();
        for (const d of dishes) if (d?.category) set.add(String(d.category));
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [dishes]);

    const itemOptions = useMemo(() => {
        const set = new Set();
        for (const d of dishes) {
            const arr = Array.isArray(d?.items) ? d.items : [];
            for (const x of arr) {
                const nm = x?.item?.name;
                if (nm) set.add(String(nm));
            }
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [dishes]);

    // Export (placeholder endpoint — change when you create it)
    const handleExportExcel = () => {
        const params = new URLSearchParams();
        if (search?.trim()) params.set("search", search.trim());
        if (category) params.set("category", category);
        if (itemFilter) params.set("item", itemFilter);

        // Change this to your real export route when ready:
        const url = `${base}/store-dishes/export/excel?${params.toString()}`;
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
    const onUpdateStock = (row) => {
        console.log("Update Stock (Dish):", row);
        closeMenu();
    };
    const onUpdate = (row) => {
        console.log("Update (Dish):", row);
        closeMenu();
    };
    const onDelete = (row) => {
        console.log("Delete (Dish):", row);
        closeMenu();
    };

    return (
        <>
            <CssBaseline />
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
                        Store Dishes
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
                            placeholder="Search dish..."
                            sx={{ width: { xs: "100%", sm: 220 } }}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ display: "flex", alignItems: "center", mr: 1, color: "text.secondary" }}>
                                        <SearchIcon fontSize="small" />
                                    </Box>
                                ),
                            }}
                        />

                        {/* Category */}
                        <FormControl size="small" sx={{ width: { xs: "100%", sm: 200 } }}>
                            <InputLabel id="store-dish-category-label">Category</InputLabel>
                            <Select
                                labelId="store-dish-category-label"
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

                        {/* Items */}
                        <FormControl size="small" sx={{ width: { xs: "100%", sm: 220 } }}>
                            <InputLabel id="store-dish-item-label">Items</InputLabel>
                            <Select
                                labelId="store-dish-item-label"
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
                                        <TableCell sx={{ fontWeight: "bold" }}>Dish Name</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Item Used</TableCell>
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "right", width: 80 }}>
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {dishes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                                No dishes found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        dishes.map((d) => (
                                            <TableRow
                                                key={d.id}
                                                hover
                                                sx={{
                                                    transition: "0.2s",
                                                    "&:hover": { backgroundColor: "rgba(0,0,0,0.03)" },
                                                }}
                                            >
                                                <TableCell sx={{ fontWeight: 700 }}>{d.name}</TableCell>
                                                <TableCell sx={{ color: "text.secondary" }}>{d.category || "-"}</TableCell>

                                                <TableCell sx={{ color: "text.secondary" }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                                                        {getDishItemsText(d) || "-"}
                                                    </Typography>
                                                    {/* optional small line */}
                                                    <Typography variant="caption" color="text.secondary">
                                                        Updated: {d.updated_at ? new Date(d.updated_at).toLocaleDateString() : "-"}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell sx={{ textAlign: "right" }}>
                                                    <IconButton size="small" onClick={(e) => openMenu(e, d)} aria-label="more">
                                                        <MoreVertIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}

                                    {loadingMore && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                                                <CircularProgress size={22} />
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!hasMore && dishes.length > 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 2, color: "text.secondary" }}>
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
