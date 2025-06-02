import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

/**
 * Scans for credential-related vulnerabilities
 *
 * Based on Trail of Bits research documenting widespread plaintext credential storage
 * in MCP servers, often with world-readable permissions.
 *
 * Detects:
 * - Hardcoded API keys and tokens
 * - Plaintext credential storage
 * - Insecure file permissions for credential files
 */
export class CredentialScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("🔑 Scanning for credential vulnerabilities...");

    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [
      ".ts",
      ".js",
      ".json",
      ".env",
      ".md",
      ".yaml",
      ".yml",
      ".py",
    ]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        // Hardcoded credentials (enhanced patterns)
        if (this.containsHardcodedCredentials(line)) {
          vulnerabilities.push({
            id: "HARDCODED_CREDENTIALS",
            severity: "critical",
            category: "credential-leak",
            message: "Hardcoded credentials detected",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: this.sanitizeEvidence(line),
            source: "Trail of Bits research",
          });
        }

        // Plaintext storage (Trail of Bits documented pattern)
        if (this.containsPlaintextStorage(line)) {
          vulnerabilities.push({
            id: "PLAINTEXT_STORAGE",
            severity: "high",
            category: "credential-leak",
            message: "Plaintext credential storage detected",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "Trail of Bits research",
          });
        }

        // Insecure file permissions for credentials
        if (this.containsInsecureCredentialPermissions(line)) {
          vulnerabilities.push({
            id: "INSECURE_CREDENTIAL_PERMISSIONS",
            severity: "high",
            category: "credential-leak",
            message: "Credentials with world-readable permissions",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "Trail of Bits research",
          });
        }
      });
    }

    return vulnerabilities;
  }

  /**
   * Detects hardcoded credentials in source code
   *
   * @param line - Source code line to analyze
   * @returns true if hardcoded credentials are detected
   * @private
   */
  private containsHardcodedCredentials(line: string): boolean {
    const patterns = [
      // Enhanced API key patterns
      /(?:api[_-]?key|secret|token|password)\s*[:=]\s*["'][a-zA-Z0-9]{15,}["']/i,
      /sk-[a-zA-Z0-9]{20,}/, // OpenAI
      /ghp_[a-zA-Z0-9]{36}/, // GitHub
      /xoxb-[a-zA-Z0-9-]{50,}/, // Slack
      /AKIA[a-zA-Z0-9]{16}/, // AWS
      /ya29\.[a-zA-Z0-9_-]{50,}/, // Google OAuth
      /AIza[a-zA-Z0-9_-]{35}/, // Google API
      /pk_[a-zA-Z0-9]{24}/, // Stripe
      /sk_[a-zA-Z0-9]{24}/, // Stripe Secret
      /dckr_pat_[a-zA-Z0-9_-]+/, // Docker
      /["'][a-zA-Z0-9+/]{40,}={0,2}["']/, // Base64-like
      /["']eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+["']/, // JWT
    ];

    return (
      patterns.some((pattern) => pattern.test(line)) &&
      !this.isExampleCredential(line)
    );
  }

  /**
   * Detects plaintext storage of credentials
   *
   * @param line - Source code line to analyze
   * @returns true if plaintext credential storage is detected
   * @private
   */
  private containsPlaintextStorage(line: string): boolean {
    const fileWriteOps = [
      /writeFileSync\s*\(/,
      /writeFile\s*\(/,
      /createWriteStream\s*\(/,
      /\.write\s*\(/,
      /appendFileSync\s*\(/,
      /outputFileSync\s*\(/,
    ];

    const hasFileWrite = fileWriteOps.some((op) => op.test(line));
    if (!hasFileWrite) return false;

    const credentialIndicators = [
      /\b(?:token|key|secret|password|auth|credential|apiKey)\b/i,
      /['"`](?:api[-_]?key|secret|token|password|auth)['"`]\s*:/i,
      /process\.env\.[A-Z_]*(?:TOKEN|KEY|SECRET|PASSWORD)/i,
    ];

    const hasCredentialData = credentialIndicators.some((indicator) =>
      indicator.test(line)
    );
    if (!hasCredentialData) return false;

    const encryptionMentioned = [
      /\b(?:encrypt|cipher|hash|crypto|bcrypt|scrypt)\b/i,
      /\.encrypt\(/,
      /CryptoJS\./,
      /crypto\./,
    ];

    return !encryptionMentioned.some((enc) => enc.test(line));
  }

  private containsInsecureCredentialPermissions(line: string): boolean {
    return (
      /chmod\s+[0-9]*[4-7][4-7][4-7]/.test(line) &&
      /(?:key|token|secret|password|credential)/i.test(line)
    );
  }
}
