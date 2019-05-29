import React from "react";
import PropTypes from "prop-types";
import styles from "./styles";
import Text from "./Text";

class Quote extends React.Component {
  render() {
    const { data, linkProps } = this.props;

    return (
      <div className="QuoteTweet" style={styles.QuoteTweet} aria-label="quote">
        <div
          className="QuoteTweet-innerContainer"
          style={styles.QuoteTweetInner}
        >
          <div
            className="QuoteTweet-originalAuthor"
            style={styles.QuoteTweetAuthor}
          >
            <b>{data.user.name}</b>
            <span className="QuoteTweet-screenname" style={styles.time}>
              {" "}
              {"@"}
              {data.user.screen_name}
            </span>
          </div>
          <a
            className="QuoteTweet-link"
            name="QuoteTweet-link"
            style={styles.QuoteLink}
            href={`https://twitter.com/${data.user.screen_name}/status/${
              data.id_str
            }`}
            {...linkProps}
          >
            <div className="QuoteTweet-text" style={styles.QuoteTweetText}>
              <Text data={data} />
            </div>
          </a>
        </div>
      </div>
    );
  }
}

Quote.propTypes = {
  data: PropTypes.object
};

Quote.displayName = "Quote";

export default Quote;
