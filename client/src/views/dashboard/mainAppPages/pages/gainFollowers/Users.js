import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider/Divider";
import List from "@material-ui/core/List/List";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

class Users extends React.Component {
  state = {
    showAll: false
  };
  render() {
    const { users } = this.props;
    // first ten users in the array
    var firstTen = users.slice(0, 10);
    const { useContext } = this.props;

    var button = null;
    switch (useContext.context) {
      case "Followed":
        button = (
          <Button
            color="primary"
            size="medium"
            variant="contained"
            style={{ borderRadius: "100px" }}
          >
            {useContext.context}
          </Button>
        );
        break;
      case "Followed Back":
        button = (
          <Button
            color="primary"
            size="medium"
            variant="contained"
            style={{
              borderRadius: "100px",
              backgroundColor: "#28a745",
              borderColor: "#28a745"
            }}
          >
            {useContext.context}
          </Button>
        );
        break;

      case "UnFollowed":
        button = (
          <Button
            color="secondary"
            size="medium"
            variant="contained"
            style={{
              borderRadius: "100px",
              backgroundColor: "#f50057",
              borderColor: "#f50057"
            }}
          >
            {useContext.context}
          </Button>
        );
        break;
      default:
        button = (
          <Button
            color="default"
            size="medium"
            variant="contained"
            style={{ borderRadius: "100px" }}
          >
            {useContext.context}
          </Button>
        );
        break;
    }

    return (
      <List>
        {!this.state.showAll && (
          <div>
            <Grid container spacing={16} justify="center">
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
                    {button}
                  </ListItem>
                  <Divider />
                </Grid>
              ))}
            </Grid>
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
              </ListItemText>
            </ListItem>
          </div>
        )}

        {this.state.showAll && (
          <div>
            <Grid container spacing={16} justify="center">
              {users.map(element => (
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
                    {button}
                  </ListItem>
                  <Divider />
                </Grid>
              ))}
            </Grid>
          </div>
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
