/**
 * Notification.test.js
 */
import React from 'react';
import {render} from '@testing-library/react';
import {Notification} from "./Notification";

describe('Notification component', () => {
  it('renders the correct notification message', () => {
	const {getByText} = render(
	  <Notification message="Test message"/>
	);

	expect(getByText(/^Test message$/)).toBeDefined();
  })
});
