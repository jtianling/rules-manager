import { Command } from 'commander';
import { setupCommand } from './commands/setup.js';
import { initCommand } from './commands/init.js';
import { syncCommand } from './commands/sync.js';

const program = new Command();

program
  .name('rulesmgr')
  .description('Unified rules manager for AI coding tools')
  .version('0.1.0');

program.addCommand(setupCommand);
program.addCommand(initCommand);
program.addCommand(syncCommand);

program.parse();
