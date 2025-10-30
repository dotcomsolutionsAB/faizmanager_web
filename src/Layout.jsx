// Layout.jsx
import { styled, useTheme } from '@mui/material/styles';
import { Box, CssBaseline } from "@mui/material";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import bg3 from './assets/bg3.jpg'
import Footer from "./components/footer/Footer";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SubHeader, { SUBHEADER_HEIGHT } from "./components/header/SubHeader"; // ⬅️ import height

const Layout = () => {
  const [selectedSector, setSelectedSector] = useState(['all']);
  const [selectedSubSector, setSelectedSubSector] = useState(['all']);
  const [selectedYear, setSelectedYear] = useState(''); // ⬅️ string, not []
  const [selectedSectorName, setSelectedSectorName] = useState([]);
  const [selectedSubSectorName, setSelectedSubSectorName] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
              overflowY: 'auto',
              transition: 'padding 0.3s ease',
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

            <SubHeader selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

            {/* Spacer to push content below fixed SubHeader */}
            <Box sx={{ height: SUBHEADER_HEIGHT }} />

            <Outlet
              context={{
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
              }}
            />
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Layout;
