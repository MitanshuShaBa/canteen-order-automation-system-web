import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "./firebase";
import { useStateValue } from "./StateProvider";

function Home() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/account">Account</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
      <h2>Home {user && (user.email ? user.email : user.providerData[0].email)}</h2>
      <button
        onClick={() => {
          auth.signOut();
        }}
      >
        Signout
      </button>
    </div>
  );
}

export default Home;
