import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Avatar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CssBaseline,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useUser } from '../../UserContext';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import HofDetailsForm from './HofDetailsForm';
import SectorDetailsForm from './SectorDetailsForm';
import { yellow } from '../../styles/ThemePrimitives';
import { brown } from '../../styles/ThemePrimitives';
import PersonIcon from '@mui/icons-material/Person';
import OverviewTable from './OverviewTable';
import FamilyDetails from './FamilyDetails';
import ThaliDetails from './ThaliDetails';
import AppTheme from '../../styles/AppTheme';

function MumeneenDetailsTable() {
  const { id } = useParams();
  const { token, loading } = useUser();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [hubData, setHubData] = useState([]);
  const [familyId, setFamilyId] = useState(null); // State to store the family_id



  // const hubData = [
  //   { year: '1445-1446', hub_amount: 60000, due_amount: 20000 },
  //   { year: '1444-1445', hub_amount: 53000, due_amount: 0 },
  //   { year: '1443-1444', hub_amount: 45000, due_amount: 0 },
  //   { year: '1442-1443', hub_amount: 42000, due_amount: 0 },
  //   { year: '1441-1442', hub_amount: 30000, due_amount: 0 },
  //   { year: '1440-1441', hub_amount: 99000, due_amount: 0 },
  //   { year: '1439-1440', hub_amount: 30000, due_amount: 0 },
  // ];

  useEffect(() => {
    if (loading || !token) return;

    const fetchDetails = async () => {
      try {
        const userResponse = await fetch(`https://api.fmb52.com/api/user_details/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error(`Error ${userResponse.status}: ${userResponse.statusText}`);
        }

        const userData = await userResponse.json();
        // console.log(userData)
        if (userData.data && userData.data.length > 0) {
          setDetails(userData.data[0]);
          setFamilyId(userData.data[0].family_id);
        } else {
          throw new Error('No details found.');
        }

        // Fetch hub details for this user
        const hubResponse = await fetch(`https://api.fmb52.com/api/family_hub_details/${userData.data[0].family_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!hubResponse.ok) {
          throw new Error(`Error ${hubResponse.status}: ${hubResponse.statusText}`);
        }

        const hubData = await hubResponse.json();
        setHubData(hubData.data); // Set the fetched hub data in state
      } catch (error) {
        console.error('Error fetching user or hub details:', error);
        setError('The data is currently unavailable, but we are working to resolve this. Thank you for your patience!');
      }
    };

    fetchDetails();
  }, [id, token, loading]);

  if (loading || !details) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        {error ? (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        ) : (
          <CircularProgress />
        )}
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  if (loading || !details) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        {error ? (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        ) : (
          <CircularProgress />
        )}
      </Box>
    );
  }

  // Get the first letter of the name for the avatar fallback
  const getAvatarName = () => {
    return details.name ? details.name.charAt(0).toUpperCase() : '';
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        flexWrap: 'wrap', 
        gap: 2,
        // padding: 2,
        mt: 7, pt: 9, pr: 2, pb: 3, pl: 2,
        // width: '100%',
        // maxWidth: '1500px',
        // margin: '0 auto',
      }}
    >
      {/* Mumeneen Details and Hub Table Box */}
      <Paper
        sx={{
          padding: 3,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: 3,
          flex: '0 1 300px',
          // maxWidth: '400px',
          width: { xs: '100%', sm: '48%', md: '48%' },
          height: '100%'
        }}
      >
        {/* Block 1: Name and Avatar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 2,
            mb: 3,
            borderBottom: '2px solid #8B4513',
            paddingBottom: 2,
          }}
          
        >
          <Avatar
            alt={details.name}
            src={details.photo?.file_url || '/static/images/avatar-placeholder.png'} // Use the API image if available, else fallback image
            sx={{
              width: { xs: 120, sm: 120, md: 150 },  // Adjust avatar size on smaller screens
              height: { xs: 120, sm: 120, md: 180 },
              border: '2px solid #ddd',
              borderRadius: '8px',
            }}
          >
            {/* Fallback to first letter of name if no photo is provided */}
            {details.photo ? null : getAvatarName()}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ paddingBottom: 1, color: brown[700] }}>{details.name}</Typography>

            {/* Display ITS */}
            {details.its && (
              <Typography
                variant="body1"
                sx={{
                  // padding: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', paddingBottom: 1 }}>
                  <BadgeIcon
                    sx={{
                      fontSize: 22,
                      verticalAlign: 'middle',
                      color: yellow[200],
                      marginRight: 1,
                    }}
                  />
                  <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 600, color: yellow[400] }}>
                    ITS:
                  </Typography>
                </Box>
                <Box sx={{ color: brown[400] }}>{details.its || 'N/A'}</Box>
              </Typography>
            )}

            {/* Display Mobile */}
            {details.mobile && (
              <Typography
                variant="body1"
                sx={{
                  // padding: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <PhoneIcon
                    sx={{
                      fontSize: 22  ,
                      verticalAlign: 'middle',
                      color: yellow[200],
                      marginRight: 1,
                    }}
                  />
                  <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 600, color: yellow[400] }}>
                    Mobile:
                  </Typography>
                </Box>
                <Box sx={{ color: brown[400], marginLeft: 2, paddingTop: 0.3}}> 
                  <a
                  href={`https://wa.me/+91${details.mobile.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: brown[400], // Keep text color same as value color
                    textDecoration: 'none', // Remove underline
                  }}
                  onMouseEnter={(e) => (e.target.style.color = brown[600])} // Darker color on hover
                  onMouseLeave={(e) => (e.target.style.color = brown[400])} // Revert to original color
                >
                  {details.mobile}
                </a>
                </Box>
              </Typography>
            )}
          </Box>

        </Box>

        {/* Block 2: Contact Information */}
        <Box
          sx={{
            borderBottom: '2px solid #8B4513', // Brown accent for section divider
            paddingBottom: 2,
            marginBottom: 2,
          }}
        >

          {details.email && (<Typography variant="body1" sx={{ padding: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon
                sx={{
                  fontSize: 22,
                  verticalAlign: 'middle',
                  color: yellow[200],

                  marginRight: 1,
                }}
              />
              <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 600, color: yellow[400] }}>Email:</Typography>
            </Box>
            <Box sx={{ color: brown[400] }}>{details.email || 'N/A'}</Box>
          </Typography>)}


          <Typography variant="body1" sx={{ padding: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationCityIcon
                sx={{
                  fontSize: 22,
                  verticalAlign: 'middle',
                  color: yellow[200],

                  marginRight: 1,
                }}
              />
              <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 600, color: yellow[400] }}>Sector:</Typography>
            </Box>
            <Box sx={{ color: brown[400] }}>{details.sector || 'N/A'}</Box>
          </Typography>


          <Typography variant="body1" sx={{ padding: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon
                sx={{
                  fontSize: 22,
                  verticalAlign: 'middle',
                  color: yellow[200],
                  marginRight: 1,
                }}
              />
              <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 600, color: yellow[400] }}>Folio No:</Typography>
            </Box>
            <Box sx={{ color: brown[400] }}>{details.folio_no || 'N/A'}</Box>
          </Typography>

          <Typography variant="body1" sx={{ padding: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon
                sx={{
                  fontSize: 22,
                  verticalAlign: 'middle',
                  color: yellow[200],
                  marginRight: 1,
                }}
              />
              <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 600, color: yellow[400] }}>Masool:</Typography>
            </Box>
            <Box sx={{ color: brown[400] }}>{details.masool || 'N/A'}</Box>
          </Typography>

          <Typography variant="body1" sx={{ padding: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PhoneIcon
                sx={{
                  fontSize: 22,
                  verticalAlign: 'middle',
                  color: yellow[200],
                  marginRight: 1,
                }}
              />
              <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 600, color: yellow[400] }}>Masool Mobile No:</Typography>
            </Box>
            <Box sx={{ color: brown[400] }}>{details.masool_mobile_no || 'N/A'}</Box>
          </Typography>
        </Box>

       


        {/* Block 3: Hub Details Table */}
        <Box>
          <Typography variant="h6" gutterBottom paddingLeft={1}>
            Hub Details
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8F8F8' }}>
                  <TableCell>Year</TableCell>
                  <TableCell>Hub</TableCell>
                  <TableCell>Due</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hubData.map((hub, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? yellow[100] : '#FFF', // Alternate row colors
                      '&:hover': {
                        backgroundColor: '#EFE2D3', // Add hover effect
                      },
                    }}
                  >
                    <TableCell>{hub.year}</TableCell>
                    <TableCell>₹{hub.hub_amount.toLocaleString()}</TableCell>
                    <TableCell>₹{hub.due_amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* Horizontal Menu */}
      <Paper
        sx={{
          padding: 2,
          borderRadius: '8px',
          boxShadow: 3,
          backgroundColor: '#ffffff',
          flex: 1,
          width: { xs: '100%', sm: '48%', md: '48%' },
          height: '100%'
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Menu Tabs"
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '.MuiTabs-indicator': {
              backgroundColor: '#795548', // Brown color for the indicator
              height: '3px',
            },
            '.MuiTab-root': {
              fontWeight: 500,
              fontSize: '14px',
              color: '#555',
              textTransform: 'none',
            },
            '.Mui-selected': {
              color: '#333',
              fontWeight: 'bold',
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="HOF Details" />
          <Tab label="Family Details" />
          <Tab label="Sector Details" />
          <Tab label="Thali Details" />
          <Tab label="Notification Settings" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {selectedTab === 0 && <OverviewTable familyId={details.family_id} /> }
          {selectedTab === 1 && <HofDetailsForm />}
          {selectedTab === 2 && <FamilyDetails familyId={details.family_id} /> }
          {selectedTab === 3 && <SectorDetailsForm />}
          {selectedTab === 4 && <ThaliDetails />}
          {selectedTab === 5 && <Typography variant="body1">Notification Settings Content</Typography>}
        </Box>
      </Paper>
    </Box>
    </AppTheme>
  );
}

export default MumeneenDetailsTable;
