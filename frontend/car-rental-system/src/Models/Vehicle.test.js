import {fakeAPI, setUpVehicles} from "../setupTests";
import {Booking} from "./Booking";
import moment from "moment";
import {Journey} from "./Journey";

const cloneDeep = require('lodash.clonedeep');

let initialVehiclesData = cloneDeep(setUpVehicles(fakeAPI).vehicles);
beforeEach(() => {
  initialVehiclesData = cloneDeep(initialVehiclesData);
});

describe('Vehicle component', () => {
  it('correctly calculates the total revenue', () => {
	const tesla = initialVehiclesData[0];
	const expected1 = 200;
	const actual1 = tesla.calculateRevenueRecorded();

	const ranger = initialVehiclesData[1];
	const expected2 = 200;
	const actual2 = ranger.calculateRevenueRecorded();

	expect(actual1).toBe(expected1);
	expect(actual2).toBe(expected2);
  });

  it('correctly calculates the fuel economy', () => {
	const ranger = initialVehiclesData[1];
	const expected = `9.75 L / 100 km`;
	const actual = ranger.calculateFuelEconomy();

	expect(actual).toBe(expected);
  });

  it('correctly calculates the total distance travelled', () => {
	const holden = initialVehiclesData[2];
	const expected = 400;
	const actual = holden.calculateTotalDistanceTravelled();

	expect(actual).toBe(expected);
  });

  it('correctly updates the odometer', () => {
	const tesla = initialVehiclesData[0];
	const teslaBooking = new Booking(tesla.id, 'K', moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), tesla.odometerReading, tesla.odometerReading + 500, 'fake-tesla-booking');

	const teslaJourney = new Journey(teslaBooking.id, teslaBooking.startOdometer, teslaBooking.endOdometer, moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), '', '', 'fake-tesla-journey');

	teslaBooking.journeys.push(teslaJourney);
	tesla.bookings.push(teslaBooking);

	const expected = tesla.odometerReading + 500;
	tesla.updateVehicleOdometer(null, false);

	expect(tesla.odometerReading).toBe(expected);
  });
});
