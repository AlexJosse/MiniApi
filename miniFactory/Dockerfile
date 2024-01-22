# Use a Node.js base image with TypeScript support
FROM node:latest

# Create a directory for the script
WORKDIR /usr/src/miniFactory

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN yarn install


# Copy the script source code
COPY . .

# Build your TypeScript files
RUN yarn run build

# Expose the port if needed
# EXPOSE 3001

CMD [ "node", "build/miniFactorySub.js" ]
