import * as fs from "fs";
import * as path from "path";
import { AbstractScanner } from "../BaseScanner";
import { Vulnerability } from "../../types/Vulnerability";
import { MCPScanner } from "../McpScanner";

/**
 * Scans for parameter injection vulnerabilities
 * 
 * Based on HiddenLayer research documenting "magic parameters" that automatically
 * extract sensitive AI context data like conversation history and system prompts.
 * 
 * Detects:
 * - Magic parameter names (conversation_history, system_prompt, etc.)
 * - Unused sensitive parameters that could extract data
 * - Data exfiltration patterns in tool functions
 */
export class ParameterInjectionScanner extends AbstractScanner {
  async scan(projectPath: string): Promise<Vulnerability[]> {
    console.log("🎯 Scanning for parameter injection vulnerabilities...");

    const vulnerabilities: Vulnerability[] = [];
    const files = MCPScanner.getAllFiles(projectPath, [".ts", ".js", ".py"]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        // Magic parameter names (HiddenLayer documented)
        if (this.containsMagicParameters(line)) {
          vulnerabilities.push({
            id: "MAGIC_PARAMETER_INJECTION",
            severity: "critical",
            category: "data-exfiltration",
            message: "Magic parameter detected - extracts sensitive AI context",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "HiddenLayer research"
          });
        }

        // Unused sensitive parameters
        if (this.containsUnusedSensitiveParameters(line, content)) {
          vulnerabilities.push({
            id: "UNUSED_SENSITIVE_PARAMETER",
            severity: "high",
            category: "data-exfiltration",
            message: "Unused parameter with sensitive name",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "HiddenLayer research"
          });
        }

        // Data exfiltration patterns
        if (this.containsDataExfiltration(line)) {
          vulnerabilities.push({
            id: "DATA_EXFILTRATION",
            severity: "critical",
            category: "data-exfiltration",
            message: "Potential data exfiltration detected",
            file: path.relative(projectPath, file),
            line: index + 1,
            evidence: line.trim(),
            source: "HiddenLayer research"
          });
        }
      });
    }

    return vulnerabilities;
  }

  /**
   * Detects magic parameters that extract sensitive AI context
   * 
   * Based on HiddenLayer research documenting parameter names that automatically
   * provide conversation history, system prompts, and other sensitive data.
   * 
   * @param line - Source code line to analyze
   * @returns true if magic parameters are detected
   * @private
   */
  private containsMagicParameters(line: string): boolean {
    // HiddenLayer documented magic parameters
    const magicParams = [
      /\btools_?list\b/i,
      /\btool_?call_?history\b/i, 
      /\bconversation_?history\b/i,
      /\bchain_?of_?thought\b/i,
      /\bsystem_?prompt\b/i,
      /\bmodel_?name\b/i,
      /\bevery_single_previous_tool_call/i,
      /\ball_?tool_?calls\b/i,
      /\bfull_?context\b/i,
      /\bsession_?data\b/i,
      /\binternal_?state\b/i,
      /\bdebug_?info\b/i
    ];

    const hasFunctionDef = /def\s+\w+\s*\(|function\s+\w+\s*\(/i.test(line);
    return hasFunctionDef && magicParams.some(param => param.test(line));
  }

  /**
   * Detects unused sensitive parameters in function definitions
   * 
   * @param line - Source code line to analyze
   * @param fullContent - Full file content for context analysis
   * @returns true if unused sensitive parameters are detected
   * @private
   */
  private containsUnusedSensitiveParameters(line: string, fullContent: string): boolean {
    // Match function definitions in multiple languages
    const functionPatterns = [
      /def\s+(\w+)\s*\(([^)]*)\):/,  // Python: def func(params):
      /function\s+(\w+)\s*\(([^)]*)\)/,  // JS: function func(params)
      /(\w+)\s*\(([^)]*)\)\s*{/,  // JS/TS: func(params) {
      /(\w+)\s*=\s*\(([^)]*)\)\s*=>/,  // Arrow: func = (params) =>
    ];

    let functionMatch: RegExpMatchArray | null = null;
    let functionName = '';
    let parameters = '';

    // Try to match any function pattern
    for (const pattern of functionPatterns) {
      functionMatch = line.match(pattern);
      if (functionMatch) {
        functionName = functionMatch[1];
        parameters = functionMatch[2] || '';
        break;
      }
    }

    if (!functionMatch || !parameters.trim()) return false;

    // Sensitive parameter names from HiddenLayer research
    const sensitiveParams = [
      'conversation_history', 'tool_call_history', 'system_prompt',
      'chain_of_thought', 'model_name', 'tools_list', 'tools_list',
      'full_context', 'session_data', 'internal_state', 'debug_info'
    ];

    // Parse parameters more carefully
    const paramList = parameters.split(',').map(p => {
      // Extract parameter name (handle TypeScript types, default values)
      const paramMatch = p.trim().match(/^\s*(\w+)/);
      return paramMatch ? paramMatch[1] : '';
    }).filter(Boolean);

    // Check if any sensitive parameters are present
    const foundSensitiveParams = paramList.filter(param => 
      sensitiveParams.includes(param)
    );

    if (foundSensitiveParams.length === 0) return false;

    // Try to find the function body
    const functionBodyPatterns = [
      // Python function body
      new RegExp(`def\\s+${functionName}\\s*\\([^)]*\\):[\\s\\S]*?(?=\\ndef\\s+\\w+|\\nclass\\s+\\w+|$)`, 'i'),
      // JavaScript function body  
      new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?}`, 'i'),
      // JS/TS function body (various patterns)
      new RegExp(`${functionName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?}`, 'i'),
    ];

    let functionBody = '';
    for (const pattern of functionBodyPatterns) {
      const bodyMatch = fullContent.match(pattern);
      if (bodyMatch) {
        functionBody = bodyMatch[0];
        break;
      }
    }

    if (!functionBody) {
      // If we can't find the function body, assume it's suspicious
      // (parameter present but no detectable usage)
      return true;
    }

    // Check if sensitive parameters are actually used
    for (const param of foundSensitiveParams) {
      // Look for actual parameter usage (not just mentions in comments)
      const usagePatterns = [
        new RegExp(`\\b${param}\\b(?!\\s*[,:])`), // Parameter used, not in definition
        new RegExp(`\\$\\{${param}\\}`), // Template literal
        new RegExp(`${param}\\[`), // Array/object access
        new RegExp(`${param}\\.`), // Property access
      ];

      const isUsed = usagePatterns.some(pattern => {
        const matches = functionBody.match(new RegExp(pattern.source, 'g'));
        if (!matches) return false;
        
        // Filter out the parameter definition line itself
        return matches.some(match => {
          const matchContext = functionBody.substring(
            Math.max(0, functionBody.indexOf(match) - 50),
            functionBody.indexOf(match) + match.length + 50
          );
          // Don't count if it's in the function signature
          return !matchContext.includes('(') || !matchContext.includes(')');
        });
      });

      if (!isUsed) {
        return true; // Found an unused sensitive parameter
      }
    }

    return false;
  }

  private containsDataExfiltration(line: string): boolean {
    const exfiltrationPatterns = [
      /requests\.(post|put|patch)\s*\([^)]*(?:conversation|history|prompt|context|tool)/i,
      /fetch\s*\([^)]*(?:conversation|history|prompt|context|tool)/i,
      /axios\.(post|put|patch)\s*\([^)]*(?:conversation|history|prompt|context|tool)/i,
      /json\.dumps?\s*\([^)]*(?:conversation|history|prompt|context|tool)/i,
      /base64\.encode\s*\([^)]*(?:conversation|history|prompt)/i
    ];

    return exfiltrationPatterns.some(pattern => pattern.test(line));
  }
}