# MCP Watch 🔍

A comprehensive security scanner for Model Context Protocol (MCP) servers that detects vulnerabilities and security issues in your MCP implementations.

## Features

- **🔑 Credential Detection** - Finds hardcoded API keys, tokens, and insecure credential storage
- **🧪 Tool Poisoning** - Detects hidden malicious instructions in tool descriptions
- **🎯 Parameter Injection** - Identifies magic parameters that extract sensitive AI context
- **💉 Prompt Injection** - Scans for prompt manipulation and injection attacks
- **🔄 Tool Mutation** - Detects dynamic tool changes and rug-pull risks
- **💬 Conversation Exfiltration** - Finds triggers that steal conversation history
- **🎨 ANSI Injection** - Detects steganographic attacks using escape sequences
- **📋 Protocol Violations** - Identifies MCP protocol security violations
- **🛡️ Input Validation** - Finds command injection, SSRF, and path traversal issues
- **🎭 Server Spoofing** - Detects servers impersonating popular services
- **🌊 Toxic Flows** - Identifies dangerous data flow patterns
- **🔐 Permission Issues** - Finds excessive permissions and access control problems

## Quick Start 🚀

### Option 1: NPM Package (Recommended)
```bash
# Install globally
npm install -g mcp-watch

# Scan any GitHub MCP repository
mcp-watch scan https://github.com/user/mcp-server

# Scan your local MCP project
mcp-watch scan-local /path/to/your/mcp-project
```

### Option 2: From GitHub Source
```bash
# Clone and use immediately
git clone https://github.com/kapilduraphe/mcp-watch.git
cd mcp-watch
npm install
npm run build

# Scan GitHub repos
npm run scan:github https://github.com/user/mcp-server

# Scan local projects  
npm run scan:local /path/to/your/mcp-project
```

### Option 3: Docker (No Installation)
```bash
# Scan without installing anything
docker run --rm mcp-watch scan https://github.com/user/mcp-server
docker run --rm -v $(pwd):/workspace mcp-watch scan-local /workspace
```

## Installation

### Global Installation
```bash
npm install -g mcp-watch
```

### Local Installation
```bash
npm install mcp-watch
```

### From Source
```bash
git clone https://github.com/kapilduraphe/mcp-watch.git
cd mcp-watch
npm install
npm run build
```



### Docker Installation 🐳

#### Quick Start with Docker
```bash
# Build and run locally
docker build -t mcp-watch .
docker run --rm mcp-watch scan https://github.com/user/mcp-server

# Build from source
git clone https://github.com/kapilduraphe/mcp-watch.git
cd mcp-watch
docker build -t mcp-watch .
```

#### Docker Compose (Recommended for Production)

```bash
# Build and run with Docker Compose
docker compose build
docker compose up mcp-watch

# Or run a one-off scan
docker compose run --rm mcp-watch scan https://github.com/user/repo
```



#### Docker Features
- **🔒 Security**: Non-root user, minimal attack surface
- **📦 Optimized**: Multi-stage builds, Alpine Linux base
- **🚀 Production**: Ready for deployment and CI/CD
- **🧹 Simplified**: Single optimized Dockerfile for all use cases


## Usage

### Command Line

#### Scan GitHub Repositories
```bash
# Scan a GitHub repository
mcp-watch scan https://github.com/user/mcp-server

# Scan with JSON output
mcp-watch scan https://github.com/user/mcp-server --format json

# Filter by severity
mcp-watch scan https://github.com/user/mcp-server --severity high

# Filter by category
mcp-watch scan https://github.com/user/mcp-server --category credential-leak
```

#### Scan Local Projects
```bash
# Scan current directory
mcp-watch scan-local .

# Scan specific directory (absolute path)
mcp-watch scan-local /path/to/your/mcp-project

# Scan specific directory (relative path)
mcp-watch scan-local ../my-mcp-server

# Local scan with JSON output
mcp-watch scan-local . --format json

# Local scan with severity filter
mcp-watch scan-local . --severity high
```

### Installation Method Usage

#### From NPM Package
```bash
# Global installation (recommended)
npm install -g mcp-watch
mcp-watch scan https://github.com/user/mcp-server
mcp-watch scan-local /path/to/project
```

