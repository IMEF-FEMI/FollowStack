import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import SvgIcon from "@material-ui/core/SvgIcon";
import { Link } from "react-router-dom";
import store from "../../../store";

export const mainListItems = screen_name => {

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
      <Link to="/tweets" style={{ textDecoration: "none" }}>
        <ListItem>
          <ListItemIcon>
            <SvgIcon>
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="View Tweets" />
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
        <PowerSettingsNew />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItem>
  </div>
);
