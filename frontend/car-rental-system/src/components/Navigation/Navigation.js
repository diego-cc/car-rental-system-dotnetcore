/**
 * Navigation.js
 */
import React from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import NavItem from "react-bootstrap/NavItem";
import {SearchVehicle} from "./SearchVehicle";

/**
 * Navigation component - renders a navbar to navigate through the app
 */
export class Navigation extends React.Component {
  render() {
	return (
	  <Navbar bg="light" variant="light" expand="lg">
		<Navbar.Brand as={Link} to="/" className="mr-lg-5">Car Rental System</Navbar.Brand>
		<Navbar.Toggle aria-controls="navbar-collapse"/>
		<Navbar.Collapse id="navbar-collapse">
		  <Nav className="mr-auto">
			<NavItem>
			  <Nav.Link as={Link} to="/" className="mr-lg-3">Home</Nav.Link>
			</NavItem>
			<NavDropdown className="mr-lg-4" title="Manage vehicles" id="manage-vehicles">
			  <NavDropdown.Item as={Link} to="/browse">Browse vehicles</NavDropdown.Item>
			  <NavDropdown.Item as={Link} to="/add">Add a new vehicle</NavDropdown.Item>
			</NavDropdown>
		  </Nav>
		  <SearchVehicle />
		</Navbar.Collapse>
	  </Navbar>
	)
  }
}
