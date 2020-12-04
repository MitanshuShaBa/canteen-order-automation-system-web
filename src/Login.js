import { Button, Container, Input } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, db, provider } from "./firebase";

const Login = () => {
  let history = useHistory();
  const [state, setState] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const emailLogin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(state.email, state.password)
      .then((authUser) => {
        if (authUser) {
          console.log("logged in", authUser.user.email);
          history.push("/");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const googleLogin = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(provider)
      .then((authUser) => {
        if (authUser) {
          console.log("logged in", authUser.user.email);
          history.push("/");
          const userRef = db.collection("users").doc(authUser.user.email);
          userRef.get().then((doc) => {
            if (!doc.exists) {
              db.collection("users").doc(authUser.user.email).set(
                {
                  cart: {},
                  email: authUser.user.email,
                  fav_items: [],
                  name: authUser.user.displayName,
                  orders: [],
                  phone: authUser.user.phoneNumber,
                  uid: authUser.user.uid,
                  role: "student",
                },
                { merge: true }
              );
            } else {
              console.log("Document data:", doc.data());
            }
          });
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <Container maxWidth="sm">
      <h2>Login</h2>

      <form onSubmit={emailLogin}>
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
          name="password"
          placeholder="Password"
          fullWidth
          type="password"
          value={state.password}
          onChange={handleChange}
        />{" "}
        <Button type="submit">Sign in with email</Button>
      </form>
      <br></br>

      <button onClick={googleLogin}>Sign in with google</button>
    </Container>
  );
};

export default Login;
