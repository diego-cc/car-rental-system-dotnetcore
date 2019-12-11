/**
 * VehicleDetail.js
 */
import React, {useContext} from 'react';
import {Accordion, Button, ButtonGroup, Card, ListGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import {DeleteResourceModal} from "../Modals/DeleteResourceModal";
import {AppContext} from "../../AppContext/AppContext";

/**
 * @typedef {Object} VehicleDetailsProps
 * @property {Vehicle} vehicle - the selected vehicle
 */
/**
 * VehicleDetails component - renders all the information about a single vehicle
 * @param {VehicleDetailsProps} props
 * @returns {*}
 * @constructor
 */
export const VehicleDetails = props => {
  const {vehicle} = props;

  const {
    bookings: vehicleBookings,
    services: vehicleServices
  } = vehicle;

  const {deleteResource} = useContext(AppContext);

  return (
    <>
      <Accordion>
        <Card style={{overflow: 'visible'}}>
          <Card.Header>
            <Accordion.Toggle
              className="mr-auto"
              as={Button}
              variant="link"
              eventKey={`${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})`}
            >
              {`${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})`}
            </Accordion.Toggle>
            <ButtonGroup aria-label="Options">
              <Link
                to={`/edit/${vehicle.id}`}
                className="mr-3"
              >
                <Button
                  variant="outline-warning"
                >
                  <FontAwesomeIcon icon={faEdit}/>
                </Button>
              </Link>
              <Button
                onClick={() => deleteResource.setDeleteResourceModalShow('vehicle', vehicle)}
                className="mr-3"
                variant="outline-danger">
                <FontAwesomeIcon icon={faTrash}/>
              </Button>
              <Dropdown drop="right">
                <Dropdown.Toggle variant="outline-secondary">
                  <FontAwesomeIcon icon={faCog}/>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/addService/${vehicle.id}`}>
                    Add service
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to={`/addBooking/${vehicle.id}`}>
                    Add booking
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to={`/addJourney/${vehicle.id}`}>
                    Add journey
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to={`/addFuelPurchase/${vehicle.id}`}>
                    Add fuel purchase
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup>
          </Card.Header>
          <Accordion.Collapse
            eventKey={`${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})`}>
            <Card.Body>
              <ListGroup>
                {
                  Object.keys(
                    vehicle.printDetails()
                  )
                    .map((field, index) => (
                      <ListGroup.Item key={index}>
                        {field}: {
                        vehicle.printDetails()[field]
                      }
                      </ListGroup.Item>
                    ))
                }
                <ListGroup.Item>
                  Tank capacity: {vehicle.tankCapacity} L
                </ListGroup.Item>
                <ListGroup.Item>
                  <Accordion>
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle
                          className="mr-auto"
                          as={Button}
                          variant="link"
                          eventKey="0">
                          Booking Records
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          {
                            vehicleBookings &&
                            vehicleBookings
                              .sort((b1, b2) => (
                                moment(b2.startDate).isBefore(moment(b1.startDate))
                              ))
                              .map((booking, index) => (
                                <Accordion key={index}>
                                  <Card>
                                    <Card.Header>
                                      <Accordion.Toggle
                                        className="mr-auto"
                                        as={Button}
                                        variant="link"
                                        eventKey={index}>
                                        {`${new Date(booking.startDate).toLocaleDateString("en-AU")} - ${new Date(booking.endDate).toLocaleDateString("en-AU")}`}
                                      </Accordion.Toggle>
                                      <Button
                                        onClick={() => deleteResource.setDeleteResourceModalShow('booking', booking)}
                                        className="mr-3"
                                        variant="outline-danger">
                                        <FontAwesomeIcon icon={faTrash}/>
                                      </Button>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={index}>
                                      <Card.Body>
                                        <ListGroup key={booking.id}>
                                          <ListGroup.Item>
                                            Start
                                            Date: {new Date(booking.startDate).toLocaleDateString("en-AU")}
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            End
                                            Date: {new Date(booking.endDate).toLocaleDateString("en-AU")}
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Start
                                            Odometer: {booking.startOdometer} km
                                          </ListGroup.Item>
										  <ListGroup.Item>
											End
											Odometer: {booking.endOdometer ? `${booking.endOdometer} km` : `Pending`}
										  </ListGroup.Item>
                                          <ListGroup.Item>
                                            Booking
                                            Type: {booking.bookingType === 'D' ? 'Per day' : 'Per kilometer'}
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Booking cost: {
                                            booking.bookingCost ? `$ ${Number.parseFloat(booking.bookingCost).toFixed(2)}` : 'Pending'
                                          }
                                          </ListGroup.Item>
                                        </ListGroup>
                                      </Card.Body>
                                    </Accordion.Collapse>
                                  </Card>
                                </Accordion>
                              ))
                          }
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Accordion>
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle
                          className="mr-auto"
                          as={Button}
                          variant="link"
                          eventKey="1">
                          Journey Records
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse
                        eventKey="1">
                        <Card.Body>
                          {
                            vehicle.bookings &&
							  vehicle
								.bookings
								.reduce((journeys, b) => {
								  b.journeys.forEach(j => {
								    journeys.push(j);
								  });
								  return journeys;
								}, [])
                              .sort((journey1, journey2) => {
                                const journey1StartedAt = new Date(journey1.journeyStartedAt);
                                const journey2StartedAt = new Date(journey2.journeyStartedAt);
                                if (journey1StartedAt > journey2StartedAt) {
                                  return -1;
                                } else if (journey1StartedAt < journey2StartedAt) {
                                  return 1;
                                }
                                return 0;
                              })
                              .map((journey, index) => (
                                <Accordion key={index}>
                                  <Card>
                                    <Card.Header>
                                      <Accordion.Toggle
                                        className="mr-auto"
                                        as={Button}
                                        variant="link"
                                        eventKey={index}>
                                        {`${new Date(journey.journeyStartedAt).toLocaleDateString("en-AU")} - ${new Date(journey.journeyEndedAt).toLocaleDateString("en-AU")}`}
                                      </Accordion.Toggle>
                                      <Button
                                        onClick={() => deleteResource.setDeleteResourceModalShow('journey', journey)}
                                        className="mr-3"
                                        variant="outline-danger">
                                        <FontAwesomeIcon icon={faTrash}/>
                                      </Button>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={index}>
                                      <Card.Body>
                                        <ListGroup key={journey.id}>
                                          <ListGroup.Item>
                                            Journey started
                                            at: {new Date(journey.journeyStartedAt).toLocaleDateString("en-AU")}
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Journey ended
                                            at: {new Date(journey.journeyEndedAt).toLocaleDateString("en-AU")}
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Journey start odometer
                                            reading: {journey.journeyStartOdometerReading} km
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Journey end odometer
                                            reading: {journey.journeyEndOdometerReading} km
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Journey from: {journey.journeyFrom}
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Journey to: {journey.journeyTo}
                                          </ListGroup.Item>
                                        </ListGroup>
                                      </Card.Body>
                                    </Accordion.Collapse>
                                  </Card>
                                </Accordion>
                              ))
                          }
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Accordion>
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle
                          className="mr-auto"
                          as={Button}
                          variant="link"
                          eventKey="2">
                          Service Records
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse
                        eventKey="2">
                        <Card.Body>
                          {
                            vehicleServices
                              .sort((service1, service2) => {
                                const service1At = new Date(service1.servicedAt);
                                const service2At = new Date(service2.servicedAt);

                                if (service1At > service2At) {
                                  return -1;
                                } else if (service1At > service2At) {
                                  return 1;
                                }
                                return 0;
                              })
                              .map((service, index) => (
                                <Accordion key={index}>
                                  <Card key={service.id}>
                                    <Card.Header>
                                      <Accordion.Toggle
                                        className="mr-auto"
                                        as={Button}
                                        variant="link"
                                        eventKey={index}>
                                        {new Date(service.servicedAt).toLocaleDateString("en-AU")}
                                      </Accordion.Toggle>
                                      <Button
                                        onClick={() => deleteResource.setDeleteResourceModalShow('service', service)}
                                        className="mr-3"
                                        variant="outline-danger">
                                        <FontAwesomeIcon icon={faTrash}/>
                                      </Button>
                                    </Card.Header>
                                    <Accordion.Collapse
                                      eventKey={index}>
                                      <Card.Body>
                                        <ListGroup>
                                          <ListGroup.Item>
                                            Serviced
                                            at: {new Date(service.servicedAt).toLocaleDateString("en-AU")}
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Service
                                            odometer: {service.serviceOdometer} km
                                          </ListGroup.Item>
                                        </ListGroup>
                                      </Card.Body>
                                    </Accordion.Collapse>
                                  </Card>
                                </Accordion>
                              ))
                          }
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Accordion>
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle
                          className="mr-auto"
                          as={Button}
                          variant="link"
                          eventKey="3">
                          Fuel Purchase Records
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse
                        eventKey="3">
                        <Card.Body>
                          {
							vehicle
							  .bookings
							  .reduce((fuelPurchases, b) => {
								b.fuelPurchases.forEach(f => {
								  fuelPurchases.push(f);
								});
								return fuelPurchases;
							  }, [])
                              .sort((fuelPurchase1, fuelPurchase2) => {
                                const bookingFuelPurchase1 = vehicleBookings.find(booking => booking.id === fuelPurchase1.bookingID);
                                const booking1StartedAt = new Date(bookingFuelPurchase1.startDate);
                                const bookingFuelPurchase2 = vehicleBookings.find(booking => booking.id === fuelPurchase2.bookingID);
                                const booking2StartedAt = new Date(bookingFuelPurchase2.startDate);
                                if (booking1StartedAt > booking2StartedAt) {
                                  return -1;
                                } else if (booking1StartedAt < booking2StartedAt) {
                                  return 1;
                                }
                                return 0;
                              })
                              .map((fuelPurchase, index) => (
                                <Accordion key={index}>
                                  <Card>
                                    <Card.Header>
                                      <Accordion.Toggle
                                        className="mr-auto"
                                        as={Button}
                                        variant="link"
                                        eventKey={index}>
                                        {`${new Date(vehicleBookings.find(booking => booking.id === fuelPurchase.bookingID).startDate).toLocaleDateString("en-AU")} - ${new Date(vehicleBookings.find(booking => booking.id === fuelPurchase.bookingID).endDate).toLocaleDateString("en-AU")}`}
                                      </Accordion.Toggle>
                                      <Button
                                        onClick={() => deleteResource.setDeleteResourceModalShow('fuel purchase', fuelPurchase)}
                                        className="mr-3"
                                        variant="outline-danger">
                                        <FontAwesomeIcon icon={faTrash}/>
                                      </Button>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={index}>
                                      <Card.Body>
                                        <ListGroup key={fuelPurchase.id}>
                                          <ListGroup.Item>
                                            Fuel
                                            quantity: {fuelPurchase.fuelQuantity} L
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Fuel price (per litre):
                                            $ {Number.parseFloat(fuelPurchase.fuelPrice).toFixed(2)}
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                            Total cost:
                                            $ {(Number.parseFloat(fuelPurchase.fuelQuantity) * Number.parseFloat(fuelPurchase.fuelPrice)).toFixed(2)}
                                          </ListGroup.Item>
                                        </ListGroup>
                                      </Card.Body>
                                    </Accordion.Collapse>
                                  </Card>
                                </Accordion>
                              ))
                          }
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <DeleteResourceModal/>
    </>
  )
}
