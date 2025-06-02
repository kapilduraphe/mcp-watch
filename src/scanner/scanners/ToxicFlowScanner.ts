// ToxicFlowScanner.ts
import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

export class ToxicFlowScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("🌊 Scanning for toxic agent flows...");

    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [".ts", ".js", ".py"]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        if (this.containsUntrustedDataProcessing(line)) {
          vulnerabilities.push({
            id: "UNTRUSTED_DATA_PROCESSING",
            severity: "medium",
            category: "toxic-flow",
            message: "External data processed without sanitization",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "Invariant Labs research",
          });
        }

        if (this.containsAutomaticPublishing(line)) {
          vulnerabilities.push({
            id: "AUTOMATIC_CONTENT_PUBLISHING",
            severity: "high",
            category: "toxic-flow",
            message: "Automatic content publishing - data exfiltration risk",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "Invariant Labs research",
          });
        }
      });

      this.analyzeGenericToxicChains(
        content,
        file,
        projectPath,
        vulnerabilities
      );
    }

    return vulnerabilities;
  }

  private containsUntrustedDataProcessing(line: string): boolean {
    const untrustedDataSources = [
      /\.data\.|response\.|\.json\(\)|\.text\(\)/,
      /readFile|read.*content|fetch.*file/i,
      /input\.|params\.|query\.|body\./,
      /fetch\(|axios\.|request\(|http\./,
      /message\.content|content\.body|data\.content/i,
      /external|remote|api|endpoint/i,
    ];

    const hasUntrustedSource = untrustedDataSources.some((pattern) =>
      pattern.test(line)
    );
    if (!hasUntrustedSource) return false;

    const sanitizationPresent = [
      /sanitize|escape|validate|filter|clean/i,
      /allowlist|whitelist|strip|remove/i,
      /encode|decode|parse.*safe|safe.*parse/i,
    ];

    return !sanitizationPresent.some((sanitization) => sanitization.test(line));
  }

  private containsAutomaticPublishing(line: string): boolean {
    const publishingPatterns = [
      /create(?!.*test)|auto.*create|generate.*content/i,
      /publish|send|post|upload|write.*file/i,
      /broadcast|share|distribute|forward/i,
      /notify|alert|message|email/i,
      /insert|save|store.*public/i,
    ];

    const hasPublishing = publishingPatterns.some((pattern) =>
      pattern.test(line)
    );
    if (!hasPublishing) return false;

    const dynamicContentIndicators = [
      /\$\{|template|interpolate|\+.*\+/,
      /\.data|response\.|content\.|input\./,
      /process\.|param|arg|variable/,
    ];

    return dynamicContentIndicators.some((indicator) => indicator.test(line));
  }

  private analyzeGenericToxicChains(
    content: string,
    file: string,
    projectPath: string,
    vulnerabilities: Vulnerability[]
  ) {
    const lines = content.split("\n");

    let hasExternalInput = false;
    let hasPrivilegedAccess = false;
    let hasPublicOutput = false;

    lines.forEach((line) => {
      if (/fetch|api|external|remote|input|request/i.test(line)) {
        hasExternalInput = true;
      }

      if (/private|confidential|secret|internal|admin|privileged/i.test(line)) {
        hasPrivilegedAccess = true;
      }

      if (/public|create|publish|send|post|share|broadcast/i.test(line)) {
        hasPublicOutput = true;
      }
    });

    if (hasExternalInput && hasPrivilegedAccess && hasPublicOutput) {
      vulnerabilities.push({
        id: "GENERIC_TOXIC_FLOW_CHAIN",
        severity: "critical",
        category: "toxic-flow",
        message:
          "Complete toxic flow: external input → privileged access → public output",
        file: path.relative(projectPath, file),
        evidence:
          "File contains external input processing, privileged data access, and public output mechanisms",
        source: "Invariant Labs research",
      });
    }
  }
}
