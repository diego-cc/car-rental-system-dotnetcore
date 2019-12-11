/**
 * WarningModal.js
 */
import React from 'react';
import {Button, Modal} from "react-bootstrap";

/**
 * @typedef {Object} WarningModalProps
 * @property {boolean} show - determines whether this modal should be rendered
 * @property {Function} cancelHandler - sets {@link show} to false
 * @property {Function} acceptHandler - fires when the user confirms conflict resolution
 * @property {string} header - title of this warning modal
 * @property {string} body - body message of this warning modal
 * @property {string} accept - text of the accept button
 * @property {string} cancel - text of the cancel button
 *
 */
/**
 * WarningModal component - renders a warning modal that allows the user to choose an action
 * @param {WarningModalProps} props
 * @returns {*}
 * @constructor
 */
export const WarningModal = props => {
  return (
	<Modal
	  show={props.show}
	  onHide={props.cancelHandler}
	  size="xl"
	  aria-labelledby="contained-modal-title-vcenter"
	  centered
	>
	  <Modal.Header closeButton>
		<Modal.Title id="contained-modal-title-vcenter">
		  Warning
		</Modal.Title>
	  </Modal.Header>
	  <Modal.Body>
		<h4>{props.header}</h4>
		<p>
		  {props.body}
		</p>
	  </Modal.Body>
	  <Modal.Footer>
		<Button
		onClick={props.acceptHandler}
		size="lg"
		variant="danger"
		>
		  {props.accept}
		</Button>
		<Button
		  variant="info"
		  size="lg"
		  onClick={props.cancelHandler}>
		  {props.cancel}
		</Button>
	  </Modal.Footer>
	</Modal>
  )
};
