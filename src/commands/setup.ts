import { Command } from 'commander';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { RULES_MANAGER_DIR, LANGUAGES_DIR } from '../constants.js';
import { ensureDir } from '../utils/fs.js';
import { TOOL_CONFIGS } from '../tools/configs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
// In development: templates are at ../templates (relative to src/commands/)
// In production: templates are at ./templates (relative to dist/)
const TEMPLATES_DIR = existsSync(join(__dirname, 'templates'))
  ? join(__dirname, 'templates')
  : join(__dirname, '..', 'templates');

export async function executeSetup(targetDir: string = RULES_MANAGER_DIR): Promise<void> {
  console.log(`Setting up rules directory at ${targetDir}...`);

  ensureDir(targetDir);
  ensureDir(join(targetDir, LANGUAGES_DIR));

  // Copy root templates
  copyTemplates(TEMPLATES_DIR, targetDir);

  // Copy language templates
  const langTemplatesDir = join(TEMPLATES_DIR, LANGUAGES_DIR);
  const langTargetDir = join(targetDir, LANGUAGES_DIR);
  copyTemplates(langTemplatesDir, langTargetDir);

  // Copy gitignore template
  copyGitignoreTemplate(TEMPLATES_DIR, targetDir);

  // Copy agent-specific settings (e.g., ~/.rules-manager/claude/)
  copyAgentSettings(TEMPLATES_DIR, targetDir);

  console.log('\nSetup complete!');
  console.log(`\nEdit your rules in ${targetDir}`);
}

function copyGitignoreTemplate(srcDir: string, destDir: string): void {
  const srcPath = join(srcDir, 'gitignore');
  const destPath = join(destDir, 'gitignore');

  if (!existsSync(srcPath)) {
    return;
  }

  if (existsSync(destPath)) {
    console.log('  Skipped gitignore (already exists)');
  } else {
    const content = readFileSync(srcPath, 'utf-8');
    writeFileSync(destPath, content);
    console.log('  Created gitignore');
  }
}

function copyAgentSettings(templatesDir: string, targetDir: string): void {
  // Iterate through all tool configs and copy settings for tools that have settingsDir
  for (const config of Object.values(TOOL_CONFIGS)) {
    if (!config.settingsDir) continue;

    const srcDir = join(templatesDir, config.settingsDir);
    const destDir = join(targetDir, config.settingsDir);

    if (!existsSync(srcDir)) continue;

    ensureDir(destDir);

    const entries = readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;

      const srcPath = join(srcDir, entry.name);
      const destPath = join(destDir, entry.name);

      if (existsSync(destPath)) {
        console.log(`  Skipped ${config.settingsDir}/${entry.name} (already exists)`);
      } else {
        const content = readFileSync(srcPath, 'utf-8');
        writeFileSync(destPath, content);
        console.log(`  Created ${config.settingsDir}/${entry.name}`);
      }
    }
  }
}

function copyTemplates(srcDir: string, destDir: string): void {
  if (!existsSync(srcDir)) {
    return;
  }

  const entries = readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      const srcPath = join(srcDir, entry.name);
      const destPath = join(destDir, entry.name);

      if (existsSync(destPath)) {
        console.log(`  Skipped ${entry.name} (already exists)`);
      } else {
        const content = readFileSync(srcPath, 'utf-8');
        writeFileSync(destPath, content);
        console.log(`  Created ${entry.name}`);
      }
    }
  }
}

export const setupCommand = new Command('setup')
  .description('Initialize ~/.rules-manager/ with example rules')
  .action(async () => {
    await executeSetup();
  });
