/**
 * AddService.test.js
 */
import React from 'react';
import {act, fireEvent, render, wait} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {fakeAPI, setUpVehicles} from "../../setupTests";
import {AddService} from "./AddService";
import '@testing-library/jest-dom/extend-expect'
import {AppProvider} from "../../AppContext/AppContext";
import moment from "moment";
const cloneDeep = require('lodash.clonedeep');

const {vehicles} = cloneDeep(setUpVehicles(fakeAPI));

const initialContextValue = {
  vehicles,
  addResource: (resourceType, resource) => {
	if (resourceType.trim().toLowerCase() === 'service') {
	  contextValue.vehicles.find(v => v.uuid === resource.vehicleUuid).services.push(resource);
	}
  }
};

let tree, contextValue;

beforeEach(() => {
  contextValue = {...initialContextValue};
  tree = (
	<AppProvider value={contextValue}>
	  <MemoryRouter initialEntries={[`/addService/tesla-123`]}>
		<Route path={`/addService/:vehicleID`} render={props => <AddService {...props} />}/>
	  </MemoryRouter>
	</AppProvider>
  );
});

describe('AddService component', () => {
  it('loads AddService form with correct default values', async () => {
	let component;
	component = render(tree);
	const {getByLabelText} = component;

	await wait(() => {
	  expect(getByLabelText(/^Serviced at:/)).toHaveValue(moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'));
	  expect(getByLabelText(/^Service odometer:/)).toHaveValue(500);
	});
  });

  it('does not add a new service right away if there are service conflicts', async () => {
	let component;
	component = render(tree);
	const {getByText, getByLabelText} = component;
	const servicedAtInput = getByLabelText(/^Serviced at:/);

	act(() => {
	  fireEvent.change(servicedAtInput, {target: {value: '2019-12-10'}});
	  fireEvent.click(getByText('Add service'));
	});

	await wait(() => {
	  const vehicle = contextValue.vehicles.find(v => v.uuid === 'tesla-123');
	  expect(vehicle.services.length).toBe(1);
	});
  });

  it('adds a new service if there are no conflicts', async () => {
	let component;

	component = render(tree);
	const {getByText, getByLabelText} = component;

	act(() => {
	  fireEvent.change(getByLabelText(/^Serviced at:/), {target: {value: '2020-02-11'}});
	  fireEvent.click(getByText('Add service'));
	});

	await wait(() => {
	  const vehicle = contextValue.vehicles.find(v => v.uuid === 'tesla-123');
	  expect(vehicle.services.length).toBe(2);
	});
  })
});
