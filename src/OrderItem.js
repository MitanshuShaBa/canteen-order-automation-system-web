import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import React from "react";
import categorylogo from "./img/3223367.jpg";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useStateValue } from "./StateProvider";
import { db } from "./firebase";

const OrderItem = ({ image = categorylogo, orderItem = "Order Item" }) => {
  const [{ user, cart }, dispatch] = useStateValue();

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

export default OrderItem;
