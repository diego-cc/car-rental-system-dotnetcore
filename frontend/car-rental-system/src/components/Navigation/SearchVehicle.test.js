/**
 * SearchVehicle.test.js
 */
import {fakeAPI, setUpVehicles} from "../../setupTests";
import {AppProvider} from "../../AppContext/AppContext";
import {MemoryRouter} from "react-router-dom";
import {SearchVehicle} from "./SearchVehicle";
import { render, fireEvent, wait } from '@testing-library/react';
import React from "react";
const cloneDeep = require('lodash.clonedeep');

let tree, contextValue;
const initialContextValue = {
  vehicles: cloneDeep(setUpVehicles(fakeAPI).vehicles)
};

beforeEach(() => {
  contextValue = {
	...initialContextValue
  };

  tree = (
	<AppProvider value={contextValue}>
	  <MemoryRouter initialEntries={[`/`]}>
		<SearchVehicle/>
	  </MemoryRouter>
	</AppProvider>
  )
});

describe('SearchVehicle component', () => {
  it ('matches snapshot', () => {
    const component = render(tree);
    expect(component).toMatchSnapshot();
  });
});
