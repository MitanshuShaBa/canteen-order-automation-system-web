import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useMediaQuery } from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "secondary",
    display: "flex",
    height: 224,
    marginTop: "2vh",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    paddingBottom: '10px'
  },
}));

export default function AccountBody() {
  const theme = useTheme();
  // const smUP = useMediaQuery(theme.breakpoints.up("sm"));
  const smUP = useMediaQuery("425px");
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      {/* <div style={{ flex: smUP ? "0.7" : "0.2" }}> */}
      <div style={{ flex: "0.2" }}>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs "
          className={classes.tabs}
        >
          <Tab label="My Orders" wrapped {...a11yProps(0)} />
          <Tab label="My Favourites" wrapped {...a11yProps(1)} />
        </Tabs>
      </div>
      <div>
        <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
      </div>
    </div>
  );
}
