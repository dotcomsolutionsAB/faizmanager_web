import React from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BusinessIcon from "@mui/icons-material/Business";
import MenuBase from "./MenuBase";

const MenuContentStore = ({ open }) => {
    const menuItems = [
        {
            label: "Dashboard",
            icon: <HomeRoundedIcon />,
            path: "/dashboard",
        },
        {
            label: "Store In",
            icon: <AddShoppingCartIcon />,
            path: "/store-in",
        },
        {
            label: "Store Out",
            icon: <RemoveShoppingCartIcon />,
            path: "/store-out",
        },
        {
            label: "Menu Dish",
            icon: <RestaurantMenuIcon />,
            path: "/menu-dish",
        },
        {
            label: "Items",
            icon: <ShoppingCartIcon />,
            path: "/items",
        },
        {
            label: "Vendors",
            icon: <BusinessIcon />,
            path: "/vendors",
        },
    ];

    return <MenuBase open={open} menuItems={menuItems} />;
};

export default MenuContentStore;