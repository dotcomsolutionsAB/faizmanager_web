// import React, { useState, useEffect } from "react";
// import { useOutletContext, useNavigate } from "react-router-dom";
// import { useUser } from "../../UserContext";
// import ThaaliStats from "../../components/dashboard/ThaaliStats";
// import AppTheme from "../../styles/AppTheme";
// import {
//   CssBaseline,
//   Box,
//   Grid,
//   useMediaQuery,
//   Typography,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import MumeneenStats from "../../components/dashboard/MumeneenStats";
// import AccountStats from "../../components/dashboard/AccountsStats";
// import AccountBreakupStats from "../../components/dashboard/AccountBreakupStats";
// import SectorsStats from "../../components/dashboard/SectorsStats";
// import divider from '../../assets/divider.png';
// import {yellow, brown} from '../../styles/ThemePrimitives';

// const Dashboard = () => {
//   const { selectedSector, selectedSubSector, selectedYear } = useOutletContext();
//   const { role, hofCount } = useUser();

//   console.log("count", hofCount);

  // const navigate = useNavigate();

//   const year = selectedYear.length ? selectedYear[0] : "1445-1446";
//   const sector = selectedSector.length ? selectedSector : ["all"];
//   const subSector = selectedSubSector.length ? selectedSubSector : ["all"];

//   const isMediumScreen = useMediaQuery("(max-width:1100px) and (min-width:900px)");

//   // Loading state to manage API calls or data updates
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     document.title = "Dashboard - FMB 52";
//     // Simulate data fetching and set `loading` to false when done
//     const timer = setTimeout(() => {
//       setLoading(false); // Update this logic based on actual API response or data fetching
//     }, 1000); // Simulated delay for fetching data

//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return (
//       <AppTheme>
//         <CssBaseline />
//         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
//           <CircularProgress />
//         </Box>
//       </AppTheme>
//     );
//   }

//   if (role === "superadmin") {
//     return (
//       <AppTheme>
//         <CssBaseline />
//         <Box
//           sx={{
//             backgroundColor: "#fff",
//             mt: 20,
//             pt: 2,
//             px: 3,
//             textAlign: "center",
//             pb: 3,
//             mr: 2,
//             ml: 2,
//             border: "1px solid #F4EBD0",
//             borderRadius: 2,
//             boxShadow: 1,
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: "bold",
//               marginBottom: 1,
//               padding: "8px 16px",
//               borderRadius: 1,
//               color: yellow[400],
//             }}
//           >
//             Super Admin Dashboard
//           </Typography>
//           <Typography variant="body1" sx={{ color: brown[700] }}>
//             This page is under development.
//           </Typography>
//         </Box>
//       </AppTheme>
//     );
//   }

//   if (role === "mumeneen") {
//     return (
//       <AppTheme>
//         <CssBaseline />
//         <Box
//           sx={{
//             backgroundColor: "#fff",
//             mt: 20,
//             pt: 2,
//             px: 3,
//             textAlign: "center",
//             pb: 3,
//             mr: 2,
//             ml: 2,
//             border: "1px solid #F4EBD0",
//             borderRadius: 2,
//             boxShadow: 1,
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: "bold",
//               marginBottom: 1,
//               padding: "8px 16px",
//               borderRadius: 1,
//               color: yellow[400],
//             }}
//           >
//             Mumeneen Dashboard
//           </Typography>
//           <Typography variant="body1" sx={{ color: brown[700] }}>
//             This page is under development.
//           </Typography>
//         </Box>
//       </AppTheme>
//     );
//   }

