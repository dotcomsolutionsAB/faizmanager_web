import React from "react";
import Day from "./Day";
import { Grid } from "@mui/material";

export default function Month({ month }) {
  return (
    <Grid container spacing={1} sx={{ flex: 1 }}>
      {month.map((row, i) => (
        <React.Fragment key={i}>
          <Grid container item spacing={1}>
            {row.map((day, idx) => (
              <Grid item sx={{ flex: 1}} key={idx} >
                <Day day={day} rowIdx={i} />
              </Grid>
            ))}
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
}
