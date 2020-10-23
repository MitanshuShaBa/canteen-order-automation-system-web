import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Info } from "@material-ui/icons";
import React from "react";
import categorylogo from "./img/3223367.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 200,
    [theme.breakpoints.down("md")]: {
      width: 150,
    },
    [theme.breakpoints.down('sm')]: {
      width: 50,
    },
  },
  media: {
    height: 140,
  },
}));

const CategoryCard = () => {
  const classes = useStyles();
  return (
    <Card className={classes.root} raised>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={categorylogo}
          title="Category Logo"
        />
        <CardContent>
          <Typography variant="h5" align="center">
            Burgers
          </Typography>
        </CardContent>
        {/* <Box py={3} px={2} className={classes.content}> */}
        {/* <Typography className={classes.content}>sgmegmol</Typography> */}
        {/* </Box> */}
      </CardActionArea>
    </Card>
  );
};

export default CategoryCard;
