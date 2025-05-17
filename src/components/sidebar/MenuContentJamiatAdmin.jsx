// // import * as React from 'react';
// // import List from '@mui/material/List';
// // import ListItem from '@mui/material/ListItem';
// // import ListItemButton from '@mui/material/ListItemButton';
// // import ListItemIcon from '@mui/material/ListItemIcon';
// // import ListItemText from '@mui/material/ListItemText';
// // import Divider from '@mui/material/Divider';
// // import Collapse from '@mui/material/Collapse';
// // import Stack from '@mui/material/Stack';
// // import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// // import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
// // import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
// // import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
// // import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
// // import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
// // import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
// // import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// // import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// // import PersonIcon from '@mui/icons-material/Person';
// // import ReceiptIcon from '@mui/icons-material/Receipt';
// // import PaymentIcon from '@mui/icons-material/Payment';
// // import ApartmentIcon from '@mui/icons-material/Apartment';
// // import BusinessIcon from '@mui/icons-material/Business';
// // import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
// // import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// // import NotificationsIcon from '@mui/icons-material/Notifications';
// // import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// // import EventIcon from '@mui/icons-material/Event';
// // import StarIcon from '@mui/icons-material/Star';
// // import ScheduleIcon from '@mui/icons-material/Schedule';
// // import BookOnlineIcon from '@mui/icons-material/BookOnline';
// // import { styled } from "@mui/material/styles";
// // import Box from "@mui/material/Box";
// // import { useNavigate } from 'react-router-dom';

// // export default function MenuContent({ open }) {
// //   const [accountsOpen, setAccountsOpen] = React.useState(false);
// //   const [groupingOpen, setGroupingOpen] = React.useState(false);
// //   const [bookingsOpen, setBookingsOpen] = React.useState(false);
  
// //   const navigate = useNavigate();

// //   const handleAccountsClick = () => {
// //     setAccountsOpen(!accountsOpen);
// //   };

// //   const handleGroupingClick = () => {
// //     setGroupingOpen(!groupingOpen);
// //   };

// //   const handleBookingsClick = () => {
// //     setBookingsOpen(!bookingsOpen)
// //   }

// //   const handleDashboardClick = () => {
// //     navigate('/dashboard'); // Navigate to the Mumeneen page
// //   };
// //   const handleMumeneenClick = () => {
// //     navigate('/mumeneen'); // Navigate to the Mumeneen page
// //   };

// //   const handleReceiptsClick = () => {
// //     navigate('/receipts')
// //   }

// //   const handleExpensesClick = () => {
// //     navigate('/expenses')
// //   }

// //   const handlePaymentsClick = () => {
// //     navigate('/payments')
// //   }

// //   const handleSectorClick = () => {
// //     navigate('/sector')
// //   }

// //   const handleSubSectorClick = () => {
// //     navigate('/sub_sector')
// //   }
// //   const handleTransfersClick = () => {
// //     navigate('/transfers')
// //   }

// //   const handleZabihatClick = () => {
// //     navigate('/zabihat')
// //   }

// //   const handleSalawatFatehaClick = () => {
// //     navigate('/salawat_fateha')
// //   }

// //   const handleNiyazDateClick = () => {
// //     navigate('/niyaz_date')
// //   }

// //   const handleFeedbackClick = () => {
// //     navigate('/feedback')
// //   }

// //   const handleNotificationsClick = () => {
// //     navigate('/notifications')
// //   }

// //   const handleSettigsClick = () => {
// //     navigate('/settings')
// //   }

// //   const handleUserAccessClick = () => {
// //     navigate('/user_access')
// //   }

// //   React.useEffect(() => {
// //     if (!open) {
// //       setAccountsOpen(false);
// //       setGroupingOpen(false);
// //       setBookingsOpen(false);
// //     }
// //   }, [open]);

// //   const listItemButtonStyles = {
// //     px: 2,
// //     justifyContent: 'center',
// //     textAlign: 'left',
// //   };

