/**
 * AddBooking.js
 */
import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {AppContext} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import {Booking} from "../../Models/Booking";
import * as yup from "yup";
import {WarningModal} from "../Modals/WarningModal";
import {Formik} from "formik";

const moment = extendMoment(Moment);
const cloneDeep = require('lodash.clonedeep');

/**
 * AddBooking component
 * @returns {*}
 * @constructor
 */
export const AddBooking = () => {
  const {loading, notification, vehicles, addResource, deleteResource} = useContext(AppContext);
  const [bookingConflict, setBookingConflict] = useState({status: false, booking: null});
  const [serviceConflict, setServiceConflict] = useState({status: false, service: null});
  const [bookingToBeAdded, setBookingToBeAdded] = useState(null);
  const [addBooking, setAddBooking] = useState(false);
  const {vehicleID} = useParams();
  const history = useHistory();
  const vehicleToBeModified = vehicles.find(v => v.id === vehicleID);
  const vehicle = cloneDeep(vehicleToBeModified);

  // Defines a schema for the AddBooking form
  const schema = yup.object().shape({
	bookingType: yup.string().required('This field is required'),
	startDate: yup
	  .date()
	  .min(moment().subtract(1, 'day'), 'Start date cannot be earlier than today')
	  .max(moment(moment(), 'YYYY-MM-DD').add(1, 'year'), 'Invalid date')
	  .required('This field is required'),
	endDate: yup
	  .date()
	  .min(moment().subtract(1, 'day'), 'Invalid date')
	  .min(yup.ref('startDate'), 'End date cannot be earlier start date')
	  .max(moment(moment(), 'YYYY-MM-DD').add(1, 'year'), 'Invalid date')
	  .required('This field is required'),
	startOdometer: yup
	  .number()
	  .min(vehicle ? vehicle.odometerReading : 0, 'Cannot be lower than current odometer reading')
	  .required('This field is required')
  });

  // Deletes a resource from both the context and firebase,
  // then adds a new resource
  const confirmDeleteConflictedResource = (conflictedResourceType, conflictedResource, newResourceType, newResource) => {
	deleteResource.confirmDeleteResource(conflictedResourceType, conflictedResource);
	deleteResource.setDeleteResourceModalShow(null, null, () => {
	  addResource(newResourceType, newResource);
	  history.push(`/show/${vehicle.id}`);
	});
  };

  // Detects changes on addBooking
  // Adds a new booking if form is valid and there are no conflicts
  useEffect(() => {
	if (addBooking && bookingToBeAdded) {
	  addResource('booking', bookingToBeAdded);
	  history.push(`/show/${vehicle.id}`);
	}
  }, [addBooking, addResource, bookingToBeAdded, history, vehicle.id]);

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
		  <h2 className="text-center my-5">Add new booking
			for: {vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})` : ''}</h2>
		</Col>
	  </Row>
	  <WarningModal
		onHide={() => setBookingConflict({status: false})}
		show={bookingConflict.status}
		header="Booking conflict"
		body={`New booking could not be added to the system, because there is another booking scheduled between ${bookingConflict.booking ? moment(bookingConflict.booking.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''} and ${bookingConflict.booking ? moment(bookingConflict.booking.endDate, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''}. Would you like to cancel the other booking and add this one now?`}
		accept="Yes, cancel the other booking"
		cancel="No, keep it as it is"
		acceptHandler={() => {
		  confirmDeleteConflictedResource('booking', bookingConflict.booking, 'booking', bookingToBeAdded);
		}}
		cancelHandler={() => setBookingConflict({status: false})}
	  />
	  <WarningModal
		onHide={() => setServiceConflict({status: false})}
		show={serviceConflict.status}
		header="Service conflict"
		body={`New booking could not be added to the system, because there is a service scheduled for ${serviceConflict.service ? moment(serviceConflict.service.servicedAt, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''}. Would you like to cancel that service and add this booking?`}
		accept="Yes, cancel the service"
		cancel="No, keep it as it is"
		acceptHandler={() => {
		  confirmDeleteConflictedResource('service', serviceConflict.service, 'booking', bookingToBeAdded);
		}}
		cancelHandler={() => setServiceConflict({status: false})}
	  />
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
				const {bookingType, startDate, endDate, startOdometer} = values;
				const booking = new Booking(vehicle.id, bookingType, startDate, endDate, startOdometer);
				setBookingToBeAdded(booking);

				// check booking conflicts
				if (vehicle.bookings.some(b => {
				  return moment.range(moment(b.startDate, 'YYYY-MM-DD'), moment(b.endDate, 'YYYY-MM-DD')).overlaps(moment.range(moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')))
				})) {
				  const bookingConflict = vehicle.bookings.find(b => moment.range(moment(b.startDate, 'YYYY-MM-DD'), moment(b.endDate, 'YYYY-MM-DD')).overlaps(moment.range(moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD'))));
				  setBookingConflict({
					status: true,
					booking: bookingConflict
				  });
				}
				// check service conflicts
				else if (vehicle.services.some(s => moment(s.servicedAt, 'YYYY-MM-DD').within(moment.range(moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD'))))) {

				  const serviceConflict = vehicle.services.find(s => moment(s.servicedAt, 'YYYY-MM-DD').within(moment.range(moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD'))));
				  setServiceConflict({
					status: true,
					service: serviceConflict
				  });
				} else {
				  // All good, add new booking
				  setAddBooking(true);
				}
			  }}
			  initialValues={{
				bookingType: 'D',
				startDate: moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
				endDate: moment(moment(), 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD'),
				startOdometer: vehicle ? vehicle.odometerReading : 0
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
				  <Form.Group as={Row} controlId="bookingType">
					<Form.Label column="true" sm="2">Booking Type:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						as="select"
						name="bookingType"
						value={values.bookingType}
						onChange={handleChange}
						isValid={touched.bookingType && !errors.bookingType}
						isInvalid={!!errors.bookingType}
					  >
						<option
						  value="D">
						  Per day
						</option>
						<option
						  value="K">
						  Per kilometer
						</option>
					  </Form.Control>
					  <Form.Control.Feedback type="invalid">
						{errors.bookingType}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="startDate">
					<Form.Label column="true" sm="2">Start Date:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="startDate"
						value={values.startDate}
						type="date"
						isInvalid={!!errors.startDate}
						isValid={touched.startDate && !errors.startDate}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.startDate}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="endDate">
					<Form.Label column="true" sm="2">End Date:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="endDate"
						value={values.endDate}
						type="date"
						isInvalid={!!errors.endDate}
						isValid={touched.endDate && !errors.endDate}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.endDate}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="startOdometer">
					<Form.Label column="true" sm="2">Start Odometer:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="startOdometer"
						value={values.startOdometer}
						type="number"
						placeholder="Start odometer..."
						isValid={touched.startOdometer && !errors.startOdometer}
						isInvalid={!!errors.startOdometer}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.startOdometer}
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
					  Add booking
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
					  onClick={() => history.push(`/show/${vehicleID}`)}
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
