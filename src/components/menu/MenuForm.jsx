import React, { useState } from "react";
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

const MenuForm = () => {
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

  const handleCollapseToggle = () => {
    setCollapsed((prev) => !prev);
  };

  const handleSnackbarClose = () => setSnackbar((prev) => ({ ...prev, open: false }));

  // Dummy HOF options for Select dropdown - replace with real data
  const hofOptions = [
    { id: 1, name: "HOF 1" },
    { id: 2, name: "HOF 2" },
    { id: 3, name: "HOF 3" },
  ];

  const handleSubmit = () => {
    // Your submit logic here
    setSnackbar({
      open: true,
      message: "Form submitted!",
      severity: "success",
    });
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Box
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
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: 1,
              padding: "8px 16px",
              borderRadius: 1,
            }}
          >
            Add Menu
          </Typography>
          {/* Collapse Icon */}
          <IconButton
            onClick={handleCollapseToggle}
            sx={{
              color: yellow[300],
              "&:hover": {
                color: yellow[400],
              },
            }}
          >
            {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Box>
        {!collapsed && (
          <Box
            sx={{
              width: "calc(100% + 48px)",
              position: "relative",
             height: {
                xs: 10,
                sm: 15,
                md: 15,
                lg: 15,
                xl: 15,
              },
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
          <Grid container spacing={3} alignItems="center" sx={{ pr: 5 }}>
            {/* First row */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={miqaatNoThaali}
                    onChange={(e) => setMiqaatNoThaali(e.target.checked)}
                    color="primary"
                  />
                }
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
                >
                  {hofOptions.map((hof) => (
                    <MenuItem key={hof.id} value={hof.id}>
                      {hof.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Second row */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                // size="small"
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                // size="small"
                label="Menu"
                value={menu}
                onChange={(e) => setMenu(e.target.value)}
              />
            </Grid>

            {/* Third row */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                // size="small"
                label="Niyaz By"
                value={niyazBy}
                onChange={(e) => setNiyazBy(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                // size="small"
                label="SF Dish"
                value={sfDish}
                onChange={(e) => setSfDish(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                // size="small"
                label="SF Details"
                value={sfDetails}
                onChange={(e) => setSfDetails(e.target.value)}
              />
            </Grid>

            {/* Submit button */}
            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{
                  color: "white",
                  backgroundColor: yellow[300],
                  "&:hover": {
                    backgroundColor: yellow[200],
                    color: "#000",
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Collapse>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
};

export default MenuForm;
