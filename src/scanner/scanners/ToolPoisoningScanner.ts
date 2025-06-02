import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

/**
 * Scans for tool poisoning vulnerabilities
 * 
 * Based on Invariant Labs research documenting attacks where tools appear innocent
 * but contain hidden malicious instructions in their descriptions.
 * 
 * Detects:
 * - Hidden instructions in tool descriptions
 * - Deceptive tool naming patterns
 * - Tools with mismatched names and functionality
 */
export class ToolPoisoningScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("🧪 Scanning for tool poisoning vulnerabilities...");

    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [".ts", ".js", ".py"]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        // Hidden instructions in tool descriptions
        if (this.containsHiddenInstructions(line)) {
          vulnerabilities.push({
            id: "HIDDEN_TOOL_INSTRUCTIONS",
            severity: "critical",
            category: "tool-poisoning",
            message: "Hidden malicious instructions in tool description",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "Invariant Labs research"
          });
        }

        // Deceptive tool naming
        if (this.containsDeceptiveToolNaming(line)) {
          vulnerabilities.push({
            id: "DECEPTIVE_TOOL_NAMING",
            severity: "high",
            category: "tool-poisoning",
            message: "Tool with deceptive name/description mismatch",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "Invariant Labs research"
          });
        }
      });
    }

    return vulnerabilities;
  }

  private containsHiddenInstructions(line: string): boolean {
    return line.includes("description") && (
      /ignore\s+(previous|all)\s+instructions/i.test(line) ||
      /system\s*:\s*you\s+are\s+now/i.test(line) ||
      /\[SYSTEM\]|\[ADMIN\]|\[OVERRIDE\]/i.test(line) ||
      /act\s+as\s+(?:if|a)/i.test(line) ||
      /forget\s+(everything|all)/i.test(line)
    );
  }

  private containsDeceptiveToolNaming(line: string): boolean {
    const innocentNames = /calculator|math|time|weather|file.*read/i;
    const dangerousActions = /delete|remove|destroy|kill|hack|steal|exfiltrate/i;
    
    return line.includes("name") && innocentNames.test(line) && 
           (dangerousActions.test(line) || /exec|eval|system/i.test(line));
  }
}