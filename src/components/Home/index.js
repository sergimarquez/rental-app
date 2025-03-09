import React, { Component } from "react";
import _ from "lodash";

import { Container, Row, Col, Spinner, Form, Card } from "react-bootstrap";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

import AparmentItem from "../ApartmentItem";

const HomePage = () => {
  return (
    <Container className="mb-5">
      <Row className="mt-4">
        <Col>
          <h1>Apartments</h1>
          <p> Browse the apartments available for rent.</p>
        </Col>
      </Row>
      <Apartments />
    </Container>
  );
};

class ApartmentsBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      apartments: [],
      mapMode: false,
      selected: [],
      currentLoc: {
        lat: 41.3851,
        lng: 2.1734,
      },
      filterRoom: 0,
      filterFloorMin: "Min Floor Size",
      filterFloorMax: "Max Floor Size",
      filterPriceMin: "Min Price",
      filterPriceMax: "Max Price",
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

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
  }

  filteredApartments() {
    const {
      apartments,
      filterRoom,
      filterFloorMax,
      filterFloorMin,
      filterPriceMax,
      filterPriceMin,
    } = this.state;

    return _.filter(apartments, (apartment) => {
      if (apartment.rooms !== filterRoom) {
        if (filterRoom !== 0) {
          return false;
        }
      }
      if (
        apartment.floor < filterFloorMin ||
        apartment.floor > filterFloorMax
      ) {
        return false;
      }
      if (
        apartment.price < filterPriceMin ||
        apartment.price > filterPriceMax
      ) {
        return false;
      }

      //if no filter fails
      return true;
    });
  }

  componentWillUnmount() {
    this.props.firebase.apartments().off();
  }

  onChangeSwitch = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  onSelect = (apartment, loc) => {
    this.setState({ selected: apartment });
    this.setState({ currentLoc: loc });
  };

  onSelectRoom = (event) => {
    let room = parseInt(event.target.value);
    this.setState({ [event.target.name]: room });
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      loading,
      mapMode,
      selected,
      currentLoc,
      filterRoom,
      filterPriceMin,
      filterPriceMax,
      filterFloorMin,
      filterFloorMax,
    } = this.state;
    const apartments = this.filteredApartments();
    const mapStyles = {
      height: "50vh",
      width: "100%%",
    };

    return (
      <>
        <Card className="mt-2 mb-3 bg-info text-white border-light">
          <Card.Header>
            <h5>Filter Apartments</h5>
          </Card.Header>
          <Card.Body className="bg-white text-dark pb-0">
            <Form>
              <Form.Row>
                <Form.Group as={Col} sm={12} md={3} controlId="filterRooms">
                  <Form.Label>Rooms</Form.Label>
                  <Form.Control
                    name="filterRoom"
                    as="select"
                    onChange={this.onSelectRoom}
                    custom
                    value={filterRoom}
                  >
                    <option value={0}>Filter by room...</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} sm={12} md={3} controlId="filterPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Row>
                    <Col>
                      <Form.Control
                        name="filterPriceMin"
                        value={filterPriceMin}
                        onChange={this.onChange}
                        type="number"
                        placeholder="Min Price"
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        name="filterPriceMax"
                        value={filterPriceMax}
                        onChange={this.onChange}
                        type="number"
                        placeholder="Max Price"
                      />
                    </Col>
                  </Form.Row>
                </Form.Group>

                <Form.Group as={Col} sm={12} md={3} controlId="filterFloor">
                  <Form.Label>Floor</Form.Label>
                  <Form.Row>
                    <Col>
                      <Form.Control
                        name="filterFloorMin"
                        value={filterFloorMin}
                        onChange={this.onChange}
                        type="number"
                        placeholder="Min Floor"
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        name="filterFloorMax"
                        value={filterFloorMax}
                        onChange={this.onChange}
                        type="number"
                        placeholder="Max Floor"
                      />
                    </Col>
                  </Form.Row>
                </Form.Group>

                <Form.Group as={Col} sm={12} md={3}>
                  <Form.Check
                    type="switch"
                    className="float-right pr-4"
                    id="custom-switch"
                    label="Show map"
                    name="mapMode"
                    checked={mapMode}
                    onChange={this.onChangeSwitch}
                  />
                </Form.Group>
              </Form.Row>
            </Form>
          </Card.Body>
        </Card>

        <AuthUserContext.Consumer>
          {(authUser) => (
            <div>
              {loading && (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
              {apartments.length !== 0 ? (
                <>
                  {mapMode ? (
                    <LoadScript googleMapsApiKey="AIzaSyDqx0VYe0qtdyzwuvWwfJxxFYxYWq_NmYU">
                      <GoogleMap
                        mapContainerStyle={mapStyles}
                        zoom={11}
                        center={currentLoc}
                      >
                        {apartments.map((apartment) => {
                          const loc = {
                            lat: parseFloat(apartment.lat),
                            lng: parseFloat(apartment.lon),
                          };
                          return (
                            <Marker
                              key={apartment.name}
                              position={loc}
                              onClick={() => this.onSelect(apartment, loc)}
                            />
                          );
                        })}
                        {selected.lon && currentLoc && (
                          <InfoWindow
                            className="p-3"
                            clickable={true}
                            position={currentLoc}
                            onCloseClick={() => this.setState({ selected: {} })}
                          >
                            <div>
                              <h2 className="h4">{selected.name}</h2>
                              <p>
                                <strong>Price: </strong>
                                {selected.price}$
                              </p>
                              <p>
                                <strong>Floor size: </strong>
                                {selected.floor}m²
                              </p>
                              <p>
                                <strong>Rooms: </strong>
                                {selected.rooms}
                              </p>
                              <p>
                                {selected.isAvailable ? (
                                  <span className="text-success">
                                    Available
                                  </span>
                                ) : (
                                  <span className="text-danger">Rented</span>
                                )}
                              </p>
                              <p>
                                <strong>Realtor: </strong>
                                {selected.realtor}
                              </p>
                            </div>
                          </InfoWindow>
                        )}
                      </GoogleMap>
                    </LoadScript>
                  ) : (
                    <ApartmentsList apartments={apartments} />
                  )}
                </>
              ) : (
                !loading && <div>There are no apartments to show.</div>
              )}
            </div>
          )}
        </AuthUserContext.Consumer>
      </>
    );
  }
}

const ApartmentsList = ({ apartments }) => (
  <>
    {apartments.map((apartment) => (
      <AparmentItem key={apartment.uid} apartment={apartment} />
    ))}
  </>
);

const Apartments = withFirebase(ApartmentsBase);

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(HomePage);
