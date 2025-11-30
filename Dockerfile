# Multi-stage build for production
FROM node:25-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and source code first
COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src/

# Ensure latest NPM
RUN npm i -g npm@latest

# Install ALL dependencies (including dev dependencies for building)
RUN npm ci

# Build the application
RUN npm run build

# Production stage
FROM node:25-alpine AS production

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

# Remove unnecessary binaries and tools to harden the image
RUN rm -rf /usr/local/bin/docker-entrypoint.sh \
    /usr/local/bin/npm \
    /usr/local/bin/npx \
    /usr/local/lib/node_modules/npm \
    /usr/local/lib/node_modules/corepack && \
    find /bin /sbin /usr/bin /usr/sbin -type f \( \
        -name "apk" -o -name "apk-tools" -o -name "openssh*" \
    \) -delete 2>/dev/null || true

# Switch to nodejs user
USER nodejs

# Set the entrypoint
ENTRYPOINT ["node", "dist/main.js"]
