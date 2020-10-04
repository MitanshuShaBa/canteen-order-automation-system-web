import React from "react";
import Home from "./Home";

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

let routes = [
  {
    path: "/about",
    component: About,
  },
  {
    path: "/users",
    component: Users,
  },
  {
    path: "/",
    component: Home,
  },
];

export default routes;
