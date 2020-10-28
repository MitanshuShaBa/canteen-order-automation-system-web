import { Button, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import CartItem from "./CartItem";
import { db } from "./firebase";
import { useStateValue } from "./StateProvider";

const Cart = () => {
  const [{ user, cart, userDoc }, dispatch] = useStateValue();

  useEffect(() => {
    if (user) {
      const unsubscribe = db
        .collection("users")
        .doc(user.email)
        .onSnapshot(
          (snapshot) => {
            dispatch({
              type: "UPDATE_USERDOC",
              userDoc: snapshot.data(),
            });
          },
          (error) => alert(error)
        );

      return () => {
        unsubscribe();
      };
    }
  }, [user]);
  return (
    <>
      <Typography variant="h2">Cart</Typography>
      <Button variant="contained" color="secondary" style={{marginBottom:'2vh'}}>
        Click To Buy ₹₹₹
      </Button>
      <CartItem orderItem="dosa" />
    </>
  );
};

export default Cart;
