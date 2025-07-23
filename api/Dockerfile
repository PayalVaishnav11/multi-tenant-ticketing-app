# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose backend port (same as your .env PORT)
EXPOSE 8000

# Start the backend
CMD ["npm", "run", "dev"]
