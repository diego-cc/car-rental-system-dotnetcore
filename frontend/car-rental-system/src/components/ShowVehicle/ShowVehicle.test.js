import React from 'react';
import { render, wait } from '@testing-library/react';
import {fakeAPI} from "../../setupTests";
import {AppProvider} from "../../AppContext/AppContext";
import {MemoryRouter, Route} from "react-router-dom";
import {ShowVehicle} from "./ShowVehicle";

let contextValue;
const initialContextValue = {
  ...fakeAPI,
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

describe('ShowVehicle component', () => {
  it('matches snapshot', () => {
    contextValue = {
      ...initialContextValue
	};

    const component = render(
      <AppProvider value={contextValue}>
		<MemoryRouter initialEntries={[`/show/ranger-123`]}>
		  <Route path={`/show/:vehicleID`} render={props => <ShowVehicle {...props} />} />
		</MemoryRouter>
	  </AppProvider>
	);

    expect(component).toMatchSnapshot();
  })
});
