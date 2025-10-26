import React from "react";
import { Box, CssBaseline } from "@mui/material";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import bg3 from './assets/bg3.jpg'
import Footer from "./components/footer/Footer";
import { yellow } from './styles/ThemePrimitives'; // Assuming this is where your color is defined
import { styled, useTheme } from '@mui/material/styles';
import { useState } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet to render nested routes
import SubHeader from "./components/header/SubHeader";


const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;



const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));


const Layout = () => {
  const [selectedSector, setSelectedSector] = useState(['all']);
  const [selectedSubSector, setSelectedSubSector] = useState(['all']);
  const [selectedYear, setSelectedYear] = useState([]);
  const[selectedSectorName, setSelectedSectorName] = useState([]);
  const [selectedSubSectorName, setSelectedSubSectorName] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);


  // console.log("Select sector LAyout", selectedSector)
  // console.log("Select sector LAyout", selectedSubSector)
  // console.log("Select sector LAyout", selectedYear)
  // console.log("Children:", children);


  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${bg3})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed", 
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <Sidebar sx={{ flexGrow: 0 }} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minHeight: '100vh',
              overflowY: 'auto', // Enable vertical scrolling for the main content
              // pl: 3, // Padding for the main content
              transition: 'padding 0.3s ease', // Smooth transition for padding
            }}
          >
            <Header
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              selectedSubSector={selectedSubSector}
              setSelectedSubSector={setSelectedSubSector}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedSectorName={selectedSectorName}
              setSelectedSectorName={setSelectedSectorName}
              selectedSubSectorName={selectedSubSectorName}
              setSelectedSubSectorName={setSelectedSubSectorName}
            />
            <SubHeader
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear} />
            <Outlet context={{
              selectedSector,
              setSelectedSector,
              selectedSubSector,
              setSelectedSubSector,
              selectedYear,
              setSelectedYear,
              selectedSectorName,
              setSelectedSectorName,
              selectedSubSectorName,
              setSelectedSubSectorName
            }} />
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Layout;
