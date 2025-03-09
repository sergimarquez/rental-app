import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import Background from "../Background";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

const SignInPage = () => {
  return (
    <Background>
      <Container className="h-100">
        <Row className="align-items-center h-100">
          <Col className="col-12 col-lg-6 mx-auto text-center">
            <Card className="p-4">
              <AuthUserContext.Consumer>
                {(authUser) =>
                  authUser ? (
                    <div>
                      <h2 className="mb-3 h4 text-success">You're logged in</h2>
                      <Link to={ROUTES.HOME}>Go to homepage</Link>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <h1 className="text-uppercase mb-3 text-muted h6">
                        Luxury homes
                      </h1>
                      <h2 className="mb-5 h4">Login to your account</h2>
                      <SignInForm />
                      <PasswordForgetLink />
                      <SignUpLink />
                    </div>
                  )
                }
              </AuthUserContext.Consumer>
            </Card>
          </Col>
        </Row>
      </Container>
    </Background>
  );
};

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
  loading: false,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    this.setState({ loading: true });
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
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
    const { email, password, error, loading } = this.state;
    const isInvalid = password === "" || email === "";
    return (
      <Form onSubmit={this.onSubmit} className="pl-5 pr-5 mb-4">
        <Form.Group className="text-left" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={this.onChange}
            placeholder="Enter email"
          />
        </Form.Group>
        <Form.Group className="text-left" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </Form.Group>

        <Button variant="success" disabled={isInvalid || loading} type="submit">
          Sign In
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

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignInPage;

export { SignInForm };
