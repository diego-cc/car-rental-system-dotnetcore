/**
 * AddJourney.test.js
 */
import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'
import {AppProvider} from "../../AppContext/AppContext";
import {AddJourney} from "./AddJourney";
import {fakeAPI} from "../../setupTests";

let tree, contextValue;

beforeEach(() => {
  contextValue = {
	vehicles: fakeAPI.vehicles.map(v => {
	  const vehicleBookings = fakeAPI.bookings.reduce((vBookings, b) => {
		if (b.vehicleID === v.id) {
		  vBookings.push(b);
		}
		return vBookings;
	  }, []);
	  v.bookings.push(...vehicleBookings);
	  return v;
	}),
	loading: false,
	notification: {
	  display: false,
	  message: ''
	}
  };
  tree = (
	<AppProvider value={contextValue}>
	  <MemoryRouter initialEntries={[`/addJourney/tesla-123`]}>
		<Route path={`/addJourney/:vehicleID`} render={props => <AddJourney {...props} />}/>
	  </MemoryRouter>
	</AppProvider>
  );
});

describe('AddJourney component', () => {
  it('renders all bookings associated with the vehicle found by vehicleID', () => {
	const {getByTestId} = render(tree);
	expect(getByTestId(/^booking-/)).toBeDefined();
  });
});
