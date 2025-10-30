import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useUser } from '../../contexts/UserContext';
import divider from '../../assets/divider.png';

export default function HubDistributionStats({ year, sector, subSector }) {
  const { token, accessRoleId } = useUser();
  const [hubStats, setHubStats] = useState({
    total_hof: 0,
    hub_done: 0,
    hub_pending: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchHubStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.fmb52.com/api/dashboard/hub_distribution`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sector, sub_sector: subSector, role_id: accessRoleId }),
      });

      if (!response.ok) throw new Error("Error fetching data");

      const data = await response.json();
      console.log("Hub Distribution Stats:", data);

      setHubStats({
        total_hof: data.data.total_hof || 0,
        hub_done: data.data.hub_done || 0,
        hub_pending: data.data.hub_pending || 0,
      });
    } catch (error) {
      console.error("Error fetching hub distribution stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && sector?.length > 0 && subSector?.length > 0) {
      fetchHubStats();
    }
  }, [token, sector, subSector]);

  const totalHub = hubStats.hub_done + hubStats.hub_pending || 1;

  const data = [
    { name: 'Hub Done', value: hubStats.hub_done, color: '#2a9d8f', percentage: ((hubStats.hub_done / totalHub) * 100).toFixed(2) },
    { name: 'Hub Pending', value: hubStats.hub_pending, color: '#e76f51', percentage: ((hubStats.hub_pending / totalHub) * 100).toFixed(2) }
  ];

  const valueFormatter = (value) => `${value.percentage}%`;

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
        backgroundColor: '#FAFAFA',
        padding: { xs: 1, sm: 2, md: 2 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: { xs: 'center', sm: 'left' } }}>
          Hub Distribution Stats
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={fetchHubStats}
          disabled={loading}
          sx={{
            borderRadius: '50%',
            padding: 1.5,
            minWidth: 'auto',
            height: { xs: 35, sm: 40, md: 40 },
            width: { xs: 35, sm: 40, md: 40 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
        </Button>
      </Box>

      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: 'calc(-50vw + 50%)',
          height: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 },
          backgroundImage: `url(${divider})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
        }}
      />

      <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid item xs={12} sm={6} md={8} sx={{ order: { xs: 2, sm: 1 } }}>
          <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', marginLeft: 6 }}>
              <PieChart
                series={[{
                  data: data,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  valueFormatter,
                }]}
                height={280}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
              {data.map((entry, index) => (
                <Box key={index} sx={{ display: 'flex', marginRight: 3, alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: entry.color, marginRight: 1 }} />
                  <Typography variant="body2" sx={{ fontSize: 14 }}>
                    {entry.name} {entry.percentage}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4} md={4} sx={{ order: { xs: 1, sm: 2 } }}>
          <CardContent sx={{ paddingRight: 0.5, paddingLeft: 3 }}>
            <Grid container direction="column">
              {[
                { label: "Total HOF", value: hubStats.total_hof },
                { label: "Hub Done", value: hubStats.hub_done },
                { label: "Hub Pending", value: hubStats.hub_pending },
              ].map((stat, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: { xs: 1.5, md: 3.6 },
                    //   marginBottom: 1.5,
                      mt: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <CardContent>
                      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 }, textAlign: 'center' }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="h6" align="center" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {stat.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}
