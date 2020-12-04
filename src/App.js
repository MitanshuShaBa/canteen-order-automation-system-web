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
      const getUserDoc = () => {
        db.collection("users")
          .doc(user.email)
          .get()
          .then((doc) => {
            if (doc.data()) {
              // console.log("Got Data", doc.data());
              dispatch({
                type: "UPDATE_USERDOC",
                userDoc: doc.data(),
              });
            } else {
              // console.log("Retrying to get data");
              getUserDoc();
            }
          })
          .catch((error) => console.log(error));
      };
      getUserDoc();
    }
  }, [user]);

  useEffect(() => {
    // fetch("https://canteen-server.herokuapp.com"); // TODO: uncomment it after working
    const unsubscribe = db.collection("menu").onSnapshot(
      (querySnapshot) => {
        let menuSnapshot = [];
        querySnapshot.forEach((doc) => menuSnapshot.push(doc.data()));
        // console.log("menu updated", menuSnapshot);
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
        dispatch({
          type: "UPDATE_USERDOC",
          userDoc: {},
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
        <div style={{ minHeight: window.innerHeight }}>
          <Switch>
            {/* <Route path="/about">
            <About />
          </Route> */}
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
        </div>
        <footer
          style={{
            position: "static",
            right: 0,
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

  useEffect(() => {
    setTimeout(() => {
      logout();
    }, 1500);
  }, []);

  const logout = () => {
    if (user) {
      auth
        .signOut()
        .then(() => {
          history.replace("/");
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <>
      <h2 style={{ paddingLeft: "2vw", paddingTop: "4vh" }}>
        You have been logged out
      </h2>
    </>
  );
}
