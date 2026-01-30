import { join, dirname } from 'path';
import { writeFileSync } from 'fs';
import { RuleFile, ToolConfig } from '../types.js';
import { ensureDir, linkFile } from '../utils/fs.js';
import { mergeRules, calculateMergedSize } from '../utils/merge.js';

export class Deployer {
  constructor(private projectDir: string) {}

  deploy(
    rules: RuleFile[],
    toolConfig: ToolConfig,
    mode: 'link' | 'copy'
  ): void {
    const effectiveMode = toolConfig.supportsLink ? mode : 'copy';

    if (toolConfig.supportsMultiFile) {
      this.deployMultiFile(rules, toolConfig.targetPath, effectiveMode, toolConfig.fileExtension);
    } else {
      // Check character limit before merging
      if (toolConfig.charLimit) {
        const size = calculateMergedSize(rules);
        if (size > toolConfig.charLimit) {
          throw new Error(
            `Merged rules exceed ${toolConfig.displayName} limit.\n` +
            `  Total: ${size} characters\n` +
            `  Limit: ${toolConfig.charLimit} characters\n` +
            `  Over: ${size - toolConfig.charLimit} characters\n\n` +
            `Please reduce rules content or remove some rules/languages.`
          );
        }
      }
      this.deploySingleFile(rules, toolConfig.targetPath);
    }
  }

  deployMultiFile(
    rules: RuleFile[],
    targetPath: string,
    mode: 'link' | 'copy',
    extension: string
  ): void {
    const targetDir = join(this.projectDir, targetPath);
    ensureDir(targetDir);

    for (const rule of rules) {
      const targetName = this.getTargetFileName(rule.name, extension);
      const targetFile = join(targetDir, targetName);

      if (mode === 'link') {
        linkFile(rule.path, targetFile);
        console.log(`  ✓ Linked ${targetName}`);
      } else {
        const content = this.transformContent(rule.content, extension);
        writeFileSync(targetFile, content);
        console.log(`  ✓ Copied ${targetName}`);
      }
    }
  }

  deploySingleFile(rules: RuleFile[], targetPath: string): void {
    const targetFile = join(this.projectDir, targetPath);
    ensureDir(dirname(targetFile));

    const merged = mergeRules(rules);
    writeFileSync(targetFile, merged);
    console.log(`  ✓ Created ${targetPath} (${rules.length} rules merged)`);
  }

  private getTargetFileName(sourceName: string, targetExtension: string): string {
    const baseName = sourceName.replace(/\.\w+$/, '');
    return `${baseName}${targetExtension}`;
  }

  private transformContent(content: string, extension: string): string {
    // Add MDC frontmatter for Cursor
    if (extension === '.mdc') {
      return `---\nalwaysApply: true\n---\n${content}`;
    }
    return content;
  }
}
