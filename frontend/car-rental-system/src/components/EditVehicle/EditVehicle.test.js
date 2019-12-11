import React from 'react';
import {fakeAPI, setUpVehicles} from "../../setupTests";
import moment from "moment";
import {AppProvider} from "../../AppContext/AppContext";
import {MemoryRouter, Route} from "react-router-dom";
import {EditVehicle} from "./EditVehicle";
import {render} from '@testing-library/react';

const cloneDeep = require('lodash.clonedeep');

let contextValue;
const initialContextValue = {
  vehicles: setUpVehicles(fakeAPI).vehicles
};

describe('EditVehicle component', () => {
  it('matches snapshot', () => {
	contextValue = {
	  ...initialContextValue,
	  editVehicle: vehicle => {
		let vehicleToBeEdited = cloneDeep(contextValue.vehicles.find(v => v.id === vehicle.id));
		vehicleToBeEdited = cloneDeep(vehicle);
		vehicleToBeEdited.updatedAt = moment(moment(), 'DD/MM/YYYY hh:mm:ss a');

		contextValue.vehicles[contextValue.vehicles.findIndex(v => v.id === vehicleToBeEdited.id)] = vehicleToBeEdited;
	  }
	};

	const tree = (
	  <AppProvider value={contextValue}>
		<MemoryRouter initialEntries={[`/edit/holden-123`]}>
		  <Route path={`/edit/:vehicleID`} render={props =>
			<EditVehicle {...props} />
		  }
		  />
		</MemoryRouter>
	  </AppProvider>
	);

	const component = render(tree);
	expect(component).toMatchSnapshot();
  })
});
