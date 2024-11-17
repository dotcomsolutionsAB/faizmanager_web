import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

export default function Footer(props) {
  const theme = useTheme();
  

  return (
    <Box
      component="footer"
      sx={{
        width: '100%', // Full width after the sidebar
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.paper, // Match the dashboard background color
        color: theme.palette.text.secondary, // Use a secondary color for text
        py: 2, // Add vertical padding for a balanced layout
        mt: 'auto', // Push the footer to the bottom
        boxShadow: theme.shadows[1], // Slight shadow for separation from content
      }}
      {...props}
    >
      <Typography
        variant="body2"
        align="center"
      >
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Dotcom
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>
  );
}
