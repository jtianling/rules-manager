import { Command } from 'commander';
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';
import { RULES_MANAGER_DIR, SUPPORTED_TOOLS } from '../constants.js';
import { InitOptions } from '../types.js';
import { RulesService } from '../services/rules.js';
import { Deployer } from '../services/deployer.js';
import { TOOL_CONFIGS } from '../tools/configs.js';
import { promptTools, promptLanguages } from '../utils/prompts.js';
import { sortByPriority } from '../utils/merge.js';

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

    // Get tools (from args or prompt)
    let tools: string[];
    if (options.tools) {
      tools = options.tools.split(',').map(t => t.trim());
    } else {
      tools = await promptTools([...SUPPORTED_TOOLS]);
    }

    // Validate tools
    for (const tool of tools) {
      if (!TOOL_CONFIGS[tool as keyof typeof TOOL_CONFIGS]) {
        console.error(`Error: Unknown tool "${tool}"`);
        process.exit(1);
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
      languages = await promptLanguages(availableLanguages);
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
        deployer.deploy(allRules, config, mode);
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
