/**
 * setupTests.js
 */
import React from 'react';
import {Vehicle} from "./Models/Vehicle";
import {Booking} from "./Models/Booking";
import {Journey} from "./Models/Journey";
import {Service} from "./Models/Service";
import {FuelPurchase} from "./Models/FuelPurchase";
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
const cloneDeep = require('lodash.clonedeep');

/**
 * Adapter configuration for enzyme
 */
Enzyme.configure({adapter: new Adapter()});

/**
 * An object containing fake seed data to be used in the unit tests
 * @type {{journeys: Array<Journey>, vehicles: Array<Vehicle>, fuelPurchases: Array<FuelPurchase>, services: Array<Service>, bookings: Array<Booking>}}
 */
export const fakeAPI = {
  journeys: [
	new Journey('tesla-booking', 'tesla-123', 500, 550, '2019-11-25', '2019-11-25', "Perth", "Rockingham", 'tesla-journey'),
	new Journey('ranger-booking', 'ranger-123', 800, 950, '2019-11-25', '2019-11-25', "", "", 'ranger-journey1'),
	new Journey('ranger-booking', 'ranger-123', 950, 1000, '2019-11-25', '2019-11-25', "", "", 'ranger-journey2'),
	new Journey('holden-booking', 'holden-123', 800, 950, '2019-11-25', '2019-11-25', "", "", 'holden-journey1'),
	new Journey('holden-booking', 'holden-123', 950, 1200, '2019-11-25', '2019-11-25', "", "", 'holden-journey2')
  ],
  services: [
	new Service('tesla-123', 1000, '2019-12-10', 'tesla-service'),
	new Service('ranger-123', 1500, '2019-12-15', 'ranger-service'),
	new Service('holden-123', 2000, '2019-12-20', 'holden-service')
  ],
  fuelPurchases: [
	new FuelPurchase('tesla-booking', 'tesla-123', 20, 1.5, 'tesla-fuel'),
	new FuelPurchase('ranger-booking', 'ranger-123', 15, 1.3, 'ranger-fuel'),
	new FuelPurchase('holden-booking', 'holden-123', 30, 1.2, 'holden-fuel')
  ],
  bookings: [
	new Booking('tesla-123', 'D', '2019-11-25', '2019-11-27', 500, 600, [], [], 'tesla-booking'),
	new Booking('ranger-123', 'K', '2019-11-25', '2019-11-27', 800, 1000, [], [], 'ranger-booking'),
	new Booking('holden-123', 'K', '2019-11-25', '2019-11-27', 800, 1200, [], [],'holden-booking')
  ],
  vehicles: [
	new Vehicle('Tesla', 'Roadster', 2008, 500, '1TES999', 0, [], [], [], [], 'tesla-123'),
	new Vehicle('Ford', 'Ranger XL', 2015, 800, '1RANGER', 80, [], [], [], [],'ranger-123'),
	new Vehicle('Holden', 'Commodore LT', 2018, 800, '1HOLDEN', 61, [], [], [], [], 'holden-123')
  ]
};

export const setUpVehicles = initialData => {
	const {vehicles, bookings, journeys, fuelPurchases, services} = cloneDeep(initialData);

	const mappedBookings = bookings.map(b => {
	  const associatedJourneys = journeys.filter(j => j.bookingUuid === b.uuid);
	  const associatedFuelPurchases = fuelPurchases.filter(f => f.bookingUuid === b.uuid);

	  b.journeys = associatedJourneys;
	  b.fuelPurchases = associatedFuelPurchases;

	  return b;
	});

	const mappedVehicles = vehicles.map(v => {
	  const associatedBookings = mappedBookings.filter(b => b.vehicleUuid === v.uuid);
	  const associatedJourneys = journeys.filter(j => j.vehicleUuid === v.uuid);
	  const associatedFuelPurchases = fuelPurchases.filter(f => f.vehicleUuid === v.uuid);
	  const associatedServices = services.filter(s => s.vehicleUuid === v.uuid);

	  v.bookings = associatedBookings;
	  v.journeys = associatedJourneys;
	  v.fuelPurchases = associatedFuelPurchases;
	  v.services = associatedServices;

	  return v;
	});

	return ({
	  vehicles: mappedVehicles
	});
};
