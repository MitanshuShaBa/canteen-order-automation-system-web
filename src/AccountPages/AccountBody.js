import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Divider, useMediaQuery } from "@material-ui/core";
import Order from "./Order";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";

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
    paddingBottom: "10px",
  },
}));

export default function AccountBody() {
  const [{ user }, dispatch] = useStateValue();

  const theme = useTheme();
  // const smUP = useMediaQuery(theme.breakpoints.up("sm"));
  const smUP = useMediaQuery("425px");
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    db.collection("orders")
      .where("ordered_by", "==", user.email)
      .get()
      .then((snapshot) => {
        let myOrders = [];
        snapshot.forEach((doc) => {
          // console.log(doc.id, "=>", doc.data());
          myOrders.push({ ...doc.data(), id: doc.id });
        });
        myOrders.sort((a, b) => b.placed_at.seconds - a.placed_at.seconds);
        setOrders(myOrders);
      });
    db.collection("active_orders")
      .where("ordered_by", "==", user.email)
      .get()
      .then((snapshot) => {
        let myOrders = [];
        snapshot.forEach((doc) => {
          // console.log(doc.id, "=>", doc.data());
          myOrders.push({ ...doc.data(), id: doc.id });
        });
        myOrders.sort((a, b) => b.placed_at.seconds - a.placed_at.seconds);
        setActiveOrders(myOrders);
      });
  }, []);

  return (
    <div>
      <Typography variant="h4" style={{ marginTop: "4vh" }}>
        My Active Orders
      </Typography>
      <Divider style={{ marginTop: "1vh", marginBottom: "2vh" }} />

      {activeOrders.map((order) => (
        <Order key={order.id} order={order} />
      ))}

      <Typography variant="h4" style={{ marginTop: "4vh" }}>
        My Orders
      </Typography>
      <Divider style={{ marginTop: "1vh", marginBottom: "2vh" }} />

      {orders.map((order) => (
        <Order key={order.id} order={order} />
      ))}
    </div>
  );
}
