#base image
FROM node:12.2.0-alpine as react-build

# set working directory
WORKDIR /app

#install and cache app dependencies
COPY package*.json ./
RUN npm install --silent

CMD ["npm", "start"]