# Automated API Tester

A web application for automated API testing, featuring both a client and a server. This guide covers setting up the project, running it with Docker, and managing it on a remote server.

## Table of Contents

- [Application Composition](#composition)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Running with Docker](#running-with-docker)

## Application Composition

**Automated API Tester** is a web application consisting of a React frontend and a Node.js backend.

- **Frontend (Client)**: Built with React, it provides a user-friendly interface for performing API tests. It includes components for user authentication, test management, and results display.

- **Backend (Server)**: Developed using Node.js and Express, it handles API requests, manages test executions, and interacts with a MongoDB database. It features routes for authentication, test scheduling, and result storage.

**Overall Architecture**:
- **Frontend**: Handles user interactions and communicates with the backend via API calls.
- **Backend**: Manages business logic, performs API testing, and stores results.


## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Docker
- Docker Compose
- Git

## Project Structure

automated-api-tester/
├── client/
│ ├── Dockerfile
│ ├── package.json
│ └── ... (other client files)
├── server/
│ ├── Dockerfile
│ ├── package.json
│ └── ... (other server files)
├── docker-compose.yml
├── Dockerfile
└── README.md

- `client/` - Contains the frontend application.
- `server/` - Contains the backend application.
- `docker-compose.yml` - Docker Compose configuration file to run both client and server.
- `Dockerfile` - (Root) Configuration for building the Docker image.

## Setup

1. **Clone the Repository**

  ``` git clone <repository-url>```

  ``` cd automated-api-tester```

2. **Install Docker and Docker Compose**

    Follow the instructions on the official Docker website to install Docker and Docker Compose.

## Running with Docker
### Build and Start Containers

1. **Build and Run in Detached Mode**

    To build the Docker images and start the containers in the background:

    ```docker-compose up -d --build```

This command will build the images defined in the docker-compose.yml file and start the containers in detached mode.

2. **Check Container Status**

    To check if the containers are running:

    ```docker-compose ps```

3. **View Logs**

   To view the logs of your services:

    ```docker-compose logs```

4. **Stop and Remove Containers**

To stop and remove the containers:

    ```docker-compose down```


