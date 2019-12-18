import {Booking} from "./Booking";
import {Journey} from "./Journey";

describe('Booking', () => {
  it('correctly calculates booking costs', () => {
	const bookingPerDay = new Booking('fake-id', 'D', '2019-11-26', '2019-12-06', 500);

	const expected1 = 1000;
	const actual1 = bookingPerDay.calculateBookingCost();

	const bookingPerKm = new Booking('fake-id', 'K', '2019-11-26', '2019-12-06', 500, 800);

	const expected2 = 300;
	const actual2 = bookingPerKm.calculateBookingCost();

	expect(actual1).toBe(expected1);
	expect(actual2).toBe(expected2);
  });

  it('correctly updates endOdometer after a journey has been added', () => {
	const booking = new Booking('fake-id', 'K', '2019-11-26', '2019-11-28', 500, 800, [], [], 'booking-id');

	booking.journeys.push(new Journey('booking-id', booking.vehicleUuid, 500, 1000, '2019-11-26', '2019-11-27', '', '', 'journey-id'));

	booking.updateEndOdometer(null, false);
	const expected = 1000;
	const actual = booking.endOdometer;

	expect(actual).toBe(expected);
  });
});
