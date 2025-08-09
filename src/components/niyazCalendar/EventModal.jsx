import React, { useContext, useState } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { Box, Button, Typography, TextField, IconButton, FormControl, FormLabel, Grid, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { makeStyles } from "@mui/styles";

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
    width: "25%",
  },
  header: {
    backgroundColor: "#f1f1f1",
    padding: theme.spacing(2),
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
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
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
    selectedEvent,
  } = useContext(GlobalContext);

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [type, setType] = useState(selectedEvent ? selectedEvent.type: "");

  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent ? labelsClasses.find((lbl) => lbl === selectedEvent.label) : labelsClasses[0]
  );

  const classes = useStyles();

  function handleSubmit(e) {
    e.preventDefault();
    const calendarEvent = {
      title,
       type, 
      description,
      label: selectedLabel,
      day: daySelected.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
    };
    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
    }

    setShowEventModal(false);
  }

  return (
    <Box className={classes.modalContainer} sx={{mt: 9}}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <header className={classes.header}>
          <Typography variant="body2" color="textSecondary">
            <span className="material-icons-outlined">Create</span>
          </Typography>
          <Box>
            {selectedEvent && (
              <IconButton
                onClick={() => {
                  dispatchCalEvent({
                    type: "delete",
                    payload: selectedEvent,
                  });
                  setShowEventModal(false);
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
              <TextField
                label="Add Type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                fullWidth
                variant="standard"
                className={classes.inputField}
                required
              />
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
                required
              />
            </Grid>
            <Grid item xs={12}>
<FormControl>
                <FormLabel>Choose Label</FormLabel>
                <Box display="flex" gap={2}>
                  {labelsClasses.map((lblClass, i) => (
                    <Tooltip
                      key={i}
                      title={lblClass === "lightPeach" ? "For Salawat/Fateha" : "For Niyaz"}
                      arrow
                    >
                      <Box
                        onClick={() => setSelectedLabel(lblClass)}
                        className={classes.labelButton}
                        sx={{
                          backgroundColor: labelColors[lblClass], // Apply color for each label
                          border: selectedLabel === lblClass ? `2px solid white` : "2px solid transparent", // Highlight selected label with a border
                          color: selectedLabel === lblClass ? "white" : "black", // White text on selected
                        }}
                      >
                        {selectedLabel === lblClass && <CheckIcon fontSize="small" color="white" />}
                      </Box>
                    </Tooltip>
                  ))}
                </Box>
              </FormControl>
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
