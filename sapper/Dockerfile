FROM node:12 AS build
WORKDIR /usr/src/app
COPY . .
RUN npm install
ENV HOST=0.0.0.0
EXPOSE 3000