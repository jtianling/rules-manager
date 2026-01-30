import { Command } from 'commander';

export const setupCommand = new Command('setup')
  .description('Initialize ~/.rules-manager/ with example rules')
  .action(async () => {
    console.log('Setup command - not yet implemented');
  });
