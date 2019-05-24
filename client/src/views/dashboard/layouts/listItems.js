import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ExitToApp from "@material-ui/icons/ExitToApp";
import { Link } from "react-router-dom";
import store from "../../../store";

export const mainListItems = screen_name => {
  // console.log("screen_name ", screen_name);

  const n = store.getState().auth.userProfile.screen_name.slice(1);
  const name =
    store
      .getState()
      .auth.userProfile.screen_name.charAt(0)
      .toUpperCase() + n;

  return (
    <div>
      <Link to="/dashboard" style={{ textDecoration: "none" }}>
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </Link>

      <Link to="/gain-followers" style={{ textDecoration: "none" }}>
        <ListItem button>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Gain Followers" />
        </ListItem>
      </Link>
      <Link
        to={`/${store.getState().auth.userProfile.screen_name}`}
        style={{ textDecoration: "none" }}
      >
        <ListItem button>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItem>
      </Link>
    </div>
  );
};

export const secondaryListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <ExitToApp />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItem>
  </div>
);
