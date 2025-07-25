# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY server.js ./

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["npm", "start"] 