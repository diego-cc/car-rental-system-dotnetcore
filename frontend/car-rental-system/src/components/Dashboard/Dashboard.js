/**
 * Dashboard.js
 */
import React, { useContext } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { Header } from "../Header/Header";
import { AppContext } from "../../AppContext/AppContext";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { RevenueChart } from "./RevenueChart";

/**
 * Dashboard component - the first component displayed when the app starts
 * @param props
 * @returns {*}
 * @constructor
 */
export const Dashboard = (props) => {
  const { loading, revenue } = useContext(AppContext);

  return (
    <Container className="text-center">
      <Header headerText="Welcome to the Car Rental System" />
      {loading ? (
        <Row className="justify-content-center mt-5">
          <LoadingSpinner />
        </Row>
      ) : (
        <>
          <h2 className="my-5 text-center">Revenue history (last 6 months):</h2>
          <Row>
            <RevenueChart data={revenue} />
          </Row>
        </>
      )}
      <Button
        size="lg"
        variant="primary"
        className="mt-5"
        onClick={() => props.history.push("/browse")}
      >
        Browse vehicles
      </Button>
    </Container>
  );
};
