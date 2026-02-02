import inquirer from 'inquirer';
import { TOOL_CONFIGS } from '../tools/configs.js';
import { ToolName } from '../types.js';

export async function promptTools(availableTools: string[]): Promise<string[]> {
  const choices = availableTools.map(tool => ({
    name: TOOL_CONFIGS[tool as ToolName]?.displayName || tool,
    value: tool,
  }));

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
}

export async function promptLanguages(availableLanguages: string[]): Promise<string[]> {
  const choices = availableLanguages.map(lang => ({
    name: lang.charAt(0).toUpperCase() + lang.slice(1),
    value: lang,
  }));

  const { languages } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'languages',
      message: 'Select languages (optional, press Enter to skip):',
      choices,
    },
  ]);

  return languages;
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
