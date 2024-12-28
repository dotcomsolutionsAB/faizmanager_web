import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useUser } from "../../UserContext";
import ThaaliStats from "../../components/dashboard/ThaaliStats";
import AppTheme from "../../styles/AppTheme";
import { CssBaseline, Box, Grid, useMediaQuery } from "@mui/material";
import MumeneenStats from "../../components/dashboard/MumeneenStats";
import AccountStats from "../../components/dashboard/AccountsStats";
import AccountBreakupStats from "../../components/dashboard/AccountBreakupStats";
import SectorStats from "../../components/dashboard/SectorsStats";
import SectorsStats from "../../components/dashboard/SectorsStats";

const Dashboard = () => {
  const {
    selectedSector,
    selectedSubSector,
    selectedYear,
  } = useOutletContext();

  const { token } = useUser();

  // Convert the selected values into the appropriate format
  const year = selectedYear.length ? selectedYear[0] : "1445-1446"; // Default to "1445-1446" if no year selected
  const sector = selectedSector.length ? selectedSector : ["all"]; // Default to "all" if no sector selected
  const subSector = selectedSubSector.length ? selectedSubSector : ["all"]; // Default to "all" if no sub-sector selected

  // // State to store the fetched stats
  // const [thaaliStats, setThaaliStats] = useState({
  //   total_houses: 0,
  //   thaali_taking: 0,
  //   hub_not_set: 0,
  // });

  // const [mumeneenStats, setMumeneenStats] = useState({
  //   total_hof: 0,
  //   total_fm: 0,
  //   total_users: 0,
  //   total_males: 0,
  //   total_females: 0,
  //   total_children: 0,
  // });

  // const [loading, setLoading] = useState(false);

  // // Function to fetch data from the API
  // const fetchStats = async () => {
  //   setLoading(true);
  //   try {
  //     // Construct the URL with array parameters for sector and sub-sector
  //     const sectorParams = sector.map((s) => `sector[]=${encodeURIComponent(s)}`).join("&");
  //     const subSectorParams = subSector.map((s) => `sub_sector[]=${encodeURIComponent(s)}`).join("&");

  //     const url = `https://api.fmb52.com/api/dashboard-stats?year=${year}&${sectorParams}&${subSectorParams}`;

  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`, // Include Bearer token in headers
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Error fetching data");
  //     }

  //     const data = await response.json();
  //     console.log("API Response:", data);

  //     // Update state with the fetched data
  //     setThaaliStats({
  //       total_houses: data.total_houses,
  //       thaali_taking: data.thaali_taking,
  //       hub_not_set: data.hub_not_set,
  //     });

  //     setMumeneenStats({
  //       total_hof: data.total_hof,
  //       total_fm: data.total_fm,
  //       total_users: data.total_users,
  //       total_males: data.total_males,
  //       total_females: data.total_females,
  //       total_children: data.total_children,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false); // Set loading to false after data is fetched
  //   }
  // };

  // Use useEffect to call the API when the component mounts or when selected values change
  // useEffect(() => {
  //   fetchStats();
  // }, [selectedSector, selectedSubSector, selectedYear]);


  // Media query to handle responsiveness
  const isMediumScreen = useMediaQuery("(max-width:1100px) and (min-width:900px)");

    // Set the document title
    useEffect(() => {
      document.title = "Dashboard - FMB 52"; // Set the title for the browser tab
    }, []);
  
  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ width: "100%", pr: {sm: 4, md: 3, lg: 3}, pb: 3 , pt: 18}}>
        <Grid container spacing={isMediumScreen ? 1 : 2}>
          {/* Adjust grid item sizes dynamically based on screen size */}
          <Grid item xs={12} sm={12} md={isMediumScreen ? 12 : 6}>
            <ThaaliStats year={year} sector={sector} subSector={subSector} />
          </Grid>
          <Grid item xs={12} sm={12} md={isMediumScreen ? 12 : 6}>
            <MumeneenStats year={year} sector={sector} subSector={subSector} />
          </Grid>
          <Grid item xs={12} sm={12} md={isMediumScreen ? 12 : 6}>
            <AccountStats year={year} sector={sector} subSector={subSector} />
          </Grid>
          <Grid item xs={12} sm={12} md={isMediumScreen ? 12 : 6}>
            <AccountBreakupStats year={year} sector={sector} subSector={subSector} />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <SectorsStats year={year} sector={sector} subSector={subSector} />
          </Grid>
        </Grid>
      </Box>
    </AppTheme>
  );
};

export default Dashboard;
