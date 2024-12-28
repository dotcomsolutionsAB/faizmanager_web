// import * as React from 'react';
// import PropTypes from 'prop-types';
// import { useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Chip from '@mui/material/Chip';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
// import { areaElementClasses } from '@mui/x-charts/LineChart';
// import {yellow} from '../../login/ThemePrimitives'

// function getDaysInMonth(month, year) {
//   const date = new Date(year, month, 0);
//   const monthName = date.toLocaleDateString('en-US', {
//     month: 'short',
//   });
//   const daysInMonth = date.getDate();
//   const days = [];
//   let i = 1;
//   while (days.length < daysInMonth) {
//     days.push(`${monthName} ${i}`);
//     i += 1;
//   }
//   return days;
// }

// function AreaGradient({ color, id }) {
//   return (
//     <defs>
//       <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
//         <stop offset="0%" stopColor={color} stopOpacity={0.3} />
//         <stop offset="100%" stopColor={color} stopOpacity={0} />
//       </linearGradient>
//     </defs>
//   );
// }

// AreaGradient.propTypes = {
//   color: PropTypes.string.isRequired,
//   id: PropTypes.string.isRequired,
// };

// function StatCard({ title, value, icon }) {
//   const theme = useTheme();
//   const daysInWeek = getDaysInMonth(4, 2024);



//   return (
//     <Card variant="outlined" sx={{ height: '100%', flexGrow: 1,        display: 'flex',
//       justifyContent: 'center', // Center content vertically
//       alignItems: 'center', // Center content horizontally
//       textAlign: 'center', }}>
//       <CardContent>
//       <Stack
//           direction="row"
//           alignItems="center"
//           spacing={1}
//           sx={{ mb: 2 }}
//         >
//           {icon}
//           <Typography component="h2" variant="subtitle1" gutterBottom>
//             {title}
//           </Typography>
//         </Stack>
//         <Stack
//           direction="column"
//           sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
//         >
//           <Stack sx={{ justifyContent: 'space-between' }}>
//             <Stack
//               direction="row"
//               sx={{ justifyContent: 'center', alignItems: 'center' }}
//             >
//               <Typography variant="h4" component="p" sx={{
//                 color: yellow[400], // Use yellow for value color
//                 fontWeight: theme.typography.fontWeightBold,
//               }}>
//                 {value}
//               </Typography>
//               {/* <Chip size="small" color={color} /> */}
//             </Stack>
//           </Stack>
//           <Box sx={{ width: '100%', height: 50 }}>
//           </Box>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }

// StatCard.propTypes = {
//   title: PropTypes.string.isRequired,
//   value: PropTypes.string.isRequired,
//   icon: PropTypes.element,
// };

// export default StatCard;

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatCard({ title, value, icon }) {
  return (
    <Card sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ mb: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h5" color="primary">{value}</Typography>
      </CardContent>
    </Card>
  );
}
