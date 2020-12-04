import {
  Card,
  CardActions,
  CardContent,
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

const useStyles = makeStyles(() => ({
  numberField: {
    "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      display: "none",
    },
  },
}));

const OrderItem = ({
  image = categorylogo,
  orderItem = "dosa",
  price = 15,
  category = "south indian",
  isCart = false,
}) => {
  const [{ user, cart }, dispatch] = useStateValue();
  const [quantity, setQuantity] = useState(1);
  let classes = useStyles();
  let timerTime = 1000;
  let inputTimer;

  // const theme = useTheme();
  // const tabletMediaQuery = useMediaQuery(theme.breakpoints.up("md"));
  // console.log(tabletMediaQuery);

  useEffect(() => {
    if (isCart) {
      setQuantity(cart[orderItem]?.quantity);
      // setQuantity(cart[orderItem]["quantity"]);
    }
  }, [user, cart]);

  const updateQuantity = () => {
    let item = cart[orderItem];
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
    if (user) {
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
    } else {
      alert("Please Login first");
    }
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
    <Card style={{ marginTop: "2vh", padding: 8 }} raised>
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            flex: "0.2 ",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
              paddingLeft: "2vw",
              width: "90%",
              // aspectRatio:'initial'
              // marginBottom: "8",
              // marginTop: "8",
              // borderRadius: "50%", //TODO: check border radius
            }}
            // src={url}
            src={image !== "" ? image : categorylogo}
            alt={orderItem}
          />
        </div>
        <div>
          <CardContent>
            <Typography>{orderItem}</Typography>
            {/* <Typography>{tabletMediaQuery}</Typography> */}
            {!isCart && (
              <>
                <Typography>₹{price}</Typography>
                <Typography>{category}</Typography>
              </>
            )}
            {isCart && (
              <>
                <Typography>Quantity:</Typography>
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
                <Typography>
                  {quantity} X ₹{price} = ₹{quantity * price}
                </Typography>
              </>
            )}
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

export default OrderItem;
