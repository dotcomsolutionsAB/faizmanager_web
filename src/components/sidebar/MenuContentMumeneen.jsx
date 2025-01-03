import React from "react";
import MenuBase from "./MenuBase"; // Base component to handle rendering logic
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";


const MenuContentMumeneen = ({ open }) => {
  const menuItems = [
    {
      label: "Dashboard",
      icon: <HomeRoundedIcon />,
      path: "/dashboard",
    },
  ];

  return <MenuBase open={open} menuItems={menuItems} />;
};

export default MenuContentMumeneen;
