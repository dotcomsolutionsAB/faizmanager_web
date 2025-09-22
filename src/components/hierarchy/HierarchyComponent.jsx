import React, { useState, useEffect } from 'react';
import AppTheme from '../../styles/AppTheme';
import { CssBaseline } from '@mui/material';
import {
  Box,
  Paper,
  Typography,
  InputLabel,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import divider from "../../assets/divider.png";
import { OrganizationChart } from 'primereact/organizationchart';
import { useUser } from '../../contexts/UserContext';

const HierarchyComponent = () => {
  const { token } = useUser();

  const [selection, setSelection] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [data, setData] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");

  // Fetch sectors
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const resp = await fetch("https://api.fmb52.com/api/sector", {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const result = await resp.json();
        if (result?.data?.length) {
          setSectors(result.data);
          setSelectedSector(prev => prev || result.data[0].id);
        }
      } catch (e) {
        console.error("Error fetching sectors:", e);
      }
    };
    fetchSectors();
  }, [token]);

  // Fetch hierarchy data when sector changes
  useEffect(() => {
    if (!selectedSector) return;

    const fetchHierarchyData = async () => {
      try {
        const resp = await fetch(`https://api.fmb52.com/api/sector/${selectedSector}/hierarchy`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const result = await resp.json();
        if (result) {
          setData(result); // set raw hierarchy data
        }
      } catch (e) {
        console.error("Error fetching hierarchy data:", e);
      }
    };

    fetchHierarchyData();
  }, [selectedSector, token]);

  // Node template for OrganizationChart
  const nodeTemplate = (node) => {
    if (node.type === 'person') {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" p={1}>
          {node.data.image && (
            <img
              alt={node.data.name}
              src={node.data.image}
              style={{ marginBottom: '8px', width: '48px', height: '48px', borderRadius: '50%' }}
            />
          )}
          <Typography variant="body1" fontWeight="bold" textAlign="center">
            {node.data.name}
          </Typography>
          <Typography variant="body2" textAlign="center">
            {node.data.title}
          </Typography>
        </Box>
      );
    }

    return node.label;
  };

  // Wrap multiple root nodes under a single invisible root
  const chartValue = data.length > 0 ? [{
    label: 'Hierarchy',
    type: 'person',
    expanded: true,
    data: { name: sectors.find(s => s.id === selectedSector)?.name || '', title: '', image: '' }, // invisible root
    children: data
  }] : [];

  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ width: '100%', overflowX: 'auto', mt: 15, pt: 1, pr: 2, pb: 3, pl: 2 }}>
        <Paper
          sx={{
            width: '100%',
            boxShadow: 1,
            overflowX: 'auto',
            minHeight: '700px',
            p: 1,
            '@media (max-width: 600px)': { p: 1 },
          }}
        >
          {/* Header + Sector Selector */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, px: 2, py: 1, borderRadius: 1 }}>
              Hierarchy
            </Typography>
            <FormControl sx={{ minWidth: 150, mr: 2 }}>
              <InputLabel id="sector-label">Sector</InputLabel>
              <Select
                labelId="sector-label"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                label="Sector"
                sx={{ height: "40px" }}
              >
                {sectors.map((sector) => (
                  <MenuItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Divider */}
          <Box
            sx={{
              width: "calc(100% + 32px)",
              position: "relative",
              height: 15,
              backgroundImage: `url(${divider})`,
              backgroundSize: "contain",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
              mb: 2,
              ml: "-24px",
              mr: "-24px",
            }}
          />

          {/* Organization Chart */}
         <Box 
  sx={{
    overflowX: 'auto',
    padding: 1,            // optional padding like card
    borderRadius: 1,       // optional, like card rounded corners
    boxShadow: 1,          // optional shadow like MUI Paper
    backgroundColor: 'background.paper', // optional background
  }}
>
            {chartValue.length > 0 ? (
              <OrganizationChart
                value={chartValue}
                selectionMode="multiple"
                selection={selection}
                onSelectionChange={(e) => setSelection(e.data)}
                nodeTemplate={nodeTemplate}
              />
            ) : (
              <Typography textAlign="center" color="textSecondary" py={4}>
                Loading...
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </AppTheme>
  );
};

export default HierarchyComponent;
