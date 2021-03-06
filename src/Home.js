import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import OrderItem from "./OrderItem";
import { useStateValue } from "./StateProvider";
import SearchIcon from "@material-ui/icons/Search";
import { db } from "./firebase";

const Home = () => {
  const [{ user, menu }] = useStateValue();
  let theme = useTheme();
  const [searchItem, setSearchItem] = useState("");
  const [menuFiltered, setMenuFiltered] = useState(menu);
  const [categories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState(false);

  useEffect(() => {
    const unsubscribe = db.collection("categories").onSnapshot((snapshot) => {
      const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categories);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (categorySelected === false) {
      setMenuFiltered(menu);
    }
  }, [menu, categorySelected]);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line
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
      (menuItem) => menuItem.category.toLowerCase() === category.toLowerCase()
    );
    setMenuFiltered(filtered);
    setCategorySelected(true);
  };

  return (
    <Grid style={{ padding: "2vh" }}>
      {user && (
        <Grid item>
          <Typography
            variant="h4"
            style={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              marginBottom: "2vh",
            }}
          >
            Welcome {user.displayName.split(" ")[0]}!
          </Typography>
        </Grid>
      )}
      {/* <HomeCarousel /> */}
      <div>
        <Grid container item justify="center" spacing={2}>
          {categories.map((category) => (
            <Grid
              container
              item
              xs={6}
              sm={3}
              justify="center"
              key={category.name}
            >
              <Grid item>
                <CategoryCard
                  title={category.name}
                  imageURL={
                    category?.image_url
                      ? category.image_url
                      : undefined
                  }
                  onCategory={handleCategory}
                />
              </Grid>
            </Grid>
          ))}
          {/* <Grid container item xs={6} sm={3} justify="center">
            <Grid item>
              <CategoryCard
                title="Snacks"
                imageURL="https://storage.googleapis.com/kjsieit-canteen.appspot.com/menu_items/snacks/sandwich.jpeg"
                onCategory={handleCategory}
              />
            </Grid>
          </Grid>
          <Grid container item xs={6} sm={3} justify="center">
            <Grid item>
              <CategoryCard
                title="Chinese"
                imageURL="https://storage.googleapis.com/kjsieit-canteen.appspot.com/menu_items/chinese/noodles.jpeg"
                onCategory={handleCategory}
              />
            </Grid>
          </Grid>
          <Grid container item xs={6} sm={3} justify="center">
            <Grid item>
              <CategoryCard
                title="South Indian"
                imageURL="https://storage.googleapis.com/kjsieit-canteen.appspot.com/menu_items/south_indian/idli.jpg"
                onCategory={handleCategory}
              />
            </Grid>
          </Grid>
          <Grid container item xs={6} sm={3} justify="center">
            <Grid item>
              <CategoryCard
                title="Beverages"
                imageURL="https://storage.googleapis.com/kjsieit-canteen.appspot.com/menu_items/beverages/coffee.jpg"
                onCategory={handleCategory}
              />
            </Grid>
          </Grid> */}
        </Grid>
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
          // eslint-disable-next-line
          (
            { category, price, name, isAvailable, image_url, estimated_time },
            key
          ) => {
            if (isAvailable) {
              return (
                <OrderItem
                  key={key}
                  category={category}
                  price={price}
                  orderItem={name}
                  image={image_url}
                  estimatedTime={estimated_time}
                />
              );
            } else {
              return null;
            }
          }
        )}
      </div>

      <div style={{ margin: "5vh" }}></div>
    </Grid>
  );
};

export default Home;
