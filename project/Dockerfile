# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.12.0

FROM node:${NODE_VERSION}-alpine


# Set working directory
WORKDIR /usr/src/app


# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including dev ones)
RUN npm install

# Copy all source files
COPY . .

# Expose the React dev server port
EXPOSE 3000

# Start the dev server
CMD ["npm", "start"]


