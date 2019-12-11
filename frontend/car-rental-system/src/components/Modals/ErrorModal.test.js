import React from 'react';
import {render} from '@testing-library/react';
import {ErrorModal} from "./ErrorModal";

describe('ErrorModal component', () => {
  it('renders the correct header and body messages', () => {
	const {getByText} = render(
	  <ErrorModal
		show={true}
		onHide={() => console.log('onHide')}
		headerMessage="Test header"
		bodyMessage="Test body"/>
	  );

	expect(getByText(/^Test header/, 'h4')).toBeDefined();
	expect(getByText(/^Test body/, 'p')).toBeDefined();
  });
});
