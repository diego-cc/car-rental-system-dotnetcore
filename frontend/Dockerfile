FROM node:alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY ./car-rental-system/package*.json ./

RUN npm i && npm i -g react-scripts

COPY ./car-rental-system ./

CMD ["npm", "start"]
