# Build stage
FROM node:16-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy all source files
COPY . .

# Production stage
FROM node:16-alpine

WORKDIR /app

# Copy from build stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Environment variables
ENV NODE_ENV=production

# Install serve globally
RUN npm install -g serve

# Expose port (this is just documentation - actual port mapping happens at runtime)
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Run the app (using serve for static files or directly run Node)
CMD ["npm", "start"]