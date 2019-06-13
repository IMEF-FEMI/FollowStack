import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";

import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import RegionSelect from "./modules/views/completeregSubview/RegionSelect";
import ShareSocial from "./modules/views/completeregSubview/ShareSocial";
import TermsAndCondition from "./modules/views/completeregSubview/TermsAndCondition";
import DoneOutline from "@material-ui/icons/DoneOutline";
import Spinner from "./modules/views/completeregSubview/Spinner";

import AppFooter from "../guestpages/modules/views/AppFooter";
import AppAppBar from "../guestpages/modules/views/AppAppBar";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing( 2) ,
    marginRight: theme.spacing( 2) ,
    [theme.breakpoints.up(600 + theme.spacing(2 * 2)) ]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(3) ,
    marginBottom: theme.spacing(3) ,
    padding: theme.spacing(2) ,
    [theme.breakpoints.up(600 + theme.spacing(3 * 2) )]: {
      marginTop: theme.spacing(6) ,
      marginBottom: theme.spacing(6) ,
      padding: theme.spacing(3) 
    }
  },
  stepper: {
    padding: `${theme.spacing(3) }px 0 ${theme.spacing(5) }px`
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing(3) ,
    marginLeft: theme.spacing()
  }
});

const steps = ["Select Location", "Share Links", "Accept Terms"];

class CompleteRegistration extends React.Component {
  state = {
    step: 0,
    user: {},
    location: ""
  };

  componentDidMount() {
    
    if (this.props.location.state === undefined) {
      this.props.history.push({
        pathname: "/"
      });
    } else {
      this.setState({
        user: this.props.location.state.user
      });
      this.setState({
        provider: this.props.location.state.provider
      });
      
    }
  }

  componentWillReceiveProps(props) {
    if (props.location.state === undefined) {
      props.history.push({
        pathname: "/"
      });
    } else {
      this.setState({
        user: props.location.state.user
      });
      this.setState({
        provider: props.location.state.provider
      });
    }
  }
  getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <RegionSelect
            value={this.state.location}
            nextStep={this.nextStep}
            user={this.state.user}
            onChange={this.handleCurrentCity}
          />
        );
      case 1:
        return (
          <ShareSocial
            nextStep={this.nextStep}
            prevStep={this.previousStep}
            user={this.state.user}
          />
        );
      case 2:
        return (
          <TermsAndCondition
            user={this.state.user}
            prevStep={this.previousStep}
            nextStep={this.nextStep}
            userLocation={this.state.location}
            gotoDashboard={this.gotoDashboard}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  };
  nextStep = () => {
    this.setState({
      step: this.state.step + 1
    });
  };
  handleCurrentCity = e => {
    this.setState({
      location: e.value
    });
  };
  previousStep = () => {
    this.setState({
      step: this.state.step - 1
    });
  };

  handleReset = () => {
    this.setState({
      step: 0
    });
  };

  gotoDashboard = () =>{
      setTimeout(() => {
        this.props.history.push("/dashboard");
      }, 5000);
  }

  render() {
    const { classes } = this.props;
    const { step } = this.state;

    return (
      <div
        style={{
          backgroundColor: "#2c3e50",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          height: "100%"
        }}
      >
        <AppAppBar />
        <CssBaseline />
        <main className={classes.layout}>
        <div
            style={{
              paddingTop: "15vh"
            }}
          >
          <Paper className={classes.paper}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <Typography component="h1" variant="h4" align="center">
                  Complete your Registration
                </Typography>
                <Stepper activeStep={step} className={classes.stepper}>
                  {steps.map(label => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Grid align="center">
                  <img
                    // className="rounded-circle"
                    src={this.state.user.photo}
                    alt={this.state.user.username}
                    width="150"
                    height="150"
                    style={{
                      borderRadius: "75px"
                    }}
                  />
                </Grid>

                <React.Fragment>
                  {step === steps.length ? (
                    <React.Fragment>
                      <Grid align="center">
                        <Typography variant="h5" gutterBottom>
                          Registration Complete.
                          <DoneOutline
                            style={{
                              borderColor: "#28a745"
                            }}
                          />
                        </Typography>
                        <Typography variant="subtitle1">
                          You will be redirected to your dashboard page shortly.
                        </Typography>
                        <Spinner />
                      </Grid>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>{this.getStepContent(step)}</React.Fragment>
                  )}
                </React.Fragment>
              </Grid>
            </Grid>
          </Paper>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }
}

CompleteRegistration.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(CompleteRegistration));
