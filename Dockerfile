# Multi-stage build for production
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and source code first
COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src/

# Install ALL dependencies (including dev dependencies for building)
RUN npm ci

# Build the application
RUN npm run build

# Production stage
FROM node:24-alpine AS production

# Install git (required for repository cloning)
RUN apk add --no-cache git

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files and built application
COPY package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies (skip prepare script)
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to nodejs user
USER nodejs

# Set the entrypoint
ENTRYPOINT ["node", "dist/main.js"]
