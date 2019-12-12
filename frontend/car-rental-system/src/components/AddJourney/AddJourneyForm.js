/**
 * AddJourneyForm component
 */
import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../AppContext/AppContext";
import {useHistory, useParams} from 'react-router-dom';
import {Notification} from "../Notification/Notification";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {Journey} from "../../Models/Journey";
import {extendMoment} from "moment-range";
import Moment from "moment";
import * as yup from "yup";
import {Formik} from "formik";

const moment = extendMoment(Moment);
const cloneDeep = require('lodash.clonedeep');

/**
 * AddJourneyForm component
 * @returns {*}
 * @constructor
 */
export const AddJourneyForm = () => {
  const {loading, notification, vehicles, addResource} = useContext(AppContext);
  const [journeyToBeAdded, setJourneyToBeAdded] = useState(null);
  const [addJourney, setAddJourney] = useState(false);
  const {bookingID} = useParams();
  const history = useHistory();
  const vehicleToBeModified = vehicles.find(v => v.bookings.some(b => b.id === bookingID));
  const vehicle = cloneDeep(vehicleToBeModified);
  const booking = vehicle ? vehicle.bookings.find(b => b.id === bookingID) : null;
  const associatedBooking = cloneDeep(booking);

  // Defines a schema for the form to add a new journey
  const schema = yup.object().shape({
	journeyStartOdometerReading: yup
	  .number()
	  .min(associatedBooking ? associatedBooking.startOdometer : 0, 'Invalid odometer reading')
	  .required('This field is required'),
	journeyEndOdometerReading: yup
	  .number()
	  .min(associatedBooking ? associatedBooking.startOdometer : 0, 'Invalid odometer reading')
	  .min(
		yup.ref('journeyStartOdometerReading'),
		'Cannot be lower than journey start odometer reading'
	  )
	  .required('This field is required'),
	journeyStartedAt: yup
	  .date()
	  .min(associatedBooking ? moment(associatedBooking.startDate, 'YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'Cannot be earlier than booking start date')
	  .required('This field is required'),
	journeyEndedAt: yup
	  .date()
	  .min(associatedBooking ? moment(associatedBooking.startDate, 'YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'Cannot be earlier than booking start date')
	  .min(yup.ref('journeyStartedAt'), 'Cannot be earlier than journey start date')
	  .max(associatedBooking ? moment(associatedBooking.endDate, 'YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'Cannot be later than booking end date')
	  .required('This field is required'),
	journeyFrom: yup
	  .string(),
	journeyTo: yup
	  .string()
  });

  // Detects changes on addJourney
  // Adds a new journey if form is valid
  useEffect(() => {
	if (addJourney && journeyToBeAdded) {
	  addResource('journey', journeyToBeAdded);
	  history.push(`/show/${vehicle.id}`);
	}
  }, [addJourney, addResource, history, journeyToBeAdded, vehicle.id]);

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
		  <h2 className="text-center my-5">Add new journey
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
				const {journeyStartOdometerReading, journeyEndOdometerReading, journeyStartedAt, journeyEndedAt, journeyFrom, journeyTo} = values;
				const journey = new Journey(bookingID, journeyStartOdometerReading, journeyEndOdometerReading, journeyStartedAt, journeyEndedAt, journeyFrom, journeyTo);
				setJourneyToBeAdded(journey);
				setAddJourney(true);
			  }}
			  initialValues={{
				journeyStartOdometerReading: associatedBooking ? associatedBooking.startOdometer : 0,
				journeyEndOdometerReading: associatedBooking ? associatedBooking.startOdometer : 0,
				journeyStartedAt: associatedBooking ? moment(associatedBooking.startDate).format('YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
				journeyEndedAt: associatedBooking ? moment(associatedBooking.startDate).format('YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
				journeyFrom: '',
				journeyTo: ''
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
				  <Form.Group as={Row} controlId="journeyStartedAt">
					<Form.Label column="true" sm="2">Journey started at:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="journeyStartedAt"
						value={values.journeyStartedAt}
						type="date"
						isValid={touched.journeyStartedAt && !errors.journeyStartedAt}
						isInvalid={!!errors.journeyStartedAt}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.journeyStartedAt}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="journeyEndedAt">
					<Form.Label column="true" sm="2">Journey ended at:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="journeyEndedAt"
						value={values.journeyEndedAt}
						type="date"
						isValid={touched.journeyEndedAt && !errors.journeyEndedAt}
						isInvalid={!!errors.journeyEndedAt}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.journeyEndedAt}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="journeyStartOdometerReading">
					<Form.Label column="true" sm="2">Journey start odometer reading:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="journeyStartOdometerReading"
						value={values.journeyStartOdometerReading}
						type="number"
						placeholder="Journey start odometer reading..."
						isValid={touched.journeyStartOdometerReading && !errors.journeyStartOdometerReading}
						isInvalid={!!errors.journeyStartOdometerReading}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.journeyStartOdometerReading}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="journeyEndOdometerReading">
					<Form.Label column="true" sm="2">Journey end odometer reading:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="journeyEndOdometerReading"
						value={values.journeyEndOdometerReading}
						placeholder="Journey end odometer reading..."
						type="number"
						isValid={touched.journeyEndOdometerReading && !errors.journeyEndOdometerReading}
						isInvalid={!!errors.journeyEndOdometerReading}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.journeyEndOdometerReading}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="journeyFrom">
					<Form.Label column="true" sm="2">Journey from:</Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="journeyFrom"
						value={values.journeyFrom}
						placeholder="Journey from..."
						type="text"
						isValid={touched.journeyFrom && !errors.journeyFrom}
						isInvalid={!!errors.journeyFrom}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.journeyFrom}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="journeyTo">
					<Form.Label column="true" sm="2">Journey to:</Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="journeyTo"
						value={values.journeyTo}
						placeholder="Journey to..."
						type="text"
						isValid={touched.journeyTo && !errors.journeyTo}
						isInvalid={!!errors.journeyTo}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.journeyTo}
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
					  Add journey
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
