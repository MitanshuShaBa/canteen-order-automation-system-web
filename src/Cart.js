import { Button, Container, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CartItem from "./CartItem";
import { db, FieldValue } from "./firebase";
import OrderItem from "./OrderItem";
import { useStateValue } from "./StateProvider";

const Cart = () => {
  const [{ user, cart, menu, pendingPayments }, dispatch] = useStateValue();
  const [total, setTotal] = useState(0);
  const [menuFiltered, setMenuFiltered] = useState(menu);
  const [orderDetail, setOrderDetail] = useState({});
  // const paymentURL = "http://localhost:8000";
  const paymentURL = "https://canteen-server.herokuapp.com";
  const history = useHistory();

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

  useEffect(() => {
    //calculate total
    let cartKeys = Object.keys(cart);
    let menuItems = menu.filter((currItem) => {
      if (cartKeys.includes(currItem.name)) {
        return true;
      }
    });

    setMenuFiltered(menuItems);
    let total = findTotalAmount(cartKeys, menuItems);
    setTotal(total);
  }, [cart]);

  useEffect(() => {
    if (Object.keys(orderDetail).length > 0) {
      const options = {
        key: "rzp_test_9vV83s3ftGMywd",
        name: "KJSIEIT-Canteen",
        description: orderDetail.receipt,
        order_id: orderDetail.id,
        prefill: {
          email: user.email,
          contact: user.phoneNumber ? user.phoneNumber : "9999999999",
        },
        handler: ({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        }) => {
          fetch(paymentURL + "/validate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data) {
                // orderDetail.receipt update in db
                db.collection("active_orders").doc(orderDetail.receipt).update({
                  razorpay_payment_id,
                  payment_status: "paid",
                });
                history.push("/");
              }
            })
            .catch((err) => console.log(err));
        },
        theme: {
          color: "#686CFD",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    }
  }, [orderDetail]);

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

    // console.log(cart, "is bought");
    let total = findTotalAmount(cartKeys, menuItems);
    // console.log(total, "is the total");
    let orderContent = makeContent(cartKeys, menuItems);

    db.collection("active_orders")
      .add({
        bill: orderContent,
        ordered_by: user.email,
        payment_type: "digital",
        payment_status: "not paid",
        total_amount: total,
        placed_at: FieldValue.serverTimestamp(),
        status: "placed",
        username: user.displayName,
      })
      .then((docRef) => {
        handlePaymentGateway(total, docRef.id, cart);
        setTimeout(() => {
          db.collection("users").doc(user.email).update({ cart: {} });
          dispatch({
            type: "UPDATE_CART",
            cart: {},
          });
        }, 1000);
        // db.collection("users")
        //   .doc(user.email)
        //   .collection("my_orders")
        //   .add({ order_id: docRef.id });
        alert("Order placed successfully");
      });
  };

  const handlePaymentGateway = (amount, orderId, cart) => {
    fetch(paymentURL + "/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        orderId,
        notes: { 1: JSON.stringify(cart) },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOrderDetail(data);
        db.collection("active_orders").doc(data.receipt).update({
          razorpay_order_id: data.id,
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Typography style={{ marginTop: "2vh" }} variant="h2">
        Cart
      </Typography>

      {menuFiltered.map(
        ({ category, price, name, isAvailable, image_url }, key) => {
          if (isAvailable) {
            return (
              <OrderItem
                key={key}
                category={category}
                price={price}
                orderItem={name}
                image={image_url}
                isCart
              />
            );
          }
        }
      )}

      {user && Object.keys(cart).length !== 0 && (
        <>
          <Typography style={{ marginTop: "4vh" }} variant="h5">
            Total: ₹{total}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "2vh" }}
            onClick={handleBuyCart}
          >
            Click To Buy
          </Button>
        </>
      )}
      {user && Object.keys(cart).length === 0 && (
        <Typography variant="h6">Add something to Cart</Typography>
      )}
    </Container>
  );
};

export default Cart;
