# Use a Node base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy root package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy frontend and backend package.json files
COPY client/package.json client/package-lock.json client/
COPY server/package.json server/package-lock.json server/

# Install dependencies for both frontend and backend
RUN npm install
RUN cd client && npm install --legacy-peer-deps
RUN cd server && npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN cd client && npm run build

# Expose ports for frontend and backend
EXPOSE 3000 5000

# Run both frontend and backend using concurrently
CMD ["npm", "run", "dev"]