//   return (
//     <AppTheme>
//       <CssBaseline />
//       {role === "jamiat_admin" && hofCount === 0 ? (
//           <Box sx={{
//                 backgroundColor: "#fff", mt: 20, pt: 2, px: 3, textAlign: "center", pb: 3, mr: 2, ml: 2, border: "1px solid #F4EBD0",
//                 borderRadius: 2,
//                 boxShadow: 1,
//               }}>
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     fontWeight: "bold",
//                     marginBottom: 1,
//                     padding: "8px 16px",
//                     borderRadius: 1,
//                     color: yellow[400]
//                   }}
//                 >
//                   Welcome to FMB52!
//                 </Typography>
//                 <Box
//                   sx={{
//                     width: "calc(100% + 48px)",
//                     position: "relative",
//                     height: {
//                       xs: 10,
//                       sm: 15,
//                       md: 15,
//                       lg: 15,
//                       xl: 15,
//                     },
//                     backgroundImage: `url(${divider})`,
//                     backgroundSize: "contain",
//                     backgroundRepeat: "repeat-x",
//                     backgroundPosition: "center",
//                     mb: 2,
//                     marginLeft: "-24px",
//                     marginRight: "-24px",
//                   }}
//                 />
          
//                 <Typography variant="body1" gutterBottom sx={{ color: brown[700] }}>
//                   It looks like there are no users (Mumeneen) in the system yet. To start using the system, please import your Mumeneen database.
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   sx={{
//                     mt: 1,
//                     backgroundColor: yellow[400], // Apply yellow theme color
//                     '&:hover': {
//                       backgroundColor: yellow[100], // Hover effect color
//                       color: '#000',
//                     },
//                   }}
//                   onClick={() => {
//                     navigate("/settings"); // Navigate to the settings page
//                   }}
//                 >
//                   Import Mumeneen Database
//                 </Button>
//               </Box>
       
//         ) : (
//       <Box sx={{ width: "100%", pr: { sm: 4, md: 3, lg: 3 }, pb: 3, pt: 18 }}>

//           <Grid container spacing={isMediumScreen ? 1 : 2}>
//             <Grid item xs={12} sm={12} md={isMediumScreen ? 12 : 6}>
//               <ThaaliStats year={year} sector={sector} subSector={subSector} />
//             </Grid>
//             <Grid item xs={12} sm={12} md={isMediumScreen ? 12 : 6}>
//               <MumeneenStats year={year} sector={sector} subSector={subSector} />
//             </Grid>
//             <Grid item xs={12} sm={12} md={isMediumScreen ? 12 : 6}>
//               <AccountStats year={year} sector={sector} subSector={subSector} />
//             </Grid>
//             <Grid item xs={12} sm={12} md={isMediumScreen ? 12 : 6}>
//               <AccountBreakupStats
//                 year={year}
//                 sector={sector}
//                 subSector={subSector}
//               />
//             </Grid>
//             <Grid item xs={12} sm={12} md={12}>
//               <SectorsStats year={year} sector={sector} subSector={subSector} />
//             </Grid>
//           </Grid>
//       </Box>

//         )}
//     </AppTheme>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useUser } from "../../UserContext";
import AppTheme from "../../styles/AppTheme";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import MumeneenDashboard from "../../components/dashboard/MumeneenDashboard";
import JamiatAdminDashboard from "../../components/dashboard/JamiatAdminDashboard";
import SuperAdminDashboard from "../../components/dashboard/SuperAdminDashboard";

const Dashboard = () => {
  const { selectedSector, selectedSubSector, selectedYear } = useOutletContext();
  const { role, hofCount } = useUser();

  const year = selectedYear.length ? selectedYear[0] : "1445-1446";
  const sector = selectedSector.length ? selectedSector : ["all"];
  const subSector = selectedSubSector.length ? selectedSubSector : ["all"];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard - FMB 52";
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulated delay for fetching data
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <AppTheme>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      </AppTheme>
    );
  }

  switch (role) {
    case "mumeneen":
      return <MumeneenDashboard />;
    case "superadmin":
      return <SuperAdminDashboard />;
    case "jamiat_admin":
      return <JamiatAdminDashboard year={year} sector={sector} subSector={subSector} hofCount={hofCount} />;
    default:
      return (
        <AppTheme>
          <CssBaseline />
          <Box
            sx={{
              backgroundColor: "#fff",
              mt: 20,
              pt: 2,
              px: 3,
              textAlign: "center",
              pb: 3,
              mr: 2,
              ml: 2,
              border: "1px solid #F4EBD0",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <h2>Unauthorized</h2>
            <p>You do not have access to this dashboard.</p>
          </Box>
        </AppTheme>
      );
  }
};

export default Dashboard;
