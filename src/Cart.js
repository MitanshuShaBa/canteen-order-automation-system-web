import { Button, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import CartItem from "./CartItem";
import { db, FieldValue } from "./firebase";
import { useStateValue } from "./StateProvider";

const Cart = () => {
  const [{ user, cart, userDoc, menu }, dispatch] = useStateValue();

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

  const findTotalAmount = (cartKeys, menuItems) => {
    let totalAmount = 0;

    cartKeys.map((cartItem) => {
      let amountItem =
        cart[cartItem]["quantity"] *
        menuItems.find((menuItem) => menuItem.name === cartItem)["price"];

      totalAmount += amountItem;
    });

    return totalAmount;
  };

  const makeContent = (cartKeys, menuItems) => {
    let content = {};
    cartKeys.map((cartItem) => {
      content[cartItem] = {
        quantity: cart[cartItem]["quantity"],
        price: menuItems.find((menuItem) => menuItem.name === cartItem)[
          "price"
        ],
      };
    });
    return content;
  };

  const handleBuyCart = () => {
    let cartKeys = Object.keys(cart);
    let menuItems = menu.filter((currItem) => {
      if (cartKeys.includes(currItem.name)) {
        return true;
      }
    });

    console.log(cart, "is bought");
    let total = findTotalAmount(cartKeys, menuItems);
    console.log(total, "is the total");
    let orderContent = makeContent(cartKeys, menuItems);

    db.collection("active_orders")
      .add({
        content: orderContent,
        ordered_by: user.email,
        payment_type: "digital",
        total: total,
        created_at: FieldValue.serverTimestamp(),
        status: "placed",
      })
      .then(() => {
        db.collection("users").doc(user.email).update({ cart: {} });
        dispatch({
          type: "UPDATE_CART",
          cart: {},
        });
        alert("order placed successfully");
      });
  };

  return (
    <>
      <Typography variant="h2">Cart</Typography>
      <Button
        variant="contained"
        color="secondary"
        style={{ marginBottom: "2vh" }}
        onClick={handleBuyCart}
      >
        Click To Buy ₹₹₹
      </Button>
      {Object.keys(cart).map((item, key) => (
        <CartItem orderItem={item} key={key} />
      ))}
      <Button
        variant="contained"
        color="secondary"
        style={{ marginBottom: "2vh" }}
        onClick={handleBuyCart}
      >
        Click To Buy ₹₹₹
      </Button>
    </>
  );
};

export default Cart;
