import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import { connect } from "react-redux";
import axios from "axios";

import {
  onSnackbarOpen,
  onSnackbarClose,
  setSnackbarMessage,
  setSnackbarVariant
} from "../../../../../actions/snackbarAction";
import { setPoints } from "../../../../../actions/authActions";
import PeaButton from "../../components/profile/PeaButton"
import Share from "@material-ui/icons/Share";
import SvgIcon from "@material-ui/core/SvgIcon";


class ShareLinks extends Component {
  state={
    followLoading: false,
    shareLoading: false
  }
  getPoints = () => {
    const {
      onSnackbarClose,
      setSnackbarMessage,
      setSnackbarVariant,
      onSnackbarOpen,
      setPoints
    } = this.props;
    axios.get(`/api/post/share-lingk/${this.props.auth.keyInUse}`).then(res => {
      onSnackbarClose();
      setSnackbarMessage("👍 Link shared +40 points earned");
      setSnackbarVariant("success");
      onSnackbarOpen();
      setPoints(res.data.points);
      console.log(res.data)
    });
  };

  followUs = ()=>{
       const {
      onSnackbarClose,
      setSnackbarMessage,
      setSnackbarVariant,
      onSnackbarOpen,
      setPoints
    } = this.props;
    this.setState({followLoading: true})
    axios.post(`/api/post/follow-us/${this.props.auth.keyInUse}`, {userData: this.props.auth.userData}).then(res => {
    this.setState({followLoading: false})
      if (res.data.success) {
        onSnackbarClose();
        setSnackbarMessage(res.data.success);
        setSnackbarVariant("success");
        onSnackbarOpen();
        setPoints(res.data.points)
      }else if (res.data.following) {
        onSnackbarClose();
        setSnackbarMessage(res.data.following);
        setSnackbarVariant("success");
        onSnackbarOpen();
      }else if (res.data.error) {
         onSnackbarClose();
        setSnackbarMessage(res.data.error);
        setSnackbarVariant("error");
        onSnackbarOpen();
      }
    }).catch(err=>{
    this.setState({followLoading: false})
         onSnackbarClose();
        setSnackbarMessage(err);
        setSnackbarVariant("error");
        onSnackbarOpen();
    })
  }

  shareLink = () =>{
  const {
      onSnackbarClose,
      setSnackbarMessage,
      setSnackbarVariant,
      onSnackbarOpen,
      setPoints
    } = this.props;
    this.setState({shareLoading: true})
      axios.post(`/api/post/share-link/${this.props.auth.keyInUse}`, {userData: this.props.auth.userData}).then(res => {
    this.setState({shareLoading: false})

    if (res.data.success) {
       onSnackbarClose();
        setSnackbarMessage(res.data.success);
        setSnackbarVariant("success");
        onSnackbarOpen();
        setPoints(res.data.points)
      }else if (res.data.error) {
         onSnackbarClose();
        setSnackbarMessage(res.data.error);
        setSnackbarVariant("error");
        onSnackbarOpen();
      }
    }).catch(err=>{
    this.setState({shareLoading: false})
       onSnackbarClose();
        setSnackbarMessage(err);
        setSnackbarVariant("error");
        onSnackbarOpen();
    })
  }

  render() {
    const twitterIcon = (
      <SvgIcon
        style={{
          color: "rgb(28, 136, 204)"
        }}
      >
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </SvgIcon>
      )
    return (
        <Grid container justify="center" >
        <Grid item >
          <PeaButton
              color='primary'
              size={'small'}
              variant={'outlined'}
              labelExpanded={false}
              icon={!this.state.followLoading ? twitterIcon: ''}
              iconProps={{
                color: 'default',
                size: 'small',
              }}
              loading={this.state.followLoading}

              style={{ marginTop: 6 }}
              onClick={this.followUs}
            >
              { "Follow Us"}
            </PeaButton>
        </Grid>
         <Grid item >
          <PeaButton
              color='primary'
              size={'small'}
              variant={'outlined'}
              labelExpanded={false}
              icon={!this.state.shareLoading ? <Share style={{
                color: "rgb(28, 136, 204)"
              }} />: ''}
              iconProps={{
                color: 'default',
                size: 'small',
              }}
              loading={this.state.shareLoading}

              style={{ marginTop: 6 }}
              onClick={this.shareLink}
            >
              { "Share Link"}
            </PeaButton>
        </Grid>
        </Grid>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    onSnackbarOpen,
    onSnackbarClose,
    setSnackbarMessage,
    setSnackbarVariant,
    setPoints
  }
)(ShareLinks);
