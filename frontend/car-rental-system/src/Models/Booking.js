/**
 * Booking.js
 */
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

/**
 * Booking model class
 * @class
 */
export class Booking {
  _uuid;
  _vehicleUuid;
  _type;
  _journeys;
  _fuelPurchases;
  _cost;
  _startedAt;
  _endedAt;
  _startOdometer;
  _endOdometer;
  _createdAt;
  _updatedAt;

  /**
   * Creates a new Booking
   * @param {string} vehicleUuid - ID of the vehicle associated with this booking
   * @param {string} type - one of: "D" (per day) or "K" (per kilometre)
   * @param {Date|string} startedAt - booking start date in the format YYYY-MM-DD
   * @param {Date|string} endedAt - booking end date in the format YYYY-MM-DD
   * @param {number} startOdometer - initial odometer reading of the vehicle
   * @param {number|null} endOdometer - final odometer reading of the vehicle
   * @param {Array<Journey>} journeys - journeys associated with this booking
   * @param {Array<FuelPurchase>} fuelPurchases - fuel purchases associated with this booking
   * @param {string} uuid - UUID of this booking
   * @param {string} createdAt - timestamp generated when this booking is created
   * @param {string|null} updatedAt - timestamp generated when this booking is updated
   */
  constructor(
    vehicleUuid,
    type,
    startedAt,
    endedAt,
    startOdometer,
    endOdometer = null,
    journeys = [],
    fuelPurchases = [],
    uuid = uuidv4(),
    createdAt = moment().format("DD/MM/YYYY hh:mm:ss A"),
    updatedAt = null
  ) {
    this._uuid = uuid;
    this._vehicleUuid = vehicleUuid;
    this._type = type;
    this._startedAt = startedAt;
    this._endedAt = endedAt;
    this._startOdometer = startOdometer;
    this._endOdometer = endOdometer;
    this._journeys = journeys;
    this._fuelPurchases = fuelPurchases;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._cost = this.calculateBookingCost();
  }

  get uuid() {
    return this._uuid;
  }

  set uuid(value) {
    this._uuid = value;
  }

  get vehicleUuid() {
    return this._vehicleUuid;
  }

  set vehicleUuid(value) {
    this._vehicleUuid = value;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }

  get startedAt() {
    return this._startedAt;
  }

  set startedAt(value) {
    this._startedAt = value;
  }

  get endedAt() {
    return this._endedAt;
  }

  set endedAt(value) {
    this._endedAt = value;
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

  get cost() {
    return this._cost;
  }

  set cost(value) {
    this._cost = value;
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
        if (j.endedAt > lastJourney.endedAt) {
          lastJourney = this.journeys[i];
        }
      });
      this.endOdometer = lastJourney.endOdometer;
    } else {
      this.endOdometer = null;
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
    this.cost = this.calculateBookingCost();
  }

  /**
   * Removes a journey from this.journeys and updated booking cost
   * @param {Journey} journey - the journey to be removed
   */
  removeJourney(journey) {
    this.journeys = this.journeys.filter((j) => j.uuid !== journey.uuid);
    this.updateEndOdometer(null, false);
    this.cost = this.calculateBookingCost();
  }

  /**
   * Removes a fuel purchase from this.fuelPurchases
   * @param {FuelPurchase} fuelPurchase - the fuel purchase to be removed
   */
  removeFuelPurchase(fuelPurchase) {
    this.fuelPurchases = this.fuelPurchases.filter(
      (f) => f.uuid !== fuelPurchase.uuid
    );
  }

  /**
   * Calculates the cost of this booking based on its type and journeys
   * @returns {number} bookingCost - the cost of this booking
   */
  calculateBookingCost() {
    let cost = 0;
    if (this.type === "D") {
      let days = moment(this.endedAt).diff(this.startedAt, "days");
      if (days === 0) days = 1;
      cost = days * 100;
    } else {
      if (this.endOdometer) {
        cost = this.endOdometer - this.startOdometer;
      }
    }
    return cost;
  }
}
