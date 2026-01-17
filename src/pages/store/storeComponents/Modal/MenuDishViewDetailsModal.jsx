import React from "react";
import {
    Box,
    Typography,
    Dialog,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dividerImg from "../../../../assets/divider.png";

const safe = (v, fb = "—") => (v === null || v === undefined || v === "" ? fb : v);

export default function MenuDishViewDetailsModal({ open, onClose, dish }) {
    const items = Array.isArray(dish?.items) ? dish.items : [];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            {/* Header */}
            <Box sx={{ px: 3, pt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    View Details
                </Typography>
                <IconButton onClick={onClose} size="small">
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

            <DialogContent sx={{ pt: 1.5, pb: 3 }}>
                {/* Dish Title */}
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, color: "#7A4A1D" }}>
                    {safe(dish?.name)}
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        borderColor: "rgba(0,0,0,0.12)",
                    }}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800 }}>Item</TableCell>
                                <TableCell sx={{ fontWeight: 800 }} align="right">
                                    Qty
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
                                        No items
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((x, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell sx={{ color: "#7A4A1D", fontWeight: 600 }}>
                                            {safe(x?.item?.name)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                                            {safe(x?.qty)} {safe(x?.item?.unit, "")}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </DialogContent>
        </Dialog>
    );
}
