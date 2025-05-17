import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import MuiAppBar from '@mui/material/AppBar';
import { useAppStore } from '../../appStore';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { yellow, brown } from '../../styles/ThemePrimitives';
import AppTheme from '../../styles/AppTheme';
import { CssBaseline } from '@mui/material';
import UserMenu from './UserMenu';
import { useUser } from '../../UserContext';
import { useTheme } from '@mui/material/styles';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';
import fmb52 from '../../assets/fmb52.png'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

// import { useAppStore } from '../../appStore';

const drawerWidth = 240;

const UserBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
}));



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

export default function Header({ selectedSector,
  setSelectedSector,
  selectedSubSector,
  setSelectedSubSector,
  selectedYear,
  setSelectedYear }) {
  const context = useUser();
  const user = context?.user || {};
  const theme = useTheme();
  const userName = user?.name || 'User';
  const token = context?.token;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);
  const [sectors, setSectors] = useState([]);
  const [subSectors, setSubSectors] = useState([]);
  const [years, setYears] = useState([]);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [loadingSubSectors, setLoadingSubSectors] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);


  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
  };

  const handleSubSectorChange = (event) => {
    setSelectedSubSector(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Render selected sector IDs
  const renderSectorValue = (selected) => {
    return selected.length
      ? selected
        .map((sectorId) => {
          const sector = sectors.find((s) => s.id === sectorId);
          return sector ? sector.name : '';
        })
        .join(', ')
      : 'Select Sector';
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );


  // Fetch sectors
  useEffect(() => {
    if (token) {
      const fetchSectors = async () => {
        setLoadingSectors(true);
        try {
          const response = await fetch('https://api.fmb52.com/api/sector', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch sectors');
          }

          const data = await response.json();
          if (data?.data) {
            const filteredSectors = data.data.filter((sector) => sector.name !== 'Annual Report');
            setSectors(filteredSectors);
          } else {
            console.error('No sectors found');
          }
        } catch (error) {
          console.error('Error fetching sectors:', error);
        } finally {
          setLoadingSectors(false);
        }
      };
      fetchSectors();
    }
  }, [token]);

  // Fetch sub-sectors based on selected sector
  useEffect(() => {
    console.log('Selected sector:', selectedSector);
    if (token && selectedSector && selectedSector.length > 0) {
      const fetchSubSectors = async () => {
        setLoadingSubSectors(true);
        try {
          const sectorToFetch = selectedSector[0];
          const response = await fetch(`https://api.fmb52.com/api/sub_sector?sector=${sectorToFetch}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch sub-sectors');
          }

          const data = await response.json();

          if (data?.data) {
            // Filter sub-sectors by selected sector
            const filteredSubSectors = data.data.filter((subSector) =>
              selectedSector.includes(subSector.sector_id)  // Compare using sector_id
            );
            setSubSectors(filteredSubSectors);
          } else {
            setSubSectors([]);
          }
        } catch (error) {
          console.error('Error fetching sub-sectors:', error);
          setSubSectors([]);
        } finally {
          setLoadingSubSectors(false);
        }
      };

      fetchSubSectors();
    } else {
      // Clear sub-sectors if no sector is selected
      setSubSectors([]);
    }
  }, [token, selectedSector]);

  // Fetch years
  useEffect(() => {
    if (token) {
      const fetchYears = async () => {
        setLoadingYears(true);
        try {
          const response = await fetch('https://api.fmb52.com/api/year', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch years');
          }

          const data = await response.json();
          if (data?.data) {
            const currentYear = data.data.find(year => year.is_current === '1');
            if (currentYear) {
              setSelectedYear([currentYear.year]);
            }
            setYears(data.data);
          } else {
            console.error('No years found');
          }
        } catch (error) {
          console.error('Error fetching years:', error);
        } finally {
          setLoadingYears(false);
        }
      };
      fetchYears();
    }
  }, [token]);

  console.log("year", years);
  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, }}>
        <AppBar position="fixed" sx={{ backgroundColor: '#fbfbfb' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              aria-label="open drawer"
              sx={{ mr: 2, color: brown[600], border: 'none' }}
              onClick={() => updateOpen(!dopen)}
            >
              {dopen ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
            </IconButton>
            {/* <Box component="img" 
               src={logo} 
               alt="Logo" 
               sx={{ height: 80, width: 80, display: { xs: 'none', sm: 'block' } }} 
          /> */}
            {/* <NavbarBreadcrumbs /> */}
            <Box
              component="img"
              src={fmb52}
              alt="Logo"
              sx={{
                width: 'auto',
                height: 45,
                margin: '0 auto'
              }}
            />
            <Typography variant="h4" sx={{ color: 'brown', textAlign: 'center', paddingLeft: 1.5 }}>
              FMB 52
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

              <div>
                <FormControl
                  sx={{
                    m: 1,
                    width: { xs: "100%", sm: "22ch", md: "25ch" },
                    position: "relative",
                  }}
                >
                  <InputLabel id="sector-select-label">Select Sector</InputLabel>
                  <Select
                    label="Select Sector"
                    labelId="sector-select-label"
                    multiple
                    value={selectedSector}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value.includes("all")) {
                        // If "All" is selected, select/deselect all
                        if (selectedSector.includes("all")) {
                          setSelectedSector([]); // Clear all
                          setSelectedSubSector([]); // Clear sub-sectors
                        } else {
                          setSelectedSector(["all", ...sectors.map((sector) => sector.id)]);
                        }
                      } else {
                        // Normal selection
                        const filteredValue = value.filter((v) => v !== "all");
                        setSelectedSector(filteredValue);
                      }
                    }}
                    input={<OutlinedInput label="Sector" />}
                    renderValue={(selected) => {
                      if (selected.includes("all")) {
                        return "All"; // Display "All" if 'all' is in the array
                      }

                      if (selected.length === 0) {
                        return "Select Sector"; // Default placeholder
                      }

                      return selected.map((sectorId) => {
                        const sector = sectors.find((s) => s.id === sectorId);
                        return (
                          <Box
                            key={sectorId}
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              background: "#ddd",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              m: 0.3,
                              fontSize: "0.85rem",
                              fontWeight: "bold",
                            }}
                          >
                            {sector?.name}
                            <IconButton
                              size="small"
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={() => {
                                setSelectedSector((prev) =>
                                  prev.filter((item) => item !== sectorId)
                                );
                              }}
                              sx={{
                                ml: 0.5,
                                width: "20px",
                                height: "20px",
                                color: "#555",
                                borderRadius: "50%",
                                "&:hover": { background: "transparent" },
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        );
                      });
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {sectors.map((sector) => (
                      <MenuItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </MenuItem>
                    ))}
                  </Select>

                  {/* Clear all icon */}
                  {selectedSector.length > 0 && (
                    <IconButton
                      size="small"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => {
                        setSelectedSector([]); // Clear all selections
                        setSelectedSubSector([]);
                      }}
                      sx={{
                        position: "absolute",
                        top: "6px",
                        right: "30px",
                        zIndex: 10,
                        background: "#fff",
                        "&:hover": { background: "#f5f5f5" },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                </FormControl>







              </div>
              <div>
                <FormControl
                  sx={{
                    m: 1,
                    width: { xs: "100%", sm: "22ch", md: "25ch" },
                    position: "relative",
                  }}
                >
                  <InputLabel id="sub-sector-select-label">Select Sub-Sector</InputLabel>
                  <Select
                    label="Select Sub-Sector"
                    labelId="sub-sector-select-label"
                    multiple
                    value={selectedSubSector}
                    onChange={(event) => {
                      const value = event.target.value;

                      if (value.includes("all")) {
                        // Get all sub-sectors for the selected sectors
                        const allSubSectors = subSectors
                          .filter((subSector) => selectedSector.includes(subSector.sector_id))
                          .map((subSector) => subSector.id);

                        if (selectedSubSector.length === allSubSectors.length) {
                          setSelectedSubSector([]); // Clear all sub-sectors
                        } else {
                          setSelectedSubSector(["all", ...allSubSectors]); // Select all
                        }
                      } else {
                        setSelectedSubSector(value.filter((item) => item !== "all")); // Normal selection
                      }
                    }}
                    input={<OutlinedInput label="Sub-Sector" />}
                    renderValue={(selected) => {
                      // Get all sub-sector IDs for the selected sectors
                      const allSubSectorIds = subSectors
                        .filter((subSector) => selectedSector.includes(subSector.sector_id))
                        .map((subSector) => subSector.id);

                      // If 'all' exists or all sub-sectors are selected
                      if (selected.includes("all") || selected.length === allSubSectorIds.length) {
                        return "All";
                      }

                      if (selected.length === 0) {
                        return "Select Sub-Sector"; // Default placeholder
                      }

                      // Default behavior: display selected sub-sectors
                      return selected.map((subSectorId) => {
                        const subSector = subSectors.find((s) => s.id === subSectorId);
                        return (
                          <Box
                            key={subSectorId}
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              background: "#ddd",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              m: 0.3,
                              fontSize: "0.85rem",
                              fontWeight: "bold",
                            }}
                          >
                            {subSector?.sub_sector_name}
                            <IconButton
                              size="small"
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={() =>
                                setSelectedSubSector((prev) =>
                                  prev.filter((item) => item !== subSectorId)
                                )
                              }
                              sx={{
                                ml: 0.5,
                                width: "20px",
                                height: "20px",
                                color: "#555",
                                borderRadius: "50%",
                                "&:hover": { background: "transparent" },
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        );
                      });
                    }}
                    disabled={!selectedSector.length} // Disable if no sectors are selected
                  >
                    <MenuItem value="all">All</MenuItem>
                    {selectedSector.reduce((acc, sectorId) => {
                      const sectorSubSectors = subSectors.filter(
                        (subSector) => subSector.sector_id === sectorId
                      );
                      return acc.concat(
                        <ListSubheader
                          key={sectorId}
                          sx={{
                            fontWeight: "bold",
                            position: "sticky",
                            top: 0,
                            backgroundColor: yellow[100],
                            zIndex: 1,
                            color: brown[700],
                          }}
                        >
                          {sectors.find((sector) => sector.id === sectorId)?.name}
                        </ListSubheader>,
                        sectorSubSectors.map((subSector) => (
                          <MenuItem key={subSector.id} value={subSector.id}>
                            {subSector.sub_sector_name}
                          </MenuItem>
                        ))
                      );
                    }, [])}
                  </Select>

                  {selectedSubSector.length > 0 && (
                    <IconButton
                      size="small"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => setSelectedSubSector([])} // Clear all
                      sx={{
                        position: "absolute",
                        top: "6px",
                        right: "30px",
                        zIndex: 10,
                        background: "#fff",
                        "&:hover": { background: "#f5f5f5" },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </FormControl>






              </div>
              {/* <div>
      <FormControl  sx={{ m: 1, width: { xs: '100%', sm: '22ch', md: '25ch' } }}>
        <InputLabel id="demo-multiple-name-label">Select Year</InputLabel>
        <Select
                  label="Select Year"
                  labelId="year-select-label"
                  multiple
                  value={selectedYear}
                  onChange={handleYearChange}
                  input={<OutlinedInput label="Year" />}
                >
                  {years.map((year) => (
                    <MenuItem key={year.year} value={year.year}>
                      {year.year}
                    </MenuItem>
                  ))}
        </Select>
      </FormControl>
    </div> */}

              {/*  <IconButton size="large" aria-label="show 4 new mails" sx={{color: brown[600]}}>
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              sx={{color: brown[600]}}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{color: brown[600]}}
            >
              <AccountCircle />
            </IconButton> */}
              {/* User Menu */}
              {user && (
                <UserBox>
                  <Typography variant="h6" color={brown[700]} fontSize="0.9rem" // Responsive font size
                  >
                    Hi, {userName.split(' ')[0]}
                  </Typography>
                  <UserMenu user={userName} />
                </UserBox>
              )}
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                sx={{ color: brown[600] }}
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </AppTheme>
  );
}

