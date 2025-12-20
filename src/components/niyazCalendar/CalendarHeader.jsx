import dayjs from "dayjs";
import React, { useContext, useMemo, useState } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import * as XLSX from "xlsx";
import CreateEventButton from "./CreateEventButton";

// ✅ MUI X Date Pickers
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex, filteredEvents } = useContext(GlobalContext);

  const [exportOpen, setExportOpen] = useState(false);

  // ✅ DatePicker values as Dayjs objects
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month() ? monthIndex + Math.random() : dayjs().month()
    );
  }

  const monthLabel = useMemo(() => {
    return dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY");
  }, [monthIndex]);

  const handleExport = () => {
    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).endOf("day");

    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      alert("Please select a valid date range (End Date should be >= Start Date).");
      return;
    }

    const inRange = (filteredEvents || []).filter((evt) => {
      const d = dayjs(evt.date);
      if (!d.isValid()) return false;
      return (d.isAfter(start) || d.isSame(start)) && (d.isBefore(end) || d.isSame(end));
    });

    const rows = inRange.map((evt) => ({
      Date: dayjs(evt.date).format("YYYY-MM-DD"),
      Title: evt.title ?? "",
      Type: evt.niyaz ?? "",
      Description: evt.description ?? "",
      Location: evt.location ?? "",
    }));

    const ws = XLSX.utils.json_to_sheet(
      rows.length
        ? rows
        : [
            {
              Date: "",
              Title: "",
              Type: "",
              Description: "",
              Location: "",
            },
          ]
    );

    ws["!cols"] = [
      { wch: 12 },
      { wch: 30 },
      { wch: 18 },
      { wch: 40 },
      { wch: 25 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Events");

    const filename = `Events_${start.format("YYYYMMDD")}_to_${end.format("YYYYMMDD")}.xlsx`;
    XLSX.writeFile(wb, filename);

    setExportOpen(false);
  };

  // ✅ This makes DatePicker open when clicking anywhere on the TextField
  const openPickerOnTextFieldClick = {
    sx: {
      "& .MuiIconButton-root": {
        border: "none",
        padding: 0,
        margin: 0,
        backgroundColor: "transparent",
      },
    },
    onClick: (e) => {
      // Click the calendar icon button inside the DatePicker text field
      e.currentTarget.querySelector("button")?.click();
    },
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 4,
          py: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <Button
            onClick={handleReset}
            variant="outlined"
            sx={{ borderRadius: 2, py: 1, px: 3, mr: 2 }}
          >
            Today
          </Button>

          <Box>
            <IconButton onClick={handlePrevMonth} sx={{ color: "gray", mx: 0.5 }}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={handleNextMonth} sx={{ color: "gray", mx: 0.5 }}>
              <ChevronRightIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" sx={{ ml: 2, color: "gray", fontWeight: "bold" }}>
            {monthLabel}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={() => setExportOpen(true)}
            sx={{ borderRadius: 1 }}
          >
            Export to Excel
          </Button>

          <CreateEventButton />
        </Box>
      </Box>

      {/* ✅ Export Dialog with MUI DatePicker */}
      <Dialog open={exportOpen} onClose={() => setExportOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Export Events to Excel</DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(val) => setStartDate(val)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    ...openPickerOnTextFieldClick, // ✅ CLICK ANYWHERE OPENS
                  },
                }}
              />

              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(val) => setEndDate(val)}
                minDate={startDate || undefined}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    ...openPickerOnTextFieldClick, // ✅ CLICK ANYWHERE OPENS
                  },
                }}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setExportOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleExport} variant="contained">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
