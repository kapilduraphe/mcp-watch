// PromptInjectionScanner.ts
import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

export class PromptInjectionScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("💉 Scanning for prompt injection vulnerabilities...");

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
        if (
          line.includes("description") &&
          this.containsSuspiciousPrompts(line)
        ) {
          vulnerabilities.push({
            id: "TOOL_DESCRIPTION_INJECTION",
            severity: "high",
            category: "prompt-injection",
            message: "Suspicious prompt injection in tool description",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "VulnerableMCP database",
          });
        }

        if (this.containsRADEPatterns(line)) {
          vulnerabilities.push({
            id: "RETRIEVAL_AGENT_DECEPTION",
            severity: "high",
            category: "prompt-injection",
            message:
              "RADE pattern detected - hidden commands in retrieval content",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "PromptHub research",
          });
        }
      });
    }

    return vulnerabilities;
  }

  private containsSuspiciousPrompts(line: string): boolean {
    const suspiciousPatterns = [
      /ignore\s+(previous|above|all|prior)\s+(instructions?|commands?|prompts?)/i,
      /you\s+are\s+now\s+(?:a|an|my)/i,
      /system\s*[:]\s*(?:you|assistant|ai)/i,
      /forget\s+(everything|all|previous|prior)/i,
      /act\s+as\s+(?:if|a|an)/i,
      /pretend\s+(?:that|you)/i,
      /disregard\s+(?:the|any|all)/i,
      /\[SYSTEM\]|\[ADMIN\]|\[OVERRIDE\]|\[JAILBREAK\]/i,
      /new\s+role\s*:/i,
      /roleplay\s+as/i,
      /simulate\s+(?:being|a)/i,
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(line));
  }

  private containsRADEPatterns(line: string): boolean {
    const radePatterns = [
      /retrieve.*(?:ignore|system|admin)/i,
      /document.*(?:instruction|command|system)/i,
      /content.*(?:execute|run|eval)/i,
      /search.*(?:override|bypass|disable)/i,
      /fetch.*(?:prompt|instruction|system)/i,
    ];

    return radePatterns.some((pattern) => pattern.test(line));
  }
}
