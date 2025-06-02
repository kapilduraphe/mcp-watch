// PermissionScanner.ts
import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

export class PermissionScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("🔐 Scanning for permission and access control issues...");

    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [
      ".ts",
      ".js",
      ".json",
      ".md",
      ".py",
    ]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        if (this.containsConsentFatiguePatterns(line)) {
          vulnerabilities.push({
            id: "CONSENT_FATIGUE_RISK",
            severity: "medium",
            category: "access-control",
            message: "Repeated consent requests - fatigue attack risk",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "VulnerableMCP database",
          });
        }

        if (this.containsExcessivePermissions(line)) {
          vulnerabilities.push({
            id: "EXCESSIVE_PERMISSIONS",
            severity: "high",
            category: "access-control",
            message: "Excessive permissions - violates least privilege",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "Security best practices",
          });
        }
      });
    }

    return vulnerabilities;
  }

  private containsConsentFatiguePatterns(line: string): boolean {
    const fatiguePatterns = [
      /(?:approve|consent|allow|permit).*(?:loop|repeat|again|multiple)/i,
      /confirm.*(?:many|several|repeatedly)/i,
      /permission.*(?:request|ask).*(?:frequently|often)/i,
      /user.*(?:approve|consent).*(?:tired|fatigue)/i,
    ];

    return fatiguePatterns.some((pattern) => pattern.test(line));
  }

  private containsExcessivePermissions(line: string): boolean {
    const permissionKeywords = [
      "admin",
      "root",
      "superuser",
      "delete",
      "remove",
      "destroy",
      "create",
      "modify",
      "update",
      "full access",
      "all permissions",
      "unrestricted",
      "elevated",
      "privileged",
    ];

    return permissionKeywords.some(
      (keyword) =>
        line.toLowerCase().includes(keyword) &&
        (line.includes("user") ||
          line.includes("permission") ||
          line.includes("scope") ||
          line.includes("role") ||
          line.includes("access"))
    );
  }
}
