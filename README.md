# Car Rental System - ASP\.NET Core

This repository is an implementation of the previous [car rental system](https://github.com/diego-cc/car-rental-system/tree/mysql "Car Rental System") that I developed for an assignment at North Metropolitan TAFE, with a backend API server written in [ASP.NET Core 3.1](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-3.1 "ASP.NET Core 3.1").

This version does not yet provide all of the functionalities of the previous one.

## Requirements

To run this application, you need to have installed in your system:

- .NET Core SDK (3.1+)
- Node.js (13.1.0+)
- MySQL (5.7.24)
- Yarn (1.19.1+)

## Install

To install the packages that are needed to run this application, go to `frontend/car-rental-system` and run:

`yarn`

## Run

**NOTE: Please read the instructions provided at [DCC-FleetManager.sql](https://github.com/diego-cc/car-rental-system-dotnetcore/blob/master/backend/Car-Rental-System-API/DCC-FleetManager.sql "DCC-FleetManager.sql") to set up the database before running the application. After that, make sure that the DB server is running before proceeding.**

From the `frontend/car-rental-system` directory, execute:

`yarn start`

## Build

To build the frontend React application, run from the `frontend/car-rental-system` directory: 

`yarn build`

## Test

To test the frontend app, run from `frontend/car-rental-system`:

`yarn test`

Tests for the backend server are not available yet.

## License

[MIT](https://github.com/diego-cc/car-rental-system-dotnetcore/blob/master/LICENSE)