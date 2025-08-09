import dayjs from "dayjs";
import React, { useContext } from "react";
import logo from "../../assets/logo.png";
import GlobalContext from "../../contexts/GlobalContext";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CreateEventButton from "./CreateEventButton";

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between",  px: 4, py: 2 }}>
      {/* <img src={logo} alt="calendar" style={{ width: 48, height: 48, marginRight: 8 }} /> */}
      {/* <Typography variant="h6" sx={{ color: "gray", fontWeight: "bold", mr: 10 }}>
        Calendar
      </Typography> */}
      <Box sx={{display: 'flex'}}>
      <Button
        onClick={handleReset}
        variant="outlined"
        sx={{ borderRadius: 2, py: 1, px: 3, mr: 5 }}
      >
        Today
      </Button>
      
      <Box>
      <IconButton onClick={handlePrevMonth} sx={{ color: "gray", mx: 1 }}>
        <ChevronLeftIcon />
      </IconButton>
      <IconButton onClick={handleNextMonth} sx={{ color: "gray", mx: 1 }}>
        <ChevronRightIcon />
      </IconButton>
      </Box>
      <Typography variant="h6" sx={{ ml: 4, color: "gray", fontWeight: "bold" }}>
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </Typography>
      </Box>
      <Box><CreateEventButton /></Box>
    </Box>
  );
}
