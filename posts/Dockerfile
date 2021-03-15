FROM node:15-buster-slim AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --ignore-scripts=false
COPY . .
RUN npx tsc -p ./tsconfig.json
EXPOSE 5000


# FROM node:12
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install
# COPY --from=build /usr/src/app/dist dist
# EXPOSE 5000