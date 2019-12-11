import React from 'react';
import {AppProvider} from "../../AppContext/AppContext";
import {MemoryRouter, Route} from "react-router-dom";
import {VehicleForm} from "./VehicleForm";
import {Vehicle} from "../../Models/Vehicle";
import {fakeAPI, setUpVehicles} from "../../setupTests";
import {fireEvent, render, wait} from '@testing-library/react';
import moment from "moment";
const cloneDeep = require('lodash.clonedeep');

const initialContextValue = {
  vehicles: setUpVehicles(fakeAPI).vehicles,
  loading: false,
  notification: {
	display: false,
	message: ''
  }
};

let contextValue;
contextValue = {
  ...initialContextValue
};

describe('VehicleForm component', () => {
  it('adds a vehicle', async () => {
    contextValue = {
		...contextValue,
		handleSubmit: values => {
		  const {manufacturer, model, year, odometerReading, registrationNumber, tankCapacity} = values;
		  const vehicleToBeAdded = new Vehicle(manufacturer, model, year, odometerReading, registrationNumber, tankCapacity);

		  contextValue.vehicles.push(vehicleToBeAdded);
		}
	};

	const tree = (
	  <AppProvider value={contextValue}>
		<MemoryRouter initialEntries={[`/add`]}>
		  <Route path={`/add`} render={props =>
			<VehicleForm type="add" handleSubmit={contextValue.handleSubmit} {...props} />}/>
		</MemoryRouter>
	  </AppProvider>
	);

	let component;
	component = render(tree);
	const {getByText, getByLabelText} = component;
	fireEvent.change(getByLabelText(/^Manufacturer:/), {target: {value: 'BMW'}});
	fireEvent.change(getByLabelText(/^Model:/), {target: {value: 'X5'}});
	fireEvent.change(getByLabelText(/^Year:/), {target: {value: '2006'}});
	fireEvent.change(getByLabelText(/^Registration Number:/), {target: {value: '1BGZ784'}});
	fireEvent.change(getByLabelText(/^Odometer Reading/), {target: {value: '10000'}});
	fireEvent.change(getByLabelText(/^Tank Capacity/), {target: {value: '93'}});

	fireEvent.click(getByText('Add vehicle'));

	await wait(() => {
	  expect(contextValue.vehicles).toHaveLength(4);
	});
  });

  it('edits a vehicle', async () => {
	const vehicleToBeEdited = cloneDeep(contextValue.vehicles.find(v => v.id === 'holden-123'));

	contextValue = {
	  ...contextValue,
	  handleSubmit: values => {
		for (let field in values) {
		  if (vehicleToBeEdited.hasOwnProperty(`_${field}`)) {
			vehicleToBeEdited[field] = values[field];
		  }
		};

		vehicleToBeEdited.updatedAt = moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD');

		contextValue.vehicles[contextValue.vehicles.findIndex(v => v.id === vehicleToBeEdited.id)] = vehicleToBeEdited;
	  }
	};

	const tree = (
	  <AppProvider value={contextValue}>
		<MemoryRouter initialEntries={[`/edit/holden-123`]}>
		  <Route path={`/edit/:vehicleID`} render={props =>
			<VehicleForm
			  type="edit"
			  vehicle={vehicleToBeEdited}
			  handleSubmit={contextValue.handleSubmit}
			  {...props} />}
		  />
		</MemoryRouter>
	  </AppProvider>
	);

	let component;
	component = render(tree);
	const {getByText, getByLabelText} = component;

	fireEvent.change(getByLabelText(/^Registration/), {target: {value: '1TEST99'}});
	fireEvent.click(getByText('Edit vehicle'));

	await wait(() => {
	  expect(contextValue.vehicles.find(v => v.id === vehicleToBeEdited.id).registrationNumber)
		.toEqual('1TEST99');
	  expect(contextValue.vehicles.find(v => v.id === vehicleToBeEdited.id).updatedAt)
		.toEqual(moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'));
	});
  });
});
