import React, { Component } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { format } from "date-fns";

import { Spinner, Card, Row, Col, Form, Button } from "react-bootstrap";
import { DeleteButton } from "../DeleteModal";

import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";

class AptTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      apartments: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    if (this.props.authUser.roles.ADMIN === "ADMIN") {
      this.props.firebase.apartments().on("value", (snapshot) => {
        const apartmentObject = snapshot.val();

        if (apartmentObject) {
          const apartmentsList = Object.keys(apartmentObject).map((key) => ({
            ...apartmentObject[key],
            uid: key,
          }));
          this.setState({ apartments: apartmentsList, loading: false });
        } else {
          this.setState({ apartments: null, loading: false });
        }
      });
    } else {
      this.props.firebase
        .apartments()
        .orderByChild("realtorID")
        .equalTo(this.props.authUser.uid)
        .on("value", (snapshot) => {
          const apartmentObject = snapshot.val();

          if (apartmentObject) {
            const apartmentsList = Object.keys(apartmentObject).map((key) => ({
              ...apartmentObject[key],
              uid: key,
            }));

            this.setState({ apartments: apartmentsList, loading: false });
          } else {
            this.setState({ apartments: null, loading: false });
          }
        });
    }
  }

  componentWillUnmount() {
    this.props.firebase.apartments().off();
  }

  onRemoveApartment = (uid) => {
    this.props.firebase.apartment(uid).remove();
  };

  render() {
    const { apartments, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {(authUser) => (
          <div>
            {loading && (
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
            {apartments ? (
              <ApartmentsList
                apartments={apartments}
                onRemoveApartment={this.onRemoveApartment}
              />
            ) : (
              <Row className="mt-5">
                <Col>There are no apartments to show at the moment.</Col>
              </Row>
            )}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const ApartmentsList = ({ apartments, onRemoveApartment }) => (
  <Row>
    <Col>
      {apartments.map((apartment) => (
        <AptItem
          key={apartment.uid}
          apartment={apartment}
          onRemoveApartment={onRemoveApartment}
        />
      ))}
    </Col>
  </Row>
);

const schema = yup.object().shape({
  name: yup.string().min(3).max(16).required("Name is a required field"),
  description: yup
    .string()
    .min(10)
    .max(200)
    .required("Description is a required field"),
  price: yup.number().min(100).max(10000).required("Price is a required field"),
  floor: yup
    .number()
    .min(10)
    .max(2000)
    .required("Floor size is a required field"),
  rooms: yup.number().min(1).max(5).required("Rooms is a required field"),
  lat: yup.number().required("Latitude is a required field"),
  lon: yup.number().required("Longitude is a required field"),
  isAvailable: yup.bool(),
});

class ApartmentItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
    };
  }

  onToggleEditMode = () => {
    this.setState((state) => ({
      editMode: !state.editMode,
    }));
  };

  render() {
    const { apartment, onRemoveApartment } = this.props;
    const { editMode } = this.state;

    var date = new Date(apartment.date);
    var formatDate = format(date, "MMMM d, yyyy");

    return (
      <Card className="mb-4">
        {editMode ? (
          <Formik
            enableReinitialize
            initialValues={{
              name: this.props.apartment.name,
              description: this.props.apartment.description,
              floor: this.props.apartment.floor,
              price: this.props.apartment.price,
              rooms: this.props.apartment.rooms,
              lat: this.props.apartment.lat,
              lon: this.props.apartment.lon,
              isAvailable: this.props.apartment.isAvailable,
              loading: false,
              uid: apartment.uid,
            }}
            validationSchema={schema}
            onSubmit={(event) => {
              event.loading = true;
              const { uid, ...apartmentSnapshot } = apartment;
              this.props.firebase.apartment(apartment.uid).set({
                ...apartmentSnapshot,
                name: event.name,
                description: event.description,
                price: event.price,
                floor: event.floor,
                rooms: event.rooms,
                lat: event.lat,
                lon: event.lon,
                isAvailable: event.isAvailable,
              });
              this.setState({ editMode: false });
              event.loading = false;
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Card.Header>
                  <Form.Group controlId="apartmentName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Name of the apartment"
                      isValid={touched.name && !errors.name}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback>Ok</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Card.Header>

                <Card.Body>
                  <Row>
                    <Col>
                      <Form.Group controlId="apartmentDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows="3"
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                          isValid={touched.description && !errors.description}
                          isInvalid={!!errors.description}
                          placeholder="Apartment description"
                          maxLength="200"
                        />
                        <Form.Control.Feedback>Ok</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                          {errors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Row>
                        <Form.Group as={Col} controlId="apartmentFloor">
                          <Form.Label>Floor (m²)</Form.Label>
                          <Form.Control
                            name="floor"
                            value={values.floor}
                            onChange={handleChange}
                            isValid={touched.floor && !errors.floor}
                            isInvalid={!!errors.floor}
                            type="number"
                            placeholder="Floor size"
                          />
                          <Form.Control.Feedback>Ok</Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            {errors.floor}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="apartmentPrice">
                          <Form.Label>Price ($)</Form.Label>
                          <Form.Control
                            name="price"
                            value={values.price}
                            onChange={handleChange}
                            isValid={touched.price && !errors.price}
                            isInvalid={!!errors.price}
                            type="number"
                            placeholder="Price"
                          />
                          <Form.Control.Feedback>Ok</Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            {errors.price}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="apartmentRooms">
                          <Form.Label>Rooms</Form.Label>
                          <Form.Control
                            name="rooms"
                            value={values.rooms}
                            onChange={handleChange}
                            isValid={touched.rooms && !errors.rooms}
                            isInvalid={!!errors.rooms}
                            type="number"
                            placeholder="Number of rooms"
                          />
                          <Form.Control.Feedback>Ok</Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            {errors.rooms}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} controlId="apartmentLatitude">
                          <Form.Label>Latitude</Form.Label>
                          <Form.Control
                            name="lat"
                            value={values.lat}
                            onChange={handleChange}
                            isValid={touched.lat && !errors.lat}
                            isInvalid={!!errors.lat}
                            type="number"
                            placeholder="Latitude coordinates"
                          />
                          <Form.Control.Feedback>Ok</Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            {errors.lat}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="apartmentLongitude">
                          <Form.Label>Longitude</Form.Label>
                          <Form.Control
                            name="lon"
                            value={values.lon}
                            onChange={handleChange}
                            isValid={touched.lon && !errors.lon}
                            isInvalid={!!errors.lon}
                            type="number"
                            placeholder="Latitude coordinates"
                          />
                          <Form.Control.Feedback>Ok</Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            {errors.lon}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row as={Col}>
                        <Form.Group controlId="apartmentAvailability">
                          <Form.Check
                            type="checkbox"
                            name="isAvailable"
                            onChange={handleChange}
                            checked={values.isAvailable}
                            label="Available for rent"
                          />
                        </Form.Group>
                      </Form.Row>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="text-muted">
                  <Button
                    className="mr-2 ml-2"
                    variant="success"
                    type="submit"
                    disabled={values.loading}
                  >
                    Save
                  </Button>
                  <Button className="mr-2 ml-2" onClick={this.onToggleEditMode}>
                    Reset
                  </Button>
                </Card.Footer>
              </Form>
            )}
          </Formik>
        ) : (
          <>
            <Card.Header>
              <h2 className="h4">{apartment.name}</h2>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm>
                  <Card.Text>
                    <strong>Description: </strong>
                    {apartment.description}
                  </Card.Text>
                  <Card.Text>
                    <strong>Date published: </strong>
                    {formatDate}
                  </Card.Text>
                </Col>
                <Col sm>
                  <Card.Text>
                    <strong>Floor: </strong>
                    {apartment.floor}m²
                  </Card.Text>
                  <Card.Text>
                    <strong>Price: </strong>
                    {apartment.price}$
                  </Card.Text>
                  <Card.Text>
                    <strong>Rooms: </strong>
                    {apartment.rooms}
                  </Card.Text>
                </Col>
                <Col sm>
                  <Card.Text>
                    <strong>Latitude: </strong>
                    {apartment.lat}
                  </Card.Text>
                  <Card.Text>
                    <strong>Latitude: </strong>
                    {apartment.lon}
                  </Card.Text>
                  <Card.Text>
                    {apartment.isAvailable ? (
                      <span className="text-success">Available</span>
                    ) : (
                      <span className="text-danger">Not available</span>
                    )}
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-muted">
              <Button className="mr-2 ml-2" onClick={this.onToggleEditMode}>
                Edit Apartment
              </Button>
              <DeleteButton
                className="mr-2 ml-2"
                text={"apartment"}
                onClick={() => onRemoveApartment(apartment.uid)}
              />
            </Card.Footer>
          </>
        )}
      </Card>
    );
  }
}

const AptItem = withFirebase(ApartmentItem);

export default withFirebase(AptTable);
