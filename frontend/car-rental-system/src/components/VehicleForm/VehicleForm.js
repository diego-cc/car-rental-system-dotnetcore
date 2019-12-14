/**
 * VehicleForm.js
 */
import React, {useContext, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {Formik} from "formik";
import moment from "moment";
import {AppContext} from "../../AppContext/AppContext";
import * as yup from "yup";

/**
 * Schema to validate VehicleForm
 * @type {Schema}
 */
const schema = yup.object().shape({
  manufacturer: yup.string().trim().required('This field is required'),
  model: yup.string().trim().required('This field is required'),
  year: yup
	.number()
	.min(moment().subtract(70, 'years').get("year"), 'Too old')
	.max(
	  moment()
		.add(1, 'year')
		.get('year'),
	  'Invalid year'
	),
  registration: yup
	.string()
	.trim()
	.length(7, '7 characters are required')
	.matches(/^[A-Za-z0-9]{7}$/, 'Only letters and numbers are valid')
	.required('This field is required'),
  odometer: yup.number().min(0, 'Invalid reading').required('This field is required'),
  tankSize: yup.number().min(0, 'Invalid tank capacity')
});

/**
 * @typedef {Object} VehicleFormProps
 * @property {string} type - one of: "add" or "edit"
 * @property {Vehicle} vehicle - the vehicle to be edited, if {@link type} === "edit"
 * @property {Function} handleSubmit - fired on submission if all form fields are valid
 */
/**
 * VehicleForm component - provides a form for the user to add or edit a vehicle
 * @param {VehicleFormProps} props
 * @returns {*}
 * @constructor
 */
export const VehicleForm = props => {
  const {loading, notification} = useContext(AppContext);
  const history = useHistory();
  const manufacturerInputRef = useRef(null);
  let {vehicle, handleSubmit, type} = props;

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

			{
			  type === 'add' ?
				(
				  <h2 className="text-center my-5">Add a new vehicle</h2>
				)
				:
				(
				  <h2 className="text-center my-5">
					Edit
					vehicle: {vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})` : ``}
				  </h2>
				)
			}
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
			  onSubmit={(values) => handleSubmit(values)}
			  initialValues={{
				manufacturer: vehicle ? vehicle.manufacturer : ``,
				model: vehicle ? vehicle.model : ``,
				year: vehicle ? vehicle.year : ``,
				registration: vehicle ? vehicle.registration : ``,
				odometer: vehicle ? vehicle.odometer : ``,
				tankSize: vehicle ? vehicle.tankSize : ``
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
				  <Form.Row className="mb-lg-3">
					<Form.Group as={Col} controlId="manufacturer" lg="4" md="12">
					  <Form.Label>Manufacturer:<span className="text-danger">*</span></Form.Label>
					  <Form.Control
						ref={manufacturerInputRef}
						onChange={handleChange}
						name="manufacturer"
						value={values.manufacturer}
						type="text"
						placeholder="Manufacturer..."
						isInvalid={!!errors.manufacturer}
						isValid={touched.manufacturer && !errors.manufacturer}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.manufacturer}
					  </Form.Control.Feedback>
					</Form.Group>

					<Form.Group as={Col} controlId="model" lg="4" md="12">
					  <Form.Label>Model:<span className="text-danger">*</span></Form.Label>
					  <Form.Control
						onChange={handleChange}
						name="model"
						value={values.model}
						type="text"
						placeholder="Model..."
						isValid={touched.model && !errors.model}
						isInvalid={!!errors.model}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.model}
					  </Form.Control.Feedback>
					</Form.Group>

					<Form.Group as={Col} controlId="year" lg="4" md="12">
					  <Form.Label>Year:</Form.Label>
					  <Form.Control
						onChange={handleChange}
						name="year"
						value={values.year}
						type="number"
						min={moment().subtract(60, 'years').get("year")}
						max={moment().add(1, 'year').get("year")}
						step="1"
						placeholder="Year..."
						isValid={touched.year && !errors.year}
						isInvalid={!!errors.year}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.year}
					  </Form.Control.Feedback>
					</Form.Group>

				  </Form.Row>
				  <Form.Row className="mb-lg-3">
					<Form.Group as={Col} controlId="registration" lg="6" md="12">
					  <Form.Label>Registration Number:<span
						className="text-danger">*</span></Form.Label>
					  <Form.Control
						onChange={handleChange}
						name="registration"
						value={values.registration}
						type="text"
						placeholder="Registration Number..."
						isValid={touched.registration && !errors.registration}
						isInvalid={!!errors.registration}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.registration}
					  </Form.Control.Feedback>
					</Form.Group>
				  </Form.Row>

				  <Form.Row className="mb-lg-3">
					<Form.Group as={Col} controlId="odometer" lg="6" md="12">
					  <Form.Label>Odometer Reading (in kilometres):<span
						className="text-danger">*</span></Form.Label>
					  <Form.Control
						onChange={handleChange}
						name="odometer"
						value={values.odometer}
						type="number"
						placeholder="Odometer Reading..."
						isValid={touched.odometer && !errors.odometer}
						isInvalid={!!errors.odometer}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.odometer}
					  </Form.Control.Feedback>
					</Form.Group>
				  </Form.Row>

				  <Form.Row className="mb-lg-5">
					<Form.Group as={Col} controlId="tankSize" lg="6" md="12">
					  <Form.Label>Tank Capacity (in litres):</Form.Label>
					  <Form.Control
						onChange={handleChange}
						name="tankSize"
						value={values.tankSize}
						type="number"
						placeholder="Tank Capacity..."
						isValid={touched.tankSize && !errors.tankSize}
						isInvalid={!!errors.tankSize}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.tankSize}
					  </Form.Control.Feedback>
					</Form.Group>
				  </Form.Row>
				  <Row className="justify-content-center">
					<Button
					  variant="primary"
					  size="lg"
					  type="submit"
					  className="mr-5"
					  disabled={isSubmitting}
					>
						Save changes
					</Button>
					<Button
					  variant="warning"
					  size="lg"
					  className="mr-5"
					  onClick={() => {
						resetForm();
						manufacturerInputRef.current.focus()
					  }}
					>
					  {
					    type === 'add' ? `Clear` : `Restore`
					  }
					</Button>
					<Button
					  variant="danger"
					  size="lg"
					  onClick={() => history.push(`/browse`)}
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
