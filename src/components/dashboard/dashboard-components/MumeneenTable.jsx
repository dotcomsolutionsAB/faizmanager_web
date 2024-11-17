import React, { useEffect, useState } from 'react';
import { Box, Paper, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { useUser } from '../../../UserContext';

function MumeneenTable() {
  const { token, loading } = useUser();
  const [rows, setRows] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortModel, setSortModel] = useState([]);
  const [filterType, setFilterType] = useState('HOF');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const columns = [
    { field: 'name', headerName: 'Name', width: 200, sortable: true },
    { field: 'its', headerName: 'ITS', width: 150, sortable: true },
    { field: 'mobile', headerName: 'Mobile', width: 150, sortable: true },
    { field: 'folio_no', headerName: 'Folio No', width: 150, sortable: true },
    { field: 'sector', headerName: 'Sector', width: 150, sortable: true },
    { field: 'sub_sector', headerName: 'Subsector', width: 150, sortable: true },
    { field: 'hof_its', headerName: 'HOF ITS', width: 150, sortable: true },
    { field: 'mumeneen_type', headerName: 'Mumeneen Type', width: 150, sortable: true },
    { field: 'hub_amount', headerName: 'Hub Amount', width: 150, sortable: true },
    { field: 'paid_amount', headerName: 'Paid Amount', width: 150, sortable: true },
    { field: 'due_amount', headerName: 'Due Amount', width: 150, sortable: true },
    { field: 'overdue', headerName: 'OverDue Amount', width: 150, sortable: true },
  ];

  useEffect(() => {
    if (loading || !token) return;

    const fetchData = async () => {
      try {
        const response = await fetch('https://faiz.dotcombusiness.in/api/get_all_user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setRows(data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token, loading]);

  // Filter rows based on filterText and filterType
  const filteredRows = rows.filter((row) => {
    const matchesFilterText =
      row.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.its?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.mobile?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.folio_no?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.sector?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.sub_sector?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.hof_its?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.mumeneen_type?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.hub_amount?.toString().includes(filterText) ||
      row.paid_amount?.toString().includes(filterText) ||
      row.due_amount?.toString().includes(filterText) ||
      row.overdue?.toString().includes(filterText);

    const matchesFilterType =
      filterType === 'All' || (row.mumeneen_type && row.mumeneen_type.trim().toUpperCase() === filterType);

    return matchesFilterText && matchesFilterType;
  });

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Paper
        sx={{
          width: '100%',
          boxShadow: 1,
          overflowX: 'auto',
          p: 2,
          '@media (max-width: 600px)': {
            p: 1, // Adjust padding for smaller screens
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap', // Allow items to wrap on smaller screens
            gap: 2,
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            sx={{ width: { xs: '100%', sm: '300px' } }} // Adjust width for smaller screens
            InputProps={{
              sx: {
                height: '52px',
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
          <FormControl sx={{ minWidth: 150, width: { xs: '100%', sm: '150px' } }}> {/* Adjust width */}
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
        </Box>

        <DataGridPro
          autoHeight
          rows={filteredRows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          checkboxSelection
          disableSelectionOnClick
          pagination
          paginationMode="client"
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
          getRowId={(row) => row.email || row.its || Math.random()}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5', // Optional: Add a background color to column headers
            },
            '@media (max-width: 600px)': {
              '& .MuiDataGrid-columnHeaders': {
                fontSize: '0.75rem', // Reduce font size on smaller screens
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.75rem', // Reduce font size for cells on smaller screens
              },
            },
          }}
        />
      </Paper>
    </Box>
  );
}

export default MumeneenTable;
