import React, { Component } from "react";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { mainListItems, secondaryListItems } from "./listItems";
import IconButton from "@material-ui/core/IconButton";
import classNames from "classnames";
import store from "../../../store";

class Sidebar extends Component {
  render() {
    const screen_name = JSON.stringify(
      store.getState().auth.userProfile.screen_name
    );

    return (
      <div>
        <Divider />
        <List>{mainListItems(screen_name)}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </div>
    );
  }
}

export default Sidebar;