// //   const listItemIconStyles = {
// //     minWidth: 0,
// //     paddingLeft: 0,
// //     paddingRight: 0,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     // fontSize: open ? 'default' : '1.5rem',
// //     color: '#5f6368',
// //     transition: 'all 0.1s ease',
// //     padding: open ? '0' : '10px', // Add padding when the sidebar is closed
// //   };



// //   return (
// //     <Stack
// //     sx={{
// //       flexGrow: 1,
// //       p:  1,
// //       justifyContent: "space-between",

// //     }}
// //     >
// //        <Box>
// //       <List>
// //         {/* Dashboard */}
// //         <ListItem>
// //           <ListItemButton onClick={handleDashboardClick} sx={listItemButtonStyles}>
// //             <ListItemIcon sx={listItemIconStyles}>
// //               <HomeRoundedIcon />
// //             </ListItemIcon>
// //             {open && <ListItemText primary="Home" />}
// //           </ListItemButton>
// //         </ListItem>
// //         <Divider />
// //                 <ListItem >
// //           <ListItemButton onClick={handleMumeneenClick} sx={listItemButtonStyles}>
// //             <ListItemIcon sx={listItemIconStyles}>
// //               <PersonIcon />
// //             </ListItemIcon>
// //             {open && <ListItemText primary="Mumeneen" />}
// //           </ListItemButton>
// //         </ListItem>
// //         <Divider />

// //                 <ListItem >
// //           <ListItemButton onClick={handleAccountsClick} sx={listItemButtonStyles}>
// //             <ListItemIcon sx={listItemIconStyles}>
// //               <AnalyticsRoundedIcon />
// //             </ListItemIcon>
// //             {open && <ListItemText primary="Accounts" />}
// //             {open && (accountsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
// //           </ListItemButton>
// //         </ListItem> 
// //          <Collapse in={accountsOpen} timeout="auto" unmountOnExit>
// //           <List component="div" >
// //             <ListItem >
// //               <ListItemButton sx={listItemButtonStyles} onClick={handleReceiptsClick}>
// //                 <ListItemIcon sx={listItemIconStyles}>
// //                   <ReceiptIcon />
// //                 </ListItemIcon>
// //                 {open && <ListItemText primary="Receipts" />}
// //               </ListItemButton>
// //             </ListItem>
// //             <ListItem >
// //               <ListItemButton sx={listItemButtonStyles} onClick={handlePaymentsClick}>
// //                 <ListItemIcon sx={listItemIconStyles}>
// //                   <PaymentIcon />
// //                 </ListItemIcon>
// //                 {open && <ListItemText primary="Payments" />}
// //               </ListItemButton>
// //             </ListItem>
// //             <ListItem >
// //               <ListItemButton sx={listItemButtonStyles} onClick={handleExpensesClick}>
// //                 <ListItemIcon sx={listItemIconStyles}>
// //                   <AttachMoneyIcon />
// //                 </ListItemIcon>
// //                 {open && <ListItemText primary="Expense" />}
// //               </ListItemButton>
// //             </ListItem>
            
// //           </List>
// //         </Collapse>
// //         <Divider />

// //         {/* Management with Sub-items */}
// //         <ListItem >
// //           <ListItemButton onClick={handleGroupingClick} sx={listItemButtonStyles}>
// //             <ListItemIcon sx={listItemIconStyles}>
// //               <PeopleRoundedIcon />
// //             </ListItemIcon>
// //             {open && <ListItemText primary="Grouping" />}
// //             {open && (groupingOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
// //           </ListItemButton>
// //         </ListItem>
// //         <Collapse in={groupingOpen} timeout="auto" unmountOnExit>
// //           <List component="div" >
// //             <ListItem >
// //               <ListItemButton sx={listItemButtonStyles} onClick={handleSectorClick}>
// //                 <ListItemIcon sx={listItemIconStyles}>
// //                   <ApartmentIcon />
// //                 </ListItemIcon>
// //                 {open && <ListItemText primary="Sector" />}
// //               </ListItemButton>
// //             </ListItem>
// //             <ListItem >
// //               <ListItemButton sx={listItemButtonStyles} onClick={handleSubSectorClick}>
// //                 <ListItemIcon sx={listItemIconStyles}>
// //                   <BusinessIcon />
// //                 </ListItemIcon>
// //                 {open && <ListItemText primary="Sub Sector" />}
// //               </ListItemButton>
// //             </ListItem>
// //             <ListItem >
// //               <ListItemButton sx={listItemButtonStyles} onClick={handleTransfersClick}>
// //                 <ListItemIcon sx={listItemIconStyles}>
// //                   <TransferWithinAStationIcon />
// //                 </ListItemIcon>
// //                 {open && <ListItemText primary="Transfers" />}
// //               </ListItemButton>
// //             </ListItem>
// //           </List>
// //         </Collapse>
// //         <Divider />

