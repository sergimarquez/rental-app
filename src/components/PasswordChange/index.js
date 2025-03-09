import React, { Component } from "react";

import { Button, Form, Spinner } from "react-bootstrap";

import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null,
  loading: false,
  success: "",
};

class PasswordForgetChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    this.setState({ loading: true });
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.setState({ success: "Your password has been updated" });
      })
      .catch((error) => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error, loading, success } = this.state;

    const isInvalid = passwordTwo !== passwordOne || passwordOne === "";

    return (
      <Form onSubmit={this.onSubmit} className="pl-2 pr-2 mb-4">
        <Form.Group className="text-left" controlId="formBasicPassword">
          <Form.Label>New Password</Form.Label>
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
        <Button variant="success" disabled={isInvalid || loading} type="submit">
          Change my password
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
        {<p className="text-muted pt-2">{success}</p>}
      </Form>
    );
  }
}

export default withFirebase(PasswordForgetChangeForm);
