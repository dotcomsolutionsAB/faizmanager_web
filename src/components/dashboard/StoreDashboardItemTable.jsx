import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useUser } from "../../contexts/UserContext";
import divider from "../../assets/divider.png";

const formatDate = (d) => {
    if (!d) return "";
    try {
        return new Date(d).toLocaleDateString();
    } catch {
        return d;
    }
};

export default function StoreDashboardItemTable() {
    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    // Table states
    const [items, setItems] = useState([]);
    const [loadingFirst, setLoadingFirst] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Pagination (you can adjust)
    const LIMIT = 30;
    const [offset, setOffset] = useState(0);

    const containerRef = useRef(null);

    const headers = useMemo(
        () => ({
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        }),
        [token]
    );

    /**
     * IMPORTANT:
     * This expects API to support: /store-items?limit=30&offset=0
     * If your API uses page/per_page instead, change the URL builder below.
     */
    const fetchPage = async ({ reset = false } = {}) => {
        if (!token) return;

        // prevent double requests
        if (reset) {
            setLoadingFirst(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const nextOffset = reset ? 0 : offset;

            const url = `${base}/store-items?limit=${LIMIT}&offset=${nextOffset}`;
            const resp = await fetch(url, { method: "GET", headers });

            if (!resp.ok) throw new Error("Failed to fetch store items");
            const json = await resp.json();

            // your current API: { data: [...] }
            // if later you return { data: { data: [...] , total: ... } } then adjust here
            const rows = Array.isArray(json?.data) ? json.data : [];

            if (reset) {
                setItems(rows);
                setOffset(rows.length); // next offset
            } else {
                setItems((prev) => {
                    // avoid duplicate items if API sends overlap
                    const seen = new Set(prev.map((x) => x.id));
                    const merged = [...prev];
                    for (const r of rows) {
                        if (!seen.has(r.id)) merged.push(r);
                    }
                    return merged;
                });
                setOffset((prev) => prev + rows.length);
            }

            // If returned rows are less than LIMIT => no more data
            setHasMore(rows.length === LIMIT);
        } catch (e) {
            console.error("StoreDashboardItemTable error:", e);
            if (reset) setItems([]);
            setHasMore(false);
        } finally {
            setLoadingFirst(false);
            setLoadingMore(false);
        }
    };

    // Initial load
    useEffect(() => {
        if (token) fetchPage({ reset: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, base]);

    // Infinite load on scroll
    const handleScroll = (e) => {
        const el = e.currentTarget;
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;

        if (nearBottom && hasMore && !loadingFirst && !loadingMore) {
            fetchPage({ reset: false });
        }
    };

    const handleRefresh = () => {
        setHasMore(true);
        setOffset(0);
        if (containerRef.current) containerRef.current.scrollTop = 0;
        fetchPage({ reset: true });
    };

    return (
        <Box
            sx={{
                minWidth: { xs: 250, sm: 350, md: 500 },
                width: "100%",
                height: { xs: 'auto', md: 500 },
                backgroundColor: "#FAFAFA",
                borderRadius: 2,
                boxShadow: 3,
                padding: 2,
            }}
        >
            {/* Title */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Items
                </Typography>

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleRefresh}
                    disabled={loadingFirst}
                    sx={{
                        borderRadius: "50%",
                        padding: 1.5,
                        minWidth: "auto",
                        height: { xs: 35, sm: 40 },
                        width: { xs: 35, sm: 40 },
                    }}
                >
                    {loadingFirst ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                </Button>
            </Box>

            {/* Divider */}
            <Box
                sx={{
                    width: "calc(100% + 32px)",   // expands beyond card padding
                    ml: "-16px",
                    mr: "-16px",
                    height: { xs: 10, sm: 15, md: 15 },
                    backgroundImage: `url(${divider})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "center",
                    my: 2,
                    // display: "block",
                }}
            />

            {loadingFirst ? (
                <Box sx={{ display: "flex", justifyContent: "center", padding: 5, }}>
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
                        maxHeight: { xs: 360, md: 400 }, // scroll area
                        overflowY: "auto",
                        // "scrollbar shows on hover" effect (browser dependent)
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
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
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
                                    </TableRow>
                                ))
                            )}

                            {/* Loading more row */}
                            {loadingMore && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                                        <CircularProgress size={22} />
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* End message */}
                            {!hasMore && items.length > 0 && (
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
        </Box>
    );
}
