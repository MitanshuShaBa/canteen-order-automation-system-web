import React, { useState } from "react";
import {
  Button,
  Container,
  Input,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { auth, db, FieldValue, provider } from "./firebase";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  numberField: {
    "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      display: "none",
    },
  },
}));

const Register = () => {
  const classes = useStyles();
  const history = useHistory();

  const [state, setState] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
      history.push("/");
    }
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (state.name && state.email && state.number && state.password) {
      auth
        .createUserWithEmailAndPassword(state.email, state.password)
        .then((authResponse) => {
          console.log("logged in");
          authResponse.user.updateProfile({
            displayName: state.name,
            photoURL:
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          });

          db.collection("users").doc(state.email).set(
            {
              cart: {},
              email: state.email,
              fav_items: [],
              name: state.name,
              orders: [],
              phone: state.number,
              uid: authResponse.user.uid,
            },
            { merge: true }
          );
        })
        .catch((e) => alert(e.message));
    } else {
      alert("Fill all values");
    }

    // setState({
    //   name: "",
    //   email: "",
    //   number: "",
    //   password: "",
    // });
  };

  const handleSubmitGoogle = (e) => {
    e.preventDefault();

    // auth.signInWithRedirect(provider);

    // auth
    //   .getRedirectResult()
    //   .then((auth) => {
    //     // console.log("logged in", auth.user.providerData[0].email);
    //   })
    //   .catch((e) => alert(e.message));

    auth
      .signInWithPopup(provider.addScope("email"))
      .then((auth) => {
        console.log("logged in", auth.user.providerData[0].email);

        let user = auth.user;
        let uid = user.uid;
        let name = user.displayName;
        let number = user.phoneNumber;
        let email = user.providerData[0].email;

        db.collection("users").doc(email).set(
          {
            cart: {},
            email,
            fav_items: [],
            name,
            orders: [],
            phone: number,
            uid,
          },
          { merge: true }
        );
      })
      .catch((e) => alert(e.message));
  };

  return (
    <Container maxWidth="sm">
      <div style={{ marginTop: "5vh" }}></div>
      <Typography
        color="secondary"
        variant="h3"
        style={{ alignItems: "center" }}
      >
        Create Account
      </Typography>
      <form autoComplete="off">
        <Input
          color="secondary"
          name="name"
          placeholder="Name"
          fullWidth
          required
          value={state.name}
          onChange={handleChange}
        />
        <Input
          color="secondary"
          name="email"
          placeholder="Email"
          fullWidth
          type="email"
          value={state.email}
          onChange={handleChange}
        />
        <Input
          color="secondary"
          className={classes.numberField}
          name="number"
          placeholder="Phone Number"
          fullWidth
          required
          type="tel"
          value={state.number}
          onChange={handleChange}
        />
        <Input
          color="secondary"
          name="password"
          placeholder="Password"
          fullWidth
          type="password"
          value={state.password}
          onChange={handleChange}
        />
        <Button color="secondary" type="submit" onClick={handleSubmit}>
          Register
        </Button>
        <Button color="secondary" type="submit" onClick={handleSubmitGoogle}>
          Register With Google
        </Button>
      </form>
    </Container>
  );
};

export default Register;
