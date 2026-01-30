import { Command } from 'commander';
import { existsSync, readdirSync, copyFileSync } from 'fs';
import { join, basename } from 'path';
import { RULES_MANAGER_DIR, LANGUAGES_DIR } from '../constants.js';
import { TOOL_CONFIGS } from '../tools/configs.js';
import { isSymlink, fileExists } from '../utils/fs.js';
import { filesAreDifferent, showDiff } from '../utils/diff.js';
import { promptOverwrite } from '../utils/prompts.js';

interface SyncTarget {
  localPath: string;
  sourcePath: string;
  name: string;
}

export async function executeSync(): Promise<void> {
  if (!existsSync(RULES_MANAGER_DIR)) {
    console.error('Error: ~/.rules-manager/ does not exist.');
    console.error('Run "rulesmgr setup" first.');
    process.exit(1);
  }

  const projectDir = process.cwd();
  const targets: SyncTarget[] = [];

  console.log('Scanning project for copied rules...\n');

  // Scan each tool's directory
  for (const [toolName, config] of Object.entries(TOOL_CONFIGS)) {
    const toolPath = join(projectDir, config.targetPath);

    if (!existsSync(toolPath)) {
      continue;
    }

    // For single-file tools
    if (!config.supportsMultiFile) {
      if (!isSymlink(toolPath)) {
        console.log(`Found: ${config.targetPath} (merged file - manual sync required)`);
      }
      continue;
    }

    // For multi-file tools
    const entries = readdirSync(toolPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;

      const localPath = join(toolPath, entry.name);
      if (isSymlink(localPath)) continue; // Skip symlinks

      // Find source file
      const baseName = entry.name.replace(/\.mdc$/, '.md');
      let sourcePath = join(RULES_MANAGER_DIR, baseName);

      // Check languages directory
      if (!fileExists(sourcePath)) {
        sourcePath = join(RULES_MANAGER_DIR, LANGUAGES_DIR, baseName);
      }

      if (fileExists(sourcePath)) {
        targets.push({ localPath, sourcePath, name: entry.name });
      }
    }
  }

  if (targets.length === 0) {
    console.log('No copied rules found to sync.');
    return;
  }

  console.log(`Found ${targets.length} copied file(s)\n`);

  let updated = 0;
  let skipped = 0;

  for (const target of targets) {
    if (!filesAreDifferent(target.localPath, target.sourcePath)) {
      console.log(`  ✓ ${target.name} (already up to date)`);
      continue;
    }

    // Check if local file was modified
    const action = await promptOverwrite(target.name);

    if (action === 'diff') {
      showDiff(target.localPath, target.sourcePath);
      const secondAction = await promptOverwrite(target.name);
      if (secondAction === 'skip') {
        skipped++;
        console.log(`  ⊘ Skipped ${target.name}`);
        continue;
      }
    }

    if (action === 'skip') {
      skipped++;
      console.log(`  ⊘ Skipped ${target.name}`);
      continue;
    }

    // Overwrite
    copyFileSync(target.sourcePath, target.localPath);
    updated++;
    console.log(`  ✓ Updated ${target.name}`);
  }

  console.log(`\nSync complete: ${updated} updated, ${skipped} skipped`);
}

export const syncCommand = new Command('sync')
  .description('Sync copied rules with source')
  .action(async () => {
    await executeSync();
  });
