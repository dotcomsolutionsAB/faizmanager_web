import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { getMonth } from "../../util";
import { Box, Button, Typography, Grid } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function SmallCalendar() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  const [currentMonth, setCurrentMonth] = useState(getMonth());

  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  const {
    monthIndex,
    setSmallCalendarMonth,
    setDaySelected,
    daySelected,
  } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  function handlePrevMonth() {
    setCurrentMonthIdx(currentMonthIdx - 1);
  }
  function handleNextMonth() {
    setCurrentMonthIdx(currentMonthIdx + 1);
  }

  function getDayClass(day) {
    const format = "DD-MM-YY";
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    const slcDay = daySelected && daySelected.format(format);
    if (nowDay === currDay) {
      return { backgroundColor: "#1976d2", color: "white", borderRadius: "50%" };
    } else if (currDay === slcDay) {
      return { backgroundColor: "#bbdefb", color: "#1976d2", fontWeight: "bold", borderRadius: "50%" };
    } else {
      return {};
    }
  }

  return (
    <Box sx={{ mt: 3 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ color: "gray" }}>
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format("MMMM YYYY")}
        </Typography>
        <Box>
          <Button onClick={handlePrevMonth}>
            <ChevronLeftIcon sx={{ color: "gray" }} />
          </Button>
          <Button onClick={handleNextMonth}>
            <ChevronRightIcon sx={{ color: "gray" }} />
          </Button>
        </Box>
      </header>

      <Grid container spacing={1} sx={{ mt: 2 }}>
        {currentMonth[0].map((day, i) => (
          <Grid item xs={1} key={i}>
            <Typography variant="body2" align="center" sx={{ color: "gray" }}>
              {day.format("dd").charAt(0)}
            </Typography>
          </Grid>
        ))}

        {currentMonth.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <Grid item xs={1} key={idx}>
                <Button
                  fullWidth
                  onClick={() => {
                    setSmallCalendarMonth(currentMonthIdx);
                    setDaySelected(day);
                  }}
                  sx={{
                    py: 1,
                    width: "100%",
                    ...getDayClass(day),
                  }}
                >
                  <Typography variant="body2">{day.format("D")}</Typography>
                </Button>
              </Grid>
            ))}
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
}
