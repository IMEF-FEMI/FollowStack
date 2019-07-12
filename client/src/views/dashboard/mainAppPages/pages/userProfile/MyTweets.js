import React, {
    Component
} from "react"
import PropTypes from "prop-types";
import {
    connect
} from 'react-redux'
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import RenderProfileTweets from "../../components/tweet/RenderProfileTweets";
import {
    onScroll
} from "../../components/tweet/utils";
import MainPageLoader from "../../components/loaders/MainPageLoader";
import axios from 'axios'
import {
    initialFetchAction,
    fetchNextAction
} from "../../../../../actions/myProfileActions";
class MyTweets extends Component {
    constructor() {
        super();
        this.signal = axios.CancelToken.source();
        this.onScroll = onScroll.call(this, this.fetchNextPage);
        this.topTweetRef = React.createRef();
    }
    scrollToTop = () => {
        this.topTweetRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        });
    };
    fetchNextPage = async () => {
        const {
            auth,
            myProfile,
            fetchNextAction
        } = this.props;
        if (myProfile.initialFetch || myProfile.isFetching || !myProfile.hasMore) {
            return;
        }
        //   // quick patches
        //   // append number of already recieved tweets and the database user_id
        var userData = auth.userData;
        userData.recievedTweets = myProfile.pages.length;
        userData.user_id = auth.user._id;
        await fetchNextAction(userData, auth.keyInUse, myProfile.page, this.signal.token);
    };
    formatCount(count) {
        const readablize = num => {
            var e = Math.floor(Math.log(num) / Math.log(1000));
            return (num / Math.pow(1000, e)).toFixed(1) + "K";
        };
        if (count > 999) return readablize(count);
        else return count;
    }
    async componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
        const {
            auth,
            myProfile,
            initialFetchAction
        } = this.props;
        if (myProfile.initialFetch === true) {
            // quick patches
            // append number of already recieved tweets and the database user_id
            var userData = auth.userData;
            userData.recievedTweets = myProfile.pages.length;
            userData.user_id = auth.user._id;
            await initialFetchAction(userData, auth.keyInUse, myProfile.page, this.signal.token);
        }
    }
    componentWillUnmount() {
        // Remove onScroll event listener
        window.removeEventListener("scroll", this.onScroll, false);
        // Cancel asyncs
        this.signal.cancel("Async call cancelled.");
    }
    render() {
        const {
            myProfile
        } = this.props;
        return ( < React.Fragment > < div ref = {
            this.topTweetRef
        } > {
            myProfile.initialFetch && ( < div style = {
                    {
                        paddingTop: "20px",
                        width: "98%"
                    }
                } > < Grid container justify = "center"
                spacing = {
                    2
                } > < Grid item xs = {
                    window.innerWidth >= 600 ? 8 : 12
                } > < LinearProgress color = "primary" / > < /Grid> < /Grid> < MainPageLoader / > < /div>)
        } {
            !myProfile.initialFetch && ( < Grid container justify = "center"
                spacing = {
                    2
                } > < Grid item xs = {
                    window.innerWidth >= 600 ? 8 : 12
                } > < LinearProgress color = "primary"
                variant = "determinate"
                value = {
                    100
                }
                /> < /Grid> < /Grid>)
        } {
            !myProfile.initialFetch && ( < div style = {
                {
                    paddingTop: "20px",
                    width: "98%"
                }
            } > {
                myProfile.pages && ( < RenderProfileTweets pages = {
                        myProfile.pages
                    }
                    context = "profile"
                    isFetching = {
                        myProfile.isFetching
                    }
                    />)
            } < /div>)
        } < /div> < /React.Fragment>)
    }
}
MyTweets.propTypes = {
    classes: PropTypes.object,
    myProfile: PropTypes.object.isRequired,
    initialFetchAction: PropTypes.func.isRequired,
    fetchNextAction: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    myProfile: state.myProfile
});
export default connect(mapStateToProps, {
    initialFetchAction,
    fetchNextAction
})(MyTweets);