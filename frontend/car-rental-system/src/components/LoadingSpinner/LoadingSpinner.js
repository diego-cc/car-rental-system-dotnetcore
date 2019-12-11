/**
 * LoadingSpinner.js
 */
import React from 'react';
import { Spinner } from 'react-bootstrap';

/**
 * LoadingSpinner component - renders a loading spinner, with a fallback for screen readers
 * @returns {*}
 * @constructor
 */
export const LoadingSpinner = () => (
  <Spinner
	animation="border"
	variant="success"
	role="status"
	style={{width: '5rem', height: '5rem'}}>
	<span className="sr-only">Loading...</span>
  </Spinner>
);
