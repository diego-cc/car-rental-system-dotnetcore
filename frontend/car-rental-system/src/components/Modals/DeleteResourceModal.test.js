/**
 * DeleteResourceModal.test.js
 */
import React from 'react';
import {fakeAPI, setUpVehicles} from "../../setupTests";
import {AppProvider} from "../../AppContext/AppContext";
import {DeleteResourceModal} from "./DeleteResourceModal";
import {render, wait} from '@testing-library/react';

let contextValue;
const initialContextValue = {
  vehicles: setUpVehicles(fakeAPI).vehicles
};

beforeEach(() => {
  contextValue = {
	...initialContextValue,
	deleteResource: {
	  resourceType: '',
	  resource: null,
	  confirmDeleteResource: () => console.log('confirmDeleteResource'),
	  showDeleteResourceModal: true,
	  setDeleteResourceModalShow: () => contextValue.deleteResource.showDeleteResourceModal = !contextValue.deleteResource.showDeleteResourceModal
	}
  };

});

describe('DeleteResourceModal component', () => {
  it('renders the correct details if the resource is a vehicle', async () => {
	contextValue = {
	  ...contextValue,
	  deleteResource: {
		...contextValue.deleteResource,
		resourceType: 'vehicle',
		resource: contextValue.vehicles.find(v => v.id === 'tesla-123')
	  }
	};

	const tree = (
	  <AppProvider value={contextValue}>
		<DeleteResourceModal/>
	  </AppProvider>
	);

	const {getByText} = render(tree);

	await wait(() => {
	  expect(getByText(/^Manufacturer: Tesla/)).toBeDefined();
	  expect(getByText(/^Model: Roadster/)).toBeDefined();
	  expect(getByText(/^Year: 2008/)).toBeDefined();
	  expect(getByText(/^Odometer reading: 500 km/)).toBeDefined();
	  expect(getByText(/^Registration number: 1TES999/)).toBeDefined();
	  expect(getByText(/^Tank capacity: 0 L/)).toBeDefined();
	});
  }, 9999);

  it('renders the correct details if the resource is a booking', async () => {
	const bookingID = 'tesla-booking';
	contextValue = {
	  ...contextValue,
	  deleteResource: {
		...contextValue.deleteResource,
		resourceType: 'booking',
		resource: contextValue.vehicles.find(v => v.bookings.some(b => b.id === bookingID)).bookings.find(b => b.id === bookingID)
	  }
	};

	const tree = (
	  <AppProvider value={contextValue}>
		<DeleteResourceModal/>
	  </AppProvider>
	);

	const {getByText} = render(tree);

	await wait(() => {
	  expect(getByText(/^Booking vehicle: Tesla Roadster \(2008\)/)).toBeDefined();
	  expect(getByText(/^Booking start date: 25\/11\/2019/)).toBeDefined();
	  expect(getByText(/^Booking end date: 27\/11\/2019/)).toBeDefined();
	  expect(getByText(/^Booking start odometer reading: 500 km/)).toBeDefined();
	  expect(getByText(/^Booking type: Per day/)).toBeDefined();
	  expect(getByText(/^Booking cost: \$ 200.00/)).toBeDefined();
	});
  }, 9999);

  it('renders the correct details if the resource is a journey', async () => {
	const journeyID = 'tesla-journey';
	const bookingID = 'tesla-booking';
	contextValue = {
	  ...contextValue,
	  deleteResource: {
		...contextValue.deleteResource,
		resourceType: 'journey',
		resource: contextValue.vehicles.find(v => v.bookings.some(b => b.id === bookingID)).bookings.find(b => b.id === bookingID).journeys.find(j => j.id === journeyID)
	  }
	};

	const tree = (
	  <AppProvider value={contextValue}>
		<DeleteResourceModal/>
	  </AppProvider>
	);

	const {getByText} = render(tree);

	await wait(() => {
	  expect(getByText(/^Journey vehicle: Tesla Roadster \(2008\)$/)).toBeDefined();
	  expect(getByText(/^Journey start date: 25\/11\/2019$/)).toBeDefined();
	  expect(getByText(/^Journey end date: 25\/11\/2019$/)).toBeDefined();
	  expect(getByText(/^Journey start odometer reading: 500 km$/)).toBeDefined();
	  expect(getByText(/^Journey end odometer reading: 550 km$/)).toBeDefined();
	  expect(getByText(/^Journey from: Perth$/)).toBeDefined();
	  expect(getByText(/^Journey to: Rockingham$/)).toBeDefined();
	});
  }, 9999);

  it('renders the correct details if the resource is a fuel purchase', async () => {
	const fuelPurchaseID = 'tesla-fuel';
	const bookingID = 'tesla-booking';
	contextValue = {
	  ...contextValue,
	  deleteResource: {
		...contextValue.deleteResource,
		resourceType: 'fuelPurchase',
		resource: contextValue.vehicles.find(v => v.bookings.some(b => b.id === bookingID)).bookings.find(b => b.id === bookingID).fuelPurchases.find(f => f.id === fuelPurchaseID)
	  }
	};

	const tree = (
	  <AppProvider value={contextValue}>
		<DeleteResourceModal/>
	  </AppProvider>
	);

	const {getByText} = render(tree);

	await wait(() => {
	  expect(getByText(/Fuel purchased for vehicle: Tesla Roadster \(2008\)$/));
	  expect(getByText(/Fuel quantity: 20 L$/));
	  expect(getByText(/Fuel price: \$ 1.50$/));
	  expect(getByText(/Total cost: \$ 30.00$/));
	});
  }, 9999);

  it('renders the correct details if the resource is a service', async () => {
	const serviceID = 'tesla-service';
	const vehicleID = 'tesla-123';
	contextValue = {
	  ...contextValue,
	  deleteResource: {
		...contextValue.deleteResource,
		resourceType: 'service',
		resource: contextValue.vehicles.find(v => v.id === vehicleID).services.find(s => s.id === serviceID)
	  }
	};

	const tree = (
	  <AppProvider value={contextValue}>
		<DeleteResourceModal/>
	  </AppProvider>
	);

	const {getByText} = render(tree);

	await wait(() => {
	  expect(getByText(/Service vehicle: Tesla Roadster \(2008\)$/)).toBeDefined();
	  expect(getByText(/Serviced at: 10\/12\/2019$/)).toBeDefined();
	  expect(getByText(/Service odometer reading: 1000 km$/)).toBeDefined();
	});
  }, 9999);
});
