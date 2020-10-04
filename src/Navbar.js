import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CreateIcon from "@material-ui/icons/Create";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Info from "@material-ui/icons/Info";
import Home from "@material-ui/icons/Home";
import MobilRightMenuSlider from "@material-ui/core/Drawer";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import logo from "./img/1986.jpg";
import { Link, useHistory } from "react-router-dom";

const useStyles = makeStyles((_theme) => ({
  sideBar: {
    width: 250,
    background: "#3fb0ac",
    height: "100%",
  },
  listIcon: {
    color: "#11848d",
    textDecoration: "none",
  },
  listText: {
    color: "#11848d",
    textDecoration: "none",
  },
  listItem: {
    textDecoration: "none",
  },
}));

function Navbar() {
  const classes = useStyles();
  let history = useHistory();

  const [state, setState] = useState({ right: false });
  const toggleSidebar = (slider, open) => () => {
    setState({ ...state, [slider]: open });
  };

  const menuItems = [
    { listIcon: <Home />, listText: "Home", to: "/" },
    { listIcon: <Info />, listText: "About", to: "/about" },
    { listIcon: <AccountCircleIcon />, listText: "Account", to: "/account" },
    { listIcon: <CreateIcon />, listText: "Register", to: "/register" },
    { listIcon: <VpnKeyIcon />, listText: "Log In", to: "/login" },
    { listIcon: <ExitToAppIcon />, listText: "Log out", to: "/logout" },
  ];

  const sideBar = (slider) => (
    <Box className={classes.sideBar} onClick={toggleSidebar("right", false)}>
      <List>
        {menuItems.map((listItem, key) => (
          <ListItem
            button
            className={classes.listItem}
            key={key}
            onClick={() => {
              toggleSidebar("right", false);
              window.scrollTo(0, 0);
              history.push(listItem.to);
            }}
          >
            <ListItemIcon className={classes.listIcon}>
              {listItem.listIcon}
            </ListItemIcon>
            <ListItemText className={classes.listText}>
              <b>{listItem.listText}</b>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        style={{ backgroundColor: "#333333", marginTop: 0 }}
      >
        <Toolbar>
          <IconButton
            style={{ marginRight: 2 }}
            onClick={() => {
              history.push("/");
              window.scrollTo(0, 0);
            }}
          >
            <img
              style={{ borderRadius: "50%" }}
              src={logo}
              alt="not found"
              height="50vh"
            />
          </IconButton>
          <Typography style={{ flexGrow: 1 }} variant="h5">
            <Link
              to="/"
              onClick={() => window.scrollTo(0, 0)}
              style={{ textDecoration: "none", color: "white" }}
            >
              KJSIEIT-Canteen
            </Link>
          </Typography>
          <IconButton onClick={toggleSidebar("right", true)}>
            <MenuIcon fontSize="large" style={{ color: "white" }} />{" "}
          </IconButton>
          <MobilRightMenuSlider
            anchor="right"
            open={state.right}
            onClose={toggleSidebar("right", false)}
          >
            {sideBar("right")}
          </MobilRightMenuSlider>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
