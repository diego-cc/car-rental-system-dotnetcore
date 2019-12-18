/**
 * App.js
 */
import React from 'react';
import {Navigation} from "../Navigation/Navigation";
import {BrowseVehicles} from "../BrowseVehicles/BrowseVehicles";
import {Route, Switch} from 'react-router-dom';
import {AddVehicle} from "../AddVehicle/AddVehicle";
import {AppProvider} from "../../AppContext/AppContext";
import {EditVehicle} from "../EditVehicle/EditVehicle";
import {AddBooking} from "../AddBooking/AddBooking";
import {AddService} from "../AddService/AddService";
import {AddJourney} from "../AddJourney/AddJourney";
import {AddJourneyForm} from "../AddJourney/AddJourneyForm";
import {AddFuelPurchase} from "../AddFuelPurchase/AddFuelPurchase";
import {AddFuelPurchaseForm} from "../AddFuelPurchase/AddFuelPurchaseForm";
import {ShowVehicle} from "../ShowVehicle/ShowVehicle";
import {Vehicle} from "../../Models/Vehicle";
import {Booking} from "../../Models/Booking";
import {Journey} from "../../Models/Journey";
import {Service} from "../../Models/Service";
import {FuelPurchase} from "../../Models/FuelPurchase";
import {Dashboard} from "../Dashboard/Dashboard";
import {calculateTotalRevenue} from "./calculateTotalRevenue";
import moment from "moment";

/**
 * App component - entry point of this application
 */
