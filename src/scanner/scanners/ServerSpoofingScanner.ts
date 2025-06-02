// ServerSpoofingScanner.ts
import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

export class ServerSpoofingScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("🎭 Scanning for server spoofing vulnerabilities...");

    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [
      ".ts",
      ".js",
      ".json",
      ".py",
    ]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");

      if (this.containsSuspiciousServerNames(content)) {
        vulnerabilities.push({
          id: "SUSPICIOUS_SERVER_NAME",
          severity: "medium",
          category: "server-spoofing",
          message: "Server name mimics popular service - potential spoofing",
          file: path.relative(projectPath, file),
          evidence: "Server name resembles trusted service",
          source: "PromptHub research",
        });
      }

      if (this.containsCrossServerShadowing(content)) {
        vulnerabilities.push({
          id: "CROSS_SERVER_SHADOWING",
          severity: "high",
          category: "server-spoofing",
          message: "Cross-server call interception detected",
          file: path.relative(projectPath, file),
          evidence: "Server intercepts calls to other servers",
          source: "PromptHub research",
        });
      }
    }

    return vulnerabilities;
  }

  private containsSuspiciousServerNames(content: string): boolean {
    const popularServices = [
      "github",
      "gitlab",
      "slack",
      "discord",
      "jira",
      "confluence",
      "aws",
      "google",
      "microsoft",
      "azure",
      "dropbox",
      "box",
    ];

    const namePattern = /name.*["']([^"']+)["']/gi;
    let match: RegExpExecArray | null;

    while ((match = namePattern.exec(content)) !== null) {
      const serverName = match[1].toLowerCase();
      if (
        popularServices.some(
          (service) =>
            serverName.includes(service) &&
            !serverName.startsWith("my-") &&
            !serverName.includes("test") &&
            !serverName.includes("demo")
        )
      ) {
        return true;
      }
    }

    return false;
  }

  private containsCrossServerShadowing(content: string): boolean {
    const shadowingPatterns = [
      /intercept.*server/i,
      /override.*server/i,
      /redirect.*server/i,
      /proxy.*server/i,
      /hijack.*server/i,
      /shadow.*server/i,
    ];

    return shadowingPatterns.some((pattern) => pattern.test(content));
  }
}
