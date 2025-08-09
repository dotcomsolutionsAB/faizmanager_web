import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { Box, Typography } from "@mui/material";

// Define a label-to-color mapping
const labelColors = {
  lightPeach: "#faedcd",
  lightRed: "#ffcad4",

};

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) =>
        dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? { backgroundColor: "#1976d2", color: "white", borderRadius: "50%", width: 32, height: 32 }
      : {};
  }

  return (
    <Box sx={{ border: "1px solid #e0e0e0", display: "flex", flexDirection: "column", height: "100px" }}>
      <header style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {rowIdx === 0 && (
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {day.format("ddd").toUpperCase()}
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            padding: 1,
            marginY: 1,
            textAlign: "center",
            ...getCurrentDayClass(),
          }}
        >
          {day.format("DD")}
        </Typography>
      </header>
      <Box
        sx={{ flex: 1, cursor: "pointer" }}
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}
      >
        {dayEvents.map((evt, idx) => {
          console.log(evt);
           return (
            <Box
              key={idx}
              onClick={() => setSelectedEvent(evt)}
              sx={{
                backgroundColor: labelColors[evt.label] || "#e0e0e0", // Apply color from labelColors mapping
                padding: 1,
                marginRight: 2,
                marginLeft: 2,
                color: "#424242",
                fontSize: 12,
                borderRadius: 1,
                marginBottom: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {/* Check if evt.type exists and render it, otherwise fallback */}
              {evt.type}: {evt.title}
            </Box>
          );
})}
      </Box>
    </Box>
  );
}
