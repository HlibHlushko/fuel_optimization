# base image
FROM node:10 AS base

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --silent

CMD ["npm", "run", "start:dev"]