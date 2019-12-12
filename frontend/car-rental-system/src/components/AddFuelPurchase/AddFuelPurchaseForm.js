/**
 * AddFuelPurchaseForm.js
 */
import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {AppContext} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {FuelPurchase} from "../../Models/FuelPurchase";
import Moment from 'moment';
import * as yup from "yup";
import {Formik} from "formik";

const moment = require('moment-range').extendMoment(Moment);
const cloneDeep = require('lodash.clonedeep');

/**
 * AddFuelPurchaseForm component
 * @returns {*}
 * @constructor
 */
export const AddFuelPurchaseForm = () => {
  const {loading, notification, vehicles, addResource} = useContext(AppContext);
  const [fuelPurchaseToBeAdded, setFuelPurchaseToBeAdded] = useState(null);
  const [addFuelPurchase, setAddFuelPurchase] = useState(false);
  const {bookingID} = useParams();
  const history = useHistory();
  const vehicleToBeModified = vehicles.find(v => v.bookings.some(b => b.id === bookingID));
  const vehicle = cloneDeep(vehicleToBeModified);
  const booking = vehicle ? vehicle.bookings.find(b => b.id === bookingID) : null;
  const associatedBooking = cloneDeep(booking);

  // Defines a schema for the form to add a new fuel purchase
  const schema = yup.object().shape({
	fuelQuantity: yup
	  .number()
	  .moreThan(0, 'Invalid fuel quantity')
	  .max(
		vehicle ?
		  vehicle.tankCapacity : 0,
		'Cannot be greater than the tank capacity of this vehicle'
	  )
	  .required('This field is required'),
	fuelPrice: yup
	  .number()
	  .moreThan(0, 'Invalid price')
	  .required('This field  is required')
  });

  // Detects changes on addFuelPurchase
  // Adds a new fuel purchase if form is valid
  useEffect(() => {
	if (addFuelPurchase && fuelPurchaseToBeAdded) {
	  addResource('fuel purchase', fuelPurchaseToBeAdded);
	  history.push(`/show/${vehicle.id}`);
	}
  }, [addFuelPurchase, addResource, fuelPurchaseToBeAdded, history, vehicle.id]);

  return (
	<Container>
	  {
		notification && notification.display ?
		  (
			<Notification
			  display={notification.display}
			  message={notification.message}/>
		  ) : ''
	  }
	  <Row>
		<Col>
		  <h2 className="text-center my-5">Register new fuel purchase
			for {vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})` : ''},
			booked
			for: {associatedBooking ? `${moment(associatedBooking.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}` : ''} - {associatedBooking ? `${moment(associatedBooking.endDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}` : ''}</h2>
		</Col>
	  </Row>
	  {
		loading ?
		  (
			<Row className="justify-content-center mt-5">
			  <LoadingSpinner/>
			</Row>
		  )
		  :
		  (
			<Formik
			  validationSchema={schema}
			  onSubmit={(values) => {
				const {fuelQuantity, fuelPrice} = values;
				const fuelPurchase = new FuelPurchase(bookingID, fuelQuantity, fuelPrice);
				setFuelPurchaseToBeAdded(fuelPurchase);
				setAddFuelPurchase(true);
			  }}
			  initialValues={{
				fuelQuantity: vehicle ? vehicle.tankCapacity : '',
				fuelPrice: ''
			  }}
			>
			  {({
				  handleSubmit,
				  handleChange,
				  resetForm,
				  values,
				  touched,
				  errors,
				  isSubmitting
				}) => (
				<Form
				  onSubmit={handleSubmit}
				>
				  <Form.Group as={Row} controlId="fuelQuantity">
					<Form.Label column="true" sm="2">Fuel quantity:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="fuelQuantity"
						value={values.fuelQuantity}
						type="number"
						placeholder="Fuel quantity (L)..."
						isValid={touched.fuelQuantity && !errors.fuelQuantity}
						isInvalid={!!errors.fuelQuantity}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.fuelQuantity}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="fuelPrice">
					<Form.Label column="true" sm="2">Fuel price per litre:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="fuelPrice"
						value={values.fuelPrice}
						type="number"
						placeholder="Fuel price ($ / L)..."
						isValid={touched.fuelPrice && !errors.fuelPrice}
						isInvalid={!!errors.fuelPrice}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.fuelPrice}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Row className="justify-content-center my-5">
					<Button
					  variant="primary"
					  size="lg"
					  type="submit"
					  className="mr-5"
					  disabled={isSubmitting}
					>
					  Add fuel purchase
					</Button>
					<Button
					  variant="warning"
					  size="lg"
					  className="mr-5"
					  onClick={resetForm}
					>
					  Clear
					</Button>
					<Button
					  variant="danger"
					  size="lg"
					  onClick={() => history.push(`/show/${vehicle.id}`)}
					>
					  Cancel
					</Button>
				  </Row>
				</Form>
			  )}
			</Formik>
		  )
	  }
	</Container>
  )
};
