import {
  Button,
  Container,
  Input,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { auth, db } from "./firebase";
import HomeCarousel from "./HomeCarousel";
import OrderItem from "./OrderItem";
import { useStateValue } from "./StateProvider";
import SearchIcon from "@material-ui/icons/Search";

const Home = () => {
  const [{ user, cart, menu }, dispatch] = useStateValue();
  let theme = useTheme();
  const [searchItem, setSearchItem] = useState("");
  const [menuFiltered, setMenuFiltered] = useState(menu);
  const [categorySelected, setCategorySelected] = useState(false);

  useEffect(() => {
    if (categorySelected == false) {
      setMenuFiltered(menu);
    }
  }, [menu, categorySelected]);

  useEffect(() => {
    handleSearch();
  }, [searchItem]);

  const handleSearch = () => {
    // console.log("search", searchItem);[{menu1},{menu2}]
    let filtered;
    filtered = menu.filter((menuItem) =>
      menuItem.name.toLowerCase().includes(searchItem.toLowerCase())
    );
    setMenuFiltered(filtered);
  };

  const handleCategory = (category) => {
    let filtered;
    filtered = menu.filter(
      (menuItem) => menuItem.category.toLowerCase() == category.toLowerCase()
    );
    setMenuFiltered(filtered);
    setCategorySelected(true);
  };

  return (
    <Container style={{ paddingTop: "2vh" }}>
      {user && (
        <>
          <Typography
            variant="h4"
            style={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              marginBottom: "2vh",
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
        <CategoryCard
          title="Snacks"
          imageURL="https://storage.googleapis.com/kjsieit-canteen.appspot.com/menu_items/snacks/sandwich.jpeg"
          onCategory={handleCategory}
        />
        <CategoryCard
          title="Chinese"
          imageURL="https://storage.googleapis.com/kjsieit-canteen.appspot.com/menu_items/chinese/noodles.jpeg"
          onCategory={handleCategory}
        />
        <CategoryCard
          title="South Indian"
          imageURL="https://storage.googleapis.com/kjsieit-canteen.appspot.com/menu_items/south_indian/idli.jpg"
          onCategory={handleCategory}
        />
        <CategoryCard
          title="Beverages"
          imageURL="https://storage.googleapis.com/kjsieit-canteen.appspot.com/menu_items/beverages/pepsi.jpg"
          onCategory={handleCategory}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          style={{ marginTop: "2vh" }}
          id="filled-search"
          color="secondary"
          type="search"
          label="Search"
          variant="filled"
          onChange={(e) => {
            setSearchItem(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {categorySelected && (
          <Button
            style={{ marginTop: "2vh", marginLeft: "1vh" }}
            variant="contained"
            color="secondary"
            onClick={() => setCategorySelected(false)}
          >
            Clear Selection
          </Button>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginTop: "4vh",
        }}
      >
        {menuFiltered.map(
          ({ category, price, name, isAvailable, image_url }, key) => {
            if (isAvailable) {
              return (
                <OrderItem
                  key={key}
                  category={category}
                  price={price}
                  orderItem={name}
                  image={image_url}
                />
              );
            }
          }
        )}
      </div>

      <div style={{ margin: "5vh" }}></div>
    </Container>
  );
};

export default Home;
