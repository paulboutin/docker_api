FROM node:12-slim

# create a directory in your docker image
WORKDIR /app

# install dependencies
COPY ./app/package*.json ./

# run npm install. you just need the runtime dependencies here
RUN npm ci --only-production

# Copy the rest of the code
COPY ./app/ ./

# Expose the port, on which your application is running
EXPOSE 4000

# Run the code
CMD [ "node", "./bin/www" ]
