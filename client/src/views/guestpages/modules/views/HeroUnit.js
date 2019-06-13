
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ExpandMore from "@material-ui/icons/ExpandMore";

export const HeroUnit = props => {
  const { classes } = props;

  const scrollToContent = () => {
    console.log("called");
    props.contentRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  };

  return (
    <React.Fragment>
      <div className={classes.bgOverlay}>
        <main className={classes.main}>
          <div className={classes.heroContent}>
            <Typography
              variant="h2"
              align="center"
              color="textPrimary"
              className={classes.heroMainTxt}
              gutterBottom
            >
              FollowStack For Twitter{" "}
              <i
                className="fab fa-twitter"
                style={{
                  color: "#1c88cc"
                }}
              />
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              className={classes.heroSecText}
              paragraph
            >
              FollowStack is a simple Twitter app that helps you gain more
              Followers, more likes (Favs){"  "}
              <i
                className="fas fa-heart"
                style={{
                  color: "#ff3366"
                }}
              />
              {"  "}
              and more Retweets {"  "}
              <i
                className="fas fa-retweet"
                style={{
                  color: "#17bf63"
                }}
              />{" "}
              on your twitter account
            </Typography>
            <div>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    to={{
                      pathname: "/sign-up"
                    }}
                    component={Link}
                    variant="outlined"
                    className={classes.heroButtons}
                    style={{
                      textTransform: "none"
                    }}
                  >
                    Get Started
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <ExpandMore
                    onClick={scrollToContent}
                    className={classes.scrollDownIcon}
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

HeroUnit.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  main: {
    backgroundColor: "rgb(0,0,0)",
    position: "relative",
    height: "100vh",
    background:
      "url(https://cdn.pixabay.com/photo/2019/05/11/09/14/night-4195327_960_720.jpg)",
    backgroundSize: "cover"
  },

  "@keyframes bg-animation": {
    "0%": {
      animationTimingFunction: "ease-in",
      opacity: 0
    },
    "10%": {
      animationTimingFunction: "ease-out",
      opacity: 1
    },
    "20%": {
      opacity: 1
    },
    "25%": {
      opacity: 0
    },
    "100%": {
      opacity: 0
    }
  },
  icon: {
    marginRight: theme.spacing( 2)
  },
  heroContent: {
    width: "90%",
    maxWidth: 600,
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -8px)",
    margin: "0 auto",
    "& > *": {
      color: "#fff"
    },
    [theme.breakpoints.up("xl")]: {
      top: "65%"
    }
  },
  heroMainTxt: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "2.75rem",
      marginBottom: "8px"
    }
  },
  heroSecText: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem"
    }
  },
  heroButtons: {
    color: "#fff",
    border: "1px solid #fff"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing( 3),
    marginRight: theme.spacing( 3),
    [theme.breakpoints.up(1100 + theme.spacing(3 * 2))]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  scrollDownIcon: {
    fontSize: "60px",

    color: "#fff",
    cursor: "pointer",
    // transform: "translateX(-50%) rotateZ(-90deg)",
    animation: `sd-animation 2500ms ${
      theme.transitions.easing.easeInOut
    } 200ms infinite`
  },
  "@keyframes sd-animation": {
    "0%": {
      transform: "translateX(-50%) rotateZ(-90deg)",
      opacity: 0
    },
    "50%": {
      opacity: 1
    },
    "100%": {
      transform: "translate(-50%, 20px) rotateZ(-90deg)",
      opacity: 0
    }
  }
});

export default withStyles(styles)(HeroUnit);
