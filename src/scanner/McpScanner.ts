import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";
import * as tmp from "tmp";
import { Vulnerability } from "../types/Vulnerability";
import { CredentialScanner } from "./scanners/CredentialScanner";
import { ToolPoisoningScanner } from "./scanners/ToolPoisoningScanner";
import { ParameterInjectionScanner } from "./scanners/ParameterInjectionScanner";
import { PromptInjectionScanner } from "./scanners/PromptInjectionScanner";
import { ToolMutationScanner } from "./scanners/ToolMutationScanner";
import { ConversationExfiltrationScanner } from "./scanners/ConversationExfiltrationScanner";
import { AnsiInjectionScanner } from "./scanners/AnsiInjectionScanner";
import { ProtocolViolationScanner } from "./scanners/ProtocolViolationScanner";
import { InputValidationScanner } from "./scanners/InputValidationScanner";
import { ServerSpoofingScanner } from "./scanners/ServerSpoofingScanner";
import { ToxicFlowScanner } from "./scanners/ToxicFlowScanner";
import { PermissionScanner } from "./scanners/PermissionScanner";

/**
 * MCPScanner - Comprehensive security scanner for Model Context Protocol (MCP) servers
 *
 * Based on vulnerability research from:
 * - VulnerableMCP Database (https://vulnerablemcp.info)
 * - HiddenLayer Research (Parameter injection attacks)
 * - Invariant Labs Research (Tool poisoning, toxic agent flows)
 * - Trail of Bits Research (Conversation exfiltration, ANSI injection)
 * - PromptHub Analysis (Command injection, SSRF, path traversal statistics)
 *
 * @example
 * ```typescript
 * const scanner = new MCPScanner();
 * const vulnerabilities = await scanner.scanRepository('https://github.com/user/mcp-server');
 * console.log(`Found ${vulnerabilities.length} vulnerabilities`);
 * ```
 */
export class MCPScanner {
  /** Array to store all discovered vulnerabilities */
  private vulnerabilities: Vulnerability[] = [];

  /**
   * Scans a GitHub repository for MCP security vulnerabilities
   *
   * @param githubUrl - The GitHub repository URL to scan
   * @returns Promise resolving to array of discovered vulnerabilities
   *
   * @example
   * ```typescript
   * const scanner = new MCPScanner();
   * const vulns = await scanner.scanRepository('https://github.com/user/mcp-server');
   * console.log(`Found ${vulns.length} vulnerabilities`);
   * ```
   */
  async scanRepository(githubUrl: string): Promise<Vulnerability[]> {
    console.log(`🔍 Scanning repository: ${githubUrl}`);
    console.log(
      "📊 Based on vulnerablemcp.info, HiddenLayer, Invariant Labs, and Trail of Bits research\n"
    );

    const tempDir = tmp.dirSync({ unsafeCleanup: true });

    try {
      await this.cloneRepo(githubUrl, tempDir.name);

      // Initialize all scanners
      const credentialScanner = new CredentialScanner();
      const toolPoisoningScanner = new ToolPoisoningScanner();
      const parameterInjectionScanner = new ParameterInjectionScanner();
      const promptInjectionScanner = new PromptInjectionScanner();
      const toolMutationScanner = new ToolMutationScanner();
      const conversationExfiltrationScanner =
        new ConversationExfiltrationScanner();
      const ansiInjectionScanner = new AnsiInjectionScanner();
      const protocolViolationScanner = new ProtocolViolationScanner();
      const inputValidationScanner = new InputValidationScanner();
      const serverSpoofingScanner = new ServerSpoofingScanner();
      const toxicFlowScanner = new ToxicFlowScanner();
      const permissionScanner = new PermissionScanner();

      // Core vulnerability scans based on documented research
      const scanResults = await Promise.all([
        credentialScanner.scan(tempDir.name),
        toolPoisoningScanner.scan(tempDir.name),
        parameterInjectionScanner.scan(tempDir.name),
        promptInjectionScanner.scan(tempDir.name),
        toolMutationScanner.scan(tempDir.name),
        conversationExfiltrationScanner.scan(tempDir.name),
        ansiInjectionScanner.scan(tempDir.name),
        protocolViolationScanner.scan(tempDir.name),
        inputValidationScanner.scan(tempDir.name),
        serverSpoofingScanner.scan(tempDir.name),
        toxicFlowScanner.scan(tempDir.name),
        permissionScanner.scan(tempDir.name),
      ]);

      // Flatten all vulnerabilities from all scanners
      this.vulnerabilities = scanResults.flat();

      return this.vulnerabilities;
    } finally {
      tempDir.removeCallback();
    }
  }

