# Use the official Node image as base image
FROM node:16

# Set working directory
WORKDIR /var/www/html/kltn/fe

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
