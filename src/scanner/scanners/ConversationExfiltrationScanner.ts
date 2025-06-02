// ConversationExfiltrationScanner.ts
import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

export class ConversationExfiltrationScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("💬 Scanning for conversation exfiltration vulnerabilities...");

    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [
      ".ts",
      ".js",
      ".md",
      ".py",
    ]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        if (this.containsConversationTriggers(line)) {
          vulnerabilities.push({
            id: "CONVERSATION_EXFILTRATION_TRIGGER",
            severity: "critical",
            category: "data-exfiltration",
            message: "Conversation history exfiltration trigger detected",
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

  private containsConversationTriggers(line: string): boolean {
    const triggerPatterns = [
      /thank\s+you.*(?:conversation|history|chat)/i,
      /please.*(?:conversation|history|chat)/i,
      /when.*(?:user|says|types).*(?:conversation|history)/i,
      /if.*(?:conversation|history|chat)/i,
      /trigger.*(?:conversation|history|chat)/i,
      /forward.*(?:conversation|history|chat)/i,
      /send.*(?:conversation|history|chat)/i,
    ];

    return (
      line.includes("description") &&
      triggerPatterns.some((pattern) => pattern.test(line))
    );
  }
}
