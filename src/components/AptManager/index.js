import React from "react";

import { Modal, Button, Container, Row, Col } from "react-bootstrap";

import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import AptForm from "../AptForm";
import AptTable from "../AptTable";

const AptManagerPage = () => {
  return (
    <Container>
      <AuthUserContext.Consumer>
        {(authUser) => (
          <>
            <Row className="mt-4">
              <Col>
                <h1>Manage Apartments</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <ModalButton />
              </Col>
            </Row>
            <Row>
              <Col>
                <AptTable authUser={authUser} />
              </Col>
            </Row>
          </>
        )}
      </AuthUserContext.Consumer>
    </Container>
  );
};

// MODAL

function AddAptModal(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create a new apartment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AptForm closeModal={props.onHide} />
      </Modal.Body>
    </Modal>
  );
}

function ModalButton() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        className="float-right mt-4 mb-3"
        variant="success"
        onClick={() => setModalShow(true)}
      >
        Add new apartment +
      </Button>

      <AddAptModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(AptManagerPage);
