/**
 * AddVehicle.js
 */
import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {AppContext} from "../../AppContext/AppContext";
import {Vehicle} from "../../Models/Vehicle";
import {VehicleForm} from "../VehicleForm/VehicleForm";

/**
 *
 * @returns {*}
 * @constructor
 */
export const AddVehicle = () => {
  const {addResource} = useContext(AppContext);
  const history = useHistory();

  return (
	<VehicleForm
	  type="add"
	  handleSubmit={values => {
		const {manufacturer, model, year, odometer, registration, tankSize} = values;
		const vehicleToBeAdded = new Vehicle(manufacturer, model, year, odometer, registration, tankSize);

		addResource('vehicle', vehicleToBeAdded);
		history.push(`/show/${vehicleToBeAdded.uuid}`);
	  }}/>
  )
};
