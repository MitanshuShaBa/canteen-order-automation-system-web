import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Account from "./AccountPages/Account";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";
import "./App.css";
import Navbar from "./Navbar";

export default function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in

        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        //user logged out

        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  console.log("user is", user && user.providerData[0].email);
  // console.log(user)

  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <footer
          style={{
            position: "fixed",
            left: 0,
            bottom: 0,
            width: "100%",
            color: "white",
            textAlign: "right",
          }}
        >
          <a href="https://www.freepik.com/vectors/logo">
            Logo vector created by catalyststuff - www.freepik.com
          </a>
        </footer>
      </div>
    </Router>
  );
}

function About() {
  return <h2>About</h2>;
}
function Logout() {
  const [{ user }] = useStateValue();
  let history = useHistory();

  return (
    <>
      <h2 style={{ paddingLeft: "2vw", paddingTop: "4vh" }}>
        You have been logged out
      </h2>
      {setTimeout(() => {
        user && auth.signOut();
        history.push("/");
      }, 1500)}
    </>
  );
}
