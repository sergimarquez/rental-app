import React from "react";

import { Modal, Button } from "react-bootstrap";

function DeleteModal(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Delete {props.text}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-danger">
        <p> Are you sure you want to delete {props.text}? </p>
        <p>This action cannot be reverted.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="mr-2 ml-2"
          variant="danger"
          type="button"
          onClick={props.onDelete}
        >
          Delete {props.text}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function DeleteButton(props) {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button
        className="mr-2"
        variant="danger"
        onClick={() => setModalShow(true)}
      >
        Delete {props.text}
      </Button>

      <DeleteModal
        show={modalShow}
        text={props.text}
        onHide={() => setModalShow(false)}
        onDelete={props.onClick}
      />
    </>
  );
}

export { DeleteButton };
