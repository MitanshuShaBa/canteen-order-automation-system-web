import { Container } from "@material-ui/core";
import React from "react";
import AccountBody from "./AccountBody";
import AccountHeader from "./AccountHeader";
import { useStateValue } from "../StateProvider";

const Account = () => {
  const [{ user }] = useStateValue();

  return (
    <Container style={{marginTop:'4vh'}}>
      {user ? (
        <>
          <AccountHeader />
          <AccountBody />
        </>
      ) : (
        <h2>Login</h2>
      )}
    </Container>
  );
};

export default Account;
