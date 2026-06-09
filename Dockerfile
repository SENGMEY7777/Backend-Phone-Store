FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies (package.json and package-lock.json should be present)
COPY package*.json ./
RUN npm install --production

# Copy application source
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
