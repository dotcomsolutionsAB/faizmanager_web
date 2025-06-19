import React, { useEffect, useState } from "react";
import {
    Typography,
    Box,
    Button,
    CssBaseline,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Menu,
    MenuItem,
    TextField
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { yellow, brown } from "../../../styles/ThemePrimitives";
import AppTheme from "../../../styles/AppTheme";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../../../UserContext";
import divider from '../../../assets/divider.png';

const SubSectorTable = () => {
    const { token } = useUser();
    const [subSectors, setSubSectors] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedSubSector, setSelectedSubSector] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterText, setFilterText] = useState("");


    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedSubSector(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleActionsClick = (event, subSector) => {
        setSelectedSubSector(subSector);
        setAnchorEl(event.currentTarget);
    };

    const fetchSubSectors = async () => {
        try {
            const response = await fetch("https://api.fmb52.com/api/sub_sector", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const data = await response.json();
            console.log("Raw API Response:", data.data);

            // Transform sub-sector data
            const transformedSubSectors = data.data.map((subSector) => ({
                id: subSector.id, // Use `id` for unique rows
                subSectorName: subSector.sub_sector_name || "N/A", // Sub-Sector name
                sectorName: subSector.sector_name || "N/A", // Sector name
                incharge: subSector.notes?.split(",")[0]?.split(":")[1]?.trim() || "N/A", // Extract incharge from notes
                mobile: subSector.notes?.match(/Mobile:\s*(\d+)/)?.[1] || "N/A", // Extract mobile from notes
                email: subSector.notes?.match(/Email:\s*([\w.-]+@[\w.-]+)/)?.[1] || "N/A", // Extract email from notes
            }));

            console.log("Transformed Sub-Sector Data:", transformedSubSectors);
            setSubSectors(transformedSubSectors);
        } catch (error) {
            console.error("Error fetching sub-sector data:", error);
            setSnackbar({
                open: true,
                message: "Failed to fetch sub-sector data.",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        fetchSubSectors();
    }, []);

    const columns = [
        {
            field: "subSectorName",
            headerName: "Sub-Sector Name",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "sectorName",
            headerName: "Sector Name",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "incharge",
            headerName: "Incharge",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "mobile",
            headerName: "Mobile",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            renderCell: (params) => (
                <span style={{ color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    size="small"
                    onClick={(event) => handleActionsClick(event, params.row)}
                    sx={{
                        backgroundColor: yellow[400],
                        "&:hover": {
                            backgroundColor: yellow[100],
                            color: "#000",
                        },
                    }}
                >
                    Actions
                </Button>
            ),
        },
    ];

    return (
        <AppTheme>
            <CssBaseline />
            <Box
                sx={{
                    mt: 2,
                    pt: 2,
                    pb: 3,
                    pl: 3,
                    pr: 3,
                    mr: 2,
                    ml: 2,
                    mb: 3,
                    backgroundColor: "#fff",
                    border: "1px solid #F4EBD0",
                    borderRadius: 2,
                    boxShadow: 1,
                }}
            >
<Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    gap: 2,
    mb: 2,
    px: 2,
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontWeight: "bold",
    }}
  >
    Sub-Sectors
  </Typography>

  <TextField
    label="Search"
    variant="outlined"
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
    sx={{ width: { xs: "100%", sm: "300px" } }}
    InputProps={{
      sx: {
        height: "52px",
        display: "flex",
        alignItems: "center",
      },
    }}
  />
</Box>

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
                <Box
                    sx={{
                        width: "100%",
                        height: 500,
                    }}
                >
                    <DataGridPro
                        rows={subSectors.filter((s) =>
    Object.values(s).some(
        (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(filterText.toLowerCase())
    )
)}

                        columns={columns}
                        getRowId={(row) => row.id}
                        rowHeight={100}
                        checkboxSelection
                        pagination
                        pageSizeOptions={[5, 10, 25]}
                        sx={{
                            '& .MuiDataGrid-cell': {
                                '&:hover': {
                                    backgroundColor: yellow[200],
                                },
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: yellow[100],
                            },
                            "& .MuiDataGrid-columnHeaderTitle": { color: yellow[400] },
                        }}
                    />
                </Box>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <MenuItem
                    onClick={() => {
                        console.log("Edit sub-sector:", selectedSubSector);
                        setDialogOpen(true);
                        handleMenuClose();
                    }}
                >
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        console.log("Delete sub-sector:", selectedSubSector);
                        setSnackbar({
                            open: true,
                            message: `Deleted sub-sector: ${selectedSubSector?.subSectorName}`,
                            severity: "success",
                        });
                        handleMenuClose();
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>

            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Edit Sub-Sector
                    <IconButton onClick={handleDialogClose} sx={{ float: "right" }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Edit details for sub-sector: {selectedSubSector?.subSectorName}
                    </Typography>
                    {/* Add form fields for editing the sub-sector */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => console.log("Save changes for:", selectedSubSector)} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </AppTheme>
    );
};

export default SubSectorTable;
