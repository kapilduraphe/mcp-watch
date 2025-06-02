# Contributing to MCP Watch

Thank you for your interest in contributing to MCP Watch! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn
- Git

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/mcp-watch.git
   cd mcp-watch
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Workflow

### Running the Project

```bash
# Development mode with hot reload
npm run dev

# Build the project
npm run build

# Run tests
npm run test

# Run tests in watch mode
npm test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing Your Changes

Before submitting a PR, make sure to:

1. **Test the CLI** with various MCP repositories
2. **Run the test suite**: `npm test`
3. **Check code style**: `npm run lint`
4. **Build successfully**: `npm run build`

## 🐛 Reporting Issues

### Bug Reports

When filing a bug report, please include:

- **MCP Watch version**: `mcp-watch --version`
- **Node.js version**: `node --version`
- **Operating system**: Windows/macOS/Linux
- **Repository URL** that caused the issue (if applicable)
- **Complete error message** and stack trace
- **Steps to reproduce** the issue

### Feature Requests

For feature requests, please provide:

- **Clear description** of the proposed feature
- **Use case**: Why would this feature be useful?
- **Expected behavior**: How should it work?
- **Related vulnerabilities**: Link to relevant security research if applicable

## 🔍 Adding New Vulnerability Detectors

MCP Watch's strength comes from its comprehensive vulnerability detection. Here's how to add new detectors:

### 1. Research the Vulnerability

- Check [vulnerablemcp.info](https://vulnerablemcp.info/) for documented vulnerabilities
- Review security research from Trail of Bits, Invariant Labs, etc.
- Understand the attack vector and impact

### 2. Create the Detection Rule

Create a new scanner in the `scanner/scanners/` directory:

```typescript
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";

export class NewVulnerabilityScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("🔍 Scanning for new vulnerability...");
    
    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [".ts", ".js"]);
    
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");
      
      lines.forEach((line, index) => {
        if (this.containsNewVulnerability(line)) {
          vulnerabilities.push({
            id: "NEW_VULNERABILITY_ID",
            severity: "high", // critical|high|medium|low
            category: "vulnerability-category",
            message: "Clear description of the issue",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "Research source"
          });
        }
      });
    }
    
    return vulnerabilities;
  }

  private containsNewVulnerability(line: string): boolean {
    // Your detection logic here
    const patterns = [
      /pattern1/i,
      /pattern2/g,
    ];
    
    return patterns.some(pattern => pattern.test(line));
  }
}
```

### 3. Add Tests

Create test cases in `tests/scanners/`:

```typescript
describe('New Vulnerability Scanner', () => {
  test('should detect vulnerability pattern', () => {
    const scanner = new NewVulnerabilityScanner();
    const testCode = 'vulnerable code example';
    
    expect(scanner.containsNewVulnerability(testCode)).toBe(true);
  });
  
  test('should not flag safe code', () => {
    const scanner = new NewVulnerabilityScanner();
    const safeCode = 'safe code example';
    
    expect(scanner.containsNewVulnerability(safeCode)).toBe(false);
  });
});
```

### 4. Add Integration

Add your scanner to the `MCPScanner` class:

```typescript
import { NewVulnerabilityScanner } from "./scanners/NewVulnerabilityScanner";

// In the scanRepository method:
const newVulnerabilityScanner = new NewVulnerabilityScanner();
const newVulnerabilities = await newVulnerabilityScanner.scan(tempDir.name);
this.vulnerabilities.push(...newVulnerabilities);
```

### 5. Update Documentation

- Add the new vulnerability to the README
- Include examples in the documentation
- Add remediation advice to the `getRemediationAdvice` function

## 📝 Code Style Guidelines

### TypeScript Best Practices

- Use **strict TypeScript** configuration
- Prefer **explicit types** over `any`
- Use **meaningful variable names**
- Add **JSDoc comments** for public methods
- Follow **consistent naming conventions**

### Code Organization

```
src/
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
└── utils/
    └── reportFormatter.ts          # Report formatting
```

### Commit Message Format

Use conventional commits:

```
type(scope): description

feat(scanner): add ANSI escape sequence detection
fix(cli): handle malformed GitHub URLs properly
docs(readme): update installation instructions
test(scanner): add integration tests for tool mutation
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🧪 Testing Guidelines

### Test Categories

1. **Unit Tests**: Test individual scanner methods
2. **Integration Tests**: Test full repository scanning
3. **CLI Tests**: Test command-line interface
4. **Performance Tests**: Ensure reasonable scan times

### Test Data

Create test repositories in `tests/fixtures/`:

```
tests/fixtures/
├── vulnerable-server/     # Repository with known vulnerabilities
├── safe-server/          # Clean repository
└── edge-cases/           # Unusual code patterns
```

### Writing Good Tests

- **Test both positive and negative cases**
- **Use realistic code examples**
- **Test edge cases and error conditions**
- **Keep tests fast and reliable**
- **Mock external dependencies**

## 🔄 Pull Request Process

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git remote add upstream https://github.com/original/mcp-watch.git
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run the full test suite**:
   ```bash
   npm test
   npm run lint
   npm run build
   ```

3. **Test with real repositories**:
   ```bash
   npm run dev scan https://github.com/some/mcp-server
   ```

### PR Guidelines

- **Clear title** describing the change
- **Detailed description** explaining the motivation
- **Link to related issues** if applicable
- **Include screenshots** for UI changes
- **Add tests** for new functionality
- **Update documentation** as needed

### Review Process

1. **Automated checks** must pass (CI/CD, linting, tests)
2. **Code review** by maintainers
3. **Testing** on various MCP repositories
4. **Documentation review** for completeness
5. **Final approval** and merge

## 🏆 Recognition

Contributors will be:

- **Listed in CHANGELOG.md** for each release
- **Mentioned in README.md** contributors section
- **Credited in release notes** for significant contributions

## 📞 Getting Help

- **GitHub Discussions**: For general questions and ideas
- **GitHub Issues**: For bugs and specific feature requests
- **Discord/Slack**: Link to community chat (if available)

## 🎯 Good First Issues

Look for issues labeled:

- `good first issue`: Perfect for newcomers
- `help wanted`: Community contributions welcome
- `documentation`: Improve docs and examples
- `enhancement`: New features and improvements

## 📚 Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [Vulnerable MCP Database](https://vulnerablemcp.info/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

---

Thank you for contributing to MCP Watch! Your efforts help make MCP servers more secure for everyone. 🛡️