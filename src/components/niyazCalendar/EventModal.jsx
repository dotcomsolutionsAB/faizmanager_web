import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { Box, Button, Typography, TextField, IconButton, FormControl, FormLabel, Grid, Tooltip, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { makeStyles } from "@mui/styles";
import { useUser } from "../../contexts/UserContext";

// Material-UI color options for labels
const labelsClasses = ["lightPeach", "lightRed"];

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    position: "fixed",
    left: 0,
    top: 0,
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    backgroundColor: "white",
    borderRadius: 8,
    boxShadow: theme.shadows[5],
    width: "50%",
  },
  header: {
    backgroundColor: "#f1f1f1",
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    padding: theme.spacing(3),
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    borderTop: "1px solid #e0e0e0",
    padding: theme.spacing(2),
  },
  inputField: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: "2px solid #e0e0e0",
    "&:focus": {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
  },
  labelButton: {
    width: 24,
    height: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    cursor: "pointer",
    border: "2px solid transparent",  // Default border for all circles
  },
}));

// Colors for each label class
const labelColors = {
  lightPeach: "#faedcd",
  lightRed: "#ffcad4",

};

export default function EventModal() {
  const {
    setShowEventModal,
    daySelected,
    dispatchCalEvent,
    selectedEvent,  // Make sure selectedEvent is passed correctly
  } = useContext(GlobalContext);
  const { token } = useUser();

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [type, setType] = useState(selectedEvent ? selectedEvent.niyaz : "");  // Ensure `type` is set from `selectedEvent`
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent ? labelsClasses.find((lbl) => lbl === selectedEvent.label) : labelsClasses[0]
  );

  // Update the state when `selectedEvent` changes
  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setType(selectedEvent.niyaz);  // Set the `type` properly from `selectedEvent`
      setDescription(selectedEvent.description);
      setSelectedLabel(labelsClasses.find((lbl) => lbl === selectedEvent.label) || labelsClasses[0]);
    }
  }, [selectedEvent]);
  // console.log(selectedEvent.id)

  const classes = useStyles();

function handleSubmit(e) {
  e.preventDefault();
  
  // Prepare the event data
  const calendarEvent = {
    date: daySelected.format("YYYY-MM-DD"),  // Format the date properly
    title,
    description,
    niyaz: type,  // Assuming "type" is the niyaz type, e.g., "Niyaz" or "Salawat/Fateha"
  };

  // Check if we are updating or creating
  if (selectedEvent && selectedEvent.id) {
    // If selectedEvent has an ID, we are updating an event
    fetch(`https://api.fmb52.com/api/events/update/${selectedEvent.id}`, {
      method: "POST",  // Use PUT for update (correct HTTP method for updates)
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendarEvent), // Send the event data as JSON
    })
      .then((response) => response.json())
      .then((data) => {
          // Successfully updated the event
          console.log("Event updated successfully", data);

          // Optionally update the local state (filteredEvents)
          dispatchCalEvent({ 
            type: "update", 
            payload: { ...calendarEvent, id: selectedEvent.id } // Ensure to include the ID for updating
          });

          // Close the modal after saving
          setShowEventModal(false);  // Close the modal after update
      })
      .catch((error) => {
        console.error("Error sending update request:", error);
      });
  } else {
    // If there's no selectedEvent, we are creating a new event
    fetch("https://api.fmb52.com/api/events/new", {
      method: "POST",  // Use POST for new event
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendarEvent), // Send the event data as JSON
    })
      .then((response) => response.json())
      .then((data) => {
          // Successfully created the event
          console.log("Event created successfully", data);

          // Optionally update the local state (filteredEvents)
          dispatchCalEvent({ type: "push", payload: { ...calendarEvent, id: data.id } });  // Add event to global state

          // Close the modal after saving
          setShowEventModal(false);  // Close the modal after save
      })
      .catch((error) => {
        console.error("Error sending create request:", error);
      });
  }
}



  // Refetch events from the API
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
        // Update global events with new data
        const events = data.data;
        dispatchCalEvent({ type: "set", payload: events });  // Update all events in global state
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };


  function handleDelete() {
  // Get the event ID from the selectedEvent
  const eventId = selectedEvent.id;

  console.log(selectedEvent);

  // Send the delete request to the API
  fetch(`https://api.fmb52.com/api/events/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {

        // Successfully deleted the event
        console.log("Event deleted successfully", data);

        // Remove the event from the global state
        dispatchCalEvent({
          type: "delete",
          payload: selectedEvent, // Remove the event with the same ID
        });

        // Refetch the events to update the UI
        fetchEvents();  // This function should refetch all events from the API

        // Close the modal after deletion
        setShowEventModal(false);

    })
    .catch((error) => {
      console.error("Error sending delete request:", error);
    });
}


  return (
    <Box className={classes.modalContainer} sx={{ mt: 9 }}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <header className={classes.header}>
          <Typography variant="body2" color="textSecondary">
            <span className="material-icons-outlined">Create</span>
          </Typography>
          <Box>
            {selectedEvent && (
              <IconButton
                onClick={() => {
                  handleDelete(); // Handle event deletion
                }}
                color="inherit"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton onClick={() => setShowEventModal(false)} color="inherit">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </header>

        <Box className={classes.content}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Add title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="standard"
                className={classes.inputField}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="standard" className={classes.inputField} required>
                <FormLabel>Type</FormLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Type</em>
                  </MenuItem>
                  <MenuItem value="Niyaz">Niyaz</MenuItem>
                  <MenuItem value="Fateha/Salawat">Fateha/Salawat</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {daySelected.format("dddd, MMMM DD")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Add a description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                variant="standard"
                className={classes.inputField}
              />
            </Grid>
          </Grid>
        </Box>

        <footer className={classes.footer}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </footer>
      </form>
    </Box>
  );
}

