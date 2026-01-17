import React, { useEffect, useMemo, useState } from "react";
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
    IconButton,
    Button,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dividerImg from "../../../../assets/divider.png";

const safe = (v, fb = "") => (v === null || v === undefined ? fb : v);

export default function MenuDishUpdateModal({
    open,
    onClose,
    token,
    base,
    dishId,          // number
    onSuccess,
}) {
    const headers = useMemo(
        () => ({
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        }),
        [token]
    );

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [items, setItems] = useState([]); // [{ item_id, qty }]
    const [itemOptions, setItemOptions] = useState([]); // from /store-items
    const [categoryOptions, setCategoryOptions] = useState([]); // derived from items

    // ✅ load dish details + item list when open
    useEffect(() => {
        const load = async () => {
            if (!open || !dishId || !token) return;

            setLoading(true);
            try {
                // 1) dish details
                const dResp = await fetch(`${base}/store-dishes/${dishId}`, { method: "GET", headers });
                const dJson = await dResp.json();

                if (!dResp.ok || dJson?.success === false) throw new Error(dJson?.message || "Dish fetch failed");

                const dish = dJson?.data;
                setName(safe(dish?.name, ""));
                setCategory(safe(dish?.category, ""));

                const dishItems = Array.isArray(dish?.items)
                    ? dish.items.map((x) => ({
                        item_id: x?.item_id ?? x?.item?.id ?? "",
                        qty: Number(x?.qty ?? 0),
                    }))
                    : [];

                setItems(dishItems.length ? dishItems : [{ item_id: "", qty: 1 }]);

                // 2) items list for select
                const iResp = await fetch(`${base}/store-items?limit=10000&offset=0`, { method: "GET", headers });
                const iJson = await iResp.json();
                const rows = Array.isArray(iJson?.data) ? iJson.data : [];

                setItemOptions(rows);

                // categories from store items (optional)
                const cats = Array.from(new Set(rows.map((r) => r?.category).filter(Boolean))).sort((a, b) => a.localeCompare(b));
                setCategoryOptions(cats);
            } catch (e) {
                console.error("Dish update modal load error:", e);
                alert(e?.message || "Failed to load dish");
                onClose?.();
            } finally {
                setLoading(false);
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, dishId, token, base]);

    const getItemName = (id) => {
        const found = itemOptions.find((x) => String(x?.id) === String(id));
        return found?.name || `Item #${id}`;
    };

    const addRow = () => setItems((p) => [...p, { item_id: "", qty: 1 }]);
    const removeRow = (idx) => setItems((p) => (p.length <= 1 ? p : p.filter((_, i) => i !== idx)));

    const updateRow = (idx, patch) => {
        setItems((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
    };

    const handleSave = async () => {
        if (!token || !dishId) return;

        if (!name.trim()) return alert("Name is required");
        if (!category) return alert("Category is required");

        const cleaned = items
            .map((r) => ({
                item_id: r.item_id ? Number(r.item_id) : null,
                qty: Number(r.qty),
            }))
            .filter((r) => r.item_id && r.qty > 0);

        if (cleaned.length === 0) return alert("Add at least 1 item with qty");

        // prevent duplicates item_id
        const seen = new Set();
        for (const r of cleaned) {
            if (seen.has(r.item_id)) return alert("Same item added multiple times. Please keep unique items.");
            seen.add(r.item_id);
        }

        setSaving(true);
        try {
            const resp = await fetch(`${base}/store-dishes/${dishId}`, {
                method: "PUT",
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    category,
                    items: cleaned,
                }),
            });

            const json = await resp.json().catch(() => ({}));

            if (!resp.ok || json?.success === false) {
                alert(json?.message || "Update failed");
                return;
            }

            onClose?.();
            onSuccess?.(); // refresh table
        } catch (e) {
            console.error("Dish update save error:", e);
            alert("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => (!saving ? onClose?.() : null)}
            maxWidth="md"
            fullWidth
            scroll="body"
            PaperProps={{
                sx: { borderRadius: 3, overflow: "hidden", maxHeight: "none" },
            }}
        >
            {/* Header */}
            <Box sx={{ px: 3, pt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Update Dish
                </Typography>
                <IconButton onClick={onClose} size="small" disabled={saving}>
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
                    mb: 1.5,
                }}
            />

            <DialogContent sx={{ pt: 0, px: 2, pb: 3, overflow: "hidden" }}>
                {loading ? (
                    <Box sx={{ py: 5, display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Top fields */}
                        <Grid container spacing={1} sx={{ mt: 0.5 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} md={5}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                                        {/* if you have fixed dish categories, replace this list */}
                                        {categoryOptions.length ? (
                                            categoryOptions.map((c) => (
                                                <MenuItem key={c} value={c}>
                                                    {c}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <>
                                                <MenuItem value="Main Course">Main Course</MenuItem>
                                                <MenuItem value="Snacks">Snacks</MenuItem>
                                                <MenuItem value="Sweets">Sweets</MenuItem>
                                                <MenuItem value="Beverages">Beverages</MenuItem>
                                            </>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Items repeater */}
                        <Box sx={{ mt: 2, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 2, p: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                                Items
                            </Typography>

                            {items.map((r, idx) => (
                                <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 1 }}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Item</InputLabel>
                                            <Select
                                                value={r.item_id}
                                                label="Item"
                                                onChange={(e) => updateRow(idx, { item_id: e.target.value })}
                                                renderValue={(val) => (val ? getItemName(val) : "")}
                                            >
                                                {itemOptions.map((it) => (
                                                    <MenuItem key={it.id} value={it.id}>
                                                        {it.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Qty"
                                            inputProps={{ min: 0 }}
                                            value={r.qty}
                                            onChange={(e) => updateRow(idx, { qty: e.target.value })}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => removeRow(idx)}
                                            disabled={items.length <= 1}
                                            sx={{ borderRadius: 2, bgcolor: "rgba(181, 55, 55, 0.9)", color: "#fff", borderColor: "rgba(181, 55, 55, 0.9)", "&:hover": { bgcolor: "rgba(181, 55, 55, 1)", borderColor: "rgba(181, 55, 55, 1)" } }}
                                        >
                                            Remove
                                        </Button>
                                    </Grid>
                                </Grid>
                            ))}

                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                                <Button variant="outlined" onClick={addRow} sx={{ borderRadius: 2 }}>
                                    Add Row
                                </Button>
                            </Box>
                        </Box>

                        {/* Footer buttons */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                disabled={saving}
                                sx={{ minWidth: 160, borderRadius: 2 }}
                            >
                                {saving ? <CircularProgress size={20} color="inherit" /> : "Update"}
                            </Button>
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
