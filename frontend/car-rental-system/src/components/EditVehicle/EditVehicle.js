/**
 * EditVehicle.js
 */
import React, {useContext} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {AppContext} from "../../AppContext/AppContext";
import {Vehicle} from "../../Models/Vehicle";
import moment from "moment";
import {VehicleForm} from "../VehicleForm/VehicleForm";

const cloneDeep = require('lodash.clonedeep');

/**
 * EditVehicle component - renders a form to edit a vehicle
 * @returns {*}
 * @constructor
 */
export const EditVehicle = () => {
  const {vehicles, editVehicle} = useContext(AppContext);
  const history = useHistory();
  const {vehicleID} = useParams();

  const vehicleToBeEdited = vehicles.find(v => v.id === vehicleID);
  let vehicle = cloneDeep(vehicleToBeEdited);

  return (
	<VehicleForm
	  type="edit"
	  vehicle={vehicle}
	  handleSubmit={values => {
		for (let field in values) {
		  if (vehicle.hasOwnProperty(`_${field}`)) {
			vehicle[field] = values[field];
		  }
		}
		vehicle.updatedAt = moment().format('DD/MM/YYYY hh:mm:ss A');
		editVehicle(vehicle);
		history.push(`/show/${vehicle.id}`);
	  }}
	/>
  )
};
