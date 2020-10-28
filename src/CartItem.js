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
import React, { useState } from "react";
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
  const [{ user, cart }, dispatch] = useStateValue();
  const [quantity, setQuantity] = useState(1);
  let classes = useStyles();
  let timerTime = 3000;
  let inputTimer;

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
            price: 15,
          },
        },
      });
    // update basket in context
    dispatch({
      type: "UPDATE_CART",
      cart: {
        ...cart,
        [orderItem]: {
          quantity: 2,
          price: 15,
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
    <Card raised>
      <div style={{ display: "flex" }}>
        <img
          style={{ height: 140, flex: 0.2 }}
          src={image}
          alt="Category Logo"
        />
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
          </CardContent>
          <CardActions>
            {/* TODO */}

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
