import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUser } from '../../UserContext';
import divider from '../../assets/divider.png';

export default function NiyazUsersDialog({ open, handleClose, slabId, slabName }) {
  const { token, currency } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (open && slabId) {
      fetchUsers();
    }
  }, [open, slabId, page, limit]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.fmb52.com/api/dashboard/users_by_niyaz', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niyaz_slab: slabId,
          year: '1446-1447', 
          limit,
          offset: (page - 1) * limit,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();

      setUsers(data.data || []);
      setTotalCount(data.pagination?.total || 0);
      setTotalPages(Math.ceil((data.pagination?.total || 0) / limit));
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency dynamically based on user’s currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency?.currency_code || 'INR', // Use user’s currency or default to INR
      minimumFractionDigits: 0, // No decimal places
      maximumFractionDigits: 0, // No decimal places
    }).format(value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{slabName} Count</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* <Divider /> */}
      <Box
        sx={{
          width: '100%', // Full screen width
          position: 'relative',
          minHeight: 15,
        
          height: {
            xs: 10, // Height for extra-small screens
            sm: 15, // Height for small screens
            md: 25, // Height for medium screens
            lg: 25, // Height for large screens
            xl: 25, // Height for extra-large screens
          },
          backgroundImage: `url(${divider})`, // Replace with your image path
          backgroundSize: 'contain', // Ensure the divider image scales correctly
          backgroundRepeat: 'repeat-x', // Repeat horizontally
          backgroundPosition: 'center',
          // my: { xs: 1.5, sm: 2, md: 2.5 }, // Vertical margin adjusted for different screen sizes
        }}
      />


      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>SN</strong></TableCell>
                  <TableCell><strong>Folio</strong></TableCell>
                  <TableCell><strong>ITS</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Sector</strong></TableCell>
                  <TableCell><strong>1445-1446H</strong></TableCell>
                  <TableCell><strong>1446-1447H</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1 + (page - 1) * limit}</TableCell>
                    <TableCell>{user.folio_no}</TableCell>
                    <TableCell>{user.its}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src={user.photo_url}
                          alt="user"
                          style={{
                            width: 30,
                            height: 30,
                            // borderRadius: '50%',
                            marginRight: 8,
                          }}
                        />
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.sector}</TableCell>
                    <TableCell>{formatCurrency(user.last_year_hub)}</TableCell>
                    <TableCell>{formatCurrency(user.this_year_hub)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <Divider />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="body2">Records Per Page:</Typography>
        <Select
          value={limit}
          onChange={(e) => {
            setLimit(e.target.value);
            setPage(1); 
          }}
          size="small"
        >
          {[10, 20, 50, 100].map((num) => (
            <MenuItem key={num} value={num}>{num}</MenuItem>
          ))}
        </Select>
      </Box>

      <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
        <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </Button>

        <Typography>
          Page {page} of {totalPages}
        </Typography>

        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </DialogActions>
    </Dialog>
  );
}



// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   CircularProgress,
//   Box,
//   IconButton,
//   Divider
// } from '@mui/material';
// import { DataGridPro } from '@mui/x-data-grid-pro';
// import CloseIcon from '@mui/icons-material/Close';
// import { useUser } from '../../UserContext';

// export default function NiyazUsersDialog({ open, handleClose, slabId, slabName }) {
//   const { token } = useUser();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalCount, setTotalCount] = useState(0);
//   const [page, setPage] = useState(0); // DataGrid uses 0-based indexing
//   const [limit, setLimit] = useState(10); // Default records per page
//   const [hasMore, setHasMore] = useState(true); // API 'has_more' flag

//   useEffect(() => {
//     if (open && slabId) {
//       fetchUsers();
//     }
//   }, [open, slabId, page, limit]);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('https://api.fmb52.com/api/users_by_niyaz', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           niyaz_slab: slabId,
//           year: '1446-1447',
//           limit,
//           offset: page * limit, // Corrected Offset Calculation
//         }),
//       });

//       if (!response.ok) throw new Error('Failed to fetch user data');
//       const data = await response.json();
      
//       setUsers(data.data || []);
//       setTotalCount(data.pagination?.total || 0); // Ensure total count is from API
//       setHasMore(data.pagination?.has_more || false); // Handle has_more flag
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // **Calculate Total Pages Based on API Response**
//   const totalPages = totalCount > 0 ? Math.ceil(totalCount / limit) : 1;

//   // **Define columns for DataGridPro**
//   const columns = [
//     { field: 'folio_no', headerName: 'Folio', flex: 1 },
//     { field: 'its', headerName: 'ITS', flex: 1 },
//     {
//       field: 'name',
//       headerName: 'Name',
//       flex: 2,
//       renderCell: (params) => (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <img
//             src={params.row.photo_url || 'https://via.placeholder.com/40'}
//             alt="user"
//             style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 8 }}
//           />
//           {params.row.name}
//         </Box>
//       ),
//     },
//     { field: 'sector', headerName: 'Mohalla', flex: 1 },
//     {
//       field: 'thaali_status',
//       headerName: 'Thaali Status',
//       flex: 1,
//       renderCell: (params) => (
//         <Typography sx={{ color: params.value === 'Taking Thaali' ? 'green' : 'red' }}>
//           {params.value}
//         </Typography>
//       ),
//     },
//     { field: 'last_year_hub', headerName: '1445-1446H', flex: 1 },
//     {
//       field: 'this_year_hub',
//       headerName: '1446-1447H',
//       flex: 1,
//       renderCell: (params) => (
//         <Box>
//           {params.value}
//           {params.row.total_overdue && (
//             <Typography variant="body2" color="error">
//               (Overdue - {params.row.total_overdue})
//             </Typography>
//           )}
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
//       <DialogTitle>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="h6">{slabName} Count</Typography>
//           <IconButton onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </DialogTitle>

//       <Divider />

//       <DialogContent>
//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <Box sx={{ height: 500, width: '100%' }}>
//             <DataGridPro
//               rows={users}
//               columns={columns}
//               getRowId={(row) => row.its} // Use ITS as a unique row identifier
//               pagination
//               paginationMode="server"
//               rowCount={totalCount}
//               pageSizeOptions={[10, 20, 50, 100]}
//               pageSize={limit}
//               onPageSizeChange={(newLimit) => {
//                 setLimit(newLimit);
//                 setPage(0); // Reset to first page on limit change
//               }}
//               onPaginationModelChange={({ page, pageSize }) => {
//                 setPage(page); // DataGrid uses 0-based page index
//                 setLimit(pageSize);
//               }}
//               sx={{
//                 '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5', fontWeight: 'bold' },
//                 '& .MuiDataGrid-footerContainer': { justifyContent: 'space-between' },
//               }}
//             />
//           </Box>
//         )}
//       </DialogContent>

//       <Divider />

//       {/* Pagination Controls */}
//       <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
//         <Button
//           onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
//           disabled={page === 0}
//         >
//           Previous
//         </Button>
//         <Typography>Page {page + 1} of {totalPages}</Typography>
//         <Button
//           onClick={() => setPage((prev) => (hasMore ? prev + 1 : prev))}
//           disabled={!hasMore}
//         >
//           Next
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
