import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import Order from "./Order";
import { db } from "../firebase";
import { useStateValue } from "../StateProvider";

export default function AccountBody() {
  const [{ user }] = useStateValue();

  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    const unsubscribe_active = db
      .collection("active_orders")
      .where("ordered_by", "==", user.email)
      .onSnapshot((snapshot) => {
        let myOrders = [];
        snapshot.forEach((doc) => {
          myOrders.push({ ...doc.data(), id: doc.id });
        });
        myOrders.sort((a, b) => b.placed_at.seconds - a.placed_at.seconds);
        setActiveOrders(myOrders);
      });
    const unsubscribe_orders = db
      .collection("orders")
      .where("ordered_by", "==", user.email)
      .onSnapshot((snapshot) => {
        let myOrders = [];
        snapshot.forEach((doc) => {
          // console.log(doc.id, "=>", doc.data());
          myOrders.push({ ...doc.data(), id: doc.id });
        });
        myOrders.sort((a, b) => b.placed_at.seconds - a.placed_at.seconds);
        setOrders(myOrders);
      });

    return () => {
      unsubscribe_active();
      unsubscribe_orders();
    };
  }, [user.email]);

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
