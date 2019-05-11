import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Nav, NavItem, NavLink } from "shards-react";
import { Link } from "react-router-dom";

class AppFooter extends React.Component {
 
  render() {

    const { contained, menuItems, copyright } = this.props;

    return (
      <footer
        className="main-footer d-flex p-2 px-3 bg-white border-top"
      >
        <Container fluid={contained}>
          <Row>
            <Nav>
              {menuItems.map((item, idx) => (
                <NavItem key={idx}>
                  <NavLink
                    tag={Link}
                    to={item.to}
                    style={{
                      textDecoration: "none",
                      color: "black"
                    }}
                  >
                    {item.title}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <span
              className="copyright ml-auto mt-auto mr-2"
              style={{
                color: "black"
              }}
            >
              {copyright}
            </span>
          </Row>
        </Container>
      </footer>
    );
  }
}

AppFooter.propTypes = {
  /**
   * Whether the content is contained, or not.
   */
  contained: PropTypes.bool,
  /**
   * The menu items array.
   */
  menuItems: PropTypes.array,
  /**
   * The copyright info.
   */
  copyright: PropTypes.string
};

AppFooter.defaultProps = {
  contained: false,
  copyright: "Copyright © 2019 FollowStack",
  menuItems: [
    {
      title: "Home",
      to: "/"
    },
    {
      title: "About",
      to: "/terms"
    },
    {
      title: "Terms",
      to: "/terms"
    },
    {
      title: "Privacy",
      to: "/privacy"
    }
  ]
};

export default AppFooter;