#### From GitHub Source
```bash
# Clone and build
git clone https://github.com/kapilduraphe/mcp-watch.git
cd mcp-watch
npm install
npm run build

# Use built version
node dist/main.js scan https://github.com/user/mcp-server
node dist/main.js scan-local /path/to/project

# Or use npm scripts
npm run scan https://github.com/user/mcp-server
npm run scan-local /path/to/project
```

### Docker Usage 🐳

```bash
# Production container
docker run --rm mcp-watch scan https://github.com/user/mcp-server
docker run --rm mcp-watch scan https://github.com/user/mcp-server --format json --severity high

# Docker Compose
docker compose run --rm mcp-watch scan https://github.com/user/repo
docker compose run --rm mcp-watch scan https://github.com/user/repo --format json

# Interactive container
docker run -it --rm mcp-watch sh
```

### Options

- `--format <type>` - Output format: `console` (default) or `json`
- `--severity <level>` - Minimum severity: `low`, `medium`, `high`, `critical`
- `--category <cat>` - Filter by vulnerability category

### Categories

- `credential-leak` - Hardcoded credentials and insecure storage
- `tool-poisoning` - Malicious tool descriptions
- `data-exfiltration` - Data theft and parameter injection
- `prompt-injection` - Prompt manipulation attacks
- `tool-mutation` - Dynamic tool changes
- `steganographic-attack` - Hidden content in escape sequences
- `protocol-violation` - MCP protocol security issues
- `input-validation` - Command injection, SSRF, path traversal
- `server-spoofing` - Server impersonation
- `toxic-flow` - Dangerous data flows
- `access-control` - Permission and access issues

## Example Output

```
🔍 Scanning repository: https://github.com/user/mcp-server
📊 Based on vulnerablemcp.info, HiddenLayer, Invariant Labs, and Trail of Bits research

🔑 Scanning for credential vulnerabilities...
🧪 Scanning for tool poisoning vulnerabilities...
🎯 Scanning for parameter injection vulnerabilities...
💉 Scanning for prompt injection vulnerabilities...

📊 MCP SECURITY SCAN RESULTS
===============================

📈 Summary by Severity:
  🚨 CRITICAL: 2
  ⚠️ HIGH: 1
  ⚡ MEDIUM: 3

🔍 Detailed Results:
--------------------

1. 🚨 Hardcoded credentials detected
   📋 ID: HARDCODED_CREDENTIALS
   🎯 Severity: CRITICAL
   📂 Category: credential-leak
   📍 Location: src/config.ts:15
   🔍 Evidence: const apiKey = "sk-***REDACTED***"
```

## Development

### Project Structure
```
mcp-watch/
├── main.ts                          # CLI entry point
├── types/
│   └── Vulnerability.ts             # Type definitions
├── scanner/
│   ├── MCPScanner.ts               # Main scanner orchestrator
│   ├── BaseScanner.ts              # Base scanner utilities
│   └── scanners/                   # Individual vulnerability scanners
│       ├── CredentialScanner.ts
│       ├── ParameterInjectionScanner.ts
│       └── ...
├── utils/
│   └── reportFormatter.ts          # Report formatting
└── Docker/                          # Containerization
    ├── Dockerfile                   # Production image
    ├── docker-compose.yml           # Multi-service orchestration (Docker Compose v2)
    └── .dockerignore                # Build optimization
```

### Development Scripts
```bash
# Build the project
npm run build

# Run in development mode
npm run dev scan https://github.com/user/repo

# Quick scan during development
npm run scan https://github.com/user/repo

# Clean build artifacts
npm run clean

# Type checking
npm run type-check
```

### Development Workflow 🚀

#### Local Development (Recommended)
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run scans during development
npm run scan https://github.com/user/repo

# Type checking
npm run type-check
```

#### Docker Development 🐳
```bash
# Build Docker image
docker compose build

# Test the image
docker run --rm mcp-watch scan https://github.com/user/repo

