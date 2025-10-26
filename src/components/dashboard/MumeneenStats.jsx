import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { brown, yellow } from '../../styles/ThemePrimitives';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import PeopleIcon from '@mui/icons-material/People';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import HouseIcon from '@mui/icons-material/House';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import PublicIcon from '@mui/icons-material/Public';
import { useUser } from '../../contexts/UserContext';
import { useState, useEffect } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessIcon from '@mui/icons-material/Business';
import divider from '../../assets/divider.png';





export default function MumeneenStats({ year, sector, subSector }) {
  const { token, accessRoleId } = useUser();

  const [mumeneenStats, setMumeneenStats] = useState({
    total_hof: 0,
    total_fm: 0,
    total_users: 0,
    total_males: 0,
    total_females: 0,
    total_children: 0,
    total_houses: 0,
    total_sectors_count: 0,
    total_sub_sectors_count: 0,

  });

  const [loading, setLoading] = useState(false);

  const fetchMumeneenStats = async () => {
    setLoading(true);
    try {
      const sectorParams = sector.map((s) => `sector[]=${encodeURIComponent(s)}`).join("&");
      const subSectorParams = subSector.map((s) => `sub_sector[]=${encodeURIComponent(s)}`).join("&");

      const url = `https://api.fmb52.com/api/dashboard/stats?year=${year}&${sectorParams}&${subSectorParams}&role_id=${accessRoleId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error fetching data");

      const data = await response.json();
      setMumeneenStats(data);
    } catch (error) {
      console.error("Error fetching Thaali stats:", error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    if (token && year && sector?.length > 0 && subSector?.length > 0) {
      fetchMumeneenStats();
    }
  }, [year, sector, subSector, token]);

  const yellowHierarchy = ['#FFCA28', '#FFD54F', '#FFE082', '#FFF59D'];
  const brownHierarchy = ['#6D4C41', '#8D6E63', '#BCAAA4', '#D7CCC8'];

  return (
    <Card
  sx={{
    minWidth: { xs: 250, sm: 350, md: 500 },
    width: '100%',
    height: { xs: 'auto', md: 500 },
    boxShadow: 3,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    padding: { xs: 1, sm: 2 },
    backgroundColor: '#FAFAFA', // Subtle background color
  }}
>
  {/* Header with Refresh Button */}
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: { xs: 'column', sm: 'row' }, // Stack for smaller screens
      gap: { xs: 2, sm: 0 },
      // paddingBottom: 1,
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: { xs: 'center', sm: 'left' } }}>
      Mumeneen Stats
    </Typography>
    <Button
      variant="outlined"
      color="primary"
      onClick={fetchMumeneenStats}
      disabled={loading}
      sx={{
        borderRadius: '50%',
        padding: 1.5,
        minWidth: 'auto',
        height: { xs: 35, sm: 40 },
        width: { xs: 35, sm: 40 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
    </Button>
  </Box>

  {/* Divider Image */}
  <Box
    sx={{
      width: '100vw', // Full screen width
      position: 'relative',
      left: 'calc(-50vw + 50%)', // Align with the screen edges
      height: {
        xs: 10, // Height for extra-small screens
        sm: 15, // Height for small screens
        md: 15, // Height for medium screens
        lg: 15, // Height for large screens
        xl: 15, // Height for extra-large screens
      },
      backgroundImage: `url(${divider})`, // Replace with your image path
      backgroundSize: 'contain', // Ensure the divider image scales correctly
      backgroundRepeat: 'repeat-x', // Repeat horizontally
      backgroundPosition: 'center',
      // my: { xs: 1.5, sm: 2, md: 2.5 }, // Vertical margin adjusted for different screen sizes
    }}
  />

  {/* Cards Section */}
  <Grid container rowSpacing={2} columnSpacing={2} sx={{ width: '100%' }}>
    {[
      { icon: <GroupsIcon />, label: 'Total Members', value: mumeneenStats.total_users, color: yellowHierarchy[3] },
      { icon: <PersonOutlineIcon />, label: 'Total HOF', value: mumeneenStats.total_hof, color: '#FFFDE7' },
      { icon: <PeopleIcon />, label: 'Total Family Members', value: mumeneenStats.total_fm, color: yellowHierarchy[3] },
      { icon: <ManIcon />, label: 'Total Males', value: mumeneenStats.total_males, color: '#FFFDE7' },
      { icon: <WomanIcon />, label: 'Total Females', value: mumeneenStats.total_females, color: yellowHierarchy[3] },
      { icon: <ChildCareIcon />, label: 'Total Children', value: mumeneenStats.total_children, color: '#FFFDE7' },
      { icon: <HouseIcon />, label: 'Total Houses', value: mumeneenStats.total_houses, color: yellowHierarchy[3] },
      { icon: <ApartmentIcon />, label: 'Total Sectors', value: mumeneenStats.total_sectors_count, color: '#FFFDE7' },
      { icon: <BusinessIcon />, label: 'Total Sub-Sectors', value: mumeneenStats.total_sub_sectors_count, color: yellowHierarchy[3] },
    ].map((stat, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: 1.5,
            '@media (min-width: 1100px) and (max-width: 1400px)': {
              paddingTop: 1, // Reduced padding for the 1100px to 1260px range
              paddingBottom: 1,
              paddingRight: 1,
              paddingLeft: 1
            },
            boxShadow: 2,
            borderRadius: 2,
            backgroundColor: stat.color,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 4,
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 1,
                color: '#4E342E',
              }}
            >
              {stat.icon}
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: brown[700] }}>
              {stat.label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: yellow[800] }}>
              {stat.value}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Card>


  );
}
