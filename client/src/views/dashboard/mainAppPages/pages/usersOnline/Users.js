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
  state = {
    showAll: false
  };
  render() {
    const { users } = this.props;
    // first ten users in the array
    var firstTen = users.slice(0, 10);
    const { useContext } = this.props;

    return (
      <List>
        {useContext.context === "Followed Back" && (
          <Typography style={{ textAlign: "center" }}>
            Users Following back
          </Typography>
        )}
        {useContext.context === "UnFollowed" && (
          <Typography style={{ textAlign: "center" }}>
            Users Not Following back
          </Typography>
        )}
        {!this.state.showAll && (
          <div>
            <Grid
              container
              spacing={16}
              justify="center"
              style={{
                width: 0.82 * window.innerWidth
              }}
            >
              {firstTen.map(element => (
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
                    />
                    <FollowButton context={useContext.context} user={element} />
                  </ListItem>
                  <Divider />
                </Grid>
              ))}
            </Grid>
            {users.length > 10 && (
              <ListItem button>
                <ListItemText>
                  <Typography
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      this.setState({ showAll: true });
                    }}
                  >
                    Show All
                  </Typography>
                  <Typography
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      this.setState({ showAll: true });
                    }}
                  >
                    <ExpandMore />
                  </Typography>
                </ListItemText>
              </ListItem>
            )}
          </div>
        )}

        {this.state.showAll && (
          <Grid
            container
            spacing={16}
            justify="center"
            style={{
              width: 0.83 * window.innerWidth
            }}
          >
            {users.map(element => (
              <Grid
                key={
                  element.user_id + `${Math.random() * 5} ${Math.random() * 20}`
                }
                item
                xs={window.innerWidth <= 500 ? 12 : 8}
              >
                <ListItem button>
                  <Avatar src={element.photo} />
                  <ListItemText
                    primary={element.name}
                    secondary={element.screen_name}
                  />
                  <FollowButton context={useContext.context} user={element} />
                </ListItem>
                <Divider />
              </Grid>
            ))}
          </Grid>
        )}
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
