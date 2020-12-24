import { Container, Typography } from "@material-ui/core";
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
        <Typography variant="body1">
          Please <Link to="/login">Log In</Link> first
        </Typography>
      )}
    </Container>
  );
};

export default Account;
