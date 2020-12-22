FROM node:12-slim

# create working directory
WORKDIR /app

# install dependencies
COPY ./app/package*.json ./

# run npm install. you just need the runtime dependencies here
RUN npm ci --only-production

# Copy the rest of the code
COPY ./app/ ./

# Expose the port, on which your application is running
EXPOSE 3000

# Run the code
ENTRYPOINT [ "node", "./bin/www" ]
