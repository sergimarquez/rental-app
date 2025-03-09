import React from "react";
import { compose } from "recompose";

import { Container, Row, Col, Card } from "react-bootstrap";

import { AuthUserContext, withAuthorization } from "../Session";
import PasswordChangeForm from "../PasswordChange";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <Container>
        <Card
          className="mt-5 mx-auto"
          border="secondary"
          style={{ maxWidth: "40rem" }}
        >
          <Card.Header>
            <h1 className="h2">Account</h1>
          </Card.Header>
          <Row className="pl-5 pr-5 mt-4">
            <Col>
              <p>
                <strong>Username: </strong>
                {authUser.username}{" "}
              </p>
              <p>
                <strong>Email: </strong>
                {authUser.email}{" "}
              </p>
            </Col>
          </Row>
          <Row className="pl-5 pr-5 mt-4">
            <Col>
              <p>
                <strong>Change password</strong>
              </p>
              <PasswordChangeForm />
            </Col>
          </Row>
        </Card>
      </Container>
    )}
  </AuthUserContext.Consumer>
);

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(AccountPage);
