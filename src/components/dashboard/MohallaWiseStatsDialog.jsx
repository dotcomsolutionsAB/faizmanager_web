// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Typography,
//   CircularProgress,
//   Box,
//   IconButton,
//   Select,
//   MenuItem
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import { useUser } from "../../UserContext";
// import divider from "../../assets/divider.png";

// export default function MohallaWiseDialog({ open, handleClose, sectorId }) {
//   const { token, currency } = useUser();
//   const [mohallaData, setMohallaData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [year, setYear] = useState("1446-1447");
//   const [type, setType] = useState("done"); // "done" | "pending"

//   useEffect(() => {
//     if (open && sectorId) {
//       fetchMohallaStats();
//     }
//   }, [open, sectorId, page, limit, year, type]);

//   const fetchMohallaStats = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("https://api.fmb52.com/api/users_by_sector", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sector_id: sectorId,
//           type,
//           year,
//           limit,
//           offset: (page - 1) * limit,
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to fetch Mohalla stats");

//       const data = await response.json();
//       setMohallaData(data.data || []);
//       setTotalPages(Math.ceil((data.pagination?.total || 0) / limit));
//     } catch (error) {
//       console.error("Error fetching Mohalla stats:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: currency?.currency_code || "INR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
//       <DialogTitle>
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <Typography variant="h6">Mohalla Wise Stats - {year}</Typography>
//           <IconButton onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </DialogTitle>

//       {/* Decorative Divider */}
//       <Box
//         sx={{
//           width: "100%",
//           height: 20,
//           backgroundImage: `url(${divider})`,
//           backgroundSize: "contain",
//           backgroundRepeat: "repeat-x",
//           backgroundPosition: "center",
//         }}
//       />

//       {/* Filters */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
//         <Select
//           value={year}
//           onChange={(e) => setYear(e.target.value)}
//           size="small"
//         >
//           {["1445-1446", "1446-1447"].map((yr) => (
//             <MenuItem key={yr} value={yr}>{yr}</MenuItem>
//           ))}
//         </Select>

//         <Select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           size="small"
//         >
//           <MenuItem value="done">Done</MenuItem>
//           <MenuItem value="pending">Pending</MenuItem>
//         </Select>

//         <Button
//           variant="outlined"
//           color="primary"
//           onClick={fetchMohallaStats}
//           disabled={loading}
//           sx={{
//             borderRadius: "50%",
//             padding: 1.5,
//             minWidth: "auto",
//             height: 40,
//             width: 40,
//           }}
//         >
//           {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
//         </Button>
//       </Box>

//       {/* Table */}
//       <DialogContent>
//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", padding: 5 }}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: "auto" }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ position: "sticky", top: 0, background: "#f5f5f5", zIndex: 1000 }}><strong>SN</strong></TableCell>
//                   <TableCell sx={{ position: "sticky", top: 0, background: "#f5f5f5", zIndex: 1000 }}><strong>Folio</strong></TableCell>
//                   <TableCell sx={{ position: "sticky", top: 0, background: "#f5f5f5", zIndex: 1000 }}><strong>ITS</strong></TableCell>
//                   <TableCell sx={{ position: "sticky", top: 0, background: "#f5f5f5", zIndex: 1000 }}><strong>Name</strong></TableCell>
//                   <TableCell sx={{ position: "sticky", top: 0, background: "#f5f5f5", zIndex: 1000 }}><strong>Sector</strong></TableCell>
//                   <TableCell sx={{ position: "sticky", top: 0, background: "#f5f5f5", zIndex: 1000, textAlign: "right" }}><strong>Amount</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {mohallaData.map((user, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{index + 1 + (page - 1) * limit}</TableCell>
//                     <TableCell>{user.folio_no}</TableCell>
//                     <TableCell>{user.its}</TableCell>
//                     <TableCell>{user.name}</TableCell>
//                     <TableCell>{user.sector}</TableCell>
//                     <TableCell sx={{ textAlign: "right" }}>{formatCurrency(user.amount)}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </DialogContent>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
//              <Typography variant="body2">Records Per Page:</Typography>
//              <Select
//                value={limit}
//                onChange={(e) => {
//                  setLimit(e.target.value);
//                  setPage(1); 
//                }}
//                size="small"
//              >
//                {[10, 20, 50, 100].map((num) => (
//                  <MenuItem key={num} value={num}>{num}</MenuItem>
//                ))}
//              </Select>
//            </Box>
     
//            <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
//              <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
//                Previous
//              </Button>
     
//              <Typography>
//                Page {page} of {totalPages}
//              </Typography>
     
//              <Button
//                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//                disabled={page >= totalPages}
//              >
//                Next
//              </Button>
//            </DialogActions>
//          </Dialog>
//   );
// }


import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../../contexts/UserContext";
import divider from "../../assets/divider.png";

export default function MohallaWiseStatsDialog({ open, handleClose, sectorId, type }) {
  const { token, currency } = useUser();
  const [mohallaData, setMohallaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  

  useEffect(() => {
    if (open && sectorId) {
      fetchMohallaStats();
    }
  }, [open, sectorId, page, limit]);

  const fetchMohallaStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.fmb52.com/api/dashboard/users_by_sector", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sector_id: sectorId,
          type,
          year: "1446-1447",
          limit,
          offset: (page - 1) * limit,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setMohallaData(data.data || []);
      setTotalPages(Math.ceil((data.pagination?.total || 0) / limit));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency?.currency_code || "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Sector Wise Stats</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Decorative Divider */}
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

      {/* Table */}
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>SN</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Folio</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>ITS</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Sector</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>1445-1446H</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>1446-1447H</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mohallaData.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1 + (page - 1) * limit}</TableCell>
                    <TableCell>{user.folio_no}</TableCell>
                    <TableCell>{user.its}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={user.photo_url}
                          alt="user"
                          style={{
                            width: 30,
                            height: 30,
                            // borderRadius: "50%",
                            marginRight: 8,
                            // border: "2px solid #FFD700",
                          }}
                        />
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.sector}</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>{formatCurrency(user.last_year_hub)}</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>{formatCurrency(user.this_year_hub)}</TableCell>
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
