import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider/Divider";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import FollowButton from "./FollowButton";

class Users extends React.Component {
  render() {
    const { users, currentUser } = this.props;

    return (
        <Grid
          container
          spacing={4}
          justify="center"
          style={{
            width: "95%",
            maxWidth: "95%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingTop: "50px"
          }}
        >
          {users.map(element => {
            if (element.user_id !== currentUser.userid) {
              return (
                <Grid
                  key={
                    element.user_id +
                    `${Math.random() * 5} ${Math.random() * 20}`
                  }
                  item
                  xs={window.innerWidth <= 500 ? 12 : 8}
                >
                  <ListItem button>
                    <Avatar src={element.photo} />
                    <ListItemText
                      primary={element.name}
                      secondary={element.screen_name}
                      style={{
                        maxWidth: 0.45 * window.innerWidth
                      }}
                    />
                    <FollowButton user={element} context={this.props.context}/>
                  </ListItem>
                  <Divider />
                </Grid>
              );
            } else {
              return null;
            }
          })}
        </Grid>
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
