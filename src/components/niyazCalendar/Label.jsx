import React, { useContext } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";

export default function Labels() {
  const { labels, updateLabel } = useContext(GlobalContext);
  return (
    <React.Fragment>
      <Typography variant="h6" sx={{ color: "gray", fontWeight: "bold", marginTop: 3 }}>
        Label
      </Typography>
      {labels.map(({ label: lbl, checked }, idx) => (
        <FormControlLabel
          key={idx}
          control={
            <Checkbox
              checked={checked}
              onChange={() => updateLabel({ label: lbl, checked: !checked })}
              sx={{
                color: `${lbl}-400`,
                "&.Mui-checked": {
                  color: `${lbl}-400`,
                },
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: "gray", textTransform: "capitalize" }}>
              {lbl}
            </Typography>
          }
          sx={{ marginTop: 2 }}
        />
      ))}
    </React.Fragment>
  );
}
