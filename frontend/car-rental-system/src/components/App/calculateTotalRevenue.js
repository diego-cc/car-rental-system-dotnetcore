import moment from "moment";

/**
 * @typedef {Object} Revenue
 * @property {string} monthAndYear - month / year of the revenue recorded
 * @property {number} revenue - revenue recorded for this month and year
 */
/**
 * Calculates and maps total revenue generated (by month and year, for the last 6 months) by all
 * vehicles in the system
 * @param {Array<Vehicle>} vehicles - vehicles registered in the system
 * @param {Object} state - current state of the App component (optional)
 * @returns {Array<Revenue>} data - mapped revenue data
 */
export const calculateTotalRevenue = (vehicles, state = null) => {
  let data = [];
  if (state) {
	vehicles = state.vehicles;
  }
  if (vehicles && vehicles.length) {
	vehicles.forEach(v => {
	  const vehicleRevenue =
		v
		  .bookings
		  .reduce((mappedBookings, b) => {
			const {cost} = b;
			const bookingMonthAndYear = moment(b.startedAt, "YYYY-MM-DD").format('MMMM YYYY');
			const mappedBooking = {
			  bookingMonthAndYear,
			  cost
			};
			mappedBookings.push(mappedBooking);
			return mappedBookings;
		  }, [])
		  .sort((mappedBooking1, mappedBooking2) => {
			return moment(mappedBooking1.bookingMonthAndYear, 'MMMM YYYY').diff(moment(mappedBooking2.bookingMonthAndYear, 'MMMM YYYY'))
		  })
		  .reduce((bookingsByMonthAndYear, mappedBooking) => {
			if (bookingsByMonthAndYear.some(b => moment(b.monthAndYear, 'MMMM YYYY').isSame(moment(mappedBooking.bookingMonthAndYear, 'MMMM YYYY')))) {
			  bookingsByMonthAndYear[bookingsByMonthAndYear.findIndex(entry => moment(entry.monthAndYear, 'MMMM YYYY').isSame(moment(mappedBooking.bookingMonthAndYear, 'MMMM YYYY')))].revenue += mappedBooking.cost;
			} else {
			  bookingsByMonthAndYear.push({
				monthAndYear: mappedBooking.bookingMonthAndYear,
				revenue: mappedBooking.cost
			  })
			}
			return bookingsByMonthAndYear;
		  }, []);
	  data.push(...vehicleRevenue);
	});
	data =
	  data
		.reduce((mappedRevenue, entry) => {
		  if (mappedRevenue.some(r => moment(r.monthAndYear, 'MMMM YYYY').isSame(moment(entry.monthAndYear, 'MMMM YYYY')))) {
			mappedRevenue[mappedRevenue.findIndex(r => moment(r.monthAndYear, 'MMMM YYYY').isSame(moment(entry.monthAndYear, 'MMMM YYYY')))].revenue += entry.revenue;
		  } else {
			mappedRevenue.push({
			  monthAndYear: entry.monthAndYear,
			  revenue: entry.revenue
			})
		  }
		  return mappedRevenue;
		}, []);
  }
  return data
	.sort((revenue1, revenue2) => {
	  return moment(revenue1.monthAndYear, 'MMMM YYYY').diff(moment(revenue2.monthAndYear, 'MMMM' +
		' YYYY'))
	})
	.filter(revenue => moment(revenue.monthAndYear, 'MMMM YYYY').isSameOrBefore(moment(moment(), 'MMMM YYYY')))
	.filter(revenue => moment(revenue.monthAndYear, 'MMMM YYYY').isSameOrAfter(moment(moment(), 'MMMM YYYY').subtract(6, 'months')));
};
