/**
 * RevenueChart.test.js
 */
import React from 'react';
import {RevenueChart} from "./RevenueChart";
import {fakeAPI, setUpVehicles} from "../../setupTests";
import {calculateTotalRevenue} from '../App/calculateTotalRevenue';
import {mount} from 'enzyme';
const cloneDeep = require('lodash.clonedeep');

const initialContext = {
  vehicles: cloneDeep(setUpVehicles(fakeAPI).vehicles)
};

describe('RevenueChart component', () => {
  it('receives the correct revenue data by props', async () => {
	const data = calculateTotalRevenue(initialContext.vehicles);
	const wrapper = mount(<RevenueChart data={data}/>);
	expect(wrapper.props().data).toEqual([{monthAndYear: 'November 2019', revenue: 800}]);
  })
});
