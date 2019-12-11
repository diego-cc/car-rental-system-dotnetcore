import React from 'react';
import {fakeAPI, setUpVehicles} from "../../setupTests";
import {render} from '@testing-library/react';
import {VehicleDetails} from "./VehicleDetails";
import {AppProvider} from "../../AppContext/AppContext";
import {MemoryRouter, Route} from "react-router-dom";

let contextValue;
const initialContextValue = {
  vehicles: setUpVehicles(fakeAPI).vehicles,
  loading: false,
  notification: {
	display: false,
	message: ''
  },
  deleteResource: {
	resourceType: '',
	resource: '',
	confirmDeleteResource: () => console.log('confirm delete resource'),
	showDeleteResourceModal: false,
	setDeleteResourceModalShow: () => console.log('set delete modal show')
  }
};

describe('VehicleDetails component', () => {
  it('renders the correct details of a vehicle', () => {
	contextValue = {
	  ...initialContextValue
	};
	const vehicle = contextValue.vehicles.find(v => v.id === 'holden-123');

	const component = render(
	  <AppProvider value={contextValue}>
		<MemoryRouter initialEntries={[`/show/holden-123`]}>
		  <Route path={`/show/:vehicleID`}
				 render={props => <VehicleDetails vehicle={vehicle} {...props}/>}
		  />
		</MemoryRouter>
	  </AppProvider>
	);

	expect(component).toMatchSnapshot();
  })
});
