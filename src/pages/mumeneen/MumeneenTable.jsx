import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Typography,
  Button,
  CssBaseline,
  Chip,
  Menu,
} from '@mui/material';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { useNavigate, useOutletContext, Link, useSearchParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { yellow, brown } from '../../styles/ThemePrimitives';
import AppTheme from '../../styles/AppTheme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EditIcon from '@mui/icons-material/Edit';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditHubDialog from '../../components/mumeneenTable/EditHubDialog';
import AddReceiptDialog from '../../components/mumeneenTable/AddReceiptDialog';
import OtherSectorTransferDialog from '../../components/mumeneenTable/OtherSectorTransferDialog';
import OtherJamiatTransferDialog from '../../components/mumeneenTable/OtherJamiatTransferDialog';
import AddHofDialog from '../../components/mumeneenTable/AddHofDialog';
import DownloadIcon from '@mui/icons-material/Download';
import BlockIcon from '@mui/icons-material/Block';
import MarkAsInactive from '../../components/mumeneenTable/MarkAsInactive';


const customLocaleText = {
  noRowsLabel: 'Please wait....',
  noResultsOverlayLabel: '',
};

function MumeneenTable() {
  const { selectedSector, selectedSubSector, selectedYear } = useOutletContext();
  const { token, loading, currency, accessRoleId } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Helper to parse comma-separated params or fallback
  const parseArrayParam = (param, fallback) => {
    if (!param) return fallback;
    return param.split(',');
  };

  // Initialize filters, pagination, and sorting from URL or default
  const [filterText, setFilterText] = useState(searchParams.get('filterText') || '');
  const [filterType, setFilterType] = useState(searchParams.get('filterType') || 'HOF');
  const [hubFilter, setHubFilter] = useState(searchParams.get('hubFilter') || 'All');
  const [thaliStatusFilter, setThaliStatusFilter] = useState(searchParams.get('thaliStatusFilter') || 'all');
  

  const [paginationModel, setPaginationModel] = useState({
    page: Number(searchParams.get('page')) || 0,
    pageSize: Number(searchParams.get('pageSize')) || 10,
  });

  const sortParam = searchParams.get('sortModel');
  const [sortModel, setSortModel] = useState(
    sortParam
      ? [{ field: sortParam.split(':')[0], sort: sortParam.split(':')[1] }]
      : []
  );

  const year = selectedYear.length ? selectedYear : '';
  const sector = selectedSector.length ? selectedSector : ['all'];
  const subSector = selectedSubSector.length ? selectedSubSector : ['all'];


  const [rows, setRows] = useState([]);
  const [apiError, setApiError] = useState(null);

  const [editHubDialogOpen, setEditHubDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [addReceiptDialogOpen, setAddReceiptDialogOpen] = useState(false);
  const [selectedRowForReceipt, setSelectedRowForReceipt] = useState(null);

  const [addHofDialogOpen, setAddHofDialogOpen] = useState(false);
  const [selectedFamilyRow, setSelectedFamilyRow] = useState(null);

  const [thaliStatusOptionsFromApi, setThaliStatusOptionsFromApi] = useState([]);

  const [selectedRowForTransfer, setSelectedRowForTransfer] = useState(null);
  const [otherSectorTransferDialogOpen, setOtherSectorTransferDialogOpen] = useState(false);
  const [otherJamiatTransferDialogOpen, setOtherJamiatTransferDialogOpen] = useState(false);

    const [markInactiveDialogOpen, setMarkInactiveDialogOpen] = useState(false);
  const [selectedRowForInactive, setSelectedRowForInactive] = useState(null);

  // Set document title
  useEffect(() => {
    document.title = 'Mumeneen - FMB 52';
  }, []);

  // Format currency helper
  const currencyCode = currency?.currency_code || 'INR';
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
    }).format(value || 0);

  // Fetch Thaali status options
  useEffect(() => {
    if (loading || !token) return;

    const fetchThaliStatusOptions = async () => {
      try {
        const response = await fetch(`https://api.fmb52.com/api/mumeneen/thaali_statuses`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch thaali statuses');

        const json = await response.json();
        if (json.data && Array.isArray(json.data)) {
          setThaliStatusOptionsFromApi(json.data);
        }
      } catch (error) {
        console.error('Error loading thaali statuses:', error);
      }
    };

    fetchThaliStatusOptions();
  }, [loading, token]);

  // Map thali status colors
  const defaultThaliStatusColors = {
    taking: 'success',
    not_taking: 'error',
    once_a_week: 'warning',
    joint: 'info',
    other_centre: 'default',
  };
  const getThaliStatusColor = (slug) => defaultThaliStatusColors[slug] || 'default';

  // Fetch data from API
const fetchData = async () => {
  if (loading || !token) return;
  try {
    const sectorParams = sector.map((s) => `sector[]=${encodeURIComponent(s)}`).join("&");
    const subSectorParams = subSector.map((s) => `sub_sector[]=${encodeURIComponent(s)}`).join("&");
    const url = `https://api.fmb52.com/api/mumeneen/get?year=${year}&${sectorParams}&${subSectorParams}`;

    const payload = {
      role_id: accessRoleId, // ✅ added here
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // ✅ include role_id in body
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    const data = await response.json();
    setRows(data.data || []);
    setApiError(null);
  } catch (error) {
    setApiError(
      "The data is currently unavailable, but we are working to resolve this. Thank you for your patience!"
    );
    setRows([]);
  }
};

  // Load data when token or filters change
  useEffect(() => {
    fetchData();
  }, [token, loading, year, sector, subSector]);

  // Sync filter & pagination & sort state to URL params on change
  useEffect(() => {
    const params = {
      filterText: filterText || undefined,
      filterType: filterType || undefined,
      hubFilter: hubFilter || undefined,
      thaliStatusFilter: thaliStatusFilter || undefined,
      page: paginationModel.page || undefined,
      pageSize: paginationModel.pageSize || undefined,
      sortModel: sortModel.length > 0 ? `${sortModel[0].field}:${sortModel[0].sort}` : undefined,
    };
    // Remove undefined keys
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

    setSearchParams(params, { replace: true });
  }, [filterText, filterType, hubFilter, thaliStatusFilter, paginationModel, sortModel, setSearchParams]);

  // Dialog save handlers
  const handleEditHubSave = (updatedData) => {
    fetchData();
    setEditHubDialogOpen(false);
  };

  const handleAddHofSave = (newData) => {
    fetchData();
    setAddHofDialogOpen(false);
  };

  const handleAddReceiptSave = (receiptData) => {
    fetchData();
    setAddReceiptDialogOpen(false);
  };

  const handleOtherSectorTransferSave = (data) => {
    fetchData();
    setOtherSectorTransferDialogOpen(false);
  };

  const handleOtherJamiatTransferSave = (data) => {
    fetchData();
    setOtherJamiatTransferDialogOpen(false);
  };

      const exportToExcel = async () => {
      try {
        const payload = {
          sector: sector.length ? sector : ['all'],
          sub_sector: subSector.length ? subSector : ['all'],
          thali_status: thaliStatusFilter === 'all' ? '' : thaliStatusFilter,
          hub_status: (() => {
            switch (hubFilter) {
              case 'Hub Not Set':
                return 0;
              case 'Due':
                return 1;
              case 'Overdue':
                return 2;
              case 'All':
              default:
                return 3;
            }
          })(),
          mumeneen_type: filterType === 'All' ? null : filterType, // HOF or FM or null
        };
  
        const response = await fetch('https://api.fmb52.com/api/mumeneen/export', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to export: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        if (data.file_url) {
          const link = document.createElement('a');
          link.href = data.file_url;
          link.download = data.file_url.split('/').pop();
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else {
          alert('Export failed: no file URL received');
        }
      } catch (error) {
        console.error('Export error:', error);
        alert(`Export failed: ${error.message}`);
      }
    };



    
  // Filter rows locally
  const filteredRows = rows.filter((row) => {
    const filterTextLower = filterText.toLowerCase();
    const matchesFilterText =
      row.name?.toLowerCase().includes(filterTextLower) ||
      row.its?.toLowerCase().includes(filterTextLower) ||
      row.mobile?.toLowerCase().includes(filterTextLower) ||
      row.folio_no?.toLowerCase().includes(filterTextLower) ||
      row.sector?.name?.toLowerCase().includes(filterTextLower) ||
      row.sub_sector?.name?.toLowerCase().includes(filterTextLower) ||
      row.hof_its?.toLowerCase().includes(filterTextLower) ||
      row.mumeneen_type?.toLowerCase().includes(filterTextLower) ||
      row.hub_amount?.toString().includes(filterText) ||
      row.paid_amount?.toString().includes(filterText) ||
      row.due_amount?.toString().includes(filterText) ||
      row.overdue?.toString().includes(filterText);

    const matchesFilterType =
      filterType === 'All' ||
      (row.mumeneen_type &&
        row.mumeneen_type.trim().toUpperCase() === filterType.trim().toUpperCase());

    let matchesHubFilter = true;
    if (hubFilter === 'Hub Not Set') {
      matchesHubFilter = row.hub_amount === 0;
    } else if (hubFilter === 'Due') {
      matchesHubFilter = row.due_amount > 0;
    } else if (hubFilter === 'Overdue') {
      matchesHubFilter = row.overdue > 0;
    }

    let matchesThaliStatusFilter = true;
    if (thaliStatusFilter !== 'all') {
      matchesThaliStatusFilter = row.thali_status === thaliStatusFilter;
    }

    return matchesFilterText && matchesFilterType && matchesHubFilter && matchesThaliStatusFilter;
  });

  // Columns definition
  const columns = [
    {
      field: 'mumeneen_info',
      headerName: 'Mumeneen Info',
      width: 550,
      renderCell: (params) => {
        const statusOption = thaliStatusOptionsFromApi.find(
          (opt) =>
            opt.slug === params.row.thali_status ||
            opt.name.toLowerCase().replace(/\s+/g, '_') === params.row.thali_status
        );

        const label = statusOption ? statusOption.name : params.row.thali_status;
        const chipColor = statusOption
          ? getThaliStatusColor(
              statusOption.slug || statusOption.name.toLowerCase().replace(/\s+/g, '_')
            )
          : 'default';

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
              }}
            >
              <img
                src={params.row.photo ? params.row.photo.file_url : '/static/images/avatar-placeholder.png'}
                alt="User Photo"
                style={{
                  width: 80,
                  height: 90,
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            </div>
            <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
                <Link
                  to={`/mumeneen/${params.row.family_id}`}
                  style={{
                    color: yellow[400],
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = brown[700])}
                  onMouseLeave={(e) => (e.target.style.color = yellow[400])}
                >
                  {params.row.name}
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
                ITS: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.its}</span>
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
                Mobile: <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.mobile}</span>
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
                Folio No:{' '}
                <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.folio_no}</span>
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
                Sector:{' '}
                <span style={{ fontWeight: 'normal', color: brown[700] }}>
                  {' '}
                  {params.row.sector?.name} - {params.row.sub_sector?.name}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
                Thali Status:{' '}
                <span style={{ fontWeight: 'normal', color: brown[700] }}>
                  <Chip label={label} color={chipColor} sx={{ ml: 0.5, fontWeight: 'bold' }} />
                </span>
              </Typography>
              {params.row.label && (
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
                  Label: <span style={{ fontWeight: 'normal', color: brown[700] }}>{params.row.label}</span>
                </Typography>
              )}
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
                Zabihat:{' '}
                <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row?.zabihat}</span>
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: yellow[300] }}>
                Comments:{' '}
                <span style={{ fontWeight: 'normal', color: brown[700] }}> {params.row.its_data}</span>
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'hub_amount',
      headerName: 'Hub',
      width: 180,
      sortable: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            height: '100%',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#1976d2',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            {formatCurrency(params.row.hub_amount)}
          </Typography>
          {params.row.overdue > 0 && (
            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
              Previous Due: {formatCurrency(params.row.overdue)}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'paid_amount',
      headerName: 'Paid',
      width: 180,
      sortable: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: '#388e3c',
            textAlign: 'right',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '100%',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          {formatCurrency(params.row.paid_amount)}
        </Typography>
      ),
    },
    {
      field: 'due_amount',
      headerName: 'Due',
      width: 180,
      sortable: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: '#d32f2f',
            textAlign: 'right',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '100%',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          {formatCurrency(params.row.due_amount)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <ActionButtonWithMenu
            row={params.row}
            onActionClick={(action, row) => {
              console.log(`Action: ${action}`, row);
              if (action === 'View Profile') {
                navigate(`/mumeneen/${row.family_id}`);
              } else if (action === 'Add Receipt') {
                setSelectedRowForReceipt(row);
                setAddReceiptDialogOpen(true);
              } else if (action === 'Edit Hub') {
                setSelectedRow(row);
                setEditHubDialogOpen(true);
              } else if (action === 'Transfer') {
                console.log('Transfer clicked for:', row);
              } else if (action === 'Other sector') {
                setSelectedRowForTransfer(row);
                setOtherSectorTransferDialogOpen(true);
              } else if (action === 'Out of jamiat') {
                setSelectedRowForTransfer(row);
                setOtherJamiatTransferDialogOpen(true);
              } else if (action === "Update Tiffin Segment") {
                console.log("Tiffin")
              }  else if (action === 'Mark Inactive') {
                setSelectedRowForInactive(row);
                setMarkInactiveDialogOpen(true);
              }
            }}
          />
        </Box>
      ),
    },
  ];

  // ActionButtonWithMenu component
  const ActionButtonWithMenu = ({ row, onActionClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [showTransferOptions, setShowTransferOptions] = useState(false);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    };

    const handleClose = () => {
      setAnchorEl(null);
      setOpen(false);
      setShowTransferOptions(false);
    };

    const handleTransferClick = () => {
      setShowTransferOptions(!showTransferOptions);
    };

    return (
      <Box>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Actions
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem
            onClick={() => {
              onActionClick('View Profile', row);
              handleClose();
            }}
          >
            <Tooltip title="View Profile" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <AccountCircleIcon sx={{ color: brown[200] }} />
                <Typography>View Profile</Typography>
              </Box>
            </Tooltip>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onActionClick('Add Receipt', row);
              handleClose();
            }}
          >
            <Tooltip title="Add Receipt" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <ReceiptIcon sx={{ color: brown[200] }} />
                <Typography>Add Receipt</Typography>
              </Box>
            </Tooltip>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onActionClick('Edit Hub', row);
              handleClose();
            }}
          >
            <Tooltip title="Edit Hub" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <EditIcon sx={{ color: brown[200] }} />
                <Typography>Edit Hub</Typography>
              </Box>
            </Tooltip>
          </MenuItem>
          <MenuItem onClick={handleTransferClick}>
            <Tooltip title="Transfer" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <TransferWithinAStationIcon sx={{ color: brown[200] }} />
                <Typography>Transfer</Typography>
                <KeyboardArrowDownIcon sx={{ color: brown[200] }} />
              </Box>
            </Tooltip>
          </MenuItem>

          {showTransferOptions && (
            <>
              <MenuItem
                onClick={() => {
                  onActionClick('Other sector', row);
                  handleClose();
                }}
                sx={{ pl: 4 }}
              >
                Other sector
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onActionClick('Out of jamiat', row);
                  handleClose();
                }}
                sx={{ pl: 4 }}
              >
                Out of jamiat
              </MenuItem>
            </>
          )}
          <MenuItem>
                      <Tooltip title="Update Tiffin Segment" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <ReceiptIcon sx={{ color: brown[200] }} />
                <Typography>Update Tiffin Segment</Typography>
              </Box>
            </Tooltip>
          </MenuItem>
                 {row.status !== 'in_active' && (
          <MenuItem
            onClick={() => {
              onActionClick('Mark Inactive', row);
              handleClose();
            }}
          >
            <Tooltip title="Mark as Inactive" placement="left">
              <Box display="flex" alignItems="center" gap={1} sx={{ pr: 2 }}>
                <BlockIcon sx={{ color: brown[200] }} />
                <Typography>Mark as Inactive</Typography>
              </Box>
            </Tooltip>
          </MenuItem>
        )}
        </Menu>


      </Box>
    );
  };

  return (
    <AppTheme>
      <Box sx={{ width: '100%', overflowX: 'auto', mt: 11, pt: 1, pr: 2, pb: 3, pl: 2 }}>
        <CssBaseline />
        <Paper
          sx={{
            width: '100%',
            boxShadow: 1,
            overflowX: 'auto',
            p: 1,
            '@media (max-width: 600px)': {
              p: 1,
            },
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
            <TextField
              label="Search"
              variant="outlined"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="outlined" color="primary" onClick={() => setAddHofDialogOpen(true)}>
                Add HOF
              </Button>
              <FormControl sx={{ minWidth: 150, width: { xs: '100%', sm: '150px' } }}>
                <InputLabel>Filter By</InputLabel>
                <Select
                  value={filterType}
                  label="Filter By"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="HOF">HOF</MenuItem>
                  <MenuItem value="FM">FM</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 180, width: { xs: '100%', sm: '150px' } }}>
                <InputLabel>Hub Status</InputLabel>
                <Select
                  value={hubFilter}
                  label="Hub Status"
                  onChange={(e) => setHubFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Hub Not Set">Hub Not Set</MenuItem>
                  <MenuItem value="Due">Due</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 150, width: { xs: '100%', sm: '150px' } }}>
                <InputLabel>Thaali Status</InputLabel>
                <Select
                  label="Thaali Status"
                  value={thaliStatusFilter}
                  onChange={(e) => setThaliStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  {thaliStatusOptionsFromApi.length === 0 ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    thaliStatusOptionsFromApi.map((option) => (
                      <MenuItem
                        key={option.id}
                        value={option.slug || option.name.toLowerCase().replace(/\s+/g, '_')}
                      >
                        {option.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={() => exportToExcel()}
              >
                Export to Excel
              </Button>
            </Box>
          </Box>
          <div style={{ height: 700, width: '100%', overflow: 'auto' }}>
            <DataGridPro
              rows={filteredRows}
              columns={columns}
              loading={loading}
              components={{
                Toolbar: GridToolbar,
                NoRowsOverlay: () => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      backgroundColor: '#f9f9f9',
                      color: '#555',
                    }}
                  >
                    {apiError ? (
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {apiError}
                      </Typography>
                    ) : (
                      <>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          No data available yet
                        </Typography>
                        <Typography variant="body2">
                          Please add entries or adjust filters to display data here.
                        </Typography>
                      </>
                    )}
                  </Box>
                ),
              }}
              localeText={customLocaleText}
              rowHeight={145}
              getRowHeight={(params) => (params.model.label ? 175 : 175)}
              checkboxSelection
              disableSelectionOnClick
              pagination
              paginationMode="client"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              getRowId={(row) => row.its || Math.random()}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  color: yellow[400],
                  textAlign: 'center',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                },
                '& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within': {
                  outline: 'none',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                '& .MuiDataGrid-cell': {
                  '&:hover': {
                    backgroundColor: yellow[200],
                  },
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: yellow[100],
                },
                '@media (max-width: 600px)': {
                  '& .MuiDataGrid-columnHeaders': {
                    fontSize: '0.75rem',
                  },
                  '& .MuiDataGrid-cell': {
                    fontSize: '0.75rem',
                  },
                },
              }}
            />
          </div>
        </Paper>
      </Box>

      {/* Dialogs */}
      <EditHubDialog
        open={editHubDialogOpen}
        onClose={() => setEditHubDialogOpen(false)}
        row={selectedRow}
        onSave={handleEditHubSave}
        formatCurrency={formatCurrency}
        year={year}
      />

      <AddHofDialog
        open={addHofDialogOpen}
        onClose={() => setAddHofDialogOpen(false)}
        row={selectedFamilyRow}
        onSave={handleAddHofSave}
        formatCurrency={formatCurrency}
        year={year}
      />

      <AddReceiptDialog
        open={addReceiptDialogOpen}
        onClose={() => setAddReceiptDialogOpen(false)}
        row={selectedRowForReceipt}
        familyId={selectedRowForReceipt?.family_id}
        onSave={handleAddReceiptSave}
        formatCurrency={formatCurrency}
      />

      <OtherSectorTransferDialog
        open={otherSectorTransferDialogOpen}
        onClose={() => setOtherSectorTransferDialogOpen(false)}
        row={selectedRowForTransfer}
        onSave={handleOtherSectorTransferSave}
      />

      <OtherJamiatTransferDialog
        open={otherJamiatTransferDialogOpen}
        onClose={() => setOtherJamiatTransferDialogOpen(false)}
        row={selectedRowForTransfer}
        onSave={handleOtherJamiatTransferSave}
      />

            <MarkAsInactive
        open={markInactiveDialogOpen}
        onClose={() => setMarkInactiveDialogOpen(false)}
        row={selectedRowForInactive}
        onSuccess={() => fetchData()}   // refresh table after success
      />

    </AppTheme>
  );
}

export default MumeneenTable;
