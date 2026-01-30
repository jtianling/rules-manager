import { Command } from 'commander';

export const initCommand = new Command('init')
  .description('Deploy rules to current project')
  .option('--tools <tools>', 'Comma-separated list of target tools')
  .option('--lang <languages>', 'Comma-separated list of languages')
  .option('--rules <rules>', 'Comma-separated list of rules (default: all)')
  .option('--copy', 'Use copy mode instead of symlink')
  .action(async (options) => {
    console.log('Init command - not yet implemented', options);
  });
