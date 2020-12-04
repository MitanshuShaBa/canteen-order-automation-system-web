import React from "react";
import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { useStateValue } from "../StateProvider";

const AccountHeader = () => {
  const theme = useTheme();
  const smUP = useMediaQuery(theme.breakpoints.up("sm"));
  const mdUP = useMediaQuery(theme.breakpoints.up("md"));
  const [{ user }] = useStateValue();

  return (
    <div>
      <Grid container>
        <Grid container spacing={4}>
          <Grid container item md={2} sm={12} justify="center">
            <img
              src={user.photoURL}
              alt="profilePhoto"
              height="100vh"
              style={{ borderRadius: "50%" }}
            />
          </Grid>
          <Grid
            container
            item
            md={10}
            // @ts-ignore
            justify={smUP ? "flex-start" : "center"}
            alignContent="center"
          >
            <Grid item xs={12}>
              <Typography align={mdUP ? "left" : "center"} variant="h4">
                {user.displayName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                style={{ textTransform: "none" }}
                align={mdUP ? "left" : "center"}
              >
                {user.providerData[0].email}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AccountHeader;
