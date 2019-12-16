/**
 * DeleteResourceModal.js
 */
import React, {useContext} from 'react';
import {Button, ListGroup, Modal} from "react-bootstrap";
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import moment from "moment";

/**
 * DeleteResourceModal component - displays a modal to confirm whether a resource (i.e. vehicle, booking,
 * journey, service or fuel purchase) should be deleted
 * @returns {*}
 * @constructor
 */
export const DeleteResourceModal = () => {
  const {vehicles, deleteResource} = useContext(AppContext);
  const {resource, resourceType} = deleteResource;

  /**
   * Renders all the information about a resource in a list
   * @param {string} resourceType - one of: "vehicle", "booking", "journey", "service",
   * "fuelPurchase" or "fuel purchase"
   * @param {(Vehicle|Booking|Journey|Service|FuelPurchase)} resource - the resource object
   * @returns {*}
   */
  const renderResourceInfo = (resourceType, resource) => {
	if (resourceType && resource) {
	  switch (resourceType.trim().toLowerCase()) {
		case 'vehicle':
		  return (
			<ListGroup>
			  <ListGroup.Item>Manufacturer: {resource ? resource.manufacturer : ''}</ListGroup.Item>
			  <ListGroup.Item>Model: {resource ? resource.model : ''}</ListGroup.Item>
			  <ListGroup.Item>Year: {resource ? resource.year : ''}</ListGroup.Item>
			  <ListGroup.Item>Registration
				number: {resource ? resource.registration : ''}</ListGroup.Item>
			  <ListGroup.Item>Odometer
				reading: {resource ? resource.odometer : 0} km</ListGroup.Item>
			  <ListGroup.Item>Tank
				capacity: {resource ? resource.tankSize : 0} L</ListGroup.Item>
			</ListGroup>
		  );

		case 'journey':
		  return (
			<ListGroup>
			  <ListGroup.Item>
				Journey
				vehicle: {resource && vehicles.find(v => v.bookings.some(b => b.journeys.some(j => j.uuid === resource.uuid))) ? `${vehicles.find(v => v.bookings.some(b => b.journeys.some(j => j.uuid === resource.uuid))).manufacturer} ${vehicles.find(v => v.bookings.some(b => b.journeys.some(j => j.uuid === resource.uuid))).model} (${vehicles.find(v => v.bookings.some(b => b.journeys.some(j => j.uuid === resource.uuid))).year})` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey start date: {resource ? moment(resource.startedAt).format('DD/MM/YYYY') : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey end date: {resource ? moment(resource.endedAt).format('DD/MM/YYYY') : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey start odometer
				reading: {resource ? `${resource.startOdometer} km` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey end odometer
				reading: {resource ? `${resource.endOdometer} km` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey from: {resource ? resource.journeyFrom : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey to: {resource ? resource.journeyTo : ''}
			  </ListGroup.Item>
			</ListGroup>
		  );

		case 'booking':
		  return (
			<ListGroup>
			  <ListGroup.Item>
				Booking
				vehicle: {resource ? `${vehicles.find(v => v.uuid === resource.vehicleUuid).manufacturer} ${vehicles.find(v => v.uuid === resource.vehicleUuid).model} (${vehicles.find(v => v.uuid === resource.vehicleUuid).year})` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Booking start date: {resource ? moment(resource.startedAt).format('DD/MM/YYYY') : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Booking end date: {resource ? moment(resource.endedAt).format('DD/MM/YYYY') : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Booking start odometer reading: {resource ? `${resource.startOdometer} km` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Booking type: {resource ? resource.type === 'K' ? 'Per kilometer' : 'Per' +
				' day' : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Booking cost: {
			    `$ ${Number.parseFloat(resource.cost).toFixed(2)}`
			  }
			  </ListGroup.Item>
			</ListGroup>
		  );

		case 'service':
		  return (
			<ListGroup>
			  <ListGroup.Item>
				Service
				vehicle: {resource && vehicles.some(v => v.uuid === resource.vehicleUuid) ? `${vehicles.find(v => v.uuid === resource.vehicleUuid).manufacturer} ${vehicles.find(v => v.uuid === resource.vehicleUuid).model} (${vehicles.find(v => v.uuid === resource.vehicleUuid).year})` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Serviced at: {resource ? moment(resource.servicedAt).format('DD/MM/YYYY') : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Service odometer reading: {resource ? `${resource.odometer} km` : ''}
			  </ListGroup.Item>
			</ListGroup>
		  );

		case 'fuelpurchase':
		case 'fuel purchase':
		  return (
			<ListGroup>
			  <ListGroup.Item>
				Fuel purchased for
				vehicle: {resource && vehicles.find(v => v.bookings.some(b => b.fuelPurchases.some(f => f.uuid === resource.uuid))) ? `${vehicles.find(v => v.bookings.some(b => b.fuelPurchases.some(f => f.uuid === resource.uuid))).manufacturer} ${vehicles.find(v => v.bookings.some(b => b.fuelPurchases.some(f => f.uuid === resource.uuid))).model} (${vehicles.find(v => v.bookings.some(b => b.fuelPurchases.some(f => f.uuid === resource.uuid))).year})` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Fuel quantity: {resource ? `${resource.fuelQuantity} L` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Fuel
				price: {resource ? `$ ${Number.parseFloat(resource.fuelPrice).toFixed(2)}` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Total cost: {resource ? `$ ${(resource.fuelQuantity * resource.fuelPrice).toFixed(2)}` : ``}
			  </ListGroup.Item>
			</ListGroup>
		  );

		default:
		  return (
			<p className="text-center">Error: resource info not found</p>
		  );
	  }
	}
  };

  return (
	<AppConsumer>
	  {
		({deleteResource}) => {
		  return (
			<Modal
			  size="lg"
			  show={deleteResource.showDeleteResourceModal}
			  onHide={() => deleteResource.setDeleteResourceModalShow(null, null)}
			  aria-labelledby="delete-modal"
			  centered
			>
			  <Modal.Header closeButton>
				<Modal.Title id="delete-modal">
				  Delete confirmation
				</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
				<h3 className="mb-4">Are you sure that you want to delete this {resourceType} from
				  the
				  system?</h3>
				<h4>{resourceType} information:</h4>
			  </Modal.Body>
			  {renderResourceInfo(resourceType, resource)}
			  <Modal.Footer>
				<Button
				  variant="danger"
				  size="lg"
				  className="mr-3"
				  onClick={() => deleteResource.resource ? deleteResource.confirmDeleteResource(resourceType, resource) : ''}
				>
				  Delete
				</Button>
				<Button
				  variant="info"
				  size="lg"
				  onClick={() => deleteResource.setDeleteResourceModalShow(null)}
				>
				  Cancel
				</Button>
			  </Modal.Footer>
			</Modal>
		  )
		}
	  }
	</AppConsumer>
  )
};
