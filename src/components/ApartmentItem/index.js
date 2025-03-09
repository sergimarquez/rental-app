import React, { Component } from 'react';
import { format } from "date-fns";
import { Row, Col,  Card } from "react-bootstrap";

export default class AparmentItem extends Component {
  render() {
    const { apartment } = this.props;
    var date = new Date(apartment.date);
    var formatDate = format(date, "MMMM d, yyyy");

    return (
      <Card className="mb-4">
        <Card.Header>
          <h2 className="h4">{apartment.name}</h2>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col sm>
              <p>{apartment.description}</p>
              <p>
                <strong>Price: </strong>
                {apartment.price}$
              </p>
              <p>
                {apartment.isAvailable ? (
                  <span className="text-success">Available</span>
                ) : (
                  <span className="text-danger">Rented</span>
                )}
              </p>
            </Col>

            <Col sm>
              <p>
                <strong>Floor size: </strong>
                {apartment.floor}m²
              </p>
              <p>
                <strong>Rooms: </strong> {apartment.rooms}
              </p>
              <p>
                <strong>Date added: </strong> {formatDate}
              </p>
              <p>
                <strong>Realtor: </strong>
                {apartment.realtor}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}