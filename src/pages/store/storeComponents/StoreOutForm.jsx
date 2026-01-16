import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    CssBaseline,
    Grid,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Collapse,
    Divider,
} from "@mui/material";
import { yellow } from "../../../styles/ThemePrimitives";
import dividerImg from "../../../assets/divider.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useUser } from "../../../contexts/UserContext";

const todayISO = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const safeText = (v) => (v === null || v === undefined ? "" : String(v));
const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};
const formatMoney = (v) =>
    toNum(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function StoreOutForm({ onSuccess }) {
    const formRef = useRef(null);
    const snackbarTimerRef = useRef(null);

    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const [collapsed, setCollapsed] = useState(false);
    const [loadingMeta, setLoadingMeta] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Header fields
    const [date, setDate] = useState(todayISO());
    const [miqat, setMiqat] = useState("");
    const [noOfThali, setNoOfThali] = useState("");

    // Row 2 fields (as you asked)
    const [menuText, setMenuText] = useState(""); // "Menu Dish (50)"
    const [remarks, setRemarks] = useState(""); // "Remarks (50)"

    // Cost calculation fields (like image)
    const [nazrulMaqam, setNazrulMaqam] = useState("");
    const [laagat, setLaagat] = useState("");
    const [cooking, setCooking] = useState("");
    const [labour, setLabour] = useState("");
    const [ikram, setIkram] = useState("");
    const [dailyBazaar, setDailyBazaar] = useState("");
    const [storePurchase, setStorePurchase] = useState("");
    const [chicken, setChicken] = useState("");
    const [mutton, setMutton] = useState("");

    // Optional: allow overriding grand total
    const [grandTotalOverride, setGrandTotalOverride] = useState("");

    // Meta
    const [dishOptions, setDishOptions] = useState([]); // from /store-dishes
    const [itemOptions, setItemOptions] = useState([]); // from /store-items
    const [unitOptions, setUnitOptions] = useState([]); // from /store/units

    // Repeater rows
    const [rows, setRows] = useState([
        { dish_id: "", item_id: "", qty: "", unit: "", rate: "", total: 0, current_stock: "" },
    ]);

    // Snackbar (2 sec auto hide)
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

    const handleCollapseToggle = () => setCollapsed((p) => !p);

    const fetchMeta = async () => {
        if (!token || loadingMeta) return;
        setLoadingMeta(true);

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            };

            const [dResp, iResp, uResp] = await Promise.all([
                fetch(`${base}/store-dishes`, { method: "GET", headers }),
                fetch(`${base}/store-items`, { method: "GET", headers }),
                fetch(`${base}/store/units`, { method: "GET", headers }),
            ]);

            const dJson = await dResp.json();
            const iJson = await iResp.json();
            const uJson = await uResp.json();

            setDishOptions(Array.isArray(dJson?.data) ? dJson.data : []);
            setItemOptions(Array.isArray(iJson?.data) ? iJson.data : []);
            setUnitOptions(Array.isArray(uJson?.data?.units) ? uJson.data.units : []);
        } catch (e) {
            console.error("StoreOut meta fetch failed:", e);
            setDishOptions([]);
            setItemOptions([]);
            setUnitOptions([]);
            showSnackbar("Unable to fetch dishes/items/units.", "error");
        } finally {
            setLoadingMeta(false);
        }
    };

    useEffect(() => {
        fetchMeta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const findItem = (id) => {
        const nid = Number(id);
        if (!nid) return null;
        return itemOptions.find((x) => Number(x?.id) === nid) || null;
    };

    const recalcRow = (r) => {
        const qty = toNum(r.qty);
        const rate = toNum(r.rate);
        const total = qty * rate;
        return { ...r, total };
    };

    const updateRow = (idx, patch) => {
        setRows((prev) => {
            const copy = prev.map((r, i) => (i === idx ? { ...r, ...patch } : r));
            copy[idx] = recalcRow(copy[idx]);
            return copy;
        });
    };

    const onSelectItem = (idx, itemId) => {
        const it = findItem(itemId);
        updateRow(idx, {
            item_id: itemId,
            unit: it?.unit ? String(it.unit) : "",
            current_stock: it?.current_stock ?? "",
            // rate stays as user input
        });
    };

    const addRow = () => {
        setRows((p) => [
            ...p,
            { dish_id: "", item_id: "", qty: "", unit: "", rate: "", total: 0, current_stock: "" },
        ]);
    };

    const removeRow = (idx) => {
        setRows((prev) => {
            const copy = [...prev];
            copy.splice(idx, 1);
            return copy.length
                ? copy
                : [{ dish_id: "", item_id: "", qty: "", unit: "", rate: "", total: 0, current_stock: "" }];
        });
    };

    // ✅ Gross Total = sum of item totals
    const grossTotal = useMemo(() => rows.reduce((sum, r) => sum + toNum(r.total), 0), [rows]);

    // ✅ Other charges total
    const otherChargesTotal = useMemo(() => {
        return (
            toNum(nazrulMaqam) +
            toNum(laagat) +
            toNum(cooking) +
            toNum(labour) +
            toNum(ikram) +
            toNum(dailyBazaar) +
            toNum(storePurchase) +
            toNum(chicken) +
            toNum(mutton)
        );
    }, [nazrulMaqam, laagat, cooking, labour, ikram, dailyBazaar, storePurchase, chicken, mutton]);

    // ✅ Grand Total = gross + charges (auto, but editable)
    const grandTotalAuto = useMemo(() => grossTotal + otherChargesTotal, [grossTotal, otherChargesTotal]);
    const grandTotalShown = grandTotalOverride !== "" ? toNum(grandTotalOverride) : grandTotalAuto;

    const validate = () => {
        if (!date) return "Date is required.";
        if (!miqat.trim()) return "Miqaat is required.";
        if (!(toNum(noOfThali) > 0)) return "No of Thali must be greater than 0.";

        const cleaned = rows
            .map((r) => ({
                dish_id: Number(r.dish_id),
                item_id: Number(r.item_id),
                qty: toNum(r.qty),
                rate: toNum(r.rate),
            }))
            .filter((x) => x.item_id || x.dish_id);

        if (cleaned.length === 0) return "Please add at least 1 item row.";

        const bad = cleaned.find((x) => !x.dish_id || !x.item_id || !(x.qty > 0));
        if (bad) return "Each row must have Dish, Item and Qty > 0.";

        return null;
    };

    const resetForm = () => {
        setDate(todayISO());
        setMiqat("");
        setNoOfThali("");
        setMenuText("");
        setRemarks("");

        setNazrulMaqam("");
        setLaagat("");
        setCooking("");
        setLabour("");
        setIkram("");
        setDailyBazaar("");
        setStorePurchase("");
        setChicken("");
        setMutton("");
        setGrandTotalOverride("");

        setRows([{ dish_id: "", item_id: "", qty: "", unit: "", rate: "", total: 0, current_stock: "" }]);
    };

    const handleSubmit = async () => {
        if (!token) return;

        const err = validate();
        if (err) return showSnackbar(err, "error");

        setSubmitting(true);
        try {
            // ✅ Combine menu + remarks into one "remarks" string (since backend payload has only remarks)
            const combinedRemarks = [
                menuText?.trim() ? `Menu: ${menuText.trim()}` : null,
                remarks?.trim() ? remarks.trim() : null,
            ]
                .filter(Boolean)
                .join(" | ");

            const payload = {
                date,
                miqat: miqat.trim(),
                no_of_thaali: toNum(noOfThali),
                remarks: combinedRemarks,

                nazrul_maqam: toNum(nazrulMaqam),
                laagat: toNum(laagat),
                cooking: toNum(cooking),
                labour: toNum(labour),
                ikram: toNum(ikram),
                daily_bazaar: toNum(dailyBazaar),
                store_purchase: toNum(storePurchase),
                chicken: toNum(chicken),
                mutton: toNum(mutton),

                items: rows
                    .filter((r) => r.dish_id && r.item_id)
                    .map((r) => ({
                        dish_id: Number(r.dish_id),
                        item_id: Number(r.item_id),
                        qty: toNum(r.qty),
                        rate: toNum(r.rate),
                    })),
            };

            const resp = await fetch(`${base}/store-out`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await resp.json();

            if (resp.ok && (data?.success === true || data?.code === 200)) {
                showSnackbar(data?.message || "StoreOut saved", "success");
                resetForm();
                if (onSuccess) onSuccess();
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                showSnackbar(data?.message || "Submission failed.", "error");
            }
        } catch (e) {
            console.error("StoreOut submit error:", e);
            showSnackbar("Error occurred during submission.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <CssBaseline />

            <Box
                ref={formRef}
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
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", marginBottom: 1, padding: "8px 16px", borderRadius: 1 }}
                    >
                        Store Out
                    </Typography>

                    <IconButton
                        onClick={handleCollapseToggle}
                        sx={{ color: yellow[300], "&:hover": { color: yellow[400] } }}
                    >
                        {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </IconButton>
                </Box>

                {!collapsed && (
                    <Box
                        sx={{
                            width: "calc(100% + 48px)",
                            position: "relative",
                            height: { xs: 10, sm: 15 },
                            backgroundImage: `url(${dividerImg})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "repeat-x",
                            backgroundPosition: "center",
                            mb: 2,
                            marginLeft: "-24px",
                            marginRight: "-24px",
                        }}
                    />
                )}

                <Collapse in={!collapsed}>
                    <Grid container spacing={2} alignItems="center" sx={{ pr: 2 }}>
                        {/* Row 1 */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Miqaat" value={miqat} onChange={(e) => setMiqat(e.target.value)} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="No of Thali"
                                value={noOfThali}
                                onChange={(e) => setNoOfThali(e.target.value)}
                                inputProps={{ min: 1, step: 1 }}
                            />
                        </Grid>

                        {/* Row 2 */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Menu Dish"
                                inputProps={{ maxLength: 50 }}
                                value={menuText}
                                onChange={(e) => setMenuText(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Remarks"
                                inputProps={{ maxLength: 50 }}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </Grid>

                        {/* Repeater */}
                        <Grid item xs={12}>
                            <Box sx={{ border: "1px dashed rgba(0,0,0,0.18)", borderRadius: 2, p: 2, mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                                    Items Used
                                </Typography>

                                {rows.map((r, idx) => (
                                    <Grid
                                        key={idx}
                                        container
                                        spacing={2}
                                        alignItems="center"
                                        sx={{
                                            mb: 1.2,
                                            pb: 1.2,
                                            borderBottom: idx === rows.length - 1 ? "none" : "1px solid rgba(0,0,0,0.06)",
                                        }}
                                    >
                                        {/* Dish */}
                                        <Grid item xs={12} md={2.5}>
                                            <FormControl fullWidth disabled={loadingMeta}>
                                                <InputLabel id={`dish-${idx}`}>Menu Dish</InputLabel>
                                                <Select
                                                    labelId={`dish-${idx}`}
                                                    value={safeText(r.dish_id)}
                                                    label="Menu Dish"
                                                    onChange={(e) => updateRow(idx, { dish_id: e.target.value })}
                                                    MenuProps={{ PaperProps: { style: { maxHeight: 380 } } }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select</em>
                                                    </MenuItem>
                                                    {dishOptions.map((d) => (
                                                        <MenuItem key={d.id} value={d.id}>
                                                            {d.name} {d.category ? `(${d.category})` : ""}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Item */}
                                        <Grid item xs={12} md={2}>
                                            <FormControl fullWidth disabled={loadingMeta}>
                                                <InputLabel id={`item-${idx}`}>Item</InputLabel>
                                                <Select
                                                    labelId={`item-${idx}`}
                                                    value={safeText(r.item_id)}
                                                    label="Item"
                                                    onChange={(e) => onSelectItem(idx, e.target.value)}
                                                    MenuProps={{ PaperProps: { style: { maxHeight: 380 } } }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select</em>
                                                    </MenuItem>
                                                    {itemOptions.map((it) => (
                                                        <MenuItem key={it.id} value={it.id}>
                                                            {it.name} {it.unit ? `(${it.unit})` : ""}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Qty */}
                                        <Grid item xs={12} sm={6} md={1.2}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Qty"
                                                value={safeText(r.qty)}
                                                onChange={(e) => updateRow(idx, { qty: e.target.value })}
                                                inputProps={{ min: 1, step: "any" }}
                                            />
                                        </Grid>

                                        {/* Unit */}
                                        <Grid item xs={12} sm={6} md={1.3}>
                                            <FormControl fullWidth disabled={loadingMeta}>
                                                <InputLabel id={`unit-${idx}`}>Unit</InputLabel>
                                                <Select
                                                    labelId={`unit-${idx}`}
                                                    value={safeText(r.unit)}
                                                    label="Unit"
                                                    onChange={(e) => updateRow(idx, { unit: e.target.value })}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select</em>
                                                    </MenuItem>
                                                    {unitOptions.map((u) => (
                                                        <MenuItem key={u} value={u}>
                                                            {u}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Rate (You asked disabled, but rate is required in payload.
                        If you want truly disabled, tell me the API to fetch rate.) */}
                                        <Grid item xs={12} sm={6} md={1.3}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Rate"
                                                value={safeText(r.rate)}
                                                onChange={(e) => updateRow(idx, { rate: e.target.value })}
                                                inputProps={{ min: 0, step: "any" }}
                                            />
                                        </Grid>

                                        {/* Total */}
                                        <Grid item xs={12} sm={6} md={1.3}>
                                            <TextField fullWidth label="Total" value={formatMoney(r.total)} InputProps={{ readOnly: true }} />
                                        </Grid>

                                        {/* Current Stock */}
                                        <Grid item xs={12} sm={6} md={1.7}>
                                            <TextField
                                                fullWidth
                                                label="Current Stock"
                                                value={safeText(r.current_stock)}
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Grid>

                                        {/* Remove */}
                                        <Grid item xs={12} sm={6} md={0.7}>
                                            <IconButton
                                                onClick={() => removeRow(idx)}
                                                disabled={rows.length === 1}
                                                title="Remove"
                                                sx={{ color: "error.main" }}
                                            >
                                                <DeleteOutlineOutlinedIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}

                                <Divider sx={{ my: 1.5 }} />

                                <Button
                                    variant="outlined"
                                    onClick={addRow}
                                    startIcon={<AddCircleOutlineIcon />}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add Row
                                </Button>
                            </Box>
                        </Grid>

                        {/* Calculation section (like image) */}
                        <Grid item xs={12}>
                            <Box sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 2, p: 2, mt: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth label="Gross Total" value={formatMoney(grossTotal)} InputProps={{ readOnly: true }} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth label="Nazrul Maqam A.S." type="number" value={nazrulMaqam} onChange={(e) => setNazrulMaqam(e.target.value)} />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth label="Laagat / Electricity / Crockery" type="number" value={laagat} onChange={(e) => setLaagat(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth label="Cooking Charges" type="number" value={cooking} onChange={(e) => setCooking(e.target.value)} />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth label="Labour Expense" type="number" value={labour} onChange={(e) => setLabour(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth label="Ikram" type="number" value={ikram} onChange={(e) => setIkram(e.target.value)} />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth label="Daily Bazaar" type="number" value={dailyBazaar} onChange={(e) => setDailyBazaar(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth label="Store Purchase" type="number" value={storePurchase} onChange={(e) => setStorePurchase(e.target.value)} />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth label="Chicken" type="number" value={chicken} onChange={(e) => setChicken(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth label="Mutton" type="number" value={mutton} onChange={(e) => setMutton(e.target.value)} />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Grand Total"
                                            type="number"
                                            value={grandTotalOverride !== "" ? grandTotalOverride : String(grandTotalAuto)}
                                            onChange={(e) => setGrandTotalOverride(e.target.value)}
                                            helperText="Auto calculated, but editable"
                                            sx={{ backgroundColor: "rgba(0,0,0,0.02)", borderRadius: 1 }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Auto Total (Gross + All Charges)"
                                            value={formatMoney(grandTotalShown)}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        {/* Submit */}
                        <Grid item xs={12} sx={{ textAlign: "right", mt: 1 }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={submitting}
                                sx={{
                                    color: "white",
                                    backgroundColor: yellow[300],
                                    "&:hover": { backgroundColor: yellow[200], color: "#000" },
                                    minWidth: 160,
                                }}
                            >
                                {submitting ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                            </Button>
                        </Grid>
                    </Grid>
                </Collapse>
            </Box>

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