  /**
   * Scans a local project directory for MCP security vulnerabilities
   *
   * @param projectPath - The local project directory path to scan
   * @returns Promise resolving to array of discovered vulnerabilities
   *
   * @example
   * ```typescript
   * const scanner = new MCPScanner();
   * const vulns = await scanner.scanLocalProject('./my-mcp-server');
   * console.log(`Found ${vulns.length} vulnerabilities`);
   * ```
   */
  async scanLocalProject(projectPath: string): Promise<Vulnerability[]> {
    console.log(`🔍 Scanning local project: ${projectPath}`);
    console.log(
      "📊 Based on vulnerablemcp.info, HiddenLayer, Invariant Labs, and Trail of Bits research\n"
    );

    // Validate that the project path exists
    if (!fs.existsSync(projectPath)) {
      throw new Error(`Project path does not exist: ${projectPath}`);
    }

    const stat = fs.statSync(projectPath);
    if (!stat.isDirectory()) {
      throw new Error(`Project path is not a directory: ${projectPath}`);
    }

    // Initialize all scanners
    const credentialScanner = new CredentialScanner();
    const toolPoisoningScanner = new ToolPoisoningScanner();
    const parameterInjectionScanner = new ParameterInjectionScanner();
    const promptInjectionScanner = new PromptInjectionScanner();
    const toolMutationScanner = new ToolMutationScanner();
    const conversationExfiltrationScanner =
      new ConversationExfiltrationScanner();
    const ansiInjectionScanner = new AnsiInjectionScanner();
    const protocolViolationScanner = new ProtocolViolationScanner();
    const inputValidationScanner = new InputValidationScanner();
    const serverSpoofingScanner = new ServerSpoofingScanner();
    const toxicFlowScanner = new ToxicFlowScanner();
    const permissionScanner = new PermissionScanner();

    // Core vulnerability scans based on documented research
    const scanResults = await Promise.all([
      credentialScanner.scan(projectPath),
      toolPoisoningScanner.scan(projectPath),
      parameterInjectionScanner.scan(projectPath),
      promptInjectionScanner.scan(projectPath),
      toolMutationScanner.scan(projectPath),
      conversationExfiltrationScanner.scan(projectPath),
      ansiInjectionScanner.scan(projectPath),
      protocolViolationScanner.scan(projectPath),
      inputValidationScanner.scan(projectPath),
      serverSpoofingScanner.scan(projectPath),
      toxicFlowScanner.scan(projectPath),
      permissionScanner.scan(projectPath),
    ]);

    // Flatten all vulnerabilities from all scanners
    this.vulnerabilities = scanResults.flat();

    return this.vulnerabilities;
  }

  /**
   * Clones a Git repository to a temporary directory
   *
   * @param url - The repository URL to clone
   * @param targetDir - The target directory for cloning
   * @throws {Error} When git clone fails
   * @private
   */
  private async cloneRepo(url: string, targetDir: string) {
    try {
      console.log("📥 Cloning repository...");
      const result = spawnSync("git", ["clone", "--depth", "1", url, targetDir], {
        stdio: "pipe",
        encoding: "utf-8",
      });

      if (result.error || result.status !== 0) {
        throw new Error(`Git clone failed: ${result.stderr || result.error?.message}`);
      }
    } catch (error) {
      throw new Error(`Failed to clone repository: ${error}`);
    }
  }

  /**
   * Recursively finds all files with specified extensions
   *
   * @param dir - Directory to search
   * @param extensions - Array of file extensions to include
   * @returns Array of file paths
   */
  static getAllFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];

    const traverse = (currentDir: string) => {
      try {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);

          if (
            stat.isDirectory() &&
            !item.startsWith(".") &&
            item !== "node_modules" &&
            item !== "dist" &&
            item !== "build" &&
            item !== "__pycache__"
          ) {
            traverse(fullPath);
          } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (
              extensions.includes(ext) ||
              extensions.some((e) => item.endsWith(e))
            ) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };

    traverse(dir);
    return files;
  }
}
