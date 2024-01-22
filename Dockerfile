# Use a Node.js base image with TypeScript support
FROM node:latest

# Create a directory for the app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Copy "wait-for-it.sh" to the container
COPY wait-for-it.sh /usr/src/app/

# Install dependencies
RUN yarn install
RUN npx prisma generate


# Copy the rest of your app's source code
COPY . .

# Build your TypeScript files
RUN yarn run build


# Your app should now be compiled to JavaScript in the dist/ directory. Adjust this if your output directory is different.

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "build/app.js" ] # Replace with your start file
