import React from 'react';
import {Header} from "./Header";
import {render} from "@testing-library/react";

describe('Header component', () => {
  it('renders the correct header text', () => {
	const {getByText} = render(<Header headerText="Test header"/>);

	expect(getByText('Test header', {selector: 'h1'})).toBeDefined();
  });
});
