# Car Rental System - Frontend

## Installing packages

```shell script
npm i
```

## Running the app

```shell script
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser of choice.

## Using Docker

Alternatively, you may run this app as a Docker container. Follow the instructions below to do so.

> NOTE: If you're on Windows, run the commands below on PowerShell. They might not work on Git Bash.

### Building the image

```shell script
docker build -t crs-frontend .
```

### Running the container

```shell script
docker run \
    -itd \
    --rm \
    -v ${PWD}:/app \
    -v /app/node_modules \
    -p 3000:3000 \
    -e CHOKIDAR_USEPOLLING=true \
    crs-frontend
```
