import { join } from 'path';
import { RuleFile } from '../types.js';
import { getFilesInDir, readFileContent, fileExists } from '../utils/fs.js';
import { LANGUAGES_DIR } from '../constants.js';

export class RulesService {
  constructor(private rulesDir: string) {}

  getAvailableRules(): RuleFile[] {
    const files = getFilesInDir(this.rulesDir, '.md');
    return files.map(f => ({
      name: f.name,
      path: f.path,
      content: readFileContent(f.path),
      priority: this.extractPriority(f.name),
    }));
  }

  getAvailableLanguages(): string[] {
    const langDir = join(this.rulesDir, LANGUAGES_DIR);
    const files = getFilesInDir(langDir, '.md');
    return files
      .filter(f => f.name.endsWith('-coding-style.md'))
      .map(f => this.extractLanguageName(f.name));
  }

  getLanguageRule(language: string): RuleFile | undefined {
    const langDir = join(this.rulesDir, LANGUAGES_DIR);
    const fileName = `${language}-coding-style.md`;
    const filePath = join(langDir, fileName);

    if (!fileExists(filePath)) {
      return undefined;
    }

    return {
      name: fileName,
      path: filePath,
      content: readFileContent(filePath),
      priority: 2.5, // Between 02-coding-principles and 03-architecture
    };
  }

  getRuleByName(name: string): RuleFile | undefined {
    const rules = this.getAvailableRules();
    return rules.find(r => r.name === name || r.name === `${name}.md`);
  }

  private extractPriority(filename: string): number {
    const match = filename.match(/^(\d+)-/);
    return match ? parseInt(match[1], 10) : 99;
  }

  private extractLanguageName(filename: string): string {
    return filename.replace(/-coding-style\.md$/, '');
  }
}
