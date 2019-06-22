

import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary">
      {"created by "}
      <Link color="inherit" href="https://github.com/imef-femi">
        IMEF
      </Link>
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    // minHeight: "100vh"
    paddingLeft: "30px"
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2)
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: "auto",
    backgroundColor: "white"
  }
}));

export default function StickyFooter() {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <footer className={classes.footer}>
        <Container maxWidth="md">
          <Typography variant="body1">
            {" "}
            &copy; FollowStack. {currentYear}
          </Typography>
          <MadeWithLove />
        </Container>
      </footer>
    </div>
  );
}
