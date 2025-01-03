import React, { useState } from "react";
import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Paper, Popper, Typography, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";


const MenuBase = ({ open, menuItems }) => {
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for the Popper
  const [hoverContent, setHoverContent] = useState(null); // Current item content


     const [isPopperOpen, setIsPopperOpen] = useState(false); // State for Popper visibility
     const [isExpanded, setIsExpanded] = useState(false); // State to expand sub-options in the Popper
   
        const [expandedItems, setExpandedItems] = useState({});
        const navigate = useNavigate();


        const handleMouseEnter = (event, item) => {
            if (!open) {
              setAnchorEl(event.currentTarget);
              setHoverContent(item);
              setIsPopperOpen(true);
            }
          };
        
          const handleMouseLeave = () => {
            setIsPopperOpen(false);
            setIsExpanded(false);
          };
        
          const handlePopperMouseEnter = () => {
            setIsPopperOpen(true);
          };
        
          const handlePopperMouseLeave = () => {
            setIsPopperOpen(false);
            setIsExpanded(false);
          };
  const handleExpandClick = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <Box>
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.label}>
            <ListItem
              onMouseEnter={(e) => handleMouseEnter(e, item)}
              onMouseLeave={handleMouseLeave}
            >
              <ListItemButton
                onClick={
                  open && item.subOptions
                    ? () => handleExpandClick(item.label)
                    : item.path
                    ? () => navigate(item.path)
                    : undefined
                }
              >
                <ListItemIcon  sx={{
                    paddingTop: open ? "0px" : "10px", // Add padding when sidebar is closed
                    paddingBottom: open ? "0px" : "10px", // Add padding when sidebar is closed
                    transition: "all 0.3s ease",
                  }}>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.label} />}
                {open && item.subOptions && (
                  <>{expandedItems[item.label] ? <ExpandLessIcon /> : <ExpandMoreIcon />}</>
                )}
              </ListItemButton>
            </ListItem>
            {open && item.subOptions && (
              <Collapse in={expandedItems[item.label]} timeout="auto" unmountOnExit>
                <List component="div">
                  {item.subOptions.map((subItem) => (
                    <ListItem key={subItem.label}>
                      <ListItemButton onClick={() => navigate(subItem.path)}>
                        <ListItemIcon>{subItem.icon}</ListItemIcon>
                        <ListItemText primary={subItem.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>z
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

 {/* Popper for hover content */}
      {!open && anchorEl && hoverContent && (
        <Popper
          open={isPopperOpen}
          anchorEl={anchorEl}
          placement="right"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 0], // Offset the Popper slightly
              },
            },
          ]}
          onMouseEnter={handlePopperMouseEnter}
          onMouseLeave={handlePopperMouseLeave}
          sx={{ zIndex: 2000 }}
        >
          <Paper
            sx={{
              p: 1,
              minWidth: 200,
              // boxShadow: 3,
              backgroundColor: "#fff",
              borderRadius: 0, 
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 1,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
              onClick={
                hoverContent.subOptions
                  ? () => setIsExpanded(!isExpanded)
                  : hoverContent.path
                  ? () => navigate(hoverContent.path) // Navigate directly to the path
                  : undefined
              }
            >
              {hoverContent.path ? (
                <ListItemText
                  primary={
                    <Link
                      to={hoverContent.path}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                      }}
                    >
                      {hoverContent.label}
                    </Link>
                  }
                />
              ) : (
                <ListItemText primary={hoverContent.label} />
              )}
              {hoverContent.subOptions && (
                <>{isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</>
              )}
            </Box>

            {hoverContent.subOptions && (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                {hoverContent.subOptions.map((subItem) => (
                  <ListItemButton
                    key={subItem.label}
                    component={Link}
                    to={subItem.path}
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      padding: 1,
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemText sx={{ pl: 3 }} primary={subItem.label} />
                  </ListItemButton>
                ))}
              </Collapse>
            )}
          </Paper>
        </Popper>
      )}
    </Box>
  );
};

export default MenuBase;
