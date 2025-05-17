import React, { useState, useEffect } from "react";
import {
    Box, Typography, Grid, TextField, Button, Snackbar, Alert,
    IconButton, Collapse, CssBaseline, FormControl, InputLabel,
    Select, MenuItem, Chip, Tooltip
} from "@mui/material";
import AppTheme from "../../../styles/AppTheme";
import { yellow } from "../../../styles/ThemePrimitives";
import divider from '../../../assets/divider.png';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import { useUser } from "../../../UserContext";
import CancelIcon from "@mui/icons-material/Cancel";

const PaymentsForm = () => {
    const {token} = useUser();
    const [collapsed, setCollapsed] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [receiptNos, setReceiptNos] = useState([]);
    const [selectedReceipts, setSelectedReceipts] = useState([]);

    const handleCollapseToggle = () => setCollapsed((prev) => !prev);
    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await fetch("https://api.fmb52.com/api/receipts/pending", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        mode: "cash",
                        sector: "burhani",
                        sub_sector: ""
                    })
                });
                const data = await response.json();
                console.log("pending receipts: ", data)
                if (data?.data) {
                    setReceiptNos(data.data);
                }
            } catch (err) {
                console.error("Error fetching receipt numbers:", err);
            }
        };
        fetchReceipts();
    }, []);

    return (
        <AppTheme>
            <CssBaseline />
            <Box sx={{
                mt: 20, pt: 2, pb: 3, px: 3, mx: 2, mb: 1,
                backgroundColor: "#fff",
                border: "1px solid #F4EBD0",
                borderRadius: 2,
                boxShadow: 1
            }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, p: "8px 16px", borderRadius: 1 }}>
                        Add Payment
                    </Typography>
                    <IconButton onClick={handleCollapseToggle} sx={{ color: yellow[300], "&:hover": { color: yellow[400] } }}>
                        {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </IconButton>
                </Box>

                {!collapsed && (
                    <Box sx={{
                        width: "calc(100% + 48px)",
                        height: 15,
                        backgroundImage: `url(${divider})`,
                        backgroundRepeat: "repeat-x",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        marginLeft: "-24px",
                        marginRight: "-24px",
                        mb: 2,
                    }} />
                )}

                <Collapse in={!collapsed}>
                    <Grid container spacing={3} alignItems="center" sx={{ pr: 5 }}>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} md={4}>
<FormControl fullWidth>
  <InputLabel>Select Receipt No(s)</InputLabel>
  <Select
    multiple
    value={selectedReceipts.map(String)} // Ensure all values are strings
    onChange={(e) => {
      const { value } = e.target;
      setSelectedReceipts(typeof value === 'string' ? value.split(',') : value);
    }}
    renderValue={(selected) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {selected.map((val) => (
          <Chip
            key={val}
            label={val}
            onMouseDown={(e) => e.stopPropagation()}
            onDelete={() =>
              setSelectedReceipts((prev) => prev.filter((v) => v !== val))
            }
            deleteIcon={<CancelIcon />}
          />
        ))}
      </Box>
    )}
    sx={{ border: "1px solid #F4EBD0", borderRadius: "8px" }}
    MenuProps={{
      PaperProps: {
        style: {
          maxHeight: 300,
          width: 300,
        },
      },
    }}
  >
    {receiptNos.map((r) => (
      <MenuItem key={`${r.receipt_no}-${r.id}`} value={r.receipt_no}>
        {r.receipt_no} - {r.name} - ₹{r.amount}
      </MenuItem>
    ))}
  </Select>
</FormControl>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth label="Amount" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Comments" multiline rows={3} />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "right" }}>
                            <Button variant="contained" color="primary"
                                sx={{
                                    color: "white", backgroundColor: yellow[300],
                                    "&:hover": { backgroundColor: yellow[200], color: "#000" }
                                }}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Collapse>

            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AppTheme>
    );
};

export default PaymentsForm;
