import React from "react";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Online from "./Online";
import { connect } from "react-redux";
import theme from "../../components/profile/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function Main(props) {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <div mb="44px">
          <Typography
            component="h2"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
            style={{
              paddingTop: "30px"
            }}
          >
            Online Users
          </Typography>
          <Typography
            component="h5"
            variant="h5"
            align="center"
            color="textPrimary"
            gutterBottom
            style={
              {
                // paddingTop: "30px"
              }
            }
          >
            Note: Follow Backs are Instant
          </Typography>
          <Grid container justify="center">
            <Grid item xs={12} sm={10}>
              <div style={{ paddingBottom: "20px" }}>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography align="center" color="textPrimary" gutterBottom>
                      Read More
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    {/* <Typography align="center" color="textPrimary" gutterBottom>
                  Follows are limited to 20 per day
                  </Typography> */}
                    <ul>
                      <li>
                        For every person you follow, you get an instant follow
                        back
                      </li>
                      <li>
                        Unfollowing users is highly discouraged as you you will
                        be unfollowed as well
                      </li>
                      <strong>In order to Avoid bieng banned by twitter</strong>
                      <li>You can only follow up to 15 people per hour</li>
                      <li>
                        And up to 50 people can follow you a day (this is
                        different from follow Back)
                      </li>

                      <strong>
                        FollowStack not only help you grow your audience{" "}
                      </strong>
                      <strong>
                        It also helps you get more engagement on your tweets...
                        See shared tweet Section
                      </strong>
                    </ul>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            </Grid>
          </Grid>
        </div>
        <Grid
          container
          style={{
            maxWidth: window.innerWidth <= 320 && "265px",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        ></Grid>
        {<Online />}
      </React.Fragment>
    </ThemeProvider>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(Main);
