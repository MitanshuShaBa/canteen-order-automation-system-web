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
    width: 170,
  },
  media: {
    height: 140,
  },
}));

const CategoryCard = ({
  title = "Category",
  imageURL = categorylogo,
  onCategory,
}) => {
  const classes = useStyles();
  const handleCategoryClick = () => {
    onCategory(title);
  };
  return (
    <Card className={classes.root} raised>
      <CardActionArea onClick={handleCategoryClick}>
        <CardMedia className={classes.media} image={imageURL} title={title} />
        <CardContent>
          <Typography variant="h5" align="center">
            {title}
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
