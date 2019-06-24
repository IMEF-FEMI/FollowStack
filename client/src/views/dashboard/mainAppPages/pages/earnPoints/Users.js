import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider/Divider";
import List from "@material-ui/core/List/List";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import FollowButton from "./FollowButton";
import ExpandMore from "@material-ui/icons/ExpandMore";

class Users extends React.Component {
  render() {
    const { users } = this.props;
    // first ten users in the array

    return (
      <List>
        <Grid
          container
          spacing={4}
          justify="center"
          style={{
            width: 0.83 * window.innerWidth
          }}
        >
          {users.map(element => (
            <Grid
              key={element.user_id}
              item
              xs={window.innerWidth <= 500 ? 12 : 8}
            >
              <ListItem button>
                <Avatar src={element.photo} />
                <ListItemText
                  primary={element.name}
                  secondary={element.screen_name}
                />
                <FollowButton user={element} />
              </ListItem>
              <Divider />
            </Grid>
          ))}
        </Grid>
      </List>
    );
  }
}

Users.propTypes = {
  /**
   * UserArray
   */
  userArray: PropTypes.array
};
export default Users;
