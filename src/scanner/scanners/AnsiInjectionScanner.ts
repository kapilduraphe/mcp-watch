// AnsiInjectionScanner.ts
import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

export class AnsiInjectionScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("🎨 Scanning for ANSI escape injection vulnerabilities...");

    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [".ts", ".js", ".py"]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        if (this.containsAnsiEscapes(line)) {
          vulnerabilities.push({
            id: "ANSI_ESCAPE_INJECTION",
            severity: "medium",
            category: "steganographic-attack",
            message: "ANSI escape sequences - can hide malicious instructions",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: this.sanitizeAnsiEvidence(line),
            source: "Trail of Bits research",
          });
        }

        if (this.containsWhitespaceInjection(line)) {
          vulnerabilities.push({
            id: "WHITESPACE_INJECTION",
            severity: "medium",
            category: "steganographic-attack",
            message: "Excessive whitespace - potential hidden content",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: `Line contains ${
              line.length - line.trim().length
            } whitespace characters`,
            source: "Trail of Bits research",
          });
        }
      });
    }

    return vulnerabilities;
  }

  private containsAnsiEscapes(line: string): boolean {
    return (
      /\u001b\[[0-9;]*[a-zA-Z]/.test(line) ||
      /\\u001b\[[0-9;]*[a-zA-Z]/.test(line) ||
      /\\x1b\[[0-9;]*[a-zA-Z]/.test(line) ||
      /\x1b\[[0-9;]*[a-zA-Z]/.test(line)
    );
  }

  private containsWhitespaceInjection(line: string): boolean {
    const trimmedLength = line.trim().length;
    const totalLength = line.length;
    return trimmedLength > 0 && totalLength - trimmedLength > 100;
  }
}
