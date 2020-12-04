import { Container } from "@material-ui/core";
import React from "react";
import AccountBody from "./AccountBody";
import AccountHeader from "./AccountHeader";
import { useStateValue } from "../StateProvider";
import { Link } from "react-router-dom";

const Account = () => {
  const [{ user }] = useStateValue();

  return (
    <Container style={{ marginTop: "4vh" }}>
      {user ? (
        <>
          <AccountHeader />
          <AccountBody />
        </>
      ) : (
        <h2>
          <Link to="/login">Login</Link>
        </h2>
      )}
    </Container>
  );
};

export default Account;
