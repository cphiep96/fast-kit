#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { setupCommand } from './commands/setup.js';
import { validateCommand } from './commands/validate.js';
import { listCommand } from './commands/list.js';
import { updateCommand } from './commands/update.js';

const program = new Command();

program
  .name('fast-kit')
  .description('Fast-Kit CLI - AI-powered development acceleration toolkit')
  .version('0.1.0');

// Setup command
program
  .command('setup')
  .description('Install and configure Fast-Kit MCP servers')
  .option('--skip-config', 'Skip Claude Code configuration')
  .option('--verbose', 'Show detailed output')
  .action(setupCommand);

// Validate command
program
  .command('validate')
  .description('Validate Fast-Kit installation')
  .option('--verbose', 'Show detailed output')
  .action(validateCommand);

// List command
program
  .command('list')
  .description('List installed Fast-Kit servers')
  .action(listCommand);

// Update command
program
  .command('update')
  .description('Update Fast-Kit MCP servers to latest version')
  .action(updateCommand);

// Parse arguments
program.parse();
