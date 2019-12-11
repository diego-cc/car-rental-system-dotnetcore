/**
 * Booking.js
 */
import moment from "moment";
import {firebase} from "../Firebase/Firebase";

/**
 * Booking model class
 * @class
 */
export class Booking {
  _id;
  _vehicleID;
  _bookingType;
  _journeys = [];
  _fuelPurchases = [];
  _bookingCost;
  _startDate;
  _endDate;
  _startOdometer;
  _endOdometer;
  _createdAt;
  _updatedAt;

  /**
   * Creates a new Booking
   * @param {string} vehicleID - ID of the vehicle associated with this booking
   * @param {string} bookingType - one of: "D" (per day) or "K" (per kilometre)
   * @param {Date|string} startDate - booking start date in the format YYYY-MM-DD
   * @param {Date|string} endDate - booking end date in the format YYYY-MM-DD
   * @param {number} startOdometer - initial odometer reading of the vehicle
   * @param {number|null} endOdometer - final odometer reading of the vehicle
   * @param {number} id - ID of this booking
   * @param {string} createdAt - timestamp generated when this booking is created
   * @param {string|null} updatedAt - timestamp generated when this booking is updated
   */
  constructor(vehicleID, bookingType, startDate, endDate, startOdometer, endOdometer = null, id = require('uuid/v4')(), createdAt = moment().format('DD/MM/YYYY hh:mm:ss A'), updatedAt = null) {
	this._id = id;
	this._vehicleID = vehicleID;
	this._bookingType = bookingType;
	this._startDate = startDate;
	this._endDate = endDate;
	this._startOdometer = startOdometer;
	this._endOdometer = endOdometer;
	this._createdAt = createdAt;
	this._updatedAt = updatedAt;
	this._bookingCost = this.calculateBookingCost();
  }

  get id() {
	return this._id;
  }

  set id(value) {
	this._id = value;
  }

  get vehicleID() {
	return this._vehicleID;
  }

  set vehicleID(value) {
	this._vehicleID = value;
  }

  get bookingType() {
	return this._bookingType;
  }

  set bookingType(value) {
	this._bookingType = value;
  }

  get startDate() {
	return this._startDate;
  }

  set startDate(value) {
	this._startDate = value;
  }

  get endDate() {
	return this._endDate;
  }

  set endDate(value) {
	this._endDate = value;
  }

  get startOdometer() {
	return this._startOdometer;
  }

  set startOdometer(value) {
	this._startOdometer = value;
  }

  get endOdometer() {
	return this._endOdometer;
  }

  set endOdometer(value) {
	this._endOdometer = value;
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

  get journeys() {
	return this._journeys;
  }

  set journeys(value) {
	this._journeys = value;
  }

  get bookingCost() {
	return this._bookingCost;
  }

  set bookingCost(value) {
	this._bookingCost = value;
  }


  get fuelPurchases() {
	return this._fuelPurchases;
  }

  set fuelPurchases(newFuelPurchases) {
	this._fuelPurchases = newFuelPurchases;
  }

  /**
   * Update endOdometer for this booking if at least one journey has been added
   * @param {Boolean} updateRemote - Provides the option to also update endOdometer in the
   * remote database. Defaults to true.
   * @param {Function|undefined} callback - An optional callback that runs after this booking
   * has been updated on firebase
   */
  updateEndOdometer(callback = undefined, updateRemote = true) {
	if (this.journeys.length) {
	  let lastJourney = this.journeys[0];
	  this.journeys.forEach((j, i) => {
		if (j.journeyEndOdometerReading > lastJourney.journeyEndOdometerReading) {
		  lastJourney = this.journeys[i];
		}
	  });
	  this.endOdometer = lastJourney.journeyEndOdometerReading;
	} else {
	  this.endOdometer = null;
	}
	if (updateRemote) {
	  // update endOdometer on firebase
	  const db = firebase.firestore();
	  db
		.collection('bookings')
		.doc(this.id)
		.update({
		  '_endOdometer': this.endOdometer,
		  '_updatedAt': moment().format('DD/MM/YYYY hh:mm:ss a')
		})
		.then(callback)
		.catch(err => console.dir(err))
	}
  }

  /**
   * Adds a new fuel purchase to this booking
   * @param {FuelPurchase} newFuelPurchase - new fuel purchase to be added to this.fuelPurchases
   */
  addFuelPurchase(newFuelPurchase) {
	this.fuelPurchases.push(newFuelPurchase);
  }

  /**
   * Adds a new journey to this booking and updates booking cost
   * @param {Journey} newJourney - new journey to be added to this.journeys
   */
  addJourney(newJourney) {
	this.journeys.push(newJourney);
	this.updateEndOdometer(null, false);
	this.bookingCost = this.calculateBookingCost();
  }

  /**
   * Removes a journey from this.journeys and updated booking cost
   * @param {Journey} journey - the journey to be removed
   */
  removeJourney(journey) {
	this.journeys = this.journeys.filter(j => j.id !== journey.id);
	this.updateEndOdometer(null, false);
	this.bookingCost = this.calculateBookingCost();
  }

  /**
   * Removes a fuel purchase from this.fuelPurchases
   * @param {FuelPurchase} fuelPurchase - the fuel purchase to be removed
   */
  removeFuelPurchase(fuelPurchase) {
	this.fuelPurchases = this.fuelPurchases.filter(f => f.id !== fuelPurchase.id);
  }

  /**
   * Calculates the cost of this booking based on its type and journeys
   * @returns {number} bookingCost - the cost of this booking
   */
  calculateBookingCost() {
	let bookingCost = 0;
	if (this.bookingType === 'D') {
	  let days = moment(this.endDate).diff(this.startDate, 'days');
	  if (days === 0) days = 1;
	  bookingCost = days * 100;
	} else {
	  if (this.endOdometer) {
		bookingCost = (this.endOdometer - this.startOdometer);
	  }
	}
	return bookingCost;
  }
}
