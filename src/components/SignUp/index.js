import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Background from "../Background";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";

import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const SignUpPage = () => (
  <Background>
    <Container className="h-100">
      <Row className="align-items-center h-100">
        <Col className="col-12 col-lg-6 mx-auto text-center">
          <Card className="p-4">
            <h1 className="text-uppercase mb-3 text-muted h6">Luxury homes</h1>
            <h2 className="mb-3 h4">Create an account</h2>
            <SignUpForm />
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
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  isRealtor: false,
  error: null,
  loading: false,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    this.setState({ loading: true });
    const { username, email, passwordOne, isRealtor } = this.state;
    const roles = {};

    if (isRealtor) {
      roles[ROLES.REALTOR] = ROLES.REALTOR;
    } else {
      roles[ROLES.CLIENT] = ROLES.CLIENT;
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        //Create user in db
        return this.props.firebase
          .user(authUser.user.uid)
          .set({ username, email, roles });
      })
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

  onChangeCheckbox = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isRealtor,
      error,
      loading,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    return (
      <Form onSubmit={this.onSubmit} className="pl-5 pr-5 mb-4">
        <Form.Group className="text-left" controlId="formBasicEmail">
          <Form.Group controlId="validationCustom01">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="Full Name"
            />
          </Form.Group>
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
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group className="text-left" controlId="formBasicPassword2">
          <Form.Label>Repeat the Password</Form.Label>
          <Form.Control
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            className="text-muted ml-0 pl-0"
            label="I'm a realtor and want to publish my listings. "
            name="isRealtor"
            type="checkbox"
            checked={isRealtor}
            onChange={this.onChangeCheckbox}
          />
        </Form.Group>
        <Button variant="success" disabled={isInvalid || loading} type="submit">
          Create account
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

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
