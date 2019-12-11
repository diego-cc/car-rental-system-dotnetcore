/**
 * ShowVehicle.js
 */
import React, {useContext} from 'react';
import {AppContext} from "../../AppContext/AppContext";
import {Button, Col, Container, Row} from "react-bootstrap";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {useHistory} from 'react-router-dom';
import {VehicleDetails} from "./VehicleDetails";
import {Notification} from "../Notification/Notification";

/**
 * ShowVehicle component - rendered when the user navigates to /show/:vehicleID
 * @param props
 * @returns {*}
 * @constructor
 */
export const ShowVehicle = props => {
  const history = useHistory();
  const {
	vehicles,
	bookings,
	journeys,
	services,
	fuelPurchases,
	loading,
	notification
  } = useContext(AppContext);
  let vehicle, vehicleBookings, vehicleJourneys, vehicleServices, vehicleFuelPurchases;
  vehicle = vehicles.find(v => v.id === props.match.params.vehicleID);
  if (vehicle) {
	vehicleBookings = bookings.filter(b => b.vehicleID === vehicle.id);
	vehicleJourneys = journeys.filter(j => vehicleBookings.some(b => b.id === j.bookingID));
	vehicleServices = services.filter(s => s.vehicleID === vehicle.id);
	vehicleFuelPurchases = fuelPurchases.filter(f => vehicleBookings.some(b => b.id === f.bookingID));
  }

  return (
	<Container>
	  {
		notification.display ?
		  (
			<Notification
			  display={notification.display}
			  message={notification.message}/>
		  ) : ''
	  }
	  {
		vehicle ?
		  (
			<>
			  <Row>
				<Col>
				  <h2 className="text-center my-5">
					{`${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})`}
				  </h2>
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
				  <VehicleDetails
					vehicle={vehicle}
					bookings={vehicleBookings}
					journeys={vehicleJourneys}
					services={vehicleServices}
					fuelPurchases={vehicleFuelPurchases}
				  />
			  }
			</>
		  )
		  :
		  (
			<>
			  <Row className="justify-content-center">
				<Col>
				  <h2 className="text-center my-5">Sorry, no vehicles were found</h2>
				</Col>
			  </Row>
			</>
		  )
	  }
	  <Row className="my-5">
		<Col className="text-center">
		  <Button
			onClick={() => history.push(`/browse`)}
			variant="primary"
			size="lg">
			Browse vehicles
		  </Button>
		</Col>
	  </Row>
	</Container>
  )
};
