import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { compose } from "recompose";

import { DeleteButton } from "../DeleteModal";
import {
  Container,
  Row,
  Col,
  Spinner,
  Table,
  Card,
  Button,
} from "react-bootstrap";

import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

const AdminPage = () => (
  <Container>
    <Row className="mt-4">
      <Col>
        <h1>Admin Page</h1>
        <p>Manage the website users</p>
      </Col>
    </Row>
    <Switch>
      <Route exact path={ROUTES.ADMIN_USERS} component={UserItem} />{" "}
      <Route exact path={ROUTES.ADMIN} component={UserList} />
    </Switch>
  </Container>
);

class UserListBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on("value", (snapshot) => {
      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;
    return (
      <>
        {loading && (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid}>
                <td>{user.username}</td>
                <td>
                  {user.email}{" "}
                  <Link
                    to={{
                      pathname: `${ROUTES.ADMIN}/users/${user.uid}`,
                      state: { user },
                    }}
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }
}

class UserItemBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      ...props.location.state,
      passwordSent: false,
    };
  }

  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.match.params.id)
      .on("value", (snapshot) => {
        this.setState({
          user: snapshot.val(),
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
    this.setState({ passwordSent: true });
  };

  onDeleteUser = (uid) => {
    this.props.firebase.user(uid).remove();
    this.props.history.push(ROUTES.ADMIN);
  };

  render() {
    const { user, loading, passwordSent } = this.state;

    return (
      <Card className="p-3" border="dark" style={{ width: "18rem" }}>
        {loading && (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}

        {user && (
          <span>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>E-Mail:</strong> {user.email}
            </p>

            <Button
              className="mb-2"
              type="button"
              disabled={passwordSent}
              onClick={this.onSendPasswordResetEmail}
            >
              Send Password Reset
            </Button>
            {passwordSent ? (
              <p className="text-muted">An email has been sent.</p>
            ) : null}
            <DeleteButton
              text={"user"}
              onClick={() => this.onDeleteUser(user.uid)}
            />
            <Link
              to={{
                pathname: `${ROUTES.ADMIN}`,
              }}
            >
              Go back
            </Link>
          </span>
        )}
      </Card>
    );
  }
}

const UserList = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(withAuthorization(condition))(AdminPage);
