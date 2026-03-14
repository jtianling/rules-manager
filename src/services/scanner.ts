import { join } from 'path';
import { readdirSync } from 'fs';
import { ToolName, SUPPORTED_TOOLS } from '../constants.js';
import { ToolConfig } from '../types.js';
import { TOOL_CONFIGS } from '../tools/configs.js';
import { fileExists, isSymlink } from '../utils/fs.js';

export interface ScannedRule {
  name: string;
  targetPath: string;
  isSymlink: boolean;
  toolName: ToolName;
  source: 'managed' | 'unknown';
}

export class DeploymentScanner {
  private knownRuleBaseNames: Set<string>;

  constructor(
    private projectDir: string,
    private rulesManagerDir: string
  ) {
    this.knownRuleBaseNames = this.loadKnownRuleBaseNames();
  }

  getConfiguredTools(): ToolName[] {
    const tools: ToolName[] = [];
    for (const toolName of SUPPORTED_TOOLS) {
      const deployed = this.getDeployedRules(toolName);
      if (deployed.length > 0) {
        tools.push(toolName);
      }
    }
    return tools;
  }

  getDeployedRules(toolName: ToolName): ScannedRule[] {
    const config = TOOL_CONFIGS[toolName];
    if (!config) return [];

    if (config.supportsMultiFile) {
      return this.scanMultiFileRules(toolName, config);
    } else {
      return this.scanSingleFileRule(toolName, config);
    }
  }

  private scanMultiFileRules(toolName: ToolName, config: ToolConfig): ScannedRule[] {
    const targetDir = join(this.projectDir, config.targetPath);
    if (!fileExists(targetDir)) return [];

    const rules: ScannedRule[] = [];
    try {
      const entries = readdirSync(targetDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile() && !entry.isSymbolicLink()) continue;
        if (!entry.name.endsWith(config.fileExtension)) continue;

        const fullPath = join(targetDir, entry.name);
        const baseName = entry.name.slice(0, entry.name.length - config.fileExtension.length);

        rules.push({
          name: entry.name,
          targetPath: fullPath,
          isSymlink: isSymlink(fullPath),
          toolName,
          source: this.knownRuleBaseNames.has(baseName) ? 'managed' : 'unknown',
        });
      }
    } catch {
      // Directory can't be read
    }

    return rules;
  }

  private scanSingleFileRule(toolName: ToolName, config: ToolConfig): ScannedRule[] {
    const targetFile = join(this.projectDir, config.targetPath);
    if (!fileExists(targetFile)) return [];

    return [{
      name: config.targetPath,
      targetPath: targetFile,
      isSymlink: false,
      toolName,
      source: 'managed',
    }];
  }

  private loadKnownRuleBaseNames(): Set<string> {
    const names = new Set<string>();

    // Load base rules
    try {
      const entries = readdirSync(this.rulesManagerDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          names.add(entry.name.replace(/\.md$/, ''));
        }
      }
    } catch {
      // Directory doesn't exist
    }

    // Load language rules
    const langDir = join(this.rulesManagerDir, 'languages');
    try {
      const entries = readdirSync(langDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          names.add(entry.name.replace(/\.md$/, ''));
        }
      }
    } catch {
      // Directory doesn't exist
    }

    return names;
  }
}