# Test Docker Compose
docker compose run --rm mcp-watch scan --help
```

### Adding New Scanners

1. Create a new scanner in `scanner/scanners/`
2. Extend `AbstractScanner`
3. Implement the `scan()` method
4. Add to `MCPScanner.ts`

Example:
```typescript
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";

export class MyScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("🔍 Scanning for my vulnerability type...");
    
    const vulnerabilities: Vulnerability[] = [];
    // Your scanning logic here
    
    return vulnerabilities;
  }
}
```

## Security Research

This tool is based on security research from leading organizations in AI and cybersecurity, identifying novel attack vectors specific to MCP environments including:

- **Parameter injection attacks** that extract sensitive AI context
- **Tool poisoning** with hidden malicious instructions
- **Conversation exfiltration** using trigger phrases
- **Steganographic attacks** via ANSI escape sequences
- **Toxic agent flows** across repository boundaries

### Research Sources

- **VulnerableMCP Database** ([vulnerablemcp.info](https://vulnerablemcp.info))
  - Comprehensive database of MCP vulnerabilities
  - Real-world attack patterns and examples
  - Regular updates on new attack vectors

- **HiddenLayer Research** ([Exploiting MCP Tool Parameters](https://hiddenlayer.com/innovation-hub/exploiting-mcp-tool-parameters))
  - Parameter injection attacks that extract sensitive data
  - Tool call history and conversation exfiltration
  - System prompt extraction vulnerabilities
  - Chain of thought manipulation
  - Model name disclosure risks

- **Invariant Labs Research** ([GitHub MCP Vulnerability](https://invariantlabs.ai/blog/mcp-github-vulnerability))
  - Tool poisoning detection
  - Toxic agent flows
  - Cross-repository security issues
  - Rug-pull updates in tool functionality
  - Server spoofing prevention

- **Trail of Bits Research** ([MCP Security Research](https://blog.trailofbits.com/categories/mcp))
  - Conversation exfiltration methods
  - ANSI injection attacks
  - Protocol-level vulnerabilities
  - Insecure credential storage patterns
  - Cross-server shadowing attacks

- **PromptHub Analysis** ([5 MCP Security Vulnerabilities](https://prompthub.substack.com/p/5-mcp-security-vulnerabilities-you))
  - Command injection patterns (43% of public MCP servers affected)
  - SSRF vulnerability statistics (30% allow arbitrary URL fetching)
  - Path traversal attack vectors (22% leak files outside intended directories)
  - Retrieval-Agent Deception (RADE) attacks
  - Tool poisoning prevention strategies

## Exit Codes

- `0` - No critical or high severity vulnerabilities found
- `1` - Critical or high severity vulnerabilities detected
- `1` - Scan error occurred

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run type checking with `npm run type-check`
4. Test your changes manually
5. Submit a pull request

## GitHub Actions 🚀

This repository uses automated workflows for CI/CD, security scanning, and dependency management:

- **CI**: Automated testing and Docker verification on every push/PR
- **Security Scan**: Daily security audits and vulnerability checks
- **Dependency Update**: Weekly dependency maintenance and security fixes
- **Release**: Automated release asset creation
- **Docker Test**: Docker-specific testing and validation

## Dependabot 🤖

Automated dependency management with:
- **npm**: Weekly updates with auto-merge for minor/patch versions
- **GitHub Actions**: Automated action updates
- **Docker**: Base image updates

See [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md) for detailed workflow documentation.

### Docker Development Workflow 🐳

```bash
# Clone and setup
git clone https://github.com/kapilduraphe/mcp-watch.git
cd mcp-watch

# Build Docker image
docker compose build

# Test the image
docker run --rm mcp-watch --help

# Run a scan
docker compose run --rm mcp-watch scan https://github.com/user/repo
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- Create an issue for bug reports or feature requests
- Check existing issues before creating new ones
- Include scan output and repository details when reporting issues

### Docker Support 🐳

- **Documentation**: See [DOCKER.md](DOCKER.md) for detailed Docker usage
- **Issues**: Include Docker version and Docker Compose version when reporting issues
- **Testing**: Test with both production and development containers


---

**⚠️ Security Notice**: This tool identifies potential security issues but should not be the only security measure. Always perform manual security reviews and follow security best practices.
