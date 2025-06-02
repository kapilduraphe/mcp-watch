import { Vulnerability } from "../types/Vulnerability";

/**
 * Formats and displays the vulnerability scan results
 *
 * @param vulnerabilities - Array of vulnerabilities to display
 */
export function formatReport(vulnerabilities: Vulnerability[]): void {
  console.log("\n📊 MCP SECURITY SCAN RESULTS");
  console.log("===============================");
  console.log(
    "🔬 Based on research from VulnerableMCP, HiddenLayer, Invariant Labs, Trail of Bits, and PromptHub\n"
  );

  if (vulnerabilities.length === 0) {
    console.log("✅ No vulnerabilities detected!");
    return;
  }

  const severityCounts = vulnerabilities.reduce((acc, vuln) => {
    acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryCounts = vulnerabilities.reduce((acc, vuln) => {
    acc[vuln.category] = (acc[vuln.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("📈 Summary by Severity:");
  Object.entries(severityCounts).forEach(([severity, count]) => {
    const emoji =
      severity === "critical"
        ? "🚨"
        : severity === "high"
        ? "⚠️"
        : severity === "medium"
        ? "⚡"
        : "💡";
    console.log(`  ${emoji} ${severity.toUpperCase()}: ${count}`);
  });

  console.log("\n📊 Summary by Category:");
  Object.entries(categoryCounts).forEach(([category, count]) => {
    const emoji = getCategoryEmoji(category);
    console.log(`  ${emoji} ${category}: ${count}`);
  });

  console.log("\n🔍 Detailed Results:");
  console.log("--------------------");

  // Sort by severity (critical first)
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedVulns = vulnerabilities.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  sortedVulns.forEach((vuln, index) => {
    const severityEmoji =
      vuln.severity === "critical"
        ? "🚨"
        : vuln.severity === "high"
        ? "⚠️"
        : vuln.severity === "medium"
        ? "⚡"
        : "💡";

    console.log(`\n${index + 1}. ${severityEmoji} ${vuln.message}`);
    console.log(`   📋 ID: ${vuln.id}`);
    console.log(`   🎯 Severity: ${vuln.severity.toUpperCase()}`);
    console.log(`   📂 Category: ${vuln.category}`);

    if (vuln.source) {
      console.log(`   📚 Source: ${vuln.source}`);
    }

    if (vuln.file) {
      console.log(
        `   📍 Location: ${vuln.file}${vuln.line ? `:${vuln.line}` : ""}`
      );
    }

    if (vuln.evidence) {
      console.log(`   🔍 Evidence: ${vuln.evidence}`);
    }
  });

  console.log("\n🛡️ REMEDIATION GUIDANCE");
  console.log("=======================");

  const categories = [...new Set(vulnerabilities.map((v) => v.category))];
  categories.forEach((category) => {
    console.log(
      `\n${getCategoryEmoji(category)} ${category
        .toUpperCase()
        .replace("-", " ")}:`
    );
    console.log(getRemediationAdvice(category));
  });

  // Add statistics from research
  console.log("\n📊 RESEARCH STATISTICS");
  console.log("======================");
  console.log("📈 Based on PromptHub analysis of public MCP servers:");
  console.log("   • 43% allow command injection attacks");
  console.log("   • 30% vulnerable to SSRF (fetch any URL)");
  console.log("   • 22% leak files outside intended directories");
  console.log("\n🔬 Novel attack vectors documented by security researchers:");
  console.log("   • Parameter injection (HiddenLayer) - extracts AI context");
  console.log(
    "   • Toxic agent flows (Invariant Labs) - cross-repository attacks"
  );
  console.log(
    "   • Tool poisoning (Invariant Labs) - hidden malicious instructions"
  );
  console.log(
    "   • Conversation exfiltration (Trail of Bits) - steals chat history"
  );
  console.log("   • ANSI injection (Trail of Bits) - hides malicious content");
}

/**
 * Gets the appropriate emoji for a vulnerability category
 *
 * @param category - The vulnerability category
 * @returns Emoji representing the category
 */
export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    "credential-leak": "🔑",
    "tool-poisoning": "🧪",
    "data-exfiltration": "📤",
    "prompt-injection": "💉",
    "tool-mutation": "🔄",
    "steganographic-attack": "🎭",
    "protocol-violation": "📋",
    "input-validation": "🛡️",
    "server-spoofing": "🎭",
    "toxic-flow": "🌊",
    "access-control": "🔐",
    documentation: "📖",
  };
  return emojis[category] || "⚠️";
}

/**
 * Provides remediation advice for a specific vulnerability category
 *
 * @param category - The vulnerability category
 * @returns Detailed remediation guidance
 */
export function getRemediationAdvice(category: string): string {
  const advice: Record<string, string> = {
    "credential-leak":
      "  • Use encrypted storage for all API tokens and secrets\n" +
      "  • Implement proper credential rotation policies\n" +
      "  • Never commit secrets to version control\n" +
      "  • Use environment variables with proper access controls\n" +
      "  • Set restrictive file permissions (600) for credential files\n" +
      "  • Consider using secret management services (HashiCorp Vault, AWS Secrets Manager)",

    "tool-poisoning":
      "  • Implement static analysis of all tool descriptions\n" +
      "  • Manually review every tool before deployment\n" +
      "  • Use allowlists for acceptable tool description patterns\n" +
      "  • Implement tool integrity checks and versioning\n" +
      "  • Monitor for deceptive naming patterns\n" +
      "  • Pin tool versions and verify signed hashes",

    "data-exfiltration":
      "  • Validate ALL function parameters are actually used\n" +
      "  • Implement parameter allowlists - reject unknown parameters\n" +
      "  • Monitor for suspicious parameter usage patterns\n" +
      "  • Add circuit breakers for unusual data access\n" +
      "  • Implement semantic analysis of tool outputs\n" +
      "  • Log and alert on potential exfiltration attempts",

    "prompt-injection":
      "  • Sanitize all tool descriptions and external content\n" +
      "  • Filter out instruction-like patterns in external data\n" +
      "  • Implement content security policies for tool descriptions\n" +
      "  • Use allowlists for acceptable prompt patterns\n" +
      "  • Cap token limits for retrieved content\n" +
      "  • Pattern-scan results before feeding to LLM",

    "tool-mutation":
      "  • Lock tool definitions after initial approval\n" +
      "  • Implement comprehensive tool versioning\n" +
      "  • Use unique tool names to avoid collisions\n" +
      "  • Add integrity checks for tool definitions\n" +
      "  • Monitor for dynamic tool modifications\n" +
      "  • Implement change detection and user alerts",

    "steganographic-attack":
      "  • Filter all ANSI escape sequences from tool content\n" +
      "  • Validate content doesn't contain excessive whitespace\n" +
      "  • Implement visual inspection of tool descriptions\n" +
      "  • Use plaintext-only tool description policies\n" +
      "  • Monitor for hidden content patterns\n" +
      "  • Implement content normalization before display",

    "protocol-violation":
      "  • Never include session IDs in URL paths\n" +
      "  • Always use HTTPS for transport security\n" +
      "  • Follow MCP protocol specifications strictly\n" +
      "  • Implement proper error handling\n" +
      "  • Use secure headers and transport security\n" +
      "  • Regular protocol compliance audits",

    "input-validation":
      "  • Validate and sanitize ALL user inputs\n" +
      "  • Use parameterized queries and safe parsing\n" +
      "  • Implement strict path validation (prevent ../)\n" +
      "  • Use allowlists instead of blocklists\n" +
      "  • Never execute user-controlled commands directly\n" +
      "  • Implement URL validation to prevent SSRF",

    "server-spoofing":
      "  • Only use servers from trusted sources\n" +
      "  • Implement server identity verification\n" +
      "  • Monitor for suspicious server names\n" +
      "  • Use certificate pinning for server authentication\n" +
      "  • Isolate high-risk servers in separate environments\n" +
      "  • Log all cross-server interactions",

    "toxic-flow":
      "  • Sanitize all external data before processing\n" +
      "  • Implement granular boundary controls\n" +
      "  • Require explicit approval for cross-boundary operations\n" +
      "  • Monitor unusual access patterns\n" +
      "  • Use allowlists for authorized resource combinations\n" +
      "  • Implement semantic analysis of external content",

    "access-control":
      "  • Apply principle of least privilege\n" +
      "  • Implement role-based access control\n" +
      "  • Avoid consent fatigue through smart batching\n" +
      "  • Regular permission audits and cleanup\n" +
      "  • Use scoped API tokens when possible\n" +
      "  • Document security assumptions clearly",
  };

  return (
    advice[category] || "  • Review security best practices for this category"
  );
}
