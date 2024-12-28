// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Avatar from '@mui/material/Avatar';
// import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
// import Box from '@mui/material/Box';
// import Divider from '@mui/material/Divider';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import SelectContent from './SelectContent';
// import MenuContent from './MenuContent';
// import CardAlert from './CardAlert';
// import OptionsMenu from './OptionsMenu';
// import fmbLogo1 from '../../../assets/fmbLogo1.png'

// const drawerWidth = 240;

// const Drawer = styled(MuiDrawer)({
//   width: drawerWidth,
//   flexShrink: 0,
//   boxSizing: 'border-box',
//   mt: 10,
//   [`& .${drawerClasses.paper}`]: {
//     width: drawerWidth,
//     boxSizing: 'border-box',
//   },
// });

// export default function SideMenu() {
//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         display: { xs: 'none', md: 'block' },
//         [`& .${drawerClasses.paper}`]: {
//           backgroundColor: 'background.paper',
//         },
//       }}
//     >
//           <Box
//             component="img"
//             src={fmbLogo1}
//             alt="Logo"
//             sx={{
//               width: 150,
//               height: 60,
//               margin: '0 auto',
//               pt: 1,
//               pb: 1,
//             }}
//           />
//       <Divider />
//       <MenuContent />
//       <CardAlert />
//       <Stack
//         direction="row"
//         sx={{
//           p: 2,
//           gap: 1,
//           alignItems: 'center',
//           borderTop: '1px solid',
//           borderColor: 'divider',
//         }}
//       >
//         <Avatar
//           sizes="small"
//           alt="Riley Carter"
//           src="/static/images/avatar/7.jpg"
//           sx={{ width: 36, height: 36 }}
//         />
//         <Box sx={{ mr: 'auto' }}>
//           <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
//             Riley Carter
//           </Typography>
//           <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//             riley@email.com
//           </Typography>
//         </Box>
//         <OptionsMenu />
//       </Stack>
//     </Drawer>
//   );
// }

// import * as React from 'react';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuContent from '../../../../components/sidebar/MenuContent';
import fmbLogo1 from '../../../assets/fmbLogo1.png';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { yellow } from '../../login/ThemePrimitives';

const drawerWidth = 240;
const collapsedDrawerWidth = 80; // Adjusted for collapsed state

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedDrawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      position: 'fixed',
    },
  }),
  ...(!open && {
    '& .MuiDrawer-paper': {
      width: collapsedDrawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      position: 'fixed'
    },
  }),
}));

export default function SideMenu({ open, setOpen }) {
  // const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  if (isMobile) return null;

  return (
    <>
<IconButton
onClick={handleDrawerToggle}
sx={{
  position: 'fixed', // Make the icon fixed
  top: 19, // Adjust the top position as needed
  left: open ? drawerWidth - 22 : 19, // Adjust based on sidebar open state
  zIndex: 1300, // Ensure it stays on top
  backgroundColor: 'background.paper',
  borderRadius: '50%',
  transition: 'left 0.3s ease',
}}
>
{open ? <ChevronLeftIcon /> : <MenuIcon />}
</IconButton>

      <Drawer variant="permanent" open={open}>
        <Box
          component="img"
          src={fmbLogo1}
          alt="Logo"
          sx={{
            width: open ? 120 : 0,
            height: open ? 60 : 0,
            margin: open ? '16px auto' : '0 auto',
            pt: open ? 1 : 0,
            pb: open ? 1 : 0,
          }}
        />
        <Divider />
        <Box           sx={{
            mt: open ? 0 : 1, // Adjust margin-top
            height: 'calc(100vh - 70px)', // Ensure content takes full height minus top spacing
            overflowY: 'auto', // Allow vertical scrolling
            transition: 'padding 0.3s ease', // Smooth transition for padding
            padding: open ? '0px 8px' : '4px 0', // Adjust padding when collapsed
            '&::-webkit-scrollbar': {
              width: '6px', // Reduced width of the scrollbar (for a thinner appearance)
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f5f5f5', // Very light gray background for track
              borderRadius: '10px', // Rounded corners for the track
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: yellow[200], // Light gray color for the thumb
              borderRadius: '10px', // Rounded corners for the thumb
              border: '2px solid transparent', // Creates space around the thumb for a clean effect
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: yellow[300], // Darker color when the thumb is hovered
            },
            marginTop: open ? 0 : '50px',
          }}>
          <MenuContent open={open} />
        </Box>
      </Drawer>
    </>
  );
}
