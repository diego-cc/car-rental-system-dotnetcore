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
  const vehicleToBeModified = vehicles.find(v => v.bookings.some(b => b.uuid === bookingID));
  const vehicle = cloneDeep(vehicleToBeModified);
  const booking = vehicle ? vehicle.bookings.find(b => b.uuid === bookingID) : null;
  const associatedBooking = cloneDeep(booking);

  // Defines a schema for the form to add a new journey
  const schema = yup.object().shape({
	startOdometer: yup
	  .number()
	  .min(associatedBooking ? associatedBooking.startOdometer : 0, 'Invalid odometer reading')
	  .required('This field is required'),
	endOdometer: yup
	  .number()
	  .min(associatedBooking ? associatedBooking.startOdometer : 0, 'Invalid odometer reading')
	  .min(
		yup.ref('startOdometer'),
		'Cannot be lower than journey start odometer reading'
	  )
	  .required('This field is required'),
	startedAt: yup
	  .date()
	  .min(associatedBooking ? moment(associatedBooking.startedAt, 'YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'Cannot be earlier than booking start date')
	  .required('This field is required'),
	endedAt: yup
	  .date()
	  .min(associatedBooking ? moment(associatedBooking.startedAt, 'YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'Cannot be earlier than booking start date')
	  .min(yup.ref('startedAt'), 'Cannot be earlier than journey start date')
	  .max(associatedBooking ? moment(associatedBooking.endedAt, 'YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'Cannot be later than booking end date')
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
	  history.push(`/show/${vehicle.uuid}`);
	}
  }, [addJourney, addResource, history, journeyToBeAdded, vehicle.uuid]);

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
			for: {associatedBooking ? `${moment(associatedBooking.startedAt, 'YYYY-MM-DD').format('DD/MM/YYYY')}` : ''} - {associatedBooking ? `${moment(associatedBooking.endedAt, 'YYYY-MM-DD').format('DD/MM/YYYY')}` : ''}</h2>
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
				const {startOdometer, endOdometer, startedAt, endedAt, journeyFrom, journeyTo} = values;
				const journey = new Journey(bookingID, startOdometer, endOdometer, startedAt, endedAt, journeyFrom, journeyTo);
				setJourneyToBeAdded(journey);
				setAddJourney(true);
			  }}
			  initialValues={{
				startOdometer: associatedBooking ? associatedBooking.startOdometer : 0,
				endOdometer: associatedBooking ? associatedBooking.startOdometer : 0,
				startedAt: associatedBooking ? moment(associatedBooking.startedAt).format('YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
				endedAt: associatedBooking ? moment(associatedBooking.startedAt).format('YYYY-MM-DD') : moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
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
				  <Form.Group as={Row} controlId="startedAt">
					<Form.Label column="true" sm="2">Journey started at:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="startedAt"
						value={values.startedAt}
						type="date"
						isValid={touched.startedAt && !errors.startedAt}
						isInvalid={!!errors.startedAt}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.startedAt}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="endedAt">
					<Form.Label column="true" sm="2">Journey ended at:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="endedAt"
						value={values.endedAt}
						type="date"
						isValid={touched.endedAt && !errors.endedAt}
						isInvalid={!!errors.endedAt}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.endedAt}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="startOdometer">
					<Form.Label column="true" sm="2">Journey start odometer reading:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="startOdometer"
						value={values.startOdometer}
						type="number"
						placeholder="Journey start odometer reading..."
						isValid={touched.startOdometer && !errors.startOdometer}
						isInvalid={!!errors.startOdometer}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.startOdometer}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="endOdometer">
					<Form.Label column="true" sm="2">Journey end odometer reading:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="endOdometer"
						value={values.endOdometer}
						placeholder="Journey end odometer reading..."
						type="number"
						isValid={touched.endOdometer && !errors.endOdometer}
						isInvalid={!!errors.endOdometer}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.endOdometer}
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
					  onClick={() => history.push(`/show/${vehicle.uuid}`)}
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
