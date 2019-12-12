/**
 * AddService.js
 */
import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {AppContext} from "../../AppContext/AppContext";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {Service} from "../../Models/Service";
import {Formik} from "formik";
import Moment from "moment";
import {extendMoment} from 'moment-range';
import * as yup from "yup";
import {WarningModal} from "../Modals/WarningModal";

const cloneDeep = require('lodash.clonedeep');
const moment = extendMoment(Moment);

/**
 * AddService component
 * @returns {*}
 * @constructor
 */
export const AddService = () => {
  const {loading, notification, vehicles, addResource, deleteResource} = useContext(AppContext);
  const [bookingConflict, setBookingConflict] = useState({status: false, booking: null});
  const [serviceConflict, setServiceConflict] = useState({status: false, service: null});
  const [serviceToBeAdded, setServiceToBeAdded] = useState(null);
  const [addService, setAddService] = useState(false);
  const {vehicleID} = useParams();
  const history = useHistory();
  const vehicleToBeModified = vehicles.find(v => v.id === vehicleID);
  const vehicle = cloneDeep(vehicleToBeModified);

  // Deletes a resource from both the context and firebase,
  // then adds a new resource
  const confirmDeleteConflictedResource = (conflictedResourceType, conflictedResource, newResourceType, newResource) => {
	deleteResource.confirmDeleteResource(conflictedResourceType, conflictedResource);
	deleteResource.setDeleteResourceModalShow(null, null, () => {
	  addResource(newResourceType, newResource);
	  history.push(`/show/${vehicle.id}`);
	});
  };

  // Defines a schema for the form to add a service
  const schema = yup.object().shape({
	servicedAt: yup
	  .date()
	  .min(moment().subtract(1, 'day'), 'Invalid date')
	  .required('This field is required'),
	serviceOdometer: yup
	  .number()
	  .min(vehicle ? vehicle.odometerReading : 0,
		'Invalid service odometer')
	  .required('This field is required')
  });

  // Detects changes on addService
  // Adds a service if form is valid and there are no conflicts
  useEffect(() => {
	if (addService && serviceToBeAdded) {
	  addResource('service', serviceToBeAdded);
	  history.push(`/show/${vehicle.id}`);
	}
  }, [addService, addResource, history, serviceToBeAdded, vehicle.id]);

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
		  <h2 className="text-center my-5">Register new service
			for: {vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})` : ''}</h2>
		</Col>
	  </Row>
	  <WarningModal
		onHide={() => setBookingConflict({status: false})}
		show={bookingConflict.status}
		header="Booking conflict"
		body={`New service could not be added to the system, because there is a booking scheduled between ${bookingConflict.booking ? moment(bookingConflict.booking.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''} and ${bookingConflict.booking ? moment(bookingConflict.booking.endDate, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''}. Would you like to cancel the booking and add this service now?`}
		accept="Yes, cancel this booking"
		cancel="No, keep it as it is"
		acceptHandler={() => {
		  confirmDeleteConflictedResource('booking', bookingConflict.booking, 'service', serviceToBeAdded);
		}}
		cancelHandler={() => setBookingConflict({status: false})}
	  />
	  <WarningModal
		onHide={() => setServiceConflict({status: false})}
		show={serviceConflict.status}
		header="Service conflict"
		body={`New service could not be added to the system, because there is another service also scheduled for ${serviceConflict.service ? moment(serviceConflict.service.servicedAt, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''}. Would you like to cancel that service and add this one instead?`}
		accept="Yes, cancel the other service"
		cancel="No, keep it as it is"
		acceptHandler={() => {
		  confirmDeleteConflictedResource('service', serviceConflict.service, 'service', serviceToBeAdded);
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
				const {serviceOdometer, servicedAt} = values;
				const service = new Service(vehicle.id, serviceOdometer, servicedAt);
				setServiceToBeAdded(service);

				// check booking conflicts
				if (vehicle.bookings.some(b => moment(servicedAt, 'YYYY-MM-DD').within(moment.range(b.startDate, b.endDate)))) {
				  const bookingConflict = vehicle.bookings.find(b => moment(servicedAt, 'YYYY-MM-DD').within(moment.range(b.startDate, b.endDate)));
				  setBookingConflict({
					status: true,
					booking: bookingConflict
				  });
				}
				// check service conflicts
				else if (vehicle.services.some(s => moment(s.servicedAt, 'YYYY-MM-DD').isSame(moment(servicedAt, 'YYYY-MM-DD')))) {
				  const serviceConflict = vehicle.services.find(s => moment(s.servicedAt, 'YYYY-MM-DD').isSame(moment(servicedAt, 'YYYY-MM-DD')));
				  setServiceConflict({
					status: true,
					service: serviceConflict
				  });
				} else {
				  setAddService(true);
				}
			  }}
			  initialValues={{
				servicedAt: moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
				serviceOdometer: vehicle ? vehicle.odometerReading : 0
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
				<Form noValidate onSubmit={handleSubmit}>
				  <Form.Group as={Row} controlId="servicedAt">
					<Form.Label column="true" sm="2">Serviced at:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="servicedAt"
						value={values.servicedAt}
						type="date"
						isInvalid={!!errors.servicedAt}
						isValid={touched.servicedAt && !errors.servicedAt}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.servicedAt}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>

				  <Form.Group as={Row} controlId="serviceOdometer">
					<Form.Label column="true" sm="2">Service odometer:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="serviceOdometer"
						value={values.serviceOdometer}
						type="number"
						placeholder="Service odometer..."
						isValid={touched.serviceOdometer && !errors.serviceOdometer}
						isInvalid={!!errors.serviceOdometer}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.serviceOdometer}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>

				  <Row className="justify-content-center">
					<Button
					  variant="primary"
					  size="lg"
					  type="submit"
					  className="mr-5"
					  disabled={isSubmitting}
					>
					  Add service
					</Button>
					<Button
					  variant="warning"
					  size="lg"
					  className="mr-5"
					  onClick={() => {
						resetForm();
					  }}
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
