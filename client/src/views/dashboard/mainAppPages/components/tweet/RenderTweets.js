import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Launch from "@material-ui/icons/Launch";
import Tooltip from "@material-ui/core/Tooltip";
import Tweet from "./Tweet/Tweet";

class Profile extends Component {
  render() {
    const { classes } = this.props;
    const data = this.props.pages;
    const linkProps = { target: "_blank", rel: "noreferrer" };
    return (
      <Grid
        className={classes.gridContainer}
        classes={{ "spacing-xs-24": classes.spacingXs24 }}
        direction="row"
        wrap="wrap"
        justify={"flex-start"}
        container
        spacing={24}
      >
        {data.map(item => (
          <Grid
            item
            key={item.id}
            classes={{
              item: classes.item
            }}
            xs={12}
            sm={6}
            md={6}
            lg={4}
            xl={3}
          >
            <Card className={classes.card}>
              <CardHeader
                avatar={
                  <Avatar aria-label="Recipe" className={classes.avatar}>
                    <img src={`${item.user.profile_image_url}`} />
                  </Avatar>
                }
                action={
                  <div>
                    <Tooltip title="Add to Tweet Feeds" aria-label="Add">
                      <IconButton>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove from Tweet Feeds" aria-label="Add">
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <a
                      href={`http://twitter.com/${
                        item.user.screen_name
                      }/status/${item.id_str}`}
                      {...linkProps}
                    >
                      <Tooltip title="open in new tab" aria-label="Open">
                        <IconButton>
                          <Launch />
                        </IconButton>
                      </Tooltip>
                    </a>
                  </div>
                }
                // action={
                //   <Tooltip title="Remove from Tweets Feed" aria-label="Add">
                //     <IconButton>
                //       <DeleteIcon />
                //     </IconButton>
                //   </Tooltip>
                // }
                title={`${item.user.name}`}
                subheader={`@${item.user.screen_name}`}
              />
              <Tweet data={item} linkProps={linkProps} />
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }
}
const styles = theme => ({
  menuContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // add with of icon button as padding to center search
    paddingRight: "48px",
    zIndex: 1000
  },
  gridContainer: {
    minHeight: "100vh",
    backgroundColor: "#2c3e50"
  },
  spacingXs24: {
    width: "100%",
    margin: 0
  },
  card: {
    maxWidth: 400,
    // maxHeight: "370px",
    margin: `${theme.spacing.unit * 3}px auto`
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    cursor: "pointer"
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  profileHeaderRoot: {
    padding: `${theme.spacing.unit}px`,
    marginBottom: `${theme.spacing.unit}px`
  },
  profileHeaderAvatarContainer: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },
  profileHeaderUserText: {
    margin: 0
  },
  aTag: {
    color: "inherit",
    textDecoration: "none"
  },
  circularProgress: {
    margin: "16px auto",
    display: "block"
  },
  noResults: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  noResultsText: {
    marginTop: `${theme.spacing.unit * 2}px`
  },
  goBackBtn: {
    textTransform: "capitalize"
  },
  // Adds Vertical Space to avoid jolting up when HeroUnit displayed and switching context
  verticalSpace: {
    height: "100vh"
  }
});

Profile.propTypes = {
  gainFollowers: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  gainFollowers: state.gainFollowers
});
export default connect(mapStateToProps)(withStyles(styles)(Profile));
