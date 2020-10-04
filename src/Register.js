import React, { useState } from "react";
import { Button, Container, Input, Typography } from "@material-ui/core";
import { auth, provider } from "./firebase";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    number: 0,
    password: "",
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
    auth
      .createUserWithEmailAndPassword(state.email, state.password)
      .then((auth) => {
        console.log("logged in");
      })
      .catch((e) => alert(e.message));
  };

  const handleSubmitGoogle = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(provider)
      .then((auth) => {
        console.log("logged in");
      })
      .catch((e) => alert(e.message));
  };

  return (
    <Container maxWidth="sm">
      <div style={{ marginTop: "5vh" }}></div>
      <Typography variant="h3" style={{ alignItems: "center" }}>
        Create Account
      </Typography>
      <form autoComplete="off">
        <Input
          name="name"
          placeholder="Name"
          fullWidth
          value={state.name}
          onChange={handleChange}
        />
        <Input
          name="email"
          placeholder="Email"
          fullWidth
          type="email"
          value={state.email}
          onChange={handleChange}
        />
        <Input
          name="number"
          placeholder="Phone"
          fullWidth
          type="number"
          value={state.number}
          onChange={handleChange}
        />
        <Input
          name="password"
          placeholder="Password"
          fullWidth
          type="password"
          value={state.password}
          onChange={handleChange}
        />
        <Button type="submit" onClick={handleSubmit}>
          Register
        </Button>
        <Button type="submit" onClick={handleSubmitGoogle}>
          Register With Google
        </Button>
      </form>
    </Container>
  );
};

export default Register;
