import inquirer from 'inquirer';
import { TOOL_CONFIGS } from '../tools/configs.js';
import { ToolName } from '../types.js';

function handlePromptError(error: unknown): never {
  if (error && typeof error === 'object' && 'name' in error) {
    if (error.name === 'ExitPromptError') {
      console.log('\nCancelled.');
      process.exit(0);
    }
  }
  throw error;
}

export async function promptTools(availableTools: string[], configuredTools?: string[]): Promise<string[]> {
  const choices = availableTools.map(tool => {
    const isConfigured = configuredTools?.includes(tool);
    return {
      name: isConfigured
        ? `${TOOL_CONFIGS[tool as ToolName]?.displayName || tool} [configured]`
        : TOOL_CONFIGS[tool as ToolName]?.displayName || tool,
      value: tool,
      checked: isConfigured,
    };
  });

  try {
    const { tools } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'tools',
        message: 'Select target tools:',
        choices,
        validate: (answer: string[]) => {
          if (answer.length === 0) {
            return 'You must select at least one tool.';
          }
          return true;
        },
      },
    ]);

    return tools;
  } catch (error) {
    handlePromptError(error);
  }
}

export async function promptLanguages(availableLanguages: string[], deployedLanguages?: string[]): Promise<string[]> {
  const choices = availableLanguages.map(lang => {
    const isDeployed = deployedLanguages?.includes(lang);
    return {
      name: isDeployed
        ? `${lang.charAt(0).toUpperCase() + lang.slice(1)} [deployed]`
        : lang.charAt(0).toUpperCase() + lang.slice(1),
      value: lang,
      checked: isDeployed,
    };
  });

  try {
    const { languages } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'languages',
        message: 'Select languages (optional, press Enter to skip):',
        choices,
      },
    ]);

    return languages;
  } catch (error) {
    handlePromptError(error);
  }
}

export async function promptDeployMode(): Promise<'link' | 'copy'> {
  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Deployment mode:',
      choices: [
        { name: 'Link (recommended)', value: 'link' },
        { name: 'Copy', value: 'copy' },
      ],
      default: 'link',
    },
  ]);

  return mode;
}

export async function promptOverwrite(filename: string): Promise<'overwrite' | 'skip' | 'diff'> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `${filename} has local modifications. How to handle?`,
      choices: [
        { name: 'Overwrite', value: 'overwrite' },
        { name: 'Skip', value: 'skip' },
        { name: 'Show diff', value: 'diff' },
      ],
    },
  ]);

  return action;
}
