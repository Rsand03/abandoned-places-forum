# Step 1: Build the React app using a Node.js image
FROM node:18 AS build

# Set working directory for building the React app
WORKDIR /app

# Define build argument for VITE_API_URL
ARG VITE_API_URL

# Set environment variable inside the container
ENV VITE_API_URL=$VITE_API_URL

# Copy the package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . ./

# Build the React app
RUN npm run build  # This creates the dist/ directory (if that's your output)

# Step 2: Serve the React app directly with a simple static file server (optional)
# You could use `serve` to serve the app, or if you're using Nginx, you can continue with that approach.

# Install the serve package (optional, if you want to use it)
RUN npm install -g serve

# Use the `serve` package to serve the React app
# Note: If `npm run build` creates 'dist', we should reference that directory here.
CMD ["serve", "-s", "dist", "-l", "5173"]

# Expose port 80 (the port `serve` will use)
EXPOSE 5173
