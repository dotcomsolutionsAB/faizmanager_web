import React, { useContext } from "react";
import plusImg from "../../assets/plus.svg";
import GlobalContext from "../../contexts/GlobalContext";
import { Button, IconButton, Box } from "@mui/material";
import AppTheme from "../../styles/AppTheme";
import AddIcon from '@mui/icons-material/Add';

export default function CreateEventButton() {
  const { setShowEventModal } = useContext(GlobalContext);
  return (
    <AppTheme >
    <Button
      onClick={() => setShowEventModal(true)}
      variant="outlined"
      sx={{
        borderRadius: "10%",
        padding: 2,
        display: "flex",
        alignItems: "center",
        boxShadow: 3,
        "&:hover": {
          boxShadow: 5,
        },
      }}
    >
      <AddIcon style={{ fontSize: 25 }} />
      <span style={{ paddingLeft: 12, paddingRight: 28 }}> Create</span>
    </Button>
    </AppTheme>
  );
}
