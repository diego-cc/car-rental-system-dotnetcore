import {fakeAPI, setUpVehicles} from "../../setupTests";
import {calculateTotalRevenue} from "./calculateTotalRevenue";

const cloneDeep = require('lodash.clonedeep');
const vehicles = cloneDeep(setUpVehicles(fakeAPI).vehicles);

describe('calculateTotalRevenue method', () => {
  it('returns the correct revenue data', () => {
	const expected = [{
	  monthAndYear: 'November 2019',
	  revenue: 800
	}];
	const actual = calculateTotalRevenue(vehicles);
	expect(actual).toStrictEqual(expected);
  })
});
