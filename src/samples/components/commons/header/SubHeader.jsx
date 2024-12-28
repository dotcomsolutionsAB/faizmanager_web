import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';

export default function SubHeader() {
  const theme = useTheme();

  // Sample data for dropdowns
  const sectors = ['Sector 1', 'Sector 2', 'Sector 3'];
  const subSectors = ['Sub Sector 1', 'Sub Sector 2', 'Sub Sector 3'];
  const years = ['2023', '2024', '2025'];

  const [selectedSector, setSelectedSector] = React.useState('');
  const [selectedSubSector, setSelectedSubSector] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState('');

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        py: 2,
        px: { xs: 2, sm: 4, md: 6 },
        boxShadow: theme.shadows[1],
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: 'center',
        justifyContent: { xs: 'flex-start', md: 'flex-end' }, // Align to the right on medium+ screens
        borderRadius: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.text.secondary,
          mr: 'auto', // Push the title to the left
        }}
      >
        Narrow Your Search
      </Typography>

      {/* Sector Select */}
      <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
        <TextField
          select
          label="Select Sector"
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1 }}
        >
          {sectors.map((sector, index) => (
            <MenuItem key={index} value={sector}>
              {sector}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>

      {/* Sub-Sector Select */}
      <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
        <TextField
          select
          label="Select Sub-Sector"
          value={selectedSubSector}
          onChange={(e) => setSelectedSubSector(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1 }}
        >
          {subSectors.map((subSector, index) => (
            <MenuItem key={index} value={subSector}>
              {subSector}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>

      {/* Year Select */}
      <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
        <TextField
          select
          label="Select Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1 }}
        >
          {years.map((year, index) => (
            <MenuItem key={index} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
    </Box>
  );
}