// //          {/* Management with Sub-items */}
// //          <ListItem >
// //           <ListItemButton onClick={handleBookingsClick} sx={listItemButtonStyles}>
// //             <ListItemIcon sx={listItemIconStyles}>
// //               <EventIcon />
// //             </ListItemIcon>
// //             {open && <ListItemText primary="Bookings" />}
// //             {open && (bookingsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
// //           </ListItemButton>
// //         </ListItem>
// //         <Collapse in={bookingsOpen} timeout="auto" unmountOnExit>
// //           <List component="div" >
// //             <ListItem >
// //               <ListItemButton sx={listItemButtonStyles} onClick={handleZabihatClick}>
// //                 <ListItemIcon sx={listItemIconStyles}>
// //                   <StarIcon />
// //                 </ListItemIcon>
// //                 {open && <ListItemText primary="Zabihat" />}
// //               </ListItemButton>
// //             </ListItem>
// //             <ListItem >
// //               <ListItemButton sx={listItemButtonStyles} onClick={handleSalawatFatehaClick}>
// //                 <ListItemIcon sx={listItemIconStyles}>
// //                   <StarIcon />
// //                 </ListItemIcon>
// //                 {open && <ListItemText primary="Salawat/Fateha" />}
// //               </ListItemButton>
// //             </ListItem>
// //             <ListItem >
// //               <ListItemButton sx={listItemButtonStyles} onClick={handleNiyazDateClick}>
// //                 <ListItemIcon sx={listItemIconStyles}>
// //                   <BookOnlineIcon />
// //                 </ListItemIcon>
// //                 {open && <ListItemText primary="Niyaz Date" />}
// //               </ListItemButton>
// //             </ListItem>
// //           </List>
// //         </Collapse>
// //         <Divider />

// //                 {/* Feedback */}
// //                 <ListItem >
// //           <ListItemButton sx={listItemButtonStyles} onClick={handleFeedbackClick}>
// //             <ListItemIcon sx={listItemIconStyles}>
// //               <HelpRoundedIcon />
// //             </ListItemIcon>
// //             {open && <ListItemText primary="Feedback" />}
// //           </ListItemButton>
// //         </ListItem>
// //         <Divider />

// //         {/* Tasks */}
// //         <ListItem >
// //           <ListItemButton sx={listItemButtonStyles} onClick={handleNotificationsClick}>
// //             <ListItemIcon sx={listItemIconStyles}>
// //               <NotificationsIcon />
// //             </ListItemIcon>
// //             {open && <ListItemText primary="Notifications" />}
// //           </ListItemButton>
// //         </ListItem>
// //         <Divider />

// //         {/* Settings */}
// //         <ListItem >
// //           <ListItemButton sx={listItemButtonStyles} onClick={handleSettigsClick}>
// //             <ListItemIcon sx={listItemIconStyles}>
// //               <SettingsRoundedIcon />
// //             </ListItemIcon>
// //             {open && <ListItemText primary="Settings" />}
// //           </ListItemButton>
// //         </ListItem>
// //         <Divider />

// //         {/* About */}
// //         <ListItem >
// //           <ListItemButton sx={listItemButtonStyles} onClick={handleUserAccessClick}>
// //             <ListItemIcon sx={listItemIconStyles}>
// //               <AdminPanelSettingsIcon />
// //             </ListItemIcon>
// //             {open && <ListItemText primary="User Access" />}
// //           </ListItemButton>
// //         </ListItem>


