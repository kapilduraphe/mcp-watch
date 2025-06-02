// ToolMutationScanner.ts
// PromptInjectionScanner.ts
import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

export class ToolMutationScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("🔄 Scanning for tool mutation vulnerabilities...");

    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [".ts", ".js", ".py"]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        if (this.containsToolMutation(line)) {
          vulnerabilities.push({
            id: "DYNAMIC_TOOL_MUTATION",
            severity: "high",
            category: "tool-mutation",
            message: "Dynamic tool mutation detected - rug-pull risk",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "VulnerableMCP database",
          });
        }

        if (this.containsToolNameCollision(line)) {
          vulnerabilities.push({
            id: "TOOL_NAME_COLLISION",
            severity: "medium",
            category: "tool-mutation",
            message: "Tool name collision risk",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "VulnerableMCP database",
          });
        }
      });
    }

    return vulnerabilities;
  }

  private containsToolMutation(line: string): boolean {
    return (
      (line.includes("tools") || line.includes("tool")) &&
      (line.includes("push") ||
        line.includes("splice") ||
        line.includes("pop") ||
        line.includes("shift") ||
        line.includes("unshift") ||
        /tools?\[.*\]\s*=/.test(line)) &&
      !line.includes("//") &&
      !line.includes("*") &&
      !line.includes("test") &&
      !line.includes("example")
    );
  }

  private containsToolNameCollision(line: string): boolean {
    return (
      line.includes("name") &&
      line.includes("tool") &&
      (line.includes("duplicate") ||
        line.includes("same") ||
        line.includes("collision") ||
        line.includes("conflict"))
    );
  }
}
