/**
 * Vehicle.js
 */
import moment from "moment";
import {Service} from "./Service";

/**
 * Vehicle model class
 * @class
 */
export class Vehicle {
  _uuid;
  _manufacturer;
  _model;
  _year;
  _odometer;
  _registration;
  _tankSize;
  _fuelEconomy;
  _bookings;
  _journeys;
  _fuelPurchases;
  _services;
  _createdAt;
  _updatedAt;

  /**
   * Creates a new Vehicle
   * @param {string} manufacturer - manufacturer brand of this vehicle
   * @param {string} model - model of this vehicle
   * @param {number} year - year of this vehicle
   * @param {number} odometer - odometer reading of this vehicle
   * @param {string} registration - registration number of this vehicle
   * @param {number} tankSize - tank capacity of this vehicle
   * @param {Array<Booking>} bookings - bookings associated with this vehicle
   * @param {Array<Journey>} journeys - journeys associated with this vehicle
   * @param {Array<FuelPurchase>} fuelPurchases - fuel purchases associated with this vehicle
   * @param {Array<Service>} services - services associated with this vehicle
   * @param {string} uuid - UUID of this vehicle
   * @param {string} createdAt - timestamp generated when this vehicle is created
   * @param {string|null} updatedAt - timestamp generated when this vehicle is updated
   */
  constructor(manufacturer, model, year, odometer, registration, tankSize, bookings = [], journeys = [], fuelPurchases = [], services = [], uuid = require('uuid/v4')(), createdAt = moment().format('DD/MM/YYYY hh:mm:ss A'), updatedAt = null) {
	this._uuid = uuid;
	this._manufacturer = manufacturer;
	this._model = model;
	this._year = year;
	this._odometer = odometer;
	this._registration = registration;
	this._tankSize = tankSize;
	this._bookings = bookings;
	this._journeys = journeys;
	this._fuelPurchases = fuelPurchases;
	this._services = services;
	this._fuelEconomy = this.calculateFuelEconomy();
	this._createdAt = createdAt;
	this._updatedAt = updatedAt;
  }

  /**
   * Adds a new booking to {@link bookings}
   * @param {Booking} newBooking - new booking to be added to {@link bookings}
   */
  addBooking(newBooking) {
	this.bookings.push(newBooking);
	this.updateVehicleOdometer(null, false);
  }

  /**
   * Removes a booking from {@link bookings} by its UUID
   * @param {string} bookingUuid - the UUID of the booking to be removed
   */
  removeBookingByUUID(bookingUuid) {
	if (bookingUuid) {
	  const bookingsCopy = [...this.bookings];
	  const bookingToBeDeleted = bookingsCopy.find(booking => booking.uuid === bookingUuid);

	  if (bookingToBeDeleted) {
		this.bookings = bookingsCopy.filter(booking => booking.uuid !== bookingToBeDeleted.uuid);
		this.updateVehicleOdometer(null, false);
	  }
	}
  }

  /**
   * Removes a journey from {@link journeys} by its associated bookingID
   * @param {Journey} journey - the journey to be removed
   * @param {string} bookingUuid - the UUID of the booking that contains the journey to be removed
   */
  removeJourneyByBookingUUID(journey, bookingUuid) {
	this.bookings.find(b => b.uuid === bookingUuid).removeJourney(journey);
	this.updateVehicleOdometer(null, false);
  }

  /**
   * Adds a new journey to {@link journeys}
   * @param {Journey} newJourney - the new journey to be added
   */
  addJourney(newJourney) {
	this.bookings.find(b => b.uuid === newJourney.bookingUuid).addJourney(newJourney);
	this.journeys.push(newJourney);
	this.updateVehicleOdometer(null, false);
  }

  /**
   * Adds a new service to {@link services}
   * @param {Service} newService - new service to be added
   */
  addService(newService) {
	this.services.push(newService);
  }

  removeServiceByUUID(serviceUuid) {
	if (serviceUuid) {
	  const servicesCopy = [...this.services];
	  const serviceToBeDeleted = servicesCopy.find(service => service.uuid === serviceUuid);

	  if (serviceToBeDeleted) {
		this.services = servicesCopy.filter(service => service.uuid !== serviceToBeDeleted.uuid);
	  }
	}
  }

  /**
   * Adds a fuelPurchase to {@link fuelPurchases}
   * @param {FuelPurchase} newFuelPurchase - The new fuel purchase to be added
   */
  addFuelPurchase(newFuelPurchase) {
	this.bookings.find(b => b.uuid === newFuelPurchase.bookingUuid).addFuelPurchase(newFuelPurchase);
	this.fuelPurchases.push(newFuelPurchase);
  }

  /**
   * Removes a fuel purchase based on its bookingID
   * @param {FuelPurchase} fuelPurchase - The fuel purchase to be removed
   * @param {string} bookingUuid - The UUID of the booking associated with this fuel purchase
   */
  removeFuelPurchaseByBookingUUID(fuelPurchase, bookingUuid) {
	this.bookings.find(b => b.uuid === bookingUuid).removeFuelPurchase(fuelPurchase);
  }

  get bookings() {
	return this._bookings;
  }

  set bookings(value) {
	this._bookings = value;
  }

  get journeys() {
	return this._journeys;
  }

  set journeys(value) {
    this._journeys = value;
  }

  get services() {
	return this._services;
  }

  set services(value) {
	this._services = value;
  }

