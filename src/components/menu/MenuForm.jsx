import React, { useState, useEffect, useRef } from "react";
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
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { yellow } from "../../styles/ThemePrimitives";
import AppTheme from "../../styles/AppTheme";
import divider from "../../assets/divider.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import { useUser } from "../../contexts/UserContext";
import { useOutletContext, useLocation } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';





const MenuForm = ({ menuData, onSuccess }) => {
  const formRef = useRef(null);

  const { selectedSector, selectedSubSector, selectedYear } = useOutletContext();

  const { token } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [miqaatNoThaali, setMiqaatNoThaali] = useState(false);
  const [selectedHOF, setSelectedHOF] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [menu, setMenu] = useState("");
  const [niyazBy, setNiyazBy] = useState("");
  const [sfDish, setSfDish] = useState("");
  const [sfDetails, setSfDetails] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const year = selectedYear.length ? selectedYear : "1445-1446";
  const sector = selectedSector.length ? selectedSector : ["all"];
  const subSector = selectedSubSector.length ? selectedSubSector : ["all"];

  // HOF fetching
  const [hofOptions, setHofOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const fetchHOFs = async () => {
    if (loading || !token) return;
    setLoading(true);
    try {
      const sectorParams = sector.map((s) => `sector[]=${encodeURIComponent(s)}`).join('&');
      const subSectorParams = subSector.map((s) => `sub_sector[]=${encodeURIComponent(s)}`).join('&');
      const url = `https://api.fmb52.com/api/mumeneen?year=${year}&${sectorParams}&${subSectorParams}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();
      const hofData = (data.data || []).filter((item) => item.mumeneen_type === "HOF"); // 🔥 Only HOFs
      setHofOptions(hofData);
      setApiError(null);
    } catch (error) {
      console.error("Error fetching HOFs:", error);
      setApiError("The data is currently unavailable. Please try again later.");
      setHofOptions([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchHOFs();
  }, [token]); // Re-run if token changes

  const handleCollapseToggle = () => {
    setCollapsed((prev) => !prev);
  };

  const handleSnackbarClose = () => setSnackbar((prev) => ({ ...prev, open: false }));


  // Whenever menuData changes, update form fields
  useEffect(() => {
    if (menuData) {
      // formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollTo({ top: 0, behavior: "smooth" });
      // console.log(menuData)

      setDate(menuData.date || '');
      setMenu(menuData.menu || '');
      setNiyazBy(menuData.niaz_by || '');
      setSfDish(menuData.sf_dish || '');
      setSfDetails(menuData.sf_details || '');
      setMiqaatNoThaali(menuData.status === 1);
      setSelectedHOF(menuData.family_id || '');
    } else {
      // Reset form if no menuData
      setDate(new Date().toISOString().split('T')[0]);
      setMenu('');
      setNiyazBy('');
      setSfDish('');
      setSfDetails('');
      setMiqaatNoThaali(false);
      setSelectedHOF('');
    }
  }, [menuData]);


  const handleSubmit = async () => {
    const payload = {
      status: miqaatNoThaali ? 1 : 0,
      date,
      menu,
      niyaz_by: niyazBy,
      sf_dish: sfDish,
      sf_details: sfDetails,
    };

    // If HOF is selected, add family_id to payload
    if (selectedHOF) {
      payload.family_id = selectedHOF;
    }
    try {
      const url = menuData
        ? `https://api.fmb52.com/api/menus/update/${menuData.id}`
        : 'https://api.fmb52.com/api/menus';

      const method = menuData ? 'POST' : 'POST'; // or 'PUT' if backend expects it

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setSnackbar({
          open: true,
          message: data.message || (menuData ? 'Menu updated!' : 'Menu submitted!'),
          severity: 'success',
        });
        if (onSuccess) onSuccess();
        // Optionally reset form or keep loaded values
        setDate(new Date().toISOString().split("T")[0]);
        setMenu("");
        setNiyazBy("");
        setSfDish("");
        setSfDetails("");
        setMiqaatNoThaali(false);
        setSelectedHOF("");
      } else {
        setSnackbar({
          open: true,
          message: data.message || 'Submission failed.',
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error occurred during submission.',
        severity: 'error',
      });
    }
  };


  return (
    <AppTheme>
      <CssBaseline />
      <Box
        ref={formRef}
        sx={{
          mt: 17,
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1, padding: "8px 16px", borderRadius: 1 }}>
            Add Menu
          </Typography>
          <IconButton onClick={handleCollapseToggle} sx={{ color: yellow[300], "&:hover": { color: yellow[400] } }}>
            {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Box>
        {!collapsed && (
          <Box
            sx={{
              width: "calc(100% + 48px)",
              position: "relative",
              height: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 },
              backgroundImage: `url(${divider})`,
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3} alignItems="center" sx={{ pr: 5 }}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={<Checkbox checked={miqaatNoThaali} onChange={(e) => setMiqaatNoThaali(e.target.checked)} color="primary" />}
                  label="Miqaat / No Thaali"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="hof-select-label">Select HOF</InputLabel>
                  <Select
                    labelId="hof-select-label"
                    value={selectedHOF}
                    label="Select HOF"
                    onChange={(e) => setSelectedHOF(e.target.value)}
                    disabled={loading}
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
                    {hofOptions.map((hof) => (
                      <MenuItem key={hof.id} value={hof.family_id}>
                        {hof.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {apiError && <Typography color="error">{apiError}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                {/* <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} value={date} onChange={(e) => setDate(e.target.value)} /> */}
<DatePicker
  label="Date"
  value={dayjs(date)}
  onChange={(newValue) => {
    if (newValue?.isValid()) {
      setDate(newValue.format('YYYY-MM-DD'));
    }
  }}

  slotProps={{
    textField: {
      fullWidth: true,
      onClick: (e) => {
        // Manually open picker when text field is clicked
        e.currentTarget.querySelector('button')?.click();
      },
      sx: {
        '& .MuiIconButton-root': {
          border: 'none',
          padding: 0,
          margin: 0,
          backgroundColor: 'transparent',
        },
        '& .MuiSvgIcon-root': {
          fontSize: '20px', // optional: to control icon size
        },
      },
      
    },
  }}
/>


              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Menu" value={menu} onChange={(e) => setMenu(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Niyaz By" value={niyazBy} onChange={(e) => setNiyazBy(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="SF Dish" value={sfDish} onChange={(e) => setSfDish(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="SF Details" value={sfDetails} onChange={(e) => setSfDetails(e.target.value)} />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ color: "white", backgroundColor: yellow[300], "&:hover": { backgroundColor: yellow[200], color: "#000" } }}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Collapse>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}
        sx={{ height: "100%" }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
};

export default MenuForm;
