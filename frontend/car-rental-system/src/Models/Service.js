/**
 * Service.js
 */
import moment from "moment";

/**
 * Service model class
 * @class
 */
export class Service {
  _id;
  _vehicleID;
  _serviceOdometer;
  _servicedAt;
  _createdAt;
  _updatedAt;

  /**
   * Creates a new Service
   * @param {string} vehicleID - ID of the vehicle associated with this service
   * @param {number} serviceOdometer - odometer reading for this service
   * @param {Date|string} servicedAt - when this service is due
   * @param {string} id - ID of this service
   * @param {string} createdAt - timestamp generated when this service is created
   * @param {string|null} updatedAt - timestamp generated when this service is updated
   */
  constructor(vehicleID, serviceOdometer, servicedAt, id = require('uuid/v4')(), createdAt = moment().format('DD/MM/YYYY hh:mm:ss A'), updatedAt = null) {
	this._id = id;
	this._vehicleID = vehicleID;
	this._serviceOdometer = serviceOdometer;
	this._servicedAt = servicedAt;
	this._createdAt = createdAt;
	this._updatedAt = updatedAt;
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

  get serviceOdometer() {
	return this._serviceOdometer;
  }

  set serviceOdometer(value) {
	this._serviceOdometer = value;
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
   * Gets the {@link serviceOdometer} of the latest service done up to this date
   * @param {Array<Service>} services - full list of services to be scanned
   * @returns {string|number} serviceOdometer - the latest service odometer reading or an error
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
		return firstServicesBeforeToday.serviceOdometer;
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
