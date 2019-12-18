import React from 'react';
import {render} from '@testing-library/react';
import {Dashboard} from './Dashboard';
import {AppProvider} from "../../AppContext/AppContext";
import {fakeAPI, setUpVehicles} from "../../setupTests";
import {calculateTotalRevenue} from "../App/calculateTotalRevenue";
import {MemoryRouter, Route} from "react-router-dom";
const cloneDeep = require('lodash.clonedeep');

const {vehicles} = cloneDeep(setUpVehicles(fakeAPI).vehicles);

const contextValue = {
  vehicles,
  loading: false,
  revenue: calculateTotalRevenue(vehicles)
};

describe('Dashboard component', () => {
  it('matches snapshot', () => {
    const component = render(
	  <AppProvider value={contextValue}>
		<MemoryRouter initialEntries={[`/`]}>
		  <Route path={`/`} render={props => <Dashboard {...props} />}/>
		</MemoryRouter>
	  </AppProvider>
	);

    expect(component).toMatchSnapshot();
  })
});
