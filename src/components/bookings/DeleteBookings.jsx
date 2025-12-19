// src/.../DeleteBookings.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";
import divider from '../../assets/divider.png';


const DeleteBookings = ({
  open,
  title = "Delete",
  description = "Are you sure you want to delete this record?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle>{title}</DialogTitle>
      <Box
              sx={{
                width: 'calc(100% + 24px)',
                position: 'relative',
                height: 15,
                backgroundImage: `url(${divider})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'repeat-x',
                backgroundPosition: 'center',
                marginLeft: '-24px',
                marginRight: '-24px',
              }}
            />

      <DialogContent>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} color="primary" variant="outilned">
          {cancelLabel}
        </Button>
        <Button
          color="primary" variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBookings;
