/**
 * AddFuelPurchase.js
 */
import React, {useContext} from 'react';
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {Accordion, Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {Link, useHistory, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";

const cloneDeep = require('lodash.clonedeep');

/**
 * AddFuelPurchase component - navigates to AddFuelPurchaseForm once a booking is selected
 */
export const AddFuelPurchase = () => {
  const {vehicles} = useContext(AppContext);
  const {vehicleID} = useParams();
  const vehicle = cloneDeep(vehicles.find(v => v.id === vehicleID));
  const history = useHistory();

  return (
	<AppConsumer>
	  {
		({loading, notification}) => (
		  <Container>
			{
			  notification.display ?
				(
				  <Notification
					display={notification.display}
					message={notification.message}/>
				) : ''
			}
			<Row>
			  <Col>
				<h2 className="text-center my-5">
				  Select a booking to register a new fuel purchase for {vehicle ?
				  `${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})`
				  : ''}
				</h2>
			  </Col>
			</Row>
			{
			  loading ?
				(
				  <Row className="justify-content-center mt-5">
					<LoadingSpinner/>
				  </Row>
				) :
				(
				  <Accordion>
					{
					  vehicle ?
						(
						  vehicle
							.bookings
							.filter(booking => booking.vehicleID === vehicle.id)
							.sort((booking1, booking2) => {
							  const booking1StartDate = new Date(booking1.startDate);
							  const booking2StartDate = new Date(booking2.startDate);

							  if (booking1StartDate > booking2StartDate) {
								return -1;
							  } else if (booking1StartDate < booking2StartDate) {
								return 1;
							  }
							  return 0;
							})
							.map((booking, index) => (
							  <Card
								data-testid={`booking-${booking.id}`}
								key={index}
								style={{overflow: 'visible'}}>
								<Card.Header>
								  <Accordion.Toggle
									className="mr-auto"
									as={Button}
									variant="link"
									eventKey={index}>
									{`${new Date(booking.startDate).toLocaleDateString('en-AU')}`}
								  </Accordion.Toggle>
								  <Link to={`/addFuelPurchaseForm/${booking.id}`}>
									<Button variant="outline-success">
									  <FontAwesomeIcon icon={faPlus}/>
									</Button>
								  </Link>
								</Card.Header>
								<Accordion.Collapse eventKey={index}>
								  <Card.Body>
									<ListGroup>
									  <ListGroup.Item>
										Start
										Date: {`${new Date(booking.startDate).toLocaleDateString('en-AU')}`}
									  </ListGroup.Item>
									  <ListGroup.Item>
										End
										Date: {`${new Date(booking.endDate).toLocaleDateString('en-AU')}`}
									  </ListGroup.Item>
									  <ListGroup.Item>
										Start Odometer: {booking.startOdometer} km
									  </ListGroup.Item>
									  <ListGroup.Item>
										Booking
										Type: {booking.bookingType === 'D' ? 'Per day' : 'Per km'}
									  </ListGroup.Item>
									</ListGroup>
								  </Card.Body>
								</Accordion.Collapse>
							  </Card>
							))
						) : ''

					}
				  </Accordion>
				)
			}
			<Button
			  className="my-5"
			  style={{
				position: 'relative',
				left: '50%',
				transform: 'translateX(-50%)'
			  }}
			  variant="danger"
			  size="lg"
			  onClick={() => history.push(`/show/${vehicle.id}`)}
			>
			  Cancel
			</Button>
		  </Container>
		)
	  }
	</AppConsumer>
  )
};
