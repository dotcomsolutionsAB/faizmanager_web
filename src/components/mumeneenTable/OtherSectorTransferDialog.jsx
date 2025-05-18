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
        InputLabel,
    FormControl,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import { useUser } from '../../UserContext'; // Assuming this is the context for user info
import divider from '../../assets/divider.png';

const OtherSectorTransferDialog = ({ open, onClose, row, onSave, formatCurrency, year }) => {
    const [selectedSector, setSelectedSector] = useState('');
    const sectors = ['BURHANI', 'SAIFEE'];

     const handleSave = () => {
        console.log("Hello");
    };


    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Other Sector Transfer</DialogTitle>
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
 <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Sector</InputLabel>
                        <Select
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            label="Sector"
                        >
                            {sectors.map((sector, index) => (
                                <MenuItem key={index} value={sector}>
                                    {sector}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                       
                               
   
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OtherSectorTransferDialog;
