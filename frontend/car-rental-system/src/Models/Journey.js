/**
 * Journey.js
 */
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

/**
 * Journey model class
 * @class
 */
export class Journey {
  _uuid;
  _booking;
  _bookingUuid;
  _vehicle;
  _vehicleUuid;
  _startOdometer;
  _endOdometer;
  _startedAt;
  _endedAt;
  _journeyFrom;
  _journeyTo;
  _createdAt;
  _updatedAt;

  /**
   * Creates a new Journey
   * @param {string} bookingUuid - UUID of the booking associated with this journey
   * @param {string} vehicleUuid - UUID of the vehicle associated with this journey
   * @param {number} startOdometer - odometer reading at the start of this journey
   * @param {number} endOdometer - odometer reading at the end of this journey
   * @param {Date|string} startedAt - start date of this journey
   * @param {Date|string} endedAt - end date of this journey
   * @param {string} journeyFrom - location where the journey started
   * @param {string} journeyTo - location where the journey ended
   * @param {string} uuid - UUID of this journey
   * @param {string} createdAt - timestamp generated when this journey is created
   * @param {string|null} updatedAt - timestamp generated when this journey is updated
   */
  constructor(
    bookingUuid,
    vehicleUuid,
    startOdometer,
    endOdometer,
    startedAt,
    endedAt,
    journeyFrom,
    journeyTo,
    uuid = uuidv4(),
    createdAt = moment().format("DD/MM/YYYY hh:mm:ss A"),
    updatedAt = null
  ) {
    this._uuid = uuid;
    this._bookingUuid = bookingUuid;
    this._vehicleUuid = vehicleUuid;
    this._startOdometer = startOdometer;
    this._endOdometer = endOdometer;
    this._startedAt = startedAt;
    this._endedAt = endedAt;
    this._journeyFrom = journeyFrom;
    this._journeyTo = journeyTo;
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

  get journeyFrom() {
    return this._journeyFrom;
  }

  set journeyFrom(value) {
    this._journeyFrom = value;
  }

  get journeyTo() {
    return this._journeyTo;
  }

  set journeyTo(value) {
    this._journeyTo = value;
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