// //       </List>
// //       </Box>
// //     </Stack>
// //   );
// // }

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Divider from "@mui/material/Divider";
// import Popper from "@mui/material/Popper";
// import Paper from "@mui/material/Paper";
// import Collapse from "@mui/material/Collapse";
// import Box from "@mui/material/Box";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
// import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
// import PersonIcon from "@mui/icons-material/Person";
// import ReceiptIcon from "@mui/icons-material/Receipt";
// import PaymentIcon from "@mui/icons-material/Payment";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import { useNavigate } from "react-router-dom";
// import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
// import ApartmentIcon from '@mui/icons-material/Apartment';
// import BusinessIcon from '@mui/icons-material/Business';
// import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
// import EventIcon from '@mui/icons-material/Event';
// import StarIcon from '@mui/icons-material/Star';
// import BookOnlineIcon from '@mui/icons-material/BookOnline';
// import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
// import GroupIcon from '@mui/icons-material/Group';
// import SecurityIcon from '@mui/icons-material/Security';
// import { yellow } from "../../styles/ThemePrimitives";





// export default function MenuContent({ open }) {
//   const [expandedItems, setExpandedItems] = useState({}); // Dynamic state for expanded items
//   const [anchorEl, setAnchorEl] = useState(null); // Anchor for the Popper
//   const [hoverContent, setHoverContent] = useState(null); // Current item content
//   const [isPopperOpen, setIsPopperOpen] = useState(false); // State for Popper visibility
//   const [isExpanded, setIsExpanded] = useState(false); // State to expand sub-options in the Popper
//   const navigate = useNavigate();

//   const menuItems = [
//     {
//       label: "Dashboard",
//       icon: <HomeRoundedIcon />,
//       path: "/dashboard",
//     },
//     {
//       label: "Mumeneen",
//       icon: <PersonIcon />,
//       path: "/mumeneen",
//     },
//     {
//       label: "Accounts",
//       icon: <AnalyticsRoundedIcon />,
//       subOptions: [
//         { label: "Payments", path: "/payments", icon: <PaymentIcon /> },
//         { label: "Receipts", path: "/receipts", icon: <ReceiptIcon /> },
//         { label: "Expenses", path: "/expenses", icon: <AttachMoneyIcon /> },
//       ],
//     },
//     {
//       label: "Groupings",
//       icon: <PeopleRoundedIcon />,
//       subOptions: [
//         { label: "Sector", path: "/sector", icon: <ApartmentIcon /> },
//         { label: "Sub-Sector", path: "/sub_sector", icon: <BusinessIcon /> },
//         { label: "Transfers", path: "/transfers", icon: <TransferWithinAStationIcon /> },
//       ],
//     },
//     {
//       label: "Bookings",
//       icon: <EventIcon />,
//       subOptions: [
//         { label: "Zabihat", path: "/zabihat", icon: <StarIcon /> },
//         { label: "Salawat/Fateha", path: "/salawat_fateha", icon: <StarIcon /> },
//         { label: "Niyaz Date", path: "/niyaz_date", icon: <BookOnlineIcon /> },
//       ],
//     },
//     {
//       label: "Feedback",
//       icon: <HelpRoundedIcon />,
//       path: "/feedback",
//     },
//     {
//       label: "Notifications",
//       icon: <NotificationsIcon />,
//       path: "/notifications",
//     },
//     {
//       label: "Settings",
//       icon: <SettingsRoundedIcon />,
//       path: "/settings",
//     },
//     // {
//     //   label: "User Acess",
//     //   icon: <AdminPanelSettingsIcon />,
//     //   path: "/user_access",
//     // },
//     {
//       label: "User Management",
//       icon: <AdminPanelSettingsIcon />,
//       subOptions: [
//         { label: "Roles", path: "/roles", icon: <GroupIcon /> },
//         { label: "Permissions", path: "/user_access", icon: <SecurityIcon /> },
//       ],
//     },
//   ];

//   const handleMouseEnter = (event, item) => {
//     if (!open) {
//       setAnchorEl(event.currentTarget);
//       setHoverContent(item);
//       setIsPopperOpen(true);
//     }
//   };

