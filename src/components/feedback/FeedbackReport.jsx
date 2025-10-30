import React, { useEffect, useState,  useMemo } from "react";
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
import { yellow, brown } from "../../styles/ThemePrimitives";
import AppTheme from "../../styles/AppTheme";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../../contexts/UserContext";
import divider from '../../assets/divider.png';
import DownloadIcon from '@mui/icons-material/Download';


const FeedbackReport = () => {
    const { token } = useUser();
    const [feedbacks, setFeedbacks] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedSector, setSelectedSector] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const [menuQuery, setMenuQuery] = useState("");
    const customLocaleText = {
  noRowsLabel: 'Please wait....',
  noResultsOverlayLabel: '',
};

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedSector(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

 

const fetchFeedbacks = async () => {
    try {
        const response = await fetch("https://api.fmb52.com/api/feedbacks/report", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

        const data = await response.json();

        // Transform counts to percentages and ratings to integers
        const transformedData = data.data.map(item => {
            const reviewCount = Number(item.review_count) || 0;
            return {
                ...item,
                avg_taste: parseInt(item.avg_taste) || 0,
                avg_quality: parseInt(item.avg_quality) || 0,
                avg_quantity: parseInt(item.avg_quantity) || 0,
spicy_count: reviewCount > 0 ? Math.round((item.spicy_count / reviewCount) * 100) : 0,
oily_count: reviewCount > 0 ? Math.round((item.oily_count / reviewCount) * 100) : 0

            };
        });

        setFeedbacks(transformedData);
    } catch (error) {
        console.error("Error fetching sectors:", error);
        setSnackbar({
            open: true,
            message: "Failed to fetch sector data.",
            severity: "error",
        });
    }
};





    const columns = [
        {
            field: "menu_date",
            headerName: "Date",
            flex: 1,
            renderCell: (params) => (
                <span style={{color: brown[700] }}>{params.value}</span>
            ),
        },
        {
            field: "menu_name",
            headerName: "Menu",
            flex: 2,
            renderCell: (params) => (
                <span style={{  fontWeight: "bold",  color: brown[700] ,whiteSpace: "normal",    // allow wrapping
                wordBreak: "break-word",  // break long words if needed
                lineHeight: 1.2}}>{params.value}</span>
            ),
        },
                {
            field: "review_count",
            headerName: "Count",
            flex: 0.75,
            renderCell: (params) => (
                                               <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                          }}
                        >
                <span style={{ color: brown[700] }}>{params.value}</span>
                </Box>
            ),
        },
                        {
            field: "avg_taste",
            headerName: "Taste",
            flex: 0.75,
            renderCell: (params) => (
                                               <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                          }}
                        >
                <span style={{ color: brown[700] }}>{params.value}</span>
                </Box>
            ),
        },
                                {
            field: "avg_quality",
            headerName: "Quality",
            flex: 0.75,
            renderCell: (params) => (
                                               <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                          }}
                        >
                <span style={{ color: brown[700] }}>{params.value}</span>
                </Box>
            ),
        },
                                {
            field: "avg_quantity",
            headerName: "Quantity",
            flex: 0.75,
            renderCell: (params) => (
                                               <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                          }}
                        >
                <span style={{ color: brown[700] }}>{params.value}</span>
                </Box>
            ),
        },
                                {
            field: "spicy_count",
            headerName: "Too Spicy",
            flex: 0.75,
            renderCell: (params) => (
                                <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                          }}
                        >
                <span style={{ color: brown[700]}}>{params.value}%</span>
                </Box>
            ),
        },
                                {
            field: "oily_count",
            headerName: "Too Oily",
            flex: 0.75,
            renderCell: (params) => (
                <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                          }}
                        >
                <span style={{ color: brown[700] }}>{params.value}%</span>
                </Box>
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
                            
                            sx={{
                                backgroundColor: yellow[400],
                                "&:hover": {
                                    backgroundColor: yellow[100],
                                    color: "#000",
                                },
                            }}
                        >
                            View Feedbacks
                        </Button>
                    ),
                },

    ];

    useEffect(() => {
        fetchFeedbacks();
    }, []);
// Filter rows by menu name (case-insensitive)
const filteredFeedbacks = useMemo(() => {
  const q = menuQuery.trim().toLowerCase();
  if (!q) return feedbacks;
  return feedbacks.filter(r => String(r.menu_name || "").toLowerCase().includes(q));
}, [feedbacks, menuQuery]);


    return (
        <AppTheme>
            <CssBaseline />
            <Box
                sx={{
                    mt: 12,
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
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: 2,
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
                    Feedback Report
                </Typography>
                <Box
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 1.5,
    mb: 1.5,
  }}
>
  <TextField
    type="text"
     variant="outlined"
    placeholder="Search by menu…"
    value={menuQuery}
    onChange={(e) => setMenuQuery(e.target.value)}
              sx={{ width: { xs: '100%', sm: '300px' } }}
              InputProps={{
                sx: {
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  mb: '7px',
                },
              }}
  />
  <Button
    variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}

    sx={{
        mb: '7px',
      backgroundColor: yellow[400],
      "&:hover": { backgroundColor: yellow[100], color: "#000" },
      height: '52px',
    }}
  >
    Export to Excel
  </Button>
</Box>
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
                        rows={filteredFeedbacks}

                        columns={columns}
                        getRowId={(row) => row.menu_id}
                        rowHeight={100}
                        checkboxSelection
                        pagination
                        pageSizeOptions={[5, 10, 25]}
                         localeText={customLocaleText}
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


        </AppTheme>
    );
};

export default FeedbackReport;
