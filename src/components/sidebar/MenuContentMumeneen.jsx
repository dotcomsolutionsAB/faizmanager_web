
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

const MenuContentMumeneen = ({ open }) => {
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

    // {
    //   label: "Bookings",
    //   icon: <EventIcon />,
    //   subOptions: [
    //     { label: "Zabihat", path: "/zabihat", icon: <StarIcon /> },
    //     { label: "Salawat/Fateha", path: "/salawat_fateha", icon: <StarIcon /> },
    //     { label: "Niyaz Date", path: "/niyaz_date", icon: <BookOnlineIcon /> },
    //   ],
    // },
 
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
        // { label: "Roles", path: "/roles", icon: <GroupIcon /> },
        { label: "User Access", path: "/user_access", icon: <SecurityIcon /> },
      ],
    },
  ];

  return <MenuBase open={open} menuItems={menuItems} />;
};

export default MenuContentMumeneen;

