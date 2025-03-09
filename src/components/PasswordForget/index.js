import React, { Component } from "react";
import { Link } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import Background from "../Background";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const PasswordForgetPage = () => (
  <Background>
    <Container className="h-100">
      <Row className="align-items-center h-100">
        <Col className="col-12 col-lg-6 mx-auto text-center">
          <Card className="p-4">
            <h1 className="text-uppercase mb-3 text-muted h6">Luxury homes</h1>
            <h2 className="h4 mb-4">Password Recover</h2>
            <PasswordForgetForm />
            <Link to={ROUTES.SIGN_IN}>
              <p>Go back</p>
            </Link>
          </Card>
        </Col>
      </Row>
    </Container>
  </Background>
);

const INITIAL_STATE = {
  email: "",
  error: "null",
  loading: false,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    this.setState({ loading: true });
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch((error) => {
        this.setState({ error });
        this.setState({ loading: false });
      });
    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error, loading } = this.state;

    const isInvalid = email === "";

    return (
      <Form onSubmit={this.onSubmit} className="pl-5 pr-5 mb-4">
        <Form.Group className="text-left" controlId="formBasicEmail">
          <Form.Label>Email address:</Form.Label>
          <Form.Control
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Enter your email"
          />
        </Form.Group>
        <Button variant="success" disabled={isInvalid || loading} type="submit">
          Reset my password
          {loading && (
            <>
              {" "}
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="sr-only">Loading...</span>
            </>
          )}
        </Button>
        {error && <p className="text-danger">{error.message}</p>}
      </Form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
