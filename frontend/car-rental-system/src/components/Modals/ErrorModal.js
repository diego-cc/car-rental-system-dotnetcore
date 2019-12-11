/**
 * ErrorModal.js
 */
import React from 'react';
import {Button, Modal} from "react-bootstrap";

/**
 * @typedef {Object} ErrorModalProps
 * @property {boolean} show - determines whether this modal should be rendered
 * @property {Function} onHide - sets {@link show} to false
 * @property {string} headerMessage - title of the error modal
 * @property {string} bodyMessage - message of the error modal
 */
/**
 * ErrorModal component - renders a modal with an error message
 * @param props
 * @returns {*}
 * @constructor
 */
export const ErrorModal = props => {
  return (
	<Modal
	  show={props.show}
	  size="xl"
	  aria-labelledby="contained-modal-title-vcenter"
	  centered
	>
	  <Modal.Header closeButton>
		<Modal.Title id="contained-modal-title-vcenter">
		  Error
		</Modal.Title>
	  </Modal.Header>
	  <Modal.Body>
		<h4>{props.headerMessage}</h4>
		<p>
		  {props.bodyMessage}
		</p>
	  </Modal.Body>
	  <Modal.Footer>
		<Button variant="info" onClick={props.onHide}>Close</Button>
	  </Modal.Footer>
	</Modal>
  )
};
