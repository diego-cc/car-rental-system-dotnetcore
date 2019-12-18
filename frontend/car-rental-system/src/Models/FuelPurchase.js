/**
 * FuelPurchase.js
 */
import moment from "moment";

/**
 * FuelPurchase model class
 * @class FuelPurchase
 */
export class FuelPurchase {
  _uuid;
  _booking;
  _vehicle;
  _bookingUuid;
  _vehicleUuid;
  _fuelPrice;
  _fuelQuantity;
  _createdAt;
  _updatedAt;

  /**
   * Creates a new FuelPurchase
   * @param {string} bookingUuid - UUID of the booking associated with this fuel purchase
   * @param {string} vehicleUuid - UUID of the vehicle associated with this fuel purchase
   * @param {number} fuelQuantity - amount of fuel of this purchase (in litres)
   * @param {number} fuelPrice - price per litre of this fuel purchase
   * @param {string} uuid - UUID of this fuel purchase
   * @param {string} createdAt - timestamp generated when this fuel purchase is created
   * @param {string|null} updatedAt - timestamp generated when this fuel purchase is updated
   */
  constructor(bookingUuid, vehicleUuid, fuelQuantity, fuelPrice, uuid = require('uuid/v4')(), createdAt = moment().format('DD/MM/YYYY hh:mm:ss A'), updatedAt = null) {
    this._uuid = uuid;
    this._bookingUuid = bookingUuid;
    this._vehicleUuid = vehicleUuid;
    this._fuelPrice = fuelPrice;
    this._fuelQuantity = fuelQuantity;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get uuid() {
    return this._uuid;
  }

  set uuid(value) {
    this._uuid = value;
  }

  get bookingUuid() {
    return this._bookingUuid;
  }

  set bookingUuid(value) {
    this._bookingUuid = value;
  }


  get vehicleUuid() {
	return this._vehicleUuid;
  }

  set vehicleUuid(value) {
	this._vehicleUuid = value;
  }

  get fuelQuantity() {
    return this._fuelQuantity;
  }

  set fuelQuantity(value) {
    this._fuelQuantity = value;
  }

  get fuelPrice() {
    return this._fuelPrice;
  }

  set fuelPrice(value) {
    this._fuelPrice = value;
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
}
