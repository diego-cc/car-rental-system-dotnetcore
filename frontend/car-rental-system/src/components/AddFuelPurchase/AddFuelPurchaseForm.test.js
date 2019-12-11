/**
 * AddFuelPurchaseForm.test.js
 */
import React from 'react';
import {fireEvent, render, wait} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'
import {AppProvider} from "../../AppContext/AppContext";
import {fakeAPI} from "../../setupTests";
import {AddFuelPurchaseForm} from "./AddFuelPurchaseForm";

let tree, contextValue;

const initialContextValue = {
  vehicles: fakeAPI.vehicles.map(v => {
	const vehicleBookings = fakeAPI.bookings.reduce((vBookings, b) => {
	  if (b.vehicleID === v.id) {
		b.fuelPurchases.push(...fakeAPI.fuelPurchases.filter(f => f.bookingID === b.id));
		vBookings.push(b);
	  }
	  return vBookings;
	}, []);
	v.bookings.push(...vehicleBookings);
	return v;
  }),
  addResource: (resourceType, resource) => {
	if (resourceType.trim().toLowerCase() === 'fuel purchase') {
	  contextValue
		.vehicles
		.find(v => v.bookings.some(b => b.id === resource.bookingID))
		.bookings
		.find(b => b.id === resource.bookingID)
		.fuelPurchases.push(resource);
	}
  }
};

beforeEach(() => {
  contextValue = {
	...initialContextValue,
	notification: {
	  display: false,
	  message: ''
	},
	loading: false
  };
  tree = (
	<AppProvider value={contextValue}>
	  <MemoryRouter initialEntries={[`/addFuelPurchaseForm/ranger-booking`]}>
		<Route path={`/addFuelPurchaseForm/:bookingID`}
			   render={props => <AddFuelPurchaseForm {...props} />}/>
	  </MemoryRouter>
	</AppProvider>
  );
});

describe('AddFuelPurchaseForm component', () => {
  it('loads AddFuelPurchaseForm with correct default values', () => {
	const {getByLabelText} = render(tree);
	expect(getByLabelText(/^Fuel quantity:/).value).toBe("80");
	expect(getByLabelText(/^Fuel price per litre:/).value).toBe("");
  });

  it('adds a new fuel purchase', async () => {
	const {getByLabelText, getByText} = render(tree);
	const fuelQuantityInput = getByLabelText(/^Fuel quantity:/);
	const priceInput = getByLabelText(/^Fuel price per litre:/);
	fireEvent.change(fuelQuantityInput, {target: {value: 20}});
	fireEvent.change(priceInput, {target: {value: 1.5}});
	fireEvent.click(getByText(/^Add fuel purchase/));

	await wait(() => {
	  const vehicle = contextValue.vehicles.find(v => v.bookings.some(b => b.id === 'ranger-booking'));
	  expect(vehicle.bookings.find(b => b.id === 'ranger-booking')
		.fuelPurchases.length)
		.toBe(2);
	})
  });
});
