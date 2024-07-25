# /automated-api-tester/client/Dockerfile

# Use the official Node.js image to build the React app
FROM node:14 AS build

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use the official nginx image to serve the built React app
FROM nginx:alpine

# Copy the build output to the nginx html directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port nginx runs on
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
