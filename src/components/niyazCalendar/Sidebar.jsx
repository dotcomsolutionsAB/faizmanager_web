import React from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import Labels from "./Label";
import { Box } from "@mui/material";

export default function Sidebar() {
  return (
    <Box sx={{ border: 1, padding: 2.5, width: 450 }}>
      {/* <CreateEventButton /> */}
      {/* <SmallCalendar /> */}
      <Labels />
    </Box>
  );
}
