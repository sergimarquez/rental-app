import React from "react";
import { Link } from "react-router-dom";

import { Navbar, Nav } from "react-bootstrap";
import { AuthUserContext } from "../Session";
import SignOutButton from "../SignOut";

import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {(authUser) => (authUser ? <NavigationAuth authUser={authUser} /> : null)}
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = ({ authUser }) => (
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
    <Navbar.Brand to={ROUTES.HOME}>Luxury Homes</Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link as={Link} to={ROUTES.HOME}>
          Apartments List
        </Nav.Link>

        {!!authUser.roles[ROLES.ADMIN] && (
          <>
            <Nav.Link as={Link} to={ROUTES.APT_MANAGER}>
              Manage Apartments
            </Nav.Link>

            <Nav.Link as={Link} to={ROUTES.ADMIN}>
              Admin
            </Nav.Link>
          </>
        )}
        {!!authUser.roles[ROLES.REALTOR] && (
          <>
            <Nav.Link as={Link} to={ROUTES.APT_MANAGER}>
              Manage Apartments
            </Nav.Link>
          </>
        )}

        <Nav.Link as={Link} to={ROUTES.ACCOUNT}>
          Account
        </Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link href="#signout">
          <SignOutButton />
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>

  // </ul>
);

export default Navigation;
