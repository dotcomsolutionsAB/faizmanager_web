import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { yellow } from '../../styles/ThemePrimitives';
import { useAppStore } from '../../appStore';
import AppTheme from '../../styles/AppTheme';
import MenuContentJamiatAdmin from "./MenuContentJamiatAdmin";
import MenuContentSuperAdmin from "./MenuContentSuperAdmin";
import MenuContentMumeneen from "./MenuContentMumeneen";
import { useUser } from '../../UserContext';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import MenuContentCoordinator from './MenuContentCoordinator';


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function Sidebar() {
  const theme = useTheme();
  const open = useAppStore((state) => state.dopen);
  const { role } = useUser();

  // Function to dynamically render the correct menu content based on the user's role
  const renderMenuContent = () => {
    if (role === "jamiat_admin") {
      return <MenuContentJamiatAdmin open={open} />;
    } else if (role === "superadmin") {
      return <MenuContentSuperAdmin open={open} />;
    } else if (role === "mumeneen") {
      return <MenuContentCoordinator open={open} />;
    } else {
      return null; // Render nothing for unsupported roles
    }
  };
 


  return (
    <AppTheme>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton >
            {theme.direction === 'rtl' ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
          </IconButton>
        </DrawerHeader>
                <Box           sx={{
            overflowY: 'auto', // Allow vertical scrolling
            transition: 'padding 0.3s ease', // Smooth transition for padding
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
          }}>
          {renderMenuContent()}
        </Box>
      </Drawer>
    </Box>
    </AppTheme>
  );
}
