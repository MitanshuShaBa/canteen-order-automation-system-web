import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Account from "./AccountPages/Account";
import { useStateValue } from "./StateProvider";
import { auth, db } from "./firebase";
import "./App.css";
import Navbar from "./Navbar";
import Login from "./Login";
import Cart from "./Cart";

//  useEffect(() => {
//    if (user) {
//      let userDocument = db.collection("users").doc(user.email).get();
//      dispatch({
//        type: "UPDATE_USERDOC",
//        userDoc: userDocument,
//      });
//    }
//  }, [user]);

function getUserDoc(email) {
  let userDoc;
  db.collection("users")
    .doc(email)
    .get()
    .then((doc) => doc.data())
    .catch((error) => console.log(error));
}

export default function App() {
  const [{ user, cart, userDoc }, dispatch] = useStateValue();

  useEffect(() => {
    if (user) {
      // USE FOR PRODUCTION
      // setInterval(() => {
      //   db.collection("users")
      //     .doc(user.email)
      //     .get()
      //     .then((doc) => {
      //       dispatch({
      //         type: "UPDATE_USERDOC",
      //         userDoc: doc.data(),
      //       });
      //     })
      //     .catch((error) => console.log(error));
      // }, 120000); // 2 minutes

      //USE FOR DEVELOPMENT
      db.collection("users")
        .doc(user.email)
        .get()
        .then((doc) => {
          dispatch({
            type: "UPDATE_USERDOC",
            userDoc: doc.data(),
          });
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  useEffect(() => {
    let menuSnapshot = [];

    const unsubscribe = db.collection("menu").onSnapshot(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => menuSnapshot.push(doc.data()));
        console.log("menu updated", menuSnapshot);
        dispatch({
          type: "UPDATE_MENU",
          menu: menuSnapshot,
        });
      },
      (error) => console.log(error)
    );
    return () => unsubscribe();
  }, []);

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

  // console.log("user is", user && user.providerData[0].email);
  // console.log(user);
  // console.log(userDoc);
  // console.log(cart);

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
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <footer
          style={{
            position: "relative",
            left: 0,
            bottom: 0,
            width: "100%",
            color: "white",
            textAlign: "right",
            marginTop: "15vh",
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
