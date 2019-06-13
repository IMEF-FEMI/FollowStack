import React from "react";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import  useMediaQuery  from "@material-ui/core/useMediaQuery";
import atoms from "../../components/atoms";
import molecules from "../../components/molecules";
import PersonAddDisabled from "@material-ui/icons/PersonAddDisabled";
// import Button from "@material-ui/core/Button";
import theme from "../../theme/instapaper/theme";
import withTheme from "./withTheme";
import CountdownTimer from "react-component-countdown-timer";
import Followed from "./Followed";
import FollowedBack from "./FollowedBack";
import UnFollowed from "./UnFollowed";
import { connect } from "react-redux";
import PropTypes from "prop-types";
const { Icon, Typography, Button } = atoms;
const { Tabs, Tab } = molecules;

function Main(props) {
  const [tabIndex, setTabIndex] = React.useState(1);
  const upSm = useMediaQuery(theme.breakpoints.up("sm"), {
    defaultMatches: true
  });

  const { hasFollowingsTime, isUnFollowing } = props.usersOnline;

  const beginUnfollow = () => {
    setTabIndex(3);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <div mb="44px">
        <Typography
          variant="h6"
          gutterBottom
          align="center"
          style={{ paddingTop: "30px" }} 
        >
          Due to twitter follow/ unfollow restrictions, we couldnt make this
          process an automated one. we will however get you a list of users
          that are online. so you can manually follow them and we'll keep track
          of those that follow back and those that dont so that you can easily
          unfollow them
        </Typography>
      </div>
      <Grid
        container
        style={{
          maxWidth: window.innerWidth <= 320 && "265px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <Tabs
          value={tabIndex}
          centered
          onChange={(event, value) => {
            setTabIndex(value);
          }}
          style={{
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <Tab value={1} label="Follow" icon={<Icon>offline_pin</Icon>} />
          <Tab
            value={2}
            label="Followed Back"
            icon={<Icon>verified_user</Icon>}
          />
          <Tab value={3} label="Unfollow" icon={<Icon>cancel</Icon>} />
        </Tabs>
      </Grid>
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
              Time Till UnFollow!!
            </Typography>
          </Grid>
          <Grid container justify="center">
            <Typography align="center" variant="caption" gutterBottom>
              Kindly note that only accounts that refused to follow back will be
              unfollowed
            </Typography>
          </Grid>
        </div>
      )}
      {hasFollowingsTime < 0 && isUnFollowing === false && tabIndex !== 3 && (
        <Grid container justify="center">
          <Button variant="outlined" fullWidth={!upSm} onClick={beginUnfollow}>
            Begin UnFollow
            <PersonAddDisabled /> 
          </Button>
        </Grid>
      )}
    </React.Fragment>
  );
}

Main.propTypes = {
  usersOnline: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  usersOnline: state.usersOnline
});
export default connect(
  mapStateToProps
)(withTheme(theme)(Main));
