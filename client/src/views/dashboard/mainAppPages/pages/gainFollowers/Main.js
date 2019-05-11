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
  showFollowedTabAction
} from "../../../../../actions/gainFollowersAction";

const { Avatar, Icon, Typography } = atoms;
const { Tabs, Tab } = molecules;

function Main(props) {
  const [tabIndex, setTabIndex] = React.useState(1);
  const upSm = useMediaQuery(theme.breakpoints.up("sm"), {
    defaultMatches: true
  });

  const { hasFollowingsTime, showFollowedTab, isUnFollowing } = props.gainFollowers;
  const beginUnfollow = () => {
    // start unfollowing, show unfollowed Tab, closeFollowed Tab
    props.beginUnFollowAction(props.auth.userData);
    setTabIndex(3);
    props.showFollowedTabAction(false);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Box mb="44px">
        <Grid container>
          <Grid item xs={4}>
            <Avatar
              ultraLarge={upSm}
              medium={!upSm}
              style={{ margin: "auto" }}
              src="https://cc-media-foxit.fichub.com/image/fox-it-mondofox/e8c0f288-781d-4d0b-98ad-fd169782b53b/scene-sottacqua-per-i-sequel-di-avatar-maxw-654.jpg"
            />
          </Grid>
          <Grid item xs={8}>
            <Box clone mb="20px">
              <Grid container alignItems="center">
                <Typography component="h1" variant="h4" lightWeight>
                  siriwatknp
                </Typography>
              </Grid>
            </Box>
            <Box mb="20px">
              <Grid container spacing={40}>
                <Grid item>
                  <Typography variant="subtitle1">
                    <b>132</b> posts
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    <b>325</b> followers
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    <b>260</b> following
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Typography variant="subtitle1" bold>
              Siriwat Kunaporn
            </Typography>
            <Typography variant="subtitle1">
              Bangkok Christian College
            </Typography>
            <Typography variant="subtitle1">CU intania 96.</Typography>
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
        {showFollowedTab === true && (
          <Tab value={1} label="Followed" icon={<Icon>offline_pin</Icon>} />
        )}
        <Tab
          value={2}
          label="Followed Back"
          icon={<Icon>verified_user</Icon>}
        />
        {showFollowedTab === false && (
          <Tab value={3} label="Unfollowed" icon={<Icon>cancel</Icon>} />
        )}
      </Tabs>
      {tabIndex === 1 && showFollowedTab === true && <Followed />}
      {tabIndex === 2 && <FollowedBack />}
      {tabIndex === 3 && showFollowedTab === false && <UnFollowed />}

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
      {hasFollowingsTime < 0 && isUnFollowing === false && (
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
  showFollowedTabAction: PropTypes.func.isRequired,
  gainFollowersAction: PropTypes.func.isRequired,
  gainFollowers: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  gainFollowers: state.gainFollowers
});
export default connect(
  mapStateToProps,
  { beginUnFollowAction, gainFollowersAction, showFollowedTabAction }
)(withTheme(theme)(Main));
// export default withRouter(connect()(withStyles(styles)(FirstPage)))
