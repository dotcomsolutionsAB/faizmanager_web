import React, { useContext, useState, useEffect } from 'react';
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

const AddHofDialog = ({ open, onClose, row, onSave, formatCurrency, year }) => {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [hofName, setHofName] = useState('');
    const [hofITS, setHofITS] = useState('');
    const [sector, setSector] = useState('');
    const [subSector, setSubSector] = useState('');
    const [folioNo, setFolioNo] = useState('');
    const [gender, setGender] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [sectors, setSectors] = useState([]);
    const [subSectors, setSubSectors] = useState([]);
const [filteredSubSectors, setFilteredSubSectors] = useState([]);


    const {token} = useUser()

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSave = () => {
        if (!hofName || !hofITS) {
            setSnackbar({ open: true, message: 'Please fill required fields.', severity: 'error' });
            return;
        }

        const formData = {
            hof_name: hofName,
            hof_its: hofITS,
            sector_id: sector,
            sub_sector_id: subSector,
            folio_no: folioNo,
            gender,
            mobile,
            email,
        };

        onSave(formData); // Pass back the collected data
        onClose();
    };

useEffect(() => {
  if (!open) return;

  const fetchSectorsAndSubSectors = async () => {
    try {
      // Fetch sectors
      const sectorRes = await fetch('https://api.fmb52.com/api/sector', {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
      });
      const sectorData = await sectorRes.json();
      setSectors(sectorData.data || []);

      // Fetch sub-sectors
      const subSectorRes = await fetch('https://api.fmb52.com/api/sub_sector', {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
      });
      const subSectorData = await subSectorRes.json();
      setSubSectors(subSectorData.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  fetchSectorsAndSubSectors();
}, [open]);

// Filter sub-sectors when sector is selected
    useEffect(() => {
        if (sector) {
            const filtered = subSectors.filter((ss) => ss.sector_id === parseInt(sector));
            setFilteredSubSectors(filtered);
            setSubSector(''); // Clear previous selection
        } else {
            setFilteredSubSectors([]);
        }
    }, [sector, subSectors]);


if (row === undefined) return null; // allow null as "add" mode


    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Add HOF</DialogTitle>
                <Box
                    sx={{
                        width: 'calc(100% + 24px)',
                        position: 'relative',
                        height: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 },
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
                        <Grid container spacing={2} sx={{pr: 3}}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="HOF Name"
                                    fullWidth
                                    value={hofName}
                                    onChange={(e) => setHofName(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="HOF ITS No."
                                    fullWidth
                                    value={hofITS}
                                    onChange={(e) => setHofITS(e.target.value)}
                                    required
                                />
                            </Grid>
                             <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Sector</InputLabel>
                                    <Select
                                        value={sector}
                                        label="Sector"
                                        onChange={(e) => setSector(e.target.value)}
                                    >
                                        {sectors.map((s) => (
                                            <MenuItem key={s.id} value={s.id}>
                                                {s.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                 <FormControl fullWidth>
  <InputLabel>Sub Sector</InputLabel>
  <Select
    value={subSector}
    label="Sub Sector"
    onChange={(e) => setSubSector(e.target.value)}
    disabled={!filteredSubSectors.length}
    MenuProps={{
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
      },
      getContentAnchorEl: null, // Important for MUI v4
      PaperProps: {
        style: {
          maxHeight: 300,
        },
      },
    }}
  >
    {filteredSubSectors.map((ss) => (
      <MenuItem key={ss.id} value={ss.id}>
        {ss.sub_sector_name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Folio No."
                                    fullWidth
                                    value={folioNo}
                                    onChange={(e) => setFolioNo(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        value={gender}
                                        label="Gender"
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Mobile Number"
                                    fullWidth
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        variant="contained"
                        disabled={!hofName || !hofITS}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddHofDialog;