//   const handleMouseLeave = () => {
//     setIsPopperOpen(false);
//     setIsExpanded(false);
//   };

//   const handlePopperMouseEnter = () => {
//     setIsPopperOpen(true);
//   };

//   const handlePopperMouseLeave = () => {
//     setIsPopperOpen(false);
//     setIsExpanded(false);
//   };

//   const handleExpandClick = (label) => {
//     setExpandedItems((prev) => ({
//       ...prev,
//       [label]: !prev[label],
//     }));
//   };

//   return (
//     <Box>
//       <List>
//         {menuItems.map((item) => (
//           <React.Fragment key={item.label}>
//             <ListItem
//               onMouseEnter={(e) => handleMouseEnter(e, item)}
//               onMouseLeave={handleMouseLeave}
//             >
//               <ListItemButton
//                 onClick={
//                   open && item.subOptions
//                     ? () => handleExpandClick(item.label) // Toggle sub-options for the specific group
//                     : item.path
//                     ? () => navigate(item.path) // Navigate directly if no sub-options
//                     : undefined
//                 }
//               >
//                 <ListItemIcon
                //   sx={{
                //     paddingTop: open ? "0px" : "10px", // Add padding when sidebar is closed
                //     paddingBottom: open ? "0px" : "10px", // Add padding when sidebar is closed
                //     transition: "all 0.3s ease",
                //   }}
//                 >
//                   {item.icon}
//                 </ListItemIcon>
//                 {open && <ListItemText primary={item.label} />}
//                 {open && item.subOptions && (
//                   <>{expandedItems[item.label] ? <ExpandLessIcon /> : <ExpandMoreIcon />}</>
//                 )}
//               </ListItemButton>
//             </ListItem>
//             {open && item.subOptions && (
//               <Collapse in={expandedItems[item.label]} timeout="auto" unmountOnExit>
//                 <List component="div">
//                   {item.subOptions.map((subItem) => (
//                     <ListItem key={subItem.label}>
//                       <ListItemButton
//                         component={Link}
//                         to={subItem.path}
//                         sx={{
//                           pl: 10, // Indent sub-items
//                           "&:hover": {
//                             backgroundColor: "#f5f5f5",
//                           },
//                         }}
//                       >
//                         <ListItemIcon
//                           sx={{
//                             paddingLeft: open ? 2 : 0,
//                             transition: "all 0.3s ease",
//                           }}
//                         >
//                           {subItem.icon}
//                         </ListItemIcon>
//                         <ListItemText primary={subItem.label} />
//                       </ListItemButton>
//                     </ListItem>
//                   ))}
//                 </List>
//               </Collapse>
//             )}
//           </React.Fragment>
//         ))}
//       </List>

    //   {/* Popper for hover content */}
    //   {!open && anchorEl && hoverContent && (
    //     <Popper
    //       open={isPopperOpen}
    //       anchorEl={anchorEl}
    //       placement="right"
    //       modifiers={[
    //         {
    //           name: "offset",
    //           options: {
    //             offset: [0, 0], // Offset the Popper slightly
    //           },
    //         },
    //       ]}
    //       onMouseEnter={handlePopperMouseEnter}
    //       onMouseLeave={handlePopperMouseLeave}
    //       sx={{ zIndex: 2000 }}
    //     >
    //       <Paper
    //         sx={{
    //           p: 1,
    //           minWidth: 200,
    //           // boxShadow: 3,
    //           backgroundColor: "#fff",
    //           borderRadius: 0, 
    //         }}
    //       >
    //         <Box
    //           sx={{
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "space-between",
    //             padding: 1,
    //             cursor: "pointer",
    //             "&:hover": {
    //               backgroundColor: "#f5f5f5",
    //             },
    //           }}
    //           onClick={
    //             hoverContent.subOptions
    //               ? () => setIsExpanded(!isExpanded)
    //               : hoverContent.path
    //               ? () => navigate(hoverContent.path) // Navigate directly to the path
    //               : undefined
    //           }
    //         >
    //           {hoverContent.path ? (
    //             <ListItemText
    //               primary={
    //                 <Link
    //                   to={hoverContent.path}
    //                   style={{
    //                     textDecoration: "none",
    //                     color: "inherit",
    //                     display: "block",
    //                   }}
    //                 >
    //                   {hoverContent.label}
    //                 </Link>
    //               }
    //             />
    //           ) : (
    //             <ListItemText primary={hoverContent.label} />
    //           )}
    //           {hoverContent.subOptions && (
    //             <>{isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</>
    //           )}
    //         </Box>

    //         {hoverContent.subOptions && (
    //           <Collapse in={isExpanded} timeout="auto" unmountOnExit>
    //             {hoverContent.subOptions.map((subItem) => (
    //               <ListItemButton
    //                 key={subItem.label}
    //                 component={Link}
    //                 to={subItem.path}
    //                 sx={{
    //                   textDecoration: "none",
    //                   color: "inherit",
    //                   display: "flex",
    //                   padding: 1,
    //                   "&:hover": {
    //                     backgroundColor: "#f5f5f5",
    //                   },
    //                 }}
    //               >
    //                 <ListItemText sx={{ pl: 3 }} primary={subItem.label} />
    //               </ListItemButton>
    //             ))}
    //           </Collapse>
    //         )}
    //       </Paper>
    //     </Popper>
    //   )}
