# base image
FROM node:10 AS base
WORKDIR /usr/src/build

# install dependencies
COPY package*.json ./
RUN npm config set depth 0 && \
    npm install --only=production
RUN cp -R ./node_modules ./production_node_modules
RUN npm install
# compile typescript
COPY . .
RUN npm run build

# realease image
FROM node:10-slim AS release
WORKDIR /usr/src/app

COPY --from=base /usr/src/build/production_node_modules ./node_modules
COPY --from=base /usr/src/build/dist .
COPY package.json ./

EXPOSE 8000
CMD [ "npm", "start" ]
