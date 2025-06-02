import { Vulnerability } from "../types/Vulnerability";

/**
 * Base interface for all vulnerability scanners
 */
export interface BaseScanner {
  /**
   * Scans a project directory for specific types of vulnerabilities
   *
   * @param projectPath - Path to the project root directory
   * @returns Promise resolving to array of discovered vulnerabilities
   */
  scan(projectPath: string): Promise<Vulnerability[]>;
}

/**
 * Abstract base class with common utilities for scanners
 */
export abstract class AbstractScanner implements BaseScanner {
  abstract scan(projectPath: string): Promise<Vulnerability[]>;

  /**
   * Detects if a credential appears to be an example/placeholder
   *
   * @param line - Source code line to analyze
   * @returns true if the credential appears to be an example
   * @protected
   */
  protected isExampleCredential(line: string): boolean {
    const examplePatterns = [
      /your[-_]?(?:api[-_]?key|token|secret)/i,
      /example|demo|test|placeholder|xxx|yyy|zzz/i,
      /123456|abcdef|replace[-_]?me|change[-_]?me/i,
      /<[^>]*(?:api[-_]?key|token|secret|password)[^>]*>/i,
      /\$\{[^}]*(?:api[-_]?key|token|secret|password)[^}]*\}/i,
      /\[your[-_](?:api[-_]?key|token|secret)\]/i,
      /dummy|fake|mock|sample/i,
      /insert[-_]?(?:here|your)/i,
      /(?:key|token|secret)[-_]?(?:here|placeholder|example)/i,
    ];

    return examplePatterns.some((pattern) => pattern.test(line));
  }

  /**
   * Sanitizes evidence to prevent credential leakage in reports
   *
   * @param line - Original evidence line
   * @returns Sanitized evidence with credentials redacted
   * @protected
   */
  protected sanitizeEvidence(line: string): string {
    return line
      .replace(/sk-[a-zA-Z0-9]{20,}/g, "sk-***REDACTED***")
      .replace(/ghp_[a-zA-Z0-9]{36}/g, "ghp_***REDACTED***")
      .replace(/xoxb-[a-zA-Z0-9-]{50,}/g, "xoxb-***REDACTED***")
      .replace(/AKIA[a-zA-Z0-9]{16}/g, "AKIA***REDACTED***")
      .replace(/["'][a-zA-Z0-9+/]{40,}={0,2}["']/g, '"***BASE64_REDACTED***"')
      .replace(
        /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
        "***JWT_REDACTED***"
      )
      .trim()
      .substring(0, 150);
  }

  /**
   * Sanitizes ANSI evidence to prevent display issues
   *
   * @param line - Original evidence line with ANSI codes
   * @returns Sanitized evidence with ANSI codes redacted
   * @protected
   */
  protected sanitizeAnsiEvidence(line: string): string {
    return line
      .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "\\u001b[***ANSI***]")
      .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "\\x1b[***ANSI***]")
      .trim()
      .substring(0, 150);
  }
}
