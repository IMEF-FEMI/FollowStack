import React from "react";
import PropTypes from "prop-types";
import Snackbar from "@material-ui/core/Snackbar";
import withStyles from "@material-ui/core/styles/withStyles";
import { onSnackbarClose } from "../../../actions/snackbarAction";
import { connect } from "react-redux";
import MySnackbarContentWrapper from "./MySnackbarContentWrapper";

const styles = theme => ({
  margin: {
    margin: theme.spacing()
  }
});

class CustomSnackbar extends React.Component {
  render() {
    const {
      snackbarOpen,
      vertical,
      horizontal,
      snackbarVariant,
      snackbarMessage
    } = this.props.snackbar;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: vertical ? vertical : "top",
            horizontal: horizontal ? horizontal : "right"
          }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={this.props.onSnackbarClose}
        >
          <MySnackbarContentWrapper
            onClose={this.props.onSnackbarClose}
            variant={snackbarVariant}
            message={snackbarMessage}
          />
        </Snackbar>
      </div>
    );
  }
}

CustomSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  snackbar: state.snackbar
});
export default connect(
  mapStateToProps,
  { onSnackbarClose }
)(withStyles(styles)(CustomSnackbar));