  get fuelPurchases() {
	return this._fuelPurchases;
  }

  set fuelPurchases(value) {
	this._fuelPurchases = value;
  }

  get uuid() {
	return this._uuid;
  }

  set uuid(value) {
	this._uuid = value;
  }

  get manufacturer() {
	return this._manufacturer;
  }

  set manufacturer(value) {
	this._manufacturer = value;
  }

  get model() {
	return this._model;
  }

  set model(value) {
	this._model = value;
  }

  get year() {
	return this._year;
  }

  set year(value) {
	this._year = value;
  }

  get odometer() {
	return this._odometer;
  }

  set odometer(value) {
	this._odometer = value;
  }

  get registration() {
	return this._registration;
  }

  set registration(value) {
	this._registration = value;
  }

  get tankSize() {
	return this._tankSize;
  }

  set tankSize(value) {
	this._tankSize = value;
  }

  get createdAt() {
	return this._createdAt;
  }

  set createdAt(value) {
	this._createdAt = value;
  }

  get updatedAt() {
	return this._updatedAt;
  }

  set updatedAt(value) {
	this._updatedAt = value;
  }

  /**
   * Returns an object that contains all details of this vehicle in a readable format
   * @returns {{Vehicle: string, "Revenue recorded": string, "Kilometers since the last service": (string), "Requires service": (string), "Total services done": (number|string), "Total Kilometers Travelled": string, "Fuel economy": string, "Registration Number": (string)}}
   */
  printDetails() {
	return ({
	  'Vehicle': `${this.manufacturer} ${this.model} (${this.year})`,
	  'Registration Number': this.registration,
	  'Total Kilometers Travelled': `${this.odometer} km`,
	  'Total services done': Service.getTotalServicesDone(this.services),
	  'Revenue recorded': `$ ${Number.parseFloat(this.calculateRevenueRecorded()).toFixed(2)}`,
	  'Kilometers since the last service': Number.parseFloat(Service.getLastServiceOdometerReading(this.services)) ? `${this.odometer - Service.getLastServiceOdometerReading(this.services)} km` : Service.getLastServiceOdometerReading(this.services),
	  'Fuel economy': `${this.calculateFuelEconomy()}`,
	  'Requires service': Service.requiresService(this.services) ? 'Yes' : 'No'
	})
  }

  /**
   * Calculates total revenue associated with this vehicle based on its bookings
   * @returns {number} totalRevenue - total revenue recorded for this vehicle
   */
  calculateRevenueRecorded() {
	return this.bookings.reduce((total, b) => {
	  if (Number.parseFloat(b.cost)) {
		total += b.cost;
	  }
	  return total;
	}, 0);
  }

  /**
   * Calculates the fuel economy for this vehicle by dividing the total cost of all fuel purchases by
   * the total distance travelled across all recorded journeys
   * @returns {string} fuelEconomy - The fuel economy in a readable format
   */
  calculateFuelEconomy() {
	const fuelPurchases =
	  this.bookings.reduce((fuelPurchases, booking) => {
		fuelPurchases.push(...booking.fuelPurchases);
		return fuelPurchases;
	  }, []);

	const totalFuelPurchaseCost = fuelPurchases.reduce((totalCost, fuelPurchase) => {
	  totalCost += fuelPurchase.fuelPrice * fuelPurchase.fuelQuantity;
	  return totalCost;
	}, 0);

	const totalDistanceTravelled = this.calculateTotalDistanceTravelled();

	if (Number.isNaN(totalFuelPurchaseCost) || Number.isNaN(totalDistanceTravelled) || !Number.isFinite((totalFuelPurchaseCost / totalDistanceTravelled))) {
	  return 'Not enough data recorded to calculate fuel economy';
	}
	const fuelEconomy = (totalFuelPurchaseCost / totalDistanceTravelled);
	return `${(fuelEconomy * 100).toFixed(2)} L / 100 km`;
  }

  /**
   * Calculates the total distance travelled by this vehicle for all recorded journeys
   * @returns {number} totalDistance - The total distance travelled
   */
  calculateTotalDistanceTravelled() {
	return (
	  this.bookings.reduce((totalDistance, booking) => {
		booking.journeys.forEach(j => {
		  totalDistance += j.endOdometer - j.startOdometer
		}, 0);
		return totalDistance;
	  }, 0)
	)
  }

  /**
   * Updates this vehicle's odometer based on its journeys
   * @param {Function|undefined} callback - runs after the vehicle has been updated on firebase
   * @param {Boolean} updateRemote - if true, also updates the remote database (defaults to true)
   */
  updateVehicleOdometer(callback = undefined, updateRemote = true) {
	if (this.bookings.length) {
	  // get all journeys that end today
	  if (this.bookings.length) {
		const todaysJourneys = this.bookings.reduce((j, b) => {
		  if (b.journeys.length) {
			j.push(...b.journeys.filter(j => moment(j.endedAt).isSame(moment(), 'days')));
		  }
		  return j;
		}, []);


		// get greatest journeyEndOdometerReading for all journeys that end today
		const greatestEndOdometer = todaysJourneys.reduce((greatestEndOdometer, j) => {
		  return Math.max(greatestEndOdometer, j.endOdometer);
		}, 0);

		// update odometer reading for this vehicle
		this.odometer = greatestEndOdometer ? greatestEndOdometer : this.odometer;
	  }
	}
  }
}
