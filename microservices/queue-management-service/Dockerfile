# queue-management-service/Dockerfile
FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Define the command to run the app
CMD ["node", "index.js"]
