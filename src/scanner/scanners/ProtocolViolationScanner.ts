// ProtocolViolationScanner.ts
import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

export class ProtocolViolationScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("📋 Scanning for MCP protocol violations...");

    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [
      ".ts",
      ".js",
      ".json",
      ".py",
    ]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        if (this.containsSessionIdInUrl(line)) {
          vulnerabilities.push({
            id: "SESSION_ID_IN_URL",
            severity: "high",
            category: "protocol-violation",
            message: "Session ID in URL - exposes sensitive identifiers",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "VulnerableMCP database",
          });
        }

        if (this.containsInsecureTransport(line)) {
          vulnerabilities.push({
            id: "INSECURE_TRANSPORT",
            severity: "high",
            category: "protocol-violation",
            message: "Insecure HTTP transport detected",
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

  private containsSessionIdInUrl(line: string): boolean {
    return (
      /(?:sessionId|session_id|sid)=/.test(line) &&
      (line.includes("GET") ||
        line.includes("url") ||
        line.includes("path") ||
        line.includes("route") ||
        line.includes("endpoint"))
    );
  }

  private containsInsecureTransport(line: string): boolean {
    return (
      line.includes("http://") &&
      !line.includes("localhost") &&
      !line.includes("127.0.0.1") &&
      !line.includes("example.com") &&
      !this.isExampleCredential(line)
    );
  }
}
