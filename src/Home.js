import { Container, Typography, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { auth, db } from "./firebase";
import HomeCarousel from "./HomeCarousel";
import OrderItem from "./OrderItem";
import { useStateValue } from "./StateProvider";

const Home = () => {
  const [{ user, cart, menu }, dispatch] = useStateValue();
  let theme = useTheme();

  return (
    <Container style={{ paddingTop: "2vh" }}>
      {user && (
        <>
          <Typography
            variant="h4"
            style={{
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            Welcome {user.displayName.split(" ")[0]}!
          </Typography>
        </>
      )}
      {/* <HomeCarousel /> */}
      <div
        style={{ display: "flex", padding: 2, justifyContent: "space-evenly" }}
      >
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginTop: "4vh",
        }}
      >
        {menu.map(({ category, price, name, isAvailable }, key) => {
          if (isAvailable) {
            return (
              <OrderItem
                key={key}
                category={category}
                price={price}
                orderItem={name}
              />
            );
          }
        })}
      </div>

      <div style={{ margin: "5vh" }}></div>
    </Container>
  );
};

export default Home;
