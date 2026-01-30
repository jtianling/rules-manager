import { Command } from 'commander';

export const syncCommand = new Command('sync')
  .description('Sync copied rules with source')
  .action(async () => {
    console.log('Sync command - not yet implemented');
  });
