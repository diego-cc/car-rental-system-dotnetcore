import React from 'react';
import {shallow} from 'enzyme';
import {MemoryRouter} from 'react-router-dom';
import {App} from "./App";
import {fakeAPI, setUpVehicles} from "../../setupTests";
import {Vehicle} from "../../Models/Vehicle";
import {Booking} from "../../Models/Booking";
import {Journey} from "../../Models/Journey";
import {FuelPurchase} from "../../Models/FuelPurchase";
import {Service} from "../../Models/Service";
import {calculateTotalRevenue} from './calculateTotalRevenue';
const cloneDeep = require('lodash.clonedeep');

const initialVehiclesData = cloneDeep(setUpVehicles(fakeAPI).vehicles);
let tree, initialState, wrapper, app;

beforeEach(() => {
  initialState = {
	vehicles: cloneDeep(initialVehiclesData),
	calculateTotalRevenue
  };

  tree = (
	<MemoryRouter initialEntries={[`/`]}>
	  <App/>
	</MemoryRouter>
  );
  wrapper = shallow(tree);

  // deep dive!
  app = wrapper.dive().dive().dive();
  app.setState({...cloneDeep(initialState)});
});

describe('App component', () => {
  it('edits a vehicle', () => {
	const editedVehicle = cloneDeep(app.state('vehicles')[0]);
	editedVehicle.registration = 'TEST123';

	app.instance().editVehicle(editedVehicle, false);

	expect(app.state('vehicles')[0].registration).toBe('TEST123');
  });

  it('adds a vehicle', () => {
	const vehicleToBeAdded = new Vehicle('Toyota', 'Corolla Hatch', 2019, 0, 'CHT1853', 50, [], [], [], [], 'toyota-corolla');

	app.instance().addResource('vehicle', vehicleToBeAdded, false);

	expect(app.state('vehicles')).toHaveLength(4);
  });

  it('adds a booking to an existing vehicle', () => {
	const tesla = app.state('vehicles')[0];
	const booking = new Booking(tesla.uuid, 'K', '2020-03-22', '2020-03-26', tesla.odometer, tesla.odometer + 800, [], [], 'tesla-fake-booking');

	app.instance().addResource('booking', booking, false);

	expect(app.state('vehicles')[0].bookings).toHaveLength(2);
  });

  it('adds a journey to an existing booking', () => {
	const teslaBooking = app.state('vehicles')[0].bookings[0];
	const journey = new Journey(teslaBooking.uuid, teslaBooking.vehicleUuid, teslaBooking.startOdometer, teslaBooking.endOdometer, teslaBooking.startedAt, teslaBooking.endedAt, '', '', 'tesla-fake-journey');

	app.instance().addResource('journey', journey, false);

	expect(app.state('vehicles')[0].bookings[0].journeys).toHaveLength(2);
  });

  it('adds a fuel purchase to an existing booking', () => {
	const rangerBooking = app.state('vehicles')[1].bookings[0];
	const fuelPurchase = new FuelPurchase(rangerBooking.uuid, rangerBooking.vehicleUuid, 10, 1.5, 'ranger-fake-fp');

	app.instance().addResource('fuelPurchase', fuelPurchase, false);

	expect(app.state('vehicles')[1].bookings[0].fuelPurchases).toHaveLength(2);
  });

  it('adds a service to an existing vehicle', () => {
	const holden = app.state('vehicles')[2];
	const service = new Service(holden.uuid, holden.odometer + 1000, '2019-12-20', 'holden-fake-service');

	app.instance().addResource('service', service, false);

	expect(app.state('vehicles')[2].services).toHaveLength(2);
  });

  it('deletes a vehicle', () => {
	const tesla = app.state('vehicles')[0];
	app.instance().confirmDeleteResource('vehicle', tesla, false);

	expect(app.state('vehicles')).toHaveLength(2);
  });

  it('deletes a booking', () => {
	const teslaBooking = app.state('vehicles')[0].bookings[0];
	app.instance().confirmDeleteResource('booking', teslaBooking, false);

	expect(app.state('vehicles')[0].bookings).toHaveLength(0)
  });
  it('deletes a journey', () => {
	const teslaJourney = app.state('vehicles')[0].bookings[0].journeys[0];
	app.instance().confirmDeleteResource('journey', teslaJourney, false);

	expect(app.state('vehicles')[0].bookings[0].journeys).toHaveLength(0);
  });

  it('deletes a fuel purchase', () => {
	const teslaFuelPurchase = app.state('vehicles')[0].bookings[0].fuelPurchases[0];
	app.instance().confirmDeleteResource('fuelPurchase', teslaFuelPurchase, false);

	expect(app.state('vehicles')[0].bookings[0].fuelPurchases).toHaveLength(0);
  });

  it('deletes a service', () => {
	const teslaService = app.state('vehicles')[0].services[0];
	app.instance().confirmDeleteResource('service', teslaService, false);

	expect(app.state('vehicles')[0].services).toHaveLength(0);
  })
});
