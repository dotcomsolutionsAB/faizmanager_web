import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { Box, Typography } from "@mui/material";
import { useUser } from "../../contexts/UserContext";

const labelColors = {
  lightPeach: "#faedcd",
  lightRed: "#ffcad4",
  lightGreen: "#B8FFB8",
};

// Cache so we only fetch once across cells
let hijriMapCache = null;
let hijriMapPromise = null;

async function getHijriMap() {
  if (hijriMapCache) return hijriMapCache;
  if (!hijriMapPromise) {
    hijriMapPromise = fetch("https://api.fmb52.com/api/hijriCalender")
      .then((r) => r.json())
      .then((json) => {
        const arr = Array.isArray(json?.data) ? json.data : [];
        const map = new Map();
        for (const item of arr) {
          // item: { date: "YYYY-MM-DD", day: number, month: string, year: number }
          if (item?.date) {
            map.set(item.date, {
              day: item.day,
              month: item.month,
              year: item.year,
            });
          }
        }
        hijriMapCache = map;
        return map;
      })
      .catch(() => {
        hijriMapCache = new Map();
        return hijriMapCache;
      });
  }
  return hijriMapPromise;
}

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const [hijriInfo, setHijriInfo] = useState(null);
  const { token } = useUser();

  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents, // The global events list
    setSelectedEvent,
    dispatchCalEvent, // Dispatch function to update events
  } = useContext(GlobalContext);

  // Fetch all events for this day
  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) => dayjs(evt.date).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  useEffect(() => {
    let active = true;
    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://api.fmb52.com/api/events", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.code === 200) {
          // Update global events
          const events = data.data;
          dispatchCalEvent({ type: "set", payload: events });
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();

    return () => {
      active = false;
    };
  }, [day, token, dispatchCalEvent]);

  useEffect(() => {
    let active = true;
    (async () => {
      const map = await getHijriMap();
      const key = day.format("YYYY-MM-DD");
      if (active) setHijriInfo(map.get(key) || null);
    })();
    return () => {
      active = false;
    };
  }, [day]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? { backgroundColor: "#1976d2", color: "white", borderRadius: "50%", width: 32, height: 32 }
      : {};
  }

  // Check if the day is the first of the month
  const isFirstOfMonth = day.date() === 1;

  // Determine the label color based on niyaz value
  const getEventLabelColor = (niyaz) => {
    if (niyaz === "Miqaat Jaman") return labelColors.lightGreen;
    return niyaz === "Niyaz" ? labelColors.lightPeach : labelColors.lightRed;
  };

  const handleDayClick = () => {
    // If no events for this day, create a new event
    if (dayEvents.length === 0) {
      setSelectedEvent(null);  // No event selected means it's a new event
    }
    setDaySelected(day);
    setShowEventModal(true);  // Open the modal
  };

  const handleEventClick = (evt) => {
    setSelectedEvent(evt);  // Set the clicked event for editing
    setDaySelected(day);  // Make sure the day is selected
    setShowEventModal(true);  // Open the modal for editing
  };

  return (
    <Box sx={{ border: "1px solid #e0e0e0", display: "flex", flexDirection: "column", minHeight: "175px" }}>
      <header style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {rowIdx === 0 && (
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {day.format("ddd").toUpperCase()}
          </Typography>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 1 }}>
          {/* Gregorian day (keeps your "today" circle styling) */}
          <Typography
            variant="body2"
            sx={{
              padding: 1,
              textAlign: "center",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              ...getCurrentDayClass(),
            }}
          >
            {day.format("DD")}
            {/* Display month beside the date if it's the first of the month */}
            {isFirstOfMonth && (
              <Typography variant="caption" sx={{ ml: 0.5, fontSize: "0.90rem" }}>
                {day.format("MMM")}
              </Typography>
            )}
          </Typography>

          {/* Hijri on the next line */}
          {hijriInfo && (
            <Typography variant="caption" sx={{ mt: 0.25, lineHeight: 1.2, fontSize: "0.6rem" }}>
              {hijriInfo.day}-{hijriInfo.month}-{hijriInfo.year}
            </Typography>
          )}
        </Box>
      </header>

      <Box sx={{ flex: 1, cursor: "pointer" }} onClick={handleDayClick}>
        {dayEvents.map((evt, idx) => (
          <Box
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              handleEventClick(evt);  // Handle event click for editing
            }}
            sx={{
              backgroundColor: getEventLabelColor(evt.niyaz),
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
            {evt.niyaz}: {evt.title}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

