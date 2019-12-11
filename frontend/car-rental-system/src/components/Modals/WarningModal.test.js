import React from 'react';
import { render } from '@testing-library/react';
import {WarningModal} from "./WarningModal";

describe('WarningModal component', () => {
  it('renders the correct header/body messages and accept/cancel text', () => {
    const {getByText} = render(
      <WarningModal
		show={true}
		cancelHandler={() => console.log('Cancel handler')}
		acceptHandler={() => console.log('Accept handler')}
		header="Test header"
		body="Test body"
		accept="Accept"
		cancel="Cancel"
		/>
	);

    expect(getByText(/Test header$/, 'h4')).toBeDefined();
	expect(getByText(/Test body$/, 'p')).toBeDefined();
	expect(getByText(/Accept$/, 'button')).toBeDefined();
	expect(getByText(/Cancel$/, 'button')).toBeDefined();
  })
});
