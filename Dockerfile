# Use a Node.js base image with TypeScript support
FROM node:latest

# Create a directory for the app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
COPY prisma ./prisma/

# Copy "wait-for-it.sh" to the container
COPY wait-for-it.sh /usr/src/app/

# Install dependencies
RUN yarn install
RUN npx prisma generate


# Copy the rest of your app's source code
COPY . .

# Build your TypeScript files
RUN yarn run build


EXPOSE 3000

CMD [ "node", "build/app.js" ]
