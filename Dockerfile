# Use an official Node runtime as the parent image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Pass build arguments
ARG REACT_APP_API_URL
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENT_ID
ARG REACT_APP_AUTH0_AUDIENCE

# Make environment variables available to React
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_AUTH0_DOMAIN=$REACT_APP_AUTH0_DOMAIN
ENV REACT_APP_AUTH0_CLIENT_ID=$REACT_APP_CLIENT_ID
ENV REACT_APP_AUTH0_AUDIENCE=$REACT_APP_AUTH0_AUDIENCE

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the app for production
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["serve", "-s", "build", "-l", "3000"]