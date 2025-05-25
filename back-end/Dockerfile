# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig.json ./  

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build and run in dev mode
CMD ["npm", "run", "start:dev"]