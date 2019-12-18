import React from 'react';
import { render } from '@testing-library/react';
import {Navigation} from "./Navigation";
import {MemoryRouter} from "react-router-dom";
import {AppProvider} from "../../AppContext/AppContext";
import {fakeAPI, setUpVehicles} from "../../setupTests";
const cloneDeep = require('lodash.clonedeep');

let contextValue;
const initialContextValue = {
  vehicles: cloneDeep(setUpVehicles(fakeAPI).vehicles)
};

describe('Navigation component', () => {
  it('matches snapshot', () => {
    contextValue = {
      ...initialContextValue
	};

    const component = render(
      <AppProvider value={contextValue}>
		<MemoryRouter>
		  <Navigation />
		</MemoryRouter>
	  </AppProvider>
      );

    expect(component).toMatchSnapshot();
  })
});
