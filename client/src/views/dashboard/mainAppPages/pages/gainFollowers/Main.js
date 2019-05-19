import React from "react";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import atoms from "../../components/atoms";
import molecules from "../../components/molecules";
import PersonAddDisabled from "@material-ui/icons/PersonAddDisabled";
import Button from "@material-ui/core/Button";
import theme from "../../theme/instapaper/theme";
import withTheme from "./withTheme";
import { unstable_Box as Box } from "@material-ui/core/Box";
import CountdownTimer from "react-component-countdown-timer";
import Followed from "./Followed";
import FollowedBack from "./FollowedBack";
import UnFollowed from "./UnFollowed";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  beginUnFollowAction,
  gainFollowersAction,
  checkTotalGainedAction
} from "../../../../../actions/gainFollowersAction";
const { Avatar, Icon, Typography } = atoms;
const { Tabs, Tab } = molecules;

function Main(props) {
  const [tabIndex, setTabIndex] = React.useState(1);
  const upSm = useMediaQuery(theme.breakpoints.up("sm"), {
    defaultMatches: true
  });

  const {
    hasFollowingsTime,
    isUnFollowing,
    stats,
    totalGained
  } = props.gainFollowers;
  const { userProfile } = props.auth;

  const beginUnfollow = () => {
    // start unfollowing, show unfollowed Tab
    props.beginUnFollowAction(props.auth.userData, props.auth.keyInUse);
    // clear following list
    
    setTabIndex(3);
  };
  React.useEffect(() => {
    props.checkTotalGainedAction(props.auth.user.userid);

    console.log("gain followers main mounted");
  }, []); // passing an empty array as second argument triggers the callback
  // in useEffect only after the initial render thus replicating
  //  `componentDidMount` lifecycle behaviour

  return (
    <React.Fragment>
      <CssBaseline />
      <Box mb="44px">
        <Grid
          container
          style={{
            paddingTop: "80px"
          }}
        >
          <Grid item xs={4}>
            <Avatar
              ultraLarge={upSm}
              medium={!upSm}
              style={{ margin: "auto" }}
              src={userProfile.photo}
            />
          </Grid>
          <Grid item xs={8}>
            <Grid container alignItems="center">
              <Typography variant="subtitle1" bold>
                {userProfile.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                {userProfile.screen_name}
              </Typography>
            </Grid>
            <Box mb="20px">
              <Grid container spacing={40}>
                <Grid item>
                  <Typography variant="subtitle1">
                    <b>{userProfile.followers}</b> followers
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    <b>{userProfile.following}</b> following
                  </Typography>
                </Grid>
                <Grid item>
                  {totalGained !== 0 && (
                    <Typography variant="subtitle1">
                      <b> {`${totalGained} `}</b>Followers Gained
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
            <Typography variant="subtitle1">
              {userProfile.description}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Tabs
        value={tabIndex}
        centered
        onChange={(event, value) => {
          setTabIndex(value);
        }}
      >
        <Tab value={1} label="Followed" icon={<Icon>offline_pin</Icon>} />
        <Tab
          value={2}
          label="Followed Back"
          icon={<Icon>verified_user</Icon>}
        />
        <Tab value={3} label="Unfollowed" icon={<Icon>cancel</Icon>} />
      </Tabs>
      {tabIndex === 1 && <Followed />}
      {tabIndex === 2 && <FollowedBack />}
      {tabIndex === 3 && <UnFollowed />}

      {!(hasFollowingsTime <= 0) && (
        <div>
          <Grid container justify="center">
            <CountdownTimer count={hasFollowingsTime / 1000} border hideDay />
          </Grid>
          <Grid container justify="center">
            <Typography variant="h6" gutterBottom>
              Time Until UnFollow!!
            </Typography>
          </Grid>
          <Grid container justify="center">
            <Typography variant="caption" gutterBottom>
              Kindly note that only accounts that refused to follow back will be
              unfollowed
            </Typography>
          </Grid>
        </div>
      )}
      {hasFollowingsTime < 0 && isUnFollowing === false && !stats.gained && (
        <Grid container justify="center">
          <Button
            variant="contained"
            color="secondary"
            size="large"
            style={{
              borderColor: "#f50057"
            }}
            onClick={beginUnfollow}
          >
            Start UnFollowing
            <PersonAddDisabled />
          </Button>
        </Grid>
      )}
    </React.Fragment>
  );
}

Main.propTypes = {
  beginUnFollowAction: PropTypes.func.isRequired,
  gainFollowersAction: PropTypes.func.isRequired,
  gainFollowers: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  gainFollowers: state.gainFollowers
});
export default connect(
  mapStateToProps,
  {
    beginUnFollowAction,
    gainFollowersAction,
    checkTotalGainedAction
  }
)(withTheme(theme)(Main));
