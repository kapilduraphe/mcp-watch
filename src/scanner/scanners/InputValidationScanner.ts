import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

/**
 * Scans for input validation vulnerabilities
 * 
 * Based on PromptHub research showing 43% of MCP servers allow command injection,
 * 30% are vulnerable to SSRF, and 22% have path traversal issues.
 * 
 * Detects:
 * - Command injection vulnerabilities
 * - SSRF (Server-Side Request Forgery) vulnerabilities
 * - Path traversal vulnerabilities
 */
export class InputValidationScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("🛡️ Scanning for input validation issues...");

    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [".ts", ".js", ".py"]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        // Command injection (43% of servers vulnerable per PromptHub)
        if (this.containsCommandInjection(line)) {
          vulnerabilities.push({
            id: "COMMAND_INJECTION_RISK",
            severity: "critical",
            category: "input-validation",
            message: "Command injection vulnerability - append && rm -rf /",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "PromptHub research (43% affected)"
          });
        }

        // SSRF vulnerabilities (30% of servers per PromptHub)
        if (this.containsSSRF(line)) {
          vulnerabilities.push({
            id: "SSRF_VULNERABILITY",
            severity: "high",
            category: "input-validation",
            message: "SSRF vulnerability - fetches any URL",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "PromptHub research (30% affected)"
          });
        }

        // Path traversal (22% of servers per PromptHub)
        if (this.containsPathTraversal(line)) {
          vulnerabilities.push({
            id: "PATH_TRAVERSAL",
            severity: "high",
            category: "input-validation",
            message: "Path traversal vulnerability - accesses files outside directory",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "PromptHub research (22% affected)"
          });
        }
      });
    }

    return vulnerabilities;
  }

  private containsCommandInjection(line: string): boolean {
    const dangerousPatterns = [
      /execSync?\s*\(/, /spawn\s*\(/, /exec\s*\(/,
      /system\s*\(/, /shell_exec/, /passthru\s*\(/, /popen\s*\(/
    ];

    return (
      dangerousPatterns.some(pattern => pattern.test(line)) &&
      (line.includes("req.") || line.includes("params") || line.includes("query") ||
       line.includes("body") || line.includes("input") || line.includes("user") ||
       line.includes("argv"))
    );
  }

  private containsSSRF(line: string): boolean {
    const ssrfPatterns = [
      /fetch\s*\(\s*(?:req\.|params\.|query\.|input\.)/,
      /axios\.get\s*\(\s*(?:req\.|params\.|query\.|input\.)/,
      /request\s*\(\s*(?:req\.|params\.|query\.|input\.)/,
      /http\.get\s*\(\s*(?:req\.|params\.|query\.|input\.)/,
      /urllib\.request\s*\(\s*(?:req\.|params\.|query\.|input\.)/
    ];

    return ssrfPatterns.some(pattern => pattern.test(line));
  }

  private containsPathTraversal(line: string): boolean {
    const pathTraversalPatterns = [
      /readFile\s*\([^)]*\.\./,
      /fs\.read.*\([^)]*\.\./,
      /open\s*\([^)]*\.\./,
      /path\.join\s*\([^)]*\.\./,
      /\.\.\/|\.\.\\/, // Direct path traversal
      /path.*\.\./
    ];

    return pathTraversalPatterns.some(pattern => pattern.test(line));
  }
}