import {Service} from "./Service";
import moment from "moment";

describe('Service', () => {
  it('correctly calculates the most recent odometer reading in a list of services', () => {
	const services = [
	  new Service('fake-id', 500, '2019-11-20', 'service-1'),
	  new Service('fake-id', 700, '2019-11-24', 'service-1'),
	  new Service('fake-id', 800, '2019-11-25', 'service-1'),
	  new Service('fake-id', 1000, moment().add(10, 'days').format('YYYY-MM-DD'), 'service-1')
	];

	const expected = 800;
	const actual = Service.getLastServiceOdometerReading(services);

	expect(actual).toBe(expected);
  });

  it('correctly calculates the number of services done up to this date', () => {
	const services = [
	  new Service('fake-id', 500, moment().subtract(5, 'days').format('YYYY-MM-DD'), 'service-1'),
	  new Service('fake-id', 700, moment().subtract(2, 'days').format('YYYY-MM-DD'), 'service-1'),
	  new Service('fake-id', 800, moment().format('YYYY-MM-DD'), 'service-1'),
	  new Service('fake-id', 1000, moment().add(10, 'days').format('YYYY-MM-DD'), 'service-1')
	];

	const expected = 3;
	const actual = Service.getTotalServicesDone(services);

	expect(actual).toBe(expected);
  });

  it('correctly determines whether a vehicle needs servicing', () => {
	const services1 = [
	  new Service('fake-id', 500, moment().subtract(5, 'days').format('YYYY-MM-DD'), 'service-1'),
	  new Service('fake-id', 700, moment().subtract(2, 'days').format('YYYY-MM-DD'), 'service-1'),
	  new Service('fake-id', 800, moment().format('YYYY-MM-DD'), 'service-1')
	];

	const expected1 = true;
	const actual1 = Service.requiresService(services1);

	const services2 = [
	  new Service('fake-id', 500, moment().subtract(5, 'days').format('YYYY-MM-DD'), 'service-1'),
	  new Service('fake-id', 700, moment().subtract(1, 'days').format('YYYY-MM-DD'), 'service-1')
	];

	const expected2 = false;
	const actual2 = Service.requiresService(services2);

	expect(actual1).toBe(expected1);
	expect(actual2).toBe(expected2);
  })
});
