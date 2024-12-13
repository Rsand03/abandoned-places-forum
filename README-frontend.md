# Frontend Repository

This repository contains the frontend for the web application built with React. It is designed to be deployed using Docker, Docker Compose, and GitLab CI/CD pipelines.

## Prerequisites

Before running or contributing to this project, ensure you have the following installed:

- Docker
- Docker Compose
- Node.js (for local development)
- GitLab CI/CD pipeline configured (for CI/CD)

## Project Structure

- **Dockerfile**: Contains instructions to build and run the React app inside a Docker container.
- **docker-compose.yml**: Defines the Docker Compose setup, which runs the web frontend as a container.
- **.gitlab-ci.yml**: Contains GitLab CI/CD pipeline configuration for building, dockerizing, and deploying the frontend.
- **src/**: The source code for the React app.
- **public/**: The public folder for the React app.
- **package.json**: The npm configuration file for managing dependencies and scripts.

## Getting Started

### 1\. Clone the repository

bash

Copy code

`git clone https://github.com/yourusername/frontend.git cd frontend`

### 2\. Install Dependencies

To install the necessary dependencies for local development:

bash

Copy code

`npm install`

### 3\. Start the Development Server

To run the application locally:

bash

Copy code

`npm run dev`

This will start the app at http://localhost:5173.

## Docker Setup

This project is configured to run in a Docker container using Docker Compose. Below is an overview of the setup:

### 1\. Docker Compose

The `docker-compose.yml` file defines the following:

- **web-frontend**: The React app is served on port 5173 inside the container and mapped to port 8081 on your local machine. It connects to the backend API through the environment variable `VITE_API_URL`.

#### Example Configuration:

```yaml
version: "3.7"
services:
  web-frontend:
    image: tiim32/frontend:latest
    container_name: web-frontend
    restart: always
    ports:
      - "8081:5173"
    environment:
      - VITE_API_URL=http://tiim32.zapto.org
```

- **VITE_API_URL**: The environment variable passed to the container that tells the frontend app where the backend API is located.

### 2\. Dockerfile

The `Dockerfile` defines the following steps:

1.  **Build the React app** using a Node.js image.
2.  **Serve the app** using the `serve` package or any other method (e.g., Nginx).
3.  Exposes port `5173` for the app.

Here's the relevant section of the `Dockerfile`:

```yaml
# Step 1: Build the React app using a Node.js image
FROM node:18 AS build
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Step 2: Serve the React app
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]
EXPOSE 5173

```

### 3\. Running Docker Compose

To run the application using Docker Compose:

```bash
docker-compose up --build
```

This will start the frontend service and map it to port 8081 on your local machine.

## GitLab CI/CD Pipeline

This repository is configured with GitLab CI/CD to automate the process of building, dockerizing, and deploying the frontend app.

### Stages

1.  **Build**: Installs dependencies and builds the React app.
2.  **Dockerize**: Builds and pushes the Docker image to Docker Hub.
3.  **Deploy**: Deploys the app to a remote server via SSH using `docker-compose`.

### Example `.gitlab-ci.yml` Configuration

yaml

```yaml
stages:
  - build
  - dockerize
  - deploy

variables:
  DOCKER_REGISTRY: docker.io
  DOCKER_IMAGE: tiim32/frontend

build:
  stage: build
  image: node:18
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/
  only:
    - branches

dockerize:
  stage: dockerize
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_TLS_CERTDIR: ""
  script:
    - |
      docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD $DOCKER_REGISTRY
      docker build -t $DOCKER_REGISTRY/$DOCKER_IMAGE-$CI_COMMIT_SHORT_SHA .
      docker push $DOCKER_REGISTRY/$DOCKER_IMAGE-$CI_COMMIT_SHORT_SHA
      docker tag $DOCKER_REGISTRY/$DOCKER_IMAGE-$CI_COMMIT_SHORT_SHA $DOCKER_REGISTRY/$DOCKER_IMAGE
      docker push $DOCKER_REGISTRY/$DOCKER_IMAGE
  only:
    - branches

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add - || echo "Failed to add SSH key"
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "
      cd /opt/iti0302/frontend &&
      sudo docker-compose down &&
      sudo docker-compose pull &&
      sudo docker-compose up -d"
  only:
    - branches
```

## Deployment

The deployment is done automatically via the CI/CD pipeline to a remote server. Ensure that the necessary SSH keys and environment variables (`SERVER_USER`, `SERVER_IP`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `SSH_PRIVATE_KEY`) are set up in GitLab's CI/CD environment.

### Remote Server Commands

The deploy job will:

1.  SSH into the remote server.
2.  Navigate to the frontend directory.
3.  Bring down the current Docker containers.
4.  Pull the latest images and restart the services.

## Environment Variables

The following environment variables should be configured:

- `VITE_API_URL`: The URL of the backend API. This is used during the build process and passed to the app.

## Contributing

If you'd like to contribute to this project, feel free to submit a pull request or open an issue for discussion.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

This `README.md` provides a comprehensive guide on how to set up, run, and deploy the frontend application, along with a breakdown of the Docker, Docker Compose, and GitLab CI/CD configurations.
