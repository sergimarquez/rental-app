import React, { Component } from "react";
import { Formik } from "formik";
import * as yup from "yup";

import { Col, Button, Form, Spinner } from "react-bootstrap";

import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";

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

class AptFormBase extends Component {
  render() {
    return (
      <AuthUserContext.Consumer>
        {(authUser) => (
          <Formik
          
            initialValues={{
              name: "",
              description: "",
              floor: "",
              price: "",
              rooms: "",
              lat: "",
              lon: "",
              date: "",
              realtor: "",
              realtorID: "",
              isAvailable: false,
              loading: false,
            }}
            authUser={authUser}
            validationSchema={schema}
            onSubmit={(event) => {
              event.loading = true;
              this.props.firebase.apartments().push({
                name: event.name,
                description: event.description,
                price: event.price,
                floor: event.floor,
                rooms: event.rooms,
                lat: event.lat,
                lon: event.lon,
                isAvailable: event.isAvailable,
                realtor: authUser.username,
                realtorID: authUser.uid,
                date: this.props.firebase.serverValue.TIMESTAMP,
              });
              event.loading = false;
              this.props.closeModal();
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit} className="pl-2 pr-2">
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
                  <Form.Group as={Col} controlId="apartmentPrice">
                    <Form.Label>Price</Form.Label>
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
                  <Form.Group as={Col} controlId="apartmentFloor">
                    <Form.Label>Floor size</Form.Label>
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
                </Form.Row>

                <Form.Row>
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
                  <Form.Group as={Col} controlId="apartmentLatitude">
                    <Form.Label>Latitude:</Form.Label>
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
                    <Form.Label>Longitude:</Form.Label>
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

                <Form.Group controlId="apartmentAvailability">
                  <Form.Check
                    type="checkbox"
                    name="isAvailable"
                    onChange={handleChange}
                    checked={values.isAvailable}
                    label="Available for rent"
                  />
                </Form.Group>

                <Button
                  className="mt-2"
                  variant="success"
                  type="submit"
                  disabled={values.loading}
                >
                  Create Apartment
                  {values.loading && (
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
              </Form>
            )}
          </Formik>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const AptForm = withFirebase(AptFormBase);

export default AptForm;
