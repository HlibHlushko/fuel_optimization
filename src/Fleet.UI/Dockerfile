FROM node:12.2.0-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --production --silent 

COPY . /app
CMD ["sh", "-c", "npm run build && tail -f /dev/null"]