/**
 * AddBooking.test.js
 */
import React from 'react';
import {act, fireEvent, render, wait} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {fakeAPI} from "../../setupTests";
import {AddBooking} from "./AddBooking";
import '@testing-library/jest-dom/extend-expect'
import {AppProvider} from "../../AppContext/AppContext";
import moment from "moment";
const cloneDeep = require('lodash.clonedeep');

const vehicles = cloneDeep(fakeAPI.vehicles);

const initialContextValue = {
  vehicles,
  addResource: (resourceType, resource) => {
	if (resourceType.trim().toLowerCase() === 'booking') {
	  contextValue.vehicles.find(v => v.uuid === resource.vehicleUuid).bookings.push(resource);
	}
  }
};

let tree, contextValue;

beforeEach(() => {
  contextValue = {...initialContextValue};
  tree = (
	<AppProvider value={contextValue}>
	  <MemoryRouter initialEntries={[`/addBooking/tesla-123`]}>
		<Route path={`/addBooking/:vehicleID`} render={props => <AddBooking {...props} />}/>
	  </MemoryRouter>
	</AppProvider>
  );
});

describe('AddBooking component', () => {
  it('loads AddBooking form with correct default values', () => {
	let component;
	act(() => {
	  component = render(tree);
	  const {getByLabelText} = component;

	  expect(getByLabelText(/^Booking Type:/)).toHaveValue('D');
	  expect(getByLabelText(/^Start Date:/)).toHaveValue(moment().format('YYYY-MM-DD'));
	  expect(getByLabelText(/^End Date:/)).toHaveValue(moment().add(1, 'day').format('YYYY-MM-DD'));
	  expect(getByLabelText(/^Start Odometer:/)).toHaveValue(500);
	});
  });

  it('does not add a new booking right away if there are booking conflicts', async () => {
	let component;

	// we need to use async/await here
	// see https://github.com/jaredpalmer/formik/issues/1543
	await act(async () => {
	  component = render(tree);
	  const {getByText, getByLabelText} = component;
	  fireEvent.change(getByLabelText(/^Start Date:/), {target: {value: '2019-11-26'}});
	  fireEvent.change(getByLabelText(/^End Date:/), {target: {value: '2019-11-26'}});
	  fireEvent.click(getByText('Add booking'));
	  const vehicle = contextValue.vehicles.find(v => v.uuid === 'tesla-123');

	  expect(vehicle.bookings.length).toBe(1);
	});
  });

  it('adds a new booking if there are no conflicts', async () => {
	let component;

	component = render(tree);
	const {getByLabelText, getByText} = component;
	const startDateInput = getByLabelText(/^Start Date:/);
	const endDateInput = getByLabelText(/^End Date:/);

	fireEvent.change(startDateInput, {target: {value: '2020-01-10'}});
	fireEvent.change(endDateInput, {target: {value: '2020-01-20'}});
	fireEvent.click(getByText('Add booking'));

	await wait(() => {
	  const vehicle = contextValue.vehicles.find(v => v.uuid === 'tesla-123');
	  expect(vehicle.bookings.length).toBe(2);
	});
  })
});
