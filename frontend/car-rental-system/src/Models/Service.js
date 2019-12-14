/**
 * Service.js
 */
import moment from "moment";

/**
 * Service model class
 * @class
 */
export class Service {
  _uuid;
  _vehicle;
  _vehicleUuid;
  _odometer;
  _servicedAt;
  _createdAt;
  _updatedAt;

  /**
   * Creates a new Service
   * @param {string} vehicleUuid - ID of the vehicle associated with this service
   * @param {number} odometer - odometer reading for this service
   * @param {Date|string} servicedAt - when this service is due
   * @param {string} uuid - UUID of this service
   * @param {string} createdAt - timestamp generated when this service is created
   * @param {string|null} updatedAt - timestamp generated when this service is updated
   */
  constructor(vehicleUuid, odometer, servicedAt, uuid = require('uuid/v4')(), createdAt = moment().format('DD/MM/YYYY hh:mm:ss A'), updatedAt = null) {
	this._uuid = uuid;
	this._vehicleUuid = vehicleUuid;
	this._odometer = odometer;
	this._servicedAt = servicedAt;
	this._createdAt = createdAt;
	this._updatedAt = updatedAt;
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

  get odometer() {
	return this._odometer;
  }

  set odometer(value) {
	this._odometer = value;
  }

  get servicedAt() {
	return this._servicedAt;
  }

  set servicedAt(value) {
	this._servicedAt = value;
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
   * Gets the number of services done up to today
   * @param {Array<Service>} services - full list of services to be scanned
   * @returns {number} numberOfServicesDone - number of services done up to this date
   */
  static getTotalServicesDone = services => {
	return services.filter(s => moment(s.servicedAt).isBefore(moment())).length;
  };

  /**
   * Gets the {@link odometer} of the latest service done up to this date
   * @param {Array<Service>} services - full list of services to be scanned
   * @returns {string|number} odometer - the latest service odometer reading or an error
   * message, when no services in {@link services} have been made before this date
   */
  static getLastServiceOdometerReading = services => {
	if (services.length) {
	  const now = moment();
	  const servicesCopy = [...services];
	  const firstServicesBeforeToday = servicesCopy.sort((firstService, secondService) => {
		const firstServiceDate = moment(firstService.servicedAt);
		const secondServiceDate = moment(secondService.servicedAt);
		return secondServiceDate.diff(firstServiceDate, 'days');
	  }).find(s => moment(s.servicedAt).isBefore(now));

	  if (firstServicesBeforeToday) {
		return firstServicesBeforeToday.odometer;
	  }
	  return 'No services have been scheduled before today'
	}
	return 'No services have been scheduled yet';
  };

  /**
   * Determines whether there a service due
   * @param {Array<Service>} services - full list of services to be scanned
   * @returns {boolean} serviceDue
   */
  static requiresService = services => {
	return services.some(service => moment(service.servicedAt).isSameOrAfter(moment(), 'days'));
  }
}
