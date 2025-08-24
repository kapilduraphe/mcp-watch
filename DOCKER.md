# Docker Guide for MCP Watch 🐳

This guide explains how to use MCP Watch with Docker for both production and development environments.

## Quick Start

### Production Container
```bash
# Build the production image
docker build -t mcp-watch .

# Run a security scan
docker run --rm mcp-watch scan https://github.com/user/mcp-server

# Run with options
docker run --rm mcp-watch scan https://github.com/user/mcp-server --format json --severity high
```

### Development Container
```bash
# Build and run with Docker Compose
docker-compose up mcp-watch-dev

# Or run individual commands
docker-compose run --rm mcp-watch-dev npm run scan -- https://github.com/user/repo
```

## Docker Images

### Production Image (`Dockerfile`)
- **Base**: Node.js 18 Alpine Linux
- **Size**: ~100MB (optimized)
- **Security**: Runs as non-root user
- **Features**: Multi-stage build, production dependencies only

### Development
For local development, you can run the application directly on your host machine:
```bash
npm install
npm run dev
```

## Docker Compose

### Services

#### `mcp-watch` (Production)
```yaml
mcp-watch:
  build: .
  container_name: mcp-watch
  environment:
    - NODE_ENV=production
```



## Usage Examples

### Basic Scanning
```bash
# Scan a repository
docker run --rm mcp-watch scan https://github.com/user/mcp-server

# Filter by severity
docker run --rm mcp-watch scan https://github.com/user/mcp-server --severity high

# JSON output
docker run --rm mcp-watch scan https://github.com/user/mcp-server --format json
```

### Development Workflow
```bash
# Run development server locally
npm run dev

# Run scans during development
npm run scan -- https://github.com/user/repo

# Check help
npm run scan -- --help
```

### Interactive Development
```bash
# Run commands directly
npm run dev scan https://github.com/user/repo
npm run type-check
```

## Build Commands

### Production Build
```bash
# Build production image
docker build -t mcp-watch .

# Build with specific tag
docker build -t mcp-watch:v2.0.0 .

# Build without cache
docker build --no-cache -t mcp-watch .
```

### Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Environment Variables

### Production
```bash
docker run -e NODE_ENV=production mcp-watch scan https://github.com/user/repo
```

### Development
```bash
docker-compose run -e NODE_ENV=development mcp-watch-dev npm run scan -- https://github.com/user/repo
```

## Volume Mounting

### Source Code Development
```bash
# Mount source code for live editing
docker run -v $(pwd)/src:/app/src mcp-watch scan https://github.com/user/repo
```

### Custom Configuration
```bash
# Mount custom config files
docker run -v $(pwd)/config:/app/config mcp-watch scan https://github.com/user/repo
```

## Network Configuration

### Expose Ports
```bash
# Expose port 3000 (if running as service)
docker run -p 3000:3000 mcp-watch
```

### Custom Networks
```bash
# Create custom network
docker network create mcp-network

# Run with custom network
docker run --network mcp-network mcp-watch scan https://github.com/user/repo
```

## Security Features

### Non-Root User
- Production container runs as `nodejs` user (UID 1001)
- Reduced attack surface
- Follows security best practices

### Minimal Base Image
- Alpine Linux for smaller attack surface
- Only necessary packages installed
- Regular security updates

### Resource Limits
```bash
# Set memory limits
docker run --memory=512m mcp-watch scan https://github.com/user/repo

# Set CPU limits
docker run --cpus=1.0 mcp-watch scan https://github.com/user/repo
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clean build
docker system prune -f
docker-compose build --no-cache
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

#### Network Issues
```bash
# Check container networking
docker network ls
docker network inspect mcp-watch_default
```

### Debug Commands
```bash
# Check container logs
docker-compose logs mcp-watch-dev

# Enter running container
docker-compose exec mcp-watch-dev sh

# Check container status
docker-compose ps
```

## Performance Optimization

### Build Optimization
- Multi-stage builds reduce final image size
- Layer caching for faster rebuilds
- `.dockerignore` excludes unnecessary files

### Runtime Optimization
- Alpine Linux for fast startup
- Minimal dependencies
- Efficient file system operations

## CI/CD Integration

### GitHub Actions
```yaml
- name: Build Docker image
  run: docker build -t mcp-watch .
  
- name: Test Docker image
  run: docker run --rm mcp-watch scan --help
```

### Docker Hub
```bash
# Tag for Docker Hub
docker tag mcp-watch username/mcp-watch:latest

# Push to Docker Hub
docker push username/mcp-watch:latest
```

## Best Practices

### Image Management
- Use specific tags instead of `latest`
- Regular base image updates
- Clean up unused images

### Security
- Scan images for vulnerabilities
- Keep base images updated
- Use minimal base images

### Development
- Use volume mounts for source code
- Leverage Docker Compose for complex setups
- Implement proper health checks

## Support

For Docker-related issues:
1. Check the troubleshooting section
2. Review Docker logs
3. Verify Docker and Docker Compose versions
4. Create an issue with detailed error information

---

**Note**: The Docker setup provides both production-ready and development-friendly environments. Choose the appropriate image based on your use case.
