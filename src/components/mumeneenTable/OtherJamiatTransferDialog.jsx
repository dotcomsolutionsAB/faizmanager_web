import React, { useContext, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    Typography,
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    TextField,
    Snackbar,
    Alert,
        InputLabel,
    FormControl,
} from '@mui/material';
import { useUser } from '../../UserContext'; // Assuming this is the context for user info
import divider from '../../assets/divider.png';

const OtherJamiatTransferDialog = ({ open, onClose, row, onSave, formatCurrency, year }) => {

     const handleSave = () => {
        console.log("Hello");
    };


    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Other Jamiat Transfer</DialogTitle>
                <Box
                    sx={{
                        width: 'calc(100% + 24px)',
                        position: 'relative',
                        height: {
                            xs: 10,
                            sm: 15,
                            md: 15,
                            lg: 15,
                            xl: 15,
                        },
                        backgroundImage: `url(${divider})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: 'center',
                        marginLeft: '-24px',
                        marginRight: '-24px',
                    }}
                />
                <DialogContent>
                    <Box
                        component={Paper}
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: '#F7F4F1',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                         <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
      Are you sure you want to transfer this family out of jamiat?
    </Typography>
                               
   
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="primary" variant="outlined">
                        No
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OtherJamiatTransferDialog;
