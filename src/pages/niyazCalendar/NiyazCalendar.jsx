import React, { useState, useContext, useEffect } from "react";
// import "./App.css";
import { getMonth } from "../../util";
import CalendarHeader from "../../components/niyazCalendar/CalendarHeader";
import Sidebar from "../../components/niyazCalendar/Sidebar";
import Month from "../../components/niyazCalendar/Month";
import GlobalContext from "../../contexts/GlobalContext";
import EventModal from "../../components/niyazCalendar/EventModal";
import { Box, CssBaseline, Paper } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import Labels from "../../components/niyazCalendar/Label";

function NiyazCalendar() {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

        useEffect(() => {
          document.title = "Niyaz Calendar - FMB 52"; // Set the title for the browser tab
        }, []);

  return (
    <AppTheme>
      <Box sx={{  display: "flex", flexDirection: "column" ,  mt: 12, width: "100%", pr: 2, pl: 2, pb: 2}}>
        <CssBaseline />
        <Paper
                  sx={{
                    width: '100%',
                    boxShadow: 1,
                    overflowX: 'auto',
                    p: 2,
                    pr: 4,
                    '@media (max-width: 600px)': {
                      p: 1,
                    },
                  }}
                >
      
      {showEventModal && <EventModal />}

        <CalendarHeader />
        <Box sx={{flex: 1, width: "100%"}}>
          {/* <Sidebar /> */}
          <Month month={currenMonth} />
        </Box>
        </Paper>
      </Box>
    </AppTheme>

  );
}

export default NiyazCalendar;
