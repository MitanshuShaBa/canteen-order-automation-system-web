import { Container } from "@material-ui/core";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const HomeCarousel = () => {
  const style = {
    backgroundColor: "blue",
    alignItems:'center'
  };
  return (
    <Container maxWidth="md">
      <AutoPlaySwipeableViews
        enableMouseEvents
        // style={{padding: '0 30px'}}
        slideStyle={{ padding: "0 10px " }}
      >
        {/* <div style={{ ...style }}> */}
        
          <img  src="https://image.freepik.com/free-photo/front-view-male-holding-tray-with-burger-fries_23-2148678809.jpg" />
        {/* </div> */}
        {/* <div style={{ ...style }}> */}
          <img src="https://image.freepik.com/free-photo/side-view-french-fries-with-seasoning_141793-4899.jpg" />
        {/* </div> */}
        {/* <div style={{ ...style }}> */}
          <img src="https://image.freepik.com/free-photo/front-view-chicken-pizza-with-bell-red-yellow-pepper-with-yellow-cherry-tomatoes_141793-4592.jpg" />
        {/* </div> */}
      </AutoPlaySwipeableViews>
    </Container>
  );
};

export default HomeCarousel;
