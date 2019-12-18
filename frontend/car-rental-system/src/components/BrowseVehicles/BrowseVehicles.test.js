/**
 * BrowseVehicles.test.js
 */
import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {fakeAPI, setUpVehicles} from "../../setupTests";
import {BrowseVehicles} from "./BrowseVehicles";
import '@testing-library/jest-dom/extend-expect'
import {AppProvider} from "../../AppContext/AppContext";
const cloneDeep = require('lodash.clonedeep');

const initialContextValue = {
  vehicles: cloneDeep(setUpVehicles(fakeAPI).vehicles),
  loading: false,
  notification: {
    display: false,
	message: ''
  },
  deleteResource: {
	resourceType: '',
	resource: '',
	confirmDeleteResource: () => console.log('confirmDeleteResource'),
	showDeleteResourceModal: false,
	setDeleteResourceModalShow: () => console.log('setDeleteResourceModalShow')
  }
};

let tree, contextValue;

beforeEach(() => {
  contextValue = {...initialContextValue};
  tree = (
	<AppProvider value={contextValue}>
	  <MemoryRouter initialEntries={[`/browse`]}>
		<Route path={`/browse`} render={props => <BrowseVehicles {...props} />}/>
	  </MemoryRouter>
	</AppProvider>
  );
});

describe('BrowseVehicles component', () => {
  it('matches snapshot', () => {
	const component = render(tree);
	expect(component).toMatchSnapshot();
  });
});
