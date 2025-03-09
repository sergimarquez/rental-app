import React from "react";
import { Link } from "react-router-dom";

import { Container, Row, Col, Button } from "react-bootstrap";
import Background from "../Background";

import * as ROUTES from "../../constants/routes";


const Landing = () => {
  return (
    <Background>
      <Container className="h-100">
        <Row className="align-items-center h-100">
          <Col className="col-10 mx-auto text-center">
            <h1 className="text-white mb-3 display-4">
              Welcome to <span className="text-warning">Luxury Homes</span>
            </h1>
            <h5 className="text-light mb-5">
              Find the apartment of your dreams
            </h5>
            <Link to={ROUTES.SIGN_IN}>
              <Button size="lg" variant="info ">
                Access the private area
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </Background>
  );
};

export default Landing;
