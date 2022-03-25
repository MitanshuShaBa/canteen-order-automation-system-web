import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
//   Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { db, FieldValue } from "./firebase";
import OrderItem from "./OrderItem";
import { useStateValue } from "./StateProvider";

const Cart = () => {
  const [{ user, cart, menu }, dispatch] = useStateValue();
  const [total, setTotal] = useState(0);
  const [menuFiltered, setMenuFiltered] = useState(menu);
  const [orderDetail, setOrderDetail] = useState({});
  const [payMethod, setPayMethod] = useState("cash");
  // const paymentURL = "http://localhost:8000";
  const backendURL = "https://canteen-server.herokuapp.com";
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
  // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    //calculate total
    if (user) {
      let cartKeys = Object.keys(cart);
      let menuItems = menu.filter((currItem) => {
        if (cartKeys.includes(currItem.name)) {
          // console.log("in cart", currItem.name);
          if (!currItem.isAvailable) {
            // console.log("removing fromm cart", currItem.name);
            cartKeys = cartKeys.filter((cartKey) => cartKey !== currItem.name);
            removeFromCart(currItem.name);
            return false;
          }
          return true;
        }
        return false;
      });
      // console.log("cart filtering", menuItems, cartKeys);

      setMenuFiltered(menuItems);
      let total = findTotalAmount(cartKeys, menuItems);
      setTotal(total);
    }
  // eslint-disable-next-line
  }, [cart, menu]);

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
          fetch(backendURL + "/validate", {
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
                history.push("/account") && window.scrollTo(0, 0);
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
  // eslint-disable-next-line
  }, [orderDetail]);

  const findTotalAmount = (cartKeys, menuItems) => {
    let totalAmount = 0;

    // eslint-disable-next-line
    cartKeys.map((cartItem) => {
      if (cart[cartItem]) {
        let amountItem =
          cart[cartItem]["quantity"] *
          menuItems.find((menuItem) => menuItem.name === cartItem)["price"];

        totalAmount += amountItem;
      }
    });

    return totalAmount;
  };

  const removeFromCart = (itemName) => {
    let updatedCart = cart;
    delete updatedCart[itemName];

    db.collection("users").doc(user.email).update({ cart: updatedCart });
  };

  const makeContent = (cartKeys, menuItems) => {
    let content = {};
    cartKeys.map((cartItem) => (
      content[cartItem] = {
        quantity: cart[cartItem]["quantity"],
        price: menuItems.find((menuItem) => menuItem.name === cartItem)[
          "price"
        ],
      }
    ));
    return content;
  };

  const handleBuyCart = () => {
    let cartKeys = Object.keys(cart);
    let menuItems = menu.filter((currItem) => {
      if (cartKeys.includes(currItem.name)) {
        return true;
      }
      return false;
    });

    // console.log(cart, "is bought");
    let total = findTotalAmount(cartKeys, menuItems);
    // console.log(total, "is the total");
    let orderContent = makeContent(cartKeys, menuItems);

    db.collection("active_orders")
      .add({
        bill: orderContent,
        ordered_by: user.email,
        payment_type: payMethod,
        payment_status: "not paid",
        total_amount: total,
        placed_at: FieldValue.serverTimestamp(),
        status: "placed",
        username: user.displayName,
      })
      .then((docRef) => {
        payMethod === "digital" && handlePaymentGateway(total, docRef.id, cart);
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
        payMethod === "cash" &&
          history.push("/account") &&
          window.scrollTo(0, 0);
      });
  };

  const handlePaymentGateway = (amount, orderId, cart) => {
    fetch(backendURL + "/order", {
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
      {!user && (
        <Typography variant="body1">
          Please <Link to="/login">Log In</Link> first
        </Typography>
      )}

      {user &&
        menuFiltered.map(
          // eslint-disable-next-line
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography style={{ marginTop: "4vh" }} variant="h5">
            Total: ₹{total}
          </Typography>
          <FormControl
            style={{ marginTop: 8, alignSelf: "flex-start" }}
            component="fieldset"
          >
            <FormLabel color="secondary" component="legend">
              Mode of Payment
            </FormLabel>
            <RadioGroup
              aria-label="payMethod"
              name="rolpayMethode"
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
            >
              <FormControlLabel value="cash" control={<Radio />} label="Cash" />
//               <FormControlLabel
//                 value="digital"
//                 control={<Radio />}
//                 label="Digital"
//               />
            </RadioGroup>
          </FormControl>
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "2vh", alignSelf: "flex-start" }}
            onClick={handleBuyCart}
          >
            Click To Buy
          </Button>
        </div>
      )}
      {user && Object.keys(cart).length === 0 && (
        <Typography variant="h6">Add something to Cart</Typography>
      )}
    </Container>
  );
};

export default Cart;