export class App extends React.Component {
  constructor(props) {
	super(props);
	/**
	 * Automatically dismisses notifications after 3.5 secs
	 */
	this.dismissNotification = () => {
	  setTimeout(() => {
		this.setState({
		  notification: {
			display: false,
			message: ''
		  }
		})
	  }, 3500)
	};

	/**
	 * Edits a vehicle and updates both the state and firebase
	 * @param {Vehicle} vehicle - a vehicle object that has the same ID as the vehicle to be
	 * edited (for immutability), containing updated data
	 * @param {Boolean} updateRemote - optional parameter to also update the remote database
	 * (defaults to true)
	 */
	this.editVehicle = (vehicle, updateRemote = true) => {
	  let fieldsChanged = {};
	  this.setState({
		loading: true
	  }, () => {
		this.setState(prevState => {
		  const {vehicles} = {...prevState};
		  const oldVehicleIndex = vehicles.findIndex(v => v.uuid === vehicle.uuid);
		  const oldVehicle = vehicles[oldVehicleIndex];
		  fieldsChanged = Object
			.keys(oldVehicle)
			.reduce((fields, field) => {
			  if ((oldVehicle[field] !== vehicle[field]) && !Array.isArray(vehicle[field])) {
				fields[field] = vehicle[field];
			  }
			  return fields;
			}, {});
		  vehicles[oldVehicleIndex] = vehicle;

		  return ({
			...prevState,
			vehicles,
			loading: updateRemote
		  })
		}, () => {
		  if (updateRemote) {
			let payload = {};

			Object.keys({...vehicle}).forEach(k => {
			  const propertyMatch = k.slice(1);
			  if (!(propertyMatch === 'createdAt' || propertyMatch === 'updatedAt')) {
				payload[propertyMatch] = vehicle[k];
			  }
			});
			console.log('Payload: ', payload);
			fetch(`/api/vehicles/${vehicle.uuid}`, {
			  method: 'PUT',
			  headers: {
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(payload)
			})
			  .then(() => {
				this.setState({
				  loading: false,
				  notification: {
					display: true,
					message: 'The vehicle has been successfully updated'
				  }
				}, this.dismissNotification)
			  })
			  .catch(err => {
				this.setState({
				  loading: false,
				  notification: {
					display: true,
					message: `Could not updated vehicle: ${err.message}`
				  }
				}, this.dismissNotification)
			  })
		  }
		});
	  })
	};

	/**
	 * Adds a new resource and updates both the state and firebase
	 * @param {string} resourceType - one of: "vehicle", "booking", "journey", "service", "fuel
	 * purchase" or "fuelPurchase"
	 * @param {Vehicle|Booking|Journey|Service|FuelPurchase} resource
	 * @param {Boolean} updateRemote - optional parameter to also update the remote database
	 * (defaults to true)
	 */
	this.addResource = (resourceType, resource, updateRemote = true) => {
	  if (!resourceType || !resource) {
		return this.setState({
		  notification: {
			display: true,
			message: 'Error: missing resource or resource type'
		  }
		}, this.dismissNotification)
	  }
	  let collectionName, collection;

	  switch (resourceType.trim().toLowerCase()) {
		case 'vehicle':
		  collectionName = 'vehicles';
		  break;

		case 'booking':
		  collectionName = 'bookings';
		  break;

		case 'service':
		  collectionName = 'services';
		  break;

		case 'journey':
		  collectionName = 'journeys';
		  break;

		case 'fuelpurchase':
		case 'fuel purchase':
		  collectionName = 'fuelPurchases';
		  break;

		default:
		  break;
	  }
	  let selectedVehicle, selectedVehicleIndex;
	  this.setState(prevState => {
		collection = collectionName && prevState[collectionName];
		if (!collection) {
		  return ({
			notification: {
			  display: true,
			  message: 'Error: invalid resource type provided'
			}
		  })
		} else {
		  const {vehicles} = prevState;
		  switch (collectionName) {
			case 'services':
			case 'bookings':
			  selectedVehicle = vehicles.find(v => v.uuid === resource.vehicleUuid);
			  resource._vehicleUuid = selectedVehicle.uuid;
			  selectedVehicleIndex = vehicles.findIndex(v => v.uuid === resource.vehicleUuid);
			  if (collectionName === 'services') {
				selectedVehicle.addService(resource);
			  } else {
				selectedVehicle.addBooking(resource);
			  }
			  break;

			case 'journeys':
			case 'fuelPurchases':
			  selectedVehicle = vehicles.find(v => v.bookings.some(b => b.uuid === resource.bookingUuid));
			  resource._vehicleUuid = selectedVehicle.uuid;
			  selectedVehicleIndex = vehicles.findIndex(v => v.bookings.some(b => b.uuid === resource.bookingUuid));
			  if (collectionName === 'journeys') {
				selectedVehicle.addJourney(resource);
			  } else {
				selectedVehicle.addFuelPurchase(resource);
			  }
			  break;

			default:
			  collection.push(resource);
			  break;
		  }
		}

		if (collectionName === 'vehicles') {
		  return ({
			loading: true,
			vehicles: collection
		  })
		} else {
		  prevState.vehicles[selectedVehicleIndex] = selectedVehicle;
		  return ({
			loading: true,
			vehicles: [...prevState.vehicles]
		  })
		}
	  }, () => {
		if (collectionName && collection) {
		  if (updateRemote) {
		    console.log(resource);
			const payload = {};
			Object.keys(resource).forEach(k => {
			  if (resource.hasOwnProperty(k)) {
				let matchProperty = k.slice(1);
				if (!(matchProperty === 'createdAt' || matchProperty === 'updatedAt')) {
				  payload[matchProperty] = resource[k];
				}
			  }
			});
			console.log('Sending to remote: ', payload);
			if (collectionName === 'fuelPurchases') collectionName = 'fuel_purchases';
			fetch(`/api/${collectionName}`, {
			  method: 'POST',
			  body: JSON.stringify(payload),
			  headers: {
				'Content-Type': 'application/json; charset=utf-8'
			  }
			})
			  .then(() => {
				this.setState(prevState => ({
				  loading: false,
				  revenue: calculateTotalRevenue(prevState.vehicles),
				  notification: {
					display: true,
					message: `The new ${resourceType} has been successfully added to the system`
				  }
				}), this.dismissNotification)
			  })
			  .catch(err => {
				this.setState({
				  loading: false,
				  notification: {
					display: true,
					message: `Could not add new ${resourceType}. Error: ${err.message}`
				  }
				}, this.dismissNotification)
			  });
		  }
		} else {
		  this.setState({
			notification: {
			  display: false,
			  message: ''
			}
		  })
		}
	  })
	};

	/**
	 * Deletes a resource (after confirmation by the user) from both the state and firebase
	 * @param {string} resourceType - one of: "vehicle", "booking", "journey", "service", "fuel
	 * purchase" or "fuelPurchase"
	 * @param {Vehicle|Booking|Journey|Service|FuelPurchase} resource
	 * @param {Boolean} updateRemote - optional parameter to also update the remote database
	 * (defaults to true)
	 */
	this.confirmDeleteResource = (resourceType, resource, updateRemote = true) => {
	  if (resourceType && resource) {
		this.setDeleteResourceModalShow(null, null, () => {
		  this.setState(prevState => ({
			...prevState,
			loading: true
		  }), () => {
			let collection;
			switch (resourceType.trim().toLowerCase()) {
			  case 'vehicle':
				collection = 'vehicles';
				break;

			  case 'journey':
				collection = 'journeys';
				break;

			  case 'service':
				collection = 'services';
				break;

			  case 'booking':
				collection = 'bookings';
				break;

			  case 'fuel purchase':
			  case 'fuelpurchase':
				collection = 'fuel_purchases';
				break;

			  default:
				break;
			}
			if (collection) {
			  if (updateRemote) {
				fetch(`/api/${collection}/${resource.uuid}`, {
				  method: 'DELETE'
				})
				  .then(() => {
					this.componentDidMount();
					this.setState({
					  notification: {
						display: true,
						message: `The ${resourceType} has been successfully deleted`
					  }
					}, this.dismissNotification)
				  })
				  .catch(err => {
					this.setState({
					  loading: false,
					  notification: {
						display: true,
						message: `Could not delete ${resourceType}: ${err.message}`
					  }
					}, this.dismissNotification)
				  });
			  }
			} else {
			  this.setState({
				loading: false,
				notification: {
				  display: true,
				  message: `Error: the collection associated with the item to be deleted was not found`
				}
			  }, this.dismissNotification)
			}
		  })
		})
	  }
	};

	/**
	 * Changes the state of the delete modal
	 * @param {string|null} resourceType - one of: "vehicle", "booking", "journey", "fuelPurchase", "fuel purchase"
	 * or "service"
	 * @param {Vehicle|Booking|Journey|FuelPurchase|Service} resource - the resource to be deleted
	 * @param {Function} callback - an optional callback
	 */
	this.setDeleteResourceModalShow = (resourceType, resource, callback) => {
	  this.setState(prevState => ({
		deleteResource: {
		  ...prevState.deleteResource,
		  resource: resource ? resource : prevState.deleteResource.resource,
		  resourceType: resourceType ? resourceType : prevState.deleteResource.resourceType,
		  showDeleteResourceModal: !prevState.deleteResource.showDeleteResourceModal
		}
	  }), callback);
	};

	this.state = {
	  loading: true,
	  vehicles: [],
	  services: [],
	  bookings: [],
	  journeys: [],
	  fuelPurchases: [],
	  revenue: [],
	  addVehicle: this.addVehicle,
	  editVehicle: this.editVehicle,
	  deleteResource: {
		resourceType: '',
		resource: '',
		confirmDeleteResource: this.confirmDeleteResource,
		showDeleteResourceModal: false,
		setDeleteResourceModalShow: this.setDeleteResourceModalShow
	  },
	  addResource: this.addResource,
	  addBooking: this.addBooking,
	  addJourney: this.addJourney,
	  addService: this.addService,
	  addFuelPurchase: this.addFuelPurchase,
	  notification: {
		display: false,
		message: ''
	  }
	};
  }


  /**
   * Fetches all collections from the database, organises the data in the state and updates
   * odometers, if need be
   */
  componentDidMount() {
	this.setState({
	  loading: true
	}, () => {
	  fetch(`/api/vehicles`)
		.then(data => data.json())
		.then(vehicles => {
		  this.setState({
			vehicles: vehicles.map(v => {
			  const vehicleBookings = v.bookings.map(b => new Booking(b.vehicleUuid, b.type, b.startedAt, b.endedAt, b.startOdometer, null, [], [], b.uuid, b.createdAt, b.updatedAt));

			  const vehicleJourneys = v.journeys.map(j => new Journey(j.bookingUuid, j.vehicleUuid, j.startOdometer, j.endOdometer, j.startedAt, j.endedAt, j.journeyFrom, j.journeyTo, j.uuid, j.createdAt, j.updatedAt));

			  vehicleBookings.forEach(b => {
				const associatedJourneys = vehicleJourneys.filter(j => j.bookingUuid === b.uuid);

				associatedJourneys.forEach(j => {
				  b.addJourney(j);
				})
			  });

			  const vehicleFuelPurchases = v.fuelPurchases.map(f => new FuelPurchase(f.bookingUuid, f.vehicleUuid, f.fuelQuantity, f.fuelPrice, f.uuid, f.createdAt, f.updatedAt));

			  vehicleBookings.forEach(b => {
				const associatedFuelPurchases = vehicleFuelPurchases.filter(f => f.bookingUuid === b.uuid);

				associatedFuelPurchases.forEach(f => {
				  b.addFuelPurchase(f);
				})
			  });

			  const vehicleServices = v.services.map(s => new Service(s.vehicleUuid, s.odometer, s.servicedAt, s.uuid, s.createdAt, s.updatedAt));

			  return new Vehicle(v.manufacturer, v.model, v.year, v.odometer, v.registration, v.tankSize, vehicleBookings, vehicleJourneys, vehicleFuelPurchases, vehicleServices, v.uuid, v.createdAt, v.updatedAt);
			})
		  }, () => {
			this.setState({
			  revenue: calculateTotalRevenue(this.state.vehicles),
			  loading: false
			})
		  })
		})
		.catch(console.error);
	})
  }

  /**
   * Fetches a collection from firebase and adds it to the state
   * @param {string} collection - one of: "vehicles", "bookings", "journeys, "services" or
   * "fuelPurchases"
   * @returns {Promise<firebase.firestore.QuerySnapshot>}
   */
  fetchCollection = async (collection) => {
	let formattedCollection = collection.trim().toLowerCase();
	if (formattedCollection === 'fuelpurchases' || formattedCollection === 'fuel purchases') {
	  formattedCollection = 'fuel_purchases';
	}

	let fetchResult, collectionResources, data;
	try {
	  fetchResult = await fetch(`/api/${formattedCollection}`);
	  collectionResources = await fetchResult.json();
	  data = collectionResources.map(resource => {
		switch (formattedCollection) {
		  case 'vehicles':
			resource = new Vehicle(resource.manufacturer, resource.model, resource.year, resource.odometer, resource.registration, resource[`tank_size`], resource.uuid, resource[`created_at`], resource[`updated_at`]);
			break;

		  case 'bookings':
			resource = new Booking(resource[`vehicle_uuid`], resource.type, resource[`started_at`], resource[`ended_at`], resource[`start_odometer`], resource[`end_odometer`], resource.uuid, resource[`created_at`], resource[`updated_at`]);
			break;

		  case 'journeys':
			resource = new Journey(resource[`booking_uuid`], resource[`vehicle_uuid`], resource[`start_odometer`], resource[`end_odometer`], resource[`started_at`], resource[`ended_at`], resource[`journey_from`], resource[`journey_to`], resource.uuid, resource[`created_at`], resource[`updated_at`]);
			break;

		  case 'fuel_purchases':
			resource = new FuelPurchase(resource[`booking_uuid`], resource[`vehicle_uuid`], resource[`fuel_quantity`], resource[`fuel_price`], resource.uuid, resource[`created_at`], resource[`updated_at`]);
			break;

		  case 'services':
			resource = new Service(resource[`vehicle_uuid`], resource.odometer, resource[`serviced_at`], resource.uuid, resource[`created_at`], resource[`updated_at`]);
			break;

		  default:
			break;
		}
		return resource;
	  });
	  return data;
	} catch (err) {
	  throw err;
	}
  };

  /**
   * Fetches multiple collections from firebase
   * @param {Array<string>|string} collections - array of collection names to be fetched
   * @returns {Object} data
   */
  async fetchCollections(...collections) {
	let vehicles, bookings, journeys, fuelPurchases, services;
	try {
	  /**
	   * The callback that is passed to Array.forEach, Array.map, etc. is synchronous
	   * So I have to fetch one by one
	   * Too bad :(
	   */
	  vehicles = await this.fetchCollection('vehicles');
	  bookings = await this.fetchCollection('bookings');
	  journeys = await this.fetchCollection('journeys');
	  fuelPurchases = await this.fetchCollection('fuelPurchases');
	  services = await this.fetchCollection('services');

	  return ({
		vehicles,
		bookings,
		journeys,
		fuelPurchases,
		services
	  });
	} catch (err) {
	  throw err;
	}
  }

  render() {
	return (
	  <AppProvider value={this.state}>
		<Navigation/>
		<Switch>
		  <Route exact path="/" render={props => <Dashboard {...props} />}/>
		  <Route path="/browse">
			<BrowseVehicles/>
		  </Route>
		  <Route path="/add" render={(props) => <AddVehicle {...props} />}/>
		  <Route path="/show/:vehicleID" render={(props) => <ShowVehicle {...props} />}/>
		  <Route path="/edit/:vehicleID" render={(props) => <EditVehicle {...props} />}/>
		  <Route path="/addBooking/:vehicleID" render={(props) => <AddBooking {...props} />}/>
		  <Route path="/addJourney/:vehicleID" render={(props) => <AddJourney {...props} />}/>
		  <Route path="/addJourneyForm/:bookingID"
				 render={(props) => <AddJourneyForm {...props} />}/>
		  <Route path="/addService/:vehicleID" render={(props) => <AddService {...props} />}/>
		  <Route path="/addFuelPurchase/:vehicleID"
				 render={(props) => <AddFuelPurchase {...props} />}/>
		  <Route path="/addFuelPurchaseForm/:bookingID"
				 render={(props) => <AddFuelPurchaseForm {...props} />}/>
		  <Route path="*" render={(props) => <BrowseVehicles {...props}/>}/>
		</Switch>
	  </AppProvider>
	)
  }
}
