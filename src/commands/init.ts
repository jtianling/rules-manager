import { Command } from 'commander';
import { existsSync, copyFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { RULES_MANAGER_DIR, SUPPORTED_TOOLS } from '../constants.js';
import { InitOptions, ToolConfig, ToolName } from '../types.js';
import { RulesService } from '../services/rules.js';
import { Deployer } from '../services/deployer.js';
import { DeploymentScanner } from '../services/scanner.js';
import { TOOL_CONFIGS } from '../tools/configs.js';
import { promptTools, promptLanguages } from '../utils/prompts.js';
import { sortByPriority } from '../utils/merge.js';
import { ensureDir } from '../utils/fs.js';

export async function executeInit(options: InitOptions): Promise<void> {
  // Check if rules manager is set up
  if (!existsSync(RULES_MANAGER_DIR)) {
    console.error('Error: ~/.rules-manager/ does not exist.');
    console.error('Run "rulesmgr setup" first.');
    process.exit(1);
  }

  // If only --gitignore is specified, just deploy gitignore
  const gitignoreOnly = options.gitignore && !options.tools;

  if (!gitignoreOnly) {
    const rulesService = new RulesService(RULES_MANAGER_DIR);
    const deployer = new Deployer(process.cwd());
    const scanner = new DeploymentScanner(process.cwd(), RULES_MANAGER_DIR);

    // Get configured tools for marking in prompt
    const configuredTools = scanner.getConfiguredTools();
    const isInteractive = !options.tools;

    // Get tools (from args or prompt)
    let tools: string[];
    if (options.tools) {
      tools = options.tools.split(',').map(t => t.trim());
    } else {
      tools = await promptTools([...SUPPORTED_TOOLS], configuredTools);
    }

    // Validate tools
    for (const tool of tools) {
      if (!TOOL_CONFIGS[tool as keyof typeof TOOL_CONFIGS]) {
        console.error(`Error: Unknown tool "${tool}"`);
        process.exit(1);
      }
    }

    // Handle deselected tools (remove their rules) - only in interactive mode
    // Only for multi-file tools; single-file tools (AGENTS.md etc.) are never auto-removed
    if (isInteractive) {
      const deselectedTools = configuredTools.filter(t => !tools.includes(t));
      for (const tool of deselectedTools) {
        const config = TOOL_CONFIGS[tool];

        if (!config.supportsMultiFile) {
          // Single-file tools: never auto-remove, just warn
          console.log(`\n${config.displayName}:`);
          console.log(`  ⚠ ${config.targetPath} exists (please remove manually if needed)`);
          continue;
        }

        const deployedRules = scanner.getDeployedRules(tool);
        const managedRules = deployedRules.filter(r => r.source === 'managed');

        if (managedRules.length > 0) {
          console.log(`\n${config.displayName}:`);
          for (const rule of managedRules) {
            deployer.removeRule(rule.name, config);
            console.log(`  ✗ ${rule.name} (removed)`);
          }
          const unmanagedRules = deployedRules.filter(r => r.source === 'unknown');
          for (const rule of unmanagedRules) {
            console.log(`  ~ ${rule.name} (unmanaged)`);
          }
        }
      }
    }

    // Detect deployed languages from selected tools for pre-selection
    const deployedLanguages = new Set<string>();
    if (isInteractive) {
      for (const tool of tools) {
        const deployedRules = scanner.getDeployedRules(tool as ToolName);
        for (const rule of deployedRules) {
          const match = rule.name.match(/^(.+)-coding-style\.\w+$/);
          if (match) {
            deployedLanguages.add(match[1]);
          }
        }
      }
    }

    // Get languages (from args or prompt)
    const availableLanguages = rulesService.getAvailableLanguages();
    let languages: string[];
    if (options.lang) {
      // Allow --lang=none to skip language selection
      if (options.lang.toLowerCase() === 'none') {
        languages = [];
      } else {
        languages = options.lang.split(',').map(l => l.trim());
        // Validate languages exist
        for (const lang of languages) {
          if (!availableLanguages.includes(lang)) {
            console.error(`Error: Language "${lang}" not found in ~/.rules-manager/languages/`);
            console.error(`Available languages: ${availableLanguages.join(', ')}`);
            process.exit(1);
          }
        }
      }
    } else {
      languages = await promptLanguages(
        availableLanguages,
        deployedLanguages.size > 0 ? Array.from(deployedLanguages) : undefined
      );
    }

    // Get deployment mode
    const mode = options.copy ? 'copy' : 'link';

    // Collect all rules
    const baseRules = rulesService.getAvailableRules();
    const languageRules = languages
      .map(lang => rulesService.getLanguageRule(lang))
      .filter((r): r is NonNullable<typeof r> => r !== undefined);

    const allRules = sortByPriority([...baseRules, ...languageRules]);

    console.log(`\nDeploying ${allRules.length} rules to ${tools.length} tool(s)...\n`);

    // Deploy to each tool
    for (const tool of tools) {
      const config = TOOL_CONFIGS[tool as keyof typeof TOOL_CONFIGS];
      console.log(`${config.displayName}:`);

      try {
        if (config.supportsMultiFile) {
          // Get deployed rules for this tool
          const deployedRules = scanner.getDeployedRules(tool as ToolName);
          const deployedNameSet = new Set(deployedRules.map(r => r.name));

          // Map selected rules to their target file names
          const selectedTargetNames = new Map<string, typeof allRules[0]>();
          for (const rule of allRules) {
            const targetName = Deployer.getTargetFileName(rule.name, config.fileExtension);
            selectedTargetNames.set(targetName, rule);
          }

          // Remove rules that are no longer selected (managed only)
          const toRemove = deployedRules.filter(
            r => !selectedTargetNames.has(r.name) && r.source === 'managed'
          );
          for (const rule of toRemove) {
            deployer.removeRule(rule.name, config);
            console.log(`  ✗ ${rule.name} (removed)`);
          }

          // Deploy new and keep existing
          for (const [targetName, rule] of selectedTargetNames) {
            if (deployedNameSet.has(targetName)) {
              console.log(`  · ${targetName} (unchanged)`);
            } else {
              deployer.deployOneRule(rule, config, mode);
              console.log(`  ✓ ${targetName} (${mode === 'link' ? 'linked' : 'copied'})`);
            }
          }

          // Show unmanaged files
          const unmanaged = deployedRules.filter(
            r => !selectedTargetNames.has(r.name) && r.source === 'unknown'
          );
          for (const rule of unmanaged) {
            console.log(`  ~ ${rule.name} (unmanaged)`);
          }
        } else {
          // Single-file tools: use existing deploy method
          deployer.deploy(allRules, config, mode);
        }

        // Deploy agent-specific settings (always copy, never link)
        deploySettings(config, process.cwd());
      } catch (error) {
        console.error(`\n✗ Error: ${(error as Error).message}`);
        process.exit(1);
      }
    }

    console.log('\n✓ Done! Rules deployed to current project.');
  }

  // Deploy gitignore if requested
  if (options.gitignore) {
    deployGitignore();
  }
}

function deploySettings(config: ToolConfig, projectDir: string): void {
  if (!config.settingsDir || !config.settingsTargetPath) return;

  const settingsSrcDir = join(RULES_MANAGER_DIR, config.settingsDir);
  if (!existsSync(settingsSrcDir)) return;

  const settingsTargetDir = join(projectDir, config.settingsTargetPath);
  ensureDir(settingsTargetDir);

  const entries = readdirSync(settingsSrcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    // Skip auto-generated files (e.g., CLAUDE.md from plugins)
    if (entry.name === 'CLAUDE.md') continue;

    const srcPath = join(settingsSrcDir, entry.name);
    const destPath = join(settingsTargetDir, entry.name);

    if (existsSync(destPath)) {
      console.log(`  ⊘ Skipped ${entry.name} (already exists)`);
    } else {
      copyFileSync(srcPath, destPath);
      console.log(`  ✓ Copied ${entry.name}`);
    }
  }
}

function deployGitignore(): void {
  const srcPath = join(RULES_MANAGER_DIR, 'gitignore');
  const destPath = join(process.cwd(), '.gitignore');

  if (!existsSync(srcPath)) {
    console.error('Error: ~/.rules-manager/gitignore does not exist.');
    console.error('Run "rulesmgr setup" to create it.');
    process.exit(1);
  }

  if (existsSync(destPath)) {
    console.log('⊘ Skipped .gitignore (already exists)');
    return;
  }

  copyFileSync(srcPath, destPath);
  console.log('✓ Created .gitignore');
}

export const initCommand = new Command('init')
  .description('Deploy rules to current project')
  .option('--tools <tools>', 'Comma-separated list of target tools')
  .option('--lang <languages>', 'Comma-separated list of languages')
  .option('--rules <rules>', 'Comma-separated list of rules (default: all)')
  .option('--copy', 'Use copy mode instead of symlink')
  .option('--gitignore', 'Deploy .gitignore from template')
  .action(async (options: InitOptions) => {
    await executeInit(options);
  });