//     </Box>
//   );
// }
import React, { useState } from "react";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentIcon from "@mui/icons-material/Payment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useNavigate } from "react-router-dom";
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessIcon from '@mui/icons-material/Business';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import { yellow } from "../../styles/ThemePrimitives";
import MenuBase from "./MenuBase"; // Base component to handle rendering logic
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const MenuContentJamiatAdmin = ({ open }) => {
  const menuItems = [
    {
      label: "Dashboard",
      icon: <HomeRoundedIcon />,
      path: "/dashboard",
    },
    {
      label: "Mumeneen",
      icon: <PersonIcon />,
      path: "/mumeneen",
    },
    {
      label: "Accounts",
      icon: <AnalyticsRoundedIcon />,
      subOptions: [
        { label: "Receipts", path: "/receipts", icon: <ReceiptIcon /> },
        { label: "Payments", path: "/payments", icon: <PaymentIcon /> },
        { label: "Expenses", path: "/expenses", icon: <AttachMoneyIcon /> },
      ],
    },
    {
      label: "Groupings",
      icon: <PeopleRoundedIcon />,
      subOptions: [
        { label: "Sector", path: "/sector", icon: <ApartmentIcon /> },
        { label: "Sub-Sector", path: "/sub_sector", icon: <BusinessIcon /> },
        { label: "Transfers", path: "/transfers", icon: <TransferWithinAStationIcon /> },
      ],
    },
        {
      label: "Niyaz",
      icon: <StarIcon />,
      path: "/niyaz",
    },
    // {
    //   label: "Bookings",
    //   icon: <EventIcon />,
    //   subOptions: [
    //     { label: "Zabihat", path: "/zabihat", icon: <StarIcon /> },
    //     { label: "Salawat/Fateha", path: "/salawat_fateha", icon: <StarIcon /> },
    //     { label: "Niyaz Date", path: "/niyaz_date", icon: <BookOnlineIcon /> },
    //   ],
    // },
        {
      label: "Menu",
      icon: <RestaurantMenuIcon />,
      path: "/menu",
    },
    {
      label: "Feedback",
      icon: <HelpRoundedIcon />,
      path: "/feedback",
    },
    // {
    //   label: "Notifications",
    //   icon: <NotificationsIcon />,
    //   path: "/notifications",
    // },
    // {
    //   label: "Settings",
    //   icon: <SettingsRoundedIcon />,
    //   path: "/settings",
    // },
    {
      label: "User Management",
      icon: <AdminPanelSettingsIcon />,
      subOptions: [
        { label: "Roles", path: "/roles", icon: <GroupIcon /> },
        { label: "Permissions", path: "/user_access", icon: <SecurityIcon /> },
      ],
    },
  ];

  return <MenuBase open={open} menuItems={menuItems} />;
};

export default MenuContentJamiatAdmin;

