/**
 * setupTests.js
 */
import React from 'react';
import {Vehicle} from "./Models/Vehicle";
import {Booking} from "./Models/Booking";
import moment from "moment";
import {Journey} from "./Models/Journey";
import {Service} from "./Models/Service";
import {FuelPurchase} from "./Models/FuelPurchase";
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

/**
 * Adapter configuration for enzyme
 */
Enzyme.configure({adapter: new Adapter()});

/**
 * An object containing fake seed data to be used in the unit tests
 * @type {{journeys: Array<Journey>, vehicles: Array<Vehicle>, fuelPurchases: Array<FuelPurchase>, services: Array<Service>, bookings: Array<Booking>}}
 */
export const fakeAPI = {
  vehicles: [
	new Vehicle('Tesla', 'Roadster', 2008, 500, '1TES999', 0, 'tesla-123'),
	new Vehicle('Ford', 'Ranger XL', 2015, 800, '1RANGER', 80, 'ranger-123'),
	new Vehicle('Holden', 'Commodore LT', 2018, 800, '1HOLDEN', 61, 'holden-123')
  ],
  bookings: [
	new Booking('tesla-123', 'D', '2019-11-25', '2019-11-27', 500, 600, 'tesla-booking'),
	new Booking('ranger-123', 'K', '2019-11-25', '2019-11-27', 800, 1000, 'ranger-booking'),
	new Booking('holden-123', 'K', '2019-11-25', '2019-11-27', 800, 1200, 'holden-booking')
  ],
  journeys: [
	new Journey('tesla-booking', 500, 550, '2019-11-25', '2019-11-25', "Perth", "Rockingham", 'tesla-journey'),
	new Journey('ranger-booking', 800, 950, '2019-11-25', '2019-11-25', "", "", 'ranger-journey1'),
	new Journey('ranger-booking', 950, 1000, '2019-11-25', '2019-11-25', "", "", 'ranger-journey2'),
	new Journey('holden-booking', 800, 950, '2019-11-25', '2019-11-25', "", "", 'holden-journey1'),
	new Journey('holden-booking', 950, 1200, '2019-11-25', '2019-11-25', "", "", 'holden-journey2')
  ],
  services: [
	new Service('tesla-123', 1000, '2019-12-10', 'tesla-service'),
	new Service('ranger-123', 1500, '2019-12-15', 'ranger-service'),
	new Service('holden-123', 2000, '2019-12-20', 'holden-service')
  ],
  fuelPurchases: [
	new FuelPurchase('tesla-booking', 20, 1.5, 'tesla-fuel'),
	new FuelPurchase('ranger-booking', 15, 1.3, 'ranger-fuel'),
	new FuelPurchase('holden-booking', 30, 1.2, 'holden-fuel')
  ]
};

export const setUpVehicles = initialData => ({
  vehicles: initialData.vehicles.reduce((updatedVehicles, v) => {
	// get all bookings for this vehicle
	const bookings = initialData.bookings.filter(b => b.vehicleID === v.id);

	// get all journeys for this vehicle
	const journeys = initialData.journeys.filter(j => bookings.some(b => b.id === j.bookingID));
	// add journeys to each booking
	journeys.forEach(j => {
	  bookings.find(b => b.id === j.bookingID).journeys.push(j);
	});

	// get all fuel purchases for this vehicle;
	const fuelPurchases = initialData.fuelPurchases.filter(f => bookings.some(b => b.id === f.bookingID));
	// add fuel purchases to each booking
	fuelPurchases.forEach(f => {
	  bookings.find(b => b.id === f.bookingID).fuelPurchases.push(f);
	});

	// add bookings to this vehicle
	v.bookings.push(...bookings);

	// get all services for this vehicle
	const services = initialData.services.filter(s => s.vehicleID === v.id);
	// add services to this vehicle
	v.services.push(...services);

	updatedVehicles.push(v);
	return updatedVehicles;
  }, [])
});
