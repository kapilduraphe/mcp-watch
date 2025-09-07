#!/usr/bin/env node

import { Command } from "commander";
import { MCPScanner } from "./scanner/McpScanner";
import { formatReport } from "./utils/reportFormatter";

// CLI setup
const program = new Command();

program
  .name("mcp-watch")
  .description(
    "Comprehensive MCP security scanner based on latest vulnerability research"
  )
  .version("2.0.0");

program
  .command("scan")
  .description("Scan an MCP server repository for security vulnerabilities")
  .argument("<github-url>", "GitHub repository URL")
  .option("-f, --format <type>", "Output format (console|json)", "console")
  .option(
    "--severity <level>",
    "Minimum severity level (low|medium|high|critical)",
    "low"
  )
  .option("--category <cat>", "Filter by vulnerability category")
  .action(
    async (
      githubUrl: string,
      options: {
        format: string;
        severity: string;
        category?: string;
      }
    ) => {
      try {
        const scanner = new MCPScanner();
        const allVulnerabilities = await scanner.scanRepository(githubUrl);

        // Apply filters
        const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
        const minSeverity =
          severityOrder[options.severity as keyof typeof severityOrder] || 0;

        let vulnerabilities = allVulnerabilities.filter(
          (v) => severityOrder[v.severity] >= minSeverity
        );

        if (options.category) {
          vulnerabilities = vulnerabilities.filter(
            (v) => v.category === options.category
          );
        }

        if (options.format === "json") {
          console.log(
            JSON.stringify(
              {
                repository: githubUrl,
                scanDate: new Date().toISOString(),
                scanner: "MCP Watch",
                researchSources: [
                  "VulnerableMCP Database",
                  "HiddenLayer Research",
                  "Invariant Labs Research",
                  "Trail of Bits Research",
                  "PromptHub Analysis",
                ],
                totalVulnerabilities: vulnerabilities.length,
                severityCounts: vulnerabilities.reduce((acc, v) => {
                  acc[v.severity] = (acc[v.severity] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>),
                categoryCounts: vulnerabilities.reduce((acc, v) => {
                  acc[v.category] = (acc[v.category] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>),
                vulnerabilities,
              },
              null,
              2
            )
          );
        } else {
          formatReport(vulnerabilities);
        }

        // Exit with error code if critical/high vulnerabilities found
        const criticalOrHigh = vulnerabilities.filter(
          (v) => v.severity === "critical" || v.severity === "high"
        );
        if (criticalOrHigh.length > 0) {
          console.log(
            `\n❌ Found ${criticalOrHigh.length} critical/high severity vulnerabilities`
          );
          console.log("🚨 Immediate action required!");
          process.exit(1);
        } else {
          console.log(
            "\n✅ No critical or high severity vulnerabilities found"
          );
          console.log(
            "💚 MCP server appears secure based on current research!"
          );
        }
      } catch (error) {
        console.error(
          "❌ Error:",
          error instanceof Error ? error.message : error
        );
        process.exit(1);
      }
    }
  );

program
  .command("scan-local")
  .description("Scan a local MCP server project directory for security vulnerabilities")
  .argument("<project-path>", "Path to the local project directory")
  .option("-f, --format <type>", "Output format (console|json)", "console")
  .option(
    "--severity <level>",
    "Minimum severity level (low|medium|high|critical)",
    "low"
  )
  .option("--category <cat>", "Filter by vulnerability category")
  .action(
    async (
      projectPath: string,
      options: {
        format: string;
        severity: string;
        category?: string;
      }
    ) => {
      try {
        const scanner = new MCPScanner();
        const allVulnerabilities = await scanner.scanLocalProject(projectPath);

        // Apply filters
        const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
        const minSeverity =
          severityOrder[options.severity as keyof typeof severityOrder] || 0;

        let vulnerabilities = allVulnerabilities.filter(
          (v) => severityOrder[v.severity] >= minSeverity
        );

        if (options.category) {
          vulnerabilities = vulnerabilities.filter(
            (v) => v.category === options.category
          );
        }

        if (options.format === "json") {
          console.log(
            JSON.stringify(
              {
                projectPath: projectPath,
                scanDate: new Date().toISOString(),
                scanner: "MCP Watch",
                researchSources: [
                  "VulnerableMCP Database",
                  "HiddenLayer Research",
                  "Invariant Labs Research",
                  "Trail of Bits Research",
                  "PromptHub Analysis",
                ],
                totalVulnerabilities: vulnerabilities.length,
                severityCounts: vulnerabilities.reduce((acc, v) => {
                  acc[v.severity] = (acc[v.severity] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>),
                categoryCounts: vulnerabilities.reduce((acc, v) => {
                  acc[v.category] = (acc[v.category] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>),
                vulnerabilities,
              },
              null,
              2
            )
          );
        } else {
          formatReport(vulnerabilities);
        }

        // Exit with error code if critical/high vulnerabilities found
        const criticalOrHigh = vulnerabilities.filter(
          (v) => v.severity === "critical" || v.severity === "high"
        );
        if (criticalOrHigh.length > 0) {
          console.log(
            `\n❌ Found ${criticalOrHigh.length} critical/high severity vulnerabilities`
          );
          console.log("🚨 Immediate action required!");
          process.exit(1);
        } else {
          console.log(
            "\n✅ No critical or high severity vulnerabilities found"
          );
          console.log(
            "💚 MCP server appears secure based on current research!"
          );
        }
      } catch (error) {
        console.error(
          "❌ Error:",
          error instanceof Error ? error.message : error
        );
        process.exit(1);
      }
    }
  );

program.parse();
