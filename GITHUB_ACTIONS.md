# GitHub Actions Workflows

This repository uses GitHub Actions for continuous integration, testing, and automation. The workflows are designed to be simple and effective, following best practices from open-source projects.

## Workflows Overview

### 1. CI (`ci.yml`)
- **Trigger**: Push to main/develop branches, pull requests
- **Purpose**: Build, test, and verify the application
- **Jobs**:
  - **Test**: Type checking, building, and basic functionality testing
  - **Docker**: Build and test Docker image functionality

### 2. Security Scan (`security-scan.yml`)
- **Trigger**: Daily at 2 AM UTC, manual dispatch
- **Purpose**: Security auditing and dependency monitoring
- **Features**:
  - `npm audit` for security vulnerabilities
  - Check for outdated packages
  - Docker image verification

### 3. Dependency Update (`dependency-update.yml`)
- **Trigger**: Weekly on Sundays at 1 AM UTC, manual dispatch
- **Purpose**: Keep dependencies up to date
- **Features**:
  - Update npm packages
  - Run security fixes
  - Verify build integrity

**Note**: This workflow complements Dependabot, which automatically creates PRs for dependency updates.

### 4. Release (`release.yml`)
- **Trigger**: When a release is published
- **Purpose**: Build and prepare release assets
- **Features**:
  - Build the application
  - Create compressed release archives
  - Verify release integrity

### 5. Docker Test (`docker-test.yml`)
- **Trigger**: Changes to Docker files
- **Purpose**: Test Docker builds and functionality
- **Features**:
  - Test both production and development images
  - Verify Docker Compose functionality
  -         Ensure Docker commands work correctly

## Dependabot 🤖

This repository uses Dependabot for automated dependency management:

### **npm Dependencies**
- **Schedule**: Weekly on Sundays at 1 AM UTC
- **Strategy**: Groups minor and patch updates together
- **Auto-merge**: Enabled for minor/patch updates if CI passes
- **Major versions**: Creates separate PRs for manual review

### **GitHub Actions**
- **Schedule**: Weekly on Mondays at 2 AM UTC
- **Auto-merge**: Enabled for all updates if CI passes
- **Grouping**: All action updates in single PRs

### **Docker Images**
- **Schedule**: Weekly on Tuesdays at 3 AM UTC
- **Auto-merge**: Enabled for all updates if CI passes
- **Base images**: Node.js, Alpine Linux updates

### **Benefits**
- 🚀 **Automated**: No manual dependency checking needed
- 🔒 **Secure**: Regular security updates
- 📦 **Grouped**: Efficient PR management
- ✅ **Tested**: All updates go through CI pipeline

## Workflow Design Principles

These workflows follow the simplicity approach used by repositories like:
- [OpenAI Agents Python](https://github.com/openai/openai-agents-python/tree/main/.github/workflows)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/.github/workflows/main.yml)

**Key Features**:
- Simple, focused jobs
- No complex artifact management
- Basic testing and verification
- Docker integration testing
- Security and dependency monitoring

## Manual Workflow Execution

You can manually trigger workflows from the GitHub Actions tab:
1. Go to the **Actions** tab in your repository
2. Select the workflow you want to run
3. Click **Run workflow**
4. Choose the branch and click **Run workflow**

## Workflow Status

- ✅ **CI**: Runs on every push and PR
- 🔒 **Security Scan**: Daily automated security checks
- 🔄 **Dependency Update**: Weekly dependency maintenance
- 🚀 **Release**: Automated release asset creation
- 🐳 **Docker Test**: Docker-specific testing

## Troubleshooting

If workflows fail:
1. Check the **Actions** tab for detailed logs
2. Verify that all dependencies are properly specified
3. Ensure Docker builds work locally before pushing
4. Check for any breaking changes in dependencies

## Customization

These workflows can be easily customized:
- Modify trigger conditions in the `on` section
- Add or remove steps in each job
- Adjust Node.js versions or other configurations
- Add additional testing or deployment steps
