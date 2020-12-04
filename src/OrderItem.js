import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import categorylogo from "./img/3223367.jpg";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useStateValue } from "./StateProvider";
import { db, storage } from "./firebase";

const OrderItem = ({
  image = categorylogo,
  orderItem = "dosa",
  price = 15,
  category = "south indian",
}) => {
  const [{ user, cart }, dispatch] = useStateValue();
  const [url, setUrl] = useState(categorylogo);
  // const theme = useTheme();
  // const tabletMediaQuery = useMediaQuery(theme.breakpoints.up("md"));
  // console.log(tabletMediaQuery);

  useEffect(() => {
    if (image !== "") {
      const gsReference = storage.refFromURL(image);
      gsReference
        .getDownloadURL()
        .then((url) => setUrl(url))
        .catch((e) => console.log(e));
    }
  }, []);

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
            src={url}
            alt={orderItem}
          />
        </div>
        <div>
          <CardContent>
            <Typography>{orderItem}</Typography>
            {/* <Typography>{tabletMediaQuery}</Typography> */}
            <Typography>₹{price}</Typography>
            <Typography>{category}</Typography>
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
