# React
FROM node:20.11-bookworm

# Set the working directory in the container
WORKDIR /app

# install dependencies
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install

# copy project
COPY . .