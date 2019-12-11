/**
 * Notification.js
 */
import React, {useState} from 'react';
import {Toast} from "react-bootstrap";

/**
 * @typedef {Object} NotificationProps
 * @property {boolean} display - determines whether a notification should be shown
 * @property {string} message - notification message
 */
/**
 * Notification component - renders notifications as a Toast, which is dismissible and auto hides
 * in 3 seconds
 * @param {NotificationProps} props
 * @returns {*}
 * @constructor
 */
export const Notification = props => {
  const [show, setShow] = useState(true);

  return (
	<Toast
	  style={{
		display: props.display ? "block" : "none",
		position: 'absolute',
		top: 0,
		left: '50%',
		transform: 'translateX(-50%)'
	  }}
	  onClose={() => setShow(false)}
	  show={show}
	  delay={3000}
	  autohide>
	  <Toast.Header>
		<strong className="mr-auto">Notification</strong>
	  </Toast.Header>
	  <Toast.Body>
		{props.message}
	  </Toast.Body>
	</Toast>
  )
};
