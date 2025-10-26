import React from "react";
import MenuBase from "./MenuBase"; // Base component to handle rendering logic
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';

const MenuContentMusaid = ({ open }) => {
  const menuItems = [
    {
      label: "Dashboard",
      icon: <HomeRoundedIcon />,
      path: "/dashboard",
    },
    {
      label: "Jamaat",
      icon: <PeopleRoundedIcon />,
      path: "/jamaat",
    },
  ];

  return <MenuBase open={open} menuItems={menuItems} />;
};

export default MenuContentMusaid;
