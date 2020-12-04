import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Input,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import categorylogo from "./img/3223367.jpg";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";

const useStyles = makeStyles((theme) => ({
  numberField: {
    "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      display: "none",
    },
  },
}));

const CartItem = ({ image = categorylogo, orderItem = "Order Item" }) => {
  const [{ user, cart, menu }, dispatch] = useStateValue();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(10);
  let classes = useStyles();
  let timerTime = 3000;
  let inputTimer;

  useEffect(() => {
    setQuantity(cart[orderItem]["quantity"]);
    // setPrice(menu.find())
    let tempMenu = menu.find((item) => {
      if (item.name == orderItem) {
        return true;
      }
    });
    setPrice(tempMenu.price);
  }, [user, cart]);

  const updateQuantity = () => {
    let item = cart[orderItem];
    console.log("item", item);
    db.collection("users")
      .doc(user.email)
      .update({
        cart: {
          ...cart,
          [orderItem]: {
            ...item,
            quantity,
          },
        },
      });
  };

  const handleAddCart = (e) => {
    e.preventDefault();
    // set cart in user collection
    db.collection("users")
      .doc(user.email)
      .update({
        cart: {
          ...cart,
          [orderItem]: {
            quantity: 1,
          },
        },
      });
    // update basket in context
    dispatch({
      type: "UPDATE_CART",
      cart: {
        ...cart,
        [orderItem]: {
          quantity: 1,
        },
      },
    });
  };

  const handleRemoveCart = (e) => {
    e.preventDefault();
    let updatedCart = cart;
    delete updatedCart[orderItem];
    // set cart in user collection
    db.collection("users").doc(user.email).update({ cart: updatedCart });
    // update basket in context
    dispatch({
      type: "UPDATE_CART",
      cart: {
        ...updatedCart,
      },
    });
  };

  return (
    <Card style={{ marginTop: "2vh", marginBottom: "2vh" }} raised>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 0.2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            style={{
              maxHeight: 140,
              paddingLeft: "1vw",
              // flex: 0.2,
            }}
            src={image}
            alt="Category Logo"
          />
        </div>
        <div>
          <CardContent>
            <Typography>{orderItem}</Typography>
            <Typography>
              Quantity:{" "}
              <Input
                className={classes.numberField}
                value={quantity}
                type="number"
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                onKeyUp={() => {
                  clearTimeout(inputTimer);
                  if (!isNaN(quantity)) {
                    inputTimer = setTimeout(() => {
                      updateQuantity();
                    }, timerTime);
                  }
                }}
              />
            </Typography>
            <Typography>
              {quantity} X ₹{price} = ₹{quantity * price}
            </Typography>
          </CardContent>
          <CardActions>
            {!cart[orderItem] ? (
              <IconButton onClick={handleAddCart}>
                <AddIcon />
              </IconButton>
            ) : (
              <IconButton onClick={handleRemoveCart}>
                <RemoveIcon />
              </IconButton>
            )}
          </CardActions>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
