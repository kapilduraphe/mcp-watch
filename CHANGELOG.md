# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive unit test suite using Node.js native test runner
  - 374 lines of test coverage across 26 test cases
  - Tests for all 12 scanner classes (CredentialScanner, ToolPoisoningScanner, ParameterInjectionScanner, PromptInjectionScanner, ToolMutationScanner, ConversationExfiltrationScanner, AnsiInjectionScanner, ProtocolViolationScanner, InputValidationScanner, ServerSpoofingScanner, ToxicFlowScanner, PermissionScanner)
  - Validates Promise return types and vulnerability detection
  - Includes realistic test cases for credential detection and prompt injection
- New `test` script in package.json using `ts-node` with Node's test runner
- `tsconfig.eslint.json` for ESLint-specific TypeScript configuration
- `@stylistic/eslint-plugin` for code style enforcement

### Changed
- Migrated ESLint configuration from v8 to v9+ with flat config format
  - Replaced `.eslintrc.js` with `eslint.config.js`
  - Updated TypeScript ESLint integration to use `typescript-eslint` v8
- Updated all scanner methods to explicitly return promises for better ESLint compatibility
- Refactored codebase to align with ESLint v9 best practices
- Test files now excluded from production build via tsconfig

### Removed
- `@types/jest` dependency (replaced with Node.js native test runner)

### Security
- Addressed npm audit warnings through dependency updates and overrides
- Resolved memory leak concerns in transitive dependencies
- Package overrides for `rimraf` (^6.0.1) and `glob` (^11.0.3)

## [0.1.2] - 2025-10-11

### Added
- Local MCP server support for scanning

### Changed
- Updated package dependencies

## Previous Versions
See git history for changes in versions 0.1.1 and earlier.
